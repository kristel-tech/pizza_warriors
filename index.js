require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const DatabaseConnection = require('./DBConnection/databasesetup.js');
const con = new DatabaseConnection();
const app = express();
const GetReview = require("./routes/getreview.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 3000;

const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;

passport.use(new jwtStrategy(opts, function(jwt_payload, done) {
    if(jwt_payload){
        return done(null, jwt_payload);
    }else{
        return done(null, false);
    }
}));

app.post('/login', con.GetUser,(req, res) => {
    jwt.sign({User: req.user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'}, (err, token) => {
        res.json({token})
    });
});

app.post('/signup', con.CheckUser, (req, res) => {
    con.AddUser(req, res);
});


app.get('/pizza/:reqtype', (req, res) => {
    let getreview = new GetReview();
    getreview.handle(req, res);
})

app.post('/pizza/:reqtype', (req, res) => {
    let getreview = new GetReview();
    getreview.handle(req, res);
})

app.listen(port, () => {
    console.log('Server is listening on port ' +
        port);
});

// https: //maps.googleapis.com/maps/api/place/details/json?place_id=ChIJR06iIONglR4RKvJoEK5diHk&fields=reviews&key=AIzaSyCi0r402tQYs9H-kXlOfqRWVrdYqapwFA8
// https: //maps.googleapis.com/maps/api/place/textsearch/json?query=pizza+places+in+pretoria&key=AIzaSyCi0r402tQYs9H-kXlOfqRWVrdYqapwFA8