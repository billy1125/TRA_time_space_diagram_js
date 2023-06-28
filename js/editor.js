let itemsPerPage = 20;              // 每一個分頁要顯示的資料數量
let currentPage = 1;                // 現在的頁碼

const trains_data = new TrainsClass();

// trains_data.fetchData('tests/20230628.json')
//     .then((jsonData) => {
//         trains_data.initial_trains(jsonData);
//         initial_editor();
//     })
//     .catch((error) => {
//         console.error(error);
//     });
initial_editor();

// 編輯器初始化
function initial_editor() {
    set_select("line_dir", line_dir_kind);
    set_select("line", line_kind);
    set_select("car_class", car_kind);
    set_select("stations", stations_kind);

    display_master();
}

// 顯示主表
function display_master() {

    mainTableContainer.innerHTML = '';   // 清空主表内容
    detailTableContainer.innerHTML = ''; // 清空副表

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    // 顯示特定頁面的資料
    if (trains_data.master_train_info.length > 0) {
        let currentPageData = trains_data.master_train_info.slice(startIndex, endIndex);
        currentPageData.forEach(function (item) {
            let row = document.createElement('tr');
            row.setAttribute('id', item.Train);
            // row.innerHTML = item.Train;
            row.addEventListener('click', function () {

                select_hightlight(item.Train, row);
                trains_data.selected_train = { "Train": item.Train, "LineDir": item.LineDir, "Line": item.Line, "CarClass": item.CarClass };
                display_detail(item.Train);
            });
            mainTableContainer.appendChild(row);

            // 刪除欄位
            add_button_td(row, "刪除", item.Train);

            // 車次欄位
            add_textbox_td(row, item.Train, "input-train-" + item.Train);
            // add_text_td(row, item.Train);

            // 順逆行欄位
            add_td_selection(row, line_dir_kind, "sel-dir-" + item.Train);
            select_update("sel-dir-" + item.Train, item.LineDir);

            // 經由路線
            add_td_selection(row, line_kind, "sel-line-" + item.Train);
            select_update("sel-line-" + item.Train, item.Line);

            // 車種欄位
            add_td_selection(row, car_kind, "sel-car-" + item.Train);
            select_update("sel-car-" + item.Train, item.CarClass);
        });
    }
    // 更新頁碼
    updatePagination();
}

function select_hightlight(id, row) {
    let last_row = document.getElementById(trains_data.selected_train.Train);

    if (last_row != null)
        if (last_row.id != id)
            last_row.setAttribute('style', '');

    row.setAttribute('style', 'background-color:#F00');
}

function select_update(id, select_value) {
    var selection = document.getElementById(id);

    for (var i = 0; i < selection.options.length; i++) {
        if (selection.options[i].value === select_value) {
            selection.options[i].selected = true;
            break;
        }
    }
}

// 顯示副表
function display_detail(id) {

    detailTableContainer.innerHTML = ''; // 清空副表

    var select_train_no = document.getElementById("select-train-no");
    select_train_no.innerHTML = id;

    // 以車次號查詢副表內容
    let details = trains_data.detail_time_info.find(function (item) {
        return item.Train === id;
    });

    trains_data.selected_train.TimeInfos = details;

    details.TimeTable.forEach(function (item) {
        let row = document.createElement('tr');
        detailTableContainer.appendChild(row);

        add_text_td(row, item.Order);

        // add_text_td(row, item.Station);
        add_td_selection(row, stations_kind, "sel-station-" + item.Order);
        select_update("sel-station-" + item.Order, item.Station);

        add_textbox_td(row, item.ARRTime, "input-arrtime-" + item.Order);
        add_textbox_td(row, item.DEPTime, "input-deptime-" + item.Order);

        // detailTableContainer.appendChild(detailRow);
    });

}

// 增加文字型態儲存格
function add_text_td(row_element, inner_text) {
    let td = document.createElement('td');
    td.innerHTML = inner_text;
    row_element.appendChild(td);
}

// 增加按鍵型態儲存格(刪除)
function add_button_td(row_element, inner_text, dom_id) {
    let td = document.createElement('td');
    row_element.appendChild(td);

    let button = document.createElement("button");
    button.innerHTML = inner_text;
    if (dom_id !== '')
        button.setAttribute('id', "sel-del-" + dom_id);
    td.appendChild(button);

    button.addEventListener('click', function () {
        let check = window.confirm(`您確定要刪除第 ${dom_id} 車次？`);
        if (check == true) {
            delete_train_map(dom_id);
            update_tables();
            display_master();
        }
    });
}

// 增加選項儲存格
function add_td_selection(row_element, selection_kind, dom_id) {
    let td = document.createElement('td');
    row_element.appendChild(td);

    let select = document.createElement("select");
    if (dom_id !== '')
        select.setAttribute('id', dom_id);

    selection_kind.forEach(function (optionData) {
        var option = document.createElement("option");
        option.value = optionData.id;
        option.text = optionData.id + " - " + optionData.dsc;
        select.appendChild(option);
    });
    td.appendChild(select);
}

// 增加編輯文字框儲存格
function add_textbox_td(row_element, input_text, dom_id) {
    let td = document.createElement('td');
    row_element.appendChild(td);

    let input = document.createElement("input");
    if (dom_id !== '')
        input.setAttribute('id', dom_id);
    input.setAttribute('type', 'text');
    input.setAttribute('value', input_text);

    td.appendChild(input);
}

// 更新頁碼
function updatePagination() {
    pagination.innerHTML = "";

    var totalPages = Math.ceil(trains_data.master_train_info.length / itemsPerPage);

    var startPage = 1;
    var endPage = totalPages;

    if (totalPages > 5) {
        if (currentPage <= 3) {
            endPage = 5;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // 頁碼1
    if (startPage > 1) {
        var firstPageLink = document.createElement('a');
        firstPageLink.href = '#';
        firstPageLink.textContent = '1';
        firstPageLink.dataset.page = 1;
        firstPageLink.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            display_master();
        });
        pagination.appendChild(firstPageLink);

        if (startPage > 0) {
            var ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }

    // 中間頁碼
    for (var i = startPage; i <= endPage; i++) {
        var pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.dataset.page = i;

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        pageLink.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            display_master();
        });

        pagination.appendChild(pageLink);

        if (i < endPage) {
            var spacing = document.createElement('span');
            spacing.textContent = ' ';
            pagination.appendChild(spacing);
        }
    }

    // 最後頁碼
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            var ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }

        var lastPageLink = document.createElement('a');
        lastPageLink.href = '#';
        lastPageLink.textContent = totalPages;
        lastPageLink.dataset.page = totalPages;
        lastPageLink.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            display_master();
        });
        pagination.appendChild(lastPageLink);
    }
}

// 設定新增車次的選單
function set_select(id, data) {
    const select = document.getElementById(id);

    data.forEach(function (optionData) {
        var option = document.createElement("option");
        option.value = optionData.id;
        option.text = optionData.id + " - " + optionData.dsc;
        select.appendChild(option);
    });
}
