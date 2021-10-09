const ticketInfoData = (req, res, next) => {
    const flightCode = req.body.flightCode;
    const ticketType = req.body.ticketType;
    
    req.session.flightCode = flightCode;
    req.session.ticketType = ticketType;
    next();
}

module.exports = { ticketInfoData };