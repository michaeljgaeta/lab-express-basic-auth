"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHashAndSalt: {
    type: String,
    required: true,
    minlength: 9
  }
});

// User model goes here
const User = mongoose.model("User", userSchema);

module.exports = User;
