const Shorten = require('../../c_models/shortenModel');
const User = require('../../c_models/userModel');
const Url = require('../../c_models/urlModel');
const Campaign = require('../../c_models/campaignModel');
const fs = require('fs');



let randomArray = (arr) => {
    let result = arr[Math.floor(Math.random() * arr.length)];
    return result;
}
let randomString = () => {
    let arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
    'S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m',
    'n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
    let str = "";
    for (let i = 0; i < 7; i++) {
        str = str + randomArray(arr);
    }
    return str;
}
// Create short Url
let createShortUrl = (domain1) => {
    let domain = fs.readFileSync('domain.txt', 'utf8');
    domain = domain.trim();
    let url = randomString();
    domain = domain + '/';
    let newUrl = domain + url;
    return newUrl; 
}
let checkExistForFb = async (arr) => {
            //console.log("mang nhan duoc:", arr);
    try{
        if(typeof arr == "string") {
            return (await Shorten.checkExist(arr));
        }
        else{
            for(let i = 0; i < arr.length ; i++ ) {
                let check =  await Shorten.checkExist(arr[i]);
                    //console.log("check seed:", check);
                if(check == false) return false; 
            }
            return true;
        }
        
    }catch(e) {
        console.log(e + "--tuan: checkExistForFb seedUrl");
    }
    
}

let checkFormatUrlShort = (url, domain1) => {
    // let domain = "localhost:3000/";
    let domain = fs.readFileSync('domain.txt', 'utf8');
    domain = domain.trim();
    domain = domain + '/';
    const regex = /^[a-zA-Z0-9]*$/;
    let len = domain.length; //console.log("LEN:", len);//ex: doamin: rutgon.ml/ => length 10
    let domainUrl = url.slice(0, len); //console.log("DOMAINUURL:", domainUrl);
    let path = url.slice(len, url.length);//console.log("PATH:", path);
    if(domainUrl == domain && path.length > 0 && regex.test(path) ){
        return true;
    } else return false;
}

