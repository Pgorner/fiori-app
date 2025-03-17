sap.ui.define([
    "sap/ovp/app/Component"
], function (
    OvpAppComponent
) {
    "use strict";
    return OvpAppComponent.extend("sales.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * FakeLrep - local storage
         */
         _initCompositeSupport: function () {
            OvpAppComponent.prototype._initCompositeSupport.apply(this, arguments);
        }
    });
}, true);
