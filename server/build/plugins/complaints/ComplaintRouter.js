'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ComplaintHttpController = ComplaintHttpController;
exports['default'] = ComplaintRouter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _koa66 = require('koa-66');

var _koa662 = _interopRequireDefault(_koa66);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _ComplaintApi = require('./ComplaintApi');

var _ComplaintApi2 = _interopRequireDefault(_ComplaintApi);

var _asyncBusboy = require('async-busboy');

var _asyncBusboy2 = _interopRequireDefault(_asyncBusboy);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var config = require('config');

var log = require('logfilename')(__filename);

function uploads3(options) {
  return new Promise(function (resolve, reject) {
    var body = _fs2['default'].createReadStream(options.localFile);
    var awsS3Client = new _awsSdk2['default'].S3({
      params: { Bucket: 'beavr-img-de-fra', Key: options.localFile },
      endpoint: config.aws.s3.endpoint,
      signatureVersion: 'v4',
      accessKeyId: config.aws.s3.accessKeyId,
      secretAccessKey: config.aws.s3.secretAccessKey,
      region: config.aws.s3.region
    });
    awsS3Client.upload({ Body: body }).on('httpUploadProgress', function (evt) {
      console.log(evt);
    }).send(function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function ComplaintHttpController(app, rabbitPublisher) {
  log.debug("ComplaintHttpController");
  var respond = app.utils.http.respond;
  var complaintApi = (0, _ComplaintApi2['default'])(app, rabbitPublisher);
  return {
    uploadImageToS3: function uploadImageToS3(ctx) {
      var _ref, files, fields, params, s3Response;

      return regeneratorRuntime.async(function uploadImageToS3$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            context$2$0.next = 2;
            return regeneratorRuntime.awrap((0, _asyncBusboy2['default'])(ctx.req));

          case 2:
            _ref = context$2$0.sent;
            files = _ref.files;
            fields = _ref.fields;
            context$2$0.prev = 5;
            params = {
              localFile: files[0].path
            };
            context$2$0.next = 9;
            return regeneratorRuntime.awrap(uploads3(params));

          case 9:
            s3Response = context$2$0.sent;

            log.debug("uploaded object %s", JSON.stringify(s3Response));

            ctx.status = 200;
            ctx.body = {
              success: true,
              publicUrl: s3Response.Location
            };
            context$2$0.next = 20;
            break;

          case 15:
            context$2$0.prev = 15;
            context$2$0.t0 = context$2$0['catch'](5);

            console.log('error occurred uploading image to s3 %s', JSON.stringify(context$2$0.t0));
            ctx.status = 400;
            ctx.body = {
              success: false,
              message: 'An error occurred uploading your image.'
            };

          case 20:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this, [[5, 15]]);
    },
    getComplaints: function getComplaints(context) {
      return regeneratorRuntime.async(function getComplaints$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.getAll, [_qs2['default'].parse(context.request.querystring)]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    getCategories: function getCategories(context) {
      return regeneratorRuntime.async(function getCategories$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.getAllCategories, [_qs2['default'].parse(context.request.querystring)]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    getOne: function getOne(context) {
      var params;
      return regeneratorRuntime.async(function getOne$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            params = context.params;
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.getOne, [params.id]));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    getOneCategory: function getOneCategory(context) {
      var params;
      return regeneratorRuntime.async(function getOneCategory$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            params = context.params;
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.getOneCategory, [params.id]));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    postCategory: function postCategory(context) {
      return regeneratorRuntime.async(function postCategory$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.postCategory, [context.passport.user, context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    updateCategory: function updateCategory(context) {
      var params;
      return regeneratorRuntime.async(function updateCategory$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            params = context.params;
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.updateCategory, [context.passport.user, context.request.body, params.id]));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    postComplaint: function postComplaint(context) {
      return regeneratorRuntime.async(function postComplaint$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.postComplaint, [context.passport.user, context.request.body]));

          case 1:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    },
    updateComplaint: function updateComplaint(context) {
      var params;
      return regeneratorRuntime.async(function updateComplaint$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            params = context.params;
            return context$2$0.abrupt('return', respond(context, complaintApi, complaintApi.updateComplaint, [context.passport.user, context.request.body, params.id]));

          case 2:
          case 'end':
            return context$2$0.stop();
        }
      }, null, this);
    }
  };
}

function ComplaintRouter(app) {
  var router = new _koa662['default']();
  var complaintHttpController = ComplaintHttpController(app);
  router.get('/category/:id', complaintHttpController.getOneCategory);
  router.get('/category', complaintHttpController.getCategories);
  router.get('/:id', complaintHttpController.getOne);
  router.get('/', complaintHttpController.getComplaints);
  router.post('/category', complaintHttpController.postCategory);
  router.put('/category/:id', complaintHttpController.updateCategory);
  router.post('/', complaintHttpController.postComplaint);
  router.put('/:id', complaintHttpController.updateComplaint);

  app.server.baseRouter().mount("/complaints", router);
  return router;
}