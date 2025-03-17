"use strict";

sap.ui.define(["sap/base/Log", "sap/feedback/ui/flpplugin/common/Constants", "sap/feedback/ui/flpplugin/common/UI5Util", "sap/feedback/ui/flpplugin/controller/PluginController", "sap/feedback/ui/flpplugin/data/AppContextData", "sap/feedback/ui/flpplugin/data/ThemeData", "sap/feedback/ui/flpplugin/ui/ShellBarButton", "sap/ui/core/Theming", "sinon"], function (Log, Constants, UI5Util, PluginController, AppContextData, ThemeData, ShellBarButton, Theming, sinon) {
  "use strict";

  var __exports = function __exports() {
    var errorLogStub;
    QUnit.module('PluginController unit tests', {
      beforeEach: function beforeEach() {
        errorLogStub = sinon.stub(Log, 'error');
      },
      afterEach: function afterEach() {
        errorLogStub.restore();
      }
    });
    QUnit.test('initPlugin - shall initiate the user initiated feedback', function (assert) {
      try {
        var pxApiWrapper = {
          pxApi: {
            isUserInitiatedFeedbackEnabled: true
          }
        };
        var resourceBundle = {};
        var pluginController = new PluginController(pxApiWrapper, resourceBundle);
        var initUserInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback');
        var prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport');
        var initAppTriggeredPushStub = sinon.stub(pluginController, 'initAppTriggeredPush');
        return Promise.resolve(pluginController.initPlugin()).then(function () {
          assert.ok(initUserInitiatedFeedbackStub.called);
          assert.ok(prepareThemingSupportStub.called);
          initUserInitiatedFeedbackStub.restore();
          prepareThemingSupportStub.restore();
          initAppTriggeredPushStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('initPlugin - shall not initiate the user initiated feedback when "manual" scope set not defined', function (assert) {
      try {
        var pxApiWrapper = {
          pxApi: {
            isUserInitiatedFeedbackEnabled: false
          }
        };
        var resourceBundle = {};
        var pluginController = new PluginController(pxApiWrapper, resourceBundle);
        var initUserInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback');
        var prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport');
        var initAppTriggeredPushStub = sinon.stub(pluginController, 'initAppTriggeredPush');
        return Promise.resolve(pluginController.initPlugin()).then(function () {
          assert.ok(initUserInitiatedFeedbackStub.notCalled);
          assert.ok(prepareThemingSupportStub.called);
          initUserInitiatedFeedbackStub.restore();
          prepareThemingSupportStub.restore();
          initAppTriggeredPushStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('initUserInitiatedFeedback - shall call the initShellBarButton', function (assert) {
      try {
        var pxApiWrapper = {};
        var resourceBundle = {};
        var pluginController = new PluginController(pxApiWrapper, resourceBundle);
        var initShellBarButtonStub = sinon.stub(ShellBarButton, 'initShellBarButton');
        return Promise.resolve(pluginController['initUserInitiatedFeedback']()).then(function () {
          assert.ok(initShellBarButtonStub.called);
          initShellBarButtonStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('openSurveyCallback - shall catch the error thrown by AppContextData - with Error()', function (assert) {
      try {
        var pxApiWrapper = {
          openSurvey: sinon.stub()
        };
        var pluginController = new PluginController(pxApiWrapper, {});
        var getDataStub = sinon.stub(AppContextData, 'getData').returns(Promise.reject(new Error(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE)));
        return Promise.resolve(pluginController['openSurveyCallback']()).then(function () {
          assert.ok(getDataStub.called);
          assert.notOk(pxApiWrapper.openSurvey.called);
          assert.ok(errorLogStub.calledWith(Constants.ERROR.CANNOT_TRIGGER_USER_INITIATED_FEEDBACK, Constants.ERROR.CURRENT_APP_NOT_AVAILABLE, Constants.COMPONENT.PLUGIN_CONTROLLER));
          getDataStub.restore();
          errorLogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('openSurveyCallback - shall catch the error thrown by AppContextData - with undefined error', function (assert) {
      try {
        var pxApiWrapper = {
          openSurvey: sinon.stub()
        };
        var pluginController = new PluginController(pxApiWrapper, {});
        var getDataStub = sinon.stub(AppContextData, 'getData').returns(Promise.reject(undefined));
        return Promise.resolve(pluginController['openSurveyCallback']()).then(function () {
          assert.ok(getDataStub.called);
          assert.notOk(pxApiWrapper.openSurvey.called);
          assert.ok(errorLogStub.calledWith(Constants.ERROR.CANNOT_TRIGGER_USER_INITIATED_FEEDBACK, undefined, Constants.COMPONENT.PLUGIN_CONTROLLER));
          getDataStub.restore();
          errorLogStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('openSurveyCallback - call the openSurvey after fetching the appContextData', function (assert) {
      try {
        var appContextData = {
          appFrameworkId: '1',
          appFrameworkVersion: '1.109.3 (202212090942)',
          appId: 'LAUNCHPAD',
          appSupportInfo: 'ach',
          appVersion: '1.0.0',
          technicalAppComponentId: 'sap.feedback.demo.fxtest',
          appTitle: 'Launchpad',
          languageTag: 'EN',
          theme: 'someTheme'
        };
        var pxApiWrapper = {
          openSurvey: sinon.stub()
        };
        var pluginController = new PluginController(pxApiWrapper, {});
        var getDataStub = sinon.stub(AppContextData, 'getData').returns(Promise.resolve(appContextData));
        return Promise.resolve(pluginController['openSurveyCallback']()).then(function () {
          assert.ok(getDataStub.called);
          assert.ok(pxApiWrapper.openSurvey.calledWith(appContextData));
          assert.notOk(errorLogStub.called);
          getDataStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('initAppTriggeredPush - shall trigger the requestPush with the push data', function (assert) {
      try {
        var pushData = {
          areaId: '001',
          payload: {
            test: '1234 - 5678 - 90123'
          },
          shortText: 'Some Feature',
          triggerName: 'manageStockPoC'
        };
        var eventBus = UI5Util.getEventBus();
        var pxApiWrapperMock = {
          requestPush: sinon.stub(),
          pxApi: {
            isUserInitiatedFeedbackEnabled: true
          }
        };
        var pluginController = new PluginController(pxApiWrapperMock, {});
        var prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport');
        var userInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback').returns(Promise.resolve());
        return Promise.resolve(pluginController.initPlugin()).then(function () {
          eventBus.publish(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, pushData);
          assert.ok(pxApiWrapperMock.requestPush.calledWith(pushData));
          prepareThemingSupportStub.restore();
          userInitiatedFeedbackStub.restore();
          pluginController['unsubscribeFromTheEventBusForTesting']();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('initAppTriggeredPush - shall trigger the requestPush with the push data also when "manual" scopeSet not defined.', function (assert) {
      try {
        var pushData = {
          areaId: '001',
          payload: {
            test: '1234 - 5678 - 90123'
          },
          shortText: 'Some Feature',
          triggerName: 'manageStockPoC'
        };
        var eventBus = UI5Util.getEventBus();
        var pxApiWrapperMock = {
          requestPush: sinon.stub(),
          pxApi: {
            isUserInitiatedFeedbackEnabled: false
          }
        };
        var pluginController = new PluginController(pxApiWrapperMock, {});
        var prepareThemingSupportStub = sinon.stub(pluginController, 'prepareThemingSupport');
        var userInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback').returns(Promise.resolve());
        return Promise.resolve(pluginController.initPlugin()).then(function () {
          eventBus.publish(Constants.EVENT_BUS.CHANNEL_ID, Constants.EVENT_BUS.EVENT_ID, pushData);
          assert.ok(userInitiatedFeedbackStub.notCalled);
          assert.ok(pxApiWrapperMock.requestPush.calledWith(pushData));
          prepareThemingSupportStub.restore();
          userInitiatedFeedbackStub.restore();
          pluginController['unsubscribeFromTheEventBusForTesting']();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('prepareThemingSupport - shall init and update last theme and subscribe to themeChange', function (assert) {
      try {
        var updateThemeIdStub = sinon.stub();
        var pxApiWrapper = {
          updateThemeId: updateThemeIdStub,
          pxApi: {
            isUserInitiatedFeedbackEnabled: true
          }
        };
        var resourceBundle = {};
        var ui5UtilGetThemeStub = sinon.stub(UI5Util, 'getTheme').returns('sap_horizon');
        var pluginController = new PluginController(pxApiWrapper, resourceBundle);
        var initUserInitiatedFeedbackStub = sinon.stub(pluginController, 'initUserInitiatedFeedback');
        var initLastThemeStub = sinon.stub(ThemeData, 'initLastTheme');
        //ActionItem:  UI5 2.0 Refactoring required
        var attachAppliedThemingStub = sinon.stub(Theming, 'attachApplied');
        return Promise.resolve(pluginController.initPlugin()).then(function () {
          assert.ok(initUserInitiatedFeedbackStub.called);
          assert.ok(initLastThemeStub.called);
          assert.ok(updateThemeIdStub.called);
          assert.ok(attachAppliedThemingStub.called);
          initUserInitiatedFeedbackStub.restore();
          initLastThemeStub.restore();
          ui5UtilGetThemeStub.restore();
          attachAppliedThemingStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('themeChanged - shall call the onThemeChanged', function (assert) {
      var changedThemeId = 'sap_horizon';
      var eventDataMock = {
        theme: changedThemeId
      };
      var updateThemeIdStub = sinon.stub();
      var pxApiWrapper = {
        updateThemeId: updateThemeIdStub
      };
      var updateCurrentThemeStub = sinon.stub(ThemeData, 'updateCurrentTheme');
      var resourceBundle = {};
      var pluginController = new PluginController(pxApiWrapper, resourceBundle);
      var onThemeChangedStub = sinon.stub(pluginController, 'onThemeChanged');

      //ActionItem:  UI5 2.0 Refactoring required
      // Done but untested
      pluginController['themeChanged'](eventDataMock);
      assert.ok(onThemeChangedStub.calledWith(changedThemeId));
      updateCurrentThemeStub.restore();
    });
    QUnit.test('onThemeChanged - update current theme', function (assert) {
      var changedThemeId = 'sap_horizon';
      var updateThemeIdStub = sinon.stub();
      var pxApiWrapper = {
        updateThemeId: updateThemeIdStub
      };
      var updateCurrentThemeStub = sinon.stub(ThemeData, 'updateCurrentTheme');
      var resourceBundle = {};
      var pluginController = new PluginController(pxApiWrapper, resourceBundle);

      //ActionItem:  UI5 2.0 Refactoring required
      // Done but untested
      pluginController['onThemeChanged'](changedThemeId);
      assert.ok(updateThemeIdStub.calledWith('sap_horizon'));
      assert.ok(updateCurrentThemeStub.calledWith('sap_horizon'));
      updateCurrentThemeStub.restore();
    });
  };
  return __exports;
});
//# sourceMappingURL=PluginController.test.js.map