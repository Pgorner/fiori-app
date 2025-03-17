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
    jQuery.sap.declare("sap.zen.crosstab.rendering.DomElementProvider");
    sap.zen.crosstab.rendering.DomElementProvider = function () {
      var oDomElements = {};
      this.addElement = function (sId, oDomElement) {
        oDomElements[sId] = oDomElement;
      };
      this.getElement = function (sId) {
        return oDomElements[sId];
      };
    };
    return sap.zen.crosstab.rendering.DomElementProvider;
  }
);
