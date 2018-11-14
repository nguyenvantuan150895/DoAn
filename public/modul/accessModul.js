const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const device = require('express-device');
const date1 = require('date-and-time');
const useragent = require('useragent');
const Shorten = require('../../c_models/shortenModel');
const Access = require('../../c_models/accesslogModel');

const date = () => {
    let now = new Date();
    let date = date1.format(now, 'MM/DD/YYYY');  
    let hour = date1.format(now,'HH');
    let ob_time = {date: date, hour: hour};//console.log("ob_time:", ob_time);
    return ob_time;
}
const location = (geo1) => {
    let geo = {"range":[2064646144,2064654335],"country":"VN","region":"AS","eu":"0","timezone":"Asia/Ho_Chi_Minh","city":"Hanoi","ll":[21.0333,105.85],"metro":0,"area":1}
    let location;
    if (geo["country"] == "VN") location  = geo.city;
    else location = "foreign";
    return location;
}
const getOs = (info1) => {
    //info1 = agent.toString();
    let info = info1.toLowerCase();
    let os;
    if(info.search('android') != -1 ) {
        os = "Android";
    } else if(info.search('ios') != -1) {
        os = "iOS";
    } else if(info.search('windows') != -1){
        os = "Windows";
    } else if(info.search('linux') != -1){
        os = "Linux";
    } else if(info.search('mac') != -1){
        os ="Mac OS";
    } else {
        os = "Other";
    }
    return os;
}
const getBrowser = (info1) => {
    //info1 = agent.family; khong ngoac
    let info = info1.toLowerCase();
    // console.log("type info:", typeof info);
    // console.log("info:", info);
    // console.log("search:", info.search('chrome'));
    let browser;
    if(info.search('chrome') != -1 ) {
        browser = "Chrome";
    }else if(info.search('internet') != -1) {
        browser = "IE";
    }else if(info.search('opera') != -1) {
        browser = "Opera";
    }else if(info.search('firefox') != -1) {
        browser = "Firefox";
    }else if(info.search('safari') != -1) {
        browser = "Safari";
    }else if(info.search('coc coc') != -1) {
        browser = "Coc Coc";
    }else if(info.search('facebook') != -1) {
        browser = "Facebook";
    }else {
        browser = "Other";
    }
    return browser;
}

// ################################################################
let randomArray = (arr) => {
    let result = arr[Math.floor(Math.random() * arr.length)];
    return result;
}
let randomIP = () => {
    let ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0);
    return ip;
}
let randomTime = () => {
    let time_click = {};
    //let hour = Math.floor((Math.random() * 24)); // 00h -> 23h; random 0 ->23;
    let h1 = [1,2,3,8,20,21,22,23], h2 = [5,6,7,20,21,22,24], h3 = [12,13,14,20,21,22,24], h4 =[15,17,18,19,8,9],
    h5 = [4,10,15,16,13];
    h = randomArray([h1,h2,h3,h4,h5]);
    //fake
    // let h = [0,7,8,12,13,17,18,20,21,22,23];
    let hour = randomArray(h);
    //end fake
    hour = hour.toString();
    if(Number(hour) < 10) hour = '0'+hour;
    let month = Math.floor((Math.random() * 12) + 1);
    month = month.toString();
    let date1;
    if(Number(month) < 10) month = "0" + month;
    // month = randomArray(['06','07','08']);
    month = '06';
    // console.log("month:", month);
    // console.log("typeof Month:", typeof month);
    if( month == "02"){
        date1 = Math.floor((Math.random() * 28) + 1);
    } else if( month=="01"||month=="03"||month=="05"||month=="07"||month=="08"||month=="10"||month=="12"){
        date1 = Math.floor((Math.random() * 31) + 1);
    } else if(month=="04"||month=="06"||month=="09"||month=="11"){
        date1 = Math.floor((Math.random() * 30) + 1);
    }
    date1 = date1.toString();
    if(Number(date1) < 10 ) date1 = '0' + date1;
    let date = month + "/" + date1 +"/2018";
    time_click.date = date;
    time_click.hour = hour;
    // console.log("time_click:", time_click);
    return time_click;
}
let randomLocation = () => {
    let arr = ['An Giang','Bà Rịa - Vũng Tàu','Bắc Giang','Bắc Kạn','Bạc Liêu','Bắc Ninh','Bến Tre',
    'Bình Định','Bình Dương','Bình Phước','Bình Thuận','Cà Mau','Cao Bằng','Đắk Lắk','Đắk Nông',
    'Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Giang','Hà Nam','Hà Tĩnh','Hải Dương','Hậu Giang',
    'Hòa Bình','Hưng Yên','Khánh Hòa','Kiên Giang','Kon Tum','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai',
    'Long An','Nam Định','Nghệ An','Ninh Bình','Ninh Thuận','Phú Thọ','Quảng Bình','Quảng Nam','Quảng Ngãi',
    'Quảng Ninh','Quảng Trị','Sóc Trăng','Sơn La','Tây Ninh','Thái Bình','Thái Nguyên','Thanh Hóa',
    'Thừa Thiên Huế ','Tiền Giang','Trà Vinh','Tuyên Quang','Vĩnh Long','Vĩnh Phúc','Yên Bái','Phú Yên',
    'Cần Thơ','Đà Nẵng','Hải Phòng','Hà Nội','TP HCM','Nước Ngoài'];
    let location = randomArray(arr);
    // let location = randomArray["Hà Nội", "TP HCM", "Đà Nẵng", "Cần Thơ","Hải Phòng", "Bình Dương","Bắc Ninh","Khánh Hòa"];
    return location;
}
let randomShortUrl = async () => {
    let arr = await Shorten.getAllShortUrl();
    let len = arr.length;
    let index = Math.floor((Math.random() * len));
    let result = arr[index];
    // result = randomArray([arr[0], arr[1]]);
    result.totalClick += 1;
    let result2 = await Shorten.update(result.id, result);
    return result.id;
}
const dummyData = async (n) => {
    let device1 = ['desktop', 'phone', 'tablet','other'];
    let browser1a = ['Chrome','IE','Opera','Firefox','Safari','Coc Coc','Facebook','Other'];// phone, ios
    let browser1b = ['Chrome','IE','Opera','Firefox','Coc Coc','Facebook','Other'];// phone
    let browser2a = ['Chrome','IE','Opera','Firefox','Safari','Coc Coc','Other'];//desktop, macOS
    let browser2b = ['Chrome','IE','Opera','Firefox','Coc Coc','Other'];//desktop
    let os1 = ['Mac OS','Linux','Windows','Android','iOS','Otherdesktop'];// undefine
    let os2 = ['Android','iOS','Otherphone'];// phone
    let os3 = ['Mac OS','Linux','Windows','Otherdesktop'];// desktop
    let os4 = ['Android','Otherphone'];// other
    for( let i = 0; i < n ; i ++){
        let browser;
        let os;
        let ip = randomIP();
        let time_click = randomTime();
        let location = randomLocation();
        let device = randomArray(device1);
        if (device == "phone" || device == "table"){
            os = randomArray(os2);
            if(os == "iOS")  browser = randomArray(browser1a);
            else browser = randomArray(browser1b);
        } else if(device =="desktop") {
            os = randomArray(os3);
            if(os == "Mac OS") browser = randomArray(browser2a);
            else browser = randomArray(browser2b);
        } else {
            os = randomArray(os4);
            browser = randomArray(browser1b);
        }
        let id_shorten = await randomShortUrl();
        let ob_access = {ip: ip, time_click: time_click,location: location, device: device, id_shorten:id_shorten, browser:browser, os:os }
        let result = await Access.save(ob_access);
    }
}
// ####################################################################3




