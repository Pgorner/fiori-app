/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape"],function(e){"use strict";var t=e.extend("sap.gantt.shape.Definitions",{metadata:{properties:{tag:{type:"string",defaultValue:"defs"},childTagName:{type:"string"},content:{type:"string",defaultValue:""},referenceId:{type:"string"}}}});t.prototype.getChildTagName=function(e,t){if(this.mShapeConfig.hasShapeProperty("childTagName")){return this._configFirst("childTagName",e)}};t.prototype.getContent=function(e,t){if(this.mShapeConfig.hasShapeProperty("content")){return this._configFirst("content",e)}return null};t.prototype.getReferenceId=function(e,t){return this.getParentReferenceId(e,t)};return t},true);
//# sourceMappingURL=Definitions.js.map