// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/extend",
    "sap/base/util/isPlainObject",
    "sap/ui/base/EventProvider",
    "sap/ui/core/service/Service",
    "sap/ui/thirdparty/hasher",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/utils",
    "sap/ushell/utils/UrlParsing"
], (
    Log,
    extend,
    isPlainObject,
    EventProvider,
    Service,
    hasher,
    Config,
    EventHub,
    ushellResources,
    AppConfiguration,
    ShellModel,
    StateManager,
    ushellUtils,
    UrlParsing
) => {
    "use strict";

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;
    const {
        Default,
        Embedded
    } = ShellMode;

    const sBackNavigationChangedEvent = "backNavigationChanged";
    const sServiceDestroyedEvent = "serviceDestroyed";

    /**
     * @typedef {object} sap.ushell.ui5service.ShellUIService.AppInfo
     * Defines essential information about an app.
     *
     * Example:
     * <pre>
     * {
     *      title: "App 1",
     *      icon: "sap-icon://folder",
     *      subtitle: "go to app 1",
     *      intent: "#Action-toapp1"
     * }
     * </pre>
     * @property {string} title The title of the app.
     * @property {string} icon The icon src representing the app.
     * @property {string} [subtitle] An optional subtitle of the app.
     * @property {string} intent The navigation intent of the app.
     *
     * @since 1.120.0
     * @public
     */


    /**
     * @alias sap.ushell.ui5service.ShellUIService
     * @class
     * @classdesc The ShellUIService for the unified shell can be used to modify the app title or the app hierarchy.
     *
     * <h3>Usage</h3>
     *
     * Allows apps to interact with the SAP Fiori launchpad UI.
     * A defined service is injected in the app components by the FLP before the corresponding apps start.
     * To consume the service, app components should declare it in their "manifest.json" as follows:
     *
     * <pre>
     * {
     *    ...
     *    "sap.ui5": {
     *       "services" : {
     *          "ShellUIService": {
     *              "factoryName": "sap.ushell.ui5service.ShellUIService"
     *          }
     *       }
     *    }
     *    ...
     * }
     * </pre>
     *
     * The service can then be retrieved and consumed by the app component as in the following example:
     *
     * <pre>
     * // Component.js (the app component)
     * ...
     * this.getService("ShellUIService") // promise is returned
     *     .then(function (oService) {
     *         oService.setTitle("Application Title");
     *     })
     *     .catch(function (oError) {
     *         Log.error("Cannot get ShellUIService", oError, "my.app.Component");
     *     });
     * ...
     * </pre>
     *
     * The ShellUIService can also be used within nested components. Every component receives a separate
     * instance of the service. All service instances are independent and do not share any state. With this
     * they can also overwrite each other's settings. Nested components have to define the service in their
     * own manifest as well.
     *
     * <strong>Note:</strong> The ShellUIService is intended for use by the active app only. Calls from other types of
     * components (e.g. plugins) or inactive components (e.g. from a hidden app) are ignored.
     *
     * <h3>Auto Title and Hierarchy</h3>
     *
     * The ShellUIService can work together with the routing defined in a UI5 app to set title and hierarchy
     * automatically, as the navigation within the app occurs. This can be achieved by enabling the
     * ShellUIService to load instantly and configuring one or both <code>setTitle</code> and
     * <code>setHierarchy</code> options to <code>auto</code> in the app manifest. Using this mechanism
     * disables the API to manually set the title or hierarchy via <code>setTitle</code> and <code>setHierarchy</code>.
     *
     * <pre>
     * {
     *    "sap.ui5": {
     *       "services" : {
     *          "ShellUIService": {
     *              "lazy": false,
     *              "factoryName": "sap.ushell.ui5service.ShellUIService",
     *              "settings": {
     *                  "setHierarchy": "auto",
     *                  "setTitle": "auto"
     *              }
     *          }
     *       }
     *    }
     * }
     * </pre>
     *
     * <strong>Note:</strong> Please be aware that the sapFiori2Adaptation configuration of the application may
     * cause the ShellUIService service to work incorrectly.  We recommend to disable the sapFiori2Adaptation
     * configuration for the new applications if you use the ShellUIService.
     *
     * @param {object} oCallerContext
     *   The context in which the service was instantiated. Must have the
     *   format:
     * <pre>
     * {
     *   scopeType: "component",
     *   scopeObject: [a UI5 Component in the sap.ushell package]
     * }
     * </pre>
     *
     * @hideconstructor
     * @extends sap.ui.core.service.Service
     *
     * @since 1.38.0
     * @public
     */
    const ShellUIService = Service.extend("sap.ushell.ui5service.ShellUIService", /** @lends sap.ushell.ui5service.ShellUIService.prototype */ {

        /**
         * Constructs a new instance of the ShellUIService.
         *
         * @since 1.128.0
         * @private
         */
        constructor: function () {
            Service.apply(this, arguments);
            this._oEventProvider = new EventProvider();

            this._bIsActive = true;
            this._bDestroyed = false;
            this._bInitialized = false;

            this._sLastTitle = null;
            this._aLastHierarchy = null;
            this._aLastRelatedApps = null;
            this._fnLastBackNavigation = null;

            this._bEnableAutoTitle = false;
            this._bEnableAutoHierarchy = false;
        },

        /**
         * Initializes the service.
         * Only updates title, hierarchy, and related apps if they are not set yet.
         * @param {boolean} [bSkipInitialValues=false] Whether to skip setting initial values.
         *
         * @since 1.128.0
         * @private
         */
        initService: function (bSkipInitialValues) {
            if (!bSkipInitialValues) {
                if (!this._sLastTitle) {
                    const sHash = hasher.getHash() || "";
                    if (sHash.startsWith("Shell-startIntent")) {
                        this.setTitle("", true);
                    } else {
                        this.setTitle();
                    }
                }

                if (!this._aLastHierarchy) {
                    this.setHierarchy();
                }
                if (!this._aLastRelatedApps) {
                    this.setRelatedApps();
                }
                if (!this._fnLastBackNavigation) {
                    this.setBackNavigation();
                }
            }

            const oAppComponent = this.getContext().scopeObject;
            if (this._shouldEnableAutoHierarchy(oAppComponent)) {
                this._enableAutoHierarchy(oAppComponent);
            }
            if (this._shouldEnableAutoTitle(oAppComponent)) {
                this._enableAutoTitle(oAppComponent);
            }

            this._bInitialized = true;
        },

        /**
         * Resets the service to its initial state.
         * Should only be called for the global instance.
         *
         * @since 1.128.0
         * @private
         */
        resetService: function () {
            this._sLastTitle = null;
            this._aLastHierarchy = null;
            this._aLastRelatedApps = null;
            this._fnLastBackNavigation = null;

            this._bInitialized = false;
        },

        /**
         * Validates whether the service call is allowed.
         * @returns {boolean} Whether the service call is allowed.
         *
         * @since 1.128.0
         * @private
         */
        _isCallAllowed: function () {
            if (this._bDestroyed) {
                Log.error("The ShellUIService has been destroyed and cannot be used anymore.", null, "sap.ushell.ui5service.ShellUIService");
                return false;
            }
            if (!this._bIsActive) {
                Log.warning("The ShellUIService is currently inactive and calls will be ignored.", null, "sap.ushell.ui5service.ShellUIService");
                return false;
            }
            return true;
        },

        /**
         * Displays the given hierarchy in the shell header.
         * The default app hierarchy is applied if no parameter is given.
         *
         * @param {sap.ushell.ui5service.ShellUIService.AppInfo[]} [aHierarchyLevels]
         *    An array representing hierarchies of the currently displayed app.
         * @throws {Error} If the service was requested with <code>"setHierarchy": "auto"</code> option.
         *
         *
         * @since 1.38.0
         * @public
         */
        setHierarchy: function (aHierarchyLevels) {
            this._preventOverrideOfAutoHierarchy();

            if (!this._isCallAllowed()) {
                return;
            }

            if (typeof aHierarchyLevels !== "undefined") {
                this._ensureArrayOfObjectOfStrings(aHierarchyLevels, "setHierarchy");
            }

            this._changeHierarchy(aHierarchyLevels);
        },

        /**
         * Displays the given title in the shell header. This method should not
         * be called - and will be without effect - if the app calling the method is not currently displayed
         * in the Fiori launchpad.
         *
         * @param {string} [sTitle] The new title. The default title is set if this argument is not given.
         * @throws {Error} If the service was requested with <code>"setTitle": "auto"</code> option.
         *
         * @since 1.38.0
         * @public
         */
        setTitle: function (sTitle) {
            this._preventOverrideOfAutoTitle();

            if (!this._isCallAllowed()) {
                return;
            }

            if (typeof sTitle !== "undefined" && typeof sTitle !== "string") {
                throw new Error("'setTitle' was called with invalid arguments. The parameter should be a string");
            }

            let bAcceptEmptyString = false;
            if (typeof arguments[1] === "boolean" && arguments[1]) {
                bAcceptEmptyString = true;
            }
            this._changeTitle(sTitle, bAcceptEmptyString);
        },

        /**
         * Displays the back button in the shell header.
         *
         * @param {function} [fnCallback] A callback function called when the button is clicked in the UI.
         *
         * @since 1.38.0
         * @private
         * @ui5-restricted sap.fe, sap.suite.ui.generic
         */
        setBackNavigation: function (fnCallback) {
            if (!this._isCallAllowed()) {
                return;
            }

            if (typeof fnCallback !== "undefined" && typeof fnCallback !== "function") {
                throw new Error("'setBackNavigation' was called with invalid arguments. The parameter should be a function");
            }

            const oComponent = this.getContext().scopeObject;

            this._oEventProvider.fireEvent(sBackNavigationChangedEvent, {
                data: fnCallback,
                component: oComponent
            });

            this._fnLastBackNavigation = fnCallback;
        },

        /**
         * Returns the current title shown in the header.
         * This might differ from the title set by the via {@link #setTitle}.
         *
         * @returns {string} The current title.
         *
         * @since 1.38.0
         * @public
         */
        getTitle: function () {
            if (!this._isCallAllowed()) {
                return;
            }

            return ShellModel.getModel().getProperty("/application/title");
        },

        /**
         * Used by apps to set related apps.  This setting is propagated
         * towards the Shell Header via corresponding events.
         *
         * @param {sap.ushell.ui5service.ShellUIService.AppInfo[]} [aRelatedApps] An array of related apps.
         *
         * @since 1.40.0
         * @public
         */
        setRelatedApps: function (aRelatedApps) {
            if (!this._isCallAllowed()) {
                return;
            }

            if (typeof aRelatedApps !== "undefined") {
                this._ensureArrayOfObjectOfStrings(aRelatedApps, "setRelatedApps");
            }

            this._changeRelatedApps(aRelatedApps);
        },

        /**
         * Attaches event handlers to the backNavigationChanged event.
         * @param {object} oData An object that will be passed to the handler along with the event object when the event is fired
         * @param {function} fnHandler The handler function to call when the event occurs.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.128.0
         * @private
         */
        attachBackNavigationChanged: function (...args) {
            this._oEventProvider.attachEvent(sBackNavigationChangedEvent, ...args);
        },

        /**
         * Detaches event handlers to the backNavigationChanged event.
         * @param {function} fnHandler The handler function.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.128.0
         * @private
         */
        detachBackNavigationChanged: function (...args) {
            this._oEventProvider.detachEvent(sBackNavigationChangedEvent, ...args);
        },

        /**
         * Attaches event handlers to the serviceDestroyed event.
         * @param {object} oData An object that will be passed to the handler along with the event object when the event is fired
         * @param {function} fnHandler The handler function to call when the event occurs.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.128.0
         * @private
         */
        attachServiceDestroyed: function (...args) {
            this._oEventProvider.attachEvent(sServiceDestroyedEvent, ...args);
        },

        /**
         * Detaches event handlers to the serviceDestroyed event.
         * @param {function} fnHandler The handler function.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.128.0
         * @private
         */
        detachServiceDestroyed: function (...args) {
            this._oEventProvider.detachEvent(sServiceDestroyedEvent, ...args);
        },

        /**
         * Callback function for the hierarchy change event.
         * This method is called when the hierarchy changes.
         * @param {sap.ushell.ui5service.ShellUIService.AppInfo[]} aHierarchy The new hierarchy.
         *
         * @since 1.128.0
         * @private
         */
        _changeHierarchy: function (aHierarchy) {
            let aExtendedHierarchy = [];

            if (!aHierarchy) {
                aHierarchy = [];
            }
            // we take the default value and save it with the data received
            const oHierarchyDefaultValue = this._getHierarchyDefaultValue();
            // we have to copy the passed array and its objects to prevent direct properties access.
            aHierarchy.forEach((oItem, index) => {
                aExtendedHierarchy[index] = extend({}, oItem);
            });
            aExtendedHierarchy = aExtendedHierarchy.concat(oHierarchyDefaultValue);

            if (StateManager.isLegacyHome()) {
                StateManager.updateBaseStates([LaunchpadState.Home], "application.hierarchy", Operation.Set, aExtendedHierarchy);
            }
            StateManager.updateCurrentState("application.hierarchy", Operation.Set, aExtendedHierarchy);

            // store for easier debugging
            this._aLastHierarchy = aExtendedHierarchy;
        },

        /**
         * Callback function for the related apps change event.
         * This method is called when the related apps change.
         * @param {sap.ushell.ui5service.ShellUIService.AppInfo[]} aRelatedApps The related apps.
         *
         * @since 1.128.0
         * @private
         */
        _changeRelatedApps: function (aRelatedApps) {
            if (!aRelatedApps) {
                aRelatedApps = [];
            }

            if (StateManager.isLegacyHome()) {
                StateManager.updateBaseStates([LaunchpadState.Home], "application.relatedApps", Operation.Set, aRelatedApps);
            }
            StateManager.updateCurrentState("application.relatedApps", Operation.Set, aRelatedApps);

            // store for easier debugging
            this._aLastRelatedApps = aRelatedApps;
        },

        /**
         * Callback function for the title change event.
         * This method is called when the title changes.
         * @param {string} sTitle The new title.
         * @param {boolean} bAcceptEmptyString Whether an empty string is accepted as a valid title.
         *
         * @since 1.128.0
         * @private
         */
        _changeTitle: function (sTitle, bAcceptEmptyString) {
            if (!sTitle && !bAcceptEmptyString) {
                sTitle = this._getTitleDefaultValue();
            }

            if (StateManager.isLegacyHome()) {
                StateManager.updateBaseStates([LaunchpadState.Home], "application.title", Operation.Set, sTitle);
            }
            StateManager.updateCurrentState("application.title", Operation.Set, sTitle);

            ushellUtils.setPerformanceMark("FLP -- title change");
            EventHub.emit("TitleChanged", sTitle);

            this._sLastTitle = sTitle;
        },

        /**
         * @returns {string} The default title derived from the manifest
         *
         * @since 1.128.0
         * @private
         */
        _getTitleDefaultValue: function () {
            let sTitle = "";
            const oAppMetadata = AppConfiguration.getMetadata();
            if (oAppMetadata && oAppMetadata.title) {
                sTitle = oAppMetadata.title;
            }
            return sTitle;
        },

        /**
         * @returns {sap.ushell.ui5service.ShellUIService.AppInfo[]} The default hierarchy derived from the configuration
         *
         * @since 1.128.0
         * @private
         */
        _getHierarchyDefaultValue: function () {
            const aHierarchy = [];
            const sRootIntent = Config.last("/core/shellHeader/rootIntent");
            const sCurrentLaunchpadState = StateManager.getLaunchpadState();
            const sCurrentShellMode = StateManager.getShellMode();

            // if we navigate for a page with state == app add home to it
            if (sCurrentLaunchpadState === LaunchpadState.App && [Default, Embedded].includes(sCurrentShellMode)) {
                // add home entry to hierarchy
                aHierarchy.push({
                    icon: "sap-icon://home",
                    title: ushellResources.i18n.getText("actionHomePage"),
                    // Intent is set to root directly to avoid multiple hash changes.
                    intent: sRootIntent ? `#${sRootIntent}` : "#"
                });

                // In spaces mode, additionally add the origin page as a step into the hierarchy.
                // The page info is set in PageRuntime.controller as custom data of the root control there during navigation to the page.
                // AppLifeCycle gets data from the root control in the attachBeforeNavigate listener of the AppLifeCycle service, when an app is opened from a space/page.
                // Then the AppLifeCycle service extends the application object.
                // Here, we access data from the application object.
                const oTitles = Config.last("/core/spaces/currentSpaceAndPage");
                if (oTitles !== undefined) {
                    aHierarchy.splice(0, 0, { // insert at 0 index because the hierarchy is shown as stack
                        icon: "sap-icon://space-navigation",
                        title: oTitles.pageTitle,
                        subtitle: oTitles.pageTitle !== oTitles.spaceTitle ? oTitles.spaceTitle : undefined, // Do not show the same string twice if space name is the same as page name
                        intent: `#${oTitles.hash}`
                    });
                }
            }
            return aHierarchy;
        },

        /**
         * Determines whether the hierarchy should be set automatically
         * using the UI5 router for the given App component.
         *
         * @param {object} oAppComponent The UI5 App root component.
         * @returns {boolean} Whether the hierarchy should be set automatically in the given app component.
         *
         * @since 1.44.0
         * @private
         */
        _shouldEnableAutoHierarchy: function (oAppComponent) {
            if (typeof oAppComponent.getManifestEntry !== "function") {
                return false;
            }

            const sSetHierarchyManifestSetting = oAppComponent.getManifestEntry("/sap.ui5/services/ShellUIService/settings/setHierarchy");

            return sSetHierarchyManifestSetting === "auto";
        },

        /**
         * Enables automatic <code>setHierarchy</code> calls based on
         * UI5 Router on the given app component.
         * @param {object} oAppComponent The UI5 root app component with a router.
         *
         * @since 1.44.0
         * @private
         */
        _enableAutoHierarchy: function (oAppComponent) {
            const oRouter = oAppComponent.getRouter && oAppComponent.getRouter();
            if (!oRouter) {
                Log.error(
                    "Could not enable automatic setHierarchy on the current app",
                    "Router could not be obtained on the app root component via getRouter",
                    "sap.ushell.ui5service.ShellUIService"
                );
                return;
            }

            this._bEnableAutoHierarchy = true;

            oRouter.attachTitleChanged(function (oEvent) {
                const aHistory = oEvent.getParameter("history");
                const sShellHash = this._getCurrentShellHashWithoutAppRoute();

                const aNewHierarchy = aHistory.reverse().map((oUi5HierarchyItem) => {
                    return {
                        title: oUi5HierarchyItem.title,
                        intent: `${sShellHash}&/${oUi5HierarchyItem.hash}`
                    };
                });
                this._bSkipAutoHierarchyCheck = true;
                this.setHierarchy(aNewHierarchy);
            }, this);
        },

        /**
         * Throws an error if the setHierarchy is called manually during autoHierarchy mode.
         * The check is based on the <code>_bSkipAutoHierarchyCheck</code> flag.
         *
         * @since 1.129.0
         * @private
         */
        _preventOverrideOfAutoHierarchy: function () {
            // Do not block calls during initService
            if (!this._bInitialized) {
                return;
            }

            if (this._bSkipAutoHierarchyCheck) {
                this._bSkipAutoHierarchyCheck = false;
                return;
            }

            const bAutoHierarchyEnabled = this._shouldEnableAutoHierarchy(this.getContext().scopeObject);
            if (bAutoHierarchyEnabled) {
                throw new Error("Cannot set hierarchy manually - Auto hierarchy is enabled");
            }
        },

        /**
         * Determines whether the title should be set automatically using the
         * UI5 router for the given App component.
         *
         * @param {object} oAppComponent The UI5 App root component.
         * @returns {boolean} Whether the title should be set automatically in the given app component.
         *
         * @since 1.44.0
         * @private
         */
        _shouldEnableAutoTitle: function (oAppComponent) {
            if (typeof oAppComponent.getManifestEntry !== "function") {
                return false;
            }

            const sSetTitleManifestSetting = oAppComponent.getManifestEntry("/sap.ui5/services/ShellUIService/settings/setTitle");

            return sSetTitleManifestSetting === "auto";
        },

        /**
         * Enables automatic <code>setTitle</code> calls based on
         * UI5 Router on the given app component.
         * @param {object} oAppComponent The UI5 root app component with a router.
         *
         * @since 1.44.0
         * @private
         */
        _enableAutoTitle: function (oAppComponent) {
            const oRouter = oAppComponent.getRouter && oAppComponent.getRouter();
            if (!oRouter) {
                Log.error(
                    "Could not enable automatic setTitle on the current app",
                    "Router could not be obtained on the app root component via getRouter",
                    "sap.ushell.ui5service.ShellUIService"
                );
                return;
            }

            this._bEnableAutoTitle = true;

            // set the initial title
            const oTitleHistory = oRouter.getTitleHistory()[0];
            if (oTitleHistory && oTitleHistory.title) {
                setTimeout(() => {
                    this._bSkipAutoTitleCheck = true;
                    this.setTitle(oTitleHistory.title);
                }, 0);
            }

            oRouter.attachTitleChanged(function (oEvent) {
                // set title after navigation
                const sTitle = oEvent.getParameter("title");
                this._bSkipAutoTitleCheck = true;
                this.setTitle(sTitle);
            }, this);
        },

        /**
         * Throws an error if the setTitle is called manually during autoTitle mode.
         * The check is based on the <code>_bSkipAutoTitleCheck</code> flag.
         *
         * @since 1.129.0
         * @private
         */
        _preventOverrideOfAutoTitle: function () {
            // Do not block calls during initService
            if (!this._bInitialized) {
                return;
            }

            if (this._bSkipAutoTitleCheck) {
                this._bSkipAutoTitleCheck = false;
                return;
            }

            const bAutoTitleEnabled = this._shouldEnableAutoTitle(this.getContext().scopeObject);
            if (bAutoTitleEnabled) {
                throw new Error("Cannot set title manually - Auto title is enabled");
            }
        },

        /**
         * Helper function that returns the Hash part of the current URL
         * without the inner app hash part.
         * @returns {string} The intent (i.e., URL hash) without any inner app hash part.
         *
         * @since 1.44.0
         * @private
         */
        _getCurrentShellHashWithoutAppRoute: function () {
            const sFullURL = `#${hasher.getHash()}`;
            const sURLHashWithParams = UrlParsing.getShellHash(sFullURL);

            if (!sURLHashWithParams) {
                Log.error(
                    "Cannot get the current shell hash",
                    `UrlParsing service returned a falsy value for ${sFullURL}`,
                    "sap.ushell.ui5service.ShellUIService"
                );
                return "";
            }

            return `#${sURLHashWithParams}`;
        },

        /**
         * Ensures that the given argument is an array of object, having all string values.
         * This method logs an error message in case this is not the case.
         *
         * <pre>
         * IMPORTANT: this method must not rely on its context when called or
         * produce side effects.
         * </pre>
         *
         * @param {variant} vArg Any value.
         * @param {string} sMethodName The name of the method that called this function.
         * @throws When argument is not an array of objects with string values.
         *
         * @since 1.38.0
         * @private
         */
        _ensureArrayOfObjectOfStrings: function (vArg, sMethodName) {
            const bIsValid = Array.isArray(vArg) && vArg.every((oObject) => {
                return isPlainObject(oObject)
                    && Object.keys(oObject).length > 0
                    && Object.keys(oObject).every((sKey) => {
                        return typeof oObject[sKey] === "string";
                    });
            });

            if (!bIsValid) {
                throw new Error(`'${sMethodName}' was called with invalid parameters. An array of non-empty objects with string values is expected`);
            }
        },

        /**
         * Sets the service to either being active or inactive
         * @param {string} bIsActiveService Whether the current instance of the service is active.
         *
         * @since 1.128.0
         * @private
         */
        setActive: function (bIsActiveService) {
            this._bIsActive = bIsActiveService;
        },

        /**
         * Getter for the active state of the service
         * @returns {string} Whether the current instance of the service is active.
         *
         * @since 1.128.0
         * @private
         */
        getActive: function () {
            return this._bIsActive;
        },

        /**
         * Lifecycle method to clean up the service.
         *
         * @since 1.128.0
         * @private
         */
        exit: function () {
            this._oEventProvider.fireEvent(sServiceDestroyedEvent);
            this._oEventProvider.destroy();
            this._bDestroyed = true;
        }
    });

    return ShellUIService;
});
