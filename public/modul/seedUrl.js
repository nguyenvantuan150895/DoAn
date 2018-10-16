

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

let createObjectFb = (arr) => {
    let objectFb = {};
    for (let i = 0; i < arr.length; i++) {
        objectFb[arr[i]] = createShortUrl();
        objectFb[fbClick] = 0;
        objectFb[timeClick] = [];
    }
    return objectFb;
}


module.exports = {
    createShortUrl,
    createObjectFb
}