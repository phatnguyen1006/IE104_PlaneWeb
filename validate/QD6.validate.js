const QD6service = require('../services/QD6.service');
const HangVe = require('../services/flightTickets.service/hangVe.service');
const flightScheduleService = require('../services/flightSchedules.service');

//Function: check new flight schedule data
//Input: flight schedule data 
//Output:  notify if there is an errors 
module.exports.addFlightScheduleValidate = async (req, res, next) => {
if (!req.body.SanBayTG) {
    req.body.SanBayTG='{}';
}

var errors = [];
var SanBayTG = JSON.parse(req.body.SanBayTG);
const getQD6 = await  QD6service.getOne();
const hangVe = await HangVe.getAllTypeTicket();

if (req.body.departureCity == req.body.arrivalCity) {
    errors.push("Điểm đi không được trủng với điểm đến");
}

const existFlight = await flightScheduleService.getOneScheduleFlightByMaCB(req.body.MaCB);

if (existFlight) {
    errors.push("Mã chuyến bay đã tồn tại!");
    //console.log(existFlight);
}


for (var i=0;i < SanBayTG.length ; i++) {
    if (SanBayTG[i].TenSB == req.body.SanBayDi) {
        errors.push("Sân bay trung gian không được trùng với sân bay đi");
    }

    if (SanBayTG[i].TenSB == req.body.SanBayDen) {
        errors.push("Sân bay trung gian không được trùng với sân bay đến");
    }

}

for(var i=0; i < SanBayTG.length-1 ; i++) {
    for(var j=i+1; j < SanBayTG.length ; j++) {
    if (SanBayTG[i].TenSB == SanBayTG[j].TenSB) {
        errors.push("Sân bay trung gian không được trùng nhau");
    }
    
    }
}

if (errors.length > 0) { 
    //console.log(errors);
    res.render('flightSchedule',{
        errors : errors,
        hangVe: hangVe,
        QD6 : getQD6,
        csrf: req.csrfToken()
    })
    return;
}

next();
}

//Function: check if there is a same HV in database when adding a new one 
//Input: new ticket class 
//Output: notify when there is a same class
module.exports.addHV = async (req, res, next) => {
    const ticketType = await HangVe.getAllTypeTicket();
    const check = req.body.maHangVe;
    const getQD6 = await QD6service.getOne(); 
    var errors = [];

    for(var i=0 ; i<ticketType.length ; i++) {
        if(check == ticketType[i].maHangVe) 
            errors.push("Mã hạng vé đã tồn tại");
    }

    if (errors.length > 0) { 
        //console.log(errors);
        res.render('settingQD6',{
            errors : errors,
            hangVe: ticketType,
            QD6 : getQD6,
            csrf: req.csrfToken()
        })
        return;
    }
    
    next();

}