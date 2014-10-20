/* jshint maxstatements: false, maxlen: false */
/* global afterEach, beforeEach, describe, it */
'use strict';

var assert = require('proclaim');
var mockery = require('mockery');
var sinon = require('sinon');

describe('allow-methods', function () {
    var allowMethods, error405, httpError;

    beforeEach(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false,
            warnOnReplace: false
        });
        error405 = {status: 405};
        httpError = sinon.stub().returns(error405);
        mockery.registerMock('http-errors', httpError);
        allowMethods = require('../lib/allow-methods');
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    it('should be a function', function () {
        assert.isFunction(allowMethods);
    });

    it('should return a function', function () {
        assert.isFunction(allowMethods());
    });

    describe('returned function', function () {
        var request, response;

        beforeEach(function () {
            request = {
                method: 'foo',
            };
            response = {
                header: sinon.spy()
            };
        });

        describe('when request method is allowed', function () {

            it('should not pass an error', function (done) {
                request.method = 'FOO';
                allowMethods(['FOO', 'bar'])(request, response, function (error) {
                    assert.isUndefined(error);
                    done();
                });
            });

            it('should ignore case in the allowed methods', function (done) {
                request.method = 'BAR';
                allowMethods(['FOO', 'bar'])(request, response, function (error) {
                    assert.isUndefined(error);
                    done();
                });
            });

            it('should ignore case in the request method', function (done) {
                request.method = 'foo';
                allowMethods(['FOO', 'bar'])(request, response, function (error) {
                    assert.isUndefined(error);
                    done();
                });
            });

        });

        describe('when request method is not allowed', function () {

            it('should pass a 405 error', function (done) {
                request.method = 'BAZ';
                allowMethods(['FOO', 'bar'])(request, response, function (error) {
                    assert.strictEqual(error, error405);
                    assert.strictEqual(httpError.withArgs(405, undefined).callCount, 1);
                    done();
                });
            });

            it('should pass a 405 error with a custom message if specified', function (done) {
                request.method = 'BAZ';
                allowMethods(['FOO', 'bar'], 'foo')(request, response, function (error) {
                    assert.strictEqual(error, error405);
                    assert.strictEqual(httpError.withArgs(405, 'foo').callCount, 1);
                    done();
                });
            });

            it('should set the response `Allow` header to the allowed methods if the request method is not allowed', function (done) {
                request.method = 'BAZ';
                allowMethods(['FOO', 'bar'])(request, response, function () {
                    assert.strictEqual(response.header.withArgs('Allow', 'FOO, BAR').callCount, 1);
                    done();
                });
            });

        });

    });

});
