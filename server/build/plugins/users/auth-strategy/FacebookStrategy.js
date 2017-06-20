'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.verify = verify;
exports.register = register;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('config');

var log = require('logfilename')(__filename);

function verify(models, publisherUser, req, accessToken, refreshToken, profile) {
  var user, userByEmail, userConfig, userCreated;
  return regeneratorRuntime.async(function verify$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        log.debug("authentication reply from fb");
        //log.debug(accessToken);
        log.debug(JSON.stringify(profile, null, 4));

        context$1$0.next = 4;
        return regeneratorRuntime.awrap(models.User.find({
          where: {
            facebookId: profile.id
          }
        }));

      case 4:
        user = context$1$0.sent;

        if (!user) {
          context$1$0.next = 8;
          break;
        }

        log.debug("user already exist: ", user.toJSON());
        return context$1$0.abrupt('return', {
          user: user.toJSON()
        });

      case 8:

        log.debug("no fb profile registered");
        context$1$0.next = 11;
        return regeneratorRuntime.awrap(models.User.find({
          where: {
            email: profile._json.email
          }
        }));

      case 11:
        userByEmail = context$1$0.sent;

        if (!userByEmail) {
          context$1$0.next = 15;
          break;
        }

        log.debug("email already registered");
        //should update fb profile id
        return context$1$0.abrupt('return', {
          user: userByEmail.toJSON(),
          success: false,
          message: "email already registered"
        });

      case 15:
        userConfig = {
          username: profile.name.givenName + ' ' + profile.name.middleName + ' ' + profile.name.familyName,
          email: profile._json.email,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          facebookId: profile.id
        };

        log.debug("creating user: ", userConfig);
        context$1$0.next = 19;
        return regeneratorRuntime.awrap(models.User.createUserInGroups(userConfig, ["User"]));

      case 19:
        user = context$1$0.sent;
        userCreated = user.toJSON();

        log.info("register created new user ", userCreated);

        if (!publisherUser) {
          context$1$0.next = 25;
          break;
        }

        context$1$0.next = 25;
        return regeneratorRuntime.awrap(publisherUser.publish("user.registered", JSON.stringify(userCreated)));

      case 25:
        return context$1$0.abrupt('return', {
          user: userCreated
        });

      case 26:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function register(passport, models, publisherUser) {

  var authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook authentication strategy");
    var facebookStrategy = new FacebookStrategy({
      clientID: authenticationFbConfig.clientID,
      clientSecret: authenticationFbConfig.clientSecret,
      callbackURL: authenticationFbConfig.callbackURL,
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
      enableProof: false
    }, function callee$1$0(req, accessToken, refreshToken, profile, done) {
      var res;
      return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.prev = 0;
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(verify(models, publisherUser, req, accessToken, refreshToken, profile));

          case 3:
            res = context$2$0.sent;

            done(res.err, res.user);
            context$2$0.next = 10;
            break;

          case 7:
            context$2$0.prev = 7;
            context$2$0.t0 = context$2$0['catch'](0);

            done(context$2$0.t0);

          case 10:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[0, 7]]);
    });
    passport.use('facebook', facebookStrategy);
  }
}

;

//Create user