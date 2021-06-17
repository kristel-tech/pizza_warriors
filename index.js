require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

let app = express();

let port = process.env.PORT || 3000;

var GitHubStrategy = require('passport-github').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var passport = require('passport');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;


const DatabaseCreds = {
    host: 'remotemysql.com',
    user: 'CsJRuhA9v6',
    password: 'G0rXiQLh7c',
    database: 'CsJRuhA9v6',
    port: 3306
}


function thecb(accToken){
// save token to the DB and use this token to verify user exists 

jwt.sign({User: accToken}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '100s'}, (err, token) => {
    return cb(JSON.stringify(token));
});
}


passport.use(new jwtStrategy(opts, function(jwt_payload, done) {
    // console.log(jwt_payload);
    // console.log(jwt_payload.sub);
    ///select a user with a specific ID
    if(jwt_payload){
        console.log(jwt_payload);
        console.log(jwt_payload.sub);
        return done(null, jwt_payload);
    }
    // user.findOne({id: jwt_payload.sub}, function(err, user) {

    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });
}));


// passport.use(new GitHubStrategy({
//         clientID: '1bee8f2166a6f101a6aa',
//         clientSecret: '62f3a23da5dc8c1740dcade29c6d41ea2bf3a343',
//         callbackURL: "http://localhost:3000/callback"
//     },
//     function(accessToken, refreshToken, profile, thecb) {
//         console.log(accessToken);
//         console.log(refreshToken);
//         console.log(profile);
//         return thecb(accessToken);
//     }
// ));


app.post('/login', (req, res) => {
    //////////
    // authenticate user in DB

    //mockuser
    const user = {
        id: 1,
        username: 'potato',
        email: 'testing@test.com'
    }
    console.log(req.body);

    jwt.sign({User: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}, (err, token) => {
        res.json({token})
    });
});

app.post('/login2', (req, res) => {
    //////////
    // authenticate user in DB,return token if successful
    id = 123;
    username=req;
    pword=req;
    const user = {
        id: 1,
        username: 'potato',
        email: 'testing@test.com'
    }
    dblogin = 1;
    if (dblogin){
        jwt.sign({User: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}, (err, token) => {
            res.json({token})
        });
    }else{
        res.json({tryHarder: 'gerrourrahereman Login in failed'})
    }


});

app.post('/jwt', passport.authenticate('jwt', {session: false}),(req, res) => {
    console.log(req.body);
    res.json({message: 'success'});
});


app.get('/test', (req, res) => res.send('AWE'))

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


//verify token

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

////////////////////////////////////////////





app.get('/auth/error', (req, res) => res.send('Unknown Error'))

app.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
    res.json({message: 'flat'});
});


app.get('/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error' }),
    function(req, res) {
        res.redirect('/callback');
    });


app.listen(port, () => {

    console.log('Server is listening on port ' +
        port);
});