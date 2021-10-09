
const QD6 = require('../models/QD6.model');
const { LichCB } = require("../models/flightSchedules.model");


// @Function: Get all field in one ducoment QD6
// @Intput: no
// @Output: object contain all field of QG6/ null if get fail
// @Last modified day: 30/05/2021
async function getOne() {
   try {
       const allField = await QD6.find({}).lean();
    
       if(allField.length === 0) throw "Get QD6 data failed!"
       console.log("Get QD6 data success!");
       return allField[0];

   } catch (error) {
       console.log(error);
       return null;
   }
}


// @Function: Get array Airports
// @Input: no
// @Outpt: array object Airport/ null if get fail
// @Last modified day: 30/05/2021
async function getAirports() {

    try {
        const result = await QD6.find({}).lean();
        if(result.length === 0) throw "Get airports fail!"
        console.log("Get airports success!");
        return result[0].Airports;
    } catch (error) {
        console.log(error);
         return null;
    }
    
}

// @Fucntion: Update all field in QD6
// @Input: object data contain field of QD6 need to update
// @Output: info update
// @Last modified day: 30/05/2021
async function updateAllField(data) {

    const newdata = {
      maxIntermediateAirport: data.maxIntermediateAirport,
      minFlightTime: data.minFlightTime,
      minStopTime: data.minStopTime,
      maxStopTime: data.maxStopTime,
      minTimeBookedTicket: data.minTimeBookedTicket,
      cancelTimeBookTicket: data.cancelTimeBookTicket
    };

    const updateAll = await QD6.updateMany(
        {},
        newdata,
        {new : true},
        (err) => {

            if(!err) console.log("Update successful!");

            else console.log("Update failed!");
        }
    )

    return updateAll
}

// @Fucntion: add new airport to array Airports
// @Input: object newData contain field of a airport
// @Output: info update
// @Last modified day: 30/05/2021
async function addNewAirport(newAirport) {

    try {
        const addNew = await QD6.updateMany({}, { $push: { Airports: newAirport }});

        console.log(addNew);
        return addNew;
    } catch (error) {

        console.log(error)
        return null
    }
    
}

// @Fucntion: update airport in array Airports
// @Input: object newData contain field of a airport need to update
// @Output: info update
// @Last modified day: 30/05/2021
async function updateAirport(data, id) {
    try {
        const update = await QD6.updateOne(
          { Airports: { $elemMatch: { _id: id } } },
          { $set: { "Airports.$": data } }
        );
        if (update.n === 0) throw "Update airport fail!";

        console.log("Update airport successfull");
        return update;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// @Fucntion: delete airport in array Airports
// @Input: airport name
// @Output: info delete/ null if delete fail
// @Last modified day: 30/05/2021
async function deleteAirport(airportName) {
      try {
        const check = await LichCB.find({
            $or: [
              { SanBayTG: { $elemMatch: { TenSB: airportName } } },
              { SanBayDi: airportName },
              { SanBayDen: airportName },
            ],
        });
        if (check.length === 0) {
            const update = await QD6.updateOne(
              {
                Airports: { $elemMatch: { airportName } },
              },
              { $pull: { Airports: { airportName } } }
            );
            if (update.n === 0) throw "Delete airport fail!";
            console.log("Delete airport successfull");
            return update;
        } else
            throw "This airport exists in orther flight schedules. Can't delete!!";
      } catch (error) {
        console.log(error);
        return null;
    }
}

// @Fucntion: check airport exists in LichCB
// @Input: airport name
// @Output: true/false
// @Last modified day: 19/06/2021
async function checkAirport(airportName) {

      try {
        const check = await LichCB.find({
            $or: [
              { SanBayTG: { $elemMatch: { TenSB: airportName } } },
              { SanBayDi: airportName },
              { SanBayDen: airportName },
            ],
        });
        if(check.length === 0 ) return true;
        else throw "Can't delete!";
      } catch (error) {
        return false;
    }
}
module.exports = {
  getOne,
  updateAllField,
  addNewAirport,
  updateAirport,
  deleteAirport,
  getAirports,
  checkAirport
};