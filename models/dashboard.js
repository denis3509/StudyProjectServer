const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const columnSchema = require('./column');
const dashboardSchema = new Schema({
  dashboardName: String,
  description: String,
  group: [{
    user_id: ObjectId,
    userName: String,
  }],
  columns: [columnSchema],
  creator: {
    user_id: ObjectId,
    userName: String,
  },
  messages: [
    {
      authorName: String,
      author_id: ObjectId,
      text: String,
    }
  ],
  chat: {

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
          dash.save((error,dash)=>{
            callback(error,card);
          })
        } else {
          callback(new Error('card not found'));
        }
      } else {
        callback(new Error('column not found'));
      }

    }
  })
};
dashboardSchema.statics.replaceCard = function (dashboard_id,
                                                card_id,
                                                columnSource_id,
                                                columnSourceInd,
                                                cardSourceInd,
                                                columnTarget_id,
                                                columnTargetInd,
                                                cardTargetInd,
                                                callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    } else {
      if (columnSource_id === columnTarget_id &&
        (cardSourceInd === cardTargetInd || cardSourceInd - 1 === cardTargetInd))
        return dash;

      let columnSource = dash.columns.id(columnSource_id);

      const card = columnSource.cards.id(card_id);
      columnSource.cards.remove(card_id);

      let columnTarget;
      (columnSource_id === columnTarget_id)
        ? columnTarget = columnSource
        : columnTarget = dash.columns.id(columnTarget_id);

      let shift;
      (columnSource_id === columnTarget_id && cardSourceInd < cardTargetInd)
        ? shift = 0
        : shift = 1;

      const newCards = [
        ...columnTarget.cards.slice(0, cardTargetInd + shift),
        card,
        ...columnTarget.cards.slice(cardTargetInd + shift, columnTarget.cards.length),
      ];
      columnTarget.cards = newCards;


      dash.columns[columnTargetInd] = columnTarget;
      dash.markModified();
      dash.save(callback);
    }
  })

};
dashboardSchema.statics.replaceColumn = function (dashboard_id, column_id,
                                                  columnSourceInd, columnTargetInd, callback) {

  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) {
      callback(error);
    }
    if (columnSourceInd === columnTargetInd || columnSourceInd - 1 === columnTargetInd) {
      return dash;
    }
    let column = dash.columns.id(column_id);
    dash.columns.remove(column_id);
    let shift;
    (columnSourceInd < columnTargetInd)
      ? shift = 0
      : shift = 1;
    const newColumns = [
      ...dash.columns.slice(0, columnTargetInd + shift),
      column,
      ...dash.columns.slice(columnTargetInd + shift, dash.columns.length)
    ];

    dash.columns = newColumns;

    dash.save(callback);


  })
}

dashboardSchema.statics.addMessage = function (dashboard_id, user_id, userName, text, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) callback(error);
    const newMessage = {
      authorName: userName,
      author_id: user_id,
      text: text,
    };
    dash.messages.push(newMessage);
   // dash.markModified();
    dash.save(callback)
  })
};
dashboardSchema.methods.addUser = function(user_id,userName,callback) {
  this.group.push({user_id,userName});
  this.save(callback)
};
dashboardSchema.statics.getMessages = function (dashboard_id, callback) {
  return this.findOne({_id: dashboard_id}, (error, dash) => {
    if (error) callback(error);
    const messages = dash.messages;
    callback(null, messages);
  })
};

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;