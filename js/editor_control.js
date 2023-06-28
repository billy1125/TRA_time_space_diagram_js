// 建立新時刻表
function open_new_timetable() {
    const results = window.confirm('您確定要清除所有資料嗎？');
    if (results == true) {
        file_input.value = '';
        trains_data.clear_all_data();
        mainTableContainer.innerHTML = '';
        detailTableContainer.innerHTML = '';
        pagination.innerHTML = '';
    }
}

// 新增車次
function add_new_train() {
    const train_no = document.getElementById('train_no');

    if (train_no.value !== "") {
        const line_dir = document.getElementById('line_dir');
        const line = document.getElementById('line');
        const car_class = document.getElementById('car_class');

        trains_data.selected_train = { "Train": train_no.value, "LineDir": line_dir.value, "Line": line.value, "CarClass": car_class.value };
        const train_id = train_no.value;
        if (trains_data.add_train_map(train_no.value, trains_data.selected_train)) {
            const row = document.createElement('tr');
            row.setAttribute('id', train_no.value);
            row.addEventListener('click', function () {
                select_hightlight(train_id, row);
                // trains_data.selected_train = { "Train": item.Train, "LineDir": item.LineDir, "Line": item.Line, "CarClass": item.CarClass };
                display_detail(train_id);
            });
            mainTableContainer.appendChild(row);
            // 改列的顏色
            select_hightlight(train_no, row);

            // 刪除欄位
            add_button_td(row, "刪除", train_no.value);

            // 車次欄位
            add_textbox_td(row, train_no.value, "input-train-" + train_no.value);

            // 順逆行欄位
            add_td_selection(row, line_dir_kind, "sel-dir-" + train_no.value);

            // 經由路線
            add_td_selection(row, line_kind, "sel-line-" + train_no.value);

            // 車種欄位
            add_td_selection(row, car_kind, "sel-car-" + train_no.value);

            select_update("sel-line-" + train_no.value, line.value);
            select_update("sel-dir-" + train_no.value, line_dir.value);
            select_update("sel-car-" + train_no.value, car_class.value);

            // 清空副表
            detailTableContainer.innerHTML = '';
            trains_data.update_tables();
        }
        else {
            window.alert("目前資料中已經有這個車次號！")
        }
    }
    else {
        window.alert("請輸入一個新的車次號！")
    }
}

// 新增車站
function add_new_station() {

    const stations = document.getElementById('stations');
    const rows = detailTableContainer.getElementsByTagName("tr");
    const new_row_index = rows.length + 1;

    const row = document.createElement('tr');
    detailTableContainer.appendChild(row);

    // row.innerHTML = item.Train;
    // row.addEventListener('click', function () {
    // showDetails(item.Train);
    // });

    add_text_td(row, new_row_index);

    // 車站欄位
    add_td_selection(row, stations_kind, "sel-station-" + new_row_index);
    // 到站時間
    add_textbox_td(row, "12:00:00", "input-arrtime-" + new_row_index);
    // 離站時間
    add_textbox_td(row, "12:00:00", "input-deptime-" + new_row_index);

    select_update("sel-station-" + new_row_index, stations.value);

}

// 暫存時刻表
function stations_temp_save() {
    let time_infos = [];

    const rows = detailTableContainer.getElementsByTagName("tr");

    for (var i = 1; i < rows.length + 1; i++) {
        time_infos.push({
            "Station": document.getElementById("sel-station-" + i).value,
            "Order": i.toString(),
            "DEPTime": document.getElementById("input-deptime-" + i).value,
            "ARRTime": document.getElementById("input-arrtime-" + i).value
        })
    }
    trains_data.selected_train.TimeInfos = time_infos;
    if (trains_data.update_train_map(trains_data.selected_train.Train, trains_data.selected_train))
        window.alert("暫存成功！");
    trains_data.update_tables();
}

// 使用者操作與上傳檔案
function file_upload() {
    // 擷取使用者選擇的檔案、車次號與路線
    const file_input = document.getElementById("file_input");
    const file = file_input.files[0];

    if (typeof file !== "undefined") {

        const reader = new FileReader();
        reader.onload = function (event) {
            const contents = event.target.result;
            trains_data.initial_trains(JSON.parse(contents));
            display_master();
        };
        reader.readAsText(file);
    } else {
        window.alert("請選擇正確的JSON格式檔案！");
    }
}

// 檔案存檔
function file_save() {
    let json_object = { TrainInfos: [] };

    trains_map.forEach(function (value, key) {
        json_object.TrainInfos.push(value);
    });

    const json = JSON.stringify(json_object);
    download(json, 'export.json', 'text/plain');

    trains_data.update_tables();
}

// 下載檔案的函式
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// 上一頁
function move_last_page() {
    if (currentPage > 1) {
        currentPage--;
        display_master();
    }
}

// 下一頁
function move_next_page() {
    var totalPages = Math.ceil(trains_data.master_train_info.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        display_master();
    }
}