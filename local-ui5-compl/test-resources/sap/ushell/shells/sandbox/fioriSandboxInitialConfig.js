// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

window["sap-ushell-config"] = {
    defaultRenderer: "fiori2",
    renderers: {
        fiori2: {
            componentData: {
                config: {
                    enableSearch: false,
                    enableUserDefaultParameters: true,
                    rootIntent: "Shell-home"
                }
            }
        }
    },
    services: {
        NavTargetResolution: {
            config: {
                allowTestUrlComponentConfig: true,
                enableClientSideTargetResolution: true
            }
        },
        SupportTicket: {
            // switched off as the local adapter is not connected to a ticket system
            config: {
                enabled: false
            }
        },
        SmartNavigation: {
            config: {
                isTrackingEnabled: true
            }
        }
    }
};
