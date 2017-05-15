'use strict';

angular.module('albumDirective', [])
    .directive('albumPage',
        [
            '$rootScope',
            '$stateParams',
            '$state',
            'AlbumService',
            'GalleryService',

            function ($rootScope,
                      $stateParams,
                      $state,
                      AlbumService,
                      GalleryService) {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/_views/album/album.directive.html',
                    link: function (scope) {

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //---------------------------------------------------------------------------------

                        var albumId = $stateParams.albumId,
                            watchers = [];

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //---------------------------------------------------------------------------------
                        scope.flashMessage = '';
                        //---------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //---------------------------------------------------------------------------------

                        /**
                         * Get Album
                         * @param id
                         */
                        function onGetAlbum(event, id) {
                            GalleryService.retrieveByAlbum(id)
                                .then(function (images) {
                                    for (var i = 0, len = images.length; i < len; i++) {
                                        //TODO: PhotoHost: before showing, check url, that image with this url is exist in server or not

                                        //TODO: PhotoHost: Also use another size for this directive
                                        images[i].url = getImageUrl(images[i]);
                                    }
                                    scope.images = images;
                                }, function (err) {
                                    scope.flashMessage = err;
                                    //TODO: PhotoHost: Show some text on AlertMessageBox
                                    console.log(err);
                                });
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }
                            onGetAlbum = null;
                            onDestroy = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                            watchers = null;
                        }

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Functions
                        //
                        //---------------------------------------------------------------------------------

                        /**
                         * Go To Gallery Page
                         * @param id
                         */
                        scope.goToGallery = function (id) {
                            $state.go('gallery', {imageId: id});
                        };

                        //---------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //---------------------------------------------------------------------------------

                        watchers.push($rootScope.$on('onChangeAlbum', onGetAlbum));
                        watchers.push(scope.$on('$destroy', onDestroy));

                        //---------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //---------------------------------------------------------------------------------

                        (function () {
                            //TODO: PhotoHost: Also show some error, or redirect to 404-bot found page
                            if (!albumId) return;

                            onGetAlbum(null, albumId);

                            AlbumService.updateViews(albumId)
                                .then(function (result) {
                                    scope.album = result;
                                    //Success Result
                                }, function (err) {
                                    console.log(err);
                                })
                        })();
                    }
                };
            }]);