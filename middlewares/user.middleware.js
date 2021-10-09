const Users = require('../models/user.model');
const Admin = require('../models/admin.model')


module.exports = async (req, res, next) => {
    if (await !req.session.user) {
        if (req.signedCookies.userId)
            res.clearCookie('userId');
        else if(req.signedCookies.userId)
            res.clearCookie("adminId");
    }

    if (req.signedCookies.userId) {
        var user = await Users.findOne({ _id: req.signedCookies.userId });
    }
    else if (req.signedCookies.adminId) {
      var admin = await Admin.findOne({ _id: req.signedCookies.adminId });
    }

    if(user){
        res.locals.user = user;
    }
    else if(admin) 
        res.locals.admin = admin;
    next();
};