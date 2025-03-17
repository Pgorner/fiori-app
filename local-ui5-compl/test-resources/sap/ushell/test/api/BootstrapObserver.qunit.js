// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.BootstrapObserver
 */
sap.ui.define([
    "sap/ushell/api/BootstrapObserver"
], function (
    BootstrapObserver
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("General Tests", {
        afterEach: function () {
            sandbox.restore();
            BootstrapObserver.__reset();
        }
    });

    QUnit.test("Promise resolves with the correct value", async function (assert) {
        //Arrange
        const oDummyContainer = {foo: "bar"};

        //Act
        BootstrapObserver.resolveBootstrappedContainer(oDummyContainer);

        //Assert
        const oReturnedContainer = await BootstrapObserver.ready();
        assert.ok(true, "Promise resolved!");
        assert.ok(oDummyContainer === oReturnedContainer, "Given Container and retrieved Container instances are identical!");
    });

    QUnit.test("'ready' works also for multiple uses", async function (assert) {
        //Arrange
        const oDummyContainer = {foo: "bar"};
        const oReadyPromiseOne = BootstrapObserver.ready();
        const oReadyPromiseTwo = BootstrapObserver.ready();
        //Act
        BootstrapObserver.resolveBootstrappedContainer(oDummyContainer);

        //Assert
        const oReturnedContainerOne = await oReadyPromiseOne;
        const oReturnedContainerTwo = await oReadyPromiseTwo;

        assert.strictEqual(oDummyContainer, oReturnedContainerOne, "Given Container and retrieved Containers instances are identical!");
        assert.strictEqual(oDummyContainer, oReturnedContainerTwo, "Given Container and retrieved Containers instances are identical!");
    });

});
