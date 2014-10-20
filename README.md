
Allow-Methods
=============

Express/connect middleware to handle 405 errors, when a request method is not supported by your route or application.

**Current Version:** *0.0.0*  
**Node Support:** *0.10.x, 0.11.x*  
**License:** [MIT][mit]  
**Build Status:** [![Build Status][travis-img]][travis]


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
make lint test
```


License
-------

Allow-Methods is licensed under the [MIT][mit] license.  
Copyright &copy; 2014, Rowan Manning



[mit]: LICENSE
[npm]: https://npmjs.org/
[travis]: https://travis-ci.org/rowanmanning/allow-methods
[travis-img]: https://travis-ci.org/rowanmanning/allow-methods.svg?branch=master
