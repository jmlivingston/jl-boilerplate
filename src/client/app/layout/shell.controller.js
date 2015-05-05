(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger', 'loginService', '$location'];
    /* @ngInject */
    function ShellController($rootScope, $timeout, config, logger, loginService, $location) {
        var vm = this;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.logout = logout;
        $rootScope.showSplash = false;
        vm.rootScope = $rootScope;
        vm.login = login;
        vm.navline = {
            title: config.appTitle
        };
        vm.selectedUser = {};
        vm.Users = [{
            email: 'hsimpson@test.com',
            name: 'Homer Simpson (Editor)',
            password: 'hsimpson'
        }, {
            email: 'ccarlson@test.com',
            name: 'Carl Carlson (Editor)',
            password: 'ccarlson'
        }, {
            email: 'mburns@test.com',
            name: 'Montgomery Burns (Admin)',
            password: 'mburns'
        }, {
            name: 'Public User'
        }];

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function () {
                $rootScope.showSplash = false;
            }, 1000);
        }

        function logout() {
            loginService.logout();
        }

        function login(selectedUser) {
            if (selectedUser.name === 'Public User') {
                logout();
            } else {
                var credentials = {
                    email: selectedUser.email,
                    password: selectedUser.password
                };
                var opts = {
                    remember: true
                };
                loginService.login(credentials, opts).then(redirect, showError);
            }

            function redirect(a, b, c) {
                $location.path('/admin');
            }

            function showError(err) {
                vm.showError = true;
            }
        }
    }
})();
