'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = Data;
var _ = require('lodash');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var log = require('logfilename')(__filename);

function Data(config) {
  var dbConfig = config.db;
  var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, dbConfig);
  var modelsMap = {};

  var data = {
    sequelize: sequelize,
    Sequelize: Sequelize,
    registerModelsFromDir: function registerModelsFromDir(baseDir, name) {
      log.debug('registerModelFromDir: ' + baseDir + ' in ' + name);
      var dirname = path.join(baseDir, name);
      fs.readdirSync(dirname).filter(function (file) {
        return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
      }).forEach(function (file) {
        log.debug("model file: ", file);
        data.registerModel(dirname, file);
      });
    },

    registerModel: function registerModel(dirname, modelFile) {
      log.debug("registerModel ", modelFile);
      var model = sequelize['import'](path.join(dirname, modelFile));
      modelsMap[model.name] = model;
    },

    associate: function associate() {
      log.debug("associate");
      Object.keys(modelsMap).forEach(function (modelName) {
        if (modelsMap[modelName].associate) {
          modelsMap[modelName].associate(modelsMap);
        }
      });
    },
    models: function models() {
      return sequelize.models;
    },
    queryStringToFilter: function queryStringToFilter(qs, orderBy) {
      if (qs === undefined) qs = {};

      var filter = {
        offset: qs.offset,
        limit: qs.limit,
        order: qs.order ? orderBy + " " + qs.order : undefined
      };
      return filter;
    },
    start: function start(app) {
      var option;
      return regeneratorRuntime.async(function start$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info("db start");
            option = {
              force: false
            };
            context$2$0.next = 4;
            return regeneratorRuntime.awrap(sequelize.sync(option));

          case 4:
            context$2$0.next = 6;
            return regeneratorRuntime.awrap(this.seedIfEmpty(app));

          case 6:
            log.info("db started");

          case 7:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    stop: function stop() {
      return regeneratorRuntime.async(function stop$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info("db stop");

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    seed: function seed(app) {
      return regeneratorRuntime.async(function seed$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    // log.info("seed");
    // let option = {
    //   force: true
    // };
    // await sequelize.sync(option);
    // await this.seedDefault(app);
    // log.info("seeded");
    seedDefault: function seedDefault(app) {
      return regeneratorRuntime.async(function seedDefault$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    // log.debug("seedDefault");
    // assert(app.plugins.get().users);
    // let plugins = _.values(app.plugins.get());
    // for (let plugin of plugins) {
    //   log.debug("seedDefault plugin");
    //   if (_.isFunction(plugin.seedDefault)) {
    //     await plugin.seedDefault();
    //   }
    // }
    seedIfEmpty: function seedIfEmpty(app) {
      return regeneratorRuntime.async(function seedIfEmpty$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };

  // log.info("seedIfEmpty");
  // let count = await sequelize.models.User.count();
  // if (count > 0) {
  //   log.info("seedIfEmpty #users: ", count);
  // } else {
  //   return this.seedDefault(app);
  // }
  return data;
}

;
module.exports = exports['default'];