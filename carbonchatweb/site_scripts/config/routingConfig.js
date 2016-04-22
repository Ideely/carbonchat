(function () {

    var carbonchatApp = angular.module('carbonchatApp');

    carbonchatApp.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('landing', {
                url: '/landing',
                views: {
                    content: {
                        templateUrl: '/templates/landing.html',
                        controller: 'landingController'
                    }
                }
            })
          .state('chatting', {
              url: '/chat',

              views: {
                  banner: {
                      templateUrl: '/templates/banner.html',
                      controller: 'bannerController'
                  },
                  nav: {
                      templateUrl: '/templates/navbar.html',
                      controller: 'navController'
                  },
                  content: {
                      templateUrl: '/templates/chatting.html',
                      controller: 'chattingController'
                  }
              }
          })
        .state('profie', {
            url: '/profile',
            views: {
                banner: {
                    templateUrl: '/templates/banner.html',
                    controller: 'bannerController'
                },
                nav: {
                    templateUrl: '/templates/navbar.html',
                    controller: 'navController'
                },
                content: {
                    templateUrl: '/templates/profile.html',
                    controller: 'profileController'
                }
            }
        });
    });

    //Check if the user is authenticated, if not, send to login screen
    carbonchatApp.run(['$route', '$rootScope', "$location", 'authenticationService', '$state',
        function ($route, $rootScope, $location, $state, $scope) {
            
            $rootScope.$on('logout', function (event, data) {
                $location.path("/landing");
            });

            $rootScope.$on("$stateChangeStart", function (event, next, curent) {

                /*
                console.log('Do we have a token saved?');
                console.log(authenticationService.isLoggedIn());

                if (authenticationService.isLoggedIn() == false) {
                    $location.path("/landing");
                }
                */
            });

        }]);

    

})();