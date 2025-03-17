// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The app runtime wrapper for {@link sap.ushell.services.UserInfo}.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/UserInfo",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/base/util/ObjectPath"
], function (
    UserInfo,
    AppRuntimeService,
    ObjectPath
) {
    "use strict";

    /**
     * @alias sap.ushell.appRuntime.ui5.services.UserInfo
     * @class
     * @classdesc The app runtime wrapper for {@link sap.ushell.services.UserInfo}.
     *
     * @hideconstructor
     *
     * @private
     */
    function UserInfoProxy (oAdapter, oContainerInterface) {
        UserInfo.call(this, oAdapter, oContainerInterface);

        this.getThemeList = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getThemeList");
        };

        this.updateUserPreferences = function () {
            var oDeferred = new jQuery.Deferred();

            sap.ui.require(["sap/ushell/appRuntime/ui5/services/Container"], function (Container) {
                AppRuntimeService.postMessageToFLP("sap.ushell.services.UserInfo.updateUserPreferences", {
                    language: Container.getUser().getLanguage()
                }).then(oDeferred.resolve, oDeferred.reject);
            });

            return oDeferred.promise();
        };

        this.getLanguageList = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getLanguageList");
        };


        this.getShellUserInfo = function () {
            return AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getShellUserInfo");
        };
    }

    ObjectPath.set("sap.ushell.services.UserInfo", UserInfoProxy);

    UserInfoProxy.prototype = UserInfo.prototype;
    UserInfoProxy.hasNoAdapter = true;

    return UserInfoProxy;
});
