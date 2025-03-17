/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base","sap/ui/fl/changeHandler/condenser/Classification"],function(e,n){"use strict";return{ModelChange:{applyChange:function(e,n){return n.applyModelChange(e)},revertChange:function(e,n){return n.revertModelChange(e)},completeChangeContent:function(){},getCondenserInfo:function(e){return{affectedControl:e.getSelector(),classification:n.Update,uniqueKey:"ModelChange",updateContent:e.getContent()}}}}});
//# sourceMappingURL=_ModelChangeHandler.flexibility.js.map