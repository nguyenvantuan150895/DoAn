const Admin = require('../c_models/adminModel');
const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Access = require('../c_models/accesslogModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const seedUrl = require('../public/modul/seedUrl');
const AccessModul = require('../public/modul/accessModul.js');
const ExportModul = require('../public/modul/exportModul.js');
const CampaignModul = require('../public/modul/campaignModul.js');
const LinkModul = require('../public/modul/linkModul.js');
const fs = require('fs');
/*CRUD admin*/
let ob_adminBF;
/*manager link */
let arr_shortP;
let obShortBefore;
let totalCampPl;
/*manager camp */
let arrCampPl;
let ob_campUpdateCamp_get;
/*Export camp*/
let ob_campaignPl;
let ob_urlPl;
let arr_shortPl;
let accessGr_Pl;
let accessE_Pl;
let accessS_Pl;
let accessO_Pl;
let ob_userPl;
/*end export*/
/*Domain head, foot*/
let domainH, domainF;


//Handle login
exports.login_get = (req, res) => {
    res.render("../d_views/admin/login.ejs",{domainH: domainH, domainF: domainF});
};
exports.login_post = async (req, res) => {
    let state;
    let rs = await Admin.authentication(req.body.account, req.body.password);
    if (rs) {
        state = 'ok';
        req.session.admin = req.body.account;
    }
    else state = 'fail';
    res.json({ mess: state });
};
// admin logout
exports.logout = (req, res) => {
    req.session.admin = undefined;
    res.redirect("/admin/login");
}
// profile
exports.getProfile = async (req, res) => {
    let admin = req.session.admin; //console.log("Admin:", admin);
    let ob_admin = await Admin.getObAdminByAccount(admin);
    res.render("../d_views/admin/profile.ejs", {ob_admin: ob_admin, domainH: domainH, domainF: domainF});
};
//edit admin
exports.editAdmin_get = async (req, res) => {
    let id_admin = req.params.id;
    let ob_admin = await Admin.getObAdminById(id_admin);
    ob_adminBF = ob_admin; //don't care
    res.render("../d_views/admin/editAdmin.ejs", {ob_admin: ob_admin, domainH: domainH, domainF: domainF});
};
exports.editAdmin_post = async (req, res) => {
    //console.log("receive:", req.body);
    let customer = {};
    try{
        let account = req.body.account;
        let email = req.body.email;
        let password = req.body.password;
        let checkAccount = await Admin.checkExistAccount(account);
        let checkEmail = await Admin.checkExistEmail(email);
        if(checkAccount == true && account != ob_adminBF.account ){
            customer.state = 'fail';
            customer.existAccount = true;
        }
        else if(checkEmail == true && email != ob_adminBF.email) {
            customer.state = 'fail';
            customer.existEmail = true;
        }
        else{
            let obUpdate = {account: account, password:password, email: email};
            let rs = await Admin.update(ob_adminBF.id, obUpdate);
            customer.state = 'ok';
            req.session.admin = account;
        }
        res.send(customer);
    }catch(e){
        console.log(e +"--tuan: editAdmin in adminControll");
    }
    
};
// create Admin
exports.createAdmin_get =  (req, res) => {
    res.render("../d_views/admin/createAdmin.ejs");
};
exports.createAdmin_post = async (req, res) => {
    let customer = {};
    try{
        let account = req.body.account;
        let email = req.body.email;
        let password = req.body.password;
        let checkAccount = await Admin.checkExistAccount(account);
        let checkEmail = await Admin.checkExistEmail(email);
        if(checkAccount == true){
            customer.state = 'fail';
            customer.existAccount = true;
        }
        else if(checkEmail == true) {
            customer.state = 'fail';
            customer.existEmail = true;
        }
        else{
            let objectAdmin = {account: account, password:password, email: email};
            let rs = await Admin.createAdmin(objectAdmin);
            customer.state = 'ok';
        }
        res.send(customer);
    }catch(e){
        console.log(e +"--tuan: createAdmin_post in adminControll");
    }
}
// manager
exports.manager = async (req, res) => {
    // get total record
    let totalLink = await Shorten.getTotalRecord();//console.log("totalShort:", totalShort);
    let totalUser = await User.getTotalRecord();
    let totalCamp = await Campaign.getTotalRecord();
    let totalClick = await Access.getTotalRecord();
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    let data = { totalLink: totalLink, totalUser: totalUser, totalCamp: totalCamp, totalClick: totalClick };
    // let data = {totalLink: 60, totalUser: 5, totalCamp: 1300, totalClick: 80000};    
    res.render("../d_views/admin/manager.ejs", { data: data, domainH: domainH, domainF: domainF, ob_admin: ob_admin});
}
// admin manager user
exports.managerUser = async (req, res) => {
    page_current = req.params.page;
    let userSearch = req.query.userSearch;
    let totalUser;
    let users;//array
    let valueSearch = "";
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    try {
        if (userSearch == undefined) {
            totalUser = await User.getTotalRecord();
            users = await User.getAllUser(page_current);
        } else {
            valueSearch = userSearch;
            totalUser = await User.getTotalUserSearch(userSearch);
            users = await User.searchUser(userSearch, page_current, 10);
        }
        res.render('../d_views/admin/managerUser.ejs', {
            users: users, admin: "ADMIN", page: page_current,
            totalUser: totalUser, valueSearch: valueSearch,
            ob_admin: ob_admin, domainH: domainH, domainF: domainF
        });

    } catch (e) {
        console.log(e + "--tuan: error managerUser");
    }
};
// add new user
exports.addUser_get = async (req, res) => {
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    res.render("../d_views/admin/addUser.ejs", { ob_admin: ob_admin, domainH: domainH, domainF: domainF });
};
exports.addUser_post = async (req, res) => {
    let customer = {};
    // console.log("Receive:", req.body);
    try {
        let rs = await User.add(req.body);
        let totalUser = await User.getTotalRecord();
        let last_page = Math.ceil(totalUser / 10);
        if (rs) {
            customer.state = 'ok';
            customer.last_page = last_page;
        }
        res.send(customer);
    } catch (err) {
        let e = err.toString();
        customer.state = 'fail';
        if (e.search("`username` is required") != -1) customer.userBlank = true;
        else customer.userBlank = false;

        if (e.search("`password` is required") != -1) customer.passBlank = true;
        else customer.passBlank = false;

        if (e.search("`email` is required") != -1) customer.emailBlank = true;
        else customer.emailBlank = false;

        if (e.search("email_1 dup key") != -1) customer.emailDup = true;
        else customer.emailDup = false;

        if (e.search("username_1 dup key") != -1) customer.userDup = true;
        else customer.userDup = false;

        res.send(customer);
        // console.log(e +"--tuan: error addUser_post");
    }
};
//update User
exports.updateUser_get = async (req, res) => {
    id = req.params.id;
    try {
        let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
        let user = await User.findByID(id);
        res.render("../d_views/admin/updateUser.ejs", { ob_admin: ob_admin, user: user, 
            domainH: domainH, domainF: domainF });
    } catch (e) {
        console.log(e + "--tuan: updateUser_get");
    }
};
exports.updateUser_post = async (req, res) => {
    // console.log("receive:", req.body);
    let customer = {};
    try {
        let result = await User.update(id, req.body);
        if (result) {
            customer.state = 'ok';
            customer.page_current = page_current;
        }
        // console.log("customer send:", customer);
        res.send(customer);
    } catch (err) {
        let e = err.toString();
        customer.state = 'fail';
        if (e.search("`username` is required") != -1) customer.userBlank = true;
        else customer.userBlank = false;

        if (e.search("`password` is required") != -1) customer.passBlank = true;
        else customer.passBlank = false;

        if (e.search("`email` is required") != -1) customer.emailBlank = true;
        else customer.emailBlank = false;

        if (e.search("email_1 dup key") != -1) customer.emailDup = true;
        else customer.emailDup = false;

        if (e.search("username_1 dup key") != -1) customer.userDup = true;
        else customer.userDup = false;
        // console.log("customer send22:", customer);
        res.send(customer);
        // console.log(err +"--tuan: updateUser_post");
    }
};
//Delete User
exports.deleteUser = async (req, res) => {
    id = req.params.id;
    try {
        let result = await seedUrl.adminDeleteUser(id);
        let path = '/admin/manager/user/' + page_current.toString();
        res.redirect(path);
    } catch (e) {
        console.log(e + "--tuan: deleteUser");
    }
};
// Detail User
exports.detailUser = async (req, res) => {
    id = req.params.id;
    try {
        let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
        let user = await User.findByID(id, req.body);
        res.render("../d_views/admin/detailUser.ejs", {user: user, page: page_current ,
        ob_admin: ob_admin, domainH: domainH, domainF: domainF});
    } catch (e) {
        console.log(e + "--tuan: detailUser");
    }
};
/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

// Start manager Link
exports.managerLink = async (req, res) => {
    pageUrl = req.params.page;
    let linkSearch = req.query.linkSearch;
    let totalLink;
    let arr_short;//array
    let valueSearch = "";
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    try {
        if (linkSearch == undefined) {
            arr_short = await Shorten.getAllShort(pageUrl);
            totalLink = await Shorten.getTotalLink();
        } else {
            valueSearch = linkSearch;
            arr_short = await Shorten.searchLink(linkSearch, pageUrl, 10);
            totalLink = await Shorten.getTotalLinkSearch(linkSearch);
        }
        arr_short = await LinkModul.allJoinArrShort(arr_short);
        arr_shortP = arr_short; //don't care
        let data = { arr_short: arr_short, page: pageUrl, totalLink: totalLink, 
        valueSearch: valueSearch, ob_admin: ob_admin, domainH: domainH, domainF: domainF 
        };
        res.render('../d_views/admin/managerLink.ejs', data);
    } catch (e) {
        console.log(e + "--tuan: err managerLink");
    }
};

/* End manager link*/
// Add link
exports.addLink_get = async (req, res) => {
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    res.render("../d_views/admin/addLink.ejs", { ob_admin: ob_admin, domainH: domainH, domainF: domainF });
};
exports.addLink_post = async (req, res) => {
    // console.log("receive:", req.body);
    // let customer;
    try {
        customer = await LinkModul.validateAddLink(req.body);
        if (customer.state == 'ok') {
            let rs = await LinkModul.saveLink(req.body.urlOrigin, req.body.username);
        }
        res.send(customer);
    } catch (e) {
        console.log(e + "--tuan: addLink_port in adminController");
    }
}
// Start Update Link
exports.updateLink_get = async (req, res) => {
    id = req.params.id;
    let ob_urlShort;
    try {
        let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
        for (let i = 0; i < arr_shortP.length; i++) {
            if (id == arr_shortP[i].id) {
                ob_urlShort = arr_shortP[i];
                break;
            }
        }
        obShortBefore = ob_urlShort;//don't care
        let data = { ob_urlShort: ob_urlShort, page_current: pageUrl, 
        ob_admin: ob_admin,  domainH: domainH, domainF: domainF};
        res.render("../d_views/admin/updateLink.ejs", data);
    } catch (e) {
        console.log(e + "--tuan: updateLink_get adminControll");
    }
}
exports.updateLink_post = async (req, res) => {
    // console.log("receive:", req.body);
    let customer = {};
    let username = req.body.username;
    let urlOrigin = req.body.urlOrigin;
    let urlShort = req.body.urlShort;
    let checkFormat = await seedUrl.checkFormatUrlShort(urlShort, "dontcare.com");
    let checkExistUser = await User.checkExistUser(req.body.username);
    let checkExistShort = await Shorten.checkExist(urlShort);
    try {
        if (urlOrigin.length == 0) {
            customer.state = 'fail';
            customer.blankUrlOrigin = true;
        }
        else if (urlShort.length == 0) {
            customer.state = 'fail';
            customer.blankUrlShort = true;
        }
        else if (username.length == 0) {
            customer.state = 'fail';
            customer.blankUser = true;
        }
        else if (checkFormat == false) {
            customer.state = 'fail';
            customer.formatShort = false;
        }
        else if (checkExistShort == true && urlShort != obShortBefore.urlShort) {
            customer.state = 'fail';
            customer.existShort = true;
        }
        else if (checkExistUser == false) {
            customer.state = 'fail';
            customer.existUser = false;
        }
        else {
            let rs = await LinkModul.saveUpdateLink(username, urlShort, urlOrigin, obShortBefore);
            customer.state = 'ok';
            customer.page_current = pageUrl;
        }
        // console.log("customer:", customer);
        res.send(customer);
    } catch (e) {
        console.log(e + "--tuan: updateLink_post adminControll");
    }
}
/* End Update Link */

// Detail Link
exports.detailLink = async (req, res) => {
    id = req.params.id;
    let ob_urlShort;
    try {
        let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
        for (let i = 0; i < arr_shortP.length; i++) {
            if (id == arr_shortP[i].id) {
                ob_urlShort = arr_shortP[i];
                break;
            }
        }
        let data = { ob_urlShort: ob_urlShort, page_current: pageUrl, ob_admin: ob_admin,
        domainH: domainH, domainF: domainF };
        res.render("../d_views/admin/detailLink.ejs", data);
    } catch (e) {
        console.log(e + "--tuan: detailLink_get adminControll");
    }
};
// Delete Link
exports.deleteLink = async (req, res) => {
    id = req.params.id;
    let ob_urlShort;
    try {
        for (let i = 0; i < arr_shortP.length; i++) {
            if (id == arr_shortP[i].id) {
                ob_urlShort = arr_shortP[i];
                break;
            }
        }
        let rs = await subDeleteLink(ob_urlShort);
        let path = '/admin/manager/link/' + pageUrl.toString();
        res.redirect(path);
    } catch (e) {
        console.log(e + "--tuan: deleteLink in adminControll");
    }
};
let subDeleteLink = async (ob_urlShort) => {
    if (ob_urlShort.username == "unregistered") {
        let rs1 = await Url.delete(ob_urlShort.idUrlOrigin);
        let rs2 = await Shorten.delete(ob_urlShort.id);
    }
    else {
        let rs3 = await Campaign.removeIdUrlInCamp(ob_urlShort.idCamp, ob_urlShort.idUrlOrigin);
        let rs4 = await Url.delete(ob_urlShort.idUrlOrigin);
        let rs5 = await Shorten.delete(ob_urlShort.id);
    }
}
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

// Start Manger Campaign
exports.managerCamp = async (req, res) => {
    pageCamp = req.params.page;
    let campaignSearch = req.query.campaignSearch;
    let totalCamp;
    let arrCamp;//array
    let valueSearch = "";
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    try {
        if(campaignSearch == undefined) {
            arrCamp = await Campaign.getCampaignOtherNull(pageCamp);
            totalCamp = await Campaign.getTotalRecord();
        } else {
            valueSearch = campaignSearch;
            arrCamp = await Campaign.searchCamp1(campaignSearch, pageCamp, 5);
            totalCamp = await Campaign.getTotalCampSearch(campaignSearch);
        }
        arrCamp = await CampaignModul.standardizedCampaign(arrCamp);
        arrCampPl = arrCamp; //don't care
        totalCampPl = totalCamp;//don't care
        res.render("../d_views/admin/managerCamp.ejs", { arrCamp: arrCamp, page: pageCamp, 
            totalCamp: totalCamp, valueSearch: valueSearch,ob_admin: ob_admin, domainH: domainH,
            domainF: domainF
        });
    } catch (e) {
        console.log(e + "--tuan: managerCamp in adminControll");
    }

}
// Detail campaign
exports.detailCamp = async (req, res) => {
    idCamp = req.params.id;
    let customer = {};
    try {
        let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
        let ob_campaign = await Campaign.getCampaignById(idCamp); ob_campaignPl = ob_campaign;
        let ob_user = await User.findByID(ob_campaign.id_user); ob_userPl = ob_user;
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
        // total_fb = arr_accessF1.length;
        // total_e = arr_accessE1.length;
        // total_s = arr_accessS1.length;
        // total_o = arr_accessO1.length;
        // console.log("AverageGr:", averageGr);
        //Get info chart (os, browser, device)
        let arrFilter = arr_accessF1.concat(arr_accessE1, arr_accessS1, arr_accessO1);
        let objInfo = AccessModul.getInfoChart(arrFilter);
        //console.log("objInfo:", objInfo);

        customer.username = ob_user.username;
        customer.ob_campaign = ob_campaign;
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
        res.render("../d_views/admin/detailCamp.ejs", {customer : customer, ob_admin: ob_admin,
         domainH: domainH, domainF: domainF});
    } catch (e) {
        console.log(e + "--tuan: detailCamp admin controller");
    }
}
//export campaign
exports.exportCamp = (req, res) => {
    try {
        let report = ExportModul.exportExcel(ob_campaignPl, ob_urlPl, arr_shortPl,
            accessE_Pl, accessS_Pl, accessO_Pl, accessGr_Pl, ob_userPl.username);
        res.attachment('Campaign.xlsx');
        return res.send(report);
    } catch (e) {
        console.log(e + "--tuan: exportCamp in adminControll");
    }
}
// export AccessLog
exports.exportAccessLog = async (req, res) => {
    try {
        let arr_access = await Access.getAllRecord();
        let report = ExportModul.exportAccessLog(arr_access);
        res.attachment('AccessLog.xlsx');
        return res.send(report);
    } catch (e) {
        console.log(e + "--tuan: exportAccessLog in adminControll");
    }
}
// add Campaign
exports.addCampaign_get = async (req, res) => {
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
    res.render("../d_views/admin/addCamp.ejs", { ob_admin: ob_admin, domainH: domainH, domainF: domainF });
};
exports.addCampaign_post = async (req, res) => {
    let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
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
        username: data.username, name: data.name, oldUrl: data.oldUrl, faGroup: data.faceGroup,
        sms: sms, email: email, other: other, fb: fb, start: data.start, end: data.end
    }

    res.render('../d_views/admin/confirmCamp.ejs', {customer: customer, ob_admin: ob_admin,
    domainH: domainH, domainF: domainF});
};
//confirm Campaign
exports.confirmCampaign = async (req, res) => {
    
    let rq = req.body;
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
        console.log(e + '--tuan: confirmCampaign in AdminControll');
    }
};

