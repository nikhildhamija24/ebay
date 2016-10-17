/**
 * Created by Nikhil-PC on 10/04/2016.
 */

var mysql = require('./mysql');
// var mysql = require('./mysqlConPool');
 var log = require('./logger');

exports.getUserProfile = function(req, res){

    var sqlQuery = "select userbday, ebayhandle, location, contact from ebaysignup where userid ="+req.session.userid +";";

    log.info("GET ","/userProfile ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.fetchData(function (err, rows) {
        if(err){
            console.log("error in fetch");
            throw err;
        }else{
            if(rows.length > 0) {
                var bday = rows[0].userbday;
                var handle = rows[0].ebayhandle;
                var loc = rows[0].location;
                var contact = rows[0].contact;
                var json_response = new Object();
                json_response.bday = bday;
                json_response.handle = handle;
                json_response.loc = loc;
                json_response.contact = contact;

                res.send(json_response);
            }else{
                console.log("fetch returned 0");
            }
        }
    }, sqlQuery);
};

exports.updateUserProfile = function (req, res) {
    var bday = req.param("userbday");
    var handle = req.param("ebayhandle");
    var location = req.param("location");
    var contact = req.param("contact");
    var sqlQuery = "update ebaysignup Set userbday='"+ bday + "', ebayhandle='"+ handle +"', " +
                    "location='"+ location +"', contact='"+ contact +"' where userid="+req.session.userid +";";

    log.info("POST ", "/userUpdate ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.updateData(function(err, rows){
        var json_response;
        if(err){
            console.log("error in update");
            throw err;
        }else{
            if(rows){
                json_response = {"statusCode" : 200};
                res.send(json_response);
            }else{
                json_response = {"statusCode" : 401};
                res.send(json_response);
            }
        }
    }, sqlQuery);
};

exports.getSoldProducts = function (req, res) {
    var sqlQuery = "select * from ebay.products where userid="+req.session.userid+";";

    log.info("GET ","/soldProducts ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.fetchData(function (err, rows) {
        if(err){
            console.log("error in fetch products");
            throw err;
        }else{
            if(rows.length > 0) {

                res.send(rows);

            }else {
                console.log("fetch returned null");
            }
        }
    }, sqlQuery);
};

exports.getBoughtProducts = function (req, res) {
    var sqlQuery = "Select * from userhistorydata where userid="+req.session.userid+" AND transactionType=\'bought\';";

    log.info("GET ","/boughtProducts ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.fetchData(function (err, rows) {
        if(err){
            console.error(err);
            throw err;
        }else{
            if(rows.length > 0){

                res.send(rows);
                
            }else {
                console.log("error in fetch of userhistory");
            }
        }
    }, sqlQuery);
};