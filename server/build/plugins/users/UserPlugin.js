'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = UserPlugin;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logfilename = require('logfilename');

var _logfilename2 = _interopRequireDefault(_logfilename);

var _rabbitmqPubsub = require('rabbitmq-pubsub');

var _PassportAuth = require('./PassportAuth');

var _PassportAuth2 = _interopRequireDefault(_PassportAuth);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

// Jobs

var _jobsMailMailJob = require('./jobs/mail/MailJob');

var _jobsMailMailJob2 = _interopRequireDefault(_jobsMailMailJob);

var _meMeRouter = require('./me/MeRouter');

var _meMeRouter2 = _interopRequireDefault(_meMeRouter);

var _userUserRouter = require('./user/UserRouter');

var _userUserRouter2 = _interopRequireDefault(_userUserRouter);

var _userUserApi = require('./user/UserApi');

var _userUserApi2 = _interopRequireDefault(_userUserApi);

var _complaintsComplaintRouter = require('../complaints/ComplaintRouter');

var _complaintsComplaintRouter2 = _interopRequireDefault(_complaintsComplaintRouter);

var _authenticationAuthenticationRouter = require('./authentication/AuthenticationRouter');

var _authenticationAuthenticationRouter2 = _interopRequireDefault(_authenticationAuthenticationRouter);

var log = new _logfilename2['default'](__filename);

var publisherOption = { exchange: "user" };

function UserPlugin(app) {

  app.data.registerModelsFromDir(__dirname, './models');

  var publisher = createPublisher();
  setupAuthentication(app, publisher);

  setupRouter(app, publisher);

  var models = app.data.models();

  var mailJob = (0, _jobsMailMailJob2['default'])(_config2['default']);

  var parts = [mailJob, publisher];

  //scheduled tasks
  //JobNotificationScheduled(app, publisher);

  return {
    publisher: publisher,
    start: function start() {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, part;

      return regeneratorRuntime.async(function start$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            context$2$0.prev = 4;
            _iterator = parts[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              context$2$0.next = 13;
              break;
            }

            part = _step.value;
            context$2$0.next = 10;
            return regeneratorRuntime.awrap(part.start(app));

          case 10:
            _iteratorNormalCompletion = true;
            context$2$0.next = 6;
            break;

          case 13:
            context$2$0.next = 19;
            break;

          case 15:
            context$2$0.prev = 15;
            context$2$0.t0 = context$2$0['catch'](4);
            _didIteratorError = true;
            _iteratorError = context$2$0.t0;

          case 19:
            context$2$0.prev = 19;
            context$2$0.prev = 20;

            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }

          case 22:
            context$2$0.prev = 22;

            if (!_didIteratorError) {
              context$2$0.next = 25;
              break;
            }

            throw _iteratorError;

          case 25:
            return context$2$0.finish(22);

          case 26:
            return context$2$0.finish(19);

          case 27:
            ;
            context$2$0.next = 33;
            break;

          case 30:
            context$2$0.prev = 30;
            context$2$0.t1 = context$2$0['catch'](0);

            log.error('cannot start: ' + context$2$0.t1);

          case 33:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 30], [4, 15, 19, 27], [20,, 22, 26]]);
    },

    stop: function stop() {
      return regeneratorRuntime.async(function stop$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(_bluebird2['default'].each(parts, function (obj) {
              return obj.stop(app);
            }));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    seedDefault: function seedDefault() {
      var seedDefaultFns = [models.Group.seedDefault, models.User.seedDefault, models.Permission.seedDefault, models.GroupPermission.seedDefault];
      return _bluebird2['default'].each(seedDefaultFns, function (fn) {
        return fn();
      });
    },

    isSeeded: function isSeeded() {
      var count;
      return regeneratorRuntime.async(function isSeeded$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(models.User.count());

          case 2:
            count = context$2$0.sent;

            log.debug("#users ", count);
            return context$2$0.abrupt('return', count);

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

function setupRouter(app, publisherUser) {
  (0, _authenticationAuthenticationRouter2['default'])(app, publisherUser);
  (0, _meMeRouter2['default'])(app);
  (0, _complaintsComplaintRouter2['default'])(app, publisherUser);
  var userApi = (0, _userUserApi2['default'])(app);
  (0, _userUserRouter2['default'])(app, userApi);
}

function createPublisher() {
  var rabbitmq = _config2['default'].rabbitmq;
  if (rabbitmq && rabbitmq.url) {
    publisherOption.url = rabbitmq.url;
  }

  log.info("createPublisher: ", publisherOption);
  return new _rabbitmqPubsub.Publisher(publisherOption);
}

function setupAuthentication(app, publisherUser) {
  var auth = new _PassportAuth2['default'](app, publisherUser);
  app.auth = auth;
  return auth;
}
module.exports = exports['default'];