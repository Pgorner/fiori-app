/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global"
  ],
  function(jQuery) {
    "use strict";
    jQuery.sap.declare("sap.zen.crosstab.IDataCell");

    // Data Cell interface for callback
    sap.zen.crosstab.IDataCell = function(oDataCell) {
      this.getText = function() {
        return oDataCell.getText();
      };

      this.getId = function() {
        return oDataCell.getId();
      };

      this.getRow = function() {
        return oDataCell.getRow();
      };

      this.getCol = function() {
        return oDataCell.getCol();
      };
    };
    return sap.zen.crosstab.IDataCell;
  }
);
