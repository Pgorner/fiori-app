// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/* global QUnit, sinon */

/**
 * @file QUnit tests for "sap.ushell.components.pages.controller.PageRuntime"
 */
sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/VBox",
    "sap/ui/core/Element",
    "sap/ui/core/EventBus",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/theming/Parameters",
    "sap/ui/model/json/JSONModel",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/pages/ActionMode",
    "sap/ushell/components/pages/controller/PageRuntime.controller",
    "sap/ushell/components/pages/controller/PagesAndSpaceId",
    "sap/ushell/components/pages/MyHomeImport",
    "sap/ushell/components/pages/StateManager",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/VizInstance",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/Container"
], function (
    GenericTile,
    MessageBox,
    MessageToast,
    VBox,
    Element,
    EventBus,
    XMLView,
    ThemingParameters,
    JSONModel,
    nextUIUpdate,
    hasher,
    jQuery,
    ActionMode,
    PagesRuntimeController,
    PagesAndSpaceId,
    myHomeImport,
    StateManager,
    Config,
    EventHub,
    ushellLibrary,
    resources,
    VizInstance,
    Page,
    Section,
    ShellHeadItem,
    Container
) {
    "use strict";

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    const sandbox = sinon.createSandbox({});

    QUnit.module("The onInit function", {
        beforeEach: function () {
            this.oAttachMatchedStub = sandbox.stub();
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetRouteStub = sandbox.stub().returns({
                attachMatched: this.oAttachMatchedStub
            });

            sandbox.stub(Container, "getRendererInternal").returns({
                getRouter: sandbox.stub().returns({
                    getRoute: this.oGetRouteStub
                }),
                getShellConfig: sandbox.stub().returns({ rootIntent: "Shell-home" })
            });

            this.oGetModelStub = sandbox.stub();
            this.oPagesServiceStub = {
                getModel: this.oGetModelStub
            };
            this.oGetPagesServiceStub = sandbox.stub().resolves(this.oPagesServiceStub);
            this.oGetServiceAsyncStub.withArgs("VisualizationInstantiation").resolves("vizInstantiation");
            this.oStateManagerInitStub = sandbox.stub(StateManager, "init");

            this.oController = new PagesRuntimeController();
            this.oOnRouteMatchedStub = sandbox.stub(this.oController, "onRouteMatched");
            this.oOpenFLPPageStub = sandbox.stub(this.oController, "_openFLPPage").resolves();
            this._oGetMyHomeTitleStub = sandbox.stub(this.oController, "_getMyHomeTitle").resolves("My Home");
            this.oGetNavigationDisabledStub = sandbox.stub().returns(false);
            this.oController.getOwnerComponent = function () {
                return {
                    getPagesService: this.oGetPagesServiceStub,
                    getNavigationDisabled: this.oGetNavigationDisabledStub
                };
            }.bind(this);
            this.oSetPerformanceMarkStub = sandbox.stub(this.oController, "_setPerformanceMark");
            this.oByIdStub = sandbox.stub();
            this.oPagesRuntimeNavContainer = {
                to: sandbox.stub()
            };
            this.oPagesNavContainer = {
                getCurrentPage: sandbox.stub(),
                $: sandbox.stub().returns({
                    firstFocusableDomRef: sandbox.stub()
                })
            };
            this.oByIdStub.withArgs("pagesRuntimeNavContainer").returns(this.oPagesRuntimeNavContainer);
            this.oByIdStub.withArgs("pagesNavContainer").returns(this.oPagesNavContainer);
            this.oErrorPage = { id: "errorPage" };
            this.oByIdStub.withArgs("errorPage").returns(this.oErrorPage);
            this.oEmptyPage = { id: "emptyPage" };
            this.oByIdStub.withArgs("emptyPage").returns(this.oEmptyPage);
            this.oController.byId = this.oByIdStub;

            this.oViewSettingsModelMock = new JSONModel({
                gridContainerGap: [],
                gridContainerRowSize: []
            });
            this.oGetPropertyStub = sandbox.spy();
            this.oSetPropertyStub = sandbox.spy();
            this.oSetModelStub = sandbox.stub();
            this.oController.getView = function () {
                return {
                    setModel: this.oSetModelStub,
                    getModel: sandbox.stub().withArgs("viewSettings").returns(this.oViewSettingsModelMock)
                };
            }.bind(this);

            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oEventHubDoStub = sandbox.stub();
            this.oEventHubOnceStub = sandbox.stub(EventHub, "once");
            this.oEventHubOnceStub.withArgs("PagesRuntimeRendered").returns({
                do: this.oEventHubDoStub
            });

            this.oThemingParametersStub = sandbox.stub(ThemingParameters, "get");
            this.oThemingParametersStub.callsFake(({ callback }) => {
                callback({
                    _sap_ushell_Tile_Spacing: undefined,
                    _sap_ushell_Tile_SpacingXS: undefined,
                    _sap_ushell_Tile_SpacingS: undefined,
                    _sap_ushell_Tile_Width: undefined,
                    _sap_ushell_Tile_WidthXS: undefined,
                    _sap_ushell_Tile_WidthS: undefined
                });
            });

            this.oCreateActionModeButtonStub = sandbox.stub(this.oController, "_createActionModeButton");

            this.oEventBusSubscribeStub = sandbox.stub(EventBus.getInstance(), "subscribe");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            EventHub._reset();
        }
    });

    QUnit.test("Gets VisualizationInstantiation service and URL parsing service asynchronously", function (assert) {
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 2, "The method getServiceAsync is called 2 times");
            assert.deepEqual(this.oGetServiceAsyncStub.getCall(0).args, ["VisualizationInstantiation"], "The method getServiceAsync is called with 'VisualizationInstantiation'");
            assert.deepEqual(this.oGetServiceAsyncStub.getCall(1).args, ["URLParsing"], "The method getServiceAsync is called with 'URLParsing'");
        }.bind(this));
    });

    QUnit.test("Sets the correct data in the view settings model during instantiation", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/home/sizeBehavior").returns("Responsive");
        this.oConfigLastStub.withArgs("/core/catalog/enableHideGroups").returns(true);
        this.oConfigLastStub.withArgs("/core/catalog/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        var oExpectedJSONModelData = {
            sizeBehavior: "Responsive",
            actionModeActive: false,
            actionModeEditActive: false,
            addToMyHomeOnly: false,
            showHideButton: true,
            showAddButton: true,
            personalizationEnabled: true,
            gridContainerGap: [],
            gridContainerRowSize: []
        };

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oSetModelStub.firstCall.args[0].getMetadata().getName(), "sap.ui.model.json.JSONModel", "The assigned model is of type sap.ui.model.json.JSONModel.");
            assert.deepEqual(this.oSetModelStub.firstCall.args[0].getData(), oExpectedJSONModelData, "The model data is correct.");
            assert.strictEqual(this.oSetModelStub.firstCall.args[1], "viewSettings", "The model is set to the view with name 'viewSettings'.");
        }.bind(this));
    });

    QUnit.test("Updates the sizeBehavior property on the view settings model on configuration change", function (assert) {
        // Arrange
        const done = assert.async(2);
        Config.emit("/core/home/sizeBehavior", "NewSizeBehaviour");

        // Act
        this.oController.onInit();
        this.oController._oInitPromise.then(done);

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            assert.strictEqual(this.oController._oViewSettingsModel.getProperty("/sizeBehavior"), "NewSizeBehaviour", "");
            done();
        }.bind(this));
    });

    QUnit.test("Sets the correct data in the error page model during instantiation", function (assert) {
        // Arrange
        var oExpectedJSONModelData = {
            title: "",
            description: "",
            details: "",
            pageAndSpaceId: "",
            technicalError: ""
        };

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oSetModelStub.getCall(1).args[0].getMetadata().getName(), "sap.ui.model.json.JSONModel", "The assigned model is of type sap.ui.model.json.JSONModel.");
            assert.deepEqual(this.oSetModelStub.getCall(1).args[0].getData(), oExpectedJSONModelData, "The model data is correct.");
            assert.strictEqual(this.oSetModelStub.getCall(1).args[1], "errorPage", "The model is set to the view with name 'errorPage'.");
        }.bind(this));
    });

    QUnit.test("Retrieves a model from pages services and set the model for the page runtime controller", function (assert) {
        // Arrange
        var oModel = { id: "model1" };
        this.oGetModelStub.returns(oModel);

        // Act
        var oInitPromise = this.oController.onInit();

        // Assert
        return Promise.all([
            oInitPromise,
            this.oController._oVisualizationInstantiationService,
            this.oGetPagesServiceStub
        ]).then(function () {
            assert.strictEqual(this.oGetModelStub.callCount, 1, "The method getModel is called once");
            assert.deepEqual(this.oSetModelStub.getCall(2).args[0], oModel, "The method setModel is called with correct parameters");
        }.bind(this));
    });

    QUnit.test("Attaches handlers to matched routes", function (assert) {
        // Arrange
        this.oOpenFLPPageStub.resolves();
        this.oOnRouteMatchedBoundSpy = sandbox.spy(this.oOnRouteMatchedStub, "bind");

        // Assert
        assert.strictEqual(this.oAttachMatchedStub.callCount, 0, "The function attachMatched was not called");

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oAttachMatchedStub.callCount, 2, "The function attachMatched is called twice");
            assert.strictEqual(this.oGetRouteStub.getCall(0).args[0], "home", "The function attachMatched is called on the 'home' route");
            assert.strictEqual(this.oGetRouteStub.getCall(1).args[0], "openFLPPage", "The function attachMatched is called on the 'openFLPPage' route");
            assert.strictEqual(this.oAttachMatchedStub.callCount, 2, "The function onRouteMatched was registered twice");
            assert.strictEqual(this.oOnRouteMatchedBoundSpy.getCall(0).args[1], true, "The function onRouteMatched is notified that the 'home' route was used when it was used");
            assert.strictEqual(this.oOnRouteMatchedBoundSpy.getCall(1).args[1], false, "The function onRouteMatched is notified a non-'home' route was used when it was used.");
        }.bind(this));

    });

    QUnit.test("Does not attach handlers to matched routes if navigation is disabled", function (assert) {
        // Arrange
        this.oOpenFLPPageStub.resolves();
        this.oOnRouteMatchedBoundSpy = sandbox.spy(this.oOnRouteMatchedStub, "bind");

        this.oGetNavigationDisabledStub.returns(true);

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oAttachMatchedStub.callCount, 0, "The function attachMatched is not called");
        }.bind(this));
    });

    QUnit.test("Calls the 'init' method of StateManager", function (assert) {
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oStateManagerInitStub.callCount, 1, "The method 'init' of StateManager is called once");
            assert.deepEqual(this.oStateManagerInitStub.getCall(0).args, [this.oPagesRuntimeNavContainer, this.oPagesNavContainer], "The method 'init' of StateManager is called once");
        }.bind(this));
    });

    QUnit.test("Calls _createActionModeButton if personalization is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            this.oEventHubDoStub.getCall(0).args[0]();

            // Assert
            assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 1, "_createActionModeButton was called once");
        }.bind(this));
    });

    QUnit.test("Calls _createActionModeButton if personalization is disabled but MyHome is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/userEnabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            this.oEventHubDoStub.getCall(0).args[0]();

            // Assert
            return this._oGetMyHomeTitleStub().then(function () {
                assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 1, "_createActionModeButton was called once");
                assert.strictEqual(this.oCreateActionModeButtonStub.getCall(0).args[0], "My Home", "_createActionModeButton was called with correct parameter");
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("Does not call _createActionModeButton if personalization is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            this.oEventHubDoStub.getCall(0).args[0]();

            // Assert
            assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 0, "_createActionModeButton was not called");
        }.bind(this));
    });

    QUnit.test("Performance mark are set when VizInstanceLoaded is emitted", function (assert) {
        // Arrange
        const done = assert.async();
        EventHub.emit("VizInstanceLoaded", "some_id");

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            //can not mock "on" because used also for Config
            setTimeout(function () {
                assert.strictEqual(this.oSetPerformanceMarkStub.callCount, 2, "_setPerformanceMarkStub is called twice.");
                assert.strictEqual(this.oSetPerformanceMarkStub.getCall(0).args[0], "FLP-PagesRuntime-onInit", "_setPerformanceMarkStub is called with correct parameters.");
                assert.strictEqual(this.oSetPerformanceMarkStub.getCall(1).args[0], "FLP-TTI-Homepage", "_setPerformanceMarkStub is called with correct parameters.");
                assert.ok(!!this.oController.oVisualizationInstantiationListenerTimeout, "timeout should be set");
                done();
            }.bind(this), 20);
        }.bind(this));
    });

    QUnit.test("Set the grid container sizes when themeChanged is emitted", function (assert) {
        // Arrange
        const done = assert.async();
        this.oConfigLastStub.withArgs("/core/home/sizeBehavior").returns("Responsive");
        this.oThemingParametersStub.callsFake(({ callback }) => {
            callback({
                _sap_ushell_Tile_Spacing: "0.1rem",
                _sap_ushell_Tile_SpacingXS: "0.2rem",
                _sap_ushell_Tile_SpacingS: "0.3rem",
                _sap_ushell_Tile_Width: "0.4rem",
                _sap_ushell_Tile_WidthXS: "0.5rem",
                _sap_ushell_Tile_WidthS: "0.6rem"
            });
        });

        // Act
        this.oController.onInit();

        EventHub.on("themeChanged").do(function () {
            setTimeout(() => {
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerGap/gridContainerGap"), "0.1rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerGap/gridContainerGapXS"), "0.2rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerGap/gridContainerGapS"), "0.3rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerGap/gridContainerGapM"), "0.1rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerGap/gridContainerGapL"), "0.1rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerGap/gridContainerGapXL"), "0.1rem");

                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerRowSize/gridContainerRowSize"), "0.4rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerRowSize/gridContainerRowSizeXS"), "0.5rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerRowSize/gridContainerRowSizeS"), "0.6rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerRowSize/gridContainerRowSizeM"), "0.4rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerRowSize/gridContainerRowSizeL"), "0.4rem");
                assert.strictEqual(this.oViewSettingsModelMock.getProperty("/gridContainerRowSize/gridContainerRowSizeXL"), "0.4rem");
                done();
            });
        }.bind(this));

        EventHub.emit("themeChanged");
    });

    QUnit.test("Adds listeners to launchpad docking events", function (assert) {
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oEventBusSubscribeStub.callCount, 2, "The function subscribe is called twice.");
            assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[0], "launchpad", "The function subscribe is called with correct parameters.");
            assert.strictEqual(this.oEventBusSubscribeStub.getCall(0).args[1], "shellFloatingContainerIsDocked", "The function subscribe is called with correct parameters.");
            assert.strictEqual(this.oEventBusSubscribeStub.getCall(1).args[0], "launchpad", "The function subscribe is called with correct parameters.");
            assert.strictEqual(this.oEventBusSubscribeStub.getCall(1).args[1], "shellFloatingContainerIsUnDocked", "The function subscribe is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Saves utility pages and navigates to the empty page", function (assert) {
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(this.oController.oEmptyPage, this.oEmptyPage, "Saved the empty page");
            assert.strictEqual(this.oController.oErrorPage, this.oErrorPage, "Saved the error page");
            assert.strictEqual(this.oPagesRuntimeNavContainer.to.getCall(0).args[0], this.oEmptyPage, "Navigated to the empty page");
        }.bind(this));
    });

    QUnit.test("Sets focus on link if this is the first element in a section", async function (assert) {
        // Arrange
        this.oLink = new GenericTile();
        this.oSection = new Section({
            compactItems: [
                this.oLink
            ]
        }).placeAt("qunit-fixture");
        this.oPagesNavContainer.getCurrentPage.returns({
            getContent: sandbox.stub().returns([
                {
                    getSections: sandbox.stub().returns([this.oSection])
                }
            ])
        });
        this.oPagesNavContainer.$.returns(jQuery(document.body));

        await nextUIUpdate();
        document.activeElement.blur();

        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(document.activeElement, this.oLink.getFocusDomRef(), "Focused the correct element");
            // Cleanup
            this.oSection.destroy();
        }.bind(this));
    });

    QUnit.test("Sets focus on the first item on the page when focus is not set", function (assert) {
        // Arrange
        this.oPagesNavContainer.$.returns(jQuery(document.body));
        var oFocusableElement = document.createElement("a");
        oFocusableElement.setAttribute("href", "#someLinkToAHeader");
        oFocusableElement.innerText = "I'm focusable!";
        document.body.prepend(oFocusableElement);
        document.activeElement.blur();
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert
            assert.strictEqual(document.activeElement, oFocusableElement, "Focused the correct element");
            // Cleanup
            oFocusableElement.remove();
        });
    });

    QUnit.test("Does not set a focus when focus is already set", function (assert) {
        // Arrange
        this.oPagesNavContainer.$.returns(jQuery(document.body));
        var oFocusableElement = document.createElement("a");
        oFocusableElement.setAttribute("href", "#someLinkToAHeader");
        oFocusableElement.innerText = "I'm focusable!";
        document.body.prepend(oFocusableElement);

        var oFocusedElement = document.createElement("a");
        oFocusedElement.setAttribute("href", "#someOtherLinkToAHeader");
        oFocusedElement.innerText = "I'm already focused!";
        document.body.append(oFocusedElement);
        oFocusedElement.focus();
        // Assert #1
        assert.strictEqual(document.activeElement, oFocusedElement, "Did not alter the focus");
        // Act
        this.oController.onInit();
        return this.oController._oInitPromise.then(function () {
            // Assert #2
            assert.strictEqual(document.activeElement, oFocusedElement, "Did not alter the focus");
            // Cleanup
            oFocusableElement.remove();
            oFocusedElement.remove();
        });
    });


    QUnit.module("The function getNumericThemeParam()", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Adds 0 to the return value", function (assert) {
        // Act
        var sResult = this.oController._formatNumericThemeParam(".3rem");
        // Assert
        assert.strictEqual(sResult, "0.3rem", "the 0 was added");
    });


    QUnit.module("The function _onFirstPageRendering", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/myHome/userEnabled").returns(true);

            this.oEventHubEmitStub = sandbox.stub(EventHub, "emit");

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetMyHomeSpaceStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("Menu").resolves({
                getMyHomeSpace: this.oGetMyHomeSpaceStub
            });

            this.oController = new PagesRuntimeController();
            this.oCreateActionModeButtonStub = sandbox.stub(this.oController, "_createActionModeButton");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Add button when personalization is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        // Act
        this.oController._onFirstPageRendering();

        // Assert
        assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 1, "_createActionModeButton is called once.");
        assert.deepEqual(this.oCreateActionModeButtonStub.getCall(0).args, [], "_createActionModeButton is called with correct parameters.");
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 0, "getServiceAsync was not called.");
        assert.strictEqual(this.oEventHubEmitStub.callCount, 1, "EventHub.emit is called once.");
        assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[0], "firstSegmentCompleteLoaded", "firstSegmentCompleteLoaded event is emitted");
        assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[1], true, "The event is emitted with correct value");
    });

    QUnit.test("Don't create button when personalization is disabled and myHome is disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        // Act
        this.oController._onFirstPageRendering();

        // Assert
        assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 0, "_createActionModeButton is called once.");
        assert.strictEqual(this.oGetServiceAsyncStub.callCount, 0, "getServiceAsync was not called.");
        assert.strictEqual(this.oEventHubEmitStub.callCount, 1, "EventHub.emit is called once.");
        assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[0], "firstSegmentCompleteLoaded", "firstSegmentCompleteLoaded event is emitted");
        assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[1], true, "The event is emitted with correct value");
    });

    QUnit.test("Add button when personalization is disabled and myHome is enabled", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var sPageTitle = "My Home";
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetMyHomeSpaceStub.resolves({
            children: [{
                label: sPageTitle
            }]
        });
        // Act
        this.oController._onFirstPageRendering();

        // Assert
        setTimeout(function () {
            assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 1, "_createActionModeButton is called once.");
            assert.deepEqual(this.oCreateActionModeButtonStub.getCall(0).args, [sPageTitle], "_createActionModeButton is called with correct parameter.");
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 1, "getServiceAsync was called once.");
            assert.strictEqual(this.oEventHubEmitStub.callCount, 1, "EventHub.emit is called once.");
            assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[0], "firstSegmentCompleteLoaded", "firstSegmentCompleteLoaded event is emitted");
            assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[1], true, "The event is emitted with correct value");
            fnDone();
        }.bind(this), 100);
    });

    QUnit.test("Don't add button when personalization is disabled and not myHome is found", function (assert) {
        // Arrange
        var fnDone = assert.async();
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/userEnabled").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        this.oGetMyHomeSpaceStub.resolves(null);
        // Act
        this.oController._onFirstPageRendering();

        // Assert
        setTimeout(function () {
            assert.strictEqual(this.oCreateActionModeButtonStub.callCount, 0, "_createActionModeButton is called once.");
            assert.strictEqual(this.oGetServiceAsyncStub.callCount, 0, "getServiceAsync was not called.");
            assert.strictEqual(this.oEventHubEmitStub.callCount, 1, "EventHub.emit is called once.");
            assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[0], "firstSegmentCompleteLoaded", "firstSegmentCompleteLoaded event is emitted");
            assert.strictEqual(this.oEventHubEmitStub.getCall(0).args[1], true, "The event is emitted with correct value");
            fnDone();
        }.bind(this), 100);
    });

    QUnit.module("The function _openFLPPage", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oIsSpacePageAssignedStub = sandbox.stub().resolves(true);
            this.oGetServiceAsyncStub.withArgs("Menu").returns({
                isSpacePageAssigned: this.oIsSpacePageAssignedStub
            });

            this.oController = new PagesRuntimeController();
            this.oController.oInitFinishedPromise = Promise.resolve();
            this.oLoadPageStub = sandbox.stub().resolves();


            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({
                    loadPage: this.oLoadPageStub
                })
            });

            this.oGetPageAndSpaceIdStub = sandbox.stub(PagesAndSpaceId, "getPageAndSpaceId").resolves({
                spaceId: "space1",
                pageId: "page1"
            });
            this.oNavigateStub = sandbox.stub(this.oController, "_navigate");
            this.oNavigateToMyHomeStub = sandbox.stub(this.oController, "_navigateToInitialMyHome");
            this.oMyHomeRouteActiveStub = sandbox.stub(this.oController, "_isMyHomeRouteActive").returns(false);
            this.oMyHomePageEmptyStub = sandbox.stub(this.oController, "_isMyHomePageEmpty").returns(false);
            this.oMyHomeTitleStub = sandbox.stub(this.oController, "_getMyHomeTitle").resolves("My Home");
            this.oResourceI18nGetTextStub = sandbox.stub(resources.i18n, "getText").callsFake((i18nKey, parameters) => {
                if (!parameters) {
                    return i18nKey;
                }
                return [i18nKey, ...parameters];
            });
            this.oNavContainerToStub = sandbox.stub();
            this.oController._oErrorPageModel = new JSONModel({});
            this.oSetViewModelPropertyStub = sandbox.stub();
            this.oController._oViewSettingsModel = {
                setProperty: this.oSetViewModelPropertyStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
            this.oController.oErrorPage = {
                id: "page-1"
            };
            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oShowActionModeButtonStub = sandbox.stub(this.oController, "_showActionModeButton");
            this.oHideActionModeButtonStub = sandbox.stub(this.oController, "_hideActionModeButton");
            this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            EventHub._reset();
        }
    });

    QUnit.test("Emits the PageRuntimeRendered event of the EventHub", function (assert) {
        const done = assert.async();
        // Act
        this.oController._openFLPPage().then(function () {
            EventHub.on("PagesRuntimeRendered").do(function () {
                // Assert
                assert.ok(true, "The init function emit the PagesRuntimeRendered event.");
                done();
            });
        });
    });

    QUnit.test("Gets the pageId and spaceId", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oGetPageAndSpaceIdStub.callCount, 1, "The function getPageAndSpaceId is called once.");
        }.bind(this));
    });

    QUnit.test("Loads the required page", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oLoadPageStub.getCall(0).args, ["page1"], "The function loadPage of the pages service is called with page id 'page1'.");
        }.bind(this));
    });

    QUnit.test("Navigates to the specified page", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.deepEqual(this.oNavigateStub.firstCall.args, ["page1", "space1"], "The function navigate is called with page id 'page1' and space id 'space1'.");
            assert.strictEqual(this.oShowActionModeButtonStub.callCount, 1, "_showActionModeButton was called once");
            assert.strictEqual(this.oSetViewModelPropertyStub.callCount, 2, "setProperty of viewSettingsModel was set");
            assert.strictEqual(this.oSetViewModelPropertyStub.getCall(0).args[0], "/personalizationEnabled", "personalizationEnabled of viewSettingsModel was updated");
            assert.strictEqual(this.oSetViewModelPropertyStub.getCall(0).args[1], false, "The value was taken from Config");
            assert.strictEqual(this.oConfigLastStub.callCount, 2, "Config.last was called twice");
            assert.strictEqual(this.oConfigLastStub.getCall(0).args[0], "/core/shell/enablePersonalization", "Config.last was called with correct parameter");
        }.bind(this));
    });

    QUnit.test("Navigates to the empty My Home page", function (assert) {
        // Arrange
        this.oMyHomeRouteActiveStub.returns(true);
        this.oMyHomePageEmptyStub.returns(true);
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.ok(this.oNavigateToMyHomeStub.calledOnce, "The function navigateToMyHome was called.");
            assert.strictEqual(this.oShowActionModeButtonStub.callCount, 1, "_showActionModeButton was called once");
            assert.strictEqual(this.oSetViewModelPropertyStub.callCount, 2, "setProperty of viewSettingsModel was set");
            assert.strictEqual(this.oSetViewModelPropertyStub.getCall(0).args[0], "/personalizationEnabled", "personalizationEnabled of viewSettingsModel was updated");
            assert.strictEqual(this.oSetViewModelPropertyStub.getCall(0).args[1], true, "MyHome is always personalizable");
        }.bind(this));
    });

    QUnit.test("Navigates to the not empty My Home page", function (assert) {
        // Arrange
        this.oMyHomeRouteActiveStub.returns(true);
        this.oMyHomePageEmptyStub.returns(false);
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.ok(this.oNavigateToMyHomeStub.notCalled, "The function navigateToMyHome was not called.");
            assert.strictEqual(this.oShowActionModeButtonStub.callCount, 1, "_showActionModeButton was called once");
            assert.strictEqual(this.oSetViewModelPropertyStub.callCount, 2, "setProperty of viewSettingsModel was set");
            assert.strictEqual(this.oSetViewModelPropertyStub.getCall(0).args[0], "/personalizationEnabled", "personalizationEnabled of viewSettingsModel was updated");
            assert.strictEqual(this.oSetViewModelPropertyStub.getCall(0).args[1], true, "MyHome is always personalizable");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when getPageAndSpaceId returns a rejected promise", function (assert) {
        // Arrange
        var oError = { error: "This is an error" };
        this.oGetPageAndSpaceIdStub.rejects(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page if the space and page are not assigned", function (assert) {
        // Arrange
        this.oIsSpacePageAssignedStub.resolves(false);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            var oModel = this.oController._oErrorPageModel;
            assert.deepEqual(oModel.getProperty("/details"), ["PageRuntime.CannotLoadPage.Details", '"The combination of space and page is not assigned to the user."'],
                "The correct error message was set.");
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when getPageAndSpaceId returns a rejected promise", function (assert) {
        // Arrange
        var oError = { error: "This is an error" };
        this.oGetPageAndSpaceIdStub.rejects(oError);

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            var oModel = this.oController._oErrorPageModel;
            assert.strictEqual(oModel.getProperty("/title"), "PageRuntime.GeneralError.Text", "The method setProperty is called with correct parameters.");
            assert.deepEqual(oModel.getProperty("/details"), ["PageRuntime.CannotLoadPage.SystemErrorMessagePrefix", JSON.stringify(oError)],
                "The method setProperty is called with correct parameters.");
            assert.strictEqual(oModel.getProperty("/description"), "", "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when an error that is a javascript error object occurs", function (assert) {
        // Arrange

        this.oController.getOwnerComponent = sandbox.stub().returns({
            getPagesService: sandbox.stub().rejects(new Error("A javascript error object"))
        });

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            var oModel = this.oController._oErrorPageModel;
            assert.strictEqual(oModel.getProperty("/title"), "PageRuntime.GeneralError.Text", "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when an error that is a javascript error object occurs", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = sandbox.stub().returns({
            getPagesService: sandbox.stub().rejects(new Error("A javascript error object"))
        });

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Sets the properties in the error page model when there is an error", function (assert) {
        // Arrange
        var oError = { error: "This is an error" };

        this.oController.getOwnerComponent = sandbox.stub().returns({
            getPagesService: sandbox.stub().rejects(oError)
        });

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            var oModel = this.oController._oErrorPageModel;
            assert.deepEqual(oModel.getProperty("/title"), "PageRuntime.CannotLoadPage.Title", "The method setProperty is called with correct parameters.");
            assert.deepEqual(oModel.getProperty("/details"), ["PageRuntime.CannotLoadPage.Details", JSON.stringify(oError)],
                "The method setProperty is called with correct parameters.");
            assert.strictEqual(oModel.getProperty("/description"), "", "The method setProperty is called with correct parameters.");
        }.bind(this));
    });

    QUnit.test("Navigates to an error page when there is an error", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = sandbox.stub().returns({
            getPagesService: sandbox.stub().rejects()
        });
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 1, "The function 'to' of navContainer is called once.");
            assert.strictEqual(this.oNavContainerToStub.getCall(0).args[0], this.oController.oErrorPage, "The function 'to' of navContainer is called parameters.");
            assert.strictEqual(this.oHideActionModeButtonStub.callCount, 1, "_hideActionModeButton was called once");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Updates the sCurrentTargetPageId property with the current pageId", function (assert) {
        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oController.sCurrentTargetPageId, "page1", "The correct value has been found.");
        }.bind(this));
    });

    QUnit.test("Does not call _navigate if the pageId is no longer the current target", function (assert) {
        // Arrange
        this.oController.getOwnerComponent = {
            getPagesService: function () {
                return Promise.resolve({
                    loadPage: function () {
                        // Use fake implementation to asynchronously set sCurrentTargetPageId.
                        // (Otherwise, the resolver function is executed synchronously.)
                        return new Promise(function (resolve) {
                            this.oController.sCurrentTargetPageId = "otherPageId";
                            resolve();
                        }.bind(this));
                    }.bind(this)
                });
            }
        };

        // Act
        return this.oController._openFLPPage().then(function () {
            // Assert
            assert.strictEqual(this.oNavigateStub.callCount, 0, "The function _navigate has not been called.");
        }.bind(this));
    });

    QUnit.module("The function _onAfterPageNavigated", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.sCurrentPageId = "MyHappyPlace";
            this.oGetIdStub = sandbox.stub().returns(this.sCurrentPageId);
            this.oGetCurrentPageStub = sandbox.stub().returns({
                getId: this.oGetIdStub
            });
            this.oController.oPagesNavContainer = {
                getCurrentPage: this.oGetCurrentPageStub
            };
            this.oEventHubEmitSpy = sandbox.spy(EventHub, "emit");
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
            EventHub._reset();
        }
    });

    QUnit.test("Emits the PageRuntimeRendered event", function (assert) {
        // Act
        this.oController._onAfterPageNavigated();

        // Assert
        assert.strictEqual(this.oEventHubEmitSpy.withArgs("PageRendered").callCount, 0, "PageRendered Event was not emitted");
        const oCall = this.oEventHubEmitSpy.withArgs("PagesRuntimeRendered").firstCall;
        assert.strictEqual(oCall.args[1], true, 1, "PagesRuntimeRendered Event was emitted");
        assert.strictEqual(this.oEventHubEmitSpy.withArgs("CloseFesrRecord").callCount, 0, "CloseFesrRecord Event was not emitted");
    });

    QUnit.test("Emits the PageRendered event", function (assert) {
        // Arrange
        const sCurrentTime = Date.now();
        sandbox.stub(Date, "now").returns(sCurrentTime);
        this.oController.sCurrentTargetPageId = "page1";
        this.oController.sCurrentTargetSpaceId = "space1";
        var oExpectedParams = {
            time: sCurrentTime,
            pageId: "page1",
            spaceId: "space1"
        };
        // Act
        this.oController._onAfterPageNavigated();

        // Assert
        let oCall = this.oEventHubEmitSpy.withArgs("PageRendered").firstCall;
        assert.deepEqual(oCall.args[1], oExpectedParams, 1, "PageRendered Event was emitted");
        oCall = this.oEventHubEmitSpy.withArgs("PagesRuntimeRendered").firstCall;
        assert.strictEqual(oCall.args[1], true, 1, "PagesRuntimeRendered Event was emitted");
        assert.strictEqual(this.oEventHubEmitSpy.withArgs("CloseFesrRecord").callCount, 0, "CloseFesrRecord Event was not emitted");
    });

    QUnit.test("Emits the CloseFesrRecord event when PageRuntimeRendered was emitted", function (assert) {
        // Arrange
        const sCurrentTime = Date.now();
        sandbox.stub(Date, "now").returns(sCurrentTime);
        EventHub.emit("PagesRuntimeRendered", true);
        this.oEventHubEmitSpy.resetHistory();
        // Act
        this.oController._onAfterPageNavigated();

        // Assert
        assert.strictEqual(this.oEventHubEmitSpy.withArgs("PageRendered").callCount, 0, "PageRendered Event was not emitted");
        assert.strictEqual(this.oEventHubEmitSpy.withArgs("PagesRuntimeRendered").callCount, 0, "PagesRuntimeRendered Event was not emitted");
        const oCall = this.oEventHubEmitSpy.withArgs("CloseFesrRecord").firstCall;
        assert.strictEqual(oCall.args[1], sCurrentTime, 1, "CloseFesrRecord Event was emitted");
    });

    QUnit.module("The function _navigate", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oFLPPageControl = {
                setTitle: sandbox.stub(),
                setShowTitle: sandbox.stub()
            };
            this.aPages = [
                {
                    data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE"),
                    getContent: sandbox.stub().returns([this.oFLPPageControl])
                },
                {
                    data: sandbox.stub().returns("/UI2/FLP_DEMO_PAGE_2")
                }
            ];
            this.oGetCurrentPageStub = sandbox.stub();
            this.oNavContainerToStub = sandbox.stub();
            this.oNavContainerGetPagesStub = function () {
                return this.aPages;
            }.bind(this);
            this.oController.oPagesNavContainer = {
                getCurrentPage: this.oGetCurrentPageStub,
                getPages: this.oNavContainerGetPagesStub,
                to: this.oNavContainerToStub
            };
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oNavContainerToStub
            };
            this.oSetPropertyStub = sandbox.stub();
            this.oGetPropertyStub = sandbox.stub();
            this.oController._oViewSettingsModel = new JSONModel();

            this.oHasMultiplePagesStub = sandbox.stub();
            this.oHasMultiplePagesStub.resolves(false);
            this.oIsPinnedStub = sandbox.stub();
            this.oIsPinnedStub.resolves(true);
            sandbox.stub(Container, "getServiceAsync").withArgs("Menu").resolves({
                hasMultiplePages: this.oHasMultiplePagesStub,
                isPinned: this.oIsPinnedStub,
                getSpaceAndPageTitles: sandbox.stub().resolves({ spaceTitle: "oSpace.title", pageTitle: "oPage.title" })
            });

            this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Navigates using the NavContainer to the specified page and hides the page title", function (assert) {
        // Arrange
        this.oHasMultiplePagesStub.resolves(false);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oFLPPageControl.setShowTitle.args[0][0], false, "The page property showTitle was set correctly.");
            assert.strictEqual(this.oNavContainerToStub.callCount, 2, "The 'to' function of the NavContainer was called twice.");
        }.bind(this));
    });

    QUnit.test("Navigates using the NavContainer to the specified page and shows the page title if the space has multiple pages", function (assert) {
        // Arrange
        this.oHasMultiplePagesStub.resolves(true);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oFLPPageControl.setTitle.args[0][0], "oPage.title", "The page property title was set correctly.");
            assert.strictEqual(this.oFLPPageControl.setShowTitle.args[0][0], true, "The page property showTitle was set correctly.");
            assert.strictEqual(this.oNavContainerToStub.callCount, 2, "The 'to' function of the NavContainer was called twice.");
        }.bind(this));
    });

    QUnit.test("Shows the space title if the space is not pinned", function (assert) {
        // Arrange
        this.oIsPinnedStub.withArgs("/UI2/FLP_DEMO_SPACE").resolves(false);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oFLPPageControl.setTitle.args[0][0], "oSpace.title", "The page property title was set correctly.");
            assert.strictEqual(this.oFLPPageControl.setShowTitle.args[0][0], true, "The page property showTitle was set correctly.");
        }.bind(this));
    });

    QUnit.test("Doesn't show the space title if the space is pinned", function (assert) {
        // Arrange
        this.oIsPinnedStub.resolves(false);
        this.oIsPinnedStub.withArgs("/UI2/FLP_DEMO_SPACE").resolves(true);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oFLPPageControl.setShowTitle.args[0][0], false, "The page property showTitle was set correctly.");
        }.bind(this));
    });

    QUnit.test("Shows the space and page title if the space is not pinned and has multiple pages", function (assert) {
        // Arrange
        this.oIsPinnedStub.withArgs("/UI2/FLP_DEMO_SPACE").resolves(false);
        this.oHasMultiplePagesStub.resolves(true);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oFLPPageControl.setTitle.args[0][0], "oSpace.title - oPage.title", "The page property title was set correctly.");
            assert.strictEqual(this.oFLPPageControl.setShowTitle.args[0][0], true, "The page property showTitle was set correctly.");
        }.bind(this));
    });

    QUnit.test("Waits for the nav container navigation to be triggered", function (assert) {
        // Arrange
        this.oHasMultiplePagesStub.returns(new Promise(function (resolve) {
            // make sure that the promise gets resolved late
            setTimeout(resolve, 0);
        }));

        //Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 2, "The 'to' function of the NavContainer was called twice.");
        }.bind(this));
    });

    QUnit.test("Doesn't navigate if the navigation container has no pages", function (assert) {
        // Arrange
        this.aPages = [];

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").catch(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 0, "The 'to' function of the NavContainer wasn't called.");
        }.bind(this));
    });

    QUnit.test("Doesn't navigate if no page contains the target page id", function (assert) {
        // Arrange

        // Act
        return this.oController._navigate("ZTEST", "ZSPACE").catch(function () {
            // Assert
            assert.strictEqual(this.oNavContainerToStub.callCount, 0, "The 'to' function of the NavContainer wasn't called.");
        }.bind(this));
    });

    QUnit.test("Cancels edit mode if controller navigates to a different page", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once");
        }.bind(this));
    });

    QUnit.test("Doesn't cancel edit mode if controller navigates to a different page", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);
        this.oGetCurrentPageStub.returns(this.aPages[0]);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(function () {
            // Assert
            assert.strictEqual(this.oCancelActionModeStub.callCount, 0, "_cancelActionMode was not called");
        }.bind(this));
    });

    QUnit.test("Doesn't cancel edit mode if controller navigates to the same page but keepActionMode is true", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);
        this.oGetCurrentPageStub.returns(this.aPages[0]);

        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE", true).then(function () {
            // Assert
            assert.strictEqual(this.oCancelActionModeStub.callCount, 0, "_cancelActionMode was not called");
        }.bind(this));
    });

    QUnit.test("Updates the currentSpaceAndPage config", async function (assert) {
        // Arrange
        sandbox.stub(hasher, "getHash").returns("Launchpad-openFLPPage?pageId=page1&spaceId=space1");
        const oExpectedConfig = {
            hash: "Launchpad-openFLPPage?pageId=page1&spaceId=space1",
            pageTitle: "oPage.title",
            spaceTitle: "oSpace.title"
        };
        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(() => {
            // Assert
            const oCurrentSpaceAndPage = Config.last("/core/spaces/currentSpaceAndPage");
            assert.deepEqual(oCurrentSpaceAndPage, oExpectedConfig, "The currentSpaceAndPage config was updated correctly.");
        });
    });

    QUnit.test("Updates the homeUri if homeNavigationTarget='origin_page'", async function (assert) {
        // Arrange
        Config.emit("/core/shellHeader/homeUri", "#Shell-home");
        Config.emit("/core/spaces/homeNavigationTarget", "origin_page");
        sandbox.stub(hasher, "getHash").returns("Launchpad-openFLPPage?pageId=page1&spaceId=space1");
        const sExpectedHomeUri = "#Launchpad-openFLPPage?pageId=page1&spaceId=space1";
        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(() => {
            // Assert
            const sHomeUri = Config.last("/core/shellHeader/homeUri");
            assert.deepEqual(sHomeUri, sExpectedHomeUri, "The homeUri was updated correctly.");
        });
    });

    QUnit.test("Does not update the homeUri if homeNavigationTarget!='origin_page'", async function (assert) {
        // Arrange
        Config.emit("/core/shellHeader/homeUri", "#Shell-home");
        Config.emit("/core/spaces/homeNavigationTarget", "not_origin_page");
        sandbox.stub(hasher, "getHash").returns("Launchpad-openFLPPage?pageId=page1&spaceId=space1");
        const sExpectedHomeUri = "#Shell-home";
        // Act
        return this.oController._navigate("/UI2/FLP_DEMO_PAGE", "/UI2/FLP_DEMO_SPACE").then(() => {
            // Assert
            const sHomeUri = Config.last("/core/shellHeader/homeUri");
            assert.deepEqual(sHomeUri, sExpectedHomeUri, "The homeUri was not updated.");
        });
    });

    QUnit.module("_visualizationFactory", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oGetPageVisibilityStub = sandbox.stub(StateManager, "getPageVisibility");

            this.oOnVisualizationPressStub = sandbox.stub(this.oController, "onVisualizationPress").returns({
                id: "visualizationPress"
            });
            this.oAddTileActionsStub = sandbox.stub(this.oController, "_addTileActions");
            this._createMoveTileActionButtonStub = sandbox.stub(this.oController, "_createMoveTileActionButton");

            sandbox.stub(resources.i18n, "getText").returnsArg(0);

            this.oGetPropertyStub = sandbox.stub().returns({
                sections: [1, 2]
            });

            this.oGivenVisualization = {
                attachPress: sandbox.stub(),
                bindEditable: sandbox.stub(),
                setActive: sandbox.stub(),
                attachBeforeActionSheetOpen: sandbox.stub(),
                attachEventOnce: sandbox.stub(),
                removeTileAction: sandbox.stub(),
                addTileAction: sandbox.stub()
            };
            this.oInstantiateVisualizationStub = sandbox.stub().returns(this.oGivenVisualization);
            this.oController._oVisualizationInstantiationService = {
                instantiateVisualization: this.oInstantiateVisualizationStub
            };

            this.oContextMock = {
                getObject: sandbox.stub().returns({
                    tileId: ""
                }),
                getPath: sandbox.stub().returns("/pages/0/sections/0/visualizations/0"),
                getModel: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            };

            this.oGetPageVisibilityStub.withArgs("/pages/0").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Instantiates a visualization without any tile actions in case the factory function was called by the default section", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/pages/0/sections/0").returns({
            default: true
        });
        var oExpectedVisualizationData = {
            tileId: ""
        };

        // Act
        var oControl = this.oController._visualizationFactory("someId", this.oContextMock);

        // Assert
        assert.deepEqual(this.oInstantiateVisualizationStub.firstCall.args[0],
            oExpectedVisualizationData,
            "The function instantiateVisualization of the VisualizationInstantiation service was called with the right visualization data.");
        assert.strictEqual(oControl, this.oGivenVisualization, "The function returns the control from the VisualizationInstantiation service.");
        assert.strictEqual(this.oGivenVisualization.bindEditable.callCount, 1, "'bindEditable' was called exactly once");
        assert.deepEqual(this.oGivenVisualization.bindEditable.getCall(0).args, ["viewSettings>/actionModeActive"], "'bindEditable' was called with the right arguments");
        assert.strictEqual(this.oGivenVisualization.attachPress.callCount, 1, "'attachPress' was called exactly once");
        assert.deepEqual(this.oGivenVisualization.attachPress.getCall(0).args, [this.oOnVisualizationPressStub, this.oController], "'attachPress' was called with the right arguments");

        assert.strictEqual(this.oGetPageVisibilityStub.callCount, 1, "getPageVisibility was called once");
        assert.deepEqual(this.oGivenVisualization.setActive.getCall(0).args, [true], "setActive was called with correct args");

        // Add to My Home action is always present
        assert.strictEqual(this.oAddTileActionsStub.callCount, 1, "The function adds one tile action to the visualization.");
    });

    QUnit.test("Adds tile actions if the instantiated visualization is not inside a default section", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/pages/0/sections/0").returns({
            default: false
        });
        this.oGetPropertyStub.withArgs("/pages/0").returns({
            id: "TEST_PAGE_ID"
        });

        // Act
        this.oController._visualizationFactory("someId", this.oContextMock);

        // Assert
        assert.strictEqual(this.oAddTileActionsStub.callCount, 1, "The function addTileAction was called once.");
        assert.deepEqual(this.oAddTileActionsStub.firstCall.args[0], this.oGivenVisualization, "The function _addTileActions was called with the right visualization");
    });

    QUnit.test("Check if attachBeforeActionSheetOpen is called", function (assert) {
        // Act
        this.oController._visualizationFactory("someId", this.oContextMock);

        // Assert
        assert.strictEqual(this.oGivenVisualization.attachBeforeActionSheetOpen.callCount, 1, "The method was called once");
    });

    QUnit.test("Check if _createMoveTileActionButton is called", function (assert) {
        // Act
        this.oController._visualizationFactory("someId", this.oContextMock);
        this.oGivenVisualization.attachBeforeActionSheetOpen.firstCall.args[0]();

        // Assert
        assert.strictEqual(this._createMoveTileActionButtonStub.callCount, 1, "The method was called once");
    });

    QUnit.test("Returns a GenericTile if the VisualizationInstantiation service is not resolved", function (assert) {
        // Arrange
        delete this.oController._oVisualizationInstantiationService;

        // Act
        var oControl = this.oController._visualizationFactory();

        // Assert
        assert.strictEqual(oControl.getMetadata().getName(), "sap.m.GenericTile", "The function returns a sap.m.GenericTile as a fallback if the VisualizationInstantiation service is not resolved.");
        assert.strictEqual(oControl.getState(), "Failed", "The returned GenericTile has a failed loading state.");
    });

    QUnit.module("_addTileActions", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetAvailableDisplayFormatsStub = sandbox.stub(VizInstance.prototype, "getAvailableDisplayFormats").returns(["compact", "flat"]);
            this.oVizInstance = new VizInstance();
            this.oGetParentStub = sandbox.stub(this.oVizInstance, "getParent").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: sandbox.stub()
                })
            });
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/spaces/myHome/userEnabled").returns(false);
            this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(false);
            this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Adds Tile actions for every available display format", function (assert) {
        // Act
        this.oController._addTileActions(this.oVizInstance);
        var aVizInstanceTileActions = this.oVizInstance.getTileActions();

        // Assert
        assert.strictEqual(aVizInstanceTileActions[0].getBindingPath("text"), "VisualizationInstance.ConvertToCompactAction",
            'The correct tile action "compact" was added');
        assert.strictEqual(aVizInstanceTileActions[1].getBindingPath("text"), "VisualizationInstance.ConvertToFlatAction",
            'The correct tile action "flat" was added');
        assert.strictEqual(aVizInstanceTileActions.length, 2, "The correct amount of Tile actions were added");
    });

    QUnit.test("Adds a Tile action for adding the visualization to MyHome if MyHome is enabled and not the active route", function (assert) {
        // Arrange
        var oVizInstance = new VizInstance({});
        this.oConfigLastStub.withArgs("/core/spaces/myHome/userEnabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oController._sMyHomePageId = "TEST_MYHOME_PAGE_ID";

        // Act
        this.oController._addTileActions(oVizInstance, "TEST_ANOTHER_PAGE_ID");
        var aVizInstanceTileActions = oVizInstance.getTileActions();

        // Assert
        assert.strictEqual(
            aVizInstanceTileActions[aVizInstanceTileActions.length - 1].getBindingPath("text"),
            "addToMyHome_action",
            'The correct Tile action "Add to My Home" was added'
        );

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("_createMoveTileActionButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oController._sMyHomePageId = "MyHomePageId ";
            this.oVizInstance = new VizInstance();
            this.oGetPropertyStub = sandbox.stub();
            this.oGetParentStub = sandbox.stub(this.oVizInstance, "getParent").returns({
                getBindingContext: sandbox.stub().returns({
                    getProperty: this.oGetPropertyStub
                })
            });
            this.oConfigLastStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Move button created: personalization is true, bIsMyHome is true, bTileIsInDefaultSection is true, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton.getText(), resources.i18n.getText("moveTile_action"), "The expected button was created");
    });

    QUnit.test("Move button created: personalization is true, bIsMyHome is true, bTileIsInDefaultSection is true, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton.getText(), resources.i18n.getText("moveTile_action"), "The expected button was created");
    });

    QUnit.test("Move button created: personalization is true, bIsMyHome is true, bTileIsInDefaultSection is false, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton.getText(), resources.i18n.getText("moveTile_action"), "The expected button was created");
    });

    QUnit.test("Move button NOT created: personalization is true, bIsMyHome is true, bTileIsInDefaultSection is false, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button created: personalization is true, bIsMyHome is false, bTileIsInDefaultSection is true, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton.getText(), resources.i18n.getText("moveTile_action"), "The expected button was created");
    });

    QUnit.test("Move button created: personalization is true, bIsMyHome is false, bTileIsInDefaultSection is true, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton.getText(), resources.i18n.getText("moveTile_action"), "The expected button was created");
    });

    QUnit.test("Move button created: personalization is true, bIsMyHome is false, bTileIsInDefaultSection is false, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton.getText(), resources.i18n.getText("moveTile_action"), "The expected button was created");
    });

    QUnit.test("Move button NOT created: personalization is true, bIsMyHome is false, bTileIsInDefaultSection is false, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is true, bTileIsInDefaultSection is true, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is true, bTileIsInDefaultSection is true, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is true, bTileIsInDefaultSection is false, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is true, bTileIsInDefaultSection is false, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is false, bTileIsInDefaultSection is true, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is false, bTileIsInDefaultSection is true, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(true); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is false, bTileIsInDefaultSection is false, and 2 personalizable Sections", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: false }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.test("Move button NOT created: personalization is false, bIsMyHome is false, bTileIsInDefaultSection is false, and 1 personalizable Section", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);
        this.oGetPropertyStub.returns(false); // bTileIsInDefaultSection
        var oPageData = {
            id: "NOT_MyHomePageId", // bIsMyHome
            sections: [{ default: true }, { default: false }]
        };

        // Act
        var oResultButton = this.oController._createMoveTileActionButton(this.oVizInstance, oPageData);

        // Assert
        assert.strictEqual(oResultButton, undefined, "The button was not created");
    });

    QUnit.module("onVisualizationPress", {
        beforeEach: function () {
            this.oEventGetParameterStub = sandbox.stub();
            this.oGetPathStub = sandbox.stub().returns("/pages/0/sections/1/visualizations/2");

            this.oVisualizationMock = {
                getBindingContext: sandbox.stub().returns({
                    getPath: this.oGetPathStub
                })
            };

            this.oSectionMock = {
                getItemPosition: sandbox.stub().withArgs(this.oVisualizationMock).returns(1),
                _focusItem: sandbox.stub()
            };

            this.oEvent = {
                getParameter: this.oEventGetParameterStub,
                getSource: sandbox.stub().returns(this.oVisualizationMock)
            };

            this.oAddVisualizationForRefreshStub = sandbox.stub(StateManager, "addVisualizationForRefresh");

            this.oController = new PagesRuntimeController();
            this.oDeleteVisualizationStub = sandbox.stub();


            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({ deleteVisualization: this.oDeleteVisualizationStub })
            });


            sandbox.stub(this.oController, "_getAncestorControl").withArgs(this.oVisualizationMock, "sap.ushell.ui.launchpad.Section").returns(this.oSectionMock);
        },

        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Does nothing if scope is not 'Actions'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("NotActions");
        this.oEventGetParameterStub.withArgs("action").returns("Remove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 0, "'deleteVisualization' was not called");
            assert.strictEqual(this.oAddVisualizationForRefreshStub.callCount, 0, "'StateManager.addVisualizationForRefresh' was not called");
        }.bind(this));
    });

    QUnit.test("Does nothing if action is not 'Remove'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Actions");
        this.oEventGetParameterStub.withArgs("action").returns("NotRemove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 0, "'deleteVisualization' was not called");
            assert.strictEqual(this.oAddVisualizationForRefreshStub.callCount, 0, "'StateManager.addVisualizationForRefresh' was not called");
        }.bind(this));
    });

    QUnit.test("Does call 'deleteVisualization' with the right parameters if scope is 'Actions' and action is 'Remove'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Actions");
        this.oEventGetParameterStub.withArgs("action").returns("Remove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 1, "'deleteVisualization' was called exactly once");
            assert.deepEqual(this.oDeleteVisualizationStub.firstCall.args, ["0", "1", "2"], "'deleteVisualization' was called with the right parameters");
            assert.strictEqual(this.oAddVisualizationForRefreshStub.callCount, 0, "'StateManager.addVisualizationForRefresh' was not called");
        }.bind(this));
    });

    QUnit.test("Calls _focusItem with the right args", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Actions");
        this.oEventGetParameterStub.withArgs("action").returns("Remove");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oSectionMock._focusItem.callCount, 1, "focusItem was called once");
            assert.strictEqual(this.oSectionMock._focusItem.getCall(0).args[0], 1, "focusItem was called with the right index");
            assert.strictEqual(this.oSectionMock._focusItem.getCall(0).args.length, 1, "focusItem was called with the right number of args");
            assert.strictEqual(this.oAddVisualizationForRefreshStub.callCount, 0, "'StateManager.addVisualizationForRefresh' was not called");
        }.bind(this));
    });

    QUnit.test("Saves the visualization to the StateManger when action is 'Press' and scope is 'Display'", function (assert) {
        // Arrange
        this.oEventGetParameterStub.withArgs("scope").returns("Display");
        this.oEventGetParameterStub.withArgs("action").returns("Press");

        // Act
        return this.oController.onVisualizationPress(this.oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oDeleteVisualizationStub.callCount, 0, "'deleteVisualization' was not called");
            assert.strictEqual(this.oAddVisualizationForRefreshStub.getCall(0).args[0], this.oVisualizationMock, "'StateManager.addVisualizationForRefresh' was called with correct args");
        }.bind(this));
    });

    QUnit.module("The function onExit", {
        beforeEach: function () {
            this.oStateManagerExitStub = sandbox.stub(StateManager, "exit");
            this.oController = new PagesRuntimeController();
            this.oHomeDetachedMatchedStub = sandbox.stub();
            this.oOpenFLPPageDetachedMatchedStub = sandbox.stub();
            this.oController.oContainerRouter = {
                getRoute: function () { }
            };
            this.oOffStub = sandbox.stub();
            this.oController._aConfigListeners = {
                off: this.oOffStub
            };
            this.oGetRouteStub = sandbox.stub(this.oController.oContainerRouter, "getRoute");
            this.oGetRouteStub.withArgs("home").returns({
                detachMatched: this.oHomeDetachedMatchedStub
            });
            this.oGetRouteStub.withArgs("openFLPPage").returns({
                detachMatched: this.oOpenFLPPageDetachedMatchedStub
            });
            this.oEventHubOffStub = sandbox.stub();
            this.oController.oEventHubListener = {
                off: this.oEventHubOffStub
            };
            this.oEventBusUnsubscribeStub = sandbox.stub();
            this.oController._oEventBus = {
                unsubscribe: this.oEventBusUnsubscribeStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Detaches matched event from home route", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oHomeDetachedMatchedStub.callCount, 1, "The function 'detachMatched' was called for route 'home'.");
    });

    QUnit.test("Detaches matched event from openFLPPage route", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oOpenFLPPageDetachedMatchedStub.callCount, 1, "The function 'detachMatched' was called for route 'openFLPPage'.");
    });

    QUnit.test("Detaches all config listeners", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oOffStub.callCount, 1, "The function 'off' was called.");
    });

    QUnit.test("Calls the exit of the state manager", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oStateManagerExitStub.callCount, 1, "The function 'exit' was called once.");
    });

    QUnit.test("Detaches all EventHub listeners", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oEventHubOffStub.callCount, 1, "The function 'off' was called.");
    });

    QUnit.test("Unsubscribes the events launchpad/shellFloatingContainerIsDocked and launchpad/shellFloatingContainerIsUnDocked", function (assert) {
        // Act
        this.oController.onExit();

        // Assert
        assert.strictEqual(this.oEventBusUnsubscribeStub.callCount, 2, "The function 'unsubscribe' was called twice.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[0], "launchpad", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(0).args[1], "shellFloatingContainerIsDocked", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[0], "launchpad", "The function 'unsubscribe' was called with correct parameters.");
        assert.strictEqual(this.oEventBusUnsubscribeStub.getCall(1).args[1], "shellFloatingContainerIsUnDocked", "The function 'unsubscribe' was called with correct parameters.");
    });

    QUnit.module("The Dialog if page not Exists: ", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oDialogOpenStub = sandbox.stub();
            this.oDialogAddDependentStub = sandbox.stub();
            this.oFragmentLoadStub = sandbox.stub(sap.ui.core.Fragment, "load").resolves({
                open: this.oDialogOpenStub
            });

            this.oController.getView = sandbox.stub().returns({
                addDependent: this.oDialogAddDependentStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Opens the dialog when _pressViewDetailsButton is called for the first time", function (assert) {
        // Arrange
        var done = assert.async();

        // Act
        this.oController._pressViewDetailsButton();

        // Assert
        setTimeout(function () {
            assert.strictEqual(this.oFragmentLoadStub.callCount, 1, "The method Fragment.load is called once.");
            assert.strictEqual(this.oDialogAddDependentStub.callCount, 1, "The method addDependent is called once on the view.");
            assert.strictEqual(this.oDialogOpenStub.callCount, 1, "The method open is called once on the dialog.");
            done();
        }.bind(this), 0);
    });

    QUnit.test("closes the Dialog if calling DialogClose", function (assert) {
        // Arrange
        var done = assert.async();
        this.oController._oDialog = {
            close: sandbox.stub()
        };

        // Act
        this.oController._onDialogClose();

        // Assert
        setTimeout(function () {
            assert.strictEqual(this.oController._oDialog.close.callCount, 1, "The method close is called once on the dialog.");
            done();
        }.bind(this), 0);
    });

    QUnit.test("Opens the dialog when _pressViewDetailsButton is called", function (assert) {
        // Arrange
        this.oController._oDialog = {
            open: this.oDialogOpenStub
        };

        // Act
        this.oController._pressViewDetailsButton();

        // Assert
        assert.strictEqual(this.oFragmentLoadStub.callCount, 0, "The method Fragment.load is not called.");
        assert.strictEqual(this.oDialogAddDependentStub.callCount, 0, "The method addDependent is not called on the view.");
        assert.strictEqual(this.oDialogOpenStub.callCount, 1, "The method open is called once on the dialog.");
    });


    QUnit.module("The function _copyToClipboard", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetPropertyStub = sandbox.stub().returns("This is some text");
            this.oController._oErrorPageModel = {
                getProperty: this.oGetPropertyStub
            };
            this.oTextArea = {
                select: sandbox.stub(),
                parentNode: {
                    removeChild: sandbox.stub()
                }
            };
            var oOriginalDocumentMethods = {
                createElement: document.createElement,
                appendChild: document.documentElement.appendChild,
                execCommand: document.execCommand
            };
            this.oCreateElementStub = sandbox.stub(document, "createElement").callsFake(function (type) {
                if (type === "textarea") {
                    return this.oTextArea;
                }
                return oOriginalDocumentMethods.createElement.apply(document, arguments);
            }.bind(this));
            this.oAppendChildStub = sandbox.stub(document.documentElement, "appendChild").callsFake(function (element) {
                if (!element === this.oTextArea) {
                    return oOriginalDocumentMethods.appendChild.apply(document, arguments);
                }
            }.bind(this));
            this.oExecStub = sandbox.stub(document, "execCommand").callsFake(function (command) {
                if (!command === "copy") {
                    return oOriginalDocumentMethods.execCommand.apply(document, arguments);
                }
            });
            this.oShowStub = sandbox.stub(MessageToast, "show");
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Properly copies the string provided to the clipboard", function (assert) {
        // Arrange
        var oExpectedTextArea = {
            contentEditable: true,
            readonly: false,
            textContent: "This is some text\nThis is some text"
        };

        this.oGetPropertyStub
            .withArgs("/pageAndSpaceId")
            .returns("This is some text")
            .withArgs("/technicalError")
            .returns("This is some text");

        this.oGetTextStub
            .withArgs("PageRuntime.CannotLoadPage.CopySuccess")
            .returns("Success")
            .withArgs("PageRuntime.CannotLoadPage.CopyFail")
            .returns("Fail");

        // Act
        this.oController._copyToClipboard();

        // Assert
        assert.strictEqual(this.oTextArea.contentEditable, oExpectedTextArea.contentEditable, "contentEditable property of the textArea has the expected value");
        assert.strictEqual(this.oTextArea.readonly, oExpectedTextArea.readonly, "readonly property of the textArea has the expected value");
        assert.strictEqual(this.oTextArea.textContent, oExpectedTextArea.textContent, "textContent property of the textArea has the expected value");
        assert.deepEqual(this.oShowStub.firstCall.args, ["Success", { closeOnBrowserNavigation: false }], "MessageToast was displayed as expected");
        assert.deepEqual(this.oTextArea.parentNode.removeChild.firstCall.args[0], this.oTextArea, "TextArea was removed at the end");
    });

    QUnit.test("Shows a MessageToast containing an error when the content could not be copied to the clipboard", function (assert) {
        // Arrange
        this.oAppendChildStub.throws(new Error());
        this.oGetTextStub
            .withArgs("PageRuntime.CannotLoadPage.CopySuccess")
            .returns("Success")
            .withArgs("PageRuntime.CannotLoadPage.CopyFail")
            .returns("Fail");

        // Act
        this.oController._copyToClipboard();

        // Assert
        assert.strictEqual(this.oShowStub.firstCall.args[0], "Fail", "MessageToast was displayed as expected");
    });

    QUnit.module("The _createActionModeButton function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oController.bIsHomeIntentRootIntent = true;

            this.sActionButtonId = "ActionModeBtn";
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText");
            this.oGetTextStub.withArgs("PageRuntime.EditMode.Activate").returns("PageRuntime.EditMode.Activate");
            this.oExpectedUserActionButtonParameters = {
                controlType: "sap.ushell.ui.launchpad.ActionItem",
                oControlProperties: {
                    id: this.sActionButtonId,
                    text: "PageRuntime.EditMode.Activate",
                    icon: "sap-icon://edit"
                },
                bIsVisible: true
            };

            sandbox.spy(this.oController, "_getStateInfoActionModeButton");

            this.oDoneStub = sandbox.stub();
            this.oAddUserActionStub = sandbox.stub();
            this.oAddUserActionStub.returns({
                done: this.oDoneStub
            });
            this.oShowHeaderEndItemStub = sandbox.stub();
            this.oGetShellConfigStub = sandbox.stub().returns({
                moveEditHomePageActionToShellHeader: false
            });
            this.oGetRendererStub = sandbox.stub(Container, "getRendererInternal");
            this.oGetRendererStub.withArgs("fiori2").returns({
                addUserAction: this.oAddUserActionStub,
                showHeaderEndItem: this.oShowHeaderEndItemStub,
                getShellConfig: this.oGetShellConfigStub
            });

            this.oAddStyleClassStub = sandbox.stub();
            this.oActionButtonMock = {
                addStyleClass: this.oAddStyleClassStub
            };

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/extension/enableHelp").returns(true);
            this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/ui/shell/ShellHeadItem"], sinon.match.any).callsArgWith(1, ShellHeadItem);
            this.oRequireStub.callThrough();
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            if (Element.getElementById(this.sActionButtonId)) {
                Element.getElementById(this.sActionButtonId).destroy();
            }
        }
    });

    QUnit.test("Add button to the header to the home state when the home page is root intent", function (assert) {
        // Arrange
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });

        // Act
        this.oController._createActionModeButton();

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "A text was required");
        assert.strictEqual(this.oGetTextStub.getCall(0).args[0], "PageRuntime.EditMode.Activate", "getText was called with correct id");
        assert.strictEqual(this.oController._getStateInfoActionModeButton.callCount, 1, "_getStateInfoActionModeButton was called");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called once");
        assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args, [this.sActionButtonId, false, ["home"]], "showHeaderEndItem called with correct arguments");
        var oHeadControl = Element.getElementById(this.sActionButtonId);
        assert.ok(oHeadControl.hasStyleClass("help-id-ActionModeBtn"), "xRay style class was added");
    });

    QUnit.test("Add button to the header to the current state when the home page is not root intent", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false;
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });

        // Act
        this.oController._createActionModeButton();

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "A text was required");
        assert.strictEqual(this.oGetTextStub.getCall(0).args[0], "PageRuntime.EditMode.Activate", "getText was called with correct id");
        assert.strictEqual(this.oController._getStateInfoActionModeButton.callCount, 1, "_getStateInfoActionModeButton was called");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called once");
        assert.deepEqual(this.oShowHeaderEndItemStub.getCall(0).args, [this.sActionButtonId, true, null], "showHeaderEndItem called with correct arguments");
        var oHeadControl = Element.getElementById(this.sActionButtonId);
        assert.ok(oHeadControl.hasStyleClass("help-id-ActionModeBtn"), "xRay style class was added");
    });

    QUnit.test("Do not add the Edit button to the header when personalization is disabled", function (assert) {
        // Arrange
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });
        this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(false);

        // Act
        this.oController._createActionModeButton();

        // Assert
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called");
    });

    QUnit.test("Add button to the user menu to the home state when the home page is root intent", function (assert) {
        // Arrange
        this.oExpectedUserActionButtonParameters.bCurrentState = false;
        this.oExpectedUserActionButtonParameters.aStates = ["home"];

        // Act
        this.oController._createActionModeButton();
        this.oDoneStub.getCall(0).args[0](this.oActionButtonMock);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "Correct text was required");
        assert.strictEqual(this.oGetTextStub.getCall(0).args[0], "PageRuntime.EditMode.Activate", "getText was called with correct id");
        assert.strictEqual(this.oController._getStateInfoActionModeButton.callCount, 1, "_getStateInfoActionModeButton was called");
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "User action menu entry was added");
        assert.strictEqual(typeof this.oAddUserActionStub.getCall(0).args[0].oControlProperties.press[0], "function", "A handler was attached");
        var oAddUserActionsParameters = this.oAddUserActionStub.getCall(0).args[0];
        delete oAddUserActionsParameters.oControlProperties.press;
        assert.deepEqual(oAddUserActionsParameters, this.oExpectedUserActionButtonParameters, "Correct parameters were applied");
        assert.strictEqual(this.oAddStyleClassStub.getCall(0).args[0], "help-id-ActionModeBtn", "xRay style class was added");
        const oUserAction = Element.getElementById(this.sActionButtonId);
        assert.ok(oUserAction, "button was created");
    });

    QUnit.test("Add button to the user menu to the current state when the home page is not root intent", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false;
        this.oExpectedUserActionButtonParameters.aStates = null;
        this.oExpectedUserActionButtonParameters.bCurrentState = true;

        // Act
        this.oController._createActionModeButton();
        this.oDoneStub.getCall(0).args[0](this.oActionButtonMock);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "Correct text was required");
        assert.strictEqual(this.oAddUserActionStub.callCount, 1, "User action menu entry was added");
        assert.strictEqual(this.oController._getStateInfoActionModeButton.callCount, 1, "_getStateInfoActionModeButton was called");
        assert.strictEqual(typeof this.oAddUserActionStub.getCall(0).args[0].oControlProperties.press[0], "function", "A handler was attached");
        var oAddUserActionsParameters = this.oAddUserActionStub.getCall(0).args[0];
        delete oAddUserActionsParameters.oControlProperties.press;
        assert.deepEqual(oAddUserActionsParameters, this.oExpectedUserActionButtonParameters, "Correct parameters were applied");
        assert.strictEqual(this.oAddStyleClassStub.getCall(0).args[0], "help-id-ActionModeBtn", "xRay style class was added");
        const oUserAction = Element.getElementById(this.sActionButtonId);
        assert.ok(oUserAction, "button was created");
    });

    QUnit.test("Button should has the correct text if page title is defined", function (assert) {
        // Arrange
        var sPageTitle = "Some Title";
        // Act
        this.oController._createActionModeButton(sPageTitle);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "A text was required");
        assert.strictEqual(this.oGetTextStub.getCall(0).args[0], "PageRuntime.EditModeForPage.Activate", "getText was called with correct id");
        assert.deepEqual(this.oGetTextStub.getCall(0).args[1], [sPageTitle], "getText was called with correct page title");
        const oUserAction = Element.getElementById(this.sActionButtonId);
        assert.ok(oUserAction, "button was created");
    });

    QUnit.module("The pressActionModeButton function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).returns();
            this.oRequireStub.callThrough();

            this.oGetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            this.oGetModelStub.withArgs("viewSettings").returns({
                getProperty: this.oGetPropertyStub
            });
            this.oGetViewStub = sandbox.stub();
            this.oGetViewStub.returns({
                getModel: this.oGetModelStub
            });
            this.oController.getView = this.oGetViewStub;
            this.oCancelStub = sandbox.stub(ActionMode, "cancel");
            this.oStartStub = sandbox.stub(ActionMode, "start");

            this.oIsMyHomeRouteActiveStub = sandbox.stub(this.oController, "_isMyHomeRouteActive");

            this.oContainerRouter = {
                navTo: sandbox.stub()
            };
            this.oController.oContainerRouter = this.oContainerRouter;
            this.oPagesNavContainer = {
                attachEventOnce: sandbox.stub()
            };
            this.oController.oPagesNavContainer = this.oPagesNavContainer;
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Action mode is active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);

        // Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.strictEqual(this.oCancelStub.callCount, 1, "cancel was called exactly once");
    });

    QUnit.test("Action mode is not active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);
        this.oGetPropertyStub.withArgs("/personalizationEnabled").returns(true);

        // Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.strictEqual(this.oStartStub.callCount, 1, "start was called exactly once");
        assert.strictEqual(this.oStartStub.getCall(0).args[0], this.oController, "start was called with the right controller");
    });

    QUnit.test("Action mode when personalization is disabled and myHome page is shown", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);
        this.oGetPropertyStub.withArgs("/personalizationEnabled").returns(false);
        this.oIsMyHomeRouteActiveStub.returns(true);

        // Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.strictEqual(this.oStartStub.callCount, 1, "start was called exactly once");
        assert.strictEqual(this.oStartStub.getCall(0).args[0], this.oController, "start was called with the right controller");
    });

    QUnit.test("Action mode when personalization is disabled and myHome page is not shown", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);
        this.oGetPropertyStub.withArgs("/personalizationEnabled").returns(false);
        this.oIsMyHomeRouteActiveStub.returns(false);

        // Act
        this.oController.pressActionModeButton();
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.strictEqual(this.oStartStub.callCount, 0, "start was not called");
    });

    QUnit.module("The handleEditModeAction function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).returns();
            this.oRequireStub.callThrough();

            this.sMockHandler = "sMockHandler";
            this.oMockSource = { id: "oMockSource" };
            this.oMockParameters = { id: "oMockParameters" };
            this.oMockEvent = {
                id: "oMockEvent",
                getSource: sandbox.stub().returns(this.oMockSource),
                getParameters: sandbox.stub().returns(this.oMockParameters)
            };

            this.oMockHandler = sandbox.stub();
            ActionMode[this.sMockHandler] = this.oMockHandler;
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        // Act
        this.oController.handleEditModeAction(this.sMockHandler, this.oMockEvent);
        this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).getCall(0).args[1](ActionMode);

        // Assert
        assert.deepEqual(this.oMockHandler.getCall(0).args[0], this.oMockEvent, "the event object was passed");
        assert.deepEqual(this.oMockHandler.getCall(0).args[1], this.oMockSource, "the source object was passed");
        assert.deepEqual(this.oMockHandler.getCall(0).args[2], this.oMockParameters, "the parameters object was passed");
    });

    QUnit.module("The moveVisualization function", {
        beforeEach: async function () {
            this.oController = new PagesRuntimeController();
            this.oVBox = new VBox({
                items: {
                    path: "/pages",
                    factory: function (sPageId) {
                        return new Page({
                            id: sPageId,
                            sections: {
                                path: "sections",
                                factory: function (sSectionId) {
                                    return new Section({
                                        id: sSectionId,
                                        default: "{default}",
                                        visualizations: {
                                            path: "visualizations",
                                            factory: function (sTileId) {
                                                return new GenericTile({
                                                    id: sTileId
                                                });
                                            }
                                        },
                                        compactItems: {
                                            path: "compactItems",
                                            factory: function (sTileId) {
                                                return new GenericTile({
                                                    id: sTileId
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
            this.oVBox.setModel(new JSONModel({
                pages: [{
                    id: "page0",
                    sections: [{
                        id: "section0",
                        default: true,
                        visualizations: [
                            { id: "tile0" },
                            { id: "tile3" }
                        ],
                        compactItems: [
                            { id: "tile4" }
                        ]
                    }, {
                        id: "section1",
                        default: false,
                        visualizations: [
                            { id: "tile1" },
                            { id: "tile2" }
                        ],
                        compactItems: []
                    }, {
                        id: "section2",
                        default: false,
                        visualizations: [
                            { id: "tile5" },
                            { id: "tile6" }
                        ],
                        compactItems: [
                            { id: "tile7" }
                        ]
                    }]
                }]
            }));
            this.oVBox.placeAt("qunit-fixture");
            await nextUIUpdate();

            var oPage = this.oVBox.getItems()[0];
            this.oTile0 = oPage.getSections()[0].getDefaultItems()[0];
            this.oTile3 = oPage.getSections()[0].getDefaultItems()[1];
            this.oTile4 = oPage.getSections()[0].getCompactItems()[0];

            this.oSection1 = oPage.getSections()[1];
            this.oTile1 = this.oSection1.getDefaultItems()[0];
            this.oTile2 = this.oSection1.getDefaultItems()[1];

            this.oSection2 = oPage.getSections()[2];
            this.oTile5 = this.oSection2.getDefaultItems()[0];
            this.oTile6 = this.oSection2.getDefaultItems()[1];
            this.oTile7 = this.oSection2.getCompactItems()[0];

            this.oMoveVisualizationStub = sandbox.stub().resolves({});
            this.oUpdateVisualizationStub = sandbox.stub().resolves();
            this.oEnableImplicitSaveStub = sandbox.stub();
            this.oSavePersonalizationStub = sandbox.stub().resolves();
            this.oMessageToastShowStub = sandbox.stub(MessageToast, "show");

            this.oController.getOwnerComponent = sandbox.stub().returns({
                getPagesService: sandbox.stub().resolves({
                    moveVisualization: this.oMoveVisualizationStub,
                    updateVisualization: this.oUpdateVisualizationStub,
                    enableImplicitSave: this.oEnableImplicitSaveStub,
                    savePersonalization: this.oSavePersonalizationStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVBox.destroy();
            this.oController.destroy();
        }
    });

    QUnit.test("dropping a visualization before the next visualization doesn't call moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile2,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 0, "MessageToast.show() was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization after the visualization before doesn't call moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 0, "MessageToast.show() was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization in the CompactArea acts like dropping after last and calls moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile4,
            droppedControl: this.oSection2.getAggregation("_compactArea"),
            dropPosition: "On",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast.show() was called");
            assert.strictEqual(this.oMoveVisualizationStub.args[0][2], 1, "moveVisualization was called with expected iCurrentVizIndex");
            assert.strictEqual(this.oMoveVisualizationStub.args[0][4], 2, "moveVisualization was called with expected iTargetVizIndex");
        }.bind(this));
    });

    QUnit.test("dropping a visualization on itself doesn't call moveVisualization", function (assert) {
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile1,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 0, "MessageToast.show() was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization from a non-default section on the default section doesn't call moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile0,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 0, "moveVisualization was not called");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 0, "MessageToast.show() was not called");
        }.bind(this));
    });

    QUnit.test("dropping a visualization from the default section on the default section calls moveVisualization", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile3,
            droppedControl: this.oTile0,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast.show() was called once");
        }.bind(this));
    });

    QUnit.test("dropping a visualization after another visualization calls moveVisualization correctly", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile1,
            droppedControl: this.oTile2,
            dropPosition: "After",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var aExpectedArguments = [
            0, // Page index
            1, // Source Section index
            0, // Source Viz index
            1, // Target Section index
            1 // Target Viz index
        ];

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            var sExpectedAnnounceMessage = resources.i18n.getText("PageRuntime.Message.VisualizationMoved");

            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.deepEqual(this.oMoveVisualizationStub.getCall(0).args, aExpectedArguments, "moveVisualization was called correctly");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.oMessageToastShowStub.args[0][0], sExpectedAnnounceMessage,
                "MessageToast.show() was called with the correct message");
        }.bind(this));
    });

    QUnit.test("dropping a visualization before another visualization calls moveVisualization correctly", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var aExpectedArguments = [
            0, // Page index
            1, // Source Section index
            1, // Source Viz index
            1, // Target Section index
            0 // Target Viz index
        ];

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            var sExpectedAnnounceMessage = resources.i18n.getText("PageRuntime.Message.VisualizationMoved");

            // Assert
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.deepEqual(this.oMoveVisualizationStub.getCall(0).args, aExpectedArguments, "moveVisualization was called correctly");
            assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast.show() was called once");
            assert.strictEqual(this.oMessageToastShowStub.args[0][0], sExpectedAnnounceMessage,
                "MessageToast.show() was called with the correct message");
        }.bind(this));
    });

    QUnit.test("Calls _focusItem on the target section", function (assert) {
        // Arrange
        sandbox.stub(this.oSection1, "_focusItem");

        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var oExpectedPosition = {
            area: "standard",
            index: 0
        };

        this.oMoveVisualizationStub.resolves({
            visualizationIndex: 0
        });

        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.strictEqual(this.oSection1._focusItem.callCount, 1, "_focusItem was called once");
            assert.deepEqual(this.oSection1._focusItem.getCall(0).args, [oExpectedPosition],
                "_focusItem was called with the right position");
        }.bind(this));
    });

    QUnit.test("Updates the visualization with the correct displayFormatHint based on the area", function (assert) {
        // Arrange
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        var oGetItemPositionStub = sandbox.stub(this.oSection1, "getItemPosition");
        oGetItemPositionStub.withArgs(this.oTile1).returns({
            index: 0,
            area: DisplayFormat.Compact
        });
        oGetItemPositionStub.callThrough();

        var aExpectedArguments = [
            0,
            1,
            0,
            { displayFormatHint: DisplayFormat.Compact }
        ];
        this.oMoveVisualizationStub.resolves({
            visualizationIndex: 0
        });

        sandbox.stub(this.oSection1, "focusVisualization"); // needed because section internals get corrupted due to the stubs
        // Act
        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.deepEqual(this.oUpdateVisualizationStub.getCall(0).args, aExpectedArguments, "updateVisualization was called with correct args");
        }.bind(this));
    });

    QUnit.test("Does the save calls correctly", function (assert) {
        var oParameters = {
            draggedControl: this.oTile2,
            droppedControl: this.oTile1,
            dropPosition: "Before",
            browserEvent: {}
        };

        var oEvent = {
            getParameter: function (sProperty) {
                return oParameters[sProperty];
            }
        };

        return this.oController.moveVisualization(oEvent).then(function () {
            // Assert
            assert.deepEqual(this.oEnableImplicitSaveStub.getCall(0).args, [false], "enableImplicitSave was called correctly the first time");
            assert.deepEqual(this.oEnableImplicitSaveStub.getCall(1).args, [true], "enableImplicitSave was called correctly the second time");
            assert.deepEqual(this.oSavePersonalizationStub.getCall(0).args, [], "savePersonalization was called correctly");
        }.bind(this));
    });

    QUnit.module("_getVizMoveMessage", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetTextStub = sandbox.stub(resources.i18n, "getText").callsFake(function (sKey) {
                return sKey;
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns correct announcement for Tile move", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Standard;
        var sTo = DisplayFormat.Standard;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 1;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationMoved", "returned the correct i18n key");
    });

    QUnit.test("Returns correct message for Tile move to a different Section", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Standard;
        var sTo = DisplayFormat.Standard;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 2;

        // Act
        // Instead of the translated announcement the i18n key gets returned
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationMoved", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Link move", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Compact;
        var sTo = DisplayFormat.Compact;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 1;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationMoved", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Link move to a different Section", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Compact;
        var sTo = DisplayFormat.Compact;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 2;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationMoved", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Link to Tile conversion", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Compact;
        var sTo = DisplayFormat.Standard;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 1;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationConverted", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Link to Tile conversion in different Sections", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Compact;
        var sTo = DisplayFormat.Standard;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 2;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationMovedAndConverted", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Tile to Link conversion", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Standard;
        var sTo = DisplayFormat.Compact;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 1;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationConverted", "returned the correct i18n key");
    });

    QUnit.test("Returns correct text for Tile to Link conversion in different Sections", function (assert) {
        // Arrange
        var sFrom = DisplayFormat.Standard;
        var sTo = DisplayFormat.Compact;
        var iCurrentSectionIndex = 1;
        var iTargetSectionIndex = 2;

        // Act
        var sText = this.oController._getVizMoveMessage(iCurrentSectionIndex, iTargetSectionIndex, sFrom, sTo);

        // Assert
        assert.strictEqual(this.oGetTextStub.callCount, 1, "getText was called once");
        assert.strictEqual(sText, "PageRuntime.Message.VisualizationMovedAndConverted", "returned the correct i18n key");
    });

    QUnit.module("The onDragEnter function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oGetDefaultStub = sandbox.stub();
            this.oGetDefaultStub.returns(false);
            this.oGetShowSectionStub = sandbox.stub();
            this.oGetShowSectionStub.returns(true);
            this.oGetDropControlStub = sandbox.stub();
            this.oGetDropControlStub.returns({
                getDefault: this.oGetDefaultStub,
                getShowSection: this.oGetShowSectionStub
            });
            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("dragSession").returns({
                getDropControl: this.oGetDropControlStub
            });
            this.oPreventDefaultStub = sandbox.stub();
            this.oEventMock = {
                getParameter: this.oGetParameterStub,
                preventDefault: this.oPreventDefaultStub
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("drag enter on visible non default section", function (assert) {
        // Act
        this.oController.onDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("drag enter on default section", function (assert) {
        // Arrange
        this.oGetDefaultStub.returns(true);

        // Act
        this.oController.onDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
    });

    QUnit.module("The onAreaDragEnter function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oGetParameterStub = sandbox.stub();
            this.oEventMock = {
                getParameter: this.oGetParameterStub
            };

            this.aAvailableDisplayFormats = [];
            this.oVizInstanceStub = {
                getAvailableDisplayFormats: sandbox.stub().returns(this.aAvailableDisplayFormats)
            };
            this.oGetParameterStub.withArgs("dragControl").returns(this.oVizInstanceStub);

            this.oOriginalEventMock = {
                preventDefault: sandbox.stub()
            };
            this.oGetParameterStub.withArgs("originalEvent").returns(this.oOriginalEventMock);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Prevents the drop if the target area display format is not supported", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Flat);
        this.aAvailableDisplayFormats.push(DisplayFormat.Compact);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 1, "preventDefault was called");
    });

    QUnit.test("Allows the drop if the target area display format is supported", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Flat);
        this.aAvailableDisplayFormats.push(DisplayFormat.Flat);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("Allows the drop if source and target area display format are the same", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Standard);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("Allows the drop to standard area if the target supports only standardWide", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Flat);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Standard);
        this.aAvailableDisplayFormats.push(DisplayFormat.StandardWide);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.test("Allows the drop to flat area if the target supports only flatWide", function (assert) {
        // Arrange
        this.oGetParameterStub.withArgs("sourceArea").returns(DisplayFormat.Standard);
        this.oGetParameterStub.withArgs("targetArea").returns(DisplayFormat.Flat);
        this.aAvailableDisplayFormats.push(DisplayFormat.FlatWide);

        // Act
        this.oController.onAreaDragEnter(this.oEventMock);

        // Assert
        assert.strictEqual(this.oOriginalEventMock.preventDefault.callCount, 0, "preventDefault was not called");
    });

    QUnit.module("_handleUshellContainerDocked", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oSetPropertyStub = sandbox.stub();
            this.oController._oViewSettingsModel = {
                setProperty: this.oSetPropertyStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets ushellContainerDocked=true when sap ushell container is docked'", function (assert) {
        // Act
        this.oController._handleUshellContainerDocked("launchpad", "shellFloatingContainerIsDocked");

        // Assert
        assert.ok(this.oSetPropertyStub.calledOnce, " The function 'setProperty' is called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/ushellContainerDocked", true], " The function 'setProperty' is called with correct parameters");
    });

    QUnit.test("Sets ushellContainerDocked=false when sap ushell container is not docked'", function (assert) {
        // Act
        this.oController._handleUshellContainerDocked("launchpad", "shellFloatingContainerIsUnDocked");

        // Assert
        assert.ok(this.oSetPropertyStub.calledOnce, " The function 'setProperty' is called once");
        assert.deepEqual(this.oSetPropertyStub.getCall(0).args, ["/ushellContainerDocked", false], " The function 'setProperty' is called with correct parameters");
    });

    QUnit.module("_hideActionModeButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oSetVisibleStub = sandbox.stub();
            this.oByIdStub = sandbox.stub(Element, "getElementById");
            this.oByIdStub.withArgs("ActionModeBtn").returns({
                setVisible: this.oSetVisibleStub
            });

        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Hides the button if available", function (assert) {
        // Act
        this.oController._hideActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "setVisible was called once");
        assert.deepEqual(this.oSetVisibleStub.getCall(0).args, [false], "setVisible was called with correct args");
    });

    QUnit.test("Does not hide the button if it is not available", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("ActionModeBtn").returns();

        // Act
        this.oController._hideActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 0, "setVisible was not called");
    });

    QUnit.module("_showActionModeButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oSetVisibleStub = sandbox.stub();
            this.oByIdStub = sandbox.stub(Element, "getElementById");
            this.oByIdStub.withArgs("ActionModeBtn").returns({
                setVisible: this.oSetVisibleStub
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Shows the button if available", function (assert) {
        // Act
        this.oController._showActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 1, "setVisible was called once");
        assert.deepEqual(this.oSetVisibleStub.getCall(0).args, [true], "setVisible was called with correct args");
    });

    QUnit.test("Does not show the button if it is not available", function (assert) {
        // Arrange
        this.oByIdStub.withArgs("ActionModeBtn").returns();

        // Act
        this.oController._showActionModeButton();

        // Assert
        assert.strictEqual(this.oSetVisibleStub.callCount, 0, "setVisible was not called");
    });

    QUnit.module("_cancelActionMode", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ushell/components/pages/ActionMode"], sinon.match.any).callsArgWith(1, ActionMode);
            this.oRequireStub.callThrough();

            this.oGetPropertyStub = sandbox.stub();
            this.oController.getView = sandbox.stub().returns({
                getModel: sandbox.stub().withArgs("viewSettings").returns({
                    getProperty: this.oGetPropertyStub
                })
            });
            this.oCancelStub = sandbox.stub(ActionMode, "cancel");
            this.oStartStub = sandbox.stub(ActionMode, "start");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Cancels action mode if its is active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(true);

        // Act
        this.oController._cancelActionMode();

        // Assert
        assert.strictEqual(this.oCancelStub.callCount, 1, "cancel was called once");
    });

    QUnit.test("Does not cancel edit mode if is not active", function (assert) {
        // Arrange
        this.oGetPropertyStub.withArgs("/actionModeActive").returns(false);

        // Act
        this.oController._cancelActionMode();

        // Assert
        assert.strictEqual(this.oRequireStub.callCount, 0, "require was not called");
        assert.strictEqual(this.oCancelStub.callCount, 0, "cancel was not called");
    });

    QUnit.module("The function _updateVisualizationDisplayFormat", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oMockEvent = {
                getSource: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/pages/2/sections/1/visualizations/0")
                    })
                })
            };

            var oModel = new JSONModel({
                pages: [
                    {
                        id: "page0",
                        sections: []
                    },
                    {
                        id: "page1",
                        sections: []
                    },
                    {
                        id: "page2",
                        sections: [
                            {
                                id: "section0",
                                visualizations: [
                                    { id: "tile00" },
                                    { id: "tile01" }
                                ],
                                compactItems: [
                                    { id: "tile02" }
                                ]
                            }, {
                                id: "section1",
                                visualizations: [
                                    { id: "tile11" },
                                    { id: "tile12" }
                                ],
                                compactItems: []
                            }
                        ]
                    }
                ]
            });

            this.oMessageToastShowStub = sandbox.stub(MessageToast, "show");

            this.oUpdateVisualizationStub = sandbox.stub().resolves({
                pageId: "page2",
                sectionId: "section1",
                vizRefId: "tile11"
            });

            sandbox.stub(this.oController, "getOwnerComponent").returns({
                getPagesService: sandbox.stub().resolves({
                    updateVisualization: this.oUpdateVisualizationStub,
                    getModel: sandbox.stub().returns(oModel)
                })
            });

            sandbox.stub(resources.i18n, "getText").returnsArg(0);

            sandbox.stub(this.oController, "onInit");
            sandbox.stub(StateManager, "getPageVisibility");
            this.oController._oVisualizationInstantiationService = {
                instantiateVisualization: sandbox.stub().callsFake(function () {
                    return new VizInstance();
                })
            };
            sandbox.stub(this.oController, "onExit");

            return XMLView.create({
                viewName: "sap.ushell.components.pages.view.PageRuntime",
                controller: this.oController
            }).then(function (oView) {
                this.oView = oView;
                this.oView.setModel(oModel);
                this.oSection = this.oView.byId("pagesNavContainer").getPages()[2].getContent()[0].getSections()[1];

                sandbox.stub(this.oController, "_getVizInstanceById").returns(this.oSection.getVisualizations()[0]);
                sandbox.stub(this.oSection, "focusVisualization");
            }.bind(this));
        },
        afterEach: function () {
            this.oView.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Updates the displayFormatHint property using the 'updateVisualization' function of the Pages service", function (assert) {
        // Arrange
        var oExpectedMessageToastShowMessage = "PageRuntime.Message.VisualizationConverted";

        // Act
        return this.oController._updateVisualizationDisplayFormat(this.oMockEvent, DisplayFormat.Compact).then(function () {
            // Assert
            assert.deepEqual(this.oUpdateVisualizationStub.callCount, 1, "The function 'updateVisualization' was called once.");
            assert.deepEqual(this.oUpdateVisualizationStub.firstCall.args,
                ["2", "1", "0", { displayFormatHint: "compact" }],
                "The function called 'updateVisualization' with the correct page index, section index, visualization index and the correct displayFormat.");
            assert.deepEqual(this.oMessageToastShowStub.args[0][0], oExpectedMessageToastShowMessage, "MessageToast.show() was called with the expected arguments.");
        }.bind(this));
    });

    QUnit.test("Places the focus on the newly created visualization using the Section API", function (assert) {
        // Act
        return this.oController._updateVisualizationDisplayFormat(this.oMockEvent, DisplayFormat.Compact).then(function () {
            // After the update the old Visualization gets destroyed and replaced.
            var oNewVizInstance = this.oSection.getVisualizations()[0];

            // Assert
            assert.deepEqual(this.oSection.focusVisualization.args, [[oNewVizInstance]], "FocusVisualization was called with the correct arguments.");
        }.bind(this));
    });

    QUnit.module("The function _confirmSelect", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oVizInstanceToBeMovedContextPath = "/pages/0/sections/1/visualizations/2";

            this.oVizInstance = {
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns(this.oVizInstanceToBeMovedContextPath)
                })
            };

            this.oController._oVizInstanceToBeMoved = this.oVizInstance;

            this.oDialogItemsBinding = { filter: sandbox.stub() };
            this.oEventStub = {
                getSource: sandbox.stub().returns({
                    getBinding: sandbox.stub().withArgs("items").returns(this.oDialogItemsBinding)
                }),
                getParameter: sandbox.stub().withArgs("selectedItem").returns({
                    getBindingContext: sandbox.stub().returns({
                        getPath: sandbox.stub().returns("/pages/3/sections/4")
                    })
                })
            };

            this.oSourceSection = {
                getItemPosition: sandbox.stub().withArgs(this.oVizInstance).returns({
                    area: "myArea"
                })
            };

            this.oVisualizations = [this.oVizInstance];

            this.oSection = {
                getVisualizations: sandbox.stub().returns(this.oVisualizations),
                focusVisualization: sandbox.stub()
            };

            this.aSections = [
                { id: "myFirstUnusedSection" },
                { id: "mySecondUnusedSection" },
                { id: "myThirdUnusedSection" },
                { id: "myFourthUnusedSection" },
                this.oSection
            ];

            this.oPage = {
                getSections: sandbox.stub().returns(this.aSections)
            };

            this.oGetAncestorControlStub = sandbox.stub(this.oController, "_getAncestorControl");
            this.oGetAncestorControlStub.withArgs(this.oVizInstance, "sap.ushell.ui.launchpad.Section").returns(this.oSourceSection);
            this.oGetAncestorControlStub.withArgs(this.oVizInstance, "sap.ushell.ui.launchpad.Page").returns(this.oPage);

            this.oMoveVisualizationStub = sandbox.stub().resolves({ visualizationIndex: 0 });
            this.oMessageToastShowStub = sandbox.stub(MessageToast, "show");

            this.oComponentStub = {
                getPagesService: sandbox.stub().resolves({
                    moveVisualization: this.oMoveVisualizationStub
                })
            };

            sandbox.stub(this.oController, "getOwnerComponent").returns(this.oComponentStub);

            this.sMessageToastMessage = "myText";
            this._getVizMoveMessageStub = sandbox.stub().withArgs("myArea", "myArea").returns(this.sMessageToastMessage);
            this.oController._getVizMoveMessage = this._getVizMoveMessageStub;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the right functions with the correct arguments", function (assert) {
        // Act
        return this.oController._confirmSelect(this.oEventStub).then(function () {
            // Assert
            assert.strictEqual(this.oMessageToastShowStub.callCount, 1, "MessageToast.show() was called once");
            assert.deepEqual(this.oMessageToastShowStub.args[0][0], this.sMessageToastMessage, "MessageToast.show() was called with the expected arguments");
            assert.strictEqual(this.oMoveVisualizationStub.callCount, 1, "moveVisualization was called once");
            assert.deepEqual(this.oMoveVisualizationStub.getCall(0).args, ["0", "1", "2", "4", -1], "moveVisualization was called with the right arguments");
            assert.strictEqual(this.oController._oVizInstanceToBeMoved, null, "vizInstanceToBeMoved is null");
            assert.strictEqual(this.oSection.focusVisualization.callCount, 1, "focusVisualization on the section was called once");
            assert.strictEqual(this.oSection.focusVisualization.getCall(0).args[0], this.oVizInstance, "focusVisualization on the section was called with the right visualization");
        }.bind(this));
    });

    QUnit.module("The function _onMoveTileSearch", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oBinding = {
                filter: sandbox.stub()
            };

            this.oGetParameterStub = sandbox.stub();
            this.oGetParameterStub.withArgs("value").returns("myValue");
            this.oGetParameterStub.withArgs("itemsBinding").returns(this.oBinding);

            this.oEvent = {
                getParameter: this.oGetParameterStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets the right filters", function (assert) {
        // Act
        this.oController._onMoveTileSearch(this.oEvent);

        // Assert
        var aFilters = this.oBinding.filter.getCall(0).args[0];

        assert.strictEqual(this.oBinding.filter.callCount, 1, "Filter was called once");
        assert.strictEqual(aFilters[0].oValue1, "myValue", "The first filter has the right value1");
        assert.strictEqual(aFilters[0].sOperator, "Contains", "The first filter has the right operator");
        assert.strictEqual(aFilters[0].sPath, "title", "The first filter has the right path");

        assert.strictEqual(aFilters[1].oValue1, false, "The second filter has the right value1");
        assert.strictEqual(aFilters[1].sOperator, "EQ", "The second filter has the right operator");
        assert.strictEqual(aFilters[1].sPath, "default", "The second filter has the right path");
    });

    QUnit.module("The function _onMoveTileDialogClose", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Sets _oVizInstanceToBeMoved to null", function (assert) {
        // Arrange
        this.oController._oVizInstanceToBeMoved = {};

        // Act
        this.oController._onMoveTileDialogClose();

        // Assert
        assert.strictEqual(this.oController._oVizInstanceToBeMoved, null, "vizInstanceToBeMoved is null");
    });

    QUnit.module("The function _openMoveVisualizationDialog", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oAddDependentStub = sandbox.stub();

            sandbox.stub(this.oController, "getView").returns({
                addDependent: this.oAddDependentStub
            });

            this.oVizInstance = {
                getParent: sandbox.stub().returns({
                    getBindingContext: sandbox.stub().returns({
                        getProperty: sandbox.stub()
                    })
                }),
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/pages/3/sections/4")
                })
            };

            this.oDialogStub = {
                open: sandbox.stub(),
                bindObject: sandbox.stub(),
                getBinding: sandbox.stub().returns({
                    filter: sandbox.stub()
                })
            };

            this.oLoadStub = sandbox.stub().returns({
                then: sandbox.stub().callsArgWith(0, this.oDialogStub)
            });

            this.oFragment = {
                load: this.oLoadStub
            };

            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oRequireStub.withArgs(["sap/ui/core/Fragment"], sinon.match.any).callsArgWith(1, this.oFragment);
            this.oRequireStub.callThrough();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Opens the dialog and calls the right functions", function (assert) {
        // Arrange
        var oExpectedLoadArgs = {
            name: "sap.ushell.components.pages.MoveVisualization",
            controller: this.oController
        };
        var oExpectedBindingObject = { path: "/pages/3/sections" };

        // Act
        return this.oController._openMoveVisualizationDialog({}, this.oVizInstance).then(function () {
            // Assert
            assert.strictEqual(this.oDialogStub.open.callCount, 1, "open was called once");
            assert.strictEqual(this.oAddDependentStub.callCount, 1, "addDependent was called once");
            assert.strictEqual(this.oAddDependentStub.getCall(0).args[0], this.oDialogStub, "addDependent was called with the right arg");
            assert.strictEqual(this.oController._oVizInstanceToBeMoved, this.oVizInstance, "vizInstanceToBeMoved was set correctly");
            assert.strictEqual(this.oLoadStub.callCount, 1, "load was called once");
            assert.deepEqual(this.oLoadStub.getCall(0).args[0], oExpectedLoadArgs, "load was called with the right args");
            assert.strictEqual(this.oAddDependentStub.callCount, 1, "addDependent was called once");
            assert.strictEqual(this.oAddDependentStub.getCall(0).args[0], this.oDialogStub, "addDependent was called with the right arg");
            assert.strictEqual(this.oDialogStub.bindObject.callCount, 1, "bindObject was called once");
            assert.deepEqual(this.oDialogStub.bindObject.getCall(0).args[0], oExpectedBindingObject, "bindObject was called with the right arg");
        }.bind(this));
    });

    QUnit.module("_getStateInfoActionModeButton", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
        },
        afterEach: function () {
        }
    });

    QUnit.test(" Returns { bCurrentState: true, aStates: null } when the home intent is not root intent (custom root intent).", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = false; // Custom root intent

        // Act
        var oStateInfo = this.oController._getStateInfoActionModeButton();

        // Assert
        // ... Remove home page and display target page
        assert.strictEqual(oStateInfo.bCurrentState, true, "It's for the current state.");
        assert.strictEqual(oStateInfo.aStates, null, "It's not state relevant.");
    });

    QUnit.test(" Returns { bCurrentState: false, aStates: ['home'] } when the home intent is the root intent (regular root intent).", function (assert) {
        // Arrange
        this.oController.bIsHomeIntentRootIntent = true; // Regular root intent

        // Act
        var oStateInfo = this.oController._getStateInfoActionModeButton();

        // Assert
        // ... Remove home page and display target page
        assert.strictEqual(oStateInfo.bCurrentState, false, "It's not relevant for the current state.");
        assert.deepEqual(oStateInfo.aStates, ["home"], "It's relevant for the home state.");
    });

    QUnit.module("onRouteMatched", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oEmptyPage = {
                id: "emptyPage"
            };
            this.oController.oEmptyPage = this.oEmptyPage;
            this.oController.bIsHomeIntentRootIntent = true;
            this.oController.oPagesRuntimeNavContainer = {
                to: sandbox.stub()
            };
            this.oOpenFLPPage = sandbox.stub(this.oController, "_openFLPPage");
            this.oRemoveMyHomePageStub = sandbox.stub(this.oController, "_removeMyHomePage");

            this.sActionButtonId = "ActionModeBtn";

            this.oByIdStub = sandbox.stub(Element, "getElementById");
            this.oByIdStub.withArgs(this.sActionButtonId).returns({
                getId: sandbox.stub().returns(this.sActionButtonId)
            });

            this.oGetStateInfoActionModeButtonSpy = sandbox.spy(this.oController, "_getStateInfoActionModeButton");

            this.oShowActionButtonStub = sandbox.stub();
            this.oHideActionButtonStub = sandbox.stub();
            this.oShowHeaderEndItemStub = sandbox.stub();
            this.oHideHeaderEndItemStub = sandbox.stub();
            this.oGetShellConfigStub = sandbox.stub().returns({
                moveEditHomePageActionToShellHeader: false
            });
            this.oGetRendererStub = sandbox.stub(Container, "getRendererInternal");
            this.oGetRendererStub.withArgs("fiori2").returns({
                showActionButton: this.oShowActionButtonStub,
                hideActionButton: this.oHideActionButtonStub,
                showHeaderEndItem: this.oShowHeaderEndItemStub,
                hideHeaderEndItem: this.oHideHeaderEndItemStub,
                getShellConfig: this.oGetShellConfigStub
            });

            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/shell/enablePersonalization").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Action mode button : Don't update visibility when control was not found", function (assert) {
        // Arrange
        this.oByIdStub.withArgs(this.sActionButtonId).returns(null);

        // Act
        this.oController.onRouteMatched();

        // Assert
        // ... Remove home page and display target page
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "_openFLPPage was called once.");

        // ... Renderer API was not used
        assert.strictEqual(this.oGetRendererStub.callCount, 0, "The renderer API wasn't used.");
    });

    QUnit.test("Action mode button / home app configured : Show as user action button if not a home page was called", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: false
        });
        this.oController.bIsHomeIntentRootIntent = true; // Standard root intent

        // Act
        this.oController.onRouteMatched(false);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "_openFLPPage was called once");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 1, "_moveEditActionToHeader was called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 1, "showActionButton was called.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 0, "hideActionButton was not called.");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 0, "hideHeaderEndItem was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called.");
    });

    QUnit.test("Action mode button / home app configured: Hide as user action button if navigating to custom home", function (assert) {
        // Arrange
        this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: false
        });
        this.oController.bIsHomeIntentRootIntent = true; // Standard root intent

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 0, "_openFLPPage was not called");
        assert.strictEqual(this.oController.oPagesRuntimeNavContainer.to.getCall(0).args[0], this.oEmptyPage, "Navigated to the empty page");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 1, "_moveEditActionToHeader was called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 1, "hideActionButton was called.");
        assert.strictEqual(this.oHideActionButtonStub.getCall(0).args[1], false, "hideActionButton's 2nd argument was 'false'.");
        assert.deepEqual(this.oHideActionButtonStub.getCall(0).args[2], ["home"], "hideActionButton's 3rd argument was ['home'].");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 0, "hideHeaderEndItem was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called.");
        assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called.");
    });

    QUnit.test("Action mode button / home app configured : Show as header end item if not a home page was called", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });
        this.oController.bIsHomeIntentRootIntent = true; // Standard root intent

        // Act
        this.oController.onRouteMatched(false);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "_openFLPPage was called once");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 1, "_moveEditActionToHeader was called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 0, "hideActionButton was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called.");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 0, "hideHeaderEndItem was not called.");
    });

    QUnit.test("Action mode button / home app configured: Hide as header end item if navigating to custom home", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });
        this.oController.bIsHomeIntentRootIntent = true; // Standard root intent
        this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 0, "_openFLPPage was not called");
        assert.strictEqual(this.oController.oPagesRuntimeNavContainer.to.getCall(0).args[0], this.oEmptyPage, "Navigated to the empty page");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 1, "_moveEditActionToHeader was called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 0, "hideActionButton was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called.");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 1, "hideHeaderEndItem was called.");
        assert.strictEqual(this.oHideHeaderEndItemStub.getCall(0).args[1], false, "hideHeaderEndItem's 2nd argument was 'false'.");
        assert.deepEqual(this.oHideHeaderEndItemStub.getCall(0).args[2], ["home"], "hideHeaderEndItem's 3rd argument was ['home'].");
        assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called.");
    });

    QUnit.test("Action mode button / custom root intent configured: Show as user action button", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: false
        });
        this.oController.bIsHomeIntentRootIntent = false; // Custom root intent, e.g. WorkZone

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "_openFLPPage was called once.");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once.");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 1, "_moveEditActionToHeader was called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 1, "showActionButton was called.");
        assert.strictEqual(this.oShowActionButtonStub.getCall(0).args[1], true, "showActionButton's 2nd argument was 'true'.");
        assert.strictEqual(this.oShowActionButtonStub.getCall(0).args[2], null, "showActionButton's 3rd argument was null.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 0, "hideActionButton was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called.");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 0, "hideHeaderEndItem was not called.");
    });

    QUnit.test("Action mode button / custom root intent configured: Show as header end item", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });
        this.oController.bIsHomeIntentRootIntent = false; // Custom root intent, e.g. WorkZone

        // Act
        this.oController.onRouteMatched(false);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "_openFLPPage was called once.");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once.");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 1, "_moveEditActionToHeader was called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 0, "hideActionButton was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 1, "showHeaderEndItem was called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.getCall(0).args[1], true, "showHeaderEndItem's 2nd argument was 'true'.");
        assert.strictEqual(this.oShowHeaderEndItemStub.getCall(0).args[2], null, "showHeaderEndItem's 3rd argument was null.");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 0, "hideHeaderEndItem was not called.");
    });

    QUnit.test("Action mode button / home app & no custom root intent configured: Don't update visibility", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);
        this.oGetShellConfigStub.returns({
            moveEditHomePageActionToShellHeader: true
        });
        this.oController.bIsHomeIntentRootIntent = true; // Standard root intent

        // Act
        this.oController.onRouteMatched(false);

        // Assert
        assert.strictEqual(this.oRemoveMyHomePageStub.callCount, 1, "_removeMyHomePage was called once");
        assert.strictEqual(this.oOpenFLPPage.callCount, 1, "_openFLPPage was called once.");
        assert.strictEqual(this.oByIdStub.callCount, 1, "byId was called once.");
        assert.strictEqual(this.oConfigLastStub.called, true, "Config.last was called.");
        assert.strictEqual(this.oGetStateInfoActionModeButtonSpy.callCount, 1, "_getStateInfoActionModeButton was called.");
        assert.strictEqual(this.oGetShellConfigStub.callCount, 0, "_moveEditActionToHeader was not called.");
        assert.strictEqual(this.oShowActionButtonStub.callCount, 0, "showActionButton was not called.");
        assert.strictEqual(this.oHideActionButtonStub.callCount, 0, "hideActionButton was not called.");
        assert.strictEqual(this.oShowHeaderEndItemStub.callCount, 0, "showHeaderEndItem was not called.");
        assert.strictEqual(this.oHideHeaderEndItemStub.callCount, 0, "hideHeaderEndItem was not called.");
    });

    QUnit.test("home app configured: resets currentSpaceAndPage config for hierarchy", function (assert) {
        // Arrange
        Config.emit("/core/spaces/currentSpaceAndPage", {});
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oConfigLastStub.callThrough();
        this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        var oCurrentSpaceAndPage = Config.last("/core/spaces/currentSpaceAndPage");
        assert.strictEqual(oCurrentSpaceAndPage, undefined, "the config was reset to undefined");
    });

    QUnit.test("home app not configured: keeps currentSpaceAndPage config for hierarchy", function (assert) {
        // Arrange
        Config.emit("/core/spaces/currentSpaceAndPage", {});
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);
        this.oConfigLastStub.callThrough();

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        var oCurrentSpaceAndPage = Config.last("/core/spaces/currentSpaceAndPage");
        assert.deepEqual(oCurrentSpaceAndPage, {}, "the config was reset to undefined");
    });

    QUnit.test("home app configured: resets homeUri for home button", function (assert) {
        // Arrange
        Config.emit("/core/shellHeader/homeUri", "#Launchpad-openFLPPage?pageId=page1&spaceId=space1");
        Config.emit("/core/shellHeader/rootIntent", "Shell-home");
        Config.emit("/core/spaces/homeNavigationTarget", "origin_page");
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        this.oConfigLastStub.callThrough();
        this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        var sHomeUri = Config.last("/core/shellHeader/homeUri");
        assert.deepEqual(sHomeUri, "#Shell-home", "the homeUri was reset");
    });

    QUnit.test("home app not configured: keeps homeUri for home button", function (assert) {
        // Arrange
        Config.emit("/core/shellHeader/homeUri", "#Launchpad-openFLPPage?pageId=page1&spaceId=space1");
        Config.emit("/core/shellHeader/rootIntent", "Shell-home");
        Config.emit("/core/spaces/homeNavigationTarget", "origin_page");
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);
        this.oConfigLastStub.callThrough();

        // Act
        this.oController.onRouteMatched(true);

        // Assert
        var sHomeUri = Config.last("/core/shellHeader/homeUri");
        assert.deepEqual(sHomeUri, "#Launchpad-openFLPPage?pageId=page1&spaceId=space1", "the homeUri was not reset");
    });

    QUnit.module("The _navigateToInitialMyHome function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oCancelActionModeStub = sandbox.stub(this.oController, "_cancelActionMode");
            this.oConnectStub = sandbox.stub();
            this.oPage = {
                getController: function () {
                    return {
                        connect: this.oConnectStub
                    };
                }.bind(this)
            };
            this.oRequireStub = sandbox.stub(sap.ui, "require");
            this.oCreateStub = sandbox.stub(XMLView, "create").resolves(this.oPage);
            this.oInsertPageStub = sandbox.stub();
            this.oToStub = sandbox.stub();

            this.oController.oPagesRuntimeNavContainer = {
                insertPage: this.oInsertPageStub,
                to: this.oToStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Loads the view if it does not exist yet", function (assert) {
        // Act
        var pNavigateToMyHome = this.oController._navigateToInitialMyHome();

        // Assert
        assert.strictEqual(this.oRequireStub.callCount, 1, "sap.ui.require was called once.");
        this.oRequireStub.firstCall.args[1](XMLView);
        assert.strictEqual(this.oCreateStub.callCount, 1, "XMLView.create was called once.");

        return pNavigateToMyHome.then(function () {
            assert.strictEqual(this.oInsertPageStub.callCount, 1, "insertPage was called once.");
            assert.strictEqual(this.oToStub.callCount, 1, "to was called once.");
            assert.strictEqual(this.oConnectStub.callCount, 1, "connect was called once.");
            assert.strictEqual(this.oCancelActionModeStub.callCount, 1, "_cancelActionMode was called once.");
            assert.ok(this.oInsertPageStub.calledWith(this.oPage, 0), "insertPage was called with the expected arguments.");
            assert.ok(this.oToStub.calledWith(this.oPage), "to was called with the expected arguments.");
        }.bind(this));
    });

    QUnit.test("Does not load the view if it already exists", function (assert) {
        // Arrange
        this.oController._pLoadMyHomeView = Promise.resolve(this.oPage);
        // Act
        var pNavigateToMyHome = this.oController._navigateToInitialMyHome();
        // Assert
        assert.strictEqual(this.oRequireStub.callCount, 0, "sap.ui.require was not called.");
        assert.strictEqual(this.oCreateStub.callCount, 0, "XMLView.create was not called.");
        assert.strictEqual(this.oInsertPageStub.callCount, 0, "insertPage was not called.");

        return pNavigateToMyHome.then(function () {
            assert.strictEqual(this.oToStub.callCount, 1, "to was called once.");
            assert.ok(this.oToStub.calledWith(this.oPage), "to was called with the expected arguments.");
        }.bind(this));
    });

    QUnit.module("The _isMyHomeRouteActive function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigEnabledStub = this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled");
            this.oConfigUserEnabledStub = this.oConfigLastStub.withArgs("/core/spaces/myHome/userEnabled");
            this.oConfigSpaceIdStub = this.oConfigLastStub.withArgs("/core/spaces/myHome/myHomeSpaceId");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("returns true if the config value is true and the myHomeSpaceId matches the currentTargetSpaceId", function (assert) {
        // Arrange
        this.oController.sCurrentTargetSpaceId = "TEST-SPACE-ID";
        this.oConfigSpaceIdStub.returns("TEST-SPACE-ID");
        this.oConfigEnabledStub.returns(true);
        this.oConfigUserEnabledStub.returns(true);

        // Assert
        assert.ok(this.oController._isMyHomeRouteActive(), "The result was true.");
    });

    QUnit.test("returns false if the config value is false", function (assert) {
        // Arrange
        this.oController.sCurrentTargetSpaceId = "TEST-SPACE-ID";
        this.oConfigSpaceIdStub.returns("TEST-SPACE-ID");
        this.oConfigEnabledStub.returns(false);

        // Assert
        assert.notOk(this.oController._isMyHomeRouteActive(), "The result was false.");
    });

    QUnit.test("returns false if the current space id is not the MyHome space id", function (assert) {
        // Arrange
        this.oController.sCurrentTargetSpaceId = "TEST-SPACE-ID-HOME";
        this.oConfigSpaceIdStub.returns("TEST-SPACE-ID");
        this.oConfigEnabledStub.returns(true);

        // Assert
        assert.notOk(this.oController._isMyHomeRouteActive(), "The result was false.");
    });

    QUnit.module("The handleMyHomeActionMode function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oEnterMyHomeActionModeStub = sandbox.stub(this.oController, "_enterMyHomeActionMode").resolves();
            this.oMyHomeRouteActiveStub = sandbox.stub(this.oController, "_isMyHomeRouteActive").returns(true);
            this.oMyHomePageEmptyStub = sandbox.stub(this.oController, "_isMyHomePageEmpty").returns(false);
            this.oNavigateToInitialMyHomeStub = sandbox.stub(this.oController, "_navigateToInitialMyHome").resolves();
            this.oGetIdStub = sandbox.stub();

            this.oController.oPagesNavContainer = {
                getCurrentPage: function () {
                    return {
                        getId: this.oGetIdStub
                    };
                }.bind(this)
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls _enterMyHomeActionMode if MyHome is in the initial state and editMode is true", function (assert) {
        // Arrange
        // Act
        return this.oController.handleMyHomeActionMode(true).then(function () {
            // Assert
            assert.strictEqual(this.oNavigateToInitialMyHomeStub.callCount, 0, "_navigateToInitialMyHome was not called.");
            assert.strictEqual(this.oEnterMyHomeActionModeStub.callCount, 1, "_enterMyHomeActionMode was called once.");
        }.bind(this));
    });

    QUnit.test("calls _navigateToInitialMyHome if the MyHome is not in the initial state and editMode is false", function (assert) {
        // Arrange
        this.oMyHomePageEmptyStub.returns(true);
        // Act
        return this.oController.handleMyHomeActionMode(false).then(function () {
            // Assert
            assert.strictEqual(this.oNavigateToInitialMyHomeStub.callCount, 1, "_navigateToInitialMyHome was called once.");
            assert.strictEqual(this.oEnterMyHomeActionModeStub.callCount, 0, "_enterMyHomeActionMode was not called.");
        }.bind(this));
    });

    QUnit.test("Resolves if MyHome is not in the initial state and editMode is true", function (assert) {
        // Arrange
        this.oMyHomeRouteActiveStub.returns(false);
        // Act
        return this.oController.handleMyHomeActionMode(true).then(function () {
            // Assert
            assert.strictEqual(this.oNavigateToInitialMyHomeStub.callCount, 0, "_navigateToInitialMyHome was not called.");
            assert.strictEqual(this.oEnterMyHomeActionModeStub.callCount, 0, "_enterMyHomeActionMode was not called.");
        }.bind(this));
    });

    QUnit.test("Resolves if MyHome is in the initial state and editMode is false", function (assert) {
        // Arrange

        // Act
        return this.oController.handleMyHomeActionMode(false).then(function () {
            // Assert
            assert.strictEqual(this.oNavigateToInitialMyHomeStub.callCount, 0, "_navigateToInitialMyHome was not called.");
            assert.strictEqual(this.oEnterMyHomeActionModeStub.callCount, 0, "_enterMyHomeActionMode was not called.");
        }.bind(this));
    });

    QUnit.module("The openMyHomeImportDialog function", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").resolves({
                error: sandbox.stub()
            });

            this.oController = new PagesRuntimeController();
            this.oRequireSpy = sandbox.spy(sap.ui, "require");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Loads the dialog controller initially and creates an instance, then opens the dialog", function (assert) {
        // Act
        var pImportPress = this.oController.openMyHomeImportDialog();
        assert.ok(this.oRequireSpy.calledOnce, "sap.ui.require was called once");

        return pImportPress.then(function (dialog) {
            // Assert
            assert.strictEqual(dialog.getMetadata().getName(), "sap.m.Dialog", "The dialog was returned");
            assert.ok(dialog.isOpen(), "The dialog was opened.");
            dialog.close();
        });
    });

    QUnit.test("Loads the dialog controller only once", function (assert) {
        // Arrange
        this.oOpenStub = sandbox.stub();
        this.oController._pLoadImportDialog = Promise.resolve({
            open: this.oOpenStub
        });
        // Act
        return this.oController.openMyHomeImportDialog().then(function () {
            // Assert
            assert.strictEqual(this.oRequireSpy.callCount, 0, "sap.ui.require was not called");
            assert.strictEqual(this.oOpenStub.callCount, 1, "open was called on the dialog");
        }.bind(this));
    });

    QUnit.module("The onImportDialogPress function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oOpenMyHomeImportDialogStub = sandbox.stub(this.oController, "openMyHomeImportDialog");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Loads the dialog controller initially and creates an instance, then opens the dialog", function (assert) {
        // Act
        this.oController.onImportDialogPress();

        // Assert
        assert.ok(this.oOpenMyHomeImportDialogStub.calledOnce, "openMyHomeImportDialog was called once.");
    });

    QUnit.module("The _removeMyHomePage function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oRemovePageStub = sandbox.stub();
            this.oController.oPagesNavContainer = {
                removePage: this.oRemovePageStub
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls removePage on the PagesNavContainer", function (assert) {
        // Act
        this.oController._removeMyHomePage();

        // Assert
        assert.ok(this.oRemovePageStub.calledOnce, "removePage was called once.");
        assert.ok(this.oRemovePageStub.calledWith("sapUshellMyHomePage"), "removePage was called with the expected arguments.");
    });

    QUnit.module("The _sectionEnableReset formatter function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.returns("MY-HOME-PRESET-SECTION-ID");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns false if the given sectionId matches the 'My Apps' section id", function (assert) {
        // Act
        var bResult = this.oController._sectionEnableReset("MY-HOME-PRESET-SECTION-ID", true);

        // Assert
        assert.strictEqual(bResult, false, "The result was false.");
    });

    QUnit.test("Returns true if the given sectionId does not match the 'My Apps' section id, but preset is true", function (assert) {
        // Act
        var bResult = this.oController._sectionEnableReset("MY-PRESET-SECTION-ID", true);

        // Assert
        assert.strictEqual(bResult, true, "The result was true.");
    });

    QUnit.test("Returns false if the given sectionId does not match the 'My Apps' section id and preset is false", function (assert) {
        // Act
        var bResult = this.oController._sectionEnableReset("MY-PRESET-SECTION-ID", false);

        // Assert
        assert.strictEqual(bResult, false, "The result was false.");
    });

    QUnit.module("The _sectionEnableDelete formatter function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oConfigLastStub.returns("MY-HOME-PRESET-SECTION-ID");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns false if the given sectionId matches the 'My Apps' section id", function (assert) {
        // Act
        var bResult = this.oController._sectionEnableDelete("MY-HOME-PRESET-SECTION-ID", true);

        // Assert
        assert.strictEqual(bResult, false, "The result was false.");
    });

    QUnit.test("Returns false if the given sectionId does not match the 'My Apps' section id, but preset is true", function (assert) {
        // Act
        var bResult = this.oController._sectionEnableDelete("MY-PRESET-SECTION-ID", true);

        // Assert
        assert.strictEqual(bResult, false, "The result was false.");
    });

    QUnit.test("Returns true if the given sectionId does not match the 'My Apps' section id and preset is false", function (assert) {
        // Act
        var bResult = this.oController._sectionEnableDelete("MY-PRESET-SECTION-ID", false);

        // Assert
        assert.strictEqual(bResult, true, "The result was trues.");
    });

    QUnit.module("The onMessageStripClose function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oMessageBoxStub = sandbox.stub(MessageBox, "information");
            this.setImportEnabledStub = sandbox.stub(myHomeImport, "setImportEnabled");

            sandbox.stub(sap.ui, "require").callsFake(function (aModules, fnCallback) {
                if (aModules.length && aModules.length === 1 && aModules[0] === "sap/m/MessageBox") {
                    fnCallback(MessageBox);
                    return undefined;
                }
                return sap.ui.require.wrappedMethod.apply(this, arguments);
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("opens a MessageBox", function (assert) {
        // Act
        this.oController.onMessageStripClose();

        // Assert
        assert.ok(this.oMessageBoxStub.calledOnce, "The oMessageBoxStub callback was called");
        assert.ok(this.oMessageBoxStub.firstCall.args[0], "You can display this message again in the User Settings on the Spaces and Pages tab.",
            "The oMessageBoxStub callback was called with the correct message");
    });
    QUnit.test("calls the setImportEnabled", function (assert) {
        // Act
        this.oController.onMessageStripClose();

        // Assert
        assert.ok(this.setImportEnabledStub.calledOnce, "The setImportEnabled was called once.");
        assert.strictEqual(this.setImportEnabledStub.firstCall.args[0], false, "The setImportEnabled was called with argument 'false'.");
    });

    QUnit.module("The _addToMyHome function", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oMessageToastStub = sandbox.stub(MessageToast, "show");
            this.oCopyVizStub = sandbox.stub();
            this.oVizData = {
                id: "test",
                vizId: "xyztest"
            };
            this.oPagesService = {
                copyVisualization: this.oCopyVizStub
            };
            sandbox.stub(this.oController, "getOwnerComponent").returns({
                getPagesService: sandbox.stub().resolves(this.oPagesService)
            });
            this.oVizInstance = {
                getBindingContext: sandbox.stub().returns({
                    getObject: sandbox.stub().returns(this.oVizData)
                })
            };
            this.oController._sMyHomePageId = "TEST_MY_HOME_PAGE_ID";
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("calls the pages service with the expected arguments", function (assert) {
        // Act
        return this.oController._addToMyHome({}, this.oVizInstance).then(function () {
            // Assert
            assert.deepEqual(
                this.oCopyVizStub.getCall(0).args,
                ["TEST_MY_HOME_PAGE_ID", null, this.oVizData],
                "copyVisualization was called with the expected arguments."
            );
        }.bind(this));
    });

    QUnit.test("calls MessageToast.show", function (assert) {
        // Act
        return this.oController._addToMyHome({}, this.oVizInstance).then(function () {
            // Assert
            assert.ok(this.oMessageToastStub.calledOnce, "MessageToastStub.show was called once.");
        }.bind(this));
    });

    QUnit.module("hideRuntime", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();
            this.oToStub = sandbox.stub();
            this.oController.oPagesRuntimeNavContainer = {
                to: this.oToStub
            };
            this.oController.oEmptyPage = {
                test: "page"
            };
            this.oHideActionModeButtonStub = sandbox.stub(this.oController, "_hideActionModeButton");
        }
    });

    QUnit.test("hides the runtime and navigates to the empty page", function (assert) {
        this.oController.hideRuntime();
        assert.equal(this.oToStub.callCount, 1, "The empty page was navigated to.");
        assert.deepEqual(this.oToStub.getCall(0).args[0], this.oController.oEmptyPage, "The empty page was navigated to.");
        assert.ok(this.oHideActionModeButtonStub.calledOnce, "hide action mode button was called");
    });

    QUnit.module("Integration: _getVizInstanceById", {
        beforeEach: function () {
            this.oMockVizInstances = {
                "vizRef-0": new VizInstance()
            };

            var oModel = new JSONModel({
                pages: [{
                    id: "page-0",
                    sections: [{
                        id: "section-0",
                        visualizations: [{
                            id: "vizRef-0"
                        }]
                    }]
                }]
            });

            sandbox.stub(StateManager, "getPageVisibility");

            sandbox.stub(PagesRuntimeController.prototype, "onInit");
            this.oController = new PagesRuntimeController();
            this.oController._oVisualizationInstantiationService = {
                instantiateVisualization: sandbox.stub().callsFake(function (oData) {
                    return this.oMockVizInstances[oData.id] || new VizInstance();
                }.bind(this))
            };
            sandbox.stub(this.oController, "onExit");

            return XMLView.create({
                viewName: "sap.ushell.components.pages.view.PageRuntime",
                controller: this.oController
            }).then(function (oView) {
                this.oView = oView;
                this.oView.setModel(oModel);
            }.bind(this));
        },
        afterEach: function () {
            this.oView.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the correct VizInstance control", function (assert) {
        // Act
        var oVizInstance = this.oController._getVizInstanceById("page-0", "section-0", "vizRef-0");
        // Assert
        assert.strictEqual(oVizInstance, this.oMockVizInstances["vizRef-0"], "Returned the correct control");
    });

    QUnit.test("Returns null if pages does not exist", function (assert) {
        // Act
        var oVizInstance = this.oController._getVizInstanceById("page-2", "section-0", "vizRef-0");
        // Assert
        assert.strictEqual(oVizInstance, null, "Returned null");
    });

    QUnit.test("Returns null if section does not exist", function (assert) {
        // Act
        var oVizInstance = this.oController._getVizInstanceById("page-0", "section-2", "vizRef-0");
        // Assert
        assert.strictEqual(oVizInstance, null, "Returned null");
    });

    QUnit.test("Returns null if vizRef does not exist", function (assert) {
        // Act
        var oVizInstance = this.oController._getVizInstanceById("page-0", "section-0", "vizRef-2");
        // Assert
        assert.strictEqual(oVizInstance, null, "Returned null");
    });

    QUnit.module("The formatter _formatSectionAriaLabel", {
        beforeEach: function () {
            this.oController = new PagesRuntimeController();

            this.oModel = new JSONModel();
            this.oGetModelStub = sandbox.stub().returns(this.oModel);

            this.oGetTextStub = sandbox.stub();

            sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub
            });
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns the expected aria-labels - error cases", function (assert) {
        this.oModel.setData({
            pages: [
                { id: "page-1" },
                { id: "page-2" },
                { id: "page-3" },
                { id: "page-4" },
                {
                    id: "page-5",
                    sections: [{
                        id: "section-1",
                        visible: false
                    }, {
                        id: "section-2",
                        visible: true,
                        visualizations: []
                    }]
                }
            ]
        });

        var aResults = [
            this.oController._formatSectionAriaLabel(),
            this.oController._formatSectionAriaLabel(undefined, ""),
            this.oController._formatSectionAriaLabel(undefined, "/wrong/path"),
            this.oController._formatSectionAriaLabel(undefined, "/wrong/section/path/0"),
            this.oController._formatSectionAriaLabel(undefined, "/pages/4/sections/2"),
            this.oController._formatSectionAriaLabel(undefined, "/pages/4/sections/0", false),
            this.oController._formatSectionAriaLabel(undefined, "/pages/4/sections/1", false)
        ];
        assert.deepEqual(aResults, ["", "", "", "", "", "", ""], "The expected results were returned (error case)");
    });

    QUnit.test("Returns the title in the translated string for named rows", function (assert) {
        var sResult = this.oController._formatSectionAriaLabel("The section title");
        var sExpectedResult = resources.i18n.getText("Section.Description", ["The section title"]);

        assert.strictEqual(
            sResult,
            sExpectedResult,
            "The expected result was returned");
    });

    QUnit.test("Returns the position in the translated string for unnamed sections - edit mode", function (assert) {
        this.oModel.setData({
            pages: [
                { id: "page-1" },
                { id: "page-2" },
                { id: "page-3" },
                {
                    id: "page-4",
                    sections: [
                        {
                            id: "section-1",
                            visible: false,
                            visualizations: [{ id: "viz-1" }]
                        },
                        {
                            id: "section-2",
                            visible: true,
                            visualizations: []
                        },
                        {
                            id: "section-3",
                            visible: true,
                            visualizations: [{ id: "viz-1" }]
                        },
                        {
                            id: "section-4",
                            visible: true,
                            visualizations: [{ id: "viz-1" }]
                        }
                    ]
                }
            ]
        });
        var sResult = this.oController._formatSectionAriaLabel("", "/pages/3/sections/3", true);

        var sExpectedResult = resources.i18n.getText("Section.Description.EmptySectionAriaLabel", [4]);

        assert.strictEqual(
            sResult,
            sExpectedResult,
            "The expected result was returned");
    });

    QUnit.test("Returns the position in the translated string for unnamed sections - display mode", function (assert) {
        this.oModel.setData({
            pages: [
                { id: "page-1" },
                { id: "page-2" },
                { id: "page-3" },
                {
                    id: "page-4",
                    sections: [
                        {
                            id: "section-1",
                            visible: false,
                            visualizations: [{ id: "viz-1" }]
                        },
                        {
                            id: "section-2",
                            visible: true,
                            visualizations: []
                        },
                        {
                            id: "section-3",
                            visible: true,
                            visualizations: [{ id: "viz-1" }]
                        },
                        {
                            id: "section-4",
                            visible: true,
                            visualizations: [{ id: "viz-1" }]
                        }
                    ]
                }
            ]
        });
        var sResult = this.oController._formatSectionAriaLabel("", "/pages/3/sections/3", false);

        var sExpectedResult = resources.i18n.getText("Section.Description.EmptySectionAriaLabel", [2]);

        assert.strictEqual(
            sResult,
            sExpectedResult,
            "The expected result was returned");
    });
});
