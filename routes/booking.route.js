const express = require('express');
const router = express.Router();

//controller 
const controller = require('../controllers/booking.controller');

router.get('/', controller.index);

module.exports = router;