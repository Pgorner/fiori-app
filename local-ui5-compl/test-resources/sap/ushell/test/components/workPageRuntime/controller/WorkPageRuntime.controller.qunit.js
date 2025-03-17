// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageRuntime.controller.WorkPageRuntime.controller
 */
sap.ui.define([
    "sap/ushell/components/workPageRuntime/controller/WorkPageRuntime.controller",
    "sap/ushell/components/pages/controller/PagesAndSpaceId",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/Container"
], function (
    WorkPageRuntimeController,
    PagesAndSpaceId,
    Config,
    EventHub,
    Container
) {
    "use strict";
    /* global QUnit sinon*/
    var sandbox = sinon.createSandbox();

    QUnit.module("WorkPageRuntimeController", {
        beforeEach: function () {
            this.getRendererStub = sandbox.stub(Container, "getRendererInternal");
            this.oController = new WorkPageRuntimeController();
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
            this.oAttachMatchedStub = sandbox.stub();
            this.oGetRouteStub = sandbox.stub().returns({
                attachMatched: this.oAttachMatchedStub
            });
            this.oRendererStub = sandbox.stub(Container, "getRendererInternal").returns({
                getRouter: sandbox.stub().returns({
                    getRoute: this.oGetRouteStub
                })
            });
            this.oIsAdminUserStub = sandbox.stub().returns(true);
            this.oGetUserStub = sandbox.stub(Container, "getUser").returns({
                isAdminUser: this.oIsAdminUserStub
            });
            sandbox.stub(Container, "getServiceAsync").resolves();

            this.oController = new WorkPageRuntimeController();
            this.oGetNavigationDisabledStub = sandbox.stub().returns(false);

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                getNavigationDisabled: this.oGetNavigationDisabledStub
            });

            this.oToStub = sandbox.stub();
            this.oByIdStub = sandbox.stub();
            this.oByIdStub.withArgs("workPageNavContainer").returns({
                to: this.oToStub
            });
            this.oByIdStub.withArgs("workPage").returns({
                work: "page"
            });

            this.oController.byId = this.oByIdStub;
            this.oGetPageIdStub = sandbox.stub(this.oController, "_getPageId").resolves("test-page-id");
            this.oController._oWorkPageBuilderComponentCreatedPromise = Promise.resolve();

            this.oSetPageDataStub = sandbox.stub();


            this.oComponent = {
                setPageData: this.oSetPageDataStub
            };
        },

        afterEach: function () {
            sandbox.restore();
        }
    });
    QUnit.test("loads the workpage", function (assert) {
        // Arrange

        // Act
        this.oController.onInit();
        this.oController._oWorkPageBuilderComponentResolve(this.oComponent);

        this.oLoadWorkPageAndVisualizationsStub = sandbox.stub(this.oController.oWorkPageService, "loadWorkPageAndVisualizations").resolves({
            workPage: {
                contents: { id: "workpage", rows: [] },
                editable: false,
                usedVisualizations: {
                    nodes: [
                        { id: "viz1", descriptor: {} },
                        { id: "viz2", descriptor: {} },
                        { id: "viz3", descriptor: {} }
                    ]
                }
            }
        });

        return this.oController._oInitPromise
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetRouteStub.getCall(0).args[0], "home", "getRoute('home') was called");
                assert.strictEqual(this.oGetRouteStub.getCall(1).args[0], "openFLPPage", "getRoute('openFLPPage') was called");
                assert.ok(this.oGetPageIdStub.calledOnce, "_getPageId was called");
                assert.ok(this.oToStub.calledOnce, "The NavContainer navigated");
                assert.deepEqual(this.oToStub.getCall(0).args[0], {
                    work: "page"
                }, "The NavContainer navigated to the work page");

                assert.deepEqual(this.oController._oOriginalData, {
                    workPage: {
                        contents: {
                            id: "workpage",
                            rows: []
                        },
                        usedVisualizations: {
                            nodes: [
                                { id: "viz1", descriptor: {} },
                                { id: "viz2", descriptor: {} },
                                { id: "viz3", descriptor: {} }
                            ]
                        },
                        editable: false
                    }
                }, "original data was saved.");

                assert.ok(this.oLoadWorkPageAndVisualizationsStub.calledOnce, "loadWorkPageAndVisualizations was called.");
                assert.deepEqual(
                    this.oLoadWorkPageAndVisualizationsStub.firstCall.args,
                    ["test-page-id", true],
                    "loadWorkPageAndVisualizations was called with the correct arguments."
                );
                assert.ok(this.oSetPageDataStub.calledOnce, "setPageData was called.");
                assert.deepEqual(this.oSetPageDataStub.firstCall.args[0], {
                    workPage: {
                        contents: {
                            id: "workpage",
                            rows: []
                        },
                        usedVisualizations: {
                            nodes: [
                                { id: "viz1", descriptor: {} },
                                { id: "viz2", descriptor: {} },
                                { id: "viz3", descriptor: {} }
                            ]
                        },
                        editable: false
                    }
                }, "setPageData was called with the correct arguments.");
                assert.ok(this.oAttachMatchedStub.calledTwice, "attachMatched was called 2 times.");
            }.bind(this));

    });

    QUnit.test("Does not attach handlers to matched routes if navigation is disabled", function (assert) {
        // Arrange
        this.oGetNavigationDisabledStub.returns(true);

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise
            .then(function () {

                // Assert
                assert.strictEqual(this.oAttachMatchedStub.callCount, 0, "The function attachMatched was not called.");
            }.bind(this));

    });

    QUnit.module("onWorkPageBuilderCreated", {
        beforeEach: function () {
            this.oController = new WorkPageRuntimeController();
            this.oComponentMock = {
                attachEvent: this.oAttachEventStub
            };
            this.oEventMock = {
                getParameter: sandbox.stub().returns(this.oComponentMock)
            };
            this.oController._oWorkPageBuilderComponentResolve = sandbox.stub();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("saves the component and resolves the promise", function (assert) {
        // Act
        this.oController.onWorkPageBuilderCreated(this.oEventMock);

        // Assert
        assert.deepEqual(this.oController._oWorkPageBuilderComponent, this.oComponentMock, "The component was saved.");
        assert.ok(this.oController._oWorkPageBuilderComponentResolve.calledOnce, "The promise was resolved.");
        assert.deepEqual(this.oController._oWorkPageBuilderComponentResolve.firstCall.args[0], this.oComponentMock, "The promise was resolved with the correct arguments");
    });

    QUnit.module("onRouteMatched", {
        beforeEach: function () {
            this.oEventHubEmitSpy = sandbox.spy(EventHub, "emit");
            this.oController = new WorkPageRuntimeController();
            this.oController._sSiteId = "test-site-id";
            this.oGetPageIdStub = sandbox.stub(this.oController, "_getPageId").resolves("test-page-id");
            this.oLoadWorkPageAndVisualizationsStub = sandbox.stub().resolves({
                workPage: {
                    contents: {
                        id: "workpage",
                        rows: []
                    },
                    usedVisualizations: {
                        nodes: [
                            { id: "viz1", descriptor: {} },
                            { id: "viz2", descriptor: {} },
                            { id: "viz3", descriptor: {} }
                        ]
                    },
                    editable: true
                }
            });

            this.oController.oWorkPageService = {
                loadWorkPageAndVisualizations: this.oLoadWorkPageAndVisualizationsStub
            };

            this.oToStub = sandbox.stub();
            this.oByIdStub = sandbox.stub();
            this.oByIdStub.withArgs("workPage").returns({
                work: "page"
            });
            this.oController.oWorkPageNavContainer = {
                to: this.oToStub
            };

            this.oController.byId = this.oByIdStub;
            this.oController._bWorkPageIsDirty = true;

            this.oAttachEventStub = sandbox.stub();
            this.oSetPageDataStub = sandbox.stub();


            this.oComponent = {
                setPageData: this.oSetPageDataStub
            };
            this.oController._oWorkPageBuilderComponentCreatedPromise = Promise.resolve(this.oComponent);

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("loads the workpage", function (assert) {
        // Act
        return this.oController.onRouteMatched()
            .then(function () {

                // Assert
                assert.ok(this.oGetPageIdStub.calledOnce, "_getPageId was called");
                assert.ok(this.oToStub.calledOnce, "The NavContainer navigated");
                assert.deepEqual(this.oToStub.getCall(0).args[0], {
                    work: "page"
                }, "The NavContainer navigated to the work page");

                assert.deepEqual(this.oController._oOriginalData, {
                    workPage: {
                        contents: {
                            id: "workpage",
                            rows: []
                        },
                        usedVisualizations: {
                            nodes: [
                                { id: "viz1", descriptor: {} },
                                { id: "viz2", descriptor: {} },
                                { id: "viz3", descriptor: {} }
                            ]
                        },
                        editable: true
                    }
                }, "original data was saved.");

                assert.ok(this.oLoadWorkPageAndVisualizationsStub.calledOnce, "loadWorkPageAndVisualizations was called.");
                assert.deepEqual(
                    this.oLoadWorkPageAndVisualizationsStub.firstCall.args,
                    ["test-page-id", true],
                    "loadWorkPageAndVisualizations was called with the correct arguments."
                );
                assert.ok(this.oSetPageDataStub.calledOnce, "setPageData was called.");
                assert.deepEqual(this.oSetPageDataStub.firstCall.args[0], {
                    workPage: {
                        contents: {
                            id: "workpage",
                            rows: []
                        },
                        usedVisualizations: {
                            nodes: [
                                { id: "viz1", descriptor: {} },
                                { id: "viz2", descriptor: {} },
                                { id: "viz3", descriptor: {} }
                            ]
                        },
                        editable: true
                    }
                }, "setPageData was called with the correct arguments.");

                assert.strictEqual(this.oEventHubEmitSpy.withArgs("CloseFesrRecord").callCount, 1, "FESR Record was closed");
            }.bind(this));
    });

    QUnit.module("_getPageId", {
        beforeEach: function () {
            this.oController = new WorkPageRuntimeController();
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/workPages/myHome/pageId");
            this.oGetPageAndSpaceIdStub = sandbox.stub(PagesAndSpaceId, "getPageAndSpaceId").resolves({
                pageId: "test-page-id"
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("resolves with the MyHome pageId if it exists", function (assert) {
        this.oConfigLastStub.returns("my-home-page-test-id");
        return this.oController._getPageId()
            .then(function (sPageId) {
                assert.strictEqual(sPageId, "my-home-page-test-id", "The MyHome page id was returned");
            });
    });
    QUnit.test("resolves with the pageId resolved by PagesAndSpaceId", function (assert) {
        this.oConfigLastStub.returns(undefined);
        return this.oController._getPageId()
            .then(function (sPageId) {
                assert.strictEqual(sPageId, "test-page-id", "The resolved page id was returned");
            });
    });

    QUnit.module("hideRuntime", {
        beforeEach: function () {
            this.oController = new WorkPageRuntimeController();
            this.oToStub = sandbox.stub();
            this.oController.oWorkPageNavContainer = {
                to: this.oToStub
            };
            this.oController.oEmptyPage = {
                test: "page"
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("hides the runtime and navigates to the empty page", function (assert) {
        // Act
        this.oController.hideRuntime();

        // Assert
        assert.equal(this.oToStub.callCount, 1, "The empty page was navigated to.");
        assert.deepEqual(this.oToStub.getCall(0).args[0], this.oController.oEmptyPage, "The empty page was navigated to.");
    });
});
