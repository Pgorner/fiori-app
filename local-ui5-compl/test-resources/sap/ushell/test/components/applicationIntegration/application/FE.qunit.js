// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

QUnit.config.testTimeout = 400000;

/**
 * @fileOverview QUnit tests for behaviour of stateful container
 */
sap.ui.define([
    "sap/ushell/test/components/applicationIntegration/application/IframeUtils"
], function (
    IframeUtils
) {
    "use strict";

    /* global QUnit */

    var oFlpIframe;

    QUnit.module("test", {
        beforeEach: function () {
            oFlpIframe = IframeUtils.createIframe("sap/ushell/shells/demo/FioriLaunchpadIsolation.html#Shell-home");
            IframeUtils.appendToQunitFixture(oFlpIframe);
        }
    });

    QUnit.test("check use of same iframe for two apps", async function (assert) {
        IframeUtils.setHash(oFlpIframe, "#Shell-home");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".sapUshellDashboardPage");

        IframeUtils.setHash(oFlpIframe, "#FE1-iframe");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".sapUiCompSmartTable", "#application-FE1-iframe");

        assert.ok(true);
    });
});
