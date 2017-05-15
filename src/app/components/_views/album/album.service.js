'use strict';

angular.module('albumService', [])
    .factory('AlbumService',
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

                var apiUrl = SERVER_URL + '/api/album',
                    albumFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in albumFactory) {
                        if (albumFactory.hasOwnProperty(key)) {
                            albumFactory[key] = null;
                            delete albumFactory[key];
                        }
                    }
                    apiUrl = null;
                    albumFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 *
                 * @param id
                 * @returns {*}
                 */
                albumFactory.retrieveById = function (id) {
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
                 * Retrieve Albums by User Id
                 * @param id
                 * @returns {*}
                 */
                albumFactory.retrieveByUser = function (id) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/user/" + id;

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
                 * Retrieve Albums by Topic
                 * @param id
                 * @returns {*}
                 */
                albumFactory.retrieveByTopic = function (id, page) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/topic/" + id + "?page=" + page;

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
                 * Remove Album And Galleries By Id
                 * @param id
                 * @returns {*}
                 */
                albumFactory.deleteById = function (id) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/delete/" + id;

                    $http.post(url, {timeout: deferred.promise})
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
                albumFactory.updateViews = function (id) {
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

                return albumFactory;
            }]);