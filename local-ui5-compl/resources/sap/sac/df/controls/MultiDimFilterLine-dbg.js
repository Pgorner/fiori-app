/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/* global sap */
sap.ui.define("sap/sac/df/controls/MultiDimFilterLine", ["sap/sac/df/controls/MultiDimControlBase"], function (MultiDimControlBase) {
  /**
   * Constructor for a new <code>MultiDimFilterLine</code> control.
   *
   * @class MultiDimFilterLine A control to filter Multi-dimensional data
   * @private
   * @experimental
   * @extends sap.sac.df.controls.MultiDimControlBase
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @private
   * @alias sap.sac.df.controls.MultiDimFilterLine
   */
  var MultiDimFilterLine = MultiDimControlBase.extend(
    "sap.sac.df.controls.MultiDimFilterLine",
    /** @lends sap.sac.df.controls.MultiDimControlBase.prototype */ {
      metadata: {
        library: "sap.sac.df"
      },

      //##############-------- CONTROL LIFECYCLE METHODS -----------###############

      init: function () {
        if (MultiDimControlBase.prototype.init) {
          MultiDimControlBase.prototype.init.apply(this, arguments);
          // Set initial height for the control
          this.setHeight("3rem");
        }
      },

      renderer: MultiDimControlBase.getMetadata().getRenderer().render,

      //##############-------- HELPER METHODS -----------###############

      getPluginConfigName: function () {
        return "MultiDimFilterLine";
      }
    }
  );

  return MultiDimFilterLine;
});
