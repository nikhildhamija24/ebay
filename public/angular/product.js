/**
 * Created by Nikhil-PC on 10/06/2016.
 */

var productApp = angular.module('productApp', []);

productApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});

productApp.controller('productController', function ($scope, $http) {
    
    $scope.submitData = function () {
        var obj = new Object();
        obj.title = $scope.title;
        obj.description = $scope.description;
        obj.quantity = $scope.quantity;
        obj.price = $scope.price;
        obj.bidding = $scope.bidding;

        $http({
            method : "POST",
            url : "/product",
            data : obj,
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then( function (response) {
            // alert(JSON.stringify(response));
            window.location.assign('/allProds');

        }, function (response) {

        });

    }

    // $scope.bid = true;
    // $scope.fix = true;
    //
    // $scope.selectBid = function () {
    //     $scope.bid = true;
    //     $scope.fix = true;
    // }
    //
    // $scope.selectFix = function () {
    //     $scope.bid = false;
    //     $scope.fix = false;
    // }
    
});



productApp.controller('allProductController', function ($scope, $http) {
    $scope.productArr = [];
    $scope.search = false;
    $http({
        method : "GET",

        url : "/getAllProducts"
    }).then(function (response) {

        // alert(JSON.stringify(response.data));
        //$scope.productArr.push(response.data);
        $scope.productArr = response.data;
        }, function (response) {
        }
    );
    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        $scope.user = res.user;
    }).error(function(res){

    });

    $scope.showsearch = function () {
        var obj = new Object();
        obj.searchx = $scope.searchbox;
        $scope.search = !$scope.search;
        $http({
            method : "POST",
            url : "/searchProduct",
            headers : {
                "content-type" : 'application/json'
            },
            data : obj

        }).then(function (response) {
            //alert(JSON.stringify(response));
            $scope.searchProductArr = response.data;
        }, function (response) {

        });
    };

});
