import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Constants from '../common/Constants';
import { OpenSurveyCallback } from '../common/Types';
import UI5Util from '../common/UI5Util';

export default class ShellBarButton {
	public static async initShellBarButton(resourceBundle: ResourceBundle, openSurveyCallback: OpenSurveyCallback): Promise<void> {
		const shellExtensionService = await UI5Util.getExtensionService();
		const headerItem = this.getHeaderItem(resourceBundle, openSurveyCallback);
		const headerEndItem = await shellExtensionService.createHeaderItem(headerItem, { position: 'end' });
		headerEndItem.showOnHome().showForAllApps();
	}

	private static getHeaderItem(resourceBundle: ResourceBundle, openSurveyCallback: OpenSurveyCallback) {
		const userInitiatedFeedbackText = resourceBundle.getText(Constants.SHELLBAR_BUTTON_TOOLTIP);
		return {
			id: Constants.SHELLBAR_BTN_ID,
			icon: 'sap-icon://feedback',
			tooltip: userInitiatedFeedbackText,
			ariaLabel: userInitiatedFeedbackText,
			text: userInitiatedFeedbackText,
			press: () => {
				openSurveyCallback();
			}
		};
	}
}
