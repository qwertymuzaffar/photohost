'use strict';

angular.module('blogDirective', [])
    .directive('blog',
        [
            '$ConfigService',
            '$filter',
            '$stateParams',
            '$state',
            '$document',
            'BlogService',

            function ($ConfigService,
                      $filter,
                      $stateParams,
                      $state,
                      $document,
                      BlogService) {
                return {
                    replace: true,
                    restrict: 'E',
                    scope: {},
                    templateUrl: 'app/components/_views/blog/blog.directive.html',
                    link: function (scope, element) {

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Variables
                        //
                        //--------------------------------------------------------------------------------

                        var watchers = [],
                            currentPage = 0,
                            lastPage = false,
                            postId = $stateParams.postId;

                        //--------------------------------------------------------------------------------
                        //
                        //  Public Variables
                        //
                        //--------------------------------------------------------------------------------

                        scope.config = $ConfigService;
                        scope.postLoading = false;
                        scope.posts = [];
                        scope.flashMessage = {};

                        //--------------------------------------------------------------------------------
                        //
                        //  Private Functions
                        //
                        //--------------------------------------------------------------------------------

                        /**
                         * Get Posts onScrolling Document
                         */
                        function onScroll() {
                            if (!scope.postLoading && !lastPage && !postId) {
                                var elementBottom = element[0].getBoundingClientRect().bottom,
                                    windowHeight = document.documentElement.clientHeight;

                                if (elementBottom < windowHeight) {
                                    onGetPosts();
                                }
                            }
                        }

                        /**
                         * Get Posts
                         */
                        function onGetPosts() {
                            scope.postLoading = true;

                            BlogService.retrieve(currentPage)
                                .then(function (posts) {
                                    scope.postLoading = false;

                                    for (var i = 0; i < posts.length; i++) {
                                        if (posts[i].image) {
                                            posts[i].image = getPostImageUrl(posts[i].image);
                                        }
                                    }
                                    scope.posts = scope.posts.concat(posts);

                                    currentPage++;
                                    if (posts.length < 15) {
                                        lastPage = true;
                                    }
                                }, function (err) {
                                    scope.postLoading = false;
                                    scope.flashMessage.error = err;
                                });
                        }

                        /**
                         * Get Post Image Path
                         * @param path
                         * @returns {string}
                         */
                        function getPostImageUrl(path) {
                            var url = SERVER_URL + '/post/square/' + path;
                            return url;
                        }

                        /**
                         * Clean up
                         */
                        function onDestroy() {
                            $document.unbind('scroll', onScroll);

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

                        scope.goToPost = function (id) {
                            if (!id) return;
                            $state.go('blog', {postId: id});
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
                            if (postId) {
                                BlogService.retrieveById(postId)
                                    .then(function (post) {
                                        scope.post = post;
                                    })
                                    .catch(function (err) {
                                        scope.flashMessage.error = err;
                                    })
                            } else {
                                onGetPosts();
                            }
                        })();
                    }
                };
            }]);