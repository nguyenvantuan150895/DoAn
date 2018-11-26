const enterControll = require('../b_controlls/enterControll');
const express = require('express');
const router = express.Router();

// router enterprise
router.get('/create', enterControll.createCampaign_get);
router.post('/create', enterControll.createCampaign_post);
router.post('/confirm', enterControll.confirm_post);
router.get('/manager', enterControll.manager);
router.post('/getShortLink', enterControll.getShortLink);
router.post('/shortLink',enterControll.shortLink);
router.post('/getDataForCampaign', enterControll.getDataForCampaign);
router.get('/export', enterControll.exportExcel);






//export
module.exports = router;