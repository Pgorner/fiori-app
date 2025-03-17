"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "sap/base/i18n/ResourceBundle", "sap/feedback/ui/flpplugin/common/Constants", "sap/feedback/ui/flpplugin/pxapi/PxApiFactory", "sap/feedback/ui/flpplugin/pxapi/PxApiWrapper", "sap/feedback/ui/flpplugin/ui/InvitationDialog", "sinon"], function (___sap_px_pxapi, ResourceBundle, Constants, PxApiFactory, PxApiWrapper, InvitationDialog, sinon) {
  "use strict";

  var PxApi = ___sap_px_pxapi["PxApi"];
  var __exports = function __exports() {
    var pluginInfo = {
      id: 'pluginId',
      version: 'pluginVersion'
    };
    QUnit.module('PxApiWrapper unit tests', {});
    QUnit.test('createPxApi - shall create the instance of PxApi', function (assert) {
      var pxApi = PxApiFactory.createPxApi();
      assert.ok(pxApi instanceof PxApi);
    });
    QUnit.test('constructor - shall call the createPxApi of PxApiFactory with pxclient info', function (assert) {
      var createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi');
      globalThis.sap.qtx.info.pxclient = 'existingClientInfo/version';
      var pxApiWrapper = new PxApiWrapper(pluginInfo);
      assert.ok(pxApiWrapper);
      assert.ok(createPxApiStub.called);
      assert.ok(globalThis.sap.qtx.info.pxclient, 'existingClientInfo/version pluginId/pluginVersion');
      createPxApiStub.restore();
      globalThis.sap.qtx.info.pxclient = undefined;
    });
    QUnit.test('constructor - shall return default version for pxclient info when local build running', function (assert) {
      var createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi');
      globalThis.sap.qtx.info.pxclient = 'existingClientInfo/version';
      var localPluginInfo = {
        id: 'pluginId',
        version: '1.132.0'
      };
      var pxApiWrapper = new PxApiWrapper(localPluginInfo);
      assert.ok(pxApiWrapper);
      assert.ok(createPxApiStub.called);
      assert.ok(globalThis.sap.qtx.info.pxclient, 'existingClientInfo/version pluginId/dev-build');
      createPxApiStub.restore();
      globalThis.sap.qtx.info.pxclient = undefined;
    });
    QUnit.test('constructor - shall return fallback infos for pxclient info when no data provided/found.', function (assert) {
      var createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi');
      globalThis.sap.qtx.info.pxclient = 'existingClientInfo/version';
      var expectedResult = 'existingClientInfo/version ' + Constants.PXCLIENT_INFO_NAME_FALLBACK + '/' + Constants.PXCLIENT_INFO_VERSION_FALLBACK;
      var pxApiWrapper = new PxApiWrapper({
        id: '',
        version: ''
      });
      assert.ok(pxApiWrapper);
      assert.ok(createPxApiStub.called);
      assert.ok(globalThis.sap.qtx.info.pxclient, expectedResult);
      createPxApiStub.restore();
      globalThis.sap.qtx.info.pxclient = undefined;
    });
    QUnit.test('initialize - shall call the initialize of PX-API Library', function (assert) {
      try {
        var tenantInfo = {};
        var configIdentifier = {};
        var pxApiInstance = new PxApi();
        var pxApiInitializeStub = sinon.stub(pxApiInstance, 'initialize');
        var createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi').returns(pxApiInstance);
        var pxApiWrapper = new PxApiWrapper(pluginInfo);
        return Promise.resolve(pxApiWrapper.initialize(tenantInfo, configIdentifier)).then(function () {
          assert.ok(pxApiInitializeStub.calledWith(tenantInfo, configIdentifier));
          pxApiInitializeStub.restore();
          createPxApiStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('openSurvey - shall call the openSurvey of PX-API Library', function (assert) {
      var appContextData = {};
      var pxApiInstance = new PxApi();
      var pxApiOpenSurveyStub = sinon.stub(pxApiInstance, 'openSurvey');
      var createPxApiStub = sinon.stub(PxApiFactory, 'createPxApi').returns(pxApiInstance);
      var pxApiWrapper = new PxApiWrapper(pluginInfo);
      pxApiWrapper.openSurvey(appContextData);
      assert.ok(pxApiOpenSurveyStub.calledWith(appContextData));
      pxApiOpenSurveyStub.restore();
      createPxApiStub.restore();
    });
    QUnit.test('updateThemeId - shall set current theme to PX-API Library', function (assert) {
      var pxApiWrapper = new PxApiWrapper(pluginInfo);
      assert.equal(pxApiWrapper.pxApi.currentThemeId, 'none');
      pxApiWrapper.updateThemeId('sap_horizon');
      assert.equal(pxApiWrapper.pxApi.currentThemeId, 'sap_horizon');
    });
    QUnit.test('requestPush - shall invoke the "requestPush" of the PX-API Library', function (assert) {
      var pxApiWrapper = new PxApiWrapper(pluginInfo);
      var requestPushStub = sinon.stub(pxApiWrapper.pxApi, 'requestPush');
      var pushFeedbackRequestData = {
        areaId: '123',
        triggerName: 'myTrigger'
      };
      pxApiWrapper.requestPush(pushFeedbackRequestData);
      assert.ok(requestPushStub.calledWith(pushFeedbackRequestData));
      requestPushStub.restore();
    });
    QUnit.test('set/get invitationDialog - shall set and get the invitationDialog', function (assert) {
      var pxApiWrapper = new PxApiWrapper(pluginInfo);
      var dummyInvitationDialog = new InvitationDialog(sinon.createStubInstance(ResourceBundle));
      pxApiWrapper.invitationDialog = dummyInvitationDialog;
      assert.equal(pxApiWrapper.invitationDialog, dummyInvitationDialog);
    });
  };
  return __exports;
});
//# sourceMappingURL=PxApiWrapper.test.js.map