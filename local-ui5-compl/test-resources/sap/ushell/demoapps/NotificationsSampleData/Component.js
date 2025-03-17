// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/util/MockServer",
    "sap/base/util/LoaderExtensions",
    "sap/ushell/Container"
], function (Component, MockServer, LoaderExtensions, Container) {
    "use strict";

    // Adapt dates to be relative to the current time and date
    function adaptDates (aItems) {
        if (!aItems) {
            return;
        }
        aItems.forEach(function (oItem, index) {
            var d = new Date();
            if (index < 2) {
                d.setHours(d.getHours() - 1);
            } else if (index < 4) {
                d.setHours(d.getHours() - 2);
            } else if (index < 6) {
                d.setHours(d.getHours() - 25);
            } else if (index < 8) {
                d.setHours(d.getHours() - 49);
            } else {
                d.setHours(d.getHours() - 73);
            }
            oItem.CreatedAt = d.toISOString();
        });
    }

    return Component.extend("sap.ushell.demo.NotificationsSampleData.Component", {
        metadata: {
            version: "1.132.1",
            library: "sap.ushell.demo.NotificationsSampleData"
        },

        escapeRegExp: function (str) {
            return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
        },

        init: function () {
            //used for mock the request to the server
            var modelPath = "/ushell/test-resources/sap/ushell/demoapps/NotificationsSampleData/model";
            var notificationsPath = modelPath + "/Notifications";
            //used to load static resources from test folder
            var sResourcePath = "../../../../../test-resources/sap/ushell/demoapps/NotificationsSampleData/model";
            var notificationsByDateDesc = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_Notifications.json" });
            var notificationsPriority = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_Notifications_Priority_Desc.json" });
            var notificationsByType = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_Notifications_By_Type.json" });
            var notificationsByParentId = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_Notifications_By_ParentId.json" });
            var channelEmail = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_Channel_Email.json" });
            var channelSMP = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_Channel_SMP.json" });
            var notificationTypePersonalizationSet = LoaderExtensions.loadResource({ dataType: "json", url: sResourcePath + "/NS_NotificationTypePersonalizationSet.json" });

            adaptDates(notificationsByDateDesc.value);

            var oMockServer = new MockServer({
                requests: [{
                    method: "GET",
                    path: new RegExp(this.escapeRegExp(notificationsPath +
                        "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt%20desc&$filter=IsGroupHeader%20eq%20false") + ".*"),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, notificationsByDateDesc);
                    }
                }, {
                    method: "GET",
                    path: new RegExp(this.escapeRegExp(notificationsPath + "?$expand=Actions,NavigationTargetParams&$orderby=Priority%20desc&$filter=IsGroupHeader%20eq%20false") + ".*"),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, notificationsPriority);
                    }
                }, {
                    method: "GET",
                    path: new RegExp(this.escapeRegExp(notificationsPath + "?$expand=Actions,NavigationTargetParams&$filter=IsGroupHeader%20eq%20true")),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, notificationsByType);
                    }
                }, {
                    method: "GET",
                    path: new RegExp(this.escapeRegExp(notificationsPath +
                        "?$expand=Actions,NavigationTargetParams&$orderby=CreatedAt") +
                        ".*6fd8.*" +
                        ".*"
                    ),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, notificationsByParentId);
                    }
                }, {
                    method: "GET",
                    path: new RegExp(modelPath + "/GetBadgeNumber().*"),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, { d: { GetBadgeNumber: { Number: 10 } } });
                    }
                }, {
                    method: "POST",
                    path: new RegExp(modelPath + "/ResetBadgeNumber.*"),
                    response: function (xhr) {
                        xhr.respondJSON(204, {}, "");
                    }
                }, {
                    method: "POST",
                    path: new RegExp(modelPath + "/Dismiss.*"),
                    response: function (xhr) {
                        xhr.respondJSON(204, {}, "");
                    }
                }, {
                    method: "POST",
                    path: new RegExp(modelPath + "/MarkRead.*"),
                    response: function (xhr) {
                        xhr.respondJSON(204, {}, "");
                    }
                }, {
                    method: "POST",
                    path: new RegExp(modelPath + "/ExecuteAction.*"),
                    response: function (xhr) {
                        xhr.respondJSON(204, {}, "");
                    }
                }, {
                    method: "GET",
                    path: new RegExp(modelPath + "/Channels\\(ChannelId='SAP_SMP'\\).*"),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, channelSMP);
                    }
                }, {
                    method: "GET",
                    path: new RegExp(modelPath + "/Channels\\(ChannelId='SAP_EMAIL'\\).*"),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, channelEmail);
                    }
                }, {
                    method: "GET",
                    path: new RegExp(modelPath + "/NotificationTypePersonalizationSet.*"),
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, notificationTypePersonalizationSet);
                    }
                }]
            });

            oMockServer.start();

            Container.getServiceAsync("NotificationsV2").then(function (oNotificationsService) {
                oNotificationsService._setWorkingMode();
            });

        }

    });
});
