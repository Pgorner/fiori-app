// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define(["sap/base/Log"], function (Log) {
    "use strict";

    let aNotifications = [
        {
            Id: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:45:38Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappnavsample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-108997a269c4",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
            Priority: "HIGH",
            SensitiveText: "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Purchase Order",
            NotificationTypeDesc: "Purchase Order-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                    Key: "sap-xapp-state-data",
                    Value: '{"selectionVariant":{"SelectionVariantID":"MyVariant","SelectOptions":[' +
                        '{"PropertyName":"CompanyCode","Ranges":[' +
                        '{"Sign":"I","Option":"EQ","Low":"0001","High":null},' +
                        '{"Sign":"I","Option":"EQ","Low":"0002","High":null}]},' +
                        '{"PropertyName":"FiscalYear","Ranges":[' +
                        '{"Sign":"I","Option":"EQ","Low":"2014","High":null}]},' +
                        '{"PropertyName":"GLAccount","Ranges":[' +
                        '{"Sign":"I","Option":"BT","Low":"10000","High":"20000"},' +
                        '{"Sign":"I","Option":"EQ","Low":"30000","High":null}]}]}}'
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept all",
                    Nature: "POSITIVE"
                },
                {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject all",
                    Nature: "NEGATIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:45:38Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappstatesample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-108997a269c4",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
            Priority: "HIGH",
            SensitiveText: "Purchase order #2846 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Purchase Order",
            NotificationTypeDesc: "Purchase Order-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                    Key: "PurchaseOrderId",
                    Value: "236400"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c93ac",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept all",
                    Nature: "POSITIVE"
                },
                {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject all",
                    Nature: "NEGATIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:45:38Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappstatesample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-108997a269c4",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
            Priority: "HIGH",
            SensitiveText: "Purchase order #1865 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Purchase Order",
            NotificationTypeDesc: "Purchase Order-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                    Key: "PurchaseOrderId",
                    Value: "236400"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693cb3ac",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept all",
                    Nature: "POSITIVE"
                },
                {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject all",
                    Nature: "NEGATIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:45:38Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappstatesample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-108997a269c4",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
            Priority: "HIGH",
            SensitiveText: "Purchase order #1867 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Purchase Order",
            NotificationTypeDesc: "Purchase Order-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                    Key: "PurchaseOrderId",
                    Value: "236400"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693cd3ac",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept all",
                    Nature: "POSITIVE"
                },
                {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject all",
                    Nature: "NEGATIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:45:38Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: true,
            NavigationTargetAction: "toappnavsample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-108997a269c4",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: undefined,
            Priority: "HIGH",
            SensitiveText: "Purchase order #1156 for $5,000  and 10.000 items by Gavin Gradel on 30.10.2016 requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "You have 4 purchase orders that require your approval",
            NotificationCount: 0,
            SubTitle: "Purchase Order",
            NotificationTypeDesc: "Purchase Order-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                    Key: "sap-xapp-state-data",
                    Value: '{"selectionVariant":{"SelectionVariantID":"MyVariant","SelectOptions":[' +
                        '{"PropertyName":"CompanyCode","Ranges":[' +
                        '{"Sign":"I","Option":"EQ","Low":"0001","High":null},' +
                        '{"Sign":"I","Option":"EQ","Low":"0002","High":null}]},' +
                        '{"PropertyName":"FiscalYear","Ranges":[' +
                        '{"Sign":"I","Option":"EQ","Low":"2014","High":null}]},' +
                        '{"PropertyName":"GLAccount","Ranges":[' +
                        '{"Sign":"I","Option":"BT","Low":"10000","High":"20000"},' +
                        '{"Sign":"I","Option":"EQ","Low":"30000","High":null}]}]}}'
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept all",
                    Nature: "POSITIVE"
                },
                {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject all",
                    Nature: "NEGATIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:44:09Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappnavsample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappnavsample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
            NotificationTypeKey: "LeaveRequestTypeKey",
            ParentId: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a2",
            Priority: "LOW",
            SensitiveText: "Leave request #1651 by Gavin Gradel requires your attention",
            Text: "A leave request requires your attention",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Leave Request",
            NotificationTypeDesc: "Leave Request-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                    Key: "LeaveRequestId",
                    Value: "724934632"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0adf3a1",
                    Key: "PosId",
                    Value: "10"
                }
            ],
            Actions: [
                {
                    ActionId: "DenyLRActionKey",
                    ActionText: "Deny",
                    GroupActionText: "Deny all",
                    Nature: "NEGATIVE"
                },
                {
                    ActionId: "ApproveLRActionKey",
                    ActionText: "Approve",
                    GroupActionText: "Approve all",
                    Nature: "POSITIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:44:09Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappnavsample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappnavsample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
            NotificationTypeKey: "LeaveRequestTypeKey",
            ParentId: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a2",
            Priority: "LOW",
            SensitiveText: "Leave request #423 by Gavin Gradel requires your attention",
            Text: "A leave request requires your attention",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Leave Request",
            NotificationTypeDesc: "Leave Request-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                    Key: "LeaveRequestId",
                    Value: "724934632"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a1",
                    Key: "PosId",
                    Value: "10"
                }
            ],
            Actions: [
                {
                    ActionId: "DenyLRActionKey",
                    ActionText: "Deny",
                    GroupActionText: "Deny all",
                    Nature: "NEGATIVE"
                },
                {
                    ActionId: "ApproveLRActionKey",
                    ActionText: "Approve",
                    GroupActionText: "Approve all",
                    Nature: "POSITIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
            OriginId: "LOCAL",
            CreatedAt: "2024-04-03T13:47:00Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappnavsample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappnavsample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
            NotificationTypeKey: "LeaveRequestTypeKey",
            ParentId: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a2",
            Priority: "LOW",
            SensitiveText: "Leave request #242 by Gavin Gradel requires your attention",
            Text: "A leave request requires your attention",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Leave Request",
            NotificationTypeDesc: "Leave Request-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                    Key: "LeaveRequestId",
                    Value: "724934632"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0ae33a1",
                    Key: "PosId",
                    Value: "10"
                }
            ],
            Actions: [
                {
                    ActionId: "DenyLRActionKey",
                    ActionText: "Deny",
                    GroupActionText: "Deny all",
                    Nature: "NEGATIVE"
                },
                {
                    ActionId: "ApproveLRActionKey",
                    ActionText: "Approve",
                    GroupActionText: "Approve all",
                    Nature: "POSITIVE"
                }
            ]
        },
        {
            Id: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a2",
            OriginId: "LOCAL",
            CreatedAt: "2016-10-30T11:44:09Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: true,
            NavigationTargetAction: "toappnavsample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056ab-6fd8-1ee6-a2f4-0f96fbfb09a1",
            NotificationTypeKey: "LeaveRequestTypeKey",
            ParentId: undefined,
            Priority: "LOW",
            SensitiveText: "",
            Text: "A leave request requires your attention",
            GroupHeaderText: "You have 3 leave requests that require your approval",
            NotificationCount: 0,
            SubTitle: "Leave Request",
            NotificationTypeDesc: "Leave Request-1",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-c571e0ae13a2",
                    Key: "LeaveRequestId",
                    Value: "724934632"
                },
                {
                    NotificationId: "005056ab-6fd8-1ee6-a7d2-cc1a693c73ac",
                    Key: "PosId",
                    Value: "10"
                }
            ],
            Actions: [
                {
                    ActionId: "DenyLRActionKey",
                    ActionText: "Deny",
                    GroupActionText: "Deny all",
                    Nature: "NEGATIVE"
                },
                {
                    ActionId: "ApproveLRActionKey",
                    ActionText: "Approve",
                    GroupActionText: "Approve all",
                    Nature: "POSITIVE"
                }
            ]
        }
    ];

    var channelEmail = {
        "@odata.context": "$metadata#Channels/$entity",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        ChannelId: "SAP_EMAIL",
        IsActive: true,
        Description: ""
    };
    var channelSMP = {
        "@odata.context": "$metadata#Channels/$entity",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        ChannelId: "SAP_SMP",
        IsActive: false,
        Description: ""
    };
    var notificationTypePersonalizationSet = {
        "@odata.context": "$metadata#NotificationTypePersonalizationSet",
        "@odata.metadataEtag": "W/\"20181109171651\"",
        value: [{
            NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
            NotificationTypeDesc: "PREXT_DONE",
            PriorityDefault: "",
            DoNotDeliver: false,
            DoNotDeliverMob: false,
            DoNotDeliverEmail: false,
            IsEmailEnabled: true,
            IsEmailIdMaintained: true
        }, {
            NotificationTypeId: "e41d2de5-3d80-1ed8-a2e8-36c6e5bcb481",
            NotificationTypeDesc: "SOS_DONE",
            PriorityDefault: "",
            DoNotDeliver: false,
            DoNotDeliverMob: false,
            DoNotDeliverEmail: true,
            IsEmailEnabled: true,
            IsEmailIdMaintained: true
        }, {
            NotificationTypeId: "e41d2de5-3d80-1ed8-aad1-8cecfcb00e8f",
            NotificationTypeDesc: "POAC überprüfen",
            PriorityDefault: "",
            DoNotDeliver: false,
            DoNotDeliverMob: false,
            DoNotDeliverEmail: false,
            IsEmailEnabled: true,
            IsEmailIdMaintained: false
        }, {
            NotificationTypeId: "fa163e4e-8ebc-1ed8-a9a5-4bd05e8cdcc4",
            NotificationTypeDesc: "Leistungserfassungsblatt freigeben",
            PriorityDefault: "",
            DoNotDeliver: false,
            DoNotDeliverMob: false,
            DoNotDeliverEmail: true,
            IsEmailEnabled: true,
            IsEmailIdMaintained: false
        }]
    };

    var aRequests = [{
        method: "GET",
        path: /Notifications\/\$count/,
        response: function (xhr) {
            const iCount = aNotifications.filter((notification) => {
                return !notification.IsGroupHeader;
            }).length;
            xhr.respondJSON(200, {}, { value: iCount });
        }
    }, {
        method: "GET",
        path: /.*orderby=CreatedAt%20desc.*/,
        response: function (xhr) {
            const oNotificationsByDate = {
                "@odata.context": "$metadata#Notifications",
                value: aNotifications
                    .filter((notification) => {
                        return !notification.IsGroupHeader;
                    })
                    .sort((a, b) => {
                        const da = new Date(a.CreatedAt);
                        const db = new Date(b.CreatedAt);

                        if (da > db) {
                            return -1;
                        } else if (da < db) {
                            return 1;
                        }

                        return 0;
                    })
            };
            xhr.respondJSON(200, {}, oNotificationsByDate);
        }
    }, {
        method: "GET",
        path: /.*orderby=Priority.*/,
        response: function (xhr) {
            const oNotificationsByPriority = {
                "@odata.context": "$metadata#Notifications",
                value: aNotifications
                    .filter((notification) => {
                        return !notification.IsGroupHeader;
                    })
                    .sort((a, b) => {
                        if (a.Priority !== b.Priority) {
                            if (a.Priority === "HIGH") {
                                return -1;
                            }

                            if (b.Priority === "HIGH") {
                                return 1;
                            }

                            if (a.Priority === "MEDIUM") {
                                return -1;
                            }

                            if (b.Priority === "MEDIUM") {
                                return 1;
                            }
                        }

                        return 0;
                    })
            };
            xhr.respondJSON(200, {}, oNotificationsByPriority);
        }
    }, {
        method: "GET",
        path: /.*filter=IsGroupHeader%20eq%20true.*/,
        response: function (xhr) {
            const oNotificationsByType = {
                "@odata.context": "$metadata#Notifications",
                value: aNotifications.filter((notification) => {
                    return notification.IsGroupHeader;
                })
            };
            xhr.respondJSON(200, {}, oNotificationsByType);
        }
    }, {
        method: "GET",
        path: /.*and ParentId eq .*/,
        response: function (xhr) {
            try {
                const sNotificationGroupId = xhr.url.split("and ParentId eq ")[1].split("&")[0];
                const oNotificationGroup = aNotifications.find((notification) => {
                    return notification.Id === sNotificationGroupId;
                });
                const oNotificationsBySpecificType = {
                    "@odata.context": "$metadata#Notifications",
                    value: aNotifications.filter((notification) => {
                        return !notification.IsGroupHeader && notification.NotificationTypeKey === oNotificationGroup.NotificationTypeKey;
                    })
                };
                xhr.respondJSON(200, {}, oNotificationsBySpecificType);
            } catch (e) {
                Log.error("GET message '...ParentId...' has an unexpected url.");
                xhr.respondJSON(500, {}, "GET message '...ParentId...' has an unexpected url.");
            }
        }
    }, {
        method: "GET",
        path: /GetBadgeNumber\(\)/,
        response: function (xhr) {
            const iCount = aNotifications.filter((notification) => {
                return !notification.IsGroupHeader;
            }).length;
            xhr.respondJSON(200, {}, { d: { GetBadgeNumber: { Number: iCount } } });
        }
    }, {
        method: "POST",
        path: /ResetBadgeNumber/,
        response: function (xhr) {
            xhr.respondJSON(204, {}, "");
        }
    }, {
        method: "POST",
        path: /Dismiss/,
        response: function (xhr) {
            xhr.respondJSON(204, {}, "");
        }
    }, {
        method: "POST",
        path: /MarkRead/,
        response: function (xhr) {
            xhr.respondJSON(204, {}, "");
        }
    }, {
        method: "POST",
        path: /ExecuteAction/,
        response: function (xhr) {
            try {
                const sNotificationId = JSON.parse(xhr.requestBody).NotificationId;
                const index = aNotifications.findIndex((notification) => {
                    return notification.Id === sNotificationId;
                });
                const oNotificationItem = aNotifications.splice(index, 1)[0];
                const iTypeLength = aNotifications.filter((notification) => {
                    return !notification.IsGroupHeader && notification.NotificationTypeKey === oNotificationItem.NotificationTypeKey;
                }).length;

                if (iTypeLength === 0) {
                    const iGroupHeaderIndex = aNotifications.findIndex((notification) => {
                        return notification.IsGroupHeader && notification.NotificationTypeKey === oNotificationItem.NotificationTypeKey;
                    });
                    aNotifications.splice(iGroupHeaderIndex, 1);
                }
                xhr.respondJSON(204, {}, "");
            } catch (e) {
                Log.error("Post message 'ExecuteAction' has an unexpected requestBody.");
                xhr.respondJSON(500, {}, "Post message 'ExecuteAction' has an unexpected requestBody.");
            }
        }
    }, {
        method: "POST",
        path: /BulkActionByHeader/,
        response: function (xhr) {
            try {
                const sParentId = JSON.parse(xhr.requestBody).ParentId;
                const aResult = [];

                // remove all children
                aNotifications = aNotifications.filter((notification) => {
                    const bShouldBeRemoved = notification.ParentId === sParentId;
                    if (bShouldBeRemoved) {
                        aResult.push({
                            NotificationId: notification.Id,
                            Success: true
                        });
                    }
                    return !bShouldBeRemoved;
                });

                // remove parent
                const index = aNotifications.findIndex((notification) => {
                    return notification.Id === sParentId;
                });
                aNotifications.splice(index, 1);
                xhr.respondJSON(200, {}, {
                    d: {
                        response: {
                            statusCode: 200,
                            body: JSON.stringify({ value: aResult })
                        }
                    }
                });
            } catch (e) {
                Log.error("Post message 'BulkActionByHeader' has an unexpected requestBody.");
                xhr.respondJSON(500, {}, "Post message 'BulkActionByHeader' has an unexpected requestBody.");
            }
        }
    }, {
        method: "GET",
        path: /Channels\(ChannelId='SAP_SMP'\)/,
        response: function (xhr) {
            xhr.respondJSON(200, {}, channelSMP);
        }
    }, {
        method: "GET",
        path: /Channels\(ChannelId='SAP_EMAIL'\)/,
        response: function (xhr) {
            xhr.respondJSON(200, {}, channelEmail);
        }
    }, {
        method: "GET",
        path: /NotificationTypePersonalizationSet/,
        response: function (xhr) {
            xhr.respondJSON(200, {}, notificationTypePersonalizationSet);
        }
    }];

    return {
        requests: aRequests
    };
}, true);
