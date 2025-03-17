import { JSONValue } from '@sap-px/pxapi/dist/api/common/Types';

declare global {
	interface Window {
		// eslint-disable-next-line
		QSI: any;
		// eslint-disable-next-line
		sap: any;
	}
}

export interface OpenSurveyCallback {
	(): void;
}

export interface PluginInfo {
	id: string;
	version: string;
}

export interface AppInfo {
	appTitle?: string;
	appId?: string;
	appVersion?: string;
	appSupportInfo?: string;
	technicalAppComponentId?: string;
	appFrameworkId?: string;
	appFrameworkVersion?: string;
}

export interface PxConfig {
	version: string;
	unitId: string;
	environment: string;
	startupConfig: {
		qualtricsInternalUri: string;
		productName: string;
		platformType: string;
		scopeSet: [string];
	};
	runtimeConfig: {
		useApi: boolean;
		domElementId: string;
		daysUntilLocalStateExpiry: number;
	};
	themingConfig: {
		writeToGlobals: boolean;
	};
	pushConfig: {
		general: {
			quietPeriodInHrs: number;
			snoozePeriodInHrs: number;
		};
		timedPush: {
			intervalTimerInMinutes: number;
			minimumTimeToStartTimerInHrs: number;
			intervalInitialPushInDays: number;
			deviationInitialPushInDays: number;
			intervalNextPushInDays: number;
			deviationNextPushInDays: number;
		};
		appPush: {
			intervalInitialPushInDays: number;
			deviationInitialPushInDays: number;
			intervalNextPushInDays: number;
			deviationNextPushInDays: number;
			configs: [
				{
					areaId: string;
					triggerName: string;
					validFrom: string;
					validTo: string;
					isEnabled: boolean;
					trigger: {
						type: string;
						interval: number;
						maxLimit: number;
						startThreshold: number;
					};
				}
			];
		};
	};
}
export type PxConfigType = PxConfig | JSONValue;

export interface RawStartParameters {
	tenantId: string;
	tenantRole: string;
	qualtricsInternalUri: string;
	isPushEnabled: boolean;
	pushChannelPath: string;
	platformType: string;
	productName: string;
	scopeSet: string;
	configUrl: string;
	unitId: string;
	environment: string;
	configJson: object;
}

export interface AppPushState {
	areaId: string;
	triggerName: string;
	triggerType: string;
	triggeredCount?: number;
	executedCount?: number;
	lastChanged: number;
}

export interface AppPushStates {
	[key: string]: AppPushState;
}

export interface UserState {
	version: number;
	isDebugState?: boolean;
	lastPush?: number;
	dynamicPushDate?: number;
	timedPushDate?: number;
	appPushDate?: number;
	inAppPushDate?: number;
	lastTheme?: string;
	currentTheme?: string;
	toggleStart?: number;
	snoozeCount?: number;
	appPushStates?: AppPushStates;
	featurePushStates?: AppPushStates;
}
