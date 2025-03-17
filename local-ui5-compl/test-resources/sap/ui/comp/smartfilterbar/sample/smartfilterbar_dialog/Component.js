sap.ui.define([
	'sap/ui/core/UIComponent', "sap/ui/model/json/JSONModel", "sap/ui/fl/write/api/FeaturesAPI","sap/ui/fl/Utils"
], function(UIComponent, JSONModel, FeaturesAPI, FlexUtils) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar_dialog.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {

			// app specific setup
			this._adaptButtonConfiguration();

			var data = {
					readonly: false,
					mandatory: false,
					visible: true,
					enabled: true
				};

				var oStateModel = new JSONModel();
				oStateModel.setData(data);
				this.setModel(oStateModel, "state");

			UIComponent.prototype.init.apply(this, arguments);
		},
		_adaptButtonConfiguration: function() {
			var oAppModel = new JSONModel({
				showAdaptButton: false
			});
			this.setModel(oAppModel, "app");

			if (!FlexUtils.getUshellContainer()) {
				FeaturesAPI.isKeyUser()
					.then(function (bIsKeyUser) {
						oAppModel.setProperty("/showAdaptButton", bIsKeyUser);
					});
			}
		}
	});

});
