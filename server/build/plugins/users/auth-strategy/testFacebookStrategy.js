'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

var _FacebookStrategy = require('./FacebookStrategy');

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

describe('Facebook', function () {
  var _this = this;

  var models = _testTestManager2['default'].app.data.sequelize.models;
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

  var req = {};
  var accessToken = "123456789";
  var refreshToken = "123456789";
  var chance = new _chance2['default']();
  var profileId = chance.integer({ min: 1000000, max: 1000000000 }).toString();
  var profile = {
    id: profileId,
    name: {
      givenName: "alain",
      familyName: 'proviste' + profileId
    },
    _json: {
      email: 'alain.proviste' + profileId + '@gmail.com'
    }
  };

  it('create a new user, register it', function callee$1$0() {
    var res;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap((0, _FacebookStrategy.verify)(models, null, req, accessToken, refreshToken, profile));

        case 2:
          res = context$2$0.sent;

          //console.log(res.err)
          (0, _assert2['default'])(!res.err);
          (0, _assert2['default'])(res.user);
          (0, _assert2['default'])(!res.user.password);
          //console.log("verify again")
          context$2$0.next = 8;
          return regeneratorRuntime.awrap((0, _FacebookStrategy.verify)(models, null, req, accessToken, refreshToken, profile));

        case 8:
          res = context$2$0.sent;

          //console.log(res.err)
          (0, _assert2['default'])(!res.err);
          (0, _assert2['default'])(res.user);
          (0, _assert2['default'])(!res.user.password);

          profile.id = chance.integer({ min: 1000000, max: 1000000000 }).toString();
          context$2$0.next = 15;
          return regeneratorRuntime.awrap((0, _FacebookStrategy.verify)(models, null, req, accessToken, refreshToken, profile));

        case 15:
          res = context$2$0.sent;

          //console.log(res.err)
          (0, _assert2['default'])(!res.err);
          (0, _assert2['default'])(res.user);
          (0, _assert2['default'])(!res.user.password);
          _assert2['default'].equal(res.user.email, profile._json.email);

        case 20:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
});