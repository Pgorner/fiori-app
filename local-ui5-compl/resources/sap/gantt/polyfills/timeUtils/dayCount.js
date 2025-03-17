/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var e=new Date,t=new Date;var r=1e3;var n=r*60;var s=n*60;var a=s*24;function i(r,s){e.setTime(+r);t.setTime(+s);e.setHours(0,0,0,0);t.setHours(0,0,0,0);return Math.floor((t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*n)/a)}return i});
//# sourceMappingURL=dayCount.js.map