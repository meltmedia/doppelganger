/**
 * doppelgänger-test.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*global describe, it, should */
/*jslint indent: 2, nomen: true*/

var should = require("should"),
  _ = require("underscore"),
  helper = require("../lib/unitTestHelper.js"),
  express = require("express"),
  proxy = require("../lib/proxy.js");

describe("proxy", function () {

  var app = express.createServer(),
    proxyPort = 8081;
  app.all('/ok', function(req, res){ res.send('ok'); });
  app.get("/notfound", function(req, res){ res.send("not found",404); });
  app.listen(8080);
  proxy.proxy({"targetHost":"localhost", "targetPort":8080, "proxyPort":proxyPort});

  // test that proxy supports all HTTP methods that we care about
  _.each(["GET","POST","PUT","DELETE","OPTIONS","TRACE"], function (method) {
    it("should proxy requests with method " + method, function (method) {
      return function (done) {
        helper.httpRequest({"host": "localhost", "port": proxyPort, "method": method,
          "path": "/ok"
        }, function (response, data) {
          response.statusCode.should.equal(200);
          data.should.equal("ok");
          done();
        });
      }; 
    }(method));
  });

  it("should proxy 404 responses", function(done) {
    helper.httpRequest({"host": "localhost", "port": proxyPort, "method": "GET",
      "path": "/notfound"
    }, function (response, data) {
      response.statusCode.should.equal(404);
      data.should.equal("not found");
      done();
    });
  });

});