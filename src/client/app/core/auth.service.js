(function() {
    'use strict';
    angular
        .module('app.core')
        .factory('authService', authService);
    authService.$inject = ['loginService', '$q'];
    /* @ngInject */
    function authService(loginService, $q) {
        return function() {
            return loginService.auth.$requireAuth().then(function(user) {
                return user ? user : $q.reject({
                    authRequired: true
                });
            });
        };
    }
})();
