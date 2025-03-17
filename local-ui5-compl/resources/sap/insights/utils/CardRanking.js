/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BatchHelper"],function(r){"use strict";function n(r,n){if(!r){r="!"}if(!n){n="~"}return String.fromCharCode(Math.floor((r.charCodeAt(0)+n.charCodeAt(0))/2))}function e(r,e){if(!r){r="!"}if(!e){e="~"}if(r>=e){throw new Error("Second Argument should be greater than the first one")}var t="";var a=r.length>e.length?r.length:e.length;for(var o=0;o<a;o++){t+=n(r[o],e[o])}if(t===r){return t+"0"}else if(t>=e){throw new Error("No Mid possible between "+r+" and "+e)}return t}function t(r){var n=r.length;var e=0;for(var t=0;t<n;t++){e+=r.charCodeAt(t)*Math.pow(10,n-t-1)}return e}function a(r,n){return Math.abs(t(r)-t(n))}function o(r,n,t){var i=[];var f=a(r[n-1].rank,r[n].rank);var u=a(r[t].rank,r[t+1].rank);var h,c,d;if(f>u){h=n-1;d=c=n}else{d=h=t;c=t+1}try{r[d].rank=e(r[h].rank,r[c].rank)}catch(n){i=i.concat(o(r,h,c));r[d].rank=e(r[h].rank,r[c].rank)}i.push(r[d]);return i}function i(r,n,t){var a=[],i=r[n],f=t-1,u=t,h=r[f],c=r[u],d=h?h.rank:undefined,k=c?c.rank:undefined;try{i.rank=e(d,k)}catch(n){a=a.concat(o(r,f,u));i.rank=e(d,k)}a.push(i);return a}return{reorder:i}});
//# sourceMappingURL=CardRanking.js.map