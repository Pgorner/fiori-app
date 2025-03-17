// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.BlueBoxHandler
 */
sap.ui.define([
    "sap/ui/VersionInfo",
    "sap/ui/core/EventBus",
    "sap/ushell/Container",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/utils",
    "sap/ui/thirdparty/URI",
    "sap/ushell/components/applicationIntegration/application/BlueBoxesCache",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/components/applicationIntegration/application/PostMessageUtils",
    "sap/ushell/components/applicationIntegration/application/WebGUIStatefulHandler",
    "sap/ushell/components/container/ApplicationContainer"
], function (
    VersionInfo,
    EventBus,
    Container,
    jQuery,
    ushellUtils,
    URI,
    BlueBoxesCache,
    BlueBoxHandler,
    PostMessageUtils,
    WebGUIStatefulHandler,
    ApplicationContainer
) {
    "use strict";

    /* global QUnit, sinon*/

    var sandbox = sinon.createSandbox({});

    QUnit.module("Basic Tests", {
        beforeEach: function (assert) {
            sandbox.stub(BlueBoxesCache, "_getWindowLocationHref").callsFake(() => {
                return "https://www.myfiorilaunchpad.com:1234/my/path/to/the/FLP";
            });
        },

        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("#history back navigation", function (assert) {
        [{
            validate: {
                sId: "test2",
                sUrl: "https://test2.html",
                exp: true
            }
        }, {
            validate: {
                sId: "test3",
                sUrl: "https://test3.html",
                exp: false
            }
        }].forEach(function (oFixture) {
            var oActiveApplication;

            BlueBoxHandler.init();
            oActiveApplication = BlueBoxHandler.getBlueBoxByUrl(oFixture.validate.sUrl);
            assert.ok(!oActiveApplication, "Not Expected cache element for URL:" + oFixture.validate.sUrl);
        });
    });

    QUnit.test("#test capabilities", function (assert) {
        var aCaps = [
            { service: "testsrvc1", action: "act1" },
            { service: "testsrvc1", action: "act2" },
            { service: "testsrvc1", action: "act3" },
            { service: "testsrvc2", action: "act1" }
        ];
        var oBB = new ApplicationContainer("app1", {});

        BlueBoxHandler.init();
        BlueBoxHandler.addNewBlueBox(oBB, { url: "http://www.test.com"});
        oBB.addBlueBoxCapabilities(aCaps);

        assert.ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act1"), "Validate Cap testsrvc1.act1");
        assert.ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act2"), "Validate Cap testsrvc1.act2");
        assert.ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act3"), "Validate Cap testsrvc1.act3");
        assert.ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc2", "act1"), "Validate Cap testsrvc1.act1");
        assert.ok(!BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc2", "act2"), "Validate Cap testsrvc2.act2 not active");
    });

    [{
        sTestDesc: "getBlueBoxCacheKey - empty string",
        sInputURL: "",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - undefined",
        sInputURL: undefined,
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '.'",
        sInputURL: ".",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../'",
        sInputURL: "../",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c'",
        sInputURL: "../a/b/c",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c/d.html'",
        sInputURL: "../a/b/c/d.html",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c/d.html?p=1'",
        sInputURL: "../a/b/c/d.html?p=1",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - '../a/b/c/d.html#aaa'",
        sInputURL: "../a/b/c/d.html#aaa",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'abcd'",
        sInputURL: "abcd",
        sBlueBoxCacheKey: "https://www.myfiorilaunchpad.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://abcd'",
        sInputURL: "http://abcd",
        sBlueBoxCacheKey: "http://abcd:80"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://abcd:1234'",
        sInputURL: "http://abcd:1234",
        sBlueBoxCacheKey: "http://abcd:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com:1234/a/b/c/d'",
        sInputURL: "http://www.test.com:1234/a/b/c/d",
        sBlueBoxCacheKey: "http://www.test.com:1234"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com/a/b/c/d:1234?p1=1&sap-iframe-hint=ABC&p2=2'",
        sInputURL: "http://www.test.com/a/b/c/d:1234?p1=1&sap-iframe-hint=ABC&p2=2",
        sBlueBoxCacheKey: "http://www.test.com:80@hint:ABC"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com#a-b?p=1&/inner-route'",
        sInputURL: "http://www.test.com#a-b?p=1&/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-iframe-hint=ABC#a-b?p=1&/inner-route'",
        sInputURL: "http://www.test.com?sap-iframe-hint=ABC#a-b?p=1&/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80@hint:ABC"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com#a-b?p=1&sap-iframe-hint=ABC&/inner-route'",
        sInputURL: "http://www.test.com#a-b?p=1&sap-iframe-hint=ABC/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-iframe-hint=ABC&sap-ui-version=1.84.0#a-b?p=1/inner-route'",
        sInputURL: "http://www.test.com:1234?sap-iframe-hint=ABC&sap-ui-version=1.84.0#a-b?p=1/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:1234@hint:ABC@uiver:1.84.0"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-ui-version=1.84.0#a-b?p=1/inner-route'",
        sInputURL: "https://www.test.com?sap-ui-version=1.84.0#a-b?p=1/inner-route",
        sBlueBoxCacheKey: "https://www.test.com:443@uiver:1.84.0"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com#a-b?p=1?sap-ui-version=1.84.0&/inner-route'",
        sInputURL: "https://www.test.com#a-b?p=1?sap-ui-version=1.84.0&/inner-route",
        sBlueBoxCacheKey: "https://www.test.com:443"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-async-loading=true&sap-iframe-hint=ABC&sap-ui-version=1.84.0#a-b?p=1/inner-route'",
        sInputURL: "http://www.test.com?sap-async-loading=true&sap-iframe-hint=ABC&sap-ui-version=1.84.0#a-b?p=1/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80@hint:ABC@uiver:1.84.0"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-async-loading=true&sap-iframe-hint=ABC&sap-ui-version=1.84.0#a-b?p=1/inner-route'",
        sInputURL: "http://www.test.com?sap-async-loading=false&sap-iframe-hint=ABC&sap-ui-version=1.84.0#a-b?p=1/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80@hint:ABC@uiver:1.84.0@async:false"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-async-loading=true&sap-iframe-hint=ABC&sap-enable-fesr=false#a-b?p=1/inner-route'",
        sInputURL: "http://www.test.com?sap-async-loading=false&sap-iframe-hint=ABC&sap-ui-version=1.84.0&sap-enable-fesr=false#a-b?p=1/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80@hint:ABC@uiver:1.84.0@async:false"
    }, {
        sTestDesc: "getBlueBoxCacheKey - 'http://www.test.com?sap-async-loading=true&sap-enable-fesr=true&sap-iframe-hint=ABC#a-b?p=1/inner-route'",
        sInputURL: "http://www.test.com?sap-async-loading=false&sap-iframe-hint=ABC&sap-enable-fesr=true&sap-ui-version=1.84.0#a-b?p=1/inner-route",
        sBlueBoxCacheKey: "http://www.test.com:80@hint:ABC@uiver:1.84.0@async:false@fesr:true"
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.sTestDesc, function (assert) {
            assert.strictEqual(BlueBoxesCache.getKeyFromUrl(oFixture.sInputURL), oFixture.sBlueBoxCacheKey);
        });
    });

    // function BlueBoxEntry (sObjName, sUrl) {
    //     var that = this;
    //     this.objName = sObjName;
    //     this.blueBoxCapabilities = {};
    //     this.url = sUrl;
    //     this.statefulType = 0;
    //     this.toString = sandbox.stub().returns(sObjName);
    //     this.getStatefulType = sandbox.stub().callsFake(function (sName, sValue) {
    //         return that.statefulType;
    //     });
    //     this.setIsStateful = sandbox.stub();
    //     this.setProperty = sandbox.stub().callsFake(function (sName, sValue) {
    //         if (sName === "currentAppUrl") {
    //             that.url = sValue;
    //         } else if (sName === "statefulType") {
    //             that.statefulType = sValue;
    //         } else if (sName === "blueBoxCapabilities") {
    //             that.blueBoxCapabilities = sValue;
    //         }
    //     });
    //     this.getCurrentAppUrl = sandbox.stub().callsFake(function () { return that.url; });
    //     this.getApplicationType = sandbox.stub().returns("GUI");
    //     this.getFrameworkId = sandbox.stub().returns("");
    //     this.getBlueBoxCapabilities = sandbox.stub().callsFake(function () { return that.blueBoxCapabilities; });
    // }

    function checkPoolsSize (assert, nStorage, nStoragePool, oStoragePoolObjects) {
        var oStorage1 = BlueBoxHandler._getStorageForDebug();
        assert.strictEqual(Object.keys(oStorage1.oBlueBoxesCache.oCacheStorage).length, nStorage);
        assert.strictEqual(Object.keys(oStorage1.oBlueBoxesCache.oKeepAliveIframePool).length, nStoragePool);
        Object.keys(oStoragePoolObjects).forEach(function (sKey) {
            assert.strictEqual(oStorage1.oBlueBoxesCache.oKeepAliveIframePool[sKey].length, oStoragePoolObjects[sKey]);
        });
    }

    function createTargetRes (sUrl) {
        return {
            url: sUrl,
            applicationType: "GUI"
        };
    }

    QUnit.test("blue boxes caches", function (assert) {
        var oStorage,
            oContainerToUse,
            sNewAppUrl;
        const oWDACont1 = new ApplicationContainer({
            id: "WDACont1",
            url: "http://www.srv1.com/guiApp1?sap-iframe-hint=WDA",
            currentAppUrl: "http://www.srv1.com/guiApp1?sap-iframe-hint=WDA",
            statefulType: BlueBoxHandler.STATEFUL_TYPES.FLP_V2
        });
        const oWDACont11KA = new ApplicationContainer({
            id: "WDACont11KA",
            url: "http://www.srv1.com/guiApp3?sap-iframe-hint=WDA&sap-keep-alive=true",
            currentAppUrl: "http://www.srv1.com/guiApp3?sap-iframe-hint=WDA&sap-keep-alive=true",
            isKeepAlive: true,
            statefulType: BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE
        });
        const oWDACont12KA = new ApplicationContainer({
            id: "WDACont12KA",
            url: "http://www.srv1.com/guiApp4?sap-iframe-hint=WDA&sap-keep-alive=true",
            currentAppUrl: "http://www.srv1.com/guiApp4?sap-iframe-hint=WDA&sap-keep-alive=true",
            isKeepAlive: true,
            statefulType: BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE
        });
        const oGUICont1 = new ApplicationContainer({
            id: "GUICont1",
            url: "http://www.srv2.com/guiApp2?sap-iframe-hint=GUI",
            currentAppUrl: "http://www.srv2.com/guiApp2?sap-iframe-hint=GUI",
            statefulType: BlueBoxHandler.STATEFUL_TYPES.GUI_V1
        });
        const oGUICont11KA = new ApplicationContainer({
            id: "GUICont11KA",
            url: "http://www.srv2.com/guiApp5?sap-iframe-hint=GUI&sap-keep-alive=true",
            currentAppUrl: "http://www.srv2.com/guiApp5?sap-iframe-hint=GUI&sap-keep-alive=true",
            isKeepAlive: true,
            statefulType: BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE
        });
        const oGUICont12KA = new ApplicationContainer({
            id: "GUICont12KA",
            url: "http://www.srv2.com/guiApp6?sap-iframe-hint=GUI&sap-keep-alive=true",
            currentAppUrl: "http://www.srv2.com/guiApp6?sap-iframe-hint=GUI&sap-keep-alive=true",
            isKeepAlive: true,
            statefulType: BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE
        });
        const oUI5Cont = new ApplicationContainer({
            id: "UI5Cont",
            url: "http://www.srv3.com/ui5App?sap-iframe-hint=UI5",
            currentAppUrl: "http://www.srv3.com/ui5App?sap-iframe-hint=UI5",
            statefulType: BlueBoxHandler.STATEFUL_TYPES.FLP_V2
        });

        const oDefaultCapabilities = [{
            service: "sap.ushell.services.service1",
            action: "action1"
        }, {
            service: "sap.ushell.services.service2",
            action: "action2"
        }];
        const oStatefulContainerCapabilities = [{
            service: "sap.ushell.services.appLifeCycle",
            action: "create"
        }, {
            service: "sap.ushell.services.appLifeCycle",
            action: "destroy"
        }];

        BlueBoxHandler.init();

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        checkPoolsSize(assert, 0, 0, {});
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp("http://www.srv1.com/guiApp100?sap-iframe-hint=WDA&sap-keep-alive=true");
        assert.strictEqual(oContainerToUse, undefined);
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp("http://www.srv2.com/guiApp200?sap-iframe-hint=GUI&sap-keep-alive=true");
        assert.strictEqual(oContainerToUse, undefined);

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        BlueBoxHandler.addNewBlueBox(oWDACont1, { url: oWDACont1.getUrl()});
        oWDACont1.addBlueBoxCapabilities(oDefaultCapabilities);
        oWDACont1.addBlueBoxCapabilities(oStatefulContainerCapabilities);

        checkPoolsSize(assert, 1, 0, {});
        oStorage = BlueBoxHandler._getStorageForDebug();
        assert.deepEqual(oWDACont1.getBlueBoxCapabilities(), {
            "sap.ushell.services.service1.action1": true,
            "sap.ushell.services.service2.action2": true,
            "sap.ushell.services.applifecycle.create": true,
            "sap.ushell.services.applifecycle.destroy": true
        });
        assert.deepEqual(oStorage.oBlueBoxesCache.oCacheStorage["http://www.srv1.com:80@hint:WDA"], {
            container: oWDACont1,
            key: "http://www.srv1.com:80@hint:WDA"
        });
        assert.strictEqual(oWDACont1.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2);

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        sNewAppUrl = "http://www.srv1.com:80/guiApp100?sap-iframe-hint=WDA&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        assert.deepEqual(oContainerToUse, oWDACont1);
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        checkPoolsSize(assert, 1, 0, {});
        oStorage = BlueBoxHandler._getStorageForDebug();
        assert.deepEqual(oWDACont1.getBlueBoxCapabilities(), {
            "sap.ushell.services.service1.action1": true,
            "sap.ushell.services.service2.action2": true
        });

        assert.deepEqual(oStorage.oBlueBoxesCache.oCacheStorage["http://www.srv1.com:80@hint:WDA@ka:true-http://www.srv1.com:80/guiApp100?sap-iframe-hint=WDA&sap-keep-alive=true"], {
            container: oWDACont1,
            key: "http://www.srv1.com:80@hint:WDA@ka:true-http://www.srv1.com:80/guiApp100?sap-iframe-hint=WDA&sap-keep-alive=true"
        });
        assert.strictEqual(oWDACont1.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        [oWDACont11KA, oWDACont12KA].forEach(function (oContainer) {
            BlueBoxHandler.addNewBlueBox(oContainer, { url: oContainer.getUrl() });
            oContainer.addBlueBoxCapabilities(oDefaultCapabilities);
        });
        [oGUICont1].forEach(function (oContainer) {
            BlueBoxHandler.addNewBlueBox(oContainer, { url: oContainer.getUrl() });
            oContainer.addBlueBoxCapabilities(oDefaultCapabilities);
            oContainer.addBlueBoxCapabilities(oStatefulContainerCapabilities);
        });
        [oGUICont11KA, oGUICont12KA].forEach(function (oContainer) {
            BlueBoxHandler.addNewBlueBox(oContainer, { url: oContainer.getUrl() });
            oContainer.addBlueBoxCapabilities(oDefaultCapabilities);
        });
        [oUI5Cont].forEach(function (oContainer) {
            BlueBoxHandler.addNewBlueBox(oContainer, { url: oContainer.getUrl() });
            oContainer.addBlueBoxCapabilities(oDefaultCapabilities);
            oContainer.addBlueBoxCapabilities(oStatefulContainerCapabilities);
            assert.strictEqual(oContainer.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2);
        });
        checkPoolsSize(assert, 7, 0, {});

        BlueBoxHandler.returnUnusedKeepAliveContainer(oWDACont1);
        checkPoolsSize(assert, 7, 0, {});
        assert.strictEqual(oWDACont1.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2);
        BlueBoxHandler.returnUnusedKeepAliveContainer(oWDACont11KA);
        assert.strictEqual(oWDACont11KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);
        checkPoolsSize(assert, 6, 1, {
            "http://www.srv1.com:80@hint:WDA": 1
        });

        sNewAppUrl = "http://www.srv1.com/guiApp101?sap-iframe-hint=WDA&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        assert.deepEqual(oContainerToUse, oWDACont11KA);
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        assert.strictEqual(oWDACont11KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);
        checkPoolsSize(assert, 7, 0, {});

        BlueBoxHandler.returnUnusedKeepAliveContainer(oWDACont12KA);
        assert.strictEqual(oWDACont12KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);
        checkPoolsSize(assert, 6, 1, {
            "http://www.srv1.com:80@hint:WDA": 1
        });

        BlueBoxHandler.returnUnusedKeepAliveContainer(oWDACont11KA);
        assert.strictEqual(oWDACont11KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);
        checkPoolsSize(assert, 5, 1, {
            "http://www.srv1.com:80@hint:WDA": 2
        });

        BlueBoxHandler.returnUnusedKeepAliveContainer(oGUICont11KA);
        assert.strictEqual(oGUICont11KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE);
        checkPoolsSize(assert, 4, 2, {
            "http://www.srv1.com:80@hint:WDA": 2,
            "http://www.srv2.com:80@hint:GUI": 1
        });

        BlueBoxHandler.returnUnusedKeepAliveContainer(oGUICont12KA);
        assert.strictEqual(oGUICont12KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE);
        checkPoolsSize(assert, 3, 2, {
            "http://www.srv1.com:80@hint:WDA": 2,
            "http://www.srv2.com:80@hint:GUI": 2
        });

        //---------------------------------------------------------------------
        //
        //---------------------------------------------------------------------
        sNewAppUrl = "http://www.srv1.com/guiApp102?sap-iframe-hint=WDA&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        assert.deepEqual(oContainerToUse, oWDACont12KA);
        assert.strictEqual(oWDACont12KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);
        checkPoolsSize(assert, 4, 2, {
            "http://www.srv1.com:80@hint:WDA": 1,
            "http://www.srv2.com:80@hint:GUI": 2
        });

        sNewAppUrl = "http://www.srv1.com/guiApp103?sap-iframe-hint=WDA&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        assert.deepEqual(oContainerToUse, oWDACont11KA);
        assert.strictEqual(oWDACont11KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.FLP_V2_KEEP_ALIVE);
        checkPoolsSize(assert, 5, 1, {
            "http://www.srv2.com:80@hint:GUI": 2
        });

        sNewAppUrl = "http://www.srv2.com/guiApp200?sap-iframe-hint=GUI&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        assert.deepEqual(oContainerToUse, oGUICont11KA);
        assert.strictEqual(oGUICont11KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE);
        checkPoolsSize(assert, 6, 1, {
            "http://www.srv2.com:80@hint:GUI": 1
        });

        sNewAppUrl = "http://www.srv2.com/guiApp201?sap-iframe-hint=GUI&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        assert.deepEqual(oContainerToUse, oGUICont12KA);
        assert.strictEqual(oGUICont12KA.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE);
        checkPoolsSize(assert, 7, 0, {});


        sNewAppUrl = "http://www.srv2.com/guiApp202?sap-iframe-hint=GUI&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        oContainerToUse.setProperty("currentAppUrl", sNewAppUrl, true);
        assert.deepEqual(oContainerToUse, oGUICont1);
        assert.strictEqual(oGUICont1.getStatefulType(), BlueBoxHandler.STATEFUL_TYPES.GUI_V1_KEEP_ALIVE);
        checkPoolsSize(assert, 7, 0, {});

        sNewAppUrl = "http://www.srv2.com/guiApp203?sap-iframe-hint=GUI&sap-keep-alive=true";
        oContainerToUse = BlueBoxHandler.findFreeContainerForNewKeepAliveApp(createTargetRes(sNewAppUrl));
        assert.strictEqual(oContainerToUse, undefined);
        checkPoolsSize(assert, 7, 0, {});
    });

    var NavigationService;
    QUnit.module("Handlers", {
        beforeEach: async function (assert) {
            var done = assert.async();
            sandbox.stub(VersionInfo, "load").resolves({ version: undefined });
            Container.init("local").then(function () {
                Container.getServiceAsync("Navigation").then(function (oNavigationService) {
                    NavigationService = oNavigationService;
                    done();
                });
            });
        },

        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            sandbox.restore();
            // delete Container;
        }
    });

    [{
        sTestDesc: "simple create",
        input: {
            url: "http://www.test.com",
            hash: "A-B",
            storageKey: "key1"
        },
        output: {
            paramKeysStubCallCount: 0,
            getServiceSpyCallCount: 1,
            getAppStateDataStubCallCount: 0,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com",
                sHash: "A-B"
            },
            appStateKeys: []
        }
    }, {
        sTestDesc: "simple create, POST enabled, no app state",
        input: {
            url: "http://www.test.com?sap-iframe-hint=GUI",
            hash: "A-B",
            storageKey: "key1",
            appStateData: undefined
        },
        output: {
            paramKeysStubCallCount: 1,
            getServiceSpyCallCount: 1,
            getAppStateDataStubCallCount: 0,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com?sap-iframe-hint=GUI",
                sHash: "A-B",
                "sap-flp-params": {
                    "sap-flp-url": "http://www.flp.com",
                    "system-alias": "ABC"
                }
            },
            appStateKeys: []
        }
    }, {
        sTestDesc: "simple create, POST enabled, no app state, WCF Application",
        input: {
            url: "http://www.test.com?sap-iframe-hint=WCF",
            hash: "A-B",
            storageKey: "key1",
            appStateData: undefined
        },
        output: {
            paramKeysStubCallCount: 1,
            getServiceSpyCallCount: 1,
            getAppStateDataStubCallCount: 0,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com?sap-iframe-hint=WCF",
                sHash: "A-B",
                "sap-flp-params": {
                    "sap-flp-url": "http://www.flp.com",
                    "system-alias": "ABC"
                }
            },
            appStateKeys: []
        }
    }, {
        sTestDesc: "simple create, POST enabled, with app state",
        input: {
            isPost: true,
            url: "http://www.test.com?sap-xapp-state=1234&sap-iapp-state=5678&sap-iframe-hint=WDA",
            hash: "A-B",
            storageKey: "key1",
            appStateData: [
                "1234data",
                "5678data"
            ]
        },
        output: {
            paramKeysStubCallCount: 1,
            getServiceSpyCallCount: 2,
            getAppStateDataStubCallCount: 1,
            appMessage: {
                sCacheId: "key1",
                sUrl: "http://www.test.com?sap-xapp-state=1234&sap-iapp-state=5678&sap-iframe-hint=WDA",
                sHash: "A-B",
                "sap-flp-params": {
                    "sap-xapp-state-data": "1234data",
                    "sap-iapp-state-data": "5678data",
                    "sap-flp-url": "http://www.flp.com",
                    "system-alias": "ABC"
                }
            },
            appStateKeys: [
                "sap-xapp-state-data",
                "sap-iapp-state-data"
            ]
        }
    }].forEach(function (oFixture) {
        QUnit.test(oFixture.sTestDesc, function (assert) {
            var done = assert.async();
            var publishEventStub,
                getFLPUrlStub,
                postMessageStub,
                hasherStub,
                getParamKeysSpy,
                getServiceAsyncSpy,
                getAppStateDataStub,
                oInnerControl,
                oTarget;

            BlueBoxHandler.init();

            publishEventStub = sandbox.stub(EventBus.getInstance(), "publish").returns();
            getFLPUrlStub = sandbox.stub(Container, "getFLPUrl").returns("http://www.flp.com");
            postMessageStub = sandbox.stub(PostMessageUtils, "postMessageToIframeApp").returns(Promise.resolve());
            hasherStub = sandbox.stub(window.hasher, "getHash").returns(oFixture.input.hash);
            getParamKeysSpy = sandbox.spy(ushellUtils, "getParamKeys");
            getAppStateDataStub = sandbox.stub(NavigationService, "getAppStateData").returns(Promise.resolve(oFixture.input.appStateData));
            getServiceAsyncSpy = sandbox.spy(Container, "getServiceAsync");

            oTarget = {};
            oInnerControl = new ApplicationContainer({
                systemAlias: "ABC",
                frameworkId: "",
                statefulType: BlueBoxHandler.STATEFUL_TYPES.FLP_V2
            });
            oInnerControl.addStyleClass("hidden");
            const oAddStyleClassStub = sandbox.stub(oInnerControl, "addStyleClass");
            const oRemoveStyleClassStub = sandbox.stub(oInnerControl, "removeStyleClass");

            oInnerControl.addBlueBoxCapabilities([]);
            sinon.spy(oInnerControl, "setProperty");
            getServiceAsyncSpy.resetHistory();

            BlueBoxHandler.statefulCreateApp(oInnerControl, oFixture.input.url, oFixture.input.storageKey, oTarget)
                .then(function () {
                    assert.equal(publishEventStub.callCount, 2, "call count needs to be 2");
                    [{
                        idx: 0,
                        nParams: 3,
                        p1: "launchpad",
                        p2: "appOpening",
                        p3: oTarget
                    }, {
                        idx: 1,
                        nParams: 3,
                        p1: "sap.ushell",
                        p2: "appOpened",
                        p3: oTarget
                    }].forEach(function (param) {
                        assert.equal(publishEventStub.args[param.idx].length, param.nParams, "only 3 parameters should be sent");
                        assert.equal(publishEventStub.args[param.idx][0], param.p1, "parameter should be 'sap.ushell'");
                        assert.equal(publishEventStub.args[param.idx][1], param.p2, "parameter should be 'appOpened'");
                        assert.deepEqual(publishEventStub.args[param.idx][2], param.p3, "target parameter is wrong");
                    });
                    assert.ok(oInnerControl.setProperty.args.find((aArg) => aArg[0] === "reservedParameters"), "setProperty should be called with reservedParameters");

                    assert.equal(getParamKeysSpy.callCount, oFixture.output.paramKeysStubCallCount, "call count needs to be 1");
                    if (getParamKeysSpy.callCount === 1) {
                        assert.equal(getParamKeysSpy.args[0][0], oFixture.input.url, "url parameter is wrong");
                        assert.deepEqual(getParamKeysSpy.getCall(0).returnValue.aAppStateNamesArray, oFixture.output.appStateKeys, "app state parameter");
                    } else if (getParamKeysSpy.callCount > 0) {
                        assert.ok(false, "utils.getParamKeys should not have been called");
                    }

                    assert.equal(getServiceAsyncSpy.callCount, oFixture.output.getServiceSpyCallCount, "call count to getService");
                    assert.equal(getAppStateDataStub.callCount,
                        oFixture.output.getAppStateDataStubCallCount, "call count to getAppStateData");
                    assert.equal(postMessageStub.callCount, 1, "post message called only once");
                    assert.ok(postMessageStub.calledWith(
                        oInnerControl,
                        "sap.ushell.services.appLifeCycle",
                        "create",
                        oFixture.output.appMessage,
                        true), "post called with the right parameters");

                    assert.deepEqual(oAddStyleClassStub.args, [["sapUShellApplicationContainerIframeHiddenButActive"], ["hidden"]], "The iframe visibility was changed during app creation");
                    assert.deepEqual(oRemoveStyleClassStub.args, [["hidden"], ["sapUShellApplicationContainerIframeHiddenButActive"]], "The iframe visibility was changed during app creation");

                    publishEventStub.restore();
                    getFLPUrlStub.restore();
                    postMessageStub.restore();
                    hasherStub.restore();
                    getParamKeysSpy.restore();
                    getAppStateDataStub.restore();
                    getServiceAsyncSpy.restore();
                    done();
                });
        });
    });

    QUnit.test("gui stateful container application creation", function (assert) {
        var fnDone = assert.async(),
            oContainer = {
                setProperty: sandbox.stub(),
                getId: sandbox.stub().returns("id1"),
                hasStyleClass: sandbox.stub().returns(true),
                toggleStyleClass: sandbox.stub(),
                getIframeWithPost: sandbox.stub().returns(false),
                setCurrentAppUrl: sandbox.stub(),
                setCurrentAppTargetResolution: sandbox.stub()
            },
            oAppLifeCycle = {
                navTo: sandbox.stub()
            },
            oTarget = {
                url: "scheme://host:1234/resource"
            };

        sandbox.stub(PostMessageUtils, "postMessageToIframeApp").callsFake(function () {
            return Promise.resolve();
        });
        sandbox.spy(ushellUtils, "appendSapShellParam");
        sandbox.spy(ushellUtils, "filterOutParamsFromLegacyAppURL");

        WebGUIStatefulHandler.guiStatefulCreateApp(oAppLifeCycle, oContainer, oTarget).then(function () {
            assert.ok(true, "promise was resolved");
            assert.equal(PostMessageUtils.postMessageToIframeApp.callCount, 2, "It calls Application.postMessageToIframeApp twice");
            assert.ok(PostMessageUtils.postMessageToIframeApp.getCall(0).calledWith(
                oContainer,
                "sap.gui",
                "triggerCloseSessionImmediately",
                {},
                true));
            assert.ok(PostMessageUtils.postMessageToIframeApp.getCall(1).calledWith(
                oContainer,
                "sap.its",
                "startService",
                {
                    url: "scheme://host:1234/resource"
                },
                true));
            assert.equal(oContainer.hasStyleClass.callCount, 1);
            assert.ok(oContainer.hasStyleClass.getCall(0).calledWith("sapUShellApplicationContainerShiftedIframe"));
            assert.equal(oContainer.toggleStyleClass.callCount, 1);
            assert.equal(oContainer.getIframeWithPost.callCount, 1);
            assert.equal(oContainer.setProperty.callCount, 3);
            assert.ok(oContainer.setProperty.getCall(0).calledWith("currentAppUrl", "scheme://host:1234/resource", true));
            assert.ok(oContainer.setProperty.getCall(1).calledWith("currentAppTargetResolution", oTarget, true));
            assert.ok(oContainer.setProperty.getCall(2).calledWith("iframeReusedForApp", true, true));
            assert.equal(ushellUtils.appendSapShellParam.callCount, 1);
            assert.ok(ushellUtils.appendSapShellParam.getCall(0).calledWith("scheme://host:1234/resource"));
            assert.equal(ushellUtils.filterOutParamsFromLegacyAppURL.callCount, 1);
        }, function () {
            assert.ok(false, "promise was not resolved - this is an error");
        }).then(fnDone);
    });

    [{
        sDesc: "WebGUIStatefulHandler.guiStatefulCreateApp - simple URL",
        input: {
            sInputUrl: "scheme://host:1234/resource",
            bPost: false
        },
        output: {
            body: {
                url: "scheme://host:1234/resource"
            },
            bGetAppStateDataCalled: false
        }
    }, {
        sDesc: "WebGUIStatefulHandler.guiStatefulCreateApp - url with app states",
        input: {
            sInputUrl: "scheme://host:1234/resource?p1=1&sap-iapp-state=100&p2=2&sap-xapp-state=101&sap-intent-param=102",
            bPost: true,
            aAppStatesData: ["data100", "data101", "data102"],
            systemAlias: "ABC"
        },
        output: {
            body: {
                "sap-flp-params": {
                    "sap-intent-param-data": "data100",
                    "sap-xapp-state-data": "data101",
                    "sap-iapp-state-data": "data102",
                    "sap-flp-url": "http://www.test.com#A-B",
                    "system-alias": "ABC"
                },
                url: "scheme://host:1234/resource?p1=1&sap-iapp-state=100&p2=2&sap-xapp-state=101&sap-intent-param=102"
            },
            bGetAppStateDataCalled: true,
            aAppStatesKeys: [["102", "101", "100"]]
        }
    }, {
        sDesc: "WebGUIStatefulHandler.guiStatefulCreateApp - post, url without app states",
        input: {
            sInputUrl: "scheme://host:1234/resource?p1=1&p2=2",
            bPost: true,
            systemAlias: "XYZ"
        },
        output: {
            body: {
                "sap-flp-params": {
                    "sap-flp-url": "http://www.test.com#A-B",
                    "system-alias": "XYZ"
                },
                url: "scheme://host:1234/resource?p1=1&p2=2"
            },
            bGetAppStateDataCalled: false
        }
    }
    ].forEach(function (oFixture) {
        QUnit.test(oFixture.sDesc, function (assert) {
            var fnDone = assert.async(),
                getAppStateDataStub = sandbox.stub(NavigationService, "getAppStateData").returns(Promise.resolve(oFixture.input.aAppStatesData)),
                getFLPUrlStub = sandbox.stub(Container, "getFLPUrl").returns("http://www.test.com#A-B");

            var iNow = Date.now();
            var oClock = sandbox.useFakeTimers(iNow);
            var oAppContainer = {
                getId: sandbox.stub().returns("CONTAINER_ID"),
                getDomRef: sandbox.stub().returns({
                    tagName: "IFRAME",
                    src: new URI(),
                    getAttribute: sandbox.stub().returns("id-dummy")
                }),
                _getIFrame: ApplicationContainer.prototype._getIFrame,
                _getIFrameUrl: ApplicationContainer.prototype._getIFrameUrl,
                getIframeWithPost: sandbox.stub().returns(oFixture.input.bPost),
                postMessageToIframe: ApplicationContainer.prototype.postMessageToIframe,
                createPostMessageRequest: ApplicationContainer.prototype.createPostMessageRequest,
                getSystemAlias: sandbox.stub().returns(oFixture.input.systemAlias),
                setProperty: sandbox.stub(),
                hasStyleClass: sandbox.stub().returns(true),
                toggleStyleClass: sandbox.stub(),
                setCurrentAppUrl: sandbox.stub(),
                setCurrentAppTargetResolution: sandbox.stub()
            };
            var oAppLifeCycle = {
                navTo: sandbox.stub()
            };
            var oTarget = {
                url: oFixture.input.sInputUrl
            };

            var oFormNode;
            if (oFixture.input.bPost) {
                oFormNode = document.createElement("form");
                oFormNode.setAttribute("id", "id-dummy");
                oFormNode.setAttribute("action", "http://www.dummy.abc");
                document.body.appendChild(oFormNode);
            }

            sandbox.stub(PostMessageUtils, "postMessageToIframeObject").callsFake(function () {
                return Promise.resolve();
            });

            // Act
            WebGUIStatefulHandler.guiStatefulCreateApp(oAppLifeCycle, oAppContainer, oTarget).then(function () {
                var oMessage = PostMessageUtils.postMessageToIframeObject.args[1][0];
                // Assert
                assert.equal(
                    oAppContainer.getDomRef.calledTwice,
                    true,
                    "A reference to the iframe that displays the application is accessed."
                );
                assert.equal(
                    oMessage.request_id,
                    iNow,
                    "The message sent to the iframe contains a `request_id` as expected"
                );
                assert.equal(
                    oMessage.service,
                    "sap.its.startService",
                    "The message sent to the iframe contains the mandatory `service` id 'sap.its.startService' as expected"
                );
                assert.deepEqual(
                    oMessage.body,
                    oFixture.output.body,
                    "The message sent to the iframe contains a `url` as expected"
                );

                if (oFixture.output.bGetAppStateDataCalled === true) {
                    assert.ok(getAppStateDataStub.calledOnce);
                    assert.deepEqual(
                        getAppStateDataStub.args[0],
                        oFixture.output.aAppStatesKeys,
                        "proper arguments");
                } else {
                    assert.ok(getAppStateDataStub.notCalled);
                }

                if (oFormNode) {
                    document.body.removeChild(oFormNode);
                }
            })
            .then(function () {
                oClock.restore();
                getAppStateDataStub.restore();
                getFLPUrlStub.restore();
                fnDone();
            });
        });
    });
});
