'use strict';
import _ from 'lodash';
var RRule = require('rrule').RRule;
var DataTransform = require("node-json-transform").DataTransform;
var dataTransform;
const config = require('config'),
  GoogleLocations = require('google-locations'),
  moment = require('moment');


module.exports = {
  jobValidationExtra: function(jobType, params) {
      const errorNew = new Error();
      if (!jobType) {
        errorNew.status = 400;
        errorNew.message = "invalid job type id"; 
        errorNew.success =  false;
        errorNew.code = 400;
        throw errorNew;
        return;
      }

      let clientStartDateFromNow =  moment().startOf('day').diff(moment(params.startDate), 'days');
      if (clientStartDateFromNow > 0) {
        errorNew.status = 400;
        errorNew.message = "start date is in the past"; 
        errorNew.success =  false;
        errorNew.code = 400;
        throw errorNew;
        return;
      }

      if (jobType.name === 'Recurring') {
        if (!params.endDate) {
          errorNew.status = 400;
          errorNew.message = "Recurring job must have end date"; 
          errorNew.success =  false;
          errorNew.code = 400;
          throw errorNew;
          return;
        }

        if (!params.recurring) {
          errorNew.status = 400;
          errorNew.message = "Recurring job must have recurring set"; 
          errorNew.success =  false;
          errorNew.code = 400;
          throw errorNew;
          return;
        }

      } else if (jobType.name === 'Time Period') {
        if (!params.endDate) {
          errorNew.status = 400;
          errorNew.message = "Time period must have endDate"; 
          errorNew.success =  false;
          errorNew.code = 400;
          throw errorNew;
          return;
        }
      }

      if (params.endDate) {
          let days =  moment(params.startDate).diff(moment(params.endDate), 'days');
          if (days > 0) {
            errorNew.status = 400;
            errorNew.message = "Job Start Date cannot be greater than End Date"; 
            errorNew.success =  false;
            errorNew.code = 400;
            throw errorNew;
            return;
          }
        }
  },
  transformObjectRecurring: function(params) {
  	 if(params.recurring)
              {  // Create a rule:
                let ruleOptons = {
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
                let rule = new RRule(ruleOptons);
                params.recurring = rule.toString();
            }
    return params;
  },
  getPlaceDetails:function (options) {
    return new Promise(function(resolve, reject) {
      locations.details(options, function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });

    });
  },
  transformJobApplicationStatus: function(jobApplication) {
    let jobApplicationStatusObject = {withdrawn : "0", matched : "0", pending : "0"};
     jobApplication =  JSON.parse(JSON.stringify(jobApplication));
      _.each(jobApplication, function(statusVal) {
        jobApplicationStatusObject[statusVal.status] = statusVal.noCount;
      });
      return jobApplicationStatusObject;
  },
  transformObjectPlaceData: function(placeData,params) {
    if(placeData.result) {
      let addressComponents = placeData.result.address_components,
        addressTypes;
      _.each(addressComponents, function(addressComponent) {
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
      params.lng  = placeData.result.geometry.location.lng;
    }
    
    return params;
  },
  transformObjectJobs: function(jobs) {
  	 var map = {
        item: {
          id : "id",
          status : "status",
          title : "title",
          imageUrl : "imageUrl",
          description: "description",
          address : "address",
          city : "city",
          zipCode : "zipCode",
          placeID : "placeID",
          wage : "wage",
          postDate : "postDate",
          startDate : "startDate",
          endDate : "endDate",
          endDateRead : "endDateRead",
          day : "day",
          time : "time",
          endTime : "endTime",
          plus : "plus",
          distance : "distance",
          company : "CompanyProfile.name",
          jobType : "JobType.name",
          industry : "Industries",
          industries : "Industries",
          companyProfileId : "CompanyProfile.id",
          jobTypeId : "JobType.id",
          JobApplication : "JobApplication",
          Conversation : "Conversation",
          jobApplicationCount : "jobApplicationCount",
          isPast : "isPast",
          isPastPlus : "isPastPlus",
          recurring : "recurring",
          recurringOrg : "recurringOrg",
          recurringText : "recurringText",
          shareUrl : "shareUrl"
        },
        operate: [
          {
            run: function(val) {
              var industryArr = [];
              _.each(val, function(industryval) {
                if (industryval.name) {
                  industryArr.push(industryval.name.toUpperCase());
                }
              });
              return industryArr;
            }, on: "industry"
          },
          {
            run: function(val) {
              if (val) {
                return val.toUpperCase();
              }
            }, on : "jobType"
          }

        ]
      };

      dataTransform = DataTransform(jobs, map);
       return  dataTransform.transform();
  },
   transformObjectJobsIdOnly: function(jobs) {
     let map = {
        item : {
          id : "id"
        }
      };
      dataTransform = DataTransform(jobs, map);
       return  dataTransform.transform();
  }
};