// Get the whole record corresponding to each urlshorten
const getAllRecordAccess = async (param) => {
    if(Array.isArray(param)){
        let arr_access = [];
        for (let i = 0; i < param.length; i++) {
            let arr = await Access.getRecordByIdShorten(param[i].id);// return array
            // console.log("HAHA" + i+":", arr);
            arr_access = arr_access.concat(arr);
        }
        // console.log("arr_access:", arr_access);
        return arr_access;
    } else {
        let arr_access = await Access.getRecordByIdShorten(param.id);
        return arr_access;
    }  
}
const getAllRecordAccessGr = async (ob_group) => {
    //console.log("ob_group:", ob_group);
    let arr = [];
   
    for (const key of Object.keys(ob_group)) {
        let object = {};
        let obj = ob_group[key];
        let rs = await Access.getRecordByIdShorten(ob_group[key].id);
        object.name = key; 
        object.arr_access = rs;
        arr.push(object);
    }
    // console.log("arr1:", arr[0].name);
    // console.log("ARR1:", arr[0].arr_access[0]);
    // console.log("arr2:", arr[1]);
    return arr;
}





//******************************************************************************** 
// filter arr_access
const filterArrAccess = (arr_access, start_time, end_time) => {
    let arr_filter = [];
    // console.log("Length:", arr_access.length);
    // console.log(arr_access);
    for(let i = 0; i < arr_access.length; i++) {
        let time_access = arr_access[i].time_click.date;
        // console.log("time_access:", time_access);
        if(checkTimeSuitable(start_time, end_time,time_access)){
            arr_filter.push(arr_access[i]);
        }
    }
    return arr_filter;
}
const filterArrAccessGr = (arr_accessGr, start_time, end_time) => {
    for(let i = 0; i < arr_accessGr.length; i++){
        // console.log("Before:",arr_accessGr[i].arr_access.length)
        arr_accessGr[i].arr_access = filterArrAccess(arr_accessGr[i].arr_access, start_time, end_time);
        // console.log("After:",arr_accessGr[i].arr_access.length);
    }
    return arr_accessGr;
}
//check time suitable
let checkTimeSuitable = (start_time, end_time, time_access) => {
    // console.log("start:", start_time);
    // console.log("end:",start_time);
    // console.log("access:", time_access);
    let rs1 = compareDate(start_time,time_access ); // true if start_time <= time_access
    let rs2 = compareDate(time_access, end_time); // true if end_time <= time_access
    //want start_time <= time_access => rs1 = true;
    //want time_access <= end_time => rs2 = true;
    if(rs1 == true && rs2 == true) return true;
    
    else return false;
}
// get end_time, return false if time_now <= end_time
let returnEndTime = (end_time) => {
    // Get the time smaller
    let time;
    let now = new Date();
    let time_now = date1.format(now, 'MM/DD/YYYY'); 
    let rs = compareDate(time_now, end_time);// true if time_now <= end_time
    if(rs == true) time = time_now;
    else time = end_time;
    return time;
}
 //compare Date
 let compareDate = (start, end) => {
    //format : 10/08/2018 => 08/october/2018
    let day_start = start.slice(3,5);
    let month_start = start.slice(0,2);
    let year_start = start.slice(6,10);

    let day_end = end.slice(3,5);
    let month_end = end.slice(0,2);
    let year_end = end.slice(6,10);
    if(year_start == year_end && month_start == month_end && day_start == day_end){
        return true;
    }
    if(year_start < year_end) return true;
    else if(year_start > year_end) return false;
    else if(year_start == year_end){
        if(month_start < month_end) return true;
        else if(month_start > month_end) return false;
        else if(month_start == month_end){
            if(day_start < day_end) return true;
            else if(day_start > day_end) return false;
        }
    }
}
// **************************************************************************************




 




