// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for "sap.ushell.ui.launchpad.VizInstance"
 */
sap.ui.define([
    "sap/f/Card",
    "sap/f/GridContainerItemLayoutData",
    "sap/m/ActionSheet",
    "sap/m/Button",
    "sap/m/GenericTile",
    "sap/m/SlideTile",
    "sap/m/library",
    "sap/m/VBox",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/Control",
    "sap/ui/core/Lib",
    "sap/ui/core/UIComponent",
    "sap/ui/events/PseudoEvents",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/VizInstance"
], function (
    Card,
    GridContainerItemLayoutData,
    ActionSheet,
    Button,
    GenericTile,
    SlideTile,
    mobileLibrary,
    VBox,
    Component,
    ComponentContainer,
    Control,
    Library,
    UIComponent,
    PseudoEvents,
    nextUIUpdate,
    Config,
    ushellLibrary,
    resources,
    VizInstance
) {
    "use strict";

    /* global QUnit, sinon */

    var LoadState = mobileLibrary.LoadState;
    var FrameType = mobileLibrary.FrameType;
    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;
    var DisplayFormat = ushellLibrary.DisplayFormat;
    var GenericTileScope = mobileLibrary.GenericTileScope;

    var sandbox = sinon.createSandbox({});

    QUnit.module("The constructor", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates an instance of a Control", function (assert) {
        // Act
        var oVizInstance = new VizInstance();

        // Assert
        assert.ok(oVizInstance instanceof Control, "Correctly creates an instance of a Control.");
        assert.strictEqual(oVizInstance.getTitle(), "", "The default title was correctly set.");
        assert.strictEqual(oVizInstance.getSubtitle(), "", "The default subtitle was correctly set.");
        assert.strictEqual(oVizInstance.getInfo(), "", "The default info was correctly set.");
        assert.strictEqual(oVizInstance.getIcon(), "", "The default icon was correctly set.");
        assert.strictEqual(oVizInstance.getNumberUnit(), "", "The default numberUnit was correctly set.");
        assert.strictEqual(oVizInstance.getTargetURL(), undefined, "The default targetUrl was correctly set.");
        assert.strictEqual(oVizInstance.getHeight(), 2, "The default height was correctly set.");
        assert.strictEqual(oVizInstance.getWidth(), 2, "The default width was correctly set.");
        assert.strictEqual(oVizInstance.getState(), LoadState.Loaded, "The default state was correctly set.");
        assert.strictEqual(oVizInstance.getSizeBehavior(), undefined, "The default sizeBehaviour was correctly set.");
        assert.strictEqual(oVizInstance.getEditable(), false, "The default value for the editable property was correctly set.");
        assert.strictEqual(oVizInstance.getActive(), false, "The default value for the active property was correctly set.");
        assert.strictEqual(oVizInstance.getVizConfig(), undefined, "The default value for the vizConfig property was correctly set.");
        assert.strictEqual(oVizInstance.getDisplayFormat(), DisplayFormat.Standard, "The default value for the displayFormat property was correctly set.");
        assert.strictEqual(oVizInstance.getIndicatorDataSource(), undefined, "The default value for the indicatorDataSource property was correctly set.");
        assert.strictEqual(oVizInstance.getDataSource(), undefined, "The default value for the dataSource property was correctly set.");
        assert.deepEqual(oVizInstance.getSupportedDisplayFormats(), ["standard"], "The default values for the supportedDisplayFormats property were correctly set.");
        assert.strictEqual(oVizInstance.getPreview(), false, "The default value for the preview property was correctly set.");
        assert.strictEqual(oVizInstance.getDataHelpId(), "", "The default value for dataHelpId property was correctly set.");
        assert.strictEqual(oVizInstance.getVizRefId(), "", "The default value for vizRefId property was correctly set.");

        oVizInstance.destroy();
    });

    QUnit.test("Has the correct aggregation", function (assert) {
        // Arrange
        var oVizInstance = new VizInstance();
        var oDefaultAggregation = oVizInstance.getMetadata().getAggregation();
        var oTileActionsAggregation = oVizInstance.getMetadata().getAggregation("tileActions");

        // Assert
        assert.strictEqual(oDefaultAggregation.name, "tileActions", "The tile has the correct default aggregation.");
        assert.strictEqual(oTileActionsAggregation.forwarding.getter, "_getTileActionSheet", "The tileActions aggregation is forwarded using the getter function _getTileActionSheet.");
        assert.strictEqual(oTileActionsAggregation.forwarding.aggregation, "buttons", "The tileActions aggregation is forwarded to the buttons aggregation.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Calls the constructor of the superclass", function (assert) {
        // Arrange
        var oInitStub = sandbox.stub(VizInstance.prototype, "init");

        // Act
        var oVizInstance = new VizInstance();

        // Assert
        assert.strictEqual(oInitStub.callCount, 1, "The init function has been called once.");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Correctly assigns the content aggregation to the initial tile", function (assert) {
        // Act
        var oVizInstance = new VizInstance();

        // Assert
        var oTile = oVizInstance.getContent();
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");
        assert.strictEqual(oTile.getState(), LoadState.Loaded, "The default state was correctly set");
        assert.strictEqual(oTile.getFrameType(), "OneByOne", "The default frame type was correctly set");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.test("Loading tile has inner tabstop removed", async function (assert) {
        // Arrange
        var oVizInstance = new VizInstance();
        oVizInstance.placeAt("qunit-fixture");

        // Act
        await nextUIUpdate();

        // Assert
        var oTile = oVizInstance.getContent();
        assert.ok(oTile.isA("sap.m.GenericTile"), "The correct control type has been found.");
        assert.deepEqual(oTile.getDomRef().getAttribute("tabindex"), "-1", "tile no longer has a tabstop");

        // Cleanup
        oVizInstance.destroy();
    });

    QUnit.module("The method getLayout", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns the correct layout", function (assert) {
        // Arrange
        var oExpectedResult = {
            columns: 2,
            rows: 2
        };

        // Act
        var oResult = this.oVizInstance.getLayout();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "the method returns the correct object with the correct values");
    });

    QUnit.module("The method setContent", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oInvalidateStub = sandbox.stub(this.oVizInstance, "invalidate");
            this.oGetLayoutDataStub = sandbox.stub(this.oVizInstance, "getLayoutData");
            this.oGetParentSub = sandbox.stub(this.oVizInstance, "getParent");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Correctly sets the content aggregation", function (assert) {
        // Arrange
        var oContent = new Button();
        this.oDataSetterSpy = sandbox.spy(oContent, "data");
        this.oVizInstance.setVizRefId("someTileId");
        this.oVizInstance.setDataHelpId("someVizId");

        // Act
        this.oVizInstance.setContent(oContent);

        // Assert
        assert.strictEqual(this.oGetLayoutDataStub.callCount, 1, "function was called exactly once");
        assert.ok(this.oVizInstance.getAggregation("content"), "aggregation was set");
        assert.ok(this.oDataSetterSpy.called, "the setter was called as expected");
        assert.deepEqual(this.oDataSetterSpy.getCall(0).args, ["help-id", "someVizId", true], "setter was called the first time with the correct parameters");
        assert.deepEqual(this.oDataSetterSpy.getCall(1).args, ["tile-id", "someVizId", true], "setter was called the second time with the correct parameters");
    });

    QUnit.test("Correctly uses a fallback on the vizRefId", function (assert) {
        // Arrange
        var oContent = new Button();
        this.oDataSetterSpy = sandbox.spy(oContent, "data");
        this.oVizInstance.setVizRefId("someTileId");

        // Act
        this.oVizInstance.setContent(oContent);

        // Assert
        assert.strictEqual(this.oGetLayoutDataStub.callCount, 1, "function was called exactly once");
        assert.ok(this.oVizInstance.getAggregation("content"), "aggregation was set");
        assert.ok(this.oDataSetterSpy.called, "the setter was called as expected");
        assert.deepEqual(this.oDataSetterSpy.getCall(0).args, ["tile-id", "someTileId", true], "setter was called with the correct parameters");
    });

    QUnit.test("Correctly handles the layout data", function (assert) {
        // Arrange
        var oContent = new Button();
        var oGridData = new GridContainerItemLayoutData();
        this.oGetLayoutDataStub.returns(oGridData);
        var oInvalidateParentStub = sandbox.stub();
        this.oGetParentSub.returns({ invalidate: oInvalidateParentStub });

        // Act
        this.oVizInstance.setContent(oContent);

        // Assert
        assert.strictEqual(oGridData.getRows(), 2, "the correct number of rows was set on the grid layout");
        assert.strictEqual(oGridData.getColumns(), 2, "the correct number of rows was set on the grid layout");
        assert.strictEqual(oInvalidateParentStub.callCount, 0, "invalidation of the parent control was not called");
        assert.strictEqual(this.oInvalidateStub.callCount, 1, "invalidation of the vizInstance was called once");

        oGridData.destroy();
    });

    QUnit.module("The method setContent (inner tabindex)", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (after initial rendering)", async function (assert) {
        // Structure:
        // sap.m.GenericTile (loading tile)

        // Arrange & Act
        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (standard tile #1 (cdm))", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.mvc.View
        //         sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        var oView = new VBox({ items: [ oGenericTile ] });
        var oViewIsA = sandbox.stub(oView, "isA");
        oViewIsA.withArgs("sap.ui.core.Control").returns(true);
        oViewIsA.withArgs("sap.ui.core.mvc.View").returns(true);
        oView.getContent = sandbox.stub().returns([ oGenericTile ]);

        var oComponentContainer = new VBox({ items: [ oView ] });
        var oComponentContainerIsA = sandbox.stub(oComponentContainer, "isA");
        oComponentContainerIsA.withArgs("sap.ui.core.Control").returns(true);
        oComponentContainerIsA.withArgs("sap.ui.core.ComponentContainer").returns(true);
        oComponentContainer.getComponent = sandbox.stub().returns("someComponentId");

        sandbox.stub(Component, "getComponentById").withArgs("someComponentId").returns({
            getRootControl: sandbox.stub().returns(oView)
        });

        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Act
        this.oVizInstance.setContent(oComponentContainer);
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oGenericTile.getFocusDomRef().getAttribute("tabindex"), "-1", "the tabstop was removed");
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (standard tile #2 (abap chip))", async function (assert) {
        // Structure:
        // sap.ui.core.mvc.View
        //     sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        var oView = new VBox({ items: [ oGenericTile ] });
        var oViewIsA = sandbox.stub(oView, "isA");
        oViewIsA.withArgs("sap.ui.core.Control").returns(true);
        oViewIsA.withArgs("sap.ui.core.mvc.View").returns(true);
        oView.getContent = sandbox.stub().returns([ oGenericTile ]);

        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Act
        this.oVizInstance.setContent(oView);
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oGenericTile.getFocusDomRef().getAttribute("tabindex"), "-1", "the tabstop was removed");
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (ssb #1 tile)", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.m.FlexBox
        //         sap.ui.core.mvc.View
        //             sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        var oView = new VBox({ items: [ oGenericTile ] });
        var oViewIsA = sandbox.stub(oView, "isA");
        oViewIsA.withArgs("sap.ui.core.Control").returns(true);
        oViewIsA.withArgs("sap.ui.core.mvc.View").returns(true);
        oView.getContent = sandbox.stub().returns([ oGenericTile ]);

        var oFlexBox = new VBox({ items: [ oView ] });

        var oComponentContainer = new VBox({ items: [ oFlexBox ] });
        var oComponentContainerIsA = sandbox.stub(oComponentContainer, "isA");
        oComponentContainerIsA.withArgs("sap.ui.core.Control").returns(true);
        oComponentContainerIsA.withArgs("sap.ui.core.ComponentContainer").returns(true);
        oComponentContainer.getComponent = sandbox.stub().returns("someComponentId");

        sandbox.stub(Component, "getComponentById").withArgs("someComponentId").returns({
            getRootControl: sandbox.stub().returns(oFlexBox)
        });

        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Act
        this.oVizInstance.setContent(oComponentContainer);
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oGenericTile.getFocusDomRef().getAttribute("tabindex"), "-1", "the tabstop was removed");
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (ssb #2 tile)", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.m.FlexBox
        //         sap.ui.core.mvc.View
        //             sap.cloudfnd.smartbusiness.lib.reusetiles.Singleton
        //                 sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        var oSingleton = new VBox({ items: [ oGenericTile ] });
        var oSingletonIsA = sandbox.stub(oSingleton, "isA");
        oSingletonIsA.withArgs("sap.ui.core.Control").returns(true);
        oSingletonIsA.withArgs("sap.cloudfnd.smartbusiness.lib.reusetiles.Singleton").returns(true);
        oSingleton.getContent = sandbox.stub().returns(oGenericTile);

        var oView = new VBox({ items: [ oSingleton ] });
        var oViewIsA = sandbox.stub(oView, "isA");
        oViewIsA.withArgs("sap.ui.core.Control").returns(true);
        oViewIsA.withArgs("sap.ui.core.mvc.View").returns(true);
        oView.getContent = sandbox.stub().returns([ oSingleton ]);

        var oFlexBox = new VBox({ items: [ oView ] });

        var oComponentContainer = new VBox({ items: [ oFlexBox ] });
        var oComponentContainerIsA = sandbox.stub(oComponentContainer, "isA");
        oComponentContainerIsA.withArgs("sap.ui.core.Control").returns(true);
        oComponentContainerIsA.withArgs("sap.ui.core.ComponentContainer").returns(true);
        oComponentContainer.getComponent = sandbox.stub().returns("someComponentId");

        sandbox.stub(Component, "getComponentById").withArgs("someComponentId").returns({
            getRootControl: sandbox.stub().returns(oFlexBox)
        });

        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Act
        this.oVizInstance.setContent(oComponentContainer);
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oGenericTile.getFocusDomRef().getAttribute("tabindex"), "-1", "the tabstop was removed");
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (marketing #1 tile)", async function (assert) {
        // Structure:
        // sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Act
        this.oVizInstance.setContent(oGenericTile);
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oGenericTile.getFocusDomRef().getAttribute("tabindex"), "-1", "the tabstop was removed");
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.test("Removes the tabstop of various contents containing a generic Tile (marketing #2 tile)", async function (assert) {
        // Structure:
        // sap.m.VBox

        // Arrange
        var oContent = new VBox();

        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        sandbox.stub(this.oVizInstance, "_disableTabindexOfGenericTile");

        // Act
        this.oVizInstance.setContent(oContent);
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oVizInstance._disableTabindexOfGenericTile.callCount, 0, "no tabstop was removed as no generic tile in content");
        assert.strictEqual(this.oVizInstance.getDomRef().querySelectorAll("[tabindex='0']").length, 0, "all inner tabstops are removed");
    });

    QUnit.module("_openActionMenu", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance({ editable: true });
            this.oActionSheetOpenByStub = sandbox.stub(ActionSheet.prototype, "openBy");
            this._openNoActionsPopoverStub = sandbox.stub(this.oVizInstance, "_openNoActionsPopover");
            this.oFireBeforeActionSheetOpenStub = sandbox.stub(this.oVizInstance, "fireBeforeActionSheetOpen");
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oAddTileActionStub = sandbox.stub(this.oVizInstance, "addTileAction");
            this.oGetTileActionsStub = sandbox.stub(this.oVizInstance, "getTileActions").returns([]);
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Opens the tile action sheet", function (assert) {
        // Arrange
        this.oVizInstance.addTileAction(new Button());
        this.oVizInstance._getActionModeButtonIconVBox(); // Usually done by the renderer
        this.oGetTileActionsStub.returns({ text: "TEST_1", icon: "TEST_1", press: "TEST" });

        // Act
        this.oVizInstance._openActionMenu();

        // Assert
        assert.strictEqual(this.oActionSheetOpenByStub.callCount, 1, "The function openBy was called on the ActionSheet.");
        assert.strictEqual(this.oActionSheetOpenByStub.firstCall.args[0].getMetadata().getName(), "sap.ui.core.Icon", "The function openBy was called with the action mode icon as a parameter.");
        assert.strictEqual(this._openNoActionsPopoverStub.callCount, 0, "_openNoActionsPopover was not called");
    });

    QUnit.test("Calls fireBeforeActionSheetOpen", function (assert) {
        // Arrange
        this.oVizInstance._oActionModeIcon = {};

        // Act
        this.oVizInstance._openActionMenu();

        // Assert
        assert.strictEqual(this.oFireBeforeActionSheetOpenStub.callCount, 1, "fireBeforeActionSheetOpen was called once");
    });

    QUnit.test("Opens a popover when tile has no action", function (assert) {
        // Arrange
        this.oVizInstance._oActionModeIcon = {};

        // Act
        this.oVizInstance._openActionMenu();

        // Assert
        assert.strictEqual(this._openNoActionsPopoverStub.callCount, 1, "_openNoActionsPopover was called once");
        assert.strictEqual(this.oActionSheetOpenByStub.callCount, 0, "The function openBy was not called on the ActionSheet.");
    });

    QUnit.module("The method getFocusDomRef", {
        beforeEach: function () {
            this.oVBox = new VBox();
            this.oVizInstance = new VizInstance();
            this.oVizInstance.setContent(this.oVBox);
            this.oVizInstance.placeAt("qunit-fixture");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("VBox with a GenericTile inside", async function (assert) {
        // Structure:
        // sap.m.VBox
        //     sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        this.oVBox.addItem(oGenericTile);
        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The DOMRef of the GenericTile is returned.");
        assert.ok(oResult, "The focus DOMRef is not undefined or null.");
        assert.ok(oGenericTile.getDomRef(), "The DOMRef of the GenericTile is not undefined or null.");
    });

    QUnit.test("VBox with deeply nested GenericTile inside", async function (assert) {
        // Structure:
        // sap.m.VBox
        //     sap.m.VBox
        //         sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        this.oVBox.addItem(new VBox({
            items: [oGenericTile]
        }));
        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The DOMRef of the GenericTile is returned.");
        assert.ok(oResult, "The focus DOMRef is not undefined or null.");
        assert.ok(oGenericTile.getDomRef(), "The DOMRef of the GenericTile is not undefined or null.");
    });

    QUnit.test("VBox with a Card inside", async function (assert) {
        // Structure:
        // sap.m.VBox
        //     sap.f.Card

        // Arrange
        var oCard = new Card();

        this.oVBox.addItem(oCard);
        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oCard.getFocusDomRef(), "The DOMRef of the Card is returned.");
        assert.ok(oResult, "The focus DOMRef is not undefined or null.");
        assert.ok(oCard.getDomRef(), "The DOMRef of the Card is not undefined or null.");
    });

    QUnit.test("VBox with a SlideTile inside", async function (assert) {
        // Structure:
        // sap.m.VBox
        //     sap.m.SlideTile

        // Arrange
        var oSlideTile = new SlideTile();

        this.oVBox.addItem(oSlideTile);
        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, oSlideTile.getFocusDomRef(), "The DOMRef of the SlideTile is returned.");
        assert.ok(oResult, "The focus DOMRef is not undefined or null.");
        assert.ok(oSlideTile.getDomRef(), "The DOMRef of the SlideTile is not undefined or null.");
    });

    QUnit.test("VBox with nothing inside", async function (assert) {
        // Structure:
        // sap.m.VBox

        // Arrange
        await nextUIUpdate();

        // Act
         var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, this.oVBox.getFocusDomRef(), "The DOMRef of the VBox is returned.");
        assert.ok(oResult, "The focus DOMRef is not undefined or null.");
        assert.ok(this.oVBox.getDomRef(), "The DOMRef of the VBox is not undefined or null.");
    });

    QUnit.test("VBox with a GenericTile inside in edit mode", async function (assert) {
        // Structure:
        // sap.m.VBox
        //     sap.m.GenericTile (in edit mode)

        // Arrange
        var oGenericTile = new GenericTile();

        this.oVBox.addItem(oGenericTile);
        this.oVizInstance.addTileAction(new Button());
        this.oVizInstance.setEditable(true);
        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.strictEqual(oResult, this.oVizInstance._oActionModeIcon.getFocusDomRef(), "The DOMRef of the ActionDiv is returned.");
        assert.ok(oResult, "The focus DOMRef is not undefined or null.");
        assert.ok(oGenericTile.getDomRef(), "The DOMRef of the GenericTile is not undefined or null.");
    });

    QUnit.test("ComponentContainer with a GenericTile", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.UIComponent
        //         sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();

        const CustomUiComponent = UIComponent.extend("CustomUiComponent");
        sandbox.spy(CustomUiComponent.prototype, "findAggregatedObjects");
        CustomUiComponent.prototype.createContent = function () {
            return oGenericTile;
        };

        const oComponent = new CustomUiComponent();
        this.oVizInstance.setContent(new ComponentContainer({ component: oComponent }));

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The correct DomRef is returned.");
        assert.strictEqual(oComponent.findAggregatedObjects.callCount, 1, "findAggregatedObjects method has been called.");
    });

    QUnit.test("ComponentContainer with VBox containing a GenericTile", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.UIComponent
        //         sap.m.VBox
        //             sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();
        var oVBox = new VBox({ items: [ oGenericTile ] });

        const CustomUiComponent = UIComponent.extend("CustomUiComponent");
        sandbox.spy(CustomUiComponent.prototype, "findAggregatedObjects");
        CustomUiComponent.prototype.createContent = function () {
            return oVBox;
        };

        const oComponent = new CustomUiComponent();
        this.oVizInstance.setContent(new ComponentContainer({ component: oComponent }));

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The correct DomRef is returned.");
        assert.strictEqual(oComponent.findAggregatedObjects.callCount, 1, "findAggregatedObjects method has been called.");
    });

    QUnit.test("ComponentContainer with VBox containing a deeply nested GenericTile", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.UIComponent
        //         sap.m.VBox
        //             sap.m.VBox
        //                 sap.m.GenericTile

        // Arrange
        var oGenericTile = new GenericTile();
        var oVBox = new VBox({items: [new VBox({ items: [ oGenericTile ] })]});

        const CustomUiComponent = UIComponent.extend("CustomUiComponent");
        sandbox.spy(CustomUiComponent.prototype, "findAggregatedObjects");
        CustomUiComponent.prototype.createContent = function () {
            return oVBox;
        };

        const oComponent = new CustomUiComponent();
        this.oVizInstance.setContent(new ComponentContainer({ component: oComponent }));

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oGenericTile.getFocusDomRef(), "The correct DomRef is returned.");
        assert.strictEqual(oComponent.findAggregatedObjects.callCount, 1, "findAggregatedObjects method has been called.");
    });

    QUnit.test("ComponentContainer with VBox containing a Card", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.UIComponent
        //         sap.m.VBox
        //             sap.f.Card

        // Arrange
        var oCard = new Card();
        var oVBox = new VBox({ items: [ oCard ] });

        const CustomUiComponent = UIComponent.extend("CustomUiComponent");
        sandbox.spy(CustomUiComponent.prototype, "findAggregatedObjects");
        CustomUiComponent.prototype.createContent = function () {
            return oVBox;
        };

        const oComponent = new CustomUiComponent();
        this.oVizInstance.setContent(new ComponentContainer({ component: oComponent }));

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oCard.getFocusDomRef(), "The correct DomRef is returned.");
        assert.strictEqual(oComponent.findAggregatedObjects.callCount, 1, "findAggregatedObjects method has been called.");
    });

    QUnit.test("ComponentContainer with VBox containing a SlideTile", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.UIComponent
        //         sap.m.VBox
        //             sap.m.SlideTile

        // Arrange
        var oSlideTile = new SlideTile();
        var oVBox = new VBox({ items: [ oSlideTile ] });

        const CustomUiComponent = UIComponent.extend("CustomUiComponent");
        sandbox.spy(CustomUiComponent.prototype, "findAggregatedObjects");
        CustomUiComponent.prototype.createContent = function () {
            return oVBox;
        };

        const oComponent = new CustomUiComponent();
        this.oVizInstance.setContent(new ComponentContainer({ component: oComponent }));

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oSlideTile.getFocusDomRef(), "The correct DomRef is returned.");
        assert.strictEqual(oComponent.findAggregatedObjects.callCount, 1, "findAggregatedObjects method has been called.");
    });

    QUnit.test("ComponentContainer with empty VBox", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer
        //     sap.ui.core.UIComponent
        //         sap.m.VBox

        // Arrange
        var oVBox = new VBox();

        const CustomUiComponent = UIComponent.extend("CustomUiComponent");
        sandbox.spy(CustomUiComponent.prototype, "findAggregatedObjects");
        CustomUiComponent.prototype.createContent = function () {
            return oVBox;
        };

        const oComponent = new CustomUiComponent();
        const oComponentContainer = new ComponentContainer({ component: oComponent });
        this.oVizInstance.setContent(oComponentContainer);

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oComponentContainer.getFocusDomRef(), "The correct DomRef is returned.");
        assert.strictEqual(oComponent.findAggregatedObjects.callCount, 1, "findAggregatedObjects method has been called.");
    });

    QUnit.test("ComponentContainer with no component", async function (assert) {
        // Structure:
        // sap.ui.core.ComponentContainer

        // Arrange
        const oComponentContainer = new ComponentContainer();
        this.oVizInstance.setContent(oComponentContainer);

        await nextUIUpdate();

        // Act
        var oResult = this.oVizInstance.getFocusDomRef();

        // Assert
        assert.ok(oResult, "The FocusDomRef is not undefined.");
        assert.strictEqual(oResult, oComponentContainer.getFocusDomRef(), "The correct DomRef is returned.");
    });

    QUnit.module("The method onclick", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oPreventDefaultStub = sandbox.stub(this.oVizInstance, "_preventDefault");
            this.oFirePressStub = sandbox.stub(this.oVizInstance, "firePress");
            this.oGetEditableStub = sandbox.stub(this.oVizInstance, "getEditable");
            this.oOnActionMenuIconPressedStub = sandbox.stub(this.oVizInstance, "_openActionMenu");
            this.oContainsStub = sandbox.stub();
            this.oVizInstance._oRemoveIconVBox = new VBox();
            sandbox.stub(this.oVizInstance._oRemoveIconVBox, "getDomRef").returns({
                contains: this.oContainsStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("calls firePress when _preventDefault returns false and event target matches remove icon'", function (assert) {
        // Arrange
        this.oPreventDefaultStub.returns(false);
        var oMockEvent = {
            target: {
                id: "mock-action-remove"
            }
        };
        this.oContainsStub.withArgs(oMockEvent.target).returns(true);
        var aExpectedParams = [{
            scope: "Actions",
            action: "Remove"
        }];
        // Act
        this.oVizInstance.onclick(oMockEvent);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called exactly once");
        assert.deepEqual(this.oFirePressStub.getCall(0).args, aExpectedParams, "firePress was called with correct params");
    });

    QUnit.test("calls this._openActionMenu when _preventDefault returns false, event target does not match remove icon and in edit mode", function (assert) {
        // Arrange
        this.oPreventDefaultStub.returns(false);
        this.oGetEditableStub.returns(true);
        var oMockEvent = {
            target: {}
        };
        // Act
        this.oVizInstance.onclick(oMockEvent);
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "getEditable was called once");
        assert.strictEqual(this.oOnActionMenuIconPressedStub.callCount, 1, "_openActionMenu was called exactly once");
    });

    QUnit.test("calls fireClick when _preventDefault returns true", function (assert) {
        // Arrange
        this.oPreventDefaultStub.returns(true);
        var aExpectedParam = [
            {
                scope: "Display",
                action: "Press"
            }
        ];
        // Act
        this.oVizInstance.onclick();
        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called once");
        assert.deepEqual(this.oFirePressStub.getCall(0).args, aExpectedParam, "firePress was called with the correct parameter");
    });

    QUnit.module("The method onBeforeRendering", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oRemoveEventListenerStub = sandbox.stub();
            this.oGetDomRefStub = sandbox.stub(this.oVizInstance, "getDomRef").returns({
                removeEventListener: this.oRemoveEventListenerStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("removes event listeners when a DomRef is available", function (assert) {
        // Arrange
        var oSomeKeyupHandler = { keyup: "handler" },
            oSomeTouchendHandler = { touchend: "handler" };

        this.oVizInstance._fnKeyupHandler = oSomeKeyupHandler;
        this.oVizInstance._fnTouchendHandler = oSomeTouchendHandler;
        // Act
        this.oVizInstance.onBeforeRendering();
        // Assert
        assert.strictEqual(this.oGetDomRefStub.callCount, 1, "getDomRef was called exactly once");
        assert.strictEqual(this.oRemoveEventListenerStub.callCount, 2, "removeEventListener was called exactly twice");
        assert.deepEqual(this.oRemoveEventListenerStub.firstCall.args, ["keyup", oSomeKeyupHandler], "removeEventListener was called with the expected arguments the first time");
        assert.deepEqual(this.oRemoveEventListenerStub.secondCall.args, ["touchend", oSomeTouchendHandler], "removeEventListener was called with the expected arguments the second time");
    });

    QUnit.test("does not remove event listeners when no DomRef is available", function (assert) {
        // Arrange
        this.oGetDomRefStub.returns();
        // Act
        this.oVizInstance.onBeforeRendering();
        // Assert
        assert.strictEqual(this.oGetDomRefStub.callCount, 1, "getDomRef was called exactly once");
        assert.strictEqual(this.oRemoveEventListenerStub.callCount, 0, "removeEventListeners was not called");
    });

    QUnit.module("The method onAfterRendering", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oRemoveEventListenerStub = sandbox.stub();
            this.oAddEventListenerStub = sandbox.stub();
            this.oGetDomRefStub = sandbox.stub(this.oVizInstance, "getDomRef").returns({
                addEventListener: this.oAddEventListenerStub,
                removeEventListener: this.oRemoveEventListenerStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("binds event listeners for keyup and touchend events", function (assert) {
        // Arrange
        // Act
        this.oVizInstance.onAfterRendering();
        // Assert
        assert.strictEqual(this.oAddEventListenerStub.callCount, 2, "addEventListener was called exactly twice");
        assert.strictEqual(this.oAddEventListenerStub.firstCall.args[0], "keyup", "keyup event listener was added");
        assert.strictEqual(this.oAddEventListenerStub.firstCall.args[2], true, "event capturing was enabled for keyup events");
        assert.strictEqual(this.oAddEventListenerStub.secondCall.args[0], "touchend", "touchend event listener was added");
        assert.strictEqual(this.oAddEventListenerStub.secondCall.args[2], true, "event capturing was enabled for touchend events");
    });

    QUnit.test("changes the aria-description of the parent element", async function (assert) {
        // Arrange
        this.oGetDomRefStub.restore();
        var oQUnitFixture = document.getElementById("qunit-fixture");
        oQUnitFixture.removeAttribute("aria-description");

        // // Act
        this.oVizInstance.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oQUnitFixture.getAttribute("aria-description"), resources.i18n.getText("VizInstance.AriaDescription.Link"), "aria-description changed on parent as expected");
    });

    QUnit.module("The method onkeyup", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oFirePressStub = sandbox.stub(this.oVizInstance, "firePress");
            this.oPreventDefaultStub = sandbox.stub(this.oVizInstance, "_preventDefault");
            this.oGetEditableStub = sandbox.stub(this.oVizInstance, "getEditable");
            this.oSapdeleteFnCheckStub = sandbox.stub(PseudoEvents.events.sapdelete, "fnCheck");
            this.oSapbackspaceFnCheckStub = sandbox.stub(PseudoEvents.events.sapbackspace, "fnCheck");
            this.oSapspaceFnCheckStub = sandbox.stub(PseudoEvents.events.sapspace, "fnCheck");
            this.oSapenterFnCheckStub = sandbox.stub(PseudoEvents.events.sapenter, "fnCheck");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("does nothing when not in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(false);
        this.oSapdeleteFnCheckStub.returns(true);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "_preventDefault was not called");
    });

    QUnit.test("calls firePress when sapdelete event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(true);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "_preventDefault was not called");
    });

    QUnit.test("calls firePress when sapbackspace event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(false);
        this.oSapbackspaceFnCheckStub.returns(true);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 1, "firePress was called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "_preventDefault was not called");
    });

    QUnit.test("calls _preventDefault when sapspace event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(false);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(false);
        this.oSapspaceFnCheckStub.returns(true);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called");
    });

    QUnit.test("calls _preventDefault when sapenter event was detected and in edit mode", function (assert) {
        // Arrange
        this.oGetEditableStub.returns(true);
        this.oSapdeleteFnCheckStub.returns(false);
        this.oSapbackspaceFnCheckStub.returns(false);
        this.oSapenterFnCheckStub.returns(true);
        this.oSapspaceFnCheckStub.returns(false);

        // Act
        this.oVizInstance.onkeyup();

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oFirePressStub.callCount, 0, "firePress was not called");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "_preventDefault was called");
    });

    QUnit.module("_preventDefault", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oGetEditableStub = sandbox.stub(this.oVizInstance, "getEditable");
            this.oGetClickableStub = sandbox.stub(this.oVizInstance, "getClickable");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("calls the expected methods on the event object when in the edit mode", function (assert) {
        // Arrange
        var oMockEvent = {
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub()
        };
        this.oGetEditableStub.returns(true);

        // Act
        var bResult = this.oVizInstance._preventDefault(oMockEvent);

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(oMockEvent.preventDefault.callCount, 1, "preventDefault was called exactly once");
        assert.strictEqual(oMockEvent.stopPropagation.callCount, 1, "stopPropagation was called exactly once");
        assert.strictEqual(oMockEvent.stopImmediatePropagation.callCount, 1, "stopImmediatePropagation was called exactly once");
        assert.strictEqual(bResult, false, "false was returned as expected");
    });

    QUnit.test("does nothing and returns true when not in the edit mode, clickable true", function (assert) {
        // Arrange
        var oMockEvent = {
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub()
        };
        this.oGetEditableStub.returns(false);
        this.oGetClickableStub.returns(true);

        // Act
        var bResult = this.oVizInstance._preventDefault(oMockEvent);

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oGetClickableStub.callCount, 1, "getClickable was called exactly once");
        assert.strictEqual(oMockEvent.preventDefault.callCount, 0, "preventDefault was not called");
        assert.strictEqual(oMockEvent.stopPropagation.callCount, 0, "stopPropagation was not called");
        assert.strictEqual(oMockEvent.stopImmediatePropagation.callCount, 0, "stopImmediatePropagation was not called");
        assert.strictEqual(bResult, true, "true was returned as expected");
    });

    QUnit.test("calls the expected methods on the event object when not in the edit mode, clickable false", function (assert) {
        // Arrange
        var oMockEvent = {
            preventDefault: sandbox.stub(),
            stopPropagation: sandbox.stub(),
            stopImmediatePropagation: sandbox.stub()
        };
        this.oGetEditableStub.returns(false);
        this.oGetClickableStub.returns(false);

        // Act
        var bResult = this.oVizInstance._preventDefault(oMockEvent);

        // Assert
        assert.strictEqual(this.oGetEditableStub.callCount, 1, "getEditable was called exactly once");
        assert.strictEqual(this.oGetClickableStub.callCount, 1, "getClickable was called exactly once");
        assert.strictEqual(oMockEvent.preventDefault.callCount, 1, "preventDefault was called exactly once");
        assert.strictEqual(oMockEvent.stopPropagation.callCount, 1, "stopPropagation was called exactly once");
        assert.strictEqual(oMockEvent.stopImmediatePropagation.callCount, 1, "stopImmediatePropagation was called exactly once");
        assert.strictEqual(bResult, false, "false was returned as expected");
    });

    QUnit.module("The method load");

    QUnit.test("Returns a resolved Promise", function (assert) {
        //Arrange
        var oVizInstance = new VizInstance();

        //Act
        var oLoadPromise = oVizInstance.load();

        //Assert
        return oLoadPromise.then(function () {
            assert.ok(true, "a resolved Promise is returned");
            oVizInstance.destroy();
        });
    });

    QUnit.module("The _setSize function", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'flat'", function (assert) {
        // Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.Flat);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 2, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 1, "The height was set correctly");
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'flatWide'", function (assert) {
        // Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.FlatWide);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 4, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 1, "The height was set correctly");
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'standardWide'", function (assert) {
        // Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.StandardWide);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 4, "The width was set correctly");
        assert.strictEqual(this.oVizInstance.getHeight(), 2, "The height was set correctly");
    });

    QUnit.test("Sets the VizInstance's size correctly for the display format 'standard'", function (assert) {
        //Arrange
        this.oVizInstance.setDisplayFormat(DisplayFormat.Standard);

        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 2, "The width remains at the default value");
        assert.strictEqual(this.oVizInstance.getHeight(), 2, "The height remains at the default value");
    });

    QUnit.test("Sets the VizInstance's size correctly if there is no display format", function (assert) {
        //Act
        this.oVizInstance._setSize();

        //Assert
        assert.strictEqual(this.oVizInstance.getWidth(), 2, "The width remains at the default value");
        assert.strictEqual(this.oVizInstance.getHeight(), 2, "The height remains at the default value");
    });

    QUnit.module("UI5 lifecycle handling", {
        beforeEach: function () {
            this.oContent = new Control();

            this.oRegisterSpy = sandbox.spy(Control.prototype, "register");
            this.oDeregisterSpy = sandbox.spy(Control.prototype, "deregister");
        },
        afterEach: function (assert) {
            var oControl;
            for (var i = 0; i < this.oRegisterSpy.callCount; i++) {
                oControl = this.oRegisterSpy.getCall(i).thisValue;

                assert.ok(this.oDeregisterSpy.thisValues.includes(oControl), oControl.getId() + " has been destroyed.");
            }

            sandbox.restore();
            this.oContent.destroy();
        }
    });

    QUnit.test("Simple instantiation", function () {
        // Arrange
        var oVizInstance = new VizInstance();

        // Act
        oVizInstance.destroy();

        // Assert
        // Done in afterEach
    });

    QUnit.test("Action menu opening", function () {
        // Arrange
        sandbox.stub(ActionSheet.prototype, "openBy");
        var oVizInstance = new VizInstance({
            tileActions: [] // Empty!
        });

        oVizInstance._openActionMenu();

        // Act
        oVizInstance.destroy();

        // Assert
        // Done in afterEach
    });

    QUnit.test("Edit mode related controls", function (assert) {
        // Arrange
        var oVizInstance = new VizInstance();
        // Act
        oVizInstance._getActionModeButtonIconVBox();
        oVizInstance._getRemoveIconVBox();
        oVizInstance.destroy();
        // Assert
        // Done in afterEach
    });

    QUnit.module("The function _getTileActionSheet", {
        beforeEach: function () {
            // We need to temporarily stub _getTileActionSheet because it is called by the UI5 lifecycle
            // as soon as the control is created.
            var oGetTileActionSheetStub = sandbox.stub(VizInstance.prototype, "_getTileActionSheet");
            this.oVizInstance = new VizInstance();
            oGetTileActionSheetStub.restore();
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns a new sap.m.ActionSheet instance if it wasn't yet created", function (assert) {
        // Act
        var oActionSheet = this.oVizInstance._getTileActionSheet();

        // Assert
        assert.ok(oActionSheet.isA("sap.m.ActionSheet"), "The function returns a new sap.m.ActionSheet instance.");
    });

    QUnit.test("Returns the existent sap.m.ActionSheet instance if it was already created", function (assert) {
        // Act
        var oActionSheetMock = {
            id: "actionSheet-1",
            destroy: function () { }
        };

        this.oVizInstance._oActionSheet = oActionSheetMock;
        var oActionSheet = this.oVizInstance._getTileActionSheet();

        // Assert
        assert.strictEqual(oActionSheet.id, "actionSheet-1", "The function doesn't create a new sap.m.ActionSheet if it was already instantiated.");
    });

    QUnit.module("The function getAvailableDisplayFormats", {
        beforeEach: function () {
            this.oTestVizData = {
                title: "tests",
                targetURL: "test",
                supportedDisplayFormats: [DisplayFormat.Standard, DisplayFormat.Flat, DisplayFormat.FlatWide, DisplayFormat.Compact]
            };
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("returns the available display formats", function (assert) {
        // Arrange
        this.oVizInstance = new VizInstance(this.oTestVizData);
        var aExpectedDisplayFormats = [
            DisplayFormat.Flat,
            DisplayFormat.FlatWide,
            DisplayFormat.Compact
        ];

        // Act
        var aAvailableDisplayFormats = this.oVizInstance.getAvailableDisplayFormats();

        // Assert
        assert.deepEqual(aAvailableDisplayFormats, aExpectedDisplayFormats, "The method returned the correct array of available display formats");
    });

    QUnit.test("returns display formats and eliminates compact if the viz doesn't contain a title ", function (assert) {
        // Arrange
        delete this.oTestVizData.title;
        this.oVizInstance = new VizInstance(this.oTestVizData);
        var aExpectedDisplayFormats = [
            DisplayFormat.Flat,
            DisplayFormat.FlatWide
        ];

        // Act
        var aAvailableDisplayFormats = this.oVizInstance.getAvailableDisplayFormats();

        // Assert
        assert.deepEqual(aAvailableDisplayFormats, aExpectedDisplayFormats, "The method returned the correct array of available display formats");
    });

    QUnit.module("_formatPlaceholderFrameType", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance({});
            sandbox.stub(this.oVizInstance, "_setSize");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns correct frameType if displayFormatHint=Flat", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(DisplayFormat.Flat);
        // Assert
        assert.strictEqual(sResult, FrameType.OneByHalf, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=FlatWide", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(DisplayFormat.FlatWide);
        // Assert
        assert.strictEqual(sResult, FrameType.TwoByHalf, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=StandardWide", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType(DisplayFormat.StandardWide);
        // Assert
        assert.strictEqual(sResult, FrameType.TwoByOne, "Returned the correct result");
    });

    QUnit.test("Returns correct frameType if displayFormatHint=undefined", function (assert) {
        // Arrange
        // Act
        var sResult = this.oVizInstance._formatPlaceholderFrameType();
        // Assert
        assert.strictEqual(sResult, FrameType.OneByOne, "Returned the correct result");
    });

    QUnit.test("Sets the vizInstance's grid size", function (assert) {
        // Arrange
        //Act
        this.oVizInstance._formatPlaceholderFrameType();

        //Assert
        assert.strictEqual(this.oVizInstance._setSize.callCount, 1, "The grid size was set");
    });

    QUnit.module("_getRemoveIconVBox", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oGetLibraryResourceBundleGetTextStub = sandbox.stub();
            sandbox.stub(Library, "getResourceBundleFor").returns({
                getText: this.oGetLibraryResourceBundleGetTextStub
            });
        },
        afterEach: function () {
            this.oVizInstance.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns a new VBox containing a new Icon if it was not created yet and sets the expected properties and style classes", function (assert) {
        // Arrange
        var oResult;
        var sGetTextResponse = "Some test text";
        this.oGetLibraryResourceBundleGetTextStub.returns(sGetTextResponse);
        // Act
        oResult = this.oVizInstance._getRemoveIconVBox();
        // Assert
        assert.strictEqual(this.oGetLibraryResourceBundleGetTextStub.callCount, 1, "The correct resource bundle was called once");
        assert.strictEqual(this.oGetLibraryResourceBundleGetTextStub.getCall(0).args[0], "GENERICTILE_ACTIONS_ARIA_TEXT", "The correct text was obtained from the resource bundle");
        assert.ok(oResult.isA("sap.m.VBox"), "The returned control is a VBox");
        // VBox
        assert.strictEqual(oResult.getItems().length, 1, "The returned VBox contains exactly one item");
        assert.ok(oResult.hasStyleClass("sapUshellTileDeleteIconOuterClass"), "The VBox has the class \"sapUshellTileDeleteIconOuterClass\"");
        assert.ok(oResult.hasStyleClass("sapUshellTileDeleteClickArea"), "The VBox has the class \"sapUshellTileDeleteClickArea\"");
        assert.ok(oResult.hasStyleClass("sapMPointer"), "The VBox has the class \"sapMPointer\"");
        // Icon
        assert.ok(oResult.getItems()[0].isA("sap.ui.core.Icon"), "The returned VBox contains an Icon");
        assert.ok(oResult.getItems()[0].hasStyleClass("sapUshellTileDeleteIconInnerClass"), "The Icon has the class \"sapUshellTileDeleteIconInnerClass\"");
        assert.ok(oResult.getItems()[0].hasStyleClass("sapMPointer"), "The Icon has the class \"sapMPointer\"");
        assert.strictEqual(oResult.getItems()[0].getAlt(), sGetTextResponse, "The Icon has the correct alt property");
        assert.strictEqual(oResult.getItems()[0].getDecorative(), false, "The Icon has the correct decorative property");
        assert.strictEqual(oResult.getItems()[0].getNoTabStop(), true, "The Icon has the correct noTabStop property");
        assert.strictEqual(oResult.getItems()[0].getSrc(), "sap-icon://decline", "The Icon has the correct src property");
        assert.strictEqual(oResult.getItems()[0].getTooltip(), resources.i18n.getText("removeButtonTitle"), "The Icon has the correct tooltip aggregation");
        assert.strictEqual(oResult.getParent(), this.oVizInstance, "The correct parent was set");
    });

    QUnit.test("Returns the same VBox if it was already created", function (assert) {
        // Arrange
        var oResultFirstCall,
            oResultSecondCall;
        // Act
        oResultFirstCall = this.oVizInstance._getRemoveIconVBox();
        oResultSecondCall = this.oVizInstance._getRemoveIconVBox();
        // Assert
        assert.strictEqual(oResultFirstCall, oResultSecondCall, "The same VBox was returned on the second call");
        assert.strictEqual(this.oGetLibraryResourceBundleGetTextStub.callCount, 1, "The getText method of the resource bundle was called only once");
    });

    QUnit.module("_getActionModeButtonIconVBox", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oGetLibraryResourceBundleGetTextStub = sandbox.stub();
            sandbox.stub(Library, "getResourceBundleFor").returns({
                getText: this.oGetLibraryResourceBundleGetTextStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("Returns a new VBox containing a new Icon if it was not created yet and sets the expected properties and style classes ", function (assert) {
        // Arrange
        var oResult,
            sGetTextResponse = "Some test text";

        this.oGetLibraryResourceBundleGetTextStub.returns(sGetTextResponse);
        // Act
        oResult = this.oVizInstance._getActionModeButtonIconVBox();
        // Assert
        assert.strictEqual(this.oGetLibraryResourceBundleGetTextStub.callCount, 1, "The correct resource bundle was called once");
        assert.strictEqual(this.oGetLibraryResourceBundleGetTextStub.getCall(0).args[0], "LIST_ITEM_NAVIGATION", "The correct text was obtained from the resource bundle");
        // VBox
        assert.ok(oResult.isA("sap.m.VBox"), "The returned control is a sap.m.VBox");
        assert.ok(oResult.hasStyleClass("sapUshellTileActionIconDivBottom"), "The VBox has the class \"sapUshellTileActionIconDivBottom\"");
        assert.ok(oResult.hasStyleClass("sapMPointer"), "The VBox has the class \"sapMPointer\"");
        assert.strictEqual(oResult.getItems().length, 1, "The VBox has one item");
        // Icon
        assert.ok(oResult.getItems()[0].isA("sap.ui.core.Icon"), "The item of the VBox is a sap.ui.core.Icon");
        assert.ok(oResult.getItems()[0].hasStyleClass("sapUshellTileActionIconDivBottomInner"), "The Icon has the class \"sapUshellTileActionIconDivBottomInner\"");
        assert.ok(oResult.getItems()[0].hasStyleClass("sapMPointer"), "The Icon has the class \"sapMPointer\"");
        assert.strictEqual(oResult.getItems()[0].getAlt(), sGetTextResponse, "The Icon has the correct alt property");
        assert.strictEqual(oResult.getItems()[0].getDecorative(), false, "The Icon has the correct decorative property");
        assert.strictEqual(oResult.getItems()[0].getNoTabStop(), true, "The Icon has the correct noTabStop property");
        assert.strictEqual(oResult.getItems()[0].getSrc(), "sap-icon://overflow", "The Icon has the correct src property");
        assert.strictEqual(oResult.getItems()[0].getTooltip(), resources.i18n.getText("configuration.category.tile_actions"), "The Icon has the correct tooltip aggregation");
        assert.strictEqual(oResult.getParent(), this.oVizInstance, "The correct parent was set");
    });

    QUnit.test("Returns the same VBox if it was already created", function (assert) {
        // Arrange
        var oResultFirstCall,
            oResultSecondCall;
        // Act
        oResultFirstCall = this.oVizInstance._getActionModeButtonIconVBox();
        oResultSecondCall = this.oVizInstance._getActionModeButtonIconVBox();
        // Assert
        assert.strictEqual(oResultFirstCall, oResultSecondCall, "The same VBox was returned on the second call");
        assert.strictEqual(this.oGetLibraryResourceBundleGetTextStub.callCount, 1, "The getText method of the resource bundle was called only once");
    });

    QUnit.module("The function setEditable", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oContentMock = new GenericTile();
            this.oSetScopeStub = sandbox.stub(this.oContentMock, "setScope");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("sets the editable property", function (assert) {
        // Arrange
        this.oVizInstance.setEditable(true);

        // Assert
        assert.strictEqual(this.oVizInstance.getEditable(), true, "The VizInstance was set to editable");

        // Arrange
        this.oVizInstance.setEditable(false);

        //Assert
        assert.strictEqual(this.oVizInstance.getEditable(), false, "The VizInstance was set to non-editable");
    });

    QUnit.test("sets the scope property if the content is a GenericTile", function (assert) {
        // Arrange
        this.oVizInstance.setContent(this.oContentMock);

        // Act
        this.oVizInstance.setEditable(true);
        // Assert
        assert.ok(this.oSetScopeStub.calledWith(GenericTileScope.ActionMore), "setScope was called with the expected scope");

        // Act
        this.oVizInstance.setEditable(false);
        // Assert
        assert.ok(this.oSetScopeStub.calledWith(GenericTileScope.Display), "setScope was called with the expected scope");
    });

    QUnit.module("The function setSizeBehavior", {
        beforeEach: function () {
            this.oVizInstance = new VizInstance();
            this.oContentMock = new GenericTile();
            this.oSetSizeBehaviorStub = sandbox.stub(this.oContentMock, "setSizeBehavior");
        },
        afterEach: function () {
            sandbox.restore();
            this.oVizInstance.destroy();
        }
    });

    QUnit.test("sets the sizeBehavior property", function (assert) {
        // Assert
        assert.strictEqual(this.oVizInstance.getSizeBehavior(), undefined, "The TileSizeBehavior was initially undefined.");

        // Arrange
        this.oVizInstance.setSizeBehavior(TileSizeBehavior.Small);

        // Assert
        assert.strictEqual(this.oVizInstance.getSizeBehavior(), TileSizeBehavior.Small, "The TileSizeBehavior was set to Small");

        // Arrange
        this.oVizInstance.setSizeBehavior(TileSizeBehavior.Responsive);

        //Assert
        assert.strictEqual(this.oVizInstance.getSizeBehavior(), TileSizeBehavior.Responsive, "The TileSizeBehavior was set to Responsive");
    });

    QUnit.test("sets the sizeBehavior property if the content is a GenericTile", function (assert) {
        // Arrange
        this.oVizInstance.setContent(this.oContentMock);

        // Act
        this.oVizInstance.setSizeBehavior(TileSizeBehavior.Small);
        // Assert
        assert.ok(this.oSetSizeBehaviorStub.calledWith(TileSizeBehavior.Small), "setScope was called with the expected scope");

        // Act
        this.oVizInstance.setSizeBehavior(TileSizeBehavior.Responsive);
        // Assert
        assert.ok(this.oSetSizeBehaviorStub.calledWith(TileSizeBehavior.Responsive), "setScope was called with the expected scope");
    });
});
