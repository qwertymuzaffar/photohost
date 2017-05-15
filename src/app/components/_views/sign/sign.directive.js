'use strict';

angular.module('signDirective', [])
    .directive('sign',
        [
            'AuthService',
            '$location',
            '$window',
            '$state',
            '$stateParams',
            function (AuthService,
                      $location,
                      $window,
                      $state,
                      $stateParams) {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/_views/sign/sign.directive.html',
                    link: function (scope) {

                        var selectedCons = "sign-button-selected",
                            signBtn = angular.element(document.getElementsByClassName(selectedCons)),
                            watchers = [];


                        scope.isSignIn = false;

                        scope.popup = {
                            content: 'Popup content here',
                            options: {
                                title: null,
                                placement: 'top',
                                delay: { show: 800, hide: 100 }
                            }
                        };

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }

                            onDestroy = null;
                            watchers = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                        }

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //---------------------------------------------------------------------------------

                        scope.user = {};

                        scope.sign = function (event) {
                            signBtn.removeClass(selectedCons);
                            signBtn = angular.element(event.target);
                            signBtn.addClass(selectedCons);
                            scope.isSignIn = !scope.isSignIn;
                        };

                        scope.signin = function () {
                            AuthService.signin(scope.user)
                                .then(function () {
                                    if ($stateParams.next) {
                                        $location.path($stateParams.next).search('next', null);
                                    } else {
                                        $state.go('home');
                                    }
                                })
                        };

                        scope.signup = function () {
                            AuthService.signup(scope.user)
                                .then(function () {
                                    $location.path('/');
                                })
                        };

                        scope.OAuth = function (provider) {
                            $window.location.href = '/auth/' + provider;
                        };

                        //---------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //---------------------------------------------------------------------------------
                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                };
            }])
    .directive('popup', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: '=',
            options: '=popup'
        },
        link: function(scope, element) {
            scope.$watch('ngModel', function(val) {
                element.attr('data-content', val);
            });

            var options = scope.options || {} ;

            var title = options.title || null;
            var placement = options.placement || 'top';
            var html = options.html || false;
            var delay = options.delay ? angular.toJson(options.delay) : null;
            var trigger = options.trigger || 'hover';

            element.attr('title', title);
            element.attr('data-placement', placement);
            element.attr('data-html', html);
            element.attr('data-delay', delay);
            element.attr('style', "color:black");
            element.popover({ trigger: trigger });
        }
    };
});