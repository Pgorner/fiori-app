// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The SupportTicket adapter for the ABAP platform.
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/isEmptyObject",
    "sap/base/util/ObjectPath",
    "sap/ushell/utils",
    "sap/ushell_abap/pbServices/ui2/ODataWrapper",
    "sap/ushell_abap/pbServices/ui2/ODataService",
    "sap/ushell/Container"
], function(
    isEmptyObject,
    ObjectPath,
    utils,
    ODataWrapper,
    ODataService,
    Container
) {
    "use strict";

    return function (/*oSystem*/) {
        /**
         * Convert the clientContext JSON into a human-readable form
         *
         * @param {JSON} oJson object containing details about context
         * @returns {string} Human-readable representation of the JSON object
         * @since 1.19.1
         * @private
         */
        function convertToReadable (oJson) {
            var sConvertedJson;

            if (oJson && !isEmptyObject(oJson)) {
                sConvertedJson = JSON.stringify(oJson);
                return sConvertedJson
                    .replace(/\{|\}|\\n|,/g, "\n");
            }
            return "";
        }

        /**
         * Creates a support ticket in the backend system.
         *
         * @param {object} oSupportTicketData containing the input fields required for the support ticket.
         *
         * @returns {Promise} Promise
         *
         * @since 1.19.1
         * @private
         */
        this.createTicket = function (oSupportTicketData) {
            var sBaseUrl = "/sap/opu/odata/UI2/INTEROP/";
            var sRelativeUrl = "Messages";
            var oContainer = Container;
            var sUrl,
                sHash,
                sCatalogId,
                oDataWrapper;

            // text is mandatory for ABAP backend OData service
            if (!oSupportTicketData.text) {
                throw new utils.Error("Support Ticket data does not contain text member");
            }

            sUrl = ObjectPath.get("clientContext.navigationData.applicationInformation.url", oSupportTicketData);
            sHash = ObjectPath.get("clientContext.navigationData.navigationHash", oSupportTicketData);
            sCatalogId = ObjectPath.get("clientContext.navigationData.tileDebugInfo", oSupportTicketData);

            sUrl = typeof sUrl === "string" ? sUrl : "";
            sHash = typeof sHash === "string" ? sHash : "";
            sCatalogId = typeof sCatalogId === "string" && sCatalogId.length > 0 ? JSON.parse(sCatalogId).catalogId || "" : "";

            //Remove whitespaces from both sides of the string
            oSupportTicketData.text = oSupportTicketData.text.trim();
            oSupportTicketData.subject = oSupportTicketData.subject.trim();

            if (oSupportTicketData.subject.length > 40) {
                oSupportTicketData.text = oSupportTicketData.subject + "\n" + oSupportTicketData.text;
                oSupportTicketData.subject = oSupportTicketData.subject.substring(0, 40).slice(0, -3) + "...";
            }
            oSupportTicketData.url = sUrl;
            oSupportTicketData.catalogId = sCatalogId;
            oSupportTicketData.hash = sHash;
            oSupportTicketData.clientContext = convertToReadable(oSupportTicketData.clientContext);

            var oPromise = new Promise(function (fnResolve, fnReject) {
                var oODataWrapperSettings = {
                    baseUrl: sBaseUrl,
                    "sap-language": oContainer.getUser().getLanguage(),
                    "sap-client": oContainer.getLogonSystem().getClient()
                };
                oDataWrapper = ODataWrapper.createODataWrapper(oODataWrapperSettings);
                ODataService.call(this, oDataWrapper, function () {
                    return false;
                });

                oDataWrapper.create(sRelativeUrl, oSupportTicketData, function (response) {
                    fnResolve(response.messageNumber);
                }, function (sErrorMessage) {
                    fnReject(sErrorMessage);
                });
            }.bind(this));

            return oPromise;
        };
    };
});
