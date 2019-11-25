const async = require('async');
const {Dashboard, User} = require('../db');

const getDashboard = (req, res, next) => {
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


};
const createDashboard = (req, res, next) => {
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


};

const updateDashboard = (req, res, next) => {
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
};
const removeDashboard = (req, res, next) => {
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
};
const inviteUser = (req, res, next) => {
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
};
const getMessages = (req, res, next) => {
  const {dashboard_id} = req.query;
  Dashboard.getMessages(dashboard_id, (error, messages) => {
    if (error) next(error);
    res.send(messages);
  })
};


module.exports = {
  getDashboard,
  updateDashboard,
  removeDashboard,
  inviteUser,
  createDashboard,
  getMessages,
};