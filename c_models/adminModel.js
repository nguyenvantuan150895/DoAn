
const mongoose = require('mongoose');
const fs = require('fs');

let csdl = fs.readFileSync('csdl.txt', 'utf8'); csdl = csdl.trim();
let pathConect = 'mongodb://localhost/' + csdl.toString();
mongoose.connect(pathConect, { useNewUrlParser: true });
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
//Get id by account
module.exports.getIdByAccount = (account) => {
    return new Promise((resolve, reject) => {
        admin.find({ account: account }, (err, result) => {
            if (err) reject(err);
            else resolve(result[0].id);
        })
    })
}
// Get Object admin by id
module.exports.getObAdminById = (id) => {
    return new Promise((resolve, reject) => {
        admin.findById(id, (err, admin) => {
            if (err) reject(err);
            else resolve(admin);
        });
    })
}
// Get Object admin by account
module.exports.getObAdminByAccount = (account) => {
    return new Promise((resolve, reject) => {
        admin.find({ account: account }, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        })
    })
}
// Check exist account admin
module.exports.checkExistAccount = (account) => {
    return new Promise((resolve, reject) => {
        admin.find({ account: account }, (err, result) => {
            if (err) reject(err);
            else {
                if(result.length > 0) resolve(true);
                else resolve(false);
            }
        })
    })
}
// Check exist email admin
module.exports.checkExistEmail = (email) => {
    return new Promise((resolve, reject) => {
        admin.find({ email: email }, (err, result) => {
            if (err) reject(err);
            else {
                if(result.length > 0) resolve(true);
                else resolve(false);
            }
        })
    })
}
// update edit
module.exports.update = (id, object) => {
    // object = {acount: newAcount, password: newPassword, email: newEmail}
    return new Promise((resolve, reject) => {
        admin.updateOne({ _id: id }, object, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}
// create new admin
module.exports.createAdmin = (object) => {
    // object = {acount: newAcount, password: newPassword, email: newEmail}
    return new Promise((resolve, reject) => {
        admin.create(object, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

