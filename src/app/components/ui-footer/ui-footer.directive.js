'use strict';

angular.module('uiFooterDirective', [])
    .directive('uiFooter',
        [
            '$window',

            function ($window) {

                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/ui-footer/ui-footer.directive.html',
                    link: function (scope, element) {

                        var body = document.getElementsByTagName('body')[0],
                            watchers = [],
                            window = angular.element($window);

                        window.bind('resize', refreshBodyMargin);

                        function refreshBodyMargin() {
                            body.style.paddingBottom = element[0].offsetHeight + 'px';
                        }

                        // Init
                        (function () {
                            refreshBodyMargin();
                        })();

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            window.unbind('resize');

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