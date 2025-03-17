/**
 * tests for the sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHelper
 */
sap.ui.define([
  "testUtils/sinonEnhanced",
  "sap/suite/ui/generic/template/lib/FlexibleColumnLayoutHelper",
  "sap/f/FlexibleColumnLayout",
  "sap/suite/ui/generic/template/lib/AppComponent"
], function (
  sinon,
  FlexibleColumnLayoutHelper,
  FlexibleColumnLayout,
  AppComponent
) {
  "use strict";

  var oSandbox;
  var oFlexibleColumnLayoutHelper;

  var oAppComponentStub = sinon.createStubInstance(AppComponent);
  var oTemplatePrivateGlobal = {
    setProperty: function() {}
  };
  oAppComponentStub.getModel.returns(oTemplatePrivateGlobal);
  var oShellPersonalizationServiceStub;

  QUnit.module("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHelper", {
    beforeEach: function () {
      oSandbox = sinon.sandbox.create();
      oShellPersonalizationServiceStub = {};
      var oTemplateContract = {
        oAppComponent: oAppComponentStub,
        oShellPersonalizationService: oShellPersonalizationServiceStub
      };
      oFlexibleColumnLayoutHelper = new FlexibleColumnLayoutHelper(oTemplateContract);
    },
    afterEach: function () {
      oSandbox.restore();
      oFlexibleColumnLayoutHelper = null;
    }
  });

  QUnit.test("initFlexibleColumnLayout should instantiate FlexibleColumnLayout with layoutData aggregations", function (assert) {
    var oFCL = oFlexibleColumnLayoutHelper.initFlexibleColumnLayout();

    assert.ok(oFCL instanceof FlexibleColumnLayout, `FCL initialized`);
    assert.ok(oFCL.mAggregations?.layoutData?.mAggregations?.desktopLayoutData?.mBindingInfos?.twoColumnsMidExpanded, `desktop layouts initialized`);
    assert.ok(oFCL.mAggregations?.layoutData?.mAggregations?.tabletLayoutData?.mBindingInfos?.threeColumnsEndExpanded, `tablet layouts initialized`);
  });

  QUnit.test("getStoredLayout should return proposed layout if personalization service is not available", async function (assert) {
    var sProposedLayout = "OneColumn";
    var sExpected = "OneColumn";
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(false);

    var oResult = await oFlexibleColumnLayoutHelper.getStoredLayout(sProposedLayout);

    assert.equal(oResult, sExpected, "proposed layout returned correctly");
  });

  QUnit.test("getStoredLayout should return proposed layout if unknown layout type is used", async function (assert) {
    var sProposedLayout = "FourColumns";
    var sExpected = "FourColumns";
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(true);

    var oResult = await oFlexibleColumnLayoutHelper.getStoredLayout(sProposedLayout);

    assert.deepEqual(oResult, sExpected, "proposed layout returned correctly");
  });

  QUnit.test("getStoredLayout should return proposed layout if no personalized layout can be retrieved", async function (assert) {
    var sProposedLayout = "ThreeColumnsMidExpandedEndHidden";
    var oState;
    var sExpected = "ThreeColumnsMidExpandedEndHidden";
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(true);
    oSandbox.stub(oShellPersonalizationServiceStub, "getApplicationPersonalizationData").returns(Promise.resolve(oState));

    var oResult = await oFlexibleColumnLayoutHelper.getStoredLayout(sProposedLayout);

    assert.deepEqual(oResult, sExpected, "proposed layout returned correctly");
  });

  QUnit.test("getStoredLayout should return stored personalized layout based on the number of columns in proposed layout", async function (assert) {
    var sProposedLayout = "TwoColumnsBeginExpanded";
    var oState = {
      defaultLayouts: {
        2: "TwoColumnsMidExpanded"
      },
      columnsDistribution: {
        desktop: {},
        tablet: {}
      }
    };
    var sExpected = "TwoColumnsMidExpanded";
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(true);
    oSandbox.stub(oShellPersonalizationServiceStub, "getApplicationPersonalizationData").returns(Promise.resolve(oState));

    var oResult = await oFlexibleColumnLayoutHelper.getStoredLayout(sProposedLayout);

    assert.deepEqual(oResult, sExpected, "personalized layout returned correctly");
  });

  QUnit.test("setColumnDistributionModel should do nothing if personalization service is not available", async function (assert) {
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(false);
    var spy = oSandbox.spy(oShellPersonalizationServiceStub, "getApplicationPersonalizationData");

    await oFlexibleColumnLayoutHelper.setColumnDistributionModel();

    assert.ok(spy.notCalled, "function returned without attempting to access personalization service");
  });

  QUnit.test("setColumnDistributionModel should do nothing if columns distribution has not been personalized", async function (assert) {
    var oState = {
      defaultLayouts: {},
      columnsDistribution: undefined
    };
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(true);
    oSandbox.stub(oShellPersonalizationServiceStub, "getApplicationPersonalizationData").returns(Promise.resolve(oState));
    var spy = oSandbox.spy(oTemplatePrivateGlobal, "setProperty");

    await oFlexibleColumnLayoutHelper.setColumnDistributionModel();

    assert.ok(spy.notCalled, "function returned without setting columns distribution model");
  });

  QUnit.test("setColumnDistributionModel should apply stored personalized column distribution state", async function (assert) {
    var oState = {
      defaultLayouts: {},
      columnsDistribution: {
        desktop: {
          TwoColumnsBeginExpanded: '76.11026033690659/23.889739663093415/0',
          TwoColumnsMidExpanded: '23.889739663093415/76.11026033690659/0'
        },
        tablet: {
          TwoColumnsBeginExpanded: '52.75459098497496/47.24540901502504/0',
          TwoColumnsMidExpanded: '26.04340567612688/73.95659432387312/0'
        }
      }
    };
    oSandbox.stub(oShellPersonalizationServiceStub, "hasInitialized").returns(true);
    oSandbox.stub(oShellPersonalizationServiceStub, "getApplicationPersonalizationData").returns(Promise.resolve(oState));
    var spy = oSandbox.spy(oTemplatePrivateGlobal, "setProperty");

    await oFlexibleColumnLayoutHelper.setColumnDistributionModel();

    assert.ok(spy.calledWith("/generic/FCL/FCLColumnsDistribution", oState.columnsDistribution), "model updated with correct values");
  });
});
