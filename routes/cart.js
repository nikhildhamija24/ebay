/**
 * Created by Nikhil-PC on 10/07/2016.
 */

var mysql = require('./mysql');
// var mysql = require('./mysqlConPool');
var log = require('./logger');


exports.addToCart = function (req, res) {

    var uid = req.session.userid;
    var pid = req.param("productId");

    var selectQuantity = parseInt(req.param("selectedQuantity"))+1;

    var sqlQuery = "insert into shoppingcart(userId, productId, selectedQuantity) values ("+ uid+", "+pid+", "+selectQuantity+");";

    log.info("POST ","/addToCart ", "by ", uid, " posted productId ", pid, " called at ", new Date().toLocaleString());

    mysql.insertData(function (err, rows) {
        var json_response;
        if(err){
            console.log("error in insert to cart");
            throw err;
        }else{
            if(rows){
                res.render('shoppingCart', function (err, data) {
                    if(err) console.log(err);
                    res.end(data);
                });
            }else{
                json_response = {"statusCode" : 401};
                res.send(json_response);
            }
        }
    }, sqlQuery);
};

exports.getTheCart = function (req, res) {
    // var sqlQuery = "select * from shoppingcart INNER JOIN products ON shoppingcart.productId = products.productId INNER JOIN ebaysignup" +
    //     " ON shoppingcart.userId = ebaysignup.userid WHERE products.itemQuantity >= shoppingcart.selectedQuantity";

    var sqlQuery = "select * from shoppingcart INNER JOIN products ON shoppingcart.productId = products.productId WHERE " +
        "shoppingcart.userId="+ req.session.userid +" AND products.itemQuantity >= shoppingcart.selectedQuantity;";

    log.info("GET ","/getCart ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.fetchData(function (err, rows) {

        if(err){
            console.log("error in fetch data");
            throw err;
        }else{
            if(rows.length > 0){
                var obj = new Object();
                var sum = 0;
                var i = 0;
                //console.log(rows);
                for(i = 0; i<rows.length; i++){
                    sum = sum + (rows[i].itemPrice * rows[i].selectedQuantity);
                }
                obj.items = rows;
                obj.sum = sum;
                res.send(obj);
            }else {
                console.log("fetch returned null");
            }
        }
    }, sqlQuery)
};

exports.getCartPage = function (req, res) {
    res.render('shoppingCart', function (err, data) {
        if(err){
            console.log("Error in cart page" + err);
        }else {
            log.info("GET ","/cartPage ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            res.end(data);
        }
    });
};

exports.deleteFromCart = function (req, res) {
    var ms = require('mysql');
    var prodId = req.param("productId");
    var prodCount = req.param("selectedQuantity");
    var deleteQuery = "delete from shoppingcart where productId="+prodId+";";
    

    mysql.deleteData(function (err, result) {
        if(err){
            console.log("error in delete Query");
            throw err;
        }
        log.info("POST ","/deleteFromCart ", "by ", req.session.userid, " deleted ", prodId, " called at ", new Date().toLocaleString());


        // var sqlQuery = "select * from products INNER JOIN shoppingcart ON products.productId = shoppingcart.productId INNER JOIN " +
        //     "ebaysignup ON shoppingcart.userId = ebaysignup.userid where products.itemQuantity >= shoppingcart.selectedQuantity;";
        var sqlQuery = "select * from shoppingcart INNER JOIN products ON shoppingcart.productId = products.productId WHERE " +
            "shoppingcart.userId="+ req.session.userid +" AND products.itemQuantity >= shoppingcart.selectedQuantity";

        mysql.fetchData(function (err, rows) {
            if(err){
                console.log("error in cart remove query");
                throw err;
            } else {
                console.log(rows);

                var obj = new Object();
                obj.cartData = rows;
                var i = 0;
                var sum = 0;
                for(i=0; i<rows.length; i++){
                    sum = sum + rows[i].itemPrice * rows[i].selectedQuantity;
                }
                obj.cartTotal = sum;
                res.send(obj);
            }
        }, sqlQuery);
    }, deleteQuery);
};

exports.modifyCart = function (req, res) {

};

