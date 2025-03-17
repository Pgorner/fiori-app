/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/DataContainer"
  ],
  function(Log, DataContainer) {
    "use strict";
    Log.info("Load DataContainer");
    /**
     * @private
     * @name sap.viz.data.description.MeasureValues
     */
    var MeasureValues = DataContainer.extend({
      /**
       * @constructor
       * @param uid    identifier of measure values, usually name
       * @param values
       */
      constructor: function(uid, values) {
        this._values = values;
      },
      getValues: function() {
        return this._values;
      }
    });
    return MeasureValues;
  }
);
