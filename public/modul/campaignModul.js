const Shorten = require('../../c_models/shortenModel');
const User = require('../../c_models/userModel');
const Campaign = require('../../c_models/campaignModel');
const seedUrl = require('./seedUrl');


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
    let totalCamp = await Campaign.getTotalRecord();
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


module.exports = {
    saveShortUrlCampaign,
    validateConfirm,
}