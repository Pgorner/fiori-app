// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for behaviour plugins post message api interface
 */

QUnit.config.testTimeout = 400000;

sap.ui.define(["sap/ui/thirdparty/jquery"], function (jQuery) {
    "use strict";

    /* global QUnit */

    var flpIframe;

    QUnit.module("test", {
        beforeEach: function () {
            var sUrl = sap.ui.require.toUrl("sap/ushell/shells/demo/FioriLaunchpadIsolation.html?sap-isolation-enabled=true#Action-toLetterBoxing");
            flpIframe = jQuery("<iframe id=\"flp\" src=\"" + sUrl + "\" width=\"1000px\" height=\"400px\"></iframe>");
            flpIframe.appendTo("body");
        },

        afterEach: function () {
            jQuery(flpIframe).remove();
         }
    });

    QUnit.test("check plugins API", async function (assert) {
        const done = assert.async();
        function checkPostMessagesResult () {
            var oElements;
            oElements = jQuery("span", flpIframe.contents()).filter(function () { return (jQuery(this).text().indexOf("Agent connected successfully") > -1); });
            assert.strictEqual(oElements.length, 1, "found hello from plugin");
            oElements = jQuery("span", flpIframe.contents()).filter(function () { return (jQuery(this).text().indexOf("Response from Plugin 1234") > -1); });
            assert.strictEqual(oElements.length, 1, "found message from plugin");
            done();
        }

        function waitForAppOpen (sIframeId, sControlToFind) {
            return new Promise((resolve, reject) => {
                const hInterval = setInterval(checkAppLoaded, 4000);

                function checkAppLoaded () {
                    const appIframe = jQuery("#application-" + sIframeId, flpIframe.contents());
                    const nItems = jQuery("#" + sControlToFind, appIframe.contents()).length;

                    if (nItems > 0) {
                        clearInterval(hInterval);
                        setTimeout(resolve, 2000);
                    }
                }
            });
        }

        function waiForElement (sControlToFind) {
            return new Promise((resolve, reject) => {
                const hInterval = setInterval(checkElement, 100);

                function checkElement () {
                    const aItems = jQuery("#" + sControlToFind, flpIframe.contents());

                    if (aItems.length) {
                        clearInterval(hInterval);
                        resolve(aItems[0]);
                    }
                }
            });
        }

        await waitForAppOpen("Action-toLetterBoxing", "idHelloFromParent");
        const oElement = await waiForElement("copilotBtn");
        oElement.click();
        await waiForElement("shell-floatingContainer");
        checkPostMessagesResult();

    });
});
