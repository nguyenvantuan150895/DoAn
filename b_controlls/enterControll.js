const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const Calendar = require('../c_models/calendarModel');
const seedUrl = require('../public/modul/seedUrl');
const CampaignModul = require('../public/modul/campaignModul');
const ExportModul = require('../public/modul/exportModul');
const AccessModul = require('../public/modul/accessModul');
const LinkModul = require('../public/modul/linkModul');
const fs = require('fs');
const cmd = require('node-cmd');
const promise = require('bluebird');

// const Accesslog = require('../c_models/accesslogModel');
let valueSearchPl = "";
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
/*Domain head, foot*/
let domainH, domainF;



// Manager campaign
exports.manager = async (req, res) => {
    // manager tro ve homeEnter.ejs
    let id_user = await User.getIdByUser(req.session.user);
    let ob_user = await User.getObUserByName(req.session.user);
    let nameCamp = req.query.campaign;
    let valueSearch = "";
    let arr_campaign;
    try {
        if (nameCamp == undefined) {
            arr_campaign = await Campaign.getAllCampaignByIDUser(id_user);
        } else {
            valueSearch = nameCamp;
            valueSearchPl = valueSearch;
            arr_campaign = await Campaign.searchCamp(id_user, nameCamp);
        }
        arr_campaign = seedUrl.removeCampaignNull(arr_campaign);
        arr_campaignPl = arr_campaign;//don't care
        res.render("../d_views/enter/homeEnter.ejs", {
            arrCampaign: arr_campaign, valueSearch: valueSearch,
            ob_user: ob_user, domainH: domainH, domainF: domainF
        });
    } catch (e) {
        console.log(e + "--tuan:manager in enter");
    }
}

