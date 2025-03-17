/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";sap.ui.define([],function(){"use strict";const t=function(t,n){if(t.startsWith("{{")&&t.endsWith("}}")){const e=t.slice(2,-2);return n.getText(e)||e}return t};const n=function(n,e){n.forEach(function(n){const{title:i}=n;n.title=t(i,e);n.items.forEach(function(n){const{label:i,value:s}=n;n.label=t(i,e);n.value=t(s,e)})})};const e=function(e,i){const{"sap.app":s,"sap.card":o}=e;const{title:c,subTitle:u}=s;const{header:r}=o;const{title:l,subTitle:a,mainIndicator:f}=r;const b=o.content.groups;s.title=t(c,i);s.subTitle=u.includes(" | ")?u.split(" | ").map((n,e)=>e===0?t(n,i):n).join(" | "):t(u,i);r.title=t(l,i);r.subTitle=t(a,i);if(f){const{unit:n,number:e}=f;if(n){f.unit=t(n,i)}if(e){f.number=t(e,i)}}n(b,i);return e};var i={__esModule:true};i.resolvei18nTextsForIntegrationCard=e;return i});
//# sourceMappingURL=I18nHelper.js.map