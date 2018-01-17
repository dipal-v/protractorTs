# Leto

Based on [Ceres (typescript)](https://github.com/Inmarsat-itcloudservices/CAA-Ceres-Aurelia:)

## Running The App

Before you start, make sure you have a recent version of [NodeJS](http://nodejs.org/) environment *>=8.4* with NPM 5.52.

Please also note node 6 cannot be used because it does not support async/await natively.

From the project folder, execute the following command:

```shell
npm install
```

This will install all required dependencies, including a local version of Webpack that is going to
build and bundle the app. There is no need to install Webpack globally. 

To run the app execute the following command:

```shell
source environment-local.sh
npm start
```

Please note that local environment can only be used when and if your computer is inside Inmarsat's developer network(in other words, wired to a
socket inside Inmarsat building). <span color="red">**Will not work with Wifi, or any external network.**</span>

For local mocked environment:

```shell
source environment-test.sh
npm start
```

and in another shell, please run:

```shell
node apimock.js
```

#### Special case

If you local server has port 8080 occupied and you cannot change it, please do this after `source environment-test.sh`:

```
export WEBPACK_PORT="9090"
```

And then do `npm start`

This command starts the webpack development server that serves the build bundles.
You can now browse the skeleton app at http://localhost:8080 (or the next available port, notice the output of the command). Changes in the code
will automatically build and reload the app.

### Running with Hot Module Reload

If you wish to try out the experimental Hot Module Reload, you may run your application with the following command:

```shell
npm start -- webpack.server.hmr
```

## Feature configuration

Most of the configuration will happen in the `webpack.config.js` file.
There, you may configure advanced loader features or add direct SASS or LESS loading support.

## Bundling

To build an optimized, minified production bundle (output to /dist) execute:

```shell
npm start -- build
```

For development

npm start -- webpack.build.development

To build 

To test either the development or production build execute:

```shell
npm start -- serve
```

The production bundle includes all files that are required for deployment.

## Documentation

```shell
npm start -- doc
```

And the `documentation` folder will have all you need.

And if you do

```shell
npm start -- doc.watch
```

### Make diagrams

```
cd docs
make
```

## Running The Tests

This skeleton provides three frameworks for running tests.

You can choose one or two and remove the other, or even use all of them for different types of tests.

By default, both Jest and Karma are configured to run the same tests with Jest's matchers (see Jest documentation for more information).

If you wish to only run certain tests under one of the runners, wrap them in an `if`, like this:

```js
if (jest) {
  // since only jest supports creating snapshot:
  it('should render correctly', () => {
    expect(document.body.outerHTML).toMatchSnapshot();
  });
}
```

### Jest + Jasmine 2

Jest is a powerful unit testing runner and framework.
It runs really fast, however the tests are run under NodeJS, not the browser.
This means there might be some cases where something you'd expect works in reality, but fails in a test. One of those things will be SVG, which isn't supported under NodeJS. However, the framework is perfect for doing unit tests of pure functions, and works pretty well in combination with `aurelia-testing`.

To create new Jest tests, create files with the extension `.spec.ts`, either in the `src` directory or in the `test/unit` directory.

To run the Jest unit tests, run:

```shell
npm test
```

To run the Jest watcher (re-runs tests on changes), run:

```shell
npm start -- test.jest.watch
```


### Protractor (E2E / integration tests)

Integration tests can be performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your cucumber features into the folder ```test/e2e/features``` and implementation scripts in ```test/e2e/src```

2. Run the tests by invoking

```shell
$ source environment-test.sh
$ npm start -- e2e
```

#### Developing E2E tests

It will take considerably more time for a developer to use previous command to get e2e tests executed. There is a faster way to do it. Given that you have already two shells: one shell for running Leto and the other one for running mocked api, please open a new shell and run the following commands:

```shell
$ source environment-test.sh
$ npm start -- e2e.protractor
```

In this way, the time to lauch Leto and api server is saved. However, you may need to restart mocked api server and reset dummy.json if your bdd tests creates new test fixtures.

And it would be benefitial for you as a developer to disable headless mode:

open test/e2e/protractor.shared.conf.js and comment out line 33 and 34:

```
              //'--headless',
              //'--no-gpu'
```

And at line 37, you can remove the wild card and put the full name of your feature in, which tells protractor to execute your feature only.

```
        specs: ['features/your_own.feature'],
```

### Tip

protractor has `browser.pause()` and `browser.debug()` working only up till node 7.10. If you really want the browser to stop where you pointted it, please change node versions.

## Generate an new app

```
npm install -g gulp
```

the gulp task is:

```shell
gulp
```

## Run it inside a Docker container

Please go through installing docker page here: https://docs.docker.com/get-started/

Then come back to run these commands:

   ```shell
      sudo docker build -t leto .
   ```

Above command builds the container. And then run it :)

   ```shell
      sudo docker run -p 9000:80 leto
   ```

Then refresh your local browser. You would see it in action. What's more, you will
also see access log at your console output.
