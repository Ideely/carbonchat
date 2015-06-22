(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('landingController', ["$scope", "$http", "$q", "$firebaseObject", "authService", "$state", function ($scope, $http, $q, $firebaseObject, authService, $state) {
        $scope.firebaseSettings = {
            location: "https://carbonchat.firebaseio.com/"
        };

        $scope.user = {
            email: "",
            password: ""
        };

        $scope.applicationText = {
            url: "",
            name: "",
            slogan: ""
        }

        //Get our firebase object
        var url = $scope.firebaseSettings.location;
        var fireRef = new Firebase(url);
        var obj = $firebaseObject(fireRef.child("app_settings"));

        obj.$loaded().then(function () {
            console.log('loaded');

            // To iterate the key/value pairs of the object, use angular.forEach()
            angular.forEach(obj, function (value, key) {
                if (key == 'slogan')
                    $scope.applicationText.slogan = value;
                else if (key == 'url')
                    $scope.applicationText.url = value;
                else if (key == 'name')
                    $scope.applicationText.name = value;
                console.log(key, value);
            });
        });                         //Set the settings for the app

        $scope.authUser = function() {

            console.log(authService);
            var authData = authService.authCarbonChat(fireRef, $scope.user.email, $scope.user.password);

            authData.then(function (authData) {
                console.log(authData);

                //change state to go to the chatting state
                $state.go('chatting');
            }).error;
        };       //Attempt to authenticate the user
        function createUser() {
            var deferred = q.deferred();

            fireRef.createUser({
                email: $scope.user.email,
                password: $scope.user.password
            }, function (error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }

                    deferred.reject(error.code);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    deferred.resolve(userData.uid);
                }
            });

            return deferred.promise;

        }               //Create a new user
        function addUserToMemberTable(userId) {
            
        }       //NEED TO FINISH

    }]);
})();