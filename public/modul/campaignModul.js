const Shorten = require('../../c_models/shortenModel');
const User = require('../../c_models/userModel');
const Url = require('../../c_models/urlModel');
const Campaign = require('../../c_models/campaignModel');
const seedUrl = require('./seedUrl');

/*Support for confirm campaign*/
const saveShortUrlCampaign = async (data) => {
    // data is (req.body);
    //console.log("Data in saveCampaign:", data);
    try {
        let arrIdShorten = [];
        let arrIdFb = await saveFb(data['groupArr[]'], data['fbArr[]']);
        arrIdShorten = arrIdShorten.concat(arrIdFb);
        let id_email = await saveESO(data.email, "email"); //console.log("id_email:", id_email);
        arrIdShorten.push(id_email);
        let id_sms = await saveESO(data.sms, "sms");
        arrIdShorten.push(id_sms);
        let id_other = await saveESO(data.other, "other");
        arrIdShorten.push(id_other);

        //console.log("SaveCampaign:", arrIdShorten);
        return arrIdShorten;
    } catch (e) {
        console.log(e + "--tuan: saveShortUrlCampaign.")
    }

}
const saveFb = async (groupArr, fbArr) => {
    //console.log("GROUPARR:",groupArr);
    //console.log("FBARR:",fbArr);
    let arrId = [];
    try {
        if (typeof groupArr == "string") {
            //console.log("da vao string");
            let id_fb = await saveESO(fbArr, "fb", groupArr);
            arrId.push(id_fb);
        } else {
            for (let i = 0; i < groupArr.length; i++) {
                // let ob_fb = {ulr: fbArr[i], group: groupArr[i], resource:"fb"};
                let id_fb = await saveESO(fbArr[i], "fb", groupArr[i]);
                arrId.push(id_fb);
            }
        }
        return arrId;
    } catch (e) {
        console.log(e + "--tuan:saveFb");
    }
}
const saveESO = async (shortUrl, resource, group) => {
    try {
        let result = await Shorten.save({ url: shortUrl, resource: resource, group: group });
        //console.log("saveESO:", result);
        //console.log("ketqua saveESO:", result);
        return result.id;
    } catch (e) {
        console.log(e + "--tuan: saveESO")
    }

}
const validateConfirm = async (rq) => {
    // rq is req.body
    let customer = {};
    let totalCamp = await Campaign.getTotalRecord(); totalCamp = totalCamp+1;
    let domain = "dontcare.com";
    let arrCheckDup = [rq.email, rq.sms, rq.other];
    arrCheckDup = arrCheckDup.concat(rq['fbArr[]']);
    try {
        let ob_user = await User.getObUserByName(rq.username);
        let existNameCamp = true;
        if (ob_user != undefined) {
            existNameCamp = await Campaign.checkNameCamp(rq.name, ob_user.id);
        }
        let eFormat = seedUrl.checkFormatUrlShort(rq.email, domain); //console.log("eFormat:", eFormat);
        let sFormat = seedUrl.checkFormatUrlShort(rq.sms, domain); //console.log("sFormat:", sFormat);
        let oFormat = seedUrl.checkFormatUrlShort(rq.other, domain); //console.log("oFormat:", oFormat);
        let fbFormat = seedUrl.checkFormatFbShort(rq['fbArr[]'], domain); //console.log("fbFormat:", fbFormat);
        let existEmail = await Shorten.checkExist(rq.email); //console.log("checkEmail:", checkEmail);
        let existSms = await Shorten.checkExist(rq.sms);  //console.log("checkSms:", checkSms);
        let existOther = await Shorten.checkExist(rq.other);  //console.log("checkother:", checkOther);
        let existFb = await seedUrl.checkExistForFb(rq['fbArr[]']); //console.log("checkFb:", checkFb);
        let checkDup = seedUrl.checkDuplicate(arrCheckDup);
        //check role username (invalid if role user = personal)
        if (ob_user == undefined) {
            customer.state = 'fail';
            customer.existUser = false;
        }
        else if (ob_user.role == 'personal') {
            customer.state = 'fail';
            customer.checkRoleUser = false;
        }
        //check exist name campaign
        else if (existNameCamp == true) {
            customer.state = 'fail';
            customer.existNameCamp = true;
        }
        // check format url shorten
        else if (eFormat == false) {
            customer.state = 'fail';
            customer.emailFormat = false;
        }
        else if (sFormat == false) {
            customer.state = 'fail';
            customer.smsFormat = false;
        }
        else if (oFormat == false) {
            customer.state = 'fail';
            customer.otherFormat = false;
        }
        else if (fbFormat == false) {
            customer.state = 'fail';
            customer.fbFormat = false;
        }
        // check exist url shorten
        else if (existEmail == true) {
            customer.state = 'fail';
            customer.existEmail = true;
        }
        else if (existSms == true) {
            customer.state = 'fail';
            customer.existSms = true;
        }
        else if (existOther == true) {
            customer.state = 'fail';
            customer.existOther = true;
        }
        else if (existFb == true) {
            customer.state = 'fail';
            customer.existFb = true;
        }
        // check duplicate url shorten
        else if (checkDup == true) {
            customer.state = 'fail';
            customer.checkDup = true;
        }
        else {
            customer.state = 'ok';
            customer.ob_user = ob_user;
            let last_page = Math.ceil(totalCamp / 5);
            if (last_page == 0) last_page = 1;
            customer.last_page = last_page;
        }
        return customer;
    } catch (e) {
        console.log(e + "--tuan: validateConfirm in campaignModul.");
    }
}
/* ----- End support for confirm campaign ------*/

