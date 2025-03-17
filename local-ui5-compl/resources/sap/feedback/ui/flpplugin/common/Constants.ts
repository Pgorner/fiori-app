export default Object.freeze({
	SHELLBAR_BUTTON_TOOLTIP: 'SHELLBAR_BUTTON_TOOLTIP',
	SHELLBAR_BTN_ID: 'sap_qualtrics_surveyTriggerButton',
	DEFAULT_VALUE_NA: 'N/A',
	DEFAULT_LANGUAGE: 'EN',
	LAUNCHPAD_VALUE: 'LAUNCHPAD',
	SUPPORTED_APP_TYPES: ['ui5', 'wda', 'gui', 'tr', 'nwbc', 'url'],
	PUSH_STATE_STORAGE_KEY: 'sap.feedback.ui.pushState',
	PXCLIENT_INFO_NAME_FALLBACK: 'sap.feedback.ui.flpplugin',
	PXCLIENT_INFO_VERSION_FALLBACK: 'local-build',
	SURVEY_INVITATION_DIALOG_ID: 'sap_px_surveyInvitationDialog',
	EVENT_BUS: {
		CHANNEL_ID: 'sap.feedback',
		EVENT_ID: 'inapp.feature'
	},
	URL_PARAMS: {
		UNITID: 'sap-px-unitId',
		ENVIRONMENT: 'sap-px-env'
	},
	ERROR: {
		SHELL_CONTAINER_NOT_AVAILABLE:
			'Illegal state: shell container not available; this component must be executed in a unified shell runtime context.',
		SHELL_RENDERER_NOT_AVAILABLE: 'Illegal state: shell renderer not available after receiving "RendererCreated" event.',
		CURRENT_APP_NOT_AVAILABLE: '"currentApplication" is not available. Failed to retrieve AppContextData.',
		CANNOT_TRIGGER_USER_INITIATED_FEEDBACK: 'Failed to trigger User-Initiated Feedback.',
		INIT_PARAMS_INCONSISTENT: 'No valid start up option identified. Parameters inconsistent.',
		UNABLE_TO_PARSE_USER_STATE: 'Something went wrong while paring the User state.',
		UNABLE_TO_UPDATE_USER_STATE: 'Something went wrong while updating the User state.',
		PUSH_STATE_MIGRATION_FAILED: 'Push state migration failed due to the unexpected exceptions!'
	},
	WARNING: {
		UNSUPPORTED_APP_TYPE: 'Unsupported App Type'
	},
	INFO: {
		PHONE_NOT_SUPPORTED: 'PX Plug-in initialization cancelled for device type "phone"'
	},
	DEBUG: {
		INIT_PARAMS_MANDATORY_FOUND_NEW: 'Mandatory start parameters identified (configUrl, unitId, environment)',
		INIT_PARAMS_MANDATORY_NOT_SET_NEW: 'Mandatory start parameters not set (configUrl, unitId, environment)',
		INIT_PARAMS_MANDATORY_FOUND_JSON: 'Mandatory start parameters identified (configJson)',
		INIT_PARAMS_MANDATORY_NOT_SET_JSON: 'Mandatory start parameters not set (configJson)',
		INIT_PARAMS_MANDATORY_FOUND_OLD: 'Mandatory start parameters identified (qualtricsInternalUri, tenantId)',
		INIT_PARAMS_MANDATORY_NOT_SET_OLD: 'Mandatory start parameters not set (qualtricsInternalUri, tenantId)',
		INIT_PARAMS_URL_MODIFIED: 'Start parameters modified (unitId, environment)',
		PUSH_STATE_MIGRATED: 'Old PushState found and it is migrated to new PushState.',
		NO_OLD_PUSH_STATE: 'No Old PushState found.'
	},
	COMPONENT: {
		APP_CONTEXT_DATA: 'feedback.ui.flpplugin.data.AppContextData',
		INIT_CONTROLLER: 'feedback.ui.flpplugin.controller.InitController',
		PLUGIN_CONTROLLER: 'feedback.ui.flpplugin.controller.PluginController',
		LOCAL_STORAGE_HANDLER: 'feedback.ui.flpplugin.storage.LocalStorageHandler',
		PUSH_STATE_MIGRATOR: 'feedback.ui.flpplugin.storage.PushStateMigrator'
	},
	SCOPE_SETS: {
		APP_PUSH: 'appPush',
		TIMED_PUSH: 'timedPush',
		MANUAL: 'manual'
	}
});
