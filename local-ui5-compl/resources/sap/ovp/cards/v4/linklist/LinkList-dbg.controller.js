/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define([
    "sap/ovp/cards/generic/base/linklist/BaseLinklist.controller",
    "sap/ovp/cards/OVPCardAsAPIUtils",
    "sap/ovp/cards/Filterhelper"
], function (
    BaseLinklistController,
    OVPCardAsAPIUtils,
    Filterhelper
) {
    "use strict";

    return BaseLinklistController.extend("sap.ovp.cards.v4.linklist.LinkList", {
        onInit: function () {
            //The base controller lifecycle methods are not called by default, so they have to be called
            //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
            BaseLinklistController.prototype.onInit.apply(this, arguments);
        },

        onAfterRendering: function () {
            BaseLinklistController.prototype.onAfterRendering.apply(this, arguments);
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
