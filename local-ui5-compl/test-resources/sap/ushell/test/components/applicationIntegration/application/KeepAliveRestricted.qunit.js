// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for behaviour of restricted keep alive
 */
QUnit.config.testTimeout = 400000;

sap.ui.define([
    "sap/ushell/test/components/applicationIntegration/application/IframeUtils"
], function (
    IframeUtils
) {
    "use strict";

    /* global QUnit */

    let oFlpIframe;

    QUnit.module("test", {
        beforeEach: function () {
            oFlpIframe = IframeUtils.createIframe("sap/ushell/shells/demo/FioriLaunchpadIsolation.html#Shell-home");
            IframeUtils.appendToQunitFixture(oFlpIframe);
            IframeUtils.setConfig(oFlpIframe, {
                renderers: {
                    fiori2: {
                        componentData: {
                            config: {
                                enableSearch: false,
                                esearch: {
                                    sinaConfiguration: "sample"
                                }
                            }
                        }
                    }
                }
            });
        }
    });

    function getApplicationCount () {
        const oViewPortContainer = IframeUtils.getWithCssSelector(oFlpIframe, "#viewPortContainer");
        return Array.from(oViewPortContainer.children).filter((element) => element.id.startsWith("application-")).length;
    }

    QUnit.test("check use of same iframe for two apps", async function (assert) {
        IframeUtils.setHash(oFlpIframe, "#Shell-home");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".sapUshellVizInstance");

        IframeUtils.setHash(oFlpIframe, "#AppNotIsolated-Action?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idApplist", "#application-AppNotIsolated-Action");

        IframeUtils.setHash(oFlpIframe, "#Action-toLetterBoxing?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitChangeLetterBoxButton", "#application-Action-toLetterBoxing");

        IframeUtils.setHash(oFlpIframe, "#FioriToExtApp-Action");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".btnSubmitToMain", "#application-FioriToExtApp-Action");

        IframeUtils.setHash(oFlpIframe, "#FioriToExtAppTarget-Action?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitSubmit", "#application-FioriToExtAppTarget-Action");

        let iApplicationCount = getApplicationCount();
        assert.strictEqual(iApplicationCount, 3, "apps were found in viewPortContainer");
        IframeUtils.getWithCssSelector(oFlpIframe, "#application-AppNotIsolated-Action");
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-AppNotIsolated-Action"), "application-AppNotIsolated-Action was found");
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-Action-toLetterBoxing"), "application-Action-toLetterBoxing was found");
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-FioriToExtAppTarget-Action"), "application-FioriToExtAppTarget-Action was found");

        IframeUtils.setHash(oFlpIframe, "#Shell-home");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".sapUshellVizInstance");

        iApplicationCount = getApplicationCount();
        assert.strictEqual(iApplicationCount, 1, "apps were found in viewPortContainer");
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-Action-toLetterBoxing"), "application-Action-toLetterBoxing was found");

        IframeUtils.setHash(oFlpIframe, "#AppNav-SAP1?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitDirtyStateProvider", "#application-AppNav-SAP1");

        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-AppNav-SAP1"), "application-AppNav-SAP1 was found");

        IframeUtils.setHash(oFlpIframe, "#AppNav-SAP2?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".idQunitDirtyStateProvider", "#application-AppNav-SAP2");

        assert.notOk(IframeUtils.getWithCssSelector(oFlpIframe, "#application-AppNav-SAP1"), "application-AppNav-SAP1 was not found");
        assert.ok(IframeUtils.getWithCssSelector(oFlpIframe, "#application-AppNav-SAP2"), "application-AppNav-SAP2 was found");

        IframeUtils.setHash(oFlpIframe, "#Shell-home");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".sapUshellVizInstance");

        IframeUtils.setHash(oFlpIframe, "#FioriToExtAppIsolated-Action?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".btnSubmitToMain", "#application-Action-toLetterBoxing");

        IframeUtils.setHash(oFlpIframe, "#FioriToExtAppIsolated-KeepAlive?sap-keep-alive=restricted");
        await IframeUtils.waitForCssSelector(oFlpIframe, ".btnSubmitToMain", "#application-Action-toLetterBoxing");
    });
});
