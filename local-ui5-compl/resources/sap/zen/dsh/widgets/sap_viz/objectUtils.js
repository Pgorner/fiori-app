/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(e){e.info("Load objectUtils");return{clone:function(e){if(typeof e!=="object"){return e}if(e===null)return e;var n=e.constructor===Array?[]:{};for(var r in e){n[r]=typeof e[r]==="object"?arguments.callee.call(null,e[r]):e[r]}return n}}});
//# sourceMappingURL=objectUtils.js.map