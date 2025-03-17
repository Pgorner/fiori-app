declare module "sap/feedback/ui/flpplugin/data/AppContextData" {
    import * as PxApiTypes from '@sap-px/pxapi/dist/api/common/Types';
    /**
     * NOTE: Need to verify few un-identified UI5 Types which are currently missing in UI5 type definitions, marked them as TODO below.
     */
    export default class AppContextData {
        private static readonly _appContextData;
        static getData(): Promise<PxApiTypes.AppContextData>;
        private static calculateAppContextData;
        private static isAppTypeSupported;
        private static getAppInfo;
        private static getContextData;
        private static getLanguage;
    }
}
//# sourceMappingURL=AppContextData.d.ts.map