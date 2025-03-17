/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.IappStateHandler.js
 */
sap.ui.define([ "testUtils/sinonEnhanced",
                 "sap/suite/ui/generic/template/genericUtilities/testableHelper",
				 "sap/suite/ui/generic/template/genericUtilities/controlHelper",
                 "sap/suite/ui/generic/template/ListReport/controller/IappStateHandler",
                 "sap/fe/navigation/SelectionVariant",
				 "sap/base/util/extend",
				 "sap/base/util/isEmptyObject",
				 "sap/base/util/deepEqual"
                 ], function(sinon, testableHelper, controlHelper, IappStateHandler, SelectionVariant, extend, isEmptyObject, deepEqual){
	"use strict";

	// stubs for controls with stateWrappers. Currently, controlStateWrapperFactory relies on controlHelper to identify these controls, therefore we stub controlHelper.
	// Needed during initialization (in getMethods), thus in every module. To avoid need of same code in every module, stub them already here. Disadvantage: sandbox not used
	// (sandbox is only created per module), control cannot be overridden as a whole (still single methods can be), controlHelper methods cannot be stubbed again
	// (of course, 1. disadvantage could be overcome by either creating sandbox already here (contradicting modularization of tests) or by encapsulating this to a function to 
	// provide the stubs. However, maybe the better approach would be to decouple from controlStateWrapperFactory completely (or as far as we want to decouple from the controls)?)
	// TODO: would it make more sense to decouple from wrappers here?
	var oSmartTable = {
			getEnableAutoBinding: Function.prototype,
			getId: Function.prototype,
			attachInitialise: Function.prototype,
			attachAfterVariantInitialise: Function.prototype,
			attachBeforeRebindTable: Function.prototype
		};
	var oDynamicPage = {
			attachPinnedStateChange: function() {
				return;
			},
			setHeaderPinned: Function.prototype,
			getId: function(){return "page";}
		};
	var oSmartVariantManagement = {
			currentVariantSetModified: Function.prototype,
			getId: function(){return "template::PageVariant";},
			getDefaultVariantId: function(){return "";},
			setCurrentVariantId: Function.prototype,
			setExecuteOnStandard: Function.prototype,
			getExecuteOnStandard: Function.prototype
		};
	
	sinon.stub(controlHelper, "isSmartTable", function(oControl){
		return oControl === oSmartTable;
	});
	sinon.stub(controlHelper, "isDynamicPage", function(oControl){
		return oControl === oDynamicPage;
	});
	sinon.stub(controlHelper, "isSmartVariantManagement", function(oControl){
		return oControl === oSmartVariantManagement;
	});
	// end of stubs for controls with wrappers
	
	var bSmartVariantManagement = false;
	var annotationPath;
	var bExecuteOnSelect = false;
	var bSuppressSelection;
	var filter = {
		getName: function(){
			return "P_DisplayCurrency";
		}
	};
	var filter2 ={
		getName: function(){
			return "SalesOrderID";
		}
	}
	var oState = {
		oSmartFilterbar: {
			getLiveMode: Function.prototype,
			attachFiltersDialogClosed: Function.prototype,
			setSuppressSelection: function(bSuppress){
				bSuppressSelection = bSuppress;
			},
			determineMandatoryFilterItems: function(){
				return [filter];
			},
			getUiState: function(){
				return {
					getSelectionVariant: function() {
						var oSFBSelectionVariant = new SelectionVariant().toJSONObject();
						return oSFBSelectionVariant;
					},
					getSemanticDates: function() {
						return {};
					}
				}
			},
			getAnalyticalParameters: function() {
				return [];
			},
			addCustomData: Function.prototype,
			setUiState: Function.prototype,
			isCurrentVariantStandard: function(){
				return true;
			},
			isCurrentVariantExecuteOnSelectEnabled: function(){
				return false;
			},
			getSmartVariant: function(){
				return oSmartVariantManagement;
			},
			getFiltersWithValues: function(){
				return [filter];
			},
			search: Function.prototype,
			isDialogOpen: function(){
				return false;
			},
			fireFilterChange: Function.prototype,
			attachAfterVariantLoad: Function.prototype,
			attachAfterVariantSave: Function.prototype,
			refreshFiltersCount: Function.prototype,
			attachSearch: Function.prototype,
			attachFilterChange: Function.prototype,
			checkSearchAllowed: Function.prototype
		},
		oSmartTable: oSmartTable,
		oWorklistData: {
			bWorklistEnabled: false
		},
		oMultipleViewsHandler: {
			setControlVariant: Function.prototype,
			getEnableAutoBinding: function(){
				return false;
			},
			getOriginalEnableAutoBinding: function(){
				return null;
			},
			getPreferredKey: function(){
				return "";
			},
			handleStartUpObject: Function.prototype,
			getMode: Function.prototype,
			getSelectedKeyPropertyName: Function.prototype,
			getContentForIappState: Function.prototype,
			getGeneralContentStateWrapper: Function.prototype,
			getSFBVariantContentStateWrapper: Function.prototype
		}
	};
	var oEditStateFilter = {};
	var oComponent = {
		getSmartVariantManagement: function(){
			return bSmartVariantManagement;
		},
		getAnnotationPath: function() {
			return annotationPath;
		},
		getEntitySet: Function.prototype,
		getModel: function(){
			return {
				getMetaModel: function(){
					return {
						getODataEntitySet: function(){
							return {
								entityType: ""
							}
						},
						getODataEntityType: function(){
							return {
								property: []
							}
						}
					};
				},
				setProperty: Function.prototype
			};
		},
		getDataLoadSettings: Function.prototype,
		getVariantManagementHidden: Function.prototype
	};

	var oController = {
		getOwnerComponent: function(){
			return oComponent;
		},
		byId: function(sId){
			if (sId === "editStateFilter"){
				return oEditStateFilter;
			} else if (sId === "page") {
				return oDynamicPage;
			} else if (sId === "listReportFilter") {
				return oState.oSmartFilterbar;
			} else if (sId === "listReport") {
				return oSmartTable;
			} else if (sId === "template::PageVariant") {
				return oSmartVariantManagement;
			} else if (sId === "Table::Toolbar::SearchField") {
				return undefined; // no tests for worklist in this class
			}
			throw new Error("Only EditStateFilter, DynamicPage, SFB, SmartTable, SmartVariantManagement or SearchField must be looked up");
		},
		restoreCustomAppStateDataExtension: Function.prototype,
		modifyStartupExtension: Function.prototype,
		getView: function(){
			return {
				getLocalId: Function.prototype
			}
		}
	};
	var bParseUrlFails = false;
	var oAppData, oAppDataLib, oURLParameters, sNavType;
	var oParseNavigationPromise = {
			done: Function.prototype,
			fail: Function.prototype
	};
	var oNavigationHandler = {
		parseNavigation: function(){
			return oParseNavigationPromise;
		}
	};

	// preliminary solution to support relying on model data
	// should be refactored (adapt whole iAppStateHandlerTest to comply to QUnit guidelines) 
	var oTemplatePrivateModelData = Object.create(null);
	
	var oTemplateUtils = {
		oServices: {
			oApplication: {
				getNavigationHandler: function () {
					return oNavigationHandler;
				}
			}
		},
		oComponentUtils : {
			getTemplatePrivateModel: function () {
				return {
					setProperty: function(sProperty, vValue){
						oTemplatePrivateModelData[sProperty] = vValue;
					},
					getProperty: function(sProperty){
						return oTemplatePrivateModelData[sProperty];
					}
				}
			},
			getTemplatePrivateGlobalModel: function () {
				return {
					setProperty: Function.prototype,
					getProperty: Function.prototype
				}
			},
			getSettings: function () {
				return {}
			},
			hidePlaceholder: Function.prototype,
			stateChanged: Function.prototype,
			isDraftEnabled: Function.prototype,
			isStateHandlingSuspended: Function.prototype,
			getSelectionInfo: Function.prototype
		},
		oCommonUtils: {
			getControlStateWrapper: function(){
				return {
					attachStateChanged: Function.prototype,
					setState: Function.prototype,
					setHeaderState: Function.prototype
				};
			}
		}
	}

	var sandbox;
	var oStubForPrivate;
	var oIappStateHandler;

	QUnit.module("Initialization", {
		beforeEach : function() {
			sandbox = sinon.sandbox.create();
			oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		},
		afterEach : function() {
			bSmartVariantManagement = false;
			sandbox.restore();
		}
	});

	QUnit.test("Constructor", function(assert) {
		assert.ok(!!oIappStateHandler, "Constructor could be called");
		assert.ok(bSuppressSelection, "Selection must be supressed initially");
	});

// Not a valid test:
// - What's the use in testing that a handler is registered for a specific event?
// - If the handler is needed, there must be reason for it - we should rather analyze the purpose, and write a test checking the same. If the same is achieved by different means, ideally the test
//		should not fail
	
//	QUnit.test("Complete initialization", function(assert) {
//		var oSpy = sandbox.stub(oState.oSmartFilterbar, "attachFiltersDialogClosed", function(fnDialogClosed){
//			assert.strictEqual(typeof fnDialogClosed, "function", "A function must be registered as handler");
//		})
//		oIappStateHandler.onSmartFilterBarInitialise();
//		assert.ok(oSpy.calledOnce, "Exactly one handler must be registered")
//	});

	QUnit.module("Parse url", {
		beforeEach : function() {
			bParseUrlFails = false;
			bExecuteOnSelect = false;
			sandbox = sinon.sandbox.create();
		},
		afterEach : function() {
			bSmartVariantManagement = false;
			sandbox.restore();
		}
	});

	QUnit.test("parse Navigation fails", function(assert) {
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		var done = assert.async();
		var oSpy = sandbox.stub(oParseNavigationPromise, "fail", function(fnFail){
			fnFail({getErrorCode: Function.prototype}, {});
		});
		sandbox.stub(oState.oSmartFilterbar, "checkSearchAllowed", function(){
			return true;
		});
		oIappStateHandler.onSmartFilterBarInitialized();
		var oNavigationPromise = oIappStateHandler.applyState();
		oNavigationPromise.then(function(){
			assert.ok(oSpy.calledOnce, "Failure of NaviagtionHandler to parse URL does not lead to error of iAppstateHandler");
			done();
		});
	});

	QUnit.test("parse Navigation success no auto select", function(assert) {
		sandbox.stub(oState.oSmartFilterbar, "checkSearchAllowed", function(){
			return true;
		});
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		var done = assert.async();
		var oSpy = sandbox.stub(oParseNavigationPromise, "done", function(fnDone){
			fnDone({}, {}, sap.fe.navigation.NavType.initial);
		});
		
		oIappStateHandler.onSmartFilterBarInitialized();
		var oNavigationPromise = oIappStateHandler.applyState();
		oNavigationPromise.then(function(){
			assert.ok(oSpy.calledOnce, "Success is called correctly");
			done();
		});
	});

	QUnit.test("parse Navigation success with auto select", function(assert) {
		var done = assert.async();
		sandbox.stub(oSmartVariantManagement, "getExecuteOnStandard", function(){
			return true;
		});
		sandbox.stub(oState.oSmartFilterbar, "checkSearchAllowed", function(){
			return true;
		});
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		var oSearchSpy = sandbox.spy(oState.oSmartFilterbar, "search");
		sandbox.stub(oParseNavigationPromise, "done", function(fnDone){
			fnDone({}, {}, sap.fe.navigation.NavType.initial);
		});
		
		oIappStateHandler.onSmartFilterBarInitialized();
		var oNavigationPromise = oIappStateHandler.applyState();
		oNavigationPromise.then(function(){
			assert.ok(oSearchSpy.calledOnce, "Search should be triggered Mandatory fields are filled.");
			done();
		});
	});

	QUnit.module("Data Load Tests", {
		beforeEach: function(){
			oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();
		},
		afterEach : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Don't trigger search when mandatory filters are not filled", function(assert) {
		var done = assert.async();
		var oSearchSpy = sandbox.spy(oState.oSmartFilterbar, "search");
		var oSetExecuteOnStandardSpy = sandbox.spy(oSmartVariantManagement, "setExecuteOnStandard");
		sandbox.stub(oState.oSmartFilterbar, "checkSearchAllowed", function(){
			return false;
		});
		sandbox.stub(oTemplateUtils.oComponentUtils,"getSettings", function(){
			return {
				"dataLoadSettings": {
					"loadDataOnAppLaunch":"always"
				}
			}
		});
		
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		sandbox.stub(oParseNavigationPromise, "done", function(fnDone){
			fnDone({}, {}, sap.fe.navigation.NavType.initial);
		});
		
		oIappStateHandler.onSmartFilterBarInitialized();
		var oNavigationPromise = oIappStateHandler.applyState();
		oNavigationPromise.then(function(){
			// The original test (that the search is not triggered) is actually passing just because the (stubbed as Function.prototype) method getExecuteOnStandard of SmartVariantManagement returns falsy.
			// In real world, it returns what we have set before with setExecuteOnStandard, unless the user has changed (by setting/unsetting the flag for standard variant in manage variants dialog).
			// Thus, spying setExecuteOnStandard to check correct behavior for now.
			// TODO: Separate tests for setting the flag correct and triggering search correct depending on user's setting.
			assert.ok(!oSearchSpy.calledOnce, "Search should not be triggered Mandatory fields are not filled.");
			assert.ok(oSetExecuteOnStandardSpy.calledWith(false), "SmartVariantManagement.setExecuteOnStandard should be called with 'false' to indicate, that no automatic selection would be executed (unless user chnages the setting)");
			done();
		});
	});

	QUnit.test("Consider manifest settings in Live Mode Custom Variant", function(assert){
		var done = assert.async();
		var oSearchSpy = sandbox.spy(oState.oSmartFilterbar, "search");
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantStandard", function(){
			return false;
		});
		sandbox.stub(oState.oSmartFilterbar, "checkSearchAllowed", function(){
			return true;
		});
		sandbox.stub(oTemplateUtils.oComponentUtils,"getSettings", function(){
			return {
				"dataLoadSettings": {
					"loadDataOnAppLaunch":"always"
				}
			}
		});
		oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		sandbox.stub(oParseNavigationPromise, "done", function(fnDone){
			fnDone({}, {}, sap.fe.navigation.NavType.initial);
		});
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantExecuteOnSelectEnabled", function(){
			return true;
		});
		
		oIappStateHandler.onSmartFilterBarInitialized();
		var oNavigationPromise = oIappStateHandler.applyState();
		oNavigationPromise.then(function(){
			assert.ok(oSearchSpy.calledOnce, "Search should be triggered for custom variant in live mode for manifest settings always");
			done();
		});
	});

