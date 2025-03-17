import { Environment } from '@sap-px/pxapi';
import { ConfigIdentifier, JSONValue, SurveyInvitationDialogCallback, TenantInfo } from '@sap-px/pxapi/dist/api/common/Types';
import Log from 'sap/base/Log';
import Device from 'sap/ui/Device';
import Constants from '../common/Constants';
import { PluginInfo, PxConfigType, RawStartParameters } from '../common/Types';
import Util from '../common/Util';
import EmbeddedPxConfig from '../embeddedCfg/EmbeddedPxConfig';
import PxApiWrapper from '../pxapi/PxApiWrapper';
import PushStateMigrator from '../storage/PushStateMigrator';

export default class InitController {
	private _pxApiWrapper: PxApiWrapper;

	constructor(pluginInfo: PluginInfo) {
		this._pxApiWrapper = new PxApiWrapper(pluginInfo);
	}

	public get pxApiWrapper() {
		return this._pxApiWrapper;
	}

	public async init(parameters: RawStartParameters, surveyInvitationDialogCallback: SurveyInvitationDialogCallback): Promise<boolean> {
		if (!PushStateMigrator.migrate()) {
			Log.error(Constants.ERROR.PUSH_STATE_MIGRATION_FAILED, undefined, Constants.COMPONENT.INIT_CONTROLLER);
			return false;
		}
		if (this.isPhone()) {
			Log.info(Constants.INFO.PHONE_NOT_SUPPORTED, undefined, Constants.COMPONENT.INIT_CONTROLLER);
			return false;
		}
		if (this.hasOldParameters(parameters)) {
			return await this.initWithOldParameters(parameters, surveyInvitationDialogCallback);
		} else if (this.hasNewParameters(parameters)) {
			if (this.hasUrlParameters()) {
				this.overwriteWithUrlParameters(parameters);
			}
			return await this.initWithNewParameters(parameters, surveyInvitationDialogCallback);
		}
		Log.error(Constants.ERROR.INIT_PARAMS_INCONSISTENT, undefined, Constants.COMPONENT.INIT_CONTROLLER);
		return false;
	}

	private isPhone(): boolean {
		return Device.system.phone;
	}

	private hasNewParameters(parameters: RawStartParameters): boolean {
		if (parameters.configUrl && parameters.unitId && parameters.environment) {
			Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_FOUND_NEW, undefined, Constants.COMPONENT.INIT_CONTROLLER);
			return true;
		}
		Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_NOT_SET_NEW, undefined, Constants.COMPONENT.INIT_CONTROLLER);
		if (parameters.configJson) {
			Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_FOUND_JSON, undefined, Constants.COMPONENT.INIT_CONTROLLER);
			return true;
		}
		Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_NOT_SET_JSON, undefined, Constants.COMPONENT.INIT_CONTROLLER);
		return false;
	}

	private hasOldParameters(parameters: RawStartParameters): boolean {
		if (parameters.qualtricsInternalUri && parameters.tenantId) {
			Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_FOUND_OLD, undefined, Constants.COMPONENT.INIT_CONTROLLER);
			return true;
		}
		Log.debug(Constants.DEBUG.INIT_PARAMS_MANDATORY_NOT_SET_OLD, undefined, Constants.COMPONENT.INIT_CONTROLLER);
		return false;
	}

	private hasUrlParameters(): boolean {
		if (Util.isUnitIdUrlParamSet() && Util.isEnvironmentUrlParamSet()) {
			Log.debug(Constants.DEBUG.INIT_PARAMS_URL_MODIFIED, undefined, Constants.COMPONENT.INIT_CONTROLLER);
			return true;
		}
		return false;
	}

	private overwriteWithUrlParameters(parameters: RawStartParameters) {
		const unitId = Util.getUnitIdUrlParamValue();
		if (unitId) {
			parameters.unitId = unitId;
		}
		const env = Util.getEnvironmentUrlParamValue();
		if (env) {
			parameters.environment = env;
		}
	}

	// FLP Settings
	private async initWithNewParameters(
		parameters: RawStartParameters,
		surveyInvitationDialogCallback: SurveyInvitationDialogCallback
	): Promise<boolean> {
		//Load PX-API
		if (parameters.configUrl && !parameters.configJson) {
			const tenantInfo = {
				tenantId: parameters.tenantId,
				tenantRole: parameters.tenantRole
			} as TenantInfo;
			const configIdentifier = {
				configUrl: parameters.configUrl,
				unitId: parameters.unitId,
				environment: parameters.environment
			} as ConfigIdentifier;
			return await this._pxApiWrapper.initialize(tenantInfo, configIdentifier, undefined, surveyInvitationDialogCallback);
		} else if (!parameters.configUrl && parameters.configJson) {
			const tenantInfo = {
				tenantId: parameters.tenantId,
				tenantRole: parameters.tenantRole
			} as TenantInfo;
			const configJson = parameters.configJson as PxConfigType;
			return await this._pxApiWrapper.initialize(tenantInfo, undefined, configJson as JSONValue, surveyInvitationDialogCallback);
		}
		Log.error(Constants.ERROR.INIT_PARAMS_INCONSISTENT, undefined, Constants.COMPONENT.INIT_CONTROLLER);
		return false;
	}

	private async initWithOldParameters(
		parameters: RawStartParameters,
		surveyInvitationDialogCallback: SurveyInvitationDialogCallback
	): Promise<boolean> {
		//Load embedded config
		const configJson = {
			version: '0.4.0',
			unitId: '83cec47d-199c-4fc9-8848-330c6e3ec6bb',
			environment: Environment.prod,
			startupConfig: {
				qualtricsInternalUri: parameters.qualtricsInternalUri,
				productName: parameters.productName,
				platformType: parameters.platformType,
				scopeSet: this.convertScopeSet(parameters.scopeSet)
			},
			runtimeConfig: {
				useApi: true
			},
			themingConfig: {
				writeToGlobals: true
			},
			pushConfig: EmbeddedPxConfig.pushConfig()
		} as PxConfigType;

		const tenantInfo = {
			tenantId: parameters.tenantId,
			tenantRole: parameters.tenantRole
		} as TenantInfo;
		//Load and init PX-API
		return await this._pxApiWrapper.initialize(tenantInfo, undefined, configJson as JSONValue, surveyInvitationDialogCallback);
	}

	private convertScopeSet(scopeSetString: string | undefined): string[] {
		const scopeSetMap = { featurePush: Constants.SCOPE_SETS.APP_PUSH, dynamicPush: Constants.SCOPE_SETS.TIMED_PUSH };
		if (scopeSetString) {
			let scopeSetArray = scopeSetString.split(',');
			scopeSetArray = this.appendManualScopeSet(scopeSetArray);
			const scopeSet = scopeSetArray.map((scopeItem) => {
				return scopeSetMap[scopeItem.trim() as keyof typeof scopeSetMap] || scopeItem.trim();
			});
			return scopeSet;
		}
		return [Constants.SCOPE_SETS.MANUAL];
	}

	private appendManualScopeSet(scopeSetArray: string[]): string[] {
		if (scopeSetArray.indexOf(Constants.SCOPE_SETS.MANUAL) > -1) {
			return scopeSetArray;
		}
		scopeSetArray.push(Constants.SCOPE_SETS.MANUAL);
		return scopeSetArray;
	}
}
