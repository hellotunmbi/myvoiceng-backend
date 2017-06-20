let config = require('config');
let Promise = require('bluebird');
var swagger = require('swagger-koa');

import Koa from'koa';
import Router from 'koa-66';
import _ from 'lodash';
let log = require('logfilename')(__filename);
 let serve = require('koa-static')
 , path = require('path');

export default function(app) {
  let koaApp = new Koa();
  koaApp.experimental = true;

  let httpHandle;
  let rootRouter = new Router();
  let baseRouter = new Router();
  middlewareInit(app, koaApp);

  return {
    koa: koaApp,
    auth: require('./middleware/PassportMiddleware')(app, koaApp, config),
    baseRouter(){
      return baseRouter;
    },
    mountRootRouter(){
      rootRouter.mount(config.http.ver, baseRouter);
      koaApp.use(rootRouter.routes());
    },
    diplayRoutes(){
      rootRouter.stacks.forEach(function(stack){
        log.debug(`${stack.methods} : ${stack.path}`);
      });
    },
    /**
     * Start the express server
     */
    async start() {
      let configHttp = config.get('http');
      let port = process.env.PORT || configHttp.port;

      log.info('start koa on port %s', port);
      return new Promise(function(resolve) {
        httpHandle = koaApp.listen(port, function() {
          log.info('koa server started');
          resolve();
        });
      });
    },

    /**
     * Stop the express server
     */
    async stop () {
      log.info('stopping web server');
      if(!httpHandle){
        log.info('koa server is already stopped');
        return;
      }
      return new Promise(function(resolve) {
        httpHandle.close(function() {
          log.info('koa server is stopped');
          resolve();
        });
      });
    }
  };
};

function middlewareInit(app, koaApp) {
  log.debug("middlewareInit");
  const convert = require('koa-convert');
  const session = require('koa-generic-session');
  const store =   new session.MemoryStore();
  //TODO use secret from config
  koaApp.keys = ['your-super-session-secret'];
  //Allowed for web, needs a better alternative
  let sessionOptions = {
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
    apis: ['src/plugins/users/user/UserApi.js','src/plugins/complaints/ComplaintApi.js']
  })));

  koaApp.use(serve(path.join(__dirname, 'public')));

  koaApp.use(convert(session(sessionOptions)));


  function respond(me, callback, args, socket, acknowledge, statusCode = 200) {
    callback.apply(me, args)
      .then(result => {
        const message =  {
          status  : statusCode,
          message : result
        };
        log.debug("message results " + JSON.stringify(message));
        acknowledge(message);
      })
      .catch(error => {
        let errorResponse = convertAndRespond(error);
        acknowledge({
          status  : errorResponse.status,
          message : errorResponse.message
        });
        log.debug("message results " + JSON.stringify(errorResponse));

      });
    }

  function convertAndRespond(error) {
    let body, status;
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
      let code = _.isNumber(error.code) ? error.code: 400;
      status = code;
      body =   error;
    }

    return {
      status  : status,
      message : body
    };
  }
 
  function onAuthorizeSuccess(ksp) {
    //restrct user further ...var ksp.user & ksp.session
    log.debug(`${JSON.stringify(ksp.user)} authorized`);
  }

  function onAuthorizeFail(err, ksp){
    log.debug(`not connected ${err}`);
    if (err.critical) {
      log.debug(`${err.critical} not connected ${err}`);
      let error = new Error();
      error.status = 500;
      error.message = err;
      throw error;
    }
  }


  const bodyParser = require('koa-bodyparser');
  koaApp.use(bodyParser());
  let cors = require('koa-cors');
  let corOptions = {
  origin: function(req){
    var allowedOrigins = ['http://localhost:9000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         return origin;
    }
    else
    {
      return "*";
    }
  },
  credentials: true,
  methods :  ['GET', 'PUT', 'POST', 'DELETE', 'PATCH']
  };
  koaApp.use(convert(cors(corOptions)));


  koaApp.use(async(ctx, next) => {
    const start = new Date;
    log.debug(`${ctx.method} ${ctx.url} begins`);
    await next();
    const ms = new Date - start;
    log.debug(`${ctx.method} ${ctx.url} ends in ${ms}ms, code: ${ctx.status}`);
    let util = require('util');
    log.debug(util.inspect(ctx));
  });
}
