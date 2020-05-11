"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHashAndSalt: {
    type: String,
    required: true
  }
});

// User model goes here
const User = mongoose.model("User", userSchema);

module.exports = User;
