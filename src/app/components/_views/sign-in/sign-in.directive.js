'use strict';

angular.module('signInDirective',
    [
        '$rememberService'
    ])
    .directive('signInPage',
        [
            '$location',
            '$state',
            '$stateParams',
            '$ConfigService',
            '$RememberService',
            'AuthService',

            function ($location,
                      $state,
                      $stateParams,
                      $ConfigService,
                      $RememberService,
                      AuthService) {

                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_views/sign-in/sign-in.directive.html',
                    link: function (scope) {

                        //--------------------------------------------------------------------------------
                        //
                        // Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var watchers = [];

                        //--------------------------------------------------------------------------------
                        //
                        // Public Variables
                        //
                        //--------------------------------------------------------------------------------

                        scope.user = {};
                        /**
                         * TODO: Create Directive AlertMessageBox (or use another name for directive)
                         * TODO: and use instead of flashMessage in every template
                         */
                        scope.flashMessage = {};
                        scope.remember = false;

                        //--------------------------------------------------------------------------------
                        //
                        // Private Functions
                        //
                        //--------------------------------------------------------------------------------

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }
                            onDestroy = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                            watchers = null;
                        }

                        //--------------------------------------------------------------------------------
                        //
                        // Public Functions
                        //
                        //--------------------------------------------------------------------------------

                        scope.signin = function () {
                            var credentials = {
                                username: scope.user.username,
                                password: scope.user.password
                            };

                            AuthService.signin(credentials)
                                .then(function (message) {

                                    if (message) {
                                        scope.flashMessage.error = message;
                                    } else {
                                        if ($stateParams.next) {
                                            $location.path($stateParams.next).search('next', null);
                                        } else {
                                            $state.go('home');
                                        }

                                        if (scope.remember) {
                                            $RememberService('username', scope.user.username);
                                            $RememberService('password', scope.user.password);
                                        }
                                    }
                                })
                                .catch(function (error) {
                                    scope.flashMessage.error = error;
                                    //TODO: PhotoHost: Show some error to simple user
                                    console.log(error);
                                });
                        };

                        //TODO: Refactor: Use instead this function, Remember-Me module on server-side for security
                        scope.rememberMe = function () {
                            if (!scope.remember) {
                                $RememberService('username', '');
                                $RememberService('password', '');
                            }
                        };

                        //--------------------------------------------------------------------------------
                        //
                        // Watchers
                        //
                        //--------------------------------------------------------------------------------

                        watchers.push(scope.$on('$destroy', onDestroy));

                        //--------------------------------------------------------------------------------
                        //
                        // Init
                        //
                        //--------------------------------------------------------------------------------

                        (function () {
                            //TODO: Refactor: Use instead this function, Remember-Me module on server-side for security
                            if ($RememberService('username') && $RememberService('password')) {
                                scope.remember = true;
                                scope.user.username = $RememberService('username');
                                scope.user.password = $RememberService('password');
                            }

                        })();
                    }
                };
            }]);