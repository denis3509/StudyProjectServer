const mongoose = require('mongoose');
const Dashboard = require('../models/dashboard');
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/StudyProjectDB', {useNewUrlParser: true},(error)=>{
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