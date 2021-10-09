const { signedCookie } = require('cookie-parser');
const { findOneAndUpdate } = require('../models/user.model');
const User = require('../models/user.model');
const userService = require('../services/user.service');
const adminService = require('../services/admin.service');

//Function: get profile view 
//Input: local user or admin  
//Output:  render profile view with data  
//Last modified day: 15/3/2021
module.exports.getUserProfile = (req, res) => {
    const notify = req.session.notify; 
    delete req.session.notify;

    if (notify) {
        res.render('profile',{
            user: res.locals.user,
            csrf: req.csrfToken(),
            notify: notify
        }); 
    }
    else {
        res.render('profile',{
            user: res.locals.user,
            csrf: req.csrfToken()
        });
    }
}

//Function: change profile avatar  
//Input: file image 
//Output: change profile avatar and save it to database 
//Last modified day: 25/5/2021
module.exports.postUserProfile = async (req, res) => {
    if (req.file) {
        const user = await User.findOneAndUpdate({ _id: req.signedCookies.userId },
            { Avatar: req.file.path.split(/\/|\\/).slice(1).join('/') })
            .catch((err) => console.log(err));
    }

    res.redirect('/profile');

}

module.exports.updateInfo = async (req, res) => {
    var id ="";
    var data = {
        Name: req.body.fullname,
        SDT: req.body.phone,
        CMND: req.body.cmnd,
        Age: req.body.age,
        GT: req.body.gt,
        QuocGia: req.body.country
    }
    
    if (req.signedCookies.userId) {
        id = req.signedCookies.userId;
        
        const updateUser = await userService.updateUserById(id, data)

        if (!updateUser) {
            req.session.notify = "Cập nhật thông tin thất bại"
        }
        else {
            req.session.notify = "Cập nhật thông tin thành công"
        }
    }
    res.redirect('/profile');
    
}