// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinder.Component
 */
sap.ui.define([
    "sap/ui/core/Component",
    "sap/ui/core/mvc/View",
    "sap/ushell/components/contentFinder/dialog/Component"
], function (
    Component,
    View,
    ContentFinderDialogComponent
) {
    "use strict";
    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    const fnCreateComponent = async function (oSettings, oComponentData) {
        sandbox.stub(View, "create").resolves();
        return Component.create({
            name: "sap.ushell.components.contentFinder.dialog",
            settings: oSettings || {},
            componentData: oComponentData || {}
        });
    };

    QUnit.module("The getDialog method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oRootViewByIdStub = sandbox.stub().withArgs("contentFinderDialog");
            sandbox.stub(this.oComponent, "rootControlLoaded").resolves({
                byId: this.oRootViewByIdStub
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("call getDialog", async function (assert) {
        // Arrange
        const oExpectedDialog = { id: "contentFinderDialog" };
        this.oRootViewByIdStub.resolves(oExpectedDialog);

        // Act
        const oDialog = await this.oComponent.getDialog();

        // Assert
        assert.deepEqual(oDialog, oExpectedDialog, "The correct dialog was returned");
    });

    QUnit.module("The show method", {
        beforeEach: async function () {
            this.oComponent = await fnCreateComponent();
            this.oComponentData = {
                visualizationFilters: {
                    displayed: ["tiles", "cards"],
                    selected: "tiles",
                    available: [
                        {
                            key: "tiles",
                            title: "Tiles",
                            types: ["sap.ushell.StaticAppLauncher", "sap.ushell.DynamicAppLauncher"]
                        },
                        {
                            key: "cards",
                            title: "Cards",
                            types: ["sap.card"]
                        }
                    ]
                }
            };
            this.oResetVisualizationsStub = sandbox.stub(ContentFinderDialogComponent.prototype, "resetVisualizations");
            this.oInitializeSelectionModelStub = sandbox.stub(ContentFinderDialogComponent.prototype, "initializeSelectionModel");
            this.oQueryVisualizationsStub = sandbox.stub(ContentFinderDialogComponent.prototype, "queryVisualizations");
            this.oDialogStub = { open: sandbox.stub() };
            sandbox.stub(ContentFinderDialogComponent.prototype, "getDialog").resolves(this.oDialogStub);
            this.oGetComponentDataStub = sandbox.stub(this.oComponent, "getComponentData");
            this.oSetVisualizationsFiltersStub = sandbox.stub(this.oComponent, "setVisualizationsFilters");
        },
        afterEach: function () {
            sandbox.restore();
            this.oComponent?.destroy();
        }
    });

    QUnit.test("call show without parameters", async function (assert) {
        // Arrange
        this.oComponent._bLoading = true;
        this.oGetComponentDataStub.returns(this.oComponentData);

        // Act
        await this.oComponent.show();

        // Assert
        assert.strictEqual(this.oGetComponentDataStub.callCount, 1, "The getComponentData method was called once");
        assert.strictEqual(this.oSetVisualizationsFiltersStub.callCount, 1, "The setVisualizationsFilters method was called once");
        assert.deepEqual(this.oSetVisualizationsFiltersStub.firstCall.args, [this.oComponentData.visualizationFilters], "The setVisualizationsFilters method was called with the correct parameter");
        assert.strictEqual(this.oResetVisualizationsStub.callCount, 1, "The resetVisualizations method was called once");
        assert.strictEqual(this.oComponent._bLoading, false, "The _bLoading property is set to false");
        assert.strictEqual(this.oInitializeSelectionModelStub.callCount, 1, "The initializeSelectionModel method was called once");
        assert.strictEqual(this.oQueryVisualizationsStub.callCount, 1, "The queryVisualizations method was called once");
        assert.strictEqual(this.oQueryVisualizationsStub.firstCall.args[0], 0, "The queryVisualizations method was called with the correct parameter");
        assert.strictEqual(this.oDialogStub.open.callCount, 1, "The open method of the dialog was called once");
    });

    QUnit.test("call show with visualizationFilters parameters", async function (assert) {
        // Arrange
        this.oComponent._bLoading = true;

        // Act
        await this.oComponent.show(this.oComponentData);

        // Assert
        assert.strictEqual(this.oGetComponentDataStub.callCount, 0, "The getComponentData method was not called");
        assert.strictEqual(this.oSetVisualizationsFiltersStub.callCount, 1, "The setVisualizationsFilters method was called once");
        assert.deepEqual(this.oSetVisualizationsFiltersStub.firstCall.args, [this.oComponentData.visualizationFilters], "The setVisualizationsFilters method was called with the correct parameter");
        assert.strictEqual(this.oComponent._bLoading, false, "The _bLoading property is set to false");
        assert.strictEqual(this.oInitializeSelectionModelStub.callCount, 1, "The initializeSelectionModel method was called once");
        assert.strictEqual(this.oQueryVisualizationsStub.callCount, 1, "The queryVisualizations method was called once");
        assert.strictEqual(this.oQueryVisualizationsStub.firstCall.args[0], 0, "The queryVisualizations method was called with the correct parameter");
        assert.strictEqual(this.oDialogStub.open.callCount, 1, "The open method of the dialog was called once");
    });
});
