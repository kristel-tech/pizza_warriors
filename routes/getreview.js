const sendrequest = require('request');
const keys = require("../secrats/keys.js");

module.exports = function() {
        this.handle = function(request, response) {

            if (request.params.reqtype === "getlocals") {
                let places;
                if (!request.query && request.query.places === '')
                    places = "south+africa";
                else
                    places = request.query.places;

                sendrequest('https://maps.googleapis.com/maps/api/place/textsearch/json?query=+pizza+places+in' + places + '&radius=16000&key='+keys, { json: true }, (err, res, body) => {
                    if (err) {
                        response.send("error")
                        return;
                    }
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
            } else if (request.params.reqtype === "localsreview") {
                let place_id;
                if (!request.query && request.query.place_id === '')
                    response.send("error")
                else
                    place_id = request.query.place_id;
                // https: //maps.googleapis.com/maps/api/place/details/json?place_id=ChIJacgiKPZhlR4RPPFFHAKubvM&key=AIzaSyCi0r402tQYs9H-kXlOfqRWVrdYqapwFA8
                    sendrequest('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key='+keys, { json: true }, (err, res, body) => {
                        if (err) {
                            response.send("error")
                            return;
                        }
                        var ire = body.result.reviews
                            // console.log(body.result.reviews[0])
                        let review_data = []


                        ire.forEach(i => {
                            // console.log(i)
                            let reviews = {
                                name: i.author_name,
                                rating: i.rating,
                                review: i.text,
                            }
                            review_data.push(reviews)

                        })
                        response.send(JSON.stringify(review_data));
                    });
            } else if (request.params.reqtype === "localpictures") {
                let local_id;
                if (!request.query && request.query.place_id === '')
                    response.send("error")
                else
                    local_id = request.query.place_id;
                    sendrequest('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + local_id + '&key='+ keys, { json: true }, (err, res, body) => {
                        if (err) {
                            response.send("error")
                            return;
                        }

                        if (body.result.photos)
                        var ire = body.result.photos
                        {
                        ire.forEach(i => {
                            sendrequest('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + i.photo_reference + '&key=' + keys, { json: true }, (err, res, body) => {
                            if (err) {
                                response.send("error")
                                return;
                                }
                            })
                        })
                    }
                });
            }
        }
    }
    // "locationbias=-29.082519,26.154220" & radius = 16000