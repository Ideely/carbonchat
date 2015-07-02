/*
    This is the controller that controlls the behavior of the banner elements
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');
    carbonchatApp.controller('bannerController', [ "$scope", "$http", "$q", "authService", "messageService", "appService", "$state", "$timeout", function ($scope, $http, $q, authService, messageService, appService, $state, $timeout) {
        $scope.site = {
            title: "",
            slogan: "" 
        }

        appService.getAppInformation().then(
            function (app_info) {
                $scope.site = app_info;

                $timeout(function () {
                    $scope.$apply();
                });
            }, function (error) {
                console.log("getting application info error");
            }
        );



    }]);

})();