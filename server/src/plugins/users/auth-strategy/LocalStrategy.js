import {Strategy as LocalStrategy} from 'passport-local';
let log = require('logfilename')(__filename);

export async function verifyLogin(models, username, password) {
  log.debug("loginStrategy username: ", username);
  let res = await models.UserPending.find({
    where: {
      $or: [{email: username}]
    }
  });

  if (res) {
    log.info("user is pending registration: ", username);
    return {
      error: {
        message: 'Please confirm your email address before logging in'
      }
    };
  }

  let user = await models.User.find({
    where: {
      $or: [{email: username}]
    }
  });
  if (!user) {
    log.info("userBasic invalid username user: ", username);
    return {
      error: {
        message: 'Invalid Username Or Password'
      }
    };
  }

  //log.info("userBasic user: ", user.get());
  let result = await user.comparePassword(password);
  if (result) {
    log.debug("userBasic valid password for user: ", user.toJSON());
    return {
      user: user.toJSON()
    };
  } else {
    log.info("userBasic invalid password user: ", user.get());
    return {
      error: {
        message: 'Invalid Username Or Password'
      }
    };
  }
}


export function register(passport, models) {
  log.debug("register");
  let loginStrategy = new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false
    },
    async function (username, password, done) {
      try {
        let res = await verifyLogin(models, username, password);
        log.debug("result %s", JSON.stringify(res));
        done(res.err, res);
      } catch (err) {
        done(err);
      }
    }
  );

  passport.use('local', loginStrategy);
};
