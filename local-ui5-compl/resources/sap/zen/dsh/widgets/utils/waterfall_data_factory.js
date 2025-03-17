/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/sac/df/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(jQuery,e){"use strict";function a(e,a){e.metadata.fields.push({id:"Type",name:"Type",semanticType:"Dimension",dataType:"String",type:"Dimension"});if(a.length>0){t(e,a)}return e}function n(a){var n=["info/waterfall"];return e.indexOf(n,a)>=0}function t(a,n){e.forEach(a.data,function(t){var i=e.some(n,function(n){var i=true;var s=[];e.forEach(t,function(t,u){if(e.isObject(t)){var f={};f[a.metadata.fields[u].id]=t.v;s.push(t);if(!r(n,f)){i=false}}else{s.push(t)}});s=[];return i});t.push(i?"total":"null")})}function r(a,n){var t=e.keys(n),r=t.length;if(a===null)return!r;var i=Object(a);for(var s=0;s<r;s++){var u=t[s];if(n[u]!==i[u]||!(u in i))return false}return true}return{transformData:a,isNeeded:n}});
//# sourceMappingURL=waterfall_data_factory.js.map