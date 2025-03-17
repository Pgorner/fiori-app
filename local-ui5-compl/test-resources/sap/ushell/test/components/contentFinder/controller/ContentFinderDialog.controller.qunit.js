// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.contentFinder.controller.ContentFinderDialog.controller
 */
sap.ui.define([
    "sap/ushell/components/contentFinder/controller/ContentFinderDialog.controller"
], function (
    ContentFinderDialogController
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("The onInit method", {
        beforeEach: function () {
            this.oDialogController = new ContentFinderDialogController();
            this.oStubs = {
                component: {
                    getModel: sandbox.stub(),
                    getUiModel: sandbox.stub(),
                    getDataModel: sandbox.stub(),
                    getSelectionModel: sandbox.stub(),
                    attachVisualizationsAdded: sandbox.stub()
                },
                resourceBundle: sandbox.stub(),
                view: {
                    byId: sandbox.stub()
                }
            };
            this.oStubs.component.getModel.withArgs("i18n").returns({
                getResourceBundle: this.oStubs.resourceBundle
            });
            const oOwnerComponentStub = sandbox.stub(this.oDialogController, "getOwnerComponent");
            oOwnerComponentStub.returns(this.oStubs.component);
            sandbox.stub(this.oDialogController, "getView").returns({
                byId: this.oStubs.view.byId
            });
        },

        afterEach: function () {
            this.oDialogController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onInit called", function (assert) {
        // Arrange
        const oDialog = { id: "myDialog" };
        this.oStubs.view.byId.withArgs("contentFinderDialog").returns(oDialog);

        // Act
        this.oDialogController.onInit();

        // Assert
        assert.strictEqual(this.oStubs.resourceBundle.callCount, 1, "ResourceBundle was set.");
        assert.strictEqual(this.oStubs.component.getUiModel.callCount, 1, "UiModel was set.");
        assert.strictEqual(this.oStubs.component.getDataModel.callCount, 1, "DataModel was set.");
        assert.strictEqual(this.oStubs.component.getSelectionModel.callCount, 1, "SelectionModel was set.");
        assert.strictEqual(this.oStubs.component.attachVisualizationsAdded.callCount, 1, "VisualizationsAdded was attached.");
        assert.strictEqual(
            this.oStubs.component.attachVisualizationsAdded.firstCall.args[0],
            this.oDialogController.close,
            "VisualizationsAdded was attached with the correct function."
        );
        assert.strictEqual(this.oDialogController.oDialog, oDialog, "Dialog was set.");
    });

    QUnit.module("The onCancelButtonPressed method", {
        beforeEach: function () {
            this.oDialogController = new ContentFinderDialogController();
            this.oCloseStub = sandbox.stub(this.oDialogController, "close");
        },
        afterEach: function () {
            this.oDialogController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onCancelButtonPressed called", function (assert) {
        // Act
        this.oDialogController.onCancelButtonPressed();

        // Assert
        assert.strictEqual(this.oCloseStub.callCount, 1, "Close method was called.");
    });

    QUnit.module("The onAddButtonPressed method", {
        beforeEach: function () {
            this.oDialogController = new ContentFinderDialogController();
            this.aVisualizations = [{ id: 1 }, { id: 2 }];
            this.oAddVisualizationsStub = sandbox.stub();
            this.oDialogController.oComponent = {
                addVisualizations: this.oAddVisualizationsStub
            };
            this.oDialogController.oSelectionModel = {
                getProperty: sandbox.stub().withArgs("/visualizations/items").returns(this.aVisualizations)
            };
        },
        afterEach: function () {
            this.oDialogController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onAddButtonPressed called", function (assert) {
        // Act
        this.oDialogController.onAddButtonPressed();

        // Assert
        assert.strictEqual(this.oAddVisualizationsStub.callCount, 1, "addVisualizations of the Component method was called.");
        assert.deepEqual(this.oAddVisualizationsStub.firstCall.args[0], this.aVisualizations, "addVisualizations was called with the expected args.");
    });

    QUnit.module("The onAfterClose method", {
        beforeEach: function () {
            this.oDialogController = new ContentFinderDialogController();
            this.oResetAppSearchStub = sandbox.stub();
            this.otriggerContentFinderClosedStub = sandbox.stub();
            this.oDialogController.oComponent = {
                resetAppSearch: this.oResetAppSearchStub,
                triggerContentFinderClosed: this.otriggerContentFinderClosedStub
            };
        },
        afterEach: function () {
            this.oDialogController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onAfterClose called", function (assert) {
        // Act
        this.oDialogController.onAfterClose();

        // Assert
        assert.strictEqual(this.oResetAppSearchStub.callCount, 1, "resetAppSearch function of the Component  was called.");
        assert.strictEqual(this.otriggerContentFinderClosedStub.callCount, 1, "fireEvent was called.");
    });

    QUnit.module("The close method", {
        beforeEach: function () {
            this.oDialogController = new ContentFinderDialogController();
            this.oDialogCloseStub = sandbox.stub();
            this.oDialogController.oComponent = {
                getDialog: sandbox.stub().resolves({ close: this.oDialogCloseStub })
            };
        },
        afterEach: function () {
            this.oDialogController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("close called", async function (assert) {
        // Act
        await this.oDialogController.close();

        // Assert
        assert.strictEqual(this.oDialogCloseStub.callCount, 1, "Close method of the dialog was called.");
    });
});
