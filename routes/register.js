/**
 * Created by Nikhil-PC on 09/25/2016.
 */
var mysql = require('./mysql');
// var mysql = require('./mysqlConPool');
var bcrypt = require('bcryptjs');
var log = require('./logger');

exports.register = function(req, res){
    res.render('register', function (err,data) {
       if(err){
           console.error(err);
       } else{
           res.end(data);
       }
    });
};

exports.signup = function(req, res){

    var upass = req.body.pass;

    bcrypt.genSalt(10, function (err, salt) {

        bcrypt.hash(upass, salt, function (err, hash) {

           var sqlQuery = "insert into ebaysignup(firstname, lastname, email, password) values ('" +req.param("fname")+
               "', '"+req.param("lname")+ "', '"+ req.param("registeremail")+ "', '" + hash + "');";
           mysql.insertData(function(err){
               if(err){
                   console.log("Sign up failed");
                   throw err;
               }else{
                   log.info("POST "," /register called at ", new Date().toLocaleString());
                   res.render('signin', function (err, data) {
                       if(err){
                           console.log(err);
                       }else{
                           res.end(data);
                       }
                   });
               }

           }, sqlQuery);
       })
    });
};