declare module "sap/feedback/ui/flpplugin/storage/PushStateMigrator" {
    export default class PushStateMigrator {
        static migrate(): boolean;
        private static isOldPushStateAvailable;
        private static getNewUserState;
        private static get pushStateKeyMap();
    }
}
//# sourceMappingURL=PushStateMigrator.d.ts.map