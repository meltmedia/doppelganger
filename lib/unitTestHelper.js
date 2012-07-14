/**
 * unitTestHelper.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http");

exports.httpRequest = function (args, callback) {
  // set default arguments where necessary
  _.each({ "host": "http://www.meltmedia.com", "port": 80, "path": "/",
    "method": "GET" },
    function (value, key) {
      if (!args[key]) { args[key] = value; }
    });
  // execute the request
  http.request(args, function (response) {
    var data = "";
    response.on("data", function (chunk) {
      data += chunk;
    });
    response.on("end", function () {
      //invoke the callback
      callback(response, data);
    });
    response.on("close", function () {
      throw { "name": "TEST FAILED!", "message": "connection closed unexpectedly"};
    });
    response.on("error", function (e) {
      throw { "name": "TEST FAILED!", "message": e};
    });
  }).end();
};