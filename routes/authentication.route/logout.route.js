const express = require('express');
const router = express.Router();

const controller = require('../../controllers/authentication.controller/logout.controller');
// router.get('/logout', function(req, res, next) {
//     if (req.session) {
//       // delete session object
//       req.session.destroy(function(err) {
//         if(err) {
//           return next(err);
//         } else {
//           return res.redirect('/');
//         }
//       });
//     }
// });

router.get('/dz9O7rfG629JL82P8ury', controller.logout);
  
module.exports = router;