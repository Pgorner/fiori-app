// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    return {
        visualizations: {
            totalCount: 3,
            nodes: [
                {
                    id: "8adf91e9-b17a-425e-8053-f39b62f0c31e2",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                id: "F075633",
                                title: "My Leave Request",
                                subTitle: "Request some time off"
                            },
                            "sap.flp": {
                                target: {
                                    type: "URL",
                                    url: "www.sap.com"
                                },
                                indicatorDataSource: {
                                    path: "test",
                                    refresh: 60
                                },
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ],
                                        default: "standard"
                                    }
                                }
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://create-leave-request"
                                }
                            }
                        }
                    }
                },
                {
                    id: "8adf91e9-b17a-425e-8053-f39b62f0c31e5",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                id: "F075636",
                                title: "My Leave Request",
                                subTitle: "Request some time off"
                            },
                            "sap.flp": {
                                target: {
                                    type: "URL",
                                    url: "www.sap.com"
                                },
                                indicatorDataSource: {
                                    path: "test",
                                    refresh: 60
                                },
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ],
                                        default: "standard"
                                    }
                                }
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://create-leave-request"
                                }
                            }
                        }
                    }
                },
                {
                    id: "8adf91e9-b17a-425e-8053-f39b62f0c31e8",
                    type: "sap.ushell.StaticAppLauncher",
                    descriptor: {
                        value: {
                            "sap.app": {
                                id: "F075639",
                                title: "My Leave Request",
                                subTitle: "Request some time off"
                            },
                            "sap.flp": {
                                target: {
                                    type: "URL",
                                    url: "www.sap.com"
                                },
                                indicatorDataSource: {
                                    path: "test",
                                    refresh: 60
                                },
                                vizOptions: {
                                    displayFormats: {
                                        supported: [
                                            "standard",
                                            "standardWide",
                                            "flat",
                                            "flatWide",
                                            "compact"
                                        ],
                                        default: "standard"
                                    }
                                }
                            },
                            "sap.ui": {
                                icons: {
                                    icon: "sap-icon://create-leave-request"
                                }
                            }
                        }
                    }
                }
            ]
        }
    };
});
