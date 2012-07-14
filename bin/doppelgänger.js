/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http");

console.log("### doppelgänger started");

http.createServer(function (request, response) {
  response.end("doppelganger");
}).listen(8080, "0.0.0.0");