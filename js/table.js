// 副表数据
// var detailTable = [
//     { id: 1, details: 'Details for John' },
//     { id: 2, details: 'Details for Alice' },
//     { id: 3, details: 'Details for Bob' }
// ];

// 主表数据
// var mainTable = [
//     { id: 1, name: 'John' },
//     { id: 2, name: 'Alice' },
//     { id: 3, name: 'Bob' }
// ];

let jsonData = null;
let trains = null;
let trains_timetable = [];
let mainTableContainer = null;
let detailTableContainer = null;
let itemsPerPage = 20;              // 每一個分頁要顯示的資料數量
let currentPage = 1;                // 現在的頁碼

fetchData('tests/20230623.json');

function fetchData(url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            jsonData = JSON.parse(this.responseText);
            // console.log(jsonData)
            initial_table(jsonData);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function initial_table(jsonData) {

    trains = jsonData.TrainInfos;
    
    for (const iterator of trains) {
        trains_timetable.push({ "Train": iterator.Train, "TimeTable": iterator.TimeInfos });
    }

    mainTableContainer = document.getElementById('main-table');
    detailTableContainer = document.getElementById('detail-table');

    display_data();
}

function display_data() {
   
    mainTableContainer.innerHTML = '';  // 清空主表内容

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    // 顯示特定頁面的資料
    var currentPageData = trains.slice(startIndex, endIndex);
    currentPageData.forEach(function (item) {
        let row = document.createElement('tr');
        // row.innerHTML = item.Train;
        row.addEventListener('click', function () {
            showDetails(item.Train);
        });
        mainTableContainer.appendChild(row);
        add_td(row, item.Train);
        add_td(row, item.LineDir);
        add_td(row, item.Line);
        add_td(row, item.CarClass);
    });

    // 更新頁碼
    updatePagination();
}

// 顯示副表
function showDetails(id) {
    // 清空副表
    detailTableContainer.innerHTML = '';

    // 以車次號查詢副表內容
    let details = trains_timetable.find(function (item) {
        return item.Train === id;
    });

    details.TimeTable.forEach(function (item) {
        let row = document.createElement('tr');
        detailTableContainer.appendChild(row);
        add_td(row, item.Order);
        add_td(row, item.Station);
        add_td(row, item.ARRTime);
        add_td(row, item.DEPTime);

        // detailTableContainer.appendChild(detailRow);
    });
}

function add_td(row_element, inner_text) {
    let td = document.createElement('td');
    td.innerHTML = inner_text;
    row_element.appendChild(td);
}

function updatePagination() {
    pagination.innerHTML = '';

    var totalPages = Math.ceil(trains.length / itemsPerPage);

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
            displayData();
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
            displayData();
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
            displayData();
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
            displayData();
        }
    });
    pagination.appendChild(nextLink);
}


