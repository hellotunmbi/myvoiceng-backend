'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

module.exports = function (sequelize, DataTypes) {
  var log = require('logfilename')(__filename);
  var models = sequelize.models;

  var Connectivity = sequelize.define('Connectivity', {
    opcoId: DataTypes.INTEGER,
    ip: DataTypes.STRING(64),
    port: DataTypes.INTEGER,
    username: DataTypes.STRING(64),
    password: DataTypes.STRING(64)
  }, {
    tableName: "connectivity",
    classMethods: {
      associate: function associate(models) {
        Connectivity.belongsTo(models.Operator, { foreignKey: "opcoId" });
      },
      findByConnectivityOpcoId: function findByConnectivityOpcoId(id) {
        return regeneratorRuntime.async(function findByConnectivityOpcoId$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {
            case 0:
              return context$2$0.abrupt('return', this.find({
                where: {
                  opcoId: id
                }
              }).then(function (detailConnectivity) {
                if (!detailConnectivity) {
                  // Create the default error container
                  var error = new Error();
                  error.status = 404;error.message = "ERROR_NOT_FOUND";error.code = 404;
                  throw error;
                } else {
                  return detailConnectivity;
                }
              }));

            case 1:
            case 'end':
              return context$2$0.stop();
          }
        }, null, this);
      }
    }
  });

  return Connectivity;
};