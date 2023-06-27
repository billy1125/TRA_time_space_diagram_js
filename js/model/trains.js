let trains_map = null;          // 列車資料集
let master_train_info = [];     // 主表資料：列車基本資訊
let detail_time_info = [];      // 副表資料：列車時刻表
let selected_train = {};

// fetchData('tests/20230628.json');

function fetchData(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(jsonData)
            initial_trains(JSON.parse(this.responseText));
            initial_editor();
            // display_data();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// 資料初始化
function initial_trains(jsonData) {
    trains_map = new Map();
    for (const iterator of jsonData.TrainInfos) {
        trains_map.set(iterator.Train, { "Train": iterator.Train, "LineDir": iterator.LineDir, "Line": iterator.Line, "CarClass": iterator.CarClass, "TimeInfos": iterator.TimeInfos });
    }

    update_tables();
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
            initial_trains(JSON.parse(contents));
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

// 資料轉為主副表
function update_tables() {
    master_train_info.length = 0;
    detail_time_info.length = 0;

    for (const iterator of trains_map.values()) 
        master_train_info.push({ "Train": iterator.Train, "LineDir": iterator.LineDir, "Line": iterator.Line, "CarClass": iterator.CarClass });

    for (const iterator of trains_map.values()) 
        detail_time_info.push({ "Train": iterator.Train, "TimeTable": iterator.TimeInfos });
}

// 刪除資料
function delete_train_map(key) {
    return trains_map.delete(key);
}

// 新增車次
function add_train_map(train, line_dir, line, car_class) {
    // trains_map.forEach(function (value, key) {
    //     console.log(key + ' = ' + value.LineDir);
    // });
    // return trains_map.delete(key);
    if (!trains_map.has(train)) {
        trains_map.set(train, { "Train": train, "LineDir": line_dir, "Line": line, "CarClass": car_class });
        return true;
    } else 
        return false;
}

// 更新資料
function update_train_map(train, data) {
    trains_map.set(train, data);
    if (trains_map.has(train)) {
        trains_map.set(train, data);
        return true;
    } else 
        return false;
}
