const  PhieuDC  = require('../../models/flightsTicket/phieuDC.model');


// @Function: Find tickets  booked
// @Input: id is _id of document ticket booked
// @Output: document ticket booked
// @Last modified day: 30/05/2021
async function findTicketsBooked(id) {

    const TicketBooked = await PhieuDC.find({ID: id},(err) => {

        if(!err) console.log("Find ticket booked successful!");
        
        else console.log("Find ticket booked failed!");
    }).lean();

    return TicketBooked;
}

// @Function: Update ticket booked
// @Input: id of ticket booked , data contain fields change in schedule flight relate to this ticket
// @Output: document was updated/null when update faild
// @Last modified day: 30/05/2021
async function updateTicketBooked(id,data) {

    try {

        const update = await PhieuDC.findByIdAndUpdate(id, data);
        if(!update) throw "Update ticket booked failed!";

        console.log("Update ticket booked successful!");
        return update;

    } catch (error) {
        console.log(error);
        return null;
    }
    
}

// @Function: Update many ticket booked
// @This function run in function updateSchedulesFlight in flightSchedules.service.js
// @Input: MaCB , data contain fields change in schedule flight relate to this ticket
// @Output: object info /null
// @Last modified day: 30/05/2021
async function updateManyTicketBooked(MaCB,data) {

    try {

        const updateMany = await PhieuDC.updateMany({ MaCB }, data);
        if(!updateMany) throw "Update many tickets booked failed!";

        console.log("Update many ticket booked successful!");
        return updateMany;

    } catch (error) {
        console.log(error);
        return null;
    }
    
}

// @Function: Delete ticket booked
// @Input: data is contain id of document ticket booked
// @Output: true when delete success/ fail when fail
// @Last modified day: 30/05/2021
async function deleteTicketBooked(data) {

    const session = await PhieuDC.startSession();
    session.startTransaction();

    try {
        const deletedTicket = await PhieuDC.findByIdAndDelete(data.id, {
        session,
        });

        if (deletedTicket) {
        const err = await updateSGDat(deletedTicket, -1);
        const err1 = await updateSGTrong(deletedTicket, 1);

        if (err.n === 0 || err1.n === 0) throw "Flight ticket not found!";
        else {
            await session.commitTransaction();
            console.log("Delete ticket booked successed!");
        }

        } else {
        console.log("Delete ticket booked failed!");
        throw "Flight ticket not found";
        }

        session.endSession();
        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return false;
    }  
}

// @Function: Delete many tickets booked
// For trigger delete a flight schedule
// This function run in another function 
// @Input: MaCB of ticket
// @Ouput: true if delete success / false if delete fail
// @Last modified day: 30/05/2021
async function deleteManyBookedTickets(MaCB) {

    try {
    
        const [deleteMany, deleteMany1] = await Promise.all([

            PhieuDC.deleteMany({ MaCB, HangVe: 1 }),
            PhieuDC.deleteMany({ MaCB, HangVe: 2 })
        ])


        if(
            deleteMany.ok === 1 
            && deleteMany.n === deleteMany.deletedCount
            && deleteMany1.ok === 1 
            && deleteMany1.n === deleteMany1.deletedCount ) {

            console.log("Deleted all booked tickets successful!");
                
        }
        else {

            console.log("Deleted all booked tickets failed!");
            throw "Booked tickets  not found!";
    
        }

        return true;

    } catch (error) {
        
        console.log(error);
        return false;
    }
}




// @Function: Booked ticket -> decrease number of remain ticket -> increase number of bought/booked ticket
// @Input data: all field in VeMB model
// @Output: true if booked ticket success/false if if booked ticket fail
// @Last modified day: 30/05/2021
async function userTicketBooked(data) {

    const session = await PhieuDC.startSession();
    session.startTransaction();
    try {
        const newTicketBooked = new PhieuDC(data);
        const catchError = await newTicketBooked.save({ session });

        const dataCheck = await LichCB.aggregate([
            {
                $match: {
                    MaCB: data.MaCB,
                },
            },
            {
                $unwind: "$DSHangVe",
            },
            {
                $match: {
                    "DSHangVe.maHangVe": data.HangVe,
                },
            },
            {
                $project: {
                    _id: 0,
                    SGTrong: "$DSHangVe.SGTrong",
                },
            },
        ]);

        const [value] = dataCheck;
        console.log(value.SGTrong);

        const dataUpdate = { MaCB: data.MaCB, HangVe: data.HangVe };

        if (catchError) {
            if (value.SGTrong === 0) throw "Out of Stock!";

            const err = await updateSGDat(dataUpdate, 1);
            const err1 = await updateSGTrong(dataUpdate, -1);

            if (err.n === 0 || err1.n === 0) throw "Flight ticket not found";
            else {
            await session.commitTransaction();
            console.log("Add ticket booked successed!");
            }

        } else {
            console.log("Add ticket booked failed!");
            throw "Flight ticket created failed!";
        }

        session.endSession();
        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return false;
    }
    
}



// @Function: Change booked ticket to bought ticket
// @Input: is a object contain field id. id is flield _id on cluster.
// @Output: true if change success/false if change fail
// @Last modified day: 30/05/2021
async function changeBookedToBoughtTicket(data) {

    const session = await PhieuDC.startSession();
    session.startTransaction();

        try {

        const deletedTicket = await PhieuDC.findByIdAndDelete(data.id, {
            session,
        });
        const {
            _id,
            ID,
            MaCB,
            ChuyenBay,
            TenHanhKhach,
            HanhKhach,
            CMND,
            SDT,
            HangVe,
        } = deletedTicket;
        let newData = {
            _id,
            ID,
            MaCB,
            ChuyenBay,
            TenHanhKhach,
            HanhKhach,
            CMND,
            SDT,
            HangVe,
        };
        newData = { ...newData, GiaTien: data.GiaTien };
        
        if (deletedTicket) {
            const add = await userTicketBoughtV2(newData);
            if (add) {
                const err = await updateSGDat(deletedTicket, -1);

                if (err.n === 0) throw "Flight ticket not found!";
                else {
                    await session.commitTransaction();
                    console.log("Delete ticket booked successed!");
                }
            } else {
                throw "Add to ticket bought failed!";
            }
        } else {
            console.log("Delete ticket booked failed!");
            throw "Flight ticket not found";
        }

        session.endSession();
        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return false;
    }   
}

// @Mudules export
module.exports = {
     
    userTicketBooked,
    findTicketsBooked,
    updateTicketBooked,
    updateManyTicketBooked,
    deleteTicketBooked,
    deleteManyBookedTickets,
    changeBookedToBoughtTicket
    
}

const { updateSGDat, updateSGTrong } = require('../flightSchedules.service');
const { userTicketBoughtV2 } = require('./veMB.service');
const { LichCB } = require('../../models/flightSchedules.model');

