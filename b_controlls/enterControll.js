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
exports.createCampaign_post = (req, res) => {
    // console.log("req.body:", req.body['group[]']);
    //console.log("Req.body:", req.body);
    let data = req.body;
    let sms = seedUrl.createShortUrl();
    let email = seedUrl.createShortUrl();
    let other = seedUrl.createShortUrl();
    let fb = [];
            //console.log("dataata length:", data.faceGroup.length);
    for( let i = 0; i < data.faceGroup.length; i ++) {
       fb.push(seedUrl.createShortUrl());
    }
    res.render("../d_views/enter/confirm.ejs", {name: data.name, oldUrl: data.oldUrl, faGroup: data.faceGroup,
    sms: sms, email: email, other: other, fb: fb, start: data.start, end: data.end});
}

exports.confirm_post = async (req, res) => {
    //res.send("Giao dien createCampaign");
    //console.log("Req.body ::::", req.body);
    let customer = {};
    let domain = "localhost:3000/"
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
        let checkFb = await seedUrl.checkExistForFb(rq['fbArr[]']);//console.log("checkFb:", checkFb);
        //check Format
        let eFormat = seedUrl.checkFormatUrlShort(rq.email, domain); //console.log("eFormat:", eFormat);
        let sFormat = seedUrl.checkFormatUrlShort(rq.sms,domain);
        let oFormat = seedUrl.checkFormatUrlShort(rq.other,domain);
        let fbFormat = seedUrl.checkFormatFbShort(rq['fbArr[]'],domain);//console.log("fbFormat:", fbFormat);
        
        if(checkEmail == false && checkSms == false && checkOther == false && checkFb == false) flagExist = false;//"ok"
        console.log("flagExist:", flagExist);
        if(eFormat && sFormat && oFormat && fbFormat ) flagFormat = true; console.log("flagFormat:", flagFormat);
        flagDup = seedUrl.checkDuplicate(arrCheckDup);  console.log("flagDup:", flagDup);
        let flagCampaign = await Campaign.checkNameExist(rq.name); console.log("flagCampaign:", flagCampaign);
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
    let arrId = [];
    try{
        for (let i = 0; i < groupArr.length; i++) {
            // let ob_fb = {ulr: fbArr[i], group: groupArr[i], resource:"fb"};
            let id_fb = await saveESO(fbArr[i], "fb", groupArr[i]);
            arrId.push(id_fb);
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
        return result.id;
    } catch(e) {
        console.log(e + "--tuan: saveESO")
    }
    
}