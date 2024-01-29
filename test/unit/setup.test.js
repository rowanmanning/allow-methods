'use strict';

const {afterEach} = require('node:test');
const td = require('testdouble');

td.config({
	ignoreWarnings: true
});

afterEach(() => {
	td.reset();
});
