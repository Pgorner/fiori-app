/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ResultSet"],function(t){"use strict";const s=t["ResultSet"];class e extends s{facets=[];totalCount;nlqResult;hierarchyNodePaths=[];constructor(t){super(t);this.facets=t.facets??this.facets;this.totalCount=t.totalCount??this.totalCount;this.hierarchyNodePaths=t.hierarchyNodePaths??this.hierarchyNodePaths;this.nlqResult=t.nlqResult}toString(...t){const e=[];e.push(s.prototype.toString.apply(this,t));for(let t=0;t<this.facets.length;++t){const s=this.facets[t];e.push(s.toString())}return e.join("\n")}}var o={__esModule:true};o.SearchResultSet=e;return o})})();
//# sourceMappingURL=SearchResultSet.js.map