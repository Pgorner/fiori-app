// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit QUnit.tests for sap.ushell.ui.launchpad.AnchorNavigationBar
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/ushell/ui/launchpad/AnchorItem",
    "sap/ushell/ui/launchpad/AnchorNavigationBar",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Core",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ui/Device"
], function (
    AnchorItem,
    AnchorNavigationBar,
    JSONModel,
    Core,
    nextUIUpdate,
    Device
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("sap.ushell.ui.launchpad.AnchorNavigationBar", {
        beforeEach: function () {
            var oTestContainer = window.document.createElement("div");
            oTestContainer.setAttribute("id", "testContainer");
            oTestContainer.style.display = "none";
            window.document.body.appendChild(oTestContainer);

            this.oAnchorNavigationBar = new AnchorNavigationBar({
                itemPress: [function (oEvent) {}],
                groups: {
                    path: "/groups",
                    template: new AnchorItem({
                        index: "{index}",
                        title: "{title}",
                        groupId: "{groupId}",
                        selected: false,
                        visible: true
                    })
                }
            });
            this.oAnchorNavigationBar.setModel(new JSONModel({
                groups: [{
                    id: "group_0",
                    groupId: "group_0",
                    title: "group_0",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_00", content: [] },
                        { id: "tile_01", content: [] }
                    ]
                }, {
                    id: "group_1",
                    groupId: "group_1",
                    title: "group_1",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_02", content: [] },
                        { id: "tile_03", content: [] }
                    ]
                }, {
                    id: "group_2",
                    groupId: "group_2",
                    title: "group_2",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_02", content: [] },
                        { id: "tile_03", content: [] }
                    ]
                }, {
                    id: "group_3",
                    groupId: "group_3",
                    title: "group_3",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_02", content: [] },
                        { id: "tile_03", content: [] }
                    ]
                }, {
                    id: "group_4",
                    groupId: "group_4",
                    title: "group_4",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_02", content: [] },
                        { id: "tile_03", content: [] }
                    ]
                }, {
                    id: "group_5",
                    groupId: "group_5",
                    title: "group_5",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_02", content: [] },
                        { id: "tile_03", content: [] }
                    ]
                }, {
                    id: "group_6",
                    groupId: "group_6",
                    title: "group_6",
                    isGroupVisible: true,
                    tiles: [
                        { id: "tile_02", content: [] },
                        { id: "tile_03", content: [] }
                    ]
                }]
            }));
            this.oAnchorNavigationBar.placeAt(oTestContainer);
            return nextUIUpdate();
        },
        /**
         * This method is called after each QUnit.test. Add every restoration code here.
         */
        afterEach: function () {
            sandbox.restore();
            this.oAnchorNavigationBar.destroy();
            var oTestContainer = window.document.getElementById("testContainer");
            window.document.body.removeChild(oTestContainer);
        }
    });

    QUnit.test("Constructor QUnit.test", function (assert) {
        // Assert
        var oTestContainer = window.document.getElementById("testContainer");
        var bSapUshellAnchorNavigationBarClassAdded = oTestContainer.getElementsByClassName("sapUshellAnchorNavigationBar").length > 0;
        assert.ok(this.oAnchorNavigationBar !== null, "anchor navigation bar was created successfully");
        assert.strictEqual(this.oAnchorNavigationBar.getGroups().length, 7, "7 groups expected");
        assert.ok(bSapUshellAnchorNavigationBarClassAdded, "anchor navigation bar was added to the DOM");
    });

    QUnit.test("Test setSelectedItemIndex", function (assert) {
        // Act
        this.oAnchorNavigationBar.setSelectedItemIndex(undefined);

        // Assert
        assert.strictEqual(this.oAnchorNavigationBar.getSelectedItemIndex(), 0, "selected group should remain 0");

        // Act
        this.oAnchorNavigationBar.setSelectedItemIndex(1);

        // Assert
        assert.strictEqual(this.oAnchorNavigationBar.getSelectedItemIndex(), 1, "selected group should be 1");
    });

    QUnit.test("Test reArrangeNavigationBarElements", function (assert) {
        // Arrange
        var stubAdjustItemSelection = sandbox.stub(this.oAnchorNavigationBar, "adjustItemSelection");
        this.oAnchorNavigationBar.setSelectedItemIndex(1);

        // Act
        this.oAnchorNavigationBar.reArrangeNavigationBarElements();

        // Assert
        assert.ok(stubAdjustItemSelection.calledOnce, "anchor navigation bar selected item was changed");
        assert.strictEqual(stubAdjustItemSelection.args[0][0], 1, "selected item is item #1");
    });

    QUnit.test("Test reArrangeNavigationBarElements in mobile", function (assert) {
        // Arrange
        var stubAdjustItemSelection = sandbox.stub(this.oAnchorNavigationBar, "adjustItemSelection");
        var bPhone = Device.system.phone;
        Device.system.phone = true;
        this.oAnchorNavigationBar.setSelectedItemIndex(1);

        // Act
        this.oAnchorNavigationBar.reArrangeNavigationBarElements();

        // Assert
        assert.ok(stubAdjustItemSelection.calledOnce, "anchor navigation bar selectd item was changed");
        assert.strictEqual(stubAdjustItemSelection.args[0][0], 1, "selected item is item #1");
        assert.strictEqual(this.oAnchorNavigationBar.anchorItems[0].getIsGroupVisible(), false, "first group should be hidden");
        assert.strictEqual(this.oAnchorNavigationBar.anchorItems[1].getIsGroupVisible(), true, "second group should be visible");

        // Clean - up
        Device.system.phone = bPhone;
    });

    QUnit.test("Test setNavigationBarItemsVisibility", function (assert) {
        // Arrange
        var stubIsLastAnchorItemVisible = sandbox.stub(this.oAnchorNavigationBar, "isMostRightAnchorItemVisible").returns(true),
            stubIsFirstAnchorItemVisible = sandbox.stub(this.oAnchorNavigationBar, "isMostLeftAnchorItemVisible").returns(true),
            oOverflowButton = this.oAnchorNavigationBar.oOverflowButton,
            bPhone = Device.system.phone;

        // Act
        this.oAnchorNavigationBar.setNavigationBarItemsVisibility();

        // Assert
        assert.strictEqual(oOverflowButton.getDomRef().classList.contains("sapUshellShellHidden"), true, "overflow button should be hidden");

        // Arrange
        Device.system.phone = true;

        // Act
        this.oAnchorNavigationBar.setNavigationBarItemsVisibility();

        // Assert
        assert.strictEqual(oOverflowButton.getDomRef().classList.contains("sapUshellShellHidden"), false, "overflow button should be visible");

        // Arrange
        Device.system.phone = false;
        stubIsLastAnchorItemVisible.returns(false);

        // Act
        this.oAnchorNavigationBar.setNavigationBarItemsVisibility();

        // Assert
        assert.strictEqual(oOverflowButton.getDomRef().classList.contains("sapUshellShellHidden"), false, "overflow button should be visible");

        // Arrange
        stubIsLastAnchorItemVisible.returns(true);
        stubIsFirstAnchorItemVisible.returns(false);

        // Act
        this.oAnchorNavigationBar.setNavigationBarItemsVisibility();

        // Assert
        assert.strictEqual(oOverflowButton.getDomRef().classList.contains("sapUshellShellHidden"), false, "overflow button should be visible");

        // Clean -up
        Device.system.phone = bPhone;
    });

    QUnit.test("Test setNavigationBarItemsVisibility - phone - no groups in dashboard", function (assert) {
        // Arrange
        sandbox.stub(this.oAnchorNavigationBar, "isMostRightAnchorItemVisible").returns(true);
        sandbox.stub(this.oAnchorNavigationBar, "isMostLeftAnchorItemVisible").returns(true);

        var oOverflowButton = this.oAnchorNavigationBar.oOverflowButton,
            bPhone = Device.system.phone;

        Device.system.phone = true;
        this.oAnchorNavigationBar.anchorItems = [];

        // Act
        this.oAnchorNavigationBar.setNavigationBarItemsVisibility();

        // Assert
        assert.strictEqual(oOverflowButton.getDomRef().classList.contains("sapUshellShellHidden"), true, "overflow button should be hidden");

        // Clean - up
        Device.system.phone = bPhone;
    });

    QUnit.test("Test selected anchor navigation item", async function (assert) {
        // Arrange
        var fnDone = assert.async();

        // Act
        this.oAnchorNavigationBar.adjustItemSelection(1);
        await nextUIUpdate();

        // Assert
        setTimeout(function () {
            var aAnchorItems = this.oAnchorNavigationBar.getGroups();
            assert.strictEqual(aAnchorItems[0].getSelected(), false, "first item is selected");
            assert.strictEqual(aAnchorItems[1].getSelected(), true, "first item is selected");
            fnDone();
        }.bind(this), 50);
    });

    QUnit.test("Test get visible groups", function (assert) {
        // Act
        var aGroups = this.oAnchorNavigationBar.getVisibleGroups();

        // Assert
        assert.strictEqual(aGroups.length, 7, "there are two visible groups");

        // Arrange
        aGroups[1].setVisible(false);

        // Act
        aGroups = this.oAnchorNavigationBar.getVisibleGroups();

        // Assert
        assert.strictEqual(aGroups.length, 6, "there is only one visible group");
    });

    QUnit.test("Test isMostRightAnchorItemVisible", async function (assert) {
        // Arrange
        var oTestContainer = window.document.getElementById("testContainer");
        oTestContainer.style.display = "block";
        oTestContainer.style.width = "500px";

        // Act
        var bIsLastGroupVisible = this.oAnchorNavigationBar.isMostRightAnchorItemVisible();

        // Assert
        assert.ok(!bIsLastGroupVisible, "last group is not visible");

        // Arrange
        var aGroups = this.oAnchorNavigationBar.getGroups();
        // leave only two groups
        aGroups = aGroups.splice(5);
        this.oAnchorNavigationBar.getModel().setProperty("/groups", aGroups);
        await nextUIUpdate();

        // Act
        bIsLastGroupVisible = this.oAnchorNavigationBar.isMostRightAnchorItemVisible();

        // Assert
        assert.ok(bIsLastGroupVisible, "last group is visible");
    });

    QUnit.test("Test isMostLeftAnchorItemVisible", function (assert) {
        // Arrange
        var oTestContainer = window.document.getElementById("testContainer");
        oTestContainer.style.display = "block";

        // Act
        var bIsFirstGroupVisible = this.oAnchorNavigationBar.isMostLeftAnchorItemVisible();

        // Assert
        assert.ok(bIsFirstGroupVisible, "first group is visible");
    });

    QUnit.test("Test get overflow right and left arrows", function (assert) {
        // Act
        var oLeftButton = this.oAnchorNavigationBar._getOverflowLeftArrowButton(),
            oRightButton = this.oAnchorNavigationBar._getOverflowRightArrowButton();

        // Assert
        assert.ok(oLeftButton.isA("sap.m.Button"), "left button control type is correct");
        assert.strictEqual(oLeftButton.getIcon(), "sap-icon://slim-arrow-left", "left button src is correct");

        assert.ok(oRightButton.isA("sap.m.Button"), "right button control type is correct");
        assert.strictEqual(oRightButton.getIcon(), "sap-icon://slim-arrow-right", "right button src is correct");
    });

    QUnit.test("Test get overflow button", function (assert) {
        // Act
        var oOverflowButton = this.oAnchorNavigationBar._getOverflowButton();

        // Assert
        assert.ok(oOverflowButton.isA("sap.m.Button"), "overfolw button control type is correct");
        assert.strictEqual(oOverflowButton.getIcon(), "sap-icon://slim-arrow-down", "overfolw button src is correct");
    });

    QUnit.module("AnchorNavigationBar rendering", {
        beforeEach: function () {
            this.oAnchorNavigationBar = new AnchorNavigationBar();
        },

        afterEach: function () {
            sandbox.restore();
            this.oAnchorNavigationBar.destroy();
        }
    });

    QUnit.test("Only the minimal DOM is rendered in the case of no groups", async function (assert) {
        // Arrange
        sandbox.stub(this.oAnchorNavigationBar, "getGroups").returns([]);

        // Act
        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oAnchorNavigationBar.getDomRef();
        assert.ok(oDomRef.classList.contains("sapUshellAnchorNavigationBar"), "The outer class exists.");
        assert.notEqual(oDomRef.getElementsByClassName("sapUshellAnchorNavigationBarInner").length, 0, "The inner class exists.");
        assert.strictEqual(oDomRef.getElementsByClassName("sapUshellAnchorLeftOverFlowButton").length, 0, "The content class does not exist.");
    });

    QUnit.test("The complete DOM is rendered when there is at least one group", async function (assert) {
        // Arrange
        var oRenderNavigationItemsStub;

        sandbox.stub(this.oAnchorNavigationBar, "getGroups").returns([{}]);
        sandbox.stub(this.oAnchorNavigationBar, "onAfterRendering");
        oRenderNavigationItemsStub = sandbox.stub(this.oAnchorNavigationBar.getRenderer(), "renderAnchorNavigationItems");

        // Act
        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oAnchorNavigationBar.getDomRef();
        assert.notEqual(oDomRef.getElementsByClassName("sapUshellAnchorLeftOverFlowButton").length, 0, "The class sapUshellAnchorLeftOverFlowButton exists.");
        assert.notEqual(oDomRef.getElementsByClassName("sapUshellAnchorNavigationBarItems").length, 0, "The class sapUshellAnchorNavigationBarItems exists.");
        assert.notEqual(oDomRef.getElementsByClassName("sapUshellAnchorNavigationBarItemsScroll").length, 0, "The class sapUshellAnchorNavigationBarItemsScroll exists.");
        assert.notEqual(oDomRef.getElementsByClassName("sapUshellAnchorRightOverFlowButton").length, 0, "The class sapUshellAnchorRightOverFlowButton exists.");
        assert.notEqual(oDomRef.getElementsByClassName("sapUshellAnchorItemOverFlow").length, 0, "The class sapUshellAnchorItemOverFlow exists.");
        assert.ok(oRenderNavigationItemsStub.called, "The function to create the navigation items is called.");
    });

    QUnit.test("onAfterRendering does not the finishing work if the control is not rendered completely", function (assert) {
        // Arrange
        var fnReArrangeNavigationBarStub = sandbox.stub(this.oAnchorNavigationBar, "reArrangeNavigationBarElements");

        // Act
        this.oAnchorNavigationBar.onAfterRendering();

        // Assert
        assert.strictEqual(fnReArrangeNavigationBarStub.callCount, 0, "The rearrangement of the navigation bar elements odes not take place.");
    });

    QUnit.test("onAfterRendering does the finishing work if the control is rendered completely", function (assert) {
        // Arrange
        this.oAnchorNavigationBar._setRenderedCompletely(true);
        var fnReArrangeNavigationBarStub = sandbox.stub(this.oAnchorNavigationBar, "reArrangeNavigationBarElements");
        sandbox.stub(this.oAnchorNavigationBar, "getDomRef").returns(null);

        // Act
        this.oAnchorNavigationBar.onAfterRendering();

        // Assert
        assert.strictEqual(fnReArrangeNavigationBarStub.callCount, 1, "The rearrangement of the navigation bar elements takes place.");
    });

    QUnit.test("after rendering, the overflow buttons have no tabindices", async function (assert) {
        // Arrange
        sandbox.stub(this.oAnchorNavigationBar, "isMostLeftAnchorItemVisible").returns(false);
        sandbox.stub(this.oAnchorNavigationBar, "isMostRightAnchorItemVisible").returns(false);

        this.oAnchorNavigationBar.addGroup(new AnchorItem());

        // Act
        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnchorNavigationBar.oOverflowLeftButton.getDomRef().getAttribute("tabindex"), "-1",
            "Tabindex of the left overflow button was removed.");
        assert.strictEqual(this.oAnchorNavigationBar.oOverflowRightButton.getDomRef().getAttribute("tabindex"), "-1",
            "Tabindex of the right overflow button was removed.");
    });

    QUnit.test("adjustVisibleAnchorItemsAccessibility correctly applies posinset and setsize on AnchorItems", function (assert) {
        // Arrange
        var oAnchorItem1 = new AnchorItem();
        sandbox.stub(oAnchorItem1, "setPosinset");
        sandbox.stub(oAnchorItem1, "setSetsize");
        var oAnchorItem2 = new AnchorItem();
        sandbox.stub(oAnchorItem2, "setPosinset");
        sandbox.stub(oAnchorItem2, "setSetsize");
        var oAnchorItem3 = new AnchorItem();
        sandbox.stub(oAnchorItem3, "setPosinset");
        sandbox.stub(oAnchorItem3, "setSetsize");

        sandbox.stub(this.oAnchorNavigationBar, "getVisibleGroups").returns([
            oAnchorItem1,
            oAnchorItem2,
            oAnchorItem3
        ]);

        // Act
        this.oAnchorNavigationBar.adjustVisibleAnchorItemsAccessibility();

        // Assert
        assert.strictEqual(oAnchorItem1.setPosinset.callCount, 1, "setPosinset was called once");
        assert.strictEqual(oAnchorItem1.setPosinset.args[0][0], 1, "posinset set to 1");
        assert.strictEqual(oAnchorItem1.setSetsize.callCount, 1, "setSetsize was called once");
        assert.strictEqual(oAnchorItem1.setSetsize.args[0][0], 3, "posinset set to 3");

        assert.strictEqual(oAnchorItem2.setPosinset.callCount, 1, "setPosinset was called once");
        assert.strictEqual(oAnchorItem2.setPosinset.args[0][0], 2, "posinset set to 2");
        assert.strictEqual(oAnchorItem2.setSetsize.callCount, 1, "setSetsize was called once");
        assert.strictEqual(oAnchorItem2.setSetsize.args[0][0], 3, "posinset set to 3");

        assert.strictEqual(oAnchorItem3.setPosinset.callCount, 1, "setPosinset was called once");
        assert.strictEqual(oAnchorItem3.setPosinset.args[0][0], 3, "posinset set to 3");
        assert.strictEqual(oAnchorItem3.setSetsize.callCount, 1, "setSetsize was called once");
        assert.strictEqual(oAnchorItem3.setSetsize.args[0][0], 3, "posinset set to 3");
    });

    QUnit.test("addGroup attaches the adjustVisibleAnchorItemsAccessibility function", function (assert) {
        // Arrange
        var oAnchorItem = new AnchorItem();
        sandbox.stub(oAnchorItem, "attachVisibilityChanged");

        // Act
        this.oAnchorNavigationBar.addGroup(oAnchorItem);

        // Assert
        assert.strictEqual(oAnchorItem.attachVisibilityChanged.callCount, 1, "attachVisibilityChanged was called once");
        assert.strictEqual(oAnchorItem.attachVisibilityChanged.args[0][0], this.oAnchorNavigationBar.fnAdjustVisibleAnchorItemsAccessibility,
            "adjustVisibleAnchorItemsAccessibility was attached");
    });

    QUnit.test("insertGroup attaches the adjustVisibleAnchorItemsAccessibility function", function (assert) {
        // Arrange
        var oAnchorItem = new AnchorItem();
        sandbox.stub(oAnchorItem, "attachVisibilityChanged");

        // Act
        this.oAnchorNavigationBar.insertGroup(oAnchorItem);

        // Assert
        assert.strictEqual(oAnchorItem.attachVisibilityChanged.callCount, 1, "attachVisibilityChanged was called once");
        assert.strictEqual(oAnchorItem.attachVisibilityChanged.args[0][0], this.oAnchorNavigationBar.fnAdjustVisibleAnchorItemsAccessibility,
            "adjustVisibleAnchorItemsAccessibility was attached");
    });

    QUnit.test("removeGroup detaches the adjustVisibleAnchorItemsAccessibility function", function (assert) {
        // Arrange
        var oAnchorItem = new AnchorItem();
        sandbox.stub(oAnchorItem, "detachVisibilityChanged");

        // Act
        this.oAnchorNavigationBar.removeGroup(oAnchorItem);

        // Assert
        assert.strictEqual(oAnchorItem.detachVisibilityChanged.callCount, 1, "detachVisibilityChanged was called once");
        assert.strictEqual(oAnchorItem.detachVisibilityChanged.args[0][0], this.oAnchorNavigationBar.fnAdjustVisibleAnchorItemsAccessibility,
            "adjustVisibleAnchorItemsAccessibility was detached");
    });

    QUnit.test("Rearrange on resize", async function (assert) {
        // Arrange
        sandbox.useFakeTimers();
        var oReArrangeNavigationBarStub = sandbox.stub(this.oAnchorNavigationBar, "reArrangeNavigationBarElements");
        this.oAnchorNavigationBar.placeAt("qunit-fixture");

        this.oAnchorNavigationBar.addGroup(new AnchorItem()); // only rendered with at least one group
        await nextUIUpdate();

        var oDomRef = this.oAnchorNavigationBar.getDomRef();
        oReArrangeNavigationBarStub.resetHistory();

        // Act
        oDomRef.style.width = "500px";
        sandbox.clock.next(); // Resize handler reacts not immediately

        assert.strictEqual(oReArrangeNavigationBarStub.callCount, 1, "Rearranged items");
    });

    QUnit.test("Rearrange on resize even after domRef changed", async function (assert) {
        // Arrange
        sandbox.useFakeTimers();
        var oReArrangeNavigationBarStub = sandbox.stub(this.oAnchorNavigationBar, "reArrangeNavigationBarElements");
        this.oAnchorNavigationBar.placeAt("qunit-fixture");
        this.oAnchorNavigationBar.addGroup(new AnchorItem()); // only rendered with at least one group
        await nextUIUpdate();

        var oDomRef = this.oAnchorNavigationBar.getDomRef();
        oReArrangeNavigationBarStub.resetHistory();

        // Act
        oDomRef.style.width = "500px";
        sandbox.clock.next(); // Resize handler reacts not immediately

        // Assert
        assert.strictEqual(oReArrangeNavigationBarStub.callCount, 1, "Rearranged items");
    });

    QUnit.module("AnchorNavigationBar <-> AnchorItem accessibility integration test", {
        beforeEach: function () {
            this.oAnchorNavigationBar = new AnchorNavigationBar({
                groups: [
                    new AnchorItem(),
                    new AnchorItem(),
                    new AnchorItem(),
                    new AnchorItem()
                ]
            }).placeAt("qunit-fixture");
            return nextUIUpdate();
        },

        afterEach: function () {
            this.oAnchorNavigationBar.destroy();
        }
    });

    QUnit.test("correct posinset and setsize on AnchorItems", function (assert) {
        // Assert
        this.oAnchorNavigationBar.getGroups().forEach(function (oAnchorItem, index) {
            var oAnchorItemDomRef = oAnchorItem.getDomRef();
            assert.strictEqual(oAnchorItem.getPosinset(), index + 1, "Posinset property");
            assert.strictEqual(oAnchorItemDomRef.getAttribute("aria-posinset"), (index + 1).toString(), "aria-posinset attribute");
            assert.strictEqual(oAnchorItem.getSetsize(), 4, "Setsize property");
            assert.strictEqual(oAnchorItemDomRef.getAttribute("aria-setsize"), "4", "aria-setsize attribute");
        });
    });

    QUnit.test("correct posinset and setsize on AnchorItems", async function (assert) {
        // Act
        this.oAnchorNavigationBar.getGroups()[2].setVisible(false);
        await nextUIUpdate();

        // Assert
        this.oAnchorNavigationBar.getVisibleGroups().forEach(function (oAnchorItem, index) {
            var oAnchorItemDomRef = oAnchorItem.getDomRef();
            assert.strictEqual(oAnchorItem.getPosinset(), index + 1, "Posinset property");
            assert.strictEqual(oAnchorItemDomRef.getAttribute("aria-posinset"), (index + 1).toString(), "aria-posinset attribute");
            assert.strictEqual(oAnchorItem.getSetsize(), 3, "Setsize property");
            assert.strictEqual(oAnchorItemDomRef.getAttribute("aria-setsize"), "3", "aria-setsize attribute");
        });
    });
});
