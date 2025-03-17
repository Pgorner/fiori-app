// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/BusyIndicator",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/m/VBox",
    "sap/ui/core/Element",
    "sap/ushell/bootstrap/common/common.util",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/iconfonts"
], (
    BusyIndicator,
    mobileLibrary,
    MessageToast,
    VBox,
    Element,
    commonUtils,
    Container,
    EventHub,
    IconFonts
) => {
    "use strict";

    // shortcut for sap.m.FlexAlignContent
    var FlexAlignContent = mobileLibrary.FlexAlignContent;

    // shortcut for sap.m.FlexJustifyContent
    var FlexJustifyContent = mobileLibrary.FlexJustifyContent;

    const oExtensionSampleConfig = {
        defaultRenderer: "fiori2",
        ushell: {
            spaces: {
                enabled: true
            },
            home: {
                tilesWrappingType: "Hyphenated"
            }
        },
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        rootIntent: "Shell-home",
                        disableSignOut: true,
                        sizeBehaviorConfigurable: true
                    }
                }
            }
        },
        services: {
            Container: {
                adapter: {
                    config: {
                        systemProperties: {},
                        userProfile: {
                            metadata: {
                                editablePropterties: [
                                    "accessibility",
                                    "contentDensity",
                                    "theme"
                                ],
                                ranges: {
                                    theme: {
                                        sap_horizon: {
                                            displayName: "SAP Morning Horizon",
                                            themeRoot: ""
                                        },
                                        sap_horizon_dark: {
                                            displayName: "SAP Evening Horizon",
                                            themeRoot: ""
                                        },
                                        sap_horizon_hcb: {
                                            displayName: "SAP HCB (SAP Horizon)",
                                            themeRoot: ""
                                        },
                                        sap_horizon_hcw: {
                                            displayName: "SAP HCW (SAP Horizon)",
                                            themeRoot: ""
                                        }
                                    }
                                }
                            },
                            defaults: {
                                email: "john.doe@sap.com",
                                firstName: "John",
                                lastName: "Doe",
                                fullName: "John Doe",
                                id: "DOEJ",
                                language: "EN",
                                languageBcp47: "en",
                                sapDateFormat: "1",
                                tislcal: [],
                                numberFormat: "",
                                rtl: false,
                                sapTimeFormat: "0",
                                timeZone: "CET"
                            }
                        },
                        userProfilePersonalization: {
                            sapDateFormat: "1",
                            theme: "sap_horizon",
                            sapTimeFormat: "0",
                            timeZone: "CET",
                            contentDensity: "cozy"
                        }
                    }
                }
            },
            Personalization: {
                adapter: {
                    module: "sap.ushell.adapters.local.PersonalizationAdapter"
                }
            },
            AppState: {
                adapter: {
                    module: "sap.ushell.adapters.local.AppStateAdapter"
                },
                config: {
                    transient: true
                }
            },
            NavTargetResolution: {
                config: {
                    allowTestUrlComponentConfig: false,
                    enableClientSideTargetResolution: true
                },
                adapter: {
                    module: "sap.ushell.adapters.local.NavTargetResolutionAdapter"
                }
            },
            NavTargetResolutionInternal: {
                config: {
                    allowTestUrlComponentConfig: false,
                    enableClientSideTargetResolution: true
                },
                adapter: {
                    module: "sap.ushell.adapters.local.NavTargetResolutionInternalAdapter"
                }
            },
            UserInfo: {
                adapter: {
                    module: "sap.ushell.adapters.local.UserInfoAdapter"
                }
            },
            UserDefaultParameterPersistence: {
                adapter: {
                    module: "sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter"
                }
            },
            NavigationDataProvider: {
                adapter: {
                    module: "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter"
                }
            },
            VisualizationDataProvider: {
                adapter: {
                    module: "sap.ushell.adapters.cdm.v3.FlpLaunchPageAdapter"
                }
            },
            CommonDataModel: {
                adapter: {
                    config: {
                        ignoreSiteDataPersonalization: true,
                        allowSiteSourceFromURLParameter: true,
                        siteData: {
                            menus: {
                                main: {
                                    identification: {
                                        id: "main"
                                    },
                                    payload: {
                                        menuEntries: [
                                            {
                                                id: "space01",
                                                "help-id": "Space-space01",
                                                title: "Sample Space",
                                                description: "Example applications",
                                                icon: "sap-icon://syringe",
                                                type: "IBN",
                                                target: {
                                                    semanticObject: "Launchpad",
                                                    action: "openFLPPage",
                                                    parameters: [
                                                        {
                                                            name: "pageId",
                                                            value: "page1"
                                                        },
                                                        {
                                                            name: "spaceId",
                                                            value: "space01"
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            },
                            _version: "3.1.0",
                            site: {
                                identification: {
                                    id: "c9dcc1f3-dec0-4db4-91d3-639bf38d91ce",
                                    namespace: "",
                                    title: "Sandbox site",
                                    description: "FLP sandbox"
                                }
                            },
                            catalogs: {
                                SampleCatalog: {
                                    identification: {
                                        id: "SampleCatalog",
                                        title: "Sample Applications"
                                    },
                                    payload: {
                                        viz: [
                                            "sap.ushell.demokit.sample.ExtensionSample"
                                        ]
                                    }
                                }
                            },
                            applications: {
                                "sap.ushell.demokit.sample.ExtensionSample": {
                                    "sap.app": {
                                        id: "sap.ushell.demokit.sample.ExtensionSample",
                                        title: "Application Sample",
                                        subTitle: "for extensions",
                                        ach: "CA-FLP-FE-COR",
                                        applicationVersion: {
                                            version: "1.0.0"
                                        },
                                        crossNavigation: {
                                            inbounds: {
                                                actionToExtensionSample: {
                                                    semanticObject: "Action",
                                                    action: "toExtensionSample",
                                                    signature: {
                                                        parameters: {},
                                                        additionalParameters: "allowed"
                                                    }
                                                }
                                            }
                                        },
                                        tags: {
                                            keywords: []
                                        }
                                    },
                                    "sap.flp": {
                                        type: "application"
                                    },
                                    "sap.ui": {
                                        technology: "UI5",
                                        icons: {
                                            icon: "sap-icon://header"
                                        },
                                        deviceTypes: {
                                            desktop: true,
                                            tablet: true,
                                            phone: true
                                        }
                                    },
                                    "sap.ui5": {
                                        componentName: "sap.ushell.demokit.sample.ExtensionSample"
                                    },
                                    "sap.platform.runtime": {
                                        componentProperties: {
                                            url: "test-resources/sap/ushell/demokit/sample/ExtensionSample/"
                                        }
                                    }
                                }
                            },
                            visualizations: {
                                "sap.ushell.demokit.sample.ExtensionSample": {
                                    vizType: "sap.ushell.StaticAppLauncher",
                                    vizConfig: {
                                        "sap.flp": {
                                            target: {
                                                appId: "sap.ushell.demokit.sample.ExtensionSample",
                                                inboundId: "actionToExtensionSample"
                                            }
                                        }
                                    }
                                }
                            },
                            pages: {
                                page1: {
                                    identification: {
                                        id: "page1",
                                        title: "Sample Page"
                                    },
                                    payload: {
                                        layout: {
                                            sectionOrder: [
                                                "SAMPLES"
                                            ]
                                        },
                                        sections: {
                                            SAMPLES: {
                                                id: "SAMPLES",
                                                title: "Sample Application",
                                                layout: {
                                                    vizOrder: [
                                                        "vizExtensionSample"
                                                    ]
                                                },
                                                viz: {
                                                    vizExtensionSample: {
                                                        id: "vizExtensionSample",
                                                        vizId: "sap.ushell.demokit.sample.ExtensionSample"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            LaunchPage: {
                adapter: {
                    module: "sap.ushell.adapters.cdm.v3.FlpLaunchPageAdapter",
                    config: {
                        catalogs: [
                            {
                                id: "sample_catalog",
                                title: "Sample Application Catalog",
                                tiles: [
                                    {
                                        id: "sampleTile",
                                        title: "ExtensionSample",
                                        size: "1x1",
                                        tileType: "sap.ushell.ui.tile.StaticTile",
                                        properties: {
                                            chipId: "catalogTile_01",
                                            title: "ExtensionSample",
                                            subtitle: "Navigation Sample 1",
                                            info: "demo for startup parameter passing",
                                            icon: "sap-icon://Fiori2/F0003",
                                            targetURL: "#Action-toExtensionSample"
                                        }
                                    }
                                ]
                            }
                        ],
                        groups: []
                    }
                }
            },
            ClientSideTargetResolution: {
                adapter: {
                    config: {
                        inbounds: {
                            actionToExtensionSample: {
                                semanticObject: "Action",
                                action: "toExtensionSample",
                                title: "App with Personalization",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demokit.sample.ExtensionSample",
                                    url: "test-resources/sap/ushell/demokit/sample/ExtensionSample"
                                }
                            }
                        }
                    }
                }
            }
        },
        ui5: {
            libs: {
                "sap.ui.core": true,
                "sap.m": true,
                "sap.ushell": true
            }
        }
    };

    const LaunchpadSetup = {};

    /**
     * Overwrites the logo navigation
     * @since 1.121.0
     * @private
     */
    LaunchpadSetup._preventLogoNavigation = function () {
        const fnShowHomeMessage = MessageToast.show.bind(MessageToast, "Home button is not implemented in this sample.");

        EventHub.once("CoreResourcesComplementLoaded").do(() => {
            const oShellHeader = Element.getElementById("shell-header");
            const oLogoDomRef = oShellHeader.getDomRef("logo");
            if (!oLogoDomRef) {
                oLogoDomRef.removeAttribute("href");
            }

            let sHref;
            oShellHeader.addEventDelegate({
                onBeforeRendering: () => {
                    const oLogoDomRef = oShellHeader.getDomRef("logo");
                    if (oLogoDomRef) {
                        oLogoDomRef.setAttribute("href", sHref);
                        oLogoDomRef.removeEventListener("click", fnShowHomeMessage);
                    }
                },
                onAfterRendering: () => {
                    const oLogoDomRef = oShellHeader.getDomRef("logo");
                    if (oLogoDomRef) {
                        sHref = oLogoDomRef.getAttribute("href");
                        oLogoDomRef.removeAttribute("href");
                        oLogoDomRef.addEventListener("click", fnShowHomeMessage);
                    }
                }
            });
        });
    };

    /**
     * Creates a placeholder control which starts the FLP after the control was rendered.
     * After the FLP is started the handler is called.
     * @param {function} fnHandler The custom handler.
     * @returns {sap.ui.core.Control} The placeholder control.
     *
     * @since 1.121.0
     * @private
     */
    LaunchpadSetup.createPlaceholderControl = function (fnHandler) {
        const oIndicator = new BusyIndicator();
        const oPlaceHolder = new VBox({
            height: "100%",
            alignItems: FlexAlignContent.Center,
            justifyContent: FlexJustifyContent.Center,
            items: [oIndicator]
        });

        let bFlpInitialized = false;
        oPlaceHolder.addEventDelegate({
            onAfterRendering: () => {
                if (bFlpInitialized) {
                    return;
                }
                bFlpInitialized = true;
                this._startFLP()
                    .then(fnHandler)
                    .then(() => {
                        oIndicator.setVisible(false);
                    });
            }
        });

        return oPlaceHolder;
    };

    /**
     * Creates a basic FLP.
     *
     * @returns {Promise} after the FLP is placed on the DOM.
     */
    LaunchpadSetup._startFLP = async function () {
            // only launch FLP in an iFrame,
            // otherwise the component might be launched on the demo kit directly
            if (window === window.top) {
                return;
            }
            window["sap-ushell-config"] = oExtensionSampleConfig;

            const oFlp = document.createElement("div");
            oFlp.setAttribute("id", "flp");
            document.body.appendChild(oFlp);

            commonUtils.migrateV2ServiceConfig(window["sap-ushell-config"]);

            await Container.init("cdm");

            IconFonts.registerFiori2IconFont();

            const oFlpRootControl = await Container.createRendererInternal(null);
            oFlpRootControl.placeAt("flp");

            this._preventLogoNavigation();
    };


    return LaunchpadSetup;
});
