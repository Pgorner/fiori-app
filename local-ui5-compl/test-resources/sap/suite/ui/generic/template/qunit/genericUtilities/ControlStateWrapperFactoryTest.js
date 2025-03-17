sap.ui.define(["sap/suite/ui/generic/template/genericUtilities/ControlStateWrapperFactory", "sap/suite/ui/generic/template/genericUtilities/controlHelper", "testUtils/sinonEnhanced"], function (
	ControlStateWrapperFactory, controlHelper, sinon) {
	"use strict";

	var sandbox;
	var oControlStateWrapperFactory;
	var oController = {
		getView: function () {
			return {
				getLocalId: function (sId) {
					return sId.split("--")[1];
				}
			};
		}
	};

	QUnit.module("genericUtilities.controlStateWrapperFactory", {
		beforeEach: function () {
			sandbox = sinon.sandbox.create();
			oControlStateWrapperFactory = new ControlStateWrapperFactory(oController);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {

		QUnit.test("DynamicPageWrapper getState", function (assert) {
			var oDynamicPage = {
				getId: function () {
					return "view--myId";
				},
				getHeaderPinned: function () {
					return false;
				}
			};

			sandbox.stub(controlHelper, "isDynamicPage", function () {
				return true;
			});
			var oDynamicPageWrapper = oControlStateWrapperFactory.getControlStateWrapper(oDynamicPage);
			var oExpectedOutput = {
				"headerPinned": false
			};
			assert.propEqual(oDynamicPageWrapper.getState(), oExpectedOutput, "Header pinned state being returned correctly.");
		});

		QUnit.test("DynamicPageWrapper setState", function (assert) {
			var done = assert.async();

			var oDynamicPage = {
				getId: function () {
					return "view--myId";
				},
				getHeaderPinned: function () {
					return true;
				},
				setHeaderPinned: function (bFlag) {
					return;
				},
				setHeaderExpanded: function (bHeaderExpanded) {
					return;
				}
			};

			sandbox.stub(controlHelper, "isDynamicPage", function () {
				return true;
			});
			var oDynamicPageWrapper = oControlStateWrapperFactory.getControlStateWrapper(oDynamicPage);
			var oExpectedOutput = {
				"headerPinned": true
			};
			assert.propEqual(oDynamicPageWrapper.getState(), oExpectedOutput, "Header pinned state being returned correctly.");

			var oSetHeaderExpandedSpy = sinon.spy(oDynamicPage, "setHeaderExpanded");
			oDynamicPageWrapper.setState(oExpectedOutput);
			setTimeout(function () {
				// It needs to be checked async as the control could be is assigned in Async manner
				// & states are assigned once the control assignment promise is resolved
				assert.equal(oSetHeaderExpandedSpy.calledWith(true), true, "setHeaderExpanded has been called with the correct parameter.");
				done();
			});
		});
	});

	QUnit.module("genericUtilities.controlStateWrapperFactory instance management", {
		beforeEach: function () {
			sandbox = sinon.sandbox.create();
			oControlStateWrapperFactory = new ControlStateWrapperFactory(oController);
		},
		afterEach: function () {
			sandbox.restore();
		}
	}, function () {
		QUnit.test("Getting wrapper for same control again", function (assert) {
			var oSmartTable = {
				isInitialised: sinon.stub().returns(true),
				attachInitialise: Function.prototype,
				attachAfterVariantInitialise: Function.prototype,
				getId: function () {
					return "view--myId";
				},
				// methods specific for SmartTable (used in SmartTableWrapper, or more precisely in SmartTableChartCommon) - there should not be a need to stub them here
				// possible alternatives:
				// - use another (simplier) control (cheap)
				// - stub constructor of SmartTableWrapper instead (actual the better solution!) 
				getSmartVariant: Function.prototype,
				getUseVariantManagement: Function.prototype,
				attachEvent: Function.prototype
			};

			sandbox.stub(controlHelper, "isSmartTable", function () {
				return true;
			});

			var oSmartTableWrapper1 = oControlStateWrapperFactory.getControlStateWrapper(oSmartTable);
			var oSmartTableWrapper2 = oControlStateWrapperFactory.getControlStateWrapper(oSmartTable);

			assert.equal(oSmartTableWrapper2, oSmartTableWrapper1, "Same wrapper instance returned for same control instance");
		});

		QUnit.test("Getting wrapper for different control instance", function (assert) {
			var oSmartTable1 = {
				isInitialised: sinon.stub().returns(true),
				attachInitialise: Function.prototype,
				attachAfterVariantInitialise: Function.prototype,
				getId: function () {
					return "view--myId1";
				},
				getSmartVariant: Function.prototype,
				getUseVariantManagement: Function.prototype,
				attachEvent: Function.prototype
			};
			var oSmartTable2 = {
				isInitialised: sinon.stub().returns(true),
				attachInitialise: Function.prototype,
				attachAfterVariantInitialise: Function.prototype,
				getId: function () {
					return "view--myId2";
				},
				getSmartVariant: Function.prototype,
				getUseVariantManagement: Function.prototype,
				attachEvent: Function.prototype
			};

			sandbox.stub(controlHelper, "isSmartTable", function () {
				return true;
			});

			var oSmartTableWrapper1 = oControlStateWrapperFactory.getControlStateWrapper(oSmartTable1);
			var oSmartTableWrapper2 = oControlStateWrapperFactory.getControlStateWrapper(oSmartTable2);

			assert.notEqual(oSmartTableWrapper2, oSmartTableWrapper1, "different wrapper instances returned for different control instances");
		});

		QUnit.test("Getting dummy wrapper for unknwon control", function (assert) {
			var oDummyWrapper = oControlStateWrapperFactory.getControlStateWrapper(undefined);

			assert.equal(oDummyWrapper.getState(), undefined, "Dummy wrapper should not provide any state");

			oDummyWrapper.setState({ someProperty: "someValue" });

			assert.equal(oDummyWrapper.getState(), undefined, "Dummy wrapper should not provide any state even after setting one");
		});

		QUnit.test("Getting dummy wrapper for unsupported control", function (assert) {
			var oUnsupportedControl = {
				getId: function () {
					return "unsupportedId";
				}
			};

			var oDummyWrapper = oControlStateWrapperFactory.getControlStateWrapper(oUnsupportedControl);

			assert.equal(oDummyWrapper.getState(), undefined, "Dummy wrapper should not provide any state");

			oDummyWrapper.setState({ someProperty: "someValue" });

			assert.equal(oDummyWrapper.getState(), undefined, "Dummy wrapper should not provide any state even after setting one");
		});

		QUnit.test("Adding method getLocalId to wrapper", function (assert) {
			var oSmartTable = {
				isInitialised: sinon.stub().returns(true),
				attachInitialise: Function.prototype,
				attachAfterVariantInitialise: Function.prototype,
				getId: function () {
					return "myViewId--myControlId";
				},
				getSmartVariant: Function.prototype,
				getUseVariantManagement: Function.prototype,
				attachEvent: Function.prototype
			};

			sandbox.stub(controlHelper, "isSmartTable", function () {
				return true;
			});

			var oSmartTableWrapper = oControlStateWrapperFactory.getControlStateWrapper(oSmartTable);

			assert.equal(oSmartTableWrapper.getLocalId(), "myControlId", "Same wrapper instance returned for same control instance");
		});

	});
});
