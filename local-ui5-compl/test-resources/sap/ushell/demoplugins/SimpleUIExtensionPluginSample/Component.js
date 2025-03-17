// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Component",
    "sap/base/Log",
    "sap/ui/core/IconPool",
    "sap/m/MessageToast",
    "sap/ushell/Container"
], function (Component, Log, IconPool, MessageToast, Container) {
    "use strict";

    var sComponentName = "sap.ushell.demoplugins.SimpleUIExtensionPluginSample";

    return Component.extend(sComponentName + ".Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            var oRenderer = Container.getRendererInternal(),
                oPluginParameters = this.getComponentData().config,
                oShellHeaderItemProperties = {
                    id: oPluginParameters.id || null,
                    tooltip: oPluginParameters.tooltip || "",
                    ariaLabel: oPluginParameters.tooltip || "",
                    icon: IconPool.getIconURI(oPluginParameters.icon || "question-mark"),
                    press: function () {
                        MessageToast.show(oPluginParameters.message || "Default Toast Message");
                    }
                };

            if (oPluginParameters.position === "end") {
                oRenderer.addHeaderEndItem(
                    oShellHeaderItemProperties,
                    true,
                    false // visible in all states
                );
            } else if (oPluginParameters.position === "begin") {
                oRenderer.addHeaderItem(
                    oShellHeaderItemProperties,
                    true,
                    false // visible in all states
                );
            } else {
                Log.warning("Invalid 'position' parameter, must be one of <begin, end>. Defaulting to 'end'.", undefined, sComponentName);
                oRenderer.addHeaderEndItem(
                    oShellHeaderItemProperties,
                    true,
                    false // visible in all states
                );
            }
        }
    });
});
