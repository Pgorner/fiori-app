// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.api.Inbox
 */
sap.ui.define([
    "sap/ushell/api/Inbox",
    "sap/ushell/api/common/ComponentInstantiation"
], function (
    Inbox,
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
        const oComponentData = {};
        const oOwnerComponent = {};
        const oComponentInstanceMock = {};
        sandbox.stub(ComponentInstantiation, "createComponentInstance").withArgs("#Action-toTest", oComponentData, oOwnerComponent).resolves(oComponentInstanceMock);

        //Act
        const oComponentInstance = await Inbox.createComponentInstance("#Action-toTest", oComponentData, oOwnerComponent);

        //Assert
        assert.strictEqual(oComponentInstance, oComponentInstanceMock, "The function call was forwarded correctly.");
    });

    QUnit.module("The function createComponentInstantiationData", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Forwards the call to the ComponentInstantiation module", async function (assert) {
        //Arrange
        const oComponentData = {};
        const oExpectedComponentInstantiationData = {};
        sandbox.stub(ComponentInstantiation, "createComponentInstantiationData").withArgs("#Action-toTest", oComponentData).resolves(oExpectedComponentInstantiationData);

        //Act
        const oComponentInstantiationData = await Inbox.createComponentInstantiationData("#Action-toTest", oComponentData);

        //Assert
        assert.strictEqual(oComponentInstantiationData, oExpectedComponentInstantiationData, "The function call was forwarded correctly.");
    });
});
