const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/card');

router.get('/card', cardsController.getCard);
router.post('/card', cardsController.createCard);
router.put('/card',  cardsController.updateCard);
router.delete('/card', cardsController.removeCard);

module.exports = router;
