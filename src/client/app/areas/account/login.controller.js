(function () {
    'use strict';
    angular
        .module('app.account')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['loginService', '$location'];
    /* @ngInject */
    function LoginController(loginService, $location) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.rememberMe = false;
        vm.login = login;
        vm.showError = false;

        function login() {
            var credentials = {
                email: vm.email,
                password: vm.password
            };
            var opts = {
                remember: (vm.rememberMe ? 'default' : 'sessionOnly')
            };
            loginService.login(credentials, opts).then(redirect, showError);

            function redirect(a, b, c) {
                $location.path('/admin');
            }

            function showError(err) {
                vm.showError = true;
            }
        }
    }
})();
