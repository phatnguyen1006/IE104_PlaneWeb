const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth.middleware');
const { ticketInfoData } = require('../middlewares/ticketInfo.middleware');

//controller 
const controller = require('../controllers/ticketInfo.controller');

router.get('/', controller.getTicketInfoView);

router.post('/', ticketInfoData, middleware.requireUser, controller.postInfo);

router.post('/payment',controller.postTicket);

module.exports = router;