/*
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "$firebaseObject", "authService", "messageService", "$state", function ($scope, $http, $q, $firebaseObject, authService, messageService, $state) {
        $scope.firebaseSettings = {
            location: "https://carbonchat.firebaseio.com/"
        };


        $scope.site = {
            url: "",
            name: "",
            slogan: ""
        }


        var url = $scope.firebaseSettings.location;
        var fireRef = new Firebase(url);

        var obj = $firebaseObject(fireRef.child("app_settings"));
        obj.$loaded().then(function () {
            // To iterate the key/value pairs of the object, use angular.forEach()
            angular.forEach(obj, function (value, key) {
                if (key == 'slogan')
                    $scope.site.slogan = value;
                else if (key == 'url')
                    $scope.site.url = value;
                else if (key == 'name')
                    $scope.site.name = value;
                console.log(key, value);
            });
        });                         //Set the settings for the app

        $scope.sendMessage = function () {
            //Need to save this message to the firebase

        }

    }]);

})();