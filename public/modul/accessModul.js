const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const device = require('express-device');
const date1 = require('date-and-time');
const useragent = require('useragent');

let date = () => {
    let now = new Date();
    let date = date1.format(now, 'MM/DD/YYYY');  // => '12:34 p.m.'
    let hour = date1.format(now,'HH');
    let ob_time = {date: date, hour: hour};//console.log("ob_time:", ob_time);
    return ob_time;
}
let location = (geo) => {
    let location;
    if (geo["country"] == "VN") location  = geo.city;
    else location = "foreign";
    return location;
}
let getOs = (info) => {
    let os;
    if(info.search('Android') > 0 ) {
        os = "Android";
    } else if(info.search('i0S') > 0) {
        os = "iOS";
    } else {
        os = "undefine!!!";
    }
    return os;
}


module.exports = {
    date,
    location,
    getOs,
}