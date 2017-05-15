'use strict';

angular.module('signUpDirective', [])
    .directive('signUp',
        [
            '$state',
            'AuthService',
            '$ConfigService',

            function ($state,
                      AuthService,
                      $ConfigService) {
                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/sign-up/sign-up.directive.html',
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

                        scope.config = $ConfigService;
                        scope.localiz = $ConfigService.localiz;

                        scope.user = {};
                        scope.flashMessage = {};
                        scope.loading = false;

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

                        scope.signup = function () {
                            scope.loading = true;
                            AuthService.signup(scope.user)
                                .then(function (message) {
                                    scope.loading = false;
                                    scope.flashMessage.error = '';
                                    scope.flashMessage.success = message;
                                })
                                .catch(function (error) {
                                    scope.loading = false;
                                    scope.flashMessage.success = '';
                                    scope.flashMessage.error = error;
                                });
                        };

                        //--------------------------------------------------------------------------------
                        //
                        // Watchers
                        //
                        //--------------------------------------------------------------------------------

                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                };
            }]);