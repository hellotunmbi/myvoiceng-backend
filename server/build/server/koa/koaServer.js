'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koa66 = require('koa-66');

var _koa662 = _interopRequireDefault(_koa66);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var config = require('config');
var Promise = require('bluebird');
var swagger = require('swagger-koa');

var log = require('logfilename')(__filename);
var serve = require('koa-static'),
    path = require('path');

exports['default'] = function (app) {
  var koaApp = new _koa2['default']();
  koaApp.experimental = true;

  var httpHandle = undefined;
  var rootRouter = new _koa662['default']();
  var _baseRouter = new _koa662['default']();
  middlewareInit(app, koaApp);

  return {
    koa: koaApp,
    auth: require('./middleware/PassportMiddleware')(app, koaApp, config),
    baseRouter: function baseRouter() {
      return _baseRouter;
    },
    mountRootRouter: function mountRootRouter() {
      rootRouter.mount(config.http.ver, _baseRouter);
      koaApp.use(rootRouter.routes());
    },
    diplayRoutes: function diplayRoutes() {
      rootRouter.stacks.forEach(function (stack) {
        log.debug(stack.methods + ' : ' + stack.path);
      });
    },
    /**
     * Start the express server
     */
    start: function start() {
      var configHttp, port;
      return regeneratorRuntime.async(function start$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            configHttp = config.get('http');
            port = process.env.PORT || configHttp.port;

            log.info('start koa on port %s', port);
            return context$2$0.abrupt('return', new Promise(function (resolve) {
              httpHandle = koaApp.listen(port, function () {
                log.info('koa server started');
                resolve();
              });
            }));

          case 4:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },

    /**
     * Stop the express server
     */
    stop: function stop() {
      return regeneratorRuntime.async(function stop$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            log.info('stopping web server');

            if (httpHandle) {
              context$2$0.next = 4;
              break;
            }

            log.info('koa server is already stopped');
            return context$2$0.abrupt('return');

          case 4:
            return context$2$0.abrupt('return', new Promise(function (resolve) {
              httpHandle.close(function () {
                log.info('koa server is stopped');
                resolve();
              });
            }));

          case 5:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
};

;

function middlewareInit(app, koaApp) {
  var _this = this;

  log.debug("middlewareInit");
  var convert = require('koa-convert');
  var session = require('koa-generic-session');
  var store = new session.MemoryStore();
  //TODO use secret from config
  koaApp.keys = ['your-super-session-secret'];
  //Allowed for web, needs a better alternative
  var sessionOptions = {
    store: store,
    cookie: {
      httpOnly: false
    }
  };
  koaApp.use(convert(swagger.init({
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:9000',
    info: {
      title: 'swagger-koa sample app',
      description: 'Swagger + Koa = {swagger-koa}'
    },
    apis: ['src/plugins/users/user/UserApi.js', 'src/plugins/complaints/ComplaintApi.js']
  })));

  koaApp.use(serve(path.join(__dirname, 'public')));

  koaApp.use(convert(session(sessionOptions)));

  function respond(me, callback, args, socket, acknowledge) {
    var statusCode = arguments.length <= 5 || arguments[5] === undefined ? 200 : arguments[5];

    callback.apply(me, args).then(function (result) {
      var message = {
        status: statusCode,
        message: result
      };
      log.debug("message results " + JSON.stringify(message));
      acknowledge(message);
    })['catch'](function (error) {
      var errorResponse = convertAndRespond(error);
      acknowledge({
        status: errorResponse.status,
        message: errorResponse.message
      });
      log.debug("message results " + JSON.stringify(errorResponse));
    });
  }

  function convertAndRespond(error) {
    var body = undefined,
        status = undefined;
    if (error instanceof TypeError) {
      log.error('TypeError: ', error.toString());
      status = 500;
      body = {
        name: error.name,
        message: error.message
      };
    } else if (!error.name) {
      log.error('UnknownError:', error);
      status = 500;
      body = {
        name: 'UnknownError'
      };
    } else {
      log.warn('error name', error);
      var code = _lodash2['default'].isNumber(error.code) ? error.code : 400;
      status = code;
      body = error;
    }

    return {
      status: status,
      message: body
    };
  }

  function onAuthorizeSuccess(ksp) {
    //restrct user further ...var ksp.user & ksp.session
    log.debug(JSON.stringify(ksp.user) + ' authorized');
  }

  function onAuthorizeFail(err, ksp) {
    log.debug('not connected ' + err);
    if (err.critical) {
      log.debug(err.critical + ' not connected ' + err);
      var error = new Error();
      error.status = 500;
      error.message = err;
      throw error;
    }
  }

  var bodyParser = require('koa-bodyparser');
  koaApp.use(bodyParser());
  var cors = require('koa-cors');
  var corOptions = {
    origin: function origin(req) {
      var allowedOrigins = ['http://localhost:9000'];
      var origin = req.headers.origin;
      if (allowedOrigins.indexOf(origin) > -1) {
        return origin;
      } else {
        return "*";
      }
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
  };
  koaApp.use(convert(cors(corOptions)));

  koaApp.use(function callee$1$0(ctx, next) {
    var start, ms, util;
    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          start = new Date();

          log.debug(ctx.method + ' ' + ctx.url + ' begins');
          context$2$0.next = 4;
          return regeneratorRuntime.awrap(next());

        case 4:
          ms = new Date() - start;

          log.debug(ctx.method + ' ' + ctx.url + ' ends in ' + ms + 'ms, code: ' + ctx.status);
          util = require('util');

          log.debug(util.inspect(ctx));

        case 8:
        case 'end':
          return context$2$0.stop();
      }
    }, null, _this);
  });
}
module.exports = exports['default'];