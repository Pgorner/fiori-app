/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(t){"use strict";var e=t.extend("sap.gantt.config.Hierarchy",{metadata:{library:"sap.gantt",properties:{key:{type:"string",defaultValue:sap.gantt.config.DEFAULT_HIERARCHY_KEY},text:{type:"string",defaultValue:"Default Hierarchy"},activeModeKey:{type:"string",defaultValue:sap.gantt.config.DEFAULT_MODE_KEY},toolbarSchemeKey:{type:"string",defaultValue:sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY},columns:{type:"object[]"},expandedLevels:{type:"string[][]"}}}});e.prototype.init=function(){this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setText(this._oRb.getText("XLST_DEFAULT_HIE"))};return e},true);
//# sourceMappingURL=Hierarchy.js.map