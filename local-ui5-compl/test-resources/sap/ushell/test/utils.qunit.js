// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for ushell-lib utils.js
 */
sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/util/ObjectPath",
    "sap/ui/core/theming/Parameters",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ushell/utils",
    "sap/ushell/test/utils",
    "sap/ushell/ApplicationType",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log",
    "sap/ushell/services/PersonalizationV2",
    "sap/ui/VersionInfo",
    "sap/ushell/resources" // required for "sap.ushell.resources.i18n"
], function (
    Localization,
    ObjectPath,
    ThemingParameters,
    Config,
    Container,
    utils,
    testUtils,
    ApplicationType,
    Device,
    jQuery,
    Log,
    PersonalizationV2,
    VersionInfo,
    ushellResources
) {
    "use strict";

    const { KeyCategory, WriteFrequency } = PersonalizationV2.prototype;

    /* global sinon, QUnit */
    var sandbox = sinon.createSandbox({});

    var O_KNOWN_APPLICATION_TYPES = ApplicationType.enum;

    // set the language as formatDate tests check for English texts
    Localization.setLanguage("en-US");

    QUnit.module("sap/ushell/utils.js", {
        afterEach: function () {
            sandbox.restore();
            testUtils.restoreSpies(
                Storage.prototype.setItem,
                utils.getPrivateEpcm,
                utils.hasNativeNavigationCapability,
                utils.hasNativeLogoutCapability,
                utils.hasNavigationModeCapability,
                utils.hasFLPReadyNotificationCapability,
                Log.error,
                utils.getParameterValueBoolean
            );
        }
    });

    QUnit.test("utils.isApplicationTypeEmbeddedInIframe", function (assert) {
        var oExpectedResult = {
            URL: false,
            WDA: true,
            NWBC: true,
            TR: true,
            WCF: true,
            SAPUI5: false
        };

        var aExpectedItemsInFixture = Object.keys(O_KNOWN_APPLICATION_TYPES)
            .map(function (sKey) {
                return O_KNOWN_APPLICATION_TYPES[sKey];
            })
            .sort();

        assert.deepEqual(
            Object.keys(oExpectedResult).sort(),
            aExpectedItemsInFixture,
            "Test prerequisite is fulfilled: all application types are tested for #isApplicationTypeEmbeddedInIframe"
        );

        Object.keys(oExpectedResult).forEach(function (sApplicationType) {
            var bExpected = oExpectedResult[sApplicationType];
            assert.strictEqual(
                utils.isApplicationTypeEmbeddedInIframe(sApplicationType, (sApplicationType === "WDA")),
                bExpected,
                "returns " + bExpected + " for " + sApplicationType
            );
        });
    });

    QUnit.test("utils.isDefined returns as expected", function (assert) {
        var testObject = {
            definedAndFalse: false,
            definedAndTrue: true,
            definedAndString: "ok"
        };
        var isDefinedFalse = utils.isDefined(testObject.definedAndFalse),
            isDefinedTrue = utils.isDefined(testObject.definedAndTrue),
            isDefinedString = utils.isDefined(testObject.definedAndString),
            notDefined = utils.isDefined(testObject.notDefined);

        assert.ok(isDefinedFalse, "expected that the property is defined if value is false");
        assert.ok(isDefinedTrue, "expected that the property is defined if value true");
        assert.ok(isDefinedString, "expected that the property is defined if value is a string");
        assert.ok(!notDefined, "expected that the property was not defined if value is undefined");
    });

    QUnit.test("utils.Error; create and expect tracing", function (assert) {
        var oLogMock = testUtils.createLogMock()
            .error("UShell error created", null, "component");
        utils.Error("UShell error created", "component");
        oLogMock.verify();
    });

    QUnit.test("utils.Error; check types", function (assert) {
        var oError = new utils.Error("UShell error created", "component");
        assert.ok(oError instanceof Error, "expected instance of Error");
        assert.ok(oError instanceof utils.Error, "expected instance of utils.Error");
    });

    QUnit.test("utils.Error: toString", function (assert) {
        var oError = new utils.Error("UShell error created", "component");
        assert.strictEqual(oError.toString(), "sap.ushell.utils.Error: UShell error created", "toString");
    });

    QUnit.test("utils.Error: throw and catch", function (assert) {
        var oError = new utils.Error("UShell error created", "component");
        try {
            throw oError;
        } catch (e) {
            assert.strictEqual(e, oError);
            assert.strictEqual(e.message, "UShell error created");
        }
    });

    QUnit.test("utils.calcOrigin", function (assert) {
        var origin = window.location.origin,
            sCalcorigin;
        if (!window.location.origin) {
            origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
        }
        sCalcorigin = utils.calculateOrigin(window.location);
        assert.ok(sCalcorigin.length > 0, "not trivial");
        assert.equal(sCalcorigin, origin, "correct url");
    });

    QUnit.test("utils.calcOrigin no origin", function (assert) {
        var sCalcorigin = utils.calculateOrigin({ hostname: "x.y.z", protocol: "http:", port: "8080" });
        assert.equal(sCalcorigin, "http://x.y.z:8080");
    });

    QUnit.test("utils.calcOrigin url construction, no port", function (assert) {
        var sCalcorigin = utils.calculateOrigin({ hostname: "x.y.z", protocol: "http:" });
        assert.equal(sCalcorigin, "http://x.y.z", "url ok ");
    });

    QUnit.test("utils.calcOrigin origin used if present", function (assert) {
        var sCalcorigin = utils.calculateOrigin({ origin: "httpX://sonicht:8080", hostname: "x.y.z", protocol: "http:", port: "8080" });
        assert.equal(sCalcorigin, "httpX://sonicht:8080", "origin used if present");
    });

    QUnit.test("utils.calcOrigin href used if origin/protocol/hostename not present", function (assert) {
        var sCalcorigin = utils.calculateOrigin({ hostname: "x.y.z", href: "https://this.is.it:3600" });
        assert.equal(sCalcorigin, "https://this.is.it:3600", "href used if present");
    });

    QUnit.test("utils.hasNativeNavigationCapability detect NWBC v6.0+", function (assert) {
        assert.strictEqual(utils.hasNativeNavigationCapability(), false, "returns false (not in NWBC)");
    });

    QUnit.test("utils.hasNativeLogoutCapability detect NWBC v6.0+", function (assert) {
        assert.strictEqual(utils.hasNativeLogoutCapability(), false, "returns false (not in NWBC)");
    });

    QUnit.test("utils.hasNavigationModeCapability detect NWBC v6.0+", function (assert) {
        assert.strictEqual(utils.hasNavigationModeCapability(), false, "returns false (not in NWBC)");
    });

    QUnit.test("utils.hasFLPReadyNotificationCapability detect NWBC v6.0+", function (assert) {
        assert.strictEqual(utils.hasFLPReadyNotificationCapability(), false, "returns false (not in NWBC)");
    });

    QUnit.test("utils.has*Capability: ", function (assert) {
        [{
            sMockedGetNwbcFeatureBits: "0",
            expectedHasNativeNavigationCapability: false, // first (least significant) bit
            expectedHasNativeLogoutCapability: false, // second (least significant) bit
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "1",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "2",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "3",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "4",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "5",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "6",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "7",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "8",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "9",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "A",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "B",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "C",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "D",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "E",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "F",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "31",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }].forEach(function (oFixture) {
            // Arrange
            sinon.stub(utils, "getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().returns(oFixture.sMockedGetNwbcFeatureBits)
            });

            // Act & Assert
            assert.strictEqual(utils.hasNativeNavigationCapability(),
                oFixture.expectedHasNativeNavigationCapability,
                "utils.hasNativeNavigationCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            assert.strictEqual(utils.hasNativeLogoutCapability(),
                oFixture.expectedHasNativeLogoutCapability,
                "utils.hasNativeLogoutCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            assert.strictEqual(utils.hasNavigationModeCapability(),
                oFixture.expectedHasNavigationModeCapability,
                "utils.hasNavigationModeCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            assert.strictEqual(utils.hasFLPReadyNotificationCapability(),
                oFixture.expectedHasFLPReadyNotificationCapability,
                "utils.hasFLPReadyNotificationCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            utils.getPrivateEpcm.restore();
        });
    });

    [{
        testDescription: "getPrivateEpcm returns undefined",
        returns: undefined,
        expectedHasNativeNavigationCapability: false
    }, {
        testDescription: "getNwbcFeatureBits throws",
        returns: { getNwbcFeatureBits: sinon.stub().throws("Some error") },
        expectedHasNativeNavigationCapability: false
    }].forEach(function (oFixture) {
        QUnit.test("utils.hasNativeNavigationCapability returns expected result when " + oFixture.testDescription, function (assert) {
            sinon.stub(utils, "getPrivateEpcm").returns(oFixture.returns);

            assert.strictEqual(utils.hasNativeNavigationCapability(),
                oFixture.expectedHasNativeNavigationCapability, "returned expected result");
            utils.getPrivateEpcm.restore();
        });
    });

    [
        "hasNativeNavigationCapability",
        "hasNativeLogoutCapability",
        "hasNavigationModeCapability",
        "hasFLPReadyNotificationCapability"
    ].forEach(function (sMethod) {
        QUnit.test("utils." + sMethod + " logs an error when window.epcm.getNwbcFeatureBits throws", function (assert) {
            sinon.stub(Log, "error");
            sinon.stub(utils, "getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().throws("Some error")
            });

            utils[sMethod]();

            assert.ok(Log.error.calledOnce === true, "Log.error was called once");

            utils.getPrivateEpcm.restore();
        });
    });

    QUnit.test("utils.isNativeWebGuiNavigation returns true if TR in resolved navigation target and FDC detected", function (assert) {
        var bResult;

        sinon.stub(utils, "getPrivateEpcm").returns({
            getNwbcFeatureBits: sinon.stub().returns("3")
        });

        bResult = utils.isNativeWebGuiNavigation({
            applicationType: "TR",
            url: "https://someserver.corp.com:1234/sap/bc/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_TRANS" +
                "?P_APPL=FS2_TEST&P_OBJECT=&P_PNP=&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&DYNP_OKCODE=onli&sap-client=120&sap-language=EN"
        });
        assert.strictEqual(bResult, true, "returns true");
        utils.getPrivateEpcm.restore();
    });

    QUnit.test("utils.Map: basics", function (assert) {
        var oMap = new utils.Map();
        oMap.put("key", "value");
        assert.strictEqual(oMap.containsKey("key"), true);
        assert.strictEqual(oMap.containsKey("something"), false);
        assert.strictEqual(oMap.get("key"), "value");
        assert.strictEqual(oMap.get("something"), undefined);
        oMap.put("get", "oh");
        assert.strictEqual(oMap.get("get"), "oh");
        oMap.put("hasOwnProperty", "oh");
        assert.strictEqual(oMap.get("hasOwnProperty"), "oh");
        try {
            Object.prototype.foo = "bar"; // eslint-disable-line no-extend-native
            assert.ok(!oMap.containsKey("foo"));
        } finally {
            delete Object.prototype.foo;
        }
    });

    QUnit.test("utils.Map remove", function (assert) {
        var oMap = new utils.Map();
        oMap.put("key", "value");
        assert.strictEqual(oMap.containsKey("key"), true);

        oMap.remove("key");
        assert.strictEqual(oMap.containsKey("key"), false);
        assert.strictEqual(oMap.get("key"), undefined);

        // removing something unknown should not throw an exception
        oMap.remove("something");
    });

    QUnit.test("utils.Map: keys", function (assert) {
        var oMap = new utils.Map(),
            fnKeys = sinon.spy(Object, "keys"),
            aKeys;
        oMap.put("key", "value");
        aKeys = oMap.keys();
        assert.deepEqual(aKeys, ["key"]);
        assert.ok(fnKeys.calledOnce);
        assert.ok(fnKeys.returned(aKeys));
    });

    QUnit.test("utils.Map: toString", function (assert) {
        var oMap = new utils.Map();
        assert.strictEqual("sap.ushell.utils.Map({})", oMap.toString());

        oMap.put("key", "value");
        assert.strictEqual("sap.ushell.utils.Map({\"key\":\"value\"})", oMap.toString());
    });

    QUnit.test("utils.Map: error handling", function (assert) {
        var oMap = new utils.Map();

        assert.throws(
            function () { oMap.put({}, "foo"); },
            /Not a string key: \[object Object\]/
        );
        assert.throws(
            function () { oMap.containsKey({}); },
            /Not a string key: \[object Object\]/
        );
        assert.throws(
            function () { oMap.get({}); },
            /Not a string key: \[object Object\]/
        );
    });

    QUnit.test("utils.Map: put twice", function (assert) {
        var oMap = new utils.Map(),
            oPrevious;

        oPrevious = oMap.put("foo", window);
        assert.strictEqual(oPrevious, undefined);

        oPrevious = oMap.put("foo", sinon);
        assert.strictEqual(oPrevious, window);
    });

    QUnit.test("localStorageSetItem in Safari private browsing mode", function (assert) {
        var sError = "QUOTA_EXCEEDED_ERR",
            oLogMock = testUtils.createLogMock()
                .filterComponent("utils")
                .warning("Error calling localStorage.setItem(): " + sError, null,
                    "sap.ushell.utils");
        sinon.stub(Storage.prototype, "setItem");
        utils.localStorageSetItem("foo", "bar");
        assert.ok(Storage.prototype.setItem.calledWithExactly("foo", "bar"),
            "localStorage.setItem called for test");

        Storage.prototype.setItem.throws(sError);
        utils.localStorageSetItem("foo", "bar");
        oLogMock.verify();
    });

    QUnit.test("localStorageSetItem eventing to same window", function (assert) {
        var fnStorageListener = sinon.spy(function (oStorageEvent) {
            assert.strictEqual(oStorageEvent.key, "foo", "Key same window");
            assert.strictEqual(oStorageEvent.newValue, "bar", "Value same window");
        });

        sinon.stub(Storage.prototype, "setItem");

        window.addEventListener("storage", fnStorageListener);
        utils.localStorageSetItem("foo", "bar", true);

        assert.ok(fnStorageListener.calledOnce, "Listener called (once)");
        window.removeEventListener("storage", fnStorageListener);
    });

    QUnit.test("getParameterValueBoolean : ", function (assert) {
        var val;
        sandbox.stub(URLSearchParams.prototype, "get").callsFake(function () { return undefined; });
        sandbox.stub(URLSearchParams.prototype, "getAll").callsFake(function () { return undefined; });
        val = utils.getParameterValueBoolean("sap-accessibility");
        assert.equal(val, undefined, " value is undefined");
    });

    ["X", "x", "tRue", "TRUE", "true"].forEach(function (sVal) {
        QUnit.test("getParameterValueBoolean : trueish" + sVal, function (assert) {
            var val;
            sandbox.stub(URLSearchParams.prototype, "get").callsFake(function () { return undefined; });
            sandbox.stub(URLSearchParams.prototype, "getAll").callsFake(function (sParam) {
                if (sParam === "sap-accessibility") {
                    return [sVal, "false"];
                }
                return false;
            });
            val = utils.getParameterValueBoolean("sap-accessibility");
            assert.equal(val, true, " value is true");
        });
    });

    ["", "false", "FALSE", "False"].forEach(function (sVal) {
        QUnit.test("getParameterValueBoolean : falsish" + sVal, function (assert) {
            var val;
            sandbox.stub(URLSearchParams.prototype, "get").callsFake(function () { return undefined; });
            sandbox.stub(URLSearchParams.prototype, "getAll").callsFake(function (sParam) {
                if (sParam === "sap-accessibility") {
                    return [sVal];
                }
                return false;
            });
            val = utils.getParameterValueBoolean("sap-accessibility");
            assert.equal(val, false, " value is false");
        });
    });

    ["fatruelse", "WAHR", "falsch"].forEach(function (sVal) {
        QUnit.test("getParameterValueBoolean : undefined" + sVal, function (assert) {
            var val;
            sandbox.stub(URLSearchParams.prototype, "get").callsFake(function () { return undefined; });
            sandbox.stub(URLSearchParams.prototype, "getAll").callsFake(function (sParam) {
                if (sParam === "sap-accessibility") {
                    return [sVal];
                }
                return false;
            });
            val = utils.getParameterValueBoolean("sap-accessibility");
            assert.equal(val, undefined, " value is undefined");
        });
    });

    QUnit.test("getFormFactor", function (assert) {
        var oOriginalSystem = Device.system;

        function testFormFactor (oSystem, sExpected) {
            oSystem.SYSTEMTYPE = oOriginalSystem.SYSTEMTYPE;
            Device.system = oSystem;
            assert.strictEqual(utils.getFormFactor(), sExpected);
        }

        testFormFactor({ desktop: true }, "desktop");
        testFormFactor({ tablet: true }, "tablet");
        testFormFactor({ phone: true }, "phone");
        testFormFactor({ tablet: true, phone: true }, "tablet"); // Phablet?
        testFormFactor({ desktop: true, tablet: true }, "desktop"); // MS Surface Pro?
        testFormFactor({ desktop: true, tablet: true, phone: true }, "desktop"); // ?
        testFormFactor({}, undefined);

        Device.system = oOriginalSystem;
    });

    QUnit.test("call: sync call", function (assert) {
        var bCalled = false;
        utils.call(
            function () {
                // this shall be called synchronously
                bCalled = true;
                assert.ok(true);
            },
            function (sError) {
                // this MUST NOT be called
                assert.strictEqual(sError, "");
                assert.ok(false);
            },
            false
        );
        assert.ok(bCalled);
    });

    QUnit.test("call: async call", function (assert) {
        var done = assert.async();
        var bCalled = false;
        utils.call(
            function () {
                // this shall be called asynchronously
                bCalled = true;
                assert.ok(true);
            },
            function (sError) {
                // this MUST NOT be called
                assert.strictEqual(sError, "");
                assert.ok(false);
            },
            true
        );
        assert.ok(!bCalled); // not yet called

        setTimeout(function () {
            assert.ok(bCalled); // now!
            done();
        }, 100);
    });

    QUnit.test("call: try/catch", function (assert) {
        var done = assert.async();
        var sText = "intentionally failed";
        utils.call(
            function () { throw new Error(sText); },
            function (sError) {
                // this shall be called
                assert.strictEqual(sError, sText);
                assert.ok(true);
            },
            false
        );

        utils.call(
            function () { throw new Error(sText); },
            function (sError) {
                // this shall be called
                assert.strictEqual(sError, sText);
                assert.ok(true);
                done();
            },
            true
        );
    });

    QUnit.test("call: error with failure handler", function (assert) {
        var oError = new Error("intentionally failed");
        utils.call(
            function () { throw oError; },
            null,
            false
        );
        assert.ok(true, "call caught exception");
    });

    QUnit.test("call: error with failure handler", function (assert) {
        var oError = new Error("intentionally failed");
        utils.call(
            function () { throw oError; },
            function (sMsg) { assert.strictEqual(sMsg, "intentionally failed", "As expected"); },
            false
        );
    });

    QUnit.test("call: non-error thrown with failure handler", function (assert) {
        var oLogMock = testUtils.createLogMock()
            .error("Call to success handler failed: " + {}, undefined, "sap.ushell.utils");
        utils.call(
            function () { throw {}; },
            function (sMsg) { assert.strictEqual(typeof sMsg, "string"); },
            false
        );
        oLogMock.verify();
    });

    QUnit.test("invokeUnfoldingArrayArguments empty array", function (assert) {
        var fnx = sinon.stub().returns(new jQuery.Deferred().resolve("A").promise());
        utils.invokeUnfoldingArrayArguments(fnx, [[]]).done(function (res) {
            assert.deepEqual(res, [], "result ok");
        });
        assert.equal(fnx.called, false, "not called");
    });

    QUnit.test("invokeUnfoldingArrayArguments simple invoke", function (assert) {
        var pr = new jQuery.Deferred().resolve("A").promise(),
            fnx = sinon.stub().returns(pr),
            prx = utils.invokeUnfoldingArrayArguments(fnx, ["a", "b", "c"]).done(function (res) {
                assert.ok(res, "A", "original promise returned");
            });
        assert.equal(prx, pr, "original promise returned");
        assert.deepEqual(fnx.args[0], ["a", "b", "c"], " arguments ok");
    });

    QUnit.test("invokeUnfoldingArrayArguments array invoke, error, wrong arg", function (assert) {
        var pr = new jQuery.Deferred().resolve("A").promise(),
            fnx = sinon.stub().returns(pr);
        try {
            utils.invokeUnfoldingArrayArguments(fnx, [["c1", "c2", "c3"]]).done(function (res) {
                assert.ok(false, "should not get here");
            });
            assert.ok(false, "should not get here");
        } catch (e) {
            assert.ok(true, "got exception");
        }
    });

    QUnit.test("invokeUnfoldingArrayArguments array invoke, trivial case", function (assert) {
        var fnx = sinon.stub();
        fnx.onCall(0).returns(new jQuery.Deferred().resolve("A1").promise());
        fnx.onCall(1).returns(new jQuery.Deferred().resolve("A2").promise());
        fnx.onCall(2).returns(new jQuery.Deferred().resolve("A3").promise());
        fnx.onCall(3).returns(new jQuery.Deferred().resolve("A4").promise());
        utils.invokeUnfoldingArrayArguments(fnx, [[["c1"], ["c2"], ["c3"]]]).done(function (res) {
            assert.deepEqual(res, [["A1"], ["A2"], ["A3"]], "original promise returned");
        });
        assert.deepEqual(fnx.args[0], ["c1"], " arguments ok");
        assert.deepEqual(fnx.args[1], ["c2"], " arguments ok");
        assert.deepEqual(fnx.args[2], ["c3"], " arguments ok");
    });

    QUnit.test("invokeUnfoldingArrayArguments array invoke, multiple return arguments, multiple input arguments", function (assert) {
        var pr = new jQuery.Deferred().resolve("A", "B").promise(),
            cnt = 0,
            fnx = sinon.stub().returns(pr);
        utils.invokeUnfoldingArrayArguments(fnx, [[["c1", "p2"], ["c2", "p22"], ["c3", "p33"]]]).done(function (res) {
            assert.deepEqual(res, [["A", "B"], ["A", "B"], ["A", "B"]], "original promise returned");
            cnt = 1;
        });
        assert.ok(cnt === 1, "got to done");
        assert.deepEqual(fnx.args[0], ["c1", "p2"], " arguments  1 ok");
        assert.deepEqual(fnx.args[1], ["c2", "p22"], " arguments 2 ok");
        assert.deepEqual(fnx.args[2], ["c3", "p33"], " arguments 3 ok");
    });

    QUnit.test("invokeUnfoldingArrayArguments this vs that", function (assert) {
        var oThat = {},
            fnFunction = function () {
                // assert
                assert.strictEqual(this, oThat, "function was called with correct this");
                return new jQuery.Deferred()
                    .resolve("does not matter")
                    .promise();
            };

        // code under test
        utils.invokeUnfoldingArrayArguments
            .call(oThat, fnFunction, [[["a"], ["b"]]]);
    });

    QUnit.test("invokeUnfoldingArrayArguments array invoke, reject", function (assert) {
        var fnx = sinon.stub(),
            cnt = 0;
        fnx.onCall(0).returns(new jQuery.Deferred().resolve("A1").promise());
        fnx.onCall(1).returns(new jQuery.Deferred().reject("not me").promise());
        fnx.onCall(2).returns(new jQuery.Deferred().resolve("A3").promise());
        fnx.onCall(3).returns(new jQuery.Deferred().resolve("A4").promise());
        utils.invokeUnfoldingArrayArguments(fnx, [[["c1"], ["c2"], ["c3"]]]).done(function (res) {
            assert.ok(false, "should not get here");
            assert.deepEqual(res, [["A1"], ["A2"], ["A3"]], "original promise returned");
        }).fail(function (/*sMsg*/) {
            assert.ok(true, "got here");
            cnt = 1;
        });
        assert.ok(cnt === 1, "got to fail");
        assert.deepEqual(fnx.args[0], ["c1"], " arguments ok");
        assert.deepEqual(fnx.args[1], ["c2"], " arguments ok");
        assert.deepEqual(fnx.args[2], ["c3"], " arguments ok");
    });

    QUnit.test("verify format Date", function (assert) {
        var stub = sinon.stub(utils, "_getCurrentDate").returns(new Date("Thu Dec 30 2015 17:49:41 GMT+0200 (Jerusalem Standard Time)"));
        assert.equal(utils.formatDate(new Date("Thu Dec 30 2015 17:49:41 GMT+0200 (Jerusalem Standard Time)")), "Just now");
        assert.equal(utils.formatDate(new Date("Thu Dec 30 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "6 hours ago");
        assert.equal(utils.formatDate(new Date("Thu Dec 29 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "1 day ago");
        assert.equal(utils.formatDate(new Date("Thu Dec 24 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "6 days ago");
        assert.equal(utils.formatDate(new Date("Thu Dec 30 2015 17:39:41 GMT+0200 (Jerusalem Standard Time)")), "10 minutes ago");
        assert.equal(utils.formatDate(new Date("Thu Dec 30 2015 18:39:41 GMT+0300 (Jerusalem Daylight Time)")), "10 minutes ago");
        stub.restore();
    });

    QUnit.test("test - check if group has tiles and links", function (assert) {
        var aTiles = [{ id: "tile1", isTileIntentSupported: true }, { id: "tile1", isTileIntentSupported: true }],
            aLinks = [{ id: "link1", isTileIntentSupported: true }],
            bHasContent = false;

        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        assert.ok(bHasContent === true, "group has tiles and links");

        aLinks = [];
        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        assert.ok(bHasContent === true, "group has tiles");

        aTiles = [];
        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        assert.ok(bHasContent === false, "group has no tiles or links");

        aLinks = [{ id: "link1", isTileIntentSupported: true }];
        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        assert.ok(bHasContent === true, "group has links");
    });

    [{
        testDescription: "Call moveElementInsideOfArray with correct parameters - Element2 to index 4",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 2,
        nNewIdx: 4,
        oExpectedOutput: [0, 1, 3, 4, 2, 5]
    }, {
        testDescription: "Call moveElementInsideOfArray with correct parameters - Element4 to index 1",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 4,
        nNewIdx: 1,
        oExpectedOutput: [0, 4, 1, 2, 3, 5]
    }, {
        testDescription: "Call moveElementInsideOfArray with correct parameters - Element2 to index 5",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 2,
        nNewIdx: 5,
        oExpectedOutput: [0, 1, 3, 4, 5, 2]
    }, {
        testDescription: "Call moveElementInsideOfArray with correct parameters - but with same index",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 2,
        nNewIdx: 2,
        oExpectedOutput: [0, 1, 2, 3, 4, 5]
    }, {
        testDescription: "Call moveElementInsideOfArray with incorrect parameters - No operation necessary (source and target are equal)",
        aInputArray: [0],
        nIndexOfElement: 0,
        nNewIdx: 0,
        oExpectedOutput: [0]
    }].forEach(function (oFixture) {
        QUnit.test("moveElementInsideOfArray: " + oFixture.testDescription, function (assert) {
            // Act & Assert
            assert.deepEqual(utils.moveElementInsideOfArray(oFixture.aInputArray, oFixture.nIndexOfElement, oFixture.nNewIdx), oFixture.oExpectedOutput, "Expected output");
        });
    });

    [{
        testDescription: "negative source index",
        input: [[0, 1, 2, 3, 4, 5, 6], -1, 5],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "no input array is given",
        input: [{}, 2, 5],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "empty input array",
        input: [[], 2, 5],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "empty input array, invalid index",
        input: [[], 0, 0],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "source index is undefined",
        input: [[0, 1, 2, 3, 4, 5, 6], undefined, 3],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "target index is undefined",
        input: [[0, 1, 2, 3, 4, 5, 6], 3, undefined],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "source index too high",
        input: [[0, 1, 2, 3, 4, 5, 6], 7, 0],
        expectedExceptionMsg: "Index out of bounds"
    }, {
        testDescription: "target index too high",
        input: [[0, 1, 2, 3, 4, 5, 6], 0, 7],
        expectedExceptionMsg: "Index out of bounds"
    }].forEach(function (oFixture) {
        QUnit.test("moveElementInsideOfArray throws as " + oFixture.testDescription, function (assert) {
            assert.throws(
                function () {
                    utils.moveElementInsideOfArray.apply(null, oFixture.input);
                },
                oFixture.expectedExceptionMsg
            );
        });
    });

    [{
        testDescription: "first Generated ID is unique (empty array)",
        aExistingIds: [],
        expectedGeneratedId: "000-000-000"
    }, {
        testDescription: "first Generated ID is unique (all IDs differ)",
        aExistingIds: ["AAA-000-000", "BBB-000-000", "CCC-000-000", "DDD-000-000", "EEE-000-000"],
        expectedGeneratedId: "000-000-000"
    }, {
        testDescription: "Second ID is Unique",
        aExistingIds: ["000-000-000"],
        expectedGeneratedId: "100-000-000"
    }, {
        testDescription: "5th ID is Unique",
        aExistingIds: ["000-000-000", "100-000-000", "200-000-000", "300-000-000"],
        expectedGeneratedId: "400-000-000"
    }].forEach(function (oFixture) {
        QUnit.test("generateUniqueId: " + oFixture.testDescription, function (assert) {
            var sResult,
                oGetUidStub,
                iUidCount = -1;

            // arrange
            function isUniqueIdCallback (sProposedGeneratedId) {
                // prevent endless loops in the test
                if (iUidCount > 1000) {
                    assert.ok(false, "endless loop");
                    return true;
                }

                return oFixture.aExistingIds.indexOf(sProposedGeneratedId) === -1;
            }

            oGetUidStub = sinon.stub(utils, "_getUid").callsFake(function () {
                iUidCount += 1;
                return iUidCount + "00-000-000";
            });

            // callback parameter
            // act
            sResult = utils.generateUniqueId(isUniqueIdCallback);
            // assert
            assert.strictEqual(sResult, oFixture.expectedGeneratedId,
                "returned unique ID (callback parameter), call count: " + iUidCount);

            // array parameter
            // arrange (reset)
            iUidCount = -1;
            // act
            sResult = utils.generateUniqueId(oFixture.aExistingIds);
            // assert
            assert.strictEqual(sResult, oFixture.expectedGeneratedId,
                "returned unique ID (callback parameter), call count: " + iUidCount);
            oGetUidStub.restore();
        });
    });

    QUnit.test("generateUniqueId: callback returns falsy values", function (assert) {
        var sResult,
            aUniqueIdCallbackResults = ["", false, 0, NaN, null, undefined], // falsy values
            aUniqueIdCallbackCalls = -1,
            iUidCount = -1,
            oGetUidStub,
            sExpectedUniqueId = aUniqueIdCallbackResults.length + "00-000-000"; // -1 can be skipped as true is add later

        // arrange
        aUniqueIdCallbackResults.push(true); // make the test successful in the end
        function isUniqueIdCallback (/*sProposedGeneratedId*/) {
            // prevent endless loops in the test
            if (iUidCount > 1000) {
                assert.ok(false, "endless loop");
                return true;
            }

            aUniqueIdCallbackCalls += 1;
            return aUniqueIdCallbackResults[aUniqueIdCallbackCalls];
        }

        oGetUidStub = sinon.stub(utils, "_getUid").callsFake(function () {
            iUidCount += 1;
            return iUidCount + "00-000-000";
        });

        // callback parameter
        // act
        sResult = utils.generateUniqueId(isUniqueIdCallback);
        // assert
        assert.strictEqual(sResult, sExpectedUniqueId,
            "returned unique ID, call count: " + iUidCount);
        oGetUidStub.restore();
    });

    QUnit.test("shallowMergeObject: target object is modified after a merge", function (assert) {
        var oTarget = { key1: "V1", key2: "V2" },
            oSource = { key3: "V3" };

        utils.shallowMergeObject(oTarget, oSource);

        assert.deepEqual(oTarget, { key1: "V1", key2: "V2", key3: "V3" },
            "object was merged as expected"
        );
    });

    QUnit.test("shallowMergeObject: only one argument is passed", function (assert) {
        var oTarget = { key1: "V1", key2: "V2" };

        utils.shallowMergeObject(oTarget);

        assert.strictEqual(oTarget, oTarget, "object was left intact");
    });

    QUnit.test("shallowMergeObject: merges as expected when two objects are given", function (assert) {
        var oTarget = { key1: "V1", key2: "V2" },
            oSource = { key3: "V3" };

        assert.deepEqual(
            utils.shallowMergeObject(oTarget, oSource),
            { key1: "V1", key2: "V2", key3: "V3" },
            "object was merged as expected"
        );
    });

    QUnit.test("shallowMergeObject: merges as expected when multiple objects are given", function (assert) {
        var oTarget = { key1: "V1", key2: "V2" },
            oSource1 = { key3: "V3" },
            oSource2 = { key4: "V4" },
            oSource3 = { key5: "V5" };

        assert.deepEqual(
            utils.shallowMergeObject(oTarget, oSource1, oSource2, oSource3),
            { key1: "V1", key2: "V2", key3: "V3", key4: "V4", key5: "V5" },
            "object was merged as expected"
        );
    });

    QUnit.test("shallowMergeObject: merge is shallow", function (assert) {
        var oTarget = { key1: { key2: { key3: "Value " } } },
            oSource = { key1: "WINS" };

        assert.deepEqual(
            utils.shallowMergeObject(oTarget, oSource),
            { key1: "WINS" },
            "object was merged as expected"
        );
    });

    QUnit.test("shallowMergeObject: multiple objects are merged in order", function (assert) {
        var oTarget = { key: "Initial" },
            oSource1 = { key: "First" },
            oSource2 = { key: "Second" },
            oSource3 = { key: "Last" };

        assert.deepEqual(
            utils.shallowMergeObject(oTarget, oSource1, oSource2, oSource3),
            { key: "Last" },
            "object was merged as expected"
        );
    });

    [{
        testDescription: "one id given",
        sPrefix: "prefix",
        aIds: ["id1"],
        expectedKey: "prefix$id1"
    }, {
        testDescription: "two ids given",
        sPrefix: "prefix",
        aIds: ["id1", "id2"],
        expectedKey: "prefix#id1:id2"
    }, {
        testDescription: "more than two ids given",
        sPrefix: "prefix",
        aIds: ["id1", "id2", "id3"],
        expectedKey: "prefix@3@id1:id2:id3"
    }, {
        testDescription: "two ids with separator in the key are given",
        sPrefix: "prefix",
        aIds: ["id1", "id2:id3"],
        expectedKey: "prefix#id1:id2:id3"
    }].forEach(function (oFixture) {
        QUnit.test("generateLocalStorageKey: " + oFixture.testDescription, function (assert) {
            assert.strictEqual(
                utils.generateLocalStorageKey(oFixture.sPrefix, oFixture.aIds),
                oFixture.expectedKey,
                "obtained the expected result"
            );
        });
    });

    QUnit.test("generateLocalStorageKey throws when no ids are given", function (assert) {
        assert.throws(utils.generateLocalStorageKey.bind(utils, "prefix", []));
    });

    QUnit.test("setPerformanceMark sets a performance mark", function (assert) {
        var sMarkName = "myMark";

        // check if another test did set a performance mark
        if (performance.getEntries().length > 0) {
            performance.clearMarks();
        }

        // function to test
        utils.setPerformanceMark(sMarkName);

        assert.ok(performance.getEntriesByName(sMarkName).length > 0, "A performance mark was set");

        // Clear all performance marks
        performance.clearMarks();
    });

    QUnit.test("setPerformanceMark sets several performance marks", function (assert) {
        // Several mark names. Two share the same name.
        var aMarkName = ["myMark1", "myMark1", "myMark2", "myMark3"],
            fnDone = assert.async(),
            aPromises = [],
            oConfigMarks,
            iIndex = 4;

        // check if another test did set a performance mark
        if (performance.getEntries().length > 0) {
            performance.clearMarks();
        }

        // set the marks. This happens asynchronously as two marks with same time will not be recorded

        aMarkName.forEach(function (sValue, iInnerIndex) {
            aPromises.push(new Promise(function (resolve) {
                setTimeout(function (sValue) {
                    utils.setPerformanceMark(sValue);
                    resolve();
                }, iInnerIndex);
            }));
        });

        Promise.all(aPromises).then(function () {
            assert.ok(performance.getEntriesByType("mark").length === iIndex, "Several performance marks were set");
            iIndex += 1;
            // All the following tests might need to be async, the ok function seems to be slow
            // enough to avoid this.

            // repeat with oConfigMarks undefined
            utils.setPerformanceMark(aMarkName[0], undefined);
            assert.ok(performance.getEntriesByType("mark").length === iIndex, "oConfigMarks == undefined");
            iIndex += 1;

            // repeat with oConfigMarks.bUseUniqueMark empty
            utils.setPerformanceMark(aMarkName[0], {});
            assert.ok(performance.getEntriesByType("mark").length === iIndex, "oConfigMarks == {}");
            iIndex += 1;

            // repeat with oConfigMarks.bUseUniqueMark undefined
            oConfigMarks = { bUseUniqueMark: undefined };
            utils.setPerformanceMark(aMarkName[0], undefined);
            assert.ok(performance.getEntriesByType("mark").length === iIndex, "oConfigMarks.bUseUniqueMark == undefined");
            iIndex += 1;

            // repeat with oConfigMarks.bUseUniqueMark set to false
            oConfigMarks = { bUseUniqueMark: false };
            utils.setPerformanceMark(aMarkName[0], false);
            assert.ok(performance.getEntriesByType("mark").length === iIndex, "oConfigMarks.bUseUniqueMark == false");
            iIndex += 1;

            // repeat with the bUseUniqueMark false and bUseLastMark true
            oConfigMarks = { bUseUniqueMark: false, bUseLastMark: true };
            utils.setPerformanceMark(aMarkName[0], oConfigMarks);
            assert.ok(performance.getEntriesByType("mark").length === iIndex, "oConfigMarks.bUseUniqueMark == false, oConfigMarks.bUseLastMark==true");
            iIndex += 1;

            // Clear all performance marks
            performance.clearMarks();

            fnDone();
        });
    });

    QUnit.test("setPerformanceMark keeps only the first measurement of a series", function (assert) {
        var aMarkName = ["myMark1", "myMark1", "myMark1", "myMark1"],
            fStartTime,
            aPromises = [],
            aPromises2 = [],
            fnDone = assert.async(),
            oConfigMarks;

        // set the first mark
        utils.setPerformanceMark("myMark1");

        // save the time stamp
        fStartTime = performance.getEntriesByName("myMark1")[0].startTime;

        // try to take more measurements - (oConfigMarks.bUseLastMark undefined)
        oConfigMarks = { bUseUniqueMark: true };
        aMarkName.forEach(function (sValue, iIndex) {
            aPromises.push(new Promise(function (resolve) {
                setTimeout(function (sValue) {
                    utils.setPerformanceMark(sValue, oConfigMarks);
                    resolve();
                }, iIndex, sValue);
            }));
        });

        // Tests
        Promise.all(aPromises).then(function () {
            assert.ok(performance.getEntriesByName("myMark1").length === 1, "Only one measurement was recorded");
            assert.ok(performance.getEntriesByName("myMark1")[0].startTime === fStartTime, "The first measurement was recorded");

            // try to take more measurements - oConfigMarks.bUseLastMark set to false
            oConfigMarks.bUseLastMark = false;
            aMarkName.map(function (sValue) { utils.setPerformanceMark(sValue, oConfigMarks); });

            // Tests
            assert.ok(performance.getEntriesByName("myMark1").length === 1, "Only one measurement was recorded");
            assert.ok(performance.getEntriesByName("myMark1")[0].startTime === fStartTime, "The first measurement was recorded");
        }).then(function () {
            // second batch of tests
            aMarkName.forEach(function (sValue, iIndex) {
                aPromises2.push(new Promise(function (resolve) {
                    setTimeout(function (sValue) {
                        // try to take more measurements - oConfigMarks.bUseLastMark set to false
                        utils.setPerformanceMark(sValue, oConfigMarks);
                        resolve();
                    }, iIndex, sValue);
                }));
            });

            Promise.all(aPromises2).then(function () {
                // Tests
                assert.ok(performance.getEntriesByName("myMark1").length === 1, "Only one measurement was recorded");
                assert.ok(performance.getEntriesByName("myMark1")[0].startTime === fStartTime, "The first measurement was recorded");

                // Clear all performance marks
                performance.clearMarks();

                fnDone();
            });
        });
    });

    QUnit.test("setPerformanceMark keeps only the last measurement of series", function (assert) {
        var aMarkName = ["myMark1", "myMark1", "myMark1", "myMark1"],
            aAllMeasurements = [],
            fLastStartTime,
            iNumMarks,
            aPromises = [],
            fnDone = assert.async(),
            fMax,
            oConfigMarks;

        // try to take several measurements - oConfigMarks.bUseUniqueMark and oConfigMarks.bUseLastMark set to true
        oConfigMarks = { bUseUniqueMark: true, bUseLastMark: true };
        utils.setPerformanceMark("myMark1", oConfigMarks);
        // store the first measurement
        aAllMeasurements.push(performance.getEntriesByName("myMark1")[0].startTime);

        aMarkName.forEach(function (sValue, iIndex) {
            aPromises.push(new Promise(function (resolve) {
                setTimeout(function (sValue) {
                    utils.setPerformanceMark(sValue, oConfigMarks);
                    iNumMarks = performance.getEntriesByName(sValue).length;
                    aAllMeasurements.push(performance.getEntriesByName(sValue)[iNumMarks - 1].startTime);
                    resolve();
                }, iIndex, sValue);
            }));
        });

        // Tests
        Promise.all(aPromises).then(function () {
            assert.ok(performance.getEntriesByName("myMark1").length === 1, "Only one measurement was recorded");
            // to be sure the last measurement was recorded check if the maximal time was recorded
            fLastStartTime = performance.getEntriesByName("myMark1")[0].startTime;
            // ECMA6 would be nice here: Math.max(...aAllMeasurements)
            fMax = aAllMeasurements.reduce(function (a, b) { return Math.max(a, b); });
            assert.ok(fLastStartTime === fMax, "The last measurement was recorded");

            // Clear all performance marks
            performance.clearMarks();

            fnDone();
        });
    });

    QUnit.test("paramsToString", function (assert) {
        var oRes = utils.urlParametersToString({ ABC: ["3A"], DEF: ["4B"], AAAA: ["2", "1"] });
        assert.deepEqual(oRes, "AAAA=2&AAAA=1&ABC=3A&DEF=4B");
    });

    QUnit.test("paramsToString Escaping", function (assert) {
        var oRes = utils.urlParametersToString({ "/AB/C": ["3A"], DEF: ["4B"], AAAA: ["2", "1"] });
        assert.deepEqual(oRes, "%2FAB%2FC=3A&AAAA=2&AAAA=1&DEF=4B");
    });

    QUnit.test("paramsToString NoArray", function (assert) {
        var oRes = utils.urlParametersToString({ ABC: "3A", DEF: ["4B"], AAAA: ["2", "1"] });
        assert.deepEqual(oRes, "AAAA=2&AAAA=1&ABC=3A&DEF=4B");
    });

    QUnit.test("paramsToString Empty", function (assert) {
        assert.deepEqual(utils.urlParametersToString({}), "");
        assert.deepEqual(utils.urlParametersToString(), "");
    });

    QUnit.test("utils.removeDuplicatedActions: returns the same object if not array", function (assert) {
        // arrange
        var oActions = {
            0: "test",
            1: "test"
        };
        // act
        var oUniqueActions = utils.removeDuplicatedActions(oActions);

        // assert
        assert.deepEqual(oActions, oUniqueActions);
    });

    QUnit.test("utils.removeDuplicatedActions: if array is empty return an empty array", function (assert) {
        // arrange
        var aActions = [];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        assert.deepEqual(aActions, aUniqueActions);
    });

    QUnit.test("utils.removeDuplicatedActions: returns the same array in case of no duplicates", function (assert) {
        // arrange
        var aActions = ["item1", "item2"];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        assert.deepEqual(aActions, aUniqueActions);
    });

    QUnit.test("utils.removeDuplicatedActions: in case all array items are the same returns an array with one item", function (assert) {
        // arrange
        var aActions = ["item1", "item1", "item1"],
            aExpectedUniqueActions = ["item1"];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        assert.deepEqual(aExpectedUniqueActions, aUniqueActions);
    });

    QUnit.test("utils.removeDuplicatedActions: in case of duplicates array with unique items is returned", function (assert) {
        // arrange
        var aActions = ["item1", "item2", "item1", "item3", "item1", "item2", "item1"],
            aExpectedUniqueActions = ["item1", "item2", "item3"];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        assert.deepEqual(aExpectedUniqueActions, aUniqueActions);
    });

    QUnit.test("utils.calcVisibilityModes: empty groups on phone devices are not displayed on the homepage when not in edit mode", function (assert) {
        // Arrange
        var oGroupHasVisibleTilesStub = sinon.stub(utils, "groupHasVisibleTiles").returns(false),
            oOriginalSystem = Device.system;
        Device.system.desktop = false;
        Device.system.tablet = false;
        Device.system.phone = true;

        // Act
        var aResult = utils.calcVisibilityModes({}, true);

        // Assert
        assert.deepEqual(aResult, [false, true], "Group is hidden as expected");

        // Cleanup
        Device.system = oOriginalSystem;
        oGroupHasVisibleTilesStub.restore();
    });

    QUnit.test("utils.calcVisibilityModes: empty groups on tablet devices are not displayed on the homepage when not in edit mode", function (assert) {
        // Arrange
        var oGroupHasVisibleTilesStub = sinon.stub(utils, "groupHasVisibleTiles").returns(false),
            oOriginalSystem = Device.system;
        Device.system.desktop = false;
        Device.system.tablet = true;
        Device.system.phone = false;

        // Act
        var aResult = utils.calcVisibilityModes({}, true);

        // Assert
        assert.deepEqual(aResult, [false, true], "Group is hidden as expected");

        // Cleanup
        Device.system = oOriginalSystem;
        oGroupHasVisibleTilesStub.restore();
    });

    QUnit.test("utils.calcVisibilityModes: empty groups are displayed when tablet and desktop mode is enabled and the homepage is not in edit mode", function (assert) {
        // Arrange
        var oGroupHasVisibleTilesStub = sinon.stub(utils, "groupHasVisibleTiles").returns(false),
            oOriginalSystem = Device.system;
        Device.system.desktop = true;
        Device.system.tablet = true;
        Device.system.phone = false;

        // Act
        var aResult = utils.calcVisibilityModes({}, true);

        // Assert
        assert.deepEqual(aResult, [true, true], "Group is shown as expected");

        // Cleanup
        Device.system = oOriginalSystem;
        oGroupHasVisibleTilesStub.restore();
    });

    QUnit.module("isNativeWebGuiNavigation", {
        beforeEach: function () {
            this.oObjectPathStub = sinon.stub(ObjectPath, "get").callsFake(function (path, obj) {
                if (path === "applicationType") {
                    return obj.applicationType;
                }
                return obj.appCapabilities.nativeNWBCNavigation;
            });

            this.oHasNativeNavigationCapabilityStub = sinon.stub(utils, "hasNativeNavigationCapability");
        },
        afterEach: function () {
            this.oHasNativeNavigationCapabilityStub.restore();
            this.oObjectPathStub.restore();
        }
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: true, hasNativeNavigationCapability: true", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, true, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: true, hasNativeNavigationCapability: true", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, true, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: false, hasNativeNavigationCapability: true", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, true, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: false, hasNativeNavigationCapability: true", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: true, hasNativeNavigationCapability: true", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: true, hasNativeNavigationCapability: false", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: false, hasNativeNavigationCapability: false", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: false, hasNativeNavigationCapability: false", function (assert) {
        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        assert.strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.module("isRootIntent", {
        beforeEach: function () {
            this.rootIntentConfigPath = "renderers.fiori2.componentData.config.rootIntent";
            this.setRootIntent = function (sIntent) {
                this.originalRootIntent = ObjectPath.get(this.rootIntentConfigPath, window["sap-ushell-config"]);
                ObjectPath.set(this.rootIntentConfigPath, sIntent, window["sap-ushell-config"]);
            };
            this.setRootIntent("#Custom-rootIntent");
        },
        afterEach: function () {
            ObjectPath.set(this.rootIntentConfigPath, this.originalRootIntent, window["sap-ushell-config"]);
        }
    });

    QUnit.test("String Intent is the root intent", function (assert) {
        assert.strictEqual(utils.isRootIntent("#Custom-rootIntent"), true);
    });
    QUnit.test("String Intent with parameters", function (assert) {
        assert.strictEqual(utils.isRootIntent("#Custom-rootIntent?some=param1&param2=v2"), false);
    });
    QUnit.test("String Intent without '#' is the root intent", function (assert) {
        assert.strictEqual(utils.isRootIntent("Custom-rootIntent"), true);
    });
    QUnit.test("String Intent is not the root intent", function (assert) {
        assert.strictEqual(utils.isRootIntent("#Another-intent"), false);
    });
    QUnit.test("String Intent without '#' is not the root intent", function (assert) {
        assert.strictEqual(utils.isRootIntent("Another-intent"), false);
    });
    QUnit.test("Shell-home is not the root intent when not configured", function (assert) {
        assert.strictEqual(utils.isRootIntent("#Shell-home"), false);
    });
    QUnit.test("'#' intent is the root intent", function (assert) {
        assert.strictEqual(utils.isRootIntent("#"), true);
    });
    QUnit.test("empty intent is the root intent", function (assert) {
        assert.strictEqual(utils.isRootIntent(""), true);
    });
    QUnit.test("Invalid string root intent compared", function (assert) {
        assert.strictEqual(utils.isRootIntent("#1aunch-_me"), false);
    });
    QUnit.test("Array as input intent", function (assert) {
        assert.throws(utils.isRootIntent.bind(utils, ["#", "Some", "intent"]), Error("The given intent must be a string"));
    });
    QUnit.test("Undefined as input intent", function (assert) {
        assert.throws(utils.isRootIntent.bind(utils, undefined), Error("The given intent must be a string"));
    });
    QUnit.test("Number as input intent", function (assert) {
        assert.throws(utils.isRootIntent.bind(utils, 1234), Error("The given intent must be a string"));
    });
    QUnit.test("No arguments given", function (assert) {
        assert.throws(utils.isRootIntent.bind(utils), Error("The given intent must be a string"));
    });

    QUnit.module("isFlpHomeIntent");

    QUnit.test("Array as input intent", function (assert) {
        assert.throws(utils.isFlpHomeIntent.bind(utils, ["#", "Some", "intent"]), Error("The given intent must be a string"));
    });
    QUnit.test("Number as input intent", function (assert) {
        assert.throws(utils.isFlpHomeIntent.bind(utils, 1234), Error("The given intent must be a string"));
    });
    QUnit.test("#Shell-home is the flp home intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("#Shell-home"), true);
    });
    QUnit.test("#Shell-home?sap-app-origin-hint= is the flp home intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("#Shell-home?sap-app-origin-hint="), true);
    });
    QUnit.test("#Launchpad-openFLPPage is the flp home intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("#Launchpad-openFLPPage"), true);
    });
    QUnit.test("#Launchpad-openFLPPage with parameters is the flp home intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("#Launchpad-openFLPPage?pageId=page&spaceId=space"), true);
    });
    QUnit.test("#Launchpad-openFLPPage with parameters is the flp home intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("#Launchpad-openFLPPage?spaceId=page&pageId=space"), true);
    });
    QUnit.test("The flp home intent without hash", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("Shell-home"), true);
    });
    QUnit.test("String Intent is not the flp home intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent("#Another-intent"), false);
    });
    QUnit.test("Undefined as input intent", function (assert) {
        assert.strictEqual(utils.isFlpHomeIntent(), true);
    });

    QUnit.module("_getUserSettingPersContainer", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oPersonalizer = { id: "Personalizer" };
            this.oPersonalizationService = {
                getPersonalizer: sandbox.stub().resolves(this.oPersonalizer),
                KeyCategory,
                WriteFrequency
            };
            this.oGetServiceAsyncStub.withArgs("PersonalizationV2").resolves(this.oPersonalizationService);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the Personalizer", function (assert) {
        // Arrange
        var oExpectedPersId = {
            container: "sap.ushell.usersettings.personalization",
            item: "data"
        };
        var oExpectedScope = {
            validity: "Infinity",
            keyCategory: "GENERATED_KEY",
            writeFrequency: "HIGH",
            clientStorageAllowed: false
        };
        // Act
        return utils._getUserSettingPersContainer().then(function (oResult) {
            // Assert
            assert.strictEqual(oResult, this.oPersonalizer, "Resolved the correct Personalizer");
            assert.deepEqual(this.oPersonalizationService.getPersonalizer.getCall(0).args, [oExpectedPersId, oExpectedScope], "Called getPersonalizer with correct args");
        }.bind(this));
    });

    QUnit.module("getHideEmptySpacesEnabled", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigEmitStub = sandbox.stub(Config, "emit");

            this.oPersDataMock = {
                hideEmptySpaces: false
            };
            this.oGetPersDataStub = sandbox.stub();
            this.oPersContainer = {
                getPersData: this.oGetPersDataStub
            };
            this.oGetUserSettingPersContainerStub = sandbox.stub(utils, "_getUserSettingPersContainer").resolves(this.oPersContainer);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Resolves the value and updates the config", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/userEnabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(this.oPersDataMock).promise());
        var aExpectedEmitArgs = [
            "/core/spaces/hideEmptySpaces/userEnabled",
            false
        ];
        // Act
        return utils.getHideEmptySpacesEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, false, "Resolved correct result");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.deepEqual(this.oConfigEmitStub.getCall(0).args, aExpectedEmitArgs, "Saved new value to Config");
        }.bind(this));
    });

    QUnit.test("Default value for undefined is true", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/userEnabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(undefined).promise());
        // Act
        return utils.getHideEmptySpacesEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, true, "Resolved correct result");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oConfigEmitStub.callCount, 0, "Config was not updated");
        }.bind(this));
    });

    QUnit.test("Resolves instantly when hideEmptySpaces is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(false);
        // Act
        return utils.getHideEmptySpacesEnabled().then(function (bResult) {
            // Assert
            assert.strictEqual(bResult, false, "Resolved correct result");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 0, "PersContainer was not fetched");
            assert.strictEqual(this.oConfigEmitStub.callCount, 0, "Config was not updated");
        }.bind(this));
    });

    QUnit.test("Rejects when PersContainer.getPersData fails", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().reject("getPersData failed").promise());
        // Act
        return utils.getHideEmptySpacesEnabled().catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "getPersData failed", "Rejected with correct message");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oConfigEmitStub.callCount, 0, "Config was not updated");
        }.bind(this));
    });

    QUnit.module("setHideEmptySpacesEnabled", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigEmitStub = sandbox.stub(Config, "emit");

            this.oPersDataMock = {
                hideEmptySpaces: false
            };
            this.oGetPersDataStub = sandbox.stub();
            this.oSetPersDataStub = sandbox.stub();
            this.oPersContainer = {
                getPersData: this.oGetPersDataStub,
                setPersData: this.oSetPersDataStub
            };
            this.oGetUserSettingPersContainerStub = sandbox.stub(utils, "_getUserSettingPersContainer").resolves(this.oPersContainer);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Saves the new value \"false\" in case it was previously \"undefined\"", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(undefined).promise());
        this.oSetPersDataStub.returns(new jQuery.Deferred().resolve().promise());

        var oExpectedPersData = {
            hideEmptySpaces: false
        };
        var aExpectedEmitArgs = [
            "/core/spaces/hideEmptySpaces/userEnabled",
            false
        ];

        // Act
        return utils.setHideEmptySpacesEnabled(false).then(function () {
            // Assert
            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "getPersData was called");

            assert.strictEqual(this.oSetPersDataStub.callCount, 1, "setPersData was called");
            assert.deepEqual(this.oSetPersDataStub.getCall(0).args, [oExpectedPersData], "correct PersData was saved");

            assert.deepEqual(this.oConfigEmitStub.getCall(0).args, aExpectedEmitArgs, "Config.emit was called with correct args");
        }.bind(this));
    });

    QUnit.test("Does not save the new value \"true\" in case it was previously \"undefined\"", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(undefined).promise());

        // Act
        return utils.setHideEmptySpacesEnabled(true).then(function () {
            // Assert
            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "getPersData was called");

            assert.strictEqual(this.oSetPersDataStub.callCount, 0, "setPersData was not called");
            assert.strictEqual(this.oConfigEmitStub.callCount, 0, "Config.emit was not called");
        }.bind(this));
    });

    QUnit.test("Does not save the new value \"false\" in case it was previously \"false\"", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(this.oPersDataMock).promise());

        // Act
        return utils.setHideEmptySpacesEnabled(false).then(function () {
            // Assert
            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "getPersData was called");

            assert.strictEqual(this.oSetPersDataStub.callCount, 0, "SetPersData was notCalled");
            assert.strictEqual(this.oConfigEmitStub.callCount, 0, "Config.emit was not called");
        }.bind(this));
    });

    QUnit.test("Saves the new value \"true\" w/o overwriting other values", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oPersDataMock.otherValue = "foo";
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(this.oPersDataMock).promise());
        this.oSetPersDataStub.returns(new jQuery.Deferred().resolve().promise());

        var oExpectedPersData = {
            hideEmptySpaces: true,
            otherValue: "foo"
        };
        var aExpectedEmitArgs = [
            "/core/spaces/hideEmptySpaces/userEnabled",
            true
        ];

        // Act
        return utils.setHideEmptySpacesEnabled(true).then(function () {
            // Assert
            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "getPersData was called");

            assert.strictEqual(this.oSetPersDataStub.callCount, 1, "setPersData was called");
            assert.deepEqual(this.oSetPersDataStub.getCall(0).args, [oExpectedPersData], "correct PersData was saved");

            assert.deepEqual(this.oConfigEmitStub.getCall(0).args, aExpectedEmitArgs, "Config.emit was called with correct args");
        }.bind(this));
    });

    QUnit.test("Resolves instantly when hideEmptySpaces is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(false);
        // Act
        return utils.setHideEmptySpacesEnabled(true).then(function () {
            // Assert
            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 0, "PersContainer was not fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 0, "getPersData was not called");
            assert.strictEqual(this.oSetPersDataStub.callCount, 0, "setPersData was not called");
            assert.deepEqual(this.oConfigEmitStub.callCount, 0, "Config.emit was not called");
        }.bind(this));
    });

    QUnit.test("Rejects when PersContainer fetch fails", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetUserSettingPersContainerStub.returns(Promise.reject("PersContainer fetch failed"));
        // Act
        return utils.setHideEmptySpacesEnabled(true).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "PersContainer fetch failed", "Rejected wit correct error");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 0, "getPersData was not called");
            assert.strictEqual(this.oSetPersDataStub.callCount, 0, "setPersData was not called");
            assert.deepEqual(this.oConfigEmitStub.callCount, 0, "Config.emit was not called");
        }.bind(this));
    });

    QUnit.test("Rejects when getPersData fails", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().reject("getPersData failed").promise());
        // Act
        return utils.setHideEmptySpacesEnabled(true).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "getPersData failed", "Rejected wit correct error");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "getPersData was called");
            assert.strictEqual(this.oSetPersDataStub.callCount, 0, "setPersData was not called");
            assert.deepEqual(this.oConfigEmitStub.callCount, 0, "Config.emit was not called");
        }.bind(this));
    });

    QUnit.test("Rejects when setPersData fails", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        this.oGetPersDataStub.returns(new jQuery.Deferred().resolve(undefined).promise());
        this.oSetPersDataStub.returns(new jQuery.Deferred().reject("setPersData failed").promise());
        // Act
        return utils.setHideEmptySpacesEnabled(false).catch(function (sError) {
            // Assert
            assert.strictEqual(sError, "setPersData failed", "Rejected wit correct error");

            assert.strictEqual(this.oGetUserSettingPersContainerStub.callCount, 1, "PersContainer was fetched");
            assert.strictEqual(this.oGetPersDataStub.callCount, 1, "getPersData was called");
            assert.strictEqual(this.oSetPersDataStub.callCount, 1, "setPersData was called");
            assert.deepEqual(this.oConfigEmitStub.callCount, 0, "Config.emit was not called");
        }.bind(this));
    });

    [
        { val: true, res: "NWBC" },
        { val: false, res: "FLP" }
    ].forEach(function (oFixture) {
        QUnit.test("hasNativeNavigationCapability detect Fiori Desktop Client (NWBC for Fiori UX), force via URL parameter with value '" + oFixture.val + "'", function (assert) {
            var sShellType,
                stub = sandbox.stub(utils, "isFeatureBitEnabled").callsFake(function () {
                    return oFixture.val;
                });

            sShellType = utils.getShellType();
            assert.strictEqual(sShellType, oFixture.res, " value matches expected result");
            stub.restore();
        });
    });

    QUnit.module("toExternalWithParameters", {
        beforeEach: function () {
            return Container.init("local")
                .then(function () {
                    return Container.getServiceAsync("Navigation").then(function (oNavigationService) {
                        this.navigateStub = sandbox.stub(oNavigationService, "navigate").resolves();
                    }.bind(this));
                }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Hash gets build correctly for semanticObject and action.", function (assert) {
        // Arrange
        var sSemanticObject = "SemanticObject";
        var sAction = "action";
        var aParameters = [];
        var aExpectedArguments = [
            {
                target: {
                    shellHash: "SemanticObject-action"
                }
            }
        ];

        // Act
        return utils.toExternalWithParameters(sSemanticObject, sAction, aParameters).then(function () {
            // Assert
            assert.strictEqual(this.navigateStub.callCount, 1, "navigate was called exactly once.");
            assert.deepEqual(this.navigateStub.args[0], aExpectedArguments, "navigate was called with the correct arguments.");
        }.bind(this));
    });

    QUnit.test("Hash gets build correctly for semanticObject, action, and parameters.", function (assert) {
        // Arrange
        var sSemanticObject = "SemanticObject";
        var sAction = "action";
        var aParameters = [
            { Key: "a", Value: "someValue" },
            { Key: "b", Value: "someOtherValue" }
        ];
        var aExpectedArguments = [
            {
                target: {
                    shellHash: "SemanticObject-action?a=someValue&b=someOtherValue"
                }
            }
        ];

        // Act
        return utils.toExternalWithParameters(sSemanticObject, sAction, aParameters).then(function () {
            // Assert
            assert.strictEqual(this.navigateStub.callCount, 1, "navigate was called exactly once.");
            assert.deepEqual(this.navigateStub.args[0], aExpectedArguments, "navigate was called with the correct arguments.");
        }.bind(this));
    });

    QUnit.test("Hash gets build correctly for semanticObject, action and parameters with action containing an innerAppRoute.", function (assert) {
        // Arrange
        var sSemanticObject = "SemanticObject";
        var sAction = "action&/someInnerAppRoute";
        var aParameters = [
            { Key: "a", Value: "someValue" },
            { Key: "b", Value: "someOtherValue" }
        ];
        var aExpectedArguments = [
            {
                target: {
                    shellHash: "SemanticObject-action?a=someValue&b=someOtherValue&/someInnerAppRoute"
                }
            }
        ];

        // Act
        return utils.toExternalWithParameters(sSemanticObject, sAction, aParameters).then(function () {
            // Assert
            assert.strictEqual(this.navigateStub.callCount, 1, "navigate was called exactly once.");
            assert.deepEqual(this.navigateStub.args[0], aExpectedArguments, "navigate was called with the correct arguments.");
        }.bind(this));
    });

    QUnit.module("sanitizeTimeoutDelay");

    QUnit.test("Does not alter values below the maximum", function (assert) {
        // Act
        var iResult = utils.sanitizeTimeoutDelay(123);
        // Assert
        assert.strictEqual(iResult, 123, "Returned the correct result");
    });

    QUnit.test("Returns the maximum when the value exceeds it", function (assert) {
        // Act
        var iResult = utils.sanitizeTimeoutDelay(123123123123);
        // Assert
        assert.strictEqual(iResult, 2147483647, "Returned the correct result");
    });

    QUnit.test("Throws an error when entering the wrong type", function (assert) {
        // Act & Assert
        assert.throws(utils.sanitizeTimeoutDelay.bind("123"), "Threw an error");
    });

    QUnit.module("getParamKeys");

    QUnit.test("No app state parameters in given in the URL", function (assert) {
        // Arrange
        const oExpectedResult = {
            aAppStateNamesArray: [],
            aAppStateKeysArray: []
        };

        // Act
        var oResult = utils.getParamKeys("some-url?param1=123");

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "No app state parameters found.");
    });

    QUnit.test("sap-intent-param parameter in given in the URL", function (assert) {
        // Arrange
        const oExpectedResult = {
            aAppStateNamesArray: ["sap-intent-param-data"],
            aAppStateKeysArray: ["someValue"]
        };

        // Act
        var oResult = utils.getParamKeys("some-url?sap-intent-param=someValue");

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "App state parameters returned as expected.");
    });

    QUnit.test("sap-xapp-state & sap-iapp-state parameter in given in the URL", function (assert) {
        // Arrange
        const oExpectedResult = {
            aAppStateNamesArray: ["sap-xapp-state-data", "sap-iapp-state-data"],
            aAppStateKeysArray: ["someValue", "otherValue"]
        };

        // Act
        var oResult = utils.getParamKeys("some-url?sap-xapp-state=someValue&sap-iapp-state=otherValue");

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "App state parameters returned as expected.");
    });

    [{
        sTitle: "All params need to be excluded",
        sUrlInput: "http://www.dummy.com/?sap-ach=true&sap-ui-debug=true&sap-ui-fl-control-variant-id=1234&sap-ui2-wd-conf-id=1",
        sExpectedUrlOutput: "http://www.dummy.com/"
    }, {
        sTitle: "No param need to be excluded. URL remains the same",
        sUrlInput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&" +
            "sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-keepclientsession=true&sap-touch=0&sap-shell=FLP1.69.0-NWBC",
        sExpectedUrlOutput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&" +
            "sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-keepclientsession=true&sap-touch=0&sap-shell=FLP1.69.0-NWBC"
    }, {
        sTitle: "One param in the middle need to be excluded",
        sUrlInput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-ui-debug=true&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&" +
            "sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-touch=0&sap-shell=FLP1.69.0-NWBC",
        sExpectedUrlOutput: "http://www.dummy.com/?sap-client=120&sap-language=EN&sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&" +
            "sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-touch=0&sap-shell=FLP1.69.0-NWBC"
    }, {
        sTitle: "One param at the begining and one at the end",
        sUrlInput: "http://www.dummy.com/sap/bc/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-ui-debug=true&sap-client=120&sap-language=EN&" +
            "sap-theme=sap_corbu&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&" +
            "sap-theme=sap_fiori_3&sap-accessibility=false&sap-touch=0&sap-shell=FLP1.69.0-NWBC&sap-ui-tech-hint=false",
        sExpectedUrlOutput: "http://www.dummy.com/sap/bc/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=120&sap-language=EN&" +
            "sap-theme=sap_corbu&sap-theme=sap_fiori_3&P1=PV1&sap-intent-param=AS2QWPKYKPDRKXII9SR0UGPOHLTDV3REG314Q5Z7&" +
            "sap-xapp-state=ASJ8M9FNA9S459UXSXED9MJNBM5I9XOR3YRZOUTJ&sap-ie=edge&sap-accessibility=false&sap-touch=0&sap-shell=FLP1.69.0-NWBC"
    }].forEach(function (oFixture) {
        QUnit.test("filterURLParams: " + oFixture.sTitle, function (assert) {
            var urlAfterFiler = "";
            urlAfterFiler = utils.filterOutParamsFromLegacyAppURL(oFixture.sUrlInput);
            assert.strictEqual(urlAfterFiler, oFixture.sExpectedUrlOutput);
        });
    });

    QUnit.module("getThemingParameters", {
        beforeEach: () => {
            this.oThemingParametersStub = sandbox.stub(ThemingParameters, "get");
        },
        afterEach: () => {
            sandbox.restore();
        }
    });

    QUnit.test("Handles flow async in case parameters are sync available and only one parameter is requested", async (assert) => {
        // Arrange
        this.oThemingParametersStub.returns("value1");
        const aExpectedResult = [
            "value1"
        ];
        // Act
        const aResult = await utils.getThemingParameters(["param1"]);
        // Assert
        assert.deepEqual(aResult, aExpectedResult, "Resolved the correct result");
    });

    QUnit.test("Handles flow async in case parameters are async available", async (assert) => {
        // Arrange
        this.oThemingParametersStub.callsFake(({ callback }) => {
            callback({
                param1: "value1",
                param2: "value2"
            });
        });
        const aExpectedResult = [
            "value1",
            "value2"
        ];
        // Act
        const aResult = await utils.getThemingParameters(["param1", "param2"]);
        // Assert
        assert.deepEqual(aResult, aExpectedResult, "Resolved the correct result");
    });

    QUnit.test("Handles flow async in case parameters are async available, but undefined is returned", async (assert) => {
        // Arrange
        this.oThemingParametersStub.callsFake(({ callback }) => {
            callback(undefined);
        });
        const aExpectedResult = [
            undefined
        ];
        // Act
        const aResult = await utils.getThemingParameters(["param1"]);
        // Assert
        assert.deepEqual(aResult, aExpectedResult, "Resolved the correct result");
    });

    QUnit.test("Handles flow async in case parameters are sync available", async (assert) => {
        // Arrange
        this.oThemingParametersStub.returns({
            param1: "value1",
            param2: "value2"
        });
        const aExpectedResult = [
            "value1",
            "value2"
        ];
        // Act
        const aResult = await utils.getThemingParameters(["param1", "param2"]);
        // Assert
        assert.deepEqual(aResult, aExpectedResult, "Resolved the correct result");
    });

    QUnit.module("requireAsync", {
        afterEach: () => {
            sandbox.restore();
        }
    });

    QUnit.test("Rejects for non existent dependencies", async (assert) => {
        try {
            // Act
            await utils.requireAsync(["does/not/exist"]);
            assert.ok(false, "promise was rejected");
        } catch {
            // Assert
            assert.ok(true, "promise was rejected");
        }
    });

    QUnit.test("Resolves dependencies", async (assert) => {
        // Act
        const aResult = await utils.requireAsync(["sap/ushell/utils", "sap/ushell/Container"]);
        assert.strictEqual(aResult[0], utils, "Resolved utils");
        assert.strictEqual(aResult[1], Container, "Resolved container");
    });

    [
        { sUi5Version: "1.37.0-SNAPSHOT", expectedVersion: "1.37.0" },
        { sUi5Version: "2.0.0-SNAPSHOT", expectedVersion: "2.0.0" },
        { sUi5Version: "1.124.0-SNAPSHOT+001", expectedVersion: "1.124.0" },
        { sUi5Version: "1", expectedVersion: "1" },
        { sUi5Version: "2", expectedVersion: "2" },
        { sUi5Version: "1.37", expectedVersion: "1.37" },
        { sUi5Version: "0.0.1", expectedVersion: "0.0.1" },
        { sUi5Version: "1.0.0-alpha", expectedVersion: "1.0.0" },
        { sUi5Version: "0.1.0-alpha", expectedVersion: "0.1.0" },
        { sUi5Version: "1.36.3", expectedVersion: "1.36.3" },
        { sUi5Version: "8.0.0-SNAPSHOT", expectedVersion: "8.0.0" },
        { sUi5Version: "1.2.3.4.5", expectedVersion: "1.2.3" },
        // Weird edge cases, VersionInfo.load() should not return strings in this form
        // but I think they still should be documented here
        { sUi5Version: "1..0.1", expectedVersion: "1" },
        { sUi5Version: "1.0.a", expectedVersion: "1.0" },
        { sUi5Version: "-1.2.3", expectedVersion: "1.2.3" }
    ].forEach(function (oFixture) {
        QUnit.test("getUi5Version: returns expected number when UI5 version is " + oFixture.sUi5Version, async function (assert) {
            var oGetVersionStub = sandbox.stub(VersionInfo, "load").resolves({ version: oFixture.sUi5Version });

            var sVersion = await utils.getUi5Version();

            assert.strictEqual(sVersion, oFixture.expectedVersion, "returned expected version");

            oGetVersionStub.restore();
        });
    });

    QUnit.module("deepFreeze", {
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Freezes an object", async function (assert) {
        // Arrange
        const oInputObject = {
            a: 1,
            b: {
                c: 2
            }
        };

        // Act
        const oReturnValue = utils.deepFreeze(oInputObject);
        // Assert
        assert.strictEqual(oReturnValue, oInputObject, "Returned the same object");

        assert.throws(() => {
            oInputObject.a = 2;
        }, "Throws an error when trying to change a property");

        assert.throws(() => {
            oInputObject.b.d = 2;
        }, "Throws an error when trying to add a nested property");
    });

    QUnit.test("Freezes an array", async function (assert) {
        // Arrange
        const oInputObject = [{
            a: 1
        }];

        // Act
        const oReturnValue = utils.deepFreeze(oInputObject);
        // Assert
        assert.strictEqual(oReturnValue, oInputObject, "Returned the same object");

        assert.throws(() => {
            oInputObject[1] = 2;
        }, "Throws an error when trying to add an item");

        assert.throws(() => {
            oInputObject[0] = 2;
        }, "Throws an error when trying to change an item");
    });

    QUnit.module("awaitTimeout", {
        beforeEach: async function () {
            sandbox.useFakeTimers();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Awaits the timeout with the provided value", async function (assert) {
        // Arrange
        const done = assert.async();
        const iTimeBefore = Date.now();
        // Act
        utils.awaitTimeout(5000).then(() => {
            // Assert
            assert.strictEqual(Date.now() - iTimeBefore, 5000, "Resolved after 5 seconds");
            done();
        });
        sandbox.clock.runAll();
    });

    QUnit.test("Awaits the timeout with the default value", async function (assert) {
        // Arrange
        const done = assert.async();
        const iTimeBefore = Date.now();
        // Act
        utils.awaitTimeout().then(() => {
            // Assert
            assert.strictEqual(Date.now() - iTimeBefore, 0, "Resolved after 5 seconds");
            done();
        });
        sandbox.clock.runAll();
    });
});
