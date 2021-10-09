const adminService = require('../services/admin.service');

//Function: wont let admin create new admin when missing data
//Input: creating admin form 
//Output:  allow to move to next function or not
//Last modified day: 21/4/2021
module.exports.postCreateAdmin = async (req, res, next) => {
    var errors = [];

    const findAdmin = await adminService.getOneAdmin({ Gmail: req.body.gmail });
    //console.log(findAdmin);

    if(findAdmin) {
      errors.push("Gmail đã tồn tại! Vui lòng sử dụng gmail khác");
    }
  
    if (!req.body.username) { //check if there is user name
      errors.push("Yêu cầu nhập admin");
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
      res.render('registrationAdmin', {
        // put in one object errors to /create with the value of errors
        errors: errors, 
        value: req.body,
        csrf: req.csrfToken()
      }) 
      return;
    }
  
    next(); // move to next middleware(function)
  }