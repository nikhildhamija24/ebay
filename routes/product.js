/**
 * Created by Nikhil-PC on 09/30/2016.
 */

var mysql = require('./mysql');
// var mysql = require('./mysqlConPool');
var log = require('./logger');
var bidlog = require('./bidlogger');

exports.productDetails = function (req, res) {
    res.render('productDetails', function (err, data) {
        if(err){
            console.error(err);
        }else{
            log.info("GET ","/product ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            res.end(data);
        }
    });
};

exports.allProducts = function (req, res) {
    res.render('allProducts', function (err, data) {
        if(err){
            console.error(err);
        }else{
            log.info("GET ","/allProds ", "by ", req.session.userid, " called at ", new Date().toLocaleString());
            res.end(data);
        }
    });
};

exports.addProduct = function(req, res){
    var title = req.param("title");
    var description = req.param("description");
    var quantity = req.param("quantity");
    var price = req.param("price");
    var seller = req.session.username;
    var bidding = req.param("bidding");

    var sqlQuery = "insert into ebay.products (userid, sellerName, itemName, itemDescription, itemQuantity, bidding, itemPrice)" +
        " values ("+req.session.userid+", '"+seller+"', '"+ title + "', '" + description+"', '" + quantity + "', '" + bidding +"', '" + price+"');";

    log.info("POST ","/product ", "by ", req.session.userid, " added new product ", title, " at ", new Date().toLocaleString());

    mysql.insertData(function (err, rows) {
        var json_response;
        if(err){
            console.log("error in product insert");
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

exports.getAllProducts = function(req, res){

    var sqlQuery = "select * from ebay.products;"; //+req.session.userid +"';";

    log.info("GET ","/getAllProducts ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.fetchData(function (err, rows) {
        if(err){
            console.log("error in fetch products");
            throw err;
        }else{
            if(rows.length > 0) {
                //console.log(rows);
                
                res.send(rows);
            }else {
                console.log("fetch returned null");
            }
        }
    }, sqlQuery);

};

exports.searchProduct = function (req, res) {
    var searchItem = req.body.searchx;
    console.log(searchItem);
    var sqlQuery = "select * from products where itemName Like '%" + searchItem +"%';";

    log.info("POST ","/searchProduct ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    mysql.fetchData(function (err, rows) {
        if(err){
            console.log("Error in search" + err);
        }else {
            if(rows.length > 0){
                res.send(rows);
            }else {
                console.log("No matching products found");
            }
        }
    }, sqlQuery);
};

exports.addToBid = function (req, res) {
    
    var productId = req.param("productId");
    var userid = req.session.userid;
    var bidamount = parseFloat(req.param("itemPrice")) + parseFloat(req.param("userBid"));
    var selectedQuantity = parseInt(req.param("selectedQuantity"))+1;

    var obj = new Object();
    obj.productId = productId;
    obj.userid = userid;
    obj.bidamount = bidamount;
    obj.postingDate = new Date();
    
    var sqlQuery = "insert into bidTable (productId, userid, bidamount, selectedQuantity) values ("+ productId +", "+userid+", " +
            bidamount + ", " + selectedQuantity + ") on duplicate key update selectedQuantity = "+selectedQuantity+", bidamount = "+ bidamount +";";
        // "postingDate="+ new Date().getDate()+ new Date().getTime() +";";

    log.info("POST ","/addToBidCart ", "by ", req.session.userid, " called at ", new Date().toLocaleString());

    bidlog.info("POST ", "/addToBidCart ", "New bid posted by ", req.session.userid, " at ", new Date().toLocaleString());

    mysql.insertData(function (err, rows) {
        if(err){
            console.log("Cannot insert into bid table "+ err);
            throw err;
        }else {


            res.render('allProducts');
        }
    }, sqlQuery);
};