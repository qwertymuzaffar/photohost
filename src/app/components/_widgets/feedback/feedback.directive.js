'use strict';

angular.module('feedbackDirective',
    [
        'feedbackService'
    ])
    .directive('feedback',
        [
            '$ConfigService',
            'FeedbackService',

            function ($ConfigService,
                      FeedbackService) {
                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_widgets/feedback/feedback.directive.html',
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
                        scope.loading = false;
                        scope.flashMessage = {};
                        scope.feedback = {};

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //--------------------------------------------------------------------------------

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

                        scope.sendFeedback = function () {
                            scope.loading = true;
                            FeedbackService.send(scope.feedback)
                                .then(function (result) {
                                    scope.loading = false;
                                    scope.flashMessage.error = '';
                                    scope.flashMessage.success = result;
                                })
                                .catch(function (err) {
                                    scope.loading = false;
                                    scope.flashMessage.success = '';
                                    scope.flashMessage.error = err;
                                });
                        };

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

                    }
                };
            }]);