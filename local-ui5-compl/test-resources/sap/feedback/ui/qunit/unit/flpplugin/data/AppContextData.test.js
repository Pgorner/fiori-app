"use strict";

sap.ui.define(["sap/base/Log", "sap/feedback/ui/flpplugin/common/Constants", "sap/feedback/ui/flpplugin/common/UI5Util", "sap/feedback/ui/flpplugin/common/Util", "sap/feedback/ui/flpplugin/data/AppContextData", "sap/feedback/ui/flpplugin/data/ThemeData", "sap/ushell/services/AppConfiguration", "sinon"], function (Log, Constants, UI5Util, Util, AppContextData, ThemeData, AppConfiguration, sinon) {
  "use strict";

  function _catch(body, recover) {
    try {
      var result = body();
    } catch (e) {
      return recover(e);
    }
    if (result && result.then) {
      return result.then(void 0, recover);
    }
    return result;
  }
  var __exports = function __exports() {
    var warningLogStub, errorLogStub;
    var defaultAppContextData = {
      appFrameworkId: Constants.DEFAULT_VALUE_NA,
      appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
      theme: Constants.DEFAULT_VALUE_NA,
      appId: Constants.DEFAULT_VALUE_NA,
      appTitle: Constants.DEFAULT_VALUE_NA,
      languageTag: Constants.DEFAULT_VALUE_NA,
      technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
      appVersion: Constants.DEFAULT_VALUE_NA,
      appSupportInfo: Constants.DEFAULT_VALUE_NA
    };
    QUnit.module('AppContextData unit tests', {
      beforeEach: function beforeEach() {
        warningLogStub = sinon.stub(Log, 'warning');
        errorLogStub = sinon.stub(Log, 'error');
      },
      afterEach: function afterEach() {
        warningLogStub.restore();
        errorLogStub.restore();
      }
    });
    QUnit.test('getData - shall return the default appContextData and log the warning when application type is not supported', function (assert) {
      try {
        var getCurrentAppStub = sinon.stub(UI5Util, 'getCurrentApp').returns(Promise.resolve({
          applicationType: 'unsupportedApp'
        }));
        return Promise.resolve(AppContextData.getData()).then(function (appContextData) {
          assert.deepEqual(appContextData, defaultAppContextData);
          assert.ok(warningLogStub.calledWith(Constants.WARNING.UNSUPPORTED_APP_TYPE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA));
          getCurrentAppStub.restore();
          warningLogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getData - shall throw log and throw error when current application is not available', function (assert) {
      try {
        var getCurrentAppStub = sinon.stub(UI5Util, 'getCurrentApp').returns(Promise.resolve(undefined));
        var _temp = _catch(function () {
          return Promise.resolve(AppContextData.getData()).then(function () {});
        }, function (error) {
          var err = error;
          assert.equal(err.message, Constants.ERROR.CURRENT_APP_NOT_AVAILABLE);
          assert.ok(errorLogStub.calledWith(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA));
          getCurrentAppStub.restore();
          errorLogStub.restore();
        });
        return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getData - shall return the app context data', function (assert) {
      try {
        var appInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'Launchpad',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest'
        };
        var expectedContextData = {
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'Launchpad',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'Launchpad',
          languageTag: 'EN',
          appFrameworkId: '2',
          previousTheme: 'sap_fiori_3',
          theme: 'base'
        };
        var currentAppMock = {
          applicationType: 'ui5',
          getInfo: sinon.stub().returns(Promise.resolve(appInfo))
        };
        var getLanguageStub = sinon.stub(UI5Util, 'getLanguage').returns('en');
        var getThemeStub = sinon.stub(UI5Util, 'getTheme').returns('base');
        var getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_fiori_3');
        var getCurrentAppStub = sinon.stub(UI5Util, 'getCurrentApp').returns(Promise.resolve(currentAppMock));
        var getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata').returns({
          title: expectedContextData.appTitle
        });
        return Promise.resolve(AppContextData.getData()).then(function (appContextData) {
          assert.deepEqual(appContextData, expectedContextData);
          getCurrentAppStub.restore();
          getMetadataStub.restore();
          getPreviousThemeStub.restore();
          getThemeStub.restore();
          getLanguageStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('isAppTypeSupported - shall return true for supported App types and false for unsupported App types', function (assert) {
      var supportedAppTypes = ['ui5', 'wda', 'gui', 'tr', 'nwbc', 'url'];
      var unSupportedAppTypes = ['abc', 'test'];
      supportedAppTypes.forEach(function (currentAppType) {
        var result = AppContextData['isAppTypeSupported'](currentAppType);
        assert.ok(result);
      });
      unSupportedAppTypes.forEach(function (currentAppType) {
        var result = AppContextData['isAppTypeSupported'](currentAppType);
        assert.notOk(result);
      });
    });
    QUnit.test('getAppInfo - shall return the expected appInfo - title available in appConfig metadata', function (assert) {
      try {
        var appInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'F9999',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest'
        };
        var expectedAppInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'F9999',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'hello world title'
        };
        var currentAppMock = {
          getInfo: sinon.stub().returns(Promise.resolve(appInfo))
        };
        var getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata').returns({
          title: expectedAppInfo.appTitle
        });
        return Promise.resolve(AppContextData['getAppInfo'](currentAppMock)).then(function (resultedAppInfo) {
          assert.deepEqual(resultedAppInfo, expectedAppInfo);
          currentAppMock.getInfo.reset();
          getMetadataStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getAppInfo - shall return the expected appInfo - appConfig metadata is empty {}', function (assert) {
      try {
        var appInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest'
        };
        var expectedAppInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'Launchpad'
        };
        var currentAppMock = {
          getInfo: sinon.stub().returns(Promise.resolve(appInfo))
        };
        var getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata').returns({});
        return Promise.resolve(AppContextData['getAppInfo'](currentAppMock)).then(function (resultedAppInfo) {
          assert.deepEqual(resultedAppInfo, expectedAppInfo);
          currentAppMock.getInfo.reset();
          getMetadataStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getAppInfo - shall return the expected appInfo - appConfig metadata is undefined', function (assert) {
      try {
        var appInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest'
        };
        var expectedAppInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'Launchpad'
        };
        var currentAppMock = {
          getInfo: sinon.stub().returns(Promise.resolve(appInfo))
        };
        var getMetadataStub = sinon.stub(AppConfiguration, 'getMetadata').returns(undefined);
        return Promise.resolve(AppContextData['getAppInfo'](currentAppMock)).then(function (resultedAppInfo) {
          assert.deepEqual(resultedAppInfo, expectedAppInfo);
          currentAppMock.getInfo.reset();
          getMetadataStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getAppInfo - shall return the expected appInfo - appInfo is undefined', function (assert) {
      try {
        var currentApp = {
          getInfo: sinon.stub().returns(Promise.resolve(undefined))
        };
        return Promise.resolve(AppContextData['getAppInfo'](currentApp)).then(function (resultedAppInfo) {
          assert.deepEqual(resultedAppInfo, undefined);
          currentApp.getInfo.reset();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getContextData - shall return the application context data using provided appInfo', function (assert) {
      try {
        var appInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'Launchpad'
        };
        var expectedContextData = {
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'Launchpad',
          languageTag: 'EN',
          previousTheme: 'sap_horizon',
          appFrameworkId: '1',
          theme: 'someTheme'
        };
        var getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_horizon');
        var getThemeStub = sinon.stub(UI5Util, 'getTheme').returns(expectedContextData.theme);
        var convertAppFrameworkTypeToIdStub = sinon.stub(Util, 'convertAppFrameworkTypeToId').returns(expectedContextData.appFrameworkId);
        var getLanguageStub = sinon.stub(AppContextData, 'getLanguage').returns(expectedContextData.languageTag);
        return Promise.resolve(AppContextData['getContextData'](appInfo)).then(function (contextData) {
          assert.deepEqual(contextData, expectedContextData);
          getPreviousThemeStub.restore();
          getThemeStub.restore();
          convertAppFrameworkTypeToIdStub.restore();
          getLanguageStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getContextData - shall return the application context data, returning defaults for some values. Using provided appInfo with some missing properties', function (assert) {
      try {
        var appInfo = {
          appFrameworkId: 'UI5',
          appFrameworkVersion: undefined,
          appId: undefined,
          appSupportInfo: null,
          appVersion: undefined,
          technicalAppComponentId: null,
          appTitle: undefined
        };
        var expectedContextData = {
          appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
          appId: Constants.DEFAULT_VALUE_NA,
          appSupportInfo: Constants.DEFAULT_VALUE_NA,
          appVersion: Constants.DEFAULT_VALUE_NA,
          technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
          appTitle: Constants.DEFAULT_VALUE_NA,
          languageTag: 'EN',
          previousTheme: 'sap_horizon',
          appFrameworkId: '1',
          theme: 'someTheme'
        };
        var getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_horizon');
        var getThemeStub = sinon.stub(UI5Util, 'getTheme').returns(expectedContextData.theme);
        var convertAppFrameworkTypeToIdStub = sinon.stub(Util, 'convertAppFrameworkTypeToId').returns(expectedContextData.appFrameworkId);
        var getLanguageStub = sinon.stub(AppContextData, 'getLanguage').returns(expectedContextData.languageTag);
        return Promise.resolve(AppContextData['getContextData'](appInfo)).then(function (contextData) {
          assert.deepEqual(contextData, expectedContextData);
          getPreviousThemeStub.restore();
          getThemeStub.restore();
          convertAppFrameworkTypeToIdStub.restore();
          getLanguageStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getContextData - shall return the application context data using provided appInfo - appInfo is undefined', function (assert) {
      try {
        var appInfo;
        var expectedContextData = {
          appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
          appId: Constants.DEFAULT_VALUE_NA,
          appSupportInfo: Constants.DEFAULT_VALUE_NA,
          appVersion: Constants.DEFAULT_VALUE_NA,
          technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
          appTitle: Constants.DEFAULT_VALUE_NA,
          languageTag: 'EN',
          previousTheme: 'sap_horizon',
          appFrameworkId: '1',
          theme: 'someTheme'
        };
        var getPreviousThemeStub = sinon.stub(ThemeData, 'getPreviousTheme').returns('sap_horizon');
        var getThemeStub = sinon.stub(UI5Util, 'getTheme').returns(expectedContextData.theme);
        var convertAppFrameworkTypeToIdStub = sinon.stub(Util, 'convertAppFrameworkTypeToId').returns(expectedContextData.appFrameworkId);
        var getLanguageStub = sinon.stub(AppContextData, 'getLanguage').returns(expectedContextData.languageTag);
        return Promise.resolve(AppContextData['getContextData'](appInfo)).then(function (contextData) {
          assert.deepEqual(contextData, expectedContextData);
          getPreviousThemeStub.restore();
          getThemeStub.restore();
          convertAppFrameworkTypeToIdStub.restore();
          getLanguageStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getLanguage - shall return the language: without userData', function (assert) {
      var getLanguageStub = sinon.stub(UI5Util, 'getLanguage').returns('en');
      var language = AppContextData['getLanguage']();
      assert.equal(language, 'EN');
      getLanguageStub.restore();
    });
  };
  return __exports;
});
//# sourceMappingURL=AppContextData.test.js.map