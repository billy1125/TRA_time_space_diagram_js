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
        if (trains[i]['Train'] == '2554') {
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

    // for (let i = 0; i < train.TimeInfos.length - 1; i++) {
    //     TimeInfos = train.TimeInfos[i];
    //     timetable[i] = [TimeInfos.Station, TimeInfos.ARRTime, TimeInfos.DEPTime, TimeInfos.Station, TimeInfos.Order];
    // }

    // for (let TimeInfos of train.TimeInfos) {
    //     timetable[TimeInfos.Station] = [TimeInfos.ARRTime, TimeInfos.DEPTime, TimeInfos.Station, TimeInfos.Order];
    // }

    findPassingStations(timetable, line, line_dir);
}

function findPassingStations(timetable, line, line_dir) {
    let start_station = timetable[0]['Station'];
    let end_station = timetable[timetable.length - 1]['Station'];

    let _passing_stations = [];
    let station = start_station;
    let km = 0.0;

    let cheng_zhui = false;
    let roundabout_train = false;

    let stations = [];
    for (let item of timetable){
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
                if (branch !== '') {
                    if (station == '7360') {
                        if (end_station == '7362') {
                            km += parseFloat(Route[station].CCW_BRANCH_KM);
                            station = '7361';
                        } else if (end_station !== '7362') {
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
                if (branch !== '') {
                    if (station == '0920') {
                        if (end_station !== '0900') {
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
                        } else if (end_station !== '7120') {
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
