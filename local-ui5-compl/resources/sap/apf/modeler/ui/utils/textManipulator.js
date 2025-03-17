/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/utils/constants"],function(e){"use strict";var r={};r.addPrefixText=function(r,t){var n=[];if(r){n=r.map(function(r){return t(e.texts.NOTAVAILABLE)+": "+r})}return n};r.removePrefixText=function(e,r){var t=e.replace(r,"");return t.replace(": ","")};return r},true);
//# sourceMappingURL=textManipulator.js.map