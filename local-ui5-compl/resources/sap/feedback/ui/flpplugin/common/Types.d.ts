declare module "sap/feedback/ui/flpplugin/common/Types" {
    import { JSONValue } from '@sap-px/pxapi/dist/api/common/Types';
    global {
        interface Window {
            QSI: any;
            sap: any;
        }
    }
    interface OpenSurveyCallback {
        (): void;
    }
    interface PluginInfo {
        id: string;
        version: string;
    }
    interface AppInfo {
        appTitle?: string;
        appId?: string;
        appVersion?: string;
        appSupportInfo?: string;
        technicalAppComponentId?: string;
        appFrameworkId?: string;
        appFrameworkVersion?: string;
    }
    interface PxConfig {
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
    type PxConfigType = PxConfig | JSONValue;
    interface RawStartParameters {
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
    interface AppPushState {
        areaId: string;
        triggerName: string;
        triggerType: string;
        triggeredCount?: number;
        executedCount?: number;
        lastChanged: number;
    }
    interface AppPushStates {
        [key: string]: AppPushState;
    }
    interface UserState {
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
}
//# sourceMappingURL=Types.d.ts.map