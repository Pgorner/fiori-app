"use strict";

sap.ui.define(["sap/feedback/ui/flpplugin/ui/Ui5ControlFactory"], function (Ui5ControlFactory) {
  "use strict";

  var __exports = function __exports() {
    QUnit.module('Ui5ControlFactory unit tests', {});
    QUnit.test('createButton', function (assert) {
      var createdButton = Ui5ControlFactory.createButton({
        text: 'testText'
      });
      assert.equal(createdButton.getText(), 'testText');
    });
    QUnit.test('createDialog', function (assert) {
      var createdDialog = Ui5ControlFactory.createDialog({
        title: 'testText'
      });
      assert.equal(createdDialog.getTitle(), 'testText');
    });
    QUnit.test('createDialog with ID', function (assert) {
      var createdDialog = Ui5ControlFactory.createDialog({
        title: 'testText'
      }, 'testId');
      assert.equal(createdDialog.getTitle(), 'testText');
      assert.equal(createdDialog.getId(), 'testId');
    });
    QUnit.test('createFormattedText', function (assert) {
      var createdFormattedText = Ui5ControlFactory.createFormattedText({
        htmlText: 'testText'
      });
      assert.equal(createdFormattedText.getHtmlText(), 'testText');
    });
  };
  return __exports;
});
//# sourceMappingURL=Ui5ControlFactory.test.js.map