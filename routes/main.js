"use strict";

const express = require('express');
const mainRouter = new express.Router();

//protected route
mainRouter.get('/', (req, res, next) => {
  res.render('main', { title: 'Protected Route' });
});

module.exports = mainRouter;