// detail campaign
exports.getDetailCamp = async (req, res) => {
    let id = req.params.id;
    let customer = {};
    try {
        let ob_user = await User.getObUserByName(req.session.user);
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
        let response = {
            arrCampaign: arr_campaignPl, obCamp: ob_campaign, customer: customer,
            valueSearch: valueSearchPl, ob_user: ob_user, domainH: domainH, domainF: domainF
        }
        // console.log("customer:", JSON.stringify(customer));
        res.render('../d_views/enter/detailCampaign.ejs', response);

    } catch (e) {
        console.log(e + "--tuan: getailCampain in EnterControll");
    }
}
//Create campaign
exports.createCampaign_get = async (req, res) => {
    let ob_user = await User.getObUserByName(req.session.user);
    res.render("../d_views/enter/createCampaign.ejs", {
        arrCampaign: arr_campaignPl,
        valueSearch: valueSearchPl, ob_user: ob_user, domainH: domainH, domainF: domainF
    });
}
exports.createCampaign_post = async (req, res) => {
    let data = req.body;
    let domain = 'dontcare.com';
    let sms = seedUrl.createShortUrl(domain);
    let email = seedUrl.createShortUrl(domain);
    let other = seedUrl.createShortUrl(domain);
    let fb = [];
    let ob_user = await User.getObUserByName(req.session.user);

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
    res.render('../d_views/enter/confirm.ejs', {
        customer: customer, arrCampaign: arr_campaignPl,
        valueSearch: valueSearchPl, ob_user: ob_user, domainH: domainH, domainF: domainF
    });
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
        let ob_user = await User.getObUserByName(req.session.user);
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
        res.render('../d_views/enter/editCamp.ejs', {
            customer: customer, arrCampaign: arr_campaignPl,
            valueSearch: valueSearchPl, ob_user: ob_user, domainH: domainH, domainF: domainF
        });
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
    let totalLink = 0;
    // console.log("req.body:", req.body);
    try {
        let checkFormat = seedUrl.checkFormatUrlShort(req.body.newUrl, domain);
        // console.log("Checkfomat:", checkFormat);
        let checkExist = await Shorten.checkExist(req.body.newUrl);
        // console.log("CheckExist:", checkExist);
        if (checkFormat == true && checkExist == false) {
            await addLink1(req.body.oldUrl, req.body.newUrl, req.session.user);
            //get totalLink
            let id_user = await User.getIdByUser(req.session.user);
            let ob_campaign = await Campaign.getArrObUrl(id_user);
            if (ob_campaign != undefined) totalLink = ob_campaign.id_urls.length;
            let last_page = Math.ceil(totalLink / 10);
            //
            customer.last_page = last_page;
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
    try {
        let ob_shortUrl = await Shorten.save({ url: newUrl });
        // console.log("ob_shortUrl:", ob_shortUrl);
        let object_url = { url: oldUrl, short_urls: [ob_shortUrl.id] };
        let ob_url = await Url.save(object_url);
        // console.log("ob_url:", ob_url);
        let id_user = await User.getIdByUser(user);
        let ob_camp = await Campaign.getCampaignNull(id_user);
        if (ob_camp.length > 0) {
            ob_camp = ob_camp[0];
            // console.log("ob_camp:", ob_camp);
            let rs = await Campaign.addIdUrlInCamp(ob_camp.id, ob_url.id);
        } else {
            let ob_campaign = { id_user: id_user, id_urls: [ob_url.id] };
            await Campaign.save(ob_campaign);
        }
    } catch (e) {
        console.log(e + "--- Tuan: Error addLink1 in EnterControll");
    }
};
/*---end Short Link--*/

//history
exports.showHistory = async (req, res) => {
    let page_size = 10;
    let ob_campaign;
    pageHistory = req.params.page;
    // console.log("page_current:", page_current);
    let i = (pageHistory - 1) * page_size;
    let limit1 = (pageHistory - 1) * page_size + page_size;
    let arr_link = [];
    let totalLink = 0;
    try {
        let ob_user = await User.getObUserByName(req.session.user);
        let id_user = await User.getIdByUser(req.session.user);
        ob_campaign = await Campaign.getCampaignNull(id_user);
        if(ob_campaign.length > 0 ) ob_campaign = ob_campaign[0];
        //console.log("ob_campaign:", ob_campaign);
        if (ob_campaign != undefined) {
            let arr_idUrl = ob_campaign.id_urls;
            if (arr_idUrl != undefined) {
                totalLink = arr_idUrl.length;
                //console.log("totalLink:", totalLink);
                // totalRecord = totalLink; // don't care 
                let limit = (limit1 > totalLink) ? totalLink : limit1;
                //console.log("limit:", limit);
                //Get 10 records(url & urlshort) per page
                for (i; i < limit; i++) {
                    let result1 = await Url.getObUrlById(arr_idUrl[i]);
                    if (result1 != undefined) {
                        let result2 = await Shorten.getObUrlShorten(result1.short_urls[0]);
                        if (result2 != undefined) {
                            let tempUrl = {
                                idUrl: arr_idUrl[i], urlOrigin: result1.url, urlShort: result2.url,
                                totalClick: result2.totalClick, timeCreate: result1.timeCreate, idShortUrl: result2.id
                            }
                            arr_link.push(tempUrl);
                        }
                    }
                }
            }
            //console.log("arr_url:", arr_url[0]);
        }
        let data = { arr_short: arr_link,page: pageHistory, totalLink: totalLink };
        ///console.log("Data:", data);
        res.render('../d_views/enter/history.ejs', {
            data: data, arrCampaign: arr_campaignPl,
            valueSearch: valueSearchPl, ob_user: ob_user, domainH: domainH, domainF: domainF
        });
    } catch (e) {
        console.log(e + "--tuan: error Manager");
    }
}
// edit Link History
exports.editLink = async (req, res) => {
    // console.log("receive:", req.body);
    let customer = {};
    try {
        //check new url invalid
        let domain = "dontcare.com";
        let newUrl = req.body.newUrl;
        let check_format = seedUrl.checkFormatUrlShort(newUrl, domain);
        let checkExist = await Shorten.checkExist(newUrl);
        if (check_format) {
            if (checkExist && (req.body.newUrl != req.body.urlPreEdit)) {
                customer.state = "fail";
            } else {
                await Shorten.update(req.body.idShortUrl, { url: req.body.newUrl });
                customer.state = "ok";
            }
        } else customer.state = 'fail';
        return res.send(customer);
    } catch (e) {
        console.log(e + "--tuan: Error editLink in enterControll!");
    }
}
exports.deleteLink = async (req, res) => {
    let idUrlOrign = req.params.id;
    try {
        let ob_url = await Url.getObUrlById(idUrlOrign);
        let ob_shorten = await Shorten.getObUrlShorten(ob_url.short_urls[0]);//by id
        let id_user = await User.getIdByUser(req.session.user);
        let ob_camp = await Campaign.getCampaignNull(id_user); ob_camp = ob_camp[0];
        //delete
        let rs1 = await Shorten.delete(ob_shorten.id); //console.log("rs1:", rs1);
        let rs2 = await Url.delete(ob_url.id);
        let rs3 = await Campaign.removeIdUrlInCamp(ob_camp.id, ob_url.id);

    } catch (e) {
        console.log(e + "--tuan: error delete in urlControll.")
    }
    let path = '/enterprise/history/' + pageHistory;
    res.redirect(path);
}
// Upgrade premium
exports.upgrade = async (req, res) => {
    try {
        let ob_user = await User.getObUserByName(req.session.user);
        let email = ob_user.email;
        let domain = req.body.domain; domain = domain.toString();
        let command = "cd ~ && cd tool && echo vinadc@123457 | sudo -S node index.js " + domain + " " + email;
        //cmd.run(command);
        res.send({ email: email });
    } catch (e) {
        console.log(e + "--tuan: upgrade in entercontroll");
    }
}
// Profile
exports.getProfile = async (req, res) => {
    let ob_user = await User.getObUserByName(req.session.user);
    res.render('../d_views/enter/profile.ejs', {
        arrCampaign: arr_campaignPl, valueSearch: valueSearchPl,
        ob_user: ob_user, domainH: domainH, domainF: domainF
    });
}
// Edit Enter
exports.editEnter_get = async (req, res) => {
    let ob_user = await User.getObUserByName(req.session.user);
    res.render('../d_views/enter/editEnter.ejs', {
        arrCampaign: arr_campaignPl, valueSearch: valueSearchPl,
        ob_user: ob_user, domainH: domainH, domainF: domainF
    });
}
exports.editEnter_post = async (req, res) => {
    // console.log("receive:", req.body);
    let customer = {};
    try {
        let ob_user = await User.getObUserByName(req.session.user);
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        let checkUser = await User.checkExistUser(username);
        let checkEmail = await User.checkExistEmail(email);
        if (checkUser == true && username != ob_user.username) {
            customer.state = 'fail';
            customer.existUser = true;
        }
        else if (checkEmail == true && email != ob_user.email) {
            customer.state = 'fail';
            customer.existEmail = true;
        }
        else {
            let obUpdate = { username: username, password: password, email: email };
            let rs = await User.update(ob_user.id, obUpdate);
            customer.state = 'ok';
            req.session.user = username;
        }
        res.send(customer);
    } catch (e) {
        console.log(e + "--tuan: editEnter in enterControll");
    }

}
// Calendar
exports.calendar = async (req, res) => {
    try {
        let ob_user = await User.getObUserByName(req.session.user);
        res.render("../d_views/enter/calendar.ejs", {
            arrCampaign: arr_campaignPl, valueSearch: valueSearchPl,
            ob_user: ob_user, domainH: domainH, domainF: domainF
        });
    } catch (e) {
        console.log(e + "--tuan:calendar in enter");
    }
}
// api get all event calendar
exports.getCalendar = async (req, res) => {
    try {
        let arrCalen = await Calendar.getAllRecord(req.session.user);
        res.json(arrCalen);
    } catch (e) {
        console.log(e + "--tuan:getCalendar in enter");
    }
}
//api add new event in calendar
exports.addEventCalendar = async (req, res) => {
    try {
        
        req.body.username = req.session.user;
        let rs = await Calendar.addEvent(req.body);
        let arrCalen = await Calendar.getAllRecord(req.session.user);
        res.json(arrCalen);
    } catch (e) {
        console.log(e + "--tuan:getCalendar in enter");
    }
}







///////////// Suport function
let getDomain = () => {
    let domain = fs.readFileSync('domain.txt', 'utf8');
    domain = domain.trim();
    let arr = domain.split(".");
    if (arr.length == 3) {
        domainH = arr[1];
        domainF = arr[2];
    } else {
        domainH = arr[0];
        domainF = arr[1];
    }
    domainH = standardDomainH(domainH);
    domainF = "." + domainF.toString();
}
let standardDomainH = (domainH) => {
    let letterFirst = domainH.slice(0, 1);
    letterFirst = letterFirst.toUpperCase();
    let stringRemain = domainH.slice(1, domainH.length);
    let temp = letterFirst.toString() + stringRemain.toString();
    return temp;
}
//get domain
getDomain();










