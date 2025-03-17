sap.ui.define(
	[
		"sap/ui/core/mvc/ControllerExtension",
		"sap/m/Text",
		"sap/m/Button",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/m/library",
		"sap/fe/core/library"
	],
	function (ControllerExtension, Text, Button, MessageToast, MessageBox, JSONModel, library, coreLibrary) {
		"use strict";

		var ButtonType = library.ButtonType;

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
					onBeforeEdit: function (mParameters) {
						//synchronous access to property value
						if (mParameters?.context.getProperty("DialogProperty")) {
							return this.openDialog("Do you want to edit this really nice... object ?", true);
						}
					},
					onAfterEdit: function (mParameters) {
						//synchronous access to complete data the context points to
						return MessageToast.show(
							"Edit successful. Number of data entries in context: " + Object.entries(mParameters.context.getObject()).length
						);
					},
					onBeforeSave: function (mParameters) {
						//asynchronous access to several property values. Non cached values are requested from the backend
						return mParameters?.context.requestProperty(["DialogProperty", "UIHiddenProperty"]).then((result) => {
							return result[0] ? this.openDialog(result[1], true) : null;
						});
					},
					onAfterSave: function (mParameters) {
						//
						mParameters.context.refresh();
						//asynchronous access to complete data the context points to
						mParameters.context.requestObject().then((contextData) => {
							return MessageToast.show(
								"Save successful. Number of data entries in context: " + Object.entries(contextData).length
							);
						});
					},
					onBeforeDiscard: function (mParameters) {
						if (mParameters?.context.getProperty("DialogProperty")) {
							return this.openDialog("Are you sure you want to discard this draft?");
						}
					}
				}
			},
			openDialog: function (text, formVisible, fnAction) {
				return new Promise(
					function (resolve, reject) {
						let dialogModel = this.getView().getModel("dialog"),
							data = dialogModel.getData();
						data.text = text;
						data.formVisible = formVisible ? formVisible : false;
						dialogModel.setData(data);
						//use building blocks in an XML fragment using the loadFragment method from the SAP Fiori elements ExtensionAPI
						this.base
							.getExtensionAPI()
							.loadFragment({
								name: "sap.fe.core.fpmExplorer.fragment.Dialog",
								controller: this
							})
							.then(function (approveDialog) {
								//Dialog Continue button
								approveDialog.getBeginButton().attachPress(function () {
									approveDialog.close();
									if (fnAction) {
										fnAction();
									}
									resolve(null);
								});
								//Dialog Cancel button
								approveDialog.getEndButton().attachPress(function () {
									approveDialog.close().destroy();
									reject(null);
								});
								//consider dialog closing with Escape
								approveDialog.attachAfterClose(function () {
									approveDialog.destroy();
									reject(null);
								});
								approveDialog.open();
							});
					}.bind(this)
				);
			},
			onBoundPress: function (oContext) {
				var fnBoundAction = function () {
					this.base.editFlow
						.invokeAction("Service.boundAction", {
							contexts: oContext
						})
						.then(function () {
							MessageToast.show("Bound action successfully invoked");
						});
				}.bind(this);
				this.openDialog("This will call a bound action via custom invoke handler", false, fnBoundAction);
			},
			onBoundPressActionWithParameters: function (oContext) {
				var fnBoundAction = function () {
					this.base.editFlow
						.invokeAction("Service.boundActionWithParameters", {
							contexts: oContext,
							parameterValues: [
								{ name: "Parameter1", value: "Value 1" },
								{ name: "Parameter2", value: "Value 2" }
							],
							skipParameterDialog: false
						})
						.then(function () {
							MessageToast.show("Bound action with parameters successfully invoked");
						});
				}.bind(this);
				this.openDialog(
					"This will call a bound action with parameters and fill\nthe provided values into the action parameter dialog",
					false,
					fnBoundAction
				);
			},
			onBoundPressActionWithParametersSkipDialog: function (oContext) {
				var fnBoundAction = function () {
					this.base.editFlow
						.invokeAction("Service.boundActionWithParameters", {
							contexts: oContext,
							parameterValues: [
								// Remove one parameter and the dialog will not be skipped since
								// the set of parameter values needs to be complete in order to
								// skip the dialog
								{ name: "Parameter1", value: "Value 1" },
								{ name: "Parameter2", value: "Value 2" }
							],
							skipParameterDialog: true
						})
						.then(function () {
							MessageToast.show("Bound action with parameters successfully invoked");
						});
				}.bind(this);
				this.openDialog(
					"This will call a bound action with parameters and the provided values and skip the parameter dialog.\nRemove one of the parameters and the dialog will not be skipped.",
					false,
					fnBoundAction
				);
			},
			onBoundSetTitlePress: function (oContext, aSelectedContexts) {
				var fnBoundAction = function () {
					this.base.editFlow
						.invokeAction("Service.boundActionSetTitle()", {
							contexts: aSelectedContexts,
							// invocationGrouping: 'ChangeSet', // put all action calls into one change set,
							invocationGrouping: "Isolated", // put each action call into a separate change set
							label: "Set Title"
						})
						.then(function () {
							MessageToast.show("Bound action successfully invoked, titles were changed.");
						});
				}.bind(this);
				this.openDialog(
					"This will call a parametrized bound action with invocation grouping set to 'Isolated'",
					false,
					fnBoundAction
				);
			},
			onUnboundPress: function (oContext) {
				var fnUnboundAction = function () {
					this.base.editFlow
						.invokeAction("Service.EntityContainer/unboundAction", {
							model: this.base.editFlow.getView().getModel()
						})
						.then(function () {
							MessageToast.show("Unbound Action Successfully Invoked");
						})
						.catch(function () {
							MessageBox.show("The action wasn't performed because of either backend issues or the user cancelled it.", {
								icon: MessageBox.Icon.ERROR,
								title: "Unbound action call not processed"
							});
						});
				}.bind(this);
				this.openDialog("This will call an unbound action via custom invoke handler", false, fnUnboundAction);
			},
			onCreatePress: function () {
				var fnCreateAction = function () {
					var table = this.getView().byId("fe::table::_Child::LineItem::Table");
					this.base.editFlow
						.createDocument(table, {
							creationMode: coreLibrary.CreationMode.Inline,
							createAtEnd: true,
							data: {
								ChildTitleProperty: "Child Object Custom Title",
								ChildDescriptionProperty: "Child Custom Description"
							}
						})
						.then(function () {
							MessageToast.show("Custom create action successfully invoked");
						});
				}.bind(this);
				this.openDialog("This will call a custom create action via custom invoke handler", false, fnCreateAction);
			}
		});
	}
);
