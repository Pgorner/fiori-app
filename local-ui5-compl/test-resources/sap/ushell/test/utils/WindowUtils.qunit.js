// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.utils.WindowUtils
 */

/* global QUnit sinon */
sap.ui.define([
    "sap/ushell/utils/WindowUtils",
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ushell/utils"
], function (
    WindowUtils,
    Log,
    Device,
    ushellUtils
) {
    "use strict";

    var sandbox = sinon.sandbox.create();

    QUnit.module("hasInvalidProtocol");

    QUnit.test("Returns false for URLs with HTTP protocol", function (assert) {
        // Arrange
        var sURL = "http://www.sap.com",
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.test("Returns false for URLs with HTTPS protocol", function (assert) {
        // Arrange
        var sURL = "https://www.sap.com",
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.test("Returns false for URLs with no protocol (defaults to http/https in good browsers or blank in IE)", function (assert) {
        // Arrange
        var sURL = "www.sap.com",
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.test("Returns true for URLs with javascript protocol", function (assert) {
        // Arrange
        var sURL = "javascript:alert(\"Hello\")", // eslint-disable-line no-script-url
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, true, "Expected result was returned");
    });

    QUnit.test("Returns false for URLs with file protocol", function (assert) {
        // Arrange
        var sURL = "file://someFile.exe", // eslint-disable-line no-script-url
            bResult;
        // Act
        bResult = WindowUtils.hasInvalidProtocol(sURL);
        // Assert
        assert.strictEqual(bResult, false, "Expected result was returned");
    });

    QUnit.module("openURL", {
        beforeEach: function () {
            this.oHasInvalidProtocolStub = sandbox.stub(WindowUtils, "hasInvalidProtocol");
            this.oLogFatalStub = sandbox.stub(Log, "fatal");
            this.oWindowOpenStub = sandbox.stub(window, "open");
            this.oIsCrossOriginStub = sandbox.stub(WindowUtils, "isCrossOriginUrl");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("checks for forbidden protocols by default and throws when one is found", function (assert) {
        // Arrange
        var sError = "Tried to open a URL with an invalid protocol";
        this.oHasInvalidProtocolStub.returns(true);
        this.oIsCrossOriginStub.returns(false);
        // Act
        try {
            WindowUtils.openURL("");
        } catch (e) {
            assert.strictEqual(e.message, sError, "Error was thrown");
        }
        // Assert
        assert.strictEqual(this.oLogFatalStub.firstCall.args[0], sError, "Error was logged");
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.ok(this.oWindowOpenStub.notCalled, "window.open was not called");
    });

    QUnit.test("checks for forbidden protocols by default and opens the window if a valid one is found", function (assert) {
        // Arrange
        this.oHasInvalidProtocolStub.returns(false);
        this.oIsCrossOriginStub.returns(false);
        // Act
        try {
            WindowUtils.openURL("");
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.ok(this.oWindowOpenStub.called, "window.open was called");
    });

    QUnit.test("skips the protocol check if safeMode is disabled", function (assert) {
        // Arrange
        this.oIsCrossOriginStub.returns(false);
        // Act
        try {
            WindowUtils.openURL("", null, null, false);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.notCalled, "hasInvalidProtocol was called");
        assert.ok(this.oWindowOpenStub.called, "window.open was called");
    });

    QUnit.test("provides all parameters to the window.open function and returns the new window object", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "some,additional,windowFeatures",
                true
            ],
            oNewWindowObject = { foo: "bar" },
            oResult;
        this.oIsCrossOriginStub.returns(false);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns(oNewWindowObject);
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        aParameters.pop(); // Get rid of the last parameter which is not used for the actual window.open call
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, oNewWindowObject, "new window object was returned");
    });

    QUnit.test("automatically sets the noopener and noreferrer options for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noopener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("handles windowFeatures correctly for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "some,window,features"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "some,window,features,noopener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noopener windowFeature entries for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noopener"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noopener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noopener windowFeature entries for cross origin cases when the entry is not lower-case", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "NoOpener"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "NoOpener,noreferrer"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noreferrer windowFeature entries for cross origin cases", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noreferrer"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "noreferrer,noopener"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.test("does not duplicate noreferrer windowFeature entries for cross origin cases when the entry is not lower-case", function (assert) {
        // Arrange
        var aParameters = [
                "www.sap.com",
                "myCoolWindow",
                "nOrEfErrEr"
            ],
            aExpectedParameters = [
                "www.sap.com",
                "myCoolWindow",
                "nOrEfErrEr,noopener"
            ],
            oResult;
        this.oIsCrossOriginStub.returns(true);

        this.oHasInvalidProtocolStub.returns(false);
        this.oWindowOpenStub.returns();
        // Act
        try {
            oResult = WindowUtils.openURL.apply(WindowUtils, aParameters);
        } catch (e) {
            assert.ok(false, "No error was thrown");
        }
        // Assert
        assert.ok(this.oHasInvalidProtocolStub.called, "hasInvalidProtocol was called");
        assert.deepEqual(this.oWindowOpenStub.firstCall.args, aExpectedParameters, "window.open was called with the expected arguments");
        assert.deepEqual(oResult, true, "\"true\" was returned instead of the window object of the new window");
    });

    QUnit.module("getLeanURL");

    QUnit.test("Does not modify external URLs", function (assert) {
        // Arrange
        var sLeanURL;
        // Act
        sLeanURL = WindowUtils.getLeanURL("abc");
        // Assert
        assert.strictEqual(sLeanURL, "abc", "External urls are not modified.");
    });

    QUnit.test("Prioritizes the target URL if it is provided", function (assert) {
        // Arrange
        var sLeanURL;
        // Act
        sLeanURL = WindowUtils.getLeanURL("abc", "def");
        // Assert
        assert.strictEqual(sLeanURL, "abc", "The result was built based on the target URL");
    });

    QUnit.test("Adds the lean state parameter for hashes", function (assert) {
        // Arrange
        var sLeanURL;
        var sPrefix = window.location.origin + window.location.pathname;
        var sParams = window.location.search;
        var sExpectedUrl = "";

        if (sParams) {
            sExpectedUrl = sPrefix + sParams + "&sap-ushell-config=lean#abc";
        } else {
            sExpectedUrl = sPrefix + "?sap-ushell-config=lean#abc";
        }
        // Act
        sLeanURL = WindowUtils.getLeanURL("#abc");
        // Assert
        assert.strictEqual(sLeanURL, sExpectedUrl, "The lean sap-ushell-config parameter was added");
    });

    QUnit.test("Does not overwrite other parameters", function (assert) {
        // Arrange
        var sLeanURL;
        var sPrefix = window.location.origin + window.location.pathname;
        var sParams = window.location.search;
        var sExpectedUrl = "";

        if (sParams) {
            sExpectedUrl = sPrefix + sParams + "&sap-ushell-config=lean#abc?foo=bar";
        } else {
            sExpectedUrl = sPrefix + "?sap-ushell-config=lean#abc?foo=bar";
        }
        // Act
        sLeanURL = WindowUtils.getLeanURL("#abc?foo=bar");
        // Assert
        assert.strictEqual(sLeanURL, sExpectedUrl, "The parameters are still present");
    });

    QUnit.test("Returns an empty string when an invalid protocol was detected in the provided target", function (assert) {
        // Arrange
        var sLeanURL;
        // Act
        // eslint-disable-next-line no-script-url
        sLeanURL = WindowUtils.getLeanURL("javascript:alert('Gotcha!')");
        // Assert
        assert.strictEqual(sLeanURL, "", "The potentially malicious content was filtered out");
    });

    QUnit.test("Returns undefined when no target was provided", function (assert) {
        // Arrange
        var sLeanURL;
        // Act
        sLeanURL = WindowUtils.getLeanURL();
        // Assert
        assert.strictEqual(sLeanURL, undefined, "An empty string was returned");
    });

    QUnit.module("_adjustQueryString()", {
        beforeEach: function () {
            Device.system.phone = false;
            Device.system.tablet = false;

            this.fnGetAll = sandbox.stub();
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Return same query string when no params given", function (assert) {
        // Arrange
        const sQueryString = "?hans=imGl%C3%BCck";
        // Act
        var sResult = WindowUtils._adjustQueryString(sQueryString, [], []);
        // Assert
        assert.equal(sResult, sQueryString, "correct result is returned");
    });

    QUnit.test("Adds new parameter to query string", function (assert) {
        // Arrange
        const sQueryString = "?foo=bar&hans=imGl%C3%BCck";
        // Act
        var sEnhancedExistingQueryString = WindowUtils._adjustQueryString(sQueryString, [ { baz: "foo"}, {"sap-language": "EN" } ]);
        var sEnhancedEmptyQueryString = WindowUtils._adjustQueryString("", [ { baz: "foo"}, {"sap-language": "EN" } ]);
        // Assert
        // The order of params is not necessarily stable (not defined) - therefore, in future, the test might need a bit more
        //complexity for the comparison
        assert.equal(sEnhancedExistingQueryString, "?baz=foo&foo=bar&hans=imGl%C3%BCck&sap-language=EN", "correct result is returned");
        assert.equal(sEnhancedEmptyQueryString, "?baz=foo&sap-language=EN", "correct result is returned");
    });

    QUnit.test("Replace parameter in an exsting query string", function (assert) {
        // Arrange
        const sQueryString = "?hans=imGl%C3%BCck&sap-language=DE";
        // Act
        var sResult = WindowUtils._adjustQueryString(sQueryString, [ { "sap-language": "EN" } ]);
        // Assert
        assert.strictEqual(sResult, "?hans=imGl%C3%BCck&sap-language=EN", "correct result is returned");
    });

    QUnit.test("Survive call with Wrong (=empty) parameter", function (assert) {
        // Arrange
        const sQueryString = "?hans=imGl%C3%BCck&sap-language=DE";
        // Act
        var sResult = WindowUtils._adjustQueryString(sQueryString, [], [ {} ]);
        // Assert
        assert.strictEqual(sResult, sQueryString, "correct result is returned");
    });

    QUnit.test("Remove parameter from existing query string", function (assert) {
        // Arrange
        const sQueryString = "?hans=imGl%C3%BCck&sap-language=EN&baz=trallera";
        // Act
        var sResult = WindowUtils._adjustQueryString(sQueryString, undefined, ["baz", "sap-language"]);
        // Assert
        assert.strictEqual(sResult, "?hans=imGl%C3%BCck", "correct result is returned");
    });

    QUnit.test("Be graceful when a to-be-removed parameter doesn't exist in the query string", function (assert) {
        // Arrange
        const sQueryString = "?hans=imGl%C3%BCck";
        // Act
        var sNonEmptyQueryStringResult = WindowUtils._adjustQueryString(sQueryString, [ { "sap-language": "EN" } ], ["notthere"]);
        var sEmptyQueryStringResult = WindowUtils._adjustQueryString("", [ { "sap-language": "EN" } ], ["notthere"]);
        // Assert
        assert.strictEqual(sNonEmptyQueryStringResult, "?hans=imGl%C3%BCck&sap-language=EN", "correct result is returned");
        assert.strictEqual(sEmptyQueryStringResult, "?sap-language=EN", "correct result is returned");
    });

    QUnit.module("refreshBrowser()", {
        beforeEach: function () {
            Device.system.phone = false;
            Device.system.tablet = false;

            this.fnGetLocationHrefStub = sandbox.stub(ushellUtils, "getLocationHref").returns("");
            this.fnGetLocationSearchStub = sandbox.stub(ushellUtils, "getLocationSearch").returns("");
            this.fnWindowLocationReloadStub = sandbox.stub(ushellUtils, "windowLocationReload");
            this.fnWindowLocationAssignStub = sandbox.stub(ushellUtils, "windowLocationAssign");
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Ensure that _adjustQueryString() is called with all params", function (assert) {
        // Arrange
        var aParamsToUpdate = [{"sap-language": "DE"}];
        var aParamsToRemove = ["KillMe"];
        this.fnAdjustQueryStringStub = sandbox.stub(WindowUtils, "_adjustQueryString").returns("");
        // Act
        WindowUtils.refreshBrowser(aParamsToUpdate, aParamsToRemove);

        // Assert
        assert.equal(this.fnAdjustQueryStringStub.args[0][1], aParamsToUpdate, "Params to be added are transferred correctly");
        assert.equal(this.fnAdjustQueryStringStub.args[0][2], aParamsToRemove, "Params to be removed are transferred correctly");
    });

    QUnit.test("Trigger hard reload with no existing query and no parameter update", function (assert) {
        // Arrange
        this.fnGetLocationHrefStub.returns("https://myhost/");
        this.fnGetLocationSearchStub.returns("");

        // Act
        WindowUtils.refreshBrowser();

        // Assert
        assert.equal(this.fnWindowLocationReloadStub.called, true, "reload is called");
        assert.equal(this.fnWindowLocationAssignStub.called, false, "assign ist not called - as expected");
    });

    QUnit.test("Trigger hard reload with existing query and no parameter update", function (assert) {
        // Arrange
        this.fnGetLocationHrefStub.returns("https://myhost/FioriLaunchpad.html?sap-language=DE");
        this.fnGetLocationSearchStub.returns("?sap-language=DE");

        // Act
        WindowUtils.refreshBrowser();

        // Assert
        assert.equal(this.fnWindowLocationReloadStub.called, true, "reload is called");
        assert.equal(this.fnWindowLocationAssignStub.called, false, "assign ist not called - as expected");
    });


    QUnit.test("When the URL is changed, window.location.reload is not called, but location.assign - with the correct URL", function (assert) {
        // Arrange
        this.fnGetLocationHrefStub.returns("https://myhost/FioriLaunchpad.html?sap-language=DE");
        this.fnGetLocationSearchStub.returns("?sap-language=DE");

        // Act
        WindowUtils.refreshBrowser([{"sap-language": "EN"}]);

        // Assert
        assert.equal(this.fnWindowLocationReloadStub.called, false, "func NOT called - as expected");
        assert.equal(this.fnWindowLocationAssignStub.called, true, "func called");
        assert.equal(this.fnWindowLocationAssignStub.args[0][0], "https://myhost/FioriLaunchpad.html?sap-language=EN", "correct URL assigned");

    });

    QUnit.test("Check that URL is really changed when no URL param is left after adaptation", function (assert) {
        // Arrange
        this.fnGetLocationHrefStub.returns("https://myhost/FioriLaunchpad.html?sap-language=DE");
        this.fnGetLocationSearchStub.returns("?sap-language=DE");

        // Act
        WindowUtils.refreshBrowser(undefined, ["sap-language"]);

        // Assert
        assert.equal(this.fnWindowLocationReloadStub.called, false, "func NOT called - as expected");
        assert.equal(this.fnWindowLocationAssignStub.args[0][0], "https://myhost/FioriLaunchpad.html", "correct URL is assigned");
    });
});
