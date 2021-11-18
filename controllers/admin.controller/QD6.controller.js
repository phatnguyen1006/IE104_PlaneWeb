const flightSchedules = require("../../services/flightSchedules.service");
const QD6service = require("../../services/QD6.service");
const HangVe = require("../../services/flightTickets.service/hangVe.service");
const { mongo } = require("mongoose");

//Function: Get QD6 data from database and transfer it to FE
//Input: nothing
//Output: Render the view QD6 with data(flights, ticket's class,...)
module.exports.getQD6 = async (req, res) => {
  const flights = await flightSchedules.getAllScheduleFlight();
  const hangVe = await HangVe.getAllTypeTicket();
  const getQD6 = await QD6service.getOne();

  for (var i = 0; i < getQD6.Airports.length; i++) {
    if (await QD6service.checkAirport(getQD6.Airports[i].airportName)) {
      getQD6.Airports[i].TrangThai = 1;
    } else {
      getQD6.Airports[i].TrangThai = 0;
    }
  }

  //console.log(getQD6.Airports);
  //const Airports = getQD6.Airports;
  if (req.session.notify) {
    var notify = req.session.notify;
    delete req.session.notify;

    res.render("settingQD6", {
      flights: flights,
      hangVe: hangVe,
      QD6: getQD6,
      notify: notify,
      csrf: req.csrfToken(),
    });
  } else {
    res.render("settingQD6", {
      flights: flights,
      hangVe: hangVe,
      QD6: getQD6,
      csrf: req.csrfToken(),
    });
  }
};

//Function: get expire days' values from database and transfer it to FE
//Input: nothing
//Output: render defaultDay view with data
module.exports.getDefaultDay = async (req, res) => {
  const getQD6 = await QD6service.getOne();
  if (req.session.notify) {
    var notify = req.session.notify;
    delete req.session.notify;

    res.render("defaultDay", {
      QD6: getQD6,
      notify: notify,
      csrf: req.csrfToken(),
    });
  } else {
    res.render("defaultDay", {
      QD6: getQD6,
      csrf: req.csrfToken(),
    });
  }
};

//Function: get data from defaultDay from FE and make change to database
//Input: values of expire day
//Output: result whether the change is success or not
module.exports.postDefaultDay = async (req, res) => {
  var data = {
    maxIntermediateAirport: req.body.maxIntermediateAirport,
    minFlightTime: req.body.minFlightTime,
    minStopTime: req.body.minStopTime,
    maxStopTime: req.body.maxStopTime,
    minTimeBookedTicket: req.body.minTimeBookedTicket,
    cancelTimeBookTicket: req.body.cancelTimeBookTicket,
  };

  var updateQD6 = await QD6service.updateAllField(data);
  //console.log(JSON.parse(req.body.array));

  if (!updateQD6) {
    req.session.notify = "Thay đổi giá trị thất bại";
  } else {
    req.session.notify = "Thay đổi giá trị thành công";
  }

  res.redirect("/settingQD6/defaultDay");
};

//Function: Add new airport
//Input: new airport's data including airport's code, airport's name and city of the airport
//Output:  save new airport to database
module.exports.postAddAirport = async (req, res) => {
  var airport = {
    airportCode: req.body.airportCode,
    airportName: capitalizeFirstLetter(req.body.airportName),
    city: req.body.city,
    country: req.body.country,
  };
  req.session.airport = airport;

  const newAP = await QD6service.addNewAirport(airport);

  if (!newAP) {
    req.session.notify = "Thêm sân bay thất bại";
  } else {
    req.session.notify = "Thêm sân bay thành công";
  }

  res.redirect("/settingQD6");
};

//Function: delete one airport in database
//Input: airport's name
//Output: result whether the delete result is success or not
module.exports.postDeleteAirport = async (req, res) => {
  var airportName = req.body.airportName;
  //console.log(airportName);
  const deleteAirport = await QD6service.deleteAirport(airportName);

  if (!deleteAirport) {
    req.session.notify =
      "Xoá sân bay thất bại. Sân bay này đã tồn tại trong danh sách chuyến bay rồi!";
  } else {
    req.session.notify = "Xoá sân bay thành công";
  }

  res.redirect("/settingQD6");
};

//Function: change airport info
//Input: airportCode and new data
//Output: result of changing airport's data
module.exports.postUpdateAirport = async (req, res) => {
  var id = req.body._id;
  var data = {
    airportCode: req.body.airportCode,
    airportName: capitalizeFirstLetter(req.body.airportName),
    city: req.body.city,
    country: req.body.country,
  };

  const updateAirport = QD6service.updateAirport(data, id);

  if (!updateAirport) {
    req.session.notify = "Cập nhật sân bay thất bại";
  } else {
    req.session.notify = "Cập nhật sân bay thành công";
  }

  res.redirect("/settingQD6");
};

/*module.exports.postSLHG = async (req, res) => {
    var flightCode = req.body.MaCB;
    var SLGH1 = req.body.SLGH1;
    var SLGH2 = req.body.SLGH2;
    flightSchedules.changeTicketTypeOne(flightCode, SLGH1);
    flightSchedules.changeTicketTypeTwo(flightCode, SLGH2);
    res.redirect('/settingQD6');
}*/

//Function: get ticket's class data from database to show it on FE
//Input: nothing
//Output: render ticket class view with data of ticket class from database
module.exports.getTicketClass = async (req, res) => {
  var hangVe = await HangVe.getAllTypeTicket();

  for (var i = 0; i < hangVe.length; i++) {
    if (await HangVe.checkTypeTicket(hangVe[i].maHangVe)) {
      hangVe[i].TrangThai = 1;
    } else {
      hangVe[i].TrangThai = 0;
    }
  }

  // console.log(hangVe);

  if (req.session.notify) {
    var notify = req.session.notify;
    delete req.session.notify;

    res.render("ticketClass", {
      hangVe: hangVe,
      notify: notify,
      csrf: req.csrfToken(),
    });
  } else {
    res.render("ticketClass", {
      hangVe: hangVe,
      csrf: req.csrfToken(),
    });
  }
};

//Function: add new ticket class
//Input: ticket class info: name, code and proportion
//Output:  result of adding new class
module.exports.postAddHV = async (req, res) => {
  var newHangVe = {
    maHangVe: req.body.maHangVe,
    tenHangVe: req.body.tenHangVe,
    tiLeTien: req.body.tiLeTien,
  };

  const newHV = await HangVe.addNewTypeTicket(newHangVe);

  if (!newHV) {
    req.session.notify = "Thêm hạng vé thất bại";
  } else {
    req.session.notify = "Thêm hạng vé thành công";
  }

  res.redirect("/settingQD6/ticketClass");
};

//Function: change one class value
//Input: class's id
//Output:  result of changing one class
module.exports.postChangeHV = async (req, res) => {
  var id = req.body.idHV;
  var dataHV = {
    tenHangVe: req.body.tenHangVe,
    tiLeTien: req.body.tiLeTien,
  };

  const changeHV = await HangVe.updateTypeTicket(id, dataHV);

  if (!changeHV) {
    req.session.notify = "Thay đổi hạng vé thất bại";
  } else {
    req.session.notify = "Thay đổi hạng vé thành công";
  }

  res.redirect("/settingQD6/ticketClass");
};

//Function: delete one ticket class
//Input: ticket class id
//Output:  result of deleting one ticket class
module.exports.postDeleteHV = async (req, res) => {
  var maHangVe = req.body.maHangVe;

  const deleteHV = await HangVe.deleteTypeTicket(maHangVe);

  if (!deleteHV) {
    req.session.notify =
      "Xoá hạng vé thất bại. Hạng vé này đã tồn tại trong danh sách lịch chuyến bay rồi!";
  } else {
    req.session.notify = "Xoá hạng vé thành công";
  }

  res.redirect("/settingQD6/ticketClass");
};

