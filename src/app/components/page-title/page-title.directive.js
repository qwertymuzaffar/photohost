angular.module('pageTitleDirective', [])
    .directive('pageTitle',
        [
            '$interpolate',
            '$rootScope',
            '$state',
            '$timeout',

            function ($interpolate,
                      $rootScope,
                      $state,
                      $timeout) {

                return {
                    restrict: 'A',
                    scope: {},
                    link: function (scope, element, attrs) {

                        //--------------------------------------------------------------------------------
                        //
                        // Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var titleElement = attrs['title-element'] || 'pageTitle',
                            watchers = [];

                        //--------------------------------------------------------------------------------
                        //
                        // Private Functions
                        //
                        //--------------------------------------------------------------------------------

                        /**
                         * $stateChangeSuccess listener
                         * @param event
                         * @param toState
                         */
                        function listener(event, toState) {
                            $timeout(function () {
                                var interpolationContext;

                                if (typeof $state.$current.locals === 'undefined') {
                                    interpolationContext = $state.$current;
                                } else {
                                    interpolationContext = $state.$current.locals.globals;
                                }

                                var title = $interpolate(toState.data[titleElement])(interpolationContext);

                                element.text(title);
                            });
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }

                            listener = null;
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
                        // Watchers and Listeners
                        //
                        //--------------------------------------------------------------------------------

                        watchers.push($rootScope.$on('$stateChangeSuccess', listener));
                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                }
            }]);