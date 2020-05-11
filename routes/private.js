"use strict";

const express = require('express');
const privateRouter = new express.Router();

//protected route
privateRouter.get('/', (req, res, next) => {
  res.render('private', { title: 'Private' });
});

module.exports = privateRouter;
