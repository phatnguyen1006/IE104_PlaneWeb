const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

//controller 
const controller = require('../controllers/signup.controller');

//validate
const validate = require('../validate/user.validate');
const adminValidate = require('../validate/admin.validate');

//middleware 
const middleware = require('../middlewares/auth.middleware');

router.get('/',controller.index);

router.post('/', validate.postCreate, controller.postCreate);

router.get('/admin', authMiddleware.requireAdmin, controller.indexAdmin);

router.post('/admin', adminValidate.postCreateAdmin, controller.postCreateAdmin);

module.exports = router;