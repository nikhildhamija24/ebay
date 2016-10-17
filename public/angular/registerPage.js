/**
 * Created by Nikhil-PC on 09/25/2016.
 */
var registerApp = angular.module("registerApp", []);


registerApp.controller('registerController', function($scope, $http){
    $scope.signInFlag = true;
    $scope.registerFlag = true;
    $http({
        method: "GET",
        url: "/getUsername"
    }).success(function(res){
        // alert(JSON.stringify(res));
        // $scope.loginTab = !$scope.loginTab;
        $scope.user = res.user;
        $scope.lastLogin = res.lastLogin;
    }).error(function(res){

    });
    $scope.signInClicked = function(){
        $scope.registerFlag = false;
    };

    $scope.registerClicked = function () {
        $scope.signInFlag = false;
    };

});


