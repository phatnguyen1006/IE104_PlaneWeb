// check if the input is not empty 
const { find } = require('../models/user.model');
const userService = require('../services/user.service');

//Function: wont let user create new user when missing data
//Input: creating user form 
//Output:  allow to move to next function or not
//Last modified day: 21/4/2021
module.exports.postCreate = async (req, res, next) => {
    var errors = [];

    const findUser = await userService.findOneUser({ Gmail: req.body.gmail });
    
    if(findUser) {
      errors.push("Gmail đã tồn tại, vui lòng sử dụng gmail khác");
    }

    if (!req.body.username) { //check if there is user name
      errors.push("Yêu cầu nhập User Name");
    }

    if (!req.body.gmail) {
      errors.push("Yêu cầu có Email");
    }

    if (!req.body.password) { //check if there is password 
      errors.push("Yêu cầu mật khẩu");
    }

    if (!req.body.repassword) {
      errors.push("Yêu cầu nhập lại mật khẩu");
    }

    if (req.body.repassword != req.body.password) {
      errors.push("Mật khẩu không trùng nhau, xin vui lòng thử lại!!!");
    }


    if (errors.length > 0) {
      res.render('registration', {
        errors: errors, // put in one object errors to /create with the value of errors
        value: req.body,
        csrf: req.csrfToken()
      }) 
      return;
    }

    next(); // move to next middleware(function)
}

//Function: wont let login when missing data
//Input: login form  
//Output:  allow to move to next function or not
//Last modified day: 21/4/2021
module.exports.loginValidate= (req, res, next) => {
  var errors = [];

  if (!req.body.gmail) {
    errors.push("Yêu cầu có Email");
  }

  if (!req.body.password) { //check if there is password 
    errors.push("Yêu cầu mật khẩu");
  }

  if (errors.length > 0) {
    res.render('/auth/login', {
      errors: errors, // put in one object errors to /create with the value of errors
      value: req.body // to save the supplied info 
    }) 
    return;
  }

  next(); // move to next middleware(function
}

