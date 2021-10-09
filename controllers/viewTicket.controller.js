const findBookedTicket = require('../services/flightTickets.service/phieuDC.service');
const findBoughtTicket = require('../services/flightTickets.service/veMB.service');
const findFlight = require('../services/flightSchedules.service');
const getTime = require('../services/QD6.service');
const HangVeService = require('../services/flightTickets.service/hangVe.service');

//Function: find ticket of user or admin and transfer data to FE to show 
//Input: user info from locals or cookie
//Output:  booked and bought tickets of user
//Last modified day: 26/4/2021
module.exports.findTicket = async (req, res) => {
    //console.log(req.session.notify)

    const HangVe = await HangVeService.getAllTypeTicket();
    var id=null;
    if (req.signedCookies.userId) {
        id = req.signedCookies.userId;
    }
    else if (req.signedCookies.adminId) {
        id = req.signedCookies.adminId;
    }

    var bookedTicket = await findBookedTicket.findTicketsBooked(id);
    var boughtTicket = await findBoughtTicket.findTicketsBought(id);
    
    const timeDB = await getTime.getOne();
    const cancelTime = timeDB.cancelTimeBookTicket;
    //console.log(cancelTime);

    //add GiaVeMua and TrangThai to bookedTicket array of objects
    var today = new Date(); 
    for (let i=0 ; i<bookedTicket.length ; i++) {
        const flight = await findFlight.getOneScheduleFlightByMaCB(bookedTicket[i].MaCB);
        //add TrangThai 
        if (flight.NgayGio-today >= (cancelTime*86400000)) {
            bookedTicket[i].TrangThai=1;
        }
        else {
            bookedTicket[i].TrangThai=0;
        }

        //add GiaVeMua
        bookedTicket[i] = {...bookedTicket[i],GiaVeMua : flight.GiaVe};
        //console.log(flight);
    }
    //console.log(cancelTime);

    
    if (req.session.notify) {
        //console.log(req.session.notify);
        var notify = req.session.notify;
        delete req.session.notify;
        
        res.render('viewTicket', {
            bookedTicket: bookedTicket,
            boughtTicket: boughtTicket,
            cancel: cancelTime,
            HangVe: HangVe,
            csrf: req.csrfToken(),
            notify: notify
        });
    }
    else {
        res.render('viewTicket', {
            bookedTicket: bookedTicket,
            boughtTicket: boughtTicket,
            cancel: cancelTime,
            HangVe: HangVe,
            csrf: req.csrfToken(),
        });
    }
    

}

//Function: change ticket info (only booked ticket)
//Input: id of ticket 
//Output: result of update ticket info
//Last modified day: 26/4/2021
module.exports.postTicketChange = async (req, res) => {
    var ticketID = req.body._id;
    var info = {
        HanhKhach: req.body.name,
        CMND : req.body.personalId,
        SDT : req.body.phone,
    }
    const change = await findBookedTicket.updateTicketBooked(ticketID, info);
    if (!change) {
        req.session.notify = "Thay đổi thông tin thất bại";
        
    } else {
        req.session.notify = "Thay đổi thông tin thành công";
    }
    res.redirect('/viewTicket');
}


//Function: paid to change booked from bought ticket 
//Input: id ticket
//Output: save ticket it to bought ticket and delete it in booked ticket
//Last modified day: 26/4/2021
module.exports.postChange = async (req, res) => {
    const data = {
        id: req.body._id,
        GiaTien: req.body.price
    };

    const changeTicket = await findBookedTicket.changeBookedToBoughtTicket(data);

    if (!changeTicket) {
        req.session.notify = "Bạn đã chuyển vé đặt thành mua thất bại";
        console.log("Change ticket bought failed");
    }
    else {
        req.session.notify = "Bạn đã chuyển vé đặt thành mua thành công";
        console.log("Change ticket to bought sucessfully");
    }

    res.redirect('/viewTicket')
}