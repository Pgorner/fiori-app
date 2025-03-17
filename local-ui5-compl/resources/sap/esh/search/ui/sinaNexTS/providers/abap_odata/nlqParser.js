/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../sina/i18n"],function(e){"use strict";const t=e["getText"];function n(e,n){if(!n||n.length===0){return{success:false,filterDescription:""}}const s=[];for(const r of n){if(n.length>1){const n=r?.NLQConnectorQueries?.results[0]?.ConnectorID;const i=e.getDataSource(n);s.push(t("nlqDataSourceAndFilterDescription",[i?i.label:n,r.Description]))}else{s.push(r.Description)}}let r="";if(s.length>0){r="<code>"+s.join("<br/>")+"</code>"}return{success:true,filterDescription:r}}var s={__esModule:true};s.parseNlqInfo=n;return s})})();
//# sourceMappingURL=nlqParser.js.map