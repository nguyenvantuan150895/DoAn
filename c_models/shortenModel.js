
const mongoose = require('mongoose');
const fs = require('fs');

let csdl = fs.readFileSync('csdl.txt', 'utf8'); csdl = csdl.trim();
let arr = csdl.split(".");
if(arr.length == 3) csdl = arr[1];
else if( arr.length == 2) csdl = arr[0];
else csdl = Math.random().toString(36).substring(8);

let pathConect = 'mongodb://localhost/' + csdl.toString();
mongoose.connect(pathConect, { useNewUrlParser: true });
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
            else  resolve(result);
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
            //console.log("url check Exist:", newUrl);
    return new Promise((resolve, reject) => {
        shorten.find({url : newUrl},(err, result) => {
                //console.log("Result checkExist model:", result);
            let len = result.length;
            if(len > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    })
}
//get all shorten url
module.exports.getAllShortUrl = () => {
    return new Promise((resolve, reject) => {
        shorten.find((err, result)=> {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
//get total click by id shorten
module.exports.getTotalClick = (id_shorten) => {
    return new Promise((resolve, reject) => {
        //console.log("IDshorten receive:", id_shorten);
        shorten.find({_id:id_shorten},(err, result) => {
            //console.log("result getTotalClick:", result);
            if(err) reject(err);
            else resolve(result[0].totalClick);
        })
    })
}

// get all ( for purpose test)
module.exports.getAll = () => {
    return new Promise((resolve, reject)=> {
        shorten.find({},(err, result) => {
            if(err)reject(err);
            else resolve(result);
        })
    })
}
// get total record
module.exports.getTotalRecord = () => {
    return new Promise((resolve, reject) => {
        shorten.countDocuments((err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}

//get 10 records 
module.exports.getAllShort = (page) => {
    return new Promise((resolve, reject) => {
        const pagesize = 10;
        shorten.find({resource: null}).skip(pagesize*(page-1)).limit(pagesize).exec((err, users) =>{
            if(err) reject(err);
            else resolve(users);
        }); 
    })  
};
// get totalLink (not link campaign)
module.exports.getTotalLink = () => {
    return new Promise((resolve, reject) => {
        shorten.find({resource: null}, (err, result) => {
            if(err) reject(err);
            else resolve(result.length);
        })
    })
}
// Update urlShort (aminControll)
module.exports.updateUrlShort = (idShorten, urlShort) => {
    return new Promise((resolve, reject) => {
        shorten.updateOne({_id:idShorten},{url:urlShort}, (err, result) => {
            if(err)reject(err)
            else resolve(result);
        })
    })
}
// Get url shorten by id
module.exports.getUrlShortByID = (idShorten) => {
    return new Promise((resolve, reject) => {
        shorten.find({_id:idShorten},(err, result) => {
            if(err)reject(err)
            else resolve(result[0]);
        })
    })
}
//update urlshorten for UpdateCampaign( update resource, urlshorte)
module.exports.updateUrlShortForUpdateCamp = (idShorten, urlShort, group) => {
    return new Promise((resolve, reject) => {
        shorten.findOneAndUpdate({_id:idShorten},{url:urlShort, group:group}, (err, result) => {
            if(err)reject(err)
            else resolve(result);
        })
    })
}
//search link (manger link)
module.exports.searchLink = (linkSearch, page, pagesize) => {
    return new Promise((resolve, reject) => {
        shorten.find({ resource: null,url: {$regex: linkSearch, $options: 'i' }}, (err, result)=>{
            if(err) reject(err);
            else resolve(result);
        }).skip(pagesize * (page - 1)).limit(pagesize);
    })
}
module.exports.getTotalLinkSearch = (linkSearch) => {
    return new Promise((resolve, reject) => {
        shorten.find({resource: null, url: { $regex: linkSearch, $options: 'i' }}, (err, result)=>{
            if(err) reject(err);
            else resolve(result.length);
        });
    })
}