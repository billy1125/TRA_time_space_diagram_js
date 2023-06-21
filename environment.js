let Route = null;
let SVG_X_Axis = null;

function readJSONFile(file, callback) {
    fetch(file)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

readJSONFile("JSON/Route.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        Route = data;
        // 在這裡處理你的 JSON 資料
    }
});


readJSONFile("JSON/SVG_X_Axis.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        SVG_X_Axis = data;
        // 在這裡處理你的 JSON 資料
    }
});
