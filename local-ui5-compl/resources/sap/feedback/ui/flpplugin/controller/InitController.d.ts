declare module "sap/feedback/ui/flpplugin/controller/InitController" {
    import { SurveyInvitationDialogCallback } from '@sap-px/pxapi/dist/api/common/Types';
    import { PluginInfo, RawStartParameters } from 'sap/feedback/ui/flpplugin/common/Types';
    import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
    export default class InitController {
        private _pxApiWrapper;
        constructor(pluginInfo: PluginInfo);
        get pxApiWrapper(): PxApiWrapper;
        init(parameters: RawStartParameters, surveyInvitationDialogCallback: SurveyInvitationDialogCallback): Promise<boolean>;
        private isPhone;
        private hasNewParameters;
        private hasOldParameters;
        private hasUrlParameters;
        private overwriteWithUrlParameters;
        private initWithNewParameters;
        private initWithOldParameters;
        private convertScopeSet;
        private appendManualScopeSet;
    }
}
//# sourceMappingURL=InitController.d.ts.map