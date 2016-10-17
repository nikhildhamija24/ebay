/**
 * Created by Nikhil-PC on 10/16/2016.
 */
var express = require('express')
    , request = require('request')
    , assert = require("assert")
    , http = require("http");

describe('ebay test', function(){
    console.log("hello");
    it('should return the home page if the url is correct', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not return the signin page if the url is wrong', function(done){
        http.get('http://localhost:3000/signin', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should sign up the new user being passed', function(done){
        request.post('http://localhost:3000/register',
            {form: {fname:'tom', lname : 'hanks', registeremail : 'tom.hanks@sjsu.edu', pass : 'qwerty'}},
            function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });

    it('should login to ebay', function(done){
        request.post(
            'http://localhost:3000/signinPage',
            { form: { userEmail: 'nikhil.dhamija@sjsu.edu', userPassword:'qwerty' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('should return as a wrong url', function(done){
        http.get('http://localhost:3000/registerUser', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

});