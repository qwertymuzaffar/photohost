'use strict';

angular.module('authService',
    [
        'configService'
    ])
    .factory('AuthService',
        [
            '$cookieStore',
            '$http',
            '$q',
            '$rootScope',
            '$ConfigService',

            function ($cookieStore,
                      $http,
                      $q,
                      $rootScope,
                      $ConfigService) {

                //--------------------------------------------------------------------------------
                //
                // Private
                //
                //--------------------------------------------------------------------------------

                var apiUrl = SERVER_URL + '/api/user',
                    authFactory = {},
                    unDestroy;

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in authFactory) {
                        if (authFactory.hasOwnProperty(key)) {
                            authFactory[key] = null;
                            delete authFactory[key];
                        }
                    }
                    apiUrl = null;
                    authFactory = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                /**
                 * Sign In
                 * @param user
                 * @param callback
                 * @returns {Promise}
                 */
                authFactory.signin = function (user, callback) {
                    var deferred = $q.defer(),
                        url = apiUrl + '/signin';

                    $http.post(url, user, {timeout: deferred.promise})
                        .success(function (res) {
                            if (!res.token) {
                                deferred.reject(res)
                            } else {
                                $cookieStore.put('photohost-token', res.token);
                                $ConfigService.currentUser = res.user;
                                $ConfigService.displayName = res.user.firstName || res.user.username;
                                $ConfigService.isLoggedIn = true;
                                $rootScope.$$phase || $rootScope.$apply();
                                deferred.resolve(res);
                            }
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                /**
                 * Sign Up
                 * @param user
                 * @returns {Promise}
                 */
                authFactory.signup = function (user) {
                    var deferred = $q.defer(),
                        url = apiUrl + '/signup';

                    $http.post(url, user, {timeout: deferred.promise})
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                };

                /**
                 *
                 * @param email
                 * @returns {Promise}
                 */
                authFactory.forgot = function (email) {
                    var deferred = $q.defer(),
                        url = apiUrl + '/forgot';

                    $http.post(url, {email: email}, {timeout: deferred.promise})
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                };

                /**
                 *
                 * @returns {Promise}
                 */
                authFactory.signout = function () {
                    var deferred = $q.defer(),
                        url = apiUrl + '/signout';

                    $http.get(url, {timeout: deferred.promise})
                        .success(function (res) {
                            $cookieStore.remove('photohost-token');
                            $rootScope.$emit('logout');
                            $ConfigService.currentUser = null;
                            $ConfigService.isLoggedIn = false;
                            $rootScope.$$phase || $rootScope.$apply();
                            deferred.resolve(res);
                        })
                        .error(function (err) {
                            deferred.reject(err);
                        });

                    return deferred.promise;
                };

                /**
                 *
                 * @returns {Promise}
                 */
                authFactory.getCurrentUser = function () {
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

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return authFactory;
            }]);