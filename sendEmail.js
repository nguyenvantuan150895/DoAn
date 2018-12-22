const Admin = require('./c_models/adminModel');
const nodemailer = require('nodemailer');
const fs = require('fs');

// CREATE ADMIN
let domain = fs.readFileSync('domain.txt', 'utf8'); domain = domain.trim();
let ip = fs.readFileSync('ipServer.txt', 'utf8'); ip = ip.trim();
let email = fs.readFileSync('email.txt', 'utf8'); email = email.trim();
let admin = Math.random().toString(36).substring(8);
admin = "admin"+admin.toLocaleUpperCase();

console.log("random:", admin);
let password = Math.floor(10000 +  Math.random() * 90000); 
let createAdmin = async () => {
    let rs = await Admin.createAdmin({account: admin, password: password, email: email});
}

createAdmin();

// SEND EMAIL TO USER
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'husthust1995@gmail.com',
      pass: 'daylamatkhau'
    }
  });
  
  let html =   '<h1 style = "color: blue">Welcome</h1>' + 
  '<p>Everything is almost finished, please point your domain name to the server ip address provided below. Once completed, you can visit with the registered domain name.</p>' + 
  '<label for="">Your Domain:</label>' +
  '<span style = "color: #f3840b"><b>' +domain+'</b></span> <br>' +
  '<label for="">Ip Server:</label>' +
  '<span style = "color: #f3840b"><b>'+ip+'</b></span>' +
  '<p> <b>Visit the '+domain+'/admin/login link and login with the admin account provided below:</b></p>' +
  '<label for="">Account:</label>' +
  '<span style ="color: #f3840b;"> <b>'+admin+'</b> </span> <br>' +
  '<label for="">Password:</label> ' +
  '<span style = "color: #f3840b"><b>'+password+'</b></span> <br> <br>' +
  '<p>Thank you for using our service. Any questions please feel free to respond via this email. Thank you!</p>'

  
  var mailOptions = {
    from: 'husthust1995@gmail.com',
    to: email,
    subject: 'Confirmation Email',
    html: html
  }
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });