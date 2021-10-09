const mongoose = require('mongoose');


// @Model danh cho bao cao doanh thu nam
const DTNamSchema = new mongoose.Schema({
  // Co the set min hoac max = nam hien tai
  // Problem: lay duoc year tu ve
  Nam: {
    type: Number,
    max: new Date().getFullYear(),
    required: true,
  },
  DoanhThuNam: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0,
  },
  // Problem: set ti le tu dong
  DanhSach: {
    type: [
      {
        Thang: {
          type: Number,
          min: 1,
          max: 12,
          required: true,
        },

        // Tong so chuyen bay trong 1 thang
        // Size cua DSChuyenBay
        SoCB: {
          type: Number,
          min: 0,
          required: true,
        },

        // Tong doanh thu theo thang
        DoanhThu: {
          type: mongoose.Types.Decimal128,
          required: true,
          min: 0,
        },
        TiLe: {
          type: mongoose.Types.Decimal128,
          required: true,
          min: 0,
        },
      },
    ],
    required: true,
  },
});

const DTNam = mongoose.model('DTNam',DTNamSchema,'DTNam');

module.exports = DTNam;