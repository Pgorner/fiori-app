sap.ui.define(
	["sap/fe/core/fpmExplorer/common/AppComponent", "sap/ui/core/Component", "sap/ui/model/odata/v4/ODataModel"],
	function (AppComponent, Component, ODataModel) {
		"use strict";

		return AppComponent.extend("sap.fe.core.fpmExplorer.filterBarParameterized.Component", {
			metadata: {
				manifest: "json"
			}
		});
	}
);
