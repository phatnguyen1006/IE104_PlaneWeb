//Function: 
//Input: 
//Output:  
//Last modified day:
module.exports.postTicket = (req, res, next) => {
    var errors = [];

    // check full name 
    if (!req.body.name) {
        errors.push("Full name is required");
    };

    //check date of birth 
    if (!req.body.dob) {
        errors.push("Date of birth is required");
    };

    //check personal id 
    if (!req.body.id) {
        errors.push("Personal id is required");
    };

    //check nationality
    if (!req.body.nation) {
        errors.push("Nationality is required");
    };

    //check email 
    if (!req.body.email) {
        errors.push("Email is required");
    };

    //check phone number
    if (!req.body.phone) {
        errors.push("Phone number is required");
    };

    //check address 
    if (!req.body.address) {
        errors.push("Address is required");
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