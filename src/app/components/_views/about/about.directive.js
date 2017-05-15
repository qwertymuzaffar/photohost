'use strict';

angular.module('aboutDirective', [])
    .directive('about',
        [

            function () {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/_views/about/about.directive.html',
                    link: function (scope) {

                        var watchers = [];

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

                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                };
            }]);