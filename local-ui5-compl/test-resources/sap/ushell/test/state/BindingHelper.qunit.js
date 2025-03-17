// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.state.BindingHelper
 */
sap.ui.define([
    "sap/m/Button",
    "sap/m/VBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/state/BindingHelper"
], function (
    Button,
    VBox,
    JSONModel,
    nextUIUpdate,
    BindingHelper
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("overrideUpdateAggregation", {
        beforeEach: async function () {
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Overrides the original updateAggregation", async function (assert) {
        // Arrange
        const oButton = new Button();
        const fnOriginalUpdateAggregation = oButton.updateAggregation;
        // Act
        BindingHelper.overrideUpdateAggregation(oButton);
        // Assert
        assert.notStrictEqual(oButton.updateAggregation, fnOriginalUpdateAggregation, "The updateAggregation method is overridden");
        // Cleanup
        oButton.destroy();
    });

    QUnit.test("Removes bound aggregations instead of destroy", async function (assert) {
        // Arrange
        const oButton = new Button();
        const oModel = new JSONModel({
            buttons: [
                oButton.getId()
            ]
        });

        const oVBox = new VBox({
            items: {
                path: "/buttons",
                factory: BindingHelper.factory
            }
        });

        // Act
        BindingHelper.overrideUpdateAggregation(oVBox);

        oVBox.setModel(oModel);
        oVBox.placeAt("qunit-fixture");
        await nextUIUpdate();

        assert.ok(oButton.getDomRef(), "The button is rendered");

        oModel.setProperty("/buttons", []);
        await nextUIUpdate();
        // Assert
        assert.strictEqual(oButton.isDestroyed(), false, "The button is not destroyed");
        assert.notOk(oButton.getDomRef(), "The button is not rendered");
    });

    QUnit.module("factory");

    QUnit.test("Returns the referenced control", async function (assert) {
        // Arrange
        const oButton = new Button("button1");
        const oBindingContext = {
            getObject: sandbox.stub().returns("button1")
        };
        // Act
        const oControl = BindingHelper.factory("controlId", oBindingContext);
        // Assert
        assert.strictEqual(oControl, oButton, "The control is returned");
    });
});


