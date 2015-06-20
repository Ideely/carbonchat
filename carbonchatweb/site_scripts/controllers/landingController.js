(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('landingController', function ($scope, $http, $q, $firebaseObject) {
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
            console.log('trying to authenticate');

            fireRef.authWithPassword({
                "email": $scope.user.email,
                "password": $scope.user.password
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                    //create a user
                    createUser();
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                }
            });

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
            //This function will take the userId, the user's email, password, and join date and will create a new object for them
            fireRef.child("app_data").child("users").put(userId, {
                email: $scope.user.email,
                authentication_ids: {
                    "carbonchat": {
                        email: $scope.user.email,
                        password: $scope.user.password
                    }
                },
                role: "User",
                join_date: 

            });
        }       //NEED TO FINISH

    });
})();