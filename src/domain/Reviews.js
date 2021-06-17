const { attributes } = require('structure');

const Review = attributes({
    ID: Number,
    USERID: String,
    TOPIC: Number,
    REVIEW: String,
    RATING: Number,
    TMSTAMP: Date,
})(class Review {});

module.exports = Review;