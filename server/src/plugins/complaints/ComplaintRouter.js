'use strict';
import Router from 'koa-66';
import Qs from 'qs';
import ComplaintApi from './ComplaintApi';
import asyncBusboy from 'async-busboy';
import AWS from 'aws-sdk';
import fs from'fs';
let config = require('config');

let log = require('logfilename')(__filename);

function uploads3(options) {
  return new Promise(function(resolve, reject) {
    var body = fs.createReadStream(options.localFile);
    let awsS3Client = new AWS.S3({
      params: {Bucket: 'beavr-img-de-fra', Key: options.localFile},
      endpoint: config.aws.s3.endpoint,
      signatureVersion: 'v4',
      accessKeyId: config.aws.s3.accessKeyId,
      secretAccessKey: config.aws.s3.secretAccessKey,
      region: config.aws.s3.region
    });
    awsS3Client.upload({Body: body})
      .on('httpUploadProgress', function(evt) {
        console.log(evt);
      })
      .send(function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
  });
}

export function ComplaintHttpController(app, rabbitPublisher){
  log.debug("ComplaintHttpController");
  let respond = app.utils.http.respond;
  let complaintApi = ComplaintApi(app, rabbitPublisher);
  return {
    async uploadImageToS3(ctx) {
      const {files, fields} = await asyncBusboy(ctx.req);
      try {
        const params = {
          localFile: files[0].path
        };

        let s3Response = await uploads3(params);

        log.debug("uploaded object %s", JSON.stringify(s3Response));

        ctx.status = 200;
        ctx.body = {
          success: true,
          publicUrl: s3Response.Location
        };
      } catch (error) {
        console.log('error occurred uploading image to s3 %s', JSON.stringify(error));
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'An error occurred uploading your image.'
        };
      }
    },
    async getComplaints(context) {
      return respond(context, complaintApi, complaintApi.getAll, [Qs.parse(context.request.querystring)]);
    },
    async getCategories(context) {
      return respond(context, complaintApi, complaintApi.getAllCategories, [Qs.parse(context.request.querystring)]);
    },
    async getOne(context) {
      let params = context.params;
      return respond(context, complaintApi, complaintApi.getOne, [params.id]);
    },
    async getOneCategory(context) {
      let params = context.params;
      return respond(context, complaintApi, complaintApi.getOneCategory, [params.id]);
    },
    async postCategory(context) {
      return respond(context, complaintApi, complaintApi.postCategory, [context.passport.user, context.request.body]);
    },
    async updateCategory(context) {
      let params = context.params;
      return respond(context, complaintApi, complaintApi.updateCategory, [context.passport.user, context.request.body, params.id]);
    },
    async postComplaint(context) {
      return respond(context, complaintApi, complaintApi.postComplaint, [context.passport.user, context.request.body]);
    },
    async updateComplaint(context) {
      let params = context.params;
      return respond(context, complaintApi, complaintApi.updateComplaint, [context.passport.user, context.request.body, params.id]);
    }
  };
}

export default function ComplaintRouter(app){
  let router = new Router();
  let complaintHttpController = ComplaintHttpController(app);
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
