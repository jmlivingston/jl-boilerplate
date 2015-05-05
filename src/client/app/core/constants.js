/* global toastr:false, moment:false */
(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('FBURL',  window.firebaseUrl)
        .constant('_', window._)
        .constant('SIMPLE_LOGIN_PROVIDERS', ['google'])
        .constant('loginRedirectPath', '/login')
        .constant('SECURED_ROUTES', {})
        .constant('$', $);
})();
