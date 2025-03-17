/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape"],function(e){"use strict";var t=e.extend("sap.gantt.shape.Group",{metadata:{properties:{tag:{type:"string",defaultValue:"g"},RLSAnchors:{type:"object"}},aggregations:{shapes:{type:"sap.gantt.shape.Shape",multiple:true,singularName:"shape"}}}});t.prototype.getRLSAnchors=function(e,t){return this._configFirst("RLSAnchors",e)};t.prototype.genReferenceId=function(e,t){return this._configFirst("referenceId",e)};return t},true);
//# sourceMappingURL=Group.js.map