/**
 * Created by Nikhil-PC on 09/29/2016.
 */

var ejs = require('ejs');
var mysql = require('mysql');

function getConnection() {
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'qwerty123',
        database : 'ebay',
        port : 3306
    });
    return connection;
};

function fetchData(callback, sqlQuery) {
    console.log("\n Sql Query: " + sqlQuery);
    var connection = getConnection();
    var data;
    connection.query(sqlQuery, function(err, rows){
        if(err){
            console.log("ERROR: " + err.message);
            callback(err, 0);
        }else{
            callback(err, rows);
        }
    });

    connection.end(function (err) {
        console.log("\nConnection closed..");
    });
};

function insertData(callback, sqlQuery){
    console.log("\n Sql Query: " + sqlQuery);
    var connection = getConnection();
    connection.query(sqlQuery, function(err, rows){
        if(err){
            console.log(err);
            console.log("inserterr");
        }else{
            console.log("Insert successful");
            callback(err, rows);
        }
    });
    connection.end(function (err) {
        console.log("\nConnection closed..");
    });
};

function updateData(callback, sqlQuery){
    console.log("\n Sql Query: "+ sqlQuery);
    var connection = getConnection();
    connection.query(sqlQuery, function(err, result){
        if(err){
            console.log(err);
        }else{
            console.log("update successful");
            callback(err, result);
        }
    });
    connection.end(function (err) {
        console.log("\nConnection closed..");
    });
};

function deleteData(callback, sqlQuery){
    console.log("\n Sql Query: "+ sqlQuery);
    var connection = getConnection();
    connection.query(sqlQuery, function(err, result){
        if(err){
            console.log(err);
        }else{
            console.log("delete successful");
            callback(err, result);
        }
    });
    connection.end(function (err) {
        console.log("\nConnection closed..");
    });
};

function cronFunction(callback, sqlQuery){
    console.log("\n Sql Query: "+ sqlQuery);
    var connection = getConnection();
    connection.query(sqlQuery, function(err, result){
        if(err){
            console.log(err);
        }else{
            console.log("cron successful");
            callback(err, result);
        }
    });
};

exports.getConnection = getConnection;
exports.fetchData = fetchData;
exports.insertData = insertData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.cronFunction = cronFunction;