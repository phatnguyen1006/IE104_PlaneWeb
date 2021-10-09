const mongoose = require('mongoose');


// @Model danh cho ve da dat
const PhieuDCSchema = new mongoose.Schema(
  {
    ID: {
      type: mongoose.Types.ObjectId,
      required: true,
      immutable: true,
    },
    TenHanhKhach: {
      type: String,
      //required: true,
    },
    MaCB: {
      type: String,
      required: true,
      maxLenght: 10,
    },
    // Vd: HN-DN
    ChuyenBay: {
      type: String,
      required: true,
      maxLenght: 30,
    },
    HanhKhach: {
      type: String,
    },
    CMND: {
      type: String,
      required: true,
      maxLenght: 9,
      minLenght: 9,
    },
    SDT: {
      type: String,
      required: true,
      maxLenght: 10,
      minLenght: 10,
    },
    HangVe: {
      type: Number,
      min: 0,
      required: true,
    },
    GiaTien: {
      type: mongoose.Types.Decimal128,
      required: true,
      min: 0,
    },
    TienCoc: {
      type: mongoose.Types.Decimal128,
      //required: true,
      min: 0,
    },
    NgayDatVe: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    TrangThai: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);



const PhieuDC = mongoose.model('PhieuDC',PhieuDCSchema,'PhieuDC');

module.exports = PhieuDC;
