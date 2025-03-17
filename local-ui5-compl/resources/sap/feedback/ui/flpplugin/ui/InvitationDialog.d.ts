declare module "sap/feedback/ui/flpplugin/ui/InvitationDialog" {
    import { SurveyInvitationDialogEventData, SurveyInvitationResultData } from '@sap-px/pxapi/dist/api/common/Types';
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    export default class InvitationDialog {
        private _resourceBundle;
        private _invitationDialog;
        private _resolveSurveyInvitation;
        constructor(resourceBundle: ResourceBundle);
        surveyInvitationDialogShowCallback(eventData: SurveyInvitationDialogEventData): Promise<SurveyInvitationResultData>;
        private showInvitationDialog;
        private setDismissButtonText;
        private onInvitationDialogClose;
        private sendInvitationCallbackResponse;
        private getText;
        private createFeedbackButton;
        private createDismissButton;
        private createInvitationDialog;
        private handleEscape;
    }
}
//# sourceMappingURL=InvitationDialog.d.ts.map