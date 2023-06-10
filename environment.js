// 创建一个XMLHttpRequest对象
var xmlhttp = new XMLHttpRequest();

// 设置回调函数，当读取完成时执行
xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        // 将文件内容以字符串形式保存
        var csvData = this.responseText;

        // 调用处理CSV数据的函数
        processData(csvData);
    }
};

// 打开CSV文件
xmlhttp.open("GET", 'CSV/CarKind.csv', true);

// 发送请求
xmlhttp.send();

// 处理CSV数据的函数
function processData(csvData) {
    // 将CSV数据按行分割为数组
    var lines = csvData.split("\n");

    // 遍历每一行数据
    for (var i = 0; i < lines.length; i++) {
        // 将每一行按逗号分割为数组
        var values = lines[i].split(",");

        // 在控制台打印每一行的数据
        console.log(values);
    }
}
