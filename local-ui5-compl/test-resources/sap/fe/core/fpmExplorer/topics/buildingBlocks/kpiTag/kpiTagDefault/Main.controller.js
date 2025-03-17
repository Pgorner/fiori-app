sap.ui.define(["sap/fe/core/PageController"], function (PageController) {
	"use strict";

	return PageController.extend("sap.fe.core.fpmExplorer.kpiTagDefault.Main", {
		onKPIPressed: async function (oEvent) {
			if (!this.myFragment) {
				this.myFragment = await this.getExtensionAPI().loadFragment({
					name: "sap.fe.core.fpmExplorer.kpiTagDefault.Fragment"
				});
			}
			this.myFragment.openBy(oEvent.getSource());
			this.myFragment.setBindingContext(oEvent.getSource().getBindingContext());
		}
	});
});
