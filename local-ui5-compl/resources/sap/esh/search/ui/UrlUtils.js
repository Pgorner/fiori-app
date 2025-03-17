/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./error/ErrorHandler"],function(r){"use strict";function e(r){return r&&r.__esModule&&typeof r.default!=="undefined"?r.default:r}const n=e(r);function t(r,e,t,o,d){const i={top:e.toString(),filter:o?encodeURIComponent(JSON.stringify(t.toJson())):JSON.stringify(t.toJson())};if(r.config.FF_sortOrderInUrl&&d&&Object.keys(d).length>0){if(d.orderBy){i.orderby=encodeURIComponent(d.orderBy)}if(d.sortOrder){i.sortorder=d.sortOrder}}try{return r.config.renderSearchUrl(i)}catch(r){const e=n.getInstance();e.onError(r);return""}}var o={__esModule:true};o.renderUrlFromParameters=t;return o})})();
//# sourceMappingURL=UrlUtils.js.map