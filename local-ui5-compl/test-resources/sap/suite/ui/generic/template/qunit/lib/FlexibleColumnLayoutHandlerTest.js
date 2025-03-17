/**
 * tests for the sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHandler
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/base/Object",
	"sap/m/routing/Router",
	"sap/suite/ui/generic/template/lib/navigation/routingHelper",
	"sap/suite/ui/generic/template/lib/navigation/NavigationController",
	"sap/suite/ui/generic/template/lib/FlexibleColumnLayoutHandler",
	"sap/f/FlexibleColumnLayoutSemanticHelper"
], function (sinon, BaseObject, Router, routingHelper, NavigationController, FlexibleColumnLayoutHandler, FlexibleColumnLayoutSemanticHelper) {
	"use strict";

	var oSandbox;
	
	var oBeginColumnComponent = {};
	var oMidColumnComponent = {};
	var oEndColumnComponent = {};
	var oFCLSettings = Object.freeze({});

	function getSemanticHelper() {
		return {
			getDefaultLayouts: function () {
				return {
					defaultLayoutType: "OneColumn",
					defaultTwoColumnLayoutType: "TwoColumnsMidExpanded",
					defaultThreeColumnLayoutType: "ThreeColumnsMidExpanded"
				};
			},
			getNextUIState: sinon.stub().returns({layout: "layout"})
		}
	}

	function getTemplateContract() {
		return {
			oAppComponent: {
				getFlexibleColumnLayout: function(){
					return oFCLSettings;
				}
			},
			oTemplatePrivateGlobalModel: {
				setProperty: Function.prototype
			},
			oNavContainer: {
				to: Function.prototype
			},
			mRoutingTree: {},
			oBusyHelper: {
				setBusy: sinon.stub()
			},
			setColumnDistributionModel: Function.prototype
		}
	};

	var oSemanticHelper, oTemplateContract, oFlexibleColumnLayout, oRouter, oNavigationControllerProxy, oGetInstanceForStub;

	QUnit.module("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHandler", {
		beforeEach: function () {
			oSandbox = sinon.sandbox.create();
			oSemanticHelper = getSemanticHelper();
			oTemplateContract = getTemplateContract();
			oFlexibleColumnLayout = {
				setFullScreenColumn: Function.prototype,
				attachStateChange: Function.prototype,
				setLayout: sinon.stub()
			};
			oRouter = sinon.createStubInstance(Router);
			oNavigationControllerProxy = {
				oRouter: oRouter,
				oTemplateContract: oTemplateContract
			};
			// oActivationInfo = {};
			oGetInstanceForStub = oSandbox.stub(FlexibleColumnLayoutSemanticHelper, "getInstanceFor", function () {
				return oSemanticHelper;
			});
			this.FlexibleColumnLayoutHandler = new FlexibleColumnLayoutHandler(oFlexibleColumnLayout, oNavigationControllerProxy);
		},
		afterEach: function () {
			oSandbox.restore();
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.FlexibleColumnLayoutHandler, "Instantiation successfull");
	});

	QUnit.test("get Methods", function (assert) {
		assert.ok(oGetInstanceForStub.calledOnce, "SemanticHelper must have been retrieved");
		assert.ok(oGetInstanceForStub.calledWithExactly(oFlexibleColumnLayout, oFCLSettings), "SemanticHelper must have been called with right parameters");
	});

	QUnit.test("adaptRoutingInfo viewLevel = 0", function (assert) {
		var oRoute = {};
		var sTargetName = "root";
		var aPredecessorTargets = [];

		var sPagesAggregation = this.FlexibleColumnLayoutHandler.adaptRoutingInfo(oRoute, sTargetName, aPredecessorTargets, {
			fCLLevel: 0
		});

		assert.equal(sPagesAggregation, "beginColumnPages");
	});

	QUnit.test("adaptRoutingInfo viewLevel = 1", function (assert) {
		var oRoute = {};
		var sTargetName = "C_STTA_SalesOrder_WD_20";
		var aPredecessorTargets = ["root"];

		var sPagesAggregation = this.FlexibleColumnLayoutHandler.adaptRoutingInfo(oRoute, sTargetName, aPredecessorTargets, {
			fCLLevel: 1
		});

		assert.equal(sPagesAggregation, "midColumnPages");
	});

	QUnit.test("adaptRoutingInfo viewLevel = 2", function (assert) {
		var oRoute = {};
		var sTargetName = "C_STTA_SalesOrder_WD_20/to_Item";
		var aPredecessorTargets = ["root", "C_STTA_SalesOrder_WD_20"];

		var sPagesAggregation = this.FlexibleColumnLayoutHandler.adaptRoutingInfo(oRoute, sTargetName, aPredecessorTargets, {
			fCLLevel: 2
		});

		assert.equal(sPagesAggregation, "endColumnPages");
	});

	QUnit.test("createMessagePageTargets", function (assert) {
		var fnCreateAdditionalMessageTarget = sinon.spy();
		this.FlexibleColumnLayoutHandler.createMessagePageTargets(fnCreateAdditionalMessageTarget);

		assert.ok(fnCreateAdditionalMessageTarget.called, "SemanticHelper must have been retrieved");
	});

	QUnit.test("createMessagePageTargets", function (assert) {
		//var fnCreateAdditionalMessageTarget = function(){};
		var fnCreateAdditionalMessageTarget = sinon.spy();
		this.FlexibleColumnLayoutHandler.createMessagePageTargets(fnCreateAdditionalMessageTarget);

		assert.ok(fnCreateAdditionalMessageTarget.called, "SemanticHelper must have been retrieved");
	});

	QUnit.test("displayMessagePage, set BusyHelper.setBusy too wait till page will be open", function (assert) {
		// prepare
		var oTargets = {display: sinon.stub().returns("oDisplayPromise")};
		oNavigationControllerProxy.oRouter.getTargets.returns(oTargets);

		// execute
		var mParameters = {}, mComponentsDisplayed = {};
		this.FlexibleColumnLayoutHandler.displayMessagePage(mParameters, mComponentsDisplayed);

		// assert
		assert.ok(oNavigationControllerProxy.oRouter.getTargets.callCount === 1, "oNavigationControllerProxy.oRouter.getTargets was called");
		assert.ok(oTargets.display.calledOnce, "oTargets.display was called");
		assert.ok(oTargets.display.firstCall.calledWithExactly("messagePageBeginColumn"), "oTargets.display was called with 'messagePageBeginColumn'");
		assert.ok(oTemplateContract.oBusyHelper.setBusy.calledOnce, "oBusyHelper.setBusy was called");
		assert.ok(oTemplateContract.oBusyHelper.setBusy.firstCall.calledWithExactly("oDisplayPromise"), "oBusyHelper.setBusy was called with 'oDisplayPromise'");
	});
});
