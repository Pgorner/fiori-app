/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define([],function(){"use strict";const e=function(e,t){const c=e.getMetaModel();const o=c.getObject(`/${t}`);const s=o.$Type;const r=c.getObject(`/${s}`);const a=n(r);return a.map(e=>({type:e.type,name:e.name}))};const t=function(t,n){const c=t.getMetaModel().getObject("/");const o=c[n];const s=o?.$Type;const r=t.getMetaModel().getObject("/"+s)?.$Key;const a=e(t,n);return a.filter(e=>r.includes(e.name))};const n=function(e){return Object.keys(e).filter(t=>t!=="SAP__Messages"&&typeof e[t]==="object"&&e[t].$kind==="Property").map(t=>({name:t,type:e[t].$Type}))};function c(e,t){return e.getObject(`/${t}/@com.sap.vocabularies.Common.v1.SemanticKey`)||[]}var o={__esModule:true};o.getPropertyInfoFromEntity=e;o.getPropertyReferenceKey=t;o.getSemanticKeys=c;return o});
//# sourceMappingURL=MetadataAnalyzer-dbg.js.map