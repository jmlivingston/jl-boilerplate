(function () {
    'use strict';

    angular
        .module('app.issues')
        .controller('IssuesController', IssuesController);

    IssuesController.$inject = ['$q', 'dataservice', 'logger'];
    /* @ngInject */
    function IssuesController($q, dataservice, logger) {
        var vm = this;
        vm.title = 'Home';
        vm.activate = activate;
        vm.send = send;
        vm.createNew = createNew;
        vm.status = 'new'; //new or submitted
        vm.Issue = {
            FirstName: '',
            LastName: '',
            Email: '',
            Organization: '',
            Address1: '',
            Address2: '',
            City: '',
            State: '',
            ZipCode: '',
            Phone: '',
            PHoneExtension: '',
            Subject: '',
            SubjectOther: '',
            Description: ''
        };

        activate();

        function activate() {
            for (var prop in vm.Issue) {
                if (vm.Issue.hasOwnProperty(prop)) {
                    vm.Issue[prop] = '';
                }
            }
        }

        function send() {
            vm.Issue['DateAdded'] = new Date().toString();
            vm.Issue['Status'] = 'Submitted';
            var date = new Date();
            vm.Issue['Created'] = date.toISOString();
            vm.Issue['AssignedTo'] = 'mburns@test.com';
            vm.Issue['AssignedToName'] = 'Montgomery Burns';
            dataservice.add('/Issues', vm.Issue).then(function (data) {
                activate();
                vm.status = 'submitted';
            });
        }

        function createNew() {
            vm.status = 'new';
        }
    }
})();
