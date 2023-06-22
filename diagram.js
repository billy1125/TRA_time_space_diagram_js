let hours = DiagramHours;
let date = Date().toLocaleString();

function draw_diagram() {
    Object.entries(OperationLines).forEach(([key, value]) => {
        let width = 1200 * (hours.length - 1) + 100;
        let height = value['MAX_X_AXIS'];
        let draw = SVG().addTo('body').size(width, height + 50);
        let text_spacing_factor = 500;
        let title = `${value['NAME']} 日期：，運行圖均來自台鐵公開資料所分析，僅供參考，正確資料與實際運轉狀況請以台鐵網站或公告為主。台鐵JSON Open Data轉檔運行圖程式版本：1.3.7 轉檔時間：${date}`;

        add_text(draw, title, 5, 0, null);

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
    })
}


function add_line(draw_object, x1, x2, y1, y2, style) {
    let line = draw_object.line(x1, x2, y1, y2);
    line.attr({ class: style });
}

function add_text(draw_object, text_string, x, y, style) {
    let text = draw_object.text(text_string).move(x, y);
    text.attr({ class: style });
}

function padStart(string, targetLength, padString) {
    return padString.repeat(Math.max(0, targetLength - string.length)) + string;
}