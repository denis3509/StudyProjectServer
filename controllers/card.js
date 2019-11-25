const {Dashboard} = require('../db');

const getCard = ('/card', (req, res, next) => {
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
const createCard = (req, res, next) => {
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
};
const updateCard = (req, res, next) => {
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
};
const removeCard =  (req, res, next) => {
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
};



module.exports = {
  createCard,
  updateCard,
  removeCard,
  getCard,
};