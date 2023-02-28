const express = require('express');
const router  = express.Router();
const ethapi = require('../eth');
const bnbapi = require('../bnb');
const getBlaanceapi = require('../getBlaance');
const WAzirxpProfileapi = require('../WAzirxpProfile');



router.post('/getBlaance', getBlaanceapi.getBlaance);

router.post('/Ethsends', ethapi.Ethsends);
router.post('/Ethbalance', ethapi.Ethbalance);
router.post('/Usdttransfer', ethapi.Usdttransfer);
router.post('/Usdtbal', ethapi.Usdtbal);
router.post('/polygansends', ethapi.polygansends);
router.post('/polyganbal', ethapi.polyganbal);
router.post('/manasends', ethapi.manasends);
router.post('/manabal', ethapi.manabal);
router.post('/shibabalance', ethapi.shibabalance);

router.post('/updatereferral', WAzirxpProfileapi.updatereferral);

router.post('/bnbsends', bnbapi.bnbsends);
router.post('/bnbbalance', bnbapi.bnbbalance);

router.post('/userkyc', WAzirxpProfileapi.userkyc);
router.post('/userdetails', WAzirxpProfileapi.userdetails);


module.exports = router;

