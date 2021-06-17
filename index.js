const express = require('express');
const jwt = require('jsonwebtoken');
let app = express();
let port = process.env.PORT || 3000;

var GitHubStrategy = require('passport-github').Strategy;


var passport = require('passport');

const DatabaseCreds = {
    host: 'remotemysql.com',
    user: 'CsJRuhA9v6',
    password: 'G0rXiQLh7c',
    database: 'CsJRuhA9v6',
    port: 3306
}





passport.use(new GitHubStrategy({
        clientID: '1bee8f2166a6f101a6aa',
        clientSecret: '62f3a23da5dc8c1740dcade29c6d41ea2bf3a343',
        callbackURL: "http://localhost:3000/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return cb('im done');
    }
));


app.post('/login', (re, res) => {
    //////////
    // authenticate user in DB
    //mockuser
    const user = {
        id: 1,
        username: 'potato',
        email: 'testing@test.com'
    }

    jwt.sign({User: user}, 'secretKey', {expiresIn: '15s'}, (err, token) => {
        res.json({token})
    });
});


app.get('/test', (req, res) => res.send('AWE'))

app.post('/testpost', verifyToken,(req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            res.send('AWE POST' + authData)
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
        //FOGOF send 403 status
        res.sendStatus(403);
    }
}

////////////////////////////////////////////

app.get('/auth/error', (req, res) => res.send('Unknown Error'))

app.get('/', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/callback',
    passport.authenticate('github', { failureRedirect: '/auth/error' }),
    function(req, res) {
        res.redirect('/callback');
    });


app.listen(port, () => {

    console.log('Server is listening on port ' +
        port);
});