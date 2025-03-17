// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ushell.samplecards.componentCard.Main", {
        onInit: function () {
            this.getView().byId("listCard1").setManifest(sap.ui.require.toUrl("sap/ushell/samplecards/componentCard/listCard.json"));
            this.getView().byId("listCard2").setManifest(sap.ui.require.toUrl("sap/ushell/samplecards/componentCard/listCard.json"));
            this.getView().byId("listCard3").setManifest(sap.ui.require.toUrl("sap/ushell/samplecards/componentCard/listCard.json"));
        },
        onCardNavigation: function (oEvent) {
            this.getOwnerComponent().triggerCardAction(oEvent.getParameters());
        }
	});
});
