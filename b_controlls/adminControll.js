const Admin = require('../c_models/adminModel');
const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Access = require('../c_models/accesslogModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const seedUrl = require('../public/modul/seedUrl');
let arr_shortP;
let obShortBefore;

//Handle login
exports.login_get = (req, res) => {
    res.render("../d_views/admin/login.ejs");
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
// manager
exports.manager = async (req, res) => {
    // get total record
    let totalLink = await Shorten.getTotalRecord();//console.log("totalShort:", totalShort);
    let totalUser = await User.getTotalRecord();
    let totalCamp = await Campaign.getTotalRecord();
    let totalClick = await Access.getTotalRecord();
    let data = { totalLink: totalLink, totalUser: totalUser, totalCamp: totalCamp, totalClick: totalClick };
    // let data = {totalLink: 60, totalUser: 5, totalCamp: 1300, totalClick: 80000};    
    res.render("../d_views/admin/manager.ejs", { data: data });
}
// admin manager user
exports.managerUser = async (req, res) => {
    page_current = req.params.page;
    try {
        let totalUser = await User.getTotalRecord();
        let users = await User.getAllUser(page_current);
        res.render('../d_views/admin/managerUser.ejs', { users: users, admin: "ADMIN", page: page_current, totalUser: totalUser });
    } catch (e) {
        console.log(e + "--tuan: error managerUser");
    }
};
// add new user
exports.addUser_get = async (req, res) => {
    res.render("../d_views/admin/addUser.ejs", { admin: "ADMIN" });
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
        let user = await User.findByID(id);
        res.render("../d_views/admin/updateUser.ejs", { admin: "ADMIN", user: user });
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
        let result = await User.delete(id);
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
        let user = await User.findByID(id, req.body);
        res.render("../d_views/admin/detailUser.ejs", { admin: "ADMIN", user: user, page: page_current });
    } catch (e) {
        console.log(e + "--tuan: detailUser");
    }
};

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

// Start manager Link
exports.managerLink = async (req, res) => {
    pageUrl = req.params.page;
    try {
        let arr_short = await Shorten.getAllShort(pageUrl);
        arr_short = await allJoinArrShort(arr_short);
        arr_shortP = arr_short; //don't care
        // get totalLink not Link campaign
        let totalLink = await Shorten.getTotalLink();
        // console.log("arr_short:", arr_short);
        let data = { arr_short: arr_short, admin: 'ADMIN', page: pageUrl, totalLink: totalLink };
        res.render('../d_views/admin/managerLink.ejs', data);
    } catch (e) {
        console.log(e + "--tuan: err managerLink");
    }
};
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
/* End manager link*/
// Add link
exports.addLink_get = async (req, res) => {
    res.render("../d_views/admin/addLink.ejs", { admin: 'ADMIN' });
};
exports.addLink_post = async (req, res) => {
    // console.log("receive:", req.body);
    let customer = {};
    try {
        //Check if the user exists ?
        let checkUser = await User.checkExistUser(req.body.username);
        let username = req.body.username;
        let urlOrigin = req.body.urlOrigin;
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
            let urlShort = seedUrl.createShortUrl();
            let ob_shortUrl = await Shorten.save({ url: urlShort });
            let object_url = { url: urlOrigin, short_urls: [ob_shortUrl.id] };
            let result = await Url.save(object_url);
            //get id_user by user 
            let id_user = await User.getIdByUser(username);
            let checkUser = await Campaign.checkUserExist(id_user);
            if (checkUser) {
                await Campaign.update(id_user, result.id);// result.id = id_url
            } else {
                let ob_campaign = { id_user: id_user, id_urls: [result.id] };
                await Campaign.save(ob_campaign);
            }
            customer.state = 'ok';
            let totalLink = await Shorten.getTotalLink();
            let last_page = Math.ceil(totalLink / 10);
            customer.last_page = last_page;
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
        for (let i = 0; i < arr_shortP.length; i++) {
            if (id == arr_shortP[i].id) {
                ob_urlShort = arr_shortP[i];
                break;
            }
        }
        obShortBefore = ob_urlShort;//don't care
        let data = { admin: 'ADMIN', ob_urlShort: ob_urlShort, page_current: pageUrl };
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
            let rs = await saveUpdateLink(username, urlShort, urlOrigin);
            customer.state = 'ok';
            customer.page_current = pageUrl;
        }
        // console.log("customer:", customer);
        res.send(customer);
    } catch (e) {
        console.log(e + "--tuan: updateLink_post adminControll");
    }
};
//save change update Link
let saveUpdateLink = async (username, urlShort, urlOrigin) => {
    if (username == obShortBefore.username && urlShort == obShortBefore.urlShort && urlOrigin == obShortBefore.urlOrigin){
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
            let data = {id_user: idNewUser, id_urls :[obShortBefore.idUrlOrigin], name: null, end_time: null}
            let rs8 = await Campaign.save(data);
            let rs11 = await Campaign.removeIdUrlInCamp(obShortBefore.idCamp, obShortBefore.idUrlOrigin);
            if(urlShort != obShortBefore.urlShort) {
                let rs10 = await Shorten.updateUrlShort(obShortBefore.id, urlShort);
            }
            if(urlOrigin != obShortBefore.urlOrign) {
                let rs9 = await Url.updateUrlOrigin(obShortBefore.idUrlOrigin, urlOrigin);
            } 
        }
        else {
            // console.log("Ton tai campaign null");
            obNewCamp = obNewCamp[0];
            //add urlOrigin into new Campaign
            let rs4 = await Campaign.addIdUrlInCamp(obNewCamp.id, obShortBefore.idUrlOrigin);
            let rs5 = await Campaign.removeIdUrlInCamp(obShortBefore.idCamp, obShortBefore.idUrlOrigin);
            if(urlShort != obShortBefore.urlShort) {
                let rs6 = await Shorten.updateUrlShort(obShortBefore.id, urlShort);
            }
            if(urlOrigin != obShortBefore.urlOrign) {
                let rs7 = await Url.updateUrlOrigin(obShortBefore.idUrlOrigin, urlOrigin);
            } 
        }

    }
}
/* End Update Link */

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


