const mongoose = require('mongoose');
const fs = require('fs');

let csdl = fs.readFileSync('csdl.txt', 'utf8'); csdl = csdl.trim();
let pathConect = 'mongodb://localhost/' + csdl.toString();
mongoose.connect(pathConect, { useNewUrlParser: true });
const accesslogSchema = new mongoose.Schema({
    ip: {type: String, required: true},
    time_click: {},
    device: {type: String, required: true},
    location: { type: String, required:true },
    id_shorten: {type: String, required: true},
    browser: {type: String, require: true},
    os :{type: String,require: true}
})
const accesslog = mongoose.model ('accesslog', accesslogSchema);

//save accesslog
module.exports.save = (object) => {
    return new Promise((resolve, reject) => {
        accesslog.create(object, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        }) 
    })
}
//get record by id_shorten
module.exports.getRecordByIdShorten = (id_short) => {
    return new Promise((resolve, reject) => {
        accesslog.find({id_shorten: id_short}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
//get total accesslog record
module.exports.getTotalRecord = () => {
    return new Promise((resolve, reject) => {
        accesslog.countDocuments((err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
// get all record
module.exports.getAllRecord = () => {
    return new Promise((resolve, reject) => {
        accesslog.find({},(err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
