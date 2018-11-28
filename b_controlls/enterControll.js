const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const seedUrl = require('../public/modul/seedUrl');
const CampaignModul = require('../public/modul/campaignModul');
const ExportModul = require('../public/modul/exportModul');
const AccessModul = require('../public/modul/accessModul');
// const Accesslog = require('../c_models/accesslogModel');
// const excel = require('node-excel-export');
// let accessF_Pl;
let ob_campaignPl;
let ob_urlPl;
let arr_shortPl;
let accessGr_Pl;
let accessE_Pl;
let accessS_Pl;
let accessO_Pl;

// Manager campaign
exports.manager = async (req, res) => {
    let ob_url;
    try {
        //Get arr object campaign
        let id_user = await User.getIdByUser(req.session.user);
        let arr_campaign = await Campaign.getAllCampaignByIDUser(id_user);
        arr_campaign = seedUrl.removeCampaignNull(arr_campaign);
        // // console.log("arr_campaign:", arr_campaign);
        // ob_url = await Url.getObUrlById(arr_campaign[0].id_urls[0]);
        // // console.log("ob_url:", ob_url);
        // // get array shortUrl of the first Campaign
        // let arrShortUrl = await seedUrl.getArrShortUrl(ob_url.short_urls);
        // // console.log("arrShortUrl:", arrShortUrl);
        // let convertShort = seedUrl.converArrShort(arrShortUrl);
        // // console.log("convertShort:", convertShort);
        // res.render("../d_views/enter/managerCampaign.ejs", {campaign: arr_campaign,camp_first: arr_campaign[0], ob_url: ob_url, convertShort:convertShort});
        res.render("../d_views/enter/managerCampaign.ejs", { campaign: arr_campaign });
    } catch (e) {
        console.log(e + "--tuan:manager in enter");
    }
}
//Get campaign by name
exports.getDataForCampaign = async (req, res) => {
    // console.log("data receive from client:", req.body);
    let customer = {};
    try {
        let ob_campaign = await Campaign.getCampaignById(req.body.id); ob_campaignPl = ob_campaign;
        let start_time = ob_campaign.start_time; let end_time = ob_campaign.end_time;
        end_time = AccessModul.returnEndTime(end_time);
        // console.log("ob_campaign:", ob_campaign);
        let ob_url = await Url.getObUrlById(ob_campaign.id_urls[0]); ob_urlPl = ob_url;
        let arr_shortUrl = await seedUrl.getArrShortUrl(ob_url.short_urls); arr_shortPl = arr_shortUrl;//don't care arr_shortPl
        let arr_shortUrlCV = await seedUrl.converArrShort(arr_shortUrl);
        // console.log("arr_shortUrl:", arr_shortUrl);
        // Get array access
        let arr_accessF = await AccessModul.getAllRecordAccess(arr_shortUrlCV.fb); //console.log("Fb:",arr_accessF);
        let arr_accessE = await AccessModul.getAllRecordAccess(arr_shortUrlCV.email);//console.log("Email:",arr_accessE);
        let arr_accessS = await AccessModul.getAllRecordAccess(arr_shortUrlCV.sms);//console.log("SMS:",arr_accessS);
        let arr_accessO = await AccessModul.getAllRecordAccess(arr_shortUrlCV.other);//console.log("Other:",arr_accessO);
        let arr_accessGr = await AccessModul.getAllRecordAccessGr(arr_shortUrlCV.ob_group);//console.log("arr_accessGr:", arr_accessGr.length);
        // Filter arr_access
        let arr_accessF1 = AccessModul.filterArrAccess(arr_accessF, start_time, end_time);//console.log("Fb1:",arr_accessF1);
        let arr_accessE1 = AccessModul.filterArrAccess(arr_accessE, start_time, end_time);//console.log("Email1:",arr_accessE1);
        let arr_accessS1 = AccessModul.filterArrAccess(arr_accessS, start_time, end_time);//console.log("SMS1:",arr_accessS1);
        let arr_accessO1 = AccessModul.filterArrAccess(arr_accessO, start_time, end_time);//console.log("Other1:",arr_accessO1);
        let arr_accessGr1 = AccessModul.filterArrAccessGr(arr_accessGr, start_time, end_time);//console.log("arr_accessGr1:", arr_accessGr1[0]);
        accessGr_Pl = arr_accessGr1; accessE_Pl = arr_accessE1; accessS_Pl = arr_accessS1;
        accessO_Pl = arr_accessO1;
        // Get value average Day
        let averageDayF = await AccessModul.caculateAverageDay(arr_accessF1, start_time, end_time); //console.log("averageDayF:",JSON.stringify(averageDayF));
        let averageDayE = await AccessModul.caculateAverageDay(arr_accessE1, start_time, end_time); //console.log("averageDayE:", JSON.stringify(averageDayE));
        let averageDayS = await AccessModul.caculateAverageDay(arr_accessS1, start_time, end_time); //console.log("averageDayS:", JSON.stringify(averageDayS));
        let averageDayO = await AccessModul.caculateAverageDay(arr_accessO1, start_time, end_time); //console.log("averageDayO:", JSON.stringify(averageDayO));
        let averageGr = await AccessModul.caculateAverageHour(arr_accessGr1, start_time, end_time);
        // console.log("AverageGr:", averageGr);
        //Get info chart (os, browser, device)
        let arrFilter = arr_accessF1.concat(arr_accessE1, arr_accessS1, arr_accessO1);
        let objInfo = AccessModul.getInfoChart(arrFilter);
        //console.log("objInfo:", objInfo);

        customer.ob_url = ob_url;
        customer.arr_shortUrl = arr_shortUrlCV;
        // customer.detailTotal = detailTotal;
        customer.averageDayF = averageDayF.average;
        customer.averageDayE = averageDayE.average;
        customer.averageDayS = averageDayS.average;
        customer.averageDayO = averageDayO.average;
        customer.clickF = arr_accessF1.length;
        customer.clickE = arr_accessE1.length;
        customer.clickS = arr_accessS1.length;
        customer.clickO = arr_accessO1.length;
        customer.averageGr = averageGr;
        customer.browser = objInfo.browser;
        customer.device = objInfo.device;
        customer.osDesktop = objInfo.osDesktop;
        customer.osPhone = objInfo.osPhone;
        customer.objLocation = objInfo.objLocation;
        // console.log("test:", customer);
        res.send(customer);

    } catch (e) {
        console.log(e + "--tuan: getCampaignByName");
    }
}
// Export excel
exports.exportExcel = (req, res) => {
    try {
        let user = req.session.user;
        let report = ExportModul.exportExcel(ob_campaignPl, ob_urlPl, arr_shortPl,
            accessE_Pl, accessS_Pl, accessO_Pl, accessGr_Pl, user);
        res.attachment('report.xlsx');
        return res.send(report);
    } catch (e) {
        console.log(e + "--tuan: exportExcel enterControll");
    }
}
//Create campaign
exports.createCampaign_get = async (req, res) => {
    res.render("../d_views/enter/createCampaign.ejs");
}
// Create seed Capaign
exports.createCampaign_post = async (req, res) => {
    // console.log("req.body:", req.body['group[]']);
    // console.log("Req.body:", req.body);
    let data = req.body;
    let domain = 'dontcare.com';
    // console.log("domain:", domain);
    let sms = seedUrl.createShortUrl(domain);
    let email = seedUrl.createShortUrl(domain);
    let other = seedUrl.createShortUrl(domain);
    let fb = [];
    let len = data.faceGroup.length;
    // console.log("typeof DATA.FACEGROUP:",typeof data.faceGroup);
    // console.log("LEN:",len);
    //console.log("dataata length:", data.faceGroup.length);
    if (typeof data.faceGroup == "object") {
        for (let i = 0; i < (data.faceGroup).length; i++) {
            fb.push(seedUrl.createShortUrl(domain));
        }
    } else if (typeof data.faceGroup == "string") {
        data.faceGroup = [data.faceGroup];
        fb.push(seedUrl.createShortUrl(domain));
    }

    let customer = {
        name: data.name, oldUrl: data.oldUrl, faGroup: data.faceGroup,
        sms: sms, email: email, other: other, fb: fb, start: data.start, end: data.end
    }
    // res.send(customer);
    // console.log("customer:",customer );
    res.render("../d_views/enter/confirm.ejs", customer);
}

// Confirm campaign
exports.confirm_post = async (req, res) => {
    
    let customer = {};
    let domain = "dontcare.com";
    let rq = req.body;
    let flagExist = true; //default
    let flagFormat = false; //default
    let flagDup = true// default 
    let arrCheckDup = [rq.email, rq.sms, rq.other];
    arrCheckDup = arrCheckDup.concat(rq['fbArr[]']);


    try {
        //check exist url
        let checkEmail = await Shorten.checkExist(rq.email); //console.log("checkEmail:", checkEmail);
        let checkSms = await Shorten.checkExist(rq.sms);  //console.log("checkSms:", checkSms);
        let checkOther = await Shorten.checkExist(rq.other);  //console.log("checkother:", checkOther);
        let checkFb = await seedUrl.checkExistForFb(rq['fbArr[]']); //console.log("checkFb:", checkFb);
        //check Format
        let eFormat = seedUrl.checkFormatUrlShort(rq.email, domain); //console.log("eFormat:", eFormat);
        let sFormat = seedUrl.checkFormatUrlShort(rq.sms, domain); //console.log("sFormat:", sFormat);
        let oFormat = seedUrl.checkFormatUrlShort(rq.other, domain); //console.log("oFormat:", oFormat);
        let fbFormat = seedUrl.checkFormatFbShort(rq['fbArr[]'], domain); //console.log("fbFormat:", fbFormat);

        if (checkEmail == false && checkSms == false && checkOther == false && checkFb == false) flagExist = false;//"ok"
        //console.log("flagExist:", flagExist);
        if (eFormat && sFormat && oFormat && fbFormat) flagFormat = true; //console.log("flagFormat:", flagFormat);
        flagDup = seedUrl.checkDuplicate(arrCheckDup); // console.log("flagDup:", flagDup);
        let flagCampaign = await checkNameCamp(rq.name, req.session.user);
        // console.log("CheckDup:", flagDup);
        // console.log("CheckExist:", flagExist);
        // console.log("CheckFormat:",flagFormat);

        if (flagExist == false && flagFormat == true && flagDup == false && flagCampaign == false) {
            console.log("ok");
            //save shorten
            let id_shortens = await CampaignModul.saveShortUrlCampaign(rq); //console.log("id_shortens:", id_shortens);
            if (id_shortens != undefined) {
                //save url
                let ob_url = await Url.save({ url: rq.oldUrl, short_urls: id_shortens, timeCreate: rq.start });
                //console.log("ob_url:", ob_url);
                if (ob_url != undefined) {
                    //save campaign
                    let id_enter = await User.getIdByUser(req.session.user);//req.session.user
                    //console.log("id_enter:", id_enter);
                    if (id_enter != undefined) {
                        let ob_campaign = await Campaign.save({ id_user: id_enter, id_urls: [ob_url.id], name: rq.name, start_time: rq.start, end_time: rq.end });
                        //console.log("ob_campaign:", ob_campaign);
                        if (ob_campaign != undefined) customer.state = "ok";
                        else customer.state = "fail";
                    } else customer.state = "fail";
                } else customer.state = "fail";
            } else customer.state = "fail";
            //res.send(customer);
        } else {
            console.log("Loi roi loi roi");
            customer.state = "fail";
            if (flagCampaign == true) customer.err_campaign = true;
            else customer.err_campaign = false;
            if (flagExist == true) customer.err_exist = true;
            else customer.err_exist = false;
            if (flagFormat == false) customer.err_format = true;
            else customer.err_format = false;
            if (flagDup == true) customer.err_dup = true;
            else customer.err_dup = false;
            // res.send(customer);
        }
    } catch (e) {
        console.log(e + "--tuan: confirm_post");
    }
    return res.send(customer);
}

// get Short Link
exports.getShortLink = async (req, res) => {
    let domain = "dontcare.com";
    let newUrl = seedUrl.createShortUrl(domain);
    res.send(newUrl);
}

//Short Link
exports.shortLink = async (req, res) => {
    let customer = {};
    let domain = "dontcare.com";
    // console.log("req.body:", req.body);
    try {
        let checkFormat = seedUrl.checkFormatUrlShort(req.body.newUrl, domain);
        // console.log("Checkfomat:", checkFormat);
        let checkExist = await Shorten.checkExist(req.body.newUrl);
        // console.log("CheckExist:", checkExist);
        if (checkFormat == true && checkExist == false) {
            await addLink1(req.body.oldUrl, req.body.newUrl, req.session.user);
            customer.state = "ok";
        } else {
            customer.state = "fail";
            if (checkFormat == false) customer.err_format = true;
            else customer.err_format = false;
            if (checkExist == true) customer.err_exist = true;
            else customer.err_exist = false;
        }
    } catch (e) {
        console.log(e + "--tuan: shortLink in enterControll");
    }
    res.send(customer);

}


//check name campaign
const checkNameCamp = async (nameCampaign, user) => {
    // console.log("name:", req.body);
    let id_user = await User.getIdByUser(user);
    let rs = await Campaign.checkNameCamp(nameCampaign, id_user);
    return rs;
}

const addLink1 = async (oldUrl, newUrl, user) => {
    // let data = {};
    // data.urlOrigin = req.body.urlOrigin;
    // let shortUrl = seedUrl.createShortUrl();
    try {
        let ob_shortUrl = await Shorten.save({ url: newUrl });
        // console.log("ob_shortUrl:", ob_shortUrl);
        let object_url = { url: oldUrl, short_urls: [ob_shortUrl.id] };
        let result = await Url.save(object_url);
        // console.log("Save url:", result);

        //get id_user by user 
        let id_user = await User.getIdByUser(user);//req.session.user
        /* check campaign: if user already exist then choose campaign with campaign = null, 
            else create new campaign with campaign = null */
        let checkUser = await Campaign.checkUserExist(id_user);
        //console.log("id_user:", id_user);
        // console.log("checkUser:", checkUser);

        if (checkUser) {
            let temp = await Campaign.update(id_user, result.id);// result.id = id_url
            // console.log("updateCampaign:", temp);
        } else {
            let ob_campaign = { id_user: id_user, id_urls: [result.id] };
            let temp2 = await Campaign.save(ob_campaign);
            // console.log("create new campaign with name = null:", temp2);
        }
        return true;
    } catch (e) {
        console.log(e + "--- Tuan: Error addLink1 in EnterControll");
    }
};

