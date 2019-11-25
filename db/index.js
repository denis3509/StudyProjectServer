const mongoose = require('mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/user');
const config = require('../config');

mongoose.connect(config.mongodbConnectionURI, {useNewUrlParser: true},(error)=>{
  if (error) {
    console.log('connection failed: ', error);
  } else {
    console.log('mongoose connect successful');
  }
});

module.exports = {
  Dashboard,
  User,
};