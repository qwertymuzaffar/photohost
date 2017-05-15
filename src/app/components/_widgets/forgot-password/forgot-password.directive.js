'use strict';

angular.module('forgotPasswordDirective',
    [])
    .directive('forgotPassword',
        [
            '$rootScope',
            '$ConfigService',
            'AuthService',

            function ($rootScope,
                      $ConfigService,
                      AuthService) {
                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_widgets/forgot-password/forgot-password.directive.html',
                    link: function (scope) {

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var watchers = [];

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //--------------------------------------------------------------------------------

                        scope.config = $ConfigService;
                        scope.localiz = $ConfigService.localiz;
                        scope.flashMessage = '';

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Functions
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
                        //  Public Functions
                        //
                        //--------------------------------------------------------------------------------

                        scope.onSendPassword = function () {
                            scope.loading = true;
                            if (scope.email) {
                                AuthService.forgot(scope.email)
                                    .then(function (message) {
                                        scope.loading = false;
                                        scope.flashMessage = message;
                                    }, function (error) {
                                        scope.flashMessage = error;
                                    });
                            }
                        };

                        //--------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //--------------------------------------------------------------------------------

                        watchers.push(scope.$on('$destroy', onDestroy));

                        //--------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //--------------------------------------------------------------------------------

                        $rootScope.$emit('signIn');
                    }
                };
            }]);