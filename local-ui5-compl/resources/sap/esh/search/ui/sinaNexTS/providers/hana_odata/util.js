/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/Log"],function(r){"use strict";const t=r["Log"];async function a(r,a){async function e(r){let e;switch(r.name){case"ServerError":e=r;if(!e.response.dataJSON){throw r}try{const t=await a(e.response.dataJSON);t.addError(r);return t}catch(a){const e=new t("hana odata util");e.warn("Error while parsing error response: "+a);throw r}default:throw r}}let n;try{n=await r()}catch(r){return await e(r)}return await a(n)}var e={__esModule:true};e.handleError=a;return e})})();
//# sourceMappingURL=util.js.map