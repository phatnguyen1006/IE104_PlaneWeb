const VeMB  = require('../../models/flightsTicket/veMB.model');
const {LichCB} = require("../../models/flightSchedules.model");

// @function: Find tickets bought
// @Input: id is _id of document user bought ticket
// @Output: array of ticket
// @Last modified day: 30/05/2021
async function findTicketsBought(id) {

    const TicketsBought = await VeMB.find({ID: id},(err) => {

        if(!err) console.log("Find ticket bought successful!");
        
        else console.log("Find ticket bought failed!");
    }).lean();
 
    return TicketsBought;
}

// @Function: Update many ticket bought
// This function run in function updateSchedulesFlight in flightSchedules.service.js
// @Input: MaCB , data contain fields change in schedule flight relate to this ticket
// @Output: any data/null
// @Last modified day: 30/05/2021
async function updateManyTicketBought(MaCB,data) {

    try {

        const updateMany = await VeMB.updateMany({ MaCB }, data);
        if(!updateMany) throw "Update many tickets bought failed!";

        console.log("Update many ticket bought successful!");
        return updateMany;

    } catch (error) {
        console.log(error);
        return null;
    }
    
}

// @Function: Delete ticket bought
// @Input: an object data contain _id of ticket
// @Output: true if delete success/ false if fail
// @Last modified day: 30/05/2021
async function deleteTicketBought(data) {

    // Start a session
    const session = await VeMB.startSession();

    // Start a transaction
    session.startTransaction();

    try {
        
        const deletedTicket = await VeMB.findByIdAndDelete(data.id, { session });

        if(deletedTicket) {


            const err =  await updateSGDaMua(deletedTicket,-1);
            const err1 = await updateSGTrong(deletedTicket,1)
            
            if(err.n === 0 || err1.n === 0) throw "Flight schedule not found"

            // Commit transaction
            else await session.commitTransaction();

            console.log("Delete ticket bought successed!");
        }
        else {

            console.log("Delete ticket bought failed!");
            throw "Flight schedule not found"
        }

        // End session
        session.endSession(); 
        return true;

    } catch (error) {
        
        // If error. Abort transaction
        await session.abortTransaction();
        // End session
        session.endSession();
        console.log(error);
        return false;
    }
    
}

// @Function: Delete many tickets bought
// For trigger delete a flight schedule
// This function run in another function 
// @Input: MaCB of ticket bought
// @Last modified day: 30/05/2021
async function deleteManyBoughtTickets(MaCB) {

    try {   
      

        const [deleteMany, deleteMany1] = await Promise.all([
            
            VeMB.deleteMany({ MaCB, HangVe: 1}),
            VeMB.deleteMany({ MaCB, HangVe: 2})
        ])
        


        if(
            deleteMany.ok === 1 
            && deleteMany.n === deleteMany.deletedCount 
            && deleteMany1.ok === 1 
            && deleteMany1.n === deleteMany1.deletedCount ) {

            console.log("Deleted all bought tickets successful!");
            
        }
        else {

            console.log("Deleted all bought tickets failed!");
            throw "Bought tickets not found!";
    
        }

        return true;

    } catch (error) {
        
        console.log(error);
        return false;
    }

}

// @Function: user bought ticket
// @Similar function userTicketBooked
// @Input: object data contain all field in VeMB.model
// @Output: true if bought success / false if bought fail
// @Last modified day: 30/05/2021
async function userTicketBought(data) {
  // Start a session
  const session = await VeMB.startSession();

  // Start a transaction
  session.startTransaction();

    try {
        const newTicketBought = new VeMB(data);

        // catchError is a part of transaction
        const catchError = await newTicketBought.save({ session });

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
            // Mua số lượng vé vượt quá so ghe trong
            
            const [err, err1] = await Promise.all([
                updateSGDaMua(dataUpdate, 1),
                updateSGTrong(dataUpdate, -1),
            ]);

            if (err.n === 0 && err1.n === 0) throw "Flight schedule not found!";
            // Commit transaction
            else {
                await session.commitTransaction();
                console.log("Bought ticket successfull!");
            }
        }
        else {
            console.log("Bought ticket failed!");
            throw "Flight ticket created failed!";
        }

        //End session
        session.endSession();
        return true;
    } catch (error) {
        // If error. Abort transaction
        await session.abortTransaction();
        // End session
        session.endSession();
        console.log(error);
        return false;
    }
}

// @Function: Bought ticket version lite
// Use for function change ticket booked to ticket bought
// @Similar function userTicketBooked
// @Last modified day: 30/05/2021
async function userTicketBoughtV2(data) {
    // Start a session
    const session = await VeMB.startSession();

    // Start a transaction
    session.startTransaction();

    try {
        const newTicketBought = new VeMB(data);

        // catchError is a part of transaction
        const catchError = await newTicketBought.save({ session });

        if (catchError) {

            const err = await updateSGDaMua(data, 1);

            if (err.n === 0) throw "Flight schedule not found";
            // Commit transaction
            else {
                await session.commitTransaction();
                console.log("Bought ticket successfull!");
            }
        }
        else {
            console.log("Bought ticket failed!");
            throw "Flight ticket created failed!";
        }

        // End session
        session.endSession();
        return true;
    } catch (error) {
        // If error. Abort transaction
        await session.abortTransaction();
        // End session
        session.endSession();
        console.log(error);
        return false;
    }
}


// @Modules export
module.exports = {

    findTicketsBought,
    updateManyTicketBought,
    deleteTicketBought,
    deleteManyBoughtTickets,
    userTicketBought,
    userTicketBoughtV2
}

const { updateSGDaMua, updateSGTrong } = require("../flightSchedules.service");
