declare module "sap/feedback/ui/flpplugin/ui/ShellBarButton" {
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    import { OpenSurveyCallback } from 'sap/feedback/ui/flpplugin/common/Types';
    export default class ShellBarButton {
        static initShellBarButton(resourceBundle: ResourceBundle, openSurveyCallback: OpenSurveyCallback): Promise<void>;
        private static getHeaderItem;
    }
}
//# sourceMappingURL=ShellBarButton.d.ts.map