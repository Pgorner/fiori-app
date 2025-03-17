// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

if (window.localStorage) { window.localStorage.clear(); }
if (window.sessionStorage) { window.sessionStorage.clear(); }

sap.ui.define([
    "./arrangements/Setup",
    "./arrangements/Teardown",
    "sap/base/util/deepExtend",
    "sap/ui/test/Opa5",
    "sap/ui/performance/trace/Interaction"
], function (Setup, Teardown, fnDeepExtend, Opa5, Interaction) {
    "use strict";

    /* global QUnit */

    var JourneyExecutor = {};

    /**
     * Automatically loads & executes a journey when the following
     * attributes are on the "sap-ui-bootstrap" HTML script element:
     *   - data-sap-ui-oninit="module:sap/ushell/opa/JourneyExecutor"
     *   - data-sap-ui-resourceroots='{ "journey": "path/to/your/journey" }'
     *
     * To specify a custom OPA config, use the HTML attribute "data-sap-ushell-qunitConfig".
     */
    sap.ui.require(["journey"],
        function () {
            var oCustomConfig = JSON.parse(document.getElementById("sap-ui-bootstrap").getAttribute("data-sap-ushell-qunitConfig"));
            JourneyExecutor.start(oCustomConfig);
        },
        function () {
            console.warn('No "data-sap-ui-resourceroots" called "journey" was specified. '
                + 'You need to manually start the Journey by calling "JourneyExecutor.start()".');
        }
    );

    /**
     * Starts the OPA/Qunit test suite.
     * The function is used to manually start the JourneyExecutor without
     * the definition of data-sap-ui-oninit="module:sap/ushell/opa/JourneyExecutor".
     *
     * @param {object} [customConfig] Configuration object which can be set to overwrite the default OPA config.
     * @private
     * @since 1.76.0
     */
    JourneyExecutor.start = function (customConfig) {
        Opa5.getContext()._fnResolveInteraction = Interaction.notifyAsyncStep();
        var oDefaultOPAConfig = {
            arrangements: new Setup(),
            assertions: new Teardown(),
            autoWait: true,
            timeout: 120,
            asyncPolling: true
        };
        var oOPAConfig = fnDeepExtend(oDefaultOPAConfig, customConfig);
        Opa5.extendConfig(oOPAConfig);
        QUnit.start();
    };

    return JourneyExecutor;
});
