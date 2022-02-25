/**
 * Allow-methods module
 * @module allow-methods
 */
'use strict';

const httpError = require('http-errors');

/**
 * Create an Express middleware function which errors if an HTTP method is not allowed.
 *
 * @access public
 * @param {Array<String>} [methods=[]]
 *     The HTTP methods which will not throw 405 errors.
 * @param {String} [message]
 *     The error message text to use if a disallowed method is used.
 * @returns {ExpressMiddleware}
 *     Returns a middleware function.
 */
module.exports = function allowMethods(methods, message) {
	methods = normalizeAllowedMethods(methods || []);
	return (request, response, next) => {
		if (!methods.includes(request.method.toUpperCase())) {
			response.header('Allow', methods.join(', '));
			return next(httpError(405, message || 'Method Not Allowed'));
		}
		next();
	};
};

/**
 * Normalise an array of HTTP methods.
 *
 * @access private
 * @param {Array<String>} methods
 *     The HTTP methods to normalise.
 * @returns {Array<String>}
 *     Returns an array of capitalised HTTP methods.
 */
function normalizeAllowedMethods(methods) {
	return methods.map(method => method.toUpperCase());
}

/**
 * A middleware function.
 * @callback ExpressMiddleware
 * @param {Object} request
 *     An Express Request object.
 * @param {Object} response
 *     An Express Response object.
 * @returns {undefined}
 *     Returns nothing.
 */
