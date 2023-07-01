function readJSONFile(file, callback) {
    fetch(file)
        .then(response => {
            // console.log(response);
            return response.json();
        })
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

let date = getFormattedDate(); 

readJSONFile("tests/" + date + ".json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        execute(data);
        // 在這裡處理你的 JSON 資料
    }
});

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear().toString().padStart(4, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return year + month + day;
}

// 使用者操作與上傳檔案
function execute(jsonData) {
    // btn_execute.disabled = true;

    // 清除已有的運行圖    
    const svg = document.querySelectorAll("svg");
    svg.forEach(function (svg) {
        svg.remove();
    });

    json_to_trains_data(jsonData, '', 'LINE_WN');  // 將JSON檔案轉換成時間空間資料
}

// JSON檔處理，將JSON檔案轉換成時間空間資料
function json_to_trains_data(json_data, train_no_input, line_kind) {
    let train = null;
    let all_trains_data = [];
    let train_no = "";

    for (let i = 0; i < json_data['TrainInfos'].length; i++) {
        train_no_input.length === 0 ? train_no = json_data['TrainInfos'][i]['Train'] : train_no = train_no_input;
        // console.log(train_no)
        if (json_data['TrainInfos'][i].Train == train_no) {
            train = json_data['TrainInfos'][i];
            train_data = calculate_space_time(train, line_kind);  // 車次資料處理，轉換成時間空間資料
            all_trains_data.push(train_data);
        }
    }

    readJSONFile("tests/trains.json", function (error, data) {
        if (error) {
            console.log("Error reading JSON file:", error);
        } else {
            console.log(data.TrainLiveBoards);
            let realtime_trains = new Map();
            for (const iterator of data.TrainLiveBoards) {
                realtime_trains.set(iterator.TrainNo, iterator);
            }

            draw(line_kind, all_trains_data, realtime_trains);
            // 在這裡處理你的 JSON 資料
        }
    });

}

// 繪製運行圖
function draw(line_kind, all_trains_data, realtime_trains) {
    draw_diagram_background(line_kind);                    // 繪製運行圖底圖(基礎時間與車站線)
    draw_train_path(all_trains_data, realtime_trains);     // 繪製每一個車次線

    // btn_execute.disabled = false;
    // btn_download.disabled = false;
}

