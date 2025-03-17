/**
 * tests for the sap.suite.ui.generic.template.lib.ShellPersonalizationService
 */
sap.ui.define([
  "testUtils/sinonEnhanced",
  "sap/suite/ui/generic/template/lib/AppComponent",
  "sap/suite/ui/generic/template/lib/ShellPersonalizationService",
  "sap/suite/ui/generic/template/genericUtilities/testableHelper"
], function (
  sinon,
  AppComponent,
  ShellPersonalizationService,
  testableHelper
) {
  "use strict";

  var oSandbox;
  var oShellPersonalizationService;

  var oAppComponent = sinon.createStubInstance(AppComponent);
  var oTemplatePrivateGlobal = {
    setProperty: function() {}
  };
  oAppComponent.getModel.returns(oTemplatePrivateGlobal);
  oAppComponent.getManifest.returns({
    "sap.app": {
      id: "appId"
    }
  });

  var oStubForPrivate;

  QUnit.module("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHelper", {
    beforeEach: function () {
      oStubForPrivate = testableHelper.startTest();
      oSandbox = sinon.sandbox.create();
      var oTemplateContract = {
        oAppComponent
      };
      oShellPersonalizationService = new ShellPersonalizationService(oTemplateContract);
    },
    afterEach: function () {
      oSandbox.restore();
      oShellPersonalizationService = null;
      testableHelper.endTest();
    }
  });

  QUnit.test("init should return if UShellContainer not available", function (assert) {
    oSandbox.stub(sap.ui, "require").withArgs("sap/ushell/Container").returns(undefined);
    oStubForPrivate.setShellPersonalizationService({});
    var spy = oSandbox.spy(oStubForPrivate, "setShellPersonalizationService");

    oShellPersonalizationService.init();

    assert.ok(spy.notCalled, "function returned without attempting to get a new service");
  });

  QUnit.test("init should return if ShellPersonalizationService has already been instantiated", function (assert) {
    var oUShellContainer = {
      getServiceAsync: function () { return Promise.resolve(); }
    };
    oSandbox.stub(sap.ui, "require").withArgs("sap/ushell/Container").returns(oUShellContainer);
    var spy = oSandbox.spy(oUShellContainer, "getServiceAsync");
    oStubForPrivate.setShellPersonalizationService({});

    oShellPersonalizationService.init();

    assert.ok(spy.notCalled, "function returned without attempting to get a new service");
  });

  QUnit.test("init should instantiate ShellPersonalizationService", async function (assert) {
    var oService = {
      constants: {
        keyCategory: {
          FIXED_KEY: "key"
        },
        writeFrequency: {
          LOW: "low"
        }
      }
    };
    var oUShellContainer = {
      getServiceAsync: function () { return Promise.resolve(oService); }
    };
    oSandbox.stub(sap.ui, "require").withArgs("sap/ushell/Container").returns(oUShellContainer);
    var spy = oSandbox.spy(oStubForPrivate, "setShellPersonalizationService");

    await oShellPersonalizationService.init();

    var firstCall = spy.getCall(0);
    assert.ok(spy.calledOnce, "new personalization service has been instantiated");
    assert.deepEqual(firstCall.args[0], oService, "new personalization service has been instantiated with correct args");
  });

  QUnit.test("hasInitialized should return true if service is initialized", async function (assert) {
    oStubForPrivate.setShellPersonalizationService({});

    var bResult = oShellPersonalizationService.hasInitialized();

    assert.equal(bResult, true, "personalization service is initialized");
  });

  QUnit.test("hasInitialized should return false if service is not initialized", async function (assert) {
    oStubForPrivate.setShellPersonalizationService(undefined);

    var bResult = oShellPersonalizationService.hasInitialized();

    assert.equal(bResult, false, "personalization service is not initialized");
  });

  QUnit.test("getApplicationPersonalizationData should prepare a valid request to the personalization service", async function (assert) {
    var oService = {
      constants: {
        keyCategory: {
          FIXED_KEY: "key"
        },
        writeFrequency: {
          LOW: "low"
        }
      }
    };
    oStubForPrivate.setShellPersonalizationService(oService);

    var oPersonalizer = {};
    var getPersDataStub = oSandbox.stub(oPersonalizer, "getPersData").returns(Promise.resolve({}));
    var getPersonalizerStub = oSandbox.stub(oService, "getPersonalizer").returns(Promise.resolve(oPersonalizer));

    var sItemName = "FCL-Personalization";
    var oPersId = {
      container: `App#appId`,
      item: sItemName
    };
    var oScope = {
      keyCategory: oService.constants.keyCategory.FIXED_KEY,
      writeFrequency: oService.constants.writeFrequency.LOW,
      clientStorageAllowed: false,
      validity: Infinity
    };

    await oShellPersonalizationService.getApplicationPersonalizationData(sItemName);

    assert.ok(getPersonalizerStub.calledWithExactly(oPersId, oScope, oAppComponent), "correct arguments are passed to getPersonalizer");
    assert.ok(getPersDataStub.calledOnce, "getPersData is called to retrieve personaliztion data");
  });

  QUnit.test("getApplicationPersonalizationData should not call personalization service if it has not been initialized", async function (assert) {
    var oService;
    oStubForPrivate.setShellPersonalizationService(oService);
    var sItemName = "FCL-Personalization";

    var oResult = await oShellPersonalizationService.getApplicationPersonalizationData(sItemName);

    assert.equal(oResult, undefined, "personalization service returns undefined");
  });

  QUnit.test("setApplicationPersonalizationData should store valid personalization data", async function (assert) {
    var oService = {
      constants: {
        keyCategory: {
          FIXED_KEY: "key"
        },
        writeFrequency: {
          LOW: "low"
        }
      }
    };
    oStubForPrivate.setShellPersonalizationService(oService);

    var oPersonalizer = {};
    var setPersDataStub = oSandbox.stub(oPersonalizer, "setPersData");
    var getPersonalizerStub = oSandbox.stub(oService, "getPersonalizer").returns(Promise.resolve(oPersonalizer));

    var sItemName = "FCL-Personalization";
    var oPersId = {
      container: `App#appId`,
      item: sItemName
    };
    var oScope = {
      keyCategory: oService.constants.keyCategory.FIXED_KEY,
      writeFrequency: oService.constants.writeFrequency.LOW,
      clientStorageAllowed: false,
      validity: Infinity
    };

    await oShellPersonalizationService.setApplicationPersonalizationData(sItemName);

    assert.ok(getPersonalizerStub.calledWithExactly(oPersId, oScope, oAppComponent), "correct arguments are passed to getPersonalizer");
    assert.ok(setPersDataStub.calledOnce, "setPersData is called to store personaliztion data");
  });
});
