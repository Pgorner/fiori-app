"use strict";

sap.ui.define(["sap/feedback/ui/thirdparty/sap-px/pxapi", "sap/feedback/ui/flpplugin/common/UI5Util", "sap/feedback/ui/flpplugin/data/ThemeData", "sap/feedback/ui/flpplugin/storage/LocalStorageHandler", "sinon"], function (___sap_px_pxapi, UI5Util, ThemeData, LocalStorageHandler, sinon) {
  "use strict";

  var ThemeId = ___sap_px_pxapi["ThemeId"];
  var __exports = function __exports() {
    QUnit.module('ThemeData unit tests', {});
    QUnit.test('initLastTheme - init last theme without persisted last theme value', function (assert) {
      var getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns('sap_horizon');
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        lastTheme: null
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.initLastTheme();
      assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'sap_horizon'));
      getThemeStub.restore();
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('initLastTheme - init last theme with persisted valid last theme value', function (assert) {
      var getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns('sap_horizon');
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        lastTheme: 'sap_fiori_3'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.initLastTheme();
      assert.ok(updateThemeStateStub.calledWith('sap_fiori_3', 'sap_horizon'));
      getThemeStub.restore();
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('initLastTheme - init last theme with persisted invalid last theme value', function (assert) {
      var getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns('sap_horizon');
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        lastTheme: 'foo'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.initLastTheme();
      assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'sap_horizon'));
      getThemeStub.restore();
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('initLastTheme - init last theme with invalid current theme', function (assert) {
      var getThemeStub = sinon.stub(UI5Util, 'getThemeId').returns(ThemeId.none);
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        lastTheme: 'foo'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.initLastTheme();
      assert.ok(updateThemeStateStub.calledWith('none', 'none'));
      getThemeStub.restore();
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - shall not call updateThemeState when no userState provided', function (assert) {
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(undefined);
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.updateCurrentTheme('sap_horizon');
      assert.notOk(updateThemeStateStub.called);
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - invalid persisted theme, valid current theme', function (assert) {
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        currentTheme: 'foo'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.updateCurrentTheme('sap_horizon');
      assert.ok(updateThemeStateStub.calledWith('none', 'sap_horizon'));
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - valid persisted theme, invalid current theme', function (assert) {
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        currentTheme: 'sap_horizon'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.updateCurrentTheme('foo');
      assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'none'));
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - valid persisted theme, valid current theme', function (assert) {
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        currentTheme: 'sap_horizon'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.updateCurrentTheme('sap_fiori_3');
      assert.ok(updateThemeStateStub.calledWith('sap_horizon', 'sap_fiori_3'));
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('updateCurrentTheme - invalid persisted theme, invalid current theme', function (assert) {
      var getLocalStorageUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        currentTheme: 'foo'
      });
      var updateThemeStateStub = sinon.stub(ThemeData, 'updateThemeState');
      ThemeData.updateCurrentTheme('invalid');
      assert.notOk(updateThemeStateStub.called);
      getLocalStorageUserStateStub.restore();
      updateThemeStateStub.restore();
    });
    QUnit.test('updateThemeState - shall call updates to last and current theme', function (assert) {
      var updateLastThemeStub = sinon.stub(LocalStorageHandler, 'updateLastTheme');
      var updateCurrentThemeStub = sinon.stub(LocalStorageHandler, 'updateCurrentTheme');
      ThemeData.updateThemeState('firstValue', 'secondValue');
      assert.ok(updateLastThemeStub.calledWith('firstValue'));
      assert.ok(updateCurrentThemeStub.calledWith('secondValue'));
      updateLastThemeStub.restore();
      updateCurrentThemeStub.restore();
    });
    QUnit.test('getPreviousTheme - shall return valid theme', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        lastTheme: 'sap_horizon'
      });
      var result = ThemeData.getPreviousTheme();
      assert.equal(result, 'sap_horizon');
      getUserStateStub.restore();
    });
    QUnit.test('getPreviousTheme - shall return none for invalid theme if UserState contains invalid theme', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns({
        lastTheme: 'foo'
      });
      var result = ThemeData.getPreviousTheme();
      assert.equal(result, 'none');
      getUserStateStub.restore();
    });
    QUnit.test('getPreviousTheme - shall return none for invalid theme if UserState cannot be read', function (assert) {
      var getUserStateStub = sinon.stub(LocalStorageHandler, 'getUserState').returns(null);
      var result = ThemeData.getPreviousTheme();
      assert.equal(result, 'none');
      getUserStateStub.restore();
    });
  };
  return __exports;
});
//# sourceMappingURL=ThemeData.test.js.map