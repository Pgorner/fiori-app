declare module "sap/feedback/ui/flpplugin/ui/Ui5ControlFactory" {
    import { $ButtonSettings } from 'sap/m/Button';
    import { $DialogSettings } from 'sap/m/Dialog';
    import { $FormattedTextSettings } from 'sap/m/FormattedText';
    export default class Ui5ControlFactory {
        static createButton(settings: $ButtonSettings): any;
        static createDialog(settings: $DialogSettings, id?: string): any;
        static createFormattedText(settings: $FormattedTextSettings): any;
    }
}
//# sourceMappingURL=Ui5ControlFactory.d.ts.map