// function fetchData(url) {
//     return fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('網路請求錯誤');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // 在這裡將資料放入特定變數
//             const myData = data;
//             // console.log(myData);
//             return myData; // 可選，如果您想將資料傳遞到下一個Promise
//         })
//         .catch(error => {
//             console.error('發生錯誤：', error);
//         });
// }
fetchData('20230610.json')

function fetchData(url) {
    // 创建一个XMLHttpRequest对象
    var xmlhttp = new XMLHttpRequest();

    // 设置回调函数，当读取完成时执行
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // 将响应的JSON数据解析为JavaScript对象
            var jsonData = JSON.parse(this.responseText);

            // 调用处理JSON数据的回调函数
            processJSON(jsonData);
        }
    };

    // 打开JSON文件
    xmlhttp.open("GET", url, true);

    // 发送请求
    xmlhttp.send();
}

// 处理JSON数据的回调函数
function processJSON(jsonData) {
    // 在控制台打印JSON数据
    // console.log(jsonData['TrainInfos']);
    let trains = jsonData['TrainInfos'];
    var train = null;
    for (let i = 0; i < trains.length - 1; i++) {
        if (trains[i]['Train'] == '2') {
            train = trains[i];
            calculateSpaceTime(train);
            console.log(train);
        }
        // console.log(trains[i]);
        // console.log(trains[i]['Train']);
        // calculateSpaceTime(trains[i]);

    }
    // 在这里可以进行其他操作，根据需要处理JSON数据
}

function calculateSpaceTime(train) {
    let trains_data = [];                        // 台鐵各車次時刻表轉換整理後資料
    let after_midnight_data = [];                 // 跨午夜車次的資料

    let train_id = train['Train'];                // 車次代碼
    let car_class = train['CarClass'];            // 車種代碼
    let line = train['Line'];                     // 山線1、海線2、成追線3，東部幹線則為0
    let over_night_stn = train['OverNightStn'];   // 跨午夜車站
    let line_dir = train['LineDir'];              // 順行1、逆行2

    let timetable = train['TimeInfos'];
    let timetable_dict = {};
    // for (let i = 0; i < train.TimeInfos.length - 1; i++) {
    //     TimeInfos = train.TimeInfos[i];
    //     timetable[i] = [TimeInfos.Station, TimeInfos.ARRTime, TimeInfos.DEPTime, TimeInfos.Station, TimeInfos.Order];
    // }

    for (let TimeInfos of train.TimeInfos) {
        timetable_dict[TimeInfos.Station] = [TimeInfos.ARRTime, TimeInfos.DEPTime, TimeInfos.Station, TimeInfos.Order];
    }

    let passing_stations = findPassingStations(timetable, line, line_dir);

    df_time_space = EstimateTimeSpace(timetable_dict, passing_stations, over_night_stn);
}

