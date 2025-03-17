/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/controls/MultiDimWidget", [
  "sap/sac/df/controls/MultiDimControlBase"
], function (MultiDimControlBase) {
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
     * @alias sap.sac.df.controls.MultiDimWidget
     */
  var MultiDimWidget = MultiDimControlBase.extend(
    "sap.sac.df.controls.MultiDimWidget",
    /** @lends sap.sac.df.controls.MultiDimControlBase.prototype */ {
      metadata: {
        library: "sap.sac.df",
        properties: {
          /**
                     * Defines the relative path to the visualization of the corresponding data provider in the multidimensional model.
                     **/
          metaPath: {
            type: "string"
          },
          /**
                     * Defines the widget id.
                     **/
          widgetId: {
            type: "string"
          }
        }
      },

      //##############-------- CONTROL LIFECYCLE METHODS -----------###############

      init: function () {
        if (MultiDimControlBase.prototype.init) {
          MultiDimControlBase.prototype.init.apply(this, arguments);
        }

        this._config = {
          "configuration": {},
          "layout": {
            "type": "SinglePlugin"
          },
          "plugins": [{
            "plugin": "AnalyticalWidget",
            "config": {
              "widgetCatalog": "/analyticalwidgets/",
              "widgetId": null
            }
          }],
          "commands": [],
          "toolbar": []
        };
      },

      onBeforeRendering: function () {
        this._config.plugins[0].config.widgetId = this.getWidgetId();
      },

      setWidgetId: function (sWidgetId) {
        if (this.getWidgetId()) {
          this.setProperty("widgetId", sWidgetId);
          if (this.oHorizonProgram) {
            this.oHorizonProgram.terminate();
            delete this.oHorizonProgram;
          }
          if (this.oHorizonRunner) {
            this.oHorizonRunner.releaseObject();
            delete this.oHorizonRunner;
          }
          this._unregisterOnDataProviderChange();
          this.oDataProvider = null;
          delete this._oPluginContainer;
          delete this._oPluginConfig;
          this.init();
          return this.onBeforeRendering();
        } else {
          this.setProperty("widgetId", sWidgetId);
        }
      },

      renderer: MultiDimControlBase.getMetadata().getRenderer().render,

      //##############-------- HELPER METHODS -----------###############

      getPluginConfigName: function () {
        return "AnalyticalWidget";
      },

      //##############-------- OVERRIDES -----------###############

      _applyPropertiesToPlugin: function () {
        MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
      }
    }
  );

  return MultiDimWidget;
});
