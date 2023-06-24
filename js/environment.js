let Route = null;
let SVG_X_Axis = null;
let LinesStations = {};
let LinesStationsForBackground = {};
let OperationLines = {};
let CarKind = {};
let DiagramHours = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3, 4, 5, 6];


function readJSONFile(file, callback) {
    fetch(file)
        .then(response => {
            // console.log(response);
            return response.json();
        })
        .then(data => callback(null, data))
        .catch(error => callback(error, null));
}

readJSONFile("data/Route.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        Route = data;
        // 在這裡處理你的 JSON 資料
    }
});

readJSONFile("data/SVG_X_Axis.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        SVG_X_Axis = data;
    }
});

readJSONFile("data/SVG_Y_Axis.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {

        Object.entries(data).forEach(([key, value]) => {
            let stations_loc = {};
            let stations_loc_for_background = {};
            for (let i = 0; i < value.length; i++) {
                if (value[i]['ID'] != 'NA')
                    stations_loc[value[i]['ID']] = { 'DSC': value[i]['DSC'], 'SVGYAXIS': value[i]['SVGYAXIS'] };

                stations_loc_for_background[value[i]['ID']] = { 'DSC': value[i]['DSC'], 'SVGYAXIS': value[i]['SVGYAXIS'], 'TERMINAL': value[i]['TERMINAL'] };
            }
            LinesStations[key] = stations_loc;
            LinesStationsForBackground[key] = stations_loc_for_background;
        })
        // SVG_Y_Axis = data;
    }
});

readJSONFile("data/OperationLines.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        OperationLines = data;
    }
});

readJSONFile("data/CarKind.json", function (error, data) {
    if (error) {
        console.log("Error reading JSON file:", error);
    } else {
        CarKind = data;
    }
});
