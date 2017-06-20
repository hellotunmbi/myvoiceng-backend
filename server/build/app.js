'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = App;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _logfilename = require('logfilename');

var _logfilename2 = _interopRequireDefault(_logfilename);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _modelsData = require('./models/Data');

var _modelsData2 = _interopRequireDefault(_modelsData);

var _serverKoaKoaServer = require('./server/koa/koaServer');

var _serverKoaKoaServer2 = _interopRequireDefault(_serverKoaKoaServer);

var _utilsHttpUtils = require('./utils/HttpUtils');

var HttpUtils = _interopRequireWildcard(_utilsHttpUtils);

require('babel-regenerator-runtime');

require('dotenv').config();

var log = new _logfilename2['default'](__filename, _config2['default'].log);

function App() {

  var data = (0, _modelsData2['default'])(_config2['default']);

  var app = {
    data: data,
    utils: {
      http: HttpUtils,
      api: require('./utils/ApiUtils')
    },
    seed: function seed() {
      return regeneratorRuntime.async(function seed$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info("seed");
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(data.seed(app));

          case 3:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    start: function start() {
      return regeneratorRuntime.async(function start$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info("start");
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(action('start'));

          case 3:
            log.info("started");

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    stop: function stop() {
      return regeneratorRuntime.async(function stop$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info("stop");
            context$2$0.next = 3;
            return regeneratorRuntime.awrap(action('stop'));

          case 3:
            log.info("stopped");

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    displayInfoEnv: displayInfoEnv
  };

  app.server = (0, _serverKoaKoaServer2['default'])(app);
  app.plugins = (0, _plugins2['default'])(app);
  //Must be called when all plugins are created.
  data.associate();
  app.server.mountRootRouter();
  app.server.diplayRoutes();

  var parts = [app.data, app.server, app.plugins];

  function action(ops) {
    return regeneratorRuntime.async(function action$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_bluebird2['default'].each(parts, function (part) {
            return part[ops](app);
          }));

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  return app;
}

function displayInfoEnv() {
  log.info("NODE_ENV: %s", process.env.NODE_ENV);
  if (process.env.NODE_CONFIG) {
    log.info("NODE_CONFIG is set");
  }
}
module.exports = exports['default'];