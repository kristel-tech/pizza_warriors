const express = require('express');
const path = require('path');
const app = express();
const SetReview = require("./routes/setreviews.js");
let port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/testhtml.html'));
});

app.post('/addreview', (req, res) => {
    let setreview = new SetReview()
    setreview.AddReview(req, res);
});

app.post('/updatereview', (req, res) => {
    console.log(req);
    res.send(req.body.khutjo);
});

app.delete('/deletereview', (req, res) => {

    res.send("fgfgfg");
});

app.listen(port, () => {

    console.log('Server is listening on port ' +
        port);
});