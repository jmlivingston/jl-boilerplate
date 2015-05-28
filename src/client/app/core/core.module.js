(function () {
    'use strict';

    angular
        .module('app.core', [
            'ngAnimate', 'ngSanitize', 'ngCookies', 'ngRoute',
            'blocks.exception', 'blocks.logger', 'blocks.router', 'blocks.filters',
            'ngplus', 'firebase'
        ]);
})();
