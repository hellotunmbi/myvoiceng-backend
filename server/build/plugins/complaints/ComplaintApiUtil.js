'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var RRule = require('rrule').RRule;
var DataTransform = require("node-json-transform").DataTransform;
var dataTransform;
var config = require('config'),
    GoogleLocations = require('google-locations'),
    moment = require('moment');

module.exports = {
  jobValidationExtra: function jobValidationExtra(jobType, params) {
    var errorNew = new Error();
    if (!jobType) {
      errorNew.status = 400;
      errorNew.message = "invalid job type id";
      errorNew.success = false;
      errorNew.code = 400;
      throw errorNew;
      return;
    }

    var clientStartDateFromNow = moment().startOf('day').diff(moment(params.startDate), 'days');
    if (clientStartDateFromNow > 0) {
      errorNew.status = 400;
      errorNew.message = "start date is in the past";
      errorNew.success = false;
      errorNew.code = 400;
      throw errorNew;
      return;
    }

    if (jobType.name === 'Recurring') {
      if (!params.endDate) {
        errorNew.status = 400;
        errorNew.message = "Recurring job must have end date";
        errorNew.success = false;
        errorNew.code = 400;
        throw errorNew;
        return;
      }

      if (!params.recurring) {
        errorNew.status = 400;
        errorNew.message = "Recurring job must have recurring set";
        errorNew.success = false;
        errorNew.code = 400;
        throw errorNew;
        return;
      }
    } else if (jobType.name === 'Time Period') {
      if (!params.endDate) {
        errorNew.status = 400;
        errorNew.message = "Time period must have endDate";
        errorNew.success = false;
        errorNew.code = 400;
        throw errorNew;
        return;
      }
    }

    if (params.endDate) {
      var days = moment(params.startDate).diff(moment(params.endDate), 'days');
      if (days > 0) {
        errorNew.status = 400;
        errorNew.message = "Job Start Date cannot be greater than End Date";
        errorNew.success = false;
        errorNew.code = 400;
        throw errorNew;
        return;
      }
    }
  },
  transformObjectRecurring: function transformObjectRecurring(params) {
    if (params.recurring) {
      // Create a rule:
      var ruleOptons = {
        freq: params.recurring.freq,
        interval: params.recurring.interval,
        dtstart: new Date(params.startDate)
      };
      if (params.recurring.byweekday) {
        ruleOptons.byweekday = params.recurring.byweekday;
      }
      if (params.recurring.byhour) {
        ruleOptons.byhour = params.recurring.byhour;
      }
      if (params.endDate) {
        ruleOptons.until = new Date(params.endDate);
      }
      var rule = new RRule(ruleOptons);
      params.recurring = rule.toString();
    }
    return params;
  },
  getPlaceDetails: function getPlaceDetails(options) {
    return new Promise(function (resolve, reject) {
      locations.details(options, function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },
  transformJobApplicationStatus: function transformJobApplicationStatus(jobApplication) {
    var jobApplicationStatusObject = { withdrawn: "0", matched: "0", pending: "0" };
    jobApplication = JSON.parse(JSON.stringify(jobApplication));
    _lodash2['default'].each(jobApplication, function (statusVal) {
      jobApplicationStatusObject[statusVal.status] = statusVal.noCount;
    });
    return jobApplicationStatusObject;
  },
  transformObjectPlaceData: function transformObjectPlaceData(placeData, params) {
    if (placeData.result) {
      (function () {
        var addressComponents = placeData.result.address_components,
            addressTypes = undefined;
        _lodash2['default'].each(addressComponents, function (addressComponent) {
          addressTypes = addressComponent.types;
          if (!(addressTypes.indexOf("postal_code") == -1)) {
            params.zipCode = addressComponent.long_name;
          }

          if (!(addressTypes.indexOf("locality") == -1)) {
            params.city = addressComponent.long_name;
          }

          if (!(addressTypes.indexOf("country") == -1)) {
            params.country = addressComponent.long_name;
          }
        });

        params.address = placeData.result.formatted_address;
        params.lat = placeData.result.geometry.location.lat;
        params.lng = placeData.result.geometry.location.lng;
      })();
    }

    return params;
  },
  transformObjectJobs: function transformObjectJobs(jobs) {
    var map = {
      item: {
        id: "id",
        status: "status",
        title: "title",
        imageUrl: "imageUrl",
        description: "description",
        address: "address",
        city: "city",
        zipCode: "zipCode",
        placeID: "placeID",
        wage: "wage",
        postDate: "postDate",
        startDate: "startDate",
        endDate: "endDate",
        endDateRead: "endDateRead",
        day: "day",
        time: "time",
        endTime: "endTime",
        plus: "plus",
        distance: "distance",
        company: "CompanyProfile.name",
        jobType: "JobType.name",
        industry: "Industries",
        industries: "Industries",
        companyProfileId: "CompanyProfile.id",
        jobTypeId: "JobType.id",
        JobApplication: "JobApplication",
        Conversation: "Conversation",
        jobApplicationCount: "jobApplicationCount",
        isPast: "isPast",
        isPastPlus: "isPastPlus",
        recurring: "recurring",
        recurringOrg: "recurringOrg",
        recurringText: "recurringText",
        shareUrl: "shareUrl"
      },
      operate: [{
        run: function run(val) {
          var industryArr = [];
          _lodash2['default'].each(val, function (industryval) {
            if (industryval.name) {
              industryArr.push(industryval.name.toUpperCase());
            }
          });
          return industryArr;
        }, on: "industry"
      }, {
        run: function run(val) {
          if (val) {
            return val.toUpperCase();
          }
        }, on: "jobType"
      }]
    };

    dataTransform = DataTransform(jobs, map);
    return dataTransform.transform();
  },
  transformObjectJobsIdOnly: function transformObjectJobsIdOnly(jobs) {
    var map = {
      item: {
        id: "id"
      }
    };
    dataTransform = DataTransform(jobs, map);
    return dataTransform.transform();
  }
};