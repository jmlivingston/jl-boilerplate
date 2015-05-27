module.exports = function () {
    var constants = {
        firebaseUrl: process.env.FirebaseUrl || 'https://jl-boilerplate.firebaseio.com',
        firebaseToken: process.env.FirebaseToken || '4YTJprvoj0ILiYnfAlN8n51hYlAsOhDZ5FDBbMb5'
    };
    return constants;
};