function findPassingStations(timetable, line, line_dir) {
    let start_station = timetable[0]['Station'];
    let end_station = timetable[timetable.length - 1]['Station'];

    let _passing_stations = [];
    let station = start_station;
    let km = 0.0;

    let cheng_zhui = false;

    let roundabout_train = false;
    if (end_station == '1001') {
        end_station = start_station;
        roundabout_train = true;
    }

    let stations = [];
    for (let item of timetable) {
        stations.push(item['Station']);
    }

    if (line == "3") {
        cheng_zhui = true;
    } else if (stations.includes('2260') && stations.includes('3350')) {
        cheng_zhui = true;
    }

    let neiwan = false;
    if (stations.includes('1194') || stations.includes('1203')) {
        neiwan = true;
    }

    let pingxi = false;
    if (stations.includes('7332')) {
        pingxi = true;
    }

    let jiji = false;
    if (stations.includes('3432') || stations.includes('3431')) {
        jiji = true;
    }

    let shalun = false;
    if (stations.includes('4272')) {
        shalun = true;
    }

    while (true) {
        _passing_stations.push([String(station), Route[station].DSC, Route[station].KM, km]);

        if (line_dir == '2') {
            if (cheng_zhui == false) {
                let branch = Route[station].CCW_BRANCH;
                if (branch != '') {
                    if (station == '7360') {
                        if (end_station == '7362') {
                            km += parseFloat(Route[station].CCW_BRANCH_KM);
                            station = '7361';
                        } else if (end_station != '7362') {
                            km += parseFloat(Route[station].CCW_KM);
                            station = Route[station].CCW;
                        }
                    } else if (station == '3430') {
                        if (jiji == true) {
                            km += parseFloat(Route[station].CCW_BRANCH_KM);
                            station = '3431';
                        } else if (jiji == false) {
                            km += parseFloat(Route[station].CCW_KM);
                            station = Route[station].CCW;
                        }
                    } else if (station == '4270') {
                        if (shalun == true) {
                            km += parseFloat(Route[station].CCW_BRANCH_KM);
                            station = '4271';
                        } else if (shalun == false) {
                            km += parseFloat(Route[station].CCW_KM);
                            station = Route[station].CCW;
                        }
                    } else {
                        if (line == '1' || line == '0') {
                            km += parseFloat(Route[station].CCW_KM);
                            station = Route[station].CCW;
                        } else if (line == '2') {
                            km += parseFloat(Route[station].CCW_BRANCH_KM);
                            station = Route[station].CCW_BRANCH;
                        }
                    }
                } else {
                    km += parseFloat(Route[station].CCW_KM);
                    station = Route[station].CCW;
                }
            } else {
                km += parseFloat(Route[station].CHENG_ZHUI_CCW_KM);
                station = Route[station].CHENG_ZHUI_CCW;
            }
        } else if (line_dir == '1') {
            if (cheng_zhui == false) {
                let branch = Route[station].CW_BRANCH;
                if (branch != '') {
                    if (station == '0920') {
                        if (end_station != '0900') {
                            km += parseFloat(Route[station].CW_BRANCH_KM);
                            station = Route[station].CW_BRANCH;
                        } else if (end_station == '0900') {
                            km += parseFloat(Route[station].CW_KM);
                            station = Route[station].CW;
                        }
                    } else if (station == '7130') {
                        if (end_station == '7120') {
                            km += parseFloat(Route[station].CW_BRANCH_KM);
                            station = '7120';
                        } else if (end_station != '7120') {
                            km += parseFloat(Route[station].CW_KM);
                            station = '7110';
                        }
                    } else if (station == '1190' || station == '1193') {
                        if (neiwan == true) {
                            km += parseFloat(Route[station].CW_BRANCH_KM);
                            if (station == '1190') {
                                station = '1191';
                            } else if (station == '1193') {
                                if (end_station == '1208' || end_station == '1203') {
                                    station = '1201';
                                } else if (end_station == '1194') {
                                    station = '1194';
                                }
                            }
                        } else if (neiwan == false) {
                            km += parseFloat(Route[station].CW_KM);
                            station = '1180';
                        }
                    } else if (station == '7330') {
                        if (pingxi == true) {
                            km += parseFloat(Route[station].CW_BRANCH_KM);
                            station = '7331';
                        } else if (pingxi == false) {
                            km += parseFloat(Route[station].CW_KM);
                            station = '7320';
                        }
                    } else {
                        if (line == '1' || line == '0') {
                            km += parseFloat(Route[station].CW_KM);
                            station = Route[station].CW;
                        } else if (line == '2') {
                            km += parseFloat(Route[station].CW_BRANCH_KM);
                            station = Route[station].CW_BRANCH;
                        }
                    }
                } else {
                    km += parseFloat(Route[station].CW_KM);
                    station = Route[station].CW;
                }
            } else {
                km += parseFloat(Route[station].CHENG_ZHUI_CW_KM);
                station = Route[station].CHENG_ZHUI_CW;
            }
        }

        if (station == end_station) {
            if (roundabout_train == true) {
                _passing_stations.push(['1001', Route[station].DSC, Route[station].KM, km]);
                break;
            } else {
                _passing_stations.push([String(station), Route[station].DSC, Route[station].KM, km]);
                break;
            }
        }

        if (_passing_stations.length > 200) {
            break;
        }
    }

    return _passing_stations;

}

