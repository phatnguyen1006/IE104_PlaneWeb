const mongoose = require('mongoose');


    // @Model for flightSchedules
    const lichCBSchema = new mongoose.Schema({

        MaCB: {
            type: String,
            required: true,
            unique: true,
            maxLenght: 10
        },
        ChuyenBay: {
            type: String,
            required: true,
            maxLenght: 30
        },
        GiaVe: {
            type: mongoose.Types.Decimal128,
            required: true,
            min: 0
        },
        SanBayDi: {
            type: String,
            required: true,

        },
        SanBayDen: {
            type: String,
            required: true,
        },

        // @Problem : lấy ngay và giờ
        NgayGio: {
            type: Date,
            required: true,
            default: Date
        },

        // @Problem:  thay đổi dc thời gian bay tối thiểu ( min property)
            // userShema.add({test: {
            // type: Number,
            // set: tryGetter
            // min:-1
            // }});
            // => fix : ghi đè thuộc tính 
        ThoiGianBay: {

            type: Number,
            min: 0,
            max: 1440,
            required: true,
        },
        GioKhoiHanh: {
            
            type: Number,
            min: 0,
            required: true,
        },
        GioDen:{

            type: Number,
            min: 0,
            required: true,
        },
        TSLG: {
            type: Number,
            required: true,
            min: 0
        },

        // @Problem1: thay đổi số lượng sân bay trung gian   => đã fix
        // @Problem2: thay đổi thời gian dừng ở sân bay trung gian => đã fix
        // @Problem3: define array in mongoose => đã fix
        SanBayTG: {
            type: [{
                TenSB: {
                    type: String,
                    required: false
                },
                TGDung: {
                    type: Number,
                    required: false,
                    min: 0,
                }, 
                GhiChu: String,
            }],
            default: [{},{}],
        },
        DSHangVe:{
            type: [
                {
                    maHangVe: {         
                        type: Number,
                        required: true,
                        min: 0
                    },
                    SLG: {
                        type: Number,
                        required: true,
                        min: 0
                    },
                    SGDaMua: {
                        type: Number,
                        required: true,
                        min: 0,
                        default: 0
                    },
                    SGDat: {
                        type: Number,
                        required: true,
                        min: 0,
                        default: 0
                    },
                    SGTrong: {
                        type: Number,
                        required: true,
                        min: 0
                    }

                }
            ],
            required: true,
        },
    }, { timestamps: true });


    
    const LichCB = mongoose.model('LichCB',lichCBSchema,'lichCB');

    module.exports = {

        LichCB,
    };
    
    