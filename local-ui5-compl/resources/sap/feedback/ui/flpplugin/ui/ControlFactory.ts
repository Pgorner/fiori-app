import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import InvitationDialog from './InvitationDialog';

export default class ControlFactory {
	public static createSurveyInvitationDialog(resourceBundle: ResourceBundle) {
		return new InvitationDialog(resourceBundle);
	}
}
