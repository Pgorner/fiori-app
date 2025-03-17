import * as PxApiTypes from '@sap-px/pxapi/dist/api/common/Types';
import Log from 'sap/base/Log';
import AppConfiguration from 'sap/ushell/services/AppConfiguration';

import { CurrentApplication } from 'sap/ushell/services/AppLifeCycle';
import ThemeData from './ThemeData';
import Constants from '../common/Constants';
import { AppInfo } from '../common/Types';
import UI5Util from '../common/UI5Util';
import Util from '../common/Util';

/**
 * NOTE: Need to verify few un-identified UI5 Types which are currently missing in UI5 type definitions, marked them as TODO below.
 */

export default class AppContextData {
	private static readonly _appContextData: PxApiTypes.AppContextData = {
		appFrameworkId: Constants.DEFAULT_VALUE_NA,
		appFrameworkVersion: Constants.DEFAULT_VALUE_NA,
		theme: Constants.DEFAULT_VALUE_NA,
		appId: Constants.DEFAULT_VALUE_NA,
		appTitle: Constants.DEFAULT_VALUE_NA,
		languageTag: Constants.DEFAULT_VALUE_NA,
		technicalAppComponentId: Constants.DEFAULT_VALUE_NA,
		appVersion: Constants.DEFAULT_VALUE_NA,
		appSupportInfo: Constants.DEFAULT_VALUE_NA
	};

	static async getData(): Promise<PxApiTypes.AppContextData> {
		return await this.calculateAppContextData();
	}

	private static async calculateAppContextData(): Promise<PxApiTypes.AppContextData> {
		const currentApp = await UI5Util.getCurrentApp();
		if (currentApp) {
			if (this.isAppTypeSupported(currentApp.applicationType.toLowerCase())) {
				const appInfo = await this.getAppInfo(currentApp);
				return this.getContextData(appInfo);
			} else {
				Log.warning(Constants.WARNING.UNSUPPORTED_APP_TYPE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA);
				return this._appContextData;
			}
		} else {
			Log.error(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE, undefined, Constants.COMPONENT.APP_CONTEXT_DATA);
			throw new Error(Constants.ERROR.CURRENT_APP_NOT_AVAILABLE);
		}
	}

	private static isAppTypeSupported(appType: string): boolean {
		return Constants.SUPPORTED_APP_TYPES.indexOf(appType) > -1;
	}

	private static async getAppInfo(currentApp: CurrentApplication): Promise<AppInfo> {
		const appInfo = (await currentApp.getInfo([
			'appId',
			'appVersion',
			'appSupportInfo',
			'technicalAppComponentId',
			'appFrameworkId',
			'appFrameworkVersion'
		])) as AppInfo;
		if (appInfo) {
			const metadata = AppConfiguration.getMetadata(); // Open: no getMetadata function as per definition
			if (metadata?.title) {
				appInfo.appTitle = metadata.title;
			}
			if (appInfo?.appId === Constants.LAUNCHPAD_VALUE) {
				appInfo.appTitle = Util.stringToTitleCase(appInfo.appId);
			}
		}
		return appInfo;
	}

	private static async getContextData(appInfo: AppInfo): Promise<PxApiTypes.AppContextData> {
		const contextData = {} as PxApiTypes.AppContextData;
		contextData.previousTheme = ThemeData.getPreviousTheme();
		contextData.theme = UI5Util.getTheme();

		contextData.languageTag = this.getLanguage();
		if (appInfo) {
			contextData.appFrameworkId = Util.convertAppFrameworkTypeToId(appInfo['appFrameworkId']);
			contextData.appFrameworkVersion = appInfo['appFrameworkVersion'] || Constants.DEFAULT_VALUE_NA;
			contextData.appId = appInfo['appId'] || Constants.DEFAULT_VALUE_NA;
			contextData.appTitle = appInfo['appTitle'] || Constants.DEFAULT_VALUE_NA;
			contextData.technicalAppComponentId = appInfo['technicalAppComponentId'] || Constants.DEFAULT_VALUE_NA;
			contextData.appVersion = appInfo['appVersion'] || Constants.DEFAULT_VALUE_NA;
			contextData.appSupportInfo = appInfo['appSupportInfo'] || Constants.DEFAULT_VALUE_NA;
		} else {
			contextData.appFrameworkId = Util.convertAppFrameworkTypeToId(undefined);
			contextData.appFrameworkVersion = Constants.DEFAULT_VALUE_NA;
			contextData.appId = Constants.DEFAULT_VALUE_NA;
			contextData.appTitle = Constants.DEFAULT_VALUE_NA;
			contextData.technicalAppComponentId = Constants.DEFAULT_VALUE_NA;
			contextData.appVersion = Constants.DEFAULT_VALUE_NA;
			contextData.appSupportInfo = Constants.DEFAULT_VALUE_NA;
		}
		return contextData;
	}

	private static getLanguage(): string {
		return Util.formatLanguageTag(UI5Util.getLanguage());
	}
}