//update Campaign
exports.updateCamp_get = async (req, res) => {
    idCamp = req.params.id;
    let ob_camp;
    for (let i = 0; i < arrCampPl.length; i++) {
        if (arrCampPl[i].id == idCamp) {
            ob_camp = arrCampPl[i];
            break;
        }
    }
    try {
        let ob_admin = await Admin.getObAdminByAccount(req.session.admin);
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
            page_current: pageCamp,
            idEmail: arrShort.email.id,
            idSms: arrShort.sms.id,
            idOther: arrShort.other.id,
            arrIdFb: arrIdFb
        }
        ob_campUpdateCamp_get = customer; //don't care
        // console.log("Send:",customer);
        res.render('../d_views/admin/updateCamp.ejs', {customer: customer, ob_admin: ob_admin,
           domainH: domainH, domainF: domainF});
    } catch (e) {
        console.log(e + "--tuan: updateCamp_get adminControll");
    }
}
exports.updateCamp_post = async (req, res) => {
    // console.log("Receive:", req.body);
    let BF = ob_campUpdateCamp_get;
    let customer;
    try {
        customer = await CampaignModul.validateUpdate(req.body, BF, pageCamp)
        if (customer.state == 'ok') {
            let rs = await CampaignModul.saveUpdateCamp(req.body, BF.idCamp, BF.idUrl, BF.idEmail, BF.idSms, BF.idOther, BF.arrIdFb);
        }
        res.send(customer);
    } catch (e) {
        console.log(e + '--tuan: updateCamp_port in AdminControll');
    }
};
//delete Campaign
exports.deleteCamp = async (req, res) => {
    idDelete = req.params.id;
    let ob_camp;
    try {
        for (let i = 0; i < arrCampPl.length; i++) {
            if (arrCampPl[i].id == idDelete) {
                ob_camp = arrCampPl[i];
                break;
            }
        }
        let idCamp = idDelete;
        let idUrl = ob_camp.id_url;
        let arrIdShort = ob_camp.ob_url.short_urls;
        let rs = await CampaignModul.deleteCamp(idCamp, idUrl, arrIdShort);
        res.redirect('/admin/manager/campaign/' + pageCamp);
    } catch (e) {
        console.log(e + '--tuan: deleteCamp in AdminControll');
    }
};
///////////////////////////////
let getDomain = () => {
    let domain = fs.readFileSync('domain.txt', 'utf8');
    domain = domain.trim();
    let arr = domain.split(".");
    if(arr.length == 3) {
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
    let letterFirst = domainH.slice(0,1);
    letterFirst = letterFirst.toUpperCase();
    let stringRemain = domainH.slice(1, domainH.length);
    let temp = letterFirst.toString() + stringRemain.toString();
    return temp;
}
//get domain
getDomain();

















