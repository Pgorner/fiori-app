// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The EndUserFeedback service.
 * @deprecated since 1.93
 */
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/base/util/ObjectPath"
], function (URI, ObjectPath) {
    "use strict";

    /**
     * @alias sap.ushell.services.EndUserFeedback
     * @class
     * @classdesc The Unified Shell's end user feedback service. This service is deprecated and does nothing.
     * End user feedback functionality is not part of the ushell library.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const EndUserFeedback = await Container.getServiceAsync("EndUserFeedback");
     *     // do something with the EndUserFeedback service
     *   });
     * </pre>
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @see sap.ushell.Container#getServiceAsync
     * @since 1.25.1
     * @public
     * @deprecated since 1.93
     */
    function EndUserFeedback () {
        /**
         * Sends a feedback.
         * @returns {Promise} Empty promise
         *
         * @since 1.25.1
         * @public
         * @deprecated since 1.93
         */
        this.sendFeedback = function () {
            return Promise.resolve();
        };

        /**
         * @returns {string} Empty string
         *
         * @since 1.25.1
         * @public
         * @deprecated since 1.93
         */
        this.getLegalText = function () {
            return "";
        };

        /**
         * The service is deprecated. The function always returns a negative answer.
         *
         * @returns {Promise} Rejected promise.
         *
         * @since 1.25.1
         * @public
         * @deprecated since 1.93
         */
        this.isEnabled = function () {
            return Promise.reject();
        };

        /**
         * @param {string} sURL sURL
         * @returns {string} Path of the given URL (based on URI-API)
         * @private
         * @since 1.30.0
         * @deprecated since 1.93
         */
        this.getPathOfURL = function (sURL) {
            var oURI = new URI(sURL);
            return oURI.pathname();
        };
    }

    EndUserFeedback.hasNoAdapter = true;
    return EndUserFeedback;
}, true /* bExport */);
