declare module "sap/feedback/ui/flpplugin/pxapi/PxApiWrapper" {
    import { PxApi, ThemeId } from '@sap-px/pxapi';
    import { AppContextData, ConfigIdentifier, JSONValue, PushFeedbackRequestData, SurveyInvitationDialogCallback, TenantInfo } from '@sap-px/pxapi/dist/api/common/Types';
    import { PluginInfo } from 'sap/feedback/ui/flpplugin/common/Types';
    import InvitationDialog from 'sap/feedback/ui/flpplugin/ui/InvitationDialog';
    export default class PxApiWrapper {
        _pxApi: PxApi;
        _invitationDialog: InvitationDialog;
        get pxApi(): PxApi;
        set invitationDialog(value: InvitationDialog);
        get invitationDialog(): InvitationDialog;
        constructor(pluginInfo: PluginInfo);
        initialize(tenantInfo: TenantInfo, configIdentifier?: ConfigIdentifier, configJson?: JSONValue, surveyInvitationDialogCallback?: SurveyInvitationDialogCallback): Promise<boolean>;
        openSurvey(appContextData: AppContextData): void;
        requestPush(pushData: PushFeedbackRequestData): void;
        updateThemeId(themeId: ThemeId): void;
        private updatePxClient;
    }
}
//# sourceMappingURL=PxApiWrapper.d.ts.map