// Detail Link
exports.detailLink = async (req, res) => {
    id = req.params.id;
    let ob_urlShort;
    try {
        for (let i = 0; i < arr_shortP.length; i++) {
            if (id == arr_shortP[i].id) {
                ob_urlShort = arr_shortP[i];
                break;
            }
        }
        let data = { admin: 'ADMIN', ob_urlShort: ob_urlShort, page_current: pageUrl };
        res.render("../d_views/admin/detailLink.ejs", data);
    } catch (e) {
        console.log(e + "--tuan: detailLink_get adminControll");
    }
};


// Delete Link
exports.deleteLink = async (req, res) => {
    id = req.params.id;
    let ob_urlShort;
    try{
        for (let i = 0; i < arr_shortP.length; i++) {
            if (id == arr_shortP[i].id) {
                ob_urlShort = arr_shortP[i];
                break;
            }
        }
        let rs = await subdDeleteLink(ob_urlShort);
        let path = '/admin/manager/link/' + pageUrl.toString();
        res.redirect(path);
    } catch (e) {
        console.log(e + "--tuan: deleteLink in adminControll");
    }
};
let subdDeleteLink = async (ob_urlShort) => {
    if(ob_urlShort.username == "unregistered") {
        let rs1 = await Url.delete(ob_urlShort.idUrlOrigin);
        let rs2 = await Shorten.delete(ob_urlShort.id);
    }
    else {
        let rs3 = await Campaign.removeIdUrlInCamp(ob_urlShort.idCamp, ob_urlShort.idUrlOrigin);
        let rs4 = await Url.delete(ob_urlShort.idUrlOrigin);
        let rs5 = await Shorten.delete(ob_urlShort.id);
    }
}



//test
exports.test = async (req, res) => {
    let test = await Campaign.getCampaignNull('5bf77299b9abf91929387344');
    console.log("test:", test);
    res.send("hello test");
}