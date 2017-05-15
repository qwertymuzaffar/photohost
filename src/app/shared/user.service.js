'use strict';

angular.module('userService', [])
    .factory('UserService',
        [
            '$cookieStore',
            '$http',
            '$q',
            '$rootScope',

            function ($cookieStore,
                      $http,
                      $q,
                      $rootScope) {

                //--------------------------------------------------------------------------------
                //
                // Private
                //
                //--------------------------------------------------------------------------------

                //TODO: After production change apiUrl
                var apiUrl = SERVER_URL + '/api/user',
                    userFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in userFactory) {
                        if (userFactory.hasOwnProperty(key)) {
                            userFactory[key] = null;
                            delete userFactory[key];
                        }
                    }
                    apiUrl = null;
                    userFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                userFactory.updateProfile = function (userdata) {
                    var deferred = $q.defer(),
                        url = apiUrl + '/update';
                    
                    $http.put(url, userdata, {timeout: deferred.promise})
                        .then(function (res) {
                            deferred.resolve(res.data);
                        }, function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                };

                /**
                 *
                 * @returns {Promise}
                 */
                userFactory.getCurrentUser = function () {
                    var deferred = $q.defer(),
                        url = apiUrl + '/current';

                    $http.get(url, {timeout: deferred.promise})
                        .then(function (res) {
                            deferred.resolve(res.data);
                        }, function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                return userFactory;
            }]);