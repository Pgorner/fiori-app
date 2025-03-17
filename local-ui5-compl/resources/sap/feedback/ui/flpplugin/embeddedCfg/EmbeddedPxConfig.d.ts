declare module "sap/feedback/ui/flpplugin/embeddedCfg/EmbeddedPxConfig" {
    export default class EmbeddedPxConfig {
        static pushConfig(): {
            appPush: {
                configs: {
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
                }[];
            };
            instantPush: {
                dailyLimit: number;
                configs: {
                    areaId: string;
                    triggerName: string;
                    validFrom: string;
                    validTo: string;
                    isEnabled: boolean;
                    maxLimit: number;
                    quietPeriodInHrs: number;
                    showInvitation: boolean;
                }[];
            };
        };
    }
}
//# sourceMappingURL=EmbeddedPxConfig.d.ts.map