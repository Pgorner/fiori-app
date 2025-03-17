/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
sap.ui.define(["sap/ui/model/odata/type/Time"],function(e){"use strict";var t=function(){};t.prototype.constructor=t;t.prototype.getFormattedValue=function(t,r){var n=r;if(r.__edmType!=undefined&&r.__edmType==="Edm.Time"){var o=new e;n=o.formatValue(r,"string")}return n};return t},true);
//# sourceMappingURL=timeFormatter.js.map