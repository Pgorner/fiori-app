/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../sina/i18n"],function(e){"use strict";const t=e["getText"];function n(e,n){if(!n){return{success:false,filterDescription:""}}n=n.filter(e=>e.ai);if(n.length===0){return{success:false,filterDescription:""}}const i=[];for(const r of n){if(!r.filter.natural_language){continue}if(n.length>1){const n=e.getDataSource(r.Name);i.push(t("nlqDataSourceAndFilterDescription",[n?n.label:r.Name,r.filter.natural_language]))}else{i.push(r.filter.natural_language)}}let r="";if(i.length>0){r="<code>"+i.join("<br/>")+"</code>"}return{success:true,filterDescription:r}}var i={__esModule:true};i.parseNlqInfo=n;return i})})();
//# sourceMappingURL=nlqParser.js.map