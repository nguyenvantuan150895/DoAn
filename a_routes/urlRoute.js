const urlControll = require('../b_controlls/urlControll');
const express = require('express');
const router = express.Router();


// a simple test url to check that all of our files are communicating correctly.
router.get('/',urlControll.shortUrl_get );
router.post('/shortUrl',urlControll.shortUrl_post);
router.get('/test',urlControll.test);
router.get('/*',urlControll.redirectUrlOrigin);


//export
module.exports = router;