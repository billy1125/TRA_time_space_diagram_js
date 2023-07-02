const btn_download = document.getElementById("btn_download");
btn_download.addEventListener("click", download_file);

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
    Promise.all([
        readJSONFile(file1),
        readJSONFile(file2),
        readJSONFile(file3),
        readJSONFile(file4),
        readJSONFile(file5)
    ])
        .then(function (results) {
            Route = results[0];
            SVG_X_Axis = results[1];
            initial_line_data(results[2]);
            OperationLines = results[3];
            CarKind = results[4];
            // 在基本檔案載入完成後執行的函式
            execute();
        })
        .catch(function (error) {
            console.error(error);
        });
}

// 轉圖函式
function execute() {
    console.log("開始轉換")

     // 清除已有的運行圖    
     const svg = document.querySelectorAll("svg");
     svg.forEach(function (svg) {
         svg.remove();
     });

    let data = localStorage.getItem('diagram_data');

    if (typeof (data) != "undefined") {
        console.log("有接到傳來的localStorage")
        data = JSON.parse(data);
        json_to_trains_data(data, '', "LINE_WN");
    }   
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
    draw(line_kind, all_trains_data);
}

// 繪製運行圖
function draw(line_kind, all_trains_data) {
    draw_diagram_background(line_kind);   // 繪製運行圖底圖(基礎時間與車站線)
    draw_train_path(all_trains_data);     // 繪製每一個車次線

    btn_download.disabled = false;
}
