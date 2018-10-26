const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const Accesslog = require('../c_models/accesslogModel');
const seedUrl = require('../public/modul/seedUrl');

//Create campaign
exports.createCampaign_get = (req, res) => {
    //res.send("Giao dien createCampaign");
    res.render("../d_views/enter/createCampaign.ejs");
}
// Create seed Capaign
exports.createCampaign_post = (req, res) => {
    // console.log("req.body:", req.body['group[]']);
    // console.log("Req.body:", req.body);
    let data = req.body;
    let sms = seedUrl.createShortUrl();
    let email = seedUrl.createShortUrl();
    let other = seedUrl.createShortUrl();
    let fb = [];
    let len = data.faceGroup.length;
            // console.log("typeof DATA.FACEGROUP:",typeof data.faceGroup);
            // console.log("LEN:",len);
            //console.log("dataata length:", data.faceGroup.length);
    if(typeof data.faceGroup == "object" ){
        for( let i = 0; i < (data.faceGroup).length; i ++) {
            fb.push(seedUrl.createShortUrl());
         }
    } else if (typeof data.faceGroup == "string"){
        data.faceGroup = [data.faceGroup];
        fb.push(seedUrl.createShortUrl());
    }
    
    let customer = {name: data.name, oldUrl: data.oldUrl, faGroup: data.faceGroup,
    sms: sms, email: email, other: other, fb: fb, start: data.start, end: data.end}
    // res.send(customer);
    // console.log("customer:",customer );
    res.render("../d_views/enter/confirm.ejs", customer);
}

// Confirm campaign
exports.confirm_post = async (req, res) => {
    //res.send("Giao dien createCampaign");
    //console.log("Req.body ::::", req.body);
    let customer = {};
    let domain = "localhost:3000/";
    let rq = req.body;
    let flagExist = true; //default
    let flagFormat = false; //default
    let flagDup = true// default 
    let arrCheckDup = [rq.email, rq.sms, rq.other];
    arrCheckDup = arrCheckDup.concat(rq['fbArr[]']);
    
     
    try {
        //check exist url
        let checkEmail = await Shorten.checkExist(rq.email); console.log("checkEmail:", checkEmail);
        let checkSms = await Shorten.checkExist(rq.sms);  console.log("checkSms:", checkSms);
        let checkOther = await Shorten.checkExist(rq.other);  console.log("checkother:", checkOther);
        let checkFb = await seedUrl.checkExistForFb(rq['fbArr[]']); console.log("checkFb:", checkFb);
        //check Format
        let eFormat = seedUrl.checkFormatUrlShort(rq.email, domain); //console.log("eFormat:", eFormat);
        let sFormat = seedUrl.checkFormatUrlShort(rq.sms,domain); //console.log("sFormat:", sFormat);
        let oFormat = seedUrl.checkFormatUrlShort(rq.other,domain); //console.log("oFormat:", oFormat);
        let fbFormat = seedUrl.checkFormatFbShort(rq['fbArr[]'],domain); console.log("fbFormat:", fbFormat);
        
        if(checkEmail == false && checkSms == false && checkOther == false && checkFb == false) flagExist = false;//"ok"
        console.log("flagExist:", flagExist);
        if(eFormat && sFormat && oFormat && fbFormat ) flagFormat = true; //console.log("flagFormat:", flagFormat);
        flagDup = seedUrl.checkDuplicate(arrCheckDup); // console.log("flagDup:", flagDup);
        let flagCampaign = await checkNameCamp(rq.name, req.session.user);
                // console.log("CheckDup:", flagDup);
                // console.log("CheckExist:", flagExist);
                // console.log("CheckFormat:",flagFormat);

        if(flagExist == false && flagFormat == true && flagDup == false && flagCampaign == false) {
            console.log("ok");
            //save shorten
            let id_shortens = await saveShortUrlCampaign(rq); //console.log("id_shortens:", id_shortens);
            if(id_shortens != undefined) {
                //save url
                let ob_url = await Url.save({url: rq.oldUrl, short_urls :id_shortens, timeCreate: rq.start} );
                //console.log("ob_url:", ob_url);
                if(ob_url != undefined) {
                    //save campaign
                    let id_enter = await User.getIdByUser("enterprise");//req.session.user
                    //console.log("id_enter:", id_enter);
                    if(id_enter != undefined){
                        let ob_campaign = await Campaign.save({id_user:id_enter, id_urls:[ob_url.id], name: rq.name, start_time: rq.start, end_time: rq.end});
                        //console.log("ob_campaign:", ob_campaign);
                        if(ob_campaign != undefined) customer.state = "ok";
                        else customer.state = "fail";
                    } else customer.state = "fail";
                } else customer.state = "fail";
            } else customer.state = "fail";
            //res.send(customer);
        } else {
            console.log("Loi roi loi roi");
            customer.state = "fail";
            if(flagCampaign == true) customer.err_campaign = true;
            else customer.err_campaign = false;
            if(flagExist == true) customer.err_exist = true;
            else customer.err_exist = false;
            if(flagFormat == false) customer.err_format = true;
            else customer.err_format = false;
            if(flagDup == true) customer.err_dup = true;
            else customer.err_dup = false;
            //res.send(customer);
        }
    }catch (e) {
        console.log(e + "--tuan: confirm_post");
    }
    return res.send(customer);
}

