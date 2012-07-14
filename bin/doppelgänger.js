/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/
"use strict";
/*jslint indent: 2, nomen: true*/

var _ = require("underscore"),
  http = require("http"),
  proxy = require("../lib/proxy.js");

console.log("### doppelgänger starting...");

proxy.proxy({"targetHost": "www.meltmedia.com", "targetPort": 80, "proxyPort": 8080});

console.log("### doppelgänger started!");