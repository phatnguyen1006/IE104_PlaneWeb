// kết nối database
const mongoose = require('mongoose');
require('dotenv').config();

// Tao connection toi database
function connectDB() {

    // cac options de connect khong bi loi
    const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true };
    
    mongoose.connect(process.env.DB_URI, mongooseOptions, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Ket Noi Thanh Cong Toi Database !');
        }
    });
}

module.exports = connectDB;