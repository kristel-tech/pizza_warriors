const sendrequest = require('request');

module.exports = function() {
    this.handle = function(request, response) {
        if (request.params.reqtype === "getlocals") {
            sendrequest('https://maps.googleapis.com/maps/api/place/textsearch/json?query=pizza+places+in+pretoria&key=AIzaSyCi0r402tQYs9H-kXlOfqRWVrdYqapwFA8', { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                let local_data = []
                local_data.push({
                    "next_page_token": body.next_page_token
                });
                body.results.forEach(i => {
                    if (i.business_status === 'OPERATIONAL') {
                        let local = {
                            name: i.name,
                            rating: i.rating,
                            address: i.formatted_address,
                            place_id: i.place_id
                        }
                        local_data.push(local)
                    }
                })
                response.send(JSON.stringify(local_data));
            });
        } else
            response.send("HELLO");
    }
}