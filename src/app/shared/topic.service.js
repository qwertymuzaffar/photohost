'use strict';

angular.module('topicService', [])
    .factory('TopicService',
        [
            '$http',
            '$q',
            '$rootScope',

            function ($http,
                      $q,
                      $rootScope) {

                //--------------------------------------------------------------------------------
                //
                // Private
                //
                //--------------------------------------------------------------------------------

                var apiUrl = SERVER_URL + '/api/topic',
                    topicFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in topicFactory) {
                        if (topicFactory.hasOwnProperty(key)) {
                            topicFactory[key] = null;
                            delete topicFactory[key];
                        }
                    }
                    apiUrl = null;
                    topicFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 * Retrieve Topics
                 * @returns {*}
                 */
                topicFactory.retrieve = function () {
                    var deferred = $q.defer();

                    $http.get(apiUrl, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return topicFactory;
            }]);