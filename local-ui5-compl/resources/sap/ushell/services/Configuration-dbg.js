// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's Configuration service enables Components of any kind to consume parts of Configuration
 * provided by the shell. It allows to attach on updates and receive the current values
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/Config",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (Config, jQuery, Container) {
    "use strict";

    /**
     * @alias sap.ushell.services.Configuration
     * @class
     * @classdesc The unified shell's Configuration service.
     * Allows attaching to <b>selected</b> launchpad configuration settings and their value changes.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call {@link sap.ushell.Container#getServiceAsync}.
     * <pre>
     *   sap.ui.require(["sap/ushell/Container"], async function (Container) {
     *     const Configuration = await Container.getServiceAsync("Configuration");
     *     // do something with the Configuration service
     *   });
     * </pre>
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.64.0
     * @public
     */
    function Configuration () {
        /**
         * Allows to attach to any value change of the sizeBehavior configuration for homepage parts
         * (smaller tile size) which is needed to implement custom tiles reacting on this setting.
         * The returned value can directly be used in {@link sap.m.GenericTile#sizeBehavior}.
         *
         * Once attached, <code>fnCallback</code> will be called once initially for the <b>current value</b>
         * and afterwards every time the value changed.
         *
         * Please ensure to detach from the registry by calling <code>.detach</code> on the returned object
         * e.g. in the destroy function of your component or controller! Make sure that you do not attach
         * twice with the same function as otherwise a detach cannot be performed later!
         *
         * Example usage:
         * <pre>
         * var oEventRegistry;
         *
         * // the callback that is called whenever the property changes
         * var fnCallback = function (sSizeBehavior) {
         *     // do something with sSizeBehavior like setting it on a
         *     // sap.m.GenericTile via model and data binding!
         * };
         *
         *
         * // retrieve service via getServiceAsync API
         * sap.ushell.Container.getServiceAsync("Configuration").then( function (oService) {
         *     // keep the returned event registry in order to detach upon destroy of your context
         *     oEventRegistry = oService.attachSizeBehaviorUpdate(fnCallback);
         * });
         *
         * // detach later when your context is destroyed (e.g. destroy of the controller)
         * oEventRegistry.detach();
         * </pre>
         *
         * @param {function} fnCallback The function to be called once the property changes. It receives
         *   a parameter of type {@link sap.m.TileSizeBehavior}.
         *
         * @returns {{ detach: function }} detach handler - call detach() to detach from further updates
         *
         * @public
         */
        this.attachSizeBehaviorUpdate = function (fnCallback) {
            var oDoable = Config.on("/core/home/sizeBehavior");
            oDoable.do(fnCallback);
            return {
                detach: oDoable.off
            };
        };

        /**
         * Get the systems list of the site in cFLP.
         * This api should be used by the EP team only in cFLP in order to check whether there is an EP system
         * in the site.
         *
         * @returns {Promise} a promise that is resolved with the site system aliases list
         *
         * @since 1.81.0
         * @private
         */
        this.getAppsSystems = function () {
            var oDeferred = new jQuery.Deferred();

            Container.getServiceAsync("CommonDataModel").then(function (cdmService) {
                cdmService.getSiteWithoutPersonalization().done(function (oSite) {
                    var oAppsSystems;

                    oAppsSystems = (oSite && oSite.systemAliases && JSON.parse(JSON.stringify(oSite.systemAliases))) || {};
                    oDeferred.resolve(oAppsSystems);
                }).catch(function () {
                    oDeferred.resolve({});
                });
            }).catch(function () {
                oDeferred.resolve({});
            });

            return oDeferred.promise();
        };
    }

    Configuration.hasNoAdapter = true;
    return Configuration;
}, true /* bExport*/);
