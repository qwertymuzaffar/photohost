'use strict';

angular.module('blogService', [])
    .factory('BlogService',
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

                var apiUrl = SERVER_URL + '/api/post',
                    blogFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in blogFactory) {
                        if (blogFactory.hasOwnProperty(key)) {
                            blogFactory[key] = null;
                            delete blogFactory[key];
                        }
                    }
                    apiUrl = null;
                    blogFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 * Retrieve Posts
                 * @returns {*}
                 */
                blogFactory.retrieve = function (page) {
                    var deferred = $q.defer(),
                        url = apiUrl + '?page=' + page;

                    $http.get(url, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                /**
                 *
                 * @param id
                 * @returns {*}
                 */
                blogFactory.retrieveById = function (id) {
                    var deferred = $q.defer();

                    $http.get(apiUrl + "/" + id, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                /**
                 * Update Views by Id
                 * @param id
                 * @returns {*}
                 */
                blogFactory.updateViews = function (id) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/" + id;

                    $http.post(url, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });
                    return deferred.promise;
                };

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return blogFactory;
            }]);