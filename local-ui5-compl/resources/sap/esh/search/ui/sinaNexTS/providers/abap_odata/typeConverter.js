/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/AttributeType","../../sina/util","../../core/errors"],function(t,e,n){"use strict";const r=t["AttributeType"];const s=n["NotImplementedError"];const a=n["UnknownAttributeTypeError"];function i(t,e,n={}){switch(t){case r.Double:return e.toString();case r.Integer:return e.toString();case r.String:return d(e,n);case r.ImageUrl:return e;case r.ImageBlob:throw new s;case r.GeoJson:return e;case r.Date:return p(e);case r.Time:return g(e);case r.Timestamp:return u(e);default:throw new a(t)}}function o(t,e){switch(t){case r.Double:return parseFloat(e);case r.Integer:return parseInt(e,10);case r.String:return e;case r.ImageUrl:return e;case r.ImageBlob:throw new s;case r.GeoJson:return e;case r.Date:return f(e);case r.Time:return l(e);case r.Timestamp:return c(e);default:throw new a(t)}}function c(t){if(t.length===0){return""}t=t.trim();const e=parseInt(t.slice(0,4),10);const n=parseInt(t.slice(5,7),10);const r=parseInt(t.slice(8,10),10);const s=parseInt(t.slice(11,13),10);const a=parseInt(t.slice(14,16),10);const i=parseInt(t.slice(17,19),10);const o=isNaN(parseInt(t.slice(20,20+6),10))?0:parseInt(t.slice(20,20+6),10);return new Date(Date.UTC(e,n-1,r,s,a,i,o/1e3))}function u(t){if(typeof t==="string"){if(t.length===0){return""}if(t==="$$now$$"){t=new Date}}const e=t.getUTCFullYear();const n=t.getUTCMonth()+1;const r=t.getUTCDate();const s=t.getUTCHours();const a=t.getUTCMinutes();const i=t.getUTCSeconds();const o=t.getUTCMilliseconds()*1e3;const c=m(e.toString(),4)+"-"+m(n.toString(),2)+"-"+m(r.toString(),2)+"T"+m(s.toString(),2)+":"+m(a.toString(),2)+":"+m(i.toString(),2)+"."+m(o.toString(),7)+"Z";return c}function l(t){if(t.length===0){return""}t=t.trim();return t}function g(t){if(t.length===0){return""}return t}function f(t){if(t.length===0){return""}t=t.trim();return t.slice(0,4)+"/"+t.slice(5,7)+"/"+t.slice(8,10)}function p(t){if(t.length===0){return""}return t.slice(0,4)+"-"+t.slice(5,7)+"-"+t.slice(8,10)}function d(t,n){return e.convertOperator2Wildcards(t,n.operator)}function m(t,e){return"00000000000000".slice(0,e-t.length)+t}var T={__esModule:true};T.sina2Odata=i;T.odata2Sina=o;T.odata2SinaTimestamp=c;T.sina2OdataTimestamp=u;T.odata2SinaTime=l;T.sina2OdataTime=g;T.odata2SinaDate=f;T.sina2OdataDate=p;T.sina2OdataString=d;T.addLeadingZeros=m;return T})})();
//# sourceMappingURL=typeConverter.js.map