'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logfilename = require('logfilename');

var _logfilename2 = _interopRequireDefault(_logfilename);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var chance = new _chance2['default']();

var readFileThunk = function readFileThunk(src) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].readFile(src, { encoding: 'utf8' }, function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

exports['default'] = function (app, publisherUser) {
  var models = app.data.sequelize.models;
  var log = new _logfilename2['default'](__filename);
  var validateJson = app.utils.api.validateJson;
  return {
    createPending: function createPending(userPendingIn) {
      var userType, user, code, userPendingOut;
      return regeneratorRuntime.async(function createPending$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            validateJson(userPendingIn, require('./schema/createPending.json'));
            userType = userPendingIn.type;

            if (!(userType != "Worker" && userType != "Employer")) {
              context$2$0.next = 4;
              break;
            }

            return context$2$0.abrupt('return', {
              success: false,
              message: "Invalid user type, allowed values. type:[Worker, Employer]"
            });

          case 4:

            log.debug("createPending: ", userPendingIn);
            context$2$0.next = 7;
            return regeneratorRuntime.awrap(models.User.findByEmail(userPendingIn.email));

          case 7:
            user = context$2$0.sent;

            if (user) {
              context$2$0.next = 19;
              break;
            }

            code = createToken();
            userPendingOut = {
              code: code,
              firstName: userPendingIn.firstName,
              lastName: userPendingIn.lastName,
              email: userPendingIn.email,
              password: userPendingIn.password,
              type: userPendingIn.type,
              platform: userPendingIn.platform,
              deviceToken: userPendingIn.deviceToken
            };

            log.info("createPending code ", userPendingOut.code);
            context$2$0.next = 14;
            return regeneratorRuntime.awrap(models.UserPending.create(userPendingOut));

          case 14:
            delete userPendingOut.password;
            context$2$0.next = 17;
            return regeneratorRuntime.awrap(publisherUser.publish("user.registering", JSON.stringify(userPendingOut)));

          case 17:
            context$2$0.next = 22;
            break;

          case 19:
            if (!user) {
              context$2$0.next = 22;
              break;
            }

            log.info("already registered", userPendingIn.email);
            return context$2$0.abrupt('return', {
              success: false,
              user: user.toJSON(),
              message: "This email account has already been registered, please click 'forgot password' on the sign in screen if you cannot recall your password"
            });

          case 22:
            return context$2$0.abrupt('return', {
              success: true,
              message: "confirm email"
            });

          case 23:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    verifyEmailCode: function verifyEmailCode(param) {
      var res, userPending, userToCreate, user;
      return regeneratorRuntime.async(function verifyEmailCode$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.debug("verifyEmailCode: ", param);
            validateJson(param, require('./schema/verifyEmailCode.json'));
            context$2$0.next = 4;
            return regeneratorRuntime.awrap(models.UserPending.find({
              where: {
                code: param.code
              }
            }));

          case 4:
            res = context$2$0.sent;

            if (!res) {
              context$2$0.next = 22;
              break;
            }

            userPending = res.get();

            log.debug("verifyEmailCode: userPending: ", userPending);
            userToCreate = _lodash2['default'].pick(userPending, 'firstName', 'lastName', 'email', 'passwordHash', 'type', 'platform', 'deviceToken');
            context$2$0.next = 11;
            return regeneratorRuntime.awrap(models.User.createUserInGroups(userToCreate, ["User"]));

          case 11:
            user = context$2$0.sent;
            context$2$0.next = 14;
            return regeneratorRuntime.awrap(models.ChatUser.createPlatformUser(user, userToCreate.platform, userToCreate.deviceToken, app.server.io));

          case 14:
            context$2$0.next = 16;
            return regeneratorRuntime.awrap(models.UserPending.destroy({
              where: {
                email: userToCreate.email
              }
            }));

          case 16:
            log.debug("verifyEmailCode: created user ", user.toJSON());
            context$2$0.next = 19;
            return regeneratorRuntime.awrap(publisherUser.publish("user.registered", JSON.stringify(user.toJSON())));

          case 19:
            return context$2$0.abrupt('return', {
              success: true,
              message: "Thanks for confirming your registration, please login via the app"
            });

          case 22:
            log.warn("verifyEmailCode: no such code ", param.code);
            throw {
              code: 422,
              name: "NoSuchCode"
            };

          case 24:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    resetPassword: function resetPassword(payload) {
      var email, user, token, passwordReset, passwordResetPublished;
      return regeneratorRuntime.async(function resetPassword$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            validateJson(payload, require('./schema/resetPassword.json'));
            email = payload.email;

            log.info("resetPassword: ", email);
            context$2$0.next = 5;
            return regeneratorRuntime.awrap(models.User.findByEmail(email));

          case 5:
            user = context$2$0.sent;

            if (!user) {
              context$2$0.next = 18;
              break;
            }

            log.info("resetPassword: find user: ", user.get());
            token = createToken();
            passwordReset = {
              token: token,
              user_id: user.id
            };
            context$2$0.next = 12;
            return regeneratorRuntime.awrap(models.PasswordReset.upsert(passwordReset));

          case 12:
            passwordResetPublished = {
              code: token,
              email: user.email
            };

            log.debug("resetPassword: publish: ", passwordResetPublished);
            context$2$0.next = 16;
            return regeneratorRuntime.awrap(publisherUser.publish('user.resetpassword', JSON.stringify(passwordResetPublished)));

          case 16:
            context$2$0.next = 19;
            break;

          case 18:
            log.info("resetPassword: no such email: ", email);

          case 19:
            return context$2$0.abrupt('return', {
              success: true
            });

          case 20:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    resetPasswordOldNew: function resetPasswordOldNew(loggedInUser, payload) {
      var user, comparePassword;
      return regeneratorRuntime.async(function resetPasswordOldNew$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            validateJson(payload, require('./schema/resetOldNewPassword.json'));
            // find the user
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(models.User.findById(loggedInUser.id));

          case 3:
            user = context$2$0.sent;

            if (!(user && payload.oldPassword && payload.newPassword)) {
              context$2$0.next = 15;
              break;
            }

            context$2$0.next = 7;
            return regeneratorRuntime.awrap(user.comparePassword(payload.oldPassword));

          case 7:
            comparePassword = context$2$0.sent;

            if (!comparePassword) {
              context$2$0.next = 14;
              break;
            }

            context$2$0.next = 11;
            return regeneratorRuntime.awrap(user.update({ password: payload.newPassword }));

          case 11:
            return context$2$0.abrupt('return', {
              success: true
            });

          case 14:
            return context$2$0.abrupt('return', {
              success: false,
              message: "Old password is not correct."
            });

          case 15:
            return context$2$0.abrupt('return', {
              success: false,
              message: "Could not find logged in user."
            });

          case 16:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    verifyResetPasswordToken: function verifyResetPasswordToken(payload) {
      var token, password, user;
      return regeneratorRuntime.async(function verifyResetPasswordToken$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            validateJson(payload, require('./schema/verifyResetPasswordToken.json'));
            token = payload.token;
            password = payload.password;

            log.info("verifyResetPasswordToken: ", token);
            // Has the token expired ?

            // find the user
            context$2$0.next = 6;
            return regeneratorRuntime.awrap(models.User.find({
              include: [{
                model: models.PasswordReset,
                where: {
                  token: token
                }
              }]
            }));

          case 6:
            user = context$2$0.sent;

            log.info("verifyResetPasswordToken: password ", password);

            if (!user) {
              context$2$0.next = 14;
              break;
            }

            context$2$0.next = 11;
            return regeneratorRuntime.awrap(user.update({ password: password }));

          case 11:
            return context$2$0.abrupt('return', {
              success: true
            });

          case 14:
            log.warn("verifyResetPasswordToken: no such token ", token);

            throw {
              code: 422,
              name: "TokenInvalid"
            };

          case 16:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    newPassword: function newPassword(payload) {
      return regeneratorRuntime.async(function newPassword$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info("serving new password page", payload);
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(readFileThunk(__dirname + '/public/resetPassword.html'));

          case 3:
            return context$2$0.abrupt('return', context$2$0.sent);

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
};

function createToken() {
  return chance.string({
    length: 16,
    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  });
}
module.exports = exports['default'];

//TODO transaction

// send password reset email with the token.

//TODO delete token