const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const seedUrl = require('../public/modul/seedUrl');
const fs = require('fs');
//const md5 = require('md5');


let totalRecord = 0;
//Handle user login
exports.login_get = (req, res) => {
   res.render("../d_views/user/login.ejs");
}
exports.login_post = async (req, res) => {
    let customer ={};
    try {
        let result = await User.authentication(req.body.username, req.body.password);
        // console.log("result:", result);
        if(result) {
            customer.state = "ok";
            customer.role = result.role;
            req.session.user = req.body.username;
            res.send(customer);
            // console.log("customer:", customer);
        }
    } catch(e) {
        customer.state = "fail";
        res.send(customer);
        //console.log(e + "--tuan:Error login_post");
    }
   
}
//Handle user sign up
exports.signup_get = (req, res) => { 
    res.render("../d_views/user/signup.ejs");
}
exports.signup_post = async (req, res) => {
    let customer = {};
    try{
        let rs = await User.add(req.body);
        // console.log("Req.body:", req.body);
        if(rs.id) {
            customer.state = "ok";
            customer.role = req.body.role;
            req.session.user = req.body.username;
        }
        return res.send(customer);
        
    }catch(err){
        let e = err.toString();
        customer.state = 'fail';
        if(e.search("`username` is required") != -1) customer.userBlank = true;
        else customer.userBlank = false;
        
        if(e.search("`password` is required") != -1) customer.passBlank = true;
        else customer.passBlank = false;
        
        if(e.search("`email` is required") != -1) customer.emailBlank = true;
        else customer.emailBlank = false;
        
        if(e.search("email_1 dup key") != -1) customer.emailDup = true;
        else customer.emailDup = false;
       
        if(e.search("username_1 dup key") != -1) customer.userDup = true;
        else customer.userDup = false;
        
        res.send(customer);
        //console.log(e + "----tuan: error signup_post!");
    }
}
//user Logout
exports.userLogout = (req, res) => {
    req.session.user = undefined;
    res.redirect('/user/login');
}
// user add link
exports.addLink = async (req, res) => { 
    let data = {};
    let domain = "dontcare.com";
    data.urlOrigin = req.body.urlOrigin;
    let shortUrl = seedUrl.createShortUrl(domain);
    try{
        let ob_shortUrl = await Shorten.save({url: shortUrl});
        let object_url = {url:req.body.urlOrigin , short_urls : [ob_shortUrl.id]};
        let ob_url = await Url.save(object_url);
        if(req.session.user) {// if req.session.user , gs : = user1
            let id_user = await User.getIdByUser(req.session.user);//req.session.user
            let checkUser = await Campaign.checkUserExist(id_user);
            let ob_camp = await Campaign.getCampaignNull(id_user); 
            if(checkUser) {
                ob_camp = ob_camp[0];
                let rs = await Campaign.addIdUrlInCamp(ob_camp.id,ob_url.id);
            } else {
                let ob_campaign = {id_user: id_user, id_urls :[ob_url.id]};
                await Campaign.save(ob_campaign);
            }
        }
        if(ob_url) data.urlShort = shortUrl;
        res.send(data);
    }catch(e) {
        console.log(e +"--- Tuan: Error addLink" );
    }
};

//user manager
exports.manager = async (req, res) => {
    //res.render("../d_views/user/manager.ejs", {user: "user1"});
    let page_size = 5;
    page_current = req.params.page;
    // console.log("page_current:", page_current);
    let i = (page_current - 1) * page_size;
    let limit1 = (page_current - 1) * page_size + page_size;
    let arr_url = [];
    let count = 0;
    try {
        let domain = fs.readFileSync('domain.txt', 'utf8');
        domain = domain.trim();
        domain = domain + '/';
        let id_user = await User.getIdByUser(req.session.user);
        let ob_campaign = await Campaign.getArrObUrl(id_user);
        if (ob_campaign != undefined) {
            let arr_idUrl = ob_campaign.id_urls; // get array oldUrl
            // get total url created by user
            if(arr_idUrl != undefined) {
                count = arr_idUrl.length;
                totalRecord = count; // don't care 
                let limit = (limit1 > count) ? count : limit1;
                //Get 5 records(url & urlshort) per page
                for(i ; i < limit ; i ++ ) {
                    let result1 = await Url.getObUrlById(arr_idUrl[i]);
                            //console.log("Result1:", result1);
                            //console.log("short_urls:", result1.short_urls[0]);
                    if(result1 != undefined) {
                        let result2 = await Shorten.getObUrlShorten(result1.short_urls[0]);
                        if(result2 != undefined) {
                            arr_url.push({id:arr_idUrl[i] ,oldUrl: result1.url, newUrl: result2.url, totalClick: result2.totalClick,timeCreate: result1.timeCreate, idShortUrl : result2.id});
                        } 
                    } 
                }
            }
                    //console.log("arr_url:", arr_url[0]);
        }
        let data3 = {url:arr_url, page:page_current, count: count, user: req.session.user,domain:domain }
        res.render("../d_views/user/manager.ejs",data3 );
    } catch (e) {
        console.log(e + "--tuan: error Manager");
    }
 }
