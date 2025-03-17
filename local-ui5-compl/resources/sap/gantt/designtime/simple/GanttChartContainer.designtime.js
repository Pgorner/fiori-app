/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/changeHandlers/simple/GanttChartContainer","sap/gantt/utils/GanttCustomisationUtils"],function(t,n){"use strict";return{actions:{settings:n.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_CONTAINER",t.fnConfigureContainerSettings)},tool:{start:function(t){t.setProperty("_isAppRunningInRTA",true)},stop:function(t){t.setProperty("_isAppRunningInRTA",false)}}}});
//# sourceMappingURL=GanttChartContainer.designtime.js.map