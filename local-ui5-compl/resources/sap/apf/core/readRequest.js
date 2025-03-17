/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/utils/filter","sap/apf/core/request","sap/apf/utils/exportToGlobal"],function(e,t,a){"use strict";function s(t,a,s,n){var r=t.instances.coreApi;var i=t.instances.messageHandler;this.type="readRequest";this.send=function(t,s,n){var r;var c=function(e,t){var a;var n;var r=[];if(e&&e.type&&e.type==="messageObject"){i.putMessage(e);a=e}else{r=e.data;n=e.metadata}s(r,n,a)};if(t){r=t.getInternalFilter()}else{r=new e(i)}a.sendGetInBatch(r,c,n)};this.getMetadata=function(){return r.getEntityTypeMetadata(s,n)};this.getMetadataFacade=function(){return r.getMetadataFacade(s)}}a("sap.apf.core.ReadRequest",s);return s});
//# sourceMappingURL=readRequest.js.map