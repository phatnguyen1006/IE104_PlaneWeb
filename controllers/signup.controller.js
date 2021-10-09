const { encrypt } = require('../config/bcrypt.config');
const { addUser } = require('../services/user.service');
const { addAdmin } = require('../services/admin.service');

//Function: get registration view for signup
//Input: nothing 
//Output: render view for signup   
//Last modified day: 15/3/2021
module.exports.index = (req, res) => {
    if (req.session.notify) {
        //console.log(req.session.notify);
        var notify = req.session.notify;
        delete req.session.notify;
        
        res.render('registration', {
            notify: notify,
            csrf: req.csrfToken()
        });
    }
    else {
        res.render('registration', {
            csrf: req.csrfToken()
        });
    }
};

//Function: create new user 
//Input: user's name, gmail and password 
//Output:  result of adding new user 
//Last modified day: 20//3/2021
module.exports.postCreate = async (req, res) => {
    const Userdata = {
        userName: req.body.username,
        Gmail: req.body.gmail,
        Password: await encrypt(req.body.password)
    };

    // Register.
    const add = await addUser(Userdata);

    if (!add) {
        req.session.notify = "Đăng ký User thất bại";
        res.redirect('/signup');
    }
    else {
        req.session.notify = "Đăng ký User thành công";
        res.redirect('/login');
    }
    
}

//Function: get registration view for admin 
//Input: nothing 
//Output: render registration for admin 
//Last modified day: 20/5/2021
module.exports.indexAdmin = (req, res) => {
    if (req.session.notify) {
        //console.log(req.session.notify);
        var notify = req.session.notify;
        delete req.session.notify;
        
        res.render('registrationAdmin', {
            notify: notify,
            csrf: req.csrfToken()
        });
    }
    else {
        res.render('registrationAdmin', {
            csrf: req.csrfToken()
        });
    }
    
}

//Function: create new admin 
//Input: admin's name, username, password, password, gmail and phone
//Output: result of creating new admin
//Last modified day: 20/5/2021 
module.exports.postCreateAdmin = async (req, res) => {
    var adminData = {
        Name : req.body.name, 
        userName : req.body.username,
        Password : await encrypt(req.body.password),
        Gmail : req.body.gmail,
        SDT : req.body.SDT
    }

    const add = await addAdmin(adminData);

    if (!add) {
        req.session.notify = "Đăng ký Admin thất bại";
        res.redirect('/signup/admin');
    }
    else {
        req.session.notify = "Đăng ký Admin thành công";
        res.redirect('/login/admin');
    }

    
}