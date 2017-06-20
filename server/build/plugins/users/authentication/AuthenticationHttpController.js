'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _AuthenticationApi = require('./AuthenticationApi');

var _AuthenticationApi2 = _interopRequireDefault(_AuthenticationApi);

var log = require('logfilename')(__filename);

exports['default'] = function (app, publisherUser) {
  var respond = app.utils.http.respond;
  var authApi = (0, _AuthenticationApi2['default'])(app, publisherUser);

  function login(req, res) {
    log.debug("login", req.user);
    res.send(_lodash2['default'].omit(req.user, 'id'));
  }

  function loginFacebookCallback() /*req, res*/{
    (0, _assert2['default'])(false);
  }

  function logout(req, res) {
    log.debug("logout");
    req.logout();
    res.send({ success: true });
  }

  function register(req, res) {
    log.debug("register user ", req.body);
    respond(authApi, authApi.createPending, [req.body], res);
  }

  function verifyEmailCode(req, res) {
    log.debug("verifyEmailCode: ", req.body);
    respond(authApi, authApi.verifyEmailCode, [req.body], res);
  }

  function resetPassword(req, res) {
    log.debug("resetPassword: ", req.body);
    respond(authApi, authApi.resetPassword, [req.body], res);
  }

  function verifyResetPasswordToken(req, res) {
    log.debug("verifyResetPasswordToken: ", req.body);
    respond(authApi, authApi.verifyResetPasswordToken, [req.body], res);
  }

  return {
    login: login,
    logout: logout,
    register: register,
    verifyEmailCode: verifyEmailCode,
    resetPassword: resetPassword,
    verifyResetPasswordToken: verifyResetPasswordToken,
    loginFacebookCallback: loginFacebookCallback
  };
};

module.exports = exports['default'];