const { findOneUser } = require('../../services/user.service');
const { compareCrypt } = require('../../config/bcrypt.config');
const adminService = require('../../services/admin.service');

//Function: get the view for user 
//Input: nothing 
//Output:  render login view 
//Last modified day: 15/5/2021
module.exports.login = (req, res) => {
    if(req.signedCookies.userId || req.signedCookies.adminId) {
        res.redirect('/');
        return;
    }

    var notify = req.session.notify;
    delete req.session.notify;

    if (notify) {
        res.render('login', {
            notify: notify,
            csrf: req.csrfToken()
        });
    }
    else {
        res.render('login', {
            csrf: req.csrfToken()
        });
    }
};

//Function: check login from database to let user login 
//Input: user's gmail and password 
//Output:  if there is a user then set cookie for them, if not re-render the login view 
//Last modified day: 2/5/2021
module.exports.postLogin = async (req, res) => {
    var gmail = req.body.gmail;
    var password = req.body.password;

    var location = req.session.from || '/';
    var errors = [];

    let user = await findOneUser({ Gmail: gmail });

    if (!user) {
        res.render('login', {
            errors: [...errors, 'Wrong Users!!!'],
            csrf: req.csrfToken(),
            values: req.body
        });
        return;
    }
    if (password != user.Password) {
        res.render('login', {
            errors: [...errors, 'Wrong Password!!!'],
            csrf: req.csrfToken(),
            values: req.body
        });
        return;
    }

    res.cookie('userId', user._id, {
        signed: true
    });

    
    delete req.session.from; // clear var
    req.session.user = user;
    res.redirect(location);
};

//Function: login with encrypted password 
//Input: user's gmail and password
//Output: if there is a user then set cookie for them, if not re-render the login view  
//Last modified day: 10/5/2021
module.exports.enlogin = async (req, res) => {
    const Gmail = req.body.gmail;
    const password = req.body.password;

    var location = req.session.from || '/';
    var errors = [];

    const user = await findOneUser({ Gmail: Gmail });

    if (!user) {
        res.render('login', {
            errors: [...errors, 'User không tồn tại!!!'],
            csrf: req.csrfToken(),
            values: req.body
        })
        return;
    }

    if (!(await compareCrypt(password, user.Password))) {
        res.render('login', {
            errors: [...errors, 'Mật khẩu không đúng!!!'],
            csrf: req.csrfToken(),
            values: req.body
        });
        return;
    }

    res.cookie('userId', user._id, {
        signed: true
    });


    delete req.session.from;
    req.session.user = user;
    res.redirect(location);
}

//Function: get login view of admin 
//Input: nothing 
//Output:  render admin's login view 
//Last modified day: 20/5/2021
module.exports.adminLogin = async (req, res) => {
    if(req.signedCookies.userId || req.signedCookies.adminId) {
        res.redirect('/');
        return;
    }
    var notify = req.session.notify;
    delete req.session.notify;

    if (notify) {
        res.render('loginAdmin',{
            notify: notify,
            csrf: req.csrfToken()
        });
    }
    else {
        res.render('loginAdmin',{
            csrf: req.csrfToken()
        });
    }
}
//Function: get data from admin's login view and check it in database 
//Input: admin's gmail and password 
//Output:  if there is an admin then set cookie for them, if not re-render the login view  
//Last modified day: 20/5/2021
module.exports.adminPostLogin = async (req, res) => {
    const Gmail = req.body.gmail;
    const password = req.body.password;

    var location = req.session.from || '/';
    var errors = [];

    const admin = await adminService.getOneAdmin({ Gmail: Gmail });
    //onsole.log(admin);

    if (!admin) {
        res.render('loginAdmin', {
            errors : [...errors,'Admin không tồn tại!!!'],
            csrf : req.csrfToken(),
            values : req.body
        });
        return;
    }

    if(!(await compareCrypt(password, admin.Password))) {
        res.render('loginAdmin', {
            errors : [...errors,'Mật khẩu không đúng!!!'],
            csrf : req.csrfToken(),
            values : req.body
        });
        return;
    }

    res.cookie('adminId', admin._id, {
        signed: true 
    }) 

    delete req.session.from;
    req.session.admin = admin;
    res.redirect(location);
}

//Function: logout for admin 
//Input: nothing 
//Output:  clear cookie
//Last modified day: 15/5/2021
module.exports.logoutAdmin = (req, res) => {
    console.log('Admin logout!!!');
    res.clearCookie('adminId');
    res.redirect('/');
}
