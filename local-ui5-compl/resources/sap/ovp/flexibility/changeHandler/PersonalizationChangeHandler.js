/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/CommonUtils","sap/ui/fl/changeHandler/condenser/Classification"],function(e,n){"use strict";var t={changeHandler:{applyChange:function(n,t,i){var r=e.getApp();r.appendIncomingDeltaChange(n);return},getCondenserInfo:function(e){return{affectedControl:e.getSelector(),classification:n.LastOneWins,uniqueKey:e.getSelector().id+"-"+e.getChangeType()}},completeChangeContent:function(e,n,t){return},revertChange:function(e,n,t){return}},layers:{CUSTOMER_BASE:true,CUSTOMER:true,USER:true}};return{viewSwitch:t,visibility:t,position:t,dragOrResize:t}});
//# sourceMappingURL=PersonalizationChangeHandler.js.map