let checkFormatFbShort = (arrFb, domain) => {
    if(typeof arrFb == "string") {
       return checkFormatUrlShort(arrFb, domain);
    }
    else {
        for (let j = 0; j < arrFb.length; j++) {
            if(checkFormatUrlShort(arrFb[j], domain) == false) {
                return false;
            } 
            // return checkFormatUrlShort(arrFb[j], domain); sai, phai kiem tra het mang moi ket luan
        }
        return true;
    }
}
let checkDuplicate = (arr) => {
            //console.log("Mang nhan duoc:", arr);
    for (let i = 0; i < arr.length -1 ; i++) {
        for(let j = i+1; j < arr.length; j++ ) {
            if(arr[i] == arr[j]){
                return true;
            }
        }
    }
    return false;
}
let converArrShort = (arrShortUrl) => {
    let arr_fb = [];
    let convertShort = {};
    for(let t = 0; t < arrShortUrl.length; t++) {
        if(arrShortUrl[t].resource == "email") convertShort.email = arrShortUrl[t];
        else if(arrShortUrl[t].resource == "sms") convertShort.sms = arrShortUrl[t];
        else if(arrShortUrl[t].resource == "other") convertShort.other = arrShortUrl[t];
        else if(arrShortUrl[t].resource == "fb") arr_fb.push(arrShortUrl[t]);
        // console.log("arrFb:",arr_fb );
    }
    let ob_group = uniqueArr(arr_fb);
    // console.log("ob_group:", ob_group);
    //console.log("convertShort.email:",convertShort.email );

    convertShort.fb = arr_fb;
    convertShort.ob_group = ob_group;
    return convertShort;
}
let removeCampaignNull = (arrCampaign) => {
    let arr = [];
    for(let i = 0; i < arrCampaign.length; i++){
        if(arrCampaign[i].name != null){
            arr.push(arrCampaign[i]);
        }
    }
    return arr;
}
//get array shorten url by arrary id shorten from URL
let getArrShortUrl = async (arr_idShort) => {
    // console.log("arr nhan duoc :", arr_idShort);
    let arrShortUrl = [];
    for(let i = 0; i < arr_idShort.length; i++){
        let temp = await Shorten.getObUrlShorten(arr_idShort[i]);
        arrShortUrl.push(temp);
    }
    // console.log("arr tra ve:", arrShortUrl);
    return arrShortUrl;
}
// unique Array
let uniqueArr = (arr) => {
    let ob_group = {};
    let arr_unique = [];
    for (let i = 0; i < arr.length; i++) {
        if(!arr_unique.includes(arr[i].group)){
            if(arr[i].group != null){
                arr_unique.push(arr[i].group);
                ob_group[arr[i].group] = arr[i];
            } 
        }
    }
    return ob_group;
}
// support admin delete user
let adminDeleteUser = async (id_user) => {
    let arrCamp = await Campaign.getAllCampaignByIDUser(id_user);
    let id_urls = getAllIdUrlFromCampaign(arrCamp);
    let id_shortens = await getAllIdShortenFromIdUrl(id_urls);
    // console.log("id_urls:", id_urls);
    // console.log("id_shortens:", id_shortens);
    let rs1 = await deleteArrShorten(id_shortens);
    let rs2 = await deleteArrUrl(id_urls);
    let rs3 = await deleteArrCamp(arrCamp);
    let rs4 = await User.delete(id_user);
}
//get all id url from campaign
let getAllIdUrlFromCampaign = (arrCamp) => {
    let arrUrl = [];
    for(let i = 0; i < arrCamp.length; i++) {
        arrUrl = arrUrl.concat(arrCamp[i].id_urls);
    }
    return arrUrl;
}
//get all id shorten from idurl
let getAllIdShortenFromIdUrl = async (arrIdUrl) => {
    let arrShorten = [];
    for (let i = 0; i < arrIdUrl.length ; i ++) {
        let obUrl = await Url.getObUrlById(arrIdUrl[i]);
        arrShorten = arrShorten.concat(obUrl.short_urls);
    }
    return arrShorten;
}
// delete arrShorten
let deleteArrShorten = async (id_shortens) => {
    for(let i = 0; i < id_shortens.length; i++) {
        let rs = await Shorten.delete(id_shortens[i]);
    }
}
// delete arrUrl
let deleteArrUrl = async (id_urls) => {
    for(let i = 0; i < id_urls.length; i++) {
        let rs = await Url.delete(id_urls[i]);
    }
}
// delete arrCamp
let deleteArrCamp = async (arrCamp) => {
    for(let i = 0; i < arrCamp.length; i++) {
        let rs = await Campaign.deleteCamp(arrCamp[i].id);
    }
}
module.exports = {
    createShortUrl,
    checkExistForFb,
    checkFormatUrlShort,
    checkFormatFbShort,
    checkDuplicate,
    converArrShort,
    removeCampaignNull,
    getArrShortUrl,
    adminDeleteUser
}























//Algorithm convert base10 to base62
// let convertBase62 = (number) => {
//     let digits = [];
//     let num = Number(number);
//     while ( num > 0 ) {
//         digits.push(num%62);
//         num = parseInt(num/62);
//     }
//     return digits.reverse();
// }
// // mapping a->z,A->Z,0->9 with 0->61
// let mapping = (arr) => {
//     let url ="";
//     for ( i = 0; i < arr.length; i++){
//         if( Number(arr[i]) >=0 &&  Number(arr[i]) <= 25 ){
//             url =  url +  String.fromCharCode( Number(arr[i]) + 97 );
//         }
//         if( Number(arr[i]) >= 26 &&  Number(arr[i]) <= 51 ) {
//             url = url +  String.fromCharCode( Number(arr[i]) + 39 );
//         }
//         if( Number(arr[i]) >= 52 &&  Number(arr[i]) <= 61){
//             url = url + (Number(arr[i]) - 52);
//         }
//     }
//     return url;
// }
// let createShortUrl = (domain1) => {
//     let domain = fs.readFileSync('domain.txt', 'utf8');
//     domain = domain.trim();
//     // console.log("DOMAIN read:", domain);
//     //let domain = "localhost:3000/";
//     domain = domain + '/';
//     let random = Math.floor(100000000000 +  Math.random() * 900000000000); //12 numbers
//     let base62 = convertBase62(random);
//     let url = mapping(base62);
//     let newUrl = domain + url;
//     return newUrl; 
// }