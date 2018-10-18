const enterControll = require('../b_controlls/enterControll');
const express = require('express');
const router = express.Router();

// router user
router.get('/create', enterControll.createCampaign_get);
router.post('/create', enterControll.createCampaign_post);
router.post('/confirm', enterControll.confirm_post);





//export
module.exports = router;