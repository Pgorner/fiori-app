/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../core/AjaxClient","./ajaxErrorFactory","./ajaxErrorFactoryDeprecated","../../core/defaultAjaxErrorFactory"],function(r,t,e,a){"use strict";const o=r["AjaxClient"];const c=t["ajaxErrorFactory"];const n=e["deprecatedAjaxErrorFactory"];const s=a["createDefaultAjaxErrorFactory"];function u(r){const t={errorFactories:[c,n,s({allowedStatusCodes:[200,201,204,300]})],errorFormatters:[]};return new o(Object.assign(t,r))}var i={__esModule:true};i.createAjaxClient=u;return i})})();
//# sourceMappingURL=ajax.js.map