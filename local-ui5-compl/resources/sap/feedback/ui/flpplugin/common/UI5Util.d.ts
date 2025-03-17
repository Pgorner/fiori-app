declare module "sap/feedback/ui/flpplugin/common/UI5Util" {
    import { ThemeId } from '@sap-px/pxapi';
    import EventBus from 'sap/ui/core/EventBus';
    import Container from 'sap/ushell/Container';
    import AppLifeCycle, { CurrentApplication } from 'sap/ushell/services/AppLifeCycle';
    import ShellExtension from 'sap/ushell/services/Extension';
    export default class UI5Util {
        static getShellContainer(): Promise<Container>;
        static getAppLifeCycleService(): Promise<AppLifeCycle>;
        static getExtensionService(): Promise<ShellExtension>;
        static getCurrentApp(): Promise<CurrentApplication | undefined>;
        static getTheme(): string;
        static getThemeId(): ThemeId;
        static getLanguage(): string;
        static getEventBus(): EventBus;
    }
}
//# sourceMappingURL=UI5Util.d.ts.map