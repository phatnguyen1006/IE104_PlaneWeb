const mongoose = require('mongoose');

// model danh cho user
const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      default: "Nguyen Van A",
      maxLenght: 50,
    },
    userName: {
      type: String,
      required: true,
      unique: false,
      maxLenght: 50,
    },
    Password: {
      type: String,
      required: true,
    },
    Gmail: {
      type: String,
      unique: true,
      required: true,
    },
    SDT: {
      type: String,
      maxLenght: 10,
      minLenght: 10,
      required: false,
    },
    // co the them anh default
    Avatar: String,
    GT: {
      type: String,
      default: "Nam",
      enum: ["Nam", "Nữ", "Khác"],
    },
    Age: {
      type: Number,
      min: 18,
      max: 100,
    },
    CMND: {
        type: String,
        required: false,
        minLength: 9,
        maxLength: 12
    },
    QuocGia: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);



const Users = mongoose.model('Users',userSchema,'users');



module.exports = Users;
