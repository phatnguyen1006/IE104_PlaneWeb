const Users = require('../models/user.model');
const Admin = require('../models/admin.model');

//Function: middleware of user rights  
//Input: userId from cookie
//Output: allow it to go to the next function or not 
//Last modified day: 30/5/2021
module.exports.requireUser = async (req, res, next) => {
    //console.log(req.signedCookies.adminId);
    
    if(req.signedCookies.adminId === undefined) {       
        if (!req.signedCookies.userId) {
            req.session.from = req.originalUrl;
            res.redirect('/login');
            return;
        }
    }

    next();
};

//Function: middleware of admin rights  
//Input: adminId from cookie 
//Output:  allow it to go to the next function or not 
//Last modified day: 28/5/2021
module.exports.requireAdmin = (req, res, next) => { 

    if(!req.signedCookies.adminId){
        req.session.from = req.originalUrl;
        res.redirect('/login/admin');
        return;
    }


    var admin = Admin.find({ _id: req.signedCookies.userId });

    if(!admin) {
        req.session.from = req.originalUrl;
        res.redirect('/login/admin');
        return;
    }

    res.locals.admin=admin;
    next();
};