/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.MultipleViewsHandler.js
 */
sap.ui.define([ 
	"sap/ui/model/json/JSONModel",
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/ListReport/controller/MultipleViewsHandler",
	"sap/ui/model/Filter",
	"../../../utils/Utils",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/genericUtilities/controlHelper",
	"sap/ui/core/format/NumberFormat"
	
], function(JSONModel, sinon, MultipleViewsHandler, Filter, Utils, testableHelper, controlHelper, NumberFormat) {
	"use strict";

	var count = 0;
	var oStubForPrivate;
	var bDiffEntitySets = false;
	var aItems = [];
	var sEntitySet = "entitySet";
	var sTableBindingPath = "";
	var bAreDataShownInTable;
	var oConfig = {};
	var sandbox;
	var oBindingParams;
	var aCurrentFilters;
	var oEntityType = {
		properties: "smth",
		"com.sap.vocabularies.UI.v1.SelectionVariant#_tab1": {
			SelectOptions: [{
				PropertyName: {
					PropertyPath: "id"
				},
				Ranges: [{
					Low: {
						value: "S0"
					},
					Option: {
						EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
					}
				}]
			}]
		},
		"com.sap.vocabularies.UI.v1.SelectionVariant#_tab2":{
			SelectOptions: [{
				PropertyName: {
					PropertyPath: "id"
				},
				Ranges: [{
					Low: {
						value: "S0"
					},
					Option: {
						EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
					}
				}, {
					Low: {
						value: "S1"
					},
					Option: {
						EnumMember: "com.sap.vocabularies.UI.v1.SelectionRangeOptionType/EQ"
					}
				}]
			}]
		}
	};
	var oEntitySet = {
		entityType: "entityType"
	};
	var oMetaModel = {
		getODataEntitySet: function() {
			return oEntitySet;
		},
		getODataEntityType: function() {
			return oEntityType;
		}
	};
	var oAppComponent = {
		getConfig: function(){ return oConfig; }
	};
	var oRet = {
		aReadCalls: [], // track the reads
		sEntitySet: sEntitySet,
		//	sEntitySet: "entitySet" + new Date(),
		sSearchValue: { id: "searchValue" }
	};
	var oComponentContainer = {
		getElementBinding: function(){
			return null;
		}
	};
	var oComponent = {
		getAppComponent: function(){ return oAppComponent; },
		getModel: function() {
			return {
				getMetaModel: function() {
					return oMetaModel;
				},
				read: function(sPath, mParameters) {
					oRet.aReadCalls.push({
						path: sPath,
						parameters: mParameters
					});
				}
			};
		},
		getComponentContainer: function(){ return oComponentContainer; },
		getEntitySet: function(){ return sEntitySet; }
	};
	var oSwitchingControl = {
		getItems: function(){
			return aItems;
		},
		getKey: function() {
			return "text";
		},
		getBinding: Function.prototype,
		getBindingInfo: Function.prototype,
		getValue: function() {
			return 'text';
		},
		getEntitySet: function() {
			return sEntitySet;
		},
		getModel: function() {
			return {
				getMetaModel: function() {
					return oMetaModel;
				}
			};
		},
		getTableBindingPath: function(){
			return sTableBindingPath;
		},
		getBindingContext: function() {
			return undefined;
		},
		attachInitialise: Function.prototype,
		attachAfterVariantInitialise: Function.prototype,
		attachBeforeRebindTable: Function.prototype,
		getId: Function.prototype
	};
	var oController = {
		getOwnerComponent: function(){ return oComponent; },
		byId: function(){ return oSwitchingControl; },
		getView: function() {
			return {
				getLocalId: Function.prototype
			};
		}
	};
	
	var oState = {
		oSmartFilterbar: {
			getFilters: function() {
				return {};
			},
			attachSearch: function() {
				return {};
			}
		},
		oIappStateHandler: {
			areDataShownInTable: function(){
				return bAreDataShownInTable;
			},
			changeIappState: function() {
				// nothing
			}
		},
		oWorklistData: {
			bWorkListEnabled: false
		}
	};
	var oTemplatePrivateModel;
	var mSettings = {};
	function getGetKey(sKey){
		return function(){ return sKey; };
	}

	var mSortOrders = {
		"1": { id: "SO" }
	};
	function fnCreateItems(){
		var oVariants = oConfig.pages[0].component.settings && oConfig.pages[0].component.settings.quickVariantSelection && oConfig.pages[0].component.settings.quickVariantSelection.variants || oConfig.pages[0].component.settings && oConfig.pages[0].component.settings.quickVariantSelectionX && oConfig.pages[0].component.settings.quickVariantSelectionX.variants;
		for (var i in oVariants){
			var oVariant = oVariants[i];
			var oItem = {
				getKey: getGetKey(oVariant.key),
				customData: {
					text: oVariant.annotationPath,
					TemplateSortOrder: mSortOrders[i],
					variantAnnotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#" + oVariant.key
				},
				getEntitySet: function() {
					return sEntitySet;
				},
				getModel: function() {
					return {
						getMetaModel: function() {
							return oMetaModel;
						}
					};
				},
				getCustomData: function(sText) {
					return [{
						getKey: function() {
							return "text";
						},
						getBinding: Function.prototype,
						getBindingInfo: Function.prototype,
						getValue: function() {
							return sText;
						}
					}];
				}.bind(null, oVariant.annotationPath),
				getItems: function() {
					return aItems;
				}
			};
			aItems.push(oItem);
		}
	}
	var aSelectionVariantFilters = [new Filter('id', 'EQ', "S0"), new Filter('id', 'EQ', "S0")];
	var oCustomData = [{"p13nDialogSettings":{"filter":{"visible":true}},"headerTitleString":null,"headerTitlePath":"SalesOrder","dateFormatSettings":"{\"UTC\":true,\"style\":\"medium\"}","variantAnnotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#_tab1","text":"Sales Orders","sap.ui.core.Shortcut":[{"shortcutSpec":{"key":"enter","ctrlKey":false,"ctrlRequested":true,"altKey":false,"shiftKey":false,"metaKey":true},"platformIndependentShortcutString":"ctrl+enter","delegate":{}},{"shortcutSpec":{"key":"delete","ctrlKey":false,"ctrlRequested":false,"altKey":false,"shiftKey":false,"metaKey":false},"platformIndependentShortcutString":"delete","delegate":{}}]},{"TemplateSortOrder":mSortOrders[1],"p13nDialogSettings":{"filter":{"visible":true}},"headerTitleString":null,"headerTitlePath":"SalesOrder","dateFormatSettings":"{\"UTC\":true,\"style\":\"medium\"}","variantAnnotationPath":"com.sap.vocabularies.UI.v1.SelectionVariant#_tab2","text":"Sales Orders Items","sap.ui.core.Shortcut":[{"shortcutSpec":{"key":"enter","ctrlKey":false,"ctrlRequested":true,"altKey":false,"shiftKey":false,"metaKey":true},"platformIndependentShortcutString":"ctrl+enter","delegate":{}},{"shortcutSpec":{"key":"delete","ctrlKey":false,"ctrlRequested":false,"altKey":false,"shiftKey":false,"metaKey":false},"platformIndependentShortcutString":"delete","delegate":{}}]}];
	var oTemplateUtils = {
		oComponentUtils: {
			getTemplatePrivateModel: function(){
				return oTemplatePrivateModel;
			},
			getSettings: function() {
				return mSettings;
			}
		},
		oCommonUtils: {
			getElementCustomData: function(oItem){
				return oCustomData[count++];
			},
			getCustomDataText: function(oElement) {
				return Promise.resolve(oElement.getItems()[count-1].customData.text || "RandomText");
			},
			setEnabledToolbarButtons: Function.prototype,
			refreshModel: Function.prototype,
			getMetaModelEntityType: function(sEntitySet) {
				var oMetaModel, oEntitySet, oEntityType;
				oMetaModel = oController.getOwnerComponent().getModel().getMetaModel();
				oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
				oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
				return oEntityType;
			},
			getControlStateWrapper: function(){
				return {
					attachStateChanged: Function.prototype
				}
			}
		},
		oServices: {
			oApplication: {
				getBusyHelper: function () {
					return {
						getBusyDelay: function () {
							return 0; // for the test every asynchronous operation is considered as 'long running'
						}
					};
				}
			},
			oPresentationControlHandlerFactory: {
				getPresentationControlHandler: function () {
					return {
						getEntitySet: function () {
							return sEntitySet;
						},
						getBindingPath: Function.prototype,
						setEnabledToolbarButtons: Function.prototype
					};
				}
			}
		}
	};
	var oVariants = {
		"0": {
			key: "_tab1",
			annotationPath: "com.sap.vocabularies.UI.v1.SelectionVariant#Expensive"
		},
		"1": {
			key: "_tab2",
			annotationPath: "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#Cheap"
		}
	};
	var bShowCounts = true;
	var oQuickVariantSelection = {
		quickVariantSelection: {
			showCounts: bShowCounts,
			variants: oVariants
		}
	};
	var oQuickVariantSelectionX = {
		quickVariantSelectionX: {
			showCounts: bShowCounts,
			variants: oVariants
		}
	};
	if (bDiffEntitySets) {
		oQuickVariantSelectionX.variants[0].entitySet = "entitySet1";
		oQuickVariantSelectionX.variants[1].entitySet = "entitySet2";
	}
	var oSettingsWith2Switches = {
		quickVariantSelection: {
			showCounts: bShowCounts,
			variants: oVariants
		},
		quickVariantSelectionX: {
			showCounts: bShowCounts,
			variants: oVariants
		}
	};
	var oFilter1 = { id: "A", sPath: "A" };
	var oFilter2 = { id: "B", sPath: "B" };
	
	function fnGetEventForRebindTable(assert, aFilters){
		aCurrentFilters = aFilters || [oFilter1, oFilter2];
		oBindingParams = {
			filters: aCurrentFilters.slice() // copy
		};
		var oEvent = {
			getParameter: function(sParam){
				if (assert){
					assert.strictEqual(sParam, "bindingParams", "Only bindingParams must be retrieved from the onBeforeRebindTable event");
				}
				return oBindingParams;
			}
		};
		return oEvent;
	}

	QUnit.module("MultipleViewHandler", {
		beforeEach: function() {
			oConfig.pages = [{
				entitySet: "STTA_C_MP_Product",
				component: {
					name: "sap.suite.ui.generic.template.ListReport",
					list: true,
					settings: mSettings
				}}];
			oTemplatePrivateModel = new JSONModel({
				listReport: {}
			});
			oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();
			sandbox.stub(controlHelper, "isSmartTable", function(){
				return true;
			});
			sandbox.stub(controlHelper, "isSmartChart", function(){
				return false;
			});
			count = 0;
		},
		afterEach: function() {
			aItems = [];
			testableHelper.endTest();
			sandbox.restore();
		}
	});
	QUnit.test("cannot be initialized without parameters", function(assert) {
		try {
			var oMultipleViewHandler = new MultipleViewsHandler();
			assert.notOk(oMultipleViewHandler != null, "oMultipleViewHandler instance creation should not succeed");
		} catch (e) {
			assert.ok(e != null, "oMultipleViewHandler instance creation should fail without parameters");
		}
	});

	QUnit.test("can be initialized", function(assert) {
		try {
			var oMultipleViewHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
			assert.ok(!oStubForPrivate.getGenericMultipleViewsHandler, "GenericMultipleViewsHandler should be undefined if no settings are provided");
			assert.ok(oMultipleViewHandler != null, "oMultipleViewHandler instance creation should succeed");
		} catch (e) {
			assert.notOk("Should not fail");
		}
	});

	QUnit.test("test QuickVariantSelectionX & QuickVariantSelection together", function(assert) {
		try {
			mSettings = oSettingsWith2Switches;
			var oMultipleViewHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
			assert.notOk(oMultipleViewHandler != null, "oMultipleViewHandler instance creation should succeed");
		} catch (e) {
			assert.ok(e != null, "Error should be thrown if both quickVariantSelection & quickVariantSelectionX are provided");
		}
	});

	QUnit.test("onDataRequested with counts lasting long", function (assert) {
		var done = assert.async();

		// ARRANGE
		mSettings = oQuickVariantSelectionX;
		oConfig.pages[0].component.settings = oQuickVariantSelectionX;
		fnCreateItems();
		sandbox.stub(oState.oSmartFilterbar, "getBasicSearchValue", function () {
			return oRet.sSearchValue;
		});
		
		var oMultipleViewsHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
		oStubForPrivate.getImplementingHelper().init = undefined;
		fnGetEventForRebindTable(); // Initialize the oBindingParams
		oStubForPrivate.fnCleanupIrrelevantFilters = sinon.spy(function () {
			return [
				{ "id": "A", "sPath": "A" },
				{ "id": "B", "sPath": "B" },
				{ "id": "C", "sPath": "C" },
				{
					"id": "D",
					"aFilters": [
						{
							"aFilters":
								[
									{ "sPath": "D" }
								]
						}
					]
				}
			];
		});
		oMultipleViewsHandler.getInitializationPromise().then(function() {

			// ACT
			oMultipleViewsHandler.onRebindContentControl(oBindingParams, aCurrentFilters);
			
			// ASSERT
			oMultipleViewsHandler.onDataRequested();
			oRet.aReadCalls[1].parameters.success(); // let the second tab succeed fast
			var sState0 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab1/state");
			var sState1 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab2/state");

			assert.strictEqual(sState0, "busy", "Long running request must have changed the state accordingly");
			assert.strictEqual(sState1, "", "State must not have been changed the state after success");
			oRet.aReadCalls[0].parameters.success(); // now we let the first tab succeed, too
			sState0 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab1/state");
			assert.strictEqual(sState0, "", "State must have been set to success even if success comes late");
			oRet.aReadCalls = []; // now we let the first tab succeed, too
			done();
		});
	});

	QUnit.test("onDataRequested with counts", function(assert) {
		var done = assert.async();

		// ARRANGE
		mSettings = oQuickVariantSelectionX;
		oConfig.pages[0].component.settings = oQuickVariantSelectionX;
		oStubForPrivate.fnCleanupIrrelevantFilters = sinon.spy(function () {
			return [oFilter1, oFilter2];
		});
		fnCreateItems();
		sandbox.stub(oState.oSmartFilterbar, "getBasicSearchValue", function () {
			return oRet.sSearchValue;
		});
		var fnCheckOneReadCall = function (iNumber, bAssumeError) {
			var oCall = oRet.aReadCalls[iNumber];
			assert.strictEqual(oCall.path, "/" + oRet.sEntitySet + "/$count", "Path for read must have been set correctly");
			var mParameters = oCall.parameters;
			assert.deepEqual(mParameters.urlParameters, { search: oRet.sSearchValue }, "url parameter must have been set correctly");
			assert.strictEqual(mParameters.urlParameters.search, oRet.sSearchValue, "Search value must have been passed without modification");
			var aExpectedFilters = aCurrentFilters.slice();
			for (var i = 0; i <= iNumber; i++) {
				if (aSelectionVariantFilters[i]) {
					aExpectedFilters.push(aSelectionVariantFilters[0]);
				}
			}
			assert.deepEqual(mParameters.filters, aExpectedFilters, "Filters must have been set correctly for read");
			assert.strictEqual(mParameters.groupId, undefined, "All read requests must be set with the correct group id");
			var sPath = "/listReport/multipleViews/items/_tab" + (iNumber + 1);
			var oModelEntry = oTemplatePrivateModel.getProperty(sPath);
			assert.strictEqual(oModelEntry.state, "busy", "State must have been set to busy");
			if (bAssumeError) {
				mParameters.error();
				oModelEntry = oTemplatePrivateModel.getProperty(sPath);
				assert.strictEqual(oModelEntry.state, "error", "State must have been set to error");
			} else {
				var iCount = Math.floor(1000 *  Utils.getRandomNumber()); // create a random count
				mParameters.success(iCount);
				oModelEntry = oTemplatePrivateModel.getProperty(sPath);
				assert.strictEqual(oModelEntry.state, "", "State must have been set to loaded");
				assert.strictEqual(oModelEntry.count, iCount, "Count must have been updated accordingly");
			}
		};
		// Now prepare a function that checks whether all calls have been performed correctly
		var fnCheckWhetherReadWasCalledCorrectly = function (count, bAssumeError) {
			var iteration = count || 0;
			assert.strictEqual(oRet.aReadCalls.length, 2, "Exactly two read requests must have been performed");
			fnCheckOneReadCall(iteration, bAssumeError);
			oRet.aReadCalls = []; // reset for next try
		};
		
		var oMultipleViewsHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
		oStubForPrivate.getImplementingHelper().init = undefined;
		fnGetEventForRebindTable(); // Initialize the oBindingParams
		oMultipleViewsHandler.getInitializationPromise().then(function() {
			// ACT
			oMultipleViewsHandler.onRebindContentControl(oBindingParams, aCurrentFilters);

			// ASSERT
			oMultipleViewsHandler.onDataRequested();
			fnCheckWhetherReadWasCalledCorrectly();
			// store the results
			var iCount0 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab1/count");
			var iCount1 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab2/count");
			// Now simulate that the previous requests come back. They must be ignored.
			var oItem0 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab1");
			var oItem1 = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items/_tab2");
			assert.strictEqual(oItem0.count, iCount0, "Count must not have changed by outdated request");
			assert.strictEqual(oItem1.count, iCount1, "Count must not have changed by outdated request");
			assert.strictEqual(oItem0.state + oItem1.state, "busy", "State must not have changed by outdated request");
			done();
		});
	});


	QUnit.test("Determine sort order", function(assert) {
		var done = assert.async();

		// ARRANGE
		mSettings = oQuickVariantSelectionX;
		oConfig.pages[0].component.settings = oQuickVariantSelectionX;
		fnCreateItems();
		var oMultipleViewsHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
		oStubForPrivate.getImplementingHelper().init = sandbox.stub();
		oStubForPrivate.getImplementingHelper().onSelectedKeyChanged = sandbox.stub();
		oStubForPrivate.getImplementingHelper().getRefreshMode = sandbox.stub();
		oMultipleViewsHandler.getInitializationPromise().then(function() {
			// ACT
			var oSortOrder = oMultipleViewsHandler.determineSortOrder();

			// ASSERT
			assert.strictEqual(oSortOrder, undefined, "No sort order defined for the first tab");

			// ARRANGE
			oTemplatePrivateModel.setProperty("/listReport/multipleViews/selectedKey", "_tab2");

			// ACT
			oSortOrder = oMultipleViewsHandler.determineSortOrder();

			// ASSERT
			assert.strictEqual(oSortOrder, mSortOrders["1"], "Correct order set in second tab");
			
			// ARRANGE
			// change back the selected item
			oTemplatePrivateModel.setProperty("/listReport/multipleViews/selectedKey", "_tab1");

			// ACT
			oSortOrder = oMultipleViewsHandler.determineSortOrder();

			// ASSERT
			assert.strictEqual(oSortOrder, undefined, "Again no sort order defined for the first item");
			done();
		});
	});

	QUnit.test("Model initialization", function(assert) {
		var done = assert.async();
		
		// ARRANGE
		mSettings = oQuickVariantSelection;
		oConfig.pages[0].component.settings = oQuickVariantSelection;
		oState.oPresentationControlHandler = {
			getEntitySet: function () {
				return sEntitySet;
			}
		};
		fnCreateItems();

		// ACT
		// Test checks the initialization of the MultipleViewsHandler object
		var oMultipleViewsHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
		oStubForPrivate.getImplementingHelper().init = sandbox.stub();
		oMultipleViewsHandler.getInitializationPromise().then(function() {
			// It is important to have a Timeout as the initialization of model
			// is done on promise chain in async manner.
			setTimeout(function() {
				// ASSERT
				var mModelProperties = oTemplatePrivateModel.getProperty("/listReport/multipleViews/items");
				var oProperties = mModelProperties._tab1;

				assert.strictEqual(oProperties.count, 0, "Count for " + "_tab1" + " must be initialized with 0");
				assert.strictEqual(oProperties.state, "", "State for " + "_tab1" + " must be initialized with ''");
				assert.strictEqual(oProperties.text, "com.sap.vocabularies.UI.v1.SelectionVariant#Expensive", "Text for " + "_tab1" + " must be initialized correctly");
				
				oProperties = mModelProperties._tab2;
				assert.strictEqual(oProperties.count, 0, "Count for " + "_tab2" + " must be initialized with 0");
				assert.strictEqual(oProperties.state, "", "State for " + "_tab2" + " must be initialized with ''");
				assert.strictEqual(oProperties.text, "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#Cheap", "Text for " + "_tab2" + " must be initialized correctly");
				
				done();
			}, 1);
		});
	});

	QUnit.test("IappStateChange", function (assert){
		var done = assert.async();
		
		// ARRANGE
		mSettings = oQuickVariantSelection;
		oConfig.pages[0].component.settings = oQuickVariantSelection;
		oState.oPresentationControlHandler = {
			getEntitySet: function () {
				return sEntitySet;
			},
			getBindingPath: Function.prototype,
			setEnabledToolbarButtons: Function.prototype
		};
		fnCreateItems();
		var oChangeIappStateSpy = sandbox.spy(oState.oIappStateHandler, "changeIappState");
		var oMultipleViewsHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
		oStubForPrivate.getImplementingHelper().init = sandbox.stub();
		oMultipleViewsHandler.getInitializationPromise().then(function() {
			// ACT
			// First run: Assume that data are currently not shown in the table
			oTemplatePrivateModel.setProperty("/listReport/multipleViews/selectedKey", "_tab2");

			// ASSERT
			assert.ok(oChangeIappStateSpy.calledOnce, "IAppState must have been adapted");
			assert.ok(oChangeIappStateSpy.calledWithExactly(false), "AppState must have been changed correctly");

			done();
		});
	});

	QUnit.test("formatItemTextForMultipleView", function(assert) {
		var done = assert.async();

		// ARRANGE
		mSettings = oQuickVariantSelectionX;
		oConfig.pages[0].component.settings = oQuickVariantSelectionX;
		fnCreateItems();
		var oMultipleViewsHandler = new MultipleViewsHandler(oState, oController, oTemplateUtils);
		oStubForPrivate.getImplementingHelper().init = sandbox.stub();
		oMultipleViewsHandler.getInitializationPromise().then(function() {
			// ACT
			var oText =	oMultipleViewsHandler.formatItemTextForMultipleView();

			// ASSERT
			assert.strictEqual(oText, "", "Empty text must be returned if no item is provided");

			// ARRANGE
			var aTexts = [];
			sandbox.stub(oTemplateUtils.oCommonUtils, "getText", function(sKey, vParam){
				var oRet = {
					key: sKey,
					params: vParam
				};
				aTexts.push(oRet);
				return oRet;
			});

			sandbox.stub(NumberFormat, "getIntegerInstance", function(sMode) {
				var oIntegerInstance = {
						format: function(sValue) {
							return "#" + sValue;
						}};
				return oIntegerInstance;
			});

			var fnCheckText = function(oTextObject, sExpectedKey, vExpectedParams){
				assert.strictEqual(oTextObject.key, sExpectedKey, "Correct text key must be used");
				assert.deepEqual(oTextObject.params, vExpectedParams, "Correct params must be used");
				var bIsTextObject = false;
				for (var i = 0; i < aTexts.length && !bIsTextObject; i++){
					bIsTextObject = oTextObject === aTexts[i];
				}
				assert.ok(bIsTextObject, "The return value of the formatter must be a valid retrun value of method getText");
			};

			// ACT
			oText =	oMultipleViewsHandler.formatItemTextForMultipleView({
				state: "busy",
				text: "myEntity",
				count: 17
			});

			// ASSERT
			fnCheckText(oText, "SEG_BUTTON_TEXT", ["myEntity", "#17"]);

			// ACT
			oText =	oMultipleViewsHandler.formatItemTextForMultipleView({
				state: "busyLong",
				text: "myEntity",
				count: 17
			});

			// ASSERT
			fnCheckText(oText, "SEG_BUTTON_TEXT", ["myEntity", "..."]);

			// ACT
			oText = oMultipleViewsHandler.formatItemTextForMultipleView({
				state: "",
				text: "myEntity1",
				count: 25
			});

			// ASSERT
			fnCheckText(oText, "SEG_BUTTON_TEXT", ["myEntity1", "#25"]);

			// ACT
			oText =	oMultipleViewsHandler.formatItemTextForMultipleView({
				state: "error",
				text: "myEntity2"
			});

			// ASSERT
			fnCheckText(oText, "SEG_BUTTON_ERROR", "myEntity2");

			done();
		});
	});

	// Produces an Event for the rebindTable. If aFilters is filled they are used. Otherwise [oFilter1, oFilter2] is used.
	function fnGetEventForRebindContentControl(assert, aFilters){
		aCurrentFilters = aFilters || [oFilter1, oFilter2];
		oBindingParams = {
			filters: aCurrentFilters.slice() // copy
		};
		var oEvent = {
			getParameter: function(sParam){
				if (assert){
					assert.strictEqual(sParam, "bindingParams", "Only bindingParams must be retrieved from the onRebindContentControl event");
				}
				return oBindingParams;
			}
		};
		return oEvent;
	}


});
