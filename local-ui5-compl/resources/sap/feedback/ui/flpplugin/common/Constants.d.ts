declare module "sap/feedback/ui/flpplugin/common/Constants" {
    const _default: Readonly<{
        SHELLBAR_BUTTON_TOOLTIP: "SHELLBAR_BUTTON_TOOLTIP";
        SHELLBAR_BTN_ID: "sap_qualtrics_surveyTriggerButton";
        DEFAULT_VALUE_NA: "N/A";
        DEFAULT_LANGUAGE: "EN";
        LAUNCHPAD_VALUE: "LAUNCHPAD";
        SUPPORTED_APP_TYPES: string[];
        PUSH_STATE_STORAGE_KEY: "sap.feedback.ui.pushState";
        PXCLIENT_INFO_NAME_FALLBACK: "sap.feedback.ui.flpplugin";
        PXCLIENT_INFO_VERSION_FALLBACK: "local-build";
        SURVEY_INVITATION_DIALOG_ID: "sap_px_surveyInvitationDialog";
        EVENT_BUS: {
            CHANNEL_ID: string;
            EVENT_ID: string;
        };
        URL_PARAMS: {
            UNITID: string;
            ENVIRONMENT: string;
        };
        ERROR: {
            SHELL_CONTAINER_NOT_AVAILABLE: string;
            SHELL_RENDERER_NOT_AVAILABLE: string;
            CURRENT_APP_NOT_AVAILABLE: string;
            CANNOT_TRIGGER_USER_INITIATED_FEEDBACK: string;
            INIT_PARAMS_INCONSISTENT: string;
            UNABLE_TO_PARSE_USER_STATE: string;
            UNABLE_TO_UPDATE_USER_STATE: string;
            PUSH_STATE_MIGRATION_FAILED: string;
        };
        WARNING: {
            UNSUPPORTED_APP_TYPE: string;
        };
        INFO: {
            PHONE_NOT_SUPPORTED: string;
        };
        DEBUG: {
            INIT_PARAMS_MANDATORY_FOUND_NEW: string;
            INIT_PARAMS_MANDATORY_NOT_SET_NEW: string;
            INIT_PARAMS_MANDATORY_FOUND_JSON: string;
            INIT_PARAMS_MANDATORY_NOT_SET_JSON: string;
            INIT_PARAMS_MANDATORY_FOUND_OLD: string;
            INIT_PARAMS_MANDATORY_NOT_SET_OLD: string;
            INIT_PARAMS_URL_MODIFIED: string;
            PUSH_STATE_MIGRATED: string;
            NO_OLD_PUSH_STATE: string;
        };
        COMPONENT: {
            APP_CONTEXT_DATA: string;
            INIT_CONTROLLER: string;
            PLUGIN_CONTROLLER: string;
            LOCAL_STORAGE_HANDLER: string;
            PUSH_STATE_MIGRATOR: string;
        };
        SCOPE_SETS: {
            APP_PUSH: string;
            TIMED_PUSH: string;
            MANUAL: string;
        };
    }>;
    export default _default;
}
//# sourceMappingURL=Constants.d.ts.map