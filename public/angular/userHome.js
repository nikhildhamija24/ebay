/**
 * Created by Nikhil-PC on 10/04/2016.
 */

var fetchdata = angular.module('fetchdata', []);

fetchdata.controller('userController', function ($scope, $http) {

    var obj = new Object();
    $scope.productArr = [];

    $scope.editform = false;

    $scope.editInfo = function () {
        $scope.editform = true;
    }

    $http({
        method : "GET",
        url : "/userProfile"
    }).then(function (response) {
        // alert(JSON.stringify(response));
        $scope.userbday = response.data.bday;
        $scope.ebayhandle = response.data.handle;
        $scope.location = response.data.loc;
        $scope.contact = response.data.contact;
        // $scope.user = response;
        // window.location.assign('/userProfile');
    }, function (response) {
        
    });
    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        $scope.user = res.user;
    }).error(function(res){

    });
    
    $http({
        method : "GET",
        url : "/soldProducts"
    }).then(function (response) {
        $scope.productArr = response.data;
    }, function (response) {

    });

    $http({
        method:"GET",
        url:"/userBoughtProducts"
    }).then(function (response) {
        // alert(JSON.stringify(response));
        $scope.historyArr = response.data;
    }, function (response) {

    });
    
    $scope.userUpdate = function () {
        var obj = new Object();
        obj.userbday = $scope.userbday;
        obj.ebayhandle = $scope.ebayhandle;
        obj.location = $scope.location;
        obj.contact = $scope.contact;

        $http({
            method : "POST",
            url : "/userUpdate",
            data : obj,
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then( function (response) {
            //alert(JSON.stringify(response));
            window.location.assign('/userHome');

        }, function (response) {
            
        });
    }


});