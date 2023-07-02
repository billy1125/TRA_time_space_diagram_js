const url = new URL(location.href);
const line_kind = url.searchParams.get('lineKind');
let date = null;

// 定義基本檔案相依性
const dependencies = [
    'js/svg.js/svg.min.js',
    'js/configure/config.js',
    'js/configure/env_var.js',
    'js/utilties/util.js',
    'js/time_space.js',
    'js/diagram.js'
];

// 開始載入基本檔案
loadDependencies();

// 異步載入函式
async function loadDependencies() {
    // 迭代相依性並載入它們
    for (const dependency of dependencies) {
        await loadScript(dependency);
    }
    // 所有基本檔案載入完成後，執行其他函式    
    initial_data();
}

// 載入 JavaScript 檔案的函式
function loadScript(file) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = file;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

 // 讀取所有資料檔
function initial_data() {   
    date = getFormattedDate();
    Promise.all([
        readJSONFile(file1),
        readJSONFile(file2),
        readJSONFile(file3),
        readJSONFile(file4),
        readJSONFile(file5),
        readJSONFile("data/realtime_diagram/" + date + ".json"),
        readJSONFile("data/realtime_trains.json")
    ])
        .then(function (results) {
            Route = results[0];
            SVG_X_Axis = results[1];
            initial_line_data(results[2]);
            OperationLines = results[3];
            CarKind = results[4];
            // 在基本檔案載入完成後執行的函式
            execute(results[5], results[6]);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// 程式執行函式
function execute(json_data, live_json_data) {

    // 清除已有的運行圖    
    const svg = document.querySelectorAll("svg");
    svg.forEach(function (svg) {
        svg.remove();
    });

    const all_trains_data = json_to_trains_data(json_data, '', line_kind);  // 將JSON檔案轉換成時間空間資料
    const realtime_trains = mark_realtime_trains(live_json_data);
    draw(line_kind, all_trains_data, realtime_trains);
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

    return all_trains_data;
}

// 標記即時列車位置
function mark_realtime_trains(live_json_data){
    let realtime_trains = new Map();
    for (const iterator of live_json_data.TrainLiveBoards) {
        realtime_trains.set(iterator.TrainNo, iterator);
    }

    return realtime_trains;
}

// 繪製運行圖
function draw(line_kind, all_trains_data, realtime_trains) {
    draw_diagram_background(line_kind);                    // 繪製運行圖底圖(基礎時間與車站線)
    draw_train_path(all_trains_data, realtime_trains);     // 繪製每一個車次線

    // 移除讀取中的文字
    var popup = document.getElementById("popup");
    const parentObj = popup.parentNode;
    parentObj.removeChild(popup);

    // 依照現在的時間，將視窗滾動到整點時間，方便使用者閱讀
    let now = new Date();
    let hour_position = parseFloat(now.getHours()) - 4;
    if (hour_position > 0) {
        hour_position *= 1200;
        scrollToPosition(hour_position, 0);
    }
}

// 滾動到指定位置
function scrollToPosition(xPostion, yPosition) {
    window.scrollTo(xPostion, yPosition);
}
