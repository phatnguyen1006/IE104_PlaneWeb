
const DTChuyenBay = require('../../models/revenue/DTChuyenBay.model');
const { LichCB } = require('../../models/flightSchedules.model');
const { findOne } = require('../../models/revenue/DTChuyenBay.model');
const { findTypeTicket } = require('../../services/flightTickets.service/hangVe.service');

//      MONTHLY REVENUE
// data = {
//     month: 1 -> 12,
//     year: 20.. ,
// }
//
// Function: ReportMonthlyRevenue
// Input: data
// Output: A list of LichCB.DSChuyenBay
// Last Modified: 8/6/2020

async function ReportMonthlyRevenue(data) {
    const flightsData = await LichCB.find({
        $expr: {
            $and: [
                { $eq: [{ $month: "$NgayGio" }, data.month] },
                { $eq: [{ $year: "$NgayGio" }, data.year] }
            ]
        }
    });

    let TotalMonthRevenue = 0.0;
    let report = await flightsData.map(async (flight) => {
        let total = 0.0;        // money
        let ticketsSold = 0;    // tickets

        let ratio = 0.0;        // TiLe

        const HangVe = await findTypeTicket(flight.DSHangVe);

        // seat types sold
        flight.DSHangVe.forEach((Ve, index) => {
            ticketsSold += Ve.SGDaMua;
            total += flight.GiaVe * Ve.SGDaMua * HangVe[index].tiLeTien;
            return;
        });
        // ratio = (Type1 + Type2) / (flight.SLGH1+flight.SLGH2);

        var objData = {
            MaCB: flight.MaCB,
            SoVe: ticketsSold,
            DoanhThu: total,
            TiLe: ratio
        };

        return objData;
    });
    
    return Promise.all(report).then((res) => res);
};

// data = {
//     month: 1 -> 12,
//     year: 20.. ,
//     flightsReport: [{
//         ChuyenBay,
//         SoVe,
//         DoanhThu,
//         TiLe,
//     }]
// }
//
// Function: AddFlightRevenue
// Input: data
// Output: Notify Success or Error
// Last Modified: 8/6/2020

async function AddFlightRevenue(data) {
    const checkFlightRevenue = await DTChuyenBay.exists({
        Thang: data.Thang,
        Nam: data.Nam
    })

    if (await checkFlightRevenue) {
        const flightRevenue = await DTChuyenBay.findOneAndUpdate({
            Thang: data.Thang,
            Nam: data.Nam
        },
            {
                DoanhThuThang: data.DoanhThuThang,
                DSChuyenBay: data.DSChuyenBay,
            },
            {
                useFindandModify: false,
            },
            err => {
                if (err) console.log(err);
                console.log("Updated Monthly Revenue successfully!!!");
            }
        );
        
        return flightRevenue;
    }

    // if not exist this Month in DTChuyenBay => create new
    const flightRevenue = new DTChuyenBay(data);

    await flightRevenue.save()
        .then(result => console.log("Create Month Report Successful!!!"))
        .catch(err => console.log(err));

    return Promise.all([checkFlightRevenue, flightRevenue]);
};


module.exports = {
    ReportMonthlyRevenue,
    AddFlightRevenue,
};