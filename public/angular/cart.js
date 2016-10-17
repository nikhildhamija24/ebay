/**
 * Created by Nikhil-PC on 10/08/2016.
 */
var cartApp = angular.module('cartApp', []);

cartApp.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min);
        max = parseInt(max);
        for (var i=min; i<=max; i++)
            input.push(i);
        return input;
    };
});

cartApp.controller('cartController', function ($scope, $http) {
    $scope.productArr = [];
    var sum = 0;
    $http({
        method:"GET",
        url:"/getCart"
    }).then(function (response) {
            // alert(JSON.stringify(response.data));
            $scope.productArr = response.data.items;
            $scope.cartTotal = response.data.sum;

    }, function (response) {
        
    });
    
    $scope.removeProduct = function (productId, selectedQuantity) {
        var obj = new Object();
        obj.productId = productId;
        obj.selectedQuantity = selectedQuantity;
        $http({
            method : "POST",
            url : "/deleteFromCart",
            headers : {
                'content-type' : 'application/json'
            },
            data : obj
        }).then(function (response) {
            // alert(JSON.stringify(response));
            $scope.productArr = response.data.cartData;
            $scope.cartTotal = response.data.cartTotal;
        }, function (response) {

        });
    };

    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        
        $scope.user = res.user;
    }).error(function(res){

    });
    
    
});

