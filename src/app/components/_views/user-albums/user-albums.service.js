'use strict';

angular.module('userAlbumsService', [])
    .factory('UserAlbumsService',
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

                //TODO: After production change apiUrl
                var apiUrl = SERVER_URL + '/api/album',
                    userAlbumsFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in userAlbumsFactory) {
                        if (userAlbumsFactory.hasOwnProperty(key)) {
                            userAlbumsFactory[key] = null;
                            delete userAlbumsFactory[key];
                        }
                    }
                    apiUrl = null;
                    userAlbumsFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 * Retrieve Images by User
                 * @returns {*}
                 */
                userAlbumsFactory.retrieveByUser = function (page) {
                    var deferred = $q.defer(),
                        url = apiUrl + '/user' + "?page=" + page;

                    $http.get(url, {timeout: deferred.promise})
                        .success(function (res) {
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return userAlbumsFactory;
            }]);