const flightTickets = require('../services/flightSchedules.service');
//const bodyParser = require('body-parser');

//Function: get view for seat management 
//Input: nothing 
//Output: render seatManage view
//Last modified day: 2/4/2021
module.exports.index = (req, res) => {
    res.render('seatManage',{
        user: res.locals.user
    });
};

//Function: show one flight schedule 
//Input: flight schedule's code 
//Output: render seatMange with flight schedule  
//Last modified day: 1/4/2021
module.exports.postCode = (req, res) => {
    var code = req.body.code;
    res.render('seatManage',{
        info: flightTickets.getOneScheduleFlightByMaCB(code)
    });

    //res.status(200).json(code); 
};