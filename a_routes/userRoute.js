
const userControll = require('../b_controlls/userControll');
const express = require('express');
const router = express.Router();


// router user
router.get('/login', userControll.login_get);
router.post('/login', userControll.login_post);
router.get('/signup',userControll.signup_get);
router.post('/signup', userControll.signup_post);
router.get('/logout',userControll.userLogout);
router.get('/profile',userControll.profile_get);
router.get('/editUser/:id', userControll.editUser_get);
router.post('/editUser', userControll.editUser_post);

router.post('/addLink', userControll.addLink);
router.get('/manager/:page', userControll.manager);
router.get('/delete/:id', userControll.delete);
router.post('/createLink', userControll.userCreateLink);
router.post('/editLink', userControll.userEditLink);



//export
module.exports = router;