// TODO: rework to test new method applyInitialLoadBehavior instead
//	QUnit.module("Tests for getInitialLoadBehaviourSettings", {
//		beforeEach: function(){
//			oStubForPrivate = testableHelper.startTest();
//			sandbox = sinon.sandbox.create();
//			// instantiating iAppStateHandler is needed to add the private testable method getInitialLoadBehaviourSettings to stubForPrivate - but as
//			// only this private method is tested here, the instance of iAppstateHandler itself is not needed
//			new IappStateHandler(oState, oController, oTemplateUtils);
//		},
//		afterEach : function() {
//			testableHelper.endTest();
//			sandbox.restore();
//		}
//	});
//	
//	QUnit.test("getInitialLoadBehaviourSettings function test ", function(assert) {
//		oState.bLoadListAndFirstEntryOnStartup = true;
//		var bResult = oStubForPrivate.getInitialLoadBehaviourSettings(true);
//		assert.equal(bResult, true, "returns correct value for data load case in master detail mode");
//
//		oState.bLoadListAndFirstEntryOnStartup = false;
//		var bResult = oStubForPrivate.getInitialLoadBehaviourSettings(true);
//		assert.equal(bResult, true, "returns correct value for data load case with default [ifAnyFilterExist] manifest settings");
//
//		var bResult = oStubForPrivate.getInitialLoadBehaviourSettings(false);
//		assert.equal(bResult, true, "returns correct value for apply automatically case with default [ifAnyFilterExist] manifest settings");
//
//		sandbox.stub(oState.oMultipleViewsHandler, "getOriginalEnableAutoBinding").returns(false);
//		var bResult = oStubForPrivate.getInitialLoadBehaviourSettings(false);
//		assert.equal(bResult, false, "returns correct value for apply automatically case with default [ifAnyFilterExist] manifest settings");
//	});

	QUnit.module("Parse URL: set Filterbar", {
		beforeEach: function(){
			oStubForPrivate = testableHelper.startTest();
			sandbox = sinon.sandbox.create();
			oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils);
		},
		afterEach : function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	function configurableTest(assert, oIAppState, oNavigationParameterURL, oNavigationParameterXAppState, oUserDefaultVariant, oUserDefaultValues, oBackendDefaultValues, aFilterItemNames){
		/*
		 * currently there are 6 different known sources for filter values in SFB on startup of the app, some with different
		 * flavors:
		 * - iAppState: Any kind of back navigation or restoring a app to an older state by navigating to the URL
		 * 		stored at that time
		 * - navigationParameters: parameters given in any (forward) cross app navigation. There are two
		 * 		flavors:
		 * 		a) URLParameters: parameters given directly in the URL
		 * 		b) xAppState: navigation parameters encapsulated by an xAppState
		 * - userDefaultVariant: Parameters stored in a variant that the user marked as default. This
		 * 		information is stored in LREP
		 * 		=> As although delivered standard variants are using the same mechanism, the
		 * 				current assumption is, that they are handled the same way
		 * - userDefaultValues: In FLP (with some special preconditions) the user can set values for specific parameters
		 * 		that should be used for all apps
		 * - backendStandardVariant (not yet supported): A standard variant defined via annotations in the backend
		 * - backendDefaultValues: Default values for single properties defined via annotations in the backend
		 *
		 * Some of these support only single values, while others support full-fledged select options.
		 * If several of these sources contain values, the SFB should be filled according to the decision tree blow.
		 * "|" means property wise or, with priority from left to right (i.e. take the value for each property from the
		 * first place where it's specified)
		 *
		 * iAppState given?
		 * -> yes: use only the values from iAppstate
		 * -> no: navigationParameters given?
		 * 				-> yes: userDefaultVariant given?
		 * 								-> yes: use navigationParameters | userDefaultVariant
		 * 								-> no: use navigationParameters | userDefaultValues | backendStandardVariant | backendDefaultValues
		 * 				-> no: userDefaultVariant given?
		 * 								-> yes: use userDefaultVariant
		 * 								-> no: use userDefaultValues | backendStandardVariant | backendDefaultValues
		 */

//		preparation
//		data needed to provide in stubs
		var oSFBSelectionVariant = new SelectionVariant();
//		data set in stubs
		var aSFBAdvancedArea = [];
		var sSFBUiStateSelectionVariant;
		var oSFBUiStateSemanticDates;
		var oSFBUiStateProperties;
//		data to be checked
		var aSFBAdvancedAreaExpected = [];
//		needed stubs
		sandbox.stub(oState.oSmartFilterbar, "addFieldToAdvancedArea", function(sField){
			aSFBAdvancedArea.push(sField);
		});
		sandbox.stub(oState.oSmartFilterbar, "checkSearchAllowed", function(){
			return true;
		});
//      variable to check if DisplayCurrency is there and value is comming from flp
		var flpValueforDisplayCurrency = false;
		sandbox.stub(oState.oSmartFilterbar, "clearVariantSelection");
		sandbox.stub(oState.oSmartFilterbar, "clear");
		sandbox.stub(oState.oSmartFilterbar, "getUiState", function(){
			return {
				getSelectionVariant : function(){
					return oSFBSelectionVariant;
				},
				getSemanticDates: function() {
					return {};
				}
			};
		});
		sandbox.stub(oState.oSmartFilterbar, "setUiState", function(oUiState, mProperties){
			sSFBUiStateSelectionVariant = oUiState.getSelectionVariant();
			oSFBUiStateProperties = mProperties;
			oSFBUiStateSemanticDates = oUiState.getSemanticDates();
		});
		sandbox.stub(oState.oSmartFilterbar, "isCurrentVariantStandard", function(){
			return true;
		});
		sandbox.stub(oState.oSmartFilterbar, "getAllFilterItems", function() {
			return (aFilterItemNames && aFilterItemNames.length) ? aFilterItemNames.map(function(sFilterItemName) { return { getName: function() { return sFilterItemName; } } }) : [];
		});
		sandbox.stub(oState.oMultipleViewsHandler, "getEnableAutoBinding", function(){
			return false;
		});
		var bExecuteOnStandardDefault; // default value for "executeOnSelect" for the standard variant determined according to manifest settings and provided filters
		sandbox.stub(oSmartVariantManagement, "setExecuteOnStandard", function(bExecute){
			bExecuteOnStandardDefault = bExecute;
		});
		sandbox.stub(oSmartVariantManagement, "getExecuteOnStandard", function(){
			// return the default value set with setExecuteOnStandard. This corresponds to the case the user has not changed the flag. 
			// If the user has changed the flag (which would be stored on lrep by VM in real world), the flag should be returned as set by the user. To test the same, a new parameter should be introduced.
			return bExecuteOnStandardDefault;
		});

		var oSearchSpy = sandbox.spy(oState.oSmartFilterbar, "search");
		var iExpectedSearchCount = 1; // default

		// default values, if none of the sources contains values
		oAppData = {
			oDefaultedSelectionVariant: new SelectionVariant(),
			oSelectionVariant: new SelectionVariant(),
			semanticDates: {},
			customData: {}
		};
		oURLParameters = {};
		sNavType = sap.fe.navigation.NavType.initial;
		
		// make promise from NavigationHandler return these values
		sandbox.stub(oParseNavigationPromise, "done", function(fnDone){
			fnDone(oAppData, oURLParameters, sNavType);
		});
		
//		checks: methods from SFB should only be called if needed:
		var bSFBaddFieldToAdvancedAreaCalled = false;
		var bSFBsetUiStateCalled = false;
		// since modifyStartup extension is called, UI state is retrieved in startup case
		var bSFBgetUiStateCalled = true;
		var bSFBisCurrentVariantStandardCalled = false;
		var bMVgetEnableAutoBindingCalled = false;


//		default values provided in the different sources are reflect differently:
//		userDefaultVariant: not provided in interface, but already applied to SFB
		for( var sProp in oUserDefaultVariant){
			oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultVariant[sProp]);
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = true;
		}

//		backendDefaultValues: not provided in interface, but already applied to SFB, but only if no userDefaultVariant exists
		if (!oUserDefaultVariant || isEmptyObject(oUserDefaultVariant)){
			for( var sProp in oBackendDefaultValues){
				oSFBSelectionVariant.addSelectOption(sProp, "I", "EQ", oBackendDefaultValues[sProp]);
				bSFBisCurrentVariantStandardCalled = true;
				bMVgetEnableAutoBindingCalled = true;
			}
		}

//		iAppstate
		if (oIAppState && !isEmptyObject(oIAppState)){
			sNavType = sap.fe.navigation.NavType.iAppState;
			// iAppState case simplified and handled via wrappers => none of the SFB methods directly called from here anymore
			bSFBaddFieldToAdvancedAreaCalled = false;
			bSFBgetUiStateCalled = false;
			bSFBsetUiStateCalled = false;
			iExpectedSearchCount = 0;
		}

//		navigationParameters: a) directly in URL
		if (oNavigationParameterURL && !isEmptyObject(oNavigationParameterURL)){
			sNavType = sap.fe.navigation.NavType.URLParams;
			oURLParameters = oNavigationParameterURL;
			for( var sProp in oNavigationParameterURL){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oNavigationParameterURL[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBgetUiStateCalled = false;
			if (Object.keys(oNavigationParameterURL).length === 1 && Object.keys(oNavigationParameterURL).includes("save-appvar-id")) {
				bSFBgetUiStateCalled = true;
			};
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = false;
			iExpectedSearchCount = 1;
		}

//		navigationParameters b) in xAppState
		if (oNavigationParameterXAppState && !isEmptyObject(oNavigationParameterXAppState)){
			sNavType = sap.fe.navigation.NavType.xAppState;
			for( var sProp in oNavigationParameterXAppState){
				oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oNavigationParameterXAppState[sProp]);
				aSFBAdvancedAreaExpected.push(sProp);
			}
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBgetUiStateCalled = false;
			bSFBsetUiStateCalled = true;
			bSFBisCurrentVariantStandardCalled = true;
			bMVgetEnableAutoBindingCalled = false;
			iExpectedSearchCount = 1;
		}

//		userDefaultValues
		if (oUserDefaultValues && !isEmptyObject(oUserDefaultValues)){
			sNavType = sap.fe.navigation.NavType.xAppState;
			for( var sProp in oUserDefaultValues){
				if(sProp != "DisplayCurrency"){
					oAppData.oSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
				}
				else {
					oAppData.oDefaultedSelectionVariant.addSelectOption(sProp, "I", "EQ", oUserDefaultValues[sProp]);
				}
				aSFBAdvancedAreaExpected.push(sProp);
			}
			oAppData.bNavSelVarHasDefaultsOnly = true;
			bSFBisCurrentVariantStandardCalled = true;
			bSFBaddFieldToAdvancedAreaCalled = true;
			bSFBsetUiStateCalled = true;
			bMVgetEnableAutoBindingCalled = true;
			flpValueforDisplayCurrency = true;
		}

//		finalize interface
		oSFBSelectionVariant = oSFBSelectionVariant.toJSONObject();
		oAppData.selectionVariant = oAppData.oSelectionVariant.toJSONString();
		oAppData.semanticDates = oIAppState && oIAppState.semanticDates || {"Dates":[]};

		/*********************************************************************************************************************
		 * execution * ***********
		 */
		// ensure that onSmartFilterBarInitialized is already called, to make parseUrlAndApplyAppSate do its task
		oIappStateHandler.onSmartFilterBarInitialized();
		
		
		var done = assert.async();
		var oNavigationPromise;
		if (sNavType === sap.fe.navigation.NavType.iAppState){
			oNavigationPromise = oIappStateHandler.applyState(oAppData);
		} else {
			oNavigationPromise = oIappStateHandler.applyState();
		}
		oAppDataLib = oAppData;
//		checks
		oNavigationPromise.then(function(){
//			no unneeded calls to SFB
			if(!flpValueforDisplayCurrency){
				assert.equal(oState.oSmartFilterbar.addFieldToAdvancedArea.called, bSFBaddFieldToAdvancedAreaCalled, "addFieldToAdvancedArea called");
			}
			assert.equal(oState.oSmartFilterbar.setUiState.called, bSFBsetUiStateCalled, "setUiState called");
			assert.equal(oState.oSmartFilterbar.getUiState.called, bSFBgetUiStateCalled, "getUiState called");
			assert.equal(oState.oSmartFilterbar.isCurrentVariantStandard.called, bSFBisCurrentVariantStandardCalled, "isCurrentVariantStandard called");
			assert.equal(oSearchSpy.callCount, iExpectedSearchCount, "Search must have been triggered exactly " + iExpectedSearchCount + " times");

			if(bSFBsetUiStateCalled){
//				build expected result according to described decision tree, but without the parts that are preset by SFB (as the
//				mixing is not done by us but by the SFB)
//				check is only possible, when set by us (not handled by SFB itself)
//				if we would need to handle everything, the expected values would look like this:
//				var oExpectedValues =
//					oIAppState ||
//					((oNavigationParameterURL || oNavigationParameterXAppState) ?
//							(oUserDefaultVariant ? extend({}, oUserDefaultVariant, oNavigationParameterURL, oNavigationParameterXAppState) :
//								extend({}, oBackendDefaultValues, oUserDefaultValues, oNavigationParameterURL, oNavigationParameterXAppState)) :
//								(oUserDefaultVariant ? oUserDefaultVariant : extend({}, oBackendDefaultValues, oUserDefaultValues)) );
				var oExpectedValues =
					oIAppState ||
					((oNavigationParameterURL || oNavigationParameterXAppState) ?
							(oUserDefaultVariant ? extend({}, oNavigationParameterURL, oNavigationParameterXAppState) :
								extend({}, oUserDefaultValues, oNavigationParameterURL, oNavigationParameterXAppState)) :
									(oUserDefaultVariant ? extend({}, oUserDefaultVariant, oUserDefaultValues) : extend({}, oBackendDefaultValues, oUserDefaultValues)) );
				var oSelectionVariant = new SelectionVariant();
				for ( var sProp in oExpectedValues) {
					if (sProp !== "semanticDates") {
						if (sProp == "DisplayCurrency") {
							oSelectionVariant.addParameter("P_DisplayCurrency",oExpectedValues[sProp]);
						}
						else {
							oSelectionVariant.addSelectOption(sProp, "I", "EQ", oExpectedValues[sProp]);
						}
					}
				}
				var bReplaceable;
				// Even when user default values are available, if these are modified through the modifyStartupextension
				// in all cases except when navType is iappState, then these default values are replaced by modified values
				if (!oUserDefaultValues || sNavType !== sap.fe.navigation.NavType.iAppState){
					bReplaceable=true;
				} else {
					bReplaceable=false;
				}


				assert.ok(oState.oSmartFilterbar.setUiState.calledOnce, "setUiState called exactly once");
				assert.ok(areTwoVariantsEquivalent(sSFBUiStateSelectionVariant, oSelectionVariant.toJSONObject()), "selectionVariant correctly set");
				assert.deepEqual(oSFBUiStateSemanticDates, oAppData.semanticDates, "semantic date correctly set");

				assert.deepEqual(oSFBUiStateProperties,{
					replace: bReplaceable,
					strictMode: false
				}, "correct filter values set");

			}

			if(oState.oSmartFilterbar.addFieldToAdvancedArea.called){
				if(!flpValueforDisplayCurrency){
					assert.deepEqual(aSFBAdvancedArea, aSFBAdvancedAreaExpected, "correct fields added to advanced area");
				}
			}

			done();
		}).catch(function(){
			assert.ok(false, "parseUrlAndApplyAppState failed");
			done();
		});
	}

	// util function to compare parameters and options of the variants irrespective of the array order
	function areTwoVariantsEquivalent(oVariant1, oVariant2) {
		return areArrayContentsSame(oVariant1.Parameters, oVariant2.Parameters, "PropertyName")
			&& areArrayContentsSame(oVariant1.SelectOptions, oVariant2.SelectOptions, "PropertyName");
	}

	function areArrayContentsSame(array1, array2, key) {
		function fnComparator(a, b) {
			if (a[key] === b[key]) return 0;
			return a[key] > b[key] ? 1 : -1;
		}
		array1 = array1.sort(fnComparator);
		array2 = array2.sort(fnComparator);

		return deepEqual(array1, array2);
	}

// simple tests - only one source used
	QUnit.test("app startup with iAppState", function(assert){
		configurableTest(assert, {a: "1", b: "2"});
	});

	QUnit.test("app startup with iAppState with Semantic Dates", function(assert){
		configurableTest(assert, {a: "1", b: "2", semanticDates: {c: "3"}});
	});

	QUnit.test("cross app navigation with URL parameters", function(assert){
		configurableTest(assert, null, {a: "1", b: "2"});
	});

	QUnit.test("cross app navigation with URL parameters, 'save-appvar-id' should be ignored", function(assert){
		configurableTest(assert, null, {"save-appvar-id": "1"});
	});

	QUnit.test("cross app navigation with URL parameters, 'save-appvar-id' with multiple parameters", function(assert){
		configurableTest(assert, null, {"save-appvar-id": "1", a: "2"});
	});

	QUnit.test("cross app navigation with x-app-state", function(assert){
		configurableTest(assert, null, null, {a: "1", b: "2"});
	});

	QUnit.test("app startup with a user default variant", function(assert){
		configurableTest(assert, null, null, null, {a: "1", b: "2"});
	});

	QUnit.test("app startup with a user default parameters", function(assert){
		configurableTest(assert, null, null, null, null, {a: "1", b: "2"}, null, ["a", "b"]);
	});

	QUnit.test("app startup with a user default parameters for DisplayCurrency", function(assert){
		configurableTest(assert, null, null, null, null, {DisplayCurrency: "Eur"});
	});

	QUnit.test("app startup with a backenddefault parameters", function(assert){
		configurableTest(assert, null, null, null, null, null, {a: "1", b: "2"});
	});

	// TODO: To adapt the code changes according to 5484026

// 	QUnit.test("app startup with user default variant and user default parameters", function(assert){
// 		configurableTest(assert, null, null, null, {a: "1", b: "2"}, {a: "3", c: "4"});
// 	});


// // combined sources
// 	QUnit.test("backenddefault and user default parameters", function(assert){
// 		configurableTest(assert, null, null, null, null, {a: "1"}, {b: "2"});
// 	});

});
