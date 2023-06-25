let mainTableContainer = null;
let detailTableContainer = null;
let itemsPerPage = 20;              // 每一個分頁要顯示的資料數量
let currentPage = 1;                // 現在的頁碼

initial_table();
display_data();

function initial_table() {
    mainTableContainer = document.getElementById('main-table');
    detailTableContainer = document.getElementById('detail-table');
}

function display_data() {

    mainTableContainer.innerHTML = '';  // 清空主表内容

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    // 顯示特定頁面的資料
    var currentPageData = master_train_info.slice(startIndex, endIndex);
    currentPageData.forEach(function (item) {
        let row = document.createElement('tr');
        // row.innerHTML = item.Train;
        row.addEventListener('click', function () {
            showDetails(item.Train);
        });
        mainTableContainer.appendChild(row);

        // 刪除欄位
        add_button_td(row, "刪除", item.Train);

        // 車次欄位
        add_textbox_td(row, item.Train, "sel-input-" + item.Train);
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

    // 更新頁碼
    updatePagination();
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
function showDetails(id) {
    // 清空副表
    detailTableContainer.innerHTML = '';

    // 以車次號查詢副表內容
    let details = detail_time_info.find(function (item) {
        return item.Train === id;
    });

    details.TimeTable.forEach(function (item) {
        let row = document.createElement('tr');
        detailTableContainer.appendChild(row);

        add_text_td(row, item.Order);

        // add_text_td(row, item.Station);
        add_td_selection(row, stations_kind, "sel-station-" + item.Order);
        select_update("sel-station-" + item.Order, item.Station);

        add_textbox_td(row, item.ARRTime, "");
        add_textbox_td(row, item.DEPTime, "");

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
        button.setAttribute('id', "sel-btn-" + dom_id);
    td.appendChild(button);

    button.addEventListener('click', function () {
        let check = window.confirm(`您確定要刪除第 ${dom_id} 車次？`);
        if (check == true) {
            delete_train_map(dom_id);
            update_tables();
            display_data();
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

function updatePagination() {
    pagination.innerHTML = '';

    var totalPages = Math.ceil(master_train_info.length / itemsPerPage);

    var prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.textContent = '上一頁';
    prevLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            display_data();
        }
    });
    pagination.appendChild(prevLink);

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

    if (startPage > 1) {
        var firstPageLink = document.createElement('a');
        firstPageLink.href = '#';
        firstPageLink.textContent = '1';
        firstPageLink.dataset.page = 1;
        firstPageLink.addEventListener('click', function (e) {
            e.preventDefault();
            currentPage = parseInt(this.dataset.page);
            display_data();
        });
        pagination.appendChild(firstPageLink);

        if (startPage > 2) {
            var ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }

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
            display_data();
        });

        pagination.appendChild(pageLink);

        if (i < endPage) {
            var spacing = document.createElement('span');
            spacing.textContent = ' ';
            pagination.appendChild(spacing);
        }
    }

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
            display_data();
        });
        pagination.appendChild(lastPageLink);
    }

    var nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.textContent = '下一頁';
    nextLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            display_data();
        }
    });
    pagination.appendChild(nextLink);
}

function file_save() {
    let json_object = { TrainInfos: [] };

    trains_map.forEach(function (value, key) {
        json_object.TrainInfos.push(value);
    });

    const json = JSON.stringify(json_object);
    download(json, 'export.json', 'text/plain');

    update_tables();
    display_data();
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
