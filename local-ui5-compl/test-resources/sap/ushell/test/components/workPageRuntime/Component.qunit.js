// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.workPageBuilder.Component
 */
sap.ui.define([
    "sap/ushell/components/workPageRuntime/Component"
], function (
    Component
) {
    "use strict";
    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();


    QUnit.module("The Component", {
        beforeEach: function () {
            this.oComponent = new Component();
        },
        afterEach: function () {
            this.oComponent.destroy();
        }
    });

    QUnit.test("instantiation works", function (assert) {
        assert.ok(this.oComponent, "The component was instantiated.");
    });

    QUnit.module("Method getNavigationDisabled");

    QUnit.test("Defaults to false when no componentData was provided", function (assert) {
        // Arrange
        var oComponent = new Component();
        // Act
        var bResult = oComponent.getNavigationDisabled();
        // Assert
        assert.strictEqual(bResult, false, "The correct value was returned.");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.test("Returns the value provided by the componentData", function (assert) {
        // Arrange
        var oComponent = new Component({
            componentData: {
                navigationDisabled: true
            }
        });
        // Act
        var bResult = oComponent.getNavigationDisabled();
        // Assert
        assert.strictEqual(bResult, true, "The correct value was returned.");
        // Cleanup
        oComponent.destroy();
    });

    QUnit.module("Method onRouteMatched", {
        beforeEach: function () {
            this.oComponent = new Component();

            this.oOnRouteMatchedStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    onRouteMatched: this.oOnRouteMatchedStub
                })
            });
        },
        afterEach: function () {
            this.oComponent.destroy();
        }
    });

    QUnit.test("calls onRouteMatched on the Controller", function (assert) {
        // Act
        this.oComponent.onRouteMatched();
        // Assert
        assert.strictEqual(this.oOnRouteMatchedStub.callCount, 1, "onRouteMatched was called on the controller.");
    });

    QUnit.module("Method navigateToEmptyPage", {
        beforeEach: function () {
            this.oComponent = new Component();

            this.oNavigateToEmptyPageStub = sandbox.stub();
            sandbox.stub(this.oComponent, "getRootControl").returns({
                getController: sandbox.stub().returns({
                    onRouteMatched: this.oNavigateToEmptyPageStub
                })
            });
        },
        afterEach: function () {
            this.oComponent.destroy();
        }
    });

    QUnit.test("calls onRouteMatched on the Controller", function (assert) {
        // Act
        this.oComponent.onRouteMatched();
        // Assert
        assert.strictEqual(this.oNavigateToEmptyPageStub.callCount, 1, "navigateToEmptyPage was called on the controller.");
    });
});
