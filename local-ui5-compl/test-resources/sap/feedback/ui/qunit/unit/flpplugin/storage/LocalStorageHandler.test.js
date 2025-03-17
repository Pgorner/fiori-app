"use strict";

sap.ui.define(["sap/base/Log", "sap/feedback/ui/flpplugin/common/Constants", "sap/feedback/ui/flpplugin/storage/LocalStorageHandler", "sinon"], function (Log, Constants, LocalStorageHandler, sinon) {
  "use strict";

  function executeLocalStorageHandlerTests() {
    var errorLogStub, debugLogStub;
    QUnit.module('LocalStorageHandler unit tests', {
      beforeEach: function beforeEach() {
        errorLogStub = sinon.stub(Log, 'error');
        debugLogStub = sinon.stub(Log, 'debug');
      },
      afterEach: function afterEach() {
        errorLogStub.restore();
        debugLogStub.restore();
      }
    });
    QUnit.test('getUserState - shall catch the error and return undefined if unable to parse the User state', function (assert) {
      var localStorageMock = {
        getItem: sinon.stub().withArgs(Constants.PUSH_STATE_STORAGE_KEY).returns('{{}'),
        setItem: sinon.stub()
      };
      var getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);
      var userState = LocalStorageHandler.getUserState();
      assert.equal(userState, undefined);
      assert.ok(errorLogStub.called);
      getLocalStorageStub.restore();
    });
    QUnit.test('getUserState - shall return undefined if User state is not found in local storage', function (assert) {
      var localStorageMock = {
        getItem: sinon.stub().withArgs('something').returns(undefined),
        setItem: sinon.stub()
      };
      var getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);
      var userState = LocalStorageHandler.getUserState();
      assert.equal(userState, undefined);
      assert.notOk(errorLogStub.called);
      getLocalStorageStub.restore();
    });
    QUnit.test('getUserState - shall return parsed User state if available', function (assert) {
      var userStateString = '{"version":1,"dynamicPushDate":1677316125907,"inAppPushDate":1676192925907,"lastTheme":"sap_fiori_3","currentTheme":"sap_fiori_3","featurePushStates":{"poc/featuretest":{"areaId":"POC","triggerName":"featureTest","triggerType":"recurring","lastChanged":1674637741016,"triggeredCount":1,"executedCount":0},"001/managestockpoc":{"areaId":"001","triggerName":"manageStockPoC","triggerType":"recurring","lastChanged":1674637743467,"triggeredCount":1,"executedCount":0}}}';
      var localStorageMock = {
        getItem: sinon.stub().withArgs(Constants.PUSH_STATE_STORAGE_KEY).returns(userStateString),
        setItem: sinon.stub()
      };
      var getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);
      var userState = LocalStorageHandler.getUserState();
      assert.deepEqual(userState, JSON.parse(userStateString));
      getLocalStorageStub.restore();
    });
    QUnit.test('updateUserState - shall catch the error if unable to stringify the User state', function (assert) {
      var stringifyStub = sinon.stub(JSON, 'stringify').throws(new Error());
      var status = LocalStorageHandler.updateUserState({});
      assert.ok(errorLogStub.called);
      assert.notOk(status);
      stringifyStub.restore();
    });
    QUnit.test('updateUserState - shall just return true in case if no userState provided', function (assert) {
      var stringifyStub = sinon.stub(JSON, 'stringify').throws(new Error());
      var status = LocalStorageHandler.updateUserState(undefined);
      assert.ok(status);
      stringifyStub.restore();
    });
    QUnit.test('updateUserState - shall set the provided local storage object', function (assert) {
      var userStateString = '{"version":1,"dynamicPushDate":1677316125907,"inAppPushDate":1676192925907,"lastTheme":"sap_fiori_3","currentTheme":"sap_fiori_3","featurePushStates":{"poc/featuretest":{"areaId":"POC","triggerName":"featureTest","triggerType":"recurring","lastChanged":1674637741016,"triggeredCount":1,"executedCount":0},"001/managestockpoc":{"areaId":"001","triggerName":"manageStockPoC","triggerType":"recurring","lastChanged":1674637743467,"triggeredCount":1,"executedCount":0}}}';
      var userState = JSON.parse(userStateString);
      var localStorageMock = {
        getItem: sinon.stub(),
        setItem: sinon.stub()
      };
      var getLocalStorageStub = sinon.stub(LocalStorageHandler, 'getLocalStorage').returns(localStorageMock);
      var status = LocalStorageHandler.updateUserState(userState);
      assert.ok(localStorageMock.setItem.calledWith(Constants.PUSH_STATE_STORAGE_KEY, userStateString));
      assert.ok(debugLogStub.calledWith(Constants.DEBUG.PUSH_STATE_MIGRATED));
      assert.ok(status);
      getLocalStorageStub.restore();
    });
    QUnit.test('getLocalStorage - nothing but just for the sake of coverage!', function (assert) {
      var localStorage = LocalStorageHandler.getLocalStorage();
      assert.ok(localStorage);
    });
    QUnit.test('updateLastTheme - shall not call updateUserState when no themeId provided', function (assert) {
      var updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      LocalStorageHandler.updateLastTheme(undefined);
      assert.notOk(updateUserStateStub.called);
      updateUserStateStub.restore();
    });
    QUnit.test('updateLastTheme - shall update user state with last theme', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({});
      var updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      LocalStorageHandler.updateLastTheme('sap_horizon');
      assert.ok(updateUserStateStub.calledWith({
        lastTheme: 'sap_horizon'
      }));
      getUserStateStub.restore();
      updateUserStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - shall update user state with current theme', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({});
      var updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      LocalStorageHandler.updateCurrentTheme('sap_horizon');
      assert.ok(updateUserStateStub.calledWith({
        currentTheme: 'sap_horizon'
      }));
      getUserStateStub.restore();
      updateUserStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - shall not update user state if themeId is not provided', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({});
      var updateUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      LocalStorageHandler.updateCurrentTheme(null);
      assert.notOk(updateUserStateStub.called);
      getUserStateStub.restore();
      updateUserStateStub.restore();
    });
  }
  return executeLocalStorageHandlerTests;
});
//# sourceMappingURL=LocalStorageHandler.test.js.map