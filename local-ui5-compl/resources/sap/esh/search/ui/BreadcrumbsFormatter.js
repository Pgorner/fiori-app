/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["./sinaNexTS/sina/HierarchyDisplayType"],function(e){"use strict";const t=e["HierarchyDisplayType"];class r{model;constructor(e){this.model=e}formatNodePaths(e){if(e){const t=this._selectNodePath(e);if(t){return t.path}}return[]}formatHierarchyAttribute(e){if(e){const t=this._selectNodePath(e);if(t){return t.name}}return""}_selectNodePath(e){const r=e.hierarchyNodePaths;if(r&&Array.isArray(r)&&r.length>0){for(let a=0;a<r.length;a++){const i=r[a];const s=i.name;if(i&&Array.isArray(i.path)&&s){const r=e.query.getDataSource()?.attributesMetadata?.find(e=>e.id===s);if(r&&r.isHierarchy===true&&(r.hierarchyDisplayType===t.HierarchyResultView||r.hierarchyDisplayType===t.StaticHierarchyFacet)){return i}}}}return null}}var a={__esModule:true};a.Formatter=r;return a})})();
//# sourceMappingURL=BreadcrumbsFormatter.js.map