
const mongoose = require('mongoose');


// @Model for admin
const adminSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      default: "Nguyen Van A",
      maxLength: 50,
    },
    userName: {
      type: String,
      required: true,
      maxLength: 50,
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
      required: false,
      maxLength: 10,
      minLength: 10,
    },
    // Co the them anh default
    Avatar: String,
    GT: {
      type: String,
      enum: ["Nam", "Nu", "GTT3"],
    },
    Adress: {
      type: String,
      required: false,
      maxLength: 100,
    },
    CMND: {
      type: String,
      required: false,
      minLength: 9,
      maxLength: 9,
    },
    QuocGia: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);


const Admin = mongoose.model('Admin',adminSchema,'admin');

module.exports = Admin;