/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/AjaxClient","../../core/defaultAjaxErrorFactory","./ajaxErrorFactory"],function(r,t,e){"use strict";const a=r["AjaxClient"];const c=t["createDefaultAjaxErrorFactory"];const o=e["ajaxErrorFactory"];function n(r){const t={csrf:true,csrfByPassCache:true,errorFactories:[o,c()]};return new a(Object.assign(t,r))}var s={__esModule:true};s.createAjaxClient=n;return s})})();
//# sourceMappingURL=ajax.js.map