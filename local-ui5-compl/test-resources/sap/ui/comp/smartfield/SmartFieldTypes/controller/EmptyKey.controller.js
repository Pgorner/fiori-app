sap.ui.define([
	'test/sap/ui/comp/smartfield/SmartFieldTypes/controller/BaseController'
], function(BaseController) {
	"use strict";

	var oOutputArea,
		oOutputAreaHeader;

	return BaseController.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.EmptyKey", {
		onInit: function() {
			this.oDetail = this.byId("detail");
			this.oRequests = this.byId("requests");
			this.oEvents = this.byId("events");


			this.setModelAndBindings("EmptyKey");
			this.byId("masterList").setModel(this.oModel);

			oOutputArea = this.byId("outputAreaChangedData");
			oOutputAreaHeader = this.byId("currentSF");

			this.registerRequestsLogging(this.oRequests, this.oEvents);
		},

		updateCodeEditors: function(oControlEvent) {
			var oSF = oControlEvent.getSource();

			if (Object.keys(oSF.getModel().getPendingChanges()).length) {
				this.getView().getModel().submitChanges({
					success: function () {
						var sCurSFText = oSF.getTextLabel(),
							sCurSFValueBinding = oSF.getBinding("value").getValue(),
							sCurValueFormatted = oSF.getValue(),
							sSelectedTypeSet = oSF.getBindingContext().sPath.slice(1),
							oChangedData = oSF.getModel().oData[sSelectedTypeSet];

						oOutputAreaHeader.setText("Current data in selected SmartField: " + sCurSFText + " | Current value (binding): " + sCurSFValueBinding + " | Current value (formatted): " + sCurValueFormatted);
						oOutputArea.setValue(JSON.stringify(oChangedData, null, '  '));
					}
				});
			}
		}
	});
});