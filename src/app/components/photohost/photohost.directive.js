'use strict';

angular.module('photohostDirective',
    [
        'aboutDirective',
        'albumDirective',
        'feedbackDirective',
        'forgotPasswordDirective',
        'galleryDirective',
        'homeDirective',
        'modalDirective',
        'noAdDirective',
        'pageTitleDirective',
        'rulesDirective',
        'signDirective',
        'signInDirective',
        'signInWidgetDirective',
        'signUpDirective',
        'blogDirective',
        'topicWidgetDirective',
        'signInWidgetDirective',
        'uploadWidgetDirective',
        'userUploadWidgetDirective',
        'uiFooterDirective',
        'uiHeaderDirective',
        'uploadDirective',
        'userAlbumsDirective'
    ])
    .directive('photohost',
        [
            '$ConfigService',

            function ($ConfigService) {

                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: 'app/components/photohost/photohost.directive.html',
                    link: function (scope) {

                        var watchers = [];

                        scope.config = $ConfigService;

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

                        watchers.push(scope.$on('$destroy', onDestroy));
                    }
                };
            }]);