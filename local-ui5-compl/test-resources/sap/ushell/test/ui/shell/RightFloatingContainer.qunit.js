// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.shell.RightFloatingContainer
 */
sap.ui.define([
    "sap/m/NotificationListItem",
    "sap/ushell/Container",
    "sap/ushell/ui/shell/RightFloatingContainer"
], function (
    NotificationListItem,
    Container,
    RightFloatingContainer
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("sap.ushell.ui.shell.RightFloatingContainer", {
        beforeEach: function () {
            this.oRightFloatingContainer = new RightFloatingContainer({
                id: "testRightFloatingContainer"
            });
            this.oRightFloatingContainer.placeAt("qunit-fixture");
            return Container.init("local");
        },
        afterEach: function () {
            this.oRightFloatingContainer.destroy();
        }
    });

    QUnit.test("Constructor Test", function (assert) {
        var oShellElement = new RightFloatingContainer({
            floatingContainerItems: new NotificationListItem({
                id: "testButton",
                icon: "sap-icon://documents"
            })
        });

        assert.strictEqual(oShellElement.getFloatingContainerItems()[0].sId, "testButton", "Validate testButton is first element in the right floating container");
        oShellElement.removeFloatingContainerItem("testButton");
        assert.strictEqual(oShellElement.getFloatingContainerItems().length, 0, "Validate no elements in the right floating container");
    });

    QUnit.test("Test When adding the 6th element to the right floating container we need to hide the last one", function (assert) {
        var oClock = sinon.useFakeTimers();
        this.oRightFloatingContainer.setInsertItemsWithAnimation(true);
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item0" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item1" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item2" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item3" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item4" }));
        oClock.tick(550);
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item5" }));
        oClock.tick(550);

        var aItems = this.oRightFloatingContainer.getFloatingContainerItems();

        assert.ok(aItems[5].hasStyleClass("sapUshellRightFloatingContainerHideLastItem"), "Last item should be hidden when there are more than 5 items in the list");
        assert.ok(!aItems[0].hasStyleClass("sapUshellRightFloatingContainerHideLastItem"), "First item should not be hidden when there are more than 5 items in the list");
        oClock.restore();
    });

    QUnit.test("Test setFloatingContainerItemsVisiblity - set visible true", function (assert) {
        var oClock = sinon.useFakeTimers();
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item0" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item1" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item2" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item3" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item4" }));

        this.oRightFloatingContainer.setFloatingContainerItemsVisiblity(true);
        var items = this.oRightFloatingContainer.getFloatingContainerItems();
        oClock.tick(299);
        assert.ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === false, "first item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.tick(100);
        items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === true, "first item's class is sapUshellRightFloatingContainerItemBounceIn");
        assert.ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === false, "second item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.tick(2);
        items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === true, "second item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.tick(300);
        items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[4].hasStyleClass("sapUshellRightFloatingContainerItemBounceIn") === true, "last item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.restore();
    });

    QUnit.test("Test setFloatingContainerItemsVisiblity - set visible false", function (assert) {
        var oClock = sinon.useFakeTimers();
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item0" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item1" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item2" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item3" }));
        this.oRightFloatingContainer.addFloatingContainerItem(new NotificationListItem({ title: "item4" }));

        this.oRightFloatingContainer.setFloatingContainerItemsVisiblity(false);
        var items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === false, "first item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.tick(1);
        items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[0].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === true, "first item's class is sapUshellRightFloatingContainerItemBounceOut");
        assert.ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === false, "second item's class is sapUshellRightFloatingContainerItemBounceIn");
        oClock.tick(100);
        items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[1].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === true, "second item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.tick(300);
        items = this.oRightFloatingContainer.getFloatingContainerItems();
        assert.ok(items[4].hasStyleClass("sapUshellRightFloatingContainerItemBounceOut") === true, "second item's class is sapUshellRightFloatingContainerItemBounceOut");
        oClock.restore();
    });
});
