let hours = DiagramHours;
let date = Date().toLocaleString();
let diagram_objects = {};

function draw_diagram_background(line_kind) {
    Object.entries(OperationLines).forEach(([key, value]) => {
        if (key == line_kind) {
            let width = 1200 * (hours.length - 1) + 100;
            let height = value['MAX_X_AXIS'];
            let draw = SVG().addTo('body').size(width, height + 75);
            let text_spacing_factor = 500;
            let title = `${value['NAME']} 運行圖均來自台鐵公開資料所分析，僅供參考，正確資料與實際運轉狀況請以台鐵網站或公告為主。轉檔時間：${date}`;

            // add_text(draw, title, 5, 0, null);

            for (let i = 0; i < hours.length; i++) {
                let x = 50 + i * 1200;
                let y = 0;
                add_line(draw, x, 50, x, height + 50, "hour_line");

                while (true) {
                    let hour = hours[i];
                    let hour_text = padStart(hour.toString(), 2, "0");
                    if (hour == 24) {
                        after_midnight = "隔日";
                        css = "hour_midnight";
                    }
                    else {
                        after_midnight = "";
                        css = "hour";
                    }
                    if (y <= height)
                        add_text(draw, `${hour_text}00 ${after_midnight}`, x, y + 30, css);
                    else
                        break;
                    y += text_spacing_factor;
                }


                if (i != hours.length - 1) {
                    for (let j = 0; j < 5; j++) {
                        x = 50 + i * 1200 + (j + 1) * 200;
                        if (j != 2)
                            add_line(draw, x, 50, x, height + 50, "min10_line");
                        else
                            add_line(draw, x, 50, x, height + 50, "min30_line");

                        y = 0
                        while (true) {
                            if (y <= height) {
                                if (j != 2)
                                    add_text(draw, `${j + 1}0`, x, y + 30, "min10");
                                else
                                    add_text(draw, `${j + 1}0`, x, y + 30, "min30");
                            }
                            else
                                break;
                            y += text_spacing_factor;
                        }

                    }
                }
            }

            let stations = LinesStationsForBackground[key];
            Object.entries(stations).forEach(([key1, value1]) => {
                y = value1['SVGYAXIS'] + 50;
                if (value1['ID'] != 'NA')
                    add_line(draw, 50, y, width - 50, y, "hour_line");
                else
                    add_line(draw, 50, y, width - 50, y, "station_noserv_line");
                for (let i = 0; i < 31; i++) {
                    if (value1['ID'] != 'NA')
                        add_text(draw, value1['DSC'], 5 + i * 1200, y - 20, "station");
                    // self._add_text(str(5 + i * 1200), str(y - 5), value['DSC'], "#000000", None, None)
                    else
                        add_text(draw, value1['DSC'], 5 + i * 1200, y - 20, "station_noserv");
                    // self._add_text(str(5 + i * 1200), str(y - 5), value['DSC'], "#c2c2a3", None, None)
                }
            })

            diagram_objects[key] = draw;
        }
    })
}

function draw_train_path(all_trains_data) {
    for (const train_data of all_trains_data) {
        for (const [line_kind, train_no, train_kind, line, value] of train_data) {
            // console.log([line_kind, train_no, train_kind, line, value]);
            if (value.length > 2) {
                let uncontinuous_index = find_uncontinuous_index(value);
                let section_start_value = value.slice(0, uncontinuous_index);
                let section_end_value = value.slice(uncontinuous_index, value.length);

                set_path(line_kind, train_no, train_kind, section_start_value);
                if (section_end_value.length > 3)
                    set_path(line_kind, train_no + "-End", train_kind, section_end_value);
            }
        }
    }
}

function find_uncontinuous_index(value) {
    let order_next = value[0][5];
    let index = 0;

    for (const [dsc, id, time, loc, stop, order] of value) {
        if (order == order_next) {
            order_next += 1;
            index += 1;
        }
        else {
            break
        }
    }
    return index;
}

