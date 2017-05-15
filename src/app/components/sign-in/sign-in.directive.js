'use strict';

angular.module('signInWidgetDirective',
    [
        '$rememberService'
    ])
    .directive('signIn',
        [
            '$location',
            '$rootScope',
            '$state',
            '$stateParams',
            '$ConfigService',
            '$RememberService',
            'AuthService',

            function ($location,
                      $rootScope,
                      $state,
                      $stateParams,
                      $ConfigService,
                      $RememberService,
                      AuthService) {

                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/sign-in/sign-in.directive.html',
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
                        scope.userData = {};
                        /**
                         * TODO: Create Directive AlertMessageBox (or use another name for directive)
                         * TODO: and use instead of flashMessage in every template
                         */
                        scope.flashMessage = {};
                        scope.remember = false;
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

                        scope.signin = function () {
                            scope.loading = true;
                            var credentials = {
                                username: scope.user.username,
                                password: scope.user.password
                            };

                            AuthService.signin(credentials)
                                .then(function () {
                                    scope.loading = false;
                                    $rootScope.$emit('signIn');

                                    if (scope.remember) {
                                        $RememberService('username', scope.user.username);
                                        $RememberService('password', scope.user.password);
                                    }
                                })
                                .catch(function (error) {
                                    scope.loading = false;
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