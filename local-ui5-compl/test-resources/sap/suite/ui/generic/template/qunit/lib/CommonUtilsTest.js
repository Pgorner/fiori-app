/**
 * tests for the sap.suite.ui.generic.template.lib.CommonUtils
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/core/Element",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/lib/CommonUtils",
	"sap/suite/ui/generic/template/genericUtilities/controlHelper",
	"sap/ui/export/util/Filter"
], function(
	sinon,
	Element,
	JSONModel,
	testableHelper,
	CommonUtils,
	controlHelper,
	ExportFilter
) {
	"use strict";

	var sandbox;
	var sFunctionName, oState, oTemplateUtils;
	var sRequestedModelId;
	var sRequestedTextId;
	var sPath;
	var sGlobFunctionName;
	var oEntityType = {
		entityType: "testEntityType",
		"com.sap.vocabularies.UI.v1.Identification": [],
		"com.sap.vocabularies.UI.v1.LineItem": []
	};
	var oEntitySet = {
		name: "STTA_C_MP_Product",
		entityType: oEntityType
	};
	var mPrivateModelData = {
		generic: {
			listCommons : {
				breakoutActionsEnabled: {}
			},
			controlProperties: {}
		}
	};
	var oPrivateModel = new JSONModel(mPrivateModelData);
	var oModelObject = {};
	var oMetaModelObject = {};
	var oManifestActions = {};
	var oExtensions = {};
	var aPages = [];
	var oController = {
		getOwnerComponent : function() {
			return {
				getModel : function(sId) {
					sRequestedModelId = sId;
					return {
						getResourceBundle : function() {
							return {
								getText : function(sId) {
									sRequestedTextId = sId;
								}
							};
						},
						getMetaModel : function() {
							return {
								getODataEntitySet: function(sEntitySet) {
									return oEntitySet;
								},
								getODataEntityType: function(sEntityType) {
									return oEntityType;
								},
								getODataFunctionImport: function(sFunctionName, bBool) {
									return sGlobFunctionName;
								},
								getObject: function(sPath) {
									return oMetaModelObject;
								}
							};
						},
						getObject: function(sPath) {
							return oModelObject;
						}
					};
				},
				getComponentContainer: function(){
					return {
						getElementBinding: function(){
							return {
								getPath: function(){
									return sPath;
								}
							};
						}
					};
				},
				getEntitySet: function() {
					return oEntitySet.name;
				},
				getAppComponent: function() {
					return {
						getConfig: function() {
							return {
									pages: aPages
							};
						}
					};
				},
				getTemplateName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				},
				getForwardNavigationProperty: function() {
					return false;
				}
			};
		},
		getInnerAppState: Function.prototype,
		byId: function (sId) {
			if (sId === "editStateFilter") {
				return {
					getSelectedItem: function () {
						return {
							getText: function () {
								return "All"
							}
						};
					},
					getLabels: function () {
						return [
							{
								getText: function () {
									return "Editing Status"
								}
							}
						];
					},
					getSelectedKey: function () {
						return "0";
					}
				};
			} else if (sId === "template--SmartFilterBar") {
				return oSmartFilterBarWithAnalyticalParameters;
			}
		},
		getMetadata: function () {
			return {
				getName: function() {
					return "sap.suite.ui.generic.template.ListReport.view.ListReport";
				}
			};
		},
		beforeSmartLinkPopoverOpensExtension: function () {
			return false;
		}
	};
	var oComponentRefreshBehaviorParams = Object.create(null);
	var mRefreshBehaviourParams = Object.create(null);
	var mRefreshBehaviourOutput = { component0: { a: 1, b: 2 } };

	var oNavigationHandler = {};
	
	var oServices = {
		oDraftController: {
			isActiveEntity: function(){ return true; }
		},
		oApplication: {
			getBusyHelper: function() {
				return {
					isBusy: function() {
						return false;
					},
					setBusy: Function.prototype
				};
			},
			performAfterSideEffectExecution: function(fnFunction){
				fnFunction();
			},
			getForwardNavigationProperty: function(iViewLevel){
				return "";
			},
			getCurrentKeys: function(iViewLevel){
				return [""];
			},
			getNavigationHandler: function(){
				return oNavigationHandler;
			},
			getComponentRefreshBehaviourInKeepAlive: function() {
				return {};
			},
			getLeaveAppPromise: function () {
				return new Promise(Function.prototype);
			},
			getComponentRefreshBehaviour: function(oOutbound) {
				oComponentRefreshBehaviorParams = oOutbound;
				return mRefreshBehaviourOutput;
			},
			getChevronNavigationRefreshBehaviour: function() {
				return Object.create(null);
			}
		},
		oDataLossHandler: {
			performIfNoDataLoss: function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical){
			}
		},
		oPageLeaveHandler: {
			performAfterDiscardOrKeepDraft: function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical){
			}
		},
		oViewDependencyHelper: {
			setRefreshBehaviour: function(mComponentRefresh) {
				mRefreshBehaviourParams = mComponentRefresh;
			}
		},
		oApplicationController: {
			synchronizeDraftAsync: Function.prototype
		}
	};
	var bIsDraftEnabled;
	var oNavigationContext;
	var oComponentUtils = {
		isDraftEnabled: function(){ return bIsDraftEnabled; },
		getViewLevel: function(){ return 0; },
		navigateAccordingToContext: function(oContext, iDisplayMode, bReplace){
			if (bReplace){
				oNavigationContext = oContext;
			}
		},
		getControllerExtensions: function(){
			return oExtensions;
		},
		getTemplatePrivateModel: function(){
			return oPrivateModel;
		}
	};
	var oSmartFilterBarWithAnalyticalParameters = {
		getAnalyticalParameters: function () {
			return [
				{
					name: "P_KeyDate",
					isMandatory: true,
					type: "Edm.DateTime",
					fieldLabel: "Key Date",
					ui5Type: {}
				},
				{
					name: "P_CompanyName",
					isMandatory: false,
					type: "Edm.String",
					fieldLabel: "Company Name",
					ui5Type: {}
				}
			];
		},
		getUiState: function () {
			return {
				getSelectionVariant:  function () {
					return {
						Parameters: [
							{PropertyName: "P_KeyDate", PropertyValue: "2023-03-22T00:00:00"},
							{PropertyName: "P_CompanyName", PropertyValue: "SAP"},

						]
					}
				}
			}
		}
	}

	var oCommonUtils;
	var oStubForPrivate;

	QUnit.module("lib.CommonUtils", {
		beforeEach : function() {
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
			sandbox = sinon.sandbox.create();
		},
		afterEach : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Dummy", function(assert) {
		assert.ok(true, "Test - Always Good!");
	});

	QUnit.test("Function mergeNavigationKeyPropertiesWithValues with DateTime field", function(assert) {
		var aKeys = [{
			"entitySet": "RevenueSet",
			"aKeys": [{
				"name": "KeyDate",
				"type": "Edm.DateTime"
			}]
		}];
		var oResponse = {
			"KeyDate": new Date(Date.UTC("2024", "03", "01", "12", "12", "12"))
		};
		var sRoute = oCommonUtils.mergeNavigationKeyPropertiesWithValues(aKeys, oResponse);
		assert.strictEqual(sRoute, "/RevenueSet(KeyDate=datetime'2024-04-01T12%3A12%3A12')", "mergeNavigationKeyPropertiesWithValues reads and generates the sRoute correctly when DateTime fields are involved");
	});
	
	QUnit.test("Function semanticObjectLinkNavigation with adaptNavigationParameterExtension", function(assert) {
		var sSelectionVariant = "";
		var sSelectionVariantPrepared;
		var oEventParameters = {
			semanticObject: "SemanticTestObject2",
			semanticAttributesOfSemanticObjects: {
				"": {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711"
				},
				SemanticTestObject: {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711"
				},
				SemanticTestObject2: {
					"Currency": "EUR",
					"Price": "120",
					"ParameterToBeDeleted": "4711",
					"SemanticTestObjectNull": null,
					"SemanticTestObjectUndefined": undefined,
					"SemanticTestObject0": 0,
					"SemanticTestObjectNumber4711": 4711,
					"SemanticTestObjectString4711": "4711"
				}
			},
			semanticAttributes: {
				"Currency": "EUR",
				"Price": "120",
				"ParameterToBeDeleted": "4711"
			}
		};
		var oEvent = {
			getParameters: function() {
				return oEventParameters;
			},
			getSource: function () {
				return {};
			}
		};
		var mSelectionVariantPreparedExpectedResult = {
			SelectOptions: {
				"Currency": [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
				"Price": [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
			},
			Parameters: {
				"SemanticTestObjectNull": "",
				"SemanticTestObjectUndefined": "",
				"SemanticTestObject0": "0",
				"SemanticTestObjectNumber4711": "4711",
				"SemanticTestObjectString4711": "4711"
			}
		};
		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			toJSONString: function() {
				return JSON.stringify(this);
			},
			addParameter: function(sName, sValue) {
				this.Parameters[sName] = sValue;
			},
			removeParameter: function(sName) {
				delete this.Parameters[sName];
			},
			getParameterNames: function() {
				return Object.keys(this.Parameters);
			},
			getParameter: function(sName) {
				return this.Parameters[sName];
			},
			getSelectOption: function(sProperty) {
				return this.SelectOptions[sProperty];
			},
			getSelectOptionsPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			},
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};
		var oObjectInfo = {
			semanticObject : oEventParameters.semanticObject,
			action: ""
		};
		var oNavigationExtensionStub = sandbox.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
			oSelectionVariant.removeParameter("ParameterToBeDeleted");
		});
		function isEmpty(myObject) {
			for(var key in myObject) {
				if (myObject.hasOwnProperty(key)) {
					return false;
				}
			}
			return true;
		};
		sandbox.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function(semanticAttributesOfSemanticObjects, sSelectionVariant) {
				return oSelectionVariant;
		});
		sandbox.stub(oStubForPrivate, "removePropertiesFromNavigationContext", function(oSelectionVariant) {
			return oSelectionVariant;
		});
		sandbox.stub(oNavigationHandler, "processBeforeSmartLinkPopoverOpens", function(eventParameters, selectionVariantPrepared) {
			sSelectionVariantPrepared = selectionVariantPrepared;
		});

		oCommonUtils.semanticObjectLinkNavigation(oEvent, sSelectionVariant, oController);

		assert.ok(oNavigationExtensionStub.calledWith(oSelectionVariant, oObjectInfo), "Navigation extension called with the SelectionVariant and the ObjectInfo");
		assert.ok(!oSelectionVariant.Parameters.ParameterToBeDeleted, "Property ParameterToBeDeleted was removed from Parameters");
		assert.ok(oSelectionVariant.SelectOptions.Currency, "Property Currency is still available in SelectOptions");
		assert.ok(oSelectionVariant.SelectOptions.Price, "Property Price is still available in SelectOptions");
		assert.deepEqual(JSON.parse(sSelectionVariantPrepared), mSelectionVariantPreparedExpectedResult, "SelectionVariant contains expected parameters");
	});

	QUnit.test("Function formatDraftLockText", function(assert) {
		oCommonUtils.formatDraftLockText(true, true, "User");
		assert.strictEqual(sRequestedModelId, "i18n", "only i18n Modell should be retrieved");
		assert.strictEqual(sRequestedTextId, "LOCKED_OBJECT", "Text LOCKED_OBJECT should be retrieved");

		oCommonUtils.formatDraftLockText(true, true);
		assert.strictEqual(sRequestedTextId, "UNSAVED_CHANGES", "Text UNSAVED_CHANGES should be retrieved");

		oCommonUtils.formatDraftLockText(false, true);
		assert.strictEqual(sRequestedTextId, "DRAFT_OBJECT", "Text DRAFT_OBJECT should be retrieved");

		var sText = oCommonUtils.formatDraftLockText(true, false);
		assert.strictEqual(sText, "", "Text should be empty");
	});

	QUnit.test("navigatefromlistitem", function(assert){
		var oContext = { };
		oCommonUtils.navigateFromListItem(oContext, true);
		assert.equal(oNavigationContext, oContext, "Navigate to context as given");
	});

	QUnit.test("navigateExternal", function(assert) {
		var sNavParameters = "json string";
		var oNavigateStub = sinon.stub(oNavigationHandler, "navigate");
		var oNavigateExternalStub = sinon.stub(oServices.oApplication, "navigateExternal");
		var oMixAttributesStub = sinon.stub(oNavigationHandler, "mixAttributesAndSelectionVariant", function() {
			return {
				toJSONString: function() {
					return sNavParameters;
				}
			}
		});
		var oNavigationExtensionStub = sinon.stub(oController, "adaptNavigationParameterExtension", function(oSelectionVariant, oObjectInfo) {
			return;
		});

		sandbox.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			fnProcessFunction();
		});
		sandbox.stub(oServices.oPageLeaveHandler, "performAfterDiscardOrKeepDraft", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			fnProcessFunction();
		});
		var oOutbound = {
			semanticObject: "Semantic Object",
			action: "action",
			parameters: {
				a: "a",
				b: "b"
			}
		};
		oComponentRefreshBehaviorParams = Object.create(null);
		oCommonUtils.navigateExternal(oOutbound, {});

		assert.ok(oMixAttributesStub.calledWith(oOutbound.parameters),
		"Mix attributes called with map containing navigation parameters");
		assert.ok(oNavigateExternalStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null),
		"NavigationHanlder was called with semantic object, action and navigation parameters");

		oOutbound.parameters["sap-ushell-navmode"] = "explace";
		oCommonUtils.navigateExternal(oOutbound, {});

		assert.ok(oNavigateStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null, null, null, "explace"),
		"NavigationHanlder was called with semantic object, action, navigation parameters and navigation mode");

		var oInnerAppState = {
			a: "a"
		};
		var oState = {
			getCurrentAppState: function () {
				return oInnerAppState;
			}
		};
		oCommonUtils.navigateExternal(oOutbound, oState);
		assert.ok(oNavigateExternalStub.calledWith(oOutbound.semanticObject, oOutbound.action, sNavParameters, null),
		"... and with inner app state if provided by state");

		assert.deepEqual(oComponentRefreshBehaviorParams, oOutbound, "setComponentRefreshBehaviour is called with correct parameters");

		oNavigateExternalStub.restore();
		oNavigateStub.restore();
		oMixAttributesStub.restore();
		oNavigationExtensionStub.restore();
	});

	QUnit.test("Function removePropertiesFromNavigationContext - SmartLink Navigation", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return true;
		});

		sandbox.stub(controlHelper, "isSmartTable", function() {
			return false;
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - SmartTable Navigation(IBN)", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function() {
			return true;
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - Link Navigation(IBN)", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(oStubForPrivate, "getOwnerControl", function() {
			return {
				getParent: function() {
					return;
				}
			};
		});

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function() {
			return false;
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - Button Navigation(IBN)", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(oStubForPrivate, "getOwnerControl", function() {
			return {
				getParent: function() {
					return Object.assign({bParent: true}, oControl);
				}
			};
		});

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function(obj) {
			return obj.bParent === true; //To return true the second time this method is called with parent control object. 
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Function removePropertiesFromNavigationContext - Button Navigation(IBN) from Object Page Table", function(assert) {
		var oEntitySet = {
			entityType: "dummyEntityType"
		};
		var oEntityType = {

		};
		var oControl = {
			getEntitySet: function() {
				return "dummyEntitySet";
			},
			getModel : function() {
				return {
					getMetaModel : function() {
						return {
							getODataEntitySet: function(sEntitySet) {
								if (sEntitySet === "STTA_C_MP_Product") {
									return {
										entityType: "STTA_C_MP_ProductType"
									}
								}
								return oEntitySet;
							},
							getODataEntityType: function(sEntityType) {
								if (sEntityType === "STTA_C_MP_ProductType") {
									return {
										bAreControlAndOwnerDifferent: true
									}
								}
								return oEntityType;
							},
							getODataProperty: function(oEntityType, sProperty) {
								if (sProperty == "Price") {
									return {
										"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
											"Bool": true
										}
									};
								}
								if (sProperty == "PhoneNumber") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								if (oEntityType.bAreControlAndOwnerDifferent && sProperty == "Name") {
									return {
										"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
											"Bool": true
										}
									};
								}
								return {};
							}
						};
					}
				};
			}
		};

		var mSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}],
			Price: [{High: null, Low: "120", "Option": "EQ", "Sign": "I"}],
			PhoneNumber: [{High: null, Low: "0000-0000-0000", "Option": "EQ", "Sign": "I"}],
			Name: [{High: null, Low: "ABCD", "Option": "EQ", "Sign": "I"}]
		};
		var oSelectionVariant = {
			Parameters: {},
			SelectOptions: mSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return Object.keys(this.SelectOptions);
			}
		};

		var mExpectedSelectOptions = {
			Currency: [{High: null, Low: "EUR", "Option": "EQ", "Sign": "I"}]
		};

		var oExpectedSelectionVariant = {
			Parameters: {},
			SelectOptions: mExpectedSelectOptions,
			removeSelectOption: function(sProperty) {
				delete this.SelectOptions[sProperty];
			},
			getPropertyNames: function() {
				return this.getParameterNames().concat(this.getSelectOptionsPropertyNames());
			}
		};

		sandbox.stub(oStubForPrivate, "getOwnerControl", function() {
			return {
				getParent: function() {
					return Object.assign({bParent: true}, oControl);
				}
			};
		});

		sandbox.stub(controlHelper, "isSemanticObjectController", function() {
			return false;
		});

		sandbox.stub(controlHelper, "isSmartTable", function(obj) {
			return obj.bParent === true; //To return true the second time this method is called with parent control object. 
		});

		var oSelectionVariant = oCommonUtils.removePropertiesFromNavigationContext(oSelectionVariant, oControl);
		assert.propEqual(oSelectionVariant, oExpectedSelectionVariant, "removePropertiesFromNavigationContext removes properties marked with UI.ExcludeFromNavigationContext and PersonalData.IsPotentiallySensitive");
	});

	QUnit.test("Draft case - Promise from App resolved", function(assert) {
		var bSpyCalled = false;
		var oAppResult = {};
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve(oAppResult);
			});
		};
		var mParameters = {
			"sActionLabel": "Action Name that was executed"
		};
		
		var oDataLossStub = sandbox.stub(oServices.oPageLeaveHandler, "performAfterDiscardOrKeepDraft", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});
		sandbox.stub(oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {
			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			oServices.oApplicationController.synchronizeDraftAsync().then(function() {
				assert.ok(bSpyCalled, "Spy was called");
				assert.ok(oResult instanceof Promise, "returned a promise");
				oResult.then(function(oResult) {
					assert.ok(true, "...that is resolved");
					assert.equal(oResult,oAppResult,"...to the result provided by the app");
					oDataLossStub.restore();
					done();
				}, function() {
					assert.notOk(true, "...that is rejected");
					oDataLossStub.restore();
					done();
				});
			});
		});
	});

	QUnit.test("Draft case - Promise from App rejected", function(assert) {
		var bSpyCalled = false;
		var oAppResult = {};
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				reject(oAppResult);
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		
		var oDataLossStub = sandbox.stub(oServices.oPageLeaveHandler, "performAfterDiscardOrKeepDraft", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});
		sandbox.stub(oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {
			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			oServices.oApplicationController.synchronizeDraftAsync().then(function() {
				assert.ok(bSpyCalled, "Spy was called");
				assert.ok(oResult instanceof Promise, "returned a promise");
				oResult.then(function() {
					assert.notOk(true, "...that is resolved");
					oDataLossStub.restore();
					done();
				}, function(oResult) {
					assert.ok(true, "...that is rejected");
					assert.equal(oResult,oAppResult,"...to the result provided by the app");
					oDataLossStub.restore();
					done();
				});
			});
		});
	});

	QUnit.test("Draft case - no Promise from App", function(assert) {
		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		
		var oDataLossStub = sandbox.stub(oServices.oPageLeaveHandler, "performAfterDiscardOrKeepDraft", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});
		sandbox.stub(oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {
			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			oServices.oApplicationController.synchronizeDraftAsync().then(function() {
				assert.ok(bSpyCalled, "Spy was called");
				assert.ok(oResult instanceof Promise, "returned a promise");
				oResult.then(function() {
					assert.ok(true, "...that is resolved");
					oDataLossStub.restore();
					done();
				}, function() {
					assert.notOk(true, "...that is rejected");
					oDataLossStub.restore();
					done();
				});
			});
		});
	});

	QUnit.test("Non-Draft case without changes - Promise from App resolved", function(assert) {
		bIsDraftEnabled = false;
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return {
						hasPendingChanges: function() {
							return false;
						}
					};
				}
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};
		var oDataLossStub = sinon.stub(oServices.oDataLossHandler, "performIfNoDataLoss", function(fnProcessFunction, fnCancelFunction, sMode, bNoBusyCheck, bIsTechnical) {
			var oRet = fnProcessFunction();
			return Promise.resolve(oRet);
		});	
		sandbox.stub(oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});
		
		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			oServices.oApplicationController.synchronizeDraftAsync().then(function() {
				assert.ok(bSpyCalled, "Spy was called");
				assert.ok(oResult instanceof Promise, "returned a promise");
				oResult.then(function() {
					assert.ok(true, "...that is resolved");
					oDataLossStub.restore();
					done();
				}, function() {
					assert.notOk(true, "...that is rejected");
					oDataLossStub.restore();
					done();
				});
			});
		});
	});
	
/* To be moved to checks of DataLossHandler class

	QUnit.test("Non-Draft case with changes - user confirms - no Promise from App provided", function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossOK();
			});
			return Promise.resolve(oDialogFragment);
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
		setTimeout(function() {

			assert.ok(oDialogFragment.open.called, "Popup was opened");
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes, but no dataloss check requestes - Promise from App resolved",
			function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
			return new Promise(function(resolve, reject) {
				resolve();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"dataloss" : {
					"popup": false
				}
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks
		// are done
		setTimeout(function() {

			// execution
			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				assert.notOk(oServices.oApplication.getDialogFragmentForViewAsync.called, "Dataloss Popup shown");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Non-Draft case with changes - user cancels", function(assert) {
		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossCancel();
			});
			return Promise.resolve(oDialogFragment)
		});
		sandbox.stub(oComponentUtils, "fire");

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);
		setTimeout(function() {
			assert.ok(oDialogFragment.open.called, "Popup was opened");
			assert.notOk(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				done();
			});
		});
	});
	


	QUnit.test("Busy Indicator checked", function(assert) {
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed"
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.notOk(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("No Busy Indicator check requested", function(assert) {
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
		});

		var bSpyCalled = false;
		var fnFunction = function() {
			bSpyCalled = true;
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"busy": {
					"check": false
				}
		};

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are
		// done
		setTimeout(function() {

			var oResult = oCommonUtils.securedExecution(fnFunction, mParameters);

			assert.ok(bSpyCalled, "Spy was called");
			assert.ok(oResult instanceof Promise, "returned a promise");
			oResult.then(function() {
				assert.ok(true, "...that is resolved");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit
	.test(
			"Busy Indicator set (immediately) and restored (after Promise is settled) - Non-Draft case with changes - user confirms - Promise from App rejected",
			function(assert) {
				var oBusyHelper = {};
				sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
					return oBusyHelper;
				});
				var bBusyPromiseResolved = false;
				sandbox.stub(oBusyHelper, "isBusy", function() {
					return false;
				});
				sandbox.stub(oBusyHelper, "setBusy", function(oPromise) {
					oPromise.then(Function.prototype, function() {
						bBusyPromiseResolved = true;
					});
				});

				bIsDraftEnabled = false;
				var oModel = {
						hasPendingChanges: Function.prototype,
						resetChanges: Function.prototype
				};
				sandbox.stub(oController, "getView", function() {
					return {
						getModel: function() {
							return oModel;
						},
						setBindingContext: Function.prototype
					};
				});
				sandbox.stub(oModel, "hasPendingChanges", function() {
					return true;
				});
				sandbox.stub(oModel, "resetChanges");

				var oDialogFragment = {
						getModel: function() {
							return {
								setProperty: Function.prototype
							};
						},
						open: Function.prototype,
						close: Function.prototype
				};

				sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync",
						function(oView, sName, oController) {
					sandbox.stub(oDialogFragment, "open", function() {
						oController.onDataLossOK();
					});
					return Promise.resolve(oDialogFragment);
				});
				sandbox.stub(oComponentUtils, "fire");

				var bSpyCalled = false;
				var fnFunction = function() {
					bSpyCalled = true;
					return new Promise(function(resolve, reject) {
						reject();
					});
				};
				var mParameters = {
						"sActionLabel": "Action Name that was executed"
				};


				var done = assert.async(); // provides a done function to signal the test framework, that all
				// checks are done
				var oResult = oCommonUtils.securedExecution(fnFunction, mParameters)//.then(function (res) {

				assert.ok(oBusyHelper.setBusy.called, "Set busy was called");
				assert.notOk(bBusyPromiseResolved, "Busy Promise resolved");
				setTimeout(function() {
					assert.ok(oDialogFragment.open.called, "Popup was opened");
					assert.ok(bSpyCalled, "Spy was called");
					assert.ok(oResult instanceof Promise, "returned a promise");
					oResult.then(function() {
						assert.notOk(true, "...that is resolved");
						done();
					}, function() {
						assert.ok(true, "...that is rejected");
						assert.ok(bBusyPromiseResolved, "Busy Promise resolved");
						done();
					});

				});
			});
			
*/

	QUnit.test("No setting of Busy Indicator requested", function(assert) {
		var oBusyHelper = {};
		sandbox.stub(oServices.oApplication, "getBusyHelper", function() {
			return oBusyHelper;
		});
		sandbox.stub(oBusyHelper, "isBusy", function() {
			return false;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		bIsDraftEnabled = false;
		var oModel = {
				hasPendingChanges: Function.prototype,
				resetChanges: Function.prototype
		};
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: function() {
					return oModel;
				},
				setBindingContext: Function.prototype
			};
		});
		sandbox.stub(oModel, "hasPendingChanges", function() {
			return true;
		});
		sandbox.stub(oModel, "resetChanges");

		var oDialogFragment = {
				getModel: function() {
					return {
						setProperty: Function.prototype
					};
				},
				open: Function.prototype,
				close: Function.prototype
		};

		sandbox.stub(oServices.oApplication, "getDialogFragmentForViewAsync", function(oView, sName, oController) {
			sandbox.stub(oDialogFragment, "open", function() {
				oController.onDataLossOK();
			});
			return Promise.resolve(oDialogFragment);
		});
		sandbox.stub(oComponentUtils, "fire");
		sandbox.stub(oServices.oApplicationController, "synchronizeDraftAsync", function() {
			return Promise.resolve();
		});

		var fnFunction = function() {
			return new Promise(function(resolve, reject) {
				reject();
			});
		};
		var mParameters = {
				"sActionLabel": "Action Name that was executed",
				"busy": {
					"set": false
				}
		};

		var done = assert.async();
		oCommonUtils.securedExecution(fnFunction, mParameters);
		oServices.oApplicationController.synchronizeDraftAsync().then(function() {
			assert.notOk(oBusyHelper.setBusy.called, "Set busy was called");
			done();
		});
	});

	QUnit.test("Function setComponentRefreshBehaviour", function(assert) {
		var oOutbound = {
			semanticObject: "Semantic Object",
			action: "action"
		};
		oCommonUtils.setComponentRefreshBehaviour(oOutbound);
		assert.deepEqual(mRefreshBehaviourParams, mRefreshBehaviourOutput, "setRefreshBehaviour is called with correct params");
	});

	QUnit.test("Function setExternalChevronRefreshBehaviour", function(assert) {
		var sTableEntitySet = "EntitySet";
		mRefreshBehaviourParams = Object.create(null);
		oCommonUtils.setExternalChevronRefreshBehaviour(sTableEntitySet);
		assert.deepEqual(mRefreshBehaviourParams, Object.create(null), "setRefreshBehaviour is not called");

		var mChevronNavigationOutput = { component0: {a: 1} };
		oServices.oApplication.getChevronNavigationRefreshBehaviour = function() {
			return mChevronNavigationOutput;
		}
		oCommonUtils.setExternalChevronRefreshBehaviour(sTableEntitySet);
		assert.deepEqual(mRefreshBehaviourParams, mChevronNavigationOutput, "setRefreshBehaviour is called with correct params");
	});

	QUnit.test("Function fnGetCustomDataFromEvent", function (assert) {
		var oCustomData = {
			CustomData: "CustomData"
		};
		var oEvent = {
			getSource: function () {
				return {
					data: function () {
						return oCustomData;
					}
				}
			}
		};
		sandbox.stub(controlHelper, "isButton").returns(true);

		var oResult = oCommonUtils.getCustomDataFromEvent(oEvent);

		assert.deepEqual(oResult, oCustomData, "returns the correct custom data for an event originating from button");
	});

	QUnit.test("Function fnGetCustomDataFromEvent", function (assert) {
		var oCustomData = {
			CustomData: "CustomData"
		};
		var oEvent = {
			getSource: Function.prototype
		};
		sandbox.stub(controlHelper, "isButton").returns(false);
		sandbox.stub(Element, "getElementById").returns({
			data: function () {
				return oCustomData;
			}
		});
		sandbox.stub(oController, "createId").returns("");

		var oResult = oCommonUtils.getCustomDataFromEvent(oEvent);

		assert.deepEqual(oResult, oCustomData, "returns the correct custom data for an event originating from command execution");
	});

	//---------  breakout action enabled? ---- applicable-path, action-for ... -----------------------------------------------
	QUnit.module("lib.CommonUtils.fillEnabledMapForBreakoutActions", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection undefined, applicablePath undefined, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt"
				}
			}
		};

		oCommonUtils.fillEnabledMapForBreakoutActions([], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection undefined, applicablePath undefined, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt"
				}
			}
		};
		var aContexts = [];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection false, applicablePath undefined, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : false
				}
			}
		};

		oCommonUtils.fillEnabledMapForBreakoutActions([], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection false, applicablePath undefined, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : false
				}
			}
		};
		var aContexts = [];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath undefined, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true
				}
			}
		};

		oCommonUtils.fillEnabledMapForBreakoutActions([{}], oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath undefined, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true
				}
			}
		};
		var aContexts = [];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath not set, one selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : ""
				}
			}
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath not set, none selected", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : ""
				}
			}
		};
		var aContexts = [];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath true", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : "IsActiveEntity"
				}
			}
		};
		oModelObject = {
			"IsActiveEntity" : true
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), true, "Breakout action should be enabled");
	});
	QUnit.test("Breakout Actions Visibility: requiresSelection true, applicablePath false", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt",
					"requiresSelection" : true,
					"applicablePath" : "IsActiveEntity"
				}
			}
		};
		oModelObject = {
			"IsActiveEntity" : false
		};
		var oContext = {
			getPath: function() {
				return "Test";
			}
		};
		var aContexts = [oContext];

		oCommonUtils.fillEnabledMapForBreakoutActions(aContexts, oController.getOwnerComponent().getModel());
		assert.strictEqual(oPrivateModel.getProperty("/generic/listCommons/breakoutActionsEnabled/VisibilityActionExt/enabled"), false, "Breakout action should not be enabled");
	});
	//---------  action enabled? ---- applicable-path, action-for ... -----------------------------------------------
	QUnit.module("lib.CommonUtils.getBreakoutActionsFromManifest", {
		beforeEach: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		afterEach: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("getBreakoutActionsFromManifest - No Breakouts defined", function(assert) {
		oExtensions = {};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions, undefined, "Breakout action should return undefined");
	});
	QUnit.test("getBreakoutActionsFromManifest - Complete Breakout defined", function(assert) {
		oExtensions = {
			"Actions" : {
				"VisibilityActionExt" : {
					"id" : "VisibilityActionExt"
				}
			}
		};
		var oBreakoutActions = oCommonUtils.getBreakoutActions(oController.getOwnerComponent().getModel());
		assert.strictEqual(oBreakoutActions.VisibilityActionExt.id, "VisibilityActionExt", "Breakout action should not be a breakout object");
	});

	QUnit.module("lib.CommonUtils ObjectPage Self-Linking", {
		beforeEach : function() {
			oStubForPrivate = testableHelper.startTest();
			bIsDraftEnabled = true; // default
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
			sandbox = sinon.sandbox.create();
			oEntitySet = {
					entityType:"CDN_C_STTA_SO_WD_20_CDS.CDN_C_STTA_SO_WD_20Type",
					name: "CDN_C_STTA_SO_WD_20"
			};
			oEntityType = {
					extensions : "",
					key: {
						propertyRef: [{name: "SalesOrder"},{name: "DraftUUID"},{name: "IsActiveEntity"}]
					},
					name: "CDN_C_STTA_SO_WD_20Type",
					namespace: "CDN_C_STTA_SO_WD_20_CDS",
					property: [{name: "DraftUUID", type: "Edm.Guid"},{name: "SalesOrder", type: "Edm.String"},{name: "IsActiveEntity", type: "Edm.Boolean"}],
			};
		},
		afterEach : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Function getNavigationKeyProperties MainObjectPage", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeysExpected = [{name: "SalesOrder", type: "Edm.String"},{name: "DraftUUID", type: "Edm.Guid"},{name: "IsActiveEntity", type: "Edm.Boolean"}];

		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);

		assert.strictEqual(aKeys[0].entitySet, "CDN_C_STTA_SO_WD_20", "EntitySet is correct determined");
		assert.strictEqual(aKeys[0].navigationProperty, undefined, "NavigationProperty is correct determined, it is 'undefined'!");
		for (var i = 0, ilength = aKeys[0].aKeys.length; i < ilength; i++ ) {
			if (aKeys[0].aKeys[i].name === aKeysExpected[i].name) {
				assert.ok(true, "Key.name " + aKeys[0].aKeys[i].name + " and expectedKey.name " + aKeysExpected[i].name + " are equal");
			} else {
				assert.ok(false,  "Key.name " + aKeys[0].aKeys[i].name + " and expectedKey.name " + aKeysExpected[i].name + " are NOT equal");
			}
			if (aKeys[0].aKeys[i].type === aKeysExpected[i].type) {
				assert.ok(true, "Key.type " + aKeys[0].aKeys[i].type + " and expectedKey.type " + aKeysExpected[i].type + " are equal");
			} else {
				assert.ok(false,  "Key.type " + aKeys[0].aKeys[i].type + " and expectedKey.type " + aKeysExpected[i].type + " are NOT equal");
			}
		}
	});

	QUnit.test("Function mergeNavigationKeyPropertiesWithValues MainObjectPage", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);
		var oResponse = {DraftAdministrativeData: null, DraftUUID: "00000000-0000-0000-0000-000000000000", HasActiveEntity: false, HasDraftEntity: false, IsActiveEntity: true,
										SalesOrder: "500000207", SalesOrder3:"0500000120"};
		var sExpectedRoute = "/CDN_C_STTA_SO_WD_20(SalesOrder='500000207',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";

		var sRoute = oCommonUtils.mergeNavigationKeyPropertiesWithValues(aKeys, oResponse);

		assert.strictEqual(sRoute, sExpectedRoute, "NavigationPath is correct determined");
	});

	QUnit.test("Function mergeNavigationKeyPropertiesWithValues passes with correct encoded field name from oData response", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);
		var oResponse = {DraftAdministrativeData: null, DraftUUID: "00000000-0000-0000-0000-000000000000", HasActiveEntity: false, HasDraftEntity: false, IsActiveEntity: true,
										SalesOrder: 'Computer Graphics', SalesOrder3:"0500000120"};
		var sExpectedRoute = "/CDN_C_STTA_SO_WD_20(SalesOrder='Computer%20Graphics',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";

		var sRoute = oCommonUtils.mergeNavigationKeyPropertiesWithValues(aKeys, oResponse);

		assert.strictEqual(sRoute, sExpectedRoute, "NavigationPath is correct determined");
	});

	QUnit.test("Function mergeNavigationKeyPropertiesWithValues fails with wrong encoded field name from oData response", function(assert) {
		var sTargetEntitySet = "CDN_C_STTA_SO_WD_20"
		var oPages = {
				component : {name: "sap.suite.ui.generic.template.ListReport"},
				entitySet: "CDN_C_STTA_SO_WD_20",
				pages: [{component: "sap.suite.ui.generic.template.ObjectPage",entitySet: "CDN_C_STTA_SO_WD_20", navigationProperty: undefined}]
		};
		oController.getOwnerComponent().getAppComponent().getConfig().pages[0] = oPages;
		var aKeys = oCommonUtils.getNavigationKeyProperties(sTargetEntitySet);
		var oResponse = {DraftAdministrativeData: null, DraftUUID: "00000000-0000-0000-0000-000000000000", HasActiveEntity: false, HasDraftEntity: false, IsActiveEntity: true,
										SalesOrder: 'Computer Graphics', SalesOrder3:"0500000120"};
		var sExpectedRoute = "/CDN_C_STTA_SO_WD_20(SalesOrder='Computer Graphics',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";

		var sRoute = oCommonUtils.mergeNavigationKeyPropertiesWithValues(aKeys, oResponse);

		assert.notEqual(sRoute, sExpectedRoute, "NavigationPath is wronly determined");
	});

	QUnit.module("lib.CommonUtils invokeActionsForExtensionAPI function", {
		beforeEach : function() {
			sandbox = sinon.sandbox.create();
			sFunctionName = "test";
			oState = {};
			oTemplateUtils = {};
			oServices = {
				oApplicationController: {
					invokeActions: function() {
						return Promise.resolve({});
					}
				}
			};
			oComponentUtils = {
				isDraftEnabled: function() {
					return true;
				},
				executeBeforeInvokeActionFromExtensionAPI: Function.prototype,
				executeAfterInvokeActionFromExtensionAPI: Function.prototype,
				getBusyHelper: function() {
					return {
						setBusy: Function.prototype
					}
				}
			};
			oCommonUtils = new CommonUtils(oController, oServices, oComponentUtils);
		},
		afterEach : function() {
			sandbox.restore();
		}
	});

	QUnit.test("Function invokeActionsForExtensionAPI test 1", function(assert) {
		var vContext, mUrlParameters, oSettings;
		var executeBeforeInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeBeforeInvokeActionFromExtensionAPI');
		var invokeActionsSpy = sandbox.spy(oServices.oApplicationController, 'invokeActions');
		var executeAfterInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeAfterInvokeActionFromExtensionAPI');
		var oExpectedArgs = [
			sFunctionName,
			[],
			{triggerChanges: true}
		];

		var oPromise = oCommonUtils.invokeActionsForExtensionAPI(sFunctionName, vContext, mUrlParameters, oSettings, oState, oTemplateUtils);
		assert.ok(oPromise instanceof Promise, "invokeActionsForExtensionAPI returned a Promise");
		assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI method is called once");
		assert.ok(invokeActionsSpy.calledOnce, "invokeAcions is called");
		assert.deepEqual(invokeActionsSpy.args[0], oExpectedArgs, "invokeActions is called with correct argumants");

		var done = assert.async();
		setTimeout(function() {
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPI is called once");
			oPromise.then(function(oActualResult) {
				assert.ok(true, "Promise was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
		//cleanup
		executeBeforeInvokeActionFromExtensionAPISpy.restore();
		invokeActionsSpy.restore();
		executeAfterInvokeActionFromExtensionAPISpy.restore();
	});

	QUnit.test("Function invokeActionsForExtensionAPI test 2", function(assert) {
		var vContext = {}, mUrlParameters = {}, oSettings = {bInvocationGroupingChangeSet: true};
		var executeBeforeInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeBeforeInvokeActionFromExtensionAPI');
		var invokeActionsSpy = sandbox.spy(oServices.oApplicationController, 'invokeActions');
		var executeAfterInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeAfterInvokeActionFromExtensionAPI');
		var oExpectedArgs = [
			"test",
			[
			  {}
			],
			{
			  "operationGrouping": "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
			  "triggerChanges": true,
			  "urlParameters": {}
			}
		  ];

		var oPromise = oCommonUtils.invokeActionsForExtensionAPI(sFunctionName, vContext, mUrlParameters, oSettings, oState, oTemplateUtils);
		assert.ok(oPromise instanceof Promise, "invokeActionsForExtensionAPI returned a Promise");
		assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI method is called once");
		assert.ok(invokeActionsSpy.calledOnce, "invokeAcions is called");
		assert.deepEqual(invokeActionsSpy.args[0], oExpectedArgs, "invokeActions is called with correct argumants");

		var done = assert.async();
		setTimeout(function() {
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPI is called once");
			oPromise.then(function(oActualResult) {
				assert.ok(true, "Promise was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
		//cleanup
		executeBeforeInvokeActionFromExtensionAPISpy.restore();
		invokeActionsSpy.restore();
		executeAfterInvokeActionFromExtensionAPISpy.restore();
	});

	QUnit.test("Function invokeActionsForExtensionAPI test 3", function(assert) {
		var vContext = [{},{}], mUrlParameters = {}, oSettings = {bInvocationGroupingChangeSet: true};
		var executeBeforeInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeBeforeInvokeActionFromExtensionAPI');
		var invokeActionsSpy = sandbox.spy(oServices.oApplicationController, 'invokeActions');
		var executeAfterInvokeActionFromExtensionAPISpy = sandbox.spy(oComponentUtils, 'executeAfterInvokeActionFromExtensionAPI');
		var oExpectedArgs = [
			"test",
			[
			  {}, {}
			],
			{
			  "operationGrouping": "com.sap.vocabularies.UI.v1.OperationGroupingType/ChangeSet",
			  "triggerChanges": true,
			  "urlParameters": {}
			}
		  ];

		var oPromise = oCommonUtils.invokeActionsForExtensionAPI(sFunctionName, vContext, mUrlParameters, oSettings, oState, oTemplateUtils);
		assert.ok(oPromise instanceof Promise, "invokeActionsForExtensionAPI returned a Promise");
		assert.ok(executeBeforeInvokeActionFromExtensionAPISpy.calledOnce, "executeBeforeInvokeActionFromExtensionAPI method is called once");
		assert.ok(invokeActionsSpy.calledOnce, "invokeAcions is called");
		assert.deepEqual(invokeActionsSpy.args[0], oExpectedArgs, "invokeActions is called with correct argumants");

		var done = assert.async();
		setTimeout(function() {
			assert.ok(executeAfterInvokeActionFromExtensionAPISpy.calledOnce, "executeAfterInvokeActionFromExtensionAPI is called once");
			oPromise.then(function(oActualResult) {
				assert.ok(true, "Promise was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
		//cleanup
		executeBeforeInvokeActionFromExtensionAPISpy.restore();
		invokeActionsSpy.restore();
		executeAfterInvokeActionFromExtensionAPISpy.restore();
	});

	QUnit.module("lib.CommonUtils.transformTechnicalPropsOnExportedFile", {
		beforeEach: function() {
			oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();
			oTemplateUtils = {
				oComponentUtils: {
					isDraftEnabled: function () {
						return true;
					}
				}
			};	
		},
		afterEach: function() {
			sandbox.restore();
			testableHelper.endTest();
		}
	});

	QUnit.test("Testing the function transformTechnicalPropsOnExportedFile", function (assert) {
		//Setup
		var aFilterSettings = [
			new ExportFilter("ProductCategory", {operator: "==", value: "Monitors"}, "Product Category"),
			new ExportFilter("IsActiveEntity", {operator: "==", value: false}, "Is active"),
			new ExportFilter("SiblingEntity/IsActiveEntity", {operator: "==", value: null}, "Is active")
		];
		//Execution
		oCommonUtils.transformTechnicalPropsOnExportedFile(aFilterSettings);
		//Assertion
		assert.equal(aFilterSettings.length, 2, "Excel sheet's filter settings should contain 2 items");
		assert.equal(aFilterSettings.at(0).property, "ProductCategory", "First filter item is \"ProductCategory\"");
		assert.equal(aFilterSettings.at(1).property, "editStateFilter", "Second filter item is \"editStateFilter\"");
		assert.equal(aFilterSettings.at(1).label, "Editing Status", "Label of second filter item is \"Editing Status\"");
		assert.equal(aFilterSettings.at(1).rawValues.at(0).value, "All", "Value of second filter item is \"All\"");
	});
	
	QUnit.module("lib.CommonUtils.includeEntitySetParametersToExportedFile", {
		beforeEach: function() {
			oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();
		},
		afterEach: function() {
			sandbox.restore();
			testableHelper.endTest();
		}
	});

	QUnit.test("Testing the function includeEntitySetParametersToExportedFile", function (assert) {
		//Setup
		var oSmartTable = {
			getSmartFilterId: function () {
				return "template--SmartFilterBar";
			}
		};
		var aFilterSettings = [];

		//Execution
		oCommonUtils.includeEntitySetParametersToExportedFile(oSmartTable, aFilterSettings);
		//Assertion
		assert.equal(aFilterSettings.length, 2, "Excel sheet's filter settings should contain 2 items");
		assert.equal(aFilterSettings.at(0).property, "P_KeyDate", "First filter item is \"P_KeyDate\"");
		assert.equal(aFilterSettings.at(0).label, "Key Date", "Label of first filter item is \"Key Date\"");
		assert.equal(aFilterSettings.at(1).property, "P_CompanyName", "Second filter item is \"P_CompanyName\"");
		assert.equal(aFilterSettings.at(1).label, "Company Name", "Label of second filter item is \"Company Name\"");
	});
});
