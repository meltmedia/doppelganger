/**
 * proxy.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http");

module.exports = {
  "proxy": function (args) {
    // set default arguments where necessary
    _.each({ "targetHost": "www.meltmedia.com", "targetPort": 80, 
      "proxyHost":"0.0.0.0", "proxyPort": 80,  }, 
      function (value, key) {
        if (!args[key]) args[key] = value; 
      });
    // spin up the proxy
    http.createServer(function (inRequest, outResponse) {
      var fixedHeaders = inRequest.headers;
      fixedHeaders.host = args.targetHost + ":" + args.targetPort;
      http.request({
        "host": args.targetHost,
        "port": args.targetPort,
        "method": inRequest.method,
        "path": inRequest.url,
        "headers": fixedHeaders
      }, function (inResponse) {
        outResponse.statusCode = inResponse.statusCode;
        _.each(inResponse.headers, function (value, key, list) { 
          outResponse.setHeader(key, value); 
        });
        inResponse.on("data", function (chunk) {
          outResponse.write(chunk);
        });
        inResponse.on("end", function () {
          outResponse.end();
        });
      }).end();
    }).listen(args.proxyPort, args.proxyHost);
  }
}
