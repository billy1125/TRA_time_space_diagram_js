// json 檔案處理總程序
function process_json(json_data, train_no_input, line_kind) {
    const trains = json_data['TrainInfos'];
    let train = null;
    let all_trains_data = [];
    let train_no = "";
    const total_trains = trains.length - 1;

    for (let i = 0; i < total_trains; i++) {
        train_no_input.length === 0 ? train_no = trains[i]['Train'] : train_no = train_no_input;
        // console.log(train_no)
        if (trains[i]['Train'] == train_no) {
            train = trains[i];
            train_data = calculate_space_time(train, line_kind);
            all_trains_data.push(train_data);
        }       

    }
    draw_diagram_background(line_kind);
    draw_train_path(all_trains_data);
}


// 台鐵車次資料轉檔
function calculate_space_time(train, line_kind) {
    let _trains_data = [];                        // 台鐵各車次時刻表轉換整理後資料
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

    let passing_stations = find_passing_stations(timetable, line, line_dir);

    let estimate_time_space = estimate_timeSpace(timetable_dict, passing_stations);

    let operation_lines = time_space_to_operation_lines(estimate_time_space, line_kind);

    Object.entries(operation_lines).forEach(([key, value]) => {
        _trains_data.push([key, train_id, car_class, line, value]);
    })

    return _trains_data;
}

// 查詢車次會「停靠與通過」的所有車站
function find_passing_stations(timetable, line, line_dir) {
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

// 推算車次會通過的所有車站到站與離站時間
function estimate_timeSpace(timetable, passing_stations) {
    let _estimate_time_space = {};
    let index = 0;
    let timetable_stations = Object.keys(timetable);

    // 將起終點中間歷經的停靠與通過車站均找出，存到字典
    for (const [StationId, StationName, LocationKM, KM] of passing_stations) {
        if (timetable_stations.includes(StationId)) {
            let ARRTime = parseFloat(SVG_X_Axis[timetable[StationId][0]].ax1);
            let DEPTime = parseFloat(SVG_X_Axis[timetable[StationId][1]].ax1);
            let Order = parseInt(timetable[StationId][3]);

            _estimate_time_space[index] = [StationId, StationName, parseFloat(KM), ARRTime, Order];
            _estimate_time_space[index += 1] = [StationId, StationName, parseFloat(KM), DEPTime, Order];
            index += 1;
        } else {
            _estimate_time_space[index] = [StationId, StationName, parseFloat(KM), NaN, -1];
            index += 1;
        }
    }

    // 環島、跨午夜車次處理
    let after_midnight_row_index = -1;
    let last_time_value = -1;

    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        // 環島車次處理
        if (value[0] == "1001") {
            value[0] = "1000";
        }
        // 跨午夜車次處理(一般車次所有的時間都是越來越大，但跨午夜車次會有一筆資料時間開始變小，這裡要找出是哪一筆資料？)
        if (!isNaN(value[3])) {
            if (value[3] < last_time_value) {
                after_midnight_row_index = parseInt(key);
            }
            last_time_value = value[3];
        }
    })

    // 跨午夜車次處理：將超過午夜的時間一律加上 2880
    if (after_midnight_row_index != -1) {
        Object.entries(_estimate_time_space).forEach(([key, value]) => {
            if (parseInt(key) >= after_midnight_row_index) {
                value[3] += 2880;
            }
        })
    }

    // 將所有停靠與通過車站的時間都存到暫存陣列
    let interpolate = []
    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        interpolate.push(value[3]);
    })

    // 計算沒有時間的通過車站插補資料，計算插補資料的原因主要是為了各路線端點車站可能列車會直接通過，譬如北迴線有的列車會直接通過蘇澳新，必須要計算出大致的通過時間
    const interpolatedArray = linearInterpolation(interpolate);
    Object.entries(_estimate_time_space).forEach(([key, value]) => {
        value[3] = interpolatedArray[key];
    })

    return _estimate_time_space;
}

// 將車次通過車站時間轉入各營運路線的資料，設定通過車站的順序碼，並且推算跨午夜車次的距離
function time_space_to_operation_lines(estimate_time_space, line_kind) {
    // 初始化_operation_lines物件
    let _operation_lines = {};
    for (let key in LinesStations) {
        _operation_lines[key] = [];
    }

    // 迭代df_estimate_time_space的每一列
    Object.entries(estimate_time_space).forEach(([key, value]) => {
        Object.entries(LinesStations).forEach(([key1, value1]) => {
            if (key1 == line_kind)
                if (value[0] in value1) 
                _operation_lines[key1].push([value[1], value[0], value[3], LinesStations[key1][value[0]]['SVGYAXIS'], value[4], parseInt(key)]);
        })
    })

    return _operation_lines;
}

// 陣列資料插補
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

function FindUncontinuousStation(line) {
    let _index_temp = [];
    Object.entries(_operation_lines[line]).forEach(([key, value]) => {
        if (value[1] == '3360' || value[1] == '1250')
            _index_temp.push(key);
    })
    return _index_temp;
}