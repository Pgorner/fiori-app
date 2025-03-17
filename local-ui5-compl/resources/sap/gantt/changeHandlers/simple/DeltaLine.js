/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/utils/GanttCustomisationUtils"],function(t){"use strict";var n={getDialogBox:function(n){return t.dialogBox(n,true)}};n.fnConfigureALSettings=function(t){return n.getDialogBox(t).then(function(n){return[{selectorControl:t,changeSpecificData:{changeType:"ganttDeltaLineSettings",content:n}}]})};return n},true);
//# sourceMappingURL=DeltaLine.js.map