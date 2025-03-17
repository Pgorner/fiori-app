/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/m/ProgressIndicator"],function(jQuery,t,e){"use strict";return e.extend("com.sap.ip.bi.ProgressIndicator",{initDesignStudio:function(){},renderer:{},setText:function(t){this.setDisplayValue(t)},getText:function(){return this.getDisplayValue()},setState:function(t){sap.m.ProgressIndicator.prototype.setState.call(this,sap.ui.core.ValueState[t]);this.onAfterRendering()},getState:function(){return sap.m.ProgressIndicator.prototype.getState.call(this)},setTooltip:function(t){sap.m.ProgressIndicator.prototype.setTooltip.call(this,t);this.$().attr("title",t)},getTooltip:function(){return sap.m.ProgressIndicator.prototype.getTooltip.call(this)},setPercentValue:function(t){if(t<0){t=0}else if(t>100){t=100}return sap.m.ProgressIndicator.prototype.setPercentValue.call(this,t)}})});
//# sourceMappingURL=progress.js.map