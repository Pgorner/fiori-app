// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview The SAPUI5 component of SAP's Fiori sandbox renderer for the Unified Shell.
 *
 * @version 1.132.1
 */
/**
 * @namespace Namespace for SAP's Fiori sandbox renderer for the Unified Shell. The renderer consists
 * of an SAPUI5 component called <code>sap.ushell.renderers.sandbox.Renderer</code>.
 *
 * @name sap.ushell.renderers.fiorisandbox
 * @see sap.ushell.renderers.fiorisandbox.Renderer
 * @since 1.15.0
 * @private
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/library",
    "sap/ui/core/mvc/View",
    "sap/ui/core/UIComponent",
    "sap/ushell/services/ShellNavigationInternal"
], function (Log, coreLibrary, View, UIComponent, ShellNavigationInternal) {
    "use strict";

    var ViewType = coreLibrary.mvc.ViewType;
    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>
     * sap.ushell.Container.createRenderer("sap.ushell.renderers.fiorisandbox.Renderer")
     * </code>.
     *
     * @class The SAPUI5 component of the Fiori sandbox renderer for the Unified Shell.
     *
     * @extends sap.ui.core.UIComponent
     * @name sap.ushell.renderers.fiorisandbox.Renderer
     * @see sap.ushell.services.Container#createRenderer
     * @since 1.15.0
     */
    return UIComponent.extend("sap.ushell.renderers.fiorisandbox.Renderer", {
        metadata: {
            version: "1.132.1",
            dependencies: {
                version: "1.132.1",
                libs: ["sap.ui.core"],
                components: []
            },
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },
        // eslint-disable-next-line valid-jsdoc
        /**
         * *TODO*
         *
         * @returns *TODO*
         *
         * @memberof sap.ushell.renderers.fiorisandbox.Renderer#
         * @name createContent
         * @since 1.15.0
         *
         * @private
         */
        createContent: function () {
            var oComponentData = this.getComponentData();
            if (oComponentData && oComponentData.async) {
                return View.create({
                    type: ViewType.XML,
                    viewName: "sap.ushell.renderers.fiorisandbox.Shell",
                    viewData: oComponentData
                });
            }
            let oSyncView;
            /**
             * @deprecated since 1.120
             */
            (function () {
                Log.error("sap/ushell/renderer/fiorisandbox/Renderer must be created asynchronously! Please set async:true in the component data.");
                oSyncView = sap.ui.view({ // LEGACY API (deprecated)
                    type: ViewType.XML,
                    viewName: "sap.ushell.renderers.fiorisandbox.Shell",
                    viewData: oComponentData
                });
            })();
            return oSyncView;
        }
    });

});
