/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define([],function(){"use strict";class e{selected;level;filterCondition;value;label;facetTitle;facetAttribute;valueLabel;advanced;listed;icon;visible;constructor(e){const t=e||{};this.selected=t.selected||false;this.level=t.level||0;this.filterCondition=t.filterCondition;this.value=t.value||"";this.label=typeof t.label==="undefined"?"":t.label+"";this.facetTitle=t.facetTitle||"";this.facetAttribute=t.facetAttribute||"";this.valueLabel=this.value;this.advanced=t.advanced||false;this.listed=t.listed||false;this.icon=t.icon;this.visible=t.visible||true}equals(e){return this.facetTitle===e.facetTitle&&this.label===e.label&&this.value===e.value&&this.filterCondition.equals(e.filterCondition)}clone(){const t=new e;t.facetTitle=this.facetTitle;t.selected=this.selected;t.label=this.label;t.icon=this.icon;t.level=this.level;t.value=this.value;t.valueLabel=this.valueLabel;t.filterCondition=this.filterCondition.clone();return t}}return e})})();
//# sourceMappingURL=FacetItem.js.map