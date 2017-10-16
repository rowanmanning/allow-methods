
Allow-Methods
=============

Express/connect middleware to handle 405 errors, when a request method is not supported by your route or application.

[![NPM version][shield-npm]][info-npm]
[![Node.js version support][shield-node]][info-node]
[![Build status][shield-build]][info-build]
[![Code coverage][shield-coverage]][info-coverage]
[![Dependencies][shield-dependencies]][info-dependencies]
[![MIT licensed][shield-license]][info-license]


Install
-------

Install Allow-Methods with [npm][npm]:

```sh
npm install allow-methods
```


Usage
-----

```js
var allowMethods = require('allow-methods');
```

`allowMethods` will return a middleware function that will error if the request method does not match one of the allowed methods. The error will have `message` and `status` properties which you can use.

It accepts two arguments. Firstly, an array of allowed methods:

```js
allowMethods(['get', 'head', 'post']);
```

Secondly (optionally) a message which will be used in the error if the request message does not match:

```js
allowMethods(['get', 'head'], 'Unsupported method');
```

### Route-level

```js
var express = require('express');
var app = express();

app
    .route('/example')
    // Only requests with a GET/HEAD method will continue
    .all(allowMethods(['get', 'head']))
    // Define GET handler
    .get(function () { ... });
```

If you want to do something useful with the error, for example output a sensible JSON response, you will need to define an error handler for your application (*after* the route definition):

```js
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({
        message: err.message
    });
});
```

### Application-level

```js
var express = require('express');
var app = express();

// Only allow GET/HEAD methods across the entire application
app.use(allowMethods(['get', 'head']));
```


Contributing
------------

To contribute to Allow-Methods, clone this repo locally and commit your code on a separate branch.

Please write unit tests for your code, and check that everything works by running the following before opening a pull-request:

```sh
make ci
```


Support and Migration
---------------------

Allow Methods major versions are normally supported for 6 months after their last minor release. This means that patch-level changes will be added and bugs will be fixed. The table below outlines the end-of-support dates for major versions, and the last minor release for that version.

We also maintain a [migration guide](MIGRATION.md) to help you migrate.

| :grey_question: | Major Version   | Last Minor Release | Node.js Versions | Support End Date |
| :-------------- | :-------------- | :----------------- | :--------------- | :--------------- |
| :heart:         | 2               | N/A                | 4+               | N/A              |
| :hourglass:     | [1][1.x-branch] | 1.0                | 0.10–7           | 2018-04-16       |

If you're opening issues related to these, please mention the version that the issue relates to.


License
-------

Allow-Methods is licensed under the [MIT][info-license] license.  
Copyright &copy; 2015, Rowan Manning



[1.x-branch]: https://github.com/rowanmanning/allow-methods/tree/1.x
[npm]: https://npmjs.org/

[info-coverage]: https://coveralls.io/github/rowanmanning/allow-methods
[info-dependencies]: https://gemnasium.com/rowanmanning/allow-methods
[info-license]: LICENSE
[info-node]: package.json
[info-npm]: https://www.npmjs.com/package/allow-methods
[info-build]: https://travis-ci.org/rowanmanning/allow-methods
[shield-coverage]: https://img.shields.io/coveralls/rowanmanning/allow-methods.svg
[shield-dependencies]: https://img.shields.io/gemnasium/rowanmanning/allow-methods.svg
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/badge/node.js%20support-4–8-brightgreen.svg
[shield-npm]: https://img.shields.io/npm/v/allow-methods.svg
[shield-build]: https://img.shields.io/travis/rowanmanning/allow-methods/master.svg
