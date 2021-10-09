const multer = require('multer');
var upload = multer({ dest: './public/uploads' });

module.exports = upload;