/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/controls/MultiDimWidgetDesigner", [
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
     * @alias sap.sac.df.controls.MultiDimWidgetDesigner
     */
  var MultiDimWidgetDesigner = MultiDimControlBase.extend(
    "sap.sac.df.controls.MultiDimWidgetDesigner",
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
            "plugin": "AnalyticalWidgetDesignerDocument",
            "config": {
              "systemName": null,
              "widgetCatalog": "/analyticalwidgets/",
              "widgetId": null,
              "previewUrl": null,
              "sdkUrl": null,
              "bootstrapConfigUrl": null
            }
          }],
          "commands": [{
            "plugin": "DataProviderCommand",
            "config": {}
          }],
          "toolbar": []
        };
      },

      onBeforeRendering: function () {
        this._config.plugins[0].config.widgetId = this.getWidgetId();
        if (this._getMultiDimModel()?._SystemSettings?.masterSystem) {
          this._config.plugins[0].config.systemName = this._getMultiDimModel()?._SystemSettings?.masterSystem;
        }
      },

      renderer: MultiDimControlBase.getMetadata().getRenderer().render,

      //##############-------- HELPER METHODS -----------###############

      getPluginConfigName: function () {
        return "AnalyticalWidgetDesignerDocument";
      },

      //##############-------- OVERRIDES -----------###############

      _applyPropertiesToPlugin: function () {
        MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
      }
    }
  );

  return MultiDimWidgetDesigner;
});
