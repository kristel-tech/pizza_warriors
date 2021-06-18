const sendrequest = require('request');
const connect = require("../DBConnection/databasesetup.js");
const keys = require("../secrats/keys.js");

let errorshit = "error";
let successshit = "success";

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
    this.AddReview = function(request, response) {
        let result
        if (request.body.placeid)
            sendrequest('https://maps.googleapis.com/maps/api/place/details/json?place_id=' + request.body.placeid + '&key=' + keys, { json: true }, (err, res, body) => {
                if (err || body.status == "INVALID_REQUEST")
                    response.send(errorshit);

                let data = {
                    placeid: request.body.placeid,
                    name: body.result.name,
                    pizzaname: request.body.pizzaname,
                    userid: request.body.USERID,
                    review: request.body.REVIEW,
                    rating: request.body.RATING
                }

                let connection = new connect()
                result = connection.AddReview(data, request, response,CompileSuccess, CompileError);
            })

    }

}
