const columnController = require('../controllers/column');
const express = require('express');
const router = express.Router();

router.post('/column', columnController.addColumn);
router.put('/column', columnController.updateColumn);
router.delete('/column', columnController.removeColumn);
router.post('/column/replace', columnController.replaceColumn);

module.exports = router;