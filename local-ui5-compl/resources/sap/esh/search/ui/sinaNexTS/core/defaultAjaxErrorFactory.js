/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../sina/i18n","./errors"],function(r,e){"use strict";const t=r["getText"];const n=e["ServerErrorCode"];const s=e["ServerError"];const o=e["NoConnectionError"];function u(r){const e=r?.allowedStatusCodes??[200,201,204];return function r(u,a){if(e.indexOf(a.status)>=0){return}if(a.status==0){return new o(u.url)}return new s({request:u,response:a,code:n.E001,message:t("error.sina.generalServerError",[u.url,""+a.status,a.statusText,a.data])})}}var a={__esModule:true};a.createDefaultAjaxErrorFactory=u;return a})})();
//# sourceMappingURL=defaultAjaxErrorFactory.js.map