sap.ui.define(["sap/ui/model/json/JSONModel"],
	function (JSONModel) {
		"use strict";

		var oManifestModel = new JSONModel();

		return {
			loadManifestData: function () {
				return oManifestModel.loadData("test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/manifest.json");
			},
			getManifestModel: function () {
				return oManifestModel;
			}
		};
	}
);