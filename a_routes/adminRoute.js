const adminControll = require('../b_controlls/adminControll');
const express = require('express');
const router = express.Router();

// router admin
router.get('/login', adminControll.login_get);
router.post('/login', adminControll.login_post);
router.get('/logout', adminControll.logout);
router.get('/manager', adminControll.manager);


router.get('/manager/user/add', adminControll.addUser_get);
router.post('/manager/user/add', adminControll.addUser_post);
router.get('/manager/user/update/:id', adminControll.updateUser_get);
router.post('/manager/user/update', adminControll.updateUser_post);
router.get('/manager/user/delete/:id',adminControll.deleteUser);
router.get('/manager/user/detail/:id',adminControll.detailUser);
router.get('/manager/user/:page', adminControll.managerUser);


// router.get('/manager/link/add', adminControll.addLink_get);
// router.post('/manager/link/add', adminControll.addLink_post);
// router.get('/manager/link/update/:id', adminControll.updateLink_get);
// router.post('/manager/link/update', adminControll.updateLink_post);
// router.get('/manager/link/detail/:id', adminControll.detailLink);
// router.get('/manager/link/delete/:id', adminControll.deleteLink);
// router.get('/manager/link/:page', adminControll.managerLink);






//export
module.exports = router;