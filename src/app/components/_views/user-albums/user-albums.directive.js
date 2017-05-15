'use strict';

angular.module('userAlbumsDirective', [])
    .directive('userAlbums',
        [
            '$ConfigService',
            '$state',
            '$document',
            '$timeout',
            'UserAlbumsService',
            'AlbumService',
            'GalleryService',

            function ($ConfigService,
                      $state,
                      $document,
                      $timeout,
                      UserAlbumsService,
                      AlbumService,
                      GalleryService) {
                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/_views/user-albums/user-albums.directive.html',
                    link: function (scope, element) {

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var currentPage = 0,
                            lastPage = false,
                            watchers = [];

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //--------------------------------------------------------------------------------

                        scope.albums = [];
                        scope.flashMessage = {};
                        scope.showEditModal = false;

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //--------------------------------------------------------------------------------

                        /**
                         * Get Albums onScrolling Document
                         */
                        function onScroll() {
                            if (!scope.albumsLoading && !lastPage) {
                                var elementBottom = element[0].getBoundingClientRect().bottom,
                                    windowHeight = document.documentElement.clientHeight;

                                if (elementBottom < windowHeight) {
                                    onGetAlbums();
                                }
                            }
                        }

                        /**
                         * Get Albums
                         */
                        function onGetAlbums() {
                            scope.albumsLoading = true;

                            UserAlbumsService.retrieveByUser(currentPage)
                                .then(function (albums) {
                                    scope.albumsLoading = false;

                                    for (var k = 0; k < albums.length; k++) {
                                        albums[k].image = SERVER_URL + '/square/' + albums[k].image;
                                    }
                                    scope.albums = scope.albums.concat(albums);

                                    currentPage++;
                                    if (albums.length < 20) {
                                        lastPage = true;
                                    }
                                }, function (err) {
                                    //TODO: Photohost: Show something to simple user
                                    scope.albumsLoading = false;
                                    scope.flashMessage.error = err;
                                    console.log(err);
                                });
                        }

                        /**
                         * Delete albums from Albums Array
                         * @param id
                         */
                        function onDeletedAlbums(id) {
                            for (var i = 0; i < scope.albums.length; i++) {
                                scope.albums[i]._id === id && scope.albums.splice(i, 1);
                            }
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            $document.unbind('scroll', onScroll);

                            while (watchers.length > 0) {
                                watchers.pop()();
                            }
                            onGetAlbums = null;
                            onScroll = null;
                            onDestroy = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                            currentPage = null;
                            lastPage = null;
                            watchers = null;
                        }

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Functions
                        //
                        //--------------------------------------------------------------------------------

                        /**
                         * Show Modal On Edit Album
                         * @param album
                         */
                        scope.onEditAlbum = function (album) {
                            scope.editAlbum = album;
                            GalleryService.retrieveByAlbum(album._id)
                                .then(function (images) {
                                    for (var i = 0, len = images.length; i < len; i++) {
                                        images[i].url = getImageUrl(images[i]);
                                    }
                                    scope.editImages = images;
                                    scope.flashMessage.success = '';
                                    scope.showEditModal = !scope.showEditModal;
                                }, function (err) {
                                    scope.flashMessage.error = err;
                                });
                        };

                        /**
                         * Update Album And Gallery Data
                         */
                        scope.onUpdate = function () {
                            var data = {
                                album: scope.editAlbum,
                                images: scope.editImages
                            };
                            scope.albumUpdating = true;
                            GalleryService.updateByAlbum(data)
                                .then(function (data) {
                                    if (data) {
                                        $timeout(function () {
                                            scope.albumUpdating = false;
                                            scope.flashMessage.success = 'Обновлено';
                                        }, 1000);
                                    }
                                }, function (err) {
                                    scope.albumUpdating = false;
                                    scope.flashMessage.error = err;
                                })
                        };

                        /**
                         * Go to Album Page
                         * @param id
                         */
                        scope.goToAlbumPage = function (id) {
                            $state.go('album', {albumId: id});
                        };

                        /**
                         * Delete Album
                         * @param id
                         */
                        scope.deleteAlbum = function (id) {
                            AlbumService.deleteById(id)
                                .then(function (result) {
                                    onDeletedAlbums(result);
                                });
                        };
                        //--------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //--------------------------------------------------------------------------------

                        $document.bind('scroll', onScroll);
                        watchers.push(scope.$on('$destroy', onDestroy));

                        //--------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //--------------------------------------------------------------------------------

                        (function () {
                            onGetAlbums();
                        })();
                    }
                };
            }]);