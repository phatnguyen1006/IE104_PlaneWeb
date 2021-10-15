var express = require('express');
var router = express.Router();

//controller 
const controller = require('../controllers/profile.controller');

//validate
const validate = require('../validate/user.validate')

router.get('/', controller.getUserProfile);
router.post('/', controller.postUserProfile);
router.post('/updateProfile', validate.updateInfoValidate, controller.updateInfo);

module.exports = router;