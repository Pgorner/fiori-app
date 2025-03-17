sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.WithSideEffects.Main", {
		onInit: function () {
			//JSON Model is only being used for edit mode
			var oViewModel = new JSONModel({
				editMode: true
			});
			this.getView().setModel(oViewModel, "view");
			this.byId("content").bindElement({
				path: "/Data('1001')"
			});
			this.oSplitApp = this.byId("app");
			oViewModel = this.getView().getModel("view");

		},
		onValidateFieldGroup : function (oEvt) {
			// Put all your logic here
			var aFieldGroups = oEvt.getParameters().fieldGroupIds,
				sCurrentFieldGroup = aFieldGroups[0],
				aFields = this.getView().getControlsByFieldGroupId(sCurrentFieldGroup),
				sAccumolatedValue = aFields[0].getValue() + " is in " + aFields[2].getValue();

			if (sCurrentFieldGroup === "FormGroup") {
				this.byId("formDescription").setValue(sAccumolatedValue);
			} else {
				this.byId("smartFormDescription").setValue(sAccumolatedValue);
			}

			MessageToast.show("onValidateFieldGroup triggered for fieldGroupIds: " + aFieldGroups.join(", "), {duration:1500, at: "center top"});
		}
	});
});
