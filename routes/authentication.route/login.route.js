const express = require('express');
const router = express.Router();

const validate = require('../../validate/user.validate');

const controller = require('../../controllers/authentication.controller/login.controller');

router.get('/', controller.login);

router.post('/', controller.enlogin);

router.get('/admin', controller.adminLogin);

router.post('/admin', controller.adminPostLogin);

router.get('/admin/logout', controller.logoutAdmin);

module.exports = router;