//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// average day in month
const caculateAverageDay = async (arr, start, end) => {
    let arr_month = classifyMonth(arr);
    //console.log("arr:", arr);
    let m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12;
    m1 = InfoAccessInMonth(arr_month[0],"day");
    m2 = InfoAccessInMonth(arr_month[1], "day");
    m3 = InfoAccessInMonth(arr_month[2], "day");
    m4 = InfoAccessInMonth(arr_month[3], "day");
    m5 = InfoAccessInMonth(arr_month[4], "day");
    m6 = InfoAccessInMonth(arr_month[5], "day");
    m7 = InfoAccessInMonth(arr_month[6], "day");
    m8 = InfoAccessInMonth(arr_month[7], "day");
    m9 = InfoAccessInMonth(arr_month[8], "day");
    m10 = InfoAccessInMonth(arr_month[9],"day");
    m11 = InfoAccessInMonth(arr_month[10], "day");
    m12 = InfoAccessInMonth(arr_month[11], "day");
    let sum = getTotalClick(m1) + getTotalClick(m2)+ getTotalClick(m3)+getTotalClick(m4)+getTotalClick(m5)+
    getTotalClick(m6)+getTotalClick(m7)+getTotalClick(m8)+getTotalClick(m9)+getTotalClick(m10)+
    getTotalClick(m11)+getTotalClick(m12); 
    // console.log("m1:",JSON.stringify(m1));console.log("m2:", JSON.stringify(m2));console.log("m3:", JSON.stringify(m3));
    // console.log("m4:", JSON.stringify(m4));console.log("m5:", JSON.stringify(m5));console.log("m6:", JSON.stringify(m6));
    // console.log("m7:", JSON.stringify(m7));console.log("m8:", JSON.stringify(m8));console.log("m9:", JSON.stringify(m9));
    // console.log("m10:", JSON.stringify(m10));console.log("m11:", JSON.stringify(m11));console.log("m12:", JSON.stringify(m12));
    // console.log("KIEM TRA:", arr_month);
    let object = {Jan:m1,Feb:m2,Mar:m3,Apr:m4,May:m5,June:m6,July:m7,Aug:m8,Sept:m9,Oct:m10,Nov:m11,Dec:m12};
    let average_day = averageDay(object,start,end);
    // console.log("average_day:", JSON.stringify(average_day));
    return {average:average_day, sum:sum};
}
let getTotalClick = (month) => {
    let sum = 0;
    for(let i = 0; i < month.length; i++){
        sum += month[i];
    }
    return sum;
}
//average hour in day
const caculateAverageHour = async (arr_accessGr,start, end) => {
    let totalDay = getTotalDayCampaign(start, end); //console.log("TotalDay:", totalDay);
    for(let i = 0; i < arr_accessGr.length; i++){
        let h1 = 0, h2 = 0, h3 = 0, h4 = 0, h5 = 0, h6 = 0, h7 = 0, h8 = 0, h9 = 0, h10 = 0, h11 = 0, h12 = 0;
        let h13 = 0, h14 = 0, h15 = 0, h16 = 0, h17 = 0, h18 = 0, h19 = 0, h20 = 0, h21 = 0, h22 = 0, h23 = 0, h24 = 0;
        let arr = arr_accessGr[i].arr_access;
        for(let j = 0; j < arr.length; j++){
            let hour = arr[j].time_click.hour;
            if(hour == "01") h1 ++;
            else if(hour == "02") h2 ++; 
            else if(hour == "03") h3 ++;
            else if(hour == "04") h4 ++;
            else if(hour == "05") h5 ++;
            else if(hour == "06") h6 ++;
            else if(hour == "07") h7 ++;
            else if(hour == "08") h8 ++;
            else if(hour == "09") h9 ++;
            else if(hour == "10") h10 ++;
            else if(hour == "11") h11 ++;
            else if(hour == "12") h12 ++;
            else if(hour == "13") h13 ++;
            else if(hour == "14") h14 ++;
            else if(hour == "15") h15 ++;
            else if(hour == "16") h16 ++;
            else if(hour == "17") h17 ++;
            else if(hour == "18") h18 ++;
            else if(hour == "19") h19 ++;
            else if(hour == "20") h20 ++;
            else if(hour == "21") h21 ++;
            else if(hour == "22") h22 ++;
            else if(hour == "23") h23 ++;
            else if(hour == "00") h24 ++;
        }
        let tempHour = [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17, h18,
            h19, h20, h21, h22, h23, h24];
        // console.log("BeforeTempHour:", JSON.stringify(tempHour));
        let tbHour1 = tbHour(tempHour, totalDay);
        arr_accessGr[i].tbHour = tbHour1;
        // console.log("After:", tbHour1);
        //console.log("tb_Hour:", arr_accessGr[i].tbHour);
    }
    return arr_accessGr;
}
//_______________________________get total day campaign_________________________________
let getTotalDayCampaign = (start, end) => {
    let total = 0;
    let year_s = returnYear(start); let year_e = returnYear(end);
    let month_s = returnMonth(start); let month_e = returnMonth(end);
    let day_s = returnDay(start); let day_e = returnDay(end);
    if(year_s == year_e) {
        if(month_s == month_e) total = Number(day_e) - Number(day_s) + 1;
        else if(month_s < month_e) {
            total = totalMonths(month_s, month_e) - (Number(day_s) - 1) - dayRemainEnd(month_e, day_e);
        }
    } else if(year_s < year_e) {
        total = totalMonths(month_s, 12) + totalMonths(1, month_e) - (Number(day_s) -1) - dayRemainEnd(month_e, day_e);
    }
    // console.log("Total:", total);
    return total;
}
let is31 = (month) => {
    if(month =="01" || month == "03" || month == "05"|| month == "07" || month == "08" || month == "10" || month == "12"){
        return true;
    } else return false;
}
let dayRemainEnd = (month_e, day_e) => {
    let dayRemainEn = 0;
    if(is31(month_e)) dayRemainEn = 31 - Number(day_e);
    else dayRemainEn = 30 - Number(day_e); 
    // console.log("dayRemainEn:", dayRemainEn);
    return dayRemainEn;
}
let totalMonths = (month_s, month_e) => {
    let total = 0;
    for(let i = Number(month_s); i <= Number(month_e) ; i ++) {
        if(i == 1 || i == 3|| i == 5|| i == 7|| i == 8|| i == 10|| i == 12 ) {
            total += 31;
        } else total += 30;
    }
    // console.log("totalMonths:", total);
    return total;
}
let tbHour = (arr_hour, totalDay) => {
    for(let i = 0; i < arr_hour.length; i++){
        arr_hour[i] = Math.round(arr_hour[i]/totalDay);
    }
    return arr_hour;
}
// ________________________________end get day campaign_________________________________
// Classify month
let classifyMonth = (arr) => {
    // console.log("arr:", arr);
    let Jan = [], Feb = [], Mar =[], Apr = [], May = [], June = [], July = [], Aug= [], Sept = [];
    let Oct = [],  Nov = [], Dec = []; 
    for(let i = 0; i < arr.length; i++){
        let month = returnMonth(arr[i].time_click.date);
        // console.log("MONTH:",month);
        if(month == "01") Jan.push(arr[i]);
        else if(month == "02") Feb.push(arr[i]);
        else if(month == "03") Mar.push(arr[i]);
        else if(month == "04") Apr.push(arr[i]);
        else if(month == "05") May.push(arr[i]);
        else if(month == "06") June.push(arr[i]);
        else if(month == "07") July.push(arr[i]);
        else if(month == "08") Aug.push(arr[i]);
        else if(month == "09") Sept.push(arr[i]);
        else if(month == "10") Oct.push(arr[i]);
        else if(month == "11") Nov.push(arr[i]);
        else if(month == "12") Dec.push(arr[i]);
    }
    // console.log("Thang1:", Jan);console.log("Thang2:", Feb);console.log("Thang3:", Mar);
    // console.log("Thang4:", Apr);console.log("Thang5:", May); console.log("Thang6:", June);
    // console.log("Thang7:", July);console.log("Thang8:", Aug); console.log("Thang9:", Sept);
    // console.log("Thang10:", Oct);console.log("Thang11:", Nov); console.log("Thang12:", Dec);
    
    return temp = [Jan, Feb, Mar, Apr, May, June, July, Aug, Sept, Oct, Nov, Dec];
}
// Information total click access day in month
let InfoAccessInMonth = (arr, argument) => {
    // typeof argument = string, argument = day || hour
    let day1 = 0, day2 = 0, day3 = 0,day4 = 0, day5 = 0, day6 = 0, day7 = 0, day8 = 0, day9 = 0,
     day10 = 0, day11 = 0, day12 = 0, day13 = 0, day14 = 0, day15 = 0, day16 = 0, day17 = 0, day18 = 0, 
     day19 = 0, day20 = 0, day21 = 0, day22 = 0, day23 = 0, day24 = 0, day25 = 0, day26 = 0, day27 = 0, 
     day28 = 0, day29 = 0, day30 = 0, day31 = 0;
    let h1 = 0, h2 = 0, h3 = 0, h4 = 0, h5 = 0, h6 = 0, h7 = 0, h8 = 0, h9 = 0, h10 = 0, h11 = 0, h12 = 0;
    let h13 = 0, h14 = 0, h15 = 0, h16 = 0, h17 = 0, h18 = 0, h19 = 0, h20 = 0, h21 = 0, h22 = 0, h23 = 0, h24 = 0;
    for(let i = 0; i < arr.length; i++){
        let day = returnDay(arr[i].time_click.date);
        let hour = arr[i].time_click.hour;
        //console.log("day:", day);
        if(day == "01") day1 ++;
        else if(day =="02") day2 ++;
        else if(day =="03") day3 ++; 
        else if(day =="04") day4 ++;
        else if(day =="05") day5 ++;
        else if(day =="06") day6 ++;
        else if(day =="07") day7 ++;
        else if(day =="08") day8 ++;
        else if(day =="09") day9 ++;
        else if(day =="10") day10 ++;
        else if(day =="11") day11 ++;
        else if(day =="12") day12 ++;
        else if(day =="13") day13 ++;
        else if(day =="14") day14 ++;
        else if(day =="15") day15 ++;
        else if(day =="16") day16 ++;
        else if(day =="17") day17 ++;
        else if(day =="18") day18 ++;
        else if(day =="19") day19 ++;
        else if(day =="20") day20 ++;
        else if(day =="21") day21 ++;
        else if(day =="22") day22 ++;
        else if(day =="23") day23 ++;
        else if(day =="24") day24 ++;
        else if(day =="25") day25 ++;
        else if(day =="26") day26 ++;
        else if(day =="27") day27 ++;
        else if(day =="28") day28 ++;
        else if(day =="29") day29 ++;
        else if(day =="30") day30 ++;
        else if(day =="31") day31 ++;
        if(hour == "01") h1 ++;
        else if(hour == "02") h2 ++; 
        else if(hour == "03") h3 ++;
        else if(hour == "04") h4 ++;
        else if(hour == "05") h5 ++;
        else if(hour == "06") h6 ++;
        else if(hour == "07") h7 ++;
        else if(hour == "08") h8 ++;
        else if(hour == "09") h9 ++;
        else if(hour == "10") h10 ++;
        else if(hour == "11") h11 ++;
        else if(hour == "12") h12 ++;
        else if(hour == "13") h13 ++;
        else if(hour == "14") h14 ++;
        else if(hour == "15") h15 ++;
        else if(hour == "16") h16 ++;
        else if(hour == "17") h17 ++;
        else if(hour == "18") h18 ++;
        else if(hour == "19") h19 ++;
        else if(hour == "20") h20 ++;
        else if(hour == "21") h21 ++;
        else if(hour == "22") h22 ++;
        else if(hour == "23") h23 ++;
        else if(hour == "00") h24 ++;
    }
    let tempDay = [day1, day2, day3, day4, day5, day6, day7, day8, day9, day10, day11, day12, day13,
    day14, day15, day16, day17, day18, day19, day20, day21, day22, day23, day24, day25, day26, day27,
    day28, day29, day30, day31];
    let tempHour = [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17, h18,
    h19, h20, h21, h22, h23, h24];
    if(argument == "day") return tempDay;
    else if( argument == "hour") return tempHour;
}
//Caculate average access day (1 -> 31)
let averageDay = (object,start_time,end_time) => {
    let d1 = tbDay(object, 1, start_time, end_time);
    let d2 = tbDay(object, 2, start_time, end_time);
    let d3 = tbDay(object, 3, start_time, end_time);
    let d4 = tbDay(object, 4, start_time, end_time);
    let d5 = tbDay(object, 5, start_time, end_time);
    let d6 = tbDay(object, 6, start_time, end_time);
    let d7 = tbDay(object, 7, start_time, end_time);
    let d8 = tbDay(object, 8, start_time, end_time);
    let d9 = tbDay(object, 9, start_time, end_time);
    let d10 = tbDay(object, 10, start_time, end_time);
    let d11 = tbDay(object, 11, start_time, end_time);
    let d12 = tbDay(object, 12, start_time, end_time);
    let d13 = tbDay(object, 13, start_time, end_time);
    let d14 = tbDay(object, 14, start_time, end_time);
    let d15 = tbDay(object, 15, start_time, end_time);
    let d16 = tbDay(object, 16, start_time, end_time);
    let d17 = tbDay(object, 17, start_time, end_time);
    let d18 = tbDay(object, 18, start_time, end_time);
    let d19 = tbDay(object, 19, start_time, end_time);
    let d20 = tbDay(object, 20, start_time, end_time);
    let d21 = tbDay(object, 21, start_time, end_time);
    let d22 = tbDay(object, 22, start_time, end_time);
    let d23 = tbDay(object, 23, start_time, end_time);
    let d24 = tbDay(object, 24, start_time, end_time);
    let d25 = tbDay(object, 25, start_time, end_time);
    let d26 = tbDay(object, 26, start_time, end_time);
    let d27 = tbDay(object, 27, start_time, end_time);
    let d28 = tbDay(object, 28, start_time, end_time);
    let d29 = tbDay(object, 29, start_time, end_time);
    let d30 = tbDay(object, 30, start_time, end_time);
    let d31 = tbDay(object, 31, start_time, end_time);
    return temp = [d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14,d15,d16,d17,d18,d19,d20,d21,d22,d23,
    d24,d25,d26,d27,d28,d29,d30,d31];  
}
let tbDay = (object, day, start, end) => {
    let period = period1(start, end, day);//console.log("PERIOD:", period);
    let count31 = numberofDate31(start,end); //console.log("Count31:", count31);
    
    let d = day - 1;
    let temp = object.Jan[d] + object.Feb[d] + object.Mar[d] + object.Apr[d] + object.May[d] + 
    object.June[d] + object.July[d] + object.Aug[d] + object.Sept[d] + object.Oct[d] + object.Nov[d] +
    object.Dec[d];
    if(d == 30) temp = temp /(count31);
    else temp = temp/(period);
    
    return Math.round(temp);
}
let period1 = (start, end, day) => {
    let period;
    let year_s = returnYear(start); let year_e = returnYear(end);
    let month_s = returnMonth(start); let month_e = returnMonth(end);
    let day_s = returnDay(start); let day_e = returnDay(end);
    if(year_s == year_e) {
        if(month_s == month_e) period = 1;
        else if(month_s < month_e) {
            //console.log("Nho hon");
            period = month_e - month_s + 1;//console.log("period1:", period);
            if(day < day_s && day_e < day) period = period - 2;
            else if(day < day_s || day_e < day) period = period - 1;
        }
    } else if(year_s < year_e) {
        period = (12 - month_s + 1) + month_e;
    }
    return period;
}
let numberofDate31 = (start_time, end_time) => {
    // note: time campaign max = 1 year;
    // console.log("START:", start_time);
    // console.log("END:", end_time);
    let count = 0;
    let year_start = returnYear(start_time);
    let year_end = returnYear(end_time);
    let x = returnMonth(start_time);
    let y = returnMonth(end_time);
    if(Number(x) == Number(y) && Number(year_start) == Number(year_end)){
        return 0;
    }
    else if(Number(x) < Number(y)){
        for(x; x <= y; x ++) {
            if(x == "01" || x == "03" ||x == "05" ||x == "07" ||x == "08" ||x == "10" ||x == "12"){
                if(x < 10) x = "0"+x;
                let time_check = x + "/31" + "/"+ year_start; //console.log("time_check:", time_check);
                if(checkTimeSuitable(start_time, end_time, time_check)) count ++;
            }
        }
    } else {
        for(x; x <= 12; x ++) {
            if(x == "01" || x == "03" ||x == "05" ||x == "07" ||x == "08" ||x == "10" ||x == "12"){
                if(x < 10) x = "0"+x;
                let time_check = x + "/31" + "/"+ year_start; console.log("time_check:", time_check);
                if(checkTimeSuitable(start_time, end_time, time_check)) count ++;
            }
        }
        for(let j = 1; j <= y; j++){
            if(j == "01" || j == "03" ||j == "05" ||j == "07" ||j == "08" ||j == "10" ||j == "12"){
                if(j < 10 ) j = "0"+j;
                let time_check = j + "/31" + "/"+ year_end; console.log("time_check:", time_check);
                if(checkTimeSuitable(start_time, end_time, time_check)) count ++;
            }
        }
    }
    // console.log("Count:", count);
    return count++;
}
let returnDay = (date) => {
    // format date: mm/dd/yyyy ; example: 01/31/2018
    let day = date.slice(3,5);
    return day;
}
let returnMonth = (date) => {
    // format date: mm/dd/yyyy ; example: 01/31/2018
    let month = date.slice(0,2);
    return month;
}
let returnYear = (date) => {
    let year = date.slice(6,10);
    return year;
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



// get info chart (browser, device, location ...)
const getInfoChart = (arr) => {
    let aGiang = 0, brvTau = 0, bGiang = 0, bKan = 0, bLieu = 0, bNinh = 0, bTre = 0, bDinh = 0, bDuong = 0,
    bPhuoc = 0, bThuan = 0, cMau = 0, cBang = 0, dLak = 0, dNong = 0, dBien = 0, dNai = 0, dThap = 0, gLai = 0,
    haGiang = 0, hNam = 0, hTinh = 0, hDuong = 0, hauGiang = 0, hBinh = 0, hYen = 0, kHoa = 0, kGiang = 0,
    kTum =0, lChau = 0, lDong = 0, lSon = 0, lCai = 0, lAn = 0, nDinh = 0, nAn = 0, nBinh = 0, nThuan = 0,
    pTho = 0, qBinh = 0, qNam = 0, qNgai = 0, qNinh = 0, qTri = 0, sTrang = 0, sLa = 0, tNinh = 0, tBinh = 0,
    tNguyen = 0, tHoa = 0, ttHue = 0, tGiang = 0, tVinh = 0, tQuang = 0, vLong = 0, vPhuc = 0, yBai = 0,
    pYen = 0, cTho = 0, dNang = 0, hPhong = 0, hNoi = 0, hcMinh = 0, nNgoai = 0 ;

    let desktop = 0, phone = 0, tablet = 0, otherdevice = 0;
    let mac = 0, linux = 0, window = 0, android = 0, ios = 0, otherdesktop = 0, otherphone = 0;
    let chrome = 0, ie = 0, opera = 0, firefox = 0, safari = 0, coccoc = 0, fb = 0, otherbrowser = 0;

    for(let i = 0; i < arr.length; i++) {
        //device
        if(arr[i].device == "desktop") desktop ++;
        else if(arr[i].device == "phone") phone ++;
        else if(arr[i].device == "tablet") tablet ++;
        else if(arr[i].device == "other") otherdevice ++;
        //browser
        if(arr[i].browser == "Chrome") chrome ++;
        else if(arr[i].browser == "IE") ie ++;
        else if(arr[i].browser == "Opera") opera ++;
        else if(arr[i].browser == "Firefox") firefox ++;
        else if(arr[i].browser == "Safari") safari ++;
        else if(arr[i].browser == "Coc Coc") coccoc ++;
        else if(arr[i].browser == "Facebook") fb ++;
        else if(arr[i].browser == "Other") otherbrowser ++;
        //os
        if(arr[i].os == "Android") android ++;
        else if(arr[i].os == "iOS") ios ++;
        else if(arr[i].os == "Otherphone") otherphone ++;
        else if(arr[i].os == "Mac OS") mac ++;
        else if(arr[i].os == "Linux") linux ++;
        else if(arr[i].os == "Windows") window ++;
        else if(arr[i].os == "Otherdesktop") otherdesktop ++;
        //location
        if(arr[i].location == "An Giang") aGiang ++;
        else if(arr[i].location == "Bà Rịa - Vũng Tàu") brvTau ++;
        else if(arr[i].location == "Bắc Giang") bGiang ++;
        else if(arr[i].location == "Bắc Kạn")  bKan++;
        else if(arr[i].location == 'Bạc Liêu') bLieu ++;
        else if(arr[i].location == 'Bắc Ninh') bNinh ++;
        else if(arr[i].location == 'Bến Tre') bTre ++;
        else if(arr[i].location == 'Bình Định') bDinh ++;
        else if(arr[i].location == 'Bình Dương') bDuong ++;
        else if(arr[i].location == 'Bình Phước') bPhuoc ++;
        else if(arr[i].location == 'Bình Thuận') bThuan ++;
        else if(arr[i].location == 'Cà Mau') cMau ++;
        else if(arr[i].location == 'Cao Bằng') cBang ++;
        else if(arr[i].location == 'Đắk Lắk') dLak ++;
        else if(arr[i].location == 'Đắk Nông') dNong ++;
        else if(arr[i].location == 'Điện Biên') dBien ++;
        else if(arr[i].location == 'Đồng Nai') dNai ++;
        else if(arr[i].location == 'Đồng Tháp') dThap ++;
        else if(arr[i].location == 'Gia Lai') gLai ++;
        else if(arr[i].location == 'Hà Giang') haGiang++;
        else if(arr[i].location == 'Hà Nam') hNam++;
        else if(arr[i].location == 'Hà Tĩnh') hTinh++;
        else if(arr[i].location == 'Hải Dương') hDuong++;
        else if(arr[i].location == 'Hậu Giang') hauGiang++;
        else if(arr[i].location == 'Hòa Bình') hBinh++;
        else if(arr[i].location == 'Hưng Yên') hYen++;
        else if(arr[i].location == 'Khánh Hòa') kHoa++;
        else if(arr[i].location == 'Kiên Giang') kGiang++;
        else if(arr[i].location == 'Kon Tum') kTum++;
        else if(arr[i].location == 'Lai Châu') lChau++;
        else if(arr[i].location == 'Lâm Đồng') lDong++;
        else if(arr[i].location == 'Lạng Sơn') lSon++;
        else if(arr[i].location == 'Lào Cai') lCai++;
        else if(arr[i].location == 'Long An') lAn++;
        else if(arr[i].location == 'Nam Định') nDinh++;
        else if(arr[i].location == 'Nghệ An') nAn++;
        else if(arr[i].location == 'Ninh Bình') nBinh++;
        else if(arr[i].location == 'Ninh Thuận') nThuan++;
        else if(arr[i].location == 'Phú Thọ') pTho++;
        else if(arr[i].location == 'Quảng Bình') qBinh++;
        else if(arr[i].location == 'Quảng Nam') qNam++;
        else if(arr[i].location == 'Quảng Ngãi') qNgai++;
        else if(arr[i].location == 'Quảng Ninh') qNinh++;
        else if(arr[i].location == 'Quảng Trị') qTri++;
        else if(arr[i].location == 'Sóc Trăng') sTrang++;
        else if(arr[i].location == 'Sơn La') sLa++;
        else if(arr[i].location == 'Tây Ninh') tNinh++;
        else if(arr[i].location == 'Thái Bình') tBinh++;
        else if(arr[i].location == 'Thái Nguyên') tNguyen++;
        else if(arr[i].location == 'Thanh Hóa') tHoa++;
        else if(arr[i].location == 'Thừa Thiên Huế ') ttHue++;
        else if(arr[i].location == 'Tiền Giang') tGiang++;
        else if(arr[i].location == 'Trà Vinh') tVinh++;
        else if(arr[i].location == 'Tuyên Quang') tQuang++;
        else if(arr[i].location == 'Vĩnh Long') vLong++;
        else if(arr[i].location == 'Vĩnh Phúc') vPhuc++;
        else if(arr[i].location == 'Yên Bái') yBai++;
        else if(arr[i].location == 'Phú Yên') pYen++;
        else if(arr[i].location == 'Cần Thơ') cTho++;
        else if(arr[i].location == 'Đà Nẵng') dNang++;
        else if(arr[i].location == 'Hải Phòng') hPhong++;
        else if(arr[i].location == 'Hà Nội') hNoi++;
        else if(arr[i].location == 'TP HCM') hcMinh++;
        else if(arr[i].location == 'Nước Ngoài') nNgoai++;
    }
  
    let objLocation = {'An Giang':aGiang,'Bà Rịa - Vũng Tàu': brvTau,'Bắc Giang':bGiang,'Bắc Kạn':bKan,'Bạc Liêu':bLieu,
    'Bắc Ninh':bNinh,'Bến Tre':bTre,'Bình Định':bDinh,'Bình Dương':bDuong,'Bình Phước':bPhuoc,'Bình Thuận':bThuan,
    'Cà Mau':cMau,'Cao Bằng':cBang,'Đắk Lắk':dLak,'Đắk Nông':dNong,'Điện Biên':dBien,'Đồng Nai':dNai,'Đồng Tháp':dThap
    ,'Gia Lai':gLai,'Hà Giang':haGiang,'Hà Nam':hNam,'Hà Tĩnh':hTinh,'Hải Dương':hDuong,'Hậu Giang':hauGiang,
    'Hòa Bình':hBinh,'Hưng Yên':hYen,'Khánh Hòa':kHoa,'Kiên Giang':kGiang,'Kon Tum':kTum,'Lai Châu':lChau,
    'Lâm Đồng':lDong,'Lạng Sơn':lSon,'Lào Cai':lCai,'Long An':lAn,'Nam Định':nDinh,'Nghệ An':nAn,'Ninh Bình':nBinh,
    'Ninh Thuận':nThuan,'Phú Thọ':pTho,'Quảng Bình':qBinh,'Quảng Nam':qNam,'Quảng Ngãi':qNgai,'Quảng Ninh':qNinh,
    'Quảng Trị':qTri,'Sóc Trăng':sTrang,'Sơn La':sLa,'Tây Ninh':tNinh,'Thái Bình':tBinh,'Thái Nguyên':tNguyen,
    'Thanh Hóa':tHoa,'Thừa Thiên Huế ':ttHue,'Tiền Giang':tGiang,'Trà Vinh':tVinh,'Tuyên Quang':tQuang,
    'Vĩnh Long':vLong,'Vĩnh Phúc':vPhuc,'Yên Bái':yBai,'Phú Yên':pYen,'Cần Thơ':cTho,'Đà Nẵng':dNang,
    'Hải Phòng':hPhong,'Hà Nội':hNoi,'TP HCM':hcMinh,'Nước Ngoài':nNgoai};
    objLocation = filterLocation(objLocation);
    let device = {desktop:desktop, phone:phone, tablet:tablet, other:otherdevice};
    let osDesktop = {mac: mac, linux: linux, window: window, otherdesktop: otherdesktop};
    let osPhone = {android: android, ios: ios, otherphone: otherphone};
    let browser = {chrome: chrome, ie: ie, opera: opera, firefox: firefox, safari: safari, coccoc:coccoc,
    fb:fb, otherbrowser: otherbrowser};
    let objInfo = {device: device, osDesktop: osDesktop, osPhone, osPhone, browser: browser,
         objLocation: objLocation};
    return objInfo;
}
let filterLocation = (objLocation) => {
    for (const key of Object.keys(objLocation)) {
        if(objLocation[key] == 0) delete objLocation[key];
    }
    return objLocation;
}



module.exports = {
    date,
    location,
    getOs,
    getBrowser,
    dummyData,
    getAllRecordAccess,
    getAllRecordAccessGr,
    filterArrAccess,
    filterArrAccessGr,
    caculateAverageDay,
    caculateAverageHour,
    returnEndTime,
    getInfoChart,
    
}