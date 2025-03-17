/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
declare const _default: {
    manifest: {
        _version: string;
        "sap.app": {
            id: string;
            type: string;
            title: string;
            subTitle: string;
            description: string;
            applicationVersion: {
                version: string;
            };
        };
        "sap.ui": {
            technology: string;
            icons: {
                icon: string;
            };
        };
        "sap.card": {
            type: string;
            configuration: {
                destinations: {
                    service: {
                        name: string;
                        defaultUrl: string;
                    };
                };
                csrfTokens: {
                    token1: {
                        data: {
                            request: {
                                url: string;
                                method: string;
                                headers: {
                                    "X-CSRF-Token": string;
                                };
                            };
                        };
                    };
                };
                parameters: {
                    _adaptiveFooterActionParameters: {
                        "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)": {
                            actionParameters: {
                                id: string;
                                label: string;
                                isRequired: boolean;
                                configuration: {
                                    entitySet: string;
                                    serviceUrl: string;
                                    title: string;
                                    value: string;
                                };
                                errorMessage: string;
                                placeholder: string;
                            }[];
                            data: {
                                isConfirmationRequired: boolean;
                            };
                            enablePath: string;
                            label: string;
                            style: string;
                            verb: string;
                            triggerActionText: string;
                        };
                        C_SalesPlanTPRelease: {
                            actionParameters: any[];
                            data: {
                                actionParams: {
                                    keys: string[];
                                };
                                isConfirmationRequired: boolean;
                            };
                            enablePath: string;
                            label: string;
                            parameters: {
                                IsActiveEntity: boolean;
                                SalesPlanUUID: string;
                            };
                            style: string;
                            verb: string;
                        };
                    };
                    footerActionParameters: {
                        "com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.SetBillingBlock(com.sap.gateway.srvd.ui_creditmemorequestmanage.v0001.CreditMemoRequestManageType)": {};
                        C_SalesPlanTPRelease: {
                            IsActiveEntity: boolean;
                            SalesPlanUUID: string;
                        };
                    };
                    _entitySet: {
                        value: string;
                        type: string;
                    };
                };
            };
            data: {
                request: {
                    url: string;
                    method: string;
                    headers: {
                        "X-CSRF-Token": string;
                    };
                    batch: {
                        header: {
                            method: string;
                            url: string;
                            headers: {
                                Accept: string;
                                "Accept-Language": string;
                            };
                            retryAfter: number;
                        };
                        content: {
                            method: string;
                            url: string;
                            headers: {
                                Accept: string;
                                "Accept-Language": string;
                            };
                        };
                    };
                };
            };
            header: {
                data: {
                    path: string;
                };
                type: string;
                title: string;
                subTitle: string;
                unitOfMeasurement: string;
                mainIndicator: {
                    color: string;
                    number: string;
                };
            };
            content: {
                data: {
                    path: string;
                };
                groups: {
                    title: string;
                    items: {
                        label: string;
                        value: string;
                        name: string;
                    }[];
                }[];
            };
            footer: {
                actionsStrip: {
                    actions: {
                        enabled: string;
                        parameters: string;
                        type: string;
                    }[];
                    buttonType: string;
                    text: string;
                    type: string;
                    visible: boolean;
                }[];
            };
        };
        "sap.insights": {
            templateName: string;
            parentAppId: string;
            cardType: string;
            versions: {
                ui5: string;
            };
        };
    };
    manifestWithExpressions: {
        _version: string;
        "sap.app": {
            id: string;
            type: string;
            title: string;
            subTitle: string;
            description: string;
            applicationVersion: {
                version: string;
            };
        };
        "sap.ui": {
            technology: string;
            icons: {
                icon: string;
            };
        };
        "sap.card": {
            type: string;
            configuration: {
                parameters: {
                    _entitySet: {
                        value: string;
                        type: string;
                    };
                };
                destinations: {
                    service: {
                        name: string;
                        defaultUrl: string;
                    };
                };
                csrfTokens: {
                    token1: {
                        data: {
                            request: {
                                url: string;
                                method: string;
                                headers: {
                                    "X-CSRF-Token": string;
                                };
                            };
                        };
                    };
                };
            };
            data: {
                request: {
                    url: string;
                    method: string;
                    headers: {
                        "X-CSRF-Token": string;
                    };
                    batch: {
                        header: {
                            method: string;
                            url: string;
                            headers: {
                                Accept: string;
                                "Accept-Language": string;
                            };
                            retryAfter: number;
                        };
                        content: {
                            method: string;
                            url: string;
                            headers: {
                                Accept: string;
                                "Accept-Language": string;
                            };
                        };
                    };
                };
            };
            header: {
                data: {
                    path: string;
                };
                type: string;
                title: string;
                subTitle: string;
                unitOfMeasurement: string;
                mainIndicator: {
                    state: string;
                    number: string;
                    trend: string;
                    unit: string;
                };
            };
            content: {
                data: {
                    path: string;
                };
                groups: {
                    title: string;
                    items: {
                        label: string;
                        value: string;
                        name: string;
                    }[];
                }[];
            };
        };
        "sap.insights": {
            templateName: string;
            parentAppId: string;
            cardType: string;
            versions: {
                ui5: string;
            };
        };
    };
    manifestWithOrWithoutGroupItemValues: {
        _version: string;
        "sap.card": {
            type: string;
            configuration: {
                parameters: {
                    _entitySet: {
                        value: string;
                        type: string;
                    };
                };
            };
            content: {
                data: {
                    path: string;
                };
                groups: ({
                    title: string;
                    items: {
                        label: string;
                        value: string;
                        name: string;
                    }[];
                } | {
                    title: string;
                    items: {
                        label: any;
                        value: string;
                    }[];
                })[];
            };
        };
    };
};
export default _default;
//# sourceMappingURL=IntegrationObjectCard.d.ts.map