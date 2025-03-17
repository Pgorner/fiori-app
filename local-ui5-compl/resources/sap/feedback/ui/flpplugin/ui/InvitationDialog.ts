import { PushType } from '@sap-px/pxapi';
import { SurveyInvitationDialogDecision, SurveyInvitationDialogEventData, SurveyInvitationResultData } from '@sap-px/pxapi/dist/api/common/Types';
import ResourceBundle from 'sap/base/i18n/ResourceBundle';
import Button from 'sap/m/Button';
import Dialog from 'sap/m/Dialog';
import { ButtonType, DialogType } from 'sap/m/library';
import Ui5ControlFactory from './Ui5ControlFactory';
import Constants from '../common/Constants';
import AppContextData from '../data/AppContextData';

export default class InvitationDialog {
	private _resourceBundle: ResourceBundle;
	private _invitationDialog: Dialog;
	private _resolveSurveyInvitation: SurveyInvitationDialogDecision;

	constructor(resourceBundle: ResourceBundle) {
		this._resourceBundle = resourceBundle;
	}

	public async surveyInvitationDialogShowCallback(eventData: SurveyInvitationDialogEventData): Promise<SurveyInvitationResultData> {
		const surveyInvitationDialogResponse = new Promise<SurveyInvitationResultData>((resolve) => (this._resolveSurveyInvitation = resolve));
		if (eventData.showInvitation) {
			this.showInvitationDialog(eventData.pushType);
		} else {
			await this.sendInvitationCallbackResponse(true);
		}
		return surveyInvitationDialogResponse;
	}

	private showInvitationDialog(pushType: PushType) {
		if (!this._invitationDialog) {
			this._invitationDialog = this.createInvitationDialog();
		}
		if (!this._invitationDialog.isOpen()) {
			this.setDismissButtonText(pushType);
			this._invitationDialog.open();
		}
	}

	private setDismissButtonText(pushType: PushType) {
		let dismissButtonText = this.getText('YOUR_OPINION_NOTNOW');
		if (pushType === PushType.timedPush) {
			dismissButtonText = this.getText('YOUR_OPINION_ASKLATERBUTTON');
		}
		this._invitationDialog.getEndButton().setText(dismissButtonText);
	}

	private async onInvitationDialogClose(willProvideFeedback: boolean) {
		this._invitationDialog.close();
		await this.sendInvitationCallbackResponse(willProvideFeedback);
	}

	private async sendInvitationCallbackResponse(willProvideFeedback: boolean) {
		const appContextData = await AppContextData.getData();
		this._resolveSurveyInvitation({ appContextData: appContextData, surveyUser: willProvideFeedback });
	}

	private getText(textKey: string): string {
		return this._resourceBundle.getText(textKey) ?? textKey;
	}

	private createFeedbackButton(): Button {
		return Ui5ControlFactory.createButton({
			type: ButtonType.Emphasized,
			text: this.getText('YOUR_OPINION_PROVIDEBUTTON'),
			press: () => {
				this.onInvitationDialogClose(true);
			}
		});
	}

	private createDismissButton(): Button {
		return Ui5ControlFactory.createButton({
			text: this.getText('YOUR_OPINION_NOTNOW'),
			press: () => {
				this.onInvitationDialogClose(false);
			}
		});
	}

	private createInvitationDialog(): Dialog {
		return Ui5ControlFactory.createDialog(
			{
				type: DialogType.Message,
				title: this.getText('YOUR_OPINION_TITLE'),
				content: Ui5ControlFactory.createFormattedText({ htmlText: this.getText('YOUR_OPINION_TEXT') }),
				beginButton: this.createFeedbackButton(),
				endButton: this.createDismissButton(),
				escapeHandler: this.handleEscape.bind(this)
			},
			Constants.SURVEY_INVITATION_DIALOG_ID
		);
	}

	private handleEscape(promise: { resolve(): void; reject(): void }) {
		promise.resolve();
		this.onInvitationDialogClose(false);
	}
}
