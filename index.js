const express = require('express');
let app = express();
let port = process.env.PORT || 3000;



app.get('/', (req, res) => {

    res.send("fgfgfg");
});






app.listen(port, () => {

    console.log('Server is listening on port ' +
        port);
});