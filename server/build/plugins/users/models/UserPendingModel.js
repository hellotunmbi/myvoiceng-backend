'use strict';
//import bcrypt from "bcrypt";
module.exports = function (sequelize, DataTypes) {
  var UserPending = sequelize.define('UserPending', {
    email: DataTypes.STRING(64),
    password: DataTypes.STRING(64),
    firstName: DataTypes.STRING(64),
    lastName: DataTypes.STRING(64),
    passwordHash: DataTypes.STRING,
    code: DataTypes.TEXT(16),
    type: DataTypes.STRING(64),
    platform: DataTypes.STRING(64),
    deviceToken: DataTypes.STRING(200)
  }, {
    tableName: "user_pendings",
    classMethods: {}
  });

  var hashPasswordHook = function hashPasswordHook(instance, options, done) {
    if (!instance.changed('password')) {
      return done();
    }
    /*
    bcrypt.hash(instance.get('password'), 10, function (err, hash) {
      if (err) { return done(err); }
      instance.set('password', '');
      instance.set('passwordHash', hash);
      done();
    });
    */
  };

  UserPending.beforeValidate(hashPasswordHook);
  UserPending.beforeUpdate(hashPasswordHook);

  return UserPending;
};