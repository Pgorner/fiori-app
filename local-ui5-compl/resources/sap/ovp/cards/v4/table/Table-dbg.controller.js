/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define([
    "sap/ovp/cards/generic/base/table/BaseTable.controller",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/Filterhelper"
], function (
    BaseTableController,
    OVPCardAsAPIUtils,
    Filterhelper
) {
    "use strict";
    
    return BaseTableController.extend("sap.ovp.cards.v4.table.Table", {
       // bdataLoadedToEnableAddToInsight: false, Check this scenario as well
        onInit: function () {
            //The base controller lifecycle methods are not called by default, so they have to be called
            //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
            BaseTableController.prototype.onInit.apply(this, arguments);
        },
        onAfterRendering: function () {
            BaseTableController.prototype.onAfterRendering.apply(this, arguments);
            if (!OVPCardAsAPIUtils.checkIfAPIIsUsed(this)) {
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var cardmanifestModel = this.getOwnerComponent().getModel("ui").getData().cards;

                this.selectionVaraintFilter = Filterhelper.getSelectionVariantFilters(
                    cardmanifestModel,
                    oCardPropertiesModel,
                    this.getEntityType()
                );
            }
        }
    });
});
