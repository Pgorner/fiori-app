// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Data for our mock servers
 */
sap.ui.define([], function () {
    "use strict";

    // This file is just a wrapper for a json object containing the responses
    // of three different (mock-)servers to an INTEROP call requesting the
    // User Defaults and their PersContainer.
    // Some data values have been slightly altered for the test, but it is still
    // exactly the same one would get from a server.

    return {
        firstServer: {
            d: {
                __metadata: {
                    id: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                    type: "INTEROP.PersContainer"
                },
                id: "sap.ushell.UserDefaultParameter",
                category: "P",
                validity: 0,
                clientExpirationTime: "Date(253373439600000)",
                component: "",
                appName: "",
                PersContainerItems: {
                    results: [{
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CompanyCode",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ChartOfAccounts",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 2:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ControllingArea',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ControllingArea',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ControllingArea",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 3:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CostCenter',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CostCenter',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CostCenter",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 4:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBank',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBank',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "HouseBank",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 5:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBankAccount',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBankAccount',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "HouseBankAccount",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 6:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ProfitCenter',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ProfitCenter',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "DynamicData",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"SuperFunkyData\"}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='Segment',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='Segment',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CommunityActivity",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"Nice_place_you_have_got_here\"}"
                    }]
                }
            }
        },
        secondServer: {
            d: {
                __metadata: {
                    id: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                    type: "INTEROP.PersContainer"
                },
                id: "sap.ushell.UserDefaultParameter",
                category: "P",
                validity: 0,
                clientExpirationTime: "Date(253373439600000)",
                component: "",
                appName: "",
                PersContainerItems: {
                    results: [{
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CompanyCode",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ChartOfAccounts",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 2:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ControllingArea',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ControllingArea',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ControllingArea",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 3:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CostCenter',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CostCenter',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CostCenter",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 4:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBank',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBank',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "HouseBank",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 5:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBankAccount',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBankAccount',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "HouseBankAccount",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 6:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ProfitCenter',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ProfitCenter',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "DynamicData",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"FunkyData\"}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CommunityActivity',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CommunityActivity',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CommunityActivity",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"The_other_place_is_nicer\"}"
                    }]
                }
            }
        },
        defaultServer: {
            d: {
                __metadata: {
                    id: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                    uri: "/sap/opu/odata/UI2/INTEROP/PersContainers(id='sap.ushell.UserDefaultParameter',category='P')",
                    type: "INTEROP.PersContainer"
                },
                id: "sap.ushell.UserDefaultParameter",
                category: "P",
                validity: 0,
                clientExpirationTime: "Date(253373439600000)",
                component: "",
                appName: "",
                PersContainerItems: {
                    results: [{
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CompanyCode',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CompanyCode",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ChartOfAccounts',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ChartOfAccounts",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 2:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ControllingArea',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ControllingArea',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ControllingArea",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 3:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CostCenter',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='CostCenter',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CostCenter",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 4:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBank',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBank',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "HouseBank",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 5:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBankAccount',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='HouseBankAccount',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "HouseBankAccount",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 6:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ProfitCenter',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='ProfitCenter',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "ProfitCenter",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 7:08:09 GMT+0200 (Central European Summer Time)\"}}"
                    }, {
                        __metadata: {
                            id: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='Segment',category='I')",
                            uri: "/sap/opu/odata/UI2/INTEROP/PersContainerItems(containerId='sap.ushell.UserDefaultParameter',containerCategory='P',id='Segment',category='I')",
                            type: "INTEROP.PersContainerItem"
                        },
                        containerId: "sap.ushell.UserDefaultParameter",
                        containerCategory: "P",
                        id: "CommunityActivity",
                        category: "I",
                        value: "{\"_shellData\":{\"storeDate\":\"Fri Aug 23 2019 1:08:09 GMT+0200 (Central European Summer Time)\"}, \"value\": \"VanillaActivity\"}"
                    }]
                }
            }
        }
    };
});
