const userRoute = require('./a_routes/userRoute');
const adminRoute = require('./a_routes/adminRoute');
const urlRoute = require('./a_routes/urlRoute');
const enterRoute = require('./a_routes/enterRoute');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//set session 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60}
}))
//import file css 
// app.use(express.static(__dirname + '/public/library/bower_components'));
// app.use(express.static(__dirname + '/public/library'));
// app.use(express.static(__dirname + '/public/library/plugins'));
// app.use(express.static(__dirname + '/public/library/dist'));
// app.use(express.static(__dirname + '/public/image'));
// app.use(express.static(__dirname + '/public/library'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/images'));






var authenSession = function (req, res, next) {
    url = req.url;
    if(url == "/admin/login" || url == "/user/login" || url == "/user/signup" || url == "/user/logout" || url == "/shortUrl") {
        next();
    } else if(url.search("admin") == 1){
        if(req.session.admin) next();
        else res.render("adminEOS.ejs");
    } else if ( url.search("user") == 1) {
        if(req.session.user) next();
        else res.render("../d_views/user/userEOS.ejs");
    } else if(url.search("manager") == 1 || url.search("delete") == 1){
        if(req.session.user) next();
        else res.render("../d_views/user/userEOS.ejs");
    } else next();
  }
app.use(authenSession);


//path redirections

app.use('/user', userRoute);
app.use('/enterprise',enterRoute)
// app.use('/admin', adminRoute);
app.use('/', urlRoute);


// Start server
app.listen(3000, () => {
    console.log("Server start on port::3000");
});



 