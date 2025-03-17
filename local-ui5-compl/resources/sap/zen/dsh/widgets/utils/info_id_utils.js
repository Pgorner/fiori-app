/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(){"use strict";function e(){}e.prototype.convertEnumToId=function(e){var n=e;if(n.indexOf("INFO_")===0){n=n.replace("INFO_","INFO/")}return n.toLowerCase()};e.prototype.convertIdToEnum=function(e){var n=e;if(n.indexOf("info/")===0){n=n.replace("info/","info_")}return n.toUpperCase()};return e});
//# sourceMappingURL=info_id_utils.js.map