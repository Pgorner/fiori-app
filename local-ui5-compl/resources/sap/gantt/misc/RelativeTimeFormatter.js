/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/base/util/ObjectPath"],function(t){"use strict";var e=function(e,i,s){this.oBaseTime=e;this.sUnit=i;this.sPrefix=s;this.iIntervalMillisecond=t.get(i).offset(e,1).getTime()-e.getTime()};e.prototype.format=function(t){var e;var i=Math.floor((t.getTime()-this.oBaseTime.getTime())/this.iIntervalMillisecond)+1;e=this.sPrefix+" "+i;return e};return e},true);
//# sourceMappingURL=RelativeTimeFormatter.js.map