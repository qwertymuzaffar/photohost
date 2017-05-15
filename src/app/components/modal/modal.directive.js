'use strict';

angular.module('modalDirective', [])
    .directive('modal',
        [

            function () {
                return {
                    replace: true,
                    transclude: true,
                    restrict: 'E',
                    scope: true,
                    template: '<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n                <h4 class="modal-title">{{ title }}</h4></div>\n            <div class="modal-body" ng-transclude></div>\n        </div>\n    </div>\n</div>',
                    link: function postLink(scope, element, attrs) {

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

                        scope.title = attrs.title;

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

                        scope.$watch(attrs.visible, function (value) {
                            if (value == true)
                                $(element).modal('show');
                            else
                                $(element).modal('hide');
                        });

                        $(element).on('shown.bs.modal', function () {
                            scope.$apply(function () {
                                scope.$parent[attrs.visible] = true;
                            });
                        });

                        $(element).on('hidden.bs.modal', function () {
                            scope.$apply(function () {
                                scope.$parent[attrs.visible] = false;
                            });
                        });

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