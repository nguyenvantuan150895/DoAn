const enterControll = require('../b_controlls/enterControll');
const express = require('express');
const router = express.Router();

// router enterprise
router.get('/create', enterControll.createCampaign_get);
router.post('/create', enterControll.createCampaign_post);
router.post('/confirm', enterControll.confirm_post);
router.get('/manager', enterControll.manager);// home page
router.post('/getShortLink', enterControll.getShortLink);
router.post('/shortLink',enterControll.shortLink);
router.get('/export', enterControll.exportExcel);
router.get('/detailCamp/:id', enterControll.getDetailCamp);
router.get('/editCamp/:id', enterControll.editCamp_get);
router.post('/editCamp', enterControll.editCamp_post);
router.get('/deleteCamp/:id', enterControll.deleteCamp);
router.get('/history/:page', enterControll.history);







//export
module.exports = router;