//Function: get data of flights' schedules from database and transfer it to FE
//Input: nothing
//Output:  render flightSchedule view with flights, ticket class, default days,...
module.exports.getFLightSchedule = async (req, res) => {
  // const flights = await flightSchedules.getFlightSchedulesByPage(page);
  const hangVe = await HangVe.getAllTypeTicket();
  const getQD6 = await QD6service.getOne();
  var addDate = false;

  if (req.session.notify && req.session.flightSchedule && req.session.check) {
    var notify = req.session.notify;
    var newFlight = req.session.flightSchedule;
    var myDate = new Date(newFlight.NgayGio);
    var myDate_1 = new Date(newFlight.NgayGio);
    var hour_depart = newFlight.GioKhoiHanh;
    var minute_depart = parseInt((hour_depart - parseInt(hour_depart)) * 60);
    hour_depart = parseInt(newFlight.GioKhoiHanh);
    var hour_arrival = newFlight.GioDen;
    var minute_arrival = parseInt((hour_arrival - parseInt(hour_arrival)) * 60);
    hour_arrival = parseInt(newFlight.GioDen);
    for (var i = 0; i < parseInt(newFlight.SanBayTG.length); i++) {
      minute_arrival = minute_arrival + parseInt(newFlight.SanBayTG[i].TGDung);
    }
    if (minute_arrival >= 60) {
      minute_arrival = minute_arrival - 60;
      hour_arrival += 1;

      if (hour_arrival == 24) {
        hour_arrival = 0;
        addDate = true;
      }
    }

    if (req.session.check == "true") {
      if (addDate === true) {
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          date.setUTCDate(date.getDate() + 2);

          return date;
        };
      } else {
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          date.setUTCDate(date.getDate() + 1);
          return date;
        };
      }
      myDate_1 = myDate_1.addDays();
    } else {
      //console.log(addDate);
      if (addDate === true) {
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          date.setUTCDate(date.getDate() + 1);

          return date;
        };
      } else {
        //console.log("2");
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          return date;
        };
      }
      myDate_1 = myDate_1.addDays();
    }
    delete req.session.notify;
    delete req.session.flightSchedule;

    res.render("flightSchedule", {
      hangVe: hangVe,
      QD6: getQD6,
      notify: notify,
      newFlight: newFlight,
      hour_depart: hour_depart,
      minute_depart: minute_depart,
      hour_arrival: hour_arrival,
      minute_arrival: minute_arrival,
      myDate: myDate,
      myDate_1: myDate_1,
      csrf: req.csrfToken(),
    });
  } else {
    res.render("flightSchedule", {
      hangVe: hangVe,
      QD6: getQD6,
      csrf: req.csrfToken(),
    });
  }
};

//Function: add new flight schedule
//Input: flight schedule data: journey, schedule's code, cost, arrival and depart airport-time, data, flight time,...
//Output:  adding new flight schedule
module.exports.postAddFlightSchedule = async (req, res) => {
  var depart = req.body.departureCity;
  var arrive = req.body.arrivalCity;
  var journey = depart + "-" + arrive;
  var date = req.body.NgayGio;
  var check = req.body.check;
  var flightSchedule = {
    MaCB: req.body.MaCB,
    ChuyenBay: journey,
    GiaVe: req.body.GiaVe,
    SanBayDi: req.body.SanBayDi,
    SanBayDen: req.body.SanBayDen,
    NgayGio: date,
    ThoiGianBay: req.body.ThoiGianBay,
    GioKhoiHanh: req.body.GioKhoiHanh,
    GioDen: req.body.GioDen,
    TSLG: req.body.TSLG,
    SanBayTG: req.body.SanBayTG ? JSON.parse(req.body.SanBayTG) : "",
    DSHangVe: JSON.parse(req.body.DSHangVe),
  };

  //console.log(flightSchedule);
  const newSchedule = await flightSchedules.addScheduleFlight(flightSchedule);

  if (!newSchedule) {
    req.session.notify = "Thêm lịch chuyến bay thất bại";
  } else {
    req.session.notify = "Thêm lịch chuyến bay thành công";
    req.session.flightSchedule = flightSchedule;
    req.session.check = check;
  }

  res.redirect("/settingQD6/flightSchedule");
};

//Function: reset all expire day values
//Input: nothing
//Output:  result of reseting values
module.exports.postReset = async (req, res) => {
  var data = {
    maxIntermediateAirport: null,
    minFlightTime: null,
    minStopTime: null,
    maxStopTime: null,
    minTimeBookedTicket: null,
    cancelTimeBookTicket: null,
  };

  const reset = await QD6service.updateAllField(data);

  if (reset) {
    req.session.notify = "Khôi phục tất cả giá trị ban đầu thành công";
  } else {
    req.session.notify = "Khôi phục tất cả giá trị ban đầu thất bại";
  }

  res.redirect("/settingQD6/defaultDay");
};

module.exports.getFlightManagement = async (req, res) => {
  var page = req.query.page;
  if (!page || page <= 0) {
    page = 1;
  }

  var flights = await flightSchedules.getFlightSchedulesByPage(page);
  const flightsNextPage = await flightSchedules.getFlightSchedulesByPage(
    page + 1
  );
  // console.log(flights[0]);
  // console.log(flights[0].TSLG);
  var arrSanBayTG = [];

  for (var flight of flights) {
    var middleAirport = "";
    // console.log(flight.SanBayTG);
    // if (flight.SanBayTG.length == 2) {
    //     middleAirport = flight.SanBayTG[0].TenSB.replace('Quốc tế', "QT") + " - "
    //     + flight.SanBayTG[1]?.TenSB.replace('Quốc tế', "QT");
    // } else if (flight.SanBayTG.length == 1) {
    //     middleAirport = flight.SanBayTG[0]?.TenSB.replace('Quốc tế', "QT");
    // } else {
    //     middleAirport = "";
    // }
    if (flight.SanBayTG) {
      flight.SanBayTG.forEach((sb, index) => {
        if (index == flight.SanBayTG.length - 1) {
          if (sb.TenSB != "undefined" && sb.TenSB != null) {
            middleAirport += sb.TenSB.replace("Quốc tế", "QT");
          }
        } else {
          middleAirport += sb.TenSB.replace("Quốc tế", "QT") + " - ";
        }
      });
    }

    arrSanBayTG.push(middleAirport);

    for (hangVe in flight.DSHangVe) {
      if (hangVe.SGDaMua != 0) {
        flight.DuocXoa = 0;
        break;
      }

      flight.DuocXoa = 1;
    }
  }

  let allPages = await flightSchedules.getNumberOfSchedulesFlights();

  var isNextPage = true;

  if (flightsNextPage.length == 0) {
    isNextPage = false;
  }

  let notify = req.session.notify;
  delete req.session.notify;

  if (req.session.notify) {
    res.render("flightManagement", {
      flights: flights,
      isNextPage: isNextPage,
      allPages: allPages,
      currentPage: page,
      arrSanBayTG: arrSanBayTG,
      notify: notify,
      csrf: req.csrfToken(),
    });
  } else {
    res.render("flightManagement", {
      flights: flights,
      isNextPage: isNextPage,
      currentPage: page,
      arrSanBayTG: arrSanBayTG,
      allPages: allPages,
      csrf: req.csrfToken(),
    });
  }
};

module.exports.deleteFlightSchedule = async (req, res) => {
  const MaCB = req.body.MaCB;

  const result = await flightSchedules.deleteScheduleFlightFlightCode(MaCB);

  if (result) {
    console.log("Deleted flight schedule successfully");
    req.session.notify = "Xoá chuyến bay thành công";
    res.redirect("/settingQD6/flightManagement");
  } else {
    console.log("Deleted flight schedule failed");
    req.session.notify = "Xoá chuyến bay thất bại";
    res.redirect("/settingQD6/flightManagement");
  }
};

module.exports.getUpdateFlightSchedule = async (req, res) => {
  // Tất cả hạng vé
  const ticketClasses = await HangVe.getAllTypeTicket();
  // Tất cả sân bay
  const airports = await QD6service.getAirports();
  const getQD6 = await QD6service.getOne();
  var addDate = false;

  // Dữ liệu về chuyến bay
  const flightCode = req.query.MaCB;
  const flight = await flightSchedules.getOneScheduleFlightByMaCB(flightCode);
  console.log(flight.ChuyenBay.split("-"));

  if (req.session.notify && req.session.flightSchedule && req.session.check) {
    var notify = req.session.notify;
    var newFlight = req.session.flightSchedule;
    var myDate = new Date(newFlight.NgayGio);
    var myDate_1 = new Date(newFlight.NgayGio);
    var hour_depart = newFlight.GioKhoiHanh;
    var minute_depart = parseInt((hour_depart - parseInt(hour_depart)) * 60);
    hour_depart = parseInt(newFlight.GioKhoiHanh);
    var hour_arrival = newFlight.GioDen;
    var minute_arrival = parseInt((hour_arrival - parseInt(hour_arrival)) * 60);
    hour_arrival = parseInt(newFlight.GioDen);
    for (var i = 0; i < parseInt(newFlight.SanBayTG.length); i++) {
      minute_arrival = minute_arrival + parseInt(newFlight.SanBayTG[i].TGDung);
    }
    if (minute_arrival >= 60) {
      minute_arrival = minute_arrival - 60;
      hour_arrival += 1;

      if (hour_arrival == 24) {
        hour_arrival = 0;
        addDate = true;
      }
    }

    if (req.session.check == "true") {
      if (addDate === true) {
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          date.setUTCDate(date.getDate() + 2);

          return date;
        };
      } else {
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          date.setUTCDate(date.getDate() + 1);
          return date;
        };
      }
      myDate_1 = myDate_1.addDays();
    } else {
      //console.log(addDate);
      if (addDate === true) {
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          date.setUTCDate(date.getDate() + 1);

          return console.log(date);
        };
      } else {
        //console.log("2");
        Date.prototype.addDays = function () {
          var date = new Date(newFlight.NgayGio);
          return date;
        };
      }
      myDate_1 = myDate_1.addDays();
    }
    delete req.session.notify;
    delete req.session.flightSchedule;

    res.render("updateFlightSchedule", {
      count: 0,
      hangveIndex: 0,
      hangVe: ticketClasses,
      airports: airports,
      flight: flight,
      QD6: getQD6,
      notify: notify,
      newFlight: newFlight,
      hour_depart: hour_depart,
      minute_depart: minute_depart,
      hour_arrival: hour_arrival,
      minute_arrival: minute_arrival,
      myDate: myDate,
      myDate_1: myDate_1,
      csrf: req.csrfToken(),
    });
  } else {
    res.render("updateFlightSchedule", {
      count: 0,
      hangveIndex: 0,
      hangVe: ticketClasses,
      airports: airports,
      flight: flight,
      QD6: getQD6,
      csrf: req.csrfToken(),
    });
  }
};

module.exports.postUpdateFlightSchedule = async (req, res) => {
  const id = req.body._id;
  const GioKhoiHanh = req.body.GioKhoiHanh;
  const GioDen = req.body.GioDen;
  let ThoiGianBay = 0;

  if (GioKhoiHanh < GioDen) {
    ThoiGianBay = GioDen - GioKhoiHanh;
  } else if (GioKhoiHanh > GioDen) {
    ThoiGianBay = 24 - GioKhoiHanh + GioDen;
  }

  const data = {
    GiaVe: req.body.GiaVe,
    GioKhoiHanh: GioKhoiHanh,
    GioDen: GioDen,
    ThoiGianBay: ThoiGianBay,
    DSHangVe: JSON.parse(req.body.DSHangVe),
    SanBayTG: JSON.parse(req.body.SanBayTG),
  };

  const updateResult = await flightSchedules.updateScheduleFlight(id, data);

  if (updateResult) {
    console.log("Update flight schedule successfully");
    req.session.notify = "Cập nhật chuyến bay thành công";
    res.redirect("/settingQD6/flightManagement");
  } else {
    console.log("Update flight schedule failed");
    req.session.notify = "Cập nhật chuyến bay thất bại";
    res.redirect("/settingQD6/flightManagement");
  }
};

function capitalizeFirstLetter(city) {
  const arrWords = city.toLowerCase().trim().split(" ");

  for (var i = 0; i < arrWords.length; i++) {
    arrWords[i] = arrWords[i].charAt(0).toUpperCase() + arrWords[i].slice(1);
    if (arrWords[i] == "Tế" && i == 1) {
      arrWords[i] = arrWords[i].toLowerCase();
    }
  }

  const result = arrWords.join(" ");
  return result;
}
