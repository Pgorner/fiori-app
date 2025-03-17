/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/utils/ListHelper",[],function(){"use strict";function t(t){var r=[];while(t.hasNext()){r.push(t.next())}return r}function r(){this.arrayFromIter=t;this.arrayFromList=function(r){return t(r.getIterator())}}return new r});
//# sourceMappingURL=ListHelper.js.map