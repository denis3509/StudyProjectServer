const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardName : { type: String, required : true},
  content : String,
});
  const Card= mongoose.model('Card', cardSchema);
module.exports =  cardSchema;
