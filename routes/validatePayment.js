/**
 * Created by Nikhil-PC on 10/08/2016.
 */

var log = require('./logger');

var checkValidCard = function(cardnum) {

    if (/[^0-9-\s]+/.test(cardnum)) return false;

    var numptr = 0, numdptr = 0, isPositionEven = false;
    cardnum = cardnum.replace(/\D/g, "");

    for (var n = cardnum.length - 1; n >= 0; n--) {
        var cDigit = cardnum.charAt(n),
            numdptr = parseInt(cDigit, 10);

        if (isPositionEven) {
            if ((numdptr *= 2) > 9) numdptr -= 9;
        }

        numptr += numdptr;
        isPositionEven = !isPositionEven;
    }

    return (numptr % 10) == 0;
};

var checkValidYear = function(month,year) {
    return ((month != 'Month') && (parseInt(year)>16));
};

var checkValidName = function(name){
    return ((name.length != 0));
};
var checkValidCvv = function(cvv){
    var reg = new RegExp('^[0-9]+$');
    if(/[^0-9\s]+/.test(cvv)) return  false;
    return (cvv.length == 3);
};
/**
 * New node file
 */
exports.validatePayment = function(req, res){
    console.log(req.body.cardholdername);
    console.log(req.body.cardnumber);
    console.log(req.body.expirymonth);
    console.log(req.body.expiryyear);
    console.log(req.body.test);
    var isValidCreditCardNum = checkValidCard(req.body.cardnumber);
    var cardNumPrompt = '';
    if(!isValidCreditCardNum)
        cardNumPrompt = 'Invalid card number';
    var isValidYear = checkValidYear(req.body.expirymonth,req.body.expiryyear);
    var cardValidYEaPrompt = '';
    if(!isValidYear)
        cardValidYEaPrompt = 'Invalid year';
    var isValidName = checkValidName(req.body.cardholdername);
    var cardValidNAme = '';
    if(!isValidName)
        cardValidNAme = 'Invalid name';
    var isValidCVV = checkValidCvv(req.body.cvv);
    var cardValidCVV = '';
    if(!isValidCVV)
        cardValidCVV = 'Invalid CVV';

    if(!isValidCVV || !isValidName || !isValidYear || !isValidCreditCardNum )
    {
        //{ title: '', cardnameerr:'',cardnumerr: '',invaliddate:'',invalidcvv:'' }
        var prompt = new Object();
        prompt.title = "Your Card information ";
        prompt.cardnameerr = cardValidNAme;
        prompt.cardnumerr = cardNumPrompt;
        prompt.invaliddate = cardValidYEaPrompt;
        prompt.invalidcvv = cardValidCVV;
        res.render('payment', prompt );
    }
    else
    {
        var mysql = require("mysql");
        var connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'qwerty123',
            database : 'ebay',
            port : 3306
        });

        connection.connect(function(err){
            if(err){
                console.log('Error connecting to Db');
                return;
            }

            var query =  connection.query('insert into userhistorydata(productId,itemName,itemDescription,sellerName,' +
                'transactionType,quantity,itemPrice,userEmail,userid,postingDate) select products.productId,itemName,' +
                'itemDescription,sellerName,\'bought\',selectedQuantity,itemPrice,ebaysignup.email,' +
                'ebaysignup.userid,postingDate from products  INNER JOIN shoppingcart ON products.productId = shoppingcart.productId' +
                ' INNER JOIN ebaysignup ON shoppingcart.userId = ebaysignup.userid where products.itemQuantity >= shoppingcart.selectedQuantity;',
                function (err, result) {
                    if (err) throw err;

                    log.info("POST ", "/payment ", " Called by ", req.session.userid, " at ", new Date().toLocaleString());

                    query = connection.query('update products inner join shoppingcart on shoppingcart.productId=' +
                        'products.productId set products.itemQuantity = products.itemQuantity - shoppingcart.selectedQuantity' +
                        ' where shoppingcart.selectedQuantity <= products.itemQuantity and shoppingCart.userId=' +
                        req.session.userid + ';', function (err, result) {
                        if (err) throw  err;
                        //--
                        query = connection.query('delete from shoppingcart where userId = ?', req.session.userid, function (err, result) {
                            if (err) throw err;

                            log.info("Data posted to user history of ", req.session.userid, " at ", new Date().toLocaleString());
                            //--
                            query = connection.query('delete from products where itemQuantity = 0', function (err, result) {
                                if (err) throw err;
                                //--
                                connection.end(function (err) {

                                });
                                //--
                            });
                            //--
                        });
                    });

                });
                    //--
        });
        res.render('allProducts', { err: '' });
    }
};
exports.checkout = function(req,res)
{
    res.render('payment', { title: 'Credit Card Info', cardnameerr:'',cardnumerr: '',invaliddate:'',invalidcvv:'' });
};
