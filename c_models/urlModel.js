
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydata', { useNewUrlParser: true });
const urlSchema = new mongoose.Schema({
    url: String,
    short_urls: [],
    timeCreate: {type : String, default : new Date()}
})
const url = mongoose.model ('url', urlSchema);

//Save url
module.exports.save = (object) => {
    return new Promise((resolve, reject) => {
        url.create(object, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        }) 
    })
}

// get urlOrigin from id_shortUrl
module.exports.getUrlOriginByIdShortUrl = (id) => {
    return new Promise((resolve, reject) => {
        url.find({ short_urls: id }, (err, result) => {
            if(err) reject(err);
            else resolve(result[0].url);
        })
    })
}
// get obj url by id SHORTEN
module.exports.getObjUrlByIdShort = (idshort) => {
    return new Promise((resolve, reject) => {
        url.find({ short_urls: idshort }, (err, result) => {
            if(err) reject(err);
            else resolve(result[0]);
        })

    })
}
//get object url by id
module.exports.getObUrlById = (id) => { 
    return new Promise ((resolve, reject) => {
        url.find({_id: id}, (err, result) => {
            //console.log("resultee:", result);
            if(err) reject (err);
            else resolve (result[0]);
        })
    })
}

//delete Url
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        url.deleteOne({_id:id}, (err, result) => {
            if(err)reject(err)
            else resolve(result);
        })
    })
}
//update urlOrigin ( admin controll)
module.exports.updateUrlOrigin = (idUrl, urlOrigin) => {
    return new Promise((resolve, reject) => {
        url.updateOne({_id:idUrl},{url:urlOrigin}, (err, result) => {
            if(err)reject(err)
            else resolve(result);
        })
    })
}


