'use strict';

angular.module('uploadDirective', [])
    .directive('uploadPage',
        [
            '$stateParams',
            '$ConfigService',
            'GalleryService',

            function ($stateParams,
                      $ConfigService,
                      GalleryService) {
                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_views/upload/upload.directive.html',
                    link: function (scope) {

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var watchers = [];

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //--------------------------------------------------------------------------------

                        scope.config = $ConfigService;
                        scope.albumId = $stateParams.albumId;
                        scope.viewAlbum = $ConfigService.siteDir + '/a/' + scope.albumId;

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //--------------------------------------------------------------------------------

                        /**
                         * Make Image Codes
                         * @param image
                         * @returns {{viewImg: (string|*)}}
                         */
                        function makeImgCode(image) {

                            var url = SERVER_URL,
                                viewImg, urlImg, bbImg, htmlImg, urlPrevImg, bbPrevImg, htmlPrevImg;

                            viewImg = $ConfigService.siteDir + '/g/' + image._id;
                            urlImg = url + '/img/' + image.path + '/' + image._id + '.' + image.extension;
                            bbImg = '[url=' + viewImg + '][img]' + urlImg + '[/img][/url]';
                            htmlImg = '<a href="' + viewImg + '"><img src="' + urlImg + '"></a>';
                            urlPrevImg = url + '/thumbs/' + image.path + '/' + image._id + '.' + image.extension;
                            bbPrevImg = '[url=' + viewImg + '][img]' + urlPrevImg + '[/img][/url]';
                            htmlPrevImg = '<a href="' + viewImg + '"><img src="' + urlPrevImg + '"></a>';

                            var urls = {
                                viewImg: viewImg,
                                urlImg: urlImg,
                                bbImg: bbImg,
                                htmlImg: htmlImg,
                                urlPrevImg: urlPrevImg,
                                bbPrevImg: bbPrevImg,
                                htmlPrevImg: htmlPrevImg
                            };

                            return urls;
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }

                            onDestroy = null;
                            watchers = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                        }

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Functions
                        //
                        //--------------------------------------------------------------------------------

                        //--------------------------------------------------------------------------------
                        //
                        //  Watchers
                        //
                        //--------------------------------------------------------------------------------

                        watchers.push(scope.$on('$destroy', onDestroy));

                        //--------------------------------------------------------------------------------
                        //
                        //  Init
                        //
                        //--------------------------------------------------------------------------------

                        (function () {
                            //TODO: PhotoHost: Also show some error, or redirect to 404-bot found page
                            if (!scope.albumId) return;

                            GalleryService.retrieveByAlbum(scope.albumId)
                                .then(function (images) {
                                    for (var i = 0, len = images.length; i < len; i++) {
                                        images[i].url = makeImgCode(images[i]);
                                    }
                                    if (images.length > 1) {
                                        scope.multiBbImg = images.map(function (obj) {
                                            return obj.url.bbImg;
                                        }).join(' ');
                                        scope.multiHtmlImg = images.map(function (obj) {
                                            return obj.url.htmlImg;
                                        }).join(' ');
                                        scope.multiBbPrevImg = images.map(function (obj) {
                                            return obj.url.bbPrevImg;
                                        }).join(' ');
                                        scope.multiHtmlPrevImg = images.map(function (obj) {
                                            return obj.url.htmlPrevImg;
                                        }).join(' ');
                                    }
                                    scope.images = images;
                                }, function (err) {
                                    //TODO: PhotoHost: Show some text on AlertMessageBox
                                    console.log(err);
                                });
                        })();
                    }
                };
            }]);