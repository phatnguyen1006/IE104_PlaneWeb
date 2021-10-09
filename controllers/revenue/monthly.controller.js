const monthlyReport = require('../../services/revenue.service/DTChuyenBay.service');
const Years = require('../../services/flightSchedules.service');

// Function: getMonthReport
// Input: Nothing
// Output: Render the view
// Last Modified: 30/9/2020

module.exports.getMonthReport = async (req, res) => {
    let minYears = await Years.getMinYearofSchedulesFlight();
    let maxYears = await Years.getMaxYearofSchedulesFlight();
    let years = [];
    for (var i = minYears; i <= maxYears; i++) {
        years.push(i);
    }

    res.render('monthlyRevenue', {
        user: res.locals.user,
        csrf: req.csrfToken(),
        years,
    });
};

// Function: postMonthReport
// Input: Nothing
// Output: Render the view with data
// Last Modified: 8/6/2020

module.exports.postMonthReport = async (req, res) => {
    const { month, year } = req.body;
    let flightTotal = 0;
    const data = {
        month: parseInt(month),
        year: parseInt(year)
    };
    let minYears = await Years.getMinYearofSchedulesFlight();
    let maxYears = await Years.getMaxYearofSchedulesFlight();
    let years = [];
    for (var i = minYears; i <= maxYears; i++) {
        years.push(i);
    }

    const reports = await monthlyReport.ReportMonthlyRevenue(data);
    if (!reports) {
        throw new Error("Failed to Reports!!!");
    };
    reports.map((report, index) => {
        flightTotal += report.DoanhThu;
    });
    reports.forEach(report => {
        report.TiLe = report.DoanhThu / flightTotal;
    });
    const objData = {
        Thang: month,
        Nam: year,
        DoanhThuThang: flightTotal,
        DSChuyenBay: reports
    };
    const savingReport = await monthlyReport.AddFlightRevenue(objData)
        .then(() => console.log("Report Success!!"))
        .catch((err) => { throw new Error(err) });

    res.render('monthlyRevenue', {
        user: res.locals.user,
        values: data,
        csrf: req.csrfToken(),
        reports: reports,
        total: flightTotal,
        years,
    });
}