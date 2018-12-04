const Shorten = require('../../c_models/shortenModel');
const User = require('../../c_models/userModel');
const Url = require('../../c_models/urlModel');
const Campaign = require('../../c_models/campaignModel');
const seedUrl = require('./seedUrl');


let validateAddLink = async (rq) => {
    let customer = {};
    try {
        //Check if the user exists ?
        let checkUser = await User.checkExistUser(rq.username);
        let username = rq.username;
        let urlOrigin = rq.urlOrigin;
        if (urlOrigin.length == 0) {
            customer.state = 'fail';
            customer.blankUrl = true;
        }
        else if (username.length == 0) {
            customer.state = 'fail';
            customer.blankUser = true;
        }
        else if (checkUser == false) {
            customer.state = 'fail';
            customer.checkUser = false;
        }
        else {
            customer.state = 'ok';
            let totalLink = await Shorten.getTotalLink();
            totalLink = totalLink + 1; // tang 1 do khi state ok, csdl se duoc tang len 1
            let last_page = Math.ceil(totalLink / 10);
            customer.last_page = last_page;
        }
        return customer;
    } catch (e) {
        console.log(e + "--tuan: validateAddLink in linkModul");
    }
}
let saveLink = async (urlOrigin, username, ) => {
    let urlShort = seedUrl.createShortUrl();
    let ob_shortUrl = await Shorten.save({ url: urlShort });
    // console.log("ob_shortUrl:", ob_shortUrl);
    let object_url = { url: urlOrigin, short_urls: [ob_shortUrl.id] };
    let ob_url = await Url.save(object_url);
    // console.log("ob_url:", ob_url);
    let id_user = await User.getIdByUser(username);
    let ob_camp = await Campaign.getCampaignNull(id_user);
    if (ob_camp.length > 0) {
        ob_camp = ob_camp[0];
        // console.log("ob_camp:", ob_camp);
        let rs = await Campaign.addIdUrlInCamp(ob_camp.id, ob_url.id);
    } else {
        let ob_campaign = { id_user: id_user, id_urls: [ob_url.id] };
        await Campaign.save(ob_campaign);
    }
}
let allJoinArrShort = async (arr_short) => {
    arr_short = converArrShort(arr_short);
    for (let i = 0; i < arr_short.length; i++) {
        let ob_url = await Url.getObjUrlByIdShort(arr_short[i].id);
        let data = await getUserName(ob_url.id);
        let timeCreate = (ob_url.timeCreate)
        timeCreate = timeCreate.slice(0, -14);

        arr_short[i].urlOrigin = ob_url.url;
        arr_short[i].timeCreate = timeCreate;
        arr_short[i].idUrlOrigin = ob_url.id;
        arr_short[i].username = data.username;
        arr_short[i].idCamp = data.idCamp;
    }
    return arr_short;
}
let getUserName = async (idUrlOrigin) => {
    let data = {};
    let obCamp = await Campaign.getObCampByIdUrl(idUrlOrigin);
    if (obCamp == undefined) {
        data.idCamp = undefined;
        data.username = 'unregistered';
    }
    else {
        let ob_user = await User.findByID(obCamp.id_user);
        data.idCamp = obCamp.id;
        data.username = ob_user.username;
    }
    return data;
}
let converArrShort = (arrShort) => {
    // chuan hoa mang obj lay tu csdl
    let arr = [];
    for (let i = 0; i < arrShort.length; i++) {
        let obj = {};
        obj.id = arrShort[i].id;
        obj.urlShort = arrShort[i].url;
        obj.totalClick = arrShort[i].totalClick;
        arr.push(obj);
    }
    return arr;
}
let saveUpdateLink = async (username, urlShort, urlOrigin, obShortBefore) => {
    if (username == obShortBefore.username && urlShort == obShortBefore.urlShort && urlOrigin == obShortBefore.urlOrigin) {
        // console.log("khong thay doi gi ca");
    }
    else if (username == obShortBefore.username && urlShort == obShortBefore.urlShort) {
        //update urlOrigin
        let rs1 = await Url.updateUrlOrigin(obShortBefore.idUrlOrigin, urlOrigin);
    }
    else if (username == obShortBefore.username) {
        let rs2 = await Url.updateUrlOrigin(obShortBefore.idUrlOrigin, urlOrigin);
        let rs3 = await Shorten.updateUrlShort(obShortBefore.id, urlShort);
    }
    else if (username != obShortBefore.username) {
        // console.log("Khac Usernam");
        // console.log("user receive:", username);
        let idNewUser = await User.getIdByUser(username);
        // console.log("idNewUser:", idNewUser);
        let obNewCamp = await Campaign.getCampaignNull(idNewUser);
        // console.log("obNewCamp:", obNewCamp);
        if (obNewCamp.length == 0) {
            // console.log("Chua ton tai campaign null");
            // create new Camp width newUser
            let data = { id_user: idNewUser, id_urls: [obShortBefore.idUrlOrigin], name: null, end_time: null }
            let rs8 = await Campaign.save(data);
            let rs11 = await Campaign.removeIdUrlInCamp(obShortBefore.idCamp, obShortBefore.idUrlOrigin);
            if (urlShort != obShortBefore.urlShort) {
                let rs10 = await Shorten.updateUrlShort(obShortBefore.id, urlShort);
            }
            if (urlOrigin != obShortBefore.urlOrign) {
                let rs9 = await Url.updateUrlOrigin(obShortBefore.idUrlOrigin, urlOrigin);
            }
        }
        else {
            // console.log("Ton tai campaign null");
            obNewCamp = obNewCamp[0];
            //add urlOrigin into new Campaign
            let rs4 = await Campaign.addIdUrlInCamp(obNewCamp.id, obShortBefore.idUrlOrigin);
            let rs5 = await Campaign.removeIdUrlInCamp(obShortBefore.idCamp, obShortBefore.idUrlOrigin);
            if (urlShort != obShortBefore.urlShort) {
                let rs6 = await Shorten.updateUrlShort(obShortBefore.id, urlShort);
            }
            if (urlOrigin != obShortBefore.urlOrign) {
                let rs7 = await Url.updateUrlOrigin(obShortBefore.idUrlOrigin, urlOrigin);
            }
        }

    }
}
let getArrShortFromArrIdUrl = async (arrUrl) => {
    let arrShort = [];
    for(let i = 0; i < arrUrl.length; i++) {
        let ob_url = await Url.getObUrlById(arrUrl[i]);
        let ob_short = await Shorten.getObUrlShorten(ob_url.short_urls[0]);
        arrShort.push(ob_short);
    }
    return arrShort;
}
module.exports = {
    validateAddLink,
    saveLink,
    allJoinArrShort,
    saveUpdateLink,
    getArrShortFromArrIdUrl
}