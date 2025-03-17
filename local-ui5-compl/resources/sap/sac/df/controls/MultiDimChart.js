/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
sap.ui.define("sap/sac/df/controls/MultiDimChart",["sap/sac/df/controls/MultiDimControlBase","sap/sac/df/firefly/library"],function(t,i){var a=t.extend("sap.sac.df.controls.MultiDimChart",{metadata:{library:"sap.sac.df",properties:{metaPath:{type:"string"}}},init:function(){if(t.prototype.init){t.prototype.init.apply(this,arguments)}},renderer:t.getMetadata().getRenderer().render,getPluginConfigName:function(){return"MultiDimChart"},_applyPropertiesToPlugin:function(){t.prototype._applyPropertiesToPlugin.apply(this);const a=this._getVisualizationName();if(this.oHorizonProgram&&a){const t=i.XNotificationData.create();t.putString(i.AuAnalyticalChartViewPlugin.NOTIFY_DATA_VISUALIZATION_NAME,a);this.oHorizonProgram.postLocalNotification(i.AuAnalyticalChartViewPlugin.NOTIFICATION_VISUALIZATION_NAME_SET,t)}}});return a});
//# sourceMappingURL=MultiDimChart.js.map