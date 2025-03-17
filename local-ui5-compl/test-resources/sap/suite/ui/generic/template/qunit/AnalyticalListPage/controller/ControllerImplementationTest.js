sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/ControllerImplementation",
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/base/util/isEmptyObject"
], function (sinon, ControllerImplementation, ShareUtils, isEmptyObject) {
	"use strict";
	var oOpenSharePopupStub, oSandbox, oFragmentController;
	var oSettings = {
		isWorklist: false
	};
	var oSmartFilterBar = {
		getSmartVariant: Function.prototype,
		setSuppressSelection: Function.prototype,
		attachBrowserEvent: Function.prototype,
		hasDateRangeTypeFieldsWithValue: Function.prototype,
		getId: Function.prototype,
		setShowGoOnFB: Function.prototype,
		setLiveMode: Function.prototype,
		_oFiltersButton: {
			setVisible: Function.prototype
		},
		attachAfterVariantLoad: Function.prototype,
		isLiveMode: Function.prototype,
		attachFilterChange: Function.prototype
	};
	var oTemplateUtils = {
		oComponentUtils: {
			getSettings: function () {
				return oSettings;
			},
			getFclProxy: function () {
				return {
					isListAndFirstEntryLoadedOnStartup: Function.prototype
				}
			},
			getTemplatePrivateModel: function () {
				return {
					setProperty: Function.prototype
				}
			},
			isDraftEnabled: Function.prototype,
			getTemplatePrivateGlobalModel: function () {
				return {
					setProperty: Function.prototype,
					getProperty: Function.prototype
				}
			}
		},
		oCommonUtils: {
			executeIfControlReady: {},
			getControlStateWrapper: function () {
				return {
					attachStateChanged: Function.prototype
				}
			}
		},
		oServices: {
			oPresentationControlHandlerFactory: {
				getPresentationControlHandler: Function.prototype
			},
			oApplication: {
				getNavigationHandler: Function.prototype,
				getAppTitle: Function.prototype,
				getBusyHelper: Function.prototype
			}
		}
	};
	var oView = {
		byId: function () {
			return {
				focus: Function.prototype,
				setBeforePressHandler: Function.prototype
			}
		},
		hasStyleClass: Function.prototype
	};
	var oController = {
		getView: sinon.stub().returns(oView),
		onSaveAsTileExtension: function () { },
		byId: function (sId) {
			switch (sId) {
				case "template::SmartFilterBar":
					return oSmartFilterBar;
				case "template::Page":
					return {
						getHeader: Function.prototype,
						getTitle: Function.prototype
					};
				case "template::VisualFilterBar":
					return {
						setEntitySet: Function.prototype,
						setSmartFilterId: Function.prototype,
						attachOnFilterItemAdded: Function.prototype,
						setSmartFilterContext: Function.prototype,
						attachFilterChange: Function.prototype,
						addEventDelegate: Function.prototype,
						attachInitialized: Function.prototype
					};
				case "template::FilterText":
					return {
						attachBrowserEvent: Function.prototype
					};
				default:
					return;
			}
		},
		getOwnerComponent: function () {
			return {
				getSmartVariantManagement: Function.prototype,
				getIsLeaf: Function.prototype,
				getModel: function () {
					return {
						setProperty: Function.prototype,
						getProperty: Function.prototype
					}
				},
				getHideVisualFilter: Function.prototype,
				getDefaultFilterMode: Function.prototype,
				getDefaultContentView: Function.prototype,
				getAutoHide: Function.prototype,
				getQuickVariantSelectionX: Function.prototype,
				getProperty: Function.prototype,
				getShowGoButtonOnFilterBar: Function.prototype,
				getEntitySet: Function.prototype,
				getRefreshIntervalInMinutes: Function.prototype,
				getFilterSettings: Function.prototype
			}
		},
		onAfterCustomModelCreation: Function.prototype,
		oView: {
			setModel: Function.prototype,
			getModel: function () {
				return {
					getProperty: Function.prototype
				}
			}
		}
	};

	QUnit.module("Fragment controller functions", {
		beforeEach: function (assert) {
			oSandbox = sinon.sandbox.create();
			oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
			var oEvent = {
				getSource: sinon.stub().returns({})
			};
			oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function (fnHandler) {
				var newFnHandler = fnHandler.bind(oController);
				newFnHandler(oEvent.getSource());
			});
			oSandbox.stub(oTemplateUtils.oServices.oApplication, "registerCustomMessageProvider", Function.prototype);
			var oControllerImplementation = ControllerImplementation.getMethods({}, oTemplateUtils, oController);
			oControllerImplementation.onInit();
			oControllerImplementation.handlers.onShareListReportActionButtonPress();
			/* Here 'openSharePopup' has been stubbed which is then used to get the oFragmentController instance which seems to be rather complicated way. It can be adapted
			   so that the oFragmentController methods being tested here can be tested in the ShareUtilsTest as these methods are being called in ShareUtils class. */
			oFragmentController = oOpenSharePopupStub.firstCall.args[2];
			assert.strictEqual(isEmptyObject(oFragmentController), false, "The fragment controller has been found.");
		},
		afterEach: function () {
			oOpenSharePopupStub.restore();
			oOpenSharePopupStub = null;
			oFragmentController = null;
			oSandbox.restore();
		}
	});

	// QUnit.test("The fragmentController's getServiceUrl returns a string", function (assert) {
	// 	// Arrange
	// 	var done = assert.async();
	// 	var oDownloadUrlStub = oSandbox.stub(oFragmentController, "getDownloadUrl").returns("");
	// 	oSandbox.stub(oSmartFilterBar, "hasDateRangeTypeFieldsWithValue").returns(Promise.resolve(false));
	// 	// Act
	// 	oFragmentController.getServiceUrl().then(function (sServiceUrl) {
	// 		// Assert
	// 		assert.strictEqual(oDownloadUrlStub.callCount, 1, "The function getDownloadUrl has been called once.");
	// 		assert.strictEqual(sServiceUrl, "", "The correct service URL has been returned.");
	// 		done();
	// 	});
	// });

	// QUnit.test("The fragmentController's getServiceUrl appends query parameters to an existing URL", function(assert) {
	// 	// Arrange
	// 	var done = assert.async();
	// 	oSandbox.stub(oFragmentController, "getDownloadUrl").returns("fancyUrl");
	// 	oSandbox.stub(oSmartFilterBar, "hasDateRangeTypeFieldsWithValue").returns(Promise.resolve(false));
	// 	// Act
	// 	oFragmentController.getServiceUrl().then(function(sServiceUrl) {
	// 		// Assert
	// 		assert.strictEqual(sServiceUrl, "fancyUrl&$top=0&$inlinecount=allpages", "The correct service URL has been returned.");
	// 		done();
	// 	});
	// });

	// QUnit.test("The fragmentController's getServiceUrl function calls the controller's onSaveAsTileExtension function", function(assert) {
	// 	// Arrange
	// 	var done = assert.async();
	// 	oController.onSaveAsTileExtension = sinon.spy();
	// 	sinon.stub(oFragmentController, "getDownloadUrl");
	// 	oSandbox.stub(oSmartFilterBar, "hasDateRangeTypeFieldsWithValue").returns(Promise.resolve(false));
	// 	// Act
	// 	oFragmentController.getServiceUrl().then(function() {
	// 		// Assert
	// 		assert.strictEqual(oController.onSaveAsTileExtension.callCount, 1, "The function onSaveAsTileExtensions has been called once.");
	// 		done();
	// 	});
	// });
	
	// QUnit.test("The onSaveAsTileExtension overrides the default serviceUrl", function(assert) {
	// 	// Arrange
	// 	var done = assert.async();
	// 	oController.onSaveAsTileExtension = function(oShareInfo) {
	// 		oShareInfo.serviceUrl = "FancyUrl";
	// 	};
	// 	sinon.stub(oFragmentController, "getDownloadUrl");
	// 	oSandbox.stub(oSmartFilterBar, "hasDateRangeTypeFieldsWithValue").returns(Promise.resolve(false));
	// 	// Act
	// 	oFragmentController.getServiceUrl().then(function(sServiceUrl) {
	// 		// Assert
	// 		assert.strictEqual(sServiceUrl, "FancyUrl", "The correct service URL has been returned.");
	// 		done();
	// 	});
	// });
});