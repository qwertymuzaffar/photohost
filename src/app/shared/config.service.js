'use strict';

angular.module('configService',
    [
        'userService'
    ])
    .factory('$ConfigService',
        [
            '$http',
            '$q',
            '$rootScope',
            '$cookieStore',
            'UserService',

            function ($http,
                      $q,
                      $rootScope,
                      $cookieStore,
                      UserService) {

                var configFactory = {};

                configFactory.currentUser = null;
                configFactory.displayName = "";
                configFactory.isLoggedIn = false;
                configFactory.localiz = {};

                //---------------------------------------------------------------------------------
                //
                //  Image Options
                //
                //---------------------------------------------------------------------------------

                configFactory.allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];
                configFactory.maxSizeMb = 10;
                configFactory.maxSizeByte = configFactory.maxSizeMb * 1048576;
                configFactory.maxHeight = 5000;
                configFactory.maxWidth = 5000;

                //---------------------------------------------------------------------------------
                //
                //  URL Path
                //
                //---------------------------------------------------------------------------------

                configFactory.siteDir = 'http://fpicture.ru';

                //---------------------------------------------------------------------------------
                //
                //  Ad
                //
                //---------------------------------------------------------------------------------

                configFactory.ad = '<a href="#ad">Ad</a>';

                //---------------------------------------------------------------------------------
                //
                //  Date to create directories
                //
                //---------------------------------------------------------------------------------

                /**
                 *
                 * @param user
                 */
                configFactory.updateCurrentUser = function (user) {
                    if (user) {
                        configFactory.currentUser = user;
                    } else {
                        UserService.getCurrentUser()
                            .then(function (user) {
                                configFactory.currentUser = (user.email) ? user : null;
                            }, function (err) {
                                console.log(err);
                            });
                    }
                };

                return configFactory;
            }]);