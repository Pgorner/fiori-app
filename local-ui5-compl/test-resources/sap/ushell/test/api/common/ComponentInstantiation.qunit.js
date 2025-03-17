// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.common.ComponentInstantiation
 */
sap.ui.define([
    "sap/ushell/api/common/ComponentInstantiation",
    "sap/base/Log",
    "sap/ushell/Container",
    "sap/ushell/Config",
    "sap/ui/core/Component",
    "sap/ui/core/UIComponent",
    "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent"
], function (
    ComponentInstantiation,
    Log,
    Container,
    Config,
    Component,
    UIComponent,
    AppLifeCycleAgent
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    var aCoreExtLightPreloadBundles = [
        "sap/fiori/core-ext-light-0.js",
        "sap/fiori/core-ext-light-1.js",
        "sap/fiori/core-ext-light-2.js",
        "sap/fiori/core-ext-light-3.js"
    ];

    /*
    * Mock implementations
    */
    function fnResolveHashFragmentMock (sIntent) {
        var oDeferred = new jQuery.Deferred();
        var aIntentParts = sIntent.split("?");
        var sParameters = aIntentParts.length === 2 && aIntentParts[1];
        var oNavTargetResults = {
            "#foo-bar": {
                applicationType: "URL",
                additionalInformation: "SAPUI5.Component=foo.bar.Component",
                url: "/foo/bar/Component",
                text: "Foo Bar Component"
            },
            "#foo-nwbc": {
                applicationType: "NWBC",
                additionalInformation: "",
                text: "Foo Bar NWBC",
                url: "/foo/nwbc",
                navigationMode: "newWindowThenEmbedded"
            },
            "#foo-appruntime": {
                applicationType: "URL",
                url: "https://www.xyz.com?sap-ui-app-id=xyz&a=b",
                appCapabilities: {
                    appFrameworkId: "UI5",
                    technicalAppComponentId: "a.b.c"
                }
            },
            "#foo-appruntime2": {
                applicationType: "URL",
                url: "/?a=b&sap-ui-app-id=abc",
                appCapabilities: {
                    appFrameworkId: "UI5",
                    technicalAppComponentId: "a.b.c"
                }
            }
        };

        sIntent = aIntentParts[0];

        if (oNavTargetResults.hasOwnProperty(sIntent)) {
            if (sParameters) {
                oNavTargetResults[sIntent].url += "?" + sParameters;
            }
            oDeferred.resolve(oNavTargetResults[sIntent]);
        } else {
            oDeferred.reject("NavTargetResolutionInternal failed: intent unknown");
        }

        return oDeferred.promise();
    }

    function fnResolveHashFragmentMock2 (sIntent) {
        var oDeferred = new jQuery.Deferred();
        var sUshellTestRootPath = sap.ui.require.toUrl("sap/ushell").replace("resources", "test-resources");
        var aIntentParts = sIntent.split("?");
        var sParameters = aIntentParts.length === 2 && aIntentParts[1];
        var oNavTargetResults = {
            "#foo-bar": {
                applicationType: "URL",
                additionalInformation: "SAPUI5.Component=sap.ushell.demo.HelloWorldSampleApp",
                url: sUshellTestRootPath + "/demoapps/HelloWorldSampleApp?fixed-param1=value1&array-param1=value1&array-param1=value2",
                text: "Foo Bar Component"
            }
        };

        sIntent = aIntentParts[0];

        if (oNavTargetResults.hasOwnProperty(sIntent)) {
            if (sParameters) {
                oNavTargetResults[sIntent].url += "?" + sParameters;
            }
            oDeferred.resolve(oNavTargetResults[sIntent]);
        } else {
            oDeferred.reject("NavTargetResolutionInternal failed: intent unknown");
        }

        return oDeferred.promise();
    }

    function fnSapUiComponentMock (oConfig) {
        this.id = "mockComponentInstance";
        this.config = oConfig;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this);
            }, 0);
        });
    }


    QUnit.module("sap.ushell.api.common.ComponentInstantiation", {
        beforeEach: async function () {
            this.oErrorStub = sandbox.stub(Log, "error");

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(aCoreExtLightPreloadBundles);

            await Container.init("local");
            this.NavTargetResolutionInternal = await Container.getServiceAsync("NavTargetResolutionInternal");
        },
        afterEach: function () {
            sandbox.restore();
            Container.reset();
        }
    });

    [
        "foo-bar",
        "#foo-bar"
    ].forEach(function (sNavigationIntent) {
        QUnit.test("createComponentInstance: create a new component for a valid navigation intent " + sNavigationIntent, async function (assert) {
            // Assert
            var oMockComponentInstance = {};
            var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
            var oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind(oMockComponentInstance));

            // Act
            const oComponentInstance = await ComponentInstantiation.createComponentInstance(sNavigationIntent);

            // Arrange
            assert.strictEqual(oNavTargetResolutionStub.callCount, 1, "NavTargetResolutionInternal service gets called exactly once");
            assert.deepEqual(oNavTargetResolutionStub.getCall(0).args, ["#foo-bar"], "NavTargetResolutionInternal service gets called with correct parameters");
            assert.strictEqual(oComponentCreateStub.callCount, 1, "Component.create was called exactly once");
            assert.deepEqual(oComponentCreateStub.getCall(0).args, [{
                manifest: false,
                asyncHints: {
                    preloadBundles: aCoreExtLightPreloadBundles
                },
                name: "foo.bar.Component",
                url: "/foo/bar/Component",
                componentData: { startupParameters: {} }
            }], "Component.create gets called with the correct parameters");
            assert.strictEqual(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
        });
    });

    QUnit.test("createComponentInstance: cflp appruntime use case", async function (assert) {
        // Arrange
        var oMockComponentInstance = {};
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
        var oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind(oMockComponentInstance));
        sandbox.stub(Container, "inAppRuntime").returns(true);

        sandbox.stub(AppLifeCycleAgent, "getAppInfo").withArgs("xyz").resolves({
            applicationType: "URL",
            name: "foo.bar.Component",
            url: "/foo/bar/Component",
            text: "Foo Bar Component"
        });

        // Act
        const oComponentInstance = await ComponentInstantiation.createComponentInstance("foo-appruntime");

        // Assert
        assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service gets called");
        assert.ok(oNavTargetResolutionStub.calledWith("#foo-appruntime"), "called with correct parameter");
        assert.ok(oComponentCreateStub.calledOnce, "sap.ui.component was called once!");
        assert.ok(oComponentCreateStub.calledWith({
            manifest: false,
            applicationType: "URL",
            asyncHints: {
                preloadBundles: aCoreExtLightPreloadBundles
            },
            componentData: { startupParameters: {} },
            name: "foo.bar.Component",
            text: "Foo Bar Component",
            ui5ComponentName: "foo.bar.Component",
            url: "/foo/bar/Component"
        }), "Component.create gets called with the correct information");
        assert.equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
    });

    QUnit.test("createComponentInstance: not a complete URL is given", async function (assert) {
        // Arrange
        var oMockComponentInstance = {};
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
        var oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind(oMockComponentInstance));
        sandbox.stub(Container, "inAppRuntime").returns(true);

        const oGetAppInfoStub = sandbox.stub(AppLifeCycleAgent, "getAppInfo").rejects();
        // the sap-ui-app-id parameter needs to be the argument
        oGetAppInfoStub.withArgs("abc").resolves({
            applicationType: "URL",
            name: "foo.bar.Component2",
            url: "/foo/bar/Component2",
            text: "Foo Bar Component2"
        });

        // Act
        const oComponentInstance = await ComponentInstantiation.createComponentInstance("foo-appruntime2");

        // Assert
        assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service gets called");
        assert.ok(oNavTargetResolutionStub.calledWith("#foo-appruntime2"), "called with correct parameter");
        assert.ok(oComponentCreateStub.calledOnce, "sap.ui.component was called once!");
        assert.ok(oComponentCreateStub.calledWith({
            manifest: false,
            applicationType: "URL",
            asyncHints: {
                preloadBundles: aCoreExtLightPreloadBundles
            },
            componentData: { startupParameters: {} },
            name: "foo.bar.Component2",
            text: "Foo Bar Component2",
            ui5ComponentName: "foo.bar.Component2",
            url: "/foo/bar/Component2"
        }), "Component.create gets called with the correct information");
        assert.equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
    });

    QUnit.test("createComponentInstance: runWithOwner owner properly propagated with owner", async function (assert) {
        // Arrange
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock2);
        var oExpectedOwnerComponent = new UIComponent({});

        // Act
        const oComponentInstance = await ComponentInstantiation.createComponentInstance("#foo-bar?A=B", {}, oExpectedOwnerComponent);

        // Assert
        var oOwner = Component.getOwnerComponentFor(oComponentInstance);

        assert.strictEqual(oOwner, oExpectedOwnerComponent, "The correct owner was set");
        assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service was called");
    });

    QUnit.test("createComponentInstance: runWithOwner owner properly propagated without owner", async function (assert) {
        // Arrange
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock2);

        // Act
        const oComponentInstance = await ComponentInstantiation.createComponentInstance("#foo-bar?A=B", {});

        // Assert
        var oOwner = Component.getOwnerComponentFor(oComponentInstance);

        assert.strictEqual(oOwner, undefined, "The correct owner was set");
        assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service was called");
    });

    [
        "#foobar",
        "",
        "#foo -bar",
        undefined
    ].forEach(function (sNavigationIntent) {
        QUnit.test("createComponentInstance: Invalid navigation intent", async function (assert) {
            // Arrange
            var oMockComponentInstance = {};
            var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
            var oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind(oMockComponentInstance));

            // Act
            try {
                await ComponentInstantiation.createComponentInstance(sNavigationIntent);

                // Assert
                assert.ok(false, "the promise should have been rejected");
            } catch (sError) {
                assert.strictEqual(sError, "Navigation intent invalid!", "Correct reject message received!");
                assert.ok(!oNavTargetResolutionStub.called, "NavTargetResolutionInternal service was never called!");
                assert.ok(!oComponentCreateStub.called, "sap.ui.component was never called!");
            }
        });
    });

    QUnit.test("createComponentInstance: create component with startup parameters", async function (assert) {
        // Arrange
        var oMockComponentInstance = {};
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
        var oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind(oMockComponentInstance));
        var oExpectedComponentConfig = {
            manifest: false,
            asyncHints: {
                preloadBundles: aCoreExtLightPreloadBundles
            },
            name: "foo.bar.Component",
            url: "/foo/bar/Component",
            componentData: {
                startupParameters: {
                    P1: ["V1"],
                    P2: ["V2"]
                }
            }
        };

        // Act
        const oComponentInstance = await ComponentInstantiation.createComponentInstance("#foo-bar?P1=V1&P2=V2");

        // Assert
        assert.equal(oNavTargetResolutionStub.args[0][0], "#foo-bar?P1=V1&P2=V2", "called with correct parameter");
        assert.deepEqual(oComponentCreateStub.args[0][0], oExpectedComponentConfig, "Component.create gets called with the correct information");
        assert.equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
    });

    QUnit.test("createComponentInstance: resolving NWBC nav target", async function (assert) {
        // Arrange
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
        var oComponentCreateStub = sandbox.stub(Component, "create");

        try {
            // Act
            await ComponentInstantiation.createComponentInstance("#foo-nwbc");

            // Assert
            assert.ok(false, "the promise should have been rejected");
        } catch (sError) {
            assert.strictEqual(sError, "The resolved target mapping is not of type UI5 component.", "Proper error message returned!");
            assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service was called once!");
            assert.ok(!oComponentCreateStub.called, "Component.create was never called!");
        }
    });

    QUnit.test("createComponentInstance: passing config contains componentData", async function (assert) {
        // Arrange
        var oMockComponentInstance = {};
        var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);
        var oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind(oMockComponentInstance));
        var oComponentData = { reference: { attr: "value" } };

        // Act
        const oComponentInstance = await ComponentInstantiation.createComponentInstance("#foo-bar", oComponentData);

        // Assert
        assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service gets called");
        assert.ok(oNavTargetResolutionStub.calledWith("#foo-bar"), "called with correct parameter");
        assert.ok(oComponentCreateStub.calledOnce, "sap.ui.component was called once!");
        assert.ok(oComponentCreateStub.calledWith({
            componentData: {
                reference: { attr: "value" },
                startupParameters: {}
            },
            manifest: false,
            asyncHints: {
                preloadBundles: aCoreExtLightPreloadBundles
            },
            name: "foo.bar.Component",
            url: "/foo/bar/Component"
        }), "Component.create gets called with the correct information");
        assert.equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
    });

    QUnit.test("createComponentInstance: considers application dependencies specified in navigation target resolution result", async function (assert) {
        // Arrange
        sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(function resolveHashFragmentWithAsyncHints (sIntent) {
            return fnResolveHashFragmentMock(sIntent)
                .then(function (oAppProperties) {
                    oAppProperties.applicationDependencies = {
                        manifest: false,
                        asyncHints: {
                            libs: [
                                { name: "foo.bar.lib1" },
                                { name: "foo.bar.lib2" }
                            ]
                        }
                    };

                    return oAppProperties;
                });
        });

        const oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind({}));

        // Act
        await ComponentInstantiation.createComponentInstance("#foo-bar");

        // Arrange
        assert.deepEqual(oComponentCreateStub.args[0][0], {
            manifest: false,
            asyncHints: {
                libs: [
                    { name: "foo.bar.lib1" },
                    { name: "foo.bar.lib2" }
                ],
                preloadBundles: aCoreExtLightPreloadBundles
            },
            name: "foo.bar.Component",
            url: "/foo/bar/Component",
            componentData: {
                startupParameters: {}
            }
        });
    });

    QUnit.test("Irrelevant data added to componentData are removed", async function (assert) {
        // Arrange
        sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(function resolveHashFragmentWithAsyncHints (sIntent) {
            return fnResolveHashFragmentMock(sIntent)
                .then(function (oAppProperties) {
                    oAppProperties.applicationDependencies = {
                        manifest: false,
                        asyncHints: {
                            libs: [
                                { name: "foo.bar.lib1" },
                                { name: "foo.bar.lib2" }
                            ]
                        }
                    };

                    return oAppProperties;
                });
        });

        const oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind({}));

        // Act
        await ComponentInstantiation.createComponentInstance("#foo-bar", {
            startupParameters: {
                a: ["1"],
                b: ["2"]
            },
            config: {},
            "sap-xapp-state": "irrelevant data",
            "non-problematic data": ["OK data"]
        });

        // Assert
        assert.deepEqual(oComponentCreateStub.args[0][0], {
            manifest: false,
            asyncHints: {
                libs: [
                    { name: "foo.bar.lib1" },
                    { name: "foo.bar.lib2" }
                ],
                preloadBundles: aCoreExtLightPreloadBundles
            },
            name: "foo.bar.Component",
            url: "/foo/bar/Component",
            componentData: {
                startupParameters: {},
                "non-problematic data": ["OK data"]
            }
        });
    });

    QUnit.test("startup Parameters passed are overwritten by startup parameters present in url", async function (assert) {
        // Arrange
        sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(function (sIntent) {
            return fnResolveHashFragmentMock(sIntent)
                .then(function (oAppProperties) {
                    oAppProperties.applicationDependencies = {
                        asyncHints: {
                            libs: [
                                { name: "foo.bar.lib1" },
                                { name: "foo.bar.lib2" }
                            ]
                        }
                    };

                    return oAppProperties;
                });
        });

        const oComponentCreateStub = sandbox.stub(Component, "create").callsFake(fnSapUiComponentMock.bind({}));

        // Act
        await ComponentInstantiation.createComponentInstance("#foo-bar?cc=dddd", {
            startupParameters: {
                a: ["1"],
                b: ["2"]
            }
        });

        // Assert
        assert.deepEqual(oComponentCreateStub.args[0][0], {
            asyncHints: {
                libs: [
                    { name: "foo.bar.lib1" },
                    { name: "foo.bar.lib2" }
                ],
                preloadBundles: aCoreExtLightPreloadBundles
            },
            manifest: false,
            name: "foo.bar.Component",
            url: "/foo/bar/Component",
            componentData: {
                startupParameters: {
                    cc: ["dddd"]
                }
            }
        });
    });

    [
        "foo-bar",
        "#foo-bar"
    ].forEach(function (sNavigationIntent) {
        QUnit.test("createComponentInstantiationData: returns a instantiation data for a valid navigation intent " + sNavigationIntent, async function (assert) {
            // Arrange
            var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);

            // Act
            const oInstantiationData = await ComponentInstantiation.createComponentInstantiationData(sNavigationIntent);

            // Assert
            var oExpectedData = {};
            oExpectedData.appPropertiesSafe = {
                additionalInformation: "SAPUI5.Component=foo.bar.Component",
                applicationType: "URL",
                text: "Foo Bar Component",
                ui5ComponentName: "foo.bar.Component",
                url: "/foo/bar/Component"
            };
            oExpectedData.componentData = { startupParameters: {} };
            oExpectedData.componentProperties = {
                asyncHints: {
                    preloadBundles: ["sap/fiori/core-ext-light-0.js", "sap/fiori/core-ext-light-1.js",
                        "sap/fiori/core-ext-light-2.js", "sap/fiori/core-ext-light-3.js"]
                },
                name: "foo.bar.Component",
                url: "/foo/bar/Component"
            };
            oExpectedData.loadCoreExt = true;
            assert.ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolutionInternal service gets called");
            assert.ok(oNavTargetResolutionStub.calledWith("#foo-bar"), "called with correct parameter");
            assert.deepEqual(oInstantiationData, oExpectedData, "Correct component data returned!");
        });
    });

    [
        "#foobar",
        "",
        "#foo -bar",
        undefined
    ].forEach(function (sNavigationIntent) {
        QUnit.test("createComponentInstantiationData: Invalid navigation intent", async function (assert) {
            // Arrange
            var oNavTargetResolutionStub = sandbox.stub(this.NavTargetResolutionInternal, "resolveHashFragment").callsFake(fnResolveHashFragmentMock);

            try {
                // Act
                await ComponentInstantiation.createComponentInstantiationData(sNavigationIntent);

                // Assert
                assert.ok(false, "the promise should have been rejected");
            } catch (sError) {
                assert.strictEqual(sError, "Navigation intent invalid!", "Correct reject message received!");
                assert.ok(!oNavTargetResolutionStub.called, "NavTargetResolutionInternal service was never called!");
            }
        });
    });

});
