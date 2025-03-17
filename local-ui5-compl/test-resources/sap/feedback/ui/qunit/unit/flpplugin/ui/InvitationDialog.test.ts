import * as pxApiTypes from '@sap-px/pxapi/dist/api/common/Types';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import AppContextData from 'sap/feedback/ui/flpplugin/data/AppContextData';
import InvitationDialog from 'sap/feedback/ui/flpplugin/ui/InvitationDialog';
import Ui5ControlFactory from 'sap/feedback/ui/flpplugin/ui/Ui5ControlFactory';
import Dialog, { $DialogSettings } from 'sap/m/Dialog';
// eslint-disable-next-line import/no-unresolved
import * as sinon from 'sinon';

export default () => {
	QUnit.module('InvitationDialog unit tests', {});
	QUnit.test('ctor', (assert) => {
		const resourceBundle = {
			getText: sinon.stub()
		} as unknown as ResourceBundle;

		const invitationDialog = new InvitationDialog(resourceBundle);

		assert.ok(invitationDialog instanceof InvitationDialog);
	});

	QUnit.test('surveyInvitationDialogShowCallback - shall create and open the dialog(appPush)', (assert) => {
		const openDialogStub = sinon.stub();
		const setTextMock = {
			setText: sinon.stub()
		};
		const dialogSettings = {
			isOpen: function () {
				return false;
			},
			open: openDialogStub,
			getEndButton: sinon.stub().returns(setTextMock)
		} as unknown as Dialog;
		const createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialogSettings);
		const invitationDialog = new InvitationDialog({
			getText: sinon.stub()
		} as unknown as ResourceBundle);
		const getTextStub = sinon.stub(invitationDialog, 'getText' as any).returns('Not Now');

		invitationDialog.surveyInvitationDialogShowCallback({ pushType: 'appPush', showInvitation: true });

		assert.ok(openDialogStub.called);
		assert.ok(createDialogStub.called);
		assert.ok(setTextMock.setText.calledWith('Not Now'));

		createDialogStub.restore();
		getTextStub.restore();
	});

	QUnit.test('surveyInvitationDialogShowCallback - shall create and open the dialog(timedPush)', (assert) => {
		const openDialogStub = sinon.stub();
		const setTextMock = {
			setText: sinon.stub()
		};
		const dialog = {
			isOpen: function () {
				return false;
			},
			open: openDialogStub,
			getEndButton: sinon.stub().returns(setTextMock)
		} as unknown as Dialog;
		const createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialog);

		const invitationDialog = new InvitationDialog({
			getText: sinon.stub()
		} as unknown as ResourceBundle);
		const getTextStub = sinon.stub(invitationDialog, 'getText' as any).returns('Ask me later');

		invitationDialog.surveyInvitationDialogShowCallback({ pushType: 'timedPush', showInvitation: true });

		assert.ok(openDialogStub.called);
		assert.ok(createDialogStub.called);
		assert.ok(setTextMock.setText.calledWith('Ask me later'));

		getTextStub.restore();
		createDialogStub.restore();
	});

	QUnit.test('surveyInvitationDialogShowCallback - shall not open the dialog if it is already open', (assert) => {
		const openDialogStub = sinon.stub();
		const dialog = {
			isOpen: function () {
				return true;
			},
			open: openDialogStub
		} as unknown as Dialog;
		const createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialog);

		const resourceBundle = {
			getText: sinon.stub()
		} as unknown as ResourceBundle;

		const invitationDialog = new InvitationDialog(resourceBundle);
		invitationDialog['_invitationDialog'] = Ui5ControlFactory.createDialog({} as $DialogSettings, 'test123');

		invitationDialog.surveyInvitationDialogShowCallback({ pushType: 'appPush', showInvitation: true });

		assert.notOk(openDialogStub.called);

		createDialogStub.restore();
	});

	QUnit.test('surveyInvitationDialogShowCallback - shall not open the dialog if showInvitation is false from the invitation callback', (assert) => {
		const openDialogStub = sinon.stub();
		const dialog = {
			isOpen: function () {
				return false;
			},
			open: openDialogStub
		} as unknown as Dialog;
		const createDialogStub = sinon.stub(Ui5ControlFactory, 'createDialog').returns(dialog);

		const invitationDialog = new InvitationDialog({
			getText: sinon.stub()
		} as unknown as ResourceBundle);
		const sendInvitationCallbackResponseStub = sinon.stub(invitationDialog, 'sendInvitationCallbackResponse' as any);

		invitationDialog.surveyInvitationDialogShowCallback({ pushType: 'instantPush', showInvitation: false });

		assert.notOk(openDialogStub.called);
		assert.ok(sendInvitationCallbackResponseStub.calledWith(true));

		createDialogStub.restore();
		sendInvitationCallbackResponseStub.restore();
	});

	QUnit.test('onInvitationDialogClose - shall collect AppContextData and return user decision', async (assert) => {
		const dialogCloseStub = sinon.stub();
		const dialogMock = {
			close: dialogCloseStub
		} as unknown as Dialog;
		const resourceBundle = {
			getText: sinon.stub()
		} as unknown as ResourceBundle;
		const dummyContextData = { context: 'data' } as unknown as pxApiTypes.AppContextData;
		const getDataAppContextStub = sinon.stub(AppContextData, 'getData').returns(Promise.resolve(dummyContextData));
		const invitationDialog = new InvitationDialog(resourceBundle);
		invitationDialog['_invitationDialog'] = dialogMock;
		const resolveSurveyInvitationDialog = (invitationDialog['_resolveSurveyInvitation'] = sinon.stub());

		await invitationDialog['onInvitationDialogClose'](true);

		assert.ok(dialogCloseStub.called);
		assert.ok(resolveSurveyInvitationDialog.calledWith({ appContextData: dummyContextData, surveyUser: true }));

		getDataAppContextStub.restore();
	});

	QUnit.test('createFeedbackButton - shall create Button with properties and events set', (assert) => {
		const resourceBundle = {
			getText: sinon.stub().returns('testText')
		} as unknown as ResourceBundle;
		const invitationDialog = new InvitationDialog(resourceBundle);
		const onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose' as any);

		const button = invitationDialog['createFeedbackButton']();
		button.firePress();

		assert.equal(button.getText(), 'testText');
		assert.ok(onInvitationDialogCloseStub.calledWith(true));

		onInvitationDialogCloseStub.restore();
	});

	QUnit.test('createDismissButton - shall create Button with properties and events', (assert) => {
		const getTextStub = sinon.stub().returns('testText');
		const resourceBundle = {
			getText: getTextStub
		} as unknown as ResourceBundle;
		const invitationDialog = new InvitationDialog(resourceBundle);
		const onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose' as any);

		const button = invitationDialog['createDismissButton']();
		button.firePress();

		assert.equal(button.getText(), 'testText');
		assert.ok(getTextStub.calledWith('YOUR_OPINION_NOTNOW'));
		assert.ok(onInvitationDialogCloseStub.calledWith(false));

		onInvitationDialogCloseStub.restore();
	});

	QUnit.test('createInvitationDialog - shall create Dialog with properties and events', (assert) => {
		const getTextStub = sinon.stub();
		getTextStub.withArgs('YOUR_OPINION_TITLE').returns('titleText');
		getTextStub.withArgs('YOUR_OPINION_TEXT').returns('contentText');
		getTextStub.withArgs('YOUR_OPINION_PROVIDEBUTTON').returns('Yes');
		getTextStub.withArgs('YOUR_OPINION_NOTNOW').returns('Not now');
		const resourceBundle = {
			getText: getTextStub
		} as unknown as ResourceBundle;

		const invitationDialog = new InvitationDialog(resourceBundle);
		const onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose' as any);

		const dialog = invitationDialog['createInvitationDialog']();

		assert.equal(dialog.getTitle(), 'titleText');

		onInvitationDialogCloseStub.restore();
	});

	QUnit.test('getText - shall return text appropriately', (assert) => {
		const resourceBundle = {
			getText: sinon.stub().withArgs('YOUR_OPINION_TITLE').returns(undefined)
		};
		const invitationDialog = new InvitationDialog(resourceBundle as unknown as ResourceBundle);

		const text = invitationDialog['getText']('YOUR_OPINION_TITLE');

		assert.equal(text, 'YOUR_OPINION_TITLE');

		resourceBundle.getText.reset();
	});

	QUnit.test('handleEscape - shall close the dialog', (assert) => {
		const resourceBundle = {
			getText: sinon.stub()
		} as unknown as ResourceBundle;
		const invitationDialog = new InvitationDialog(resourceBundle);
		const onInvitationDialogCloseStub = sinon.stub(invitationDialog, 'onInvitationDialogClose' as any);
		const promiseMock = {
			resolve: sinon.stub(),
			reject: sinon.stub()
		};

		invitationDialog['handleEscape'](promiseMock);

		assert.ok(onInvitationDialogCloseStub.calledWith(false));
		assert.ok(promiseMock.resolve.called);

		onInvitationDialogCloseStub.restore();
	});
};
