"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "sap/base/Log", "sap/feedback/ui/flpplugin/common/Constants", "sap/feedback/ui/flpplugin/common/Util", "sap/feedback/ui/flpplugin/controller/InitController", "sap/feedback/ui/flpplugin/pxapi/PxApiWrapper", "sap/feedback/ui/flpplugin/storage/PushStateMigrator", "sap/ui/Device", "sinon"], function (___sap_px_pxapi, Log, Constants, Util, InitController, PxApiWrapper, PushStateMigrator, Device, sinon) {
  "use strict";

  var Environment = ___sap_px_pxapi["Environment"];
  var __exports = function __exports() {
    var pluginInfo = {
      id: 'pluginId',
      version: 'pluginVersion'
    };
    var tenantInfo, configIdentifier, platformType, productName;
    var surveyInvitationDialogCallback = sinon.stub();
    QUnit.module('InitController unit tests', {
      beforeEach: function beforeEach() {
        tenantInfo = {
          tenantId: 'foo',
          tenantRole: 'bar'
        };
        configIdentifier = {
          configUrl: 'somepxconfigUrl',
          unitId: 'SomeUnitId',
          environment: 'test'
        };
        platformType = 'QUnit';
        productName = 'UnitTest';
      },
      afterEach: function afterEach() {
        surveyInvitationDialogCallback.reset();
        surveyInvitationDialogCallback.resetBehavior();
      }
    });
    QUnit.test('init - shall not initialize PluginController when Push state migration failed', function (assert) {
      try {
        var errorInfoStub = sinon.stub(Log, 'error');
        var migrateStub = sinon.stub(PushStateMigrator, 'migrate').returns(false);
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init({}, {})).then(function (result) {
          assert.equal(result, false);
          assert.ok(errorInfoStub.calledWith(Constants.ERROR.PUSH_STATE_MIGRATION_FAILED, undefined, Constants.COMPONENT.INIT_CONTROLLER));
          migrateStub.restore();
          errorInfoStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall not initialize PluginController when device is Phone', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: true
        });
        var logInfoStub = sinon.stub(Log, 'info');
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init({}, {})).then(function (result) {
          assert.ok(logInfoStub.called);
          assert.equal(result, false);
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
          logInfoStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall initialize PluginController when device is not Phone', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var hasOldParametersStub = sinon.stub(InitController.prototype, 'hasOldParameters').returns(true);
        var initWithOldParametersStub = sinon.stub(InitController.prototype, 'initWithOldParameters').returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init({}, {})).then(function (result) {
          assert.equal(result, true);
          hasOldParametersStub.restore();
          initWithOldParametersStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall initialize PluginController with old parameters (embedded config, no scopeSet)', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var rawParameters = {
          tenantId: tenantInfo.tenantId,
          tenantRole: tenantInfo.tenantRole,
          qualtricsInternalUri: 'someUrl',
          platformType: platformType,
          productName: productName
        };
        var pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
        pxApiWrapperInitStub.withArgs(tenantInfo, undefined, sinon.match.object).returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init(rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          var _args$2$startupConfig, _args$2$startupConfig2;
          assert.equal(result, true);
          var args = pxApiWrapperInitStub.getCall(0).args;
          assert.equal((_args$2$startupConfig = args[2].startupConfig) === null || _args$2$startupConfig === void 0 ? void 0 : _args$2$startupConfig.scopeSet.length, 1);
          assert.equal((_args$2$startupConfig2 = args[2].startupConfig) === null || _args$2$startupConfig2 === void 0 ? void 0 : _args$2$startupConfig2.scopeSet[0], Constants.SCOPE_SETS.MANUAL);
          pxApiWrapperInitStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall initialize PluginController with old parameters (embedded config, with scopeSet)', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var rawParameters = {
          tenantId: tenantInfo.tenantId,
          tenantRole: tenantInfo.tenantRole,
          qualtricsInternalUri: 'someUrl',
          platformType: platformType,
          productName: productName,
          scopeSet: 'abc, def'
        };
        var pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
        pxApiWrapperInitStub.withArgs(tenantInfo, undefined, sinon.match.object).returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init(rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          assert.equal(result, true);
          var args = pxApiWrapperInitStub.getCall(0).args;
          assert.equal(args[2].startupConfig.scopeSet.length, 3);
          pxApiWrapperInitStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall initialize PluginController with new parameters (central config)', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var rawParameters = {
          tenantId: tenantInfo.tenantId,
          tenantRole: tenantInfo.tenantRole,
          configUrl: configIdentifier.configUrl,
          unitId: configIdentifier.unitId,
          environment: configIdentifier.environment
        };
        var pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
        pxApiWrapperInitStub.withArgs(tenantInfo, configIdentifier).returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init(rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          assert.equal(result, true);
          pxApiWrapperInitStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall initialize PluginController with new parameters + URL Params (central config)', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var rawParameters = {
          tenantId: tenantInfo.tenantId,
          tenantRole: tenantInfo.tenantRole,
          configUrl: configIdentifier.configUrl,
          unitId: configIdentifier.unitId,
          environment: configIdentifier.environment
        };
        var expectedConfigIdentifier = {
          configUrl: configIdentifier.configUrl,
          unitId: 'abc',
          environment: Environment.dev
        };
        var windowSearchLocationStub = sinon.stub(Util, 'getWindowSearchLocation').returns('?sap-px-unitId=ABC&sap-px-env=dev');
        var pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
        pxApiWrapperInitStub.withArgs(tenantInfo, expectedConfigIdentifier).returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init(rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          assert.equal(result, true);
          windowSearchLocationStub.restore();
          pxApiWrapperInitStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall initialize PluginController with new parameters (config json)', function (assert) {
      try {
        var configJson = {
          version: '0.4.0',
          startupConfig: {
            qualtricsInternalUri: 'SomeUrl',
            productName: productName,
            platformType: platformType
          },
          runtimeConfig: {
            useApi: true
          },
          themingConfig: {
            writeToGlobals: true
          }
        };
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var rawParameters = {
          tenantId: tenantInfo.tenantId,
          tenantRole: tenantInfo.tenantRole,
          configJson: configJson
        };
        var pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
        pxApiWrapperInitStub.withArgs(tenantInfo, undefined, configJson).returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init(rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          assert.equal(result, true);
          pxApiWrapperInitStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('init - shall log error when inconsistent parameters provided', function (assert) {
      try {
        var originalPhoneValue = Device.system.phone;
        Object.defineProperty(Device.system, 'phone', {
          value: false
        });
        var rawParameters = {
          tenantId: tenantInfo.tenantId,
          tenantRole: tenantInfo.tenantRole,
          platformType: productName,
          productName: platformType
        };
        var logErrorStub = sinon.stub(Log, 'error');
        var pxApiWrapperInitStub = sinon.stub(PxApiWrapper.prototype, 'initialize');
        pxApiWrapperInitStub.returns(Promise.resolve(true));
        var initController = new InitController(pluginInfo);
        return Promise.resolve(initController.init(rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          assert.equal(result, false);
          assert.ok(logErrorStub.called);
          logErrorStub.restore();
          pxApiWrapperInitStub.restore();
          Object.defineProperty(Device.system, 'phone', {
            value: originalPhoneValue
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('initWithNewParameters - shall log error when inconsistent parameters provided', function (assert) {
      try {
        var initController = new InitController(pluginInfo);
        var logErrorStub = sinon.stub(Log, 'error');
        var rawParameters = {
          key1: 'value1',
          key2: 'value2'
        };
        return Promise.resolve(initController['initWithNewParameters'](rawParameters, surveyInvitationDialogCallback)).then(function (result) {
          assert.equal(result, false);
          assert.ok(logErrorStub.calledWith(Constants.ERROR.INIT_PARAMS_INCONSISTENT, undefined, Constants.COMPONENT.INIT_CONTROLLER));
          logErrorStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('get pxApiWrapper - shall return PxApiWrapper', function (assert) {
      var initController = new InitController(pluginInfo);
      assert.ok(initController instanceof InitController);
      assert.ok(initController.pxApiWrapper);
    });
    QUnit.test('overwriteWithUrlParameters - shall not overwrite the unitId and environment', function (assert) {
      var getUnitIdUrlParamValueStub = sinon.stub(Util, 'getUnitIdUrlParamValue').returns(null);
      var parameters = {
        unitId: '123',
        environment: 'dev'
      };
      var initController = new InitController(pluginInfo);
      initController['overwriteWithUrlParameters'](parameters);
      assert.deepEqual(parameters, {
        unitId: '123',
        environment: 'dev'
      });
      getUnitIdUrlParamValueStub.restore();
    });
    QUnit.test('overwriteWithUrlParameters - shall not overwrite the unitId and environment', function (assert) {
      var getUnitIdUrlParamValueStub = sinon.stub(Util, 'getUnitIdUrlParamValue').returns('123');
      var getEnvironmentUrlParamValueStub = sinon.stub(Util, 'getEnvironmentUrlParamValue').returns('dev');
      var parameters = {
        unitId: '456',
        environment: 'prod'
      };
      var initController = new InitController(pluginInfo);
      initController['overwriteWithUrlParameters'](parameters);
      assert.deepEqual(parameters, {
        unitId: '123',
        environment: 'dev'
      });
      getUnitIdUrlParamValueStub.restore();
      getEnvironmentUrlParamValueStub.restore();
    });
    QUnit.test('convertScopeSet - shall return the appropriate (new) scope set values for given (old) scope set string', function (assert) {
      var initController = new InitController(pluginInfo);
      var resultedScopSet1 = initController['convertScopeSet']('featurePush, dynamicPush, somethingElse');
      assert.deepEqual(resultedScopSet1, ['appPush', 'timedPush', 'somethingElse', 'manual']);
      var resultedScopSet2 = initController['convertScopeSet']('somethingElse');
      assert.deepEqual(resultedScopSet2, ['somethingElse', 'manual']);
      var resultedScopSet3 = initController['convertScopeSet'](undefined);
      assert.deepEqual(resultedScopSet3, [Constants.SCOPE_SETS.MANUAL]);
      var resultedScopSet4 = initController['convertScopeSet']('');
      assert.deepEqual(resultedScopSet4, [Constants.SCOPE_SETS.MANUAL]);
    });
    QUnit.test('appendManualScopeSet - scope set shall add manual scope set value to the Empty scopeSet array', function (assert) {
      var initController = new InitController(pluginInfo);
      var resultedScopSet = initController['appendManualScopeSet']([]);
      assert.deepEqual(resultedScopSet, ['manual']);
    });
    QUnit.test('appendManualScopeSet - scope set shall add manual scope set value to the existing the scopeSet array', function (assert) {
      var initController = new InitController(pluginInfo);
      var resultedScopSet = initController['appendManualScopeSet'](['appPush', 'timedPush']);
      assert.deepEqual(resultedScopSet, ['appPush', 'timedPush', 'manual']);
    });
    QUnit.test('appendManualScopeSet - scope set shall not add again manual scope set value to the existing the scopeSet array if its already set', function (assert) {
      var initController = new InitController(pluginInfo);
      var resultedScopSet = initController['appendManualScopeSet'](['appPush', 'timedPush', 'manual']);
      assert.deepEqual(resultedScopSet, ['appPush', 'timedPush', 'manual']);
    });
  };
  return __exports;
});
//# sourceMappingURL=InitController.test.js.map