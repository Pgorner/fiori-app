/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/utils/GanttCustomisationUtils"],function(t){"use strict";var n={getDialogBox:function(n){return t.dialogBox(n,false)}};n.fnConfigureALSettings=function(t){return n.getDialogBox(t).then(function(n){return[{selectorControl:t,changeSpecificData:{changeType:"ganttAdhocLineSettings",content:n}}]})};return n},true);
//# sourceMappingURL=AdhocLine.js.map