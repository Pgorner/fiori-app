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
    jQuery.sap.declare("sap.zen.crosstab.IHeaderCell");
    // Header Cell interface for callback
    sap.zen.crosstab.IHeaderCell = function(oHeaderCell) {
      this.getText = function() {
        return oHeaderCell.getText();
      };
      this.getId = function() {
        return oHeaderCell.getId();
      };
      this.getRow = function() {
        return oHeaderCell.getRow();
      };
      this.getCol = function() {
        return oHeaderCell.getCol();
      };
    };
    return sap.zen.crosstab.IHeaderCell;
  }
);
