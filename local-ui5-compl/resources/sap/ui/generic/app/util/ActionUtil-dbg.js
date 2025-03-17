/*
 * ! SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/comp/smartform/SmartForm",
	"sap/ui/comp/smartform/Group",
	"sap/ui/comp/smartform/GroupElement",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/base/strings/formatMessage",
	"sap/ui/core/Lib",
	"sap/ui/generic/app/util/ModelUtil",
	"sap/ui/core/CustomData"
], function (
	ManagedObject,
	MessageBox,
	SmartForm,
	Group,
	GroupElement,
	SmartField,
	SmartLabel,
	Dialog,
	Button,
	formatMessage,
	CoreLibrary,
	ModelUtil,
	CustomData
) {
	"use strict";

	var ActionUtil = ManagedObject.extend("sap.ui.generic.app.util.ActionUtil", {
		metadata: {
			properties: {
				/**
				 * The view controller (of type sap.ui.core.mvc.Controller). Used e.g. to retrieve
				 * the OData Model and, if available, the special @i18n model (based on a resource bundle
				 * with custom labels).
				 */
				controller: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * The used ApplicationController
				 */
				applicationController: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},
				/** TODO Should maybe get an aggregation to reflect that it is an array
				 * The contexts in which the action is called.
				 */
				contexts: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Function import that should be called.
				 */
				functionImport: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Label of the function import.
				 */
				functionImportPath: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Entity type in case of instance bound function import. Static function imports this property will be null
				 */
				entityType: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Label of the function import.
				 */
				actionLabel: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Label of the function import.
				 */
				actionButtonText: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Indicates current context is draft enabled or not.
				 */
				isDraftEnabled: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},
				/**
				 * Indicates action is a create action or not.
				 */
				isCreateAction: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},
				/**
				 * data for specific function import parameters which should be considered irrespective of the context selected.
				 */
				contextIndependentParameterData: {
					type: "object",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Label of the function import.
				 */
				expand: {
					type: "string",
					group: "Misc",
					defaultValue: undefined
				},
				/**
				 * The callback that is called after the action has been successfully executed.
				 */
				successCallback: {
					type: "function",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * The callback that is called after the action has been successfully executed.
				 */
				operationGrouping: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Indicates action is a bound action or not.
				 */
				isBoundAction: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				}
			}
		}
	});

	/**
	 * Method trigger the action execution. It will check if the action is critical or not and based on that
	 * it will bring the dialog for user confirmation.
	 * <b>Note:</b> An action is considered critical if the annotation "com.sap.vocabularies.Common.v1.IsActionCritical" is set to true.
	 *
	 * Method also prepares the parameters for the action and brings the dialog for user input if required.
	 *
	 * @param {boolean} isStrict If set to true, the action will be executed in strict mode. In strict mode, the action will be executed by
	 * service only if there are no warnings. If set to false, the action will be executed in lenient mode. In lenient mode, the action will
	 * be executed by service even if there are warnings.
	 *
	 * @returns {Promise} A promise will be returned by the method. Promise resolution will be done as described below
	 * <b>Case 1:</b> Action is triggered immediately w/o further user interaction (i.e. when no further
	 * parameters are needed or expected for processing). Returned <code>Promise</code> is resolved immediately with an <code>Object</code>
	 * that contains another promise in the member <code>executionPromise</code>.
	 * <b>Case 2:</b> Action is triggered after user interaction (i.e. when further parameters are needed or expected for processing). In
	 * case of user confirmation, the returned <code>Promise</code> is resolved with an <code>Object</code> that contains another promise
	 * in the member <code>executionPromise</code> (similar to Case 1). In case of user cancellation, the returned <code>Promise</code>
	 * will be rejected.
	 *
	 * @protected
	 */
	ActionUtil.prototype.call = function (isStrict) {
		return new Promise(function (resolve, reject) {
			var oFunctionImport = this.getFunctionImport();
			if (!oFunctionImport) {
				reject("Call method invoked without setting the functionImport property of ActionUtil instance.");
			}

			var bIsBoundAction = !!oFunctionImport["sap:action-for"];
			this.setIsBoundAction(bIsBoundAction);

			if (bIsBoundAction) {
				var aSelectedContexts = this.getContexts();
				if (!aSelectedContexts || aSelectedContexts.length === 0) {
					reject("Bound action is executed without a context.");
				}

				var oEntityType = ModelUtil.getEntityTypeFromContext(aSelectedContexts[0]);
				this.setEntityType(oEntityType);
			}

			this._callMethodPromise = {
				resolve: resolve,
				reject: reject
			};

			if (this._isActionCritical()) {
				this._displayCriticalActionDialog();
			} else {
				this._prepareParamsAndInvokeAction(isStrict);
			}
		}.bind(this));
	};

	/**
	 * Method to display the critical action dialog. It will bring the dialog for user confirmation.
	 * @private
	 */
	ActionUtil.prototype._displayCriticalActionDialog = function () {
		var sMsgBoxText;
		var sCustomMessageKey = "ACTION_CONFIRM|" + this.getFunctionImport().name; // Key for i18n in application for custom message
		var oController = this.getController();
		var oOwnerComponent = oController.getOwnerComponent();
		var oAppComponent = oOwnerComponent.getAppComponent();
		var oResourceModel = oAppComponent.getModel("i18n");
		var oResourceBundle = oResourceModel && oResourceModel.getResourceBundle();
		if (oResourceBundle && oResourceBundle.hasText(sCustomMessageKey)) {
			sMsgBoxText = oResourceBundle.getText(sCustomMessageKey);
		} else {
			// Fallback in case key does not exist in i18n file of Application
			sMsgBoxText = CoreLibrary.getResourceBundleFor("sap.ui.generic.app").getText("ACTION_CONFIRM");
			sMsgBoxText = formatMessage(sMsgBoxText, this.getActionLabel());
		}

		MessageBox.confirm(sMsgBoxText, {
			title: this.getActionLabel(),
			onClose: function (oAction) {
				if (oAction === "OK") {
					this._prepareParamsAndInvokeAction(true);
				} else if (oAction === "CANCEL") {
					this._callMethodPromise.reject("Action execution cancelled by user.");
				}
			}.bind(this),
			sClass: this._getCompactModeStyleClass()
		});
	};

	/**
	 * Method prepares the parameters for the action and invokes the action.
	 * @param {boolean} isStrict If set to true, the action will be executed in strict mode.
	 * In strict mode, the action will be executed by service only if there are no warnings.
	 */
	ActionUtil.prototype._prepareParamsAndInvokeAction = function (isStrict) {
		this._prepareParameters().then(function (actionParamInfo) {
			// actionParamInfo contains action IN parameters metadata & parameter data per context
			this._initiateCall(actionParamInfo, isStrict);
		}.bind(this));
	};

	/**
	 * Method prepares the parameters which are needed as input for the action based on the metadata.
	 *
	 * @returns {Promise} A promise that will be resolved with an object containing the action
	 * parameters metadata and context specific parameter data (in case of bound action execution on multiple context).
	 * @private
	 */
	ActionUtil.prototype._prepareParameters = function () {
		return new Promise(function (resolve) {
			var oFunctionImport = this.getFunctionImport();
			var oActionParamInfo = {
				inParameters: {}, // Object map with parameter name as key and parameter definition from meta data object as value.
				contextSpecificParameterData: [], // Array of context specific parameter data (name & value) map. Index of the selected context is used as index.
				hasParametersRequiringUserInput: false // Flag to indicate if the action has parameters which require user input.
			};
			var aSelectedContexts = this.getContexts();
			var mContextIndependentParameterData = this.getContextIndependentParameterData() || {};
			var oTransactionController = this.getApplicationController().getTransactionController();
			var sFunctionName = oFunctionImport.name;


			var processDefaultValues = function (aParameterValues) {
				this.setContextIndependentParameterData(aParameterValues);
			}.bind(this);

			var initActionParamInfo = function () {
				var mInParameters = {};
				var mEntityKeys = this._getKeys();
				mContextIndependentParameterData = this.getContextIndependentParameterData() || {}; // Fetch updated context independent parameter data

				if (oFunctionImport.parameter) {
					for (var index = 0; index < oFunctionImport.parameter.length; index++) {
						var oParameter = oFunctionImport.parameter[index];
						var sParameterName = oParameter.name;
						// Check if the parameter has a label annotation. If not, try to get it from the entity type
						this._checkAndUpdateLabelAnnotation(oParameter, this.getEntityType(), this.getContexts()[0]);

						//Special handling for "ResultIsActiveEntity". Looks dirty, but keeping it for backward compatibility.
						if (sParameterName === "ResultIsActiveEntity") {
							//When the parameter is optional (nullable is true or undefined), omit it from inParameterMetadata
							if (oParameter.nullable !== "false") {
								continue;
							}
						}

						var bIsKey = !!mEntityKeys[sParameterName];
						// In case parameter has parameter mode as IN, then it should be treated as action inParameter
						if (oParameter.mode.toUpperCase() === "IN") {
							mInParameters[sParameterName] = {
								"metadata": oParameter,
								"isKey": bIsKey
							};

							// Key properties of bound actions or hidden properties through annotations
							// or properties for which there is a context independent value should be set in the action context
							if ((this.getIsBoundAction() && (aSelectedContexts.length === 1 || bIsKey))
								|| oParameter.hasOwnProperty("com.sap.vocabularies.UI.v1.Hidden")
								|| mContextIndependentParameterData[sParameterName]) {
								for (var nContextIndex = 0; nContextIndex < aSelectedContexts.length; nContextIndex++) {
									this.initializeContextSpecificParameterData(aSelectedContexts[nContextIndex], nContextIndex, oActionParamInfo, mContextIndependentParameterData, sParameterName);
								}
							}
							oActionParamInfo.inParameters = mInParameters;
							oActionParamInfo.hasParametersRequiringUserInput = oActionParamInfo.hasParametersRequiringUserInput || this._checkParameterRelevant4UserInput(oActionParamInfo, mInParameters[sParameterName]);
						}
					}
				}
				resolve(oActionParamInfo);
			}.bind(this);

			var vReturnValue = oTransactionController.getDefaultValues(aSelectedContexts, mContextIndependentParameterData, undefined, sFunctionName);
			if (vReturnValue instanceof Promise) {
				vReturnValue.then(processDefaultValues, processDefaultValues).then(initActionParamInfo);
			} else {
				Promise.resolve().then(function () {
					initActionParamInfo();
				});
			}
		}.bind(this));
	};

	ActionUtil.prototype.initializeContextSpecificParameterData = function (oContext, nContextIndex, oActionParamInfo, mContextIndependentParameterData, sParameterName) {
		var vParameterValue;
		var oContextObject = oContext.getObject();
		if (!oActionParamInfo.contextSpecificParameterData[nContextIndex]) {
			oActionParamInfo.contextSpecificParameterData[nContextIndex] = {};
		}

		if (mContextIndependentParameterData && mContextIndependentParameterData[sParameterName]) {
			vParameterValue = mContextIndependentParameterData[sParameterName];
		} else if (sParameterName === "ResultIsActiveEntity") {
			//Special handling for "ResultIsActiveEntity". Looks dirty, but keeping it for backward compatibility.
			//In case the parameter is not optional, set value to false
			vParameterValue = false;
		} else if (oContextObject && oContextObject.hasOwnProperty(sParameterName)) {
			vParameterValue = oContextObject[sParameterName];
		}

		oActionParamInfo.contextSpecificParameterData[nContextIndex][sParameterName] = vParameterValue;
	};

	/**
	 * Method to get the keys of the entity type.
	 * @returns {object} Object map with key name as key and true as value.
	 * @private
	 */
	ActionUtil.prototype._getKeys = function () {
		const mKeys = {};
		const oEntityType = this.getEntityType();
		//Whether the single or multiple selection context, entity type for all th context is same
		if (oEntityType) {
			oEntityType.key.propertyRef.forEach((oKey) => {
				mKeys[oKey.name] = true;
			});
		}
		return mKeys;
	};

	/**
	 * Returns the style class based on the compact mode
	 * @returns {string} Style class based on the compact mode
	 * @private
	 */
	ActionUtil.prototype._getCompactModeStyleClass = function () {
		if (this.getController().getView().$().closest(".sapUiSizeCompact").length) {
			return "sapUiSizeCompact";
		}
		return "";
	};

	/**
	 * Reset the changes for the contexts used for action processing
	 *
	 * @param {Array<sap.ui.model.Context>} aActionContexts Array of contexts used for action processing
	 * @private
	 */
	ActionUtil.prototype._cleanUpContext = function (aActionContexts) {
		aActionContexts.forEach(function (oContext) {
			var oModel = oContext.getModel();
			var sPath = oContext.sPath;
			oModel.resetChanges([sPath], true, true);
		});
	};

	/**
	 * Check action metadata for critical flag
	 * @returns {boolean} true if the action is critical, false otherwise
	 * @private
	 */
	ActionUtil.prototype._isActionCritical = function () {
		var oCritical = this.getFunctionImport()["com.sap.vocabularies.Common.v1.IsActionCritical"];

		if (!oCritical) {
			return false;
		}

		if (oCritical.Bool === undefined) {
			return true;
		}

		return this._toBoolean(oCritical.Bool);
	};

	/**
	 * Converts a parameter value to a boolean
	 * @param {object} oParameterValue The value to be converted
	 * @returns {boolean} Boolean value
	 * @private
	 */
	ActionUtil.prototype._toBoolean = function (oParameterValue) {
		if (typeof oParameterValue === "string") {
			var oValue = oParameterValue.toLowerCase();
			return !(oValue === "false" || oValue === "" || oValue === " ");
		}

		return !!oParameterValue;
	};

	/**
	 * Method try to initiate the call to action execution. It will check if the action has in parameters or not. In case action
	 * has in parameters which are not available in contextIndependentParameterData or in the selected entity context, it will bring
	 * the dialog for user input. In case action does not have in parameters, it will directly initiate the action call.
	 *
	 * @param {object} [oActionParamInfo] ActionParam info object.
	 * @param {boolean} [bIsStrict] Optional flag to indicate if the action should be executed in strict mode.
	 *
	 */
	ActionUtil.prototype._initiateCall = function (oActionParamInfo, bIsStrict) {
		// Prepare headers based on value of bStrict flag
		var sHandlingHeader = bIsStrict ? "strict" : "lenient";
		var mHeaders = { Prefer: "handling=" + sHandlingHeader };
		var mContextIndependentParameterData = this.getContextIndependentParameterData() || {};
		var bIsDraftEnabled = this.getIsDraftEnabled();

		if (!oActionParamInfo.hasParametersRequiringUserInput
			|| (this.getIsCreateAction() && this._checkContextIndependentParameterDataForInParams(oActionParamInfo))) {
			// In case additional parameters doesn't exist for the action, OR action is Create action
			// using NewAction & data for all the action parameters exist, initiate the action call
			this._call(mContextIndependentParameterData, bIsDraftEnabled, mHeaders, this.expand);
		} else if (Object.keys(oActionParamInfo.inParameters).length > 0) {
			// Action contain IN parameters & Action is not create action or context independent parameter data doesn't have
			// values for all params, it is necessary to bring the parameter dialog for user input.
			// In this case, it's necessary to synchronize the draft before the getNewActionContext call as it makes a
			// oModel.callFunction call and if the draft is not synchronized, then MERGE and POST, both requests would get
			// triggered after the completion of delayed draft interval.
			var oApplicationController = this.getApplicationController();
			var oSyncPromise = bIsDraftEnabled ? oApplicationController.synchronizeDraftAsync() : Promise.resolve();
			oSyncPromise.then(function () {
				var mParameters = {
					urlParameters: {},
					headers: mHeaders,
					expand: this.expand
				};

				var oSelectedContexts = this.getContexts();
				var fnChangeSet = oApplicationController._getChangeSetFunc(
					oSelectedContexts,
					this.getOperationGrouping()
				);

				var aFuncHandles = oSelectedContexts.map(function (oContext, index) {
					mParameters.changeSetId = fnChangeSet(index);
					return oApplicationController.getNewActionContext(this.getFunctionImportPath(), oContext, mParameters);
				}.bind(this));

				var aActionContextPromises = aFuncHandles.map(function (oFuncHandle) {
					return oFuncHandle.context;
				});

				Promise.all(aActionContextPromises).then(function (aActionContexts) {
					// set action context value to oModel for single & multiple selection
					aActionContexts.forEach(function (oActionContext, nIndex) {
						var mContextSpecificParameterData = oActionParamInfo.contextSpecificParameterData[nIndex];
						for (var sParamName in mContextSpecificParameterData) {
							oActionContext.getModel().setProperty(sParamName, mContextSpecificParameterData[sParamName], oActionContext, true);
						}
					});

					if (bIsStrict) {
						var mParameterForm = this._buildParametersForm(oActionParamInfo, aActionContexts[0]);
						var bActionPromiseDone = false;
						var oParameterDialog = new Dialog({
							title: this.getActionLabel(),
							content: [mParameterForm.form],
							beginButton: new Button({
								text: this.getActionButtonText() || this.getActionLabel(),
								type: "Emphasized",
								press: function () {
									var oSmartFormCheckPromise = mParameterForm.form ? mParameterForm.form.check() : Promise.resolve();
									oSmartFormCheckPromise.then(function () {
										if (mParameterForm.hasNoClientErrors()) {
											oParameterDialog.close();
											bActionPromiseDone = this._triggerActionPromise(
												aFuncHandles,
												oSelectedContexts,
												oActionParamInfo,
												aActionContexts,
												bIsStrict
											);
										}
									}.bind(this));
								}.bind(this)
							}),
							endButton: new Button({
								text: CoreLibrary.getResourceBundleFor("sap.ui.generic.app").getText("ACTION_CANCEL"),
								press: function () {
									aFuncHandles[0].abort();
									oParameterDialog.close();
									this._cleanUpContext(aActionContexts);
									this._callMethodPromise.reject();
									bActionPromiseDone = true;
								}.bind(this)
							}),
							afterClose: function () {
								oParameterDialog.destroy();
								// Tidy up at the end: if the action hasn't been triggered, do the same as it was cancelled.
								if (!bActionPromiseDone) {
									this._callMethodPromise.reject();
								}
							}.bind(this)
						}).addStyleClass("sapUiNoContentPadding");

						oParameterDialog.addStyleClass(this._getCompactModeStyleClass());
						// set the default model
						oParameterDialog.setModel(aActionContexts[0].getModel());

						// set a @i18n model if available via the given controller
						if (this.getController().getView().getModel("@i18n")) {
							oParameterDialog.setModel(
								this.getController().getView().getModel("@i18n"),
								"@i18n"
							);
						}
						var oForm = oParameterDialog.getAggregation("content")[0].mAggregations["content"];
						var aFormElements = oForm.getFormContainers()[0].getFormElements();
						var bHasSmartFields = aFormElements.some(function (oFormElement) {
							// Check if there is one smart field which is visible
							var oSmartField = oFormElement.getFields()[0];
							return (oSmartField instanceof SmartField && oSmartField.getVisible() === true);
						});

						if (aFormElements.length === 0 || !bHasSmartFields) {
							// If there are no visible smart fields in the form, close the dialog and trigger the action
							this._triggerActionPromise(
								aFuncHandles,
								oSelectedContexts,
								oActionParamInfo,
								aActionContexts,
								bIsStrict
							);
							oParameterDialog.destroy();
						} else {
							oParameterDialog.open();
						}
					} else {
						this._triggerActionPromise(
							aFuncHandles,
							oSelectedContexts,
							oActionParamInfo,
							aActionContexts
						);
					}
				}.bind(this));
			}.bind(this));
		} else {
			// TODO: Check if this is still needed. Currently this is a dead code, will never be executed.
			//Take "the old" way -> prepare everything and call then callFunction with complete set of data
			this._call(null, bIsDraftEnabled, mHeaders, null);
		}
	};

	ActionUtil.prototype._triggerActionPromise = function (aFuncHandles, aEntityContext, oActionParamInfo, aActionContexts, bIsStrict) {
		// Stores the parameter values entered by user in parameter dialog. This is useful when warning occurs in 412 HTTPStatusCode
		// and we want to send caller, all the params that user has entered, so that they can send back these parameters to ActionUtil.
		// Thus user does not need to refill the same parameters.
		const mUserEnteredActionParams = {};
		this._callMethodPromise.resolve({
			// Here we are calling newPromiseAll. Reason being:
			// 1. It basically does not reject if any of the promise which is rejected, which is not the case with Promise.All.
			// 2. It preserve the order of input promises.
			executionPromise: this.getApplicationController()._newPromiseAll(aFuncHandles.map(function (oFuncHandle) {
				return oFuncHandle.result;
			})).then(function (aResults) {
				// If any of the function import is successful, we consider this as success to synchronise it other BOPF action
				// which does not require parameters
				this._bExecutedSuccessfully = this.getApplicationController()._checkAtLeastOneSuccess(aEntityContext, aResults);
				if (bIsStrict) {
					aResults.forEach(function (oResult) {
						// attach userEnteredAdditionalParams with response
						oResult.userEnteredAdditionalParams = mUserEnteredActionParams;
					});
				}
				if (this._bExecutedSuccessfully) {
					return aResults;
				} else {
					// reset the changes if the function import fails. Model is not able to reset this change automatically as there are other scenarios where the
					// failed context is re-sent to the backend
					this._cleanUpContext(aActionContexts);
					return Promise.reject(aResults);
				}
			}.bind(this), function (aError) {
				this._bExecutedSuccessfully = false;
				//TODO: Think about throwing errors. Maybe not needed in a failing Promise...?
				aError.forEach(function (oError) {
					// attach userEnteredAdditionalParams with error
					oError.userEnteredAdditionalParams = mUserEnteredActionParams;
				});
				throw aError;
			}.bind(this))
		});
		var oActionContextDataObject = aActionContexts[0].getObject();

		// update other contexts(from second) model to user input(from dialog)
		var aInParameters = Object.values(oActionParamInfo.inParameters);
		aInParameters.forEach(function (oParameterInfo) {
			if (this._checkParameterRelevant4UserInput(oActionParamInfo, oParameterInfo)) {
				// There are two scenarios that occur when the submit button is pressed on an empty field:
				// Case 1: When the field remains untouched, and the submit button is pressed, the data inside the parameter will
				// be "undefined." When the model attempts to create the payload, this parameter will not be included in the
				// payload.
				// Case 2: If the user enters a value and then deletes it, the data inside the parameter will be "null." In this
				// case, when the payload is generated, the model will not remove the parameter, as it did in the previous case.
				// Instead, it will pass the parameter as "null" in the payload.
				// It's important to note that currently, the gateway does not accept the parameter as "null" in the function
				// import scenario. Following a discussion with the Gateway and OData V2 colleagues, it has been agreed that
				// removing the parameter would indicate to the backend that the data should be deleted from the database.
				// Additionally, this change will prevent the Gateway from throwing an error. This can be achieved by setting
				// the parameter to "undefined" whenever a null value is encountered. In this context, a null value in the
				// parameter signifies that the value has been removed by backspacing.
				var oParamMetadata = oParameterInfo.metadata;
				var oActionContextDataObjectValue = oActionContextDataObject[oParamMetadata.name] === null ? undefined : oActionContextDataObject[oParamMetadata.name];
				// Set default value(false) for boolean type if value is 'undefined'
				if (oActionContextDataObjectValue === undefined) {
					if (oParamMetadata.type === "Edm.Boolean") {
						oActionContextDataObjectValue = false;
					}
					aActionContexts[0].getModel().setProperty(oParamMetadata.name, oActionContextDataObjectValue, aActionContexts[0], true);
				}

				// Capture the value of parameters entered by user
				mUserEnteredActionParams[oParamMetadata.name] = oActionContextDataObjectValue;
				// User entered values is captured in action context in 0th index, update the same value to other contexts
				for (var i = 1; i < aActionContexts.length; i++) {
					var oContext = aActionContexts[i];
					oContext.getModel().setProperty(oParamMetadata.name, oActionContextDataObjectValue, oContext, true);
				}
			}
		}.bind(this));

		var sFunctionImportName = this.getFunctionImport().name;
		aEntityContext.forEach(function (ctx, i) {
			this.getApplicationController().submitActionContext(ctx, aActionContexts[i], sFunctionImportName);
		}.bind(this));

		// TODO: I don't understand why we are returing true only if bIsStrict is true. This should be reviewed.
		// Return value is used whether ActionContexts are submitted or not, which is already done simple return true should be enough.
		return bIsStrict;
	};

	ActionUtil.prototype._call = function (mUrlParameters, bIsDraftEnabled, mHeaders, sExpand) {
		var oSelectedContexts = this.getContexts();
		var oApplicationController = this.getApplicationController();

		var mParameters = {
			urlParameters: mUrlParameters,
			operationGrouping: this.getOperationGrouping(),
			triggerChanges: bIsDraftEnabled,
			headers: mHeaders,
			expand: sExpand
		};

		this._callMethodPromise.resolve({
			executionPromise: oApplicationController.invokeActions(this.getFunctionImportPath(), oSelectedContexts, mParameters).then(function (oResponse) {
				this._bExecutedSuccessfully = true;
				return oResponse;
			}.bind(this), function (oError) {
				this._bExecutedSuccessfully = false;
				//TODO: Think about throwing errors. Maybe not needed in a failing Promise...?
				throw oError;
			}.bind(this))

		});
	};

	/**
	 * Method to create action parameter form for user input.
	 * @param {object} oActionParamInfo ActionParam info object.
	 * @param {sap.ui.model.Context} oActionContext Action context which should be bound to the form.
	 *
	 * @returns {object} Object containing the form and a function to check if the form has client errors.
	 *
	 * @private
	 */
	ActionUtil.prototype._buildParametersForm = function (oActionParamInfo, oActionContext) {
		var oSmartForm = new SmartForm({
			editable: true,
			validationMode: "Async"
		});

		oSmartForm.setBindingContext(oActionContext);
		// list of all smart fields for input check
		var oSmartField;
		var aFields = [];
		var oSmartLabel;
		var oGroup = new Group();

		const inParameterArray = Object.values(oActionParamInfo.inParameters);
		for (var i = 0; i < inParameterArray.length; i++) {
			var parameter = inParameterArray[i].metadata;

			// In case parameter is not reklevant for user input, skip it
			if (!this._checkParameterRelevant4UserInput(oActionParamInfo, inParameterArray[i])) {
				continue;
			}
			
			if (!parameter["com.sap.vocabularies.UI.v1.TextArrangement"]) {
				parameter["com.sap.vocabularies.UI.v1.TextArrangement"] = {
					"EnumMember": "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
				};
			}

			oSmartField = new SmartField("ActionUtil-" + this.getFunctionImportPath().replace("/", "-")  + "-" + parameter.name, {
				value: '{' + parameter.name + '}',
				textLabel: this._getParameterName(parameter),
				width: "100%"
			});

			oSmartField.addCustomData(new CustomData({
				key: "defaultTextInEditModeSource",
				value: "ValueListNoValidation"
			}));

			oSmartField.addCustomData(new CustomData({
				key: "defaultInputFieldDisplayBehaviour",
				value: "descriptionOnly"
			}));

			aFields.push(oSmartField);

			oSmartLabel = new SmartLabel();
			oSmartLabel.setLabelFor(oSmartField);

			var oGroupElement = new GroupElement();

			oGroupElement.addElement(oSmartField);
			oGroup.addGroupElement(oGroupElement);

		}

		oSmartForm.addGroup(oGroup);

		// for now: always return false, as smart fields currently do not handle JSON models correctly
		var fnHasNoClientErrors = function () {
			var bNoClientErrors = true;
			for (var i = 0; i < aFields.length; i++) {
				if (aFields[i].getValueState() != "None") {
					bNoClientErrors = false;
					break;
				}
			}
			return bNoClientErrors;
		};

		return {
			form: oSmartForm,
			hasNoClientErrors: fnHasNoClientErrors
		};
	};

	ActionUtil.prototype._checkParameterRelevant4UserInput = function (oActionParamInfo, oParameterInfo) {
		// Check if field is used only to transport technical data (e.g. Field Control) or a key field
		// in a bound action
		const parameter = oParameterInfo.metadata;
		var oUIHiddenAnnotation = parameter["com.sap.vocabularies.UI.v1.Hidden"];
		// Condition to check
		// 1. If UI.Hidden is annotated either with a path (dynamic expression) or with any value value other than false, 
		// field is not relevant for user input.
		// 2. If field is a key field in a bound action, field should not be relevant for user input.
		return !((oUIHiddenAnnotation 
					&& !oUIHiddenAnnotation.Path
					&& oUIHiddenAnnotation.Bool !== "false") 
				|| (oParameterInfo.isKey && this.getIsBoundAction()));
	};

	ActionUtil.prototype._getParameterName = function (oParameter) {
		// if no label is set for parameter use parameter name as fallback
		return oParameter["com.sap.vocabularies.Common.v1.Label"] ? oParameter["com.sap.vocabularies.Common.v1.Label"].String : oParameter.name;
	};

	ActionUtil.prototype._checkAndUpdateLabelAnnotation = function (oParameter, oEntityType, oContext) {
		if (oEntityType && oParameter && !oParameter["com.sap.vocabularies.Common.v1.Label"]) {
			var oProperty = oContext.getModel().getMetaModel().getODataProperty(oEntityType, oParameter.name, false);
			if (oProperty && oProperty["com.sap.vocabularies.Common.v1.Label"]) {
				// copy label from property to parameter with same name as default if no label is set for function import parameter
				oParameter["com.sap.vocabularies.Common.v1.Label"] = oProperty["com.sap.vocabularies.Common.v1.Label"];
			}
		}
	};

	ActionUtil.prototype._checkContextIndependentParameterDataForInParams = function (oActionParamInfo) {
		var mContextIndependentParameterData = this.getContextIndependentParameterData() || {};
		var aInParameters = Object.values(oActionParamInfo.inParameters);
		for (var i = 0; i < aInParameters.length; i++) {
			var sParameterName = aInParameters[i].metadata.name;
			if (!mContextIndependentParameterData[sParameterName]) {
				return false;
			}
		}
		return true;
	};

	/**
	 * Returns the action execution status.
	 *
	 * @returns {boolean} true if the action has executed successfully
	 * @ui5-restricted
	 * @private
	 */
	ActionUtil.prototype.getExecutedSuccessfully = function () {
		return this._bExecutedSuccessfully;
	};

	return ActionUtil;

});