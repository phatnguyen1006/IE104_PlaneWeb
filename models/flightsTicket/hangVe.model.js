const mongoose = require("mongoose");


const HangVeSchema = new mongoose.Schema({

    maHangVe: {
        type: Number,
        required: true,
        unique: true,
        immutable: true
    },
    tenHangVe: {
        type: String,
        required: true,
        default: 1
    },
    tiLeTien: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
        default: 0,
    }
    
});

const HangVe = mongoose.model("HangVe", HangVeSchema, "HangVe");

module.exports = HangVe;
