'use strict';

angular.module('homeDirective',
    [
        'configService',
        'topicDirective'
    ])
    .directive('home',
        [
            '$stateParams',
            '$state',
            '$ConfigService',

            function ($stateParams,
                      $state,
                      $ConfigService) {

                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_views/home/home.directive.html',
                    link: function (scope) {

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //---------------------------------------------------------------------------------

                        var watchers = [];

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //---------------------------------------------------------------------------------

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

                        scope.config = $ConfigService;

                        //---------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //---------------------------------------------------------------------------------

                        watchers.push(scope.$on('$destroy', onDestroy));

                        //---------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //---------------------------------------------------------------------------------

                        (function () {
                            if ($stateParams.v) {
                                var albumId = $stateParams.v.match(/(\d{4}-\d{2})-(\d{2})_(\w{25})(.*)/);
                                delete $stateParams.v;
                                $state.go('album', {albumId: albumId[3]});
                            }
                        })();
                    }
                };
            }]);