function EstimateTimeSpace(timetable, passing_stations, over_night_stn) {
    let _estimate_time_space = {};
    let index = 0;
    // let station = [];
    // let station_id = [];
    // let time = [];
    // let loc = [];
    // let stop_station_order = [];
    let timetable_stations = Object.keys(timetable);
    // for (let item of timetable) {
    //     timetable_stations.push(item['Station']);
    // }
    
   
   

    for (let [StationId, StationName, LocationKM, KM] of passing_stations) {
        if (timetable_stations.includes(StationId)) {
            let ARRTime = parseFloat(SVG_X_Axis[timetable[StationId][0]].ax1);
            let DEPTime = parseFloat(SVG_X_Axis[timetable[StationId][1]].ax1);
            let Order = parseInt(timetable[StationId][3]);

            _estimate_time_space[index] = [StationId, StationName, parseFloat(KM), ARRTime, Order];
            _estimate_time_space[index += 1] = [StationId, StationName, parseFloat(KM), DEPTime, Order];
            index += 1;
            // station_id.push(StationId);
            // station.push(StationName);
            // loc.push(parseFloat(KM));
            // time.push(ARRTime);
            // stop_station_order.push(Order);

            // station_id.push(StationId);
            // station.push(StationName);
            // loc.push(parseFloat(KM));
            // time.push(DEPTime);
            // stop_station_order.push(Order);
        } else {
            _estimate_time_space[index] = [StationId, StationName, parseFloat(KM), NaN, -1];
            index += 1;
            // station_id.push(StationId);
            // station.push(StationName);
            // loc.push(parseFloat(KM));
            // time.push(NaN);
            // stop_station_order.push(-1);
        }
    }
    let after_midnight_row_index = -1;
    let last_time_value = -1;
    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        if (value[0] == "1001"){
            value[0] = "1000";
        }
        if (!isNaN(value[3])){
            if (value[3] < last_time_value){
                after_midnight_row_index = key;
            }
            last_time_value = value[3];
        }        
    })

    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        if (key >= after_midnight_row_index){
            value[3] += 2880;
        }
    })

    let interpolate = []
    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        interpolate.push(value[3]);
    })

    const interpolatedArray = linearInterpolation(interpolate);
    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        value[3] = interpolatedArray[key];
    })

    // let _df_estimate_time_space = new dfd.DataFrame({
    //     "Station": station,
    //     "Time": time,
    //     "Loc": loc,
    //     "StationID": station_id,
    //     "StopStation": stop_station_order
    // });

    // _df_estimate_time_space = _df_estimate_time_space.replace("1001", "1000")

    // if (passing_stations[passing_stations.length - 1][0] == "1001") {
    //     let row_index = _df_estimate_time_space.query(_df_estimate_time_space["StationID"].eq('1001')).index;

    //     for (let item of row_index) {
    //         _df_estimate_time_space.set_value(item, 'StationID', "1000");
    //     }
    // }

    // let row_index = _df_estimate_time_space.query(_df_estimate_time_space["StationID"].eq(over_night_stn)).index;
    // let row_index = _df_estimate_time_space.loc[_df_estimate_time_space['StationID'] == over_night_stn].index;
    
    // let mid_night_index = -1;

    // for (let [index, row] of _df_estimate_time_space.loc[_df_estimate_time_space['StationID'] == over_night_stn].iterrows()) {
    //     if (!isNaN(row['Time'])) {
    //         if (row['Time'] < last_time_value) {
    //             mid_night_index = index;
    //         }
    //         last_time_value = row['Time'];
    //     }
    // }

    // row_index = row_index.filter(x => x >= mid_night_index);

    // if (row_index.length > 0) {
    //     for (let [index, row] of _df_estimate_time_space.iterrows()) {
    //         if (!isNaN(row['Time'])) {
    //             if (index >= row_index[0]) {
    //                 _df_estimate_time_space.set_value(index, "Time", row['Time'] + 2880);
    //             }
    //         }
    //     }
    // }

    // _df_estimate_time_space.interpolate({ method: 'linear' }, inplace = True);
    // _df_estimate_time_space.reset_index(drop = True);

    return _estimate_time_space;
}

