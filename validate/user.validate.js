// check if the input is not empty 
const { find } = require('../models/user.model');
const userService = require('../services/user.service');

//Function: wont let user create new user when missing data
//Input: creating user form 
//Output:  allow to move to next function or not
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

//Function: check if new update user info is validate 
//Input: user's data
//Output: is data validate
module.exports.updateInfoValidate = (req, res, next) => {
  var errors = [];

  var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  var name = req.body.fullname;
  var country = req.body.country;

  if(!regName.test(name)){
      errors.push("Họ và tên không hợp lệ");
  }

  if(!regName.test(country) || country.charAt(0) == country.charAt(0).toUpperCase()){
    errors.push("Quốc gia không hợp lệ");
  }

  if (errors.length > 0) {
    res.render('profile', {
      errors: errors
  });

    return;
  }

    next();
}

