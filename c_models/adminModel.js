
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydata', { useNewUrlParser: true });
const adminSchema = new mongoose.Schema({
    account: String,
    password: String,
    email: String,
})
const admin = mongoose.model ('admin', adminSchema);

//Authentication
module.exports.authentication = (account, password) => {
    return new Promise((resolve, reject) => {
       admin.find({account: account,password: password}, (err, result) => {
           if(err) reject(err);
           else{
               if(result.length == 1) resolve(true);
               else resolve(false);
           }
       }) 
    })
}






