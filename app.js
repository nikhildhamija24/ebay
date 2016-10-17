var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var CronJob = require('cron').CronJob;


var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var signin = require('./routes/signin');
var mysql = require('./routes/mysql');
// var mysql = require('./routes/mysqlConPool');
var user = require('./routes/userHome');
var prodDetails = require('./routes/product');
var cart = require('./routes/cart');
var pay = require('./routes/validatePayment');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName : 'session',
  secret : 'cmpe273_ebay_project',
  duration : 30*60*1000,
  activeDuration : 5*60*1000
}));

app.use('/', routes);

var checkLoggedIn = function (req, res, next) {
  if(req.session.userid){
    next();
  }else {
      res.render('home');
  }
};

//get routes
app.get('/register', register.register);
app.get('/signin', signin.login);

app.get('/getUsername', signin.getUsername);
app.get('/product', checkLoggedIn, prodDetails.productDetails);
app.get('/allProds', checkLoggedIn, prodDetails.allProducts);
app.get('/getAllProducts', prodDetails.getAllProducts);
app.get('/cartPage', checkLoggedIn, cart.getCartPage);
app.get('/getCart', cart.getTheCart);
app.get('/userHome', checkLoggedIn, users.getUserHome);
app.get('/userProfile',user.getUserProfile);
app.get('/soldProducts', user.getSoldProducts);
app.get('/userBoughtProducts', user.getBoughtProducts);
app.get('/payment', checkLoggedIn, pay.validatePayment);
app.get('/logout', signin.logout);

//post routes
app.post('/register', register.signup);
app.post('/signinPage', signin.checkLogin);
app.post('/userUpdate', user.updateUserProfile);
app.post('/payment', pay.validatePayment);
app.post('/product', prodDetails.addProduct);
app.post('/searchProduct', prodDetails.searchProduct);
app.post('/addToCart', cart.addToCart);
app.post('/addToBidCart', prodDetails.addToBid);
app.post('/deleteFromCart', cart.deleteFromCart);
app.post('/checkout', pay.checkout);

var CronJob = require('cron').CronJob;

var job = new CronJob('10 * * * * *', function () {
    console.log("cron job running");

  var sqlQuery = "Select * from products where postingDate <= NOW() - INTERVAL 4 DAY and bidding=\'true\';";
  mysql.cronFunction(function (err, rows) {
    if(err){
      console.log("Fetch cron error" + err);
    }else {
      if(rows.length == 0){
        console.log("null rows from cron fetch");
        // connection.end();
      }else {
          console.log(rows[0]);
        for(i in rows){
          var quantity = rows[i].itemQuantity;
            console.log("Quantity"+quantity);
          var sqlquery1 = "select * from bidTable where productId = " + rows[i].productId+" order by bidamount DESC;";
          mysql.cronFunction((function (quantityPartial, rowsPartial) {
            console.log("inside quant row partials");
              return function (err, biddata) {
                if(err) console.log(err);
                else {
                    console.log("biddata"+JSON.stringify(biddata));
                      if(biddata.length === 0){
                          console.log("biddata length 0");
                        var delQuery = "delete from products where productId =" + rowsPartial.productId;
                        mysql.cronFunction(function (err, results) {

                        }, delQuery);
                      }

                  for(var j in biddata){
                    if(biddata[j].selectedQuantity < quantityPartial){
                      console.log("inside biddata");

                      var productId = rowsPartial.productId;
                      var itemName = rowsPartial.itemName;
                      var itemDescription = rowsPartial.itemDescription;
                      var sellerName = rowsPartial.sellerName
                      var quantity = parseInt(biddata[j].selectedQuantity);
                      var itemPrice = parseFloat(biddata[j].bidamount);
                      var userEmail = null;
                      var userid = biddata[j].userid;

                      var sqlQuery2 = "insert into userhistorydata set productId="+ productId +", itemName='"+ itemName + "', itemDescription='" +
                              itemDescription + "', sellerName='"+ sellerName + "', transactionType='bought', quantity="+ quantity + ", itemPrice="+ itemPrice +", userEmail="+
                              "null, userid="+ userid + ";";
                      mysql.cronFunction(function (err, data) {
                          if(err) throw err;
                          var sqlQuery3 = "delete from bidTable where productId=" + rowsPartial.productId + ";";
                          mysql.cronFunction(function (err, data) {
                              if(err) throw err;
                              var sqlQuery4 = "Delete from products where productId=" + rowsPartial.productId+ ";";
                              mysql.cronFunction(function (err, data) {
                                  if(err) throw err;
                                  console.log("bid finished");
                              }, sqlQuery4);
                          }, sqlQuery3);
                      }, sqlQuery2);
                        quantityPartial = quantityPartial - biddata[j].selectedQuantity;
                    }
                  }

                }
              }

          })(quantity, rows[i]), sqlquery1);
        }
      }
    }
  }, sqlQuery);

}, null, true, 'America/Los_Angeles');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
