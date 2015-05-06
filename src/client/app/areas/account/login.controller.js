(function () {
    'use strict';
    angular
        .module('app.account')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['loginService', '$location'];
    /* @ngInject */
    function LoginController(loginService, $location) {
        var vm = this;
        vm.Email = '';
        vm.Password = '';
        vm.RememberMe = false;
        vm.login = login;
        vm.showError = false;

        function login() {
            var credentials = {
                email: vm.Email,
                password: vm.Password
            };
            var opts = {
                remember: (vm.RememberMe ? 'default' : 'sessionOnly')
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
