/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/objectUtils",
    "sap/zen/dsh/widgets/sap_viz/DataContainer"
  ],
  function(Log, ObjUtils, DataContainer) {
    "use strict";
    Log.info("Load DimensionLabels");
    var DimensionLabels = DataContainer.extend({
      /**
       * @name sap.viz.data.description.DimensionLabels
       * @param   uid    identifier of dimension labels, usually name
       */
      constructor: function(uid, type, values) {
        this._type = type;
        this._values = values;
      },
      getValues: function() {
        return this._values;
      },
      getType: function() {
        return this._type;
      }
    });
    return DimensionLabels;
  }
);
