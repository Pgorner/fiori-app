sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		'sap/ui/model/json/JSONModel',
		'sap/ui/core/library',
		'sap/ui/core/message/MessageType',
		"sap/ui/core/util/MockServer",
		"sap/m/NotificationListItem",
		"sap/ui/base/ManagedObject",
		"./Utils"
	],
	function (
		Controller,
		JSONModel,
		coreLibrary,
		MessageType,
		MockServer,
		NotificationListItem,
		ManagedObject,
		Utils
	) {
		"use strict";

		var Priority = coreLibrary.Priority,
			ValueState = coreLibrary.ValueState;

		return Controller.extend(
			"sap.ui.comp.sample.smartfield.CurrencyValidation.Main",
			{
				onInit: function () {
					var oView = this.getView(),
						oModelProcessFlow,
						oModelCurrencyFormat;
					oView.bindElement("/Products('123')");

					// Custom model used for tracking the process flow changes
					oModelProcessFlow = new JSONModel();
					// Create a deep copy of the default values object in order to keep it intact and use it for reset
					oModelProcessFlow.setData(JSON.parse(JSON.stringify(Utils.processFlowDefaultValues)));
					oView.setModel(oModelProcessFlow, "processFlow");

					// Custom model used for displaying the currency format of the selected currency code
					oModelCurrencyFormat = new JSONModel([]);
					oView.setModel(oModelCurrencyFormat, "currencyFormat");

					this.oModel = oView.getModel();

					// Attach callbacks to the model events fired when a backend request is sent, completed or failed
					this.oModel.attachRequestSent(this.onRequestSent, this);
					this.oModel.attachRequestFailed(this.onRequestFailed, this);
					this.oModel.attachRequestCompleted(this.onRequestCompleted, this);

					this.oMockServer = this.getOwnerComponent().oMockServer;

					// Attach callbacks executed before each MERGE or POST request to Products entity
					this.oMockServer.attachBefore(
						MockServer.HTTPMETHOD.MERGE,
						this._traceBackendRequest.bind(this, MockServer.HTTPMETHOD.MERGE),
						"Products"
					);
					this.oMockServer.attachBefore(
						MockServer.HTTPMETHOD.POST,
						this._traceBackendRequest.bind(this, MockServer.HTTPMETHOD.POST),
						"Products"
					);

					this.oList = this.byId("requestList");
					this.oSaveButtonToolbar = this.byId("buttonToolbar");
					this.oSmartField = this.byId("SF1");

					this.oSmartField.attachInitialise(function(oEvent){
						this._updateCurrencyFormatModel(oEvent.getSource());
					}, this);

					// Attach callback to listen for every change of the SmartField
					this.oSmartField.attachChange(this._traceCurrencyChange, this);
					// Attach callback to listen for every model change caused by SmartField properties update
					this.oSmartField.attachChangeModelValue(this._traceChangeModelValue, this);
				},
				onRequestSent: function (oEvent) {
					var oModelPendingChanges, sValue;
					if (Utils.isPostOrMerge(oEvent.getParameter("method"))) {
						// Get the model pending changes
						oModelPendingChanges = oEvent.getSource().getPendingChanges();
						sValue = oModelPendingChanges[oEvent.getParameter("url")];
						// Remove the metadata info from the pending changes
						delete sValue["__metadata"];
						this._updateProcessFlow("request", Utils.SUCCESS, JSON.stringify(sValue));
					}
				},
				onRequestFailed: function (oEvent) {
					var aListItems, oLastItem;
					if (Utils.isPostOrMerge(oEvent.getParameter("method"))) {
						// Update the latest request status in case of an error
						aListItems = this.oList.getItems();
						if (aListItems.length) {
							oLastItem = aListItems[0];
							oLastItem.setPriority("High");
						}
					}
				},
				onRequestCompleted: function (oEvent) {
					var sErrorMessage, oResponseBody, sapMessage, aListItems, oLastItem;
					if (Utils.isPostOrMerge(oEvent.getParameter("method"))) {
						var oResponse = oEvent.getParameter("response");
						if (!oEvent.getParameter("success")){
							sErrorMessage = oResponse.statusText;
							oResponseBody = JSON.parse(oResponse.responseText);

							if (oResponseBody.error && oResponseBody.error.error){
								sErrorMessage = oResponseBody.error.error;
							}
							this._updateProcessFlow("request", Utils.ERROR, sErrorMessage );
						}
						// In case of validation error in the backend the response header contains "sap-message" property with information about the problem
						if (oResponse.headers["sap-message"]) {
							sapMessage = JSON.parse(oResponse.headers["sap-message"]);
							this._updateProcessFlow("backend", Utils.ERROR, sapMessage.message);

							aListItems = this.oList.getItems();
							if (aListItems.length) {
								oLastItem = aListItems[0];
								oLastItem.setPriority("High");
							}
						} else {
							this._updateProcessFlow("backend", Utils.SUCCESS);
						}
					}
				},
				handleSubmitTrigger: function (oEvent) {
					this._resetProcessFlowIndocators();

					var sKey = oEvent.getSource().getSelectedKey();

					// Reset existing state
					this.oSaveButtonToolbar.setVisible(false);
					this.oSmartField.detachChange(this.handleSave, this);
					this.oSmartField.detachChangeModelValue(this.handleSaveNoCheck, this);
					this.oModel.detachPropertyChange(this.handleModelPropertyChange, this);

					// Apply new state
					switch (sKey) {
						case "change":
							this.oSmartField.attachChange(this.handleSave, this);
							break;
						case "changeModelValue":
							this.oSmartField.attachChangeModelValue(
								this.handleSaveNoCheck,
								this
							);
							break;
						case "propertyChange":
							this.oModel.attachPropertyChange(
								this.handleModelPropertyChange,
								this
							);
							break;
						default:
							this.oSaveButtonToolbar.setVisible(true);
					}
				},
				/**
				 * This is the handler for the Save button event. It is also used for the Ctrl+S shortcut
				 */
				handleSave: function () {
					this.oSmartField
						.checkValuesValidity()
						.then(
							function () {
								this.oModel.submitChanges();
							}.bind(this)
						)
						.catch(function (sReason) {
							// Value in error scenario - we do nothing in this sample
						});
				},
				/**
				 * This is the handler for sending the changes when the model is updated.
				 * If the model is updated no additional validation is required on the client.
				 */
				handleSaveNoCheck: function () {
					this.oModel.submitChanges();
				},
				/**
				 * This is the handler for sending the changes when a model property is updated.
				 * We only need to submit the changes if one of our properties of interest (CurrencyCode or Price) was modified.
				 *  @param {object} oEvent - the event object
				 */
				handleModelPropertyChange: function (oEvent) {
					var sPath = oEvent.getParameter("path");

					if (sPath === "Price" || sPath === "CurrencyCode") {
						this.oModel.submitChanges();
					}
				},
				clearRequestsHistory: function () {
					this.oList.removeAllItems();
				},
				clearCurrencyValuesHistory: function () {
					this.getView().getModel("currencyFormat").setData([]);
				},
				_traceBackendRequest: function(method, oEvent) {
					var oData = JSON.parse(oEvent.getParameter("oXhr").requestBody);

					// remove __metadata as it is not relevant to this sample
					delete oData["__metadata"];

					this.oList.removeAllItems();
					this.oList.addItem(
						new NotificationListItem({
							title: method,
							description: ManagedObject.escapeSettingsValue(
								JSON.stringify(oData, null, "\t")
							),
							datetime: new Date().toLocaleString(),
							priority: Priority.Low,
							highlight: MessageType.Success,
							unread: true,
							close: function () {
								this.destroy();
							},
							press: function () {
								this.setUnread(false);
							}
						})
					);
				},
				_traceCurrencyChange: function (oEvent) {
					this._resetProcessFlowIndocators();

					var sValue = oEvent.getSource().getValue() + " " + oEvent.getSource().getUnitOfMeasure();

					oEvent.getSource().checkValuesValidity()
						.then(function(){
							this._updateProcessFlow("frontend", Utils.SUCCESS, sValue);
						}.bind(this))
						.catch(function(){
							this._updateProcessFlow("frontend", Utils.ERROR, sValue);
						}.bind(this));

					// In edit mode we have access to the Currency ODataType
					// We can use the ODataType in order to access the scale, precision and formatting options
					if (
						oEvent.getSource().getUnitOfMeasure() &&
						oEvent.getParameter("unitChanged")
					) {
						this._updateCurrencyFormatModel(oEvent.getSource());
					}
				},
				_traceChangeModelValue: function(oEvent) {
					var oModel = oEvent.getSource().getModel();
					// Get the property path from the binding context
					var sPropertyPath = oEvent.getSource().getBindingContext().getPath();
					// Get the model property
					var oProperty = oModel.getProperty(sPropertyPath);

					var sValue = oProperty.Price + " " + oProperty.CurrencyCode; // JSON.stringify(oProperty);

					// Check for an error while updating the underlying model
					if (oEvent.getParameter("valueLastValueState") === ValueState.Error ||
						oEvent.getParameter("unitLastValueState") === ValueState.Error ) {
							this._updateProcessFlow("model", Utils.ERROR, sValue);
					} else {
						this._updateProcessFlow("model", Utils.SUCCESS, sValue);
					}
				},
				_updateCurrencyFormatModel: function (oSmartField) {
					if (oSmartField.getMode() === "edit") {
						var sCurrencyCode = oSmartField.getUnitOfMeasure(), // currency code
							oMetaData = this._getCurrencyScaleAndPrecision(oSmartField),
							oDataType,
							cDecimalSeparator,
							sTemplate,
							currencyFormatData;

						oDataType = oSmartField
							.getFirstInnerControl()
							.getBinding("value")
							.getType();

						cDecimalSeparator = oDataType.oOutputFormat.oLocaleData.mData["symbols-latn-decimal"];

						sTemplate = this._createCurrencyValueTemplate(
							oMetaData.Precision,
							oMetaData.Scale,
							cDecimalSeparator
						);

						currencyFormatData = {
								currencyCode: sCurrencyCode,
								precision: oMetaData.Precision,
								scale: oMetaData.Scale,
								format: sTemplate };
						this.getView().getModel("currencyFormat").setData([currencyFormatData]);
					}
				},
				_resetProcessFlowIndocators: function(){
					this.getView().getModel("processFlow").setData(
						JSON.parse(JSON.stringify(Utils.processFlowDefaultValues))
					);
				},
				/**
				 * Helper function for creating template string for value with precision and scale
				 * @param {number} nPrecision - the maximum number of digits in the value
				 * @param {number} nCurrencyScale - number of decimal digits
				 * @param {character} cSeparator - decimal digits separator
				 * @returns {string} -  Returns string in the format of XXXXX.XX
				 */
				_createCurrencyValueTemplate: function (
					nPrecision,
					nCurrencyScale,
					cSeparator
				) {
					var decimalSignPosition = nPrecision - nCurrencyScale,
						aResult = Array(nPrecision).fill("X");
					if (decimalSignPosition !== nPrecision) {
						aResult.splice(decimalSignPosition, 0, cSeparator);
					}
					return aResult.join("");
				},
				_updateProcessFlow: function(sKey, sStatus, sValue) {
					var processFlowData = this.getView().getModel("processFlow").getData();
					processFlowData[sKey].label = sStatus || "";
					processFlowData[sKey].text = sValue || "";

					if ( !sStatus ) {
						processFlowData[sKey].iconColor = "Neutral";
					} else {
						processFlowData[sKey].iconColor = sStatus === Utils.ERROR ? "Negative" : "Positive";
					}

					this.getView().getModel("processFlow").setData(processFlowData);
				},
				_getCurrencyScaleAndPrecision: function(oSmartField){
					var sCurrencyCode = oSmartField.getUnitOfMeasure(),
						oDataType = oSmartField.getFirstInnerControl().getBinding("value").getType(),
						iMetadataPrecision = oDataType.oConstraints.precision,
						iMetadataScale = oDataType.oConstraints.scale,
						iCurrencyScale = oDataType.oOutputFormat.oLocaleData.getCurrencyDigits(sCurrencyCode),
						iPrecision = typeof iMetadataPrecision === "number" ? iMetadataPrecision : Infinity,
						iScale = 0;

					if (oDataType.oConstraints.variableScale) {
						iScale = Math.min(iPrecision, iCurrencyScale);
					} else {
						iScale = Math.min(iMetadataScale || 0, iCurrencyScale);
					}

					return {
						Precision: iPrecision,
						Scale: iScale
					};
				}
			}
		);
	}
);
