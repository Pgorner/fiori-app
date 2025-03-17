sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/m/library",
	"sap/suite/ui/generic/template/genericUtilities/testableHelper",
	"sap/suite/ui/generic/template/ListReport/controller/ControllerImplementation",
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/base/util/ObjectPath",
	"sap/base/util/isEmptyObject"
], function(sinon, MobileLibrary, testableHelper, ControllerImplementation, ShareUtils, ObjectPath, isEmptyObject) {
	"use strict";

	var oOpenSharePopupStub;
	var oSandbox;
	var oStubForPrivate;
	var oSettings = {
		isWorklist: false
	};
	var oTemplateUtils = {
		oComponentUtils: {
			getSettings: function () {
				return oSettings;
			},
			getFclProxy: function() {
				return {
					isListAndFirstEntryLoadedOnStartup: Function.prototype
				}
			},
			getTemplatePrivateModel: function() {
				return {
					getProperty: function(sProperty){
						return sProperty === "/generic/bDataAreShownInTable";
					},
					setProperty: Function.prototype
				}
			},
			isDraftEnabled: Function.prototype,
			isStateHandlingSuspended: Function.prototype,
			getTemplatePrivateGlobalModel: function() {
				return {
					setProperty: Function.prototype,
					getProperty: Function.prototype
				}
			}
		},
		oCommonUtils: {
			executeIfControlReady: {},
			getControlStateWrapper: function() {
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
	
	QUnit.module("Function getMethods", {
		before: function() {
			this.oMethods = ControllerImplementation.getMethods(undefined, oTemplateUtils);
		},
		after: function() {
			delete this.oMethods;
		}
	}, function(){
		QUnit.test("Returns an object with an onInit function", function(assert) {
			assert.ok(typeof this.oMethods.onInit === "function", "The onInit function has been found.");
		});

		QUnit.test("Returns an object with a map of formatters", function(assert) {
			assert.ok(typeof this.oMethods.formatters.formatDraftType === "function", "The formatDraftType function has been found.");
			assert.ok(typeof this.oMethods.formatters.formatDraftVisibility === "function", "The formatDraftVisibility function has been found.");
			assert.ok(typeof this.oMethods.formatters.formatDraftLineItemVisible === "function", "The formatDraftLineItemVisible function has been found.");
			assert.ok(typeof this.oMethods.formatters.formatDraftOwner === "function", "The formatDraftOwner function has been found.");
			assert.ok(typeof this.oMethods.formatters.formatItemTextForMultipleView === "function", "The formatItemTextForMultipleView function has been found.");
		});

		QUnit.test("Returns an object containing an instance of ListReport.extensionAPI.ExtensionAPI", function(assert) {
			assert.strictEqual(this.oMethods.extensionAPI.getMetadata().getName(), "sap.suite.ui.generic.template.ListReport.extensionAPI.ExtensionAPI", "The ExtensionAPI instance is correct.");
		});
	});

	QUnit.module("Event handler onShareListReportActionButtonPress", {
		beforeEach: function() {
			oSandbox = sinon.sandbox.create();
			oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
			this.oView = {
				byId: function() {
					return {
						focus: Function.prototype,
						setBeforePressHandler: Function.prototype
					}
				}
			};
			this.oController = {
				getView: function() {
					return this.oView;
				}.bind(this),
				onSaveAsTileExtension : function() {},
				byId: function() {
					return oSmartFilterBar;
				},
				getOwnerComponent: function() {
					return {
						getSmartVariantManagement: Function.prototype,
						getIsLeaf: Function.prototype,
						getModel: function(){
							return {};
						}
					}
				}
			};
			var oEvent = {
				getSource: sinon.stub().returns({})
			};
			var oController = this.oController;
			oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
				var newFnHandler = fnHandler.bind(oController);
				newFnHandler(oEvent.getSource());
			});
			oSandbox.stub(oTemplateUtils.oServices.oApplication, "registerCustomMessageProvider", Function.prototype);
			var oControllerImplementation = ControllerImplementation.getMethods({}, oTemplateUtils, this.oController);
			oControllerImplementation.onInit();
			oControllerImplementation.handlers.onShareListReportActionButtonPress();
		},
		afterEach: function() {
			this.oController = null;
			this.oFragmentController = null;
			oOpenSharePopupStub.restore();
			oOpenSharePopupStub = null;
			testableHelper.endTest();
			oSandbox.restore();
		}
	}, function() {
		QUnit.test("Calls the openSharePopup function of ShareUtils", function(assert) {
			// Assert
			assert.strictEqual(oOpenSharePopupStub.callCount, 1, "The function openSharePopup has been called once.");
			assert.strictEqual(oOpenSharePopupStub.firstCall.args[0], oTemplateUtils.oCommonUtils, "The CommonUtils instance has been passed to the function.");
			assert.strictEqual(typeof oOpenSharePopupStub.firstCall.args[1], "object", "An object instance has been passed to the function.");
			assert.strictEqual(typeof oOpenSharePopupStub.firstCall.args[2], "object", "An object instance has been passed to the function.");
		});

		// QUnit.test("Shifts focus to the share button on beforePress of the bookmark button", function(assert) {
		// 	// Arrange
		// 	var oEvent = {
		// 		getSource: sinon.stub().returns({})
		// 	};
		// 	var oBookmarkButton = {
		// 		setBeforePressHandler: sinon.stub()
		// 	};
		// 	var oShareButton = {
		// 		focus: sinon.stub()
		// 	};
		// 	var oByIdStub = sinon.stub(this.oView, "byId");
		// 	oByIdStub.withArgs("template::Share").returns(oShareButton);
		// 	oByIdStub.withArgs("bookmarkButton").returns(oBookmarkButton);
		// 	var oController = this.oController;
		// 	oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
		// 		var newFnHandler = fnHandler.bind(oController);
		// 		newFnHandler(oEvent.getSource());
		// 	});
		// 	// Act
		// 	this.onShareListReportActionButtonPress(oEvent);
		// 	var fnHandler = oBookmarkButton.setBeforePressHandler.firstCall.args[0];
		// 	fnHandler();
		// 	// Assert
		// 	assert.strictEqual(oByIdStub.callCount, 2, "The view's byId function has been called twice.");
		// 	assert.strictEqual(oShareButton.focus.callCount, 1, "The share button's focus function has been called once.");
		// });
	});

	var oSmartFilterBar = {
		getSmartVariant: Function.prototype,
		setSuppressSelection: Function.prototype,
		attachBrowserEvent: Function.prototype,
		hasDateRangeTypeFieldsWithValue: Function.prototype,
		attachSearch: Function.prototype,
		attachFilterChange: Function.prototype,
		attachPress: Function.prototype,
		getControlConfiguration: function() {
			return [];
		}
	};
	
	QUnit.module("Fragment controller functions", {
		beforeEach: function(assert) {
			oSandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oOpenSharePopupStub = sinon.stub(ShareUtils, "openSharePopup");
			var oView = {
				byId: function() {
					return {
						focus: Function.prototype,
						setBeforePressHandler: Function.prototype
					}
				}
			};
			this.oController = {
				getView: sinon.stub().returns(oView),
				onSaveAsTileExtension : function() {},
				byId: function() {
					return oSmartFilterBar;
				},
				getOwnerComponent: function() {
					return {
						getSmartVariantManagement: Function.prototype,
						getIsLeaf: Function.prototype,
						getModel: function(){
							return {};
						}
					}
				}
			};
			var oEvent = {
				getSource: sinon.stub().returns({})
			};
			var oController = this.oController;
			oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
				var newFnHandler = fnHandler.bind(oController);
				newFnHandler(oEvent.getSource());
			});
			oSandbox.stub(oTemplateUtils.oServices.oApplication, "registerCustomMessageProvider", Function.prototype);
			var oControllerImplementation = ControllerImplementation.getMethods({}, oTemplateUtils, this.oController);
			oControllerImplementation.onInit();
			oControllerImplementation.handlers.onShareListReportActionButtonPress();
			/* Here 'openSharePopup' has been stubbed which is then used to get the oFragmentController instance which seems to be rather complicated way. It can be adapted
			   so that the oFragmentController methods being tested here can be tested in the ShareUtilsTest as these methods are being called in ShareUtils class. */
			this.oFragmentController = oOpenSharePopupStub.firstCall.args[2];
			assert.strictEqual(isEmptyObject(this.oFragmentController), false, "The fragment controller has been found.");
		},
		afterEach: function() {
			this.oController = null;
			this.oFragmentController = null;
			oOpenSharePopupStub.restore();
			oOpenSharePopupStub = null;
			testableHelper.endTest();
			oSandbox.restore();
		}
	}, function(){
		QUnit.test("The fragmentController's sharePageToPressed (Email) function", function(assert) {
			// Arrange
			var done = assert.async();
			var oGetTextStub = sinon.stub().returns("FancySubject");
			oTemplateUtils.oCommonUtils.getText = oGetTextStub;
			var oBusyHelper = {
				isBusy: function() {
					return true;
				},
				setBusy: Function.prototype
			};
			oSandbox.stub(oTemplateUtils.oServices.oApplication, "getAppTitle").returns("FancyTitle");
			var oController = this.oController;
			oSandbox.stub(oTemplateUtils.oCommonUtils, "executeIfControlReady", function(fnHandler){
				var newFnHandler = fnHandler.bind(oController);
				newFnHandler(oEvent.getSource());
			});
			oSandbox.stub(oTemplateUtils.oServices.oApplication, "getBusyHelper", function() {
				return oBusyHelper;
			});
			var bBusyPromiseResolved = false;
			oSandbox.stub(oBusyHelper, "isBusy", function() {
				return false;
			});
			oSandbox.stub(oBusyHelper, "setBusy", function(oPromise) {
				oPromise.then(Function.prototype, function() {
					bBusyPromiseResolved = true;
				});
			});
			oSandbox.stub(ShareUtils, "getCurrentUrl", function() {
				return Promise.resolve("www.sample.com");
			});
	
			var oTriggerEmailStub = sinon.stub(MobileLibrary.URLHelper, "triggerEmail");
	
			// Act
			this.oFragmentController.sharePageToPressed("Email");

			// Assert
			setTimeout(function(){
				assert.strictEqual(oGetTextStub.callCount, 1, "The TemplateUtils' getText function has been called once.");
				assert.strictEqual(oGetTextStub.firstCall.args[0], "EMAIL_HEADER", "The correct localization key has been passed.");
				assert.strictEqual(oGetTextStub.firstCall.args[1].length, 1, "The correct number of placeholder values has been passed.");
				assert.strictEqual(oGetTextStub.firstCall.args[1][0], "FancyTitle", "The correct app title has been passed.");
				assert.strictEqual(oTriggerEmailStub.callCount, 1, "The URLHelper's triggerEmail function has been called once.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[0], null, "The correct destination e-mail parameter has been passed.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[1], "FancySubject", "The correct subject parameter has been passed.");
				assert.strictEqual(oTriggerEmailStub.firstCall.args[2], "www.sample.com", "The correct e-mail body parameter has been passed.");
				oTriggerEmailStub.restore();
				done();
			}, 0);
		});
	
		QUnit.test("The fragmentController's shareJamPressed function", function(assert) {
			// Arrange
			var oStub = sinon.stub(ShareUtils, "openJamShareDialog");
			oSandbox.stub(oTemplateUtils.oServices.oApplication, "getAppTitle").returns("FancyTitle");
			// Act
			this.oFragmentController.shareJamPressed();
			// Assert
			assert.strictEqual(oStub.callCount, 1, "The function openJamShareDialog has been called once.");
			assert.strictEqual(oStub.firstCall.args[0], "FancyTitle", "The function openJamShareDialog has been called with the correct parameter.");
			// Cleanup
			oStub.restore();
		});

		function getModelData(assert) {
			// Arrange
			var oGetManifestEntryStub = sinon.stub();
			oGetManifestEntryStub.withArgs("sap.ui").returns({
				icons: {
					icon: "sap-icon://endoscopy"
				}
			});
			oGetManifestEntryStub.withArgs("sap.app").returns({
				title: "FancyTitle"
			});
	
			this.oController.getOwnerComponent = function() {
				return {
					getAppComponent: function() {
						return {
							getManifestEntry: oGetManifestEntryStub	
						};
					}
				};
			};
			sinon.stub(oStubForPrivate, "getDownloadUrl").returns("fancyUrl");
			// for getCustomUrl
			oSandbox.stub(window.hasher, "getHash").returns("SomeAppHash");
			// Act
			var oResult = this.oFragmentController.getModelData();
			// Assert
			assert(oResult);
		}

		// QUnit.test("The fragmentController's getModelData function", function(assert) {
		// 	// Arrange
		// 	var done = assert.async();
		// 	var oModelData;
		// 	var fnObjectPathGetStub = sinon.stub(ObjectPath, "get"); // Returns undefined
		// 	sinon.stub(oSmartFilterBar, "hasDateRangeTypeFieldsWithValue").returns(Promise.resolve(false));
		// 	// Act
		// 	getModelData.call(this, function(oFragmentModel) {
		// 		// Assert
		// 		oFragmentModel.then(function(oResult) {
		// 			oModelData = oResult;
		// 			return oResult.serviceUrl;
		// 		}).then(function(sServiceUrl) {
		// 			assert.strictEqual(oModelData.icon, "sap-icon://endoscopy", "The icon property has the correct value.");
		// 			assert.strictEqual(oModelData.title, "FancyTitle", "The icon property has the correct value.");
		// 			assert.strictEqual(sServiceUrl, "fancyUrl&$top=0&$inlinecount=allpages", "The serviceUrl property has the correct value.");
		// 			assert.strictEqual(oModelData.customUrl, "#SomeAppHash", "The customUrl property has the correct value.");
		// 			assert.strictEqual(oModelData.isShareInJamActive, false, "The isShareInJamActive property has the correct value.");
		// 			done();
		// 		});
		// 	});
		// 	// Cleanup
		// 	fnObjectPathGetStub.restore();
		// });

		// QUnit.test("The fragmentController's getModelData function correctly uses the getUser function", function(assert) {
		// 	// Arrange
		// 	var done = assert.async();
		// 	var fnGetUser = function() {
		// 		return {
		// 			isJamActive: sinon.stub().returns(true)
		// 		};
		// 	};
		// 	var fnObjectPathGetStub = sinon.stub(ObjectPath, "get").returns(fnGetUser);
		// 	// Act
		// 	getModelData.call(this, function(oFragmentModel) {
		// 		oFragmentModel.then(function(oResult) {
		// 		// Assert
		// 			assert.strictEqual(oResult.isShareInJamActive, true, "The isShareInJamActive property has the correct value.");
		// 			done();
		// 		});
		// 	});
		// 	// Cleanup
		// 	fnObjectPathGetStub.restore();
		// });

		// QUnit.test("The fragmentController's getServiceUrl returns a string", function(assert) {
		// 	// Arrange
		// 	var done = assert.async();
		// 	var oDownloadUrlStub = oSandbox.stub(oStubForPrivate, "getDownloadUrl").returns("");
		// 	// Act
		// 	this.oFragmentController.getServiceUrl().then(function(sServiceUrl) {
		// 		// Assert
		// 		assert.strictEqual(oDownloadUrlStub.callCount, 1, "The function getDownloadUrl has been called once.");
		// 		assert.strictEqual(sServiceUrl, "", "The correct service URL has been returned.");
		// 		done();
		// 	});
		// });

		// QUnit.test("The fragmentController's getServiceUrl appends query parameters to an existing URL", function(assert) {
		// 	// Arrange
		// 	var done = assert.async();
		// 	sinon.stub(oStubForPrivate, "getDownloadUrl").returns("fancyUrl");
		// 	// Act
		// 	this.oFragmentController.getServiceUrl().then(function(sServiceUrl) {
		// 		// Assert
		// 		assert.strictEqual(sServiceUrl, "fancyUrl&$top=0&$inlinecount=allpages", "The correct service URL has been returned.");
		// 		done();
		// 	});
		// });

		// QUnit.test("The fragmentController's getServiceUrl function calls the controller's onSaveAsTileExtension function", function(assert) {
		// 	// Arrange
		// 	var done = assert.async();
		// 	var that = this;
		// 	this.oController.onSaveAsTileExtension = sinon.spy();
		// 	sinon.stub(oStubForPrivate, "getDownloadUrl");
		// 	// Act
		// 	this.oFragmentController.getServiceUrl().then(function() {
		// 		// Assert
		// 		assert.strictEqual(that.oController.onSaveAsTileExtension.callCount, 1, "The function onSaveAsTileExtensions has been called once.");
		// 		done();
		// 	});
		// });
		
		// QUnit.test("The onSaveAsTileExtension overrides the default serviceUrl", function(assert) {
		// 	// Arrange
		// 	var done = assert.async();
		// 	this.oController.onSaveAsTileExtension = function(oShareInfo) {
		// 		oShareInfo.serviceUrl = "FancyUrl";
		// 	};
		// 	sinon.stub(oStubForPrivate, "getDownloadUrl");
		// 	// Act
		// 	this.oFragmentController.getServiceUrl().then(function(sServiceUrl) {
		// 		// Assert
		// 		assert.strictEqual(sServiceUrl, "FancyUrl", "The correct service URL has been returned.");
		// 		done();
		// 	});
		// });
	});
});