// Manager campaign
exports.manager = (req, res) => {
    // console.log("user session:", req.session.user);
    res.render("../d_views/enter/managerCampaign.ejs");
}

// get Short Link
exports.getShortLink = (req, res) => {
    let newUrl = seedUrl.createShortUrl();
    res.send(newUrl);
}

//Short Link
exports.shortLink = async (req, res) => {
    let customer = {};
    let domain = "localhost:3000/";
    // console.log("req.body:", req.body);
    try{
        let checkFormat = seedUrl.checkFormatUrlShort(req.body.newUrl, domain);
        // console.log("Checkfomat:", checkFormat);
        let checkExist = await Shorten.checkExist(req.body.newUrl);
        // console.log("CheckExist:", checkExist);
        if(checkFormat == true && checkExist == false) {
            await addLink1(req.body.oldUrl, req.body.newUrl, req.session.user);
            customer.state = "ok";
        } else {
            customer.state = "fail";
            if(checkFormat == false) customer.err_format == true;
            else customer.err_format == false;
            if(checkExist == true) customer.err_exist = true;
            else customer.err_exist = false;
        } 
    }catch (e) {
        console.log(e + "--tuan: shortLink in enterControll");
    }
    res.send(customer);
    
}



//check name campaign
const checkNameCamp = async (nameCampaign, user) => {
    // console.log("name:", req.body);
    let id_user = await User.getIdByUser(user);
    let rs = await Campaign.checkNameCamp(nameCampaign,id_user);
    return rs;
}
const saveShortUrlCampaign = async (data) => {
        //console.log("Data in saveCampaign:", data);
    try{
        let arrIdShorten = [];
        let arrIdFb = await saveFb(data['groupArr[]'], data['fbArr[]']);
        arrIdShorten = arrIdShorten.concat(arrIdFb);
        let id_email = await saveESO(data.email,"email"); //console.log("id_email:", id_email);
        arrIdShorten.push(id_email);
        let id_sms = await saveESO(data.sms,"sms");
        arrIdShorten.push(id_sms);
        let id_other = await saveESO(data.other, "other");
        arrIdShorten.push(id_other);

        //console.log("SaveCampaign:", arrIdShorten);
        return arrIdShorten;
    }catch(e){
        console.log(e + "--tuan: saveCampaign.")
    }
    
}
const saveFb = async (groupArr, fbArr) => {
    console.log("GROUPARR:",groupArr);
    console.log("FBARR:",fbArr);
    let arrId = [];
    try{
        if(typeof groupArr == "string"){
            console.log("da vao string");
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
    }catch(e) {
        console.log(e + "--tuan:saveFb");
    } 
}
const saveESO = async (shortUrl, resource, group) => {
    try{
        let result = await Shorten.save({url: shortUrl, resource: resource, group:group});
        //console.log("saveESO:", result);
        console.log("ketqua saveESO:", result);
        return result.id;
    } catch(e) {
        console.log(e + "--tuan: saveESO")
    }
    
}
let addLink1 = async (oldUrl, newUrl, user) => { 
    // let data = {};
    // data.urlOrigin = req.body.urlOrigin;
    // let shortUrl = seedUrl.createShortUrl();
    try{
        let ob_shortUrl = await Shorten.save({url: newUrl}); 
        let object_url = {url:oldUrl , short_urls : [ob_shortUrl.id]};
        let result = await Url.save(object_url);
        
        //get id_user by user 
        let id_user = await User.getIdByUser(user);//req.session.user
        /* check campaign: if user already exist then choose campaign with campaign = null, 
            else create new campaign with campaign = null */ 
        let checkUser = await Campaign.checkUserExist(id_user);
        //console.log("id_user:", id_user);
        //console.log("checkUser:", checkUser);
        
        if(checkUser) {
            let temp = await Campaign.update(id_user, result.id);// result.id = id_url
            //console.log("updateCampaign:", temp);
        } else {
            let ob_campaign = {id_user: id_user, id_urls :[result.id]};
            await Campaign.save(ob_campaign);
        }
        return true;
    }catch(e) {
        console.log(e +"--- Tuan: Error addLink1 in EnterControll" );
    }
};
