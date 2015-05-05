(function () {
    'use strict';

    angular
        .module('blocks.filters')
        .filter('toArray', toArray);

    function toArray() {
        return function (obj, addKey) {
            if (!obj) {
                return obj;
            }
            if (addKey === false) {
                return Object.keys(obj).map(function (key) {
                    return obj[key];
                });
            } else {
                return Object.keys(obj).map(function (key) {
                    return Object.defineProperty(obj[key], '$key', {
                        enumerable: false,
                        value: key
                    });
                });
            }
        };
    }
}());
