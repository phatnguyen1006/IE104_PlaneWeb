const mongoose = require('mongoose');


// model danh cho ve may bay da mua
const VeMBSchema = new mongoose.Schema(
  {
    ID: {
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true,
    },
    MaCB: {
        type: String,
        required: true,
        maxLenght: 10,
    },
    // vd: HN-DN
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
    GiaTien: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: 0,
    },
    HangVe: {
        type: Number,
        required: true,
    }
  
  },{ timestamps: true });

const VeMB = mongoose.model('VeMB',VeMBSchema,'VeMB');

module.exports = VeMB;
   