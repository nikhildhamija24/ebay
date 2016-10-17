/**
 * Created by Nikhil-PC on 10/11/2016.
 */

var mysql = require('mysql');

var pool = [];

function getConnection(){
  var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'qwerty123',
        database : 'ebay',
        port : 3306
  });
   return connection;
};

for(var i=0; i<100; i++){
    pool.push(getConnection());
}

function getAConnection() {
    var conn = pool.pop();
    if(conn == undefined){
        conn = getConnection();
    }
    return conn;
}

function releaseAConnection(connection){
    pool.push(connection);
}

function fetchData(callback, sqlQuery){
    var connection = getAConnection();
    connection.query(sqlQuery, function (err, rows) {
        if(err){
            console.log("ERROR in pool: " + err.message);
            callback(err, 0);
        }else{
            callback(err, rows);
            console.log("Pool released");
            releaseAConnection(connection);
        }
    });
};

function insertData(callback, sqlQuery){
    var connection = getAConnection();
    connection.query(sqlQuery, function (err, rows) {
        if(err){
            console.log("ERROR in pool: " + err.message);
            callback(err, 0);
        }else{
            callback(err, rows);
            console.log("Pool released");
            releaseAConnection(connection);
        }
    });
};

function updateData(callback, sqlQuery){
    var connection = getAConnection();
    connection.query(sqlQuery, function (err, rows) {
        if(err){
            console.log("ERROR in pool: " + err.message);
            callback(err, 0);
        }else{
            callback(err, rows);
            console.log("Pool released");
            releaseAConnection(connection);
        }
    });
};

function deleteData(callback, sqlQuery){
    var connection = getAConnection();
    connection.query(sqlQuery, function (err, rows) {
        if(err){
            console.log("ERROR in pool: " + err.message);
            callback(err, 0);
        }else{
            callback(err, rows);
            console.log("Pool released");
            releaseAConnection(connection);
        }
    });
};

function cronFunction(callback, sqlQuery){
    var connection = getAConnection();
    connection.query(sqlQuery, function (err, rows) {
        if(err){
            console.log("ERROR in pool: " + err.message);
            callback(err, 0);
        }else{
            callback(err, rows);
            console.log("Pool released");
            releaseAConnection(connection);
        }
    });
};

exports.fetchData = fetchData;
exports.insertData = insertData;
exports.updateData = updateData;
exports.deleteData = deleteData;
exports.cronFunction = cronFunction;