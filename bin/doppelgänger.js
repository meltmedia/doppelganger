/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  express = require("express"),
  fs = require("fs"),
  md5 = require("md5"),
  observations = JSON.parse(fs.readFileSync("observations.json")),
  app = express.createServer(),
  seriesTracker = 0,
  secureApp = express.createServer({ "key": fs.readFileSync("ssl/key.pem"),
  "cert": fs.readFileSync("ssl/cert.pem")}),
  bodyReader = function(req, res, next) {
    var buffer = "";
    req.on("data", function (chunk) { buffer += chunk; });
    req.on("end", function (chunk) { req.body = buffer; return next(); });
  }, 
  requestHandler = function(req, res){
    var fo = observations;
    // match method
    var fo = _.filter(observations, function (o) { return o.request.method === req.method; });
    // match url
    fo = _.filter(fo, function (o) { return o.request.url === req.url; });
    // match body
    /*fo = _.filter(fo, function (o) {
      var parseMethod = function (str) {
        return _.filter(str.split("&"), function (n) { return n.indexOf("method=") !== -1; })[0].split("=")[1];
      }
      return parseMethod(o.requestBody) === parseMethod(req.body);
    });*/
    // try to find a 2XX response
    //var fog = _.filter(fo, function (o) { return (o.response.statusCode > 199 && o.response.statusCode < 300); });
    //if (fog.length > 0) { fo = fog; }
    // serve the response, if there is one
    if(fo.length > 0) {

      // series advancement for bcbs
      var obsbump = 0;
      if(req.url === "/api/") {
        obsbump += seriesTracker;
        seriesTracker+=1;
        console.log("obsbump === " + obsbump);
      }

      console.log("found matching observation!");
      var xo = fo[obsbump];
      _.each(xo.response.headers, function (value, key, list) {
        res.setHeader(key, value);
      });
      res.send(xo.responseBody,xo.response.statusCode);
      console.log("REQUEST " + req.url + " - " + xo.requestBody);
      console.log("RESPONSE " + res.statusCode + " - " + xo.responseBody);
    } else {
      console.log("cannot handle request");
      res.send("WTF?",404);
    }
  };

app.use(bodyReader);
app.all("*", requestHandler);
app.listen(80);

secureApp.use(bodyReader);
secureApp.all("*", requestHandler);
secureApp.listen(443);


console.log("### doppelgänger started");