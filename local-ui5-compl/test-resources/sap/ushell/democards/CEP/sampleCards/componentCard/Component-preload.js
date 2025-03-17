//@ui5-bundle sap/ushell/samplecards/componentCard/Component-preload.js
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.predefine("sap/ushell/samplecards/componentCard/Component", [
	"sap/ui/core/UIComponent",
    "sap/ushell/utils"
], function (UIComponent, Utils) {
	"use strict";

	var Component = UIComponent.extend("sap.ushell.samplecards.componentCard.Component", {
        /**
         * Initializes component card component
         * - adding a performance mark for time to interaction, TTI, after rendering of this component.
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var fnAfterRendering = function (oEvent) {
                Utils.setPerformanceMark(
                    "FLP-TTI-Homepage",
                    { bUseUniqueMark: true, bUseLastMark: true }
                );
                var oRootControl = oEvent.getSource();
                oRootControl.$().closest(".sapFCard").addClass("sapFCardTransparent").css({
                    boxShadow: "none"
                });
                oRootControl.byId("myCustomComponentFlexBox").$().css({
                    padding: "1px"
                });
            };
            this.getRootControl()
                .detachAfterRendering(fnAfterRendering)
                .attachAfterRendering(fnAfterRendering);
        },

        onCardReady: function (oCard) {
            this.oCard = oCard;
        },

        triggerCardAction: function (oParameters) {
            if (this.oCard) {
                this.oCard.triggerAction(oParameters);
            }
        }
    });


	return Component;
});
// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.predefine("sap/ushell/samplecards/componentCard/Main.controller", [
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
sap.ui.require.preload({
	"sap/ushell/samplecards/componentCard/View.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n    xmlns:ui="sap.ui.integration.widgets"\n    xmlns="sap.m"\n    width="100%"\n    displayBlock="true"\n    controllerName="sap.ushell.samplecards.componentCard.Main"><FlexBox id="myCustomComponentFlexBox"><ui:Card action=".onCardNavigation" id="listCard1"><ui:layoutData><FlexItemData minWidth="0" /></ui:layoutData></ui:Card><ui:Card action=".onCardNavigation" id="listCard2"><ui:layoutData><FlexItemData minWidth="0" styleClass="sapUiSmallMarginBegin"  /></ui:layoutData></ui:Card><ui:Card action=".onCardNavigation" id="listCard3"><ui:layoutData><FlexItemData minWidth="0" styleClass="sapUiSmallMarginBegin" /></ui:layoutData></ui:Card></FlexBox></mvc:View>\n',
	"sap/ushell/samplecards/componentCard/manifest.json":'{"_version":"1.15.0","sap.app":{"id":"sap.ushell.samplecards.componentCard","type":"card","title":"Sample of a Component Content","subTitle":"Sample of a Component Content","applicationVersion":{"version":"1.0.0"},"shortTitle":"A short title for this Card","info":"Additional information about this Card","description":"A long description for this Card","tags":{"keywords":["Component","Card","Sample"]}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://technical-object"}},"sap.ui5":{"rootView":{"viewName":"sap.ushell.samplecards.componentCard.View","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.38","libs":{"sap.m":{}}}},"sap.card":{"type":"Component","header":{"title":""}}}'
});
//# sourceMappingURL=Component-preload.js.map
