sap.ui.define([
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/ui/model/json/JSONModel",
	"sap/base/util/ObjectPath",
	"sap/suite/ui/commons/collaboration/ServiceContainer",
	"sap/ui/core/Lib"
], function(ShareUtils, JSONModel, ObjectPath, ServiceContainer, Library) {
	"use strict";

	var oSandbox;

	QUnit.module("The function getCurrentUrl", {
		beforeEach: function () {
			oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			oSandbox.restore();
		}
	});

	QUnit.test("Gets the current URL of the App - cFLP Scenario", function(assert) {
		// Arrange
		var done = assert.async();
		// sap.ushell in our test environment is undefined. However, we try to store the contents of ushell(if any) and restore it back after the test is finished.

		var getFLPUrlAsync =  function () {
			return new jQuery.Deferred().resolve("www.cFlp.com").promise();
		}

		oSandbox.stub(sap.ui, "require", function() {
			return {
				getFLPUrlAsync
			}
		})

		// Act
		var oGetCurrentUrlPromise = ShareUtils.getCurrentUrl();

		// Assert
		oGetCurrentUrlPromise.then(function(result) {
			assert.strictEqual(result, "www.cFlp.com", "The correct url is fetched.");
			done();
		});

	});

	QUnit.test("Gets the current URL of the App - non-cFLP Scenario", function(assert) {
		// Arrange
		var done = assert.async();
		// sap.ushell in our test environment is undefined. However, we try to store the contents of ushell(if any) and restore it back after the test is finished.

		// Act
		var oGetCurrentUrlPromise = ShareUtils.getCurrentUrl();

		// Assert
		oGetCurrentUrlPromise.then(function(result) {
			assert.strictEqual(result, document.URL, "The correct url is fetched.");
			done();
		});
	});

	QUnit.module("The static function setStaticShareData");

	QUnit.test("Updates model properties", function(assert) {
		// Arrange
		var oShareModel = {
			setProperty: sinon.stub()
		};
		var oResourceBundle = {
			getText: sinon.stub().returns("DUMMY")
		};
		var oResourceBundleStub = sinon.stub(Library, "getResourceBundleFor").returns(oResourceBundle);

		// Act
		ShareUtils.setStaticShareData(null, oShareModel);

		// Assert
		assert.strictEqual(oShareModel.setProperty.callCount, 3, "The function setProperty has been called three times.");
		assert.ok(oShareModel.setProperty.calledWith("/emailButtonText", "DUMMY"), "The property emailButtonText has been set.");
		assert.ok(oShareModel.setProperty.calledWith("/jamButtonText", "DUMMY"), "The property jamButtonText has been set.");
		assert.ok(oShareModel.setProperty.calledWith("/jamVisible", false), "The property jamVisible has been set.");
		// assert.ok(oShareModel.setProperty.calledWith("/microsoftTeamsVisible", false), "The property microsoftTeamsVisible has been set.");

		// Cleanup
		oResourceBundleStub.restore();
	});

	QUnit.test("Sets the jamVisible property if the ushell.getUser function exists", function(assert) {
		//A rrange
		var oShareModel = {
			setProperty: sinon.stub()
		};
		var oResourceBundle = {
			getText: Function.prototype
		};
		var fnGetUser = sinon.stub().returns({
			isJamActive: function() {
				return true;
			}
		});
		var oResourceBundleStub = sinon.stub(Library, "getResourceBundleFor").returns(oResourceBundle);
		var fnObjectPathGetStub = sinon.stub(ObjectPath, "get").returns(fnGetUser);

		// Act
		ShareUtils.setStaticShareData(null, oShareModel);

		// Assert
		assert.ok(oShareModel.setProperty.calledWith("/jamVisible", true), "The property jamVisible has been set.");

		// Cleanup
		oResourceBundleStub.restore();
		fnObjectPathGetStub.restore();
	});

	QUnit.module("The static function onShareJamPressed");

	QUnit.test("Creates a share dialog and opens it", function(assert) {
		// Arrange
		var done = assert.async();
		var oOpenStub = sinon.stub();
		var oStub = sinon.stub(sap.ui.core.Component, "create").returns(Promise.resolve({
			open: oOpenStub
		}));

		// Act
		ShareUtils.openJamShareDialog("SELL_YOUR_CAT");

		// Assert
		setTimeout(function() {
			assert.strictEqual(oStub.callCount, 1, "The function createComponent has been called once.");

			var oSettings = oStub.firstCall.args[0];
			assert.strictEqual(oSettings.name, "sap.collaboration.components.fiori.sharing.dialog", "The correct fragment name has been passed.");
			assert.strictEqual(oSettings.settings.object.share, "SELL_YOUR_CAT", "The correct fragment share text has been passed.");

			assert.strictEqual(oOpenStub.callCount, 1, "The open function of the component has been called once.");

			// Cleanup
			oStub.restore();
			done();
		}, 0)
	});

	QUnit.module("The static function openSharePopup", {
		beforeEach: function() {
			this.oModel = new JSONModel();
			this.oFragment = {
				openBy: sinon.stub(),
				getModel: sinon.stub().returns(this.oModel),
				insertItem: sinon.stub()
			};
			this.oFragmentController = {
				getModelData: Function.prototype
			};
			this.oGetFragmentStub = sinon.stub().returns(Promise.resolve(this.oFragment));

			this.oCommonUtils = {
				getDialogFragmentAsync: this.oGetFragmentStub
			};
		},
		afterEach: function() {
			this.oModel.destroy();

			this.oGetFragmentStub = null;
			this.oFragment = null;
			this.oModel = null;
			this.oFragmentController = null;
		}
	});

	QUnit.test("Extends the given fragment controller by the onCancelPressed function", function (assert) {
		// Arrange
		var oModelDataPromise = Promise.resolve({ serviceUrl: "" });
		sinon.stub(this.oFragmentController, "getModelData").returns(oModelDataPromise);

		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, null, this.oFragmentController);
		var done = assert.async();
		var that = this;

		oModelDataPromise.then(function() {
			that.oFragment.close = sinon.spy();
			that.oFragmentController.onCancelPressed();
			// Assert
			assert.strictEqual(that.oFragment.close.callCount, 1, "The close function has been called once.");
			done();
		});
	});

	QUnit.test("Calls the getDialogFragment function", function(assert) {
		// Arrange
		var oModelDataPromise = Promise.resolve({ serviceUrl: "" });
		sinon.stub(this.oFragmentController, "getModelData").returns(oModelDataPromise);
		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, null, this.oFragmentController);

		// Assert
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[0], "sap.suite.ui.generic.template.fragments.ShareSheet", "The correct fragment name is passed.");
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[1], this.oFragmentController, "The correct controller instance is passed.");
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[2], "share", "The correct model name is passed.");
		assert.strictEqual(this.oGetFragmentStub.firstCall.args[3], ShareUtils.setStaticShareData, "The correct creation callback function is passed.");
	});

	QUnit.test("Uses the fragment controller's getModelData function for data merging", function(assert) {
		// Arrange
		var oModelDataPromise = Promise.resolve({ serviceUrl: "" });
		var oGetModelDataStub = sinon.stub(this.oFragmentController, "getModelData").returns(oModelDataPromise);
		var done = assert.async();

		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, null, this.oFragmentController);
		oModelDataPromise.then(function() {
			// Assert
			assert.strictEqual(oGetModelDataStub.callCount, 1, "The function getModelData has been called once.");
			done();
		});
	});

	QUnit.test("Calls the fragment's openBy function", function(assert) {
		// Arrange
		var oBy = {}, fnResolve, fnResolveC, that = this;
		var oModelDataPromise = Promise.resolve({ serviceUrl: "" });
		var oServiceContainerPromiseForTeams = {getOptions: function(){
			return [{
				"type": "microsoft",
				"text": "Microsoft Teams",
				"icon": "sap-icon://collaborate",
				"subOptions": [{
					"text": "As Chat",
					"key": "COLLABORATION_MSTEAMS_CHAT",
					"icon": "sap-icon://post",
					"fesrStepName": "MST:ShareAsLink"
				}, {
					"text": "As Tab",
					"key": "COLLABORATION_MSTEAMS_TAB",
					"icon": "sap-icon://image-viewer",
					"fesrStepName": "MST:ShareAsTab"
				}]
			}];
		}};

		var oServiceContainerPromiseForCM = {getOptions: function(){
			return [{
                "type": "collaborationManager",
                "text": "Collaboration Manager",
                "icon": "sap-icon://collaborate",
                "subOptions": [{
					"text": "Collaboration Manager",
					"key": "COLLABORATION_POPOVER_CM",
					"icon": "sap-icon://collaborate"
				}]
            }];
		}};

		var mCollaborationServices = {
			"oTeamsHelperService": oServiceContainerPromiseForTeams,
			"oCMHelperService": oServiceContainerPromiseForCM
		};

		var oServiceContainerPromise = Promise.resolve(mCollaborationServices);

		var oFragmentModelResolved = new Promise(function(resolve) {
			sinon.stub(that.oFragmentController, "getModelData", function() {
				fnResolve = resolve;
				return oModelDataPromise;
			})
		});
		var oServiceContainerResolvedCollabServices = new Promise(function(resolve) {
			sinon.stub(ServiceContainer, "getCollaborationServices", function() {
				fnResolveC = resolve;
				var mCollaborationServices = {
					"oTeamsHelperService": oServiceContainerPromiseForTeams,
					"oCMHelperService": oServiceContainerPromiseForCM
				};
				return Promise.resolve(mCollaborationServices);
			});
		});
		var done = assert.async();
		// TODO: Temporarily adding the global variable "sap" as "sap.ushell.ui.footerbar.AddBookmarkButton" uses the global variable "sap.ushell.Container"
		// Without this global variable, the test case fails on UI5 2.0 environment.
		// Once the ushell removes the global variable from their codebase, it can be removed from here.

		// ui5lint-disable-next-line no-globals
		window.sap = {
			ushell: {
				Container: undefined
			},
			ui: {
				require: Function.prototype
			}
		};

		// Act
		ShareUtils.openSharePopup(this.oCommonUtils, oBy, this.oFragmentController);

		oModelDataPromise.then(function() {
			fnResolve();
		});

		oFragmentModelResolved.then(function() {
			oServiceContainerPromise.then(function() {
				fnResolveC();
			});
			oServiceContainerResolvedCollabServices.then(function() {
				// Assert
				assert.strictEqual(that.oFragment.openBy.callCount, 1, "The function openBy has been called once.");
				assert.strictEqual(that.oFragment.insertItem.callCount, 2, "The function insertItem has been called twice and collaboration item should be inserted at runtime.");
				assert.strictEqual(that.oFragment.openBy.firstCall.args[0], oBy, "The correct object instance has been passed to openBy.");
				//Cleanup
				// ui5lint-disable-next-line no-globals
				window.sap = undefined;
				done();
			});
		});
	});

	QUnit.test("The ShareUtils getCustomUrl function with hash", function(assert) {
		// Arrange
		var oOriginalHasher;
		if (window.hasher) {
			oOriginalHasher = window.hasher;
		}

		window.hasher = {
			getHash: sinon.stub().returns("SomeAppHash")
		};

		// Act
		var sResult = ShareUtils.getCustomUrl();

		// Assert
		assert.strictEqual(sResult, "#SomeAppHash", "The correct value has been returned.");

		// Cleanup
		window.hasher = oOriginalHasher;
	});

	QUnit.test("The ShareUtils getCustomUrl function without hash", function(assert) {
		// Arrange
		var oOriginalHasher;
		if (window.hasher) {
			oOriginalHasher = window.hasher;
		}

		window.hasher = {
			getHash: sinon.stub().returns("")
		};

		// Act
		var sResult = ShareUtils.getCustomUrl();

		// Assert
		assert.strictEqual(sResult, window.location.href, "The correct value has been returned.");

		// Cleanup
		window.hasher = oOriginalHasher;
	});
});
