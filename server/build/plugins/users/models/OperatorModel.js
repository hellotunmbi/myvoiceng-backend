'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = function (sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;

  var Operator = sequelize.define('Operator', {
    opcoId: DataTypes.INTEGER,
    name: DataTypes.STRING(64),
    namespace: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    tableName: "operator",
    classMethods: {
      associate: function associate(models) {
        models.Operator.hasMany(models.Connectivity, { as: 'Connectivities' });
      },
      updateOperator: function updateOperator(json) {
        var updateObj;
        return regeneratorRuntime.async(function updateOperator$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              updateObj = {
                opcoId: json.opcoId,
                name: json.name,
                namespace: json.namespace,
                status: json.status
              };
              return context$2$0.abrupt('return', Operator.update(updateObj, { where: { opcoId: opcoId } }));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      },
      createConversation: function createConversation(json) {
        var createObj;
        return regeneratorRuntime.async(function createConversation$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              createObj = {
                opcoId: json.opcoId,
                name: json.name,
                namespace: json.namespace
              };
              return context$2$0.abrupt('return', Operator.create(chatUser));

            case 2:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      }
    }
  });

  return Operator;
};