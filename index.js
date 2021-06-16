const express = require('express');
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