const express = require('express')
const connect = require("./DBConnection/databasesetup.js");
const GetReview = require("./routes/getreview.js");
const app = express()
let port = process.env.PORT || 3000;

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