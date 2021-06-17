const User = require('src/domain/Pizza');
const BaseRepository = require('./BaseRepository');

class PizzaRepository extends BaseRepository {
  constructor({ models }) {
    super(models.PizzaModel, Pizza);
  }
}

module.exports = PizzaRepository;