// user delete
exports.delete = async (req, res) => {
    let id = req.params.id;// id cua url trong id_urls cua bang campaign
            //console.log("id receive:", id);
    try {
        let ob_url = await Url.getObUrlById(id);
                //console.log("ob_url:", ob_url);
        let ob_shorten = await Shorten.getObUrlShorten(ob_url.short_urls[0]);//by id
        let id_user = await User.getIdByUser(req.session.user);
        let ob_camp = await Campaign.getCampaignNull(id_user); ob_camp = ob_camp[0];
        // console.log("camapaign:", ob_camp);
        // console.log("idUrl:", ob_url.id);
        // console.log("idShort:", ob_shorten.id);
        // console.log("Id CAMPAIGN:", ob_camp.id);
        //delete
        let rs1 = await Shorten.delete(ob_shorten.id); //console.log("rs1:", rs1);
        let rs2 = await Url.delete(ob_url.id);
        let rs3 = await Campaign.removeIdUrlInCamp(ob_camp.id, ob_url.id);
        
    } catch (e) {
        console.log(e + "--tuan: error delete in urlControll.")
    }
    let path = '/user/manager/' + page_current;
    res.redirect(path);
}

//Create Link custom
exports.userCreateLink = async (req, res) => {
    let customer = {};
    let domain = "dontcare.com";
    try {
        //check new url invalid
        let newUrl = req.body.newUrl;
        let oldUrl = req.body.oldUrl;
        let checkShort = seedUrl.checkFormatUrlShort(newUrl, domain);
        if(checkShort) {
            let tuan = await addLink1(oldUrl, newUrl, req.session.user);
            let last_page = lastPaste((totalRecord + 1), 5);
            customer.last_page = last_page;
            customer.state = 'ok';
        } else {
            customer.state = 'fail';
        }
        return res.send(customer); 
    } catch (e) {
        console.log(e + "--tuan: Error UserCreateLink");
    }
}

//User Edit Link
exports.userEditLink = async (req, res) => {
    let customer = {};
    try {
        //check new url invalid
        let domain = "dontcare.com";
        let newUrl = req.body.newUrl;
        let check_format = seedUrl.checkFormatUrlShort(newUrl, domain);
        let checkExist = await Shorten.checkExist(newUrl);
        if(check_format){
            if(checkExist && (req.body.newUrl != req.body.urlPreEdit)) {
                customer.state = "fail";
            } else {
                await Shorten.update(req.body.idShortUrl, {url: req.body.newUrl});
                customer.state = "ok";
            }
        }else customer.state = 'fail';
        return res.send(customer); 
    } catch (e) {
        console.log(e +"--tuan: Error userEditLink");
    }
}

//add Link1
let addLink1 = async (oldUrl, newUrl, user) => { 
    try{
        let ob_shortUrl = await Shorten.save({url: newUrl}); 
        let object_url = {url:oldUrl , short_urls : [ob_shortUrl.id]};
        let ob_url = await Url.save(object_url);
        
        //get id_user by user 
        let id_user = await User.getIdByUser(user);//req.session.user
        let checkUser = await Campaign.checkUserExist(id_user);
        let ob_camp = await Campaign.getCampaignNull(id_user); 
        if(checkUser) {
            ob_camp = ob_camp[0];
            let rs = await Campaign.addIdUrlInCamp(ob_camp.id,ob_url.id);
        } else {
            let ob_campaign = {id_user: id_user, id_urls :[ob_url.id]};
            await Campaign.save(ob_campaign);
        }
        return true;
    }catch(e) {
        console.log(e +"--- Tuan: Error addLink1" );
        return (e);
    }
};

let lastPaste = (totalRecord, page_size) => {
    let last = Math.ceil(Number(totalRecord) / Number(page_size));
    return last;
}



