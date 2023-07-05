const web_name = "台灣鐵路/軌道運行圖";
const description = "本站利用台灣鐵路管理局所開放的 open data 與交通部公共運輸整合資訊流通服務平臺所提供之公開資料集，設計並轉換成為以時間與空間描述的鐵路運行圖，可運用於台灣鐵路研究與嗜好用途。由呂卓勳所設計與營運。";
const keywords = "鐵路運行圖,列車位置,台灣鐵路管理局,台鐵,台灣高鐵,台湾鉄道ダイヤグラム,ダイヤグラム,台湾鉄道,台湾高鉄,鐵道,鐵路,Railway Time Space Diagram,Railway,Taiwan Railway,Taiwan Hish Speed Railway";
const footer = "<p><strong>本站所提供的資料，均由台鐵 <a href = 'https://data.gov.tw/dataset/6138'>open data</a> 或<a href = 'http://ptx.transportdata.tw/MOTC/'>交通部公共運輸整合資訊流通服務平臺</a>所提供之公開資料集所分析整理繪製，僅供參考。實際鐵路運行情況請以<a href = 'https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytime'>台鐵</a>所公布資訊為準。</strong></p><p><a href='https://tradiagram.com/privacy.html'>隱私權保護政策<a></p>";

const dict_line = {
    'west_link_north': ['/WESTNORTH_', '西部幹線北段'],
    'west_link_south': ['/WESTSOUTH_', '西部幹線南段'],
    'west_link_moutain': ['/WESTMOUNTAIN_', '西部幹線山線'],
    'west_link_sea': ['/WESTSEA_', '西部幹線海線'],
    'pingtung': ['/PINGTUNG_', '屏東線'],
    'south_link': ['/SOUTHLINK_', '南迴線'],
    'taitung': ['/TAITUNG_', '台東線'],
    'pingxi': ['/PINGXI_', '平溪線'],
    'neiwan': ['/NEIWAN_', '內灣線'],
    'liujia': ['/LIUJIA_', '六家線'],
    'jiji': ['/JIJI_', '集集線'],
    'shalun': ['/SHALUN_', '沙崙線'],
    'yilan': ['/YILAN_', '宜蘭線'],
    'north_link': ['/NORTHLINK_', '北迴線'],
    'thsr': ['/', '台灣高鐵']
};
