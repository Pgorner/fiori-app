/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.gantt.def.DefBase",{metadata:{library:"sap.gantt",abstract:true,properties:{defString:{type:"string",defaultValue:null},refString:{type:"string",defaultValue:null}}}});e.prototype.getRefString=function(){var t=this.getProperty("refString");return t?t:"url(#"+this.generateRefId()+")"};e.prototype.generateRefId=function(){return this.getId()};return e},true);
//# sourceMappingURL=DefBase.js.map