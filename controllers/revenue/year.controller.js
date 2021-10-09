
const yearRevenue = require('../../services/revenue.service/DTNam.service');
const Years = require('../../services/flightSchedules.service');

// Function: getYearReport
// Input: Nothing
// Output: Render the view
// Last Modified: 30/9/2020

module.exports.getYearReport = async (req, res, next) => {
    let minYears = await Years.getMinYearofSchedulesFlight();
    let maxYears = await Years.getMaxYearofSchedulesFlight();
    let years = [];
    for (var i = minYears; i <= maxYears; i++) {
        years.push(i);
    }
    console.log(years);

    res.render('yearRevenue', {
        user: res.locals.user,
        csrf: req.csrfToken(),
        years,
    });
};

// Function: postYearReport
// Input: Nothing
// Output: Render the view with data
// Last Modified: 8/6/2020

module.exports.postYearReport = async (req, res, next) => {
    const { year } = req.body;
    let yearTotal = 0.0;
    const data = { year: parseInt(year) };
    let minYears = await Years.getMinYearofSchedulesFlight();
    let maxYears = await Years.getMaxYearofSchedulesFlight();
    let years = [];
    for (var i = minYears; i <= maxYears; i++) {
        years.push(i);
    }
    console.log(years);
    
    const yearReports = await yearRevenue.ReportYearRevenue(data);
    if (!yearReports) {
        throw new Error("Report Year Revenue Failed!!!");
    };
    yearReports.map((report, index) => {
        yearTotal += +report.DoanhThu;
    });
    yearReports.forEach((report) => {
        var tile = +report.DoanhThu / yearTotal;
        report.TiLe = +tile.toFixed(3);
    });
    const objData = {
        Nam: +year,
        DoanhThuNam: yearTotal,
        DanhSach: yearReports
    };
    const savingReport = await yearRevenue.AddYearRevenue(objData)
        .then(() => console.log("Year Report Success!!"))
        .catch((err) => { throw new Error(err) });

    res.render('yearRevenue', {
        user: res.locals.user,
        values: data,
        csrf: req.csrfToken(),
        reports: yearReports,
        total: yearTotal,
        years,
    })
};