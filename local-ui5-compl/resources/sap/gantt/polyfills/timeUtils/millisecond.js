/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./interval"],function(e){"use strict";var t=new Date,n=new Date;var i=e(function(e){return e},function(e,t){e.setTime(e.getTime()+Math.floor(t))},function(e){return e.getMilliseconds()});i.count=function(e,i){t.setTime(+e);n.setTime(+i);return Math.floor(n-t)};return i});
//# sourceMappingURL=millisecond.js.map