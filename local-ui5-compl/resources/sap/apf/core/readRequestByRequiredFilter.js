/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/request","sap/apf/utils/exportToGlobal"],function(e,t){"use strict";var r=function(e,t,r,a){var i=e.instances.coreApi;var n=e.instances.messageHandler;this.type="readRequestByRequiredFilter";this.send=function(e,s,u){var d;var o;var c=function(e,t){var r;var a;var i=[];if(e&&e.type&&e.type==="messageObject"){n.putMessage(e);r=e}else{i=e.data;a=e.metadata}s(i,a,r)};i.getMetadata(r).done(function(r){var n=r.getParameterEntitySetKeyProperties(a);var s="";var p=r.getEntityTypeAnnotations(a);if(p.requiresFilter!==undefined&&p.requiresFilter==="true"){if(p.requiredProperties!==undefined){s=p.requiredProperties}}var f=s.split(",");n.forEach(function(e){f.push(e.name)});i.getCumulativeFilter().done(function(r){o=r.restrictToProperties(f);if(e){d=e.getInternalFilter();d.addAnd(o)}else{d=o}t.sendGetInBatch(d,c,u)})})};this.getMetadataFacade=function(){return i.getMetadataFacade(r)}};t("sap.apf.core.readRequestByRequiredFilter",r);return r},true);
//# sourceMappingURL=readRequestByRequiredFilter.js.map