function TimeSpaceToOperationLines(df_estimate_time_space) {
    // 資料初始化
    let _operation_lines = {};
    let _after_midnight_train = {};
    let stop_order = 0;

    // 初始化_operation_lines物件
    for (let key in LinesStations) {
        _operation_lines[key] = [[], [], [], [], [], []];
    }

    // 迭代df_estimate_time_space的每一列
    for (let index = 0; index < df_estimate_time_space.length; index++) {
        let row = df_estimate_time_space[index];

        for (let key in LinesStations) {
            if (LinesStations[key].includes(row['StationID'])) {
                _operation_lines[key][0].push(row['Station']);
                _operation_lines[key][1].push(row['StationID']);
                _operation_lines[key][2].push(row['Time']);
                _operation_lines[key][3].push(parseFloat(LinesStations[key][row['StationID']]['SVGYAXIS']));
                _operation_lines[key][4].push(row['StopStation']);
                _operation_lines[key][5].push(stop_order);
            }
        }

        stop_order++;
    }

    // 將_operation_lines物件轉換為DataFrame
    for (let key in _operation_lines) {
        let value = _operation_lines[key];

        _operation_lines[key] = new pd.DataFrame({
            "Station": value[0],
            "StationID": value[1],
            "Time": value[2],
            "Loc": value[3],
            "StopStation": value[4],
            "StopOrder": value[5]
        });
    }

    // 資料刪減整理，如果營運路線沒有資料就移除
    let drop_key = [];
    for (let key in _operation_lines) {
        let value = _operation_lines[key];

        if (value.shape[0] == 0) { // 資料不足者直接刪除
            drop_key.push(key);

            // 將未通過山海線（竹南、彰化二車站順序為相連）車次的營運路線刪除(可能可以移除)
            let index_temp = value[(value.StationID == '3360') || (value.StationID == '1250')].index.tolist();
            if (index_temp.toString() == [0, 1, 2].toString() || index_temp.toString() == [0, 1, 2, 3].toString()) {
                drop_key.push(key);
            }
        }
    }

    // 刪除drop_key中的元素
    for (let item of drop_key) {
        delete _operation_lines[item];
    }

    // 跨午夜車次處理
    for (let key in _operation_lines) {
        let value = _operation_lines[key];
        let index_label = value.query('Time >= 2880').index.tolist();

        if (index_label.length >= 2) {
            let row_value = ['跨午夜', "-1", 2880, NaN, "Y", value.loc[index_label[0], 'StopOrder'] - 1];
            let df = _insert_row(index_label[0], value, row_value); // 插入一個虛擬的跨午夜車站

            df = df.set_index('Time').interpolate({ method: 'index' }); // 依據時間估計跨午夜的位置
            df = df.reset_index();

            let df_after_midnight_train = df.slice(index_label[0]);
            // df_after_midnight_train.loc[:, 'Time'] = df_after_midnight_train.loc[:, 'Time'].map(x => x - 2880); // 每一個時間資料都減2880

            _after_midnight_train[key] = df_after_midnight_train;
        }
    }

    return {
        "Operation_Lines": _operation_lines,
        "After_Midnight_Train": _after_midnight_train
    };
}

function linearInterpolation(array) {
    for (let i = 0; i < array.length; i++) {
        if (isNaN(array[i])) {
            let prevValue;
            let nextValue;
            let prevIndex;
            let nextIndex;

            // 找到前一個非NaN元素
            for (let j = i - 1; j >= 0; j--) {
                if (!isNaN(array[j])) {
                    prevValue = array[j];
                    prevIndex = j;
                    break;
                }
            }

            // 找到後一個非NaN元素
            for (let j = i + 1; j < array.length; j++) {
                if (!isNaN(array[j])) {
                    nextValue = array[j];
                    nextIndex = j;
                    break;
                }
            }

            // 計算索引差距和數值差距
            const indexDiff = nextIndex - prevIndex;
            const valueDiff = nextValue - prevValue;

            // 線性插補
            const interpolatedValue = prevValue + (valueDiff / indexDiff) * (i - prevIndex);
            array[i] = interpolatedValue;
        }
    }

    return array;
}