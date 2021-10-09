# PlaneTicket_Web.
DA SE104

## Aplication Structure:
```bash

.
|
|_ public
|       |_ images
|       |_ styles
|       |_ script
|
|_ views
|       |_ home.pug
|       |_ bill.view
|                   |_ billDeposit.view.pug
|                   |_ billFullPaid.view.pug
|       |_ discovery.view
|                       |_ HCM.view.pug
|                       |_ HaNoi.view.pug
|                       |_ DaNang.view.pug
|                       |_ PhuQuoc.view.pug
|                       |_ QuyNhon.view.pug
|
|
|
|_ controller
|           |_ admin.controller
|           |_ user.controller
|           |_ public.controller
|
|_ routes
|       |_ users.route
|                   |_ myProfile.route/ myProfile.route.js
|                   |_ ticket.route
|                               |_ ticketDeposit.route.js
|                               |_ ticketFullPaid.route.js
|       |_ admin.route
|                   |_ revenueReport.route.js
|                   |_ flightSettings.route.js
|       |_ public.route
|                   |_ bookInfor.route
|                                   |_ book.route
|                                               |_ book.route.js
|                                               |_ booking.route.js //BM2
|                                               |_ seatBooking.route.js //BM3
|                                               |_ question.route.js
|                                   |_ condition.route
|                                                   |_ policy.route.js
|                   |_ flight.route
|                               |_ flightSearching.route / flightSearching.route.js //BM5
|                               |_ airport.route
|                                               |_ localairport.route.js
|                                               |_ globalairport.route.js
|                               |_ luggage.route
|                                               |_ signedLuggage.route.js
|                                               |_ handedLuggage.route.js
|                                               |_ lostLuggage.route.js
|                   |_ discovery.route
|                                   |_ discovery.route.js
|                   |_ service.route
|                                   |_ cuisine.route.js
|                                   |_ tips.route.js
|
|                   |_ login.
|
app.js //server.
db.json //database.

by KhoiLe.
```
