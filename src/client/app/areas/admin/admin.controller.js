(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$cookies', '$timeout', '$rootScope'];
    /* @ngInject */
    function AdminController($scope, $cookies, $timeout, $rootScope) {
        var dataChanged = false;
        var dataChangedList = [];
        var vm = this;
        vm.rootScope = $rootScope;
        //if(vm.rootScope.user.roles && vm.rootScope.user.roles.admin) {
        vm.activeAdminTab = $cookies.activeAdminTab;
        //}
        vm.setTab = setTab;
        if (!vm.activeAdminTab) {
            vm.activeAdminTab = 0;
            $timeout(function () {
                setTab('activeAdminTab', '0');
            }, 1000);
        }

        $scope.$on('issuesCount', function(data) {
            vm.issuesCount = data.targetScope.vm.issues.length;
        });

        function setTab(tabName, value) {
            $cookies[tabName] = value;
            $scope.$broadcast(tabName + value);
        }
    }
})();
