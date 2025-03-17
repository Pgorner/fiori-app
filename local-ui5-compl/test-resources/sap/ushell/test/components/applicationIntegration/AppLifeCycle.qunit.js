// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for "sap.ushell.components.applicationIntegration.AppLifeCycle"
 */
sap.ui.define([
    "sap/ui/core/theming/Parameters",
    "sap/ui/Device",
    "sap/ui/thirdparty/jquery",
    "sap/ui/util/Mobile",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/Storage",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/Container",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/utils",
    "sap/m/library",
    "sap/ushell/state/StateManager",
    "sap/ushell/ApplicationType",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/state/KeepAlive",
    "sap/ushell/ui5service/ShellUIServiceFactory",
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/ui/AppContainer"
], (
    ThemingParameters,
    Device,
    jQuery,
    Mobile,
    BlueBoxHandler,
    RelatedServices,
    AppLifeCycle,
    Storage,
    Config,
    EventHub,
    Container,
    AppConfiguration,
    ushellUtils,
    mobileLibrary,
    StateManager,
    ApplicationType,
    AppMeta,
    KeepAlive,
    ShellUIServiceFactory,
    Application,
    AppContainer
) => {
    "use strict";

    QUnit.config.reorder = false;

    // shortcut for sap.m.URLHelper
    const URLHelper = mobileLibrary.URLHelper;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.state.StateManager.LaunchpadState
    const LaunchpadState = StateManager.LaunchpadState;

    /* global QUnit, sinon */
    const sandbox = sinon.createSandbox({});

    sandbox.stub(ShellUIServiceFactory, "init").resolves();
    AppLifeCycle.init(null, false);
    sandbox.restore();

    QUnit.module("handleCreateApplicationContainer", {
        beforeEach: function () {
            this.getApplicationTypeStub = sandbox.stub();
            const oTargetAppContainer = {
                url: "test",
                getIsIframeValidTime: function () {
                    return {
                        time: 0
                    };
                },
                getIsInvalidIframe: () => false,
                getApplicationType: this.getApplicationTypeStub,
                setProperty: () => { },
                getDeffedControlCreation: sandbox.stub().resolves(),
                getStatefulType: sandbox.stub()
            };
            sandbox.stub(BlueBoxHandler, "getBlueBoxByUrl").returns(oTargetAppContainer);
            sandbox.stub(BlueBoxHandler, "isStatefulContainer").returns(true);
            sandbox.stub(BlueBoxHandler, "isIframeIsValidSupported").returns(false);
            sandbox.stub(AppLifeCycle, "_calculateKeepAliveMode").returns(false);
            this.calculateAppTypeStub = sandbox.stub(AppLifeCycle, "_calculateAppType");
            this.activeContainerStub = sandbox.stub(AppLifeCycle, "_activeContainer").returns({ container: { getId: function () { return "test"; } } });
            this.handleOpenStatefulStub = sandbox.stub(AppLifeCycle, "_handleOpenStateful").returns(Promise.resolve());
        },
        afterEach: function () {
            AppLifeCycle.unsetCurrentApplication();
            sandbox.restore();
        }
    });

    QUnit.test("when application type is a transaction", async function (assert) {
        // Arrange
        this.calculateAppTypeStub.returns(ApplicationType.TR.type);
        this.getApplicationTypeStub.returns(ApplicationType.TR.type);
        let arg;
        const oResolvedHashFragment = {
            applicationType: ApplicationType.TR.type,
            url: "test"
        };
        // Act
        await AppLifeCycle.handleCreateApplicationContainer(arg, arg, oResolvedHashFragment, () => { return { getIsFetchedFromCache: () => { return false; } }; });
        // Assert
        assert.ok(true, "handleCreateApplicationContainer executed without errors");
        assert.ok(this.activeContainerStub.calledOnce, "getActiveContainer called once");
        assert.ok(this.handleOpenStatefulStub.calledAfter(this.activeContainerStub), "handleOpenStateful called after getActiveContainer");
    });

    QUnit.test("when application type is a Webdynpro Application", async function (assert) {
        // Arrange
        this.calculateAppTypeStub.returns(ApplicationType.WDA.type);
        this.getApplicationTypeStub.returns(ApplicationType.WDA.type);
        let arg;
        const oResolvedHashFragment = {
            applicationType: ApplicationType.WDA.type,
            url: "test"
        };
        // Act
        await AppLifeCycle.handleCreateApplicationContainer(arg, arg, oResolvedHashFragment, () => { return { getIsFetchedFromCache: () => { return false; } }; });
        // Assert
        assert.ok(true, "handleCreateApplicationContainer executed without errors");
        assert.ok(this.activeContainerStub.calledOnce, "getActiveContainer called once");
        assert.ok(this.handleOpenStatefulStub.calledBefore(this.activeContainerStub), "handleOpenStateful called before getActiveContainer");
    });

    QUnit.test("CurrentApplication is overwritten by fallback if it doesn't fit the target", async function (assert) {
        // Arrange
        const oCurrentApplicationBefore = AppLifeCycle.getCurrentApplication();
        oCurrentApplicationBefore.appId = "application-Action-toAppBefore";
        // Act
        await AppLifeCycle.handleCreateApplicationContainer("Action-toApp", null, { url: "test" }, () => { return { getIsFetchedFromCache: () => { return false; } }; });
        // Assert
        const oCurrentApplication = AppLifeCycle.getCurrentApplication();
        assert.strictEqual(oCurrentApplication.appId, "application-Action-toApp", "AppId is correct");
        assert.notStrictEqual(oCurrentApplication, oCurrentApplicationBefore, "CurrentApplication was overwritten");
    });

    QUnit.test("CurrentApplication is not overwritten if it still fits the target", async function (assert) {
        // Arrange
        const oCurrentApplicationBefore = AppLifeCycle.getCurrentApplication();
        oCurrentApplicationBefore.appId = "application-Action-toApp";
        // Act
        await AppLifeCycle.handleCreateApplicationContainer("Action-toApp", null, { url: "test" }, () => { return { getIsFetchedFromCache: () => { return false; } }; });
        // Assert
        const oCurrentApplication = AppLifeCycle.getCurrentApplication();
        assert.strictEqual(oCurrentApplication.appId, "application-Action-toApp", "AppId is correct");
        assert.strictEqual(oCurrentApplication, oCurrentApplicationBefore, "CurrentApplication was not overwritten");
    });

    QUnit.test("CurrentApplication is not overwritten if it is set during container create", async function (assert) {
        // Arrange
        sandbox.stub(AppLifeCycle, "_addApplicationContainerToViewPort");
        sandbox.stub(AppLifeCycle, "_navTo");
        BlueBoxHandler.getBlueBoxByUrl.returns(null);
        BlueBoxHandler.isStatefulContainer.returns(false);
        let oCurrentApplicationDuringCreate;
        sandbox.stub(AppLifeCycle, "_createApplicationContainer").callsFake(() => {
            AppLifeCycle.unsetCurrentApplication();
            oCurrentApplicationDuringCreate = AppLifeCycle.getCurrentApplication();
            oCurrentApplicationDuringCreate.appId = "application-Action-toApp";

            return {
                getId: sandbox.stub(),
                getIsFetchedFromCache: () => { return false; },
                getApplicationType: () => { return ApplicationType.URL.type; },
                getDeffedControlCreation: sandbox.stub().resolves(),
                getStatefulType: sandbox.stub()
            };
        });
        // Act
        await AppLifeCycle.handleCreateApplicationContainer("Action-toApp", null, { url: "test" }, {});
        // Assert
        const oCurrentApplication = AppLifeCycle.getCurrentApplication();
        assert.strictEqual(oCurrentApplication.appId, "application-Action-toApp", "AppId is correct");
        assert.strictEqual(oCurrentApplication, oCurrentApplicationDuringCreate, "CurrentApplication was not overwritten");
    });

    QUnit.module("sap.ushell.components.applicationIntegration.AppLifeCycle", {
        beforeEach: function () {
            sandbox.stub(StateManager, "getShellMode");
            StateManager.getShellMode.returns(ShellMode.Default);

            sandbox.stub(StateManager, "getLaunchpadState");
            StateManager.getLaunchpadState.returns(LaunchpadState.Home);

            Config.emit("/core/shellHeader/rootIntent", "Shell-home");
        },
        afterEach: function () {
            sandbox.restore();
            Config._reset();
        }
    });

    QUnit.test("#_getViewPortControlByIntent", function (assert) {
        [{
            description: "When `oViewPortContainer` is falsy it returns the falsy value",
            oViewPortContainer: null
        }, {
            description: "When `oViewPortContainer` is truthy it calls `getViewPortControl` on it",
            oViewPortContainer: {
                getViewPortControl: sandbox.spy()
            }
        }].forEach((oFixture) => {
            AppLifeCycle.init(oFixture.oViewPortContainer, false);
            const oViewportControl = AppLifeCycle._getApplicationContainerFromViewPort();

            if (oFixture.oViewPortContainer) {
                assert.strictEqual(
                    AppLifeCycle._getViewPortContainer().getViewPortControl.called,
                    true,
                    oFixture.description
                );
            } else {
                assert.strictEqual(
                    oViewportControl,
                    undefined,
                    oFixture.description
                );
            }
        });
    });

    QUnit.test("test getAppIcon", function (assert) {
        let oMetadata;
        const metaDataStub = sandbox.stub(AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        let sAppIcon = AppMeta.getAppIcon();
        assert.equal(sAppIcon, "sap-icon://folder", "Icon default value as expected");

        metaDataStub.returns({ icon: "sap-icon://Fiori2/F0003" });

        sAppIcon = AppMeta.getAppIcon();
        assert.equal(sAppIcon, "sap-icon://Fiori2/F0003", "Icon default value as expected");
    });

    QUnit.test("test setAppIcons", function (assert) {
        const done = assert.async();
        const setIcons = sandbox.spy(Mobile, "setIcons");
        let oGetFaviconStub,
            oConfigLastStub;

        // No Custom Theme / Custom favicon
        AppMeta.setAppIcons();

        setTimeout(() => {
            const sModulePath = sap.ui.require.toUrl("sap/ushell");
            assert.ok(setIcons.calledOnce === true, "Test set icons called");
            assert.ok(setIcons.args[0][0].phone === `${sModulePath}/themes/base/img/launchicons/phone-icon_120x120.png`);
            assert.ok(setIcons.args[0][0]["phone@2"] === `${sModulePath}/themes/base/img/launchicons/phone-retina_180x180.png`);
            assert.ok(setIcons.args[0][0].tablet === `${sModulePath}/themes/base/img/launchicons/tablet-icon_152x152.png`);
            assert.ok(setIcons.args[0][0]["tablet@2"] === `${sModulePath}/themes/base/img/launchicons/tablet-retina_167x167.png`);
            assert.ok(setIcons.args[0][0].favicon === `${sModulePath}/themes/base/img/launchpad_favicon.ico`);

            // Custom Theme / Custom favicon
            oGetFaviconStub = sandbox.stub(AppMeta, "_getFavicon");
            oGetFaviconStub.returns({
                favicon: "customFavicon.png",
                isCustomFavicon: true
            });

            AppMeta.setAppIcons();

            setTimeout(() => {
                assert.ok(setIcons.callCount === 2, "Test set icons called");
                assert.ok(setIcons.args[1][0].phone === "customFavicon.png");
                assert.ok(setIcons.args[1][0]["phone@2"] === "customFavicon.png");
                assert.ok(setIcons.args[1][0].tablet === "customFavicon.png");
                assert.ok(setIcons.args[1][0]["tablet@2"] === "customFavicon.png");
                assert.ok(setIcons.args[1][0].favicon === "customFavicon.png");

                // No Custom Theme / Custom favicon via Config
                oConfigLastStub = sandbox.stub(Config, "last");
                oConfigLastStub.returns("customFavicon.png");

                done();
            }, 1000);
        }, 1000);
    });

    QUnit.test("change to compact display test ", function (assert) {
        const done = assert.async();
        const oMetadata = {
            compactContentDensity: true,
            cozyContentDensity: true
        };
        let metaDataStub;

        Container.init("local").then(() => {
            metaDataStub = sandbox.stub(AppConfiguration, "getMetadata");
            metaDataStub.returns(oMetadata);

            oMetadata.compactContentDensity = undefined;
            oMetadata.cozyContentDensity = undefined;
            AppMeta._applyContentDensityByPriority(true).then(() => {
                assert.ok(jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:compact, metadata.compact:true, metadata.cozy:true ==> compact");
                assert.ok(!jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:compact, metadata.compact:true, metadata.cozy:true ==> compact");
                AppMeta._applyContentDensityByPriority(false).then(() => {
                    assert.ok(!jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:cozy, metadata.compact:true, metadata.cozy:true ==> cozy");
                    assert.ok(jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:cozy, metadata.compact:true, metadata.cozy:true ==> cozy");

                    oMetadata.compactContentDensity = true;
                    oMetadata.cozyContentDensity = false;
                    AppMeta._applyContentDensityByPriority().then(() => {
                        assert.ok(jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:compact, metadata.compact:false, metadata.cozy:false ==> cozy");
                        assert.ok(!jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:compact, metadata.compact:false, metadata.cozy:false ==> cozy");
                        AppMeta._applyContentDensityByPriority(false).then(() => {
                            assert.ok(!jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
                            assert.ok(jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
                            AppMeta._applyContentDensityByPriority(true).then(() => {
                                assert.ok(jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
                                assert.ok(!jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");

                                oMetadata.compactContentDensity = false;
                                oMetadata.cozyContentDensity = true;
                                // sContentDensity = "cozy";
                                AppMeta._applyContentDensityByPriority().then(() => {
                                    assert.ok(!jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:compact, metadata.compact:false, metadata.cozy:true ==> cozy");
                                    assert.ok(jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:compact, metadata.compact:false, metadata.cozy:true ==> cozy");
                                    AppMeta._applyContentDensityByPriority(false).then(() => {
                                        assert.ok(!jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
                                        assert.ok(jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
                                        AppMeta._applyContentDensityByPriority(true).then(() => {
                                            assert.ok(jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
                                            assert.ok(!jQuery("body").hasClass("sapUiSizeCozy"), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");

                                            const userStub = sandbox.stub(Container.getUser(), "getContentDensity");
                                            userStub.returns("cozy");
                                            Device.system.combi = true;
                                            Device.support.touch = true;
                                            oMetadata.compactContentDensity = true;
                                            oMetadata.cozyContentDensity = false;

                                            AppMeta._applyContentDensityByPriority().then(() => {
                                                assert.ok(jQuery("body").hasClass("sapUiSizeCompact"), "user preferences should not have priority");
                                                userStub.returns("compact");
                                                oMetadata.compactContentDensity = false;
                                                oMetadata.cozyContentDensity = true;
                                                AppMeta._applyContentDensityByPriority().then(() => {
                                                    assert.ok(jQuery("body").hasClass("sapUiSizeCozy"), "user preferences should not have priority");

                                                    userStub.returns("cozy");
                                                    AppMeta._applyContentDensityClass(undefined).then(() => {
                                                        assert.ok(!jQuery("body").hasClass("sapUiSizeCompact"), "requested mode:Compact, metadata.compact:false, metadata.cozy:false ==> cozy");

                                                        done();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    // TODO: adjust test to persistency
    QUnit.test("test density calculation", function (assert) {
        // keep original values
        const sOrigCombi = Device.system.combi;
        const sOrigTouch = Device.support.touch;

        // change to combi device
        Device.system.combi = true;
        Device.support.touch = false;
        assert.ok(AppMeta._isCompactContentDensityByDevice(), "Non touch device should be in compact mode");

        Device.system.combi = false;
        Device.support.touch = true;
        assert.ok(!AppMeta._isCompactContentDensityByDevice(), "Non combi/touch device should be in cozy mode");

        // restore to original values
        Device.system.combi = sOrigCombi;
        Device.support.touch = sOrigTouch;
    });

    QUnit.test("test ShellUIService default values", function (assert) {
        const oMetadata = null;
        const metaDataStub = sandbox.stub(AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        const titleDefaultValue = AppLifeCycle.getShellUIService()._getTitleDefaultValue();
        const hierarchyDefaultValue = AppLifeCycle.getShellUIService()._getHierarchyDefaultValue();

        assert.equal(titleDefaultValue, "", "titleDefaultValue was not as expected");
        assert.ok(Array.isArray(hierarchyDefaultValue), "hierarchyDefaultValue was not as expected");
        assert.ok(hierarchyDefaultValue.length === 0, "hierarchyDefaultValue was not as expected");
    });

    QUnit.test("test ShellUIService default values for app-state", function (assert) {
        const oMetadata = {
            title: "App Title",
            cozyContentDensity: true
        };
        const aHierarchy = [{
            icon: "sap-icon://home",
            title: "Home",
            intent: "#Shell-home"
        }];
        const metaDataStub = sandbox.stub(AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        StateManager.getLaunchpadState.returns(LaunchpadState.App);

        let titleDefaultValue = AppLifeCycle.getShellUIService()._getTitleDefaultValue();
        let hierarchyDefaultValue = AppLifeCycle.getShellUIService()._getHierarchyDefaultValue("Shell-home");

        assert.equal(titleDefaultValue, "App Title", "titleDefaultValue was not as expected");
        assert.deepEqual(hierarchyDefaultValue, aHierarchy, "hierarchyDefaultValue was as expected");

        StateManager.getShellMode.returns(ShellMode.Embedded);

        titleDefaultValue = AppLifeCycle.getShellUIService()._getTitleDefaultValue();
        hierarchyDefaultValue = AppLifeCycle.getShellUIService()._getHierarchyDefaultValue("Shell-home");

        assert.equal(titleDefaultValue, "App Title", "titleDefaultValue was not as expected");
        assert.deepEqual(hierarchyDefaultValue, aHierarchy, "hierarchyDefaultValue was as expected");
    });

    QUnit.test("test _getFavicon without a value in the parameter", async function (assert) {
        const done = assert.async();
        const oThemingParametersStub = sandbox.stub(ThemingParameters, "get");

        oThemingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: "none"
            });
        });
        let oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, sap.ui.require.toUrl("sap/ushell/themes/base/img/launchpad_favicon.ico"));
        assert.equal(oResult.isCustomFavicon, false);

        oThemingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: ""
            });
        });
        oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, sap.ui.require.toUrl("sap/ushell/themes/base/img/launchpad_favicon.ico"));
        assert.equal(oResult.isCustomFavicon, false);

        oThemingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: undefined
            });
        });
        oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, sap.ui.require.toUrl("sap/ushell/themes/base/img/launchpad_favicon.ico"));
        assert.equal(oResult.isCustomFavicon, false);

        oThemingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: null
            });
        });
        oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, sap.ui.require.toUrl("sap/ushell/themes/base/img/launchpad_favicon.ico"));
        assert.equal(oResult.isCustomFavicon, false);

        done();
    });

    QUnit.test("test _getFavicon with a value in the parameter", async function (assert) {
        const done = assert.async();
        const themingParametersStub = sandbox.stub(ThemingParameters, "get");

        themingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: "url(../../someurl.jpeg)"
            });
        });
        let oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, "../../someurl.jpeg");
        assert.equal(oResult.isCustomFavicon, true);

        themingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: "../../someurl.jpeg"
            });
        });
        oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, "../../someurl.jpeg");
        assert.equal(oResult.isCustomFavicon, false);

        done();
    });

    QUnit.test("test _getFavicon with a value in the parameter", async function (assert) {
        const done = assert.async();
        const themingParametersStub = sandbox.stub(ThemingParameters, "get");
        const oConfigLastStub = sandbox.stub(Config, "last");

        themingParametersStub.callsFake(({ callback }) => {
            callback({
                sapUiShellFavicon: null
            });
        });

        oConfigLastStub.returns("customFavicon.png");

        const oResult = await AppMeta._getFavicon();
        assert.equal(oResult.favicon, "customFavicon.png");
        assert.equal(oResult.isCustomFavicon, true);

        done();
    });

    QUnit.test("test application lifecycle store", function (assert) {
        AppLifeCycle.init(null, false);

        const oMetadata = {
            title: "App Title",
            cozyContentDensity: true
        };

        sandbox.stub(AppConfiguration, "getMetadata").returns(oMetadata);
        sandbox.stub(AppMeta, "_applyContentDensityByPriority");


        const cmp1 = {
            oRt: {
                stop: sandbox.spy(),
                initialize: sandbox.spy()
            },
            getUi5ComponentName: function () {
                return "test";
            },
            getApplicationType: function () {
                return "XXX";
            },
            _getIFrame: function () {
                return {};
            },
            getRouter: function () {
                return this.oRt;
            },
            restore: sandbox.spy(),
            suspend: sandbox.spy(),
            getId: function () {
                return "testid1";
            }
        };
        const cmp2 = {
            oRt: {
                stop: sandbox.spy(),
                initialize: sandbox.spy()
            },
            getUi5ComponentName: function () {
                return "test";
            },
            getApplicationType: function () {
                return "XXX";
            },
            _getIFrame: function () {
                return {};
            },
            getRouter: function () {
                return this.oRt;
            },
            restore: sandbox.spy(),
            suspend: sandbox.spy(),
            getId: function () {
                return "testid2";
            }
        };

        AppLifeCycle._storeApp("testid1", {
            name: "oContainerTest",
            getUi5ComponentName: function () {
                return "cmp1testid1";
            },
            getApplicationType: function () {
                return "XXX";
            },
            _getIFrame: function () {
                return {};
            },
            setProperty: sandbox.stub()
        }, "testid1");
        AppLifeCycle._onComponentCreated({}, {}, {
            component: cmp1
        });
        AppLifeCycle._storeApp("testid2", {
            name: "oContainerTest",
            getUi5ComponentName: function () {
                return "cmp1testid2";
            },
            getApplicationType: function () {
                return "XXX";
            },
            _getIFrame: function () {
                return {};
            },
            setProperty: sandbox.stub()
        }, "testid2");
        AppLifeCycle._onComponentCreated({}, {}, {
            component: cmp2
        });
        AppLifeCycle._store("testid1");
        AppLifeCycle._store("testid2");
        AppLifeCycle._restore("testid1");
        AppLifeCycle._restore("testid2");
        AppLifeCycle._restore("testid1");

        // validate route call counts
        assert.ok(cmp1.oRt.stop.callCount === 1, "cmp1 stop called 1 time");
        assert.ok(cmp1.oRt.initialize.callCount === 2, "cmp1 initialize called 2 times");
        assert.ok(cmp2.oRt.stop.callCount === 1, "cmp2 stop called 1 time");
        assert.ok(cmp2.oRt.initialize.callCount === 1, "cmp2 initialize called 1 times");

        assert.ok(cmp1.suspend.callCount === 1, "cmp1 suspend called once");
        assert.ok(cmp2.suspend.callCount === 1, "cmp2 suspend called once");
        assert.ok(cmp1.restore.callCount === 2, "cmp1 restore called twice");
        assert.ok(cmp2.restore.callCount === 1, "cmp2 restore called once");
    });

    [{
        description: "storage size 2",
        sInstanceName: "Action-toApp4", // sAppId
        sInstanceHash: "#Action-toApp4?xxx=yyy",
        expectedCmpName: "oContainerTest4",
        expectedCmpNameDesc: "validate component oContainerTest4",
        expectedDestroyApplication: false,
        storageSize: 2,
        expected: {
            callCount: 3
        }
    }, {
        description: "storage size 3",
        sInstanceName: "Action-toApp5", // sAppId
        sInstanceHash: "#Action-toApp5?xxx=yyy&/state",
        expectedCmpName: "oContainerTest5",
        expectedCmpNameDesc: "validate component oContainerTest5",
        expectedDestroyApplication: true,
        storageSize: 3,
        expected: {
            callCount: 2
        }
    }].forEach((oFixture) => {
        QUnit.test(`Test getInMemoryInstance ${oFixture.description}`, function (assert) {
            const oMetadata = {
                title: "App Title",
                cozyContentDensity: true
            };

            AppLifeCycle.init(null, false);

            sandbox.stub(AppConfiguration, "getMetadata");
            AppConfiguration.getMetadata.returns(oMetadata);

            const cmp1 = {
                restore: sandbox.spy(),
                suspend: sandbox.spy(),
                oRt: {
                    stop: sandbox.spy(),
                    initialize: sandbox.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                getId: function () {
                    return "application-Action-toApp1-component";
                }
            };
            const cmp2 = {
                restore: sandbox.spy(),
                oRt: {
                    stop: sandbox.spy(),
                    initialize: sandbox.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sandbox.spy(),
                getId: function () {
                    return "application-Action-toApp2-component";
                }
            };
            const cmp3 = {
                restore: sandbox.spy(),
                oRt: {
                    stop: sandbox.spy(),
                    initialize: sandbox.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sandbox.spy(),
                getId: function () {
                    return "application-Action-toApp3-component";
                }
            };
            const cmp4 = {
                restore: sandbox.spy(),
                oRt: {
                    stop: sandbox.spy(),
                    initialize: sandbox.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sandbox.spy(),
                getId: function () {
                    return "application-Action-toApp4-component";
                }
            };
            const cmp5 = {
                restore: sandbox.spy(),
                oRt: {
                    stop: sandbox.spy(),
                    initialize: sandbox.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sandbox.spy(),
                getId: function () {
                    return "application-Action-toApp5-component";
                }
            };

            sandbox.stub(AppLifeCycle, "_destroyApplication").resolves(true);

            AppLifeCycle._storeApp(
                "application-Action-toApp1", // sStorageAppId
                {
                    name: "oContainerTest",
                    getUi5ComponentName: function () {
                        return "test1";
                    },
                    setProperty: sandbox.stub()
                }, // oApplicationContainer
                {}, // oResolvedHashFragment
                {
                    target: {
                        semanticObject: "Action",
                        action: "toApp1"
                    }
                }, // oParsedShellHash
                null // sKeepAliveMode
            );
            AppLifeCycle._onComponentCreated({}, {}, {
                component: cmp1
            });
            AppLifeCycle._storeApp(
                "application-Action-toApp2", // sStorageAppId
                {
                    name: "oContainerTest",
                    getUi5ComponentName: function () {
                        return "cmp1test1";
                    },
                    setProperty: sandbox.stub()
                }, // oApplicationContainer
                {}, // oResolvedHashFragment
                {
                    target: {
                        semanticObject: "Action",
                        action: "toApp2"
                    }
                }, // oParsedShellHash
                null // sKeepAliveMode
            );
            AppLifeCycle._onComponentCreated({}, {}, {
                component: cmp2
            });

            AppLifeCycle._storeApp(
                "application-Action-toApp3", // sStorageAppId
                {
                    name: "oContainerTest",
                    getUi5ComponentName: function () {
                        return "cmp1test1";
                    },
                    setProperty: sandbox.stub()
                }, // oApplicationContainer
                {}, // oResolvedHashFragment
                {
                    target: {
                        semanticObject: "Action",
                        action: "toApp3"
                    }
                }, // oParsedShellHash
                null // sKeepAliveMode
            );
            AppLifeCycle._onComponentCreated({}, {}, {
                component: cmp3
            });

            AppLifeCycle._storeApp(
                "application-Action-toApp4", // sStorageAppId
                {
                    name: "oContainerTest4",
                    getUi5ComponentName: function () {
                        return "cmp4test4";
                    },
                    setProperty: sandbox.stub()
                }, // oApplicationContainer
                {}, // oResolvedHashFragment
                {
                    target: {
                        semanticObject: "Action",
                        action: "toApp4"
                    },
                    params: {
                        xxx: ["yyy"]
                    }
                }, // oParsedShellHash
                null // sKeepAliveMode
            );
            AppLifeCycle._onComponentCreated({}, {}, {
                component: cmp4
            });

            AppLifeCycle._storeApp(
                "application-Action-toApp5", // sStorageAppId
                {
                    name: "oContainerTest5",
                    getUi5ComponentName: function () {
                        return "cmp5test1";
                    },
                    setProperty: sandbox.stub()
                }, // oApplicationContainer
                {}, // oResolvedHashFragment
                {
                    target: {
                        semanticObject: "Action",
                        action: "toApp5"
                    },
                    params: {
                        xxx: ["yyy"]
                    }
                }, // oParsedShellHash
                null // sKeepAliveMode
            );
            AppLifeCycle._onComponentCreated({}, {}, {
                component: cmp5
            });

            const oInst = AppLifeCycle._getInMemoryInstance(oFixture.sInstanceName, oFixture.sInstanceHash, false, false);

            assert.ok(oInst.container.name === oFixture.expectedCmpName, oFixture.expectedCmpNameDesc);
            assert.ok(oInst.destroyApplication === oFixture.expectedDestroyApplication, "_getInMemoryInstance returned expected destroyApplication value");
        });
    });

    QUnit.test("check closeKeepAliveApps - restricted apps", function (assert) {
        sandbox.stub(BlueBoxHandler, "isStatefulContainerSupportingKeepAlive").returns(false);
        sandbox.stub(BlueBoxHandler, "isReusableContainer").returns(false);
        Storage._clean();
        Storage.set("A", {
            appId: "A",
            container: {
                getId: sandbox.stub().returns("A"),
                getIsKeepAlive: sandbox.stub().returns(true)
            },
            keepAliveMode: "restricted"
        });
        Storage.set("B", {
            appId: "B",
            container: {
                getId: sandbox.stub().returns("B"),
                getIsKeepAlive: sandbox.stub().returns(true)
            },
            keepAliveMode: "restricted"
        });
        Storage.set("C", {
            appId: "C",
            container: {
                getId: sandbox.stub().returns("C"),
                getIsKeepAlive: sandbox.stub().returns(false)
            },
            keepAliveMode: "false"
        });
        Storage.set("D", {
            appId: "D",
            container: {
                getId: sandbox.stub().returns("D"),
                getIsKeepAlive: sandbox.stub().returns(false)
            },
            keepAliveMode: "false"
        });
        Storage.set("E", {
            appId: "E",
            container: {
                getId: sandbox.stub().returns("E"),
                getIsKeepAlive: sandbox.stub().returns(true)
            },
            keepAliveMode: "true"
        });
        Storage.set("F", {
            appId: "F",
            container: {
                getId: sandbox.stub().returns("F"),
                getIsKeepAlive: sandbox.stub().returns(true)
            },
            keepAliveMode: "restricted"
        });
        Storage.set("G", {
            appId: "G",
            container: {
                getId: sandbox.stub().returns("G"),
                getIsKeepAlive: sandbox.stub().returns(true)
            },
            keepAliveMode: "restricted"
        });

        AppLifeCycle.destroyApplication = sandbox.stub(AppLifeCycle, "_destroyApplication").callsFake(async (sAppId) => {
            Storage.removeById(sAppId);
        });

        const oSpyStorageRemove = sandbox.spy(Storage, "removeById");

        AppLifeCycle._closeKeepAliveApps((oApp) => {
            return (oApp.keepAliveMode === "restricted");
        });

        assert.equal(oSpyStorageRemove.callCount, 4);
        assert.equal(Storage.length(), 3);
    });

    [{
        input: {
            fullWidth: true
        },
        output: {
            classToggled: "sapUShellApplicationContainerLimitedWidth",
            isWidthLimited: false,
            message: "Application is set to full width"
        }
    }, {
        input: {
            fullWidth: false
        },
        output: {
            classToggled: "sapUShellApplicationContainerLimitedWidth",
            isWidthLimited: true,
            message: "Application is not set to full width"
        }
    }].forEach((configuration) => {
        QUnit.test("Testing setApplicationFullWidth", function (assert) {
            const done = assert.async();
            const currentApplication = {
                container: {
                    toggleStyleClass: sandbox.stub()
                }
            };
            const currentApplicationStub = sandbox.stub(AppLifeCycle, "getCurrentApplication");
            currentApplicationStub.returns(currentApplication);

            AppLifeCycle.init(null, false);

            AppConfiguration.setApplicationFullWidthInternal(configuration.input.fullWidth);
            setTimeout(() => {
                assert.strictEqual(currentApplication.container.toggleStyleClass.callCount, 1, "toggleStyleClass was called once");
                assert.strictEqual(currentApplication.container.toggleStyleClass.firstCall.args[0], configuration.output.classToggled, `${configuration.output.classToggled} was toggled`);
                assert.strictEqual(currentApplication.container.toggleStyleClass.firstCall.args[1], configuration.output.isWidthLimited, configuration.output.message);

                done();
            }, 100);
        });
    });

    QUnit.test("reloadCurrentApp", function (assert) {
        const done = assert.async();

        AppLifeCycle.init(null, false);

        Container.init("local").then(() => {
            Promise.all([
                Container.getServiceAsync("ShellNavigationInternal")
            ]).then((aServices) => {
                const oShellNavigationInternal = aServices[0];

                const oStubTreatHashChanged = sandbox.stub(oShellNavigationInternal.hashChanger, "treatHashChanged");
                const oStubGetBlueBoxById = sandbox.spy(BlueBoxHandler, "getBlueBoxById");

                AppLifeCycle._reloadCurrentApp({
                    sAppContainerId: "application-app-test",
                    sCurrentHash: "#ABCD-123"
                });

                window.setTimeout(() => {
                    assert.ok(oStubTreatHashChanged.calledOnce, "treatHashChanged called once");
                    assert.ok(oStubTreatHashChanged.calledWith("#ABCD-123"), "treatHashChanged called with the right hash");
                    assert.ok(oStubGetBlueBoxById.calledOnce, "getById called once");
                    assert.ok(oStubGetBlueBoxById.calledWith("application-app-test"), "getById called with the right app id");

                    done();
                }, 100);
            });
        });
    });

    QUnit.test("storeApp is called with enableRouterRetrigger:true initially", function (assert) {
        const oApplicationContainerMock = {
            setProperty: sandbox.stub()
        };
        const oResolvedHashFragment = {
            ui5ComponentName: "testUi5ComponentName"
        };
        const oStorageSetStub = sandbox.stub(Storage, "set");

        sandbox.stub(AppConfiguration, "getMetadata").returns({ test: "metaData" });
        sandbox.stub(Storage, "get").returns();


        AppLifeCycle._storeApp(
            "application-Test-intent", // sStorageAppId
            oApplicationContainerMock,
            oResolvedHashFragment,
            {
                target: {
                    semanticObject: "Test",
                    action: "intent"
                }
            }, // oParsedShellHash
            "testValue" // sKeepAliveMode
        );

        assert.deepEqual(oStorageSetStub.args[0], [
            "application-Test-intent",
            {
                service: {},
                shellHash: "#Test-intent",
                appId: "application-Test-intent",
                stt: "loading",
                currentState: null,
                controlManager: null,
                container: oApplicationContainerMock,
                meta: { test: "metaData" },
                app: undefined,
                keepAliveMode: "testValue",
                appTarget: oResolvedHashFragment,
                ui5ComponentName: "testUi5ComponentName",
                enableRouterRetrigger: true,
                stateStored: false
            }
        ]);
    });

    QUnit.test("storeApp is called with enableRouterRetrigger:false if the 'disableKeepAliveRestoreRouterRetrigger' event is fired after", function (assert) {
        const fnDone = assert.async();
        assert.expect(1);

        const oApplicationContainerMock = {
            setProperty: sandbox.stub()
        };
        const oResolvedHashFragment = {
            ui5ComponentName: "testUi5ComponentName"
        };

        sandbox.stub(AppConfiguration, "getMetadata").returns({ test: "metaData" });

        AppLifeCycle._storeApp(
            "application-Test-intent", // sStorageAppId
            oApplicationContainerMock,
            oResolvedHashFragment,
            {
                target: {
                    semanticObject: "Test",
                    action: "intent"
                }
            }, // oParsedShellHash
            "testValue" // sKeepAliveMode
        );

        EventHub.emit("disableKeepAliveRestoreRouterRetrigger", {
            disable: false,
            intent: {
                semanticObject: "Test",
                action: "intent"
            }
        });

        setTimeout(() => {
            assert.deepEqual(Storage.get("application-Test-intent"), {
                service: {},
                shellHash: "#Test-intent",
                appId: "application-Test-intent",
                stt: "loading",
                currentState: null,
                controlManager: null,
                container: oApplicationContainerMock,
                meta: { test: "metaData" },
                app: undefined,
                keepAliveMode: "testValue",
                appTarget: oResolvedHashFragment,
                ui5ComponentName: "testUi5ComponentName",
                enableRouterRetrigger: false,
                stateStored: false
            });
            fnDone();
        }, 100);
    });

    QUnit.test("storeApp is called with enableRouterRetrigger:false if the 'disableKeepAliveRestoreRouterRetrigger' event is fired before", function (assert) {
        const fnDone = assert.async();
        assert.expect(1);

        const oApplicationContainerMock = {
            setProperty: sandbox.stub()
        };
        const oResolvedHashFragment = {
            ui5ComponentName: "testUi5ComponentName"
        };
        const oStorageSetStub = sandbox.stub(Storage, "set");

        sandbox.stub(AppConfiguration, "getMetadata").returns({ test: "metaData" });
        sandbox.stub(Storage, "get").returns();

        EventHub.emit("disableKeepAliveRestoreRouterRetrigger", {
            disable: false,
            intent: {
                semanticObject: "Test",
                action: "intent"
            }
        });

        setTimeout(() => {
            AppLifeCycle._storeApp(
                "application-Test-intent", // sStorageAppId
                oApplicationContainerMock,
                oResolvedHashFragment,
                {
                    target: {
                        semanticObject: "Test",
                        action: "intent"
                    }
                }, // oParsedShellHash
                "testValue" // sKeepAliveMode
            );

            assert.deepEqual(oStorageSetStub.args[0], [
                "application-Test-intent",
                {
                    service: {},
                    shellHash: "#Test-intent",
                    appId: "application-Test-intent",
                    stt: "loading",
                    currentState: null,
                    controlManager: null,
                    container: oApplicationContainerMock,
                    meta: { test: "metaData" },
                    app: undefined,
                    keepAliveMode: "testValue",
                    appTarget: oResolvedHashFragment,
                    ui5ComponentName: "testUi5ComponentName",
                    enableRouterRetrigger: false,
                    stateStored: false
                }
            ]);
            fnDone();
        }, 100);

    });

    QUnit.test("_activeContainer", function (assert) {
        const dummyContainer = {
            getId: sandbox.stub().returns("id"),
            setActive: sandbox.spy()
        };
        sandbox.spy(BlueBoxHandler, "forEach");

        AppLifeCycle._activeContainer(dummyContainer);

        assert.ok(BlueBoxHandler.forEach.calledOnce);
        assert.ok(dummyContainer.setActive.calledOnce);

        BlueBoxHandler.forEach.restore();
    });

    [{
        sTestDesc: "test sendEmail with app state when bAppStateConfigPersistent=true",
        sTo: "to",
        sSubject: "subject http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4 as test",
        sBody: "body with link http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
        sCc: "cc",
        sBcc: "bcc",
        sIFrameURL: "http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
        bSetAppStateToPublic: true,
        sResultURL: "http://www.a.com?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4"
    }, {
        sTestDesc: "test sendEmail with app state when bAppStateConfigPersistent=false",
        sTo: "to",
        sSubject: "subject http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4 as test",
        sBody: "body with link http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
        sCc: "cc",
        sBcc: "bcc",
        sIFrameURL: "http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4",
        bSetAppStateToPublic: false,
        sResultURL: "http://www.a.com?sap-xapp-state=AAA&sap-iapp-state=BBB&dummy=4"
    }].forEach((oFixture) => {
        QUnit.test(oFixture.sTestDesc, function (assert) {
            const done = assert.async();
            const fnOldSendEmail = sandbox.stub(URLHelper, "triggerEmail");

            Container.init("local").then(() => {
                sandbox.stub(Config, "last").withArgs("/core/shell/enablePersistantAppstateWhenSharing").returns(oFixture.bSetAppStateToPublic);
                sandbox.stub(Container, "getServiceAsync").returns(Promise.resolve({
                    getPersistentWhenShared: sandbox.stub().returns(oFixture.bSetAppStateToPublic),
                    attachAppLoaded: sandbox.stub().returns(new jQuery.Deferred().resolve().promise()),
                    setAppStateToPublic: sandbox.stub().returns(new jQuery.Deferred().resolve(
                        "http://www.a.com?sap-xapp-state=CCC&sap-iapp-state=DDD&dummy=4",
                        "AAA", "BBB", "CCC", "DDD"
                    ).promise())
                }));
                AppLifeCycle.init(null, false);

                setTimeout(() => {
                    URLHelper.triggerEmail(
                        oFixture.sTo,
                        oFixture.sSubject,
                        oFixture.sBody,
                        oFixture.sCc,
                        oFixture.sBcc,
                        oFixture.sIFrameURL,
                        oFixture.bSetAppStateToPublic);

                    assert.ok(fnOldSendEmail.calledWith(
                        oFixture.sTo,
                        `subject ${oFixture.sResultURL} as test`,
                        `body with link ${oFixture.sResultURL}`,
                        oFixture.sCc,
                        oFixture.sBcc));
                    done();
                }, 1000);
            });
        });
    });

    QUnit.test("handleExitApplication - WDA case: calls 'store' directly and doesn't wait for components' create (as there is none)", function (assert) {
        // Arrange
        const sFromId = "test-from-id-1";
        const oFrom = {
            getApplicationType: function () { return "WDA"; },
            getCurrentAppId: sandbox.stub().returns(sFromId)
        };
        const oTo = "test-to-id";
        const isHomepage = false;
        const bFromAfterNavigate = false;
        this.oStoreStub = sandbox.stub(AppLifeCycle, "_store");
        this.oCompCreateResolveStub = sandbox.stub(AppLifeCycle, "_resolveComponentCreatedPromise");

        sandbox.stub(BlueBoxHandler, "isStatefulContainer").withArgs(oFrom).returns(false);
        sandbox.stub(Storage, "get").withArgs(sFromId).returns(true);
        sandbox.stub(RelatedServices, "isBackNavigation").returns(false);

        // Act
        const oHandleExitApplicationPromise = AppLifeCycle._handleExitApplication(oFrom, oTo, isHomepage, bFromAfterNavigate);


        return oHandleExitApplicationPromise.then(() => {
            // Assert
            assert.strictEqual(this.oStoreStub.callCount, 1, "'store' was called once.");
            assert.strictEqual(this.oCompCreateResolveStub.callCount, 0, "'resolveComponentCreatedPromise' wasn't called.");
        });
    });

    QUnit.test("handleExitApplication - calls 'store' only after the UI5 component has been created - Component Create finishes after handleExit", function (assert) {
        // Arrange
        const sFromId = "test-from-id-1";
        const oFrom = {
            getApplicationType: function () { return "UI5"; },
            getCurrentAppId: sandbox.stub().returns(sFromId)
        };
        const oTo = "test-to-id";
        const isHomepage = false;
        const bFromAfterNavigate = false;
        this.oStoreStub = sandbox.stub(AppLifeCycle, "_store");

        sandbox.stub(BlueBoxHandler, "isStatefulContainer").withArgs(oFrom).returns(false);
        sandbox.stub(Storage, "get").withArgs(sFromId).returns(true);
        sandbox.stub(RelatedServices, "isBackNavigation").returns(false);

        // Act
        const oHandleExitApplicationPromise = AppLifeCycle._handleExitApplication(oFrom, oTo, isHomepage, bFromAfterNavigate);
        AppLifeCycle._resolveComponentCreatedPromise(sFromId);

        return oHandleExitApplicationPromise.then(() => {
            // Assert
            assert.strictEqual(this.oStoreStub.callCount, 1, "'store' was called once.");
        });
    });

    QUnit.test("handleExitApplication - calls 'store' only after the UI5 component has been created - Component Create finished already before handleExit", function (assert) {
        // Arrange
        const sFromId = "test-from-id-2";
        const oFrom = {
            getApplicationType: function () { return "UI5"; },
            getCurrentAppId: sandbox.stub().returns(sFromId)
        };
        const oTo = "test-to-id";
        const isHomepage = false;
        const bFromAfterNavigate = false;
        this.oStoreStub = sandbox.stub(AppLifeCycle, "_store");
        AppLifeCycle._resolveComponentCreatedPromise(sFromId);

        sandbox.stub(BlueBoxHandler, "isStatefulContainer").withArgs(oFrom).returns(false);
        sandbox.stub(Storage, "get").withArgs(sFromId).returns(true);
        sandbox.stub(RelatedServices, "isBackNavigation").returns(false);

        // Act
        return AppLifeCycle._handleExitApplication(oFrom, oTo, isHomepage, bFromAfterNavigate).then(() => {
            // Assert
            assert.strictEqual(this.oStoreStub.callCount, 1, "'store' was called once.");
        });
    });

    QUnit.module("storeAppExtensions", {
        beforeEach: function () {
            sandbox.stub(RelatedServices, "store");
            sandbox.stub(KeepAlive, "store");

            sandbox.stub(Storage, "get");
            sandbox.stub(AppLifeCycle, "getCurrentApplication");

            sandbox.stub(AppLifeCycle, "_getComponentCreatedPromise").resolves();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Does not store if not currentApplication is available", async function (assert) {
        // Act
        await AppLifeCycle.storeAppExtensions();

        // Assert
        assert.strictEqual(RelatedServices.store.callCount, 0, "RelatedServices.store was not called");
        assert.strictEqual(KeepAlive.store.callCount, 0, "KeepAlive.store was not called");
    });

    QUnit.test("Does not store application if no Storage is available", async function (assert) {
        // Arrange
        AppLifeCycle.getCurrentApplication.returns({
            appId: "Action-toappnavsample-component",
            container: {
                getApplicationType: () => "TR"
            }
        });

        // Act
        await AppLifeCycle.storeAppExtensions();

        // Assert
        assert.strictEqual(RelatedServices.store.callCount, 0, "RelatedServices.store was not called");
        assert.strictEqual(KeepAlive.store.callCount, 0, "KeepAlive.store was not called");
    });

    QUnit.test("Stores application if Storage is available", async function (assert) {
        // Arrange
        const oMockStorage = {
            appId: "Action-toappnavsample-component",
            container: {
                getApplicationType: () => "TR"
            }
        };
        AppLifeCycle.getCurrentApplication.returns(oMockStorage);
        Storage.get.withArgs("Action-toappnavsample-component").returns(oMockStorage);

        // Act
        await AppLifeCycle.storeAppExtensions();

        // Assert
        assert.strictEqual(RelatedServices.store.callCount, 1, "RelatedServices.store was called");
        assert.strictEqual(KeepAlive.store.callCount, 1, "KeepAlive.store was called");

        assert.strictEqual(RelatedServices.store.getCall(0).args[0], oMockStorage.service, "RelatedServices.store was called with the correct storage object");
        assert.strictEqual(KeepAlive.store.getCall(0).args[0], oMockStorage, "KeepAlive.store was called with the correct storage object");
    });

    QUnit.test("Awaits Component Create before it stores ", async function (assert) {
        // Arrange
        const oMockStorage = {
            appId: "Action-toappnavsample-component",
            container: {
                getApplicationType: () => "UI5"
            }
        };
        AppLifeCycle.getCurrentApplication.returns(oMockStorage);
        Storage.get.withArgs("Action-toappnavsample-component").returns(oMockStorage);
        AppLifeCycle._getComponentCreatedPromise.returns(new Promise((resolve) => {
            // Assert
            assert.strictEqual(RelatedServices.store.callCount, 0, "RelatedServices.store was not called");
            assert.strictEqual(KeepAlive.store.callCount, 0, "KeepAlive.store was not called");

            resolve();
        }));

        // Act
        await AppLifeCycle.storeAppExtensions();

        // Assert
        assert.strictEqual(RelatedServices.store.callCount, 1, "RelatedServices.store was called");
        assert.strictEqual(KeepAlive.store.callCount, 1, "KeepAlive.store was called");

        assert.strictEqual(RelatedServices.store.getCall(0).args[0], oMockStorage.service, "RelatedServices.store was called with the correct storage object");
        assert.strictEqual(KeepAlive.store.getCall(0).args[0], oMockStorage, "KeepAlive.store was called with the correct storage object");
    });

    QUnit.module("restore", {
        beforeEach: function () {
            sandbox.stub(Application, "restore");
            sandbox.stub(RelatedServices, "restore");
            sandbox.stub(AppMeta, "restore");
            sandbox.stub(ShellUIServiceFactory, "restore");

            sandbox.stub(Storage, "get");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Does not restore when no entry is available", async function (assert) {
        // Act
        await AppLifeCycle._restore("testId");

        // Assert
        assert.strictEqual(RelatedServices.restore.callCount, 0, "RelatedServices.store was not called");
        assert.strictEqual(AppMeta.restore.callCount, 0, "AppMeta.restore was not called");
        assert.strictEqual(ShellUIServiceFactory.restore.callCount, 0, "ShellUIServiceFactory.restore was not called");
        assert.strictEqual(Application.restore.callCount, 0, "Application.restore was not called");
    });

    QUnit.test("Does not restore when entry has no stateStored flag", async function (assert) {
        // Arrange
        Storage.get.withArgs("testId").returns({});

        // Act
        await AppLifeCycle._restore("testId");

        // Assert
        assert.strictEqual(RelatedServices.restore.callCount, 0, "RelatedServices.store was not called");
        assert.strictEqual(AppMeta.restore.callCount, 0, "AppMeta.restore was not called");
        assert.strictEqual(ShellUIServiceFactory.restore.callCount, 0, "ShellUIServiceFactory.restore was not called");
        assert.strictEqual(Application.restore.callCount, 0, "Application.restore was not called");
    });

    QUnit.test("Restores when entry has stateStored flag", async function (assert) {
        // Arrange
        const oStorageEntryMock = {
            stateStored: true,
            service: {},
            meta: {}
        };
        Storage.get.withArgs("testId").returns(oStorageEntryMock);

        // Act
        await AppLifeCycle._restore("testId");

        // Assert
        assert.strictEqual(RelatedServices.restore.getCall(0).args[0], oStorageEntryMock.service, "RelatedServices.restore was called correctly");
        assert.strictEqual(AppMeta.restore.getCall(0).args[0], oStorageEntryMock.meta, "AppMeta.restore was called correctly");
        assert.strictEqual(ShellUIServiceFactory.restore.getCall(0).args[0], oStorageEntryMock, "ShellUIServiceFactory.restore was called correctly");
        assert.strictEqual(Application.restore.getCall(0).args[0], oStorageEntryMock, "Application.restore was called correctly");

        // Assert order
        assert.ok(RelatedServices.restore.calledBefore(Application.restore), "RelatedServices.restore was called before Application.restore");
        assert.ok(AppMeta.restore.calledBefore(Application.restore), "AppMeta.restore was called before Application.restore");
        assert.ok(ShellUIServiceFactory.restore.calledBefore(Application.restore), "ShellUIServiceFactory.restore was called before Application.restore");
    });

    QUnit.module("openApp", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns an existing container if one is available", function (assert) {
        const oResolvedHashFragment = {
            targetNavigationMode: "inplace",
            applicationType: "TR",
            url: "https://xxx.yyy?sap-iframe-hint=GUI"
        };

        sandbox.stub(AppConfiguration, "getMetadata").returns({
            compactContentDensity: true,
            cozyContentDensity: true
        });

        sandbox.stub(AppLifeCycle.getShellUIService(), "getInterface").returns({
            method: "implementation"
        });

        const oExistingContainer = {
            getStatefulType: sandbox.stub().returns(BlueBoxHandler.STATEFUL_TYPES.GUI_V1),
            setProperty: sandbox.stub(),
            supportsBlueBoxCapabilities: sandbox.stub().returns(true)
        };

        BlueBoxHandler.addNewBlueBox(oExistingContainer, { url: oResolvedHashFragment.url });

        AppLifeCycle._openApp(
            "application-Action-toappnavsample-component",
            oResolvedHashFragment,
            {
                semanticObject: "Action",
                action: "toappnavsample"
            },
            "#Action-toappnavsample"
        );
        const oApplicationContainer = AppLifeCycle.getCurrentApplication().container;

        assert.strictEqual(oApplicationContainer, oExistingContainer, "An existing container is returned");
    });

    QUnit.test("WDA applications should check for and destroy previous applications with the same id", async function (assert) {
        // Arrange
        AppLifeCycle.setViewPortContainer(new AppContainer());
        const sAppId = "Shell-startWDA";
        const sURL = "#Shell-startWDA";
        const oResolvedHashFragment = {
            applicationType: "WDA",
            url: sURL
        };
        const oParsedShellHash = {};
        const oNewMetaData = {};

        const oOldApplicationContainer = Application.createApplicationContainer("application-Shell-startWDA", oResolvedHashFragment);

        sandbox.stub(AppConfiguration, "getMetadata").returns(oNewMetaData);
        // Act
        await AppLifeCycle._openApp(sAppId, oResolvedHashFragment, oParsedShellHash);

        // Assert
        const oCurrentApplication = AppLifeCycle.getCurrentApplication();
        assert.strictEqual(oCurrentApplication.appId, "application-Shell-startWDA", "The appId is as expected.");
        assert.strictEqual(oCurrentApplication.stt, "loading", "The current application is loading.");
        assert.notStrictEqual(oCurrentApplication.container, oOldApplicationContainer, "The current application has the correct application container.");
        assert.strictEqual(oCurrentApplication.meta, oNewMetaData, "The current application has the correct metadata.");
        assert.strictEqual(oCurrentApplication.app, undefined, "The application is still undefined.");
        assert.strictEqual(oOldApplicationContainer.isDestroyed(), true, "The old container is destroyed.");

        // Clean-up
        oCurrentApplication.container.destroy();
    });

    QUnit.module("_createApplicationContainer", {
        beforeEach: async function () {
            sandbox.stub(AppLifeCycle, "_addApplicationContainerToViewPort");
            sandbox.stub(AppLifeCycle, "_navTo");
            // the following 2 are to stabilize the "create app with correct hash" test
            sandbox.stub(Container, "getServiceAsync");
            Container.getServiceAsync.withArgs("UserInfo").rejects();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("called with shell UI service 2", async function (assert) {
        // Arrange
        const oResolvedHashFragment = { url: "http://xxx.yyy" };
        sandbox.stub(AppLifeCycle.getShellUIService(), "getInterface").returns({ method: "implementation" });

        // Act
        const oAppContainer = await AppLifeCycle._createApplicationContainer(
            "Action-toappnavsample",
            {}, // oParsedShellHash
            oResolvedHashFragment,
            "#Action-toappnavsample",
            {} // oShellConfig
        );

        // Assert
        assert.deepEqual(oResolvedHashFragment.shellUIService, { method: "implementation" }, "shellUIService was added to the resolved navigation target");

        // Cleanup
        oAppContainer.destroy();
    });

    QUnit.test("Creates application container with the expected target nav mode when isColdStart is true", async function (assert) {
        // Arrange
        const oResolvedHashFragment = { url: "http://xxx.yyy" };
        sandbox.stub(ushellUtils, "isColdStart").returns(true);

        // Act
        const oAppContainer = await AppLifeCycle._createApplicationContainer(
            "Action-toappnavsample",
            {}, // oParsedShellHash
            oResolvedHashFragment,
            "#Action-toappnavsample",
            {} // oShellConfig
        );

        // Assert
        assert.deepEqual(oResolvedHashFragment.targetNavigationMode, "explace", "the expected target navmode was passed to the application container");

        // Cleanup
        oAppContainer.destroy();
    });

    QUnit.test("Creates application container with the expected target nav mode when isColdStart is false", async function (assert) {
        // Arrange
        const oResolvedHashFragment = { url: "http://xxx.yyy" };
        sandbox.stub(ushellUtils, "isColdStart").returns(false);

        // Act
        const oAppContainer = await AppLifeCycle._createApplicationContainer(
            "Action-toappnavsample",
            {}, // oParsedShellHash
            oResolvedHashFragment,
            "#Action-toappnavsample",
            {} // oShellConfig
        );

        // Assert
        assert.deepEqual(oResolvedHashFragment.targetNavigationMode, "inplace", "the expected target navmode was passed to the application container");

        // Cleanup
        oAppContainer.destroy();
    });

    QUnit.test("Creates application container with fullWidth=true", async function (assert) {
        // Arrange
        const oResolvedHashFragment = {
            url: "http://xxx.yyy",
            fullWidth: true
        };

        // Act
        const oAppContainer = await AppLifeCycle._createApplicationContainer(
            "Action-toappnavsample",
            {}, // oParsedShellHash
            oResolvedHashFragment,
            "#Action-toappnavsample",
            {} // oShellConfig
        );

        // Assert
        const bIsFullWidth = !oAppContainer.hasStyleClass("sapUShellApplicationContainerLimitedWidth");
        assert.strictEqual(bIsFullWidth, true, "the application container was created with full width");

        // Cleanup
        oAppContainer.destroy();
    });

    QUnit.test("Creates application container with fullWidth=false", async function (assert) {
        // Arrange
        const oResolvedHashFragment = {
            url: "http://xxx.yyy",
            fullWidth: false
        };

        // Act
        const oAppContainer = await AppLifeCycle._createApplicationContainer(
            "Action-toappnavsample",
            {}, // oParsedShellHash
            oResolvedHashFragment,
            "#Action-toappnavsample",
            {} // oShellConfig
        );

        // Assert
        const bIsFullWidth = !oAppContainer.hasStyleClass("sapUShellApplicationContainerLimitedWidth");
        assert.strictEqual(bIsFullWidth, false, "the application container was created with full width");

        // Cleanup
        oAppContainer.destroy();
    });

    QUnit.test("Stores application with provided hash instead of the curent hash", async function (assert) {
        // Arrange
        const oResolvedHashFragment = {
            url: "http://xxx.yyy",
            fullWidth: false,
            sFixedShellHash: "#Action-toappnavsample"
        };

        const oGetMetadatastub = sandbox.stub(AppConfiguration, "getMetadata").returns({});

        // Act
        const oAppContainer = await AppLifeCycle._createApplicationContainer(
            "Action-toappnavsample",
            {}, // oParsedShellHash
            oResolvedHashFragment,
            "#Action-toappnavsample",
            {} // oShellConfig
        );

        // Assert
        assert.strictEqual(oGetMetadatastub.callCount, 5, "getMetadata was called 5 times");
        assert.strictEqual(oGetMetadatastub.getCall(0).args[1], "#Action-toappnavsample", "getMetadata was called with the correct fixedShellHash");
        assert.strictEqual(oGetMetadatastub.getCall(1).args[1], undefined, "getMetadata was called with the expected fixedShellHash");
        assert.strictEqual(oGetMetadatastub.getCall(2).args[1], undefined, "getMetadata was called with the expected fixedShellHash");
        assert.strictEqual(oGetMetadatastub.getCall(3).args[1], undefined, "getMetadata was called with the expected fixedShellHash");
        assert.strictEqual(oGetMetadatastub.getCall(4).args[1], undefined, "getMetadata was called with the expected fixedShellHash");

        // Cleanup
        oAppContainer.destroy();
    });

    QUnit.module("navToCurrentApp", {
        beforeEach: async function () {
            this.oCurrentApplication = {
                container: {
                    getId: sandbox.stub().returns("testId"),
                    hasStyleClass: sandbox.stub(),
                    toggleStyleClass: sandbox.stub()
                }
            };
            sandbox.stub(AppLifeCycle, "getCurrentApplication").returns(this.oCurrentApplication);
            sandbox.stub(AppLifeCycle, "_navTo");
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Navigates to the current application", async function (assert) {
        // Arrange

        // Act
        AppLifeCycle.navToCurrentApp();

        // Assert
        assert.strictEqual(AppLifeCycle._navTo.getCall(0).args[0], "testId", "navTo was called with the correct application id");
    });

    QUnit.test("Disables the correct CSS class to show the application", function (assert) {
        //Arrange
        this.oCurrentApplication.container.hasStyleClass.withArgs("sapUShellApplicationContainerShiftedIframe").returns(false);

        //Act
        AppLifeCycle.navToCurrentApp();

        //Assert
        assert.deepEqual(this.oCurrentApplication.container.toggleStyleClass.getCall(0).args,
            ["hidden", false], "The correct CSS class was disabled");

    });

    QUnit.test("Disables the correct CSS class to show the application for legacy applications", function (assert) {
        //Arrange
        this.oCurrentApplication.container.hasStyleClass.withArgs("sapUShellApplicationContainerShiftedIframe").returns(true);

        //Act
        AppLifeCycle.navToCurrentApp();

        //Assert
        assert.deepEqual(this.oCurrentApplication.container.toggleStyleClass.getCall(0).args,
            ["sapUShellApplicationContainerIframeHidden", false], "The correct CSS class was disabled");
    });
});
