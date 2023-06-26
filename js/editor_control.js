// 檔案存檔
function file_save() {
    let json_object = { TrainInfos: [] };

    trains_map.forEach(function (value, key) {
        json_object.TrainInfos.push(value);
    });

    const json = JSON.stringify(json_object);
    download(json, 'export.json', 'text/plain');

    update_tables();
    display_data();
}

// 下載檔案的函式
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// 新增車次
function add_new_train() {
    const train_no = document.getElementById('train_no');

    if (train_no.value !== "") {
        const line_dir = document.getElementById('line_dir');
        const line = document.getElementById('line');
        const car_class = document.getElementById('car_class');
        const master_table = document.getElementById('master-table');
        if (add_train_map(train_no.value, line_dir.value, line.value, car_class.value)) {
            const row = document.createElement('tr');
            // row.innerHTML = item.Train;
            // row.addEventListener('click', function () {
            // showDetails(item.Train);
            // });
            master_table.appendChild(row);
            // 改列的顏色
            select_hightlight(train_no, row);

            // 刪除欄位
            add_button_td(row, "刪除", train_no.value);

            // 車次欄位
            add_textbox_td(row, train_no.value, "sel-input-" + train_no.value);

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
            update_tables()
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
    const detail_table = document.getElementById('detail-table');
    const stations = document.getElementById('stations');
    const row = document.createElement('tr');
    // row.innerHTML = item.Train;
    // row.addEventListener('click', function () {
    // showDetails(item.Train);
    // });
    detail_table.appendChild(row);



    add_text_td(row, "1");

    // 車站欄位
    add_td_selection(row, stations_kind, "sel-station-" + "1");
    // 到站時間
    add_textbox_td(row, "", "1");
    // 離站時間
    add_textbox_td(row, "", "1");

    select_update("sel-station-1", stations.value);

}