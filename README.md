# jl-boilerplate

<!--[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)-->

## Technologies
- Node
- Express
- Jade
- Angular
- Firebase
- Gulp

## Features
- Responsive Design (Bootstrap)
- Firebase Integration
- Authentication and role-based security (Firebase)
- SEO (OpenGraph)
- Basic Crud Operations
- Heroku Deployment
- Content Administration

## Prerequisites

1. Install [Node.js](http://nodejs.org)
 - on OSX use [homebrew](http://brew.sh) `brew install node`
 - on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

2. Install Yeoman `npm install -g yo`

3. Install these NPM packages globally

    ```bash
    npm install -g bower gulp nodemon`
    ```

    >Refer to these [instructions on how to not require sudo](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md)

4. Create a Firebase instance and copy the URL and token to server/constants.js

5. If using Heroku, you can create a QA and/or PROD environment. There are some gulp tasks (see below) for easy deployment. Otherwise, deployment files are copied to the deploy folder and can be easily deployed on a different Node environment.

## Running jl-boilerplate

### Linting
 - Run code analysis using `gulp vet`. This runs jshint, jscs, and plato.

### Tests
 - Run the unit tests using `gulp test` (via karma, mocha, sinon).

### Running in dev mode
 - Run the project with `gulp serve-dev --sync`

 - `--sync` opens it in a browser and updates the browser with any files changes.

### Building the project
 - Build the optimized project using `gulp build`
 - This create the optimized code for the project and puts it in the build folder

### Running the optimized code
 - Run the optimize project from the build folder with `gulp serve-build`

### Heroku Integration
 - Run `gulp deploy-build` to create qa and prod folders in the deploy folder. If you have already run 'gulp build', you can use the --min option.
 - Once the prod and qa folders are created and you have created an app within Heroku, you will want to cd into those folders and initialize git using Heroku's deploy instructions. It should look something like this.
`heroku login`
`git init`
`heroku git:remote -a my-app-qa`
Note: (Replace with your app name. I use qa and prod suffixes to differentiate what type of environment it is.)
 - Once you have done this, you can return to the root directory and deploy to Heroku using the following commands:
`gulp deploy-push-heroku --repo qa|prod --min -m "My commit message"`
(If you have made changes and not run 'gulp build', you must omit the --min option. --repo is required. --m is optional)
    - For example:
        `gulp deploy-push-heroku --repo qa`
(Assumes you need to build, are pushing to QA, and will use the default commit message.).
        `gulp deploy-push-heroku --repo prod --min --m "New updates"`
(Assumes you don't need to build, are pushing to PROD, and will have a custom commit message.)

## Exploring jl-boilerplate
jl-boilerplate Angular starter project

### Structure
The structure also contains a gulpfile.js and a server folder. The server is there just so we can serve the app using node. Feel free to use any server you wish.

    /src
        /client
            /app
            /content

### Installing Packages
When you generate the project it should run these commands, but if you notice missing packages, run these again:

 - `npm install`
 - `bower install`

### The Modules
The app has 4 feature modules and depends on a series of external modules and custom but cross-app modules

```
app --> [
        app.admin,
        app.dashboard,
        app.layout,
        app.widgets,
        app.core --> [
            ngAnimate,
            ngSanitize,
            ui.router,
            blocks.exception,
            blocks.logger,
            blocks.router
        ]
    ]
```

#### core Module
Core modules are ones that are shared throughout the entire application and may be customized for the specific application. Example might be common data services.

This is an aggregator of modules that the application will need. The `core` module takes the blocks, common, and Angular sub-modules as dependencies.

#### blocks Modules
Block modules are reusable blocks of code that can be used across projects simply by including them as dependencies.

##### blocks.logger Module
The `blocks.logger` module handles logging across the Angular app.

##### blocks.exception Module
The `blocks.exception` module handles exceptions across the Angular app.

It depends on the `blocks.logger` module, because the implementation logs the exceptions.

##### blocks.router Module
The `blocks.router` module contains a routing helper module that assists in adding routes to the $routeProvider.

**Forked and Tweaked from HotTowel Angular**

>*Opinionated AngularJS style guide for teams by [@john_papa](//twitter.com/john_papa)*

>More details about the styles and patterns used in this app can be found in my [AngularJS Style Guide](https://github.com/johnpapa/angularjs-styleguide) and my [AngularJS Patterns: Clean Code](http://jpapa.me/ngclean) course at [Pluralsight](http://pluralsight.com/training/Authors/Details/john-papa) and working in teams.
