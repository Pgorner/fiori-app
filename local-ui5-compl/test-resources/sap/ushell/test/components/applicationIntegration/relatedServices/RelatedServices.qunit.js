// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.RelatedServices
 */
sap.ui.define([
    "sap/ui/core/library",
    "sap/ui/core/routing/History",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ushell/Container"
], (
    coreLibrary,
    Ui5History,
    RelatedServices,
    Container
) => {
    "use strict";

    // shortcut for sap.ui.core.routing.HistoryDirection
    const Ui5HistoryDirection = coreLibrary.routing.HistoryDirection;

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox();

    QUnit.module("navigateBack", {
        beforeEach: async function () {
            sandbox.stub(history, "back");
            sandbox.stub(Container, "getServiceAsync");

            this.oNavigationMock = {
                isInitialNavigation: sandbox.stub().resolves(false),
                navigate: sandbox.stub().resolves()
            };

            Container.getServiceAsync.withArgs("Navigation").resolves(this.oNavigationMock);
        },
        afterEach: async function () {
            sandbox.restore();
            RelatedServices.reset();
        }
    });

    QUnit.test("Default back navigation gets called", async function (assert) {
        // Act
        await RelatedServices.navigateBack();
        // Assert
        assert.strictEqual(history.back.callCount, 1, "Default back navigation was called");
    });

    QUnit.test("Custom back navigation gets called and can be reset", async function (assert) {
        // Arrange #1
        const oCustomBack = sandbox.stub();
        RelatedServices.setNavigateBack(oCustomBack);

        // Act #1
        await RelatedServices.navigateBack();

        // Assert #1
        assert.strictEqual(oCustomBack.callCount, 1, "Custom back navigation was called");
        assert.strictEqual(history.back.callCount, 0, "Default back navigation was not called");

        // Arrange #2
        oCustomBack.resetHistory();
        history.back.resetHistory();
        RelatedServices.resetNavigateBack();

        // Act #2
        await RelatedServices.navigateBack();

        // Assert #2
        assert.strictEqual(oCustomBack.callCount, 0, "Custom back navigation was not called");
        assert.strictEqual(history.back.callCount, 1, "Default back navigation was called");
    });

    QUnit.test("custom back works with store restore", async function (assert) {
        // Arrange #1 - use default back
        const oState = {
            AppWithDefaultBack: {},
            AppWithCustomBack: {}
        };
        const oCustomBack = sandbox.stub();
        RelatedServices.store(oState.AppWithDefaultBack);

        // Act #1
        await RelatedServices.navigateBack();

        // Assert #1
        assert.strictEqual(oCustomBack.callCount, 0, "Custom back navigation was not called (#1)");
        assert.strictEqual(history.back.callCount, 1, "Default back navigation was called (#1)");

        // Arrange #2 - set custom back
        oCustomBack.resetHistory();
        history.back.resetHistory();
        RelatedServices.setNavigateBack(oCustomBack);
        RelatedServices.store(oState.AppWithCustomBack);

        // Act #2
        await RelatedServices.navigateBack();

        // Assert #2
        assert.strictEqual(oCustomBack.callCount, 1, "Custom back navigation was called (#2)");
        assert.strictEqual(history.back.callCount, 0, "Default back navigation was not called (#2)");

        // Arrange #3 - restore default
        oCustomBack.resetHistory();
        history.back.resetHistory();
        RelatedServices.restore(oState.AppWithDefaultBack);

        // Act #3
        await RelatedServices.navigateBack();

        // Assert #3
        assert.strictEqual(oCustomBack.callCount, 0, "Custom back navigation was not called (#3)");
        assert.strictEqual(history.back.callCount, 1, "Default back navigation was called (#3)");

        // Arrange #4 - restore custom back
        oCustomBack.resetHistory();
        history.back.resetHistory();
        RelatedServices.restore(oState.AppWithCustomBack);

        // Act #4
        await RelatedServices.navigateBack();

        // Assert #4
        assert.strictEqual(oCustomBack.callCount, 1, "Custom back navigation was called (#4)");
        assert.strictEqual(history.back.callCount, 0, "Default back navigation was not called (#4)");
    });

    QUnit.test("Navigates to '#' for initial navigation", async function (assert) {
        // Arrange
        this.oNavigationMock.isInitialNavigation.resolves(true);
        const oExpectedNavigationTarget = {
            target: {
                shellHash: "#"
            },
            writeHistory: false
        };

        // Act
        await RelatedServices.navigateBack();

        // Assert
        assert.strictEqual(history.back.callCount, 0, "Default back navigation was not called");
        assert.deepEqual(this.oNavigationMock.navigate.getCall(0).args, [oExpectedNavigationTarget], "Navigated to '#'");
    });

    QUnit.module("isBackNavigation", {
        beforeEach: async function () {
            sandbox.stub(Ui5History.getInstance(), "getDirection");
        },
        afterEach: async function () {
            sandbox.restore();
            Container.reset();
        }
    });

    QUnit.test("Returns 'true' for HistoryDirection 'Backwards'", async function (assert) {
        // Arrange
        Ui5History.getInstance().getDirection.returns(Ui5HistoryDirection.Backwards);
        // Act
        const bIsBackNavigation = RelatedServices.isBackNavigation();
        // Assert
        assert.strictEqual(bIsBackNavigation, true, "Returned correct value");
    });

    Object.values(Ui5HistoryDirection)
        .filter((sDirection) => sDirection !== Ui5HistoryDirection.Backwards)
        .forEach((sDirection) => {
            QUnit.test(`Returns 'false' for HistoryDirection '${sDirection}'`, async function (assert) {
                // Arrange
                Ui5History.getInstance().getDirection.returns(sDirection);
                // Act
                const bIsBackNavigation = RelatedServices.isBackNavigation();
                // Assert
                assert.strictEqual(bIsBackNavigation, false, "Returned correct value");
            });
        });
});
