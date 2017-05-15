'use strict';

angular.module('noAdDirective', [])
    .directive('noAd',
        [
            '$ConfigService',

            function ($ConfigService) {
                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    template: '<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-8154263518110533"\n     data-ad-slot="5440454600"\n     data-ad-format="auto"></ins>',
                    link: function (scope) {

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var watchers = [],
                            adsbygoogle;

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //--------------------------------------------------------------------------------

                        scope.config = $ConfigService;

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
                            watchers = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                        }

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Functions
                        //
                        //--------------------------------------------------------------------------------

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

                        (function () {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                        })();
                    }
                };
            }]);