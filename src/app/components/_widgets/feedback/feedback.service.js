'use strict';

angular.module('feedbackService', [])
    .factory('FeedbackService',
        [
            '$http',
            '$q',
            '$rootScope',

            function ($http,
                      $q,
                      $rootScope) {

                //--------------------------------------------------------------------------------
                //
                // Private Variables
                //
                //--------------------------------------------------------------------------------

                var apiUrl = SERVER_URL + '/api/feedback',
                    feedbackFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in feedbackFactory) {
                        if (feedbackFactory.hasOwnProperty(key)) {
                            feedbackFactory[key] = null;
                            delete feedbackFactory[key];
                        }
                    }
                    apiUrl = null;
                    feedbackFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 *
                 * @param data
                 * @returns {*}
                 */
                feedbackFactory.send = function (data) {
                    var deferred = $q.defer();

                    $http.post(apiUrl, data, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return feedbackFactory;
            }]);