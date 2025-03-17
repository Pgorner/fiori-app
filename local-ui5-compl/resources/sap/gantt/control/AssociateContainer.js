/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/Element","./AssociateContainerRenderer"],function(t,e){"use strict";var n=t.extend("sap.gantt.control.AssociateContainer",{metadata:{library:"sap.gantt",properties:{enableRootDiv:{type:"boolean",defaultValue:false}},associations:{content:{type:"sap.ui.core.Control",multiple:false}}}});n.prototype.setContent=function(t){this.setAssociation("content",t);if(t){var n=typeof t==="string"?e.getElementById(t):t;n._oAC=this}return this};return n},true);
//# sourceMappingURL=AssociateContainer.js.map