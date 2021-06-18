const sendrequest = require('request');

function CompileError(err, route) {
    var errorjson = {
        timestamp: new Date().toISOString(),
        status: 500,
        error: "Internal Server Error ",
        message: err,
        "path": route
    }
    return (errorjson);
}

function CompileSuccess(data, route, params, calltype) {
    var errorjson = {
        timestamp: new Date().toISOString(),
        status: 200,
        success: true,
        message: calltype + " success",
        path: route,
        data: data,
        params: params
    }
    return (errorjson);
}

module.exports = function() {
        this.handle = function(request, response) {

            if (request.params.reqtype === "getlocals") {
                let places;
                if (!request.query && request.query.places === '')
                    places = "south+africa";
                else
                    places = request.query.places;

                sendrequest('https://maps.googleapis.com/maps/api/place/textsearch/json?query=+pizza+places+in' + places + '&radius=16000&key='+process.env.GOOGLE_KEY, { json: true }, (err, res, body) => {
                    if (err) {
                        response.send(CompileError({Error: "NO_AVAILABLE_LOCALS"}))
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
                    response.send(CompileSuccess(local_data, request.url, request.query, "getlocals"));
                });
            } else if (request.params.reqtype === "localsreview") {
                let place_id;
                if (!request.query && request.query.place_id === '')
                    response.send(CompileError({Error: "NO_AVAILABLE_LOCALS"}))
                else
                    place_id = request.query.place_id;
                
                    sendrequest('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + place_id + '&key='+process.env.GOOGLE_KEY, { json: true }, (err, res, body) => {
                        if (err) {
                            response.send(CompileError({Error: "NO_AVAILABLE_REVIEWS"}))
                            return;
                        }
                        let review_data = []
                        if (body.result !== undefined && body.result.reviews !== undefined){
                            var ire = body.result.reviews
                                console.log(body.result)

                            ire.forEach(i => {
                                let reviews = {
                                    name: i.author_name,
                                    rating: i.rating,
                                    review: i.text,
                                }
                                review_data.push(reviews)

                            })
                        }else
                            review_data.push(CompileError({Error: "NO_AVAILABLE_REVIEWS"}));
                        response.send(JSON.stringify(review_data));
                    });
            } else if (request.params.reqtype === "localpictures") {
                let local_id;
                if (!request.query === undefined &&  request.query.place_id === undefined && request.query.place_id === '')
                    response.send("error")
                else{
                    local_id = request.query.place_id;
                    sendrequest('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + local_id + '&key='+ process.env.GOOGLE_KEY, { json: true }, (err, res, body) => {
                        if (err) {response.send(CompileError({Error: "NO_AVAILABLE_REVIEWS"}));return;}
                        // console.log(body.result.photos)

                        if (body.result !== undefined && body.result.photos !== undefined){
                            
                            var ire = body.result.photos
                            let index = body.result.photos.length
                            
                            let review_data = []
                            ire.forEach(i => {
                                sendrequest('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + i.photo_reference + '&key=' + process.env.GOOGLE_KEY, { json: true }, (err, res, photohref) => {
                                if (err) {response.send(CompileError({Error: "NO_AVAILABLE_REVIEWS"}))
                                    return;
                                    }
                                    review_data.push(photohref)
                                    console.log(photohref)
                                    if(index == body.result.photos.length)
                                        response.send(CompileSuccess(review_data, request.url, request.query, "localpictures"));
                                })
                            })
                            return
                        }
                        response.send(CompileError({Error: "NO_AVAILABLE_REVIEWS"}))
                    });
                }
            }
        }
    }