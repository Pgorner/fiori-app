"use strict";

sap.ui.define(["sap/base/Log", "sap/feedback/ui/flpplugin/common/Constants", "sap/feedback/ui/flpplugin/storage/LocalStorageHandler", "sap/feedback/ui/flpplugin/storage/PushStateMigrator", "sinon"], function (Log, Constants, LocalStorageHandler, PushStateMigrator, sinon) {
  "use strict";

  function executePushStateMigratorTests() {
    var debugLogStub;
    QUnit.module('PushStateMigrator unit tests', {
      beforeEach: function beforeEach() {
        debugLogStub = sinon.stub(Log, 'debug');
      },
      afterEach: function afterEach() {
        debugLogStub.restore();
      }
    });
    QUnit.test('migrate - shall not do anything when userState is not found', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(undefined);
      var setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      PushStateMigrator.migrate();
      assert.notOk(setUserStateStub.called);
      getUserStateStub.restore();
      setUserStateStub.restore();
    });
    QUnit.test('migrate - shall not migrate the push state when there is no OLD push state found', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        timedPushDate: 1675242558195,
        appPushDate: 1675242558195,
        appPushStates: {},
        version: 0
      });
      var setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      PushStateMigrator.migrate();
      assert.notOk(setUserStateStub.called);
      assert.ok(debugLogStub.calledWith(Constants.DEBUG.NO_OLD_PUSH_STATE, undefined, Constants.COMPONENT.PUSH_STATE_MIGRATOR));
      getUserStateStub.restore();
      setUserStateStub.restore();
    });
    QUnit.test('migrate - shall not update the Push state - without Push states', function (assert) {
      var oldUserState = {
        currentTheme: 'my_theme',
        lastTheme: 'my_theme',
        version: 1
      };
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
      var setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      PushStateMigrator.migrate();
      assert.notOk(setUserStateStub.called);
      assert.ok(debugLogStub.calledWith(Constants.DEBUG.NO_OLD_PUSH_STATE, undefined, Constants.COMPONENT.PUSH_STATE_MIGRATOR));
      getUserStateStub.restore();
      setUserStateStub.restore();
    });
    QUnit.test('migrate - shall update the Push state with new Keys - with App triggered', function (assert) {
      var oldUserState = {
        currentTheme: 'my_theme',
        featurePushStates: {},
        inAppPushDate: 1675242558195,
        lastTheme: 'my_theme',
        version: 1
      };
      var newUserState = {
        currentTheme: 'my_theme',
        appPushStates: {},
        appPushDate: 1675242558195,
        lastTheme: 'my_theme',
        version: 1
      };
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
      var setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      PushStateMigrator.migrate();
      assert.ok(setUserStateStub.calledWith(newUserState));
      getUserStateStub.restore();
      setUserStateStub.restore();
    });
    QUnit.test('migrate - shall update the Push state with new Keys - with Time controlled', function (assert) {
      var oldUserState = {
        currentTheme: 'my_theme',
        dynamicPushDate: 1675242558195,
        lastTheme: 'my_theme',
        version: 1
      };
      var newUserState = {
        currentTheme: 'my_theme',
        timedPushDate: 1675242558195,
        lastTheme: 'my_theme',
        version: 1
      };
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
      var setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      PushStateMigrator.migrate();
      assert.ok(setUserStateStub.calledWith(newUserState));
      getUserStateStub.restore();
      setUserStateStub.restore();
    });
    QUnit.test('migrate - shall update the Push state with new Keys - with App push and Time controlled push', function (assert) {
      var oldUserState = {
        currentTheme: 'my_theme',
        dynamicPushDate: 1675242558195,
        featurePushStates: {
          '002/poc': {
            areaId: '007',
            executedCount: 1,
            lastChanged: 1675175919691,
            triggerName: 'pocTrigger',
            triggerType: 'recurring',
            triggeredCount: 1
          }
        },
        inAppPushDate: 1675242558195,
        lastTheme: 'my_theme',
        version: 1
      };
      var newUserState = {
        currentTheme: 'my_theme',
        timedPushDate: 1675242558195,
        appPushStates: {
          '002/poc': {
            areaId: '007',
            executedCount: 1,
            lastChanged: 1675175919691,
            triggerName: 'pocTrigger',
            triggerType: 'recurring',
            triggeredCount: 1
          }
        },
        appPushDate: 1675242558195,
        lastTheme: 'my_theme',
        version: 1
      };
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(oldUserState);
      var setUserStateStub = sinon.stub(LocalStorageHandler, 'updateUserState');
      PushStateMigrator.migrate();
      assert.ok(setUserStateStub.calledWith(newUserState));
      getUserStateStub.restore();
      setUserStateStub.restore();
    });
  }
  return executePushStateMigratorTests;
});
//# sourceMappingURL=PushStateMigrator.test.js.map