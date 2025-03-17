/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log"
  ],
  function( Log ){
    "use strict";
    Log.info("Load CssPlugin");
    function CssPlugin() {
      //
    }
    // Compatibility functions:
    // Gets the document head in a cross-browser manner
    var getHead = function () {
      return document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    };
    //The RequireJS module methods
    CssPlugin.prototype.normalize = function(name, normalizer) {
      if (!/\.css$/.test(name)) {
        name = name + ".css";
      }
      return normalizer(name);
    };
    CssPlugin.prototype.load = function (name, req, load) {
      var cssUrl = (req.toUrl ? req.toUrl(name) : name);
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = cssUrl;
      link.onload = function() {
        load(this.sheet);
        this.onerror = this.onload = null;
      };
      link.onerror = function() {
        load.error(new Error("Failed to load " + this.href));
        this.onerror = this.onload = null;
      };
      getHead().appendChild(link);
    };
    CssPlugin.prototype.pluginBuilder = "cssBuilder";
    return CssPlugin;
  }
);
