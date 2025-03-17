/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../../sina/util","../../sina/AttributeType","../../core/errors","../tools/TypeConverterUtil"],function(t,e,n,r){"use strict";const o=e["AttributeType"];const i=n["UnknownAttributeTypeError"];const a=r["convertToSinaDouble"];const s=r["convertToSinaInteger"];const c=r["convertToSinaStringImageUrlImageBlob"];const u=r["convertToSinaGeoJson"];const g=r["convertToSinaDate"];const l=r["convertToSinaTime"];const f=r["convertToSinaTimestamp"];function T(t,e,n){switch(t){case o.Double:return e.toString();case o.Integer:return e.toString();case o.String:return S(e,n);case o.ImageUrl:case o.ImageBlob:return e;case o.GeoJson:return JSON.stringify(e);case o.Date:return y(e);case o.Time:return b(e);case o.Timestamp:return d(e);default:throw new i(t)}}function S(e,n){return t.convertOperator2Wildcards(e,n?.operator)}function m(t,e){switch(t){case o.Double:return a(e);case o.Integer:return s(e);case o.String:case o.ImageUrl:case o.ImageBlob:return c(t,e);case o.GeoJson:return u(t,e);case o.Date:return g(e);case o.Time:return l(e);case o.Timestamp:return f(e);default:throw new i(t)}}function p(t){if(!t){return""}else if(typeof t==="string"){return t}else if(typeof t==="boolean"||typeof t==="number"||typeof t==="bigint"){return t.toString()}else if(t instanceof Date){return t.toLocaleDateString()}else if(typeof t==="object"){return JSON.stringify(t)}else{return""}}function d(t){if(typeof t==="string"){if(t.length===0){return""}if(t==="$$now$$"){t=new Date}}const e=t.getUTCFullYear();const n=t.getUTCMonth()+1;const r=t.getUTCDate();const o=t.getUTCHours();const i=t.getUTCMinutes();const a=t.getUTCSeconds();const s=v(e.toString(),4)+"-"+v(n.toString(),2)+"-"+v(r.toString(),2)+"T"+v(o.toString(),2)+":"+v(i.toString(),2)+":"+v(a.toString(),2)+"Z";return s}function b(t){return t}function y(t){if(t.length===0){return""}return t.slice(0,4)+"-"+t.slice(5,7)+"-"+t.slice(8,10)}function v(t,e){return"00000000000000".slice(0,e-t.length)+t}var D={__esModule:true};D.sina2Odata=T;D.sina2OdataString=S;D.odata2Sina=m;D.convertValueToString=p;D.sina2OdataTimestamp=d;D.sina2OdataTime=b;D.sina2OdataDate=y;D.addLeadingZeros=v;return D})})();
//# sourceMappingURL=typeConverter.js.map