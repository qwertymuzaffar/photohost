'use strict';

angular.module("analyticsService", [])
    .factory('AnalyticsService',
        [
            function () {
                //--------------------------------------------------------------------------------
                //
                // Private Variables
                //
                //--------------------------------------------------------------------------------

                var Analytics = {};

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                Analytics.recordPageViewGA = function (url) {
                    ga('set', 'page', url);
                    ga('send', 'pageview');
                };

                return Analytics;
            }
        ]);