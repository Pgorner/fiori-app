sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";

    // All the arrangements for all Opa tests are defined here
    var CommonArrangements = Opa5.extend("sap.ovp.test.integrations.pages.CommonArrangements", {
        iStartMyApp: function (sApp) {
            // start without debug parameter, loads much faster
            this.iStartMyAppInAFrame("test-resources/sap/ovp/integrations/flpSandbox.html#" + sApp);
            return this.waitFor({
                autoWait: true,
                timeout: 100,
                errorMessage: "Could not load application",
            });
        },
        iStartInsightsEnabledApp: function (sMode) {
            this.iStartMyAppInAFrame("test-resources/sap/ovp/integrations/flpSandbox.html?mode=" + sMode + "#procurement-overview");
            return this.waitFor({
                autoWait: true,
                timeout: 100,
                errorMessage: "Could not load application",
            });
        },
        iStartLazyRenderedApp: function (sApp) {
            this.iStartMyAppInAFrame("test-resources/sap/ovp/integrations/flpSandbox.html?sap-fe-xx-lazyloadingtest=true#" + sApp);
            return this.waitFor({
                autoWait: true,
                timeout: 100,
                errorMessage: "Could not load application",
            });
        },
        iStartAppInKeepAliveMode: function (sApp) {
            this.iStartMyAppInAFrame("test-resources/sap/ovp/integrations/flpSandbox.html?sap-keep-alive=true#" + sApp);
            return this.waitFor({
                autoWait: true,
                timeout: 100,
                errorMessage: "Could not load application",
            });
        },
        iTeardownMyApp: function () {
            return this.iTeardownMyAppFrame();
        },
    });

    return CommonArrangements;
});
