'use strict';

angular.module('galleryDirective', [])
    .directive('galleryPage',
        [
            '$stateParams',
            'AlbumService',
            'GalleryService',

            function ($stateParams,
                      AlbumService,
                      GalleryService) {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/_views/gallery/gallery.directive.html',
                    link: function (scope) {

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //---------------------------------------------------------------------------------

                        var watchers = [];

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //---------------------------------------------------------------------------------

                        scope.imageId = $stateParams.imageId;

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //---------------------------------------------------------------------------------

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }
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

                        //---------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //---------------------------------------------------------------------------------

                        watchers.push(scope.$on('$destroy', onDestroy));

                        //---------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //---------------------------------------------------------------------------------

                        (function () {
                            //TODO: PhotoHost: Also show some error, or redirect to 404-bot found page
                            if (!scope.imageId) return;

                            GalleryService.retrieveById(scope.imageId)
                                .then(function (image) {
                                    //TODO: PhotoHost: before showing, check url, that image with this url is exist in server or not

                                    //TODO: PhotoHost: Also use another size for this directive
                                    image.url = getImageUrl(image);
                                    scope.image = image;
                                    AlbumService.retrieveById(scope.image.album)
                                        .then(function (album) {
                                            scope.album = album;
                                        }, function (err) {
                                            console.log(err);
                                        })
                                }, function (err) {
                                    //TODO: PhotoHost: Show some text on AlertMessageBox
                                    console.log(err);
                                });

                            GalleryService.updateViews(scope.imageId)
                                .then(function (result) {
                                    //Success Result
                                }, function (result) {
                                    console.log(result);
                                });

                        })();
                    }
                };
            }]);