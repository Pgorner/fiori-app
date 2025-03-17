"use strict";

sap.ui.define(["sap/feedback/ui/flpplugin/data/AppContextData", "sap/feedback/ui/flpplugin/ui/InvitationDialog", "sap/feedback/ui/flpplugin/ui/Ui5ControlFactory", "sinon"], function (AppContextData, InvitationDialog, Ui5ControlFactory, sinon) {
  "use strict";

  var __exports = function __exports() {
    QUnit.module('InvitationDialog unit tests', {});
    QUnit.test('ctor', function (assert) {
      var resourceBundle = {
        getText: sinon.stub()
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      assert.ok(invitationDialog instanceof InvitationDialog);
    });
    QUnit.test('surveyInvitationDialogShowCallback - shall create and open the dialog(appPush)', function (assert) {
      var openDialogStub = sinon.stub();
      var setTextMock = {
        setText: sinon.stub()
      };
      var dialogSettings = {
        isOpen: function isOpen() {
          return false;
        },
        open: openDialogStub,
        getEndButton: sinon.stub().returns(setTextMock)
      };
      var createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialogSettings);
      var invitationDialog = new InvitationDialog({
        getText: sinon.stub()
      });
      var getTextStub = sinon.stub(invitationDialog, 'getText').returns('Not Now');
      invitationDialog.surveyInvitationDialogShowCallback({
        pushType: 'appPush',
        showInvitation: true
      });
      assert.ok(openDialogStub.called);
      assert.ok(createDialogStub.called);
      assert.ok(setTextMock.setText.calledWith('Not Now'));
      createDialogStub.restore();
      getTextStub.restore();
    });
    QUnit.test('surveyInvitationDialogShowCallback - shall create and open the dialog(timedPush)', function (assert) {
      var openDialogStub = sinon.stub();
      var setTextMock = {
        setText: sinon.stub()
      };
      var dialog = {
        isOpen: function isOpen() {
          return false;
        },
        open: openDialogStub,
        getEndButton: sinon.stub().returns(setTextMock)
      };
      var createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialog);
      var invitationDialog = new InvitationDialog({
        getText: sinon.stub()
      });
      var getTextStub = sinon.stub(invitationDialog, 'getText').returns('Ask me later');
      invitationDialog.surveyInvitationDialogShowCallback({
        pushType: 'timedPush',
        showInvitation: true
      });
      assert.ok(openDialogStub.called);
      assert.ok(createDialogStub.called);
      assert.ok(setTextMock.setText.calledWith('Ask me later'));
      getTextStub.restore();
      createDialogStub.restore();
    });
    QUnit.test('surveyInvitationDialogShowCallback - shall not open the dialog if it is already open', function (assert) {
      var openDialogStub = sinon.stub();
      var dialog = {
        isOpen: function isOpen() {
          return true;
        },
        open: openDialogStub
      };
      var createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialog);
      var resourceBundle = {
        getText: sinon.stub()
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      invitationDialog['_invitationDialog'] = Ui5ControlFactory.createDialog({}, 'test123');
      invitationDialog.surveyInvitationDialogShowCallback({
        pushType: 'appPush',
        showInvitation: true
      });
      assert.notOk(openDialogStub.called);
      createDialogStub.restore();
    });
    QUnit.test('surveyInvitationDialogShowCallback - shall not open the dialog if showInvitation is false from the invitation callback', function (assert) {
      var openDialogStub = sinon.stub();
      var dialog = {
        isOpen: function isOpen() {
          return false;
        },
        open: openDialogStub
      };
      var createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialog);
      var invitationDialog = new InvitationDialog({
        getText: sinon.stub()
      });
      var sendInvitationCallbackResponseStub = sinon.stub(invitationDialog, 'sendInvitationCallbackResponse');
      invitationDialog.surveyInvitationDialogShowCallback({
        pushType: 'instantPush',
        showInvitation: false
      });
      assert.notOk(openDialogStub.called);
      assert.ok(sendInvitationCallbackResponseStub.calledWith(true));
      createDialogStub.restore();
      sendInvitationCallbackResponseStub.restore();
    });
    QUnit.test('onInvitationDialogClose - shall collect AppContextData and return user decision', function (assert) {
      try {
        var dialogCloseStub = sinon.stub();
        var dialogMock = {
          close: dialogCloseStub
        };
        var resourceBundle = {
          getText: sinon.stub()
        };
        var dummyContextData = {
          context: 'data'
        };
        var getDataAppContextStub = sinon.stub(AppContextData, 'getData').returns(Promise.resolve(dummyContextData));
        var invitationDialog = new InvitationDialog(resourceBundle);
        invitationDialog['_invitationDialog'] = dialogMock;
        var resolveSurveyInvitationDialog = invitationDialog['_resolveSurveyInvitation'] = sinon.stub();
        return Promise.resolve(invitationDialog['onInvitationDialogClose'](true)).then(function () {
          assert.ok(dialogCloseStub.called);
          assert.ok(resolveSurveyInvitationDialog.calledWith({
            appContextData: dummyContextData,
            surveyUser: true
          }));
          getDataAppContextStub.restore();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
    QUnit.test('createFeedbackButton - shall create Button with properties and events set', function (assert) {
      var resourceBundle = {
        getText: sinon.stub().returns('testText')
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      var onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose');
      var button = invitationDialog['createFeedbackButton']();
      button.firePress();
      assert.equal(button.getText(), 'testText');
      assert.ok(onInvitationDialogCloseStub.calledWith(true));
      onInvitationDialogCloseStub.restore();
    });
    QUnit.test('createDismissButton - shall create Button with properties and events', function (assert) {
      var getTextStub = sinon.stub().returns('testText');
      var resourceBundle = {
        getText: getTextStub
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      var onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose');
      var button = invitationDialog['createDismissButton']();
      button.firePress();
      assert.equal(button.getText(), 'testText');
      assert.ok(getTextStub.calledWith('YOUR_OPINION_NOTNOW'));
      assert.ok(onInvitationDialogCloseStub.calledWith(false));
      onInvitationDialogCloseStub.restore();
    });
    QUnit.test('createInvitationDialog - shall create Dialog with properties and events', function (assert) {
      var getTextStub = sinon.stub();
      getTextStub.withArgs('YOUR_OPINION_TITLE').returns('titleText');
      getTextStub.withArgs('YOUR_OPINION_TEXT').returns('contentText');
      getTextStub.withArgs('YOUR_OPINION_PROVIDEBUTTON').returns('Yes');
      getTextStub.withArgs('YOUR_OPINION_NOTNOW').returns('Not now');
      var resourceBundle = {
        getText: getTextStub
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      var onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose');
      var dialog = invitationDialog['createInvitationDialog']();
      assert.equal(dialog.getTitle(), 'titleText');
      onInvitationDialogCloseStub.restore();
    });
    QUnit.test('getText - shall return text appropriately', function (assert) {
      var resourceBundle = {
        getText: sinon.stub().withArgs('YOUR_OPINION_TITLE').returns(undefined)
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      var text = invitationDialog['getText']('YOUR_OPINION_TITLE');
      assert.equal(text, 'YOUR_OPINION_TITLE');
      resourceBundle.getText.reset();
    });
    QUnit.test('handleEscape - shall close the dialog', function (assert) {
      var resourceBundle = {
        getText: sinon.stub()
      };
      var invitationDialog = new InvitationDialog(resourceBundle);
      var onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose');
      var promiseMock = {
        resolve: sinon.stub(),
        reject: sinon.stub()
      };
      invitationDialog['handleEscape'](promiseMock);
      assert.ok(onInvitationDialogCloseStub.calledWith(false));
      assert.ok(promiseMock.resolve.called);
      onInvitationDialogCloseStub.restore();
    });
  };
  return __exports;
});
//# sourceMappingURL=InvitationDialog.test.js.map