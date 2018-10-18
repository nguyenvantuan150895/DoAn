const urlControll = require('../b_controlls/urlControll');
const express = require('express');
const router = express.Router();


// a simple test url to check that all of our files are communicating correctly.
router.get('/',urlControll.shortUrl_get );
router.post('/shortUrl',urlControll.shortUrl_post);
// router.get('/manager/:page', urlControll.urlManager);
// router.post('/manager', urlControll.urlManager_post);
// router.get('/delete/:id', urlControll.urlDelete);
// router.get('/update/:id', urlControll.urlUpdate_get);
router.get('/*',urlControll.redirectUrlOrigin);


//export
module.exports = router;