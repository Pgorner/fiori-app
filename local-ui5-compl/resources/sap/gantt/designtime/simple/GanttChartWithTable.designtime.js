/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/changeHandlers/simple/GanttChartWithTable","sap/gantt/utils/GanttCustomisationUtils"],function(n,t){"use strict";return{actions:{remove:{changeType:"hideControl",isEnabled:true},reveal:{changeType:"unhideControl",isEnabled:true},settings:t.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_WITH_TABLE",n.fnConfigureContainerSettings)},tool:{start:function(n){n.setProperty("_isAppRunningInRTA",true)},stop:function(n){n.setProperty("_isAppRunningInRTA",false)}}}});
//# sourceMappingURL=GanttChartWithTable.designtime.js.map