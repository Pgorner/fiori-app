/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";function e(e,n,t){function r(n){var t=e(n),r=i(t,1);return n-t<r-n?t:r}function u(t){t=e(new Date(t-1));n(t,1);return t}function i(e,t){e=new Date(+e);n(e,t);return e}function f(e,r,i){var f=u(e),o=[];if(i>1){while(f<r){if(!(t(f)%i)){o.push(new Date(+f))}n(f,1)}}else{while(f<r){o.push(new Date(+f));n(f,1)}}return o}e.floor=e;e.round=r;e.ceil=u;e.offset=i;e.range=f;return e}return e},true);
//# sourceMappingURL=interval.js.map