'use strict';

angular.module('galleryService', [])
    .factory('GalleryService',
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

                var apiUrl = SERVER_URL + '/api/gallery',
                    galleryFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in galleryFactory) {
                        if (galleryFactory.hasOwnProperty(key)) {
                            galleryFactory[key] = null;
                            delete galleryFactory[key];
                        }
                    }
                    apiUrl = null;
                    galleryFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 * Upload Images, also create new Album
                 * @param data
                 * @returns {*|promise}
                 */
                galleryFactory.upload = function (data) {
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

                /**
                 * Retrieve Images by Album Id
                 * @param id
                 * @returns {*}
                 */
                galleryFactory.retrieveByAlbum = function (id) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/album/" + id;

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
                 * Update Album And Galleries By Album Id
                 * @param data
                 * @returns {*}
                 */
                galleryFactory.updateByAlbum = function (data) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/album/" + data.album._id;

                    $http.post(url, data, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                /**
                 * Retrieve Image by Id
                 * @param id
                 * @returns {*}
                 */
                galleryFactory.retrieveById = function (id) {
                    var deferred = $q.defer(),
                        url = apiUrl + "/" + id;

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
                 * Update Views by Id
                 * @param id
                 * @returns {*}
                 */
                galleryFactory.updateViews = function (id) {
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

                /**
                 *
                 * @param path
                 * @returns {*|promise}
                 */
                galleryFactory.delete = function (path) {
                    var deferred = $q.defer();

                    $http.put(apiUrl, {path: path}, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return galleryFactory;
            }]);