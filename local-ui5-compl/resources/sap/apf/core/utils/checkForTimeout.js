/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/messageObject"],function(e){"use strict";var s=function(s){var a;var r;var t=false;if(s&&s.headers&&s.headers["x-sap-login-page"]){t=true}if(s&&s.getResponseHeader&&s.getResponseHeader("x-sap-login-page")!==null){t=true}if(s&&s.status){a=s.status}if(s&&s.response&&s.response.statusCode){a=s.response.statusCode}if(a===303||a===401||a===403||t){r=new e({code:"5021"})}return r};return s},true);
//# sourceMappingURL=checkForTimeout.js.map