(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('AdminIssuesController', AdminIssuesController);

    AdminIssuesController.$inject = ['$scope', '$rootScope', '$cookies', '$timeout', 'dataservice', '_'];
    /* @ngInject */
    function AdminIssuesController($scope, $rootScope, $cookies, $timeout, dataservice, _) {
        var vm = this;
        vm.getDetails = getDetails;
        vm.sort = {
            column: 'Created',
            descending: false
        };
        vm.updateSort = updateSort;
        vm.issues = [];
        vm.rootScope = $rootScope;
        vm.assignedFilter = assignedFilter;
        vm.Issue = {};
        vm.assignUser = assignUser;
        vm.Statuses = ['Submitted', 'Assigned', 'In Progress', 'Complete'];
        vm.Users = [{
            email: 'hsimpson@test.com',
            name: 'Homer Simpson'
        }, {
            email: 'ccarlson@test.com',
            name: 'Carl Carlson'
        }, {
            email: 'lleonard@test.com',
            name: 'Lenny Leonard'
        }, {
            email: 'mburns@test.com',
            name: 'Montgomery Burns'
        }];
        vm.save = save;
        activate();

        $scope.$on('activeAdminTab0', activate);

        function activate() {
            dataservice.getWithId('/Issues').then(function (data) {
                vm.issues = data;
                $scope.$emit('issuesCount');
            });
        }

        function getDetails(request) {
            vm.Issue = request;
        }

        function updateSort(property) {
            var sort = vm.sort;
            if (sort.column === property) {
                sort.descending = !sort.descending;
            } else {
                sort.column = property;
                sort.descending = false;
            }
        }

        function assignedFilter(item) {
            if (vm.rootScope.user) {
                return (item.Status === 'Assigned' || item.Status === 'In Progress' || item.Status === 'Submitted') && item.AssignedTo === vm.rootScope.user.email;
            } else {
                return true;
            }
        }

        function save() {
            var item = angular.copy(vm.Issue);
            delete item.id;
            dataservice.update('/Issues', vm.Issue.id, item, null, vm.Issue.FirstName + ' ' + vm.Issue.LastName + ' Issue');
        }

        function assignUser() {
            var assignee = _.find(vm.Users, function (u) {
                return u.email === vm.Issue.AssignedTo;
            });
            vm.Issue.AssignedToName = assignee.name;
        }
    }
})();
