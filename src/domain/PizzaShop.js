const { attributes } = require('structure');

const PizzaShop = attributes({
  ID: Number,
  PLACEID: String,
  NAME: String,
  TMSTAMP: Date,
})(class PizzaShop {});

module.exports = PizzaShop;