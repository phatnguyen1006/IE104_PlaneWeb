//Function: 
//Input: 
//Output:  
//Last modified day:
module.exports.postTicket = (req, res, next) => {
    var errors = [];

    // check full name 
    if (!req.body.name) {
        errors.push("Tên khách hàng không được để trống");
    };

    //check date of birth 
    if (!req.body.dob) {
        errors.push("Ngày sinh không được để trống");
    };

    //check personal id 
    if (!req.body.id) {
        errors.push("CMND không được để trống");
    };

    //check nationality
    if (!req.body.nation) {
        errors.push("Quốc gia không được để trống");
    };

    //check email 
    if (!req.body.email) {
        errors.push("Email không được để trống");
    };

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