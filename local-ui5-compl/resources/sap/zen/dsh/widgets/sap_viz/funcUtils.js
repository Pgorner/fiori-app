/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/typeUtils"],function(n,t){"use strict";n.info("Load funcUtils");var a=Array.prototype.slice;function r(){var n=[];function e(){for(var t=0,a=n.length;t<a;t++){n[t].apply(this,arguments)}}function i(){for(var a=0,r=arguments.length;a<r;a++){if(t.isFunction(arguments[a])){n.push(arguments[a])}else{throw new Error("Could not create call chain for non-function object")}}}e.chain=function(){return r.apply(null,[].concat(n,a.call(arguments)))};i.apply(null,arguments);return e}var e={createCallChain:r};return e});
//# sourceMappingURL=funcUtils.js.map