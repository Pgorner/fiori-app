// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This component wraps the FLP sandbox and handles the life cycle for the test execution. It allows
 * OPA5 to execute the FLP as component rather than running it in an iFrame. This speeds up the test
 * execution as the UI core need not to be started again for each test.
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/opa/bootstrap/bootstrapFlp"
], function (UIComponent, BootstrapFLP) {
    "use strict";
    return UIComponent.extend("sap.ushell.opa.flpSandbox.Component", {
        /**
         * The component is initialized by OPA5 automatically during the startup of each test and calls the init method once.
         *
         * @override
         *
         * @private
         * @since 1.76.0
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oComponentData = this.getComponentData() || {};
            BootstrapFLP.init(oComponentData.adapter, oComponentData.defaultConfig, oComponentData.ushellConfig);
        },
        /**
         * Place the sandbox in the rendered div by the component
         *
         * @private
         * @since 1.76.0
         */
        onAfterRendering: function () {
            var sUIAreaId = this.getId() + "-uiarea";
            if (!document.getElementById(sUIAreaId)) {
                var div = document.createElement("div");
                div.setAttribute("id", sUIAreaId);
                this.getUIArea().getRootNode().appendChild(div);
            }

            BootstrapFLP.placeAt(sUIAreaId);
        },
        /**
         * The component is destroyed by OPA5 automatically.
         *
         * @override
         *
         * @private
         * @since 1.76.0
         */
        exit: function () {
            BootstrapFLP.exit();
        }
    });
});
