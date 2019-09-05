const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const cardSchema = require('./card');
const columnSchema = new mongoose.Schema({
  columnName: {type: String, required: true},
  description: String,
  group: [{
    user_id: ObjectId,
    userName: String,
  }],
  cards: [cardSchema],
});


module.exports = columnSchema;