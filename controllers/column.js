
const {Dashboard} = require('../db');
const addColumn = (req, res, next) => {
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
};
const updateColumn = (req, res, next) => {
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
};
const removeColumn = (req, res, next) => {
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
};
const replaceColumn = (req, res, next) => {
  const {
    dashboard_id, columnSource_id,
    columnSourceInd, columnTargetInd
  } = req.body;
  Dashboard.replaceColumn(dashboard_id, columnSource_id, columnSourceInd, columnTargetInd, (error, dash) => {
    if (error) next(error);
    else
      res.send(dash);
  })
};

module.exports = {
  addColumn,
  replaceColumn,
  removeColumn,
  updateColumn,
};