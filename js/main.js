const btn_execute = document.getElementById("btn_execute");
const btn_download = document.getElementById("btn_download");

btn_download.addEventListener("click", download_file);

// 使用者操作與上傳檔案
function execute() {
    btn_execute.disabled = true;

    // 清除已有的運行圖    
    const svg = document.querySelectorAll("svg");
    svg.forEach(function (svg) {
        svg.remove();
    });

    // 擷取使用者選擇的檔案、車次號與路線
    const file_input = document.getElementById("file_input");
    const train_no = document.getElementById("train_no").value;
    const line_kind = document.getElementById("line_kind").value;
    const file = file_input.files[0];

    if (typeof file !== "undefined") {
        
        const reader = new FileReader();
        reader.onload = function (event) {
            const contents = event.target.result;
            json_to_trains_data(JSON.parse(contents), train_no, line_kind);  // 將JSON檔案轉換成時間空間資料
        };
        reader.readAsText(file);
    } else {
        btn_execute.disabled = false;
        window.alert("請選擇正確的JSON格式檔案！");
    }
}

// JSON檔處理，將JSON檔案轉換成時間空間資料
function json_to_trains_data(json_data, train_no_input, line_kind) {
    let train = null;
    let all_trains_data = [];
    let train_no = "";

    for (let i = 0; i < json_data['TrainInfos'].length - 1; i++) {
        train_no_input.length === 0 ? train_no = json_data['TrainInfos'][i]['Train'] : train_no = train_no_input;
        // console.log(train_no)
        if (json_data['TrainInfos'][i]['Train'] == train_no) {
            train = json_data['TrainInfos'][i];
            train_data = calculate_space_time(train, line_kind);  // 車次資料處理，轉換成時間空間資料
            all_trains_data.push(train_data);
        }
    }    
    draw(line_kind, all_trains_data); 
}

// 繪製運行圖
function draw(line_kind, all_trains_data){
    draw_diagram_background(line_kind);   // 繪製運行圖底圖(基礎時間與車站線)
    draw_train_path(all_trains_data);     // 繪製每一個車次線

    btn_execute.disabled = false;
    btn_download.disabled = false;
}

// 運行圖下載
function download_file() {
    var e = document.getElementById("line_kind");
    var line_kind = e.options[e.selectedIndex].text;

    const xmlDoc = document.implementation.createDocument(null, null, null);
    const xmlDeclaration = xmlDoc.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"');
    const stylesheet = xmlDoc.createProcessingInstruction("xml-stylesheet", 'type="text/css" href="style.css"');
    const svgElement = document.querySelectorAll("svg");
    xmlDoc.insertBefore(xmlDeclaration, xmlDoc.firstChild);
    xmlDoc.insertBefore(stylesheet, xmlDoc.firstChild.nextSibling);
    xmlDoc.appendChild(svgElement[0]);

    const xmlString = new XMLSerializer().serializeToString(xmlDoc);
    const blob = new Blob([xmlString], { type: 'image/svg+xml' });

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, `export_diagram_${line_kind}.svg`);
    } else {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `export_diagram_${line_kind}.svg`;
        downloadLink.click();
        URL.revokeObjectURL(downloadLink.href);
    }
}
