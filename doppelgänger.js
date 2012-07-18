#!/usr/bin/env node
"use strict";
/**
 * doppelgänger.js
 * Kyle W. Cartmell, Meltmedia (kyle.cartmell@meltmedia.com)
 **/

var _ = require("underscore"),
  ArgumentParser = require("argparse").ArgumentParser,
  common = new ArgumentParser({
    "version": "0.0.1",
    "addHelp": true,
    "description": "a web service cloning tool for great justice"
  }),
  subparsers = common.addSubparsers({
    "title": "subcommands",
    "dest": "subcommand_name"
  }),
  observe = subparsers.addParser("observe", { "addHelp": true }),
  serve = subparsers.addParser("serve", { "addHelp": true });

_.each([common, observe, serve], function (parser) {
  parser.addBooleanArgument = function ( name, forms, help, defaultValue ) {
    parser.addArgument( forms, {
      "action": defaultValue? "storeFalse" : "storeTrue",
      "help": help,
      "defaultValue": defaultValue,
      "dest": name
    });
  };
  parser.addEnablerArgument = function ( name, forms, help ) {
    parser.addBooleanArgument( name, forms, help, false );
  };
  parser.addDisablerArgument = function ( name, forms, help ) {
    parser.addBooleanArgument( name, forms, help, true );
  };
  parser.addStoredArgument = function ( name, forms, help, defaultValue ) {
    var required = (defaultValue === undefined) && (defaultValue !== null);
    parser.addArgument( forms, {
      "action": "store",
      "help": help,
      "defaultValue": defaultValue,
      "dest": name,
      "required": required
    });
  };
  parser.addSetArgument = function ( name, forms, help ) {
    parser.addArgument( forms, {
      "action": "append",
      "help": help,
      "dest": name,
      "defaultValue": []
    });
  };
});

common.addEnablerArgument("quiet", ["-q", "--quiet"], "supress all output");
common.addEnablerArgument("verbose", ["--verbose"], "enable verbose output");

observe.addStoredArgument("host", ["--host"], "host of the service to be cloned");
observe.addStoredArgument("port", ["--port","-p"], "clear TCP port of the service to be cloned", 80);
observe.addStoredArgument("securePort", ["--secure-port","-sp"], 
  "secure TCP port of the service to be cloned", 443);
observe.addStoredArgument("proxyPort", ["--proxy-port","-pp"], 
  "clear TCP port of the local service proxy", 80);
observe.addStoredArgument("secureProxyPort", ["--secure-proxy-port","-spp"], 
  "secure TCP port of the local service proxy", 443);
observe.addStoredArgument("write", ["--write","-w"],"observations output file", "observations.json");

serve.addStoredArgument("observations", ["--observations","-o"], "observations file", "observations.json");
serve.addStoredArgument("sslkey", ["--ssl-key","-sk"], "ssl key pem", "ssl/key.pem");
serve.addStoredArgument("sslcert", ["--ssl-cert","-sc"], "ssl cert pem", "ssl/cert.pem");
serve.addDisablerArgument("ignoreMethod", ["--ignore-method"], "ignore http request method");
serve.addDisablerArgument("ignoreUrl", ["--ignore-url"], "ignore http request url");
serve.addEnablerArgument("matchBody", ["--match-body"], "match http request body");
serve.addSetArgument("matchBodyJsonPath", ["-jp", "--match-body-json-path"], 
  "match http request body json path");
serve.addEnablerArgument("matchAllParameters", ["--match-all-parameters"], "match all parameters");
serve.addEnablerArgument("favorSuccess", ["--favor-success"], "favor successful http responses");
serve.addEnablerArgument("globalSeries", ["--global-series"], "treat all response sets as series");
serve.addSetArgument("series", ["--series"], "treat specified response set as a series");
serve.addStoredArgument("script", ["--script","-s"], "behavior enhancement script", null);

var args = common.parseArgs();
console.dir(args);