// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview CDM Service double for the User Default Parameter Persistence tests
 */
sap.ui.define([], function () {
    "use strict";

    /*
     * This file mocks the CommonDataModel service's method #getSite and returns a
     * partial site tailored to the needs of the User Default Parameter Persistence
     * integration tests:
     * The site that only contains tiles, not pages, and System Aliases.
     * It contains the following tiles:
     *
     * - A static tile with a default parameter in the first content provider
     * - A static tile with a default parameter in the second content provider
     * - A dynamic tile with a default parameter in the first content provider
     * - A static tile with a content provider that will lead to an error in the tests
     * - A static tile without a path prefix in its content provider (thus forcing a default path)
     */
    var oSite = {
        _version: "3.1.0",
        applications: {
            UserDefaultsApp: {
                "sap.app": {
                    id: "UserDefaultsApp",
                    title: "User Defaults",
                    subTitle: "CommunityActivity",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    contentProviderId: "contentProviderUserDefaultsFirstSystem",
                    crossNavigation: {
                        inbounds: {
                            "UserDefault-start": {
                                semanticObject: "UserDefault",
                                action: "start",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.CommunityActivity",
                                                format: "reference"
                                            }
                                        },
                                        myFirstNameParameter: {
                                            defaultValue: {
                                                value: "UserDefault.FirstName",
                                                format: "reference"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                }
                            },
                            "UserDefaultExtended-start": {
                                semanticObject: "UserDefaultExtended",
                                action: "start",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.extended.CommunityActivity",
                                                format: "reference"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                }
                            },
                            "UserDefaultNonExisting-start": {
                                semanticObject: "UserDefault",
                                action: "start",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.LedgerFiscalYear",
                                                format: "reference"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0018"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppNavSample"
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "../../demoapps/AppNavSample/?A=URL"
                    }
                }
            },
            AlternativeApp: {
                "sap.app": {
                    id: "UserDefaultsApp",
                    title: "User Defaults",
                    subTitle: "CommunityActivity",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    contentProviderId: "contentProviderUserDefaultsSecondSystem",
                    crossNavigation: {
                        inbounds: {
                            "UserDefault-start": {
                                semanticObject: "OtherUserDefault",
                                action: "start",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.CommunityActivity",
                                                format: "reference"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0018"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppNavSample"
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "../../demoapps/AppNavSample/?A=URL"
                    }
                }
            },
            dynamicTile_dataSourceUSerDefaultExample1: {
                "sap.app": {
                    id: "dynamicTile_dataSourceUSerDefaultExample1",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    dataSources: {
                        fooService: {
                            uri: "my/super/duper/service/"
                        }
                    },
                    title: "dynamic with User Default",
                    subTitle: "A dynamic tile with User Default",
                    shortTitle: "dynamic with datasource",
                    contentProviderId: "contentProviderUserDefaultsFirstSystem",
                    crossNavigation: {
                        inbounds: {
                            "Dynamic-Tile2": {
                                semanticObject: "Dynamic",
                                action: "tile2",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.DynamicData",
                                                format: "reference"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0033"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppNavSample"
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "../../demoapps/AppNavSample"
                    }
                }
            },
            WrongContentProvider: {
                "sap.app": {
                    id: "UserDefaultsApp",
                    title: "User Defaults",
                    subTitle: "CommunityActivity",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    contentProviderId: "contentProviderDoesNotExist",
                    crossNavigation: {
                        inbounds: {
                            "UserDefault-start": {
                                semanticObject: "UserDefault",
                                action: "vanishes",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.CommunityActivity",
                                                format: "reference"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0018"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppNavSample"
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "../../demoapps/AppNavSample/?A=URL"
                    }
                }
            },
            UserDefaultDefault: {
                "sap.app": {
                    id: "UserDefaultDefault",
                    title: "User Defaults",
                    subTitle: "CommunityActivity",
                    ach: "CA-UI2-INT-FE",
                    applicationVersion: {
                        version: "1.0.0"
                    },
                    contentProviderId: "contentProviderDefault",
                    crossNavigation: {
                        inbounds: {
                            "UserDefault-start": {
                                semanticObject: "UserDefault",
                                action: "default",
                                signature: {
                                    parameters: {
                                        myDefaultedParameter: {
                                            defaultValue: {
                                                value: "UserDefault.CommunityActivity",
                                                format: "reference"
                                            }
                                        }
                                    },
                                    additionalParameters: "allowed"
                                }
                            }
                        }
                    }
                },
                "sap.flp": {
                    type: "application"
                },
                "sap.ui": {
                    technology: "UI5",
                    icons: {
                        icon: "sap-icon://Fiori2/F0018"
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: false,
                        phone: false
                    }
                },
                "sap.ui5": {
                    componentName: "sap.ushell.demo.AppNavSample"
                },
                "sap.platform.runtime": {
                    componentProperties: {
                        url: "../../demoapps/AppNavSample/?A=URL"
                    }
                }
            }
        },
        systemAliases: {
            contentProviderUserDefaultsFirstSystem: {
                http: {
                    id: "contentProviderUserDefaultsFirstSystem_HTTP",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: "PathPrefixFirstSystem",
                    xhr: {
                        pathPrefix: "/ZEUGS/"
                    }
                },
                https: {
                    id: "contentProviderUserDefaultsFirstSystem_HTTPS",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: "PathPrefixFirstSystem",
                    xhr: {
                        pathPrefix: "/ZEUGS/"
                    }
                },
                id: "contentProviderUserDefaultsFirstSystem",
                client: "120",
                language: ""
            },
            contentProviderUserDefaultsSecondSystem: {
                http: {
                    id: "contentProviderUserDefaultsSecondSystem_HTTP",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: "PathPrefixSecondSystem",
                    xhr: {
                        pathPrefix: "/DINGS/"
                    }
                },
                https: {
                    id: "contentProviderUserDefaultsSecondSystem_HTTPS",
                    host: "u1y.example.corp.com",
                    port: 44355,
                    pathPrefix: "PathPrefixSecondSystem",
                    xhr: {
                        pathPrefix: "/DINGS/"
                    }
                },
                id: "contentProviderUserDefaultsSecondSystem",
                client: "120",
                language: ""
            },
            contentProviderDoesNotExist: {
                http: {
                    id: "contentProviderDoesNotExist_HTTP",
                    pathPrefix: "PathPrefixSecondSystem",
                    xhr: {
                        pathPrefix: "/NOPE/"
                    }
                },
                https: {
                    id: "contentProviderDoesNotExist_HTTPS",
                    pathPrefix: "PathPrefixSecondSystem",
                    xhr: {
                        pathPrefix: "/NOTHINGTOSEEHERE/"
                    }
                },
                id: "contentProviderDoesNotExist",
                client: "120",
                language: ""
            },
            contentProviderDefault: {
                http: {
                    id: "contentProviderDefault_HTTP",
                    pathPrefix: "PathPrefixSecondSystem"
                },
                https: {
                    id: "contentProviderDefault_HTTPS",
                    pathPrefix: "PathPrefixSecondSystem"
                },
                id: "contentProviderDefault",
                client: "120",
                language: ""
            }
        }
    };

    return {
        getSiteWithoutPersonalization: function () {
            return Promise.resolve(oSite);
        }
    };
});
