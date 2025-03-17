declare module "sap/feedback/ui/flpplugin/controller/PluginController" {
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
    export default class PluginController {
        private _pxApiWrapper;
        private _resourceBundle;
        constructor(pxApiWrapper: PxApiWrapper, resourceBundle: ResourceBundle);
        initPlugin(): Promise<void>;
        private prepareThemingSupport;
        private initUserInitiatedFeedback;
        private subscribeThemeChanged;
        private themeChanged;
        private openSurveyCallback;
        private onThemeChanged;
        private initAppTriggeredPush;
        private eventBusCallback;
        private unsubscribeFromTheEventBusForTesting;
    }
}
//# sourceMappingURL=PluginController.d.ts.map