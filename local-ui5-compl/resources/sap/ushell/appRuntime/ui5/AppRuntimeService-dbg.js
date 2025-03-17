// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr"
], function (AppCommunicationMgr) {
    "use strict";

    function AppRuntimeService () {
        /**
         * Sends a message to the outer shell.
         * @returns {jQuery.Promise<any>} Resolves with the response from the outer shell.
         *
         * @private
         * @deprecated since 1.120.0
         */
        this.sendMessageToOuterShell = function (sMessageId, oParams, sRequestId, nTimeout, oDefaultVal) {
            const oDeferred = new jQuery.Deferred();
            AppCommunicationMgr.sendMessageToOuterShell(sMessageId, oParams, sRequestId, nTimeout, oDefaultVal)
                .then(oDeferred.resolve.bind(oDeferred))
                .catch(oDeferred.reject.bind(oDeferred));
            return oDeferred.promise();
        };

        //for 2.0 - returns native Promise
        this.postMessageToFLP = function (sMessageId, oParams, sRequestId, nTimeout, oDefaultVal) {
            return AppCommunicationMgr.sendMessageToOuterShell(sMessageId, oParams, sRequestId, nTimeout, oDefaultVal);
        };
    }

    return new AppRuntimeService();
});
