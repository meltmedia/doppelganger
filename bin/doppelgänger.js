/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http"),
  targetHost = "www.meltmedia.com",
  targetPort = 80;

console.log("### doppelgänger starting...");

http.createServer(function (inRequest, outResponse) {
  var fixedHeaders = inRequest.headers;
  fixedHeaders.host = targetHost + ":" + targetPort;
  http.request({
    "host": targetHost,
    "port": targetPort,
    "method": inRequest.method,
    "path": inRequest.url,
    "headers": fixedHeaders
  }, function (inResponse) {
    outResponse.statusCode = inResponse.statusCode;
    _.each(inResponse.headers, function (value, key, list) { outResponse.setHeader(key, value); });
    inResponse.on("data", function (chunk) {
      outResponse.write(chunk);
    });
    inResponse.on("end", function () {
      outResponse.end();
    })
  }).end();
}).listen(8080, "0.0.0.0");

console.log("### doppelgänger started!");