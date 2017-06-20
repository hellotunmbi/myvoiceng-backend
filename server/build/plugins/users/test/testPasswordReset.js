'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _restauth = require('restauth');

var _testTestManager = require('~/test/testManager');

var _testTestManager2 = _interopRequireDefault(_testTestManager);

var assert = require('assert');

describe('PasswordReset', function () {
  var _this = this;

  var app = _testTestManager2['default'].app;
  var models = app.data.sequelize.models;
  var client = undefined;
  var sandbox = undefined;
  var publisherUserStub = undefined;

  before(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_testTestManager2['default'].start());

        case 2:
          sandbox = _sinon2['default'].sandbox.create();
          publisherUserStub = _sinon2['default'].stub(app.plugins.get().users.publisher, "publish", function (key, msg) {
            //assert.equal(key, "user.register");
            assert(msg);
          });

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  after(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          publisherUserStub.restore();
          sandbox.restore();
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(_testTestManager2['default'].stop());

        case 4:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  beforeEach(function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          client = _testTestManager2['default'].createClient();

        case 1:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  function resetPasswordProcedure(email, passwordNew) {
    var resetPaswordData, res, resUser, user, token, verifyPaswordData, loginData, resLogin;
    return regeneratorRuntime.async(function resetPasswordProcedure$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          resetPaswordData = {
            email: email
          };
          context$2$0.next = 3;
          return regeneratorRuntime.awrap(client.post('v1/auth/reset_password', resetPaswordData));

        case 3:
          res = context$2$0.sent;

          assert(res);

          // Verify that the reset token has been created
          context$2$0.next = 7;
          return regeneratorRuntime.awrap(models.User.find({
            where: {
              email: email
            },
            include: [{
              model: models.PasswordReset
            }]
          }));

        case 7:
          resUser = context$2$0.sent;
          user = resUser.get();

          assert(user);

          token = user.PasswordReset.get().token;

          //console.log(token);
          assert(token);

          // reset the passsword with the token
          verifyPaswordData = {
            email: email,
            token: token,
            password: passwordNew
          };
          context$2$0.next = 15;
          return regeneratorRuntime.awrap(client.post('v1/auth/verify_reset_password_token', verifyPaswordData));

        case 15:
          res = context$2$0.sent;

          assert(res);

          loginData = {
            username: email,
            password: passwordNew
          };
          context$2$0.next = 20;
          return regeneratorRuntime.awrap(client.login(loginData));

        case 20:
          resLogin = context$2$0.sent;

          assert(resLogin);

        case 22:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }
  it('reset request', function callee$1$0() {
    var email, passwordOld, passwordNew;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          email = "alice@mail.com";
          passwordOld = "password";
          passwordNew = "passwordnew";
          context$2$0.next = 5;
          return regeneratorRuntime.awrap(resetPasswordProcedure(email, passwordNew));

        case 5:
          context$2$0.next = 7;
          return regeneratorRuntime.awrap(resetPasswordProcedure(email, passwordOld));

        case 7:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  it.skip('reset password email', function callee$1$0() {
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
  it('reset passord with malformed email', function callee$1$0(done) {
    var data;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          data = {
            email: "alic"
          };
          context$2$0.prev = 1;
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(client.post('v1/auth/reset_password', data));

        case 4:
          assert(false);
          context$2$0.next = 12;
          break;

        case 7:
          context$2$0.prev = 7;
          context$2$0.t0 = context$2$0['catch'](1);

          assert.equal(context$2$0.t0.statusCode, 400);
          console.log(context$2$0.t0.body);
          //assert.equal(res.body.name, '');
          done();

        case 12:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[1, 7]]);
  });
  it('verify with wrong token', function callee$1$0() {
    var email, verifyPaswordData;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          email = "alice@mail.com";
          verifyPaswordData = {
            email: email,
            token: "1234567890123456",
            password: "passWordNew"
          };
          context$2$0.prev = 2;
          context$2$0.next = 5;
          return regeneratorRuntime.awrap(client.post('v1/auth/verify_reset_password_token', verifyPaswordData));

        case 5:
          assert(false);
          context$2$0.next = 13;
          break;

        case 8:
          context$2$0.prev = 8;
          context$2$0.t0 = context$2$0['catch'](2);

          assert(context$2$0.t0);
          assert.equal(context$2$0.t0.statusCode, 422);
          //console.log(res);
          assert.equal(context$2$0.t0.body.name, 'TokenInvalid');

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[2, 8]]);
  });
  it('verify reset password with malformed token', function callee$1$0() {
    var email, verifyPaswordData;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          email = "alice@mail.com";
          verifyPaswordData = {
            email: email,
            token: "123456789012345",
            password: "passWordNew"
          };
          context$2$0.prev = 2;
          context$2$0.next = 5;
          return regeneratorRuntime.awrap(client.post('v1/auth/verify_reset_password_token', verifyPaswordData));

        case 5:
          assert(false);
          context$2$0.next = 13;
          break;

        case 8:
          context$2$0.prev = 8;
          context$2$0.t0 = context$2$0['catch'](2);

          assert(context$2$0.t0);
          assert.equal(context$2$0.t0.statusCode, 400);
          //console.log(res.body);
          assert.equal(context$2$0.t0.body.validation[0].stack, 'instance.token does not meet minimum length of 16');

        case 13:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this, [[2, 8]]);
  });
});

// Create the reset token

// reset the password with the token

// reset the password with the token