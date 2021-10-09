const ticketBought = require('../services/flightTickets.service/veMB.service');
const ticketBooked = require('../services/flightTickets.service/phieuDC.service');
const getFlightSchedule = require('../services/flightSchedules.service');
const HangVeService = require('../services/flightTickets.service/hangVe.service');

//Function: get ticket info view for buyers 
//Input: user from locals 
//Output: render ticketInfo view for whom bought 
//Last modified day: 15/5/2021
module.exports.getTicketInfoView = async (req, res) => {
    let flightCode = req.session.flightCode;
    const ticketType = req.session.ticketType;

    const flight = await getFlightSchedule.getOneScheduleFlightByMaCB(flightCode);

    if (!(await flight))
        return res.redirect("/NotFound");
    var data = flight.DSHangVe;
    var HangVe = await HangVeService.findTypeTicket(data);
    
    res.render('ticketInfo', {
        flight: await flight,
        ticketType: ticketType,
        HangVe: await HangVe,
        csrf: req.csrfToken()
    });

    delete req.session.flightCode;
    delete req.session.ticketType;
}

//Function: save buy or book ticket 
//Input: info of ticket: name, flight, PID,...
//Output:  save ticket result
//Last modified day: 14/4/2021
module.exports.postTicket = async (req, res) => {
    var errors = [];
    var ticketClass = parseInt(req.body.class);
    var todayDate = new Date() + 7*3600*1000;
    var id=null;
    if (req.signedCookies.userId) {
        id = req.signedCookies.userId;
    }
    else if (req.signedCookies.adminId) {
        id = req.signedCookies.adminId;
    }

    var info = {
        ID : id,
        HanhKhach: req.body.name,
        MaCB : req.body.flightCode,
        ChuyenBay: req.body.journey,
        CMND : req.body.personalId,
        SDT : req.body.phone,
        GiaTien : req.body.price,
        HangVe : ticketClass,
        SoLuong: 1,
        NgayDatVe: todayDate
    };

    var ticketType =  req.body.ticketType;
    //var strFlightDate = info.NgayDatVe.split('/').slice(0);
    //var dateFlightDate = new Date()
    //console.log(IntFlightDate);

    if (ticketType == 1) {
        const saveTicket = await ticketBought.userTicketBought(info);
        if(saveTicket){
            //console.log("This is saveTicket", saveTicket);
            console.log('Save bought successfully');
            req.session.notify = "Bạn đã mua vé thành công!!";
            res.redirect('/viewTicket');
        }
        else {
            errors.push("Mua vé thất bại! Xin thử lại");
            res.render('payment',{
                flight: info,
                errors: errors,
                csrf: req.csrfToken()
            });
        }
    }
    
    else if (ticketType == 0) {
        const saveTicket = await ticketBooked.userTicketBooked(info);
        if(saveTicket){
            console.log('Save booked successfully');
            req.session.notify = "Bạn đã đặt vé thành công!!";
            res.redirect('/viewTicket');
        }
        else {
            errors.push("Đặt vé thất bại! Xin thử lại");
            res.render('payment',{
                flight: info,
                errors: errors,
                csrf: req.csrfToken()
            });
        }
    }

    else {
        //res.redirect('/ticketInfo');
        console.log('FAIL');
        errors.push("Thất bại!! Xin thử lại");
        res.render('payment',{
            flight: info,
            errors: errors,
            csrf: req.csrfToken()
        });
    }

    
}

//Function: show ticket info for user to input
//Input: flight code and ticket type 
//Output:  ticket info 
//Last modified day: 13/4/2021
module.exports.postInfo = async (req, res) => {
    const flightCode = req.body.flightCode;
    const ticketType = req.body.ticketType;

    //get flight's schedule by flight code  
    const flight = await getFlightSchedule.getOneScheduleFlightByMaCB(flightCode);
    //console.log(flight);

    var data = flight.DSHangVe;
    var HangVe = await HangVeService.findTypeTicket(data);
    var hour_depart = flight.GioKhoiHanh;
    var minute_depart = parseInt((hour_depart - parseInt(hour_depart))*60);
    hour_depart = parseInt(flight.GioKhoiHanh);
    if(flightCode && ticketType) {
    res.render('ticketInfo',{
        flight: flight,
        ticketType: ticketType,
        HangVe: HangVe,
        hour_depart: hour_depart,
        minute_depart: minute_depart,
        csrf: req.csrfToken()
    });
    }
    else {
        res.redirect('/flight-searching');
    }

}