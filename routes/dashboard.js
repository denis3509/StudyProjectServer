const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Dashboard = mongoose.model('Dashboard');
const User = mongoose.model('User');
const async = require('async');

router.get('/dashboard', (req, res, next) => {
  const dashboard_id = req.query.dashboard_id;
  if (dashboard_id) {
    Dashboard.findById(dashboard_id, (error, dash) => {
        if (error)
          return next(error);
        if (dash) //TODO проверка на пустой результат
          return res.send(dash);
        return next(new Error('dashboard not found'))

      }
    )
  } else {
    next(new Error('get error: query is incorrect'))
  }


});

router.post('/dashboard', (req, res, next) => {
  const dash = req.body;

  async.waterfall([
    checkData,
    addDashboard,
    addDashboardToUser,
  ], function (error, user, dash) {
    if (error) {
      next(error)
    } else {
      res.json(dash)
    }
  });

  function checkData(callback) {
    if (dash) {
      callback(null, dash)
    } else {
      callback(new Error('create error: no dashboard'))
    }
  }

  function addDashboard(dash, callback) {
    const newDash = new Dashboard(dash);
    newDash.save((error, dash) => {
      if (error) {
        callback(error);
      } else {
        callback(null, dash)
      }
    })
  }

  function addDashboardToUser(dash, callback) {
    User.findById(req.session.user, (error, user) => {
      if (error) {
        callback(error)
      } else {
        user.joinDashboard(dash, (error, user)=>{
          callback(error,user,dash);
        })
      }
    })
  }


});

router.put('/dashboard', (req, res, next) => {
  const {dashboard_id} = req.query;
  const {update} = req.body;

  if (dashboard_id) { //TODO вернуть обновленный объект
    Dashboard.findOneAndUpdate({_id: dashboard_id}, update, (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});

router.delete('/dashboard', (req, res, next) => {
  const {dashboard_id} = req.query;
  if (dashboard_id) {
    Dashboard.findByIdAndRemove(dashboard_id, (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.send('dashboard removed');
      }
    })
  } else {
    next(new Error('remove error: query is incorrect'));
  }
});


router.get('/card', (req, res, next) => {
  const {dashboard_id, column_id, card_id} = req.query;
  const card = req.body;

  if (dashboard_id && column_id && card_id) {
    Dashboard.getCardFromColumn(dashboard_id, column_id, card_id, (error, card) => {
      if (error) {
        next(error);
      } else {

        res.send(card);
      }
    })
  } else {
    next(new Error('get card error: query is incorrect'))
  }

});
router.post('/card', (req, res, next) => {
  const {dashboard_id, column_id} = req.query;
  const card = req.body;

  if (dashboard_id && column_id) {
    Dashboard.addCardToColumn(dashboard_id, column_id, card, (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});
router.put('/card', (req, res, next) => {
  const {dashboard_id, column_id, card_id} = req.query;
  const update = req.body;

  if (dashboard_id && column_id && card_id) {
    Dashboard.updateCardInColumn(dashboard_id, column_id, card_id, update, (error, dash) => {
      if (error) {
        next(error);
      } else {

        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});
router.delete('/card', (req, res, next) => {
  const {dashboard_id, column_id, card_id} = req.query;


  if (dashboard_id && column_id && card_id) {
    Dashboard.removeCardFromColumn(dashboard_id, column_id, card_id,  (error, dash) => {
      if (error) {
        next(error);
      } else {

        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});



router.post('/column', (req, res, next) => {
  const {dashboard_id} = req.query;
  const column = req.body;

  if (dashboard_id ) {
    Dashboard.addColumn(dashboard_id, column, (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});


router.put('/column', (req, res, next) => {
  const {dashboard_id, column_id } = req.query;
  const update = req.body;
  if (dashboard_id && column_id  ) {
    Dashboard.removeColumn(dashboard_id, column_id, update ,  (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});
router.delete('/column', (req, res, next) => {
  const {dashboard_id, column_id } = req.query;

  if (dashboard_id && column_id  ) {
    Dashboard.removeColumn(dashboard_id, column_id,   (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.send(dash);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});


module.exports = router;