const { getAirports } = require('../services/QD6.service')

//Function: get booking route  
//Input: notify from session 
//Output:  render booking view 
//Last modified day: 23/4/2021 
module.exports.index = async(req, res) => {
    if (req.session.notify) {
        //console.log(req.session.notify);
        var notify = req.session.notify;
        delete req.session.notify;
        
        res.render('booking', {
            Airports: await getAirports(),
            //csrf: req.csrfToken(),
            notify: notify
        });
    }
    else {
        res.render('booking', {
            Airports: await getAirports()
        });
    }
    
};