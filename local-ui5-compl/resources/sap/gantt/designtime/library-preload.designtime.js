//@ui5-bundle sap/gantt/designtime/library-preload.designtime.js
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/GanttChart.designtime", [],function(){"use strict";return{aggregations:{relationships:{ignore:true}}}},false);
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/GanttChartWithTable.designtime", [],function(){"use strict";return{aggregations:{relationships:{ignore:true}}}},false);
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/library.designtime", [],function(){"use strict";return{}});
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/simple/AdhocLine.designtime", ["sap/gantt/changeHandlers/simple/AdhocLine","sap/gantt/utils/GanttCustomisationUtils"],function(e,t){"use strict";return{domRef:function(e){return e._getMarker()&&e._getMarker().getDomRef()},aggregations:{_marker:{ignore:true},_line:{ignore:true},_headerLine:{ignore:true}},actions:{settings:t.designTimeSettings.bind(null,"TXT_DT_ADHOCLINE",e.fnConfigureALSettings)}}});
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/simple/DeltaLine.designtime", ["sap/gantt/changeHandlers/simple/DeltaLine","sap/gantt/utils/GanttCustomisationUtils"],function(e,t){"use strict";return{domRef:function(e){return e._getHeaderDeltaArea().getDomRef()},aggregations:{_marker:{ignore:true},_line:{ignore:true},_headerLine:{ignore:true}},actions:{settings:t.designTimeSettings.bind(null,"TXT_DT_DELTALINE",e.fnConfigureALSettings)}}});
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/simple/GanttChartContainer.designtime", ["sap/gantt/changeHandlers/simple/GanttChartContainer","sap/gantt/utils/GanttCustomisationUtils"],function(t,n){"use strict";return{actions:{settings:n.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_CONTAINER",t.fnConfigureContainerSettings)},tool:{start:function(t){t.setProperty("_isAppRunningInRTA",true)},stop:function(t){t.setProperty("_isAppRunningInRTA",false)}}}});
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/simple/GanttChartWithTable.designtime", ["sap/gantt/changeHandlers/simple/GanttChartWithTable","sap/gantt/utils/GanttCustomisationUtils"],function(n,t){"use strict";return{actions:{remove:{changeType:"hideControl",isEnabled:true},reveal:{changeType:"unhideControl",isEnabled:true},settings:t.designTimeSettings.bind(null,"TXT_DT_GANTT_CHART_WITH_TABLE",n.fnConfigureContainerSettings)},tool:{start:function(n){n.setProperty("_isAppRunningInRTA",true)},stop:function(n){n.setProperty("_isAppRunningInRTA",false)}}}});
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.predefine("sap/gantt/designtime/simple/Table.designtime", function(){"use strict";return{domRef:function(e){if(e._getRowMode().isA("sap.ui.table.rowmodes.AutoRowMode")){return e.$("sapUiTableCnt").get(0)}return e.getDomRef()},aggregations:{columns:{domRef:".sapUiTableCHA"},hScroll:{ignore:false},rows:{ignore:false},scrollContainers:[{domRef:function(e){return e.$("sapUiTableCnt").get(0)},aggregations:["rows"]}]}}});
//# sourceMappingURL=library-preload.designtime.js.map
