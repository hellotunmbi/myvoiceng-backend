'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koaPassport = require('koa-passport');

var _koaPassport2 = _interopRequireDefault(_koaPassport);

var _authStrategyLocalStrategy = require('./auth-strategy/LocalStrategy');

var config = require('config');

var log = require('logfilename')(__filename);

exports['default'] = function (app, publisherUser) {

  var models = app.data.sequelize.models;

  (0, _authStrategyLocalStrategy.register)(_koaPassport2['default'], models);

  if (config.has('authentication.facebook')) {
    var registerToken = require('./auth-strategy/FacebookTokenStrategy').register;
    registerToken(_koaPassport2['default'], models, publisherUser);
  }

  _koaPassport2['default'].serializeUser(function (user, done) {
    log.debug("serializeUser ", user);
    //TODO use redis
    done(null, user);
  });

  _koaPassport2['default'].deserializeUser(function (id, done) {
    log.debug("deserializeUser ", id);
    //TODO use redis
    done(null, id);
  });
};

;
module.exports = exports['default'];