'use strict';

angular.module('authInterceptorService',
    [
        'ngCookies'
    ])
    .factory('AuthInterceptorService',
        [
            '$cookieStore',
            '$q',
            '$rootScope',

            function ($cookieStore,
                      $q,
                      $rootScope) {

                var authInterceptor = {};

                authInterceptor.request = function (config) {
                    config.headers = config.headers || {};
                    if ($cookieStore.get('photohost-token')) {
                        config.headers.Authorization = $cookieStore.get('photohost-token');
                    }
                    return config;
                };

                authInterceptor.responseError = function (res) {
                    if (res.status === 401) {
                        $cookieStore.remove('photohost-token');
                        return $q.reject(res);
                    } else {
                        return $q.reject(res);
                    }
                };

                return authInterceptor;
            }]);