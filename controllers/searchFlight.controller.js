const takeListFlight = require("../services/flightSchedules.service");
const time = require("../services/QD6.service");

//Function: find flights
//Input: journey, depart and arrive airport, |||||||| Truyền vào biến dateReturn
//Output:  render searchFlight view with found flights
module.exports.postTicket = async (req, res) => {
  var journey = req.query.departureAirport + "-" + req.query.arrivalAirport;
  var depart = req.query.departureAirport;
  var arrival = req.query.arrivalAirport;
  const flight = {
    NgayGio: req.query.date,
    ChuyenBay: journey,
  };

  var date = new Date();
  var timeArr = await time.getOne();
  var day = timeArr.minTimeBookedTicket;

  var flights = await takeListFlight.findFlightSchedules(flight);

  for (let i = 0; i < flights.length; i++) {
    if (flights[i].NgayGio - date > day * 86400000) {
      flights[i].DuocMua = 1;
    } else {
      flights[i].DuocMua = 0;
    }
  }

  // Vé khứ hồi
  if (req.query.dateReturn) {
    var journeyReturn =
      req.query.arrivalAirport + "-" + req.query.departureAirport;

    const flightReturn = {
      NgayGio: req.query.dateReturn,
      ChuyenBay: journeyReturn,
    };

    var flightsReturn = await takeListFlight.findFlightSchedules(flightReturn);

    for (let i = 0; i < flightsReturn.length; i++) {
      if (flightsReturn[i].NgayGio - date > day * 86400000) {
        flightsReturn[i].DuocMua = 1;
      } else {
        flightsReturn[i].DuocMua = 0;
      }
    }

    // Chuyến bay đi
    var arrayDate = [];
    var arrayDate1 = [];
    var arrayHour_depart = [];
    var arrayHour_arrival = [];
    var arrayHour_TGB = [];
    var arrayMinute_depart = [];
    var arrayMinute_arrival = [];
    var arrayMinute_TGB = [];

    // Chuyến bay về
    var arrayDateReturn = [];
    var arrayDate1Return = []; //arrayDate1Return arrayDate1Return
    var arrayHour_departReturn = [];
    var arrayHour_arrivalReturn = [];
    var arrayHour_TGBReturn = [];
    var arrayMinute_departReturn = [];
    var arrayMinute_arrivalReturn = [];
    var arrayMinute_TGBReturn = [];

    if (flightsReturn.length == 0) {
      req.session.notify =
        "Không tìm thấy chuyến bay về.! Vui lòng chọn chuyến bay khác!!";
      res.redirect("/booking");
      return;
    }

    if (flights.length == 0) {
      req.session.notify =
        "Không tìm thấy chuyến bay đi.! Vui lòng chọn chuyến bay khác!!";
      res.redirect("/booking");
    }

    // Chuyến bay đi
    for (let i = 0; i < flights.length; i++) {
      var ktra = false;
      var addDate = false;
      if (flights[i].GioKhoiHanh >= flights[i].GioDen) {
        ktra = true;
      } else {
        ktra = false;
      }
      var TGB = flights[i].ThoiGianBay;
      var minute_TGB = parseInt((TGB - parseInt(TGB)) * 60);

      TGB = parseInt(flights[i].ThoiGianBay);

      var myDate = new Date(flights[i].NgayGio);
      arrayDate.push(myDate);

      var myDate_1 = new Date(flights[i].NgayGio);
      var hour_depart = flights[i].GioKhoiHanh;
      var minute_depart = parseInt((hour_depart - parseInt(hour_depart)) * 60);

      arrayMinute_depart.push(minute_depart);
      hour_depart = parseInt(flights[i].GioKhoiHanh);
      arrayHour_depart.push(hour_depart);

      var hour_arrival = flights[i].GioDen;
      var minute_arrival = parseInt(
        (hour_arrival - parseInt(hour_arrival)) * 60
      );

      hour_arrival = parseInt(flights[i].GioDen);

      if (flights[i].SanBayTG.leng > 0) {
        for (var j = 0; j < flights[i].SanBayTG.length; j++) {
          minute_arrival =
            parseInt(minute_arrival) + parseInt(flights[i].SanBayTG[j].TGDung);
          minute_TGB += parseInt(flights[i].SanBayTG[j].TGDung);
        }
      }

      if (minute_arrival >= 60) {
        minute_arrival = parseInt(minute_arrival) - 60;
        hour_arrival += 1;

        if (hour_arrival == 24) {
          hour_arrival = 0;
          addDate = true;
        }
      }

      if (minute_TGB >= 60) {
        minute_arrival = parseInt(minute_arrival) - 60;
        TGB += 1;
      }

      arrayHour_TGB.push(TGB);
      arrayMinute_TGB.push(minute_TGB);
      arrayHour_arrivalReturn.push(hour_arrival);
      arrayMinute_arrival.push(minute_arrival);

      if (ktra === true) {
        if (addDate === true) {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            date.setUTCDate(date.getDate() + 2);
            return date;
          };
        } else {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            date.setUTCDate(date.getDate() + 1);
            return date;
          };
        }
        myDate_1 = myDate_1.addDays();
        arrayDate1.push(myDate_1);
      } else {
        if (addDate === true) {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            date.setUTCDate(date.getDate() + 1);
            return date;
          };
        } else {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            return date;
          };
        }
        myDate_1 = myDate_1.addDays();
        arrayDate1.push(myDate_1);
      }
    }
    //console.log("in ra date1", arrayDate1);

    arrayDate[0] = formatDate(arrayDate[0]);
    //console.log("in ra date", arrayDate[0]);

    // Chuyến bay về
    for (let i = 0; i < flightsReturn.length; i++) {
      var ktra = false;
      var addDate = false;
      if (flightsReturn[i].GioKhoiHanh >= flightsReturn[i].GioDen) {
        ktra = true;
      } else {
        ktra = false;
      }
      var TGB = flightsReturn[i].ThoiGianBay;
      var minute_TGB = parseInt((TGB - parseInt(TGB)) * 60);

      TGB = parseInt(flightsReturn[i].ThoiGianBay);

      var myDate = new Date(flightsReturn[i].NgayGio);
      arrayDateReturn.push(myDate);

      var myDate_1Return = new Date(flightsReturn[i].NgayGio);
      var hour_depart = flightsReturn[i].GioKhoiHanh;
      var minute_depart = parseInt((hour_depart - parseInt(hour_depart)) * 60);

      arrayMinute_departReturn.push(minute_depart);
      hour_depart = parseInt(flightsReturn[i].GioKhoiHanh);
      arrayHour_departReturn.push(hour_depart);

      var hour_arrival = flightsReturn[i].GioDen;
      var minute_arrival = parseInt(
        (hour_arrival - parseInt(hour_arrival)) * 60
      );

      hour_arrival = parseInt(flightsReturn[i].GioDen);

      if (flightsReturn[i].SanBayTG.leng > 0) {
        for (var j = 0; j < flightsReturn[i].SanBayTG.length; j++) {
          minute_arrival =
            parseInt(minute_arrival) +
            parseInt(flightsReturn[i].SanBayTG[j].TGDung);
          minute_TGB += parseInt(flightsReturn[i].SanBayTG[j].TGDung);
        }
      }

      if (minute_arrival >= 60) {
        minute_arrival = parseInt(minute_arrival) - 60;
        hour_arrival += 1;

        if (hour_arrival == 24) {
          hour_arrival = 0;
          addDate = true;
        }
      }

      if (minute_TGB >= 60) {
        minute_arrival = parseInt(minute_arrival) - 60;
        TGB += 1;
      }

      arrayHour_TGBReturn.push(TGB);
      arrayMinute_TGBReturn.push(minute_TGB);
      arrayHour_arrivalReturn.push(hour_arrival);
      arrayMinute_arrivalReturn.push(minute_arrival);

      if (ktra === true) {
        if (addDate === true) {
          Date.prototype.addDays = function () {
            var date = new Date(flightsReturn[i].NgayGio);
            date.setUTCDate(date.getDate() + 2);
            return date;
          };
        } else {
          Date.prototype.addDays = function () {
            var date = new Date(flightsReturn[i].NgayGio);
            date.setUTCDate(date.getDate() + 1);
            return date;
          };
        }
        myDate_1Return = myDate_1Return.addDays();
        arrayDate1Return.push(myDate_1Return);
      } else {
        if (addDate === true) {
          Date.prototype.addDays = function () {
            var date = new Date(flightsReturn[i].NgayGio);
            date.setUTCDate(date.getDate() + 1);
            return date;
          };
        } else {
          Date.prototype.addDays = function () {
            var date = new Date(flightsReturn[i].NgayGio);
            return date;
          };
        }
        myDate_1Return = myDate_1Return.addDays();
        arrayDate1Return.push(myDate_1Return);
      }
    }
    // console.log(flightsReturn);

    res.render("searchFlight", {
      flights: flights,
      Sanbaydi: depart,
      Sanbayden: arrival,

      // Chuyến bay đi
      hour_depart: arrayHour_depart,
      hour_arrival: arrayHour_arrival,
      minute_arrival: arrayMinute_arrival,
      minute_depart: arrayMinute_depart,
      myDate: arrayDate,
      myDate_1: arrayDate1,
      TGB: arrayHour_TGB,
      minute_TGB: arrayMinute_TGB,

      // Chuyến bay về
      flightsReturn: flightsReturn,
      hour_departReturn: arrayHour_departReturn,
      hour_arrivalReturn: arrayHour_arrivalReturn,
      minute_arrivalReturn: arrayMinute_arrivalReturn,
      minute_departReturn: arrayMinute_departReturn,
      myDateReturn: arrayDateReturn,
      myDate_1Return: arrayDate1Return,
      TGBReturn: arrayHour_TGBReturn,
      minute_TGBReturn: arrayMinute_TGBReturn,

      csrf: req.csrfToken(),
    });

    // Vé một chiều
  } else {
    var arrayDate = [];
    var arrayDate1 = [];
    var arrayHour_depart = [];
    var arrayHour_arrival = [];
    var arrayHour_TGB = [];
    var arrayMinute_depart = [];
    var arrayMinute_arrival = [];
    var arrayMinute_TGB = [];

    if (flights.length == 0) {
      req.session.notify =
        "Không tìm thấy chuyến bay.! Vui lòng chọn chuyến bay khác!!";
      res.redirect("/booking");
      return;
    }

    for (let i = 0; i < flights.length; i++) {
      var ktra = false;
      var addDate = false;
      if (flights[i].GioKhoiHanh >= flights[i].GioDen) {
        ktra = true;
      } else {
        ktra = false;
      }
      var TGB = flights[i].ThoiGianBay;
      var minute_TGB = parseInt((TGB - parseInt(TGB)) * 60);

      TGB = parseInt(flights[i].ThoiGianBay);

      var myDate = new Date(flights[i].NgayGio);
      arrayDate.push(myDate);

      var myDate_1 = new Date(flights[i].NgayGio);
      var hour_depart = flights[i].GioKhoiHanh;
      var minute_depart = parseInt((hour_depart - parseInt(hour_depart)) * 60);

      arrayMinute_depart.push(minute_depart);
      hour_depart = parseInt(flights[i].GioKhoiHanh);
      arrayHour_depart.push(hour_depart);

      var hour_arrival = flights[i].GioDen;
      var minute_arrival = parseInt(
        (hour_arrival - parseInt(hour_arrival)) * 60
      );

      hour_arrival = parseInt(flights[i].GioDen);

      if (flights[i].SanBayTG.leng > 0) {
        for (var j = 0; j < flights[i].SanBayTG.length; j++) {
          minute_arrival =
            parseInt(minute_arrival) + parseInt(flights[i].SanBayTG[j].TGDung);
          minute_TGB += parseInt(flights[i].SanBayTG[j].TGDung);
        }
      }

      if (minute_arrival >= 60) {
        minute_arrival = parseInt(minute_arrival) - 60;
        hour_arrival += 1;

        if (hour_arrival == 24) {
          hour_arrival = 0;
          addDate = true;
        }
      }

      if (minute_TGB >= 60) {
        minute_arrival = parseInt(minute_arrival) - 60;
        TGB += 1;
      }

      arrayHour_TGB.push(TGB);
      arrayMinute_TGB.push(minute_TGB);
      arrayHour_arrival.push(hour_arrival);
      arrayMinute_arrival.push(minute_arrival);

      if (ktra === true) {
        if (addDate === true) {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            date.setUTCDate(date.getDate() + 2);
            return date;
          };
        } else {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            date.setUTCDate(date.getDate() + 1);
            return date;
          };
        }
        myDate_1 = myDate_1.addDays();
        arrayDate1.push(myDate_1);
      } else {
        if (addDate === true) {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            date.setUTCDate(date.getDate() + 1);
            return date;
          };
        } else {
          Date.prototype.addDays = function () {
            var date = new Date(flights[i].NgayGio);
            return date;
          };
        }
        myDate_1 = myDate_1.addDays();
        arrayDate1.push(myDate_1);
      }
    }

    //console.log("in ra date1", arrayDate1);

    arrayDate[0] = formatDate(arrayDate[0]);
    //console.log("in ra date", arrayDate[0]);

    res.render("searchFlight", {
      flights: flights,
      Sanbaydi: depart,
      Sanbayden: arrival,
      hour_depart: arrayHour_depart,
      hour_arrival: arrayHour_arrival,
      minute_arrival: arrayMinute_arrival,
      minute_depart: arrayMinute_depart,
      myDate: arrayDate,
      myDate_1: arrayDate1,
      TGB: arrayHour_TGB,
      minute_TGB: arrayMinute_TGB,
      csrf: req.csrfToken(),
    });
  }
};

function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();

  //console.log(`${month + 1}/${day}/${year}`);
  var newDate = `${month + 1}/${day}/${year}`;

  return new Date(newDate);
}
