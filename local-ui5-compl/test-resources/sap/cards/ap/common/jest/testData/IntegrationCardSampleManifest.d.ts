/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
declare const _default: {
    _version: string;
    "sap.app": {
        id: string;
        type: string;
        title: string;
        subTitle: string;
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
        extension: string;
        type: string;
        configuration: {
            parameters: {
                _headerSelectQuery: {
                    value: string;
                };
                _contentSelectQuery: {
                    value: string;
                };
                node_key: {
                    type: string;
                    value: string;
                };
                IsActiveEntity: {
                    type: string;
                    value: boolean;
                };
                BankCountry: {
                    type: string;
                    value: string;
                };
                _adaptiveFooterActionParameters: {
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
                footerActionParameters: {};
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
                number: string;
                unit: string;
                trend: string;
                state: string;
            };
            sideIndicators: {
                title: string;
                number: string;
                unit: string;
            }[];
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
            actionsStrip: any[];
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
export default _default;
//# sourceMappingURL=IntegrationCardSampleManifest.d.ts.map