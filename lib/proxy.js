/**
 * proxy.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http"),
  https = require("https"),
  fs = require("fs");

module.exports = {
  "sawRequestAndResponse": function () { console.log("SWALLOWING OBSERVATION!"); },
  "proxy": function (args) {
    var httpx = http;
    // set default arguments where necessary
    _.each({ "targetHost": "www.meltmedia.com", "targetPort": 80,
      "proxyHost": "0.0.0.0", "proxyPort": 80, "ssl": false },
      function (value, key) {
        if (!args[key]) { args[key] = value; }
      });
    // check for ssl
    if(args.ssl) httpx = https;
    // spin up the proxy
    var serverFunction = function (inRequest, outResponse) {
      var inRequestBody = "";
      inRequest.on("data", function (chunk) {
        inRequestBody += chunk;
      });
      inRequest.on("end", function () {
        var fixedHeaders = inRequest.headers;
        //fixedHeaders.host = args.targetHost + ":" + args.targetPort;
        delete fixedHeaders.host;
        console.log("targetHost = " + args.targetHost);
        httpx.request({
          "host": args.targetHost,
          "port": args.targetPort,
          "method": inRequest.method,
          "path": inRequest.url,
          "headers": fixedHeaders
        }, function (inResponse) {
          var outResponseBody = "";
          outResponse.statusCode = inResponse.statusCode;
          _.each(inResponse.headers, function (value, key, list) {
            outResponse.setHeader(key, value);
          });
          inResponse.on("data", function (chunk) {
            outResponse.write(chunk.toString().replace(new RegExp(args.targetHost,"g"),"localhost"));
            outResponseBody += chunk.toString().replace(new RegExp(args.targetHost,"g"),"localhost");
          });
          inResponse.on("end", function () {
            outResponse.end();
            module.exports.sawRequestAndResponse(inRequest, inRequestBody,
              outResponse, outResponseBody);
          });
        }).end(inRequestBody);
      });
    }
    if(args.ssl) {
      console.log("SECURE PROXY UP (" + args.proxyPort + "->" + args.targetPort + ")");
      httpx.createServer({ "cert": fs.readFileSync("./ssl/cert.pem"),
        "key": fs.readFileSync("./ssl/key.pem")}, serverFunction)
        .listen(args.proxyPort, args.proxyHost);
    } else {
      console.log("CLEAR PROXY UP (" + args.proxyPort + "->" + args.targetPort + ")");
      httpx.createServer(serverFunction).listen(args.proxyPort, args.proxyHost);
    }
  },
  "setSawRequestAndResponse": function (l) {
    module.exports.sawRequestAndResponse = l;
  }
};
