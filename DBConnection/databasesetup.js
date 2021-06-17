var mysql = require('mysql');
const DatabaseCreds = require("./config.js");

class DatabaseConnection {

    constructor() {
        try {
            this.connection = mysql.createConnection(DatabaseCreds);
            this.connection.connect(function(err) {
                if (err) {throw 'connection error';}
            });
        } catch (e) {
            this.error = true;
            console.log(e)
        }
        this.error = false;
    }

    InsertPizzashops(placeid, name) {
        let query = 'INSERT INTO `PIZZASHOPS` SET ?';
        let shopdata = { PLACEID: placeid, NAME: name }

        return new Promise((resolve, reject) => {
            this.connection.query(query, shopdata, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    InsertPizza(pizzaname) {
        let query = 'INSERT INTO `PIZZAS` SET ?';
        let pizzadata = { NAME: pizzaname }

        return new Promise((resolve, reject) => {
            this.connection.query(query, pizzadata, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    RelatePizzashopAndPizza(pizzashopid, pizzaid) {
        let query = 'INSERT INTO `RELATEPIZZASHOPSPIZZAS` SET ?';
        let pizzadata = { SHOPID: pizzashopid, PIZZAID: pizzaid}

        return new Promise((resolve, reject) => {
            this.connection.query(query, pizzadata, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

    InsertReview(userid, RelatId, review, rating) {
        let query = 'INSERT INTO `REVIEWS` SET ?';
        let pizzadata = { USERID: userid, TOPIC: RelatId, REVIEW: review, RATING: rating}

        return new Promise((resolve, reject) => {
            this.connection.query(query, pizzadata, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    }

}






module.exports = function() {
    this.AddReview = function(recdata, request, response, CSuccess, CError) {
        let con = new DatabaseConnection();
        if (!con.error) {
            console.log(recdata);
            con.InsertPizzashops(recdata.placeid, recdata.name).then((pizzashopsresult) => { 
                con.InsertPizza(recdata.pizzaname).then((pizzaresult) => { 
                    con.RelatePizzashopAndPizza(pizzashopsresult.insertId, pizzaresult.insertId).then((Relateresult) => { 
                        con.InsertReview(recdata.userid, Relateresult.insertId, recdata.review, Number(recdata.rating)).then((Reviewresult) => { 
 
                            response.send(CSuccess("REVIEW_ADD_SUCCESS", request.url, recdata));
                        })
                        .catch((err) => { response.send(CError(err, request.url+4));
                        });
                    })
                    .catch((err) => { response.send(CError(err, request.url+3));
                    });
                })
                .catch((err) => { response.send(CError(err, request.url+2));
            });
            })
            .catch((err) => { response.send(CError(err, request.url+1));});

            
        } else
            response.send("ERROR");
    }

}