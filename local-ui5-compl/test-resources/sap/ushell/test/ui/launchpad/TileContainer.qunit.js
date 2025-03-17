// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/ui/launchpad/TileContainer",
    "sap/ushell/Container",
    "sap/m/Button",
    "sap/ushell/ui/launchpad/GroupHeaderActions",
    "sap/ushell/components/homepage/ActionMode",
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ui/integration/widgets/Card",
    "sap/m/library",
    "sap/ui/thirdparty/jquery"
], function (
    ObjectPath,
    TileContainer,
    Container,
    Button,
    GroupHeaderActions,
    ActionMode,
    Device,
    Config,
    Tile,
    Card,
    library,
    jQuery
) {
    "use strict";

    var HeaderLevel = library.HeaderLevel;

    /* global QUnit, sinon */

    var stub,
        bIsPhone = Device.system.phone,
        oTileContainer,
        oGroupHeaderActionPanel,
        groupHeaderActionData = {
            content: [],
            tileActionModeActive: true,
            isOverflow: false
        },
        testContainer,
        demiItemData = {
            showHeader: false,
            showPlaceholder: false,
            showGroupHeader: true,
            groupHeaderLevel: HeaderLevel.H3,
            showNoData: true,
            tiles: {}
        },
        _prepareTileContainerHeaderActions = function (bShowHeader, bShowMobileHeaderActionsBtn, bAddHeaderActions, bMockPhone) {
            Device.system.phone = bMockPhone;
            if (bAddHeaderActions) {
                var aHeaderActions = [
                    new Button("headerActionBtn1", { text: "headerActionBtn1" }),
                    new Button("headerActionBtn2", { text: "headerActionBtn2" })
                ];
                oGroupHeaderActionPanel.addContent(aHeaderActions[0]);
                oGroupHeaderActionPanel.addContent(aHeaderActions[1]);
                oTileContainer.addHeaderAction(oGroupHeaderActionPanel);
            }
            oGroupHeaderActionPanel.setIsOverflow(bMockPhone);
            oGroupHeaderActionPanel.setTileActionModeActive(bShowMobileHeaderActionsBtn);
            oTileContainer.setTileActionModeActive(bShowMobileHeaderActionsBtn);
            oTileContainer.setShowHeader(bShowHeader);
            oTileContainer.setShowMobileActions(bShowMobileHeaderActionsBtn);
            oTileContainer.placeAt("testContainer");
        },
        _prepareTileContainerEditFlags = function (bEditMode, bIsGroupLocked, bIsDefaultGroup, bIsTileActionModeActive) {
            oTileContainer.setShowHeader(true);
            oTileContainer.setEditMode(bEditMode);
            oTileContainer.setIsGroupLocked(bIsGroupLocked);
            oTileContainer.setDefaultGroup(bIsDefaultGroup);
            oTileContainer.setTileActionModeActive(bIsTileActionModeActive);
            oTileContainer.placeAt("testContainer");
        },
        _prepareTileContainerBeforeContent = function (bAddBeforeContent) {
            if (bAddBeforeContent) {
                var oBeforeContentBtn = new Button("beforeContentBtn", { text: "beforeContentBtn" });
                oTileContainer.addBeforeContent(oBeforeContentBtn);
            }
            oTileContainer.setShowHeader(true);
            oTileContainer.placeAt("testContainer");
        };

    QUnit.module("sap.ushell.ui.launchpad.TileContainer", {
        beforeEach: function (assert) {
            var done = assert.async();
            Container.init("local")
                .then(function () {
                    oTileContainer = new TileContainer(demiItemData);
                    oGroupHeaderActionPanel = new GroupHeaderActions(groupHeaderActionData);
                    testContainer = jQuery("<div id=\"testContainer\">").appendTo("body");

                    ObjectPath.create("sap.ushell.components.homepage.ActionMode");
                    if (ActionMode.activateGroupEditMode) {
                        stub = sinon.stub(ActionMode, "activateGroupEditMode");
                    } else {
                        ActionMode.activateGroupEditMode = function () { };
                    }

                    Config.emit("/core/home/sizeBehavior", "Responsive");
                    Config.once("/core/home/sizeBehavior").do(done);
                });
        },

        // This method is called after each test. Add every restoration code here.
        afterEach: function () {
            if (stub) {
                stub.restore();
            }
            Device.system.phone = bIsPhone;
            oTileContainer.destroy();
            oGroupHeaderActionPanel.destroy();
            jQuery(testContainer).remove();
        }
    });

    function _addHeaderActionsAggregationTestHelper (assert, bExpectHeaderClassAdded, bExpectHeaderActionsButtonAdded, bExpectHeaderActionsAdded) {
        var done = assert.async();
        window.setTimeout(function () {
            var bSapHeaderActionsClassAdded = testContainer.find(".sapUshellContainerHeaderActions").length > 0,
                bHeaderActionsButtonAdded = testContainer.find(".sapUshellHeaderActionButton").length > 0,
                bHeaderActionsAdded = (testContainer.find("#headerActionBtn1").length && testContainer.find("#headerActionBtn2").length) > 0;

            if (typeof bExpectHeaderClassAdded !== "undefined") {
                assert.ok(bSapHeaderActionsClassAdded === bExpectHeaderClassAdded, "Header Actions class:sapUshellContainerHeaderActions is added ");
            }
            if (typeof bExpectHeaderActionsButtonAdded !== "undefined") {
                assert.ok(bHeaderActionsButtonAdded === bExpectHeaderActionsButtonAdded, "Header actions mobile button added");
            }
            if (typeof bExpectHeaderActionsAdded !== "undefined") {
                assert.ok(bHeaderActionsAdded === bExpectHeaderActionsAdded, "Both header actions added");
            }
            done();
        }, 0);
    }

    QUnit.test("Add header Actions aggregation - non mobile scenario test", function (assert) {
        _prepareTileContainerHeaderActions(true, true, true, false);
        _addHeaderActionsAggregationTestHelper(assert, true, undefined, true);
    });

    QUnit.test("Add header Actions aggregation test - mobile  scenario test", function (assert) {
        _prepareTileContainerHeaderActions(true, true, true, true);
        _addHeaderActionsAggregationTestHelper(assert, true, true, false);
    });

    QUnit.test("Add header Actions aggregation when showMobileActions is false - mobile  scenario test", function (assert) {
        _prepareTileContainerHeaderActions(true, false, true, true);
        _addHeaderActionsAggregationTestHelper(assert, undefined, false, false);
    });

    QUnit.test("Add header Actions aggregation when showHeader is false test", function (assert) {
        _prepareTileContainerHeaderActions(false, true, true, true);
        _addHeaderActionsAggregationTestHelper(assert, false, false, false);
    });

    QUnit.test("Add header Actions aggregation when showMobileActions is false - non mobile scenario", function (assert) {
        _prepareTileContainerHeaderActions(true, false, true, false);
        _addHeaderActionsAggregationTestHelper(assert, false, false, false);
    });

    QUnit.test("No header Actions aggregation test - mobile scenario", function (assert) {
        _prepareTileContainerHeaderActions(true, true, false, true);
        _addHeaderActionsAggregationTestHelper(assert, true, false, false);
    });

    QUnit.test("No header Actions aggregation when showMobileActions is true - mobile scenario", function (assert) {
        _prepareTileContainerHeaderActions(true, true, false, false);
        _addHeaderActionsAggregationTestHelper(assert, true, false, false);
    });

    var _tileContainerTitleSimulateClickTestHelper = function (assert, bExpectInputFieldBeforeClick, bExpectInputFieldAfterClick) {
        var done = assert.async();
        window.setTimeout(function () {
            var bInputFieldBeforeClick = testContainer.find(".sapUshellTileContainerTitleInput").length > 0,
                jqTileContainerTitle = testContainer.find(".sapUshellContainerTitle");

            jqTileContainerTitle.trigger("click");
            setTimeout(function () {
                var bInputFieldAfterClick = testContainer.find(".sapUshellTileContainerTitleInput").length > 0;

                assert.ok(bInputFieldBeforeClick === bExpectInputFieldBeforeClick, "Input Field  did not exist  before simulating click on tile Container Title");
                assert.ok(bInputFieldAfterClick === bExpectInputFieldAfterClick, "Input Field added after simulating click on tile Container Title");
                done();
            }, 100);
        }, 0);
    };

    QUnit.test("Tile Container Header Edit mode - simulate click test", function (assert) {
        _prepareTileContainerEditFlags(false, false, false, true);
        _tileContainerTitleSimulateClickTestHelper(assert, false, true);
    });

    QUnit.test("Tile Container Header Edit mode - simulate click when group is locked", function (assert) {
        _prepareTileContainerEditFlags(false, true, false, true);
        _tileContainerTitleSimulateClickTestHelper(assert, false, false);
    });

    QUnit.test("Tile Container Header Edit mode - simulate click when group is Default", function (assert) {
        _prepareTileContainerEditFlags(false, false, true, true);
        _tileContainerTitleSimulateClickTestHelper(assert, false, false);
    });

    QUnit.test("Tile Container Header Edit mode - simulate click when Action Mode is not Active", function (assert) {
        _prepareTileContainerEditFlags(false, false, false, false);
        _tileContainerTitleSimulateClickTestHelper(assert, false, false);
    });

    QUnit.test("Tile Container Header Edit mode test - when editMode is true", function (assert) {
        var done = assert.async();
        _prepareTileContainerEditFlags(true, false, false, false);
        window.setTimeout(function () {
            var bInputFieldExist = testContainer.find(".sapUshellTileContainerTitleInput").length > 0;

            assert.ok(bInputFieldExist, "Input Field exists");
            done();
        }, 200);
    });

    var _tileContainerBeforeContentTestHelper = function (assert, bExpectBeforeContentDivAdded, bExpectBeforeContentBtnAdded) {
        var done = assert.async();
        window.setTimeout(function () {
            var jqBeforeContentDiv = testContainer.find(".sapUshellTileContainerBeforeContent"),
                bBeforeContentDivAdded = jqBeforeContentDiv.length > 0,
                bBeforeContentBtnAdded = bBeforeContentDivAdded ? (jqBeforeContentDiv.find("#beforeContentBtn").length > 0) : false;

            assert.ok(bBeforeContentDivAdded === bExpectBeforeContentDivAdded, "BeforeContent div exists");
            assert.ok(bBeforeContentBtnAdded === bExpectBeforeContentBtnAdded, "BeforeContent button exists");
            done();
        }, 0);
    };

    QUnit.test("Tile Container test with BeforeContent aggregation in edit mode", function (assert) {
        _prepareTileContainerBeforeContent(true);
        oTileContainer.setTileActionModeActive(true);
        _tileContainerBeforeContentTestHelper(assert, true, true);
    });

    QUnit.test("Tile Container test with BeforeContent aggregation", function (assert) {
        _prepareTileContainerBeforeContent(true);
        oTileContainer.setTileActionModeActive(false);
        _tileContainerBeforeContentTestHelper(assert, false, false);
    });

    QUnit.test("Tile Container test - No BeforeContent aggregation", function (assert) {
        _prepareTileContainerBeforeContent(false);
        _tileContainerBeforeContentTestHelper(assert, false, false);

        window.setTimeout(function () {
            assert.ok(!jQuery(".sapUshellSmall").length, "sapUshellSmall class should not be added because the sizeBehavior parameter is Responsive");
        }, 0);
    });

    QUnit.test("Tile Container test - small tiles test", function (assert) {
        var done = assert.async();
        Config.emit("/core/home/sizeBehavior", "Small");
        oTileContainer.addTile(new Tile());
        oTileContainer.placeAt("testContainer");

        setTimeout(function () {
            assert.ok(jQuery(".sapUshellSmall").length, "sapUshellSmall class sould be added because the sizeBehavior parameter is Small");
            done();
        }, 0);
    });

    QUnit.module("The function onAfterRendering", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();
            this.oResizeCardsStub = sinon.stub(this.oTileContainer, "_resizeCards");
            this.oGetAttributeStub = sinon.stub();
            this.oSetAttributeStub = sinon.stub();
            this.fnGetDomRef = sinon.stub().returns({
                getAttribute: this.oGetAttributeStub,
                setAttribute: this.oSetAttributeStub
            });

            this.oGetLinksStub = sinon.stub(this.oTileContainer, "getLinks").returns([]);

            this.oGetTilesStub = sinon.stub(this.oTileContainer, "getTiles").returns([
                {
                    isA: function () { return false; },
                    getDomRef: this.fnGetDomRef},
                {
                    isA: function () { return true; },
                    getDomRef: this.fnGetDomRef},
                {
                    isA: function () { return false; },
                    getDomRef: this.fnGetDomRef},
                {
                    isA: function () { return true; },
                    getDomRef: this.fnGetDomRef
                }
            ]);
        },
        afterEach: function () {
            this.oTileContainer.destroy();
            this.oResizeCardsStub.restore();
            this.oGetTilesStub.restore();
            this.oGetLinksStub.restore();
        }
    });

    QUnit.test("Calls the _resizeCards function", function (assert) {
        // Act
        this.oTileContainer.onAfterRendering();

        // Assert
        assert.ok(this.oResizeCardsStub.calledOnce, "The function _resizeCards was called once.");
        assert.strictEqual(this.oResizeCardsStub.args[0][0].length, 2, "The function _resizeCards was called with an array of two card objects.");
    });

    QUnit.test("Stores the tabindex in data-oldTabindex", function (assert) {
        // Arrange
        this.oGetAttributeStub.returns("test-old-tabindex");
        this.oGetTilesStub.returns([{
            id: "test-tile-1",
            isA: function () { return false; },
            getDomRef: this.fnGetDomRef
        }, {
            id: "test-tile-2",
            isA: function () { return false; },
            getDomRef: this.fnGetDomRef
        }]);

        this.oGetLinksStub.returns([{
            id: "test-link-1",
            isA: function () { return false; },
            getDomRef: this.fnGetDomRef
        }, {
            id: "test-link-2",
            isA: function () { return false; },
            getDomRef: this.fnGetDomRef
        }, {
            id: "test-tile-3",
            isA: function () { return false; },
            getDomRef: function () { return undefined; }
        }]);

        this.oGetAttributeStub.onCall(0).returns("test-tabindex-tile");
        this.oGetAttributeStub.onCall(1).returns(undefined);
        this.oGetAttributeStub.onCall(2).returns("test-tabindex-link1");
        this.oGetAttributeStub.onCall(3).returns("test-tabindex-link2");



        // Act
        this.oTileContainer.onAfterRendering();

        // Assert
        assert.strictEqual(this.oGetAttributeStub.callCount, 4, "The function getAttribute was called four times.");
        assert.deepEqual(this.oGetAttributeStub.args, [["tabindex"], ["tabindex"], ["tabindex"], ["tabindex"]], "The function getAttribute was called with the expected arguments.");
        assert.strictEqual(this.oSetAttributeStub.callCount, 7, "The function getAttribute was called 7 times.");
        assert.deepEqual(this.oSetAttributeStub.args, [
            ["data-oldTabindex", "test-tabindex-tile"],
            ["tabindex", "-1"],
            ["tabindex", "-1"],
            ["data-oldTabindex", "test-tabindex-link1"],
            ["tabindex", "-1"],
            ["data-oldTabindex", "test-tabindex-link2"],
            ["tabindex", "-1"]
        ], "The function setAttribute was called with the expected arguments.");
    });

    QUnit.module("The function onBeforeRendering", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();
            this.oGetAttributeStub = sinon.stub();
            this.oSetAttributeStub = sinon.stub();
            this.oRemoveAttributeStub = sinon.stub();
            this.fnGetDomRef = sinon.stub().returns({
                getAttribute: this.oGetAttributeStub,
                setAttribute: this.oSetAttributeStub,
                removeAttribute: this.oRemoveAttributeStub
            });

            this.oGetTilesStub = sinon.stub(this.oTileContainer, "getTiles").returns([{
                id: "test-tile-1",
                getDomRef: this.fnGetDomRef
            }, {
                id: "test-tile-2",
                getDomRef: this.fnGetDomRef
            }]);

            this.oGetLinksStub = sinon.stub(this.oTileContainer, "getLinks").returns([{
                id: "test-link-1",
                getDomRef: this.fnGetDomRef
            }, {
                id: "test-link-2",
                getDomRef: this.fnGetDomRef
            }, {
                id: "test-link-3",
                getDomRef: function () { return undefined; }
            }]);

            this.oGetAttributeStub.onCall(0).returns("test-tabindex-tile");
            this.oGetAttributeStub.onCall(1).returns(undefined);
            this.oGetAttributeStub.onCall(2).returns("test-tabindex-link1");
            this.oGetAttributeStub.onCall(3).returns("test-tabindex-link2");
        },
        afterEach: function () {
            this.oTileContainer.destroy();
            this.oGetTilesStub.restore();
            this.oGetLinksStub.restore();
        }
    });

    QUnit.test("sets the old tabindex value", function (assert) {
       // Act
       this.oTileContainer.onBeforeRendering();

       // Assert
        assert.strictEqual(this.oGetAttributeStub.callCount, 4, "The function getAttribute was called four times.");
        assert.deepEqual(this.oGetAttributeStub.args, [
            ["data-oldTabindex"],
            ["data-oldTabindex"],
            ["data-oldTabindex"],
            ["data-oldTabindex"]
        ], "The function getAttribute was called with the expected arguments.");
        assert.strictEqual(this.oSetAttributeStub.callCount, 3, "The function getAttribute was called 3 times.");
        assert.deepEqual(this.oSetAttributeStub.args, [
            ["tabindex", "test-tabindex-tile"],
            ["tabindex", "test-tabindex-link1"],
            ["tabindex", "test-tabindex-link2"]
        ], "The function setAttribute was called with the expected arguments.");

        assert.deepEqual(this.oRemoveAttributeStub.args, [
            ["data-oldTabindex"],
            ["tabindex"],
            ["data-oldTabindex"],
            ["data-oldTabindex"]
        ], "The function removeAttribute was called with the expected arguments.");
    });

    QUnit.module("The function _resizeCards", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();
            this.oWindowMatchMediaStub = sinon.stub(window, "matchMedia").returns({
                matches: false
            });
        },
        afterEach: function () {
            this.oTileContainer.destroy();
            this.oWindowMatchMediaStub.restore();
        }
    });

    QUnit.test("Sets the right card dimensions according to the manifest", function (assert) {
        // Arrange
        var oFirstCard = new Card({ manifest: { "sap.flp": { columns: 4, rows: 2 } } }),
            oSecondCard = new Card({ manifest: { "sap.flp": { columns: 5, rows: 1 } } }),
            aCards = [oFirstCard, oSecondCard];

        // Act
        this.oTileContainer._resizeCards(aCards);

        // Assert
        assert.strictEqual(oFirstCard.getWidth(), "22.4375rem", "The first card has the right width when the manifest parameter sap.flp.columns is equal to 4.");
        assert.strictEqual(oFirstCard.getHeight(), "11.4375rem", "The first card has the right height when the manifest parameter sap.flp.rows is equal to 2.");
        assert.strictEqual(oSecondCard.getWidth(), "28.375rem", "The second card has the right width when the manifest parameter sap.flp.columns is equal to 5.");
        assert.strictEqual(oSecondCard.getHeight(), "5.5rem", "The second card has the right height when the manifest parameter sap.flp.rows is equal to 1.");
    });

    QUnit.module("The function exit", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();

            this.aDestroyStubs = [
                "oNoLinksText",
                "oTransformationErrorText",
                "oTransformationErrorIcon",
                "oIcon",
                "oPlusTile",
                "oEditInputField"
            ].map(function (sInnerControlName) {
                return sinon.stub(this.oTileContainer[sInnerControlName], "destroy");
            }.bind(this));
        },
        afterEach: function () {
            this.oTileContainer.destroy();
            this.aDestroyStubs.forEach(function (oStub) {
                oStub.restore();
            });
        }
    });

    QUnit.test("Destroys all controls", function (assert) {
        // Act
        this.oTileContainer.exit();

        // Assert
        this.aDestroyStubs.forEach(function (oStub) {
            assert.strictEqual(oStub.callCount, 1, "Destroy was called for each internal control.");
        });
    });
});
