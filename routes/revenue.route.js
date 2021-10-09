const express = require('express');
const router = express.Router();

// controllers.
const { getMonthReport, postMonthReport } = require('../controllers/revenue/monthly.controller');
const { getYearReport, postYearReport } = require('../controllers/revenue/year.controller');

// monthly
router.get('/monthly', getMonthReport);
router.post('/monthly', postMonthReport);

// year
router.get('/year', getYearReport);
router.post('/year', postYearReport);

router.get('/', (req, res) => {
    res.status(403).json({ message: "please choose month or year report!!" });
});

module.exports = router;