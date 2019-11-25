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
    newDash.group.push({
      user_id: req.session.user,
      userName: 'userName'
    });
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
        user.joinDashboard(dash, (error, user) => {
          callback(error, user, dash);
        })
      }
    })
  }


});
router.put('/dashboard', (req, res, next) => {
  const {dashboard_id} = req.query;
  const update = req.body;

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
    Dashboard.findOneAndDelete({_id: dashboard_id}, (error, dash) => {
      if (error) next(error);
      const ids = dash.group.map(user => {
        return user.toObject().user_id;
      });

      User.find({_id: ids}, (error, result) => {
        if (error) next(error);
        async.each(result, (user, callback) => {
          user.leaveDashboard(dashboard_id, callback)
        }, (error, user) => {
          if (error) {
            console.log(error);
            next(error);
          } else {
            res.send('dashboard removed')
          }
        })
      });


    })
  } else {
    next(new Error('remove error: query is incorrect'));
  }
});
router.put('/dashboard/invite', (req, res, next) => {
  const {dashboard_id, email} = req.query;
  if (dashboard_id && email) {
    async.waterfall(
      [
        (callback) => {
          Dashboard.findOne({_id: dashboard_id}, (error, dash) => {
            if (error) {
              callback(error);
            }
            else {
              callback(null, dash);
            }
          })
        },
        (dash, callback) => {
          User.findOne({email: email}, (error, user) => {
            if (error) {
              callback(error);
            } else {
              callback(null, dash, user);
            }
          })
        },
        (dash, user, callback) => {
          dash.addUser(user._id, user.userName, (error, dash) => {
            if (error) {
              callback(error);
            } else {
              callback(null, dash, user);
            }
          })
        },
        (dash, user, callback) => {
          user.joinDashboard(dash, (error, user) => {
            if (error) {
              callback(error);
            } else {
              callback(null, 'ok');
            }
          });
        }

      ], (error, done) => {
        if (error) {
          next(error)
        } else {
          res.send({message: 'user invited'})
        }
      })
  } else {
    next(new Error('wrong query'));
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
    Dashboard.updateCardInColumn(dashboard_id, column_id, card_id, update, (error, card) => {
      if (error) {
        next(error);
      } else {
        res.send(card);
      }
    })
  } else {
    next(new Error('update error: query is incorrect'))
  }
});
router.delete('/card', (req, res, next) => {
  const {dashboard_id, column_id, card_id} = req.query;


  if (dashboard_id && column_id && card_id) {
    Dashboard.removeCardFromColumn(dashboard_id, column_id, card_id, (error, dash) => {
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

  if (dashboard_id) {
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
  const {dashboard_id, column_id} = req.query;
  const update = req.body;
  if (dashboard_id && column_id) {
    Dashboard.updateColumn(dashboard_id, column_id, update, (error, dash) => {
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
  const {dashboard_id, column_id} = req.query;

  if (dashboard_id && column_id) {
    Dashboard.removeColumn(dashboard_id, column_id, (error, dash) => {
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
router.post('/column/replace', (req, res, next) => {
  const {
    dashboard_id, columnSource_id,
    columnSourceInd, columnTargetInd
  } = req.body;
  Dashboard.replaceColumn(dashboard_id, columnSource_id, columnSourceInd, columnTargetInd, (error, dash) => {
    if (error) next(error);
    else
      res.send(dash);
  })
});

router.post('/card/replace', (req, res, next) => {
  const {
    dashboard_id,
    card_id,
    columnSource_id,
    columnSourceInd,
    cardSourceInd,
    columnTarget_id,
    columnTargetInd,
    cardTargetInd
  } = req.body;
  if (dashboard_id &&
    card_id &&
    columnSource_id &&
    columnSourceInd + 2 &&
    cardSourceInd + 2 &&
    columnTarget_id &&
    columnTargetInd + 2 &&
    cardTargetInd + 2) {
    Dashboard.replaceCard(dashboard_id,
      card_id,
      columnSource_id,
      columnSourceInd,
      cardSourceInd,
      columnTarget_id,
      columnTargetInd,
      cardTargetInd, (error, dash) => {
        if (error) {
          next(error);
        } else {
          res.send(dash);
        }
      })
  } else {
    next(new Error('replaceCard error: query is incorrect'))
  }
});

router.get('/dashboard/messages', (req, res, next) => {
  const {dashboard_id} = req.query;
  Dashboard.getMessages(dashboard_id, (error, messages) => {
    if (error) next(error);
    res.send(messages);
  })
});
module.exports = router;