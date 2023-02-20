
# Allow-Methods

Express/connect middleware to handle 405 errors, when a request method is not supported by your route or application.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 16+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install allow-methods
```

Load the library into your code with a `require` call:

```js
const allowMethods = require('allow-methods');
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
const express = require('express');
const app = express();

app
    .route('/example')
    // Only requests with a GET/HEAD method will continue
    .all(allowMethods(['get', 'head']))
    // Define GET handler
    .get(function () { ... });
```

If you want to do something useful with the error, for example output a sensible JSON response, you will need to define an error handler for your application (*after* the route definition):

```js
app.use(function (error, requst, response, next) {
    response.status(error.status || 500).send({
        message: error.message
    });
});
```

### Application-level

```js
const express = require('express');
const app = express();

// Only allow GET/HEAD methods across the entire application
app.use(allowMethods(['get', 'head']));
```


## Contributing

[The contributing guide is available here](docs/contributing.md). All contributors must follow [this library's code of conduct](docs/code_of_conduct.md).


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2015, Rowan Manning
