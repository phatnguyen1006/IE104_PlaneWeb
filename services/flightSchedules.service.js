var { LichCB } = require('../models/flightSchedules.model');


// @Function: Get min year of schedules flight
// @Input: no
// Output: min year/ null if get fail
// @Last modified day: 12/06/2021
async function getMinYearofSchedulesFlight() {

    try {
        const minYear = await LichCB.find({}).sort({NgayGio: 1}).select("NgayGio -_id");
        
        if(minYear.length === 0 ) throw "Get min year fail!";
        console.log("Get min year success!");

        return minYear[0].NgayGio.getFullYear();
    } catch (error) {
        console.log(error);
        return null;
    }
}

// @Function: Get max year of schedules flight
// @Input: no
// Output: max year/ null if get fail
// @Last modified day: 12/06/2021
async function getMaxYearofSchedulesFlight() {
  try {
    const maxYear = await LichCB.find({})
      .sort({ NgayGio: -1 })
      .select("NgayGio -_id");

    if (maxYear.length === 0) throw "Get min year fail!";
    console.log("Get min year success!");

    return maxYear[0].NgayGio.getFullYear();
  } catch (error) {
    console.log(error);
    return null;
  }
}

// @Function: Get all schedules flight
// @Input: no
// Output: array of schedules flight/ null if get fail
// @Last modified day: 30/05/2021
async function getAllScheduleFlight() {

     const allSchedulesFlight = await LichCB.find().lean();

     if (allSchedulesFlight)
       console.log("Get all schedules flight successful!");
     else console.log("Get all schedules flight failed!");

     return allSchedulesFlight;
}

// @Function: Get one schedule flight by MaCB
// @Input: MaCB of schedule flight want to find
// @Output: ducument schedules flight if match with MaCB/ null if not match
// @Last modified day: 30/05/2021
async function getOneScheduleFlightByMaCB(MaCB) {

    try {

        const getOne = await LichCB.findOne({MaCB}).lean();

        if(getOne) console.log("Get one schedule flight successful!");
            
        else console.log("Get one schedule flight failed!");

        return getOne;

    } catch (error) {
        
        console.log(error);
    }
}

// @Function: Find flight schedule by SanBayDi, SanBayDen and NgayGio
// @Input is a object name data. data = { "SanBayDi": "value", "SanBayDen": "value", "NgayGio": "value"}
// @Output a value is array of flight schedules or null 
// @Last modified day: 30/05/2021
async function findFlightSchedules(data) {

    //console.log(data);
    try {
        
        //const listFlightSchedules = await LichCB.find(data).lean();
        const listFlightSchedules = await LichCB.aggregate([
          {
            $match: {
              ChuyenBay: data.ChuyenBay,
              NgayGio: new Date(data.NgayGio),
            },
          },
          {
            $project: {
              _id: 1,
              MaCB: 1,
              ChuyenBay: 1,
              GiaVe: 1,
              SanBayDi: 1,
              SanBayDen: 1,
              ThoiGianBay: 1,
              NgayGio: 1,
              GioKhoiHanh: 1,
              GioDen: 1,
              TLSG: 1,
              SanBayTG: 1,
              DSHangVe: 1,
              sumTGDung: {
                $reduce: {
                  input: "$SanBayTG",
                  initialValue: 0,
                  in: { $sum: ["$$value", "$$this.TGDung"] },
                },
              },
              sumSGTrong: {
                $reduce: {
                  input: "$DSHangVe",
                  initialValue: 0,
                  in: { $sum: ["$$value", "$$this.SGTrong"]},
                },
              },
            },
          },
        ]);

        if (listFlightSchedules)
          console.log("Found flight schedules successful!");
        else console.log("Not found flight schedules!");

        //console.log(listFlightSchedules);
        return listFlightSchedules;
    } catch (error) {
        
        console.log(error);
    }

    console.log("Big error!!!!!!");
}

// @Function: Add schedules flight 
// @Input: data: one document of schedules flight
// @Output: true if add success/ false if add fail
// @Last modified day: 30/05/2021
async function addScheduleFlight(data) {

    try {
        const newScheduleFlight = new LichCB(data);

        const addNew = await newScheduleFlight.save();

        if (addNew) console.log("Add schedules flight successed!");
        else throw "Add schedules flight failed!";

        return addNew;
    } catch (error) {
        console.log(error);
        return false;
    }
    
    
}

// @Function: Update schedule flight
// @Input: id of schedule flight and object data contains all field you want change. EX: data = { ChuyenBay: "anything"}
// --> update all field if any field in data match any flield  in ticket bought/booked. 
// @Output: data of schedule flight after update/null if fail
// @Last modified day: 30/05/2021
async function updateScheduleFlight(id, data) {
    const session = await LichCB.startSession();

    try {
        
        const resultSession = await session.withTransaction(async() => {

            const updatedSchedule = await LichCB.findOneAndUpdate({
                _id: id,
            }, data, {
                session
            });

            if(!updatedSchedule) throw "Update schedule flight failed!";

            const { ChuyenBay, GiaVe } = data;
            const updateData = {
                ChuyenBay,
                GiaTien: GiaVe
            }; 
           
            if(updateData.ChuyenBay && updateData.GiaTien) {

                const updateTicketsBought = await updateManyTicketBought(updatedSchedule.MaCB, updateData);
                const updateTicketsBooked = await updateManyTicketBooked(updatedSchedule.MaCB, updateData);

                if(!updateTicketsBooked || !updateTicketsBought) {

                    await session.abortTransaction();
                    throw "Update ticket belong to this flight schedule failed!";
                }
            }
            
            console.log("Update schedules flight successed!");
        })

        return resultSession;
    } catch (error) {

        console.log(error);
        session.endSession();
        return null;
    }
     
}

