'use strict';

angular.module('uploadWidgetDirective',
    [
        'galleryService'
    ])
    .directive('uploadWidget',
        [
            '$ConfigService',
            '$location',
            '$rootScope',
            '$state',
            'GalleryService',

            function ($ConfigService,
                      $location,
                      $rootScope,
                      $state,
                      GalleryService) {

                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_widgets/upload/upload.directive.html',
                    link: function (scope) {

                        //---------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //---------------------------------------------------------------------------------

                        var uploads = {},
                            watchers = [],
                            isValidFile = false;

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //---------------------------------------------------------------------------------

                        scope.config = $ConfigService;
                        scope.localiz = $ConfigService.localiz;

                        scope.images = [];
                        scope.loading = false;


                        //---------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //---------------------------------------------------------------------------------

                        /**
                         * Apply Scope
                         * @param imageResult
                         */
                        function applyScope(imageResult) {
                            scope.$apply(function () {
                                scope.images.unshift(imageResult);
                            });
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            while (watchers.length > 0) {
                                watchers.pop()();
                            }
                            applyScope = null;
                            onDestroy = null;

                            for (var key in scope) {
                                if (key[0] !== '$' && scope.hasOwnProperty(key)) {
                                    scope[key] = null;
                                }
                            }
                            uploads = null;
                            watchers = null;
                        }

                        //---------------------------------------------------------------------------------
                        //
                        //  Public Functions
                        //
                        //---------------------------------------------------------------------------------

                        /**
                         * Delete Image on Display
                         * @param index
                         */
                        scope.deleteImage = function (index) {
                            scope.images.splice(index, 1);
                        };

                        /**
                         * Upload And Save Images
                         */
                        scope.uploadAndSave = function () {
                            scope.loading = true;

                            if (scope.images.length > 20) {
                                scope.images.length = 20;
                            }

                            if ($ConfigService.currentUser) {
                                uploads.author = $ConfigService.currentUser._id;
                            }
                            for (var k = 0; k < scope.images.length; k++) {
                                scope.images[k].tempId = k;
                            }

                            var date = new Date(),
                                currentDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2),
                                currentDay = ('0' + date.getDate()).slice(-2);

                            uploads.images = scope.images;
                            uploads.datePath = currentDate + '/' + currentDay;

                            GalleryService.upload(uploads)
                                .then(function (res) {
                                    $state.go('upload', {albumId: res.album._id});
                                }, function (err) {
                                    //TODO: PhotoHost: Show some text on AlertMessageBox
                                    console.log(err);
                                });
                        };

                        /**
                         * Show Images On Selecting
                         * @param evt
                         */
                        scope.onSelectingImages = function (evt) {
                            var images = evt.files;

                            if (scope.images.length + images.length > 20) {
                                alert('Выберите не больше 20 изображений!');
                                return;
                            }

                            angular.forEach(images, function (flowFile) {

                                if (flowFile.size > scope.config.maxSizeByte) {
                                    alert("Размер файла не должно превышать 10MB!");
                                    return;
                                }

                                var fileReader = new FileReader();
                                fileReader.onload = function (event) {
                                    imageResult.dataURL = event.target.result.replace('data:' + flowFile.type + ';base64,', '');
                                };
                                fileReader.readAsDataURL(flowFile);

                                var imageResult = {
                                    url: URL.createObjectURL(flowFile),
                                    type: flowFile.type,
                                    title: flowFile.name,
                                    size: flowFile.size,
                                    lastModified: flowFile.lastModified
                                };

                                imageResult.extension = flowFile.type.replace('image/', '');

                                if (imageResult.title.length > 50) {
                                    imageResult.title = imageResult.title.substring(0, 50);
                                }

                                for (var k = 0; k < scope.config.allowedExtensions.length; k++) {
                                    if (imageResult.extension == scope.config.allowedExtensions[k]) {
                                        isValidFile = true;
                                        break;
                                    }
                                }
                                if (!isValidFile) {
                                    return;
                                } else {
                                    isValidFile = false;
                                }

                                applyScope(imageResult);
                            });
                        };

                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                };
            }]);