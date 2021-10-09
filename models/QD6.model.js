const mongoose = require('mongoose');

const QD6Schema = mongoose.Schema({
  Airports: {
    type: [
      {
        airportCode: {
          type: String,
          required: true,
          maxlength: 10,
          immutable: true,
        },
        airportName: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  maxIntermediateAirport: {
    type: Number,
    default: 2,
    set: (v) => {
      if (v === null || v === undefined) return 2;
      return v;
    },
    min: 0,
    required: true,
  },
  minFlightTime: {
    type: Number,
    default: 30,
    set: (v) => {
      if (v === null || v === undefined) return 30;
      return v;
    },
    min: 0,
    required: true,
  },
  minStopTime: {
    type: Number,
    default: 10,
    set: (v) => {
      if (v === null || v === undefined) return 10;
      return v;
    },
    min: 0,
    required: true,
  },
  maxStopTime: {
    type: Number,
    default: 20,
    set: (v) => {
      if (v === null || v === undefined) return 20;
      return v;
    },
    min: 0,
    required: true,
  },
  minTimeBookedTicket: {
    type: Number,
    default: 1,
    set: (v) => {
      if (v === null) return 1;
      return v;
    },
    min: 0,
    required: true,
  },
  cancelTimeBookTicket: {
    type: Number,
    default: 0,
    set: (v) => {
      if (v === null || v === undefined) return 0;
      return v;
    },
    min: 0,
    required: true,
  },
});

const QD6 = mongoose.model('QD6',QD6Schema,'QD6');

module.exports = QD6;
