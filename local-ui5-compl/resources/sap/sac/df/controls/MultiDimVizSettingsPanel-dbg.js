/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/controls/MultiDimVizSettingsPanel", [
  "sap/sac/df/controls/MultiDimControlBase"
], function (MultiDimControlBase) {
  /**
   * Constructor for a new <code>MultiDimVizSettingsPanel</code> control.
   *
   * @class MultiDimVizSettingsPanel A renderer to choose the visualization of multi-dimensional data
   * @private
   * @experimental
   * @extends sap.sac.df.controls.MultiDimControlBase
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @private
   * @alias sap.sac.df.controls.MultiDimVizSettingsPanel
   */
  var MultiDimVizSettingsPanel = MultiDimControlBase.extend(
    "sap.sac.df.controls.MultiDimVizSettingsPanel",
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
        return "MultiDimVizSettingsPanel";
      },

      //##############-------- OVERRIDES -----------###############

      _applyPropertiesToPlugin: function () {
        MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
        // Add additional properties here
      }
    }
  );

  return MultiDimVizSettingsPanel;
});
