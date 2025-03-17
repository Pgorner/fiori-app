import { PxApi, ThemeId } from '@sap-px/pxapi';
import {
	AppContextData,
	ConfigIdentifier,
	JSONValue,
	PushFeedbackRequestData,
	SurveyInvitationDialogCallback,
	TenantInfo
} from '@sap-px/pxapi/dist/api/common/Types';
import PxApiFactory from './PxApiFactory';
import Constants from '../common/Constants';
import { PluginInfo } from '../common/Types';
import Util from '../common/Util';
import InvitationDialog from '../ui/InvitationDialog';

export default class PxApiWrapper {
	_pxApi: PxApi;
	_invitationDialog: InvitationDialog;

	get pxApi(): PxApi {
		return this._pxApi;
	}

	set invitationDialog(value: InvitationDialog) {
		this._invitationDialog = value;
	}
	get invitationDialog(): InvitationDialog {
		return this._invitationDialog;
	}

	constructor(pluginInfo: PluginInfo) {
		this._pxApi = PxApiFactory.createPxApi();
		this.updatePxClient(pluginInfo);
	}

	async initialize(
		tenantInfo: TenantInfo,
		configIdentifier?: ConfigIdentifier,
		configJson?: JSONValue,
		surveyInvitationDialogCallback?: SurveyInvitationDialogCallback
	): Promise<boolean> {
		return await this._pxApi.initialize(tenantInfo, configIdentifier, configJson, surveyInvitationDialogCallback);
	}

	openSurvey(appContextData: AppContextData) {
		this._pxApi.openSurvey(appContextData);
	}

	requestPush(pushData: PushFeedbackRequestData) {
		this._pxApi.requestPush(pushData);
	}

	updateThemeId(themeId: ThemeId) {
		this._pxApi.currentThemeId = themeId;
	}

	private updatePxClient(pluginInfo: PluginInfo) {
		const infoContext = Util.ensureGlobalContext('qtx', 'info');
		if (pluginInfo && pluginInfo.version) {
			const version = pluginInfo.version.indexOf('project.version') === -1 ? pluginInfo.version : Constants.PXCLIENT_INFO_VERSION_FALLBACK;
			infoContext.pxclient += ` ${pluginInfo.id}/1.132.0`;
			return;
		}
		infoContext.pxlient += `${Constants.PXCLIENT_INFO_NAME_FALLBACK}/${Constants.PXCLIENT_INFO_VERSION_FALLBACK}`;
	}
}
