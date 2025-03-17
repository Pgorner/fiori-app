// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.Copilot
 */
sap.ui.define([
    "sap/ushell/api/Copilot",
    "sap/ushell/api/common/ComponentInstantiation"
], function (
    Copilot,
    ComponentInstantiation
) {
    "use strict";

    /* global QUnit, sinon */

    const sandbox = sinon.createSandbox({});

    QUnit.module("The function createComponentInstance", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards the call to the ComponentInstantiation module", async function (assert) {
        //Arrange
        const oComponentInstanceMock = {};
        sandbox.stub(ComponentInstantiation, "createComponentInstance").withArgs("#Action-toTest").resolves(oComponentInstanceMock);

        //Act
        const oComponentInstance = await Copilot.createComponentInstance("#Action-toTest");

        //Assert
        assert.strictEqual(oComponentInstance, oComponentInstanceMock, "The function call was forwarded correctly.");
    });

});
