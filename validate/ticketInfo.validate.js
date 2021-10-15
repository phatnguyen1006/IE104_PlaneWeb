//Function: 
//Input: 
//Output:  
//Last modified day:
module.exports.postTicket = (req, res, next) => {
    var errors = [];
    var regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
    var regDate =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

    // check full name 
    if (!req.body.name) {
        errors.push("Tên khách hàng không được để trống");
    } else if(!regName.test(req.body.name)){
        errors.push("Họ và tên không hợp lệ");
    }

    if (req.body.phone.length < 9 && req.body.phone.length > 11) {
        errors.push("Số điện thoại không hợp lệ");
    }

    //check date of birth 
    if (!req.body.dob) {
        errors.push("Ngày sinh không được để trống");
    };

    if (!regDate.test(req.body.dob)) {
        errors.push("Ngày sinh không hợp lệ");
    }

    //check personal id 
    if (!req.body.id) {
        errors.push("CMND không được để trống");
    };

    if (req.body.id.length != 9 || req.body.id.length != 12) {
        errors.push("CMND không hợp lệ");
    }

    //check nationality
    const nation = req.body.nation
    if (!nation) {
        errors.push("Quốc gia không được để trống");
    };

    if(!regName.test(nation) || nation.charAt(0) == nation.charAt(0).toUpperCase()){
        errors.push("Quốc gia không hợp lệ");
      }

    let email = req.body.email;
    //check email 
    if (!email) {
        errors.push("Gmail không được để trống");
    };

    if (email.length < 6 || !email.includes("@")) {
        errors.push("Gmail không hợp lệ");
    }

    //check phone number
    if (!req.body.phone) {
        errors.push("Số điện thoại không được để trống");
    };

    //check address 
    if (!req.body.address) {
        errors.push("Địa chỉ không được để trống");
    };

    if (erros.length > 0) {
        res.render('ticketInfo',{
            errors: errors,
            value: req.body
        });
        return;
    };

    next();

};