// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/services/UserDefaultParameters",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/base/util/ObjectPath"
], function (UserDefaultParameters, AppRuntimeService, ObjectPath) {
    "use strict";

    function UserDefaultParametersProxy (oAdapter, oContainerInterface) {
        UserDefaultParameters.call(this, oAdapter, oContainerInterface);

        /**
         * Stub for the getValue method of UserDefaultParameters service.
         * Note that the 'real' method expects two parameters: sParameterName and oSystemContext.
         * The system context parameter is omitted here due to legacy support.
         *
         * @param {string} sParameterName The name of the parameter to retrieve the value from.
         * @returns {Promise} A promise that resolves with the return value from the postMessage call.
         */
        this.getValue = function (sParameterName) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.UserDefaultParameters.getValue", {
                    sParameterName: sParameterName
                });
        };
    }

    ObjectPath.set("sap.ushell.services.UserDefaultParameters", UserDefaultParametersProxy);

    UserDefaultParametersProxy.prototype = UserDefaultParameters.prototype;
    UserDefaultParametersProxy.hasNoAdapter = true;

    return UserDefaultParametersProxy;
});
