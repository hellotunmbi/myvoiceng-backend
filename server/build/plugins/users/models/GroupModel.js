'use strict';
module.exports = function (sequelize, DataTypes) {
  var log = require('logfilename')(__filename);

  var Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    tableName: "groups",
    classMethods: {
      seedDefault: seedDefault,
      findByName: findByName,
      getPermissions: getPermissions,
      associate: function associate(models) {
        models.User.belongsToMany(Group, { through: models.UserGroup, foreignKey: "user_id" });
        Group.belongsToMany(models.Permission, { through: models.GroupPermission, foreignKey: "group_id" });
        Group.belongsToMany(models.User, { through: models.UserGroup, foreignKey: "group_id" });
      }
    }
  });

  var models = sequelize.models;

  function seedDefault() {
    var groupsJson = require('./fixtures/groups.json');
    log.debug('seedDefault: ', JSON.stringify(groupsJson, null, 4));
    return Group.bulkCreate(groupsJson);
  }

  function findByName(groupName) {
    return models.Group.find({ where: { name: groupName } });
  }

  /**
   * Returns all the  permission associated with a group
   *
   * @param {String} groupName  - The name of the group to search
   * @returns {Promise}  a Promise containing permission results
   */
  function getPermissions(groupName) {
    return models.Group.find({
      include: [{
        model: models.Permission
      }],
      where: {
        name: groupName
      }
    });
  }
  return Group;
};