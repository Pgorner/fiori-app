/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/typeUtils"
  ],
  function(Log,TypeUtils) {
    "use strict";
    Log.info("Load funcUtils");
    var ArraySlice = Array.prototype.slice;
    function createCallChain() {
      var callChain = [];
      function ChainedFunc() {
        for (var i = 0, len = callChain.length; i < len; i++) {
          callChain[i].apply(this, arguments);
        }
      }
      function buildChain() {
        for (var i = 0, len = arguments.length; i < len; i++) {
          if (TypeUtils.isFunction(arguments[i])) {
            callChain.push(arguments[i]);
          } else {
            throw new Error("Could not create call chain for non-function object");
          }
        }
      }
      ChainedFunc.chain = function() {
        return createCallChain.apply(null, [].concat(callChain, ArraySlice.call(arguments)));
      };
      buildChain.apply(null, arguments);
      return ChainedFunc;
    }
    var funcUtils = {
      createCallChain: createCallChain
    };
    return funcUtils;
  }
);
