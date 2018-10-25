const urlModel = require('../c_models/urlModel');
const shortenModel = require('../c_models/shortenModel');
const userModel = require('../c_models/userModel');
const seedUrl = require('../public/modul/seedUrl');
const accessModul = require('../public/modul/accessModul');
const campaignModel = require('../c_models/campaignModel');
const Access = require('../c_models/accesslogModel');

const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const device = require('express-device');
const date1 = require('date-and-time');
const useragent = require('useragent');




//Handle get short URL
exports.shortUrl_get = (req, res) => {
    res.render('../d_views/url/shortenUrl.ejs');
};
//Handle post short Url
exports.shortUrl_post = async (req, res) => { 
    let data = {};
    data.urlOrigin = req.body.urlOrigin;
    let shortUrl = seedUrl.createShortUrl();
    try{
        let ob_shortUrl = await shortenModel.save({url: shortUrl});
        let object_url = {url:req.body.urlOrigin , short_urls : [ob_shortUrl.id]};
        let result = await urlModel.save(object_url);
        // if(req.session.user) {// if req.session.user , gs : = user1
        //     //get id_user by user 
        //     let id_user = await userModel.getIdByUser(req.session.user);//req.session.user
        //     let checkUser = await campaignModel.checkUserExist(id_user);
        //     //console.log("id_user:", id_user);
        //     //console.log("checkUser:", checkUser);
        //     if(checkUser) {
        //         await campaignModel.update(id_user, result.id);// result.id = id_url
        //     } else {
        //         let ob_campaign = {id_user: id_user, id_urls :[result.id]};
        //         await campaignModel.save(ob_campaign);
        //     }
        // }
        if(result) data.urlShort = shortUrl;
        res.send(data);
    }catch(e) {
        console.log(e +"--- Tuan: Error shortUrl_post" );
    }
};

//Redirect Url Origin
exports.redirectUrlOrigin = async (req, res) => {
    // get shortUrl from address bar
    let urlShort =  req.get('host') + req.originalUrl;
    try{
        let urlOrigin = await getUrlOrigin(urlShort);
        //get device
        let device = req.device.type;
        //get ip
        let ip = req.clientIp; //console.log("Ip:", ip);
        //get location
        let geo = geoip.lookup(ip);
        let location = accessModul.location(geo); //console.log("Location:", location);
        //get timeClick
        let time_click = accessModul.date(); //console.log("Time click:", time_click);
        // get browser
        const agent = useragent.parse(req.headers['user-agent']);
        let browser = agent.family; //console.log("Browser:", browser);
        //get OS
        let info = agent.toString();
        if( device == "phone" || device == "table") {
            let os = accessModul.get0s(info); //console.log("OS:", os);
        }
        //get idShorten
        let id_shorten1 = await shortenModel.getId(urlShort);
        let id_shorten = id_shorten.id;

        //Save accesslog
        let ob_access = {ip: ip, time_click: time_click,location: location, device: device, id_shorten:id_shorten, browser:browser, os:os }
        await Access.save(ob_access);
        res.redirect(urlOrigin);
        
    }catch(e){
       // console.log(e + "----" + "Tuan: error redirectUrlOrigin!");
    }

}
// Get Url_original from shortUrl ( then update total Click urlShort)
let getUrlOrigin = async (shortUrl) => {
    try{
        let result = await shortenModel.getId(shortUrl);
        let urlOrigin = await urlModel.getUrlOriginByIdShortUrl(result.id);
        // increase totalClick
        result.totalClick += 1;
        let result2 = await shortenModel.update(result.id, result);

        return new Promise((resolve, reject) => {
            if(urlOrigin.length != 0) resolve(urlOrigin); 
            else  reject("Error getUrlOrigin"); 
        })
    }catch(e) {
        //console.log(e + "--tuan: getUrlOrigin");
    }
}

//test
// exports.test = (req, res) => {
    
//     res.render("../d_views/enter/chartjs.ejs");
// }












// // Create short Url
// let CreateShortUrl = (longUrl, session_user) => {
//     let random = Math.floor(100000000000 +  Math.random() * 900000000000);
//     let base62 = convertBase62(random);
//     let url = mapping(base62);
//     let oldUrl = longUrl;
//     let hash = md5(oldUrl);
//     let newUrl = "localhost:3000/" + url;
//     const objectUrl = {random: random,md5: hash, oldUrl: oldUrl, newUrl : newUrl, user : session_user};
//     return new Promise((resolve, reject) => {
//         ShortUrl.checkExistUrl(hash, session_user).then((exist_url) =>{
//             resolve (exist_url);
//         },(reject) => {
//                 ShortUrl.saveUrl(objectUrl).then((result) => {
//                     resolve (result);
//             }, (err) => {
//                 console.log("Can not create new url");
//             })
//         } )
//     })
// }

// // Get oldUrl by newUrl
// exports.get_oldUrl = async (req, res) => {
//     try{
//         let url =  req.get('host') + req.originalUrl;
//         let result = await ShortUrl.get_oldUrl(url);
//         result.totalClick += 1;
//         await ShortUrl.update(result.id, result);
//         //********** */
//         const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; 
//         console.log("IP||", ip);


//         //*****************/
//         res.redirect(result.oldUrl);
//     } catch (e) {
//         console.log("Error get oldUrl");
//     }
// }

// //Algorithm convert base10 to base62
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

// // Manager url
// exports.urlManager = (req, res) => {
//     page_current = req.params.page;
//     ShortUrl.getTotalRecordByAccount(req.session.user).then((count) => {
//         ShortUrl.getAllUrl(page_current, req.session.user).then((url) => {
//             res.render("userManager.ejs", {url:url, page:page_current, count: count, user: req.session.user});
//         }, (err) => {
//             console.log("Error while try get url in database");
//         })
//     }, (reject) => {
//         console.log("Error while get total record");
//     })
//  }

// exports.urlManager_post = (req, res) => {;
//     let customer = {};
//     customer.oldUrl = req.body.oldUrl;
//     customer.page_current = page_current;
    
//     CreateShortUrl(req.body.oldUrl, req.session.user).then((resolve) => {
//         customer.newUrl = resolve.newUrl;
//         res.send(customer);
//     }, (err) => {
//         console.log(err);
//     });
    
   
// }

// //Delete Url
// exports.urlDelete = (req, res) => {
//     const idDelete = req.params.id;
//     ShortUrl.urlDelete(idDelete).then((resolve) => {
//         const pathDele = "/manager/" + page_current.toString();
//         res.redirect(pathDele);
//     }, (reject) => {
//         res.send("Error while delete record!" + reject);
//     })
// }

// //Url Update
// exports.urlUpdate_get = async (req, res) => {
//     const idUpdate = req.params.id;
//     try{
//         url = await ShortUrl.findByID(idUpdate,req.body);
//         res.render("user_update_link.ejs", { url: url, admim:"admin"});
//     } catch (e) {
//         console.log("Error urlUpdate_get");
//     }
    
// }








