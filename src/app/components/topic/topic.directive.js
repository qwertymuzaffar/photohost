'use strict';

angular.module('topicDirective',
    [
        'albumService',
        'configService'
    ])
    .directive('topic',
        [
            '$stateParams',
            '$state',
            '$document',
            '$ConfigService',
            'AlbumService',

            function ($stateParams,
                      $state,
                      $document,
                      $ConfigService,
                      AlbumService) {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/topic/topic.directive.html',
                    link: function (scope, element) {

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //---------------------------------------------------------------------------------

                        var currentPage = 0,
                            lastPage = false,
                            watchers = [];

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //---------------------------------------------------------------------------------

                        scope.config = $ConfigService;
                        scope.albums = [];
                        scope.flashMessage = '';

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //---------------------------------------------------------------------------------

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

                            AlbumService.retrieveByTopic('popular', currentPage)
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
                                    scope.flashMessage = err.message;
                                    //TODO: Photohost: Show something to simple user
                                    console.log(err);
                                });
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

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Functions
                        //
                        //---------------------------------------------------------------------------------

                        //---------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //---------------------------------------------------------------------------------

                        $document.bind('scroll', onScroll);
                        watchers.push(scope.$on('$destroy', onDestroy));

                        //---------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //---------------------------------------------------------------------------------

                        (function () {
                            onGetAlbums();
                        })();
                    }
                };
            }]);