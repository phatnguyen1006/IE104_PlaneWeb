const mongoose = require('mongoose');


// @Model danh cho bao cao doanh thu theo cac chuyen bay
const DTChuyenBaySchema = new mongoose.Schema({
  // Problem: lay duoc thang tu ve
  Thang: {
    type: Number,
    min: 1,
    max: 12,
    required: true,
  },
  Nam: {
    type: Number,
    max: new Date().getFullYear(),
    required: true,
  },
  DoanhThuThang: {
    type: mongoose.Types.Decimal128,
    required: true,
    min: 0,
  },

  // Problem: set ti le tu dong
  DSChuyenBay: {
    type: [
      {
        // VD: HN-DN
        MaCB: {
          type: String,
          required: true,
        },

        // So ve cua 1 chuyen bay
        SoVe: {
          type: Number,
          min: 0,
          required: true,
        },

        // Tong tien ve cua 1 chuyen bay
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

const DTChuyenBay = mongoose.model('DTChuyenBay',DTChuyenBaySchema,'DTChuyenBay');

module.exports = DTChuyenBay;