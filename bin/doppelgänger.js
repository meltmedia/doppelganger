/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  express = require("express"),
  fs = require("fs"),
  observations = JSON.parse(fs.readFileSync("observations.json")),
  app = express.createServer(/*{ "key": fs.readFileSync("ssl/key.pem"),
  "cert": fs.readFileSync("ssl/cert.pem")}*/);

app.use(function(req, res, next) {
  var buffer = "";
  req.on("data", function (chunk) { buffer += chunk; });
  req.on("end", function (chunk) { req.body = buffer; return next(); });
});
app.all('*', function(req, res){
  var fo = observations;



  // match method
  var fo = _.filter(observations, function (o) { return o.request.method === req.method; });
  // match url
  fo = _.filter(fo, function (o) { return o.request.url === req.url; });
  // match body
  fo = _.filter(fo, function (o) {
    var parseMethod = function (str) {
      return _.filter(str.split("&"), function (n) { return n.indexOf("method=") !== -1; })[0].split("=")[1];
    }
    return parseMethod(o.requestBody) === parseMethod(req.body);
  });
  // try to find a 2XX response
  var fog = _.filter(fo, function (o) { return (o.response.statusCode > 199 && o.response.statusCode < 300); });
  if (fog.length > 0) { fo = fog; }
  // serve the response, if there is one
  if(fo.length > 0) {
    console.log("found matching observation!");
    var xo = fo[0];
    _.each(xo.response.headers, function (value, key, list) {
      res.setHeader(key, value);
    });
    res.send(xo.responseBody,xo.response.statusCode);
  } else {
    console.log("cannot handle request");
    res.send("WTF?",404);
  }
});

app.listen(80);
//app.listen(443);

console.log("### doppelgänger started");