'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

describe('Configure Database', function () {
  var _this = this;

  var app = _testTestManager2['default'].app;
  var models = app.data.sequelize.models;

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

  it.skip('should successfully find the Admin group', function callee$1$0() {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          res = models.Group.findByName("Admin");

          _chai2['default'].assert.typeOf(res.get().id, 'number');
          _chai2['default'].assert.equal(res.get().description, 'Administrator, can perform any actions');

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });

  it('should successfully find the Users get /me Permission', function callee$1$0() {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(models.Permission.findByName("/me get"));

        case 2:
          res = context$2$0.sent;

          _chai2['default'].assert(res);

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });
});