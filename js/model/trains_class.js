class TrainsClass {
    constructor() {
        this.trains_map = new Map();         // 列車資料集
        this.master_train_info = [];     // 主表資料：列車基本資訊
        this.detail_time_info = [];      // 副表資料：列車時刻表
        this.selected_train = {};
    }

    fetchData(url) {
        return new Promise((resolve, reject) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        resolve(JSON.parse(this.responseText));
                    } else {
                        reject(new Error("Error fetching data"));
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        });
    }

    // 資料初始化
    initial_trains(jsonData) {
        for (const iterator of jsonData.TrainInfos) {
            this.trains_map.set(iterator.Train, { "Train": iterator.Train, "LineDir": iterator.LineDir, "Line": iterator.Line, "CarClass": iterator.CarClass, "TimeInfos": iterator.TimeInfos });
        }

        this.update_tables();
    }

    clear_all_data(){
        this.trains_map = new Map();
        this.master_train_info = [];
        this.detail_time_info = [];
        this.selected_train = {};     
    }

    // 資料轉為主副表
    update_tables() {
        this.master_train_info.length = 0;
        this.detail_time_info.length = 0;

        for (const iterator of this.trains_map.values())
            this.master_train_info.push({ "Train": iterator.Train, "LineDir": iterator.LineDir, "Line": iterator.Line, "CarClass": iterator.CarClass });

        for (const iterator of this.trains_map.values())
            this.detail_time_info.push({ "Train": iterator.Train, "TimeTable": iterator.TimeInfos });
    }

    // 刪除資料
    delete_train_map(key) {
        return this.trains_map.delete(key);
    }

    // 新增車次
    add_train_map(train, data) {
        // trains_map.forEach(function (value, key) {
        //     console.log(key + ' = ' + value.LineDir);
        // });
        // return trains_map.delete(key);
        if (!this.trains_map.has(train)) {
            this.trains_map.set(train, data);
            return true;
        } else
            return false;
    }

    // 更新資料
    update_train_map(train, data) {
        console.log(this.trains_map.get(train))
        if (this.trains_map.has(train) && this.trains_map.get(train) !== data) {
            this.trains_map.set(train, data);
            return true;
        } else
            return false;
    }
}




