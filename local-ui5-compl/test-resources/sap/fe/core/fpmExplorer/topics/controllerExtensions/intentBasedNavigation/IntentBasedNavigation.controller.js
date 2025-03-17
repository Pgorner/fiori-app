sap.ui.define(
	["sap/fe/core/PageController", "sap/fe/core/controllerextensions/IntentBasedNavigation"],
	function (PageController, IntentBasedNavigation) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.IntentBasedNavigation", {
			intentBasedNavigation: IntentBasedNavigation.override({
				adaptNavigationContext: function (oSelectionVariant, oTargetInfo) {
					oSelectionVariant.addSelectOption("Status", "I", "EQ", "Completed");
				}
			}),
			navigateExternal: function () {
				var sNavigationParameters = this.getView().byId("navParameters").getValue();
				var oNavigationParameters = sNavigationParameters ? JSON.parse(sNavigationParameters) : undefined;
				this.getExtensionAPI().intentBasedNavigation.navigateOutbound("showParameters", oNavigationParameters);
			}
		});
	}
);
