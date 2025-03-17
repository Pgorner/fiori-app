sap.ui.define(
	["sap/ui/core/mvc/ControllerExtension", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
	function (ControllerExtension, JSONModel, MessageToast) {
		"use strict";

		return ControllerExtension.extend("sap.fe.core.fpmExplorer.OPExtend", {
			// this section allows to extend lifecycle hooks or override public methods of the base controller
			override: {
				onInit: function () {
					this.getView().setModel(new JSONModel({ stateValue: "" }), "state");
				},
				viewState: {
					applyInitialStateOnly: function () {
						return false;
					},
					adaptControlStateHandler: function (controlToAdapt, adaptHandlers) {
						if (controlToAdapt.isA("sap.m.Input")) {
							adaptHandlers.push({
								retrieve: function (control) {
									return {
										stateValue: control.getValue()
									};
								},
								apply: function (control, currentState, n) {
									if (currentState) {
										this.base.getView().getModel("state").setProperty("/stateValue", currentState.stateValue);
									}
								}
							});
						}
					},
					adaptStateControls: function (aControls) {
						aControls.push(this.getView().byId("fe::CustomSubSection::myCustomSection--myCustomInput"));
					},
					retrieveAdditionalStates: function (mAdditionalStates) {
						mAdditionalStates.lastVisit = new Date().toString();
					},
					applyAdditionalStates: function (mAdditionalStates) {
						if (mAdditionalStates && mAdditionalStates.lastVisit) {
							MessageToast.show("Applying view state from " + mAdditionalStates.lastVisit);
						}
					}
				}
			},
			onSaveToAppState: function () {
				this.base.getExtensionAPI().updateAppState();
			},
			onRefresh: function () {
				window.location.reload();
			}
		});
	}
);