/*Support for update campaign*/
const validateUpdate = async (rq,obCampBefore, page_current) => {
    let customer = {};
    // let totalCamp = await Campaign.getTotalRecord(); totalCamp = totalCamp+1;
    let domain = "dontcare.com";
    let arrCheckDup = [rq.email, rq.sms, rq.other];
    arrCheckDup = arrCheckDup.concat(rq['fbArr[]']);
    try {
        let ob_user = await User.getObUserByName(rq.username);
        let existNameCamp = true;
        if (ob_user != undefined) {
            existNameCamp = await Campaign.checkNameCamp(rq.name, ob_user.id);
        }
        let eFormat = seedUrl.checkFormatUrlShort(rq.email, domain); //console.log("eFormat:", eFormat);
        let sFormat = seedUrl.checkFormatUrlShort(rq.sms, domain); //console.log("sFormat:", sFormat);
        let oFormat = seedUrl.checkFormatUrlShort(rq.other, domain); //console.log("oFormat:", oFormat);
        let fbFormat = seedUrl.checkFormatFbShort(rq['fbArr[]'], domain); //console.log("fbFormat:", fbFormat);
        let existEmail = await Shorten.checkExist(rq.email); //console.log("checkEmail:", checkEmail);
        let existSms = await Shorten.checkExist(rq.sms);  //console.log("checkSms:", checkSms);
        let existOther = await Shorten.checkExist(rq.other);  //console.log("checkother:", checkOther);
        // let existFb = await seedUrl.checkExistForFb(rq['fbArr[]']); //console.log("checkFb:", checkFb);
        let existFb = await checkExitFbUpdate(obCampBefore.fb, rq['fbArr[]']);
        let checkDup = seedUrl.checkDuplicate(arrCheckDup)
        //check role username (invalid if role user = personal)
        if (ob_user == undefined) {
            customer.state = 'fail';
            customer.existUser = false;
        }
        else if (ob_user.role == 'personal') {
            customer.state = 'fail';
            customer.checkRoleUser = false;
        }
        //check exist name campaign
        else if (existNameCamp == true && (rq.name != obCampBefore.name)) {
            customer.state = 'fail';
            customer.existNameCamp = true;
        }
        // check format url shorten
        else if (eFormat == false) {
            customer.state = 'fail';
            customer.emailFormat = false;
        }
        else if (sFormat == false) {
            customer.state = 'fail';
            customer.smsFormat = false;
        }
        else if (oFormat == false) {
            customer.state = 'fail';
            customer.otherFormat = false;
        }
        else if (fbFormat == false) {
            customer.state = 'fail';
            customer.fbFormat = false;
        }
        // check exist url shorten
        else if (existEmail == true && (rq.email != obCampBefore.email)) {
            customer.state = 'fail';
            customer.existEmail = true;
        }
        else if (existSms == true && (rq.sms != obCampBefore.sms)) {
            customer.state = 'fail';
            customer.existSms = true;
        }
        else if (existOther == true && (rq.other != obCampBefore.other)) {
            customer.state = 'fail';
            customer.existOther = true;
        }
        else if (existFb > 0 ) {
            customer.state = 'fail';
            customer.existFb = true;
        }
        // check duplicate url shorten
        else if (checkDup == true) {
            customer.state = 'fail';
            customer.checkDup = true;
        }
        else {
            customer.state = 'ok';
            customer.ob_user = ob_user;
            customer.page_current = page_current;
        }
        return customer;
    } catch (e) {
        console.log(e + "--tuan: validateConfirm in campaignModul.");
    }
}
const checkExitFbUpdate = async (arrFbBefore, arrFbAfter) => {
    if(typeof arrFbAfter == 'string'){
        arrFbAfter = [arrFbAfter];
    }
    // console.log("arrFbBefore:", arrFbBefore);
    // console.log("arrFbAfter:", arrFbAfter);
    for(let i = 0; i < arrFbBefore.length; i++) {
        let existFb = await Shorten.checkExist(arrFbAfter[i]);
        if(existFb == true && (arrFbAfter[i] != arrFbBefore[i])) {
            return (i+1);
        }
    }
    return -3;
}
const saveUpdateCamp = async (req, idCamp, idUrl, idEmail, idSms, idOther, arrIdFb) => {
    //req = req.body
    let newUser = await User.getObUserByName(req.username);
    let objCampUpdate = {id_user: newUser.id, name: req.name, start_time: req.start, end_time: req.end}
    let cp = await Campaign.updateCampaign(idCamp,objCampUpdate );
    if(cp != undefined ){
        let url = await Url.updateUrlOrigin(idUrl, req.oldUrl);
        if(url != undefined) {
            let email = await Shorten.updateUrlShortForUpdateCamp(idEmail,req.email,null);
            let sms = await Shorten.updateUrlShortForUpdateCamp(idSms, req.sms,null);
            let other = await Shorten.updateUrlShortForUpdateCamp(idOther, req.other, null);
            let fb = await updateArrFb(arrIdFb, req['fbArr[]'], req['groupArr[]']);
        }
    }
}
const updateArrFb = async (arrId, arrFb, arrGr) => {
    if (typeof arrGr == 'string') arrGr = [arrGr];
    if (typeof arrFb == 'string') arrFb = [arrFb];
    for(let i = 0; i < arrGr.length; i++) {
        let rs = await Shorten.updateUrlShortForUpdateCamp(arrId[i],arrFb[i],arrGr[i]);
    }
}
const deleteCamp = async (idCamp, idUrl, arrIdShort) => {
    let delShort = await deleteArrShort(arrIdShort);
    let delUrl =  await Url.delete(idUrl);
    let delCamp = await Campaign.deleteCamp(idCamp);
}
const deleteArrShort = async (arrIdShort) => {
    for(let i = 0; i < arrIdShort.length; i++) {
        let rs = await Shorten.delete(arrIdShort[i]);
    }
}
/* ----- End support for update campaign ------*/
let standardizedCampaign = async (arrCamp) => {
    let arr = [];
    for (let i = 0; i < arrCamp.length; i++) {
        let ob_user = await User.findByID(arrCamp[i].id_user);
        let ob_url = await Url.getObUrlById(arrCamp[i].id_urls[0]);
        let arrShort = await getALlUrlShortInCampaign(ob_url.short_urls);
        let time_create = arrCamp[i].time_create;
        time_create = time_create.slice(0, -14);
        let ob = {};
        ob.id = arrCamp[i].id;
        ob.id_user = arrCamp[i].id_user;
        ob.username = ob_user.username;
        ob.name = arrCamp[i].name;
        ob.id_url = arrCamp[i].id_urls[0];
        ob.urlOrigin = ob_url.url;
        ob.arrShort = arrShort;
        ob.start_time = arrCamp[i].start_time;
        ob.end_time = arrCamp[i].end_time;
        ob.time_create = time_create;
        ob.ob_url = ob_url;
        arr.push(ob);
    }
    return arr;
}
let getALlUrlShortInCampaign = async (arr_idUrlShort) => {
    let arrUrlShort = [];
    for (let i = 0; i < arr_idUrlShort.length; i++) {
        let urlShort = await Shorten.getUrlShortByID(arr_idUrlShort[i]);
        arrUrlShort.push(urlShort);
    }
    // console.log("arrShort:", arrUrlShort);
    return arrUrlShort;
}
/*Suport for manager campaign (in admin controll) */

/* --end suport manager campaign--*/
module.exports = {
    saveShortUrlCampaign,
    validateConfirm,
    validateUpdate,
    saveUpdateCamp,
    deleteCamp,
    standardizedCampaign
}