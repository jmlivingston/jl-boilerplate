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
            Email: 'hsimpson@test.com',
            Name: 'Homer Simpson (Editor)',
            Password: 'hsimpson'
        }, {
            Email: 'ccarlson@test.com',
            Name: 'Carl Carlson (Editor)',
            Password: 'ccarlson'
        }, {
            Email: 'mburns@test.com',
            Name: 'Montgomery Burns (Admin)',
            Password: 'mburns'
        }, {
            Name: 'Public User'
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
            if (selectedUser.Name === 'Public User') {
                logout();
            } else {
                var credentials = {
                    email: selectedUser.Email,
                    password: selectedUser.Password
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
