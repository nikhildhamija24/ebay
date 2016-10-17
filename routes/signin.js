/**
 * Created by Nikhil-PC on 09/29/2016.
 */

var mysql = require('./mysql');
// var mysql = require('./mysqlConPool');
var bcrypt = require('bcryptjs');
var log = require('./logger');

exports.getSignInPage = function (req, res) {
    res.render('signin', function (err, data) {
        if(err){
            console.error(err);
        }else{
            res.end(data);
        }
    });
}


exports.checkLogin = function(req, res) {
    var json_response;
    var useremail = req.param("userEmail");
    var userpass = req.param("userPassword");

    var sqlQuery = "Select * from ebaysignup where email='" + req.param("userEmail") + "';" ;

    mysql.fetchData(function (err, data) {
        if (err) {
            console.error(err);
        }else {
            var hash = data[0].password;
            bcrypt.compare(userpass, hash, function (err, valid) {
                if (valid == true) {
                    req.session.userid = data[0].userid;
                    req.session.username = data[0].firstname;
                    req.session.useremail = data[0].email;
                    req.session.loginTime = new Date().toLocaleString();

                    log.info("GET ","/signin ", " user ", req.session.userid, " logged in at ", new Date().toLocaleString());

                    res.render("home");
                    var updateQuery = "update ebaysignup SET signintime = '"+ req.session.loginTime +"' where userid = "+ req.session.userid +";";
                    mysql.updateData(function (err, data) {
                        if(err){
                            console.log("Error in update signin time"+err);
                        }
                    }, updateQuery);

                } else {
                    res.render('signin');
                }
            });
        }
    }, sqlQuery);

};
    
exports.login = function (req, res) {
    if(req.session.userid){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('allProducts', function (err, data) {
            if(err){
                console.log("login error" + err);
            }else{
                res.end(data);
            }
        });
    }else{
        res.render('signin');
    }
};

exports.getUsername = function (req, res) {
    var obj = new Object();
    obj.user = req.session.username
    obj.lastLogin = req.session.loginTime;
    res.send(obj);
}

exports.logout = function (req, res) {
    var sqlQuery = "update ebaysignup SET signouttime = '"+ new Date().toLocaleString() +"' where userid = "+ req.session.userid +" ;";
    mysql.updateData(function (err, data) {
        if(err){
            console.error("Error in updating time"+err);
            throw err;
        }else {
            log.info("POST ","/logout ", " user ", req.session.userid, " logged out at ", new Date().toLocaleString());
        }
    }, sqlQuery);
    req.session.destroy();
    res.redirect('/');
};