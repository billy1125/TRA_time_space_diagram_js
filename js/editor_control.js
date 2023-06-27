// 新增車次
function add_new_train() {
    const train_no = document.getElementById('train_no');

    if (train_no.value !== "") {
        const line_dir = document.getElementById('line_dir');
        const line = document.getElementById('line');
        const car_class = document.getElementById('car_class');
        const master_table = document.getElementById('master-table');

        selected_train = selected_train = {"Train": train_no.value, "LineDir": line_dir.value, "Line": line.value, "CarClass": car_class.value};   

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
            update_tables();
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

    const rows = detail_table.getElementsByTagName("tr");
    const new_row_index = rows.length + 1;

    const row = document.createElement('tr');
    detail_table.appendChild(row);

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

function stations_temp_save() {
    let time_infos = [];
    const detail_table = document.getElementById('detail-table');
    const rows = detail_table.getElementsByTagName("tr");    

    for (var i = 1; i < rows.length + 1; i++) {
        time_infos.push({ "Station": document.getElementById("sel-station-" + i).value,
                          "Order": i.toString(),
                          "DEPTime": document.getElementById("input-deptime-" + i).value,
                          "ARRTime": document.getElementById("input-arrtime-" + i).value})
    }
    selected_train.TimeInfos = time_infos;   
    if (update_train_map(selected_train.Train, selected_train))
        window.alert("暫存成功！");
    update_tables();
}