sap.ui.define(
	["sap/fe/core/fpmExplorer/common/AppComponent", "sap/ui/core/Component", "sap/ui/model/odata/v4/ODataModel"],
	function (AppComponent, Component, ODataModel) {
		"use strict";

		var oConnectorConfiguration = [{ connector: "SessionStorageConnector" }];

		return AppComponent.extend("sap.fe.core.fpmExplorer.filterBarVMWithTable.Component", {
			metadata: {
				manifest: "json"
			}
		});
	}
);
