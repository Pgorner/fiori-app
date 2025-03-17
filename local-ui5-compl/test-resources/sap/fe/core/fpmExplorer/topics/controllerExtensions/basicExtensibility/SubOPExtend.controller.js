sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/m/library"
	],
	function (ControllerExtension, Text, Button, MessageToast, MessageBox, JSONModel, library) {
		"use strict";

		return ControllerExtension.extend("sap.fe.core.fpmExplorer.OPExtend", {
			// this section allows to extend lifecycle hooks or override public methods of the base controller
			override: {
				onInit: function () {
					// Sample data
					let data = {
						text: "",
						formVisible: false
					};
					let dialogModel = new JSONModel(data);
					this.getView().setModel(dialogModel, "dialog");
				},
				editFlow: {
					onBeforeCreate: function (mParameters) {
						return new Promise(function (resolve, reject) {
							if (mParameters.createParameters.length === 0) {
								reject("onBeforeCreate: ID not provided");
							} else {
								mParameters.createParameters.push({ ChildTitleProperty: "Default Title" });
								mParameters.createParameters.push({ ChildDescriptionProperty: "Default values set at onBeforeCreate" });
								resolve(null);
							}
						});
					},
					onAfterCreate: function (mParameters) {
						return MessageToast.show("Create successful. ID of new Child Entity: " + mParameters.context.getObject().ID);
					}
				}
			}
		});
	}
);
