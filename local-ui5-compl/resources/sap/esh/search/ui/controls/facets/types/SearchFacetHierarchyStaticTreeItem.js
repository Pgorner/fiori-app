/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["../../../tree/TreeViewItem"],function(e){"use strict";function t(e){return e&&e.__esModule&&typeof e.default!=="undefined"?e.default:e}const s=t(e);const n=s.extend("sap.esh.search.ui.controls.SearchFacetHierarchyStaticTreeItem",{renderer:{apiVersion:2},metadata:{properties:{selectLine:{type:"boolean",defaultValue:false}}},constructor:function e(t,n){s.prototype.constructor.call(this,t,n);const c={onAfterRendering:()=>{const e=this.getDomRef();if(this.getProperty("selectLine")){if(!e.classList.contains("sapMLIBSelected")){e.classList.add("sapMLIBSelected")}}else{if(e.classList.contains("sapMLIBSelected")){e.classList.remove("sapMLIBSelected")}}}};this.addEventDelegate(c,this)}});return n})})();
//# sourceMappingURL=SearchFacetHierarchyStaticTreeItem.js.map