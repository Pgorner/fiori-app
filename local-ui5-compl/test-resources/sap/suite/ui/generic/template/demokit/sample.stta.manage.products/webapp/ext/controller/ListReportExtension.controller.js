sap.ui.define("STTA_MP.ext.controller.ListReportExtension", [
	"sap/ui/model/Filter",
	"sap/m/Input",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/core/message/Message",
	"sap/ui/core/message/MessageType",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/ui/layout/form/SimpleForm",
	"sap/ui/model/json/JSONModel"
], function(Filter, Input, Dialog, Button, Message, MessageType, Text, MessageBox, SmartField, SmartLabel, SimpleForm, JSONModel) {
	"use strict";

	return {
		onInit: function() {
			// Recommended way to access extension filter values is via a model.
			// Initial values set here also become part of standard variant.
			var oMyModel = new JSONModel({
				customPriceFilterKey: "",
				customWeightFilterKey: ""
			});
			this.getView().setModel(oMyModel, "STTA_MP"); // using app id as namespace to avoid clashes
		},
		onInitSmartFilterBarExtension: function() {
			// Extension is not needed, if recommended way to access extension filter values (via model) is used.
			
			// If recommended way is not used, initial values set in onInit would not be taken over from SmartFilterBar for standard variant, thus this would be the point in time to
			// set them.
			
			// In the past (before introduction of manifest setting filterSettings.dateSettings), another typical use case was setting initial values for standard (annotated as 
			// SelectionFields) filters for semantic date range fields (as here default value cannot be set via Common.FilterDefaultValue annotation).
		},	
		onListNavigationExtension: function(oEvent) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oObject = oBindingContext.getObject();
	
			// for  laser printers  we trigger external navigation for all others we use internal navigation
			if (oObject.ProductCategory === "Laser Printers") {
				oNavigationController.navigateExternal("EPMProductManage");
				//oNavigationController.navigateExternal("EPMSalesOrderDisplayBuPa");
			} else {
				// return false to trigger the default internal navigation
				return false;
			}
			// return true is necessary to prevent further default navigation
			return true;
		},	
		adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {
			if (oObjectInfo.semanticObject === "EPMProduct") {
				oSelectionVariant.removeParameter("DraftUUID");
			} else if (oObjectInfo.semanticObject === "EPMManageProduct") {
				oSelectionVariant.removeParameter("Price");
			}
		},	
		onBeforeRebindTableExtension: function(oEvent) {
			// usually the value of the custom field should have an
			// effect on the selected data in the table. So this is
			// the place to add a binding parameter depending on the
			// value in the custom field.
			var oBindingParams = oEvent.getParameter("bindingParams");
	
			// If recommended way to access extension filter values (via model) is not used, filter values need to be retrieved from control
			var oMyModel = this.getView().getModel("STTA_MP");

			switch (oMyModel.getProperty("/customPriceFilterKey")) {
				case "0" :
					oBindingParams.filters.push(new Filter("Price", "LE", "100"));
					break;
				case "1" :
					oBindingParams.filters.push(new Filter("Price", "BT", "100", "500"));
					break;
				case "2" :
					oBindingParams.filters.push(new Filter("Price", "BT", "500", "1000"));
					break;
				case "3" :
					oBindingParams.filters.push(new Filter("Price", "GT", "1000"));
					break;
				default :
					break;
			}
			switch (oMyModel.getProperty("/customWeightFilterKey")) {
				case "0" :
					oBindingParams.filters.push(new Filter("Weight", "LE", "1"));
					break;
				case "1" :
					oBindingParams.filters.push(new Filter("Weight", "BT", "1", "2"));
					break;
				case "2" :
					oBindingParams.filters.push(new Filter("Weight", "BT", "2", "3"));
					break;
				case "3" :
					oBindingParams.filters.push(new Filter("Weight", "GT", "3"));
					break;
				default :
					break;
			}
		},
		onCustomFilterChange: function(){
			// Note:
			// - cannot be passed directly (when extension in constructed, "this" would be the window object, not the controller)
			// - For the use case in this demo app, the call could be omitted, as SFB attaches to events of "known" controls (including comboBox) and fires filterChange when their 
			//   value changes. However, if an extension uses a control that the SFB is not aware of, the change would be missed, thus in this example the call is added for 
			//   reference and as it is the cleaner concept anyway.
			this.extensionAPI.onCustomAppStateChange();

			// If recommended way to access extension filter values (via model) is not used, customData "hasValue" needs to be set correctly: SmartFilterBar cannot know, whether to 
			// include the custom filter in the "adapt filters" count. The API of SmartFilterBar requires this information to be passed as boolean value in customData "hasValue".
			// Typically, there is one value ("all", often the default, but this is not a must), for which the filter should not be counted. The recommend way is to build this via
			// an expression binding using the model to access extension filter values, e.g.: 
			// <customData><core:CustomData key="hasValue" value="{= ${extension>/customPriceFilterKey} !== ''}"/></customData>
		},
		getCustomAppStateDataExtension: function(oCustomData) {
			// Store values of the custom filter field in app state, so that it can be restored later again. The developer has to ensure, that the content of the field is stored in
			// the object that passed to this method.

			// If recommended way to access extension filter values (via model) is not used, filter values need to be retrieved from control(s)
			var oMyModel = this.getView().getModel("STTA_MP");
			
			oCustomData.CustomPriceFilter = oMyModel.getProperty("/customPriceFilterKey");
			oCustomData.sTShirtSizeFilter = oMyModel.getProperty("/customWeightFilterKey");
		},	
		restoreCustomAppStateDataExtension: function(oCustomData) {
			// Restore values of the custom filter fields according to the object passed here. 
			// Ensure to handle missing properties correctly (app states from old bookmarks, where extension was not or not completely implemented, or app state that could not be
			// retrieved anymore)
			
			// If recommended way to access extension filter values (via model) is not used, values need to be set directly to control(s). Additionally, customData "hasValue" needs
			// to be set correctly (see comment in onCustomFilterChange)
			var oMyModel = this.getView().getModel("STTA_MP");
			
			// If no value is provided in state, set default value (like in onInit)
			oMyModel.setProperty("/customPriceFilterKey", oCustomData.CustomPriceFilter || "")
			oMyModel.setProperty("/customWeightFilterKey", oCustomData.sTShirtSizeFilter || "")
		},	
		// PoC: Create with parameters
		onCreateWithParameters: function(oEvent) {	
			var that = this;	
			var oInputField = new Input();	
			var oParameterDialog = new Dialog({
				title: "Create new product from existing product...",
				content: [oInputField],
				beginButton: new Button({
					text: "OK",
					press: function() {
						var mParameters = {
							"Product": oInputField.getValue(),
							"DraftUUID": "00000000-0000-0000-0000-000000000000",
							"IsActiveEntity": true
						};
						that.triggerAction(mParameters);
						oParameterDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						oParameterDialog.close();
					}
				}),
				afterClose: function() {
					oParameterDialog.destroy();
				}
			});
	
			oParameterDialog.open();
		},	
		triggerAction: function(mParams) {
			var oApi = this.extensionAPI;
			var oNavController = oApi.getNavigationController();
	
			var oPromise = oApi.invokeActions("STTA_PROD_MAN/STTA_C_MP_ProductCopy", [], mParams);	
			oPromise.then(function(aResponse) {
				if (aResponse[0] && aResponse[0].response) {
					var oResponseContext = aResponse[0].response.context;
					if (oResponseContext) {
						oNavController.navigateInternal(oResponseContext);
					}
				}
			}).catch(function(aErr) {
				if (aErr[0] && aErr[0].error && aErr[0].error.response) {
					MessageBox.error(aErr[0].error.response.message, {});
				}
			});
		},	
		// extensions for custom action breakout scenario
		//
		// SCENARIO 1: custom action without function import
		//
		// IMPORTANT:
		// Note that this example implementation is only a preliminary PoC until there is an official Smart Templates API.
		// Therefore, the functions currently used in the example implementation are not to be used in productive coding.
		//
		onChangePrice: function(oEvent) {
			var oMessageManager = sap.ui.getCore().getMessageManager();
			var oTable = oEvent.getSource().getParent().getTable();
			var oExtensionAPI = this.extensionAPI;
			var oModel = this.getView().getModel();
			var aContext = oExtensionAPI.getSelectedContexts(oTable);
			var oPreconditionPromise = oExtensionAPI.securedExecution(function() {
				return new Promise(function(fnResolve, fnReject) {
					var sMessage = "";
					if (aContext.length !== 1) {
						sMessage = "Please select exactly one  item";
					}
					if (sMessage) {
						var oMessage = new Message({
							message: sMessage,
							processor: oModel,
							persistent: true,
							type: MessageType.Error,
							target: ""
						});
						oMessageManager.addMessages(oMessage);
						fnReject();
					} else {
						fnResolve();
					}
				});
			});
			oPreconditionPromise.then(this._showChangePricePopup.bind(this, aContext[0]));
		},	
		_showChangePricePopup: function(oContext) {
			var oModel = this.getView().getModel();	
			var oField = new Input();
	
			var oParameterDialog = new Dialog({
				title: "Change Price",
				content: [
					new Text({
						text: "New Price "
					}), oField
				],
				beginButton: new Button({
					text: "OK",
					press: function() {
						var sInput = oField.getValue();
						var oExtensionAPI = this.extensionAPI;
						oParameterDialog.close();
						// mParameters has optional property actionLabel which app developer can specify if wants the title of the message pop-up same as the action which was executed.
						var mParameters = {
							"sActionLabel": "Custom Text"
						};
						oExtensionAPI.securedExecution(function() {
							var oBackendExecution = this._executePriceChange(sInput, oContext);
							return new Promise(function(fnResolve, fnReject) {
								oBackendExecution.then(function() {
									var oMessage = new Message({
										message: "Price set to " + sInput,
										processor: oModel,
										persistent: true,
										type: MessageType.Success,
										target: oContext.getPath()
									});
									var oMessageManager = sap.ui.getCore().getMessageManager();
									oMessageManager.addMessages(oMessage);
									fnResolve();
								}, fnReject);
							});
						}.bind(this), mParameters);
					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						oParameterDialog.close();
					}
				}),
				afterClose: function() {
					oParameterDialog.destroy();
				}
			});
			oParameterDialog.open();
		},	
		// This function simulates a function that performs a backend call lasting 2.5 seconds.
		// The function returns a Promise that is resolved/rejected when the backend call succeedss/fails
		// Thereby the backend call fails, when the new price is identical to the current price. In this case we simulate that the backend calls fails
		// with an error message and that UI5 puts this error message into the MessageModel automatically.
		_executePriceChange: function(sNewPrice, oContext) {
			var oModel = this.getView().getModel();
			return new Promise(function(fnResolve, fnReject) {
				var oMessage;
				var oMessageManager = sap.ui.getCore().getMessageManager();
				if (oContext.getObject().Price === sNewPrice) {
					oMessage = new Message({
						message: "Price must be changed",
						processor: oModel,
						persistent: true,
						type: MessageType.Error,
						target: oContext.getPath()
					});
					oMessageManager.addMessages(oMessage);
					fnReject();
				} else {
					if (!sNewPrice) {
						oMessage = new Message({
							message: "Price reset",
							processor: oModel,
							persistent: true,
							type: MessageType.Success,
							target: oContext.getPath()
						});
						oMessageManager.addMessages(oMessage);
					}
					fnResolve();
				}
			});
		},	
		//
		// SCENARIO 2: custom action on function import
		//
		// IMPORTANT:
		// Note that this example implementation is only a preliminary PoC until there is an official Smart Templates API.
		// Therefore, the functions currently used in the example implementation are not to be used in productive coding.
		//
		onCopyWithNewSupplier: function(oEvent) {
			var that = this;
			var oModel = this.getView().getModel();
	
			var oTable = oEvent.getSource().getParent().getParent().getParent().getTable();
			var aContext = this.extensionAPI.getSelectedContexts(oTable);
			if (aContext.length > 1) {
				MessageBox.error("Multi selection is currently not supported", {});
			} else {
				if (aContext.length === 0) {
					MessageBox.error("Please select an item", {});
				} else {
					var oContext = aContext[0];
					var oSelectedObject = oContext.getObject();
	
					var oForm = new SimpleForm({
						editable: true
					});
	
					var sParameterLabel = "Supplier";
					var sBinding = "{Supplier}";
	//				var sEdmType = 'Edm.String';
	
					var oField = new SmartField({
						value: sBinding
					});
					var sLabel = new SmartLabel();
	
					sLabel.setText(sParameterLabel);
					sLabel.setLabelFor(oField);
	
					oForm.addContent(sLabel);
					oForm.addContent(oField);
	
					var oParameterDialog = new Dialog({
						title: "Copy with new Supplier",
						content: [oForm],
						beginButton: new Button({
							text: "OK",
							press: function() {
								try {
									var mParameters = {
										urlParameters: {
											"ProductDraftUUID": oSelectedObject.ProductDraftUUID,
											"ActiveProduct": oSelectedObject.ActiveProduct,
											"Supplier": oField.getValue()
										}
									};
									that.getTransactionController().invokeAction("STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopywithparams", oContext, mParameters).then(function(oResponse) {
										that.refreshView();
										that.handleSuccess(oResponse);
									}, function(oError) {
										that.handleError(oError, {
											context: oContext
										});
									});
								} catch (ex) {
									// ToDo: remove message and close() as soon as the TransactionController is available for ListReport
									MessageBox.error("TransactionController for ListReport currently not supported - action cannot be completed", {});
									oParameterDialog.close();
									that.handleError(ex, {
										context: oContext
									});
								}
								that.getTransactionController().resetChanges();
								oParameterDialog.close();
							}
						}),
						endButton: new Button({
							text: "Cancel",
							press: function() {
								// ToDo: activate resetChanges as soon as the TransactionController is available for ListReport
								//that.getTransactionController().resetChanges();
								oParameterDialog.close();
							}
						}),
						afterClose: function() {
							oParameterDialog.destroy();
						}
					});
	
					oParameterDialog.setModel(oModel);
					oParameterDialog.setBindingContext(oContext);
					oParameterDialog.open();
				}
			}
		},
		//
		// SCENARIO 3: "Plus" button performing a create after reading data from a popup
		//
		// IMPORTANT:
		// Note that this example implementation is only a preliminary PoC until there is an official Smart Templates API.
		// Therefore, the functions currently used in the example implementation are not to be used in productive coding.
		//
		onPressPlus: function(oEvent) {
	//		var oTable = oEvent.getSource().getParent().getParent().getTable();
			var aContext = this.extensionAPI.getSelectedContexts();
			var oContext = aContext[0];
			this._showPlusPopup(oContext);
			//MessageBox.success("Plus was pressed", {});
		},	
		_showPlusPopup: function(oContext) {	
			var oModel = this.getView().getModel();	
			var oField = new SmartField({
				value: "{Price}"
			});
	
			var oParameterDialog = new Dialog({
				title: "New Price",
				content: [
					new Text({
						text: "Price "
					}), oField
				],
				beginButton: new Button({
					text: "OK",
					press: function() {
						//that.getTransactionController().triggerSubmitChanges();
						oParameterDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						//that.getTransactionController().resetChanges();
						oParameterDialog.close();
					}
				}),
				afterClose: function() {
					oParameterDialog.destroy();
				}
			});
	
			oParameterDialog.setModel(oModel);
			oParameterDialog.setBindingContext(oContext);
			oParameterDialog.open();
		},	
		onSaveAsTileExtension: function(oShareInfo) {
			oShareInfo.serviceUrl = "";
		},	
		onGlobalAction: function(oEvent){
			MessageBox.success("Global Action triggered", {});
		},
		onLinkPress: function (oEvent) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oObject = oBindingContext.getObject();

			if (oObject.ProductForEdit === "HT-1003") {
				var oModel = oBindingContext.getModel();
				oModel.createBindingContext("to_ProductTextInOriginalLang", oBindingContext, {
					"preliminaryContext": false
				}, function (oTarget) {
					oNavigationController.navigateInternal([oBindingContext, oTarget]);
				});
				return true;
			} else if (oObject.ProductForEdit === "HT-1000") {
				var oModel = oBindingContext.getModel();
				oModel.createBindingContext("to_ProductTextInOriginalLang", oBindingContext, {
					"preliminaryContext": false
				}, function (oTarget) {
					oNavigationController.navigateInternal([oBindingContext, oTarget]);
				});
				return true;
			} else {
				MessageBox.error("Navigation has not been configured", {});
			}
			//return true is necessary to prevent further default navigation
			return false;
		}
		// example for modifying startup parameters
		// modifyStartupExtension: function(oStartupObject) {
		// 	oSelectionVariant = oStartupObject.selectionVariant;
		// 	if (oSelectionVariant) {
		// 		oSelectionVariant.removeSelectOption("TaxAmount");
		// 	}
		// }
	};
});
