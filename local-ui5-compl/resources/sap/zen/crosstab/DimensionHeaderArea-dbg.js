/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/zen/crosstab/BaseArea",
    "sap/zen/crosstab/rendering/RenderingConstants"
  ],
  function(jQuery,BaseArea, RenderingConstants){
    "use strict";
    jQuery.sap.declare("sap.zen.crosstab.DimensionHeaderArea");
    sap.zen.crosstab.DimensionHeaderArea = function (oCrosstab) {
      BaseArea.call(this, oCrosstab);
      this.sAreaType = RenderingConstants.TYPE_DIMENSION_HEADER_AREA;
    };
    sap.zen.crosstab.DimensionHeaderArea.prototype = jQuery.sap.newObject(BaseArea.prototype);
    sap.zen.crosstab.DimensionHeaderArea.prototype.renderArea = function (oRenderManager) {
      var sClasses = "sapzencrosstab-DimensionHeaderArea";
      if (this.oCrosstab.getPropertyBag().isMobileMode()) {
        sClasses += " sapzencrosstab-MobileHeaderSeparator";
      }
      this.renderContainerStructure(oRenderManager, sClasses, false, false);
    };
    sap.zen.crosstab.DimensionHeaderArea.prototype.getPageManager = function () {
      // runtime contract: dim header will always be completely on the first page.
      // Hence, we don't need a page manager.
      return null;
    };
    return sap.zen.crosstab.DimensionHeaderArea;
  }
);
