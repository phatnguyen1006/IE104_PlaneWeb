const express = require('express');
const router = express.Router();

//controller
const controller = require('../controllers/searchFlight.controller');

//router.get('/', controller.index);

router.get('/', controller.postTicket);

module.exports = router;