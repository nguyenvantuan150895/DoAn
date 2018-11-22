const Admin = require('../c_models/adminModel');
const User = require('../c_models/userModel');
const Url = require('../c_models/urlModel');
const Access = require('../c_models/accesslogModel');
const Shorten = require('../c_models/shortenModel');
const Campaign = require('../c_models/campaignModel');
const seedUrl = require('../public/modul/seedUrl');


//Handle login
exports.login_get = (req, res) => {
    res.render("../d_views/admin/login.ejs");
};
exports.login_post = async (req, res) => {
    let state;
    let rs = await Admin.authentication(req.body.account, req.body.password);
    if(rs){
        state = 'ok';
        req.session.admin = req.body.account;
    }
    else state = 'fail';
    res.json({mess: state});
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
    let totalClick  = await Access.getTotalRecord();
    let data = {totalLink: totalLink, totalUser: totalUser, totalCamp: totalCamp, totalClick: totalClick};
    // let data = {totalLink: 60, totalUser: 5, totalCamp: 1300, totalClick: 80000};    
    res.render("../d_views/admin/manager.ejs", {data:data});
}

// admin manager user
exports.managerUser = async (req, res) => {
    page_current = req.params.page;
    try {
        let totalUser = await User.getTotalRecord();
        let users = await User.getAllUser(page_current);
        res.render('../d_views/admin/managerUser.ejs',{users: users, admin:"ADMIN", page: page_current, totalUser: totalUser});
    } catch(e) {
        console.log(e + "--tuan: error managerUser");
    }
};

// add new user
exports.addUser_get = async (req, res) => {
    res.render("../d_views/admin/addUser.ejs", {admin:"ADMIN"});
};

exports.addUser_post = async (req, res) => {
    let customer = {};
    // console.log("Receive:", req.body);
    try {
        let rs = await User.add(req.body);
        let totalUser =  await User.getTotalRecord();
        let last_page = Math.ceil(totalUser/10);
        if(rs){
            customer.state = 'ok';
            customer.last_page = last_page;
        }
        res.send(customer);
    } catch(err) {
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
        // console.log(e +"--tuan: error addUser_post");
    }
};

//update User
exports.updateUser_get = async (req, res) => {
    id = req.params.id;
    try{
        let user = await User.findByID(id);
        res.render("../d_views/admin/updateUser.ejs", {admin: "ADMIN", user: user});
    } catch (e) {
        console.log(e +"--tuan: updateUser_get");
    }
};

exports.updateUser_post = async (req, res) => {
    // console.log("receive:", req.body);
    let customer = {};
    try {
        let result = await User.update(id, req.body);
        if(result) {
            customer.state = 'ok';
            customer.page_current = page_current;
        }
        // console.log("customer send:", customer);
        res.send(customer);
    } catch (err) {
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
        // console.log("customer send22:", customer);
        res.send(customer);
        // console.log(err +"--tuan: updateUser_post");
    }
};

//Delete User
exports.deleteUser = async (req, res) => {
    id = req.params.id;
    try{
        let result = await User.delete(id);
        let path = '/admin/manager/user/' + page_current.toString();
        res.redirect(path);
    } catch (e) {
        console.log(e +"--tuan: deleteUser");
    }
};
// Detail User
exports.detailUser = async (req, res) => {
    id = req.params.id;
    try{
        let user = await User.findByID(id,req.body);
        res.render("../d_views/admin/detailUser.ejs", {admin:"ADMIN", user: user, page: page_current});
    } catch (e) {
        console.log(e +"--tuan: detailUser");
    }
};

// // manager Link
// exports.managerLink = async (req, res) => {
//     pageUrl = req.params.page;
//     try {
//         let totalLink = await Url.getTotalLink();
//         let urls = await Url.getAllUrl10(pageUrl);
//         //console.log("test thu:", urls);
//         res.render('adminManagerLink.ejs',{urls: urls, admin:req.session.admin, page: pageUrl, totalLink: totalLink});
//     } catch(e) {
//         console.log("Error managerLink");
//     }
// };

