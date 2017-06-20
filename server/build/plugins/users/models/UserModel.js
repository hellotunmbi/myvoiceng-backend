'use strict';
//import bcrypt from "bcrypt";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

module.exports = function (sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;

  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(64)
    },
    lastName: {
      type: DataTypes.STRING(64)
    },
    facebookId: {
      type: DataTypes.TEXT,
      unique: true
    },
    githubId: {
      type: DataTypes.TEXT,
      unique: true
    },
    twitterId: {
      type: DataTypes.TEXT,
      unique: true
    },
    googleId: {
      type: DataTypes.TEXT,
      unique: true
    },
    password: DataTypes.TEXT,
    passwordHash: DataTypes.TEXT,
    type: DataTypes.STRING(64)
  }, {
    tableName: "users",
    classMethods: {
      associate: function associate(models) {
        //User.hasOne(models.JobApplication,{ foreignKey: "user_id" });
      },
      seedDefault: function seedDefault() {
        var usersJson, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, userJson;

        return regeneratorRuntime.async(function seedDefault$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              usersJson = require('./fixtures/users.json');

              log.debug('seedDefault: ', JSON.stringify(usersJson, null, 4));
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              context$2$0.prev = 5;
              _iterator = usersJson[Symbol.iterator]();

            case 7:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                context$2$0.next = 14;
                break;
              }

              userJson = _step.value;
              context$2$0.next = 11;
              return regeneratorRuntime.awrap(User.createUserInGroups(userJson, userJson.groups));

            case 11:
              _iteratorNormalCompletion = true;
              context$2$0.next = 7;
              break;

            case 14:
              context$2$0.next = 20;
              break;

            case 16:
              context$2$0.prev = 16;
              context$2$0.t0 = context$2$0['catch'](5);
              _didIteratorError = true;
              _iteratorError = context$2$0.t0;

            case 20:
              context$2$0.prev = 20;
              context$2$0.prev = 21;

              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }

            case 23:
              context$2$0.prev = 23;

              if (!_didIteratorError) {
                context$2$0.next = 26;
                break;
              }

              throw _iteratorError;

            case 26:
              return context$2$0.finish(23);

            case 27:
              return context$2$0.finish(20);

            case 28:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this, [[5, 16, 20, 28], [21,, 23, 27]]);
      },
      /**
       * Finds a user by its email
       * returns the model of the  user
       *
       * @param {String} email - the user's email address
       *
       * @returns {Promise} Promise user model
      */
      findByEmail: function findByEmail(email) {
        return this.find({ where: { email: email } });
      },
      /**
       * Finds a user by userid
       * returns the model of the  user
       *
       * @param {String} userid - userid of the user to find
       *
       * @returns {Promise} Promise user model
      */
      findByUserId: function findByUserId(userid) {
        return this.find({ where: { id: userid } });
      },
      /**
       * Creates a user given a json representation and adds it to the group GroupName,
       * returns the model of the created user
       *
       * @param {Object} userJson  -   User in json format
       * @param {Array} groups - the groups to add the user in
       * @param {Object} profile -
       *
       * @returns {Promise}  Promise user created model
       */
      createUserInGroups: function createUserInGroups(userJson, groups, profile) {
        return regeneratorRuntime.async(function createUserInGroups$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              log.debug("createUserInGroups user:%s, group: ", userJson, groups);
              return context$2$0.abrupt('return', sequelize.transaction(function callee$2$0(t) {
                var userCreated, profilePicture, birthDate;
                return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
                  while (1) switch (context$3$0.prev = context$3$0.next) {
                    case 0:
                      context$3$0.next = 2;
                      return regeneratorRuntime.awrap(models.User.create(userJson, { transaction: t }));

                    case 2:
                      userCreated = context$3$0.sent;
                      context$3$0.next = 5;
                      return regeneratorRuntime.awrap(models.UserGroup.addUserIdInGroups(groups, userCreated.get().id, t));

                    case 5:

                      if (!profile) {
                        profile = {};
                      }

                      profilePicture = null;

                      if (profile.photos && profile.photos.length > 0) {
                        profilePicture = profile.photos[0].value;
                      }

                      birthDate = null;

                      if (userJson.birthday) {
                        birthDate = new Date(userJson.birthday);
                      }

                      if (!(userJson.type === 'Worker')) {
                        context$3$0.next = 16;
                        break;
                      }

                      log.info("creating worker profile");
                      context$3$0.next = 14;
                      return regeneratorRuntime.awrap(models.EmployeeProfile.addUserIdInProfile({
                        firstName: userJson.firstName,
                        lastName: userJson.lastName,
                        email: userJson.email,
                        imageUrl: profilePicture,
                        birthDate: birthDate,
                        city: userJson.city,
                        country: userJson.country
                      }, userCreated.get().id, t));

                    case 14:
                      context$3$0.next = 23;
                      break;

                    case 16:
                      if (!(userJson.type === 'Employer')) {
                        context$3$0.next = 23;
                        break;
                      }

                      log.info("creating company profile");
                      context$3$0.next = 20;
                      return regeneratorRuntime.awrap(models.CompanyProfile.addUserIdInProfile({
                        firstName: userJson.firstName,
                        lastName: userJson.lastName,
                        email: userJson.email,
                        imageUrl: profilePicture,
                        birthDate: birthDate,
                        city: userJson.city,
                        country: userJson.country
                      }, userCreated.get().id, t));

                    case 20:
                      //TODO; in later milestone can update this
                      log.info("creating employer profile");
                      context$3$0.next = 23;
                      return regeneratorRuntime.awrap(models.EmployerProfile.addUserIdInProfile({
                        name: 'add later',
                        description: 'add later'
                      }, userCreated.get().id, t));

                    case 23:
                      return context$3$0.abrupt('return', userCreated);

                    case 24:
                    case 'end':
                      return context$3$0.stop();
                  }
                }, null, this);
              })['catch'](function (err) {
                log.error('createUserInGroups: rolling back', err);
                throw err;
              }));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      },

      /**
      * Checks whether a user is able to perform an action on a resource
      * Equivalent to: select name from permissions p join group_permissions g on p.id=g.permission_id where g.group_id=(select group_id from users where username='aliceab@example.com') AND p.resource='user' and p.create=true;
      * @param {String} userId  - The userId to search
      * @param {String} resource  -The resource name to search
      * @param {String} action  - The action , "create,read,update,delete"
      *
      * @returns {Boolean} True if the user can perform the action on the resource otherwise false
      */

      checkUserPermission: function checkUserPermission(userId, resource, action) {
        var where, res, authorized;
        return regeneratorRuntime.async(function checkUserPermission$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              log.debug('Checking %s permission for %s on %s', action, userId, resource);
              where = {
                resource: resource
              };

              where[action.toUpperCase()] = true;
              context$2$0.next = 5;
              return regeneratorRuntime.awrap(this.find({
                include: [{
                  model: models.Group,
                  include: [{
                    model: models.Permission,
                    where: where
                  }]
                }],
                where: {
                  id: userId
                }
              }));

            case 5:
              res = context$2$0.sent;
              authorized = res ? true : false;
              return context$2$0.abrupt('return', authorized);

            case 8:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      }
    },

    instanceMethods: {
      comparePassword: function comparePassword(candidatePassword) {
        var me = this;
        return new _bluebird2['default'](function (resolve, reject) {
          var hashPassword = me.get('passwordHash') || '';
          /*
          bcrypt.compare(candidatePassword, hashPassword, function(err, isMatch) {
            if(err) {return reject(err); }
            resolve(isMatch);
          });
          */
        });
      },

      /**
       * Removes password from the toJson
       *
       */
      toJSON: function toJSON() {
        var values = this.get({ clone: true });
        delete values.password;
        delete values.passwordHash;
        delete values.createdAt;
        delete values.updatedAt;
        return values;
      }
    }
  }, {
    underscored: true
  });

  var hashPasswordHook = function hashPasswordHook(instance, options, done) {
    if (!instance.changed('password')) {
      return done();
    }
    /*
    bcrypt.hash(instance.get('password'), 10, function (err, hash) {
      if (err) { return done(err); }
      instance.set('password');
      instance.set('passwordHash', hash);
      done();
    });
    */
  };

  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);

  return User;
};

//log.info("create user",JSON.stringify(userJson.toJSON()));

//log.info("user created ", userCreated.get().id);