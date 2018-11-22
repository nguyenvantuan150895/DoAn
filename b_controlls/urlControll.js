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
    try{
        //let domain = await userModel.getDomain(req.session.user);
        let domain = 's.ows.com';
        let shortUrl = seedUrl.createShortUrl(domain);
        let ob_shortUrl = await shortenModel.save({url: shortUrl});
        let object_url = {url:req.body.urlOrigin , short_urls : [ob_shortUrl.id]};
        let result = await urlModel.save(object_url);
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
        const agent = useragent.parse(req.headers['user-agent']);
        let urlOrigin = await getUrlOrigin(urlShort);
        // get device
        let device = req.device.type; // desktop/phone/tablet
        if(device != 'desktop' && device != 'phone' && device != 'tablet') device = 'other';
        //get ip
        let ip = req.clientIp; //console.log("Ip:", ip);
        //get location
        let geo = geoip.lookup(ip);// geo = JSON.stringify(geo);
        let location = accessModul.location(geo); //console.log("Location:", location);
        //get timeClick
        let time_click = accessModul.date(); //console.log("Time click:", time_click);
        // get browser
        let browser = accessModul.getBrowser(agent.family); //console.log("Browser:", browser);
        //get OS
        let os = accessModul.getOs(agent.toString()); //console.log("OS:", os);
        if(os == "Other"){
            if(device == 'phone' || device == "tablet" || device == "other") os = "Otherphone";
            else if(device == "desktop") os = "Otherdesktop";
        }
        
        //get idShorten
        let ob_shorten = await shortenModel.getId(urlShort);
        let id_shorten = ob_shorten.id; //console.log("id_shorten:", id_shorten);
        //Save accesslog
        let ob_access = {ip: ip, time_click: time_click,location: location, device: device, id_shorten:id_shorten, browser:browser, os:os }
        await Access.save(ob_access);
        res.redirect(urlOrigin);
        
    }catch(e){
        // console.log(e + "--tuan: error redirectUrlOrigin!");
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
exports.test = async (req, res) => {
    try{
        let result = await accessModul.dummyData(3000);
        // console.log("result:", result);
        res.send("Dummy done!");
    }catch(e){
        console.log(e + "--tuan: test");
    }
}
exports.reset = async (req, res) => {
    try{
        let arr = await shortenModel.getAll();
        // console.log(arr);
        for(let i = 0; i < arr.length; i++){
            arr[i].totalClick = 0;
            await shortenModel.update(arr[i].id, arr[i]);
        }
        res.send("Reset done!");
    }catch(e) {
        console.log(e + "--tuan: error Reset");
    }
}

