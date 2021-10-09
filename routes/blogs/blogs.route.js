const express = require('express');
const router = express.Router();

router.get('/phu-quoc', (req, res) => {
    res.render('blogs/PhuQuoc.pug', {
        user: res.locals.user
    });
})

router.get('/da-nang', (req, res) => {
    res.render('blogs/DaNang.pug', {
        user: res.locals.user
    });
})


router.get('/ho-chi-minh', (req, res) => {
    res.render('blogs/HoChiMinh.pug', {
        user: res.locals.user
    });
})


router.get('/quy-nhon', (req, res) => {
    res.render('blogs/QuyNhon.pug', {
        user: res.locals.user
    });
})


router.get('/ha-noi', (req, res) => {
    res.render('blogs/HaNoi.pug', {
        user: res.locals.user
    });
})


module.exports = router;