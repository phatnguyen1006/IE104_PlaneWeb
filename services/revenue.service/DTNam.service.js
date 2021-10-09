
const DTNam = require('../../models/revenue/DTNam.model');
const DTChuyenBay = require('../../models/revenue/DTChuyenBay.model');

//      YEAR REVENUE
// data = {
//     year: 20.. ,
//     List: {
//         Thang: 1 -> 12,
//         ChuyenBay: HN-HCM,
//         DoanhThu: 2 000 000 (money),
//         TiLe: 0.9,
//     }
// }
//
// Function: ReportYearRevenue
// Input: data
// Output: A list of DTNam.DanhSach
// Last Modified: 8/6/2021

async function ReportYearRevenue(data) {
    const monthsData = await DTChuyenBay.find({
        Nam: data.year
    }).sort({Thang: 1});
    
    let DoanhThuNam = 0;
    const yearReports = await monthsData.map(monthData => {
        let Thang = monthData.Thang;
        let SoCB = monthData.DSChuyenBay.length;
        let DoanhThu = monthData.DoanhThuThang
        let TiLe = 0.0;

        monthData.DSChuyenBay.forEach(CB => {
            DoanhThuNam += CB.DoanhThu;
        });
        let objData = {
            Thang: Thang,
            SoCB: SoCB,
            DoanhThu: DoanhThu,
            TiLe: TiLe
        }

        return objData;
    });

    return Promise.all(yearReports);
}

// data = [{
//     Thang,
//     Nam,
//     DoanhThuThang,
//     DSChuyenBay: [{}]
// }]
//
// Funciton: AddYearRevenue
// Input: data
// Output: A notify Success or Error
// Last Modified: 8/6/2020

async function AddYearRevenue(data) {
    const checkYearRevenue = DTNam.exists({
        Nam: data.Nam
    });
    console.log(data);
    if (await checkYearRevenue) {
        // find And Update the Revenue
        const yearRevenue = await DTNam.findOneAndUpdate({
            Nam: data.Nam
        }, {
            DanhSach: data.DanhSach
        }, {
            useFindandModify: false,
        },
            (err) => {
                if (err)
                    throw new Error(err);
            }
        ).then(() => console.log("Updated Monthly Revenue successfully!!!"));

        return yearRevenue;
    }
    
    const yearRevenue = new DTNam(data);

    await yearRevenue.save()
        .then(res => console.log("Create New Report Year Succes"))
        .catch(err => console.log(err));
    
    return Promise.all([checkYearRevenue, yearRevenue]);
};

module.exports = {
    ReportYearRevenue,
    AddYearRevenue,
}