sap.ui.define([
    "sap/ovp/app/Component",
    "sap/ui/fl/FakeLrepConnectorLocalStorage"
], function (
    OvpAppComponent,
    FakeLrepConnectorLocalStorage
) {
    "use strict";

    return OvpAppComponent.extend("saphanaoverview.Component", {
        metadata: {
            manifest: "json",
        },

        /**
         * FakeLrep - local storage
         */
        _initCompositeSupport: function () {
            FakeLrepConnectorLocalStorage.enableFakeConnector();
            OvpAppComponent.prototype._initCompositeSupport.apply(this, arguments);
        }
    });
});