// @Function: Delete schedules flight
// @This function detete one shedule flight and all bought/booked belong to this schedule flight with parameter "data"
// @Input: "data" is a object with two properties "id" and "MaCB". EX: data = { "id": "any id", "MaCB": "any MaCB"}  
// @Output: This function return true if delete successful or return false if delete failed.
// @Last modified day: 30/05/2021
async function deleteCheduleFlight(data) {

    const sess = await LichCB.startSession();
    sess.startTransaction(); 

    try {
            
        const deletedSchedule = await LichCB.findByIdAndDelete(data.id,{ session: sess });

        if(deletedSchedule) {

            const [err, err1] = await Promise.all([
                
                deleteManyBoughtTickets(data.MaCB),
                deleteManyBookedTickets(data.MaCB)
            ])

            console.log(err);
            console.log(err1);

            if(err && err1) {

                console.log("Delete schedules flight successed!");
                console.log("Delete bought/booked belong to this flight schedules successful!");
                await sess.commitTransaction();
            }
            else {

                console.log("Delete schedules flight failed!");
                console.log("Delete bought/booked belong to this flight schedules failed!");
                throw "Ticket not found!";
                 
            }
        }
        else {

            throw "Flight schedule not found!";
        }

        sess.endSession();
        return true;

    } catch (error) {

        console.log(error);
        await sess.abortTransaction();
        sess.endSession();
        return false;
    }
   
}

// @FunctionL Take list flight
// Not use
async function takeListFlight() {
    
  // Auto select _id
  const listFlight = await LichCB.find().select(
    "SanBayDi SanBayDen NgayGio ThoiGianBay  ChuyenBay DSHangVe"
  );

  return listFlight;
} 

// @Fucntion: Update number of bought tickets when user bought/booked ticket
// @Input: dataUpdate must contain field HangVe and inc is number of ticker user bought/booked
// @Output: info about update/ null if update fail
// @Last modified day: 30/05/2021
async function updateSGDaMua(dataUpdate, inc) {

    let temp = "increase";
    if (inc < 0) temp = "decrease";

    try {

        const updateSG1 = await LichCB.updateOne(
            { MaCB: dataUpdate.MaCB, "DSHangVe.maHangVe": dataUpdate.HangVe },
            { $inc: { "DSHangVe.$.SGDaMua": inc } }
        );

        if (updateSG1.n > 0)
            console.log(
            `Number of bought tickets type ${dataUpdate.HangVe} ${temp} ${Math.abs(inc)}!`);
        else
            console.log(
            `Number of bought tickets type ${dataUpdate.HangVe} don't ${temp} ${Math.abs(inc)}!`
        );

        return updateSG1;

    } catch (error) {
        console.log(error);
        return null;
    }
}


// @Function: Update number of booked tickets
// @Same function updateSGDaMua
// @Last modified day: 30/05/2021
async function updateSGDat(dataUpdate, inc) {

    let temp = "increase";
    if (inc < 0) temp = "decrease";

    try {
        const updateSG1 = await LichCB.updateOne(
            { MaCB: dataUpdate.MaCB, "DSHangVe.maHangVe": dataUpdate.HangVe },
            { $inc: { "DSHangVe.$.SGDat": inc } }
        );

        if (updateSG1.n > 0)
            console.log(
            `Number of bought tickets type ${dataUpdate.HangVe} ${temp} ${Math.abs(inc)}!`
        );
        else
            console.log(
            `Number of bought tickets type ${dataUpdate.HangVe} don't ${temp} ${Math.abs(inc)}!`
        );

        return updateSG1;

    } catch (error) {
        console.log(error);
        return null;
    }
}



// @Function: Update number of tickets remain
// @Input: dataUpdate must contain field HangVe and inc is number of ticker user bought/booked
// @Output: info about update/ null if update fail
// @Last modified day: 30/05/2021
async function updateSGTrong(dataUpdate, inc) {

    let temp = "increase";
    if (inc < 0) temp = "decrease";

    try {

        const updateSGTrong = await LichCB.updateOne(
            { MaCB: dataUpdate.MaCB, "DSHangVe.maHangVe": dataUpdate.HangVe },
            { $inc: { "DSHangVe.$.SGTrong": inc } }
        );

        if (updateSGTrong.n > 0)
            console.log(
            `Number of tickets remain type ${dataUpdate.HangVe} ${temp} ${Math.abs(inc)}!`
        );
        else
            console.log(
            `Number of tickets  remain type ${dataUpdate.HangVe} don't ${temp} ${Math.abs(inc)}!`
        );

        return updateSGTrong;

    } catch (error) {
        console.log(error);
        return null;
    }
}


// =================================================================================
// @Modules export
module.exports = {
    getMinYearofSchedulesFlight,
    getMaxYearofSchedulesFlight,
    addScheduleFlight,
    getAllScheduleFlight,
    getOneScheduleFlightByMaCB,
    findFlightSchedules,
    takeListFlight,
    updateScheduleFlight,
    updateSGDaMua,
    updateSGDat,
    updateSGTrong,
    deleteCheduleFlight,
    deleteCheduleFlight,
};

const { deleteManyBoughtTickets, updateManyTicketBought } = require('./flightTickets.service/veMB.service');
const { deleteManyBookedTickets, updateManyTicketBooked } = require('./flightTickets.service/phieuDC.service');





