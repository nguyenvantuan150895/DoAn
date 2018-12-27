const mongoose = require('mongoose');
const fs = require('fs');

let csdl = fs.readFileSync('csdl.txt', 'utf8'); csdl = csdl.trim();
let arr = csdl.split(".");
if(arr.length == 3) csdl = arr[1];
else if( arr.length == 2) csdl = arr[0];


let pathConect = 'mongodb://localhost/' + csdl.toString();
mongoose.connect(pathConect, { useNewUrlParser: true });

const calendarSchema = new mongoose.Schema({
    username:{type: String},
    title: {type: String},
    start: {type: String},
    backgroundColor: {type: String},
    borderColor: {type: String}
})
const calendar = mongoose.model ('calendar', calendarSchema);

//get all record by username
module.exports.getAllRecord = (username) => {
    return new Promise((resolve, reject) => {
        calendar.find({username: username}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
// insert event by username
module.exports.addEvent = (object) => {
    return new Promise((resolve, reject) => {
        calendar.create(object, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}