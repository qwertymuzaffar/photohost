'use strict';

angular.module('uiHeaderDirective', [])
    .directive('uiHeader',
        [
            '$cookieStore',
            '$rootScope',
            '$ConfigService',
            'LocalizationService',

            function ($cookieStore,
                      $rootScope,
                      $ConfigService,
                      Localization) {

                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/ui-header/ui-header.directive.html',
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

                        scope.showSignInModal = false;
                        scope.showSignUpModal = false;
                        scope.showFeedbackModal = false;

                        //--------------------------------------------------------------------------------
                        //
                        // Private Functions
                        //
                        //--------------------------------------------------------------------------------

                        function onHideSignInModal() {
                            scope.showSignInModal = false;
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }
                            onHideSignInModal = null;
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

                        /**
                         * Show Sign In Form
                         */
                        scope.signIn = function () {
                            scope.showSignInModal = !scope.showSignInModal;
                        };

                        /**
                         * Show Sign Up Form
                         */
                        scope.signUp = function () {
                            scope.showSignUpModal = !scope.showSignUpModal;
                        };

                        /**
                         * Show Feedback Form
                         */
                        scope.feedback = function () {
                            scope.showFeedbackModal = !scope.showFeedbackModal;
                        };

                        scope.signOut = function () {
                            $cookieStore.remove('photohost-token');
                            $ConfigService.currentUser = null;
                            $ConfigService.isLoggedIn = null;
                        };

                        scope.onChangeLanguage = function (language) {
                            Localization.getLocalization(language)
                                .then(function (locale) {
                                    $cookieStore.put('photohost-language', language);
                                    $rootScope.$$phase || $rootScope.$apply();
                                });
                        };

                        //--------------------------------------------------------------------------------
                        //
                        // Watchers
                        //
                        //--------------------------------------------------------------------------------

                        watchers.push($rootScope.$on('signIn', onHideSignInModal));
                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                };
            }]);