function set_path(line_kind, train_no, train_kind, value) {
    let path = "M";
    let coordinates = [];
    let style = CarKind[train_kind];
    if (typeof (style) == "undefined") {
        style = "special";
    }

    for (const [dsc, id, time, loc, stop, order] of value) {
        if (stop != -1 || LinesStationsForBackground[line_kind][id]['TERMINAL'] == 'Y') {
            let x = time * 10 - 1200 * DiagramHours[0] + 50;
            let y = loc + 50;
            x = Math.round((x + Number.EPSILON) * 100) / 100;
            y = Math.round((y + Number.EPSILON) * 100) / 100;
            path += x.toString() + ',' + y.toString() + ' ';
            coordinates.push([x, y]);
        }
    }

    let text_position = calculate_text_position(coordinates, style);
    add_path(diagram_objects[line_kind], line_kind, train_no, path, text_position, style);
}

function calculate_text_position(coordinates, color) {
    let coordinates_pairs_temp = [];
    let coordinates_distance = []; // 用來置放每一個轉折點之間的長度

    for (const iterator of coordinates) {
        if (coordinates_pairs_temp.length === 2) {
            let distance = calculate_distance(coordinates_pairs_temp[0], coordinates_pairs_temp[1]);
            coordinates_distance.push(distance);
            coordinates_pairs_temp[0] = coordinates_pairs_temp[1];
            coordinates_pairs_temp[1] = iterator;
        } else if (coordinates_pairs_temp.length === 1) {
            coordinates_pairs_temp.push(iterator);
        } else if (coordinates_pairs_temp.length === 0) {
            coordinates_pairs_temp.push(iterator);
        }
    }

    if (coordinates_pairs_temp.length == 2) {
        coordinates_distance.push(calculate_distance(coordinates_pairs_temp[0], coordinates_pairs_temp[1]));
    }

    // 區間車標號方式：各段長度長於60，偶數位的進行標註，其他車種：100-500的長度在中間標註，大於500則是在中間標註兩次
    let text_position = []; // 用來置放標號定位點
    let accumulate_dist = 0; // 所有轉折點的長度累進

    if (color === "local") {
        let new_text_position = [];
        for (let item of coordinates_distance) {
            if (item > 60) {
                let pos = accumulate_dist + item / 4;
                text_position.push(pos);
            }
            accumulate_dist += item;
        }

        for (let i = 0; i < text_position.length; i++) {
            if (i % 2 === 0) {
                new_text_position.push(text_position[i]);
            }
        }

        text_position = new_text_position;
    } else {
        for (let item of coordinates_distance) {
            if (item > 60 && item < 100) {
                text_position.push(0);
            } else if (item >= 100 && item <= 500) {
                let pos = accumulate_dist + item / 2;
                text_position.push(pos);
            } else if (item > 500) {
                for (let i = 1; i <= 2; i++) {
                    let pos = accumulate_dist + i * (item / 3);
                    text_position.push(pos);
                }
            }
            accumulate_dist += item;
        }
    }
    return text_position;
}

function add_line(draw_object, x1, x2, y1, y2, style) {
    let line = draw_object.line(x1, x2, y1, y2);
    line.attr({ class: style });
}

function add_text(draw_object, text_string, x, y, style) {
    let text = draw_object.text(text_string).move(x, y);
    text.attr({ class: style });
}

function add_path(draw_object, line_kind, train_id, path_string, text_position, style) {
    const train_id_text = '#' + line_kind + train_id; // SVG.js 會檢查屬性是不是顏色，故不能單純只是用 #283 用車次號做 ID
    let path = draw_object.path(path_string);

    path.attr({ class: style, id: line_kind + train_id });


    for (const iterator of text_position) {
        let text = draw_object.text(function (add) {
            add.tspan(train_id).dy(-3)
        })
        // text.attr({ 'href': train_id_text, startOffset: iterator, class: style });

        let textpath = text.path();
        // console.log(train_id_text);
        textpath.attr({ href: train_id_text, startOffset: iterator, class: style });
    }

}

function padStart(string, targetLength, padString) {
    return padString.repeat(Math.max(0, targetLength - string.length)) + string;
}

function calculate_distance(start, end) {
    const deltaX = end[0] - start[0];
    const deltaY = end[1] - start[1];
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return distance;
}