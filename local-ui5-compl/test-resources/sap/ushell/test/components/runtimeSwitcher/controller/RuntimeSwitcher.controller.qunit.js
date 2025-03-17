// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.runtimeSwitcher.controller.RuntimeSwitcher.controller
 */
sap.ui.define([
    "sap/ushell/components/runtimeSwitcher/controller/RuntimeSwitcher.controller",
    "sap/ushell/components/pages/controller/PagesAndSpaceId",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ui/core/Component"
], function (
    RuntimeSwitcherController,
    PagesAndSpaceId,
    Config,
    Container,
    Component
) {

    "use strict";

    /* global QUnit sinon*/
    var sandbox = sinon.createSandbox();

    QUnit.module("RuntimeSwitcherController", {
        beforeEach: function () {
            sandbox.stub(Container, "getRendererInternal");
            this.oController = new RuntimeSwitcherController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oController, "The controller was instantiated.");
    });

    QUnit.module("onInit", {
        beforeEach: function () {
            this.oGetRendererStub = sandbox.stub(Container, "getRendererInternal");
            this.oController = new RuntimeSwitcherController();
            this.oAddEventDelegateStub = sandbox.stub();
            this.oByIdStub = sandbox.stub(this.oController, "byId");
            this.oByIdStub.withArgs("switcherNavContainer").returns({ control: "NavContainer" });
            this.oByIdStub.withArgs("pagesRuntime").returns({
                control: "pagesRuntime",
                addEventDelegate: this.oAddEventDelegateStub
            });
            this.oByIdStub.withArgs("workpagesRuntime").returns({
                control: "workpagesRuntime",
                addEventDelegate: this.oAddEventDelegateStub
            });

            this.oHandleRouterStub = sandbox.stub(this.oController, "_handleRouter").resolves();

            this.oAttachHomeRouteStub = sandbox.stub();
            this.oAttachOpenFlpPageRouteStub = sandbox.stub();

            this.oGetRouteStub = sandbox.stub();
            this.oGetRouteStub.withArgs("home").returns({
                attachMatched: this.oAttachHomeRouteStub
            });

            this.oGetRouteStub.withArgs("openFLPPage").returns({
                attachMatched: this.oAttachOpenFlpPageRouteStub
            });


            this.oGetRendererStub.returns({
                getRouter: sandbox.stub().returns({
                    getRoute: this.oGetRouteStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Assigns the controls and handles routing", function (assert) {
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {

            // Assert
            assert.deepEqual(this.oController.oNavContainer, {control: "NavContainer"}, "The NavContainer control was assigned.");
            assert.strictEqual(this.oController.oPagesRuntime.control, "pagesRuntime", "The pagesRuntime control was assigned.");
            assert.strictEqual(typeof this.oController.oPagesRuntime.addEventDelegate, "function", "The pagesRuntime addEventDelegate was assigned.");
            assert.strictEqual(this.oController.oWorkpageRuntime.control, "workpagesRuntime", "The workpagesRuntime control was assigned.");
            assert.strictEqual(typeof this.oController.oWorkpageRuntime.addEventDelegate, "function", "The workpagesRuntime addEventDelegate was assigned.");
            assert.ok(this.oAttachHomeRouteStub.calledOnce, "attachRouteMatch was called on the home route.");
            assert.ok(this.oAttachOpenFlpPageRouteStub.calledOnce, "attachRouteMatch was called on the openFLPPage route.");
        }.bind(this));
    });

    QUnit.test("Adds event delegates for the workpage runtime", function (assert) {
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            assert.ok(this.oAddEventDelegateStub.called, "addEventDelegate was called once.");
            assert.strictEqual(typeof this.oAddEventDelegateStub.firstCall.args[0].onBeforeFirstShow, "function", "onBeforeFirstShow");
        }.bind(this));
    });

    QUnit.module("onExit", {
        beforeEach: function () {
            this.oController = new RuntimeSwitcherController();

            this.oDetachHomeRouteStub = sandbox.stub();
            this.oDetachOpenFlpPageRouteStub = sandbox.stub();

            this.oGetRouteStub = sandbox.stub();
            this.oGetRouteStub.withArgs("home").returns({
                detachRouteMatched: this.oDetachHomeRouteStub
            });

            this.oGetRouteStub.withArgs("openFLPPage").returns({
                detachRouteMatched: this.oDetachOpenFlpPageRouteStub
            });

            this.oController.oContainerRouter = {
                getRoute: this.oGetRouteStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Assigns the controls and handles routing", function (assert) {
        // Act
        this.oController.onExit();
        // Assert
        assert.ok(this.oDetachHomeRouteStub.calledOnce, "detachRouteMatch was called on the home route.");
        assert.ok(this.oDetachOpenFlpPageRouteStub.calledOnce, "detachRouteMatch was called on the openFLPPage route.");
    });


    QUnit.module("_handleRouter", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetFLPPlatformStub = sandbox.stub(Container, "getFLPPlatform");
            this.oGetFLPPlatformStub.withArgs(true).returns("cFLP");

            this.oIsWorkPageStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                isWorkPage: this.oIsWorkPageStub
            });

            this.oController = new RuntimeSwitcherController();
            this.oController.oNavContainer = { to: sandbox.stub() };
            this.oController.oPagesRuntime = { component: "pagesComponent" };
            this.oController.oWorkpageRuntime = { component: "workpageComponent" };

            this.oMockWorkPagesComponent = {
                onRouteMatched: sandbox.stub(),
                hideRuntime: sandbox.stub()
            };
            this.oController.oWorkPageRuntimeComponent = this.oMockWorkPagesComponent;

            this.oMockPagesComponent = {
                onRouteMatched: sandbox.stub(),
                hideRuntime: sandbox.stub()
            };
            this.oController.oPageRuntimeComponent = this.oMockPagesComponent;

            this.oGetPageAndSpaceIdStub = sandbox.stub(PagesAndSpaceId, "getPageAndSpaceId").resolves({pageId: "test-page-id"});
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("loads page component if pageId cannot be determined", function (assert) {
        // Arrange
        this.oGetPageAndSpaceIdStub.resolves({pageId: null});

        // Act
        return this.oController._handleRouter().then(function () {

            // Assert
            assert.ok(this.oController.oNavContainer.to.calledOnce, "NavContainer.to() was called");
            assert.deepEqual(this.oController.oNavContainer.to.firstCall.args[0], this.oController.oPagesRuntime, "pageComponent was instantiated");
            assert.ok(this.oMockWorkPagesComponent.hideRuntime.calledOnce, "hideRuntime was called on WorkpageRuntime");
            assert.ok(this.oMockPagesComponent.onRouteMatched.calledOnce, "onRouteMatched was called on the PageRuntime");
        }.bind(this));
    });

    QUnit.test("loads page component if page is a traditional page", function (assert) {
        // Arrange
        this.oGetPageAndSpaceIdStub.resolves({pageId: "cpkg.cdm32_workpage_PAGE_SFSF_DEMO"});
        this.oIsWorkPageStub.resolves(false);

        // Act
        return this.oController._handleRouter().then(function () {
            // Assert
            assert.ok(this.oController.oNavContainer.to.calledOnce, "NavContainer.to() was called");
            assert.deepEqual(this.oController.oNavContainer.to.firstCall.args[0], this.oController.oPagesRuntime, "pageComponent was instantiated");
            assert.ok(this.oIsWorkPageStub.calledOnce, "isWorkPage was called");
            assert.strictEqual(this.oIsWorkPageStub.firstCall.args[0], "cpkg.cdm32_workpage_PAGE_SFSF_DEMO", "isWorkPage was called with the expected arguments");
            assert.ok(this.oMockWorkPagesComponent.hideRuntime.calledOnce, "hideRuntime was called on WorkpageRuntime");
            assert.ok(this.oMockPagesComponent.onRouteMatched.calledOnce, "onRouteMatched was called on the PageRuntime");
        }.bind(this));
    });

    QUnit.test("checks existence before calling hideRuntime on workpage component", function (assert) {
        // Arrange
        this.oGetPageAndSpaceIdStub.resolves({pageId: "cpkg.cdm32_workpage_PAGE_SFSF_DEMO"});
        this.oIsWorkPageStub.resolves(false);
        delete this.oMockWorkPagesComponent.hideRuntime;

        // Act
        return this.oController._handleRouter().then(function () {
            // Assert
            assert.ok(this.oController.oNavContainer.to.calledOnce, "NavContainer.to() was called");
            assert.deepEqual(this.oController.oNavContainer.to.firstCall.args[0], this.oController.oPagesRuntime, "pageComponent was instantiated");
            assert.ok(this.oIsWorkPageStub.calledOnce, "isWorkPage was called");
            assert.strictEqual(this.oIsWorkPageStub.firstCall.args[0], "cpkg.cdm32_workpage_PAGE_SFSF_DEMO", "isWorkPage was called with the expected arguments");
            assert.ok(this.oMockPagesComponent.onRouteMatched.calledOnce, "onRouteMatched was called on the PageRuntime");
        }.bind(this));
    });

    QUnit.test("loads workpage component if page is a workpage", function (assert) {
        // Arrange
        this.oGetPageAndSpaceIdStub.resolves({pageId: "your-workpage-id-2"});
        this.oIsWorkPageStub.resolves(true);

        // Act
        return this.oController._handleRouter().then(function () {
            // Assert
            assert.ok(this.oController.oNavContainer.to.calledOnce, "NavContainer.to() was called");
            assert.deepEqual(this.oController.oNavContainer.to.firstCall.args[0], this.oController.oWorkpageRuntime, "workpageComponent was instantiated");
            assert.ok(this.oIsWorkPageStub.calledOnce, "isWorkPage was called");
            assert.strictEqual(this.oIsWorkPageStub.firstCall.args[0], "your-workpage-id-2", "isWorkPage was called with the expected arguments");
            assert.ok(this.oMockPagesComponent.hideRuntime.calledOnce, "hideRuntime was called on PageRuntime");
            assert.ok(this.oMockWorkPagesComponent.onRouteMatched.calledOnce, "onRouteMatched was called on the WorkPageRuntime");
        }.bind(this));
    });

    QUnit.test("loads workpage component and sets page ID if page is a workpage and has setPageId method", function (assert) {
        // Arrange
        this.oGetPageAndSpaceIdStub.resolves({pageId: "your-workpage-id-2"});
        this.oIsWorkPageStub.resolves(true);

        delete this.oController.oWorkPageRuntimeComponent;

        // Act
        return this.oController._handleRouter().then(function () {
            // Assert
            assert.strictEqual(this.oController._sCurrentPageId, "your-workpage-id-2", "_sCurrentPageId was set with the expected arguments");
        }.bind(this));
    });

    QUnit.test("saves the page ID if workpage component not initialized", function (assert) {
        // Arrange
        this.oGetPageAndSpaceIdStub.resolves({pageId: "your-workpage-id-2"});
        this.oIsWorkPageStub.resolves(true);

        delete this.oMockWorkPagesComponent.onRouteMatched;
        this.oMockWorkPagesComponent.setPageId = sandbox.stub();

        // Act
        return this.oController._handleRouter().then(function () {
            // Assert
            assert.ok(this.oController.oNavContainer.to.calledOnce, "NavContainer.to() was called");
            assert.deepEqual(this.oController.oNavContainer.to.firstCall.args[0], this.oController.oWorkpageRuntime, "workpageComponent was instantiated");
            assert.ok(this.oIsWorkPageStub.calledOnce, "isWorkPage was called");
            assert.strictEqual(this.oIsWorkPageStub.firstCall.args[0], "your-workpage-id-2", "isWorkPage was called with the expected arguments");
            assert.ok(this.oMockPagesComponent.hideRuntime.calledOnce, "hideRuntime was called on PageRuntime");
            assert.ok(this.oMockWorkPagesComponent.setPageId.calledOnce, "setPageId was called on the WorkPageRuntime");
            assert.strictEqual(this.oMockWorkPagesComponent.setPageId.firstCall.args[0], "your-workpage-id-2", "setPageId was called with the expected arguments");
        }.bind(this));
    });

    QUnit.module("RuntimeSwitcherController _onBeforeFirstShowPagesRuntime", {
        beforeEach: function () {
            this.oController = new RuntimeSwitcherController();
            this.oAddEventDelegateStub = sandbox.stub();
            this.oComponent = {};
            this.oComponentCreateStub = sandbox.stub(Component, "create").resolves(this.oComponent);
            this.oComponentContainerPlaceAtStub = sandbox.stub();
            this.oCreateComponentContainerStub = sandbox.stub(this.oController, "_createComponentContainer").returns({
                placeAt: this.oComponentContainerPlaceAtStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates and initializes pages component correctly", function (assert) {
        return this.oController._onBeforeFirstShowPagesRuntime().then(function () {
            assert.ok(this.oComponentCreateStub.calledOnce, "Component.create() was called once");
            assert.deepEqual(this.oComponentCreateStub.firstCall.args[0], {
                name: "sap.ushell.components.pages",
                componentData: {
                    navigationDisabled: true
                },
                asyncHints: {preloadBundles: ["sap/ushell/preload-bundles/homepage-af-dep.js"]},
                manifest: true
            }, "Component.create() was called with the correct parameters");
            assert.ok(this.oComponentContainerPlaceAtStub.calledOnce, "ComponentContainer.placeAt() was called once");
            assert.strictEqual(this.oComponentContainerPlaceAtStub.firstCall.args[0], this.oController.byId("pagesRuntime"), "ComponentContainer.placeAt() was called with the correct parameter");
            assert.strictEqual(this.oController.oPageRuntimeComponent, this.oComponent, "oPageRuntimeComponent is set correctly");
        }.bind(this));
    });

    QUnit.module("RuntimeSwitcherController _onBeforeFirstShowWorkpageRuntime", {
        beforeEach: function () {
            this.oController = new RuntimeSwitcherController();
            this.oAddEventDelegateStub = sandbox.stub();
            this.oByIdStub = sandbox.stub(this.oController, "byId");
            this.oGetWorkpageComponentPropertiesStub = sandbox.stub(this.oController, "_getWorkpageComponentProperties").returns({
                asyncHints: undefined,
                manifest: true,
                name: "external.workpage",
                settings: {
                    componentData: {
                        componentDataProperty: "value",
                        navigationDisabled: true
                    },
                    someComponentSetting: "value"
                },
                url: "/external/workpage/location"
            });
            this.oComponent = {};
            this.oComponentCreateStub = sandbox.stub(Component, "create").resolves(this.oComponent);
            this.oComponentContainerPlaceAtStub = sandbox.stub();
            this.oCreateComponentContainerStub = sandbox.stub(this.oController, "_createComponentContainer").returns({
                placeAt: this.oComponentContainerPlaceAtStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates and initializes workpage component correctly", function (assert) {
        return this.oController._onBeforeFirstShowWorkpageRuntime().then(function () {
            assert.ok(this.oGetWorkpageComponentPropertiesStub.calledOnce, "_getWorkpageComponentProperties() was called once");
            assert.ok(this.oComponentCreateStub.calledOnce, "Component.create() was called once");
            assert.deepEqual(this.oComponentCreateStub.firstCall.args[0], {
                asyncHints: undefined,
                manifest: true,
                name: "external.workpage",
                settings: {
                    componentData: {
                        componentDataProperty: "value",
                        navigationDisabled: true
                    },
                    someComponentSetting: "value"
                },
                url: "/external/workpage/location"
            }, "Component.create() was called with the correct parameters");
            assert.ok(this.oComponentContainerPlaceAtStub.calledOnce, "ComponentContainer.placeAt() was called once");
            assert.strictEqual(this.oComponentContainerPlaceAtStub.firstCall.args[0], this.oController.byId("workpagesRuntime"), "ComponentContainer.placeAt() was called with the correct parameter");
            assert.strictEqual(this.oController.oWorkPageRuntimeComponent, this.oComponent, "oPageRuntimeComponent is set correctly");
        }.bind(this));
    });

    QUnit.module("RuntimeSwitcherController _getWorkpageComponentProperties", {
        beforeEach: function () {
            this.oGetFLPPlatformStub = sandbox.stub(Container, "getFLPPlatform");
            this.oGetFLPPlatformStub.withArgs(true).returns("cFLP");
            this.oController = new RuntimeSwitcherController();
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(
                ["core-ext-light-0.js",
                "core-ext-light-1.js"]);
            this.oConfigLastStub.withArgs("/core/workPages/component").returns({
                name: "external.workpage",
                url: "/external/workpage/location",
                someComponentSetting: "value",
                componentData: {
                    componentDataProperty: "value"
                },
                asyncHints: {
                    preloadBundles: ["workpage-preloadBundle-0.js", "workpage-preloadBundle-1.js"]
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates correct component properties when addCoreResourcesComplement is not set (defaults to true)", function (assert) {
        const oActualComponentProperties = this.oController._getWorkpageComponentProperties();
        assert.deepEqual(oActualComponentProperties, {
            name: "external.workpage",
            url: "/external/workpage/location",
            componentData: {
                componentDataProperty: "value",
                navigationDisabled: true,
                pageWidthSizeMode: "fullWidth"
            },
            asyncHints: {
                preloadBundles: [
                    "workpage-preloadBundle-0.js",
                    "workpage-preloadBundle-1.js",
                    "core-ext-light-0.js",
                    "core-ext-light-1.js"
                ]
            },
            someComponentSetting: "value",
            manifest: true
        }, "The component properties are correct");
    });

    QUnit.test("Creates correct component properties when addCoreResourcesComplement is false", function (assert) {
        this.oConfigLastStub.withArgs("/core/workPages/component").returns({
            name: "external.workpage",
            url: "/external/workpage/location",
            someComponentSetting: "value",
            componentData: {
                componentDataProperty: "value"
            },
            asyncHints: {
                preloadBundles: ["workpage-preloadBundle-0.js", "workpage-preloadBundle-1.js"]
            },
            addCoreResourcesComplement: false
        });


        const oActualComponentProperties = this.oController._getWorkpageComponentProperties();
        assert.deepEqual(oActualComponentProperties, {
            name: "external.workpage",
            url: "/external/workpage/location",
            componentData: {
                componentDataProperty: "value",
                navigationDisabled: true,
                pageWidthSizeMode: "fullWidth"
            },
            asyncHints: {
                preloadBundles: [
                    "workpage-preloadBundle-0.js",
                    "workpage-preloadBundle-1.js"
                ]
            },
            someComponentSetting: "value",
            manifest: true
        }, "The component properties are correct");
    });

    QUnit.test("Creates correct component properties when customPreload is disabled", function (assert) {
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(false);

        const oActualComponentProperties = this.oController._getWorkpageComponentProperties();
        assert.deepEqual(oActualComponentProperties, {
            name: "external.workpage",
            url: "/external/workpage/location",
            componentData: {
                componentDataProperty: "value",
                navigationDisabled: true,
                pageWidthSizeMode: "fullWidth"
            },
            asyncHints: {
                preloadBundles: [
                    "workpage-preloadBundle-0.js",
                    "workpage-preloadBundle-1.js"
                ]
            },
            someComponentSetting: "value",
            manifest: true
        }, "The component properties are correct");
    });

    QUnit.module("RuntimeSwitcherController _getWorkpageComponentProperties for SAP Start", {
        beforeEach: function () {
            this.oGetFLPPlatformStub = sandbox.stub(Container, "getFLPPlatform");
            this.oGetFLPPlatformStub.withArgs(true).returns("MYHOME");
            this.oController = new RuntimeSwitcherController();
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/workPages/myHome/pageId").returns("myhome-page-id");
            this.oConfigLastStub.withArgs("/core/customPreload/coreResourcesComplement").returns(
                ["core-ext-light-0.js",
                "core-ext-light-1.js"]);
            this.oConfigLastStub.withArgs("/core/workPages/component").returns({
                name: "external.workpage",
                url: "/external/workpage/location",
                someComponentSetting: "value",
                componentData: {
                    componentDataProperty: "value"
                },
                asyncHints: {
                    preloadBundles: ["workpage-preloadBundle-0.js", "workpage-preloadBundle-1.js"]
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates correct component properties when customPreload is disabled", function (assert) {
        this.oConfigLastStub.withArgs("/core/customPreload/enabled").returns(false);

        const oActualComponentProperties = this.oController._getWorkpageComponentProperties();
        assert.deepEqual(oActualComponentProperties, {
            name: "external.workpage",
            url: "/external/workpage/location",
            componentData: {
                componentDataProperty: "value",
                navigationDisabled: true,
                pageWidthSizeMode: "large"
            },
            asyncHints: {
                preloadBundles: [
                    "workpage-preloadBundle-0.js",
                    "workpage-preloadBundle-1.js"
                ]
            },
            someComponentSetting: "value",
            manifest: true
        }, "The component properties are correct pageWidthSizeMode: large");
    });

});
