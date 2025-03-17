/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element"],function(e){"use strict";var t=e.extend("sap.gantt.skipTime.SkipInterval",{metadata:{library:"sap.gantt",properties:{startTime:{type:"string",group:"Misc",defaultValue:"000000"},endTime:{type:"string",group:"Misc",defaultValue:"235959"}}}});var i="000000";var r="0000";var a="235959";var s="2359";t.prototype._getFormattedTime=function(){var e=this.getStartTime();var t=this.getEndTime();if(e===i||e.slice(0,4)===r){e="SOD"}else{e=e.slice(0,2)+":"+e.slice(2,4)+":"+(e.slice(4,6)||"00")}if(t===a||t.slice(0,4)===s){t="EOD"}else{t=t.slice(0,2)+":"+t.slice(2,4)+":"+(t.slice(4,6)||"00")}return[e,t]};return t});
//# sourceMappingURL=SkipInterval.js.map