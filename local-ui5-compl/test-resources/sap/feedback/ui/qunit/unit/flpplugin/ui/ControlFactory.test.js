"use strict";

sap.ui.define(["sap/feedback/ui/flpplugin/ui/ControlFactory", "sap/feedback/ui/flpplugin/ui/InvitationDialog"], function (ControlFactory, InvitationDialog) {
  "use strict";

  var __exports = function __exports() {
    QUnit.module('ControlFactory unit tests', {});
    QUnit.test('createSurveyInvitationDialog - shall return the instance of the InvitationDialog', function (assert) {
      var invitationDialog = ControlFactory.createSurveyInvitationDialog({});
      assert.ok(invitationDialog instanceof InvitationDialog);
    });
  };
  return __exports;
});
//# sourceMappingURL=ControlFactory.test.js.map