/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/core/utils/checkForTimeout","sap/apf/utils/exportToGlobal","sap/ui/model/odata/ODataUtils"],function(e,t,r){"use strict";function a(t,a,s,i,u){var n=t.instances.datajs;function c(t,r){var a=e(r);var u={};if(a){u.messageObject=a;i(u)}else{s(t,r)}}function o(t){var r=e(t);if(r){t.messageObject=r}i(t)}var f=a.serviceMetadata;var p=t.functions.getSapSystem();if(p&&!a.isSemanticObjectRequest){var q=/(\/[^\/]+)$/g;if(a.requestUri&&a.requestUri[a.requestUri.length-1]==="/"){a.requestUri=a.requestUri.substring(0,a.requestUri.length-1)}var l=a.requestUri.match(q)[0];var v=a.requestUri.split(l);var U=r.setOrigin(v[0],{force:true,alias:p});a.requestUri=U+l}n.request(a,c,o,u,undefined,f)}t("sap.apf.core.odataRequestWrapper",a);return a});
//# sourceMappingURL=odataRequest.js.map