'use strict';

angular.module('photohostFilters', [])
    /**
     * Ellipsis
     */
    .filter('ellipsis', function () {
        return function (input, length, boolean) {
            if (input && input.length > length) {
                var str = input.slice(0, length) + '...';

                if (boolean) {
                    str = input.slice(0, input.indexOf(' ', length)) + '...'
                }

                return str;
            } else {
                return input;
            }
        };
    })

    /**
     * Trusted Url
     */
    .filter('trustedUrl', ['$sce', function ($sce) {
        return function (url) {
            if (url) return $sce.trustAsResourceUrl(url);
        };
    }])

    /**
     * Trusted Html
     */
    .filter('trustedHtml', ['$sce', function ($sce) {
        return function (html) {
            if (html) return $sce.trustAsHtml(html);
        };
    }]);