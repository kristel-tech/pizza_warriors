require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const DatabaseConnection = require('./DBConnection/databasesetup.js');
const con = new DatabaseConnection();

const app = express();

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


app.listen(port, () => {

    console.log('Server is listening on port ' +
        port);
});