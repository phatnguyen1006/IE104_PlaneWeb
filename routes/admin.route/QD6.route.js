var express = require("express");
var router = express.Router();

//controller
const controller = require("../../controllers/admin.controller/QD6.controller");

//validate
const validate = require("../../validate/QD6.validate");

//san bay
router.get("/", controller.getQD6);

router.post("/", controller.postAddAirport);

router.post("/deleteAirport", controller.postDeleteAirport);

router.post("/updateAirport", controller.postUpdateAirport);

router.get("/defaultDay", controller.getDefaultDay);

router.post("/defaultDay", controller.postDefaultDay);

//router.post('/changeSLGH', controller.postSLHG);

router.get("/ticketClass", controller.getTicketClass);

router.post("/addHV", validate.addHV, controller.postAddHV);

router.post("/changeHV", controller.postChangeHV);

router.post("/deleteHV", controller.postDeleteHV);

router.get("/flightManagement", controller.getFlightManagement);

router.get("/flightSchedule", controller.getFLightSchedule);

router.post(
  "/flightSchedule",
  validate.addFlightScheduleValidate,
  controller.postAddFlightSchedule
);

router.get("/updateFlightSchedule", controller.getUpdateFlightSchedule);

router.post("/updateFlightSchedule", controller.postUpdateFlightSchedule);

router.post("/reset", controller.postReset);

router.post("/deleteFlightSchedule", controller.deleteFlightSchedule);

module.exports = router;
