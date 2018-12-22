
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const fs = require('fs');

let csdl = fs.readFileSync('csdl.txt', 'utf8'); csdl = csdl.trim();
let arr = csdl.split(".");
if(arr.length == 3) csdl = arr[1];
else if( arr.length == 2) csdl = arr[0];


let pathConect = 'mongodb://localhost/' + csdl.toString();
mongoose.connect(pathConect, { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: String,
})

let user = mongoose.model('user', userSchema);

// add new account from sign up
module.exports.add = (object) => {
    return new Promise((resolve, reject) => {
        user.create(object, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
};

//authentication account user
module.exports.authentication = (username, password) => {
    return new Promise((resolve, reject) => {
        user.find({ username: username, password: password }, (err, result) => {
            if (result.length == 1) resolve(result[0]);
            else reject(err);
        })
    })
}

// get id by username
module.exports.getIdByUser = (username) => {
    return new Promise((resolve, reject) => {
        //resolve("haha");
        user.find({ username: username }, (err, result) => {
            if (err) reject(err);
            else resolve(result[0].id);
        })
    })
}

// get total User
module.exports.getTotalRecord = () => {
    return new Promise((resolve, reject) => {
        user.countDocuments((err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}
// get all user by page number
module.exports.getAllUser = (page) => {
    return new Promise((resolve, reject) => {
        const pagesize = 10;
        user.find().skip(pagesize * (page - 1)).limit(pagesize).exec((err, users) => {
            if (err) reject(err);
            else resolve(users);
        });
    })
};
// find user by id
module.exports.findByID = (id) => {
    return new Promise((resolve, reject) => {
        user.findById(id, (err, user) => {
            if (err) reject(err);
            else resolve(user);
        });
    })
}
// Update record by ID
module.exports.update = (id, object) => {
    return new Promise((resolve, reject) => {
        user.updateOne({ _id: id }, object, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}
//Delete record by ID
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        user.deleteOne({ _id: id }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}
//Check exist user
module.exports.checkExistUser = (user_name) => {
    return new Promise((resolve, reject) => {
        user.find({ username: user_name }, (err, result) => {
            if (err) reject(err);
            else {
                if (result.length > 0) resolve(true);
                else resolve(false);
            }
        })
    })
}
// Check exist email
module.exports.checkExistEmail = (email) => {
    return new Promise((resolve, reject) => {
        user.find({ email: email }, (err, result) => {
            if (err) reject(err);
            else {
                if (result.length > 0) resolve(true);
                else resolve(false);
            }
        })
    })
}
// get obj User by username
module.exports.getObUserByName = (username) => {
    return new Promise((resolve, reject) => {
        //resolve("haha");
        user.find({ username: username }, (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
        })
    })
}
//search user (manger user)
module.exports.searchUser = (userSearch, page, pagesize) => {
    return new Promise((resolve, reject) => {
        user.find({username: { $regex: userSearch, $options: 'i' }}, (err, result)=>{
            if(err) reject(err);
            else resolve(result);
        }).skip(pagesize * (page - 1)).limit(pagesize);
    })
}
module.exports.getTotalUserSearch = (userSearch) => {
    return new Promise((resolve, reject) => {
        user.find({username: { $regex: userSearch, $options: 'i' }}, (err, result)=>{
            if(err) reject(err);
            else resolve(result.length);
        });
    })
}