declare module "sap/feedback/ui/flpplugin/controller/ControllerFactory" {
    import ResourceBundle from 'sap/base/i18n/ResourceBundle';
    import InitController from 'sap/feedback/ui/flpplugin/controller/InitController';
    import PluginController from 'sap/feedback/ui/flpplugin/controller/PluginController';
    import { PluginInfo } from 'sap/feedback/ui/flpplugin/common/Types';
    import PxApiWrapper from 'sap/feedback/ui/flpplugin/pxapi/PxApiWrapper';
    export default class ControllerFactory {
        static createPluginController(pxApiWrapper: PxApiWrapper, resourceBundle: ResourceBundle): PluginController;
        static createInitController(pluginInfo: PluginInfo): InitController;
    }
}
//# sourceMappingURL=ControllerFactory.d.ts.map