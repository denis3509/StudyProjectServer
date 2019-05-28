const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Dashboard = mongoose.model('Dashboard');

router.get('/card', (req, res, next) => {
  const {
    dashboard_id,
    column_id,
    card_id
  } = req.query;

  if (dashboard_id && column_id && card_id) {
    Dashboard.getCardFromColumn(dashboard_id, column_id, card_id, (error, card) => {
      if (error) {
        next(error);
      } else {
        res.send(card);
      }
    })
  } else {
    next(new Error('get error: query is incorrect'));
  }
});

router.post('/card/new', (req, res, next) => {
  const {
    dashboard_id,
    column_id,
  } = req.query;

  const card = req.body.card;

  if (dashboard_id && column_id && card) {
    Dashboard.addCardToColumn(dashboard_id, column_id, card, (error, dash) => {
      if (error) {
        next(error);
      } else {
        res.json({message: 'card saved'});
      }
    });
  } else {
    next(new Error('create error: query is incorrect'));
  }

});

router.put('/card', (req, res, next) => {
  const {
    dashboard_id,
    column_id,
    card_id
  } = req.query;

  const update = req.body.update;

  if (dashboard_id && column_id && card_id) {
    Dashboard.updateCardInColumn(dashboard_id, column_id, card_id, update, (error, dash) => {
      if (error) {
        next(error)
      } else {
        res.json({message: 'card updated'})
      }
    })
  } else {
    next(new Error('update error: query is incorrect'));
  }
});

router.delete('/card', (req, res, next) => {
  const {
    dashboard_id,
    column_id,
    card_id
  } = req.query;

  if (dashboard_id && column_id && card_id) {
    Dashboard.removeCardFromColumn(dashboard_id, column_id, card_id, (error, dash) => {
      if (error) {
        next(error);
      } else {
       res.send({message: 'card removed'});
      }
    });
  } else {
    next(new Error('remove error: query is incorrect'));
  }

});
module.exports = router;