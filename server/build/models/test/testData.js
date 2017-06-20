//import assert from 'assert';
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

describe('Data', function () {
  var _this = this;

  before(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].start());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].stop());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('seedIfEmpty when already seeded', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].app.data.seedIfEmpty());

        case 2:
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(_testTestManager2['default'].app.data.seedIfEmpty());

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});