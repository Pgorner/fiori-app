"use strict";

sap.ui.define(["sap/feedback/ui/flpplugin/common/UI5Util", "sap/feedback/ui/flpplugin/ui/ShellBarButton", "sap/ushell/services/Extension", "sinon"], function (UI5Util, ShellBarButton, ShellExtension, sinon) {
  "use strict";

  var __exports = function __exports() {
    QUnit.module('ShellBarButton unit tests', {});
    QUnit.test('initShellBarButton - shall call the headerEndItem with desired parameters', function (assert) {
      try {
        var resourceBundle = {
          getText: sinon.stub().returns('Give Feedback')
        };
        var openSurveyCallback = sinon.stub();
        var showForAllAppsStub = sinon.stub();
        var showOnHomeStub = sinon.stub().returns({
          showForAllApps: showForAllAppsStub
        });
        var createHeaderItemMock = sinon.stub(ShellExtension.prototype, 'createHeaderItem').returns(Promise.resolve({
          showOnHome: showOnHomeStub
        }));
        var shellExtensionServiceMock = {
          createHeaderItem: createHeaderItemMock
        };
        var getShellExtensionStub = sinon.stub(UI5Util, 'getExtensionService').returns(Promise.resolve(shellExtensionServiceMock));
        return Promise.resolve(ShellBarButton.initShellBarButton(resourceBundle, openSurveyCallback)).then(function () {
          assert.ok(createHeaderItemMock.calledWith(sinon.match.object, {
            position: 'end'
          }));
          assert.ok(showOnHomeStub.called);
          assert.ok(showForAllAppsStub.called);
          getShellExtensionStub.restore();
          createHeaderItemMock.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('getHeaderItem - shall trigger a callback with press event', function (assert) {
      var resourceBundle = {
        getText: sinon.stub().returns('Give Feedback')
      };
      var openSurveyCallbackStub = sinon.stub();
      var headerItem = ShellBarButton['getHeaderItem'](resourceBundle, openSurveyCallbackStub);
      headerItem.press();
      assert.ok(openSurveyCallbackStub.called);
      openSurveyCallbackStub.reset();
    });
  };
  return __exports;
});
//# sourceMappingURL=ShellBarButton.test.js.map