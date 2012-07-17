/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http"),
  proxy = require("../lib/proxy.js"),
  md5 = require("md5"),
  fs = require("fs"),
  log = [],
  opts = require('tav').set({
    host: {
      note: 'target host'
    },
    port: {
      note: 'target port',
      value: 80
    },
    securePort: {
      note: "secure target port",
      value: 443
    },
    proxyPort: {
      note: 'proxy port',
      value: 8080
    },
    secureProxyPort: {
      note: 'secure proxy port',
      value: 8443
    }
  }, "doppelgänger"),
  observationHandler = function (request, requestBody, response, responseBody) {
    var key = md5.digest_s(request.url + requestBody);
    log.push({"request":{"headers":request.headers, "url": request.url, "method": request.method,
      "httpVersion": request.httpVersion }, 
      "requestBody":requestBody, 
      "response": {"statusCode": response.statusCode, "headers": response.headers},
      "responseBody": responseBody});
    console.log("URL: " + request.url + " STATUS: " + response.statusCode +
      (requestBody === ""? "" : " DATA: " + requestBody));
  };

console.log("### doppelgänger starting...");

proxy.proxy({"targetHost": opts.host, "targetPort": opts.port, "proxyPort": opts.proxyPort});
proxy.proxy({"targetHost": opts.host, "targetPort": opts.securePort, "proxyPort": opts.secureProxyPort,
  "ssl": true });
proxy.setSawRequestAndResponse(observationHandler);

/** this goes off when you CTRL-C **/
/** (unless your environment is goofy) **/
process.on('SIGINT', function () {
  fs.writeFile('observations.json', JSON.stringify(log), function (err) {
    if (err) { throw err; }
    process.exit(0);
  });
});

console.log("### doppelgänger started!");