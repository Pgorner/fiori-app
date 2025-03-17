/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/dsh/utils/BaseHandler"
  ],
  function() {
    "use strict";
    function InfoChartException(key, context) {
      // Just a guard incase someone forgets the 'new' keyword
      if ( !(this instanceof InfoChartException) ) {
        return new InfoChartException(key, context);
      }
      this.message = key;
      this.context = context;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      return null;
    }

    InfoChartException.prototype = new Error();
    InfoChartException.prototype.constructor = InfoChartException;
    InfoChartException.prototype.name = "InfoChartException";

    return InfoChartException;
  }
);
