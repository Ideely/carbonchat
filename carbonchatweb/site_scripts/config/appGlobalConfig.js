/*
    Here is where we'll store some global configuration parameters
*/

(function () {
    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.constant('firebaseSettings', {
        'location': 'https://carbonchat.firebaseio.com/'
    });
})();