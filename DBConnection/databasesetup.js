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
                    this.connection.end();
                    return reject(err);
                }
                resolve(result);
            });
            this.connection.end();
        });
    }

    InsertPizza(pizzaname) {
        let query = 'INSERT INTO `PIZZAS` SET ?';
        let pizzadata = { NAME: pizzaname }

        return new Promise((resolve, reject) => {
            this.connection.query(query, pizzadata, (err, result) => {
                if (err) {
                    this.connection.end();
                    return reject(err);
                }
                resolve(result);
            });
            this.connection.end();
        });
    }

    RelatePizzashopAndPizza(pizzashopid, pizzaid) {
        let query = 'INSERT INTO `RELATEPIZZASHOPSPIZZAS` SET ?';
        let pizzadata = { SHOPID: pizzashopid, PIZZAID: pizzaid}

        return new Promise((resolve, reject) => {
            this.connection.query(query, pizzadata, (err, result) => {
                if (err) {
                    this.connection.end();
                    return reject(err);
                }
                resolve(result);
            });
            this.connection.end();
        });
    }

    InsertReview(userid, RelatId, review, rating) {
        let query = 'INSERT INTO `REVIEWS` SET ?';
        let pizzadata = { USERID: userid, TOPIC: RelatId, REVIEW: review, RATING: rating}

        return new Promise((resolve, reject) => {
            this.connection.query(query, pizzadata, (err, result) => {
                if (err) {
                    this.connection.end();
                    return reject(err);
                }
                resolve(result);
            });
            this.connection.end();
        });
    }

    DeleteReview(reviewId) {
        let query = 'DELETE FROM `reviews` WHERE ?';
        let requestData = {reviewId: reviewId};

        return new Promise((resolve, reject) => {
            this.connection.query(query, requestData, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                resolve(result);
            });
          this.connection.end();
        });
    }


    RetrieveUser(username){
        let query = 'SELECT `ID`, `USERNAME`, `EMAIL`  FROM `USER` WHERE ? ORDER by TMSTAMP DESC limit 1';
        let tokendata = { USERNAME: username}

        return new Promise((resolve, reject) => {
            this.connection.query(query, tokendata, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
            this.connection.end();
        });
    }

    InsertUser(username, email){
        let query = 'INSERT INTO `USER` SET ?';
        let tokendata = { USERNAME: username, EMAIL: email}

        return new Promise((resolve, reject) => {
            this.connection.query(query, tokendata, (err, result) => {
                if (err) {
                    this.connection.end();
                    return reject(err);
                }
                resolve(result);
            });
            this.connection.end();
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



    this.GetUser = function (req,res,next){
        if (!req.body.username){
            res.sendStatus(403);
            return;
        }
        let con = new DatabaseConnection();
        if (!con.error) {
            con.RetrieveUser(req.body.username).then((result) => {
                req.user = result;
                if (result.length > 0)
                    next();
                else
                    res.sendStatus(403);
                console.log(result)
            })
            .catch((err) => { res.sendStatus(403);});
        }
    }

    this.AddUser = function (req,res){
        if (!req.body.username || !req.body.email){
            res.sendStatus(403);
            return;
        }

        let con = new DatabaseConnection();
        if (!con.error) {
            con.InsertUser(req.body.username, req.body.email).then((result) => {
                res.send("user added" + result.insertId);
            })
            .catch((err) => { res.sendStatus(403);});
        }
    }

    this.CheckUser = function (req,res,next){
        if (!req.body.username){
            res.sendStatus(403);
            return;
        }
        let con = new DatabaseConnection();
        if (!con.error) {
            con.RetrieveUser(req.body.username).then((result) => {
                req.user = result;
                if (result.length > 0)
                    res.sendStatus(403);
                else
                    next();
                console.log(result)
            })
            .catch((err) => { res.sendStatus(403);});
        }
    }

    this.DeleteReview = function (recdata, request, response, CSuccess, CError){
        let con = new DatabaseConnection();
        if (!con.error) {
            con.DeleteReview(recdata.reviewId).then((result) => {
                response.send(CSuccess("REVIEW_DELETED", request.url, recdata));
            })
            .catch((err) => { response.send(CError(err, request.url+4));
            });
        }
    }

    this.DeleteReview = function (recdata, request, response, CSuccess, CError){
        let con = new DatabaseConnection();
        if (!con.error) {
            con.DeleteReview(request.body.reviewId,request.body.reviewText,Number(recdata.rating)).then((result) => {
                response.send(CSuccess("REVIEW_DELETED", request.url, recdata));
            })
            .catch((err) => { response.send(CError(err, request.url+4));
            });
        }
    }

    
}