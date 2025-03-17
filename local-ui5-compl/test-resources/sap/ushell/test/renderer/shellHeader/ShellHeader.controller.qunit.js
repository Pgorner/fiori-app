// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for ShellHeader.controller
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/api/NewExperience",
    "sap/ushell/renderer/shellHeader/ShellHeader.controller",
    "sap/ushell/library",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/Container"
], function (
    Element,
    JSONModel,
    NewExperience,
    ShellHeaderController,
    ushellLibrary,
    ShellHeadItem,
    Container
) {
    "use strict";

    // shortcut for sap.ushell.FloatingNumberType
    var FloatingNumberType = ushellLibrary.FloatingNumberType;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("ShellHeader.controller - headEndItemsOverflowItemFactory", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oNavigateStub = sandbox.stub().resolves();
            this.oGetServiceAsyncStub.withArgs("Navigation").resolves({
                navigate: this.oNavigateStub
            });

            this.oConfig = {
                id: "testItem",
                text: "Head Item Text"
            };
            this.oShellHeadItemModel = new JSONModel({
                data: "test"
            });
            this.oContext = {
                getObject: function () {
                    return "testItem";
                }
            };

            this.oPopoverMock = {
                isOpen: sandbox.stub(),
                close: sandbox.stub()
            };
            var byIdStub = sandbox.stub(Element, "getElementById");
            byIdStub.withArgs("headEndItemsOverflow").returns(this.oPopoverMock);
            byIdStub.callThrough();

            this.oController = new ShellHeaderController();
        },
        afterEach: function () {
            this.oController.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Create an overflow item without floatingNumber", function (assert) {
        // Arrange
        var oShellHeadItem = new ShellHeadItem(this.oConfig);
        oShellHeadItem.setModel(this.oShellHeadItemModel);

        // Act
        var oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getId(), "testOverflowItem-testItem", "Overflow item with a given id created");
        assert.strictEqual(oOverflowItem.getTitle(), this.oConfig.text, "Overflow item with a given text created");
        assert.strictEqual(oOverflowItem.getFloatingNumber(), 0, "Overflow item floatingNumber equals \"0\"");
        assert.strictEqual(oOverflowItem.getFloatingNumberType(), FloatingNumberType.None, "Overflow item floatingNumberType equals \"" + FloatingNumberType.None + "\"");
        assert.notStrictEqual(oOverflowItem.getModel(), oShellHeadItem.getModel(), "The head item model was not applied");

        // Cleanup
        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.test("Create an overflow item with floatingNumber for Notifications", function (assert) {
        // Arrange
        this.oConfig.floatingNumber = "{/floatingNumber}";
        this.oConfig.floatingNumberType = FloatingNumberType.Notifications;
        this.oShellHeadItemModel.setProperty("/floatingNumber", 10);

        var oShellHeadItem = new ShellHeadItem(this.oConfig);
        oShellHeadItem.setModel(this.oShellHeadItemModel);

        // Act
        var oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getId(), "testOverflowItem-testItem", "Overflow item with a given id created");
        assert.strictEqual(oOverflowItem.getTitle(), this.oConfig.text, "Overflow item with a given text created");
        assert.strictEqual(oOverflowItem.getFloatingNumber(), 10, "Overflow item floatingNumber equals the value from the model");
        assert.strictEqual(oOverflowItem.getFloatingNumberType(), FloatingNumberType.Notifications, "Overflow item floatingNumberType equals \"" + FloatingNumberType.Notifications + "\"");
        assert.strictEqual(oOverflowItem.getModel(), oShellHeadItem.getModel(), "The head item model was applied");

        // Cleanup
        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.test("Delegates press event from the OverflowItem to the ShellHeadItem", function (assert) {
        // Arrange
        var oPressStub = sandbox.stub();
        this.oConfig.press = oPressStub;

        var oShellHeadItem = new ShellHeadItem(this.oConfig);
        oShellHeadItem.setModel(this.oShellHeadItemModel);
        var oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        // Act
        oOverflowItem.firePress();

        // Assert
        assert.strictEqual(oPressStub.callCount, 1, "Press event was delegated");

        // Cleanup
        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.test("Handles target property of the ShellHeadItem", function (assert) {
        // Arrange
        var done = assert.async();
        this.oConfig.target = "#Shell-appfinder";

        var oShellHeadItem = new ShellHeadItem(this.oConfig);
        oShellHeadItem.setModel(this.oShellHeadItemModel);
        var oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        var aExpectedArgs = [{
            target: {
                shellHash: "#Shell-appfinder"
            }
        }];

        // Act
        oOverflowItem.firePress();

        setTimeout(function () {
            // Assert
            assert.deepEqual(this.oNavigateStub.getCall(0).args, aExpectedArgs, "NavigationService.navigate was called with correct args");

            // Cleanup
            oShellHeadItem.destroy();
            oOverflowItem.destroy();
            done();
        }.bind(this), 0);
    });

    QUnit.test("Closes Overflow popover on click", function (assert) {
        // Arrange
        this.oPopoverMock.isOpen.returns(true);

        var oShellHeadItem = new ShellHeadItem(this.oConfig);
        oShellHeadItem.setModel(this.oShellHeadItemModel);
        var oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        // Act
        oOverflowItem.firePress();

        // Assert
        assert.strictEqual(this.oPopoverMock.close.callCount, 1, "Popover was closed once");

        // Cleanup
        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.test("item is not visible", function (assert) {
        // Arrange
        this.oPopoverMock.isOpen.returns(true);

        const oShellHeadItem = new ShellHeadItem({
            id: "testItem",
            visible: false
        });
        oShellHeadItem.setModel(this.oShellHeadItemModel);

        // Act
        const oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getVisible(), false, "OverflowItem is also not visible.");

        // Cleanup
        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.test("item is visible", function (assert) {
        // Arrange
        this.oPopoverMock.isOpen.returns(true);

        const oShellHeadItem = new ShellHeadItem({
            id: "testItem",
            visible: true
        });
        oShellHeadItem.setModel(this.oShellHeadItemModel);

        // Act
        const oOverflowItem = this.oController.headEndItemsOverflowItemFactory("testOverflowItem", this.oContext);

        // Assert
        assert.strictEqual(oOverflowItem.getVisible(), true, "OverflowItem is also visible.");

        // Cleanup
        oShellHeadItem.destroy();
        oOverflowItem.destroy();
    });

    QUnit.module("headEndItemsOverflowItemFactory", {
        beforeEach: async function () {
            this.oController = new ShellHeaderController();
        },
        afterEach: async function () {
            sandbox.restore();
        }
    });

    QUnit.test("Returns the NewExperience item", async function (assert) {
        // Arrange
        const sControlId = "NewExperience-btn__1";
        sandbox.stub(NewExperience, "isActive").returns(true);
        sandbox.stub(NewExperience, "getOverflowItemId").returns(sControlId);
        const oControl = {
            id: sControlId
        };
        sandbox.stub(NewExperience, "getOverflowItemControl").returns(oControl);
        const oContext = {
            getObject: sandbox.stub().returns(sControlId)
        };
        // Act
        const oItem = this.oController.headEndItemsOverflowItemFactory("id", oContext);
        // Assert
        assert.strictEqual(oItem, oControl, "The NewExperience item was returned");
    });

    QUnit.test("Returns a regular item if NewExperience is inactive", async function (assert) {
        // Arrange
        const sControlId = "NewExperience-btn__1";
        sandbox.stub(NewExperience, "isActive").returns(false);
        sandbox.stub(NewExperience, "getOverflowItemId").returns(sControlId);
        const oControl = {
            id: sControlId
        };
        sandbox.stub(NewExperience, "getOverflowItemControl").returns(oControl);
        const oContext = {
            getObject: sandbox.stub().returns(sControlId)
        };
        sandbox.stub(Element, "getElementById").returns(new ShellHeadItem());
        // Act
        const oItem = this.oController.headEndItemsOverflowItemFactory("id", oContext);
        // Assert
        assert.notStrictEqual(oItem, oControl, "The NewExperience item was returned");
    });
});
