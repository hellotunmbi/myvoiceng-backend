'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _rabbitmqPubsub = require('rabbitmq-pubsub');

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _MailJob = require('./MailJob');

var _MailJob2 = _interopRequireDefault(_MailJob);

describe('MailJob', function () {
  var _this = this;

  var publisher = undefined;
  var sandbox = undefined;

  before(function callee$1$0() {
    var options;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          options = { exchange: "user", url: _config2['default'].rabbitmq.url };

          publisher = new _rabbitmqPubsub.Publisher(options, _config2['default'].log);
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(publisher.start());

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
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(publisher.stop());

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });

  beforeEach(function (done) {
    sandbox = _sinon2['default'].sandbox.create();
    done();
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });

  var user = {
    email: 'idonotexist@mail.com',
    code: '1234567890123456'
  };

  var emailType = 'user.registering';

  describe('Basic', function () {
    var mailJob = undefined;
    beforeEach(function (done) {
      mailJob = new _MailJob2['default'](_config2['default']);
      done();
    });

    afterEach(function (done) {
      done();
    });
    it('getTemplate ok', function callee$2$0() {
      var content;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(mailJob.getTemplate(emailType));

          case 2:
            content = context$3$0.sent;

            (0, _assert2['default'])(content);

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('getTemplate ko', function callee$2$0() {
      var content;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(mailJob.getTemplate(emailType));

          case 2:
            content = context$3$0.sent;

            (0, _assert2['default'])(content);

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('send user registration email', function callee$2$0() {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(mailJob._sendEmail(emailType, user));

          case 2:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('send reset password email', function callee$2$0() {
      var passwordReset;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            passwordReset = 'user.resetpassword';
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(mailJob._sendEmail(passwordReset, user));

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('invalid email type', function callee$2$0(done) {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.prev = 0;
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(mailJob._sendEmail('invalidEmailType', user));

          case 3:
            context$3$0.next = 10;
            break;

          case 5:
            context$3$0.prev = 5;
            context$3$0.t0 = context$3$0['catch'](0);

            (0, _assert2['default'])(context$3$0.t0);
            _assert2['default'].equal(context$3$0.t0.code, 'ENOENT');
            done();

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[0, 5]]);
    });
    it('no email', function callee$2$0(done) {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.prev = 0;
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(mailJob._sendEmail(emailType, {}));

          case 3:
            context$3$0.next = 10;
            break;

          case 5:
            context$3$0.prev = 5;
            context$3$0.t0 = context$3$0['catch'](0);

            (0, _assert2['default'])(context$3$0.t0);
            _assert2['default'].equal(context$3$0.t0.name, 'email not set');
            done();

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[0, 5]]);
    });
    it('no token', function callee$2$0(done) {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.prev = 0;
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(mailJob._sendEmail(emailType, { email: user.email }));

          case 3:
            context$3$0.next = 10;
            break;

          case 5:
            context$3$0.prev = 5;
            context$3$0.t0 = context$3$0['catch'](0);

            (0, _assert2['default'])(context$3$0.t0);
            _assert2['default'].equal(context$3$0.t0.name, 'token not set');
            done();

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[0, 5]]);
    });
  });

  describe('StartStop', function () {
    var mailJob = undefined;
    beforeEach(function callee$2$0() {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            mailJob = new _MailJob2['default'](_config2['default']);
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(mailJob.start());

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    afterEach(function callee$2$0() {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            mailJob._sendEmail.restore();
            context$3$0.next = 3;
            return regeneratorRuntime.awrap(mailJob.stop());

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });

    it('publish user.register', function callee$2$0(done) {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            _sinon2['default'].stub(mailJob, "_sendEmail", function (type, userToSend) {
              //console.log("_sendEmail has been called");
              _assert2['default'].equal(type, 'user.registering');
              (0, _assert2['default'])(userToSend);
              _assert2['default'].equal(userToSend.email, user.email);
              done();
            });

            context$3$0.next = 3;
            return regeneratorRuntime.awrap(publisher.publish("user.registering", JSON.stringify(user)));

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('publish user.resetpassword', function callee$2$0(done) {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            _sinon2['default'].stub(mailJob, "_sendEmail", function (type, userToSend) {
              //console.log("_sendEmail has been called");
              _assert2['default'].equal(type, 'user.resetpassword');
              (0, _assert2['default'])(userToSend);
              _assert2['default'].equal(userToSend.email, user.email);
              done();
            });

            context$3$0.next = 3;
            return regeneratorRuntime.awrap(publisher.publish("user.resetpassword", JSON.stringify(user)));

          case 3:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
    it('publish a non JSON message', function callee$2$0(done) {
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            _sinon2['default'].stub(mailJob, "_sendEmail", function () {
              (0, _assert2['default'])(false);
              done();
            });

            context$3$0.next = 3;
            return regeneratorRuntime.awrap(publisher.publish("user.resetpassword", "not a json"));

          case 3:
            done();

          case 4:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this);
    });
  });
  describe('Ko', function () {
    it('login failed', function callee$2$0(done) {
      var badPasswordConfig, mailJob;
      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            badPasswordConfig = _lodash2['default'].clone(_config2['default'], true);

            //console.log(JSON.stringify(badPasswordConfig));
            badPasswordConfig.mail.options.auth.pass = "1234567890";

            mailJob = new _MailJob2['default'](badPasswordConfig);
            context$3$0.prev = 3;
            context$3$0.next = 6;
            return regeneratorRuntime.awrap(mailJob._sendEmail(emailType, user));

          case 6:
            context$3$0.next = 13;
            break;

          case 8:
            context$3$0.prev = 8;
            context$3$0.t0 = context$3$0['catch'](3);

            (0, _assert2['default'])(context$3$0.t0);
            _assert2['default'].equal(context$3$0.t0.code, "EAUTH");
            done();

          case 13:
          case 'end':
            return context$3$0.stop();
        }
      }, null, _this, [[3, 8]]);
    });
  });
});