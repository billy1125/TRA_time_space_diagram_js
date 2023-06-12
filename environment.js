fetchData1('JSON/Route.json')

function fetchData1(url) {
    // 创建一个XMLHttpRequest对象
    var xmlhttp = new XMLHttpRequest();

    // 设置回调函数，当读取完成时执行
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // 将响应的JSON数据解析为JavaScript对象
            var jsonData = JSON.parse(this.responseText);
            // 调用处理JSON数据的回调函数
            processJSON1(jsonData);
        }
    };

    // 打开JSON文件
    xmlhttp.open("GET", url, true);

    // 发送请求
    xmlhttp.send();
}

let Route = null

// 处理JSON数据的回调函数
function processJSON1(jsonData) {
    // 在控制台打印JSON数据
    // console.log(jsonData['TrainInfos']);
    Route = jsonData  // console.log(trains[i]);
    
    // 在这里可以进行其他操作，根据需要处理JSON数据
}
