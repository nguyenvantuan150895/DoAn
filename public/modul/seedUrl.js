const Shorten = require('../../c_models/shortenModel');

//Algorithm convert base10 to base62
let convertBase62 = (number) => {
    let digits = [];
    let num = Number(number);
    while ( num > 0 ) {
        digits.push(num%62);
        num = parseInt(num/62);
    }
    return digits.reverse();
}

// mapping a->z,A->Z,0->9 with 0->61
let mapping = (arr) => {
    let url ="";
    for ( i = 0; i < arr.length; i++){
        if( Number(arr[i]) >=0 &&  Number(arr[i]) <= 25 ){
            url =  url +  String.fromCharCode( Number(arr[i]) + 97 );
        }
        if( Number(arr[i]) >= 26 &&  Number(arr[i]) <= 51 ) {
            url = url +  String.fromCharCode( Number(arr[i]) + 39 );
        }
        if( Number(arr[i]) >= 52 &&  Number(arr[i]) <= 61){
            url = url + (Number(arr[i]) - 52);
        }
    }
    return url;
}

// Create short Url
let createShortUrl = () => {
    let hostname = "localhost:3000/";
    let random = Math.floor(100000000000 +  Math.random() * 900000000000); //12 numbers
    let base62 = convertBase62(random);
    let url = mapping(base62);
    let newUrl = hostname + url;
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

let checkFormatUrlShort = (url, domain) => {
    const regex = /^[a-zA-Z0-9]*$/;
    let len = domain.length; //console.log("LEN:", len);//ex: doamin: rutgon.ml/ => length 10
    let domainUrl = url.slice(0, len); //console.log("DOMAINUURL:", domainUrl);
    let path = url.slice(len, url.length);//console.log("PATH:", path);
    if(domainUrl == domain && path.length > 0 && regex.test(path) ){
        return true;
    } else return false;
}

let checkFormatFbShort = (arrFb, domain) => {
    // console.log("mang nhan duoc:", arrFb);
    // console.log('TYPEOF:', typeof arrFb);
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

module.exports = {
    createShortUrl,
    checkExistForFb,
    checkFormatUrlShort,
    checkFormatFbShort,
    checkDuplicate,

}