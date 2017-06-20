'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _HttpUtils = require('../HttpUtils');

describe('HttpUtils', function () {

  it('convertAndRespond error without name ', function () {
    var error = {};

    (0, _HttpUtils.convertAndRespond)(context, error);
    _assert2['default'].equal(context.status, 500);
  });
});