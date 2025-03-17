// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/utils"
], function (UIComponent, utils) {
	"use strict";

	var Component = UIComponent.extend("sap.ushell.samplecards.imageCard.Component", {

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var fnAfterRendering = function (oEvent) {
                var oRootControl = oEvent.getSource();
                oRootControl.$().closest(".sapFCard").addClass("sapFCardTransparent").css({
                    boxShadow: "none"
                });

                utils.setPerformanceMark("FLP -- samplecards.imageCard after rendering");
            };
            this.getRootControl()
                .detachAfterRendering(fnAfterRendering)
                .attachAfterRendering(fnAfterRendering);
        }
    });


	return Component;
});
