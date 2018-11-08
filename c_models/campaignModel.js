
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydata', { useNewUrlParser: true });
const campaignSchema = new mongoose.Schema({
    id_user: {type: String, default: null},
    id_urls: {type: Array, default : []},
    name: {type: String, default: null},
    start_time:{type: String},
    end_time: {type: String, default: null},
    time_create: {type: String, default: new Date()}
})
const campaign = mongoose.model ('campaign', campaignSchema);

// save
module.exports.save = (object) => {
    return new Promise((resolve, reject) => {
        campaign.create(object, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        }) 
    })
}
//check id already exists?
module.exports.checkUserExist = (id_user) => {
    return new Promise ((resolve, reject) => {
        campaign.find({id_user: id_user, name: null}, (err,result) => {
            if(err) reject(err);
            else{
                let len = result.length;
                //console.log("csdl:", result);
                if(len == 0) resolve(false);
                else resolve(true);
            }
        })
    }) 
}

//update
module.exports.update = (id_user, id_url) => {
    return new Promise((resolve, reject) => {
        campaign.findOneAndUpdate({id_user:id_user},{ $push: { id_urls: id_url }}, (err, result) => {
            if(err) reject (err);
            else resolve (result);
        })
    })
}

//get array object url by id_user
module.exports.getArrObUrl = (id_user) => {
    return new Promise((resolve, reject) => {
        campaign.find({id_user: id_user}, (err, result) => {
            if(err) reject(err);
            else resolve(result[0]);
        })
    })
}

//Delete id_url 
module.exports.delete = (id_user, id_url) => {
    return new Promise((resolve, reject) => {
        campaign.update({}, {$pull:{ id_urls: id_url}},{ multi: true }, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}

//check unique nameCampaign corresponding username
module.exports.checkNameCamp = (name, id_user) => {
    return new Promise((resolve, reject) => {
        campaign.find({name: name,id_user: id_user}, (err, result) => {
            if(err) reject(err);
            else{
                // console.log("id_user:", id_user);
                // console.log("ketqua:", result);
                if(result.length > 0) resolve(true);
                else resolve(false);
            } 
        })
    })
}

// get campaign by User (id_user), return arrCampaign
module.exports.getAllCampaignByIDUser = (id_user) => {
    return new Promise((resolve, reject) => {
        campaign.find({id_user: id_user}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    })
}
module.exports.getCampaignByName = (nameCampaign) => {
    return new Promise((resolve, reject) => {
        campaign.find({name: nameCampaign}, (err, result) => {
            if(err) reject(err);
            else resolve(result[0]);
        })
    })
}

// module.exports.checkNameExist = (name) => {
//     return new Promise((resolve, reject) => {
//         campaign.find({name: name}, (err, result) => {
//             if (result.length > 0 ) resolve(true);
//             else resolve(false);
//         })
//     })
// }
