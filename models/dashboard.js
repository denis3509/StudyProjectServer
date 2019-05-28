const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const columnSchema = require('./column');
const dashboardSchema = new Schema({
  dashboardName: String,
  description: String,
  group: [{
    id: ObjectId,
    userName: String,
  }],
  columns: [columnSchema],
  creator: {
    user_id: ObjectId,
    userName: String,
  }
});

dashboardSchema.statics.addColumn = function (dashboard_id, column, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      console.error(error);
    }
    dash.columns.push(column);
    dash.save(callback);
  })

};
dashboardSchema.statics.removeColumn = function (dashboard_id, column_id, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    }
    let column = dash.columns.id(column_id);
    if (column) {
      column.remove();
      dash.save(callback);
    } else {
      callback(new Error('column not found'));
    }
  })
};
dashboardSchema.statics.updateColumn = function (dashboard_id, column_id, update, callback) {
  this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    } else {

      const column = dash.columns.id(column_id);
      if (column) {
        for (let key in update) {
          column[key] = update[key];
          dash.save(callback);
        }
      } else {
        callback(new Error('column not found'));
      }

    }
  })
};
dashboardSchema.statics.getCardFromColumn = function (dashboard_id, column_id, card_id, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error)
    } else {

      const column = dash.columns.id(column_id);
      if (column) {
        const card = column.cards.id(card_id);
        if (card) {
          callback(null, card);
        } else {
          callback(new Error('card not found'));
        }
      } else {
        callback(new Error('column not found'));
      }

    }
  })
};
dashboardSchema.statics.addCardToColumn = function (dashboard_id, column_id, card, callback) {
  if (!card) return callback(new Error('no card'));
  this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    } else {

      let column = dash.columns.id(column_id);
      if (column) {
        console.log(column);
        column.cards.push(card);
        dash.save(callback)
      } else {
        callback(new Error('column not found'));
      }


    }
  })
};
dashboardSchema.statics.removeCardFromColumn = function (dashboard_id, column_id, card_id, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    } else {
      const column = dash.columns.id(column_id);
      if (column) {
        const card = column.cards.id(card_id);
        if (card) {
          card.remove();
          dash.save(callback)
        } else {
          callback(new Error('card not found'));
        }
      } else {
        callback(new Error('column not found'));
      }

    }
  })
};

dashboardSchema.statics.updateCardInColumn = function (dashboard_id, column_id, card_id, update, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    } else {

      const column = dash.columns.id(column_id);
      if (column) {
        const card = column.cards.id(card_id);
        if (card) {
          for (let key in update) {
            card[key] = update[key];
          }
          dash.save(callback)
        } else {
          callback(new Error('card not found'));
        }
      } else {
        callback(new Error('column not found'));
      }

    }
  })
};

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;