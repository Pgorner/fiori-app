/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/StylingPanel", [
  "sap/sac/df/controls/MultiDimControlBase"
], function (MultiDimControlBase) {
  /**
     * Constructor for a new <code>StylingPanel</code> control.
     *
     * @class StylingPanel A panel control to format the data being displayed.
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.132.0
     *
     * @constructor
     * @public
     * @alias sap.sac.df.StylingPanel
     */
  var StylingPanel = MultiDimControlBase.extend("sap.sac.df.StylingPanel", /** @lends sap.sac.df.controls.MultiDimControlBase.prototype */ {
    metadata: {
      library: "sap.sac.df",
      properties: {
        /**
                 * Defines the relative path to the data provider in the multidimensional model.
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
      return "StylingPanel";
    },

    //##############-------- PROPERTY METHODS -----------###############

    //##############-------- OVERRIDES -----------###############
    _applyPropertiesToPlugin: function () {
      MultiDimControlBase.prototype._applyPropertiesToPlugin.apply(this);
    }
  });

  return StylingPanel;
});
