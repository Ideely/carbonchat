(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('landingController', function ($scope, $http, $q, $firebaseObject) {
        $scope.user.email = "";
        $scope.user.password = "";

        console.log('in landing controller');

        //Get our firebase object
        var url = firebaseSettings.location;
        var fireRef = new Firebase(url);
        var obj = $firebaseObject(fireRef.child("app_settings"));

        console.log('loading: ' + url);

        obj.$loaded().then(function () {
            console.log('loaded');

            // To iterate the key/value pairs of the object, use angular.forEach()
            angular.forEach(obj, function (value, key) {
                console.log(key, value);
            });

        });
    });
})();