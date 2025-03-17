/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(function(){"use strict";return{domRef:function(e){if(e._getRowMode().isA("sap.ui.table.rowmodes.AutoRowMode")){return e.$("sapUiTableCnt").get(0)}return e.getDomRef()},aggregations:{columns:{domRef:".sapUiTableCHA"},hScroll:{ignore:false},rows:{ignore:false},scrollContainers:[{domRef:function(e){return e.$("sapUiTableCnt").get(0)},aggregations:["rows"]}]}}});
//# sourceMappingURL=Table.designtime.js.map