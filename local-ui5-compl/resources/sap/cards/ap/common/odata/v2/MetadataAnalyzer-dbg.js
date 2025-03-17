/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define([],function(){"use strict";const t=function(t,e){const n=t.getMetaModel();const o=n.getODataEntitySet(e);const r=n.getODataEntityType(o.entityType);const a=r.property||[];return a.map(t=>({type:t.type,name:t.name}))};const e=function(e,n){const o=e.getMetaModel();const r=o.getODataEntitySet(n);const a=o.getODataEntityType(r.entityType);const c=a.key.propertyRef.map(t=>t.name);const s=t(e,n);return s.filter(t=>c.includes(t.name))};var n={__esModule:true};n.getPropertyInfoFromEntity=t;n.getPropertyReference=e;return n});
//# sourceMappingURL=MetadataAnalyzer-dbg.js.map