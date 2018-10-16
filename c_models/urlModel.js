
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



// //get total url created by account
// module.exports.getTotalUrlByAccount = (account) => {

// }




// // Save url ( old and new )
// module.exports.saveUrl = (objectURl) => {
//     return new Promise((resolve, reject) => {
//         url.create(objectURl, (err, result) => {
//             if(!err){
//                 return resolve(result);
//             } else {
//                 return reject(false);
//             }
//         }) 
//     })   
// }
// // Check url already exists in database
// module.exports.checkExistUrl = (md5, user) => {
//     return new Promise((resolve, reject) => {
//         url.find({md5:md5, user:user}, (err, result) => {
//             const len = result.length;
//             if(len == 1){
//                 return resolve(result[0]);
//             } else {
//                 return reject(false);
//             }
//         })
//      })    
// }

// //get oldUrl by newUrl
// module.exports.get_oldUrl = (url1) => {
//     return new Promise((resolve, reject) => {
//         url.find({newUrl: url1}, (err, result) => {
//             const len = result.length;
//             if(len >= 1){
//                 return resolve(result[0]);
//             } else {
//                 return reject(false);
//             }
//         })
//      })     
// }


// //get all URL in one page
// module.exports.getAllUrl = (page, account) => {
//     return new Promise((resolve, reject) => {
//         const pagesize = 5;
//         url.find({user: account}).skip(pagesize*(page-1)).limit(pagesize).exec((err, url) =>{
//             if(!err){
//                 resolve(url);
//             }else{
//                 reject(err);
//             }
//         }); 
//     })  
// };



// // get Total record
// module.exports.getTotalRecordByAccount = (account) => {
//     return new Promise((resolve, reject) => {
//         url.countDocuments({user:account},( err, count) =>{
//             if(err)reject(err)
//             else resolve(count);
//         }); 
//     })   
// }

// //get last page
// module.exports.getLastPage = (account, pageSize) => {
//     return new Promise((resolve, reject) => {
//         url.countDocuments({user:account},( err, count) =>{
//             if(!err){
//                 last_page  = Math.ceil(count/pageSize);
//                 resolve(last_page);
//             } else{
//                 reject(err);
//             }
//         }); 
//     })   
// }

// //get Total link
// module.exports.getTotalLink = () => {
//     return new Promise((resolve, reject) => {
//         url.countDocuments(( err, count) =>{
//             if(err)reject(err)
//             else resolve(count);
//         }); 
//     })   
// }

// // get 10 record one page (manager URL)
// module.exports.getAllUrl10= (page) => {
//     return new Promise((resolve, reject) => {
//         const pagesize = 10;
//         url.find().skip(pagesize*(page-1)).limit(pagesize).exec((err, urls) =>{
//             if(err) reject(err);
//             else resolve(urls);
//         }); 
//     })  
// };

// //find by ID
// module.exports.findByID = (id) => {
//     return new Promise((resolve, reject) => {
//         url.findById(id, (err, url) => {
//             if(err) reject(err);
//             else resolve(url);
//         });  
//     })
// }


// // find by newUrl 
// module.exports.checkUpdate = (newUrl, user) => {
//     return new Promise((resolve, reject) => {
//         url.find({newUrl : newUrl, user: user}, (err, result) => {
//             const len1 = result.length;
//             if(!err){
//                 if(len1 == 1){
//                     resolve(true);
//                 } else {
//                     resolve(false);
//                 }
//             }else {
//                 console.log("toi thu:",err);
//                 reject(err);
//             }
//         });  
//     })
// }

// // Update record by ID
// module.exports.update = (id, object) => {
//     return new Promise((resolve, reject) => {
//         url.updateOne({_id:id}, object, (err, result) => {
//             if(err) reject(err);
//             else resolve(result);
//         })
//     })
// }
