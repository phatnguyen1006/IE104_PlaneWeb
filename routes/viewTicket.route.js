var express = require('express');
var router = express.Router();

//controller
const controller = require('../controllers/viewTicket.controller');

router.get('/',controller.findTicket);

router.post('/',controller.postTicketChange);

router.post('/change', controller.postChange);

module.exports = router;