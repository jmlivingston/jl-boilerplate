(function () {
    'use strict';
    angular
        .module('app.account')
        .controller('AdminSettingsController', AdminSettingsController);
    AdminSettingsController.$inject = ['dataservice', '$http', 'logger'];
    /* @ngInject */
    function AdminSettingsController(dataservice, $http, logger) {
        var vm = this;
        vm.limits = [25, 50, 75, 100];
        vm.limit = 25;
        vm.createDummyData = createDummyData;

        function createDummyData() {
            $http.get('/app/areas/admin/dummydata.json').then(function (data) {
                var dummyData = data.data.slice(0, vm.limit);
                dataservice.remove('', 'Issues').then(function (success) {
                    for (var i = 0; i < dummyData.length; i++) {
                        var phone = '(' + dummyData[i].Phone.split('(')[1].replace(')', ') ');
                        dummyData[i].Phone = phone;
                        if (dummyData[i].Status === 'Submitted') {
                            dummyData[i].AssignedTo = 'mburns@test.com';
                        }
                        switch (dummyData[i].AssignedTo) {
                        case 'mburns@test.com':
                            dummyData[i]['AssignedToName'] = 'Montgomery Burns';
                            break;
                        case 'hsimpson@test.com':
                            dummyData[i]['AssignedToName'] = 'Homer Simpson';
                            break;
                        case 'ccarlson@test.com':
                            dummyData[i]['AssignedToName'] = 'Carl Carlson';
                            break;
                        case 'lleonard@test.com':
                            dummyData[i]['AssignedToName'] = 'Lenny Leonard';
                            break;
                        }
                        var today = new Date();
                        var previousDate = new Date(today);
                        previousDate.setDate(today.getDate() - 21);
                        dummyData[i].Created = getRandomDate(today, previousDate);
                        dataservice.add('/Issues', dummyData[i]);
                    }
                });
                logger.info('Dummy data loaded!');
            });
        }

        function getRandomDate(start, end) {
            var date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            return date.toISOString();
        }
    }
})();
