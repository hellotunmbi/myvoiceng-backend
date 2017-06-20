'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = Plugins;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var log = require('logfilename')('plugins');

function Plugins(app) {

  var plugins = {};

  function requirePluginDir(pluginPath, name) {
    log.debug('requirePluginDir: ' + pluginPath + ', name: ' + name);
    _fs2['default'].readdirSync(pluginPath).filter(function (file) {
      return file.slice(-9) === 'Plugin.js';
    }).forEach(function (file) {
      plugins[name] = require(_path2['default'].join(pluginPath, file))(app);
    });
  }

  function createPlugin(dirname) {
    _fs2['default'].readdirSync(__dirname).filter(function (file) {
      return _fs2['default'].lstatSync(_path2['default'].join(dirname, file)).isDirectory();
    }).forEach(function (file) {
      return requirePluginDir(_path2['default'].join(dirname, file), file);
    });
  }

  createPlugin(__dirname);

  function action(ops) {
    return regeneratorRuntime.async(function action$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(_bluebird2['default'].each(_lodash2['default'].values(plugins), function (obj) {
            return obj[ops](app);
          }));

        case 2:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  }

  return {
    get: function get() {
      return plugins;
    },
    start: function start() {
      return regeneratorRuntime.async(function start$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(action('start'));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    stop: function stop() {
      return regeneratorRuntime.async(function stop$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap(action('stop'));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

module.exports = exports['default'];