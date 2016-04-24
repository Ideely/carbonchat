/*co
    This is the controller that controlls the behavior of the chatting functionality
*/

(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.controller('chattingController', ["$scope", "$http", "$q", "authenticationService", "messageService", "appService", "$state", function ($scope, $http, $q, authenticationService, messageService, appService, $state) {
        var q = $q;
        $scope.credentials = {
            uid: ""
        };
        $scope.user = {
            name: "",
            userId: "",
            gender: "",
            friends: ""
        };
        $scope.message = {
            text: "",
            to: [],
            timestamp: "",
            from: "",
            location: "",
            attachments: []
        };

        var cachedQuery, lastSearch;

        //For autocomplete for the recipients of the message
        function querySearch(criteria) {

            console.log($scope.user.friends);
            
            cachedQuery = cachedQuery || criteria;

            var results = [];

            angular.forEach($scope.user.friends, function (element, index) {
                if (angular.lowercase(element.name).indexOf(criteria) > -1) {
                    results.push(element);
                }
            });

            return cachedQuery ? results : [];
        }
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            console.log(lowercaseQuery);

            return function filterFn(contact) {
                return (angular.lowercase(contact.name).indexOf(lowercaseQuery) != -1);;
            };
        }

        //get the user's auth credentials from the auth service
        $scope.credentials = authenticationService.getCredentials();
        console.log($scope.credentials);

        //get the user's information from the user's table
        var userInfoPromise = authenticationService.getUserInformation($scope.credentials.uid);
        userInfoPromise.then(function (data) {
            $scope.user = data;
            console.log(data);
        }).catch(function (err) {
            console.log("error getting user information");
        });

        //Create an attachment that will be send with the file
        var addedFiles = function (files) {

            //Add the base64 representation of the image to the message
            angular.forEach(files, function (flowFile, i) {
                var fileReader = new FileReader();

                fileReader.onload = function (event) {
                    var uri = event.target.result;
                    var type = flowFile.file.type;
                    var name = flowFile.file.name;

                    createAttachment(uri, type, name);
                    //$scope.message.attachments.push(uri);
                };
                fileReader.readAsDataURL(flowFile.file);
            });
        };
        var createAttachment = function (attachmentData, attachmentType, attachmentName) {
            //We need to save the type of image and the data
            var attachment = {
                data: "",
                type: "",
                name: ""
            };

            //save the relavent data
            attachment.data = attachmentData;
            attachment.type = attachmentType;
            attachment.name = attachmentName;

            //Add the attachment to the message
            $scope.message.attachments.push(attachment);
        };

        //Saving the message to the database
        var sendMessage = function () {
            //Need to save this message to the firebase
            var deferred = q.defer();
            var messageSavePromise;

            //Populate the rest of the message attributes
            $scope.message.from = $scope.user.userId;

            console.log($scope.message)

            messageSavePromise = messageService.writeMessage($scope.user.userId, $scope.message);
            messageSavePromise.then(
				function (data) {
				    
                    //Check our result
				    if (data.indexOf('Success') > -1) {
				        deferred.resolve("success");
				    } else {
				        deferred.resolve("Error");
				    }
				}
			);

            return deferred.promise;
        }

        //Mapping the functions
        $scope.sendMessage = sendMessage;
        $scope.querySearch = querySearch;
        $scope.addedFiles = addedFiles;

    }]);

})();