
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydata', { useNewUrlParser: true });
const shortenSchema = new mongoose.Schema({
    url: {type: String, unique: true},
    group: {type: String, default: null},
    resource: {type: String, default: null},
    totalClick: { type: Number, default: 0 }
})
const shorten = mongoose.model ('shorten', shortenSchema);

//save shortUrl
module.exports.save = (object) => {
    return new Promise((resolve, reject) => {
        shorten.create(object, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        }) 
    })
}

//get id by short_url
module.exports.getId = (url) => {
    return new Promise((resolve, reject) => {
        shorten.findOne({url: url}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
//get object shortUrl by id
module.exports.getObUrlShorten = (id) => {
    return new Promise ((resolve, reject) => {
        shorten.findOne({_id: id}, (err, result) => {
            if(err) reject(err);
            else resolve (result);
        })
    })
}


//update
module.exports.update = (id, object) => {
    return new Promise((resolve, reject) => {
        shorten.updateOne({_id: id}, object, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })  
}

//delete 
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        shorten.deleteOne({_id: id}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }) 
}

//check Exist url shorten
module.exports.checkExist = (newUrl) => {
    return new Promise((resolve, reject) => {
        shorten.find({url : newUrl},(err, result) => {
            if(err) reject(err);
            else {
                resolve(result);
                console.log("result check exist:", result.length);
            }
        })
    })
}