// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview The UsageAnalytics service.
 * @deprecated since 1.120.0. The corresponding cloud service "SAP Web Analytics" has been retired,
 *  therefore this client-side service API cannot be used any longer.
 */
sap.ui.define([
    "sap/base/Log"
], function (
    Log
) {
    "use strict";

    /**
     * @alias sap.ushell.services.UsageAnalytics
     * @class
     * @classdesc A UShell service for tracking business flows and user actions.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const UsageAnalytics = await Container.getServiceAsync("UsageAnalytics");
     *     // do something with the UsageAnalytics service
     *   });
     * </pre>
     *
     * The UsageAnalytics service exposes API for logging custom events and setting custom field values in the logged events.<br>
     * The data is sent via http and recorded on a server, whose URL is defined by the <code>baseUrl</code> service configuration property.<br>
     * The service configuration must also include the site ID from the <code>pubToken</code> attribute.<br>
     * You can find the pubToken in the code snippet provided in the WARP when creating a new site.
     *
     * Each tracked event is represented by a table entry on the server database.<br>
     * The administrator can produce reports based on the the recorded data.
     *
     * Two types of events can be logged:<br>
     *   - Automatic events: Click or pageLoad are predefined events, logged by the base tracking library.<br>
     *     You can disable these events in the service configuration.<br>
     *   - Custom events: You can use the service API to log an event with custom data using the function logCustomEvent<br>
     *
     * Each tracked event (either automatic or custom) is represented by a database row, that includes 10 custom attributes named custom1...custom10.<br>
     * Some of these values can be set using UsageAnalytics service API.<br>
     *
     * @param {object} oContainerInterface The interface provided by the container
     * @param {object} sParameter Not used in this service
     * @param {object} oServiceProperties Service configuration
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @see sap.ushell.Container#getServiceAsync
     * @since 1.32.0
     * @public
     * @deprecated since 1.120.0. The corresponding cloud service "SAP Web Analytics" has been retired,
     *  therefore this client-side service API cannot be used any longer.
     */
    function UsageAnalytics (oContainerInterface, sParameter, oServiceProperties) {

        /**
         * Service API - Begin
         */

        /**
         * Enables the renderer to set the content of the legal message..
         *
         * @since 1.32.0
         * @public
         * @deprecated since 1.120.0
         */
        this.setLegalText = function () {
            this._logDeprecationError();
        };

        /**
         * Indicates whether the service is available.<br><br>
        *
        * Since the service is deprecated and no longer supported, this method always
        * returns <code>false</code>.
        *
        * @returns {boolean} A boolean value indicating whether the UsageAnalytics service is enabled
        * @since 1.32.0
        * @public
        * @alias sap.ushell.services.UsageAnalytics#systemEnabled
        * @deprecated since 1.120.0
        */
       this.systemEnabled = function () {
            this._logDeprecationError();
            return false;
        };

        /**
         * Indicates whether the user has specified to track activities.<br><br>
        *
        * Since the service is deprecated and no longer supported, this method always
        * returns <code>false</code>.
        *
        * @returns {boolean} A boolean value indicating whether the user has specified to track activities
        * @since 1.32.0
        * @public
        * @alias sap.ushell.services.UsageAnalytics#userEnabled
        * @deprecated since 1.120.0
        */
       this.userEnabled = function () {
            this._logDeprecationError();
            return false;
        };

        /**
         * Sets up to 6 customer attributes of logged events according to the given object attributes.<br>
         * A customer attribute can be set only once during a session.<br>
         * Currently these attributes correspond to database columns custom5...custom10.
         *
         * @param {object} oCustomFieldValues An json object that includes attribute1...attribute6 (or subset)<br>
         *   with values of type string/number/boolean or a function that returns any of these types.<br>
         *   For example:<br>
         *   {<br>
         *     attribute1: "value3",<br>
         *     attribute2: function () {return "value4"},<br>
         *     attribute3: 55<br>
         *   }<br>
         *   in this example the custom field "custom5" gets the string "value3"<br>
         *   the custom field custom6 gets the function that returns the string "value4",<br>
         *   the custom field custom7 gets a string "55".<br>
         *   Any property of oCustomFieldValues which is not in the range of attribute1...attribute6 is ignored.
         *
         * @since 1.32.0
         * @public
         * @deprecated since 1.120.0
         */
        this.setCustomAttributes = function (oCustomFieldValues) {
            this._logDeprecationError();
        };

        this._logDeprecationError = function () {
            Log.error("UsageAnalytics service is deprecated, because the corresponding cloud service 'SAP Web Analytics' has been retired.", null, "sap.ushell.services.UsageAnalytics");
        };
    }

    UsageAnalytics.hasNoAdapter = true;
    return UsageAnalytics;
}, true /* bExport */);
