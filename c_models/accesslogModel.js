const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydata', { useNewUrlParser: true });
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

