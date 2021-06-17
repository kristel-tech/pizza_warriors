const { attributes } = require('structure');

const Pizza = attributes({
  ID: Number,
  NAME: String,
  TMSTAMP: Date,
})(class Pizza {});

module.exports = Pizza;