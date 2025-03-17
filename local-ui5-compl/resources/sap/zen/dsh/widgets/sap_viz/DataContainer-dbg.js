/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/widgets/sap_viz/class"
  ],
  function(Log, Class) {
    "use strict";
    Log.info("Load DataContainer");
    var DataContainer = Class.define(
      {
        constructor: function(uid) {
          this._uId = uid;
          this._isFake = false;
          this._infos = null;
        },
        getId: function() {
          return this._uId;
        },
        fake: function(_) {
          if (!arguments.length) {
            return this._isFake;
          }
          this._isFake = _;
        },
        infos: function(_) {
          if (!arguments.length) {
            return this._infos;
          }
          this._infos = _;
          return null;
        }
      }
    );
    return DataContainer;
  }
);
