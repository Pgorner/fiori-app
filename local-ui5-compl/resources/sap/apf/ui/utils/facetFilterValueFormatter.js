/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/ui/utils/formatter","sap/apf/utils/exportToGlobal"],function(t,e){"use strict";function a(e,a){"use strict";this.getFormattedFFData=function(i,n,r){var u,o;var l=new t({getEventCallback:e.getEventCallback.bind(e),getTextNotHtmlEncoded:a.getTextNotHtmlEncoded,getExits:e.getCustomFormatExit()},r,i);var f=r.text;i.forEach(function(t){u=l.getFormattedValue(n,t[n]);o=u;if(f!==undefined&&t[f]!==undefined){o=u+" - "+t[f]}t.formattedValue=o});return i}}e("sap.apf.ui.utils.FacetFilterValueFormatter",a);return a});
//# sourceMappingURL=facetFilterValueFormatter.js.map