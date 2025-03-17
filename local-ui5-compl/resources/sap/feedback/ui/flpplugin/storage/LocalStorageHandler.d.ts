declare module "sap/feedback/ui/flpplugin/storage/LocalStorageHandler" {
    import { ThemeId } from '@sap-px/pxapi';
    import { UserState } from 'sap/feedback/ui/flpplugin/common/Types';
    export default class LocalStorageHandler {
        static getUserState(): UserState | undefined;
        static updateUserState(userState: UserState): boolean;
        static updateLastTheme(themeId: ThemeId): void;
        static updateCurrentTheme(themeId: ThemeId): void;
        static getLocalStorage(): Storage;
    }
}
//# sourceMappingURL=LocalStorageHandler.d.ts.map