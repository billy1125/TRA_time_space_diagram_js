const text_styles = {
    hour: "小時文字",
    hour_midnight: "午夜12點文字",
    min10: "10分鐘文字",
    min30: "30分鐘文字",
    station: "車站文字",
    station_noserv: "未服務車站文字"
};

const line_styles = {
    hour_line: "小時線",
    hour_midnight_line: "午夜12點線",
    min10_line: "10分鐘線",
    min30_line: "30分鐘線",
    station_line: "車站線",
    station_noserv_line: "未服務車站線"
};

const train_kind = {
    taroko: "太魯閣號",
    puyuma: "普悠瑪號",
    tze_chiang: "PP自強號",
    tze_chiang_diesel: "柴油自強號",
    emu1200: "EMU1200",
    emu300: "EMU300",
    emu3000: "EMU3000",
    chu_kuang: "莒光號",
    local: "區間車",
    fu_hsing: "復興號",
    ordinary: "普快車",
    ordinary: "其他"
};

const train_mark_kind = {
    taroko_mark: "太魯閣",
    puyuma_mark: "普悠瑪",
    tze_chiang_mark: "PP自強",
    tze_chiang_diesel_mark: "柴油自強",
    emu1200_mark: "EMU1200",
    emu300_mark: "EMU300",
    emu3000_mark: "EMU3000",
    chu_kuang_mark: "莒光號",
    local_mark: "區間車",
    fu_hsing_mark: "復興號",
    ordinary_mark: "普快車",
    ordinary_mark: "其他"
};

const user_styles = ["text_styles", "line_styles", "train_kind", "train_mark_kind"];

initial_style_editor();

function initial_style_editor() {
    set_colorpicker("text_settings", text_styles, "fill");
    set_colorpicker("base_line_settings", line_styles, "stroke");
    set_colorpicker("train_kind_settings", train_kind, "stroke");
    set_colorpicker("train_mark_kind_settings", train_mark_kind, "fill");

    if (localStorage.getItem("user_styles") !== null) {
        const user_data = JSON.parse(localStorage.getItem("user_styles"));
        set_user_setting(user_data);
    }
}

function set_colorpicker(target_id, data, kind) {
    Object.entries(data).forEach(([key, value]) => {

        const container = document.getElementById(target_id);

        const div1 = document.createElement('div');
        // divElement.id = 'myDiv';
        div1.className = 'form-group';
        const label = document.createElement('label');
        label.className = 'col-md-4 control-label';
        label.textContent = value;
        div1.appendChild(label);

        const div2 = document.createElement('div');
        div2.className = 'col-md-8';

        const span = document.createElement('span');
        span.className = key;
        span.setAttribute('id', key);
        div2.appendChild(span);

        const input = document.createElement('input');
        input.setAttribute('type', "color");
        input.setAttribute('id', key + "_setting");
        div2.appendChild(input);
        div1.appendChild(div2);

        container.appendChild(div1);

        const element = document.getElementById(key);
        const style = window.getComputedStyle(element);
        let color = null;
        if (kind == "fill")
            color = rgbToHex(style.fill);
        else if (kind == "stroke")
            color = rgbToHex(style.stroke);

        document.getElementById(key + "_setting").value = color;
    })
}

function rgbToHex(rgb) {
    // 提取RGB颜色代码中的R、G、B值
    var match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) {
        return "";
    }

    var r = parseInt(match[1], 10);
    var g = parseInt(match[2], 10);
    var b = parseInt(match[3], 10);

    // 将R、G、B值转换为十六进制字符串
    var hex = "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");

    return hex;
}

function set_user_setting(data) {
    for (const iterator of user_styles) {
        Object.entries(data[iterator]).forEach(([key, v]) => {
            document.getElementById(key + "_setting").value = v;
        })
    }
}



// 儲存個人的樣式設定
function save() {
    let output = {};
    output[user_styles[0]] = styles_to_localstorage("text_styles", text_styles);
    output[user_styles[1]] = styles_to_localstorage("line_styles", line_styles);
    output[user_styles[2]] = styles_to_localstorage("train_kind", train_kind);
    output[user_styles[3]] = styles_to_localstorage("train_mark_kind", train_mark_kind);

    var jsonText = JSON.stringify(output);
    window.localStorage.setItem("user_styles", jsonText);

    if (localStorage.getItem("user_styles") !== null) {
        window.alert("儲存成功！");
    }
}

function styles_to_localstorage(id, data) {
    let output = {};
    Object.entries(data).forEach(([key, value]) => {
        const option = document.getElementById(key + "_setting");
        output[key] = option.value;
    })
    return output;
}

// 恢復原來的樣式設定
function set_default() {
    const results = window.confirm('您確定要恢復預設的樣式設定嗎？');
    if (results == true) {
        window.localStorage.removeItem("user_styles");
        window.location.reload();
    }
}
