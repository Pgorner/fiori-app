// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.ExtendedChangeDetection
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/ExtendedChangeDetection",
    "sap/ui/core/Control",
    "sap/m/FlexBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/json/JSONListBinding",
    "sap/ui/base/ManagedObject",
    "sap/ushell/Config",
    "sap/ushell/library",
    "sap/ushell/ui/launchpad/Section"
], function (
    ExtendedChangeDetection,
    Control,
    FlexBox,
    JSONModel,
    JSONListBinding,
    ManagedObject,
    Config,
    ushellLibrary,
    Section
) {
    "use strict";

    // shortcut for sap.ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The ExtendedChangeDetection constructor", {
        beforeEach: function () {
            this.oAggregation = {
                _sUpdater: "_updateMyAggregation___YAY"
            };

            this.oGetAggregationStub = sandbox.stub().withArgs("aggregationName").returns(this.oAggregation);

            var oMetadata = {
                getAggregation: this.oGetAggregationStub
            };

            this.oControl = {
                getMetadata: sandbox.stub().returns(oMetadata)
            };

            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Initializes the static sibling refresh cache", function (assert) {
        // Arrange
        this.oConfigLastStub.returns(false);

        // Assert
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, {}, "Correctly initialized the cache");
    });

    QUnit.test("Sets internal fields", function (assert) {
        // Arrange
        var aExpectedEvents = ["itemDeleted", "itemAdded", "itemsReordered"];
        // Act
        var oECD = new ExtendedChangeDetection("aggregationName", this.oControl, ["siblingA", "siblingB"]);

        // Assert
        assert.ok(oECD instanceof ManagedObject, "The correct base class was set.");
        assert.deepEqual(Object.keys(oECD.getMetadata().getEvents()), aExpectedEvents, "The correct events has been found");
        assert.strictEqual(oECD._oControl, this.oControl, "The correct reference has been found.");
        assert.strictEqual(oECD._sAggregationName, "aggregationName", "The correct text has been found.");
        assert.deepEqual(oECD._aSiblingAggregationNames, ["siblingA", "siblingB"], "The correct sibling aggregations have been found.");

        //Cleanup
        oECD.destroy();
    });

    QUnit.test("Retrieves the correct aggregation object", function (assert) {
        // Arrange
        // Act
        var oECD = new ExtendedChangeDetection("aggregationName", this.oControl);

        // Assert
        assert.strictEqual(typeof this.oControl._updateMyAggregation___YAY, "function", "The aggregation updater has been correctly overwritten.");
        assert.strictEqual(oECD._oAggregation, this.oAggregation, "The aggregation has been correctly saved.");

        //Cleanup
        oECD.destroy();
    });

    QUnit.test("Enables extended change detection on the given control", function (assert) {
        // Arrange
        // Act
        var oECD = new ExtendedChangeDetection("aggregationName", this.oControl);

        // Assert
        assert.strictEqual(this.oControl.bUseExtendedChangeDetection, true, "The correct value has been found.");

        //Cleanup
        oECD.destroy();
    });

    QUnit.test("Does not enable the extended change detection if it is disabled by config", function (assert) {
        // Arrange
        this.oConfigLastStub.returns(false);

        // Act
        var oECD = new ExtendedChangeDetection("aggregationName", this.oControl);

        // Assert
        assert.strictEqual(this.oControl.bUseExtendedChangeDetection, undefined, "The correct value has been found.");
        assert.strictEqual(this.oControl._updateMyAggregation___YAY, undefined, "The aggregation updater has not been set.");

        //Cleanup
        oECD.destroy();
    });

    QUnit.module("Integration test", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);
            this.oModel = new JSONModel();

            this.oControl = new FlexBox({
                items: {
                    path: "/",
                    key: "id",
                    factory: function () {
                        return new Control();
                    }
                }
            });
            this.oControl.bUseExtendedChangeDetection = true;
            this.oControl.setModel(this.oModel);
            this.oECD = new ExtendedChangeDetection("items", this.oControl);
        },
        afterEach: function () {
            this.oECD.destroy();
            this.oControl.destroy();
            this.oModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Scenario: Initial data", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];
        this.oFireItemDeletedStub = sandbox.stub(this.oECD, "fireItemDeleted");
        this.oFireItemAddedStub = sandbox.stub(this.oECD, "fireItemAdded");
        this.oFireItemsReorderedStub = sandbox.stub(this.oECD, "fireItemsReordered");

        // Act
        this.oModel.setData(oData);

        // Assert
        assert.strictEqual(this.oFireItemDeletedStub.callCount, 0, "fireItemDeleted was not called");
        assert.strictEqual(this.oFireItemAddedStub.callCount, 1, "fireItemAdded was called once");
        assert.strictEqual(this.oFireItemsReorderedStub.callCount, 0, "fireItemsReordered was called");
    });

    QUnit.test("Scenario: Move to beginning", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];

        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        this.oFireItemDeletedStub = sandbox.stub(this.oECD, "fireItemDeleted");
        this.oFireItemAddedStub = sandbox.stub(this.oECD, "fireItemAdded");
        this.oFireItemsReorderedStub = sandbox.stub(this.oECD, "fireItemsReordered");

        // Act
        this.oModel.setData([
            { id: "viz3" },
            { id: "viz1" },
            { id: "viz2" }
        ]);

        // Assert
        var aItemsAfter = this.oControl.getItems();
        var aContexts = aItemsAfter.map(function (oItem) {
            return oItem.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz3", "viz1", "viz2"], "The correct IDs have been found.");
        assert.strictEqual(aItemsAfter[0], aItemsBefore[2], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[1], aItemsBefore[0], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[2], aItemsBefore[1], "The correct reference has been found.");

        assert.strictEqual(this.oFireItemDeletedStub.callCount, 0, "fireItemDeleted was not called");
        assert.strictEqual(this.oFireItemAddedStub.callCount, 0, "fireItemAdded was not called");
        assert.strictEqual(this.oFireItemsReorderedStub.callCount, 1, "fireItemsReordered was called once");
    });

    QUnit.test("Scenario: Move to middle", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];

        // Act
        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        this.oModel.setData([
            { id: "viz2" },
            { id: "viz1" },
            { id: "viz3" }
        ]);

        // Assert
        var aItemsAfter = this.oControl.getItems();
        var aContexts = aItemsAfter.map(function (oItem) {
            return oItem.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz2", "viz1", "viz3"], "The correct IDs have been found.");
        assert.strictEqual(aItemsAfter[0], aItemsBefore[1], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[1], aItemsBefore[0], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[2], aItemsBefore[2], "The correct reference has been found.");
    });

    QUnit.test("Scenario: Move to end", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];

        // Act
        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        this.oModel.setData([
            { id: "viz2" },
            { id: "viz3" },
            { id: "viz1" }
        ]);

        // Assert
        var aItemsAfter = this.oControl.getItems();
        var aContexts = aItemsAfter.map(function (oItem) {
            return oItem.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz2", "viz3", "viz1"], "The correct IDs have been found.");
        assert.strictEqual(aItemsAfter[0], aItemsBefore[1], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[1], aItemsBefore[2], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[2], aItemsBefore[0], "The correct reference has been found.");
    });

    QUnit.test("Scenario: Remove the last item", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" }
        ];

        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        var oItemToBeDeleted = aItemsBefore[0];

        this.oInvalidateSpy = sandbox.spy(this.oControl, "invalidate");
        this.oFireItemDeletedStub = sandbox.stub(this.oECD, "fireItemDeleted");
        this.oFireItemAddedStub = sandbox.stub(this.oECD, "fireItemAdded");
        this.oFireItemsReorderedStub = sandbox.stub(this.oECD, "fireItemsReordered");

        // Act
        this.oModel.setData([]);

        // Assert
        var aItemsAfter = this.oControl.getItems();

        assert.strictEqual(aItemsAfter.length, 0, "The array has the correct length after moving an item out.");
        assert.strictEqual(oItemToBeDeleted.bIsDestroyed, true, "The item was deleted");
        assert.strictEqual(this.oInvalidateSpy.callCount, 1, "Invalidate was called once");

        assert.strictEqual(this.oFireItemDeletedStub.callCount, 1, "fireItemDeleted was called once");
        assert.strictEqual(this.oFireItemAddedStub.callCount, 0, "fireItemAdded was not called");
        assert.strictEqual(this.oFireItemsReorderedStub.callCount, 0, "fireItemsReordered was not called");
    });

    QUnit.test("Scenario: Remove an item and get double delete diff", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];

        var aDiff = [
            { index: 1, type: "delete" },
            { index: 1, type: "delete" },
            { index: 1, type: "insert" }
        ];

        sandbox.stub(JSONListBinding.prototype, "diffData").returns(aDiff);

        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        var oItemToBeDeleted = aItemsBefore[2];

        this.oInvalidateSpy = sandbox.spy(this.oControl, "invalidate");

        // Act
        this.oModel.setData([
            { id: "viz1" },
            { id: "viz2" }
        ]);

        // Assert
        var aItemsAfter = this.oControl.getItems();

        assert.strictEqual(aItemsAfter.length, 2, "The array has the correct length after moving an item out.");
        assert.strictEqual(oItemToBeDeleted.bIsDestroyed, true, "The item was deleted");
    });

    QUnit.test("Scenario: Move an item in", function (assert) {
        // Arrange
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];

        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        this.oFireItemDeletedStub = sandbox.stub(this.oECD, "fireItemDeleted");
        this.oFireItemAddedStub = sandbox.stub(this.oECD, "fireItemAdded");
        this.oFireItemsReorderedStub = sandbox.stub(this.oECD, "fireItemsReordered");

        // Act
        this.oModel.setData([
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" },
            { id: "viz4" }
        ]);

        // Assert
        var aItemsAfter = this.oControl.getItems();
        var aContexts = aItemsAfter.map(function (oItem) {
            return oItem.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz1", "viz2", "viz3", "viz4"], "The correct IDs have been found.");
        assert.strictEqual(aItemsAfter[0], aItemsBefore[0], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[1], aItemsBefore[1], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[2], aItemsBefore[2], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter.length, 4, "The array has the correct length after moving an item in.");
        assert.strictEqual(aItemsAfter[3].isA("sap.ui.core.Control"), true, "The newly added item is a control");

        assert.strictEqual(this.oFireItemDeletedStub.callCount, 0, "fireItemDeleted was not called");
        assert.strictEqual(this.oFireItemAddedStub.callCount, 1, "fireItemAdded was called once");
        assert.strictEqual(this.oFireItemsReorderedStub.callCount, 0, "fireItemsReordered was not called");
    });

    QUnit.test("Scenario: Move to beginning if aggregation binding uses a template", function (assert) {
        // Arrange
        this.oControl = new FlexBox({
            items: {
                path: "/",
                key: "id",
                template: new Control()
            }
        });
        this.oControl.bUseExtendedChangeDetection = true;
        this.oControl.setModel(this.oModel);
        this.oECD = new ExtendedChangeDetection("items", this.oControl);
        var oData = [
            { id: "viz1" },
            { id: "viz2" },
            { id: "viz3" }
        ];

        // Act
        this.oModel.setData(oData);
        var aItemsBefore = this.oControl.getItems();

        this.oModel.setData([
            { id: "viz3" },
            { id: "viz1" },
            { id: "viz2" }
        ]);

        // Assert
        var aItemsAfter = this.oControl.getItems();
        var aContexts = aItemsAfter.map(function (oItem) {
            return oItem.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz3", "viz1", "viz2"], "The correct IDs have been found.");
        assert.strictEqual(aItemsAfter[0], aItemsBefore[2], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[1], aItemsBefore[0], "The correct reference has been found.");
        assert.strictEqual(aItemsAfter[2], aItemsBefore[1], "The correct reference has been found.");
    });

    QUnit.module("Sibling Integration Test", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);
            this.oModel = new JSONModel();

            this.oUpdateAggregationSpy = sandbox.spy(ExtendedChangeDetection.prototype, "_updateAggregation");
            this.oRefreshSiblingBindingsSpy = sandbox.spy(ExtendedChangeDetection.prototype, "_refreshSiblingBindings");

            this.fnFactoryStub = sandbox.stub().callsFake(function () {
                return new Control();
            });

            this.oSection = new Section({
                visualizations: {
                    path: "/",
                    key: "id",
                    factory: this.fnFactoryStub
                }
            });
            this.oSection.setModel(this.oModel);
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Scenario: Move to beginning if aggregation has sibling aggregations", function (assert) {
        // Arrange
        this.oModel.setData([
            { id: "viz1", displayFormatHint: DisplayFormat.Standard },
            { id: "viz2", displayFormatHint: DisplayFormat.Compact },
            { id: "viz3", displayFormatHint: DisplayFormat.Compact },
            { id: "viz4", displayFormatHint: DisplayFormat.Standard }
        ]);

        var aVizBefore = this.oSection.getVisualizations();

        // Act
        this.oModel.setData([
            { id: "viz4", displayFormatHint: DisplayFormat.Standard },
            { id: "viz1", displayFormatHint: DisplayFormat.Standard },
            { id: "viz2", displayFormatHint: DisplayFormat.Compact },
            { id: "viz3", displayFormatHint: DisplayFormat.Compact }
        ]);

        // Assert
        var aVizAfter = this.oSection.getVisualizations();
        var aContexts = aVizAfter.map(function (oViz) {
            return oViz.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz4", "viz1", "viz2", "viz3"], "The correct IDs have been found.");
        assert.strictEqual(aVizAfter[0], aVizBefore[3], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[1], aVizBefore[0], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[2], aVizBefore[1], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[3], aVizBefore[2], "The correct reference has been found.");

        assert.strictEqual(this.fnFactoryStub.callCount, 4, "factory was called 4 times");
        // 3x constructor, 3x 1st setData, 1x 2nd setData, 2x _refreshSiblingBindings
        assert.strictEqual(this.oUpdateAggregationSpy.callCount, 9, "update was called 9 times");
        assert.strictEqual(this.oRefreshSiblingBindingsSpy.callCount, 1, "_refreshSiblingBindings was called once");
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, {}, "cache is empty");
    });

    QUnit.test("Scenario: Move to end if aggregation has sibling aggregations", function (assert) {
        // Arrange
        this.oModel.setData([
            { id: "viz1", displayFormatHint: DisplayFormat.Standard },
            { id: "viz2", displayFormatHint: DisplayFormat.Compact },
            { id: "viz3", displayFormatHint: DisplayFormat.Compact },
            { id: "viz4", displayFormatHint: DisplayFormat.Standard }
        ]);

        var aVizBefore = this.oSection.getVisualizations();

        // Act
        this.oModel.setData([
            { id: "viz2", displayFormatHint: DisplayFormat.Compact },
            { id: "viz3", displayFormatHint: DisplayFormat.Compact },
            { id: "viz4", displayFormatHint: DisplayFormat.Standard },
            { id: "viz1", displayFormatHint: DisplayFormat.Standard }
        ]);

        // Assert
        var aVizAfter = this.oSection.getVisualizations();
        var aContexts = aVizAfter.map(function (oViz) {
            return oViz.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz2", "viz3", "viz4", "viz1"], "The correct IDs have been found.");
        assert.strictEqual(aVizAfter[0], aVizBefore[1], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[1], aVizBefore[2], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[2], aVizBefore[3], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[3], aVizBefore[0], "The correct reference has been found.");

        assert.strictEqual(this.fnFactoryStub.callCount, 4, "factory was called 4 times");
        // 3x constructor, 3x 1st setData, 1x 2nd setData, 2x _refreshSiblingBindings
        assert.strictEqual(this.oUpdateAggregationSpy.callCount, 9, "update was called 9 times");
        assert.strictEqual(this.oRefreshSiblingBindingsSpy.callCount, 1, "_refreshSiblingBindings was called once");
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, {}, "cache is empty");
    });

    QUnit.test("Scenario: Convert last item to different aggregation", function (assert) {
        // Arrange
        this.oModel.setData([
            { id: "viz1", displayFormatHint: DisplayFormat.Standard },
            { id: "viz2", displayFormatHint: DisplayFormat.Compact },
            { id: "viz3", displayFormatHint: DisplayFormat.Compact },
            { id: "viz4", displayFormatHint: DisplayFormat.Standard }
        ]);

        var aVizBefore = this.oSection.getVisualizations();

        // Act
        this.oModel.setData([
            { id: "viz1", displayFormatHint: DisplayFormat.Standard },
            { id: "viz2", displayFormatHint: DisplayFormat.Compact },
            { id: "viz3", displayFormatHint: DisplayFormat.Compact },
            { id: "viz4", displayFormatHint: DisplayFormat.Flat }
        ]);

        // Assert
        var aVizAfter = this.oSection.getVisualizations();
        var aContexts = aVizAfter.map(function (oViz) {
            return oViz.getBindingContext().getProperty("id");
        });

        assert.deepEqual(aContexts, ["viz1", "viz2", "viz3", "viz4"], "The correct IDs have been found.");
        assert.strictEqual(aVizAfter[0], aVizBefore[0], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[1], aVizBefore[1], "The correct reference has been found.");
        assert.strictEqual(aVizAfter[2], aVizBefore[2], "The correct reference has been found.");
        assert.notStrictEqual(aVizAfter[3], aVizBefore[3], "The correct reference has been found.");

        assert.strictEqual(this.fnFactoryStub.callCount, 5, "factory was called 5 times");
        // 3x constructor, 3x 1st setData, 1x 2nd setData, 2x _refreshSiblingBindings
        assert.strictEqual(this.oUpdateAggregationSpy.callCount, 9, "update was called 9 times");
        assert.strictEqual(this.oRefreshSiblingBindingsSpy.callCount, 1, "_refreshSiblingBindings was called once");
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, {}, "cache is empty");
    });

    QUnit.module("The function _updateAggregation", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);
            this.oModel = new JSONModel();

            this.oControl = new FlexBox({
                items: {
                    path: "/",
                    key: "id",
                    factory: function () {
                        return new Control();
                    }
                }
            });
            this.oControl.bUseExtendedChangeDetection = true;
            this.oControl.setModel(this.oModel);
            this.oECD = new ExtendedChangeDetection("items", this.oControl);

            sandbox.stub(this.oControl, "removeAggregation")
                .returns({
                    destroy: sandbox.stub()
                });
            this.oInsertAggregationStub = sandbox.stub(this.oControl, "insertAggregation");
            this.oCreateAndInsertItemStub = sandbox.stub(this.oECD, "_createAndInsertItem");
        },
        afterEach: function () {
            this.oECD.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("does trigger recreation of a visualization when it changed the displayFormatHint from flat to flatWide", function (assert) {
        // Arrange
        this.oModel.setData([
            { id: "viz2", displayFormatHint: "flat" },
            { id: "viz1", displayFormatHint: "flat" },
            { id: "viz3", displayFormatHint: "flat" }
        ]);

        // Act
        this.oModel.setData([
            { id: "viz2", displayFormatHint: "flatWide" },
            { id: "viz1", displayFormatHint: "flat" },
            { id: "viz3", displayFormatHint: "flat" }
        ]);

        // Assert
        assert.strictEqual(this.oCreateAndInsertItemStub.getCall(3).args[0].sPath, "/0", "The visualization was recreated.");
        assert.strictEqual(this.oInsertAggregationStub.callCount, 0, "No aggregation was updated.");
    });

    QUnit.test("does not trigger recreation of a visualization when it moved inside one content area", function (assert) {
        // Arrange
        this.oModel.setData([
            { id: "viz1", displayFormatHint: "flat" },
            { id: "viz2", displayFormatHint: "flat" },
            { id: "viz3", displayFormatHint: "flat" }
        ]);

        // Act
        this.oModel.setData([
            { id: "viz2", displayFormatHint: "flat" },
            { id: "viz1", displayFormatHint: "flat" },
            { id: "viz3", displayFormatHint: "flat" }
        ]);

        // Assert
        assert.strictEqual(this.oCreateAndInsertItemStub.callCount, 3, "The first call of setData creates the visualizations.");
        assert.strictEqual(this.oInsertAggregationStub.callCount, 1, "Only the update of the visualizations order triggered the update of the aggregations..");
    });

    QUnit.module("The function _createAndInsertItems", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);

            this.oDestroyStub = sandbox.stub();
            this.oInsertStub = sandbox.stub();
            this.oGetStub = sandbox.stub();

            this.oAggregation = {
                _sUpdater: "_updateMyAggregation",
                destroy: this.oDestroyStub,
                get: this.oGetStub
            };

            this.oGetAggregationStub = sandbox.stub().withArgs("aggregationName").returns(this.oAggregation);

            var oMetadata = {
                getAggregation: this.oGetAggregationStub
            };

            this.oInsertAggregationStub = sandbox.stub();

            this.oControl = {
                getMetadata: sandbox.stub().returns(oMetadata),
                insertAggregation: this.oInsertAggregationStub,
                getId: sandbox.stub().returns("__control1")
            };

            this.oECD = new ExtendedChangeDetection("aggregationName", this.oControl);
            this.oCreateAndInsertItemStub = sandbox.stub(this.oECD, "_createAndInsertItem");
        },
        afterEach: function () {
            ExtendedChangeDetection.oUpdateFromSiblingCache = {};
            this.oECD.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Destroys the contents of the aggregation", function (assert) {
        // Arrange
        var aContexts = [];
        var oBindingInfo = {};

        // Act
        this.oECD._createAndInsertItems(aContexts, oBindingInfo);

        // Assert
        assert.strictEqual(this.oDestroyStub.callCount, 1, "The destroy function has been called once.");
        assert.strictEqual(this.oCreateAndInsertItemStub.callCount, 0, "The function _createAndInsertItem has not been called.");
    });

    QUnit.test("Creates new items and inserts them at the correct index", function (assert) {
        // Arrange
        var oContext1 = {};
        var oContext2 = {};
        var aContexts = [oContext1, oContext2];
        var oBindingInfo = {};

        // Act
        this.oECD._createAndInsertItems(aContexts, oBindingInfo);

        // Assert
        assert.strictEqual(this.oCreateAndInsertItemStub.callCount, 2, "The function _createAndInsertItem has been called twice.");
        assert.strictEqual(this.oCreateAndInsertItemStub.firstCall.args.length, 3, "The function _createAndInsertItem has been called with the correct number of parameters.");
        assert.strictEqual(this.oCreateAndInsertItemStub.firstCall.args[0], oContext1, "The function _createAndInsertItem has been called with the correct parameter.");
        assert.strictEqual(this.oCreateAndInsertItemStub.firstCall.args[1], oBindingInfo, "The function _createAndInsertItem has been called with the correct parameter.");
        assert.strictEqual(this.oCreateAndInsertItemStub.firstCall.args[2], 0, "The function _createAndInsertItem has been called with the correct parameter.");
        assert.strictEqual(this.oCreateAndInsertItemStub.secondCall.args.length, 3, "The function _createAndInsertItem has been called with the correct number of parameters.");
        assert.strictEqual(this.oCreateAndInsertItemStub.secondCall.args[0], oContext2, "The function _createAndInsertItem has been called with the correct parameter.");
        assert.strictEqual(this.oCreateAndInsertItemStub.secondCall.args[1], oBindingInfo, "The function _createAndInsertItem has been called with the correct parameter.");
        assert.strictEqual(this.oCreateAndInsertItemStub.secondCall.args[2], 1, "The function _createAndInsertItem has been called with the correct parameter.");
    });

    QUnit.module("The function _createAndInsertItem", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);

            this.oDestroyStub = sandbox.stub();
            this.oInsertStub = sandbox.stub();
            this.oGetStub = sandbox.stub();

            this.oAggregation = {
                _sUpdater: "_updateMyAggregation",
                destroy: this.oDestroyStub,
                get: this.oGetStub
            };

            this.oGetAggregationStub = sandbox.stub().withArgs("aggregationName").returns(this.oAggregation);

            var oMetadata = {
                getAggregation: this.oGetAggregationStub
            };

            this.oInsertAggregationStub = sandbox.stub();

            this.oControl = {
                getMetadata: sandbox.stub().returns(oMetadata),
                insertAggregation: this.oInsertAggregationStub,
                getId: sandbox.stub().returns("__control1")
            };

            this.oECD = new ExtendedChangeDetection("aggregationName", this.oControl);

            this.oFactoryStub = sandbox.stub();
            this.oBindingInfo = {
                factory: this.oFactoryStub
            };
        },
        afterEach: function () {
            ExtendedChangeDetection.oUpdateFromSiblingCache = {};
            this.oECD.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Creates a new item and inserts it at the given index", function (assert) {
        // Arrange
        var oContext = {};
        var oNewItem = {};
        this.oFactoryStub.returns(oNewItem);

        // Act
        this.oECD._createAndInsertItem(oContext, this.oBindingInfo, 100);

        // Assert
        assert.strictEqual(this.oInsertAggregationStub.callCount, 1, "The function insertAggregation has been called once.");
        assert.strictEqual(this.oInsertAggregationStub.firstCall.args.length, 4, "The function insertAggregation has been called with the correct number of parameters.");
        assert.strictEqual(this.oInsertAggregationStub.firstCall.args[0], "aggregationName", "The function insertAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oInsertAggregationStub.firstCall.args[1], oNewItem, "The function insertAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oInsertAggregationStub.firstCall.args[2], 100, "The function insertAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oInsertAggregationStub.firstCall.args[3], true, "The function insertAggregation has been called with the correct parameter.");
        assert.strictEqual(this.oFactoryStub.callCount, 1, "The factory has been called once.");
        assert.strictEqual(this.oFactoryStub.firstCall.args.length, 2, "The factory has been called with the correct number of parameters.");
        assert.strictEqual(this.oFactoryStub.firstCall.args[0], null, "The factory has been called with the correct parameter.");
        assert.strictEqual(this.oFactoryStub.firstCall.args[1], oContext, "The factory has been called with the correct parameter.");
    });

    QUnit.module("The function _updateBindingContexts", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);

            this.oDestroyStub = sandbox.stub();
            this.oInsertStub = sandbox.stub();
            this.oGetStub = sandbox.stub();

            this.oAggregation = {
                _sUpdater: "_updateMyAggregation",
                destroy: this.oDestroyStub,
                get: this.oGetStub
            };

            this.oGetAggregationStub = sandbox.stub().withArgs("aggregationName").returns(this.oAggregation);

            var oMetadata = {
                getAggregation: this.oGetAggregationStub
            };

            this.oInsertAggregationStub = sandbox.stub();

            this.oControl = {
                getMetadata: sandbox.stub().returns(oMetadata),
                insertAggregation: this.oInsertAggregationStub,
                getId: sandbox.stub().returns("__control1")
            };

            this.oECD = new ExtendedChangeDetection("aggregationName", this.oControl);
            this.oCreateAndInsertItemStub = sandbox.stub(this.oECD, "_createAndInsertItem");
        },
        afterEach: function () {
            ExtendedChangeDetection.oUpdateFromSiblingCache = {};
            this.oECD.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Updates the binding context of each item in the aggregation", function (assert) {
        // Arrange
        var oSetBindingContextStub = sandbox.stub();
        var oItem1 = {
            setBindingContext: oSetBindingContextStub
        };
        var oItem2 = {
            setBindingContext: oSetBindingContextStub
        };
        var aItems = [oItem1, oItem2];
        this.oGetStub.returns(aItems);
        var oContext1 = {};
        var oContext2 = {};
        var aContexts = [oContext1, oContext2];

        // Act
        this.oECD._updateBindingContexts(aContexts);

        // Assert
        assert.strictEqual(this.oGetStub.callCount, 1, "The function Aggregation.get has been called once.");
        assert.strictEqual(this.oGetStub.firstCall.args[0], this.oControl, "The function Aggregation.get has been called with the correct parameter.");
        assert.strictEqual(oSetBindingContextStub.callCount, 2, "The function setBindingContext has been called twice.");
        assert.strictEqual(oSetBindingContextStub.firstCall.args.length, 1, "The function setBindingContext has been called with the correct number of parameters.");
        assert.strictEqual(oSetBindingContextStub.firstCall.args[0], oContext1, "The function setBindingContext has been called with the correct parameter.");
        assert.strictEqual(oSetBindingContextStub.secondCall.args.length, 1, "The function setBindingContext has been called with the correct number of parameters.");
        assert.strictEqual(oSetBindingContextStub.secondCall.args[0], oContext2, "The function setBindingContext has been called with the correct parameter.");
    });

    QUnit.module("_isUpdateFromSibling", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);

            this.oDestroyStub = sandbox.stub();
            this.oInsertStub = sandbox.stub();
            this.oGetStub = sandbox.stub();

            this.oAggregation = {
                _sUpdater: "_updateMyAggregation",
                destroy: this.oDestroyStub,
                get: this.oGetStub
            };

            this.oGetAggregationStub = sandbox.stub().withArgs("aggregationName").returns(this.oAggregation);

            var oMetadata = {
                getAggregation: this.oGetAggregationStub
            };

            this.oInsertAggregationStub = sandbox.stub();

            this.oControl = {
                getMetadata: sandbox.stub().returns(oMetadata),
                insertAggregation: this.oInsertAggregationStub,
                getId: sandbox.stub().returns("__control1")
            };

            this.oECD = new ExtendedChangeDetection("aggregationName", this.oControl);
            this.oECD._sAggregationName = "default";
        },
        afterEach: function () {
            ExtendedChangeDetection.oUpdateFromSiblingCache = {};
            this.oECD.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns true if cache values was set", function (assert) {
        // Arrange
        ExtendedChangeDetection.oUpdateFromSiblingCache = {
            "__control1:default": true,
            "__control1:compact": true
        };

        // Act
        var bResult = this.oECD._isUpdateFromSibling();

        // Assert
        assert.strictEqual(bResult, true, "The correct value was returned");
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, { "__control1:compact": true }, "The cache value was cleared");
    });

    QUnit.test("Returns false if cache values was not set", function (assert) {
        // Arrange
        ExtendedChangeDetection.oUpdateFromSiblingCache = {
            "__control1:compact": true
        };

        // Act
        var bResult = this.oECD._isUpdateFromSibling();

        // Assert
        assert.strictEqual(bResult, false, "The correct value was returned");
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, { "__control1:compact": true }, "The cache value was not altered");
    });

    QUnit.module("_refreshSiblingBindings", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last").withArgs("/core/spaces/extendedChangeDetection/enabled").returns(true);

            this.oDestroyStub = sandbox.stub();
            this.oInsertStub = sandbox.stub();
            this.oGetStub = sandbox.stub();

            this.oAggregation = {
                _sUpdater: "_updateMyAggregation",
                destroy: this.oDestroyStub,
                get: this.oGetStub
            };

            this.oGetAggregationStub = sandbox.stub().withArgs("aggregationName").returns(this.oAggregation);

            var oMetadata = {
                getAggregation: this.oGetAggregationStub
            };

            this.oInsertAggregationStub = sandbox.stub();

            this.oControl = {
                getMetadata: sandbox.stub().returns(oMetadata),
                insertAggregation: this.oInsertAggregationStub,
                getId: sandbox.stub().returns("__control1")
            };

            this.oECD = new ExtendedChangeDetection("aggregationName", this.oControl);

            var oGetBindingStub = sandbox.stub();

            this.oFlatBinding = {
                refresh: sandbox.stub()
            };
            oGetBindingStub.withArgs("flat").returns(this.oFlatBinding);
            this.oCompactBinding = {
                refresh: sandbox.stub()
            };
            oGetBindingStub.withArgs("compact").returns(this.oCompactBinding);

            this.oControl.getBinding = oGetBindingStub;
        },
        afterEach: function () {
            ExtendedChangeDetection.oUpdateFromSiblingCache = {};
            this.oECD.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Refreshes all siblings", function (assert) {
        // Arrange
        this.oECD._aSiblingAggregationNames = ["flat", "compact"];
        var oExpectedCache = {
            "__control1:flat": true,
            "__control1:compact": true
        };

        // Act
        this.oECD._refreshSiblingBindings();

        // Assert
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, oExpectedCache, "The cache was correctly set");
        assert.deepEqual(this.oCompactBinding.refresh.getCall(0).args, [true], "the compactBinding was forcefully refreshed");
        assert.deepEqual(this.oFlatBinding.refresh.getCall(0).args, [true], "the flatBinding was forcefully refreshed");
    });

    QUnit.test("Does nothing if aggregation has no siblings", function (assert) {
        // Arrange
        // Act
        this.oECD._refreshSiblingBindings();

        // Assert
        assert.deepEqual(ExtendedChangeDetection.oUpdateFromSiblingCache, {}, "The cache was not altered");
    });
});
