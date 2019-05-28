const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const checkAuth = require('../middleware/checkAuth').checkAuth;
/* GET users listing. */
router.post('/signUp', function (req, res, next) {

  const {
    userName,
    login,
    password,
    email
  } = req.body;

  if (userName && login && password && email) {
    User.signUp({login, userName, password, email}, (error, user) => {
      if (error) {
        next(error);
      } else {
        req.session.user = user._id;
        res.json(user);
      }
    })
  } else {
    next(new Error('user field is empty'))
  }

});

router.get('/user/get', checkAuth, function (req, res, next) {
  User.findById(req.session.user, {_id: false, salt: false, hashedPassword: false}, (error, user) => {
    if (error) {
      next(new Error('user not found'))
    } else {
      res.json(user);
    }
  })
});

router.post('/login', function (req, res, next) {
  const {login , password} = req.body;
    User.login(login,password, (error, user) => {
      if (error) {
        next(error);
      } else {
        req.session.user = user._id;
        const {
          userName,
          dashboardList
        } = user;
        res.send({userName, dashboardList});
      }
    })


});
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.send('logout');
});
module.exports = router;
