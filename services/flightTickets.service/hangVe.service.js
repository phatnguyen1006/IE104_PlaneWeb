const HangVe = require("../../models/flightsTicket/hangVe.model");
const {LichCB} = require("../../models/flightSchedules.model");


//@Function: get all type ticket 
//@Input: no input
//@Output: An object array type ticket or null when get data fail
//@Last modified day: 30/05/2021
async function getAllTypeTicket() {
    try {
        const typeTicket = await HangVe.find({}).lean();

        if (!typeTicket) throw "Get all type ticket fail!";

        console.log("Get all type ticket successful!");
        return typeTicket;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//@Function: add new type ticket for QD6
//@Input: a object data contain three field: tiLeTien, tenHangVe, maHangVe
//@Example: data = {tiLeTien: value, tenHangVe: "value", maHangVe: "value"}
//@Output: object data or null when add fail  
//@Last modified day: 05/06/2021
async function addNewTypeTicket(data) {
    try {
        const addNew = new HangVe(data);
        const result = addNew.save();
        if (!result) throw "Add new type ticket failed!";
        console.log("Add new type ticket seccessful!");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}


//@Function: update type ticket for QD6
//@Input: a object data contain among of field: tiLeTien, tenHangVe, maHangVe
// and id is _id of ducument type ticket update
//@Example: data = {tiLeTien: value, tenHangVe: "value", maHangVe: "value"}
//@Output: object ducument after update or null when update fail 
//@Last modified day: 05/06/2021
async function updateTypeTicket(id, data) {
    try {
        const update = await HangVe.findByIdAndUpdate(id, data);
        if (!update) throw "Update type ticket failed!";
        console.log("Update type ticket successful!");
        return update;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//@Function: find type ticket for flight schedules 
//@Input: a object data is field DSHangVe in flight schedules (flightSchedules.model.js)
//@Output:  object array of HangVe or null when find fail
//@Last modified day: 05/06/2021
async function findTypeTicket(data) {
   
    data = data.map((i) => i.maHangVe);

    try {
        const typeTickets = await HangVe.find({ maHangVe: { $in: data } });

        if (!typeTickets) throw "Find type ticket failed!";

        return typeTickets;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//@Function: delete one type ticket  
//@Input: maHangVe of ducument type ticket 
//@Output: object result or null when delete fail
//@Last modified day: 05/06/2021
async function deleteTypeTicket(maHangVe) {
    try {
      const findTypeTicet = await LichCB.find({
          DSHangVe: { $elemMatch: { maHangVe } },
      });

      if (findTypeTicet.length === 0) {
          const result = await HangVe.deleteOne({ maHangVe });
          if (result.n === 0) throw "Delete type ticket fail!";
          console.log("Delete type ticket successful!");
          return result;
      } else {
          throw "This type ticket exists in other flightschedules.Can't delete!!";
      }
    } catch (error) {
        console.log(error);
        return null;
    }
}

//@Function: check type ticket  exists in LichCB
//@Input: maHangVe of ducument type ticket 
//@Output: true/false
//@Last modified day: 19/06/2021
async function checkTypeTicket(maHangVe) {
    try {
      const findTypeTicet = await LichCB.find({
          DSHangVe: { $elemMatch: { maHangVe } },
      });

      if (findTypeTicet.length === 0) {
            return true;
      } else {
          throw "This type ticket exists in other flightschedules.";
      }
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
  getAllTypeTicket,
  addNewTypeTicket,
  updateTypeTicket,
  findTypeTicket,
  deleteTypeTicket,
  checkTypeTicket,
};