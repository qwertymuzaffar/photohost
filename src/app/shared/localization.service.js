"use strict";

angular.module('localizationService', [])
    .service('LocalizationService',
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

                var localizCanceler,
                    service = this,
                    userLang = $cookieStore.get('photohost-language') || navigator.language || navigator.userLanguage,
                    unDestroy;

                function getLanguageFolder(lang) {
                    if (['ru', 'en', 'tj'].indexOf(lang) > -1) {
                        switch (lang) {
                            case 'en':
                                lang = 'en-US';
                                break;
                            case 'tj':
                                lang = 'tj-TJ';
                                break;
                            default:
                                lang = 'ru-RU';
                        }
                    }
                    return lang;
                }

                /**
                 * Clean up
                 */
                function onDestroy() {
                    unDestroy();
                    onDestroy = null;

                    for (var key in service) {
                        if (service.hasOwnProperty(key)) {
                            service[key] = null;
                            delete service[key];
                        }
                    }
                    service = null;
                    unDestroy = null;
                }

                //--------------------------------------------------------------------------------
                //
                // Public Functions
                //
                //--------------------------------------------------------------------------------

                this.getLocalization = function (language) {
                    localizCanceler = $q.defer();
                    $http.get('localization/' + language + '/localization.json')
                        .then(function (result) {
                            var localiz = result.data;
                            for (var key in localiz) {
                                if (localiz.hasOwnProperty(key)) {
                                    $ConfigService.localiz[key] = localiz[key];
                                }
                            }
                            localizCanceler.resolve(result.data);
                        }, function (err) {
                            console.log(err);
                            localizCanceler.reject(err);
                        });

                    return localizCanceler.promise;
                };

                //--------------------------------------------------------------------------------
                //
                // Init
                //
                //--------------------------------------------------------------------------------

                (function () {
                    userLang = getLanguageFolder(userLang);
                    service.getLocalization(userLang);
                })();

                unDestroy = $rootScope.$on('$destroy', onDestroy);

                return service;
            }]);