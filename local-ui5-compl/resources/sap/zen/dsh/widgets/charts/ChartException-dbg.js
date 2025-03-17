/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function(Log){
    "use strict";
    Log.info("Loaded ChartException");
    function ChartException(shortMessage, longMessage) {
      this.name = "Unexpected error";
      this.message = shortMessage;
      this.longMessage = longMessage;
    }
    ChartException.prototype = new Error();
    ChartException.prototype.constructor = ChartException;
    return ChartException;
  }
);
