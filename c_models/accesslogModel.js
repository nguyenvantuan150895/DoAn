const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydata', { useNewUrlParser: true });
const accesslogSchema = new mongoose.Schema({
    ip: {type: String, required: true},
    time_click: {},
    device: {type: String, required: true},
    location: { type: String, required:true },
    id_shorten: {type: String, required: true}
})
const accesslog = mongoose.model ('accesslog', accesslogSchema);

//save shortUrl
// module.exports.save = (object) => {
//     return new Promise((resolve, reject) => {
//         shorten.create(object, (err, result) => {
//             if(err) reject(err);
//             else resolve(result);
//         }) 
//     })
// }
