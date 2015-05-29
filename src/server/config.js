/* jshint -W074 */
module.exports = function () {
    var config = {
        todoFirebaseUrl: process.env.FirebaseUrl || 'https://jl-boilerplate.firebaseio.com',
        todoFirebaseToken: process.env.FirebaseToken || '4YTJprvoj0ILiYnfAlN8n51hYlAsOhDZ5FDBbMb5',
        port: 8001,
        dataProviders: {
            firebase: {
                host: process.env.FirebaseHost || 'express-rest.firebaseio.com',
                url: process.env.FirebaseUrl || 'https://express-rest.firebaseio.com',
                token: process.env.FirebaseToken || 'PLVW4nqTUPRLkv7ZKFRsPMmq0zg4SpKj2AHrYy2q'
            },
            json: {},
            mongo: {
                database: process.env.MongoDatabase || 'ds039010.mongolab.com:39010/express-rest',
                user: process.env.MongoUser || 'jlivingston',
                password: process.env.MongoPassword || 'Mongo,test0'
            },
            sql: {
                database: process.env.SqlDatabase || 'JLIVINGSTON-TEST',
                user: process.env.SqlUser || 'jlivingston',
                password: process.env.SqlPassword || 'Azure,test0',
                server: process.env.SqlServer || 'prkljjjj5q.database.windows.net'
            }
        },
        restRouteBaseUrl: '/api',
        restRoutes: {
            IssuesFirebase: {
                path: 'issues-firebase',
                dataName: 'Issues',
                provider: 'firebase',
                identity: 'Id'
            },
            IssuesJson: {
                path: 'issues-json',
                dataName: 'Issues',
                provider: 'json',
                identity: 'Id'
            },
            IssuesMongo: {
                path: 'issues-mongo',
                dataName: 'Issues',
                provider: 'mongo',
                identity: '_id'
            },
            IssuesSql: {
                path: 'issues-sql',
                dataName: 'Issues',
                provider: 'sql',
                identity: 'ID'
            }
        }
    };
    return config;
};
