'use strict';

angular.module('topicWidgetDirective', [])
    .directive('topicWidget',
        [
            '$rootScope',
            '$state',
            'AlbumService',

            function ($rootScope,
                      $state,
                      AlbumService) {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/_widgets/topic/topic.directive.html',
                    link: function (scope) {

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //---------------------------------------------------------------------------------

                        var currentPage = 0,
                            lastPage = false,
                            watchers = [],
                            topicWidget = angular.element(document.querySelector('#topic-widget'));

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //---------------------------------------------------------------------------------

                        scope.albums = [];

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
                                var elementBottom = topicWidget[0].scrollHeight,
                                    scrollTop = topicWidget[0].scrollTop + 581;

                                if (scrollTop > elementBottom) {
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
                                    //TODO: Photohost: Show something to simple user
                                    console.log(err);
                                });
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            topicWidget.unbind('scroll', onScroll);

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

                        /**
                         * Go to Album Page
                         * @param id
                         */
                        scope.goToAlbumPage = function (id) {
                            if($state.current.name == "album"){
                                $state.go('album', {albumId: id}, {location: true, notify: false, reload: false});
                                $rootScope.$emit('onChangeAlbum', id);
                            } else {
                                $state.go('album', {albumId: id});
                            }
                        };

                        //---------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //---------------------------------------------------------------------------------

                        topicWidget.bind('scroll', onScroll);
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