'use strict';

const httpError = require('http-errors');

module.exports = allowMethods;

function allowMethods(methods, message) {
	methods = normalizeAllowedMethods(methods || []);
	return function(request, response, next) {
		if (methods.indexOf(request.method.toUpperCase()) === -1) {
			response.header('Allow', methods.join(', '));
			return next(httpError(405, message));
		}
		next();
	};
}

function normalizeAllowedMethods(methods) {
	methods = Array.prototype.slice.call(methods);
	return methods.map(toUpperCase);
}

function toUpperCase(str) {
	return str.toUpperCase();
}
