// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview Shell Navigation Service.
 * @version 1.132.1
 * @deprecated since 1.120. Use {@link sap.ushell.services.Navigation} for Navigation instead.
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/Container"
], function (Log, Container) {
    "use strict";

    /**
     * @alias sap.ushell.services.ShellNavigation
     * @class
     * @classdesc The Unified Shell's internal navigation service (platform independent).
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const ShellNavigation = await Container.getServiceAsync("ShellNavigation");
     *     // do something with the ShellNavigation service
     *   });
     * </pre>
     *
     * This interface is for consumption by shell renderers/containers only
     *
     * It is not for direct usage by applications, see
     *   inner app navigation : UI5 interfaces (hashChanger, Router)
     *   cross app navigation : @see sap.ushell.services.CrossApplicationNavigation
     *
     * Usage:
     *
     * Example: see renders/fiorisandbox/Shell.controller.js
     *
     *   <pre>
     *   sap.ui.define([
     *      "sap/ushell/services/ShellNavigation"
     *   ], function (ShellNavigation) {
     *       Shell.onHashChange(shellHash,appHash) {  / *resolve url, load app and exchange root view* / }
     *       Shell.init() {
     *         this.privShellNavigator = new ShellNavigation();
     *         this.privShellNavigator.init(jQuery.proxy(this.doHashChange, this));
     *       }
     *   });
     *   </pre>
     *
     * Note: further app specific integration via the reference app reuse code (setting of app specific handler)
     *
     * Note: the ShellNavigation service replaces the UI5 core HashChanger which abstracts from the browser url modification.
     *
     * It performs the following services:
     *   - encoding of the actual browser url hash ( via hasher.js).
     *   - expansion of "shortened" urls ( AppParameterParts) via invocation.
     *   - splitting of shellHash and AppSpecific hash and abstraction w.r.t. Eventing
     *
     * Thus it is crucial to use appropriate interfaces and not directly invoke window.location.hash.
     *
     * - internal construction methods for a "current" App specific and non-app specific hash
     *   (invoked by CrossApplicationNavigation), not to be invoked directly!
     *
     * @param {object} oContainerInterface interface
     * @param {string} sParameters parameters
     * @param {object} oServiceConfiguration configuration
     *
     * @hideconstructor
     *
     * @since 1.15.0
     * @public
     * @deprecated since 1.120. Use {@link sap.ushell.services.Navigation} for Navigation instead.
     */
    function ShellNavigation (oContainerInterface, sParameters, oServiceConfiguration) {
        Log.error("Deprecated service call. Please migrate any dependencies to this service.", null, "sap.ushell.services.ShellNavigation");

        // The internal variant service and this one might be used in parallel.
        // This might lead to issues due to mismatching internal states. Therefore we proxy
        // the public/protected calls to the internal service.
        this._oShellNavigationInternal = Container.getService("ShellNavigationInternal");

        /**
         * The navigation filter statuses that should be returned by a navigation filter
         *
         * Continue - continue with the navigation flow
         * Abandon - stop the navigation flow, and revert to the previous hash state
         * Custom - stop the navigation flow, but leave the hash state as is. The filter should use this status
         *   to provide alternative navigation handling
         *
         * @see sap.ushell.services.ShellNavigation#registerNavigationFilter
         * @private
         * @ui5-restricted sap.ui.fl
         */
        this.NavigationFilterStatus = this._oShellNavigationInternal.NavigationFilterStatus;

        /**
         * Required for appruntime
         * @private
         */
        this.hashChanger = this._oShellNavigationInternal.hashChanger;
    }

    /**
     * Returns the current navigation context.
     *
     * @returns {object}
     *   An object like:
     *   <pre>
     *   {
     *      "status": sap.ushell.NavigationState.Navigating,
     *      "isCrossAppNavigation": true,
     *      "innerAppRoute": "employee/overview"
     *   }
     *   </pre>
     *
     *   This object can be used inside dirty flag providers to take
     *   corresponding actions.
     *
     * @protected
     */
    ShellNavigation.prototype.getNavigationContext = function () {
        return this._oShellNavigationInternal.getNavigationContext();
    };

    /**
     * compact the parameter object, if required a number of parameters will be removed, instead a corresponding
     * "sap-intent-param" containing a key of an appstate representing the removed parameters will be inserted
     *
     * @param {object} oParams A parameter object
     * @param {Array<*>} [aRetainedParameters] An array of string value of parameters which shall not be compacted
     *   The array may contains a *-terminated string, which will match and strings with the same prefix
     *   ( e.g. "sap-*" will match "sap-ushell", "sap-wd", "sap-" etc. )
     * @param {object} [oComponent] optional, a SAP UI5 Component
     * @param {boolean} [bTransient] whether an transient appstate is sufficient
     * @returns {Promise} a promise, whose first argument of resolve is
     *
     * @protected
     */
    ShellNavigation.prototype.compactParams = function (oParams, aRetainedParameters, oComponent, bTransient) {
        return this._oShellNavigationInternal.compactParams(oParams, aRetainedParameters, oComponent, bTransient);
    };

    // Lifecycle methods

    /**
     * Initializes ShellNavigation
     *
     * This function should be used by a custom renderer in order to implement custom navigation.
     * Do not use this function for developing Fiori applications.
     *
     * This method should be invoked by the Shell in order to:
     *   - Register the event listener
     *   - Register the container callback for the (currently single) ShellHash changes.
     *
     * Signature of the callback function
     *   sShellHashPart,  // The hash part on the URL that is resolved and used for application loading
     *   sAppSpecificPart // Typically ignored
     *   sOldShellHashPart, // The old shell hash part, if exist
     *   sOldAppSpecificPart, // The old app hash part, if exist
     *
     * @param {function} fnShellCallback The callback method for hash changes
     * @returns {this} Reference to <code>this</code> for method chaining.
     *
     * @public
     */
    ShellNavigation.prototype.init = function (fnShellCallback) {
        return this._oShellNavigationInternal.init(fnShellCallback);
    };

    /**
     * Returns true if the history entry was replaced immediately after the last navigation.
     * To be useful, this method should be called immediately after the hash enters the URL
     * but before the target application is finally navigated to.
     *
     * This method should not be used externally.
     * It's reserved uniquely for internal shell consumption and its signature or result might change at any time.
     *
     * @returns {boolean} Whether <code>hasher#replaceHash</code> was called after the last navigation.
     *
     * @protected
     */
    ShellNavigation.prototype.wasHistoryEntryReplaced = function () {
        return this._oShellNavigationInternal.wasHistoryEntryReplaced();
    };

    /**
     * Resets the internal flag used to track whether the last navigation is made via hasher#setHash or hasher#replaceHash.
     * This method should be called after a navigation is successfully made to a target application to avoid returning
     * an inconsistent answer when calling <code>#wasHistoryEntryReplaced</code>.
     * An inconsistent answer might occur when a navigation is made via forward/back button without
     * passing via <code>hasher#replaceHash</code> or <code>hasher#setHash</code>.
     *
     * This method should not be used externally.
     * It's reserved uniquely for internal shell consumption and its signature or result might change at any time.
     *
     * @protected
     */
    ShellNavigation.prototype.resetHistoryEntryReplaced = function () {
        this._oShellNavigationInternal.resetHistoryEntryReplaced();
    };

    /**
     * Rewrite the hash fragment identifier without triggering any navigation at
     *
     * @param {string} sNewHash new hash fragment
     *
     * @protected
     */
    ShellNavigation.prototype.replaceHashWithoutNavigation = function (sNewHash) {
        this._oShellNavigationInternal.replaceHashWithoutNavigation(sNewHash);
    };

    /**
     * Register the navigation filter callback function.
     * A navigation filter provides plugins with the ability to intervene in the navigation flow,
     * and optionally to stop the navigation.
     *
     * The callback has to return {@link sap.ushell.services.ShellNavigationInternal.NavigationFilterStatus}
     *
     * Use <code>Function.prototype.bind()</code> to determine the callback's <code>this</code> or some of its arguments.
     *
     * @param {object} fnFilter navigation filter function
     *
     * @see sap.ushell.services.ShellNavigation#registerNavigationFilter
     * @private
     * @ui5-restricted sap.ui.fl
     */
    ShellNavigation.prototype.registerNavigationFilter = function (fnFilter) {
        this._oShellNavigationInternal.registerNavigationFilter(fnFilter);
    };

    /**
     * Unregister a previously registered navigation filter
     *
     * The callback has to return {@link sap.ushell.services.ShellNavigationInternal.NavigationFilterStatus}
     *
     * Note the same filter function that was registered should be passed as a parameter to this method.
     *
     * @param {object} fnFilter navigation filter function
     *
     * @see sap.ushell.services.ShellNavigation#registerNavigationFilter
     * @private
     * @ui5-restricted sap.ui.fl
     */
    ShellNavigation.prototype.unregisterNavigationFilter = function (fnFilter) {
        this._oShellNavigationInternal.unregisterNavigationFilter(fnFilter);
    };

    ShellNavigation.hasNoAdapter = true;
    return ShellNavigation;
}, true /* bExport */);
