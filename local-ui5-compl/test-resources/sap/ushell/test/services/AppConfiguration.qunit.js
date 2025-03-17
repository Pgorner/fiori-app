// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for AppConfiguration
 */
sap.ui.define([
    "sap/base/i18n/ResourceBundle",
    "sap/m/Button",
    "sap/ui/Device",
    "sap/ui/core/Element",
    "sap/ui/thirdparty/sinon-4",
    "sap/ushell/Container",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/utils",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/base/i18n/Localization",
    "sap/ushell/test/utils"
], function (
    ResourceBundle,
    Button,
    Device,
    Element,
    sinon,
    Container,
    EventHub,
    ushellLibrary,
    AppConfiguration,
    fioriDemoConfig, // required for globals used in this test
    ushellUtils,
    Config,
    ushellResources,
    Localization,
    testUtils
) {
    "use strict";

    // shortcut for sap.ushell.AppType
    const AppType = ushellLibrary.AppType;

    /* global QUnit, hasher  */

    const sandbox = sinon.createSandbox();

    function createFakeComponentHandle (oManifest) {
        return {
            getInstance: sandbox.stub().returns({
                getManifest: sandbox.stub().returns(oManifest),
                getManifestEntry: sandbox.stub().callsFake((sKey) => {
                    switch (sKey) {
                        case "/sap.app/applicationVersion/version":
                            return "version";
                        case "sap.app":
                        case "sap.ui":
                        case "sap.fiori":
                            return oManifest[sKey];
                        default:
                    }
                }),
                _getManifestEntry: sandbox.stub().callsFake((sKey, bMerge) => {
                    if (bMerge && sKey === "/sap.ui5/config") {
                        return {
                            title: "Title from configuration",
                            icon: "Icon URL from configuration",
                            homeScreenIconTablet: "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png"
                        };
                    }
                })
            }),
            getMetadata: function () {
                return {
                    getComponentName: function () { return "Lib Name"; }
                };
            }
        };
    }

    QUnit.module("AppConfiguration", {
        beforeEach: async function () {
            sandbox.stub(window.history, "back");

            await Container.init("local");
            this.UserRecentsService = await Container.getServiceAsync("UserRecents");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    function getFaviconFromDom () {
        let favicon;
        const nodeList = document.getElementsByTagName("link");

        for (let i = 0; i < nodeList.length; i++) {
            if ((nodeList[i].getAttribute("rel") === "icon") || (nodeList[i].getAttribute("rel") === "shortcut icon")) {
                favicon = nodeList[i].getAttribute("href");
            }
        }
        return favicon;
    }

    function getMetadataObject (applicationUrl, oComponentHandle) {
        const oService = AppConfiguration;
        return oService.getMetadata({
            additionalInformation: "SAPUI5.Component=componentName",
            applicationType: "URL",
            url: applicationUrl,
            componentHandle: oComponentHandle
        });
    }

    QUnit.test("get Application name", (assert) => {
        const demoAppData = {
            additionalInformation: "SAPUI5.Component=AppNavSample",
            applicationType: "URL",
            url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?test=testParam",
            description: "AppNavSample "
        };

        const oService = AppConfiguration;
        assert.strictEqual(oService.getApplicationName(demoAppData), "AppNavSample");
    });

    QUnit.test("get Application url", (assert) => {
        const demoAppData = {
            additionalInformation: "SAPUI5.Component=AppNavSample",
            applicationType: "URL",
            url: "/ushell/test-resources/sap/ushell/demoapps/AppNavSample?test=testParam",
            description: "AppNavSample "
        };

        const oService = AppConfiguration;
        assert.strictEqual(oService.getApplicationUrl(demoAppData), "/ushell/test-resources/sap/ushell/demoapps/AppNavSample/");
    });

    /*
    // Disable the test until clarified why it fails in Jenkins only
    test("add Application settings button twice", async function (assert) {
        var oService = AppConfiguration;
        var oApp = { url: "app" };
        var oRenderer;
        var oContainer;
        var done = assert.async();

        oContainer = await Container.createRendererInternal("fiori2");
        oRenderer = Container.getRenderer("fiori2");
        // the requests queue used for requests that should be performed only after the application is rendered and is empty at the initial state.
        var q = oService.getApplicationRequestQueue();
        equals(q.length, 0, "the request queue should be 0");
        oService.setCurrentApplication(oApp);
        oService.setApplicationInInitMode();
        oService.addApplicationSettingsButtons([new Button({ text: "addTwiceButtonTest", id: "addTwiceButtonTest" })]);
        q = oService.getApplicationRequestQueue();
        // the application has not yet rendered, so the queue is filled with one request
        equals(q.length, 1, "the request queue should be 1");

        EventHub.emit("AppRendered", oApp);

        EventHub.wait("AppRendered").then(function () {
            // no the application is rendered and the queue should get read , causes it to get empty
            equals(q.length, 0, "the request queue should be 0");
            oService.addApplicationSettingsButtons([new Button({ text: "addTwiceButtonTest2", id: "addTwiceButtonTest2" })]);
            q = oService.getApplicationRequestQueue();
            // in this case, the application is already rendered and a button is added during its run time, hence the queue should not get filled.
            equals(q.length, 0, "the request queue should be 0");
            oRenderer.destroy();
            oContainer.destroy();
            done();
        });
    });
    */

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Application initialization flow with API calls to addApplicationSettingsButton", async (assert) => {
        const oService = AppConfiguration;
        const oApp1 = { url: "app1" };
        const oApp2 = { url: "app2" };
        const aButtons = [new Button({ text: "addButtonTest", id: "addButtonTest" })];

        Device.system.phone = true;

        // The function setCurrentApplication may be called by asynchronous processed in NavTargetResolutionInternal.
        // It has to be stubbed because we do not want any interference with the test process, otherwise
        // the aAppRequestsQueue might be cleared, leading to wrong assertions.
        // In this test, the current application is set via the original (wrapped) method of the stub.
        const oSetCurrentApplicationStub = sandbox.stub(AppConfiguration, "setCurrentApplication");
        oSetCurrentApplicationStub.wrappedMethod(oApp1);

        Container.createRendererInternal("fiori2");
        await testUtils.waitForEventHubEvent("RendererLoaded");

        const oRenderer = Container.getRendererInternal("fiori2");
        const oShowActionButtonStub = sandbox.stub(oRenderer, "showActionButton");

        // mock core-ext-light loading
        Element.getElementById("mainShell").getController()._loadCoreExt = sandbox.spy();
        EventHub.emit("AppRendered", oApp1);
        await testUtils.waitForEventHubEvent("AppRendered");

        // check scenario where the current app is already opened
        // in this case the API should be called with no delay
        oService.addApplicationSettingsButtons(aButtons);
        assert.equal(oShowActionButtonStub.callCount, 1, "showActionButton should be called as app is already opened");

        // check scenario where the current app is not opened
        // in this case the API should be called with delay
        oSetCurrentApplicationStub.wrappedMethod(oApp2);
        oService.setApplicationInInitMode();
        oService.addApplicationSettingsButtons(aButtons); // call to showActionButton is deferred as the application is in initMode
        assert.equal(oShowActionButtonStub.callCount, 1, "showActionButton should not be called as app is not yet opened");

        EventHub.emit("AppRendered", oApp2); // Implicitly executes AppConfiguration's applicationOpenedHandler
        await testUtils.waitForEventHubEvent("AppRendered");

        // after rendering, the buttons that were deferred due to initMode should have been added
        assert.equal(oShowActionButtonStub.callCount, 2, "showActionButton should be called when app is opened");
        // check scenario where the current app is not opened and failed in its initialization flow
        // after calling the API's, we check that those API's calls are not trigger on a different
        // app in this case the API should be called with delay
        oSetCurrentApplicationStub.wrappedMethod(oApp1);
        oService.addApplicationSettingsButtons(aButtons);
        assert.equal(oShowActionButtonStub.callCount, 3, "showActionButton should be called when app is opened");
        // set current app to different one as App1 failed
        oService.setApplicationInInitMode();
        oSetCurrentApplicationStub.wrappedMethod(oApp2);
        // trigger the application open event so the api will get called
        EventHub.emit("AppRendered", oApp2);
        await testUtils.waitForEventHubEvent("AppRendered");

        assert.equal(oShowActionButtonStub.callCount, 3, "showActionButton should not be called as API was called by a different app");

        await oRenderer.destroy();
        Device.system.phone = false;
    });

    QUnit.test("set Window Title", (assert) => {
        const oService = AppConfiguration;
        const newTitleName = "RenamedTitle";
        oService.setWindowTitle(newTitleName);
        assert.strictEqual(document.title, newTitleName);
    });

    QUnit.test("set Window Title with custom extension, simple string", (assert) => {
        sandbox.stub(Config, "last").withArgs("/core/shell/windowTitleExtension").returns("DEF");

        const oRTLStub = sandbox.stub(ushellResources, "getRTL").returns(false);
        AppConfiguration.setWindowTitle("ABC");
        assert.strictEqual(document.title, "ABC - DEF", "Window title is correct.");

        oRTLStub.returns(true);
        AppConfiguration.setWindowTitle("ABC");
        assert.strictEqual(document.title, "DEF - ABC", "Window title is correct in RTL mode.");
    });

    QUnit.test("set Window Title with custom extension, JSON string", (assert) => {
        const sJSON = "{\"en-GB\":\"en-GB\", \"de\":\"de\", \"default\":\"default\"}";
        sandbox.stub(Config, "last").withArgs("/core/shell/windowTitleExtension").returns(sJSON);
        sandbox.stub(ushellResources, "getRTL").returns(false);

        const oGetLanguageStub = sandbox.stub(Localization, "getLanguage").returns("en-GB");
        AppConfiguration.setWindowTitle("ABC");
        assert.strictEqual(document.title, "ABC - en-GB", "Window title is correct for language en-GB.");

        oGetLanguageStub.returns("EN");
        AppConfiguration.setWindowTitle("ABC");
        assert.strictEqual(document.title, "ABC - en-GB", "Window title is correct for language EN.");

        oGetLanguageStub.returns("DE-DE");
        AppConfiguration.setWindowTitle("ABC");
        assert.strictEqual(document.title, "ABC - de", "Window title is correct for language DE.");

        oGetLanguageStub.returns("ZZ");
        AppConfiguration.setWindowTitle("ABC");
        assert.strictEqual(document.title, "ABC - default", "Default window title is correct for other languages.");
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("set Window favicon", (assert) => {
        const oService = AppConfiguration;

        const oFaviconProperties = { favicon: "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0003_Manage_Tasks.ico" };
        oService.setIcons(oFaviconProperties);
        assert.strictEqual(getFaviconFromDom(), oFaviconProperties.favicon);
    });

    /**
     * Tested function: getMetadataObject
     *
     * Reading metadata from the component configuration when manifest does not exist
     */
    QUnit.test("Get metadata from application configuration", (assert) => {
        // the method will no longer load a component, this is done by UI5ComponentLoader

        // stub for "sap.ui.component.load" that returns the component object,
        // including the component's configuration and manifest
        const fakeComponentHandle = {
            getInstance: sandbox.stub().returns({
                getManifest: sandbox.stub().returns(),
                getManifestEntry: sandbox.stub().callsFake((sKey) => {
                    switch (sKey) {
                        case "/sap.app/applicationVersion/version":
                            return "version";
                        default:
                    }
                }),
                _getManifestEntry: sandbox.stub().callsFake((sKey, bMerge) => {
                    if (bMerge && sKey === "/sap.ui5/config") {
                        return {
                            title: "Configuration title",
                            icon: "Configuration icon URL"
                        };
                    }
                })
            }),
            getMetadata: function () {
                return {
                    getComponentName: function () { return "Lib Name"; }
                };
            }
        };

        const oMetadata = getMetadataObject("applicationUrl1", fakeComponentHandle);

        assert.ok(!!oMetadata);
    });

    /**
     * Tested function: getMetadataObject
     *
     * Verifies that component-configuration metadata is translated correctly in case that translation is required
     *
     * Value translation is required if the component configuration includes another property whose key is composed of the original key + the string "Resource".
     * e.g. For translating the value of the property "title" - there's another configuration property: "titleResource": "TITLE_KEY".
     * The value (e.g. "TITLE_KEY") is the translation key in the resource bundle
     */
    QUnit.test("Get translated metadata from application configuration", (assert) => {
        // stub for "sap.ui.component.load" that returns the component object,
        // including the component's configuration and manifest
        const oFakeComponentHandle = {
            getInstance: sandbox.stub().returns({
                getManifest: sandbox.stub().returns(),
                getManifestEntry: sandbox.stub().callsFake((sKey) => {
                    switch (sKey) {
                        case "/sap.app/applicationVersion/version":
                            return "version";
                        default:
                    }
                }),
                _getManifestEntry: sandbox.stub().callsFake((sKey, bMerge) => {
                    if (bMerge && sKey === "/sap.ui5/config") {
                        return {
                            title: "Configuration title",
                            titleResource: "TITLE_KEY",
                            icon: "Configuration icon URL",
                            resourceBundle: "Resource_bundle_URL.properties"
                        };
                    }
                })
            }),
            getMetadata: function () {
                return {
                    getComponentName: function () { return "Lib Name"; }
                };
            }
        };

        sandbox.stub(ResourceBundle, "create").returns({
            getText: function (key) {
                const oTranslations = {
                    TITLE_KEY: "translated configuration title"
                };

                return oTranslations[key];
            }
        });

        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(hasher, "getHash").returns("aaa-bbb");

        const oMetadata = getMetadataObject("applicationUrl2", oFakeComponentHandle);

        assert.ok(!!oMetadata);
        assert.strictEqual(oMetadata.title, "translated configuration title");
    });

    /**
     * Tested function: getMetadataObject
     *
     * Reading metadata from the manifest, if exists.
     * As for properties that does not exist in the manifest (in this test - the property "tablet") -
     * the value is taken from the component configuration (property name: "homeScreenIconTablet").
     */
    QUnit.test("Get metadata from application manifest", (assert) => {
        const manifestForTest = {
            _version: "100.100.000",
            "sap.ui": {
                technology: "UI5",
                icons: {
                    icon: "Icon URL from manifest",
                    favIcon: "favicon URL from manifest",
                    phone: "Phone app pic from manifest",
                    "phone@2": "Phone app pic2 from manifest",
                    // Tablet app pic property is removed form the manifest on purpose in order to verify that the value is taken from the application configuration
                    // "tablet": "Tablet app pic from manifest",
                    "tablet@2": "Tablet app pic2 from manifest"
                }
            },
            "sap.ui5": {},
            "sap.fiori": {},
            "sap.app": {
                title: "Title from manifest"
            }
        };

        // stub for "sap.ui.component.load" that returns the component object,
        // including the component's configuration and manifest
        const oFakeComponentHandle = createFakeComponentHandle(manifestForTest);

        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(hasher, "getHash").returns("aaa-bbb2");

        const oMetadata = getMetadataObject("applicationUrl3", oFakeComponentHandle);

        assert.ok(!!oMetadata);
        assert.strictEqual(oMetadata.title, "Title from manifest");
        assert.strictEqual(oMetadata["homeScreenIconTablet@2"], "applicationUrl3/Tablet app pic2 from manifest");
        assert.strictEqual(oMetadata.homeScreenIconTablet, "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png");
    });

    QUnit.test("addMetadata: sets the technical name in case of Web Dynpro", (assert) => {
        // arrange
        const oService = AppConfiguration;
        const oApplication = {
            url: "/sap/bc/webdynpro/sap/myWdApp?",
            applicationType: "WDA"
        };
        sandbox.stub(oService, "getApplicationName").returns("");
        sandbox.stub(oService, "getApplicationUrl").returns("");
        sandbox.stub(ushellUtils, "isApplicationTypeEmbeddedInIframe").returns(true);
        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(hasher, "getHash").returns("aaa-bb4");

        // act
        const oActualMetaData = oService.getMetadata(oApplication);

        // assert
        assert.equal(oActualMetaData.technicalName, "myWdApp", "technical name as expected");
    });

    QUnit.test("addMetadata: sets the technical name in case of Web Dynpro and host", (assert) => {
        // arrange
        const oService = AppConfiguration;
        const oApplication = {
            url: "https://anyHost:1234/sap/bc/webdynpro/sap/myWdApp?",
            applicationType: "WDA"
        };
        sandbox.stub(oService, "getApplicationName").returns("");
        sandbox.stub(oService, "getApplicationUrl").returns("");
        sandbox.stub(ushellUtils, "isApplicationTypeEmbeddedInIframe").returns(true);

        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(hasher, "getHash").returns("aaa-bb4");

        // act
        const oActualMetaData = oService.getMetadata(oApplication);

        // assert
        assert.equal(oActualMetaData.technicalName, "myWdApp", "technical name as expected");
    });

    QUnit.test("addMetadata: calls _setTitleFromNavResult when adding a UI5 app", (assert) => {
        // arrange
        const oService = AppConfiguration;
        const oFakeComponentHandle = createFakeComponentHandle();
        const oApplication = {
            componentHandle: oFakeComponentHandle
        };
        const oSetTitleFromNavResultStub = sandbox.stub(oService, "_setTitleFromNavResult");

        // act
        oService.addMetadata(oApplication, "dummy-key");

        // assert
        assert.strictEqual(oSetTitleFromNavResultStub.callCount, 1, "_setTitleFromNavResult was called once");
    });

    QUnit.test("Test App caching", (assert) => {
        const oService = AppConfiguration;
        const oComponentHandle = {
            getInstance: sandbox.stub().returns({
                getManifest: sandbox.stub(),
                getManifestEntry: sandbox.stub().callsFake((sKey) => {
                    switch (sKey) {
                        case "/sap.app/applicationVersion/version":
                            return "version";
                        default:
                    }
                }),
                _getManifestEntry: sandbox.stub().callsFake((sKey, bMerge) => {
                    if (bMerge && sKey === "/sap.ui5/config") {
                        return {
                            title: "App Caching Test Title",
                                icon: "App Caching Test URL"
                        };
                    }
                })
            }),
            getMetadata: function () {
                return {
                    getComponentName: function () { return "Lib Name"; }
                };
            }
        };
        const oAppData = {
            title: "testApp",
            additionalInformation: "SAPUI5.Component=componentName",
            applicationType: "URL",
            url: "/some/url",
            componentHandle: oComponentHandle
        };

        window.hasher = window.hasher || { getHash: function () { } };
        const hasherStub = sandbox.stub(hasher, "getHash").returns("aaa-bbb3?a=1&b=2");
        const addMetadataSpy = sandbox.spy(oService, "addMetadata");

        const oRetrievedMetaData = oService.getMetadata(oAppData);
        assert.strictEqual(addMetadataSpy.callCount, 1, "App metadata was added");
        assert.strictEqual(oRetrievedMetaData.title, "App Caching Test Title", "Verify title in metadata");
        assert.strictEqual(oRetrievedMetaData.icon, "App Caching Test URL", "Verify title in metadata");

        hasherStub.resetHistory();
        // simulate navigation to the save app (same hash) but the parameters are in a different order.
        hasherStub.returns("aaa-bbb3?b=2&a=1");
        oService.getMetadata(oAppData);
        assert.strictEqual(addMetadataSpy.callCount, 1, "App metadata should not be added as it was already cached");

        hasherStub.resetHistory();
        // simulate navigation to the save app (hash is similar) but one parameter was removed.
        hasherStub.returns("aaa-bbb3?a=1");
        oService.getMetadata(oAppData);
        assert.strictEqual(addMetadataSpy.callCount, 2, "App metadata should be added as it the parameters of the hash are different");
    });

    QUnit.test("Test App caching - metadata is updated if not complete", (assert) => {
        // due to the complex life cycle and the global nature of the AppConfiguration service, application metadata is
        // mainly filled by side effects; this should be cleaned up completely; for now, we ensure that there are no stale
        // cache entries with incomplete UI5 component metadata if the metadata was requested before the UI5 component was loaded
        // see internal BCP 241372 / 2016

        const oService = AppConfiguration;

        const manifestForTest = {
            _version: "100.100.000",
            "sap.ui": {
                technology: "UI5"
            },
            "sap.ui5": {},
            "sap.fiori": {},
            "sap.app": {
                title: "Title from manifest"
            }
        };

        // stub for "sap.ui.component.load" that returns the component object,
        // including the component's configuration and manifest
        const oFakeComponentHandle = {
            getInstance: sandbox.stub().returns({
                getManifest: sandbox.stub().returns(manifestForTest),
                getManifestEntry: sandbox.stub().callsFake((sKey) => {
                    switch (sKey) {
                        case "/sap.app/applicationVersion/version":
                            return "version";
                        case "sap.app":
                        case "sap.ui":
                        case "sap.fiori":
                            return manifestForTest[sKey];
                        default:
                    }
                }),
                _getManifestEntry: sandbox.stub().callsFake((sKey, bMerge) => {
                    if (bMerge && sKey === "/sap.ui5/config") {
                        return {
                            title: "Title from configuration",
                            fullWidth: true,
                            homeScreenIconTablet: "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png"
                        };
                    }
                })
            }),
            getMetadata: function () {
                return {
                    getComponentName: function () { return "Lib Name"; }
                };
            }
        };
        const addMetadataSpy = sandbox.spy(oService, "addMetadata");
        let oRetrievedMetaData;
        const oAppData = {
            text: "Title from app data",
            additionalInformation: "SAPUI5.Component=componentName",
            applicationType: "URL",
            url: "/some/url",
            componentHandle: undefined // initially undefined
        };

        // need a unique hash because the service is a singleton
        window.hasher = window.hasher || { getHash: function () { } };
        sandbox.stub(hasher, "getHash").returns("test-MetadataUpdateIfNotComplete?a=1&b=2");

        // first call to getMetadata - should fill cache, but metadata should be incomplete
        oRetrievedMetaData = oService.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 1, "Expected addMetaData was called once");
        assert.strictEqual(oRetrievedMetaData.complete, false, "Expected metadata complete flag set to false if requested before ui5 component loaded");
        assert.strictEqual(oRetrievedMetaData.title, "Title from app data", "Expected title from application data if requested before ui5 component loaded");
        assert.ok(!oRetrievedMetaData.fullWidth, "Expected fullWidth to be falsy if requested before ui5 component loaded");

        // second call to getMetadata - should fill cache, but metadata should still be incomplete
        oRetrievedMetaData = oService.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 2, "Expected addMetaData was called twice");
        assert.strictEqual(oRetrievedMetaData.complete, false, "Expected metadata complete flag set to false if requested before ui5 component loaded");
        assert.strictEqual(oRetrievedMetaData.title, "Title from app data", "Expected title from application data if requested before ui5 component loaded");
        assert.ok(!oRetrievedMetaData.fullWidth, "Expected fullWidth to be falsy if requested before ui5 component loaded");

        // now set the component handle and call getMetadata again - should be set to complete now and contain metadata from component
        oAppData.componentHandle = oFakeComponentHandle;

        oRetrievedMetaData = oService.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 3, "Expected addMetaData was called 3 times");
        assert.strictEqual(oRetrievedMetaData.complete, true, "Expected metadata complete flag set to true if requested after ui5 component loaded");
        assert.strictEqual(oRetrievedMetaData.title, "Title from manifest", "Expected title from component manifest if requested after ui5 component loaded");
        assert.strictEqual(oRetrievedMetaData.fullWidth, true, "Expected fullWidth from component manifest (config) if requested after ui5 component loaded");

        // now we call getMetadata once again and expect that addMetadata is not called anymore, because the data is now complete and fetched from cache
        oRetrievedMetaData = oService.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 3, "Expected addMetaData was called 3 times");
        assert.strictEqual(oRetrievedMetaData.complete, true, "Expected metadata complete flag set to true if requested after ui5 component loaded");
        assert.strictEqual(oRetrievedMetaData.title, "Title from manifest", "Expected title from component manifest if requested after ui5 component loaded");
        assert.strictEqual(oRetrievedMetaData.fullWidth, true, "Expected fullWidth from component manifest (config) if requested after ui5 component loaded");
    });

    QUnit.test("Test getMetadata works as expected", (assert) => {
        const sHash = "test-getMetadata?a=1&b=2";
        const oHasherStub = sandbox.stub(hasher, "getHash").returns(sHash);

        const oAppData = {
            text: "Title from app data",
            additionalInformation: "SAPUI5.Component=componentName",
            applicationType: "URL",
            url: "/some/url",
            componentHandle: undefined // initially undefined
        };

        const oService = AppConfiguration;
        let oRetrievedMetaData;

        oRetrievedMetaData = oService.getMetadata(oAppData, "test-addMetadata?a=1&b=2");

        assert.strictEqual(oRetrievedMetaData.title, oAppData.text, "Expected title from application data");
        assert.strictEqual(oHasherStub.callCount, 0, "hasher.getHash was not called");

        oRetrievedMetaData = oService.getMetadata(oAppData);

        assert.strictEqual(oRetrievedMetaData.title, oAppData.text, "Expected title from application data");
        assert.strictEqual(oHasherStub.callCount, 1, "hasher.getHash was called");

    });

    QUnit.test("Test processing of the app hash", (assert) => {
        const oService = AppConfiguration;

        const Result1 = oService._getMemoizationKey("test-intent");
        const sExpectedResult = "test-intent";
        assert.strictEqual(Result1, sExpectedResult, "test hash processing when the Intent is parameterless");


        const Result2 = oService._getMemoizationKey("test-intent?b=2&a=1&c=3&e=5&d=4");
        const sExpectedResult2 = "test-intent?a=1&b=2&c=3&d=4&e=5";
        assert.strictEqual(Result2, sExpectedResult2, "test hash processing - assure the parameters are lexicographically ordered");

        const Result3 = oService._getMemoizationKey("test-intent?a={coordinate: {x: 1, y: 3}}");
        const sExpectedResult3 = "test-intent?a={coordinate: {x: 1, y: 3}}";
        assert.strictEqual(Result3, sExpectedResult3, "test hash processing - parameters with object structure");
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity general functionality with app icon", function (assert) {
        // add a new recent activity entry, verify that entry is added
        // all the properties are matching the newly added entry
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "Functionality test with icon";
        const sAppType = AppType.OVP;
        const sAppId = "#UI2Fiori2SampleApps-AppNavSample";
        const sUrl = "UI2Fiori2SampleApps-AppNavSample?foo=34567";
        const sIcon = "sap-icon//pool";

        const oApplicationObject1 = {
            icon: sIcon,
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let bObject1IsPresent,
            bObject2IsPresent,
            oRecentEntry1;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            const iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.appId === oApplicationObject1.appId) {
                    bObject1IsPresent = true;
                }
            });

            oAppConfigService.addActivity(oApplicationObject1).done(() => {
                this.UserRecentsService.getRecentActivity().then((aActivity) => {
                    aActivity.forEach((oItem) => {
                        if (oItem.appId === "#UI2Fiori2SampleApps-AppNavSample") {
                            if (oItem.url === "UI2Fiori2SampleApps-AppNavSample?foo=34567") {
                                oRecentEntry1 = oItem;
                                bObject2IsPresent = true;
                            }
                        }
                    });
                    assert.ok(!bObject1IsPresent, "New entry was not initially in the recent activity list");
                    assert.ok(bObject2IsPresent, "New entry is added to the recent activity list");
                    assert.strictEqual(aActivity.length, iNumOfEntries + 1, "New entry was added");
                    assert.strictEqual(oRecentEntry1.icon, sIcon, "The icon is properly set");
                    assert.strictEqual(oRecentEntry1.appType, sAppType, "The appType is properly set");
                    assert.strictEqual(oRecentEntry1.title, sTitle, "The title is properly set");
                    done();
                });
            });
        });
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity by BO application new entry", function (assert) {
        // a new entry should be created in the recent activities
        // one object is already exists in the service mock configuration with the same app id "Action-toappnavsample" but different URL
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "BO application";
        const sAppType = "FactSheet";
        const sAppId = "#Action-toappnavsample";
        const sUrl = "#Action-toappnavsample?foo=12245";

        const oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let bObject1IsPresent,
            bObject2IsPresent,
            iNumOfEntries,
            oRecentEntry1,
            oRecentEntry2;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.appId === sAppId) {
                    oRecentEntry1 = oItem;
                }
            });
        });

        oAppConfigService.addActivity(oApplicationObject1).done(() => {
            this.UserRecentsService.getRecentActivity().then((aActivity) => {
                aActivity.forEach((oItem) => {
                    if (oItem.appId === sAppId) {
                        if (oItem.url === sUrl) {
                            oRecentEntry2 = oItem;
                            bObject2IsPresent = true;
                        } else {
                            bObject1IsPresent = true;
                        }
                    }
                });
                oApplicationObject1.timestamp = oRecentEntry2.timestamp;
                assert.strictEqual(oRecentEntry2.appId, oRecentEntry1.appId, "New entry is added with the same app id");
                assert.notStrictEqual(oRecentEntry2.url, oRecentEntry1.url, "New entry is added with different url");
                assert.strictEqual(aActivity.length, iNumOfEntries + 1, "New entry is added");
                assert.ok(bObject2IsPresent && bObject1IsPresent, "Both entries are in the list");
                assert.deepEqual(oRecentEntry2, oApplicationObject1, "Most recent activity is oApplicationObject1");
                done();
            });
        });
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity by BO application update entry", function (assert) {
        // existing entry should be updated with newer timestamp
        // one object already exists in the service mock configuration with the same app id and same url
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "BO application";
        const sAppType = "FactSheet";
        const sAppId = "#Action-toappnavsample";
        const sUrl = "#Action-toappnavsample&/View2";

        const oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let oRecentEntry1,
            oRecentEntry2,
            iNumOfEntries;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.url === oApplicationObject1.url) {
                    oRecentEntry1 = oItem;
                }
            });
        });
        oAppConfigService.addActivity(oApplicationObject1).done(() => {
            this.UserRecentsService.getRecentActivity().then((aActivity) => {
                aActivity.forEach((oItem) => {
                    if (oItem.url === sUrl) {
                        oRecentEntry2 = oItem;
                    }
                });
                assert.strictEqual(oRecentEntry2.url, oRecentEntry1.url, "The url is the same");
                assert.ok(oRecentEntry2.timestamp > oRecentEntry1.timestamp, "The timestamp is different");
                assert.strictEqual(aActivity.length, iNumOfEntries, "Number of activities is the same");
                done();
            });
        });
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity by Search application", function (assert) {
        // in this case the search query is exactly like the one that already exists,
        // should be overwritten with newer timestamp - the comparison is done by title
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "Search query";
        const sAppType = "Search";
        const sAppId = "#Action-todefaultapp";
        const sUrl = "#Action-search&/searchterm=Sample%20App";

        const oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let oObject1,
            iNumOfEntries;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.url === sUrl) {
                    oObject1 = oItem;
                }
            });
            oAppConfigService.addActivity(oApplicationObject1).done(() => {
                this.UserRecentsService.getRecentActivity().then((aActivity) => {
                    aActivity.forEach((oItem) => {
                        if (oItem.url === sUrl) {
                            assert.ok(oItem.timestamp > oObject1.timestamp, "The entry is updated with new timestamp");
                            assert.strictEqual(oItem.title, sTitle, "Title is the same for both entries");
                            assert.strictEqual(aActivity.length, iNumOfEntries, "No new entry was added");
                            done();
                        }
                    });
                });
            });
        });
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity by Search application with different search query", function (assert) {
        // in this case the search query is exactly like the one that already exists,
        // should be overwritten with newer timestamp - the comparison is done by title
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "Search query";
        const sAppType = "Search";
        const sAppId = "#Action-todefaultapp";
        const sUrl = "#Action-todefaultapp?foo=1267";

        const oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let oObject1,
            oObject2,
            iNumOfEntries,
            bObject2IsPresent,
            bObject1IsPresent;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.appId === sAppId) {
                    oObject1 = oItem;
                }
            });
        });
        oAppConfigService.addActivity(oApplicationObject1).done(() => {
            this.UserRecentsService.getRecentActivity().then((aActivity) => {
                aActivity.forEach((oItem) => {
                    if (oItem.appId === sAppId) {
                        if (oItem.url === sUrl) {
                            oObject2 = oItem;
                            bObject2IsPresent = true;
                        } else {
                            bObject1IsPresent = true;
                        }
                    }
                });

                assert.ok(oObject2.timestamp > oObject1.timestamp, "New entry is added with different timestamp");
                assert.strictEqual(oObject2.title, sTitle, "The title of both entries is the same");
                assert.strictEqual(aActivity.length, iNumOfEntries + 1, "New entry is added to the list");
                assert.ok(bObject2IsPresent && bObject1IsPresent, "Both entries are in the list");
                done();
            });
        });
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity overrides entries with default appId", function (assert) {
        // in this case the entry with the sam appId should be overridden
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "BO application";
        const sAppType = "FactSheet";
        const sAppId = "#Action-toappnavsample";
        const sUrl = "#Action-toappnavsample&/View2";

        const oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let iNumOfEntries,
            oRecentEntry1;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.url === sUrl) {
                    oRecentEntry1 = oItem;
                }
            });
        });
        oAppConfigService.addActivity(oApplicationObject1).done(() => {
            this.UserRecentsService.getRecentActivity().then((aActivity) => {
                aActivity.forEach((oItem) => {
                    if (oItem.url === sUrl) {
                        assert.strictEqual(oItem.title, sTitle, true);
                        assert.ok(oItem.timestamp > oRecentEntry1.timestamp, true);
                        assert.strictEqual(oItem.appType, sAppType);
                        assert.strictEqual(aActivity.length, iNumOfEntries, true);
                        done();
                    }
                });
            });
        });
    });

    /**
     * @deprecated since 1.120
     */
    QUnit.test("Test Add Recent Activity, same appId, different url updates the existing entry", function (assert) {
        // existing entry should be updated with newer timestamp
        // one object is already exists in the service mock configuration with the same app id and same url
        const oAppConfigService = AppConfiguration;
        const done = assert.async();
        const sTitle = "Sample application";
        const sAppType = "Application";
        const sAppId = "#PurchaseOrder-display";
        const sUrl = "#PurchaseOrder-display?foo=128888";

        const oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        let oRecentEntry1,
            oRecentEntry2,
            iNumOfEntries;

        this.UserRecentsService.getRecentActivity().then((aActivity) => {
            iNumOfEntries = aActivity.length;
            aActivity.forEach((oItem) => {
                if (oItem.appId === sAppId && oItem.appType === sAppType) {
                    oRecentEntry1 = oItem;
                }
            });
        });
        oAppConfigService.addActivity(oApplicationObject1).done(() => {
            this.UserRecentsService.getRecentActivity().then((aActivity) => {
                aActivity.forEach((oItem) => {
                    if (oItem.appId === sAppId && oItem.appType === sAppType) {
                        oRecentEntry2 = oItem;
                    }
                });
                assert.notStrictEqual(oRecentEntry2.url, oRecentEntry1.url, "The url is not the same");
                assert.ok(oRecentEntry2.timestamp > oRecentEntry1.timestamp, "The timestamp is different");
                assert.strictEqual(aActivity.length, iNumOfEntries, "Number of activities is the same");
                done();
            });
        });
    });

    /**
     * @deprecated since 1.120.0
     */
    QUnit.test("setApplicationFullWidth", (assert) => {
        const oService = AppConfiguration;
        const oSetApplicationFullWidthInternalStub = sandbox.stub(oService, "setApplicationFullWidthInternal");

        oService.setApplicationFullWidth(false);

        assert.strictEqual(oSetApplicationFullWidthInternalStub.callCount, 1, "setApplicationFullWidthInternal was called exactly once");
        assert.deepEqual(oSetApplicationFullWidthInternalStub.getCall(0)?.args, [false], "setApplicationFullWidthInternal was called with correct arguments");
    });

    QUnit.test("setApplicationFullWidthInternal", (assert) => {
        const oService = AppConfiguration;
        const oEventHubEmitStub = sandbox.stub(EventHub, "emit");

        oService.setApplicationFullWidthInternal(false);

        const aArguments = oEventHubEmitStub.getCall(0)?.args;
        const sEventName = aArguments && aArguments[0];
        const bEventValue = aArguments && aArguments[1]?.bValue;
        assert.strictEqual(oEventHubEmitStub.callCount, 1, "EventHub.emit was called exactly once");
        assert.strictEqual(sEventName, "setApplicationFullWidth", "setApplicationFullWidthInternal was called with correct event name");
        assert.strictEqual(bEventValue, false, "setApplicationFullWidthInternal was called with correct event value");
    });

    QUnit.module("_setTitleFromNavResult", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the title from the nav result if the component is contained in the config setting", (assert) => {
        const oMetadataEntry = {
            technicalName: "generic.app.component",
            title: "Title from manifest"
        };
        const oNavTargetResolutionResult = {
            text: "Title from navigation target resolution result"
        };
        sandbox.stub(Config, "last")
            .withArgs("/core/shell/useAppTitleFromNavTargetResolution")
            .returns(["generic.app.component"]);

        AppConfiguration._setTitleFromNavResult(oMetadataEntry, oNavTargetResolutionResult);

        assert.strictEqual(oMetadataEntry.title, "Title from navigation target resolution result", "Title is overridden");
    });

    QUnit.test("Does not set the title from the nav result if the component is not contained in the config setting", (assert) => {
        const oMetadataEntry = {
            technicalName: "other.app.component",
            title: "Title from manifest"
        };
        const oNavTargetResolutionResult = {
            text: "Title from navigation target resolution result"
        };
        sandbox.stub(Config, "last")
            .withArgs("/core/shell/useAppTitleFromNavTargetResolution")
            .returns(["generic.app.component"]);

        AppConfiguration._setTitleFromNavResult(oMetadataEntry, oNavTargetResolutionResult);

        assert.strictEqual(oMetadataEntry.title, "Title from manifest", "Title is not overridden");
    });
});
