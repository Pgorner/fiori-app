import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import ControlFactory from 'sap/feedback/ui/flpplugin/ui/ControlFactory';
import InvitationDialog from 'sap/feedback/ui/flpplugin/ui/InvitationDialog';

export default () => {
	QUnit.module('ControlFactory unit tests', {});

	QUnit.test('createSurveyInvitationDialog - shall return the instance of the InvitationDialog', (assert) => {
		const invitationDialog = ControlFactory.createSurveyInvitationDialog({} as ResourceBundle);

		assert.ok(invitationDialog instanceof InvitationDialog);
	});
};
