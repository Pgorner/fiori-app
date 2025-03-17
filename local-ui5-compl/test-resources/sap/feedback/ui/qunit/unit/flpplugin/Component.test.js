"use strict";

sap.ui.define(["sap/feedback/ui/flpplugin/Component", "sap/feedback/ui/flpplugin/controller/ControllerFactory", "sap/feedback/ui/flpplugin/pxapi/PxApiWrapper", "sap/feedback/ui/flpplugin/ui/ControlFactory", "sinon"], function (Component, ControllerFactory, PxApiWrapper, ControlFactory, sinon) {
  "use strict";

  var __exports = function __exports() {
    var qualtricsInternalUri = 'https://someQualtricsUri.tld';
    var tenantId = 'foo';
    var tenantRole = 'bar';
    var configIdentifier = {
      configUrl: 'somepxconfigUrl',
      unitId: 'SomeUnitId',
      environment: 'test'
    };
    var platformType = 'QUnit';
    var productName = 'UnitTest';
    QUnit.module('Component unit tests', {});
    QUnit.test('init - shall start with old FLP settings (complete)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            qualtricsInternalUri: qualtricsInternalUri,
            tenantId: tenantId,
            tenantRole: tenantRole,
            platformType: platformType,
            productName: productName
          }
        });
        var pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true)),
          pxApiWrapper: pxApiWrapperStub
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.ok(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall start with old FLP settings (component data is undefined)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns(undefined);
        var runInitProcessStub = sinon.stub(Component.prototype, 'runInitProcess').returns(true);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(runInitProcessStub.called);
          getComponentDataStub.restore();
          runInitProcessStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall start with old FLP settings (complete but pxApiWrapper is not undefined)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            qualtricsInternalUri: qualtricsInternalUri,
            tenantId: tenantId,
            tenantRole: tenantRole,
            platformType: platformType,
            productName: productName
          }
        });
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true)),
          pxApiWrapper: undefined
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall start with old FLP settings (incomplete, no qualtricsInternalUri)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            tenantId: tenantId,
            tenantRole: tenantRole,
            platformType: platformType,
            productName: productName
          }
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
          createInitControllerStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall start with old FLP settings (complete but init is not successful)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            qualtricsInternalUri: qualtricsInternalUri,
            tenantId: tenantId,
            tenantRole: tenantRole,
            platformType: platformType,
            productName: productName
          }
        });
        var pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(false)),
          pxApiWrapper: pxApiWrapperStub
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall start with old FLP settings (incomplete, no tenantId)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            qualtricsInternalUri: qualtricsInternalUri,
            tenantRole: tenantRole,
            platformType: platformType,
            productName: productName
          }
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall start with new FLP settings (complete)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            configUrl: configIdentifier.configUrl,
            unitId: configIdentifier.unitId,
            environment: configIdentifier.environment,
            tenantId: tenantId,
            tenantRole: tenantRole
          }
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true)),
          pxApiWrapper: pxApiWrapperStub
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.ok(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall not init with new FLP settings (incomplete, no configUrl)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            unitId: configIdentifier.unitId,
            environment: configIdentifier.environment,
            tenantId: tenantId,
            tenantRole: tenantRole
          }
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall not init with new FLP settings (incomplete, no unitId)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            configUrl: configIdentifier.configUrl,
            environment: configIdentifier.environment,
            tenantId: tenantId,
            tenantRole: tenantRole
          }
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall not init with new FLP settings (incomplete, no environment)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {
            configUrl: configIdentifier.configUrl,
            unitId: configIdentifier.unitId,
            tenantId: tenantId,
            tenantRole: tenantRole
          }
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall not init with old properties (load not called)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('url', qualtricsInternalUri);
        component.setProperty('tenantId', tenantId);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.init()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall init with old properties (complete)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var pluginController = {
          initPlugin: sinon.stub().returns(Promise.resolve(true))
        };
        var createPluginControllerStub = sinon.stub(ControllerFactory, 'createPluginController').returns(pluginController);
        var pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true)),
          pxApiWrapper: pxApiWrapperStub
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('url', qualtricsInternalUri);
        component.setProperty('tenantId', tenantId);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.ok(createPluginControllerStub.called);
          getComponentDataStub.restore();
          createPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall not init with old properties (incomplete, url)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('tenantId', tenantId);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall not init with old properties (incomplete, tenantId)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('url', qualtricsInternalUri);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall init with new properties (complete)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true)),
          pxApiWrapper: pxApiWrapperStub
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('configIdentifier', configIdentifier);
        component.setProperty('tenantId', tenantId);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.ok(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall not init with new properties (incomplete, configIdentifier)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('tenantId', tenantId);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall not init with new properties (incomplete, tenantId)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('configIdentifier', configIdentifier);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall init with new properties (complete with configJson)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var pxApiWrapperStub = sinon.createStubInstance(PxApiWrapper);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true)),
          pxApiWrapper: pxApiWrapperStub
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('configJson', {});
        component.setProperty('tenantId', tenantId);
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.ok(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('load - shall not init with new properties (incomplete with configJson, no tenantId)', function (assert) {
      try {
        var getComponentDataStub = sinon.stub(Component.prototype, 'getComponentData').returns({
          config: {}
        });
        var initPluginControllerStub = sinon.stub(Component.prototype, 'initializePluginController').returns(true);
        var initController = {
          init: sinon.stub().returns(Promise.resolve(true))
        };
        var createInitControllerStub = sinon.stub(ControllerFactory, 'createInitController').returns(initController);
        var invitationDialog = {
          surveyInvitationDialogShowCallback: sinon.stub()
        };
        var createSurveyInvitationDialogStub = sinon.stub(ControlFactory, 'createSurveyInvitationDialog').returns(invitationDialog);
        var component = new Component();
        component.setProperty('configJson', {});
        component.setProperty('tenantRole', tenantRole);
        component.setProperty('productName', productName);
        component.setProperty('platformType', platformType);
        return Promise.resolve(component.load()).then(function () {
          assert.notOk(initPluginControllerStub.called);
          getComponentDataStub.restore();
          initPluginControllerStub.restore();
          createInitControllerStub.restore();
          createSurveyInvitationDialogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  };
  return __exports;
});
//# sourceMappingURL=Component.test.js.map