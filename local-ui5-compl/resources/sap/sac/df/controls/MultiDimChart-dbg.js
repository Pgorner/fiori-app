/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/controls/MultiDimChart", [
  "sap/sac/df/controls/MultiDimControlBase",
  "sap/sac/df/firefly/library"
], function (MultiDimControlBase, FF) {
  /**
   * Constructor for a new <code>MultiDimChart</code> control.
   *
   * @class MultiDimChart A high chart for displaying multi-dimensional data
   * @private
   * @experimental
   * @extends sap.sac.df.controls.MultiDimControlBase
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @private
   * @alias sap.sac.df.controls.MultiDimChart
   */
  var MultiDimChart = MultiDimControlBase.extend(
    "sap.sac.df.controls.MultiDimChart",
    /** @lends sap.sac.df.controls.MultiDimControlBase.prototype */ {
      metadata: {
        library: "sap.sac.df",
        properties: {
          /**
           * Defines the relative path to the visualization of the corresponding data provider in the multidimensional model.
           **/
          metaPath: {
            type: "string"
          }
        }
      },

      //##############-------- CONTROL LIFECYCLE METHODS -----------###############

      init: function () {
        if (MultiDimControlBase.prototype.init) {
          MultiDimControlBase.prototype.init.apply(this, arguments);
        }
      },

      renderer: MultiDimControlBase.getMetadata().getRenderer().render,

      //##############-------- HELPER METHODS -----------###############

      getPluginConfigName: function () {
        return "MultiDimChart";
      },

      //##############-------- OVERRIDES -----------###############

      _applyPropertiesToPlugin: function () {
        MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
        const sVizName = this._getVisualizationName();
        if (this.oHorizonProgram && sVizName) {
          const oNotificationData = FF.XNotificationData.create();
          oNotificationData.putString(FF.AuAnalyticalChartViewPlugin.NOTIFY_DATA_VISUALIZATION_NAME, sVizName);
          this.oHorizonProgram.postLocalNotification(FF.AuAnalyticalChartViewPlugin.NOTIFICATION_VISUALIZATION_NAME_SET, oNotificationData);
        }
      }
    }
  );

  return MultiDimChart;
});
