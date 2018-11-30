const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const seedUrl = require('../public/modul/seedUrl');
const CampaignModul = require('../public/modul/campaignModul');
const ExportModul = require('../public/modul/exportModul');
const AccessModul = require('../public/modul/accessModul');
const LinkModul = require('../public/modul/linkModul');
// const Accesslog = require('../c_models/accesslogModel');
let arr_campaignPl;
let ob_campaignPl;
let ob_urlPl;
let arr_shortPl;
let accessGr_Pl;
let accessE_Pl;
let accessS_Pl;
let accessO_Pl;
// for manager campaign
let obCampBefore;


// Manager campaign
exports.manager = async (req, res) => {
    try {
        //Get arr object campaign
        let id_user = await User.getIdByUser(req.session.user);
        let arr_campaign = await Campaign.getAllCampaignByIDUser(id_user);
        arr_campaign = seedUrl.removeCampaignNull(arr_campaign);
        arr_campaignPl = arr_campaign;//don't care
        res.render("../d_views/enter/homeEnter.ejs", { arrCampaign: arr_campaign });
    } catch (e) {
        console.log(e + "--tuan:manager in enter");
    }
}
// detail campaign
exports.getDetailCamp = async (req, res) => {
    let id = req.params.id;
    let customer = {};
    try {
        let ob_campaign = await Campaign.getCampaignById(id); ob_campaignPl = ob_campaign;
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
        // console.log("test:", JSON.stringify(customer));
        
        res.render('../d_views/enter/detailCampaign.ejs', {arrCampaign:arr_campaignPl,obCamp: ob_campaign, customer:customer});

    } catch (e) {
        console.log(e + "--tuan: getailCampain in EnterControll");
    }
}
//Create campaign
exports.createCampaign_get = async (req, res) => {
    res.render("../d_views/enter/createCampaign.ejs", {arrCampaign:arr_campaignPl});
}
exports.createCampaign_post = async (req, res) => {
    let data = req.body;
    let domain = 'dontcare.com';
    let sms = seedUrl.createShortUrl(domain);
    let email = seedUrl.createShortUrl(domain);
    let other = seedUrl.createShortUrl(domain);
    let fb = [];

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
    // console.log("customer:", customer);
    res.render('../d_views/enter/confirm.ejs', {customer: customer, arrCampaign: arr_campaignPl});
}
// Confirm campaign
exports.confirm_post = async (req, res) => {
    let rq = req.body;
    // them username de tai su dung code validate campaign
    rq.username = req.session.user;
    try {
        let customer = await CampaignModul.validateConfirm(rq);
        if (customer.state == 'ok') {
            let ob_user = customer.ob_user;
            let arrIdShorten = await CampaignModul.saveShortUrlCampaign(rq);
            if (arrIdShorten != undefined) {
                let ob_url = await Url.save({ url: rq.oldUrl, short_urls: arrIdShorten, timeCreate: rq.start });
                if (ob_url != undefined) {
                    let ob_campaign = await Campaign.save({
                        id_user: ob_user.id, id_urls: [ob_url.id], name: rq.name,
                        start_time: rq.start, end_time: rq.end
                    });
                }
            }
        }
        res.send(customer);
    } catch (e) {
        console.log(e + '--tuan: confirmCampaign in Entercontroll');
    }
}
//Edit campaign
exports.editCamp_get = async (req, res) => {
    idCamp = req.params.id;   
    try {
        let ob_camp = await Campaign.getObCampById(idCamp);
        //chuan hoa
        let standar = await CampaignModul.standardizedCampaign([ob_camp]);
        ob_camp = standar[0];
        let arrShort = ob_camp.arrShort;
        arrShort = seedUrl.converArrShort(arrShort);
        let arrFb = arrShort.fb;
        let faGroup = []; // array group facebook
        let fb = []; // array shorten facebook
        let arrIdFb = [];
        for (let j = 0; j < arrFb.length; j++) {
            faGroup.push(arrFb[j].group);
            fb.push(arrFb[j].url);
            arrIdFb.push(arrFb[j].id);
        }
        let customer = {
            idCamp: idCamp,
            username: ob_camp.username,
            name: ob_camp.name,
            idUrl: ob_camp.id_url,
            oldUrl: ob_camp.urlOrigin,
            faGroup: faGroup,
            sms: arrShort.sms.url,
            email: arrShort.email.url,
            other: arrShort.other.url,
            fb: fb,
            start: ob_camp.start_time,
            end: ob_camp.end_time,
            idEmail: arrShort.email.id,
            idSms: arrShort.sms.id,
            idOther: arrShort.other.id,
            arrIdFb: arrIdFb
        }
        obCampBefore = customer; //don't care
        // console.log("Send:",customer);
        res.render('../d_views/enter/editCamp.ejs', {customer:customer, arrCampaign: arr_campaignPl});
    } catch (e) {
        console.log(e + "--tuan: editCamp_get enterControll");
    }
}
exports.editCamp_post = async (req, res) => {
    // console.log("Receive:", req.body);
    let BF = obCampBefore;
    let customer;
    let rq = req.body;
    rq.username = req.session.user;// tai su dung lai code trong CampaignModul
    try {
        // pageCamp khong su dung tai day truyen vao "0"
        customer = await CampaignModul.validateUpdate(rq, BF, 0);
        if (customer.state == 'ok') {
            let rs = await CampaignModul.saveUpdateCamp(rq, BF.idCamp, BF.idUrl, BF.idEmail, BF.idSms, BF.idOther, BF.arrIdFb);
        }
        res.send(customer);
    } catch (e) {
        console.log(e + '--tuan: editCamp_port in EnterControll');
    }
}
//Delete campaign
exports.deleteCamp = async (req, res) => {
    let idCampDel = req.params.id;
    try {
        let ob_camp = await Campaign.getObCampById(idCampDel);
        // console.log("ob_camp:", ob_camp);
        let idUrl = ob_camp.id_urls;
        let ob_url = await Url.getObUrlById(idUrl); 
        // console.log("ob_url:", ob_url);
        let arrIdShort = ob_url.short_urls;
        let rs = await CampaignModul.deleteCamp(idCampDel, idUrl, arrIdShort);
        res.redirect('/enterprise/manager');
    } catch (e) {
        console.log(e + '--tuan: deleteCamp in EnterControll');
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

// get Short Link
exports.getShortLink = async (req, res) => {
    let domain = "dontcare.com";
    let newUrl = seedUrl.createShortUrl(domain);
    res.send(newUrl);
}
/*Short Link*/
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
/*---end Short Link--*/

//history
exports.history = async (req, res) => {
    let pageHistory = req.params.page;
    try {
        let idUser = await User.getIdByUser(req.session.user);
        console.log("idUser:", idUser);
        // let arr_short = await Shorten.getAllShortByUser(idUser, pageHistory);
        //get array  short
        //1. lay 10 gia tri id url trong campaign null
        //2. lay 10 gia tri idurlshort tuong ung voi idurl
        console.log("arr_short:", arr_short);
        arr_short = await LinkModul.allJoinArrShort(arr_short);
        // arr_shortP = arr_short; //don't care
        // get totalLink not Link campaign
        let totalLink = await Shorten.getTotalLink();
        // console.log("arr_short:", arr_short);
        let data = { arr_short: arr_short, admin: 'ADMIN', page: pageHistory, totalLink: totalLink };
        res.render('../d_views/enter/history.ejs', {data:data, arrCampaign: arr_campaignPl});
    } catch (e) {
        console.log(e + "--tuan: history");
    }
}


















