require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const DatabaseConnection = require('./DBConnection/databasesetup.js');
let con = new DatabaseConnection();

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let port = process.env.PORT || 3000;

const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var passport = require('passport');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;




passport.use(new jwtStrategy(opts, function(jwt_payload, done) {
    console.log("fucking fuck");
    console.log(jwt_payload);
    console.log(jwt_payload.sub);
    ///select a user with a specific ID
    if(jwt_payload){
        console.log(jwt_payload);
        console.log(jwt_payload.sub);
        return done(null, jwt_payload);
    }

}));



app.post('/login', con.GetUser,(req, res) => {
    jwt.sign({User: req.user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}, (err, token) => {
        res.json({token})
    });
});

app.post('/signup', con.CheckUser, (req, res) => {
    con.AddUser(req, res);
});

app.post('/jwt', passport.authenticate('jwt', {session: false}),(req, res) => {
    console.log(req.body);
    res.json({message: 'success'});
});

app.post('/testpost', verifyToken,(req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if(err){
            res.sendStatus(403);
        }else{
            // console.log(authData);
            res.send('AWE POST')
        }
    });
});


function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        
        res.sendStatus(403);
    }
}

app.listen(port, () => {

    console.log('Server is listening on port ' +
        port);
});