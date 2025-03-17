/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/sac/df/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(jQuery,a){"use strict";function e(a,e){if(!e){return a}var t={data:[],metadata:[]};t.metadata=a.metadata;t.metadata.fields.push({id:"Version",name:"Version",semanticType:"Dimension",type:"Dimension",dataType:"String"});n(a,e,t);return t}function n(e,n,i){var r=false;var s;a.find(e.metadata.fields,function(a,e){if(a.id===n.dimension){s=e;return true}});a.each(e.data,function(e){var d=a.clone(e);if(!r){r=a.some(e,function(a,e){return t(a,e,s,n.member)})}if(!r){d.push({v:"AC",d:"ACTUALS"})}else{d.push("FC")}i.data.push(d)})}function t(e,n,t,i){var r=a.isObject(e)?e.v:e;return n===t&&(!i||r===i)}function i(e){var n=["info/hichert_bar","info/hichert_column"];return a.indexOf(n,e)>=0}return{transformData:e,isNeeded:i}});
//# sourceMappingURL=hichert_data_factory.js.map