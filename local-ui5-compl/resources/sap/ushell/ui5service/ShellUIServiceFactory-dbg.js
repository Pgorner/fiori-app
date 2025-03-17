// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The ShellUIService UI5 service factory
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/util/Deferred",
    "sap/ui/base/EventProvider",
    "sap/ui/core/Component",
    "sap/ui/core/service/ServiceFactory",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/ui5service/ShellUIService",
    "sap/ushell/utils"
  ], (
    Deferred,
    EventProvider,
    Component,
    ServiceFactory,
    Container,
    EventHub,
    ShellUIService,
    ushellUtils
) => {
    "use strict";

    const sBackNavigationChanged = "backNavigationChanged";

    /**
     * @alias sap.ushell.ui5service.ShellUIServiceFactory
     * @namespace
     * @description Factory for creating instances of ShellUIService.
     * The factory should be retrieved directly via {@link sap.ui.core.service.ServiceFactoryRegistry#get}.
     *
     * @hideconstructor
     * @extends sap.ui.core.service.ServiceFactory
     *
     * @since 1.129.0
     * @private
     * @ui5-restricted sap.suite.ui.generic
     */
    const ShellUIServiceFactory = ServiceFactory.extend("sap.ushell.ui5service.ShellUIServiceFactory", /** @lends sap.ushell.ui5service.ShellUIServiceFactory.prototype */ {

        /**
         * Overwrites the default implementation of constructor of ServiceFactory
         * to initialize the map to store the instances of ShellUIService and
         * to store the current application instance and the root intent.
         *
         * @since 1.129.0
         * @private
         */
        constructor: function () {
            ServiceFactory.apply(this, arguments);

            this._mServiceInstances = new Map();
            this._oGlobalServiceInstance = null;
            this._oCurrentApplication = null;
            this._oEventProvider = new EventProvider();
            this._aDoables = [];
        },

        /**
         * Initializes the AppLifeCycle ushell service and attaches the necessary event handlers to handle service resolving
         * and deletion. The functions are attached as handlers.
         *
         * @returns {Promise} A promise that resolves when factory is initialized.
         *
         * @since 1.129.0
         * @private
        */
        init: async function () {
            this._AppLifeCycle = await Container.getServiceAsync("AppLifeCycle");

            this._AppLifeCycle.attachAppLoaded(this._handleAppOpened, this);

            const oDoable = EventHub.on("reloadCurrentApp").do(this._handleReloadCurrentApp.bind(this));
            this._aDoables.push(oDoable);

            // pre create global service
            await this.createInstanceInternal();
        },

        /**
         * Handles the initial values (title, relatedApps and hierarchy) for the current application
         *
         * @since 1.129.0
         * @private
         */
        _setInitialAppValues: function () {
            if (this._oCurrentApplication?.componentInstance) {
                const oEntry = this._mServiceInstances.get(this._oCurrentApplication.componentInstance.getId());

                if (oEntry?.instance) {
                    // no init requires already handled by app specific service
                    return;
                }
            }

            if (ushellUtils.isFlpHomeIntent()) {
                return;
            }

            // set the current application as the scopeObject
            this._oGlobalServiceInstance.getContext().scopeObject = this._oCurrentApplication.componentInstance || {};
            // reset title, relatedApps and hierarchy
            this._oGlobalServiceInstance.initService();
        },

        /**
         * Handles the app opened event.
         * Resolves the deferred promise of the service instance if the current application is the same as the scopeObject
         * @param {sap.ui.base.Event} oEvent The event object
         *
         * @since 1.129.0
         * @private
         */
        _handleAppOpened: function (oEvent) {
            this._oCurrentApplication = oEvent.getParameters();

            // deactivate all services and activate the one for the current application
            this._setServiceActive(null);

            if (this._oCurrentApplication?.componentInstance) {
                const oAppRootComponent = this._oCurrentApplication.componentInstance;

                this._setServiceActive(oAppRootComponent);

                this._resolveServiceInstance(oAppRootComponent);
            }

            // todo: calling this should be done by the AppLifeCycle service
            // However, the current implementation of the AppLifeCycle service
            // does not provide a easy way or point in time to do this
            this._setInitialAppValues();
        },

        /**
         * Activates the given component instance.
         * Called for keep alive apps.
         *
         * @param {object} oStorageEntry The storage entry of the component instance to be activated
         *
         * @since 1.129.0
         * @private
         */
        restore: function (oStorageEntry) {
            const oComponentInstance = oStorageEntry.app;
            if (!oComponentInstance) {
                // No UI5 app
                this._setServiceActive(null);
                return;
            }

            this._oCurrentApplication = { componentInstance: oComponentInstance };

            this._setServiceActive(this._oCurrentApplication.componentInstance);
        },

        /**
         * Handles the reload application event.
         *
         * @since 1.129.0
         * @private
         */
        _handleReloadCurrentApp: function () {
            this._oCurrentApplication = null;
        },

        /**
         * Handles the service destroyed event.
         * Removes the service from the internal map.
         * @param {object} oEvent The event object
         * @param {object} oContext The component context
         *
         * @since 1.129.0
         * @private
         */
        _handleServiceDestroyed: function (oEvent, oContext) {
            this._mServiceInstances.delete(oContext.id);
        },

        /**
         * Attaches event handlers to the backNavigationChanged event.
         * @param {object} oData An object that will be passed to the handler along with the event object when the event is fired
         * @param {function} fnHandler The handler function to call when the event occurs.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.129.0
         * @private
         */
        attachBackNavigationChanged: function (...args) {
            this._oEventProvider.attachEvent(sBackNavigationChanged, ...args);
        },

        /**
         * detaches event handlers to the backNavigationChanged event.
         * @param {function} fnHandler The handler function.
         * @param {object} oListener The data to be passed to the event handler.
         *
         * @since 1.129.0
         * @private
         */
        detachBackNavigationChanged: function (...args) {
            this._oEventProvider.detachEvent(sBackNavigationChanged, ...args);
        },

        /**
         * Handles the back navigation change event by firing the backNavigationChanged event.
         *
         * @param {sap.ui.base.Event} oEvent The event object
         *
         * @since 1.129.0
         * @private
         */
        _handleBackNavigationChanged: function (oEvent) {
            const oParameters = oEvent.getParameters();
            this._oEventProvider.fireEvent(sBackNavigationChanged, oParameters);
        },

        /**
         * Overwrites the default implementation of createInstance of ServiceFactory
         * to create a new instance of ShellUIService and attach the handlers to it.
         * The instance is then stored in a map with the scopeObject id as the key.
         * If the current application is the same as the scopeObject derived from
         * the parameter oServiceContext , the instance is resolved immediately.
         * Otherwise, the instance is resolved when the current application is loaded.
         *
         * @param {sap.ui.core.service.Service.Context} oServiceContext The context for which the service should be created
         * @returns {Promise<sap.ushell.ui5service.ShellUIService>} A promise that resolves with the ShellUIService instance
         *
         * @since 1.129.0
         * @private
         * @ui5-restricted sap.suite.ui.generic
         */
        createInstance: async function (oServiceContext) {
            if (!oServiceContext || !oServiceContext.scopeObject) {
                throw new Error("No service context provided");
            }

            const sScopeObjectId = oServiceContext.scopeObject.getId();

            /*
             * Usually the service caching is done as part of the ui5 component handling.
             * However, for Fiori2Adaptation we need to handle the caching here as well.
             */
            const oStoredEntry = this._mServiceInstances.get(sScopeObjectId);
            if (oStoredEntry) {
                return oStoredEntry.deferred.promise;
            }

            // Enhance settings object for easier debugging
            oServiceContext.settings = oServiceContext.settings || {};
            oServiceContext.settings.isGlobal = false;
            oServiceContext.settings.id = sScopeObjectId;

            const oService = new ShellUIService(oServiceContext);
            oService.attachBackNavigationChanged(this._handleBackNavigationChanged, this);
            oService.attachServiceDestroyed({ id: sScopeObjectId }, this._handleServiceDestroyed, this);

            const oEntry = {
                instance: oService,
                scopeObject: oServiceContext.scopeObject || {},
                deferred: new Deferred(),
                resolved: false
            };
            this._mServiceInstances.set(sScopeObjectId, oEntry);

            // If the current application has already been updated to the scopeObject in the appLoaded event, resolve the promise immediately
            const oAppRootComponent = this._getRootComponent(oServiceContext.scopeObject);
            if (this._isComponentActive(oAppRootComponent)) {
                this._resolveServiceInstance(oAppRootComponent);
            }

            return oEntry.deferred.promise;
        },

        /**
         * Recursively gets the root component of the given component.
         * @param {sap.ui.core.Component} oComponent The component to get the root component for.
         * @returns {sap.ui.core.Component} The root component
         *
         * @since 1.129.0
         * @private
         */
        _getRootComponent: function (oComponent) {
            if (!oComponent) {
                return null;
            }

            const oOwnerComponent = Component.getOwnerComponentFor(oComponent);
            if (!oOwnerComponent) {
                return oComponent;
            }

            // FLP Components have renderer as owner component
            if (oOwnerComponent.isA("sap.ushell.renderer.Renderer")) {
                return oComponent;
            }

            return this._getRootComponent(oOwnerComponent);
        },

        /**
         * Checks if the given component or its owner component is the active component.
         * The component has to be a "root component".
         * @param {sap.ui.core.Component} [oComponent] The component to be checked.
         * @returns {boolean} Whether the component is the active component.
         *
         * @since 1.129.0
         * @private
         */
        _isComponentActive: function (oComponent) {
            const oActiveComponent = this._oCurrentApplication?.componentInstance;

            if (!oActiveComponent || !oComponent) {
                return false;
            }

            return oComponent === oActiveComponent;
        },

        /**
         * Implementation of internal service instance creation of ServiceFactory
         * Similar to createInstance, but does not attach the handlers to the service.
         * Furthermore, the service is marked as global service, and the instance is resolved immediately.
         *
         * @returns {Promise<sap.ushell.ui5service.ShellUIService>} A promise that resolves with the ShellUIService instance
         *
         * @since 1.129.0
         * @private
         */
        createInstanceInternal: async function () {
            if (this._oGlobalServiceInstance) {
                return this._oGlobalServiceInstance;
            }

            const oGlobalServiceContext = {
                scopeObject: {
                    getId: function () {
                        return "";
                    }
                },
                scopeType: "component",
                settings: {
                    isGlobal: true // mark as global service for easier debugging
                }
            };

            this._oGlobalServiceInstance = new ShellUIService(oGlobalServiceContext);
            this._oGlobalServiceInstance.attachBackNavigationChanged(this._handleBackNavigationChanged, this);

            return this._oGlobalServiceInstance;
        },

        /**
         * Sets the related service instances as active and deactivates all other instances.
         * The global service is always active.
         * @param {sap.ui.core.Component} [oAppRootComponent] The "root component" for which the service should be active.
         *
         * @since 1.129.0
         * @private
         */
        _setServiceActive (oAppRootComponent) {
            this._mServiceInstances.forEach((oEntry) => {
                const oEntryRootComponent = this._getRootComponent(oEntry.scopeObject);

                if (!oAppRootComponent) {
                    oEntry.instance.setActive(false);
                } else if (oEntryRootComponent === oAppRootComponent) {
                    oEntry.instance.setActive(true);
                } else {
                    oEntry.instance.setActive(false);
                }
            });
        },

        /**
         * Resolves the related service instances for the given component.
         * Considers also the owner component of the given component.
         * @param {sap.ui.core.Component} [oAppRootComponent] The "root component" for which the service should be resolved.
         *
         * @since 1.129.0
         * @private
         */
        _resolveServiceInstance (oAppRootComponent) {
            if (!oAppRootComponent) {
                return;
            }

            this._mServiceInstances.forEach((oEntry) => {
                const oEntryRootComponent = this._getRootComponent(oEntry.scopeObject);
                const bRelatedEntry = oEntryRootComponent === oAppRootComponent;

                if (bRelatedEntry && !oEntry.resolved) {
                    /*
                     * Initialize values once(!!) on startup of the app
                     * Init auto handling for all services
                     */
                    const bSkipInitialValues = this._hasResolvedInstances(oAppRootComponent);
                    oEntry.instance.initService(bSkipInitialValues);

                    oEntry.resolved = true;
                    oEntry.deferred.resolve(oEntry.instance);
                }
            });
        },

        /**
         * Checks if at least one instance for the given component has been resolved.
         * @param {sap.ui.core.Component} [oAppRootComponent] The "root component" to be checked.
         * @returns {boolean} Whether at least one instance has been resolved.
         *
         * @since 1.129.0
         * @private
         */
        _hasResolvedInstances (oAppRootComponent) {
            if (!oAppRootComponent) {
                return false;
            }

            return Array.from(this._mServiceInstances.values()).some((oEntry) => {
                const oEntryRootComponent = this._getRootComponent(oEntry.scopeObject);
                const bRelatedEntry = oEntryRootComponent === oAppRootComponent;

                return bRelatedEntry && oEntry.resolved;
            });
        },

        /**
         * Destroys all instances of ShellUIService and the event provider.
         *
         * @since 1.129.0
         * @private
         */
        destroy () {
            ServiceFactory.prototype.destroy.apply(this, arguments);

            this._aDoables.forEach((oDoable) => {
                oDoable.off();
            });

            this._AppLifeCycle?.detachAppLoaded?.(this._handleAppOpened, this);

            this._mServiceInstances.forEach((oEntry) => {
                oEntry.instance.destroy();
            });

            this._oGlobalServiceInstance?.destroy?.();
            this._oEventProvider.destroy();

            this._oGlobalServiceInstance = null;
            this._mServiceInstances = null;
            this._oCurrentApplication = null;
            this._AppLifeCycle = null;
            this._aDoables = null;
        },

        /**
         * ONLY FOR TESTING!
         * Resets the ShellUIServiceFactory to its initial state.
         *
         * @since 1.129.0
         * @private
         */
        reset () {
            this.destroy();

            this._mServiceInstances = new Map();
            this._oEventProvider = new EventProvider();
            this._aDoables = [];
        }
    });

    return new ShellUIServiceFactory();
});
