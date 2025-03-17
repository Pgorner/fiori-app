declare module "sap/feedback/ui/flpplugin/data/ThemeData" {
    import { ThemeId } from '@sap-px/pxapi';
    export default class ThemeData {
        static initLastTheme(): void;
        static updateCurrentTheme(newCurrentThemeId: ThemeId): void;
        static updateThemeState(newLastThemeId: ThemeId, currentThemeId: ThemeId): void;
        static getPreviousTheme(): ThemeId;
    }
}
//# sourceMappingURL=ThemeData.d.ts.map