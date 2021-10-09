var express = require('express');
var router = express.Router();


const controller = require('../controllers/bookingMangement.controller');

router.get('/', controller.index);

router.post('/', controller.postCode);

module.exports = router;