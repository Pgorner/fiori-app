/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/theming/Parameters","sap/gantt/misc/Utility","sap/gantt/utils/GanttChartConfigurationUtils"],function(t,e,a){"use strict";var i={};i.render=function(t,e){t.write("<div");t.writeControlData(e);t.addClass("sapGanttChartWithTable");t.writeClasses();t.addStyle("width",e.getWidth());t.addStyle("height",e.getHeight());t.writeStyles();t.write(">");this._setTableColumnHeaderHeight(e);t.renderControl(e._oSplitter);t.write("</div>")};i._setTableColumnHeaderHeight=function(i){var r=i._oToolbar.getAllToolbarItems().length===0;if(r){var n=e.findSapUiSizeClass(),s=a.getTheme().endsWith("hcb"),l=0,o=s?4:2;if(n==="sapUiSizeCozy"){l=parseInt(t.get("_sap_gantt_Gantt_HeaderHeight"))-o}else{l=parseInt(t.get("_sap_gantt_Gantt_CompactHeaderHeight"))-o}i._oTT.setColumnHeaderHeight(l)}};return i},true);
//# sourceMappingURL=GanttChartWithTableRenderer.js.map