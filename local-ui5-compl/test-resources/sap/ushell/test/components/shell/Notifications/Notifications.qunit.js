// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.shell.Notifications.Notifications
 */
sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Element",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Container",
    "sap/ushell/resources",
    "sap/ushell/services/NotificationsV2",
    "sap/ushell/utils",
    "sap/ushell/utils/Deferred",
    "sap/ui/thirdparty/jquery"
], function (
    MessageToast,
    Element,
    XMLView,
    hasher,
    Container,
    resources,
    Notifications,
    Utils,
    Deferred,
    jQuery
) {
    "use strict";

    /* global sinon, QUnit */

    var sandbox = sinon.createSandbox({});

    var aResultArray1 = [{
        Id: "00505692-409C-1EE5-ABDA-8F15E3E3B020",
        OriginId: "G1Y_800",
        CreatedAt: "2015-12-30T09:05:12Z",
        IsActionable: true,
        IsRead: false,
        IsGroupable: true,
        IsGroupHeader: false,
        NavigationTargetAction: "DisplayObject",
        NavigationTargetObject: "PurchaseOrder",
        NotificationTypeId: "00505692-5975-1EE5-A991-2706A9CB0001",
        ParentId: "00000000-0000-0000-0000-000000000000",
        Priority: "MEDIUM",
        SensitiveText: "Purchase order #1807 for $5,000 by Gavin Gradel requires your approval",
        Text: "A purchase order requires your approval",
        SubTitle: "Purchase Order #1807 ",
        description: "description Test #1807",
        GroupHeaderText: "Purchase orders requiring your approval",
        NotificationCount: 0,
        Actor: { Id: "BAR-LEV", DisplayText: "BAR-LEV", ImageSource: "BAR-LEV" },
        NavigationTargetParams: [
            {
                NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                Key: "PurchaseOrderId",
                Value: "236400"
            }, {
                NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                Key: "PurchaseOrderVendor",
                Value: "PARTNER_137"
            }
        ],
        Actions: [
            {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0000",
                ActionText: "Accept",
                GroupActionText: "Accept All",
                Nature: "POSITIVE"
            }, {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0001",
                ActionText: "Reject",
                GroupActionText: "Reject All",
                Nature: "NEGATIVE"
            }
        ]
    }, {
        Id: "00505692-409C-1EE5-ABDA-8FA41F727020",
        OriginId: "G1Y_800",
        CreatedAt: "2015-12-20T09:05:20Z",
        IsActionable: true,
        IsRead: true,
        IsGroupable: true,
        IsGroupHeader: false,
        NavigationTargetAction: "display",
        NavigationTargetObject: "LeaveRequest",
        NotificationTypeId: "00505692-5975-1EE5-A991-2706A9CB0002",
        ParentId: "00000000-0000-0000-0000-000000000000",
        Priority: "LOW",
        SensitiveText: "Leave request #1808 by Gavin Gradel requires your attention",
        Text: "A leave request requires your attention",
        SubTitle: "Purchase Order #1808",
        description: "description Test #1808",
        GroupHeaderText: "Leave requests requiring your attention",
        NotificationCount: 0,
        Actor: { Id: "BAR-LEV", DisplayText: "BAR-LEV", ImageSource: "BAR-LEV" },
        NavigationTargetParams: [
            {
                NotificationId: "00505692-409C-1EE5-ABDA-8FA41F727020",
                Key: "LeaveRequestId",
                Value: "AA-DD0055"
            }, {
                NotificationId: "00505692-409C-1EE5-ABDA-8FA41F727020",
                Key: "LeaveRequestMode",
                Value: "EditAsManager"
            }
        ],
        Actions: [
            {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0011",
                ActionText: "Deny",
                GroupActionText: "Deny All",
                Nature: "NEGATIVE"
            }, {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0010",
                ActionText: "Approve",
                GroupActionText: "Approve All",
                Nature: "POSITIVE"
            }
        ]
    }, {
        Id: "00505692-409C-1EE5-ABDA-8F15E3E3B021",
        OriginId: "G1Y_800",
        CreatedAt: "2015-12-25T09:05:12Z",
        IsActionable: true,
        IsRead: false,
        IsGroupable: true,
        IsGroupHeader: false,
        NavigationTargetAction: "DisplayObject",
        NavigationTargetObject: "PurchaseOrder",
        NotificationTypeId: "00505692-5975-1EE5-A991-2706A9CB0001",
        ParentId: "00000000-0000-0000-0000-000000000000",
        Priority: "HIGH",
        SensitiveText: "Purchase order #1807 for $5,000 by Gavin Gradel requires your approval",
        Text: "A purchase order requires your approval",
        GroupHeaderText: "Purchase orders requiring your approval",
        SubTitle: "Purchase order #1807",
        description: "description Test #1807 for $5,000",
        NotificationCount: 0,
        Actor: { Id: "BAR-LEV", DisplayText: "BAR-LEV", ImageSource: "BAR-LEV" },
        NavigationTargetParams: [
            {
                NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                Key: "PurchaseOrderId",
                Value: "236400"
            }, {
                NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                Key: "PurchaseOrderVendor",
                Value: "PARTNER_137"
            }
        ],
        Actions: [
            {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0000",
                ActionText: "Accept",
                GroupActionText: "Accept All",
                Nature: "POSITIVE"
            }, {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0001",
                ActionText: "Reject",
                GroupActionText: "Reject All",
                Nature: "NEGATIVE"
            }
        ]
    }, {
        Id: "00505692-409C-1EE5-ABDA-8F15E3E3B022",
        OriginId: "G1Y_800",
        CreatedAt: "2015-12-25T09:05:12Z",
        IsActionable: true,
        IsRead: false,
        IsGroupable: true,
        IsGroupHeader: false,
        NavigationTargetAction: "DisplayObject",
        NavigationTargetObject: "PurchaseOrder",
        NotificationTypeId: "00505692-5975-1EE5-A991-2706A9CB0001",
        ParentId: "00000000-0000-0000-0000-000000000000",
        Priority: "HIGH",
        SensitiveText: "",
        Text: "A purchase order requires your approval",
        SubTitle: "",
        description: "description Test",
        GroupHeaderText: "Purchase orders requiring your approval",
        NotificationCount: 0,
        Actor: { Id: "BAR-LEV", DisplayText: "BAR-LEV", ImageSource: "BAR-LEV" },
        NavigationTargetParams: [
            {
                NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                Key: "PurchaseOrderId",
                Value: "236400"
            }, {
                NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B021",
                Key: "PurchaseOrderVendor",
                Value: "PARTNER_137"
            }
        ],
        Actions: [
            {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0000",
                ActionText: "Accept",
                GroupActionText: "Accept All",
                Nature: "POSITIVE"
            }, {
                ActionId: "00505692-5975-1EE5-A991-2706A9CC0001",
                ActionText: "Reject",
                GroupActionText: "Reject All",
                Nature: "NEGATIVE"
            }
        ]
    }];
    var aResultArray2 = [
        { Id: "Id1" },
        { Id: "Id2" },
        { Id: "Id3" },
        { Id: "Id4" },
        { Id: "Id5" },
        { Id: "Id6" }
    ];
    var oNotifications = {
        "@odata.context": "$metadata#Notifications",
        value: [
            {
                Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
                hasMoreItems: "true",
                OriginId: "LOCAL",
                CreatedAt: "2016-03-17T13:38:33Z",
                IsActionable: true,
                IsRead: false,
                IsGroupable: true,
                IsGroupHeader: true,
                NavigationTargetAction: "",
                NavigationTargetObject: "",
                NotificationTypeId: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
                NotificationTypeDesc: "Purchase Order-1",
                NotificationTypeKey: "LeaveRequest-key",
                ParentId: "00000000-0000-0000-0000-000000000000",
                Priority: "LOW",
                SensitiveText: "",
                Text: "",
                GroupHeaderText: "You have 2 leave requests requiring your attention",
                NotificationCount: 2,
                Actor: {
                    Id: "",
                    DisplayText: "",
                    ImageSource: ""
                },
                NavigationTargetParams: [],
                Actions: [{
                    ActionId: "Deny-key",
                    ActionText: "Deny",
                    GroupActionText: "Deny All",
                    Nature: "NEGATIVE"
                }, {
                    ActionId: "Approve-key",
                    ActionText: "Approve",
                    GroupActionText: "Approve All",
                    Nature: "POSITIVE"
                }]
            }, {
                Id: "005056ab-6fd8-1ee5-b3ca-966123d21209",
                OriginId: "LOCAL",
                CreatedAt: "2016-03-17T12:50:48Z",
                IsActionable: true,
                IsRead: false,
                IsGroupable: true,
                IsGroupHeader: true,
                NavigationTargetAction: "",
                NavigationTargetObject: "",
                NotificationTypeId: "005056ab-6fd8-1ee5-b3ca-966123d21209",
                NotificationTypeKey: "PurchaseOrder-key",
                ParentId: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
                Priority: "HIGH",
                SensitiveText: "",
                Text: "",
                GroupHeaderText: "Purchase orders requiring your approval",
                NotificationCount: 3,
                Actor: {
                    Id: "",
                    DisplayText: "",
                    ImageSource: ""
                },
                NavigationTargetParams: [],
                Actions: [{
                    ActionId: "Accept-key",
                    ActionText: "Accept",
                    GroupActionText: "Accept All",
                    Nature: "POSITIVE"
                }, {
                    ActionId: "Reject-key",
                    ActionText: "Reject",
                    GroupActionText: "Reject All",
                    Nature: "NEGATIVE"
                }]
            }
        ]
    };
    var aNotificationsBuffer = [
        {
            Id: "005056b4-24bc-1ee7-85aa-1d95eca8fde2",
            OriginId: "LOCAL",
            CreatedAt: "2017-03-30T13:58:17Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappstatesample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056b4-24bc-1ee7-85aa-1d95eca93de2",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: "005056b4-24bc-1ee7-85aa-1d95eca93de2",
            Priority: "HIGH",
            SensitiveText: "Purchase order #1440 for $2,000 by Gavin Gradel requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Over the last 12 months Gavin Gradel ordered goods $2,000.Currently 10.000 are due.",
            NotificationTypeDesc: "Purchase Order",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056b4-24bc-1ee7-85aa-1d95eca8fde2",
                    Key: "PurchaseOrderId",
                    Value: "236400"
                }, {
                    NotificationId: "005056b4-24bc-1ee7-85aa-1d95eca8fde2",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept All",
                    Nature: "POSITIVE"
                }, {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject All",
                    Nature: "NEGATIVE"
                }
            ]
        }, {
            Id: "005056b4-24bc-1ee7-85aa-1d95eca91de2",
            OriginId: "LOCAL",
            CreatedAt: "2017-03-30T13:58:17Z",
            IsActionable: true,
            IsRead: false,
            IsGroupable: true,
            IsGroupHeader: false,
            NavigationTargetAction: "toappstatesample",
            NavigationTargetObject: "Action",
            NavigationIntent: "Action-toappstatesample",
            NotificationTypeId: "005056b4-24bc-1ee7-85aa-1d95eca93de2",
            NotificationTypeKey: "PurchaseOrderType2Key",
            ParentId: "005056b4-24bc-1ee7-85aa-1d95eca93de2",
            Priority: "HIGH",
            SensitiveText: "Purchase order #3631 for $1,000 by Gavin Gradel requires your approval",
            Text: "A purchase order requires your approval",
            GroupHeaderText: "",
            NotificationCount: 0,
            SubTitle: "Over the last 12 months Gavin Gradel ordered goods $1,000.Currently 10.000 are due.",
            NotificationTypeDesc: "Purchase Order",
            Actor: {
                Id: "MOSSERI",
                DisplayText: "MOSSERI",
                ImageSource: "https://scn.sap.com/people/guest/avatar/MOSSERI.png"
            },
            NavigationTargetParams: [
                {
                    NotificationId: "005056b4-24bc-1ee7-85aa-1d95eca91de2",
                    Key: "PurchaseOrderId",
                    Value: "236400"
                }, {
                    NotificationId: "005056b4-24bc-1ee7-85aa-1d95eca91de2",
                    Key: "PurchaseOrderVendor",
                    Value: "PARTNER_137"
                }
            ],
            Actions: [
                {
                    ActionId: "AcceptPOActionKey",
                    ActionText: "Accept",
                    GroupActionText: "Accept All",
                    Nature: "POSITIVE"
                }, {
                    ActionId: "RejectPOActionKey",
                    ActionText: "Reject",
                    GroupActionText: "Reject All",
                    Nature: "NEGATIVE"
                }
            ]
        }
    ];

    function beforeEach () {
        this.oMessageToastShowStub = sandbox.stub(MessageToast, "show");

        this.oNotificationsService = new Notifications(undefined, undefined, {
            config: {
                enabled: true,
                serviceUrl: "/no/real/url/to/notifications/endpoint"
            }
        });

        this.oExecuteBulkActionStub = sandbox.stub(this.oNotificationsService, "executeBulkAction").resolves();
        this.oDismissBulkNotificationsStub = sandbox.stub(this.oNotificationsService, "dismissBulkNotifications").resolves();
        this.oMarkReadStub = sandbox.stub(this.oNotificationsService, "markRead").resolves();
        this.oDismissNotificationStub = sandbox.stub(this.oNotificationsService, "dismissNotification").resolves();
        this.oGetNotificationsBufferBySortingTypeStub = sandbox.stub(this.oNotificationsService, "getNotificationsBufferBySortingType").resolves(aResultArray1);
        this.oGetNotificationsGroupHeadersStub = sandbox.stub(this.oNotificationsService, "getNotificationsGroupHeaders").resolves(JSON.stringify(oNotifications));
        this.oUserSettingInitialization = sandbox.stub(this.oNotificationsService, "_userSettingInitialization").returns();

        sandbox.stub(this.oNotificationsService, "_readNotificationsData").resolves(aResultArray1);
        sandbox.stub(this.oNotificationsService, "readSettings").resolves();
        sandbox.stub(this.oNotificationsService, "executeAction").resolves();
        sandbox.stub(this.oNotificationsService, "getNotificationsBufferInGroup").resolves(aNotificationsBuffer);

        return new Promise(function (resolve) {
            Container.init("local").then(function () {
                this.oFormatDateStub = sandbox.spy(Utils, "formatDate");
                sandbox.stub(Container, "getServiceAsync").callThrough().withArgs("Notifications").resolves(this.oNotificationsService);
                return Promise.all([
                    Container.getServiceAsync("MessageInternal"),
                    XMLView.create({
                        viewName: "sap.ushell.components.shell.Notifications.Notifications",
                        viewData: { notificationsService: this.oNotificationsService }
                    })
                ]).then(function (aResults) {
                    var oMessageService = aResults[0];
                    this.oView = aResults[1];

                    this.oErrorStub = sandbox.stub(oMessageService, "error");
                    this.oToExternalStub = sandbox.stub(Utils, "toExternalWithParameters").resolves();
                    this.oController = this.oView.getController();
                    resolve();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    /**
     * This method is called after each test. Add every restoration code here.
     */
    function afterEach () {
        sandbox.restore();
        this.oController.destroy();
        this.oView.destroy();

        [
            "sapUshellNotificationsListType",
            "sapUshellNotificationsListPriority",
            "sapUshellNotificationsListDate"
        ].forEach(function (sNotificationListId) {
            var oNotificatyionList = Element.getElementById(sNotificationListId);
            if (oNotificatyionList) {
                oNotificatyionList.destroy();
            }
        });
    }

    QUnit.module("init", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("notification view model", function (assert) {
        var aSortingTypesInModel = this.oController.getView().getModel().getProperty("/");
        assert.ok(aSortingTypesInModel.notificationsByDateDescending !== undefined, "notificationsByDateDescending exists in the model");
        assert.ok(aSortingTypesInModel.notificationsByPriorityDescending !== undefined, "notificationsByPriorityDescending exists in the model");
        assert.ok(this.oFormatDateStub.called, "date was formatted");
    });

    QUnit.test("descendingSortBy model structure", function (assert) {
        var aNotificationByDateDesc = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
        assert.strictEqual(aNotificationByDateDesc.length, 4, "Correct number of notification items byDate descending");
        assert.strictEqual(aNotificationByDateDesc[2].Id, "00505692-409C-1EE5-ABDA-8F15E3E3B021", "Correct 3rd item Id");
    });

    QUnit.module("actionButtonPressHandler", {
        beforeEach: function () {
            return beforeEach.call(this)
                .then(function () {
                    this.oEvent = {
                        getSource: function () {
                            return {
                                getBindingContext: function () {
                                    return {
                                        getPath: function () {
                                            return "/notificationsByDateDescending/aNotifications/1/Actions/0";
                                        }
                                    };
                                }
                            };
                        }
                    };
                    this.oRequireStub = sandbox.stub(sap.ui, "require");
                    this.oRequireStub.withArgs(["sap/m/MessageToast"]).callsArgWith(1, MessageToast);
                    this.oRequireStub.callThrough();
                }.bind(this));
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("message - returned value", async function (assert) {
        var oExecuteActionResponse = {
            isSucessfull: true,
            message: "Leave Request approved successfully"
        };
        sandbox.stub(this.oController, "executeAction").resolves(oExecuteActionResponse);

        await this.oController.onNotificationItemButtonPress(this.oEvent);

        assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast Show called once");
        assert.strictEqual(this.oMessageToastShowStub.args[0][0], "Leave Request approved successfully", "MessageToast called with returned message");
    });

    QUnit.test("message - default value", async function (assert) {
        var oExecuteActionResponse = {
            isSucessfull: true
        };
        sandbox.stub(this.oController, "executeAction").resolves(oExecuteActionResponse);

        await this.oController.onNotificationItemButtonPress(this.oEvent);

        assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast Show called once");
        assert.strictEqual(this.oMessageToastShowStub.args[0][0], resources.i18n.getText(
            "ActionAppliedToNotification", ["Deny"]), "MessageToast called with default message"
        );
    });


    QUnit.module("executeBulkAction", {
        beforeEach: function () {
            this.sPath = "/notificationsByTypeDescending/0";
            this.sActionName = "Approve-key";
            this.sActionText = "Approve key";
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("message toast in success flow", async function (assert) {
        var oGroupToDelete = { Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209" };
        this.oView.getModel().setProperty(this.sPath, { NotificationTypeDesc: "Purchase Order-1" });
        this.oExecuteBulkActionStub.resolves({});

        await this.oController.executeBulkAction(this.sActionName, this.sActionText, oGroupToDelete, this.sPath);

        var sMessage = this.oMessageToastShowStub.getCall(0).args[0];
        assert.ok(/^"Approve key"/.test(sMessage), "Message \"" + sMessage + "\" starts with \"Approve key\"");
        assert.ok(/"Purchase Order-1"/.test(sMessage), "Message \"" + sMessage + "\" contains group \"Purchase Order-1\"");
    });

    QUnit.test("message toast in failure flow", async function (assert) {
        var done = assert.async();
        var oGroupToDelete = {
            Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
            notifications: [
                { Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" },
                { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }
            ]
        };
        this.oExecuteBulkActionStub.rejects({
            succededNotifications: [],
            failedNotifications: [
                "005056ab-6fd8-1ee5-bb88-b1231d763dd0",
                "005056ab-6fd8-1ed5-bb89-ea35b66f609d"
            ]
        });

        await this.oController.executeBulkAction(this.sActionName, this.sActionText, oGroupToDelete, this.sPath);

        window.setTimeout(function () {
            var sMessage = this.oErrorStub.getCall(0).args[0];
            assert.strictEqual(sMessage, resources.i18n.getText("notificationsFailedExecuteBulkAction"), "executeBulkAction message in failure flow is correct");
            done();
        }.bind(this), 0);
    });

    QUnit.test("message toast in partial success flow", async function (assert) {
        var oGroupToDelete = {
            Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
            notifications: [
                { Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" },
                { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }
            ]
        };
        this.oView.getModel().setProperty(this.sPath, { NotificationTypeDesc: "Purchase Order-1" });
        this.oExecuteBulkActionStub.rejects({
            succededNotifications: ["005056ab-6fd8-1ed5-bb89-ea35b66f609d"],
            failedNotifications: ["005056ab-6fd8-1ee5-bb88-b1231d763dd0"]
        });

        await this.oController.executeBulkAction(this.sActionName, this.sActionText, oGroupToDelete, this.sPath);

        var sMessage = this.oMessageToastShowStub.getCall(0).args[0];
        assert.ok(/^"Approve key"/.test(sMessage), "Message \"" + sMessage + "\" starts with \"Approve key\"");
        assert.ok(/"Purchase Order-1"/.test(sMessage), "Message \"" + sMessage + "\" contains group \"Purchase Order-1\"");
    });

    QUnit.test("Executes bulk actions", async function (assert) {
        var oGroupToDelete = { Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209" };

        this.oExecuteBulkActionStub.resolves();
        this.oController.sCurrentSorting = this.oController.oSortingType.NOTIFICATIONS_BY_TYPE_DESCENDING;
        await this.oController.updateGroupHeaders();
        this.oController.sCurrentExpandedType = oGroupToDelete.Id;

        await this.oController.getNextBufferForType();
        var aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");

        assert.equal(aGroups.length, 2, "2 groups expected before execute action");
        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "The first group in the model is changed to the Purchase group");
        assert.equal(aGroups[0].aNotifications.length, 2, "2 notifications expected before execute action");

        // change stubbed notification service to send only one group
        const oModifiedNotifications = {
            "@odata.context": "$metadata#Notifications",
            value: [oNotifications.value[1]]
        };
        this.oNotificationsService.getNotificationsGroupHeaders.resolves(JSON.stringify(oModifiedNotifications));
        await this.oController.executeBulkAction(this.sActionName, this.sActionText, oGroupToDelete, this.sPath);


        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");
        assert.equal(aGroups.length, 1, "1 groups expected since 1 group deleted from Model");
        assert.equal(aGroups[0].GroupHeaderText, "Purchase orders requiring your approval", "The first group in the model is changed to the Purchase group");
        assert.equal(aGroups[0].aNotifications.length, 0, "Now the first group(that was the second group before is empty");

        assert.deepEqual(this.oController.getInitialSortingModelStructure(), this.oController.getView().getModel().getProperty("/notificationsByPriorityDescending/"),
            "Prio model should be empty after bulk action"
        );
        assert.strictEqual(this.oExecuteBulkActionStub.callCount, 1, "executeBulkAction service call was done");
    });

    QUnit.test("Handles error correctly", async function (assert) {
        var oGroupToDelete = {
            Id: "005056ab-6fd8-1ee5-b3ca-91c4c583b209",
            notifications: [
                { Id: "005056ab-6fd8-1ee5-bb88-b1231d763dd0" },
                { Id: "005056ab-6fd8-1ee5-bb88-b15ceb897dd0" }
            ]
        };
        var oDeferred = new Deferred();
        this.oExecuteBulkActionStub.returns(oDeferred.promise());
        this.oController.sCurrentSorting = "notificationsByTypeDescending";
        await this.oController.updateGroupHeaders();

        this.oController.sCurrentExpandedType = oGroupToDelete.Id;
        await this.oController.getNextBufferForType();

        var aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");

        assert.equal(aGroups.length, 2, "2 groups expected before execute action");
        assert.equal(aGroups[0].GroupHeaderText, "You have 2 leave requests requiring your attention", "The first group in the model is changed to the Purches group");
        assert.equal(aGroups[0].aNotifications.length, 2, "2 notifications expected before execute action");

        oDeferred.reject({
            succededNotifications: ["005056b4-24bc-1ee7-85aa-1d95eca91de2"],
            failedNotifications: ["005056b4-24bc-1ee7-85aa-1d95eca8fde2"]
        });

        this.oNotificationsService.getNotificationsBufferInGroup.resolves([aNotificationsBuffer[0]]);

        await this.oController.executeBulkAction(this.sActionName, this.sActionext, oGroupToDelete, this.sPath);

        assert.strictEqual(this.oExecuteBulkActionStub.callCount, 1, "executeBulkAction service call was done");
        aGroups = this.oController.getView().getModel().getProperty("/notificationsByTypeDescending");
        assert.equal(aGroups.length, 2, "2 groups expected since the group was not deleted from Model");
        assert.equal(aGroups[0].aNotifications.length, 1, "now the 1st group should contain 1 notification");
        assert.equal(aGroups[0].aNotifications[0].Id, "005056b4-24bc-1ee7-85aa-1d95eca8fde2", "the failed notification should remain");
    });

    QUnit.module("Select Tab Flow", {
        beforeEach: function () {
            return beforeEach.call(this)
                .then(function () {
                    this.oEventData = {
                        key: "sapUshellNotificationIconTabByDate",
                        item: {
                            $: function () {
                                return {
                                    attr: function () { }
                                };
                            }
                        }
                    };

                    // stub sap.ui.require and Fragment to allow a minimal setTimeout
                    this.oRequireStub = sandbox.stub(sap.ui, "require");
                    this.oRequireStub.withArgs(["sap/ui/core/Fragment"]).callsArgWith(1, {
                        load: sandbox.stub().resolves()
                    });
                    this.oRequireStub.callThrough();
                }.bind(this));
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("empty tabs - select by prio", function (assert) {
        var fnDone = assert.async();
        var oIconTabBar = this.oView.getContent()[0];
        sandbox.stub(this.oController, "getItemsFromModel").returns(new Array(0));
        var oUpdateNotificationsStub = sandbox.stub(this.oController, "updateNotifications");

        // First select (click on tab) ByDate -> Switch to ByPrio
        oIconTabBar.fireSelect(this.oEventData);
        setTimeout(function () {
            this.oEventData.key = "sapUshellNotificationIconTabByPrio";
            oIconTabBar.fireSelect(this.oEventData);
            setTimeout(function () {
                assert.strictEqual(this.oController.sCurrentSorting, this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING,
                    "Select ByPriority descending, currentSorting is set correctly");
                assert.strictEqual(oUpdateNotificationsStub.callCount, 1, "The function updateNotifications has been called once.");
                fnDone();
            }.bind(this), 0);
        }.bind(this), 0);
    });

    QUnit.test("tabs with content - select by prio", function (assert) {
        var fnDone = assert.async();
        var oDateList = this.oController.getNotificationList(this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING);
        var oIconTabBar = this.oView.getContent()[0];
        sandbox.stub(this.oController, "getItemsFromModel").returns(new Array(30));
        var oGetNextBufferStub = sandbox.stub(this.oController, "getNextBuffer").returns();
        var oBindItemsStub = sandbox.stub(oDateList, "bindItems").returns();
        this.oEventData.key = "sapUshellNotificationIconTabByPrio";

        oIconTabBar.fireSelect(this.oEventData);
        setTimeout(function () {
            assert.strictEqual(this.oController.sCurrentSorting, this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING,
                "Select ByPriority descending, currentSorting is set correctly");
            assert.strictEqual(oBindItemsStub.callCount, 0, "oBindItemsStub NOT called for moving from ByDate tab to ByPriority tab");
            assert.strictEqual(oGetNextBufferStub.callCount, 0, "GetNextBuffer not called because the tab already has content");

            fnDone();
        }.bind(this), 0);
    });

    QUnit.module("getNumberOfItemsInScreen", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Returns number of items", function (assert) {
        var oGetNumberOfItemsInScreenStub = sandbox.stub(this.oController, "getNumberOfItemsInScreen").returns(5);
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnScroll(), 15, "5 Items in the screen -> Buffer size is 15");
        oGetNumberOfItemsInScreenStub.restore();

        oGetNumberOfItemsInScreenStub = sandbox.stub(this.oController, "getNumberOfItemsInScreen").returns(2);
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnScroll(), 15, "2 Items in the screen -> Minimum buffer size is 15");
        oGetNumberOfItemsInScreenStub.restore();

        var oGetItemsFromModelStub = sandbox.stub(this.oController, "getItemsFromModel").returns(new Array(500));
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnScroll(), 0, "There are already 500 items, buffer is 0");
        oGetItemsFromModelStub.restore();

        oGetItemsFromModelStub = sandbox.stub(this.oController, "getItemsFromModel").returns(new Array(390));
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnScroll(), 10, "There are already 390 items, buffer is 10");
    });

    QUnit.module("getNumberOfItemsToFetchOnUpdate", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Returns number of items", function (assert) {
        sandbox.stub(this.oController, "getBasicBufferSize").returns(20);

        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnUpdate(0), 20, "0 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 20");
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnUpdate(10), 20, "10 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 20");
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnUpdate(42), 60, "42 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 60");
        this.oController.iMaxNotificationItemsForDevice = 100;
        assert.strictEqual(this.oController.getNumberOfItemsToFetchOnUpdate(90), 100, "90 items in model and bufferSize is 20 -> getNumberOfItemsToFetchOnUpdate returns 100");
    });

    QUnit.module("addBufferToModel", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Adds buffer to model", function (assert) {
        var aModelItemsAfterMerge,
            bInUpdateFlag;
        sandbox.stub(this.oController, "getItemsFromModel").returns(aResultArray1);
        this.oController.getView().getModel().setProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate", true);

        this.oController.addBufferToModel(this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING, aResultArray2);

        aModelItemsAfterMerge = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/aNotifications");
        assert.strictEqual(aModelItemsAfterMerge.length, 10, "After addBufferToModel there are 4 + 6 items in the NOTIFICATIONS_BY_PRIORITY_DESCENDING path");
        bInUpdateFlag = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate");
        assert.strictEqual(bInUpdateFlag, false, "After addBufferToModel, the inUpdate flag has the value false");
    });

    QUnit.module("getNextBuffer", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Fetches Buffer", async function (assert) {
        var oGetItemsFromModelStub = sandbox.stub(this.oController, "getItemsFromModel").returns([]);
        var oSetPropertyStub = sandbox.stub(this.oController.getView().getModel(), "setProperty").returns();
        var oGetNumberOfItemsToFetchOnScrollStub = sandbox.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35);

        this.oGetNotificationsBufferBySortingTypeStub.resetHistory();
        this.oGetNotificationsBufferBySortingTypeStub.resolves(aResultArray1);

        this._getNotificationSettingsAvailability = sandbox.stub(this.oNotificationsService, "_getNotificationSettingsAvailability").resolves();

        this.oController.addBufferToModel = sandbox.spy();
        this.oController.addBusyIndicatorToTabFilter = sandbox.spy();
        this.oController.removeBusyIndicatorToTabFilter = sandbox.spy();
        this.oController.sCurrentSorting = this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING;
        await this.oController.getNextBuffer();

        assert.strictEqual(oSetPropertyStub.callCount, 1, "SetPropertyStub called once");
        var sExpectedPath = "/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate";
        assert.strictEqual(oSetPropertyStub.args[0][0], sExpectedPath, "SetPropertyStub called for setting the value of bInUpdate");
        assert.strictEqual(oSetPropertyStub.args[0][1], true, "SetPropertyStub called for setting the value true of bInUpdate");

        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.callCount, 1, "GetNotificationsBufferBySortingType called once");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[0][0], this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING,
            "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[0][1], 0, "GetNotificationsBufferBySortingType called with numberOfItemsInModel = 0");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[0][2], 35, "GetNotificationsBufferBySortingType called with correct required number of items, = 35");

        assert.strictEqual(this.oUserSettingInitialization.calledOnce, true, "SetPropertyStub called once (during view controller initialization)");

        oGetItemsFromModelStub.resetHistory();
        oGetNumberOfItemsToFetchOnScrollStub.resetHistory();
        oGetItemsFromModelStub.returns(aResultArray2);

        await this.oController.getNextBuffer(this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING);

        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.callCount, 2, "GetNotificationsBufferBySortingType called for the 2nd time");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[1][0], this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING,
            "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[1][1], 6, "GetNotificationsBufferBySortingType called witn nomberOfItemsInModel = 6");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[1][2], 35, "GetNotificationsBufferBySortingType called witn correct required number of items, = 35");
    });

    QUnit.test("Updates Notifications Settings", async function (assert) {
        var oGetItemsFromModelStub = sandbox.stub(this.oController, "getItemsFromModel").returns([]);
        var oSetPropertyStub = sandbox.stub(this.oController.getView().getModel(), "setProperty").returns();
        var oGetNumberOfItemsToFetchOnScrollStub = sandbox.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35);

        this.oGetNotificationsBufferBySortingTypeStub.resetHistory();
        this.oGetNotificationsBufferBySortingTypeStub.resolves(aResultArray1);

        this._getNotificationSettingsAvailability = sandbox.stub(this.oNotificationsService, "_getNotificationSettingsAvailability").returns(new jQuery.Deferred().promise());

        this.oController.addBufferToModel = sandbox.spy();
        this.oController.addBusyIndicatorToTabFilter = sandbox.spy();
        this.oController.removeBusyIndicatorToTabFilter = sandbox.spy();
        this.oController.sCurrentSorting = this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING;
        await this.oController.getNextBuffer();

        assert.strictEqual(oSetPropertyStub.callCount, 1, "SetPropertyStub called once");
        var sExpectedPath = "/" + this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING + "/inUpdate";
        assert.strictEqual(oSetPropertyStub.args[0][0], sExpectedPath, "SetPropertyStub called for setting the value of bInUpdate");
        assert.strictEqual(oSetPropertyStub.args[0][1], true, "SetPropertyStub called for setting the value true of bInUpdate");

        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.callCount, 1, "GetNotificationsBufferBySortingType called once");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[0][0], this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING,
            "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[0][1], 0, "GetNotificationsBufferBySortingType called with numberOfItemsInModel = 0");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[0][2], 35, "GetNotificationsBufferBySortingType called with correct required number of items, = 35");

        assert.strictEqual(this.oUserSettingInitialization.callCount, 2, "_userSettingInitialization called twice (one of them is the view controller initialization)");

        oGetItemsFromModelStub.restore();
        oGetNumberOfItemsToFetchOnScrollStub.restore();

        oGetItemsFromModelStub = sandbox.stub(this.oController, "getItemsFromModel").returns(aResultArray2);
        oGetNumberOfItemsToFetchOnScrollStub = sandbox.stub(this.oController, "getNumberOfItemsToFetchOnScroll").returns(35);

        await this.oController.getNextBuffer(this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING);

        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.callCount, 2, "GetNotificationsBufferBySortingType called for the 2nd time");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.callCount, 2, "GetNotificationsBufferBySortingType called for the 2nd time");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[1][0], this.oController.oSortingType.NOTIFICATIONS_BY_PRIORITY_DESCENDING,
            "GetNotificationsBufferBySortingType called with correct sorting type");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[1][1], 6, "GetNotificationsBufferBySortingType called with numberOfItemsInModel = 6");
        assert.strictEqual(this.oGetNotificationsBufferBySortingTypeStub.args[1][2], 35, "GetNotificationsBufferBySortingType called with correct required number of items, = 35");
    });

    QUnit.module("onListItemPress", {
        beforeEach: function (assert) {
            var done = assert.async();
            return beforeEach.call(this)
                .then(function () {
                    sandbox.stub(this.oController, "markRead");
                    done();
                }.bind(this));
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    /**
     * Verify that launching a navigation action from a Notification object results in a correct call to CrossApplicationNavigation service
     * including the business parameters
     */
    QUnit.test("Navigate on Notification launch", async function (assert) {
        var aNotifications = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
        sandbox.stub(hasher, "getHash").callsFake(function () {
            return "X-Y";
        });
        var aExpectedArguments = [
            "PurchaseOrder",
            "DisplayObject",
            [
                {
                    Key: "PurchaseOrderId",
                    NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                    Value: "236400"
                },
                {
                    Key: "PurchaseOrderVendor",
                    NotificationId: "00505692-409C-1EE5-ABDA-8F15E3E3B020",
                    Value: "PARTNER_137"
                }
            ]
        ];

        await this.oController.onListItemPress(
            aNotifications[0].Id,
            aNotifications[0].NavigationTargetObject,
            aNotifications[0].NavigationTargetAction,
            aNotifications[0].NavigationTargetParams
        );

        assert.strictEqual(this.oToExternalStub.callCount, 1, "CAN.toExternal was called once");
        var oCall = this.oToExternalStub.getCall(0);
        assert.deepEqual(oCall && oCall.args || {}, aExpectedArguments, "navigated to the correct target");
    });

    QUnit.module("markRead", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Handles read", async function (assert) {
        var aNotifications = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
        assert.equal(aNotifications[0].IsRead, false, "the 1st notification in the array is not read");
        assert.equal(aNotifications[1].IsRead, true, "the 2nd notification in the array is not read");
        assert.equal(aNotifications[2].IsRead, false, "the 3rd notification in the array is  read");

        await this.oController.markRead(aNotifications[0].Id); // mark as read the first one

        assert.equal(this.oMarkReadStub.callCount, 1, "service markRead should call once");
        assert.equal(aNotifications[0].IsRead, true, "the 1st notification in the array should be read");

        await this.oController.markRead(aNotifications[2].Id); // mark as read the third one

        assert.equal(this.oMarkReadStub.callCount, 2, "service markRead should call twice");
        assert.equal(aNotifications[2].IsRead, true, "the 3rd notification in the array should stay read");
    });

    QUnit.test("Error handling", async function (assert) {
        var sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020";
        var getNotificationFromModel = function (sId) {
            var aNotifications = this.oController.getView().getModel().getProperty("/" + this.oController.oSortingType.NOTIFICATIONS_BY_DATE_DESCENDING + "/aNotifications");
            return aNotifications.filter(function (item) {
                return item.Id === sId;
            })[0];
        }.bind(this);
        this.oMarkReadStub.rejects();

        await this.oController.markRead(sId);

        assert.strictEqual(this.oMarkReadStub.callCount, 1, "markRead service call was done");
        assert.ok(!getNotificationFromModel(sId).IsRead, "notification marked as unread in model after fail");
    });

    QUnit.module("dismissNotification", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Handles error", async function (assert) {
        const sId = "00505692-409C-1EE5-ABDA-8F15E3E3B020";
        this.oDismissNotificationStub.rejects();

        await this.oController.dismissNotification(sId);

        assert.strictEqual(this.oDismissNotificationStub.callCount, 1, "dismissNotification service call was done");
        assert.strictEqual(this.oErrorStub.callCount, 1, "MessageService.error was done");
    });

    QUnit.module("filterDismisssedItems", {
        beforeEach: function () {
            return beforeEach.call(this);
        },
        afterEach: function () {
            afterEach.call(this);
        }
    });

    QUnit.test("Dismissed items are filtered out when dismissed items exist", function (assert) {
        var aFitered = this.oNotificationsService.filterDismisssedItems(
            [{ originalItemId: "01" }, { originalItemId: "02" }],
            ["01"]
        );
        assert.deepEqual(aFitered, [{ originalItemId: "02" }], "filtered array with 1 item");
    });
}
);