// // Detail Link
// exports.detailLink = async (req, res) => {
//     id = req.params.id;
//     try{
//         let url = await Url.findByID(id);
//         res.render("detail_link.ejs", {admin:req.session.admin, page:pageUrl, url: url});
//     } catch (e) {
//         console.log("Error detailLink");
//     }
// };
// // Update link *****************************************************
// exports.updateLink_get = async (req, res) => {
//     id = req.params.id;
//     // res.send("hello update link");
//     try{
//         url = await Url.findByID(id,req.body);
//         //res.render("shortenUrl.ejs");
//         res.render("update_link.ejs", {admin:req.session.admin, url: url});
//     } catch (e) {
//         console.log("Error updateLink_get");
//     }
// }

// exports.updateLink_post = async (req, res) => {
//     const regex = /^[a-zA-Z0-9]*$/;
//     let customer = {};
//     try {
//         //check new url invalid
//         let newUrl = req.body.newUrl;
//         let hostname = newUrl.slice(0, 15);
//         let path1 = newUrl.slice(15,newUrl.length );
//         if(hostname == "localhost:3000/"){
//             if(path1.length > 0 && regex.test(path1)){
//                 let valid = await Url.checkUpdate(newUrl, req.body.user);
//                 if(valid){
//                     console.log("ok 3");
//                     customer.state = "fail";
//                 } else {
//                     customer.state = "ok";
//                     customer.page_current = pageUrl;
//                     let result = await Url.update(id, req.body); 
//                 }
//             }else{
//                 customer.state = "fail";
//             }
//         } else{
//             customer.state = "fail";
//         }
//         return res.send(customer);
        
//     } catch (e) {
//         console.log("Error updateLink_post");
//     }
// };
// //********************************************************************************* */

// // Delete Link
// exports.deleteLink = async (req, res) => {
//     id = req.params.id;;
//     try{
//         let result = await Url.urlDelete(id);
//         let path = '/admin/manager/link/' + pageUrl.toString();
//         res.redirect(path);
//     } catch (e) {
//         console.log("Error deleteUrl");
//     }
// };
// // Add link
// exports.addLink_get = async (req, res) => {
//     res.render("add_link.ejs", {admin:"req.session.admin"});
// };

// exports.addLink_post = async (req, res) => {
    
//     try{
//         let random = Math.floor(100000 +  Math.random() * 900000);
//         let base62 = convertBase62(random);
//         let url = mapping(base62);
//         let oldUrl = req.body.oldUrl;
//         let hash = md5(oldUrl);
//         let newUrl = "localhost:3000/" + url;
//         const objectUrl = {random: random,md5: hash, oldUrl: oldUrl, newUrl : newUrl, user : req.body.user};
//         let result = await Url.saveUrl(objectUrl);
//         let totalLink = await Url.getTotalLink();
//         let last_page = Math.ceil(totalLink/10);
//         let path = '/admin/manager/link/' + last_page.toString();
//         res.redirect(path);
//     } catch(e) {
//         console.log(e);
//     }   
// }

// //Algorithm convert base10 to base62
// let convertBase62 = (number) => {
//     let digits = [];
//     let num = Number(number);
//     while ( num > 0 ) {
//         digits.push(num%62);
//         num = parseInt(num/62);
//     }
//     return digits.reverse();
// }

// // mapping a->z,A->Z,0->9 with 0->61
// let mapping = (arr) => {
//     let url ="";
//     for ( i = 0; i < arr.length; i++){
//         if( Number(arr[i]) >=0 &&  Number(arr[i]) <= 25 ){
//             url =  url +  String.fromCharCode( Number(arr[i]) + 97 );
//         }
//         if( Number(arr[i]) >= 26 &&  Number(arr[i]) <= 51 ) {
//             url = url +  String.fromCharCode( Number(arr[i]) + 39 );
//         }
//         if( Number(arr[i]) >= 52 &&  Number(arr[i]) <= 61){
//             url = url + (Number(arr[i]) - 52);
//         }
//     }
//     return url;
// }

