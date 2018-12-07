


/*  Return number of days between d0 and d1.
**  Returns positive if d0 < d1, otherwise negative.
**
**  e.g. between 2000-02-28 and 2001-02-28 there are 366 days
**       between 2015-12-28 and 2015-12-29 there is 1 day
**        
**  @param {Date} d0  - start date
**  @param {Date} d1  - end date
**  @returns {number} - whole number of days between d0 and d1
**
*/

let daysDifference = (d0, d1) => {
    var diff = new Date(+d1).setHours(12) - new Date(+d0).setHours(12);
    return Math.round(diff / 8.64e7);
}

// Simple formatter
let formatDate = (date) => {
    return [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');
}

// Examples
let checkOneYear = (ys, ms, ds, ye, me, de) => {
    // let arrDate = [new Date(ys, ms, ds), new Date(ye, me, de)]
    let start = new Date(ys, ms, ds);
    let end =  new Date(ye, me, de);
    let distance = daysDifference(start, end);
    if( (Number(ys)+1) == Number(ye) && ms == me && ds == de){
        if(Number(distance) == 366 || Number(distance) == 365) return true;
        else return false;
    }
    else if(Number(distance) > 365 ) return false;
    else return true;
}

let a = checkOneYear('2002', '1', '28', '2003', '1', '29');
console.log(a);








// let obj = {'Hà Nội': 1, 'Hồ Chí Minh':0, "Đà Nẵng":1};
// let filterLocation = (objLocation) => {
//     for (const key of Object.keys(objLocation)) {
//         if(objLocation[key] == 0) delete objLocation[key];
//     }
//     return objLocation;
// }
// let a = filterLocation(obj);
// console.log(a);




// //get total day campaign
// let getTotalDayCampaing = (start, end) => {
//     let total = 0;
//     let year_s = returnYear(start); let year_e = returnYear(end);
//     let month_s = returnMonth(start); let month_e = returnMonth(end);
//     let day_s = returnDay(start); let day_e = returnDay(end);
//     if(year_s == year_e) {
//         if(month_s == month_e) total = Number(day_e) - Number(day_s) + 1;
//         else if(month_s < month_e) {
//             total = totalMonths(month_s, month_e) - (Number(day_s) - 1) - dayRemainEnd(month_e, day_e);
//         }
//     } else if(year_s < year_e) {
//         total = totalMonths(month_s, 12) + totalMonths(1, month_e) - (Number(day_s) -1) - dayRemainEnd(month_e, day_e);
//     }
//     console.log("Total:", total);
//     return total;
// }
// let is31 = (month) => {
//     if(month =="01" || month == "03" || month == "05"|| month == "07" || month == "08" || month == "10" || month == "12"){
//         return true;
//     } else return false;
// }
// let dayRemainEnd = (month_e, day_e) => {
//     let dayRemainEn = 0;
//     if(is31(month_e)) dayRemainEn = 31 - Number(day_e);
//     else dayRemainEn = 30 - Number(day_e); 
//     console.log("dayRemainEn:", dayRemainEn);
//     return dayRemainEn;
// }
// let totalMonths = (month_s, month_e) => {
//     let total = 0;
//     for(let i = Number(month_s); i <= Number(month_e) ; i ++) {
//         if(i == 1 || i == 3|| i == 5|| i == 7|| i == 8|| i == 10|| i == 12 ) {
//             total += 31;
//         } else total += 30;
//     }
//     console.log("totalMonths:", total);
//     return total;
// }
// let returnDay = (date) => {
//     // format date: mm/dd/yyyy ; example: 01/31/2018
//     let day = date.slice(3,5);
//     return day;
// }
// let returnMonth = (date) => {
//     // format date: mm/dd/yyyy ; example: 01/31/2018
//     let month = date.slice(0,2);
//     return month;
// }
// let returnYear = (date) => {
//     let year = date.slice(6,10);
//     return year;
// }
// //                                    end get day campaign

// let start = "12/03/2018"; let end = "01/23/2019";

// getTotalDayCampaing(start, end);


// let nhom1 = { 'group': 'nhom1','resource': 'fb','totalClick': 1210,'_id': '5bdac35d3990cc2f92304f8a','url': 'localhost:3000/a4','v': 0 };
// let nhom2 = { 'group': 'nhom2','resource': 'fb','totalClick': 1240,'_id': '5bdac35d3990cc2f92304f8b','url': 'localhost:3000/a5','__v': 0 };
// let ob_group = {nhom1: nhom1, nhom2: nhom2}
// for (const key of Object.keys(ob_group)) {
//     ob_group[key].test = [1,2,3,4,5];
// }
// console.log(ob_group);


// Array.prototype.unique = function() {
//     var arr = [];
//     for(var i = 0; i < this.length; i++) {
//         if(!arr.includes(this[i])) {
//             arr.push(this[i]);
//         }
//     }
//     return arr; 
// }
// let uniqueArr = (arr) => {
//     let arr_unique = [];
//     for (let i = 0; i < arr.length; i++) {
//         if(!arr_unique.includes(arr[i])){
//             arr_unique.push(arr[i]);
//         }
//     }
//     return arr_unique;
// }
// var duplicates = ['nhom1','nhom2','nhom1','nhom3'];
// var t = unique(duplicates); // result = [1,3,4,2,8]
// console.log("uniques:", t);



// let arr = ['nhom1', 'nhom2'];
// let object = {};
// object[arr[0]] = [];
// object[arr[1]] = [];
// console.log("object:",object);







// let returnDay = (date) => {
//     // format date: mm/dd/yyyy ; example: 01/31/2018
//     let day = date.slice(3,5);
//     return day;
// }
// let returnMonth = (date) => {
//     // format date: mm/dd/yyyy ; example: 01/31/2018
//     let month = date.slice(0,2);
//     return month;
// }
// let returnYear = (date) => {
//     let year = date.slice(6,10);
//     return year;
// }
// let compareDate = (start, end) => {
//     //format : 10/08/2018 => 08/october/2018
//     let day_start = start.slice(3,5);
//     let month_start = start.slice(0,2);
//     let year_start = start.slice(6,10);

//     let day_end = end.slice(3,5);
//     let month_end = end.slice(0,2);
//     let year_end = end.slice(6,10);
//     if(year_start == year_end && month_start == month_end && day_start == day_end){
//         return true;
//     }
//     if(year_start < year_end) return true;
//     else if(year_start > year_end) return false;
//     else if(year_start == year_end){
//         if(month_start < month_end) return true;
//         else if(month_start > month_end) return false;
//         else if(month_start == month_end){
//             if(day_start < day_end) return true;
//             else if(day_start > day_end) return false;
//         }
//     }
// }

// let checkTimeSuitable = (start_time, end_time, time_access) => {
//     // console.log("start:", start_time);
//     // console.log("end:",end_time);
//     // console.log("time_check:", time_access);
//     let rs1 = compareDate(start_time,time_access ); // true if start_time <= time_access
//     let rs2 = compareDate(time_access, end_time); // true if end_time <= time_access
//     //want start_time <= time_access => rs1 = true;
//     //want time_access <= end_time => rs2 = true;
//     console.log("rs1:", rs1); console.log("rs2:", rs2);
//     if(rs1 == true && rs2 == true) return true;

//     else return false;
// }


// let numberofDate31 = (start_time, end_time) => {
//     // note: time campaign max = 1 year;
//     // console.log("START:", start_time);
//     // console.log("END:", end_time);
//     let count = 0;
//     let year_start = returnYear(start_time);
//     let year_end = returnYear(end_time);
//     let x = returnMonth(start_time);
//     let y = returnMonth(end_time);
//     if(Number(x) == Number(y) && Number(year_start) == Number(year_end)){
//         count = 0;
//     }
//     else if(Number(x) < Number(y)){
//         for(x; x <= y; x ++) {
//             if(x == "01" || x == "03" ||x == "05" ||x == "07" ||x == "08" ||x == "10" ||x == "12"){
//                 if(x < 10) x = "0"+x;
//                 let time_check = x + "/31" + "/"+ year_start; console.log("time_check:", time_check);
//                 if(checkTimeSuitable(start_time, end_time, time_check)) count ++;
//             }
//         }
//     } else {
//         for(x; x <= 12; x ++) {
//             if(x == "01" || x == "03" ||x == "05" ||x == "07" ||x == "08" ||x == "10" ||x == "12"){
//                 if(x < 10) x = "0"+x;
//                 let time_check = x + "/31" + "/"+ year_start; console.log("time_check:", time_check);
//                 if(checkTimeSuitable(start_time, end_time, time_check)) count ++;
//             }
//         }
//         for(let j = 1; j <= y; j++){
//             if(j == "01" || j == "03" ||j == "05" ||j == "07" ||j == "08" ||j == "10" ||j == "12"){
//                 if(j < 10 ) j = "0"+j;
//                 let time_check = j + "/31" + "/"+ year_end; console.log("time_check:", time_check);
//                 if(checkTimeSuitable(start_time, end_time, time_check)) count ++;
//             }
//         }
//     }
//     console.log("Count:", count);
//     return count++;
// }
// let start_time = "12/03/2018"; let end_time = "12/31/2018";
// let test = () => {
//     let a = "01"; let b = "02";
//     if(a < b ) console.log(b - 1);
// }
//let t = numberofDate31(start_time, end_time);
//test();

// const Shorten = require('./c_models/shortenModel');
// let randomShortUrl = async () => {
//     let arr = await Shorten.getAllShortUrl();;
//     let len = arr.length;
//     let index = Math.floor((Math.random() * len));
//     return arr[index];
// }
// let test = async () => {
//     let a = await randomShortUrl();
// }

// test();








// let time_click = {};
// let hour = Math.floor((Math.random() * 24)); // 00h -> 24h
// hour = hour.toString();
// if(Number(hour) < 10) hour = '0'+hour;
// let month = Math.floor((Math.random() * 12) + 1);
// month = month.toString();
// let date1;
// if(Number(month) < 10) month = "0" + month;
// // console.log("month:", month);
// // console.log("typeof Month:", typeof month);
// if( month == "02"){
//     date1 = Math.floor((Math.random() * 28) + 1);
// } else if( month=="01"||month=="03"||month=="05"||month=="07"||month=="08"||month=="10"||month=="12"){
//     date1 = Math.floor((Math.random() * 31) + 1);
// } else if(month=="04"||month=="06"||month=="09"||month=="11"){
//     date1 = Math.floor((Math.random() * 30) + 1);
// }
// date1 = date1.toString();
// if(Number(date1) < 10 ) date1 = '0' + date1;

// let date = month + "/" + date1 +"/2018";
// time_click.date = date;
// time_click.hour = hour;
// console.log("time_click:", time_click);










// const request = require("request");
// const cheerio = require("cheerio");
// request("https://translate.google.com/#en/vi/hour", (err, res, body) => {
//     const $ = cheerio.load(body);
//     console.log($("title").text())
// })

// //***************************************************************/
// app.get("/test", (req, res) => {
//     let now = new Date();
//     let geo = {"range":[2064646144,2064654335],"country":"VN","region":"AS","eu":"0","timezone":"Asia/Ho_Chi_Minh","city":"Hanoi","ll":[21.0333,105.85],"metro":0,"area":1};
//     let date = date1.format(now, "MM/DD/YYYY");  // => "12:34 p.m."
//     let hour = date1.format(now,"HH");
//     let ob_time = {date: date, hour: hour}; console.log("ob_time:", ob_time);


//     let country = geo["country"]; let city = geo.city; console.log("country:" + country + " \ncity:" + city);
//     let agent1 = useragent.parse(req.headers["user-agent"]);
//     let agent2 = useragent.parse(req.headers["user-agent"], req.query.jsuseragent);
//     var agent3 = useragent.lookup(req.headers["user-agent"]);
//     var agent = useragent.parse(req.headers["user-agent"]);// agent.toAgent() ; agent.os.toString();agent.os.toVersion()

//     console.log("User agent:",  agent.device.toJSON());

//     //get khu vuc 
//     res.send("hello");


//     const ip = req.clientIp;
//     const geo = geoip.lookup(ip);
//     //const type = typeof geo;
//     const device = req.device.type;


//     var agent = useragent.parse(req.headers["user-agent"]); 
//     let info = agent.toString();
//     res.send("--> your ip: " + ip + ",  --> geo: " + JSON.stringify(geo) + "  --> Device:  " + thietbi + "   -->info: " + info + "  --> nameDevice: "+ agent.device.toString());


// })


// //***************************************************************/