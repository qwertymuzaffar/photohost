'use strict';

angular.module('photohostApp',
    [
        'authInterceptorService',
        'analyticsService',
        'authService',
        'albumService',
        'galleryService',
        'blogService',
        'configService',
        'localizationService',
        'userAlbumsService',
        'photohostFilters',
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ngTouch',
        'ngclipboard',
        'photohostDirective',
        'ui.router'
    ])
    .config([
        '$httpProvider',
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',

        function ($httpProvider,
                  $locationProvider,
                  $stateProvider,
                  $urlRouterProvider) {

            $httpProvider.interceptors.push('AuthInterceptorService');
            $urlRouterProvider.otherwise('/');
            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');

            var title = 'Фотохостинг эФПик';

            $stateProvider
                .state('home', {
                    url: '/?v',
                    views: {
                        'mainView@': {
                            template: '<home></home>'
                        }
                    },
                    data: {
                        pageTitle: title
                    }
                })
                .state('rules', {
                    parent: 'home',
                    url: 'rules',
                    views: {
                        'mainView@': {
                            template: '<rules></rules>'
                        }
                    },
                    data: {
                        pageTitle: 'Правила - ' + title
                    }
                })
                .state('about', {
                    parent: 'home',
                    url: 'about',
                    views: {
                        'mainView@': {
                            template: '<about></about>'
                        }
                    },
                    data: {
                        pageTitle: 'О сайте - ' + title
                    }
                })
                .state('upload', {
                    parent: 'home',
                    url: 'u/{albumId}',
                    views: {
                        'mainView@': {
                            template: '<upload-page></upload-page>'
                        }
                    },
                    data: {
                        pageTitle: '{{albumTitle}} - ' + title
                    },
                    resolve: {
                        albumTitle: [
                            '$stateParams',
                            'AlbumService',

                            function ($stateParams,
                                      AlbumService) {
                                return AlbumService.retrieveById($stateParams.albumId)
                                    .then(function (res) {
                                        return res.title;
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        ]
                    }
                })
                .state('album', {
                    parent: 'home',
                    url: 'a/{albumId}',
                    views: {
                        'mainView@': {
                            template: '<album-page></album-page>'
                        }
                    },
                    data: {
                        pageTitle: '{{albumTitle}} - ' + title
                    },
                    resolve: {
                        albumTitle: [
                            '$stateParams',
                            'AlbumService',

                            function ($stateParams,
                                      AlbumService) {
                                return AlbumService.retrieveById($stateParams.albumId)
                                    .then(function (res) {
                                        if (res === null) {
                                            return "";
                                        } else {
                                            return res.title;
                                        }

                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        ]
                    }
                })
                .state('gallery', {
                    parent: 'home',
                    url: 'g/{imageId}',
                    views: {
                        'mainView@': {
                            template: '<gallery-page></gallery-page>'
                        }
                    },
                    data: {
                        pageTitle: '{{galleryTitle}} - ' + title
                    },
                    resolve: {
                        galleryTitle: [
                            '$stateParams',
                            'GalleryService',

                            function ($stateParams,
                                      GalleryService) {
                                return GalleryService.retrieveById($stateParams.imageId)
                                    .then(function (res) {
                                        return res.title;
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        ]
                    }
                })
                .state('profile', {
                    parent: 'home',
                    url: 'profile',
                    views: {
                        'mainView@': {
                            template: '<profile></profile>'
                        }
                    },
                    data: {
                        pageTitle: 'Настройки Аккаунта - ' + title
                    },
                    loginRequired: true
                })
                .state('signin', {
                    parent: 'home',
                    url: 'signin?next',
                    views: {
                        'mainView@': {
                            template: '<sign-in-page></sign-in-page>'
                        }
                    },
                    data: {
                        pageTitle: 'Авторизация - ' + title
                    }
                })
                .state('sign', {
                    parent: 'home',
                    url: 'sign?next',
                    views: {
                        'mainView@': {
                            template: '<sign></sign>'
                        }
                    },
                    data: {
                        pageTitle: 'Настройки Аккаунта - ' + title
                    }
                })
                .state('userAlbums', {
                    parent: 'home',
                    url: 'my-albums',
                    views: {
                        'mainView@': {
                            template: '<user-albums></user-albums>'
                        }
                    },
                    data: {
                        pageTitle: 'Мои Альбомы - ' + title
                    },
                    loginRequired: true
                })
                .state('userAlbum', {
                    parent: 'userAlbums',
                    url: '/{albumId}',
                    views: {
                        'mainView@': {
                            template: '<user-album></user-album>'
                        }
                    },
                    data: {
                        pageTitle: 'Картинки одного альбома - ' + title
                    },
                    loginRequired: true
                })
                .state('forgotPassword', {
                    parent: 'home',
                    url: 'forgot',
                    views: {
                        'mainView@': {
                            template: '<forgot-password></forgot-password>'
                        }
                    },
                    data: {
                        pageTitle: 'Восстановление пароля - ' + title
                    }
                })
                .state('blog', {
                    parent: 'home',
                    url: 'blog/{postId}',
                    views: {
                        'mainView@': {
                            template: '<blog></blog>'
                        }
                    },
                    data: {
                        pageTitle: '{{blogTitle}} - ' + title
                    },
                    resolve: {
                        blogTitle: [
                            '$stateParams',
                            'BlogService',

                            function ($stateParams,
                                      BlogService) {
                                if (!$stateParams.postId) return 'Блог';

                                return BlogService.retrieveById($stateParams.postId)
                                    .then(function (res) {
                                        return res.title;
                                    }, function (err) {
                                        console.log(err);
                                    });
                            }
                        ]
                    }
                });
        }])
    .run([
        '$cookieStore',
        '$location',
        '$rootScope',
        '$state',
        '$stateParams',
        '$ConfigService',
        'AnalyticsService',
        'AuthService',
        'LocalizationService',

        function ($cookieStore,
                  $location,
                  $rootScope,
                  $state,
                  $stateParams,
                  $ConfigService,
                  AnalyticsService,
                  AuthService,
                  Localization) {

            function onStateChangeStart() {
                if ($cookieStore.get('photohost-token') && !$ConfigService.currentUser) {
                    AuthService.getCurrentUser()
                        .then(function (user) {
                            $ConfigService.currentUser = user;
                            $ConfigService.isLoggedIn = true;
                            $ConfigService.displayName = user.firstName || user.username;
                            $rootScope.$$phase || $rootScope.$apply();
                        }, function (err) {
                            $cookieStore.remove('photohost-token');
                            onLogout();
                            console.log(err);
                        });
                } else if (!$cookieStore.get('photohost-token')) {
                    onLogout();
                }
            }

            /**
             *
             * @param event
             * @param toState
             */
            function onStateChangeSuccess(event, toState) {
                if (toState.loginRequired && !$cookieStore.get('photohost-token')) {
                    event.preventDefault();
                    $state.go('signin', {
                        next: $location.path()
                    });
                }

                // Google Analytics
                AnalyticsService.recordPageViewGA($location.url());
            }

            /**
             * Log Out Function
             */
            function onLogout() {
                $ConfigService.currentUser = null;
                $ConfigService.isLoggedIn = null;
                // $ConfigService.updateCurrentUser();
                $rootScope.$$phase || $rootScope.$apply();
            }

            $rootScope.$on('$stateChangeStart', onStateChangeStart);
            $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);
        }]);

angular.element(document)
    .ready(function () {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
    });