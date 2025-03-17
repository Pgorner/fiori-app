declare module "sap/feedback/ui/flpplugin/common/Util" {
    import { ThemeId } from '@sap-px/pxapi';
    export default class Util {
        static convertStringToThemeId(stringValue: string): ThemeId;
        static formatLanguageTag(input: string): string;
        static stringToTitleCase(input: string): string;
        static convertAppFrameworkTypeToId(frameworkType: string | undefined): string;
        static getWindowSearchLocation(): string;
        private static isUrlParamSet;
        private static getUrlParamValue;
        static isUnitIdUrlParamSet(): boolean;
        static getUnitIdUrlParamValue(): string | null;
        static isEnvironmentUrlParamSet(): boolean;
        static getEnvironmentUrlParamValue(): string | null;
        static ensureGlobalContext(firstLevel?: string, secondLevel?: string): any;
    }
}
//# sourceMappingURL=Util.d.ts.map