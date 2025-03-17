"use strict";

sap.ui.define(["sap/base/i18n/Localization", "sap/feedback/ui/flpplugin/common/UI5Util", "sap/ui/core/EventBus", "sap/ui/core/Theming", "sinon"], function (Localization, UI5Util, EventBus, Theming, sinon) {
  "use strict";

  var __exports = function __exports() {
    QUnit.module('UI5Util unit tests', {});
    QUnit.test('getTheme - shall return the current theme.', function (assert) {
      var getThemeStub = sinon.stub(Theming, 'getTheme').returns('sap_fiori_3');
      var themeResult = UI5Util.getTheme();
      assert.equal(themeResult, 'sap_fiori_3');
      getThemeStub.restore();
    });
    QUnit.test('getThemeId - shall return the current theme typed.', function (assert) {
      var getThemeStub = sinon.stub(UI5Util, 'getTheme').returns('sap_fiori_3');
      var themeResult = UI5Util.getThemeId();
      assert.equal(themeResult, 'sap_fiori_3');
      getThemeStub.restore();
    });
    QUnit.test('getLanguage - shall return the current language.', function (assert) {
      var getLanguageStub = sinon.stub(Localization, 'getLanguage').returns('en-us');
      var resultedLanguage = UI5Util.getLanguage();
      assert.equal(resultedLanguage, 'en-us');
      getLanguageStub.restore();
    });
    QUnit.test('getCurrentApp - shall return the current application.', function (assert) {
      try {
        var appLifeCycleServiceMock = {
          getCurrentApplication: sinon.stub().returns({})
        };
        var getAppLifeCycleServiceStub = sinon.stub(UI5Util, 'getAppLifeCycleService').returns(Promise.resolve(appLifeCycleServiceMock));
        return Promise.resolve(UI5Util.getCurrentApp()).then(function (resultedCurrentApp) {
          assert.ok(appLifeCycleServiceMock.getCurrentApplication.called);
          assert.deepEqual(resultedCurrentApp, {});
          getAppLifeCycleServiceStub.restore();
          appLifeCycleServiceMock.getCurrentApplication.reset();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getAppLifeCycleService - shall return the current AppLifeCycle.', function (assert) {
      try {
        var getServiceAsyncMock = sinon.stub().withArgs('AppLifeCycle').returns({});
        var shellContainerMock = {
          getServiceAsync: getServiceAsyncMock
        };
        var getShellContainerStub = sinon.stub(UI5Util, 'getShellContainer').returns(Promise.resolve(shellContainerMock));
        return Promise.resolve(UI5Util.getAppLifeCycleService()).then(function (resultedAppLifeCycle) {
          assert.ok(getServiceAsyncMock.calledWith('AppLifeCycle'));
          assert.deepEqual(resultedAppLifeCycle, {});
          getShellContainerStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getExtensionService - shall return the current ShellExtension.', function (assert) {
      try {
        var getServiceAsyncMock = sinon.stub().withArgs('Extension').returns({});
        var shellContainerMock = {
          getServiceAsync: getServiceAsyncMock
        };
        var getShellContainerStub = sinon.stub(UI5Util, 'getShellContainer').returns(Promise.resolve(shellContainerMock));
        return Promise.resolve(UI5Util.getExtensionService()).then(function (resultedAppLifeCycle) {
          assert.ok(getServiceAsyncMock.calledWith('Extension'));
          assert.deepEqual(resultedAppLifeCycle, {});
          getShellContainerStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getShellContainer - shall return the current getShellContainer.', function (assert) {
      try {
        return Promise.resolve(UI5Util.getShellContainer()).then(function (resultedShellContainer) {
          assert.notEqual(resultedShellContainer, null);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getEventBus - shall return the UI5 Event bus.', function (assert) {
      var eventBusGetInstanceStub = sinon.stub(EventBus, 'getInstance');
      UI5Util.getEventBus();
      assert.ok(eventBusGetInstanceStub.called);
      eventBusGetInstanceStub.restore();
    });
  };
  return __exports;
});
//# sourceMappingURL=UI5Util.test.js.map