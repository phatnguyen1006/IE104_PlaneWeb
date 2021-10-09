var express = require('express');
var router = express.Router();

//controller 
const controller = require('../controllers/profile.controller');

router.get('/', controller.getUserProfile);
router.post('/', controller.postUserProfile);
router.post('/updateProfile', controller.updateInfo);

module.exports = router;