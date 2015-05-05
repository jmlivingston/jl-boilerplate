module.exports = function () {
    var Firebase = require('firebase');
    var constants = require('../constants')();
    var q = require('q');

    var service = {
        getData: getData,
        getImage: getImage
    };
    return service;

    function getData(path, req) {
        var readyPromise = q.defer();

        var firebase = new Firebase(constants.firebaseUrl);
        firebase.child('/seo/default').once('value', success, fail);

        function success(data) {
            var seoDefault = {
                title: ' ',
                description: '',
                keywords: '',
                author: '',
                pageTitle: '',
                url: '',
                siteName: '',
                firebaseUrl: '',
                image: '',
                imageDataUri: '',
                imageDataUriFileName: ''
            };
            var seoData = data.val() || seoDefault;
            seoData.firebaseUrl = constants.firebaseUrl;
            var path = req.originalUrl.split('/')[1];
            path = path && ' | ' + path[0].toUpperCase() + path.slice(1);
            seoData['pageTitle'] = (seoData.title + path).split('?')[0];
            seoData['url'] =  req.protocol + '://' + req.get('host');
            seoData['image'] = seoData.url + '/seoimage.jpg';
            delete seoData.imageDataUri;
            delete seoData.imageDataUriFileName;
            readyPromise.resolve(seoData);
        }

        function fail(err) {
            readyPromise.resolve(null);
        }

        return readyPromise.promise;
    }

    function getImage() {
        var readyPromise = q.defer();

        var firebase = new Firebase(constants.firebaseUrl);
        firebase.child('/seo/default/imageDataUri').once('value', success, fail);

        function success(data) {
            var imageDataUri = data.val();
            var imageSplit = imageDataUri.split(',');
            readyPromise.resolve({
                binary: imageSplit[1],
                type: imageSplit[0].split(':')[1].split(';')[0]
            });
        }

        function fail(err) {
            readyPromise.resolve(null);
        }

        return readyPromise.promise;
    }
};
