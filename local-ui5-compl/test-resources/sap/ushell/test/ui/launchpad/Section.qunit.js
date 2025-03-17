// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/library",
    "sap/ui/core/Lib",
    "sap/ui/core/library",
    "sap/ushell/resources",
    "sap/ushell/Container",
    "sap/ushell/ui/launchpad/Section",
    "sap/ushell/ui/launchpad/ExtendedChangeDetection",
    "sap/ui/model/Model",
    "sap/ui/model/Context",
    "sap/ui/model/json/JSONModel",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/library"
], function (
    GenericTile,
    mobileLibrary,
    Library,
    coreLibrary,
    resources,
    Container,
    Section,
    ExtendedChangeDetection,
    Model,
    Context,
    JSONModel,
    nextUIUpdate,
    ushellLibrary
) {
    "use strict";

    /* global QUnit, sinon */

    var TileSizeBehavior = mobileLibrary.TileSizeBehavior;
    var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;
    var DisplayFormat = ushellLibrary.DisplayFormat;

    var sandbox = sinon.createSandbox({});

    QUnit.module("Page constructor");

    QUnit.test("ExtendedChangeDetection setup", function (assert) {
        // Arrange
        // Act
        var oSection = new Section();

        // Assert
        assert.ok(oSection._oDefaultItemsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved for default items");
        assert.deepEqual(oSection._oDefaultItemsChangeDetection._aSiblingAggregationNames, ["flatItems", "compactItems"], "the correct siblings were set for defaultItems");
        assert.ok(oSection._oFlatItemsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved for flat items");
        assert.deepEqual(oSection._oFlatItemsChangeDetection._aSiblingAggregationNames, ["defaultItems", "compactItems"], "the correct siblings were set for flatItems");
        assert.ok(oSection._oCompactItemsChangeDetection instanceof ExtendedChangeDetection, "ExtendedChangeDetection instance was saved for compact items");
        assert.deepEqual(oSection._oCompactItemsChangeDetection._aSiblingAggregationNames, ["defaultItems", "flatItems"], "the correct siblings were set for compactItems");

        // Cleanup
        oSection.destroy();
    });

    QUnit.module("Section defaults", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oSection.getEditable(), false,
            "Default Value of property editable is: false");
        assert.strictEqual(this.oSection.getDataHelpId(), "",
            "Default Value of property dataHelpId is: \"\"");
        assert.strictEqual(this.oSection.getDefault(), false,
            "Default Value of property default is: false");
        assert.strictEqual(this.oSection.getEnableAddButton(), true,
            "Default Value of property enableAddButton is: true");
        assert.strictEqual(this.oSection.getEnableDeleteButton(), true,
            "Default Value of property enableDeleteButton is: true");
        assert.strictEqual(this.oSection.getEnableGridBreakpoints(), false,
            "Default Value of property enableGridBreakpoints is: false");
        assert.strictEqual(this.oSection.getEnableGridContainerQuery(), false,
            "Default Value of property enableGridContainerQuery is: false");
        assert.strictEqual(this.oSection.getEnableResetButton(), true,
            "Default Value of property enableResetButton is: true");
        assert.strictEqual(this.oSection.getEnableShowHideButton(), true,
            "Default Value of property enableShowHideButton is: true");
        assert.strictEqual(this.oSection.getEnableVisualizationReordering(), false,
            "Default Value of property enableVisualizationReordering is: false");
        assert.strictEqual(this.oSection.getNoVisualizationsText(), resources.i18n.getText("Section.NoVisualizationsText"),
            "Default Value of property noVisualizationsText is: " + resources.i18n.getText("Section.NoVisualizationsText"));
        assert.strictEqual(this.oSection.getTitle(), "",
            "Default Value of property title is: \"\"");
        assert.strictEqual(this.oSection.getShowNoVisualizationsText(), false,
            "Default Value of property showNoVisualizationsText is: false");
        assert.strictEqual(this.oSection.getShowSection(), true,
            "Default Value of property showSection is: true");
        assert.strictEqual(this.oSection.getSizeBehavior(), TileSizeBehavior.Responsive,
            "Default Value of property sizeBehavior is: " + TileSizeBehavior.Responsive);
        assert.strictEqual(this.oSection.getGridContainerGap(), "0.5rem",
            "Default Value of property gridContainerGap is: 0.5rem");
        assert.strictEqual(this.oSection.getGridContainerGapXL(), "0.5rem",
            "Default Value of property gridContainerGapXL is: 0.5rem");
        assert.strictEqual(this.oSection.getGridContainerGapL(), "0.5rem",
            "Default Value of property gridContainerGapL is: 0.5rem");
        assert.strictEqual(this.oSection.getGridContainerGapM(), "0.5rem",
            "Default Value of property gridContainerGapM is: 0.5rem");
        assert.strictEqual(this.oSection.getGridContainerGapS(), "0.475rem",
            "Default Value of property gridContainerGapS is: 0.475rem");
        assert.strictEqual(this.oSection.getGridContainerGapXS(), "0.475rem",
            "Default Value of property gridContainerGapXS is: 0.475rem");
        assert.strictEqual(this.oSection.getGridContainerRowSize(), "5.25rem",
            "Default Value of property gridContainerRowSize is: 5.25rem");
        assert.strictEqual(this.oSection.getGridContainerRowSizeXL(), "5.25rem",
            "Default Value of property gridContainerRowSizeXL is: 5.25rem");
        assert.strictEqual(this.oSection.getGridContainerRowSizeL(), "5.25rem",
            "Default Value of property gridContainerRowSizeL is: 5.25rem");
        assert.strictEqual(this.oSection.getGridContainerRowSizeM(), "5.25rem",
            "Default Value of property gridContainerRowSizeM is: 5.25rem");
        assert.strictEqual(this.oSection.getGridContainerRowSizeS(), "5.25rem",
            "Default Value of property gridContainerRowSizeS is: 5.25rem");
        assert.strictEqual(this.oSection.getGridContainerRowSizeXS(), "4.375rem",
            "Default Value of property gridContainerRowSizeS is: 4.375rem");

    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oSection.getVisualizations().length > 0, false, "Visualization Aggregation is initially: empty");
    });

    QUnit.test("add event", async function (assert) {
        // Arrange
        var fnAddSpy = sinon.spy();

        this.oSection.attachAdd(fnAddSpy);

        this.oSection.setEditable(true);
        await nextUIUpdate();

        // Act
        this.oSection.getAggregation("_header").getContent()[4].firePress();

        // Assert
        assert.strictEqual(fnAddSpy.called, true, "The add event was fired");
    });

    QUnit.test("delete event", async function (assert) {
        // Arrange
        var fnDeleteSpy = sinon.spy();

        this.oSection.attachDelete(fnDeleteSpy);

        this.oSection.setEditable(true);
        await nextUIUpdate();

        // Act
        this.oSection.getAggregation("_header").getContent()[7].firePress();

        // Assert
        assert.strictEqual(fnDeleteSpy.called, true, "The delete event was fired");
    });

    QUnit.test("reset event", async function (assert) {
        // Arrange
        var fnResetSpy = sinon.spy();

        this.oSection.attachReset(fnResetSpy);

        this.oSection.setEditable(true);
        await nextUIUpdate();

        // Act
        this.oSection.getAggregation("_header").getContent()[6].firePress();

        // Assert
        assert.strictEqual(fnResetSpy.called, true, "The reset event was fired");
    });

    QUnit.test("titleChange event", async function (assert) {
        // Arrange
        var fnTitleChangeSpy = sinon.spy();

        this.oSection.attachTitleChange(fnTitleChangeSpy);

        this.oSection.setEditable(true);
        await nextUIUpdate();

        // Act
        this.oSection.getAggregation("_header").getContent()[2].fireChange();

        // Assert
        assert.strictEqual(fnTitleChangeSpy.called, true, "The titleChange event was fired");
    });

    QUnit.test("visualizations aggregation with a GenericTile", async function (assert) {
        // Arrange
        await Container.init("local");
        var oGenericTile = new GenericTile();
        oGenericTile.setBindingContext(new Context(new Model(), "/fake/2"));
        var oGenericTile2 = new GenericTile();
        oGenericTile2.setBindingContext(new Context(new Model(), "/fake/1"));

        // Act
        this.oSection.addAggregation("defaultItems", oGenericTile);
        this.oSection.insertAggregation("defaultItems", oGenericTile2);
        await nextUIUpdate();

        // Assert
        var oFirstVisualization = this.oSection.getVisualizations()[0];
        var oLayoutData = oFirstVisualization.getLayoutData();
        assert.strictEqual(this.oSection.getVisualizations().length, 2,
            "The 2 visualizations were added correctly");
        assert.strictEqual(oLayoutData.getRows(), 2,
            "The first visualization received layout data with the correct amount of rows.");
        assert.strictEqual(oLayoutData.getColumns(), 2,
            "The first visualization received layout data with the correct amount of columns.");
        assert.strictEqual(oFirstVisualization.getBindingContext().getPath(), "/fake/1",
            "The visualizations are returned in the correct order, i.e. as defined in the model.");
    });

    QUnit.test("check that the correct default classes are assigned", async function (assert) {
        // Arrange & Act
        await nextUIUpdate();

        // Assert
        var oClassList = this.oSection.getDomRef().classList;
        assert.strictEqual(oClassList.contains("sapUshellSection"), true,
            "The section has the class: \"sapUshellSection\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionEdit"), false,
            "The section does not have the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionHidden"), false,
            "The section does not have the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned during edit", async function (assert) {
        // Arrange
        this.oSection.setEditable(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oClassList = this.oSection.getDomRef().classList;
        assert.strictEqual(oClassList.contains("sapUshellSection"), true,
            "The section has the class: \"sapUshellSection\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionEdit"), true,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionHidden"), false,
            "The section does not have the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned when not editable, but hidden", async function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        await nextUIUpdate();

        // Act
        this.oSection.getAggregation("_header").getContent()[5].firePress();

        this.oSection.setEditable(false);
        await nextUIUpdate();

        // Assert
        var oClassList = this.oSection.getDomRef().classList;
        assert.strictEqual(oClassList.contains("sapUshellSection"), true,
            "The section has the class: \"sapUshellSection\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionEdit"), false,
            "The section does not have the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionHidden"), true,
            "The section has the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned during edit and hidden", async function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        await nextUIUpdate();

        // Act
        this.oSection.getAggregation("_header").getContent()[5].firePress();

        // Assert
        var oClassList = this.oSection.getDomRef().classList;
        assert.strictEqual(oClassList.contains("sapUshellSection"), true,
            "The section has the class: \"sapUshellSection\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionEdit"), true,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oClassList.contains("sapUshellSectionHidden"), true,
            "The section has the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is empty", async function (assert) {
        // Act
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oSection.getDomRef();
        assert.strictEqual(oDomRef.getAttribute("data-help-id"), null, "data-help-id attribute is not set.");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is set", async function (assert) {
        // Arrange
        this.oSection.setDataHelpId("someId");

        // Act
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oSection.getDomRef();
        assert.strictEqual(oDomRef.getAttribute("data-help-id"), "someId", "data-help-id attribute is set to \"someId\".");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is empty, but it is the default section", async function (assert) {
        // Arrange
        this.oSection.setDefault(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oSection.getDomRef();
        assert.strictEqual(oDomRef.getAttribute("data-help-id"), "recently-added-apps", "data-help-id attribute is set to \"recently-added-apps\".");
    });

    QUnit.test("check that the help id custom data is correct if dataHelpId is set, but it is the default section", async function (assert) {
        // Arrange
        this.oSection.setDefault(true);
        this.oSection.setDataHelpId("someId");

        // Act
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oSection.getDomRef();
        assert.strictEqual(oDomRef.getAttribute("data-help-id"), "recently-added-apps", "data-help-id attribute is set to \"recently-added-apps\".");
    });

    QUnit.module("setEditable", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oSection = null;
        }
    });

    QUnit.test("Setter for setEditable property returns this", function (assert) {
        // Act
        var oReturn = this.oSection.setEditable(true);

        // Assert
        assert.strictEqual(oReturn, this.oSection, "'this' reference returned");
    });

    QUnit.test("Property not changed for 'editable' property prevents rendering", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        var oSpy = sinon.spy(this.oSection, "invalidate");
        var oSpySetProperty = sinon.spy(this.oSection, "setProperty");

        // Act
        this.oSection.setEditable(true);

        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation expected.");
        assert.strictEqual(oSpySetProperty.callCount, 0, "'setProperty' not called");
    });

    QUnit.test("Setter call for property 'editable' does nothing with value 'undefined'", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oSection, "setProperty");

        // Act
        this.oSection.setEditable();

        // Assert
        assert.strictEqual(oSpy.callCount, 0, "'setProperty' not called");
    });

    QUnit.module("setShowSection", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oSection = null;
        }
    });

    QUnit.test("Setter for property 'showSection' returns this", function (assert) {
        // Act
        var oReturn = this.oSection.setShowSection(true);
        // Assert
        assert.strictEqual(oReturn, this.oSection, "'this' reference returned");
    });

    QUnit.test("Property change for showSection property prevents rendering", function (assert) {
        // Arrange
        this.oSection.setShowSection(false);
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setShowSection(true);
        // Assert
        assert.ok(oSpy.calledOnceWith("showSection", true, true), "No invalidation for showSection");
    });

    QUnit.test("Setter for property 'showSection' does nothing if value is undefined", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setShowSection();
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation for showSection");
    });

    QUnit.test("Setter for property 'showSection' does nothing if value is same", function (assert) {
        // Arrange
        this.oSection.setShowSection(false);
        var oSpy = sinon.spy(this.oSection, "setProperty");
        // Act
        this.oSection.setShowSection(false);
        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation for showSection");
    });

    QUnit.module("Section aria-label", {
        beforeEach: function () {
            this.oSection = new Section({
                ariaLabel: resources.i18n.getText("Section.Description.EmptySectionAriaLabel", [1])
            });
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("Section renders the aria-label to the DOM", async function (assert) {
        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oSection.getDomRef().getAttribute("aria-label"),
            resources.i18n.getText("Section.Description.EmptySectionAriaLabel", [1]),
            "aria-label is as expected.");
    });

    QUnit.test("Section renders the changed aria-label to the DOM", async function (assert) {
        // Arrange
        this.oSection.setAriaLabel(resources.i18n.getText("Section.Description", ["Some Title"]));

        // Act
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oSection.getDomRef().getAttribute("aria-label"),
            resources.i18n.getText("Section.Description", ["Some Title"]),
            "aria-label is as expected.");
    });

    QUnit.module("The function destroy", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oInvisibleMessageDestroyStub = sandbox.stub(this.oSection._oInvisibleMessageInstance, "destroy");
            this.oDefaultItemsChangeDetectionDestroyStub = sandbox.stub(this.oSection._oDefaultItemsChangeDetection, "destroy");
            this.oFlatItemsChangeDetectionDestroyStub = sandbox.stub(this.oSection._oFlatItemsChangeDetection, "destroy");
            this.oCompactItemsChangeDetectionDestroyStub = sandbox.stub(this.oSection._oCompactItemsChangeDetection, "destroy");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("InvisibleMessage was destroyed", function (assert) {
        // Act
        this.oSection.destroy();

        // Assert
        assert.strictEqual(this.oInvisibleMessageDestroyStub.callCount, 1,
            "InvisibleMessage was destroyed correctly.");
    });

    QUnit.test("ChangeDetection instances were destroyed", function (assert) {
        // Act
        this.oSection.destroy();

        // Assert
        assert.strictEqual(this.oDefaultItemsChangeDetectionDestroyStub.callCount, 1, "defaultItemsChangeDetection was destroyed correctly.");
        assert.strictEqual(this.oFlatItemsChangeDetectionDestroyStub.callCount, 1, "flatItemsChangeDetection was destroyed correctly.");
        assert.strictEqual(this.oCompactItemsChangeDetectionDestroyStub.callCount, 1, "compactItemsChangeDetection was destroyed correctly.");
    });

    QUnit.module("The _showHidePressed function", {
        beforeEach: function () {
            this.oSection = new Section({
                editable: true
            });
            this.oSection.placeAt("qunit-fixture");

            this.oFireSectionVisibilityChangeStub = sandbox.stub(this.oSection, "fireSectionVisibilityChange");
            this.oAnnounceStub = sandbox.stub(this.oSection._oInvisibleMessageInstance, "announce");
            this.oMResources = Library.getResourceBundleFor("sap.m");
        },
        afterEach: function () {
            sandbox.restore();
            this.oSection.destroy();
        }
    });

    QUnit.test("announcement was done and event was fired, if Section is hidden", async function (assert) {
        // Arrange
        this.oSection.setShowSection(false);
        await nextUIUpdate();
        this.oFireSectionVisibilityChangeStub.reset();

        // Act
        this.oSection.getAggregation("_header").getContent()[5].firePress();
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnnounceStub.callCount, 1, "Announcement was done once.");
        assert.deepEqual(this.oAnnounceStub.args[0], [
            [
                resources.i18n.getText("Section.nowBeingShown"),
                resources.i18n.getText("Section.ButtonLabelChanged"),
                resources.i18n.getText("Section.Button.Hide"),
                this.oMResources.getText("ACC_CTR_TYPE_BUTTON")
            ].join(" "),
            InvisibleMessageMode.Polite
        ], "Announcement was correct.");
        assert.strictEqual(this.oFireSectionVisibilityChangeStub.callCount, 1, "visibilityChange event was fired once.");
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.args[0], [{ visible: true }],
            "correct value was passed to event handler");
    });

    QUnit.test("announcement was done and event was fired, if Section is shown", async function (assert) {
        // Arrange
        this.oSection.setShowSection(true);
        await nextUIUpdate();
        this.oFireSectionVisibilityChangeStub.reset();

        // Act
        this.oSection.getAggregation("_header").getContent()[5].firePress();
        await nextUIUpdate();

        // Assert
        assert.strictEqual(this.oAnnounceStub.callCount, 1, "Announcement was done once.");
        assert.deepEqual(this.oAnnounceStub.args[0], [
            [
                resources.i18n.getText("Section.nowBeingHidden"),
                resources.i18n.getText("Section.ButtonLabelChanged"),
                resources.i18n.getText("Section.Button.Show"),
                this.oMResources.getText("ACC_CTR_TYPE_BUTTON")
            ].join(" "),
            InvisibleMessageMode.Polite
        ], "Announcement was correct.");
        assert.strictEqual(this.oFireSectionVisibilityChangeStub.callCount, 1, "visibilityChange event was fired once.");
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.args[0], [{ visible: false }],
            "correct value was passed to event handler");
    });

    QUnit.module("getVisualizations", {
        beforeEach: function () {
            this.aItems = [{
                id: "11",
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/items/11")
                })
            }, {
                id: "2",
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/items/2")
                })
            }, {
                id: "1",
                getBindingContext: sandbox.stub().returns({
                    getPath: sandbox.stub().returns("/items/1")
                })
            }];

            this.oSection = new Section();

            sandbox.stub(this.oSection, "getAllItems").returns(this.aItems);
        },
        afterEach: function () {
            sandbox.restore();
            this.oSection.destroy();
        }
    });

    QUnit.test("Sorts the items numerical by index", function (assert) {
        // Arrange
        var aExpectedResult = ["1", "2", "11"];

        // Act
        var aResult = this.oSection.getVisualizations();
        var aResultIndices = aResult.map(function (oItem) {
            return oItem.id;
        });

        // Assert
        assert.deepEqual(aResultIndices, aExpectedResult, "Returned the correct result");
    });

    QUnit.module("displayFormatHint", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("Handle displayFormatHint 'tile' & 'default' like 'standard' (legacy check)", function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "default" },
                { displayFormatHint: "tile" },
                { displayFormatHint: "standard" },
                {}
            ]
        });
        var oBindingInfo = {
            path: "/viz",
            factory: function () {
                return new GenericTile();
            }
        };

        // Act
        this.oSection.setModel(oModel);
        this.oSection.bindVisualizations(oBindingInfo);

        // Assert
        assert.equal(this.oSection.getDefaultItems().length, 4, "All visualizations in 'default'");
        assert.equal(this.oSection.getAllItems().length, 4, "All visualizations there");
    });

    QUnit.test("Handle displayFormatHint 'tile' like 'default' (legacy check)", function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "foobar" }
            ]
        });
        var oBindingInfo = {
            path: "/viz",
            factory: function (oData) {
                return new GenericTile();
            }
        };

        // Act
        this.oSection.setModel(oModel);
        this.oSection.bindVisualizations(oBindingInfo);

        // Assert
        assert.equal(this.oSection.getDefaultItems().length, 1, "Visualization found in 'default'");
        assert.equal(this.oSection.getAllItems().length, 1, "Visualization there");
    });

    QUnit.module("The function _onDragEnter", {
        beforeEach: function () {
            this.oSection = new Section();

            this.oSourceAreaMock = {
                data: sandbox.stub()
            };
            this.oTargetAreaMock = {
                data: sandbox.stub()
            };

            this.oDragControlMock = {
                getParent: sandbox.stub().returns(this.oSourceAreaMock)
            };
            this.oDropControlMock = {
                getParent: sandbox.stub().returns(this.oTargetAreaMock),
                data: sandbox.stub()
            };

            this.oDragSessionMock = {
                getDragControl: sandbox.stub().returns(this.oDragControlMock),
                getDropControl: sandbox.stub().returns(this.oDropControlMock)
            };

            this.oEventMock = {
                getParameter: sandbox.stub().withArgs("dragSession").returns(this.oDragSessionMock),
                preventDefault: sandbox.stub()
            };

            this.oFireAreaDragEnterStub = sandbox.stub(this.oSection, "fireAreaDragEnter");
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Fires the areaDragEnter event with the correct event parameters", function (assert) {
        //Arrange
        this.oSourceAreaMock.data.withArgs("area").returns("default");
        this.oDropControlMock.data.withArgs("area").returns("flat");

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].originalEvent, this.oEventMock, "The original event was passed");
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].dragControl, this.oDragControlMock, "The dragged control was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].sourceArea, "default", "The source area was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].targetArea, "flat", "The target area was passed");
    });

    QUnit.test("Fires the areaDragEnter event with the correct event parameters if the drop target is not the target area", function (assert) {
        //Arrange
        this.oSourceAreaMock.data.withArgs("area").returns("default");
        this.oDropControlMock.data.withArgs("area").returns(null);
        this.oTargetAreaMock.data.withArgs("area").returns("flat");

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].originalEvent, this.oEventMock, "The original event was passed");
        assert.deepEqual(this.oFireAreaDragEnterStub.args[0][0].dragControl, this.oDragControlMock, "The dragged control was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].sourceArea, "default", "The source area was passed");
        assert.strictEqual(this.oFireAreaDragEnterStub.args[0][0].targetArea, "flat", "The target area was passed");
    });

    QUnit.test("Prevents the drop from outside the section into an area of the default section", function (assert) {
        //Arrange
        this.oTargetAreaMock.data.withArgs("default").returns(true);

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.strictEqual(this.oEventMock.preventDefault.callCount, 1, "The drop was prevented");
    });

    QUnit.test("Allows drag and drop within an area of the default section", function (assert) {
        //Arrange
        this.oSourceAreaMock.data.withArgs("default").returns(true);
        this.oTargetAreaMock.data.withArgs("default").returns(true);

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.strictEqual(this.oEventMock.preventDefault.callCount, 0, "The drop was allowed");
    });

    QUnit.test("Doesn't do anything if there is no target area", function (assert) {
        //Arrange
        delete this.oDragSessionMock.getDropControl;

        //Act
        this.oSection._onDragEnter(this.oEventMock);

        //Assert
        assert.strictEqual(this.oFireAreaDragEnterStub.callCount, 0, "The areaDragEnter event was not fired");
    });

    QUnit.module("The function _getDropIndicatorSize", {
        beforeEach: function () {
            this.oSection = new Section();

            this.oParentControl = {
                data: sandbox.stub().withArgs("area").returns(DisplayFormat.Standard)
            };

            this.oLayoutData = {
                getRows: sandbox.stub().returns(2),
                getColumns: sandbox.stub().returns(4)
            };

            this.oVisualization = {
                getParent: sandbox.stub().returns(this.oParentControl),
                getLayoutData: sandbox.stub().returns(this.oLayoutData)
            };
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Uses the visualizations layout data for a drop within the same content area type", function (assert) {
        //Arrange
        var oExpectedDropIndicatorSize = {
            rows: 2,
            columns: 4
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Standard);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The visualization's size was returned");
    });

    QUnit.test("Returns the default layout for a drop into the default content area", function (assert) {
        //Arrange
        this.oParentControl.data.withArgs("area").returns(DisplayFormat.Flat);
        var oExpectedDropIndicatorSize = {
            rows: 2,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Standard);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size of the default area was returned");
    });

    QUnit.test("Returns the default layout for a drop into the flat content area", function (assert) {
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size of the flat area was returned");
    });

    QUnit.test("Returns the default layout if there is no parent control", function (assert) {
        //Arrange
        this.oVisualization.getParent.returns(null);
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size was returned");
    });

    QUnit.test("Returns the default layout if the visualization doesn't have layout data", function (assert) {
        //Arrange
        delete this.oVisualization.getLayoutData;
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 2
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The default size was returned");
    });

    QUnit.test("Returns the correct layout when dropping a standardWide only visualization into the standard area", function (assert) {
        this.oVisualization.getSupportedDisplayFormats = sandbox.stub().returns([DisplayFormat.StandardWide]);
        var oExpectedDropIndicatorSize = {
            rows: 2,
            columns: 4
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Standard);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The wide size of the standard area was returned");
    });

    QUnit.test("Returns the correct layout when dropping a flatWide only visualization into the flat area", function (assert) {
        this.oVisualization.getSupportedDisplayFormats = sandbox.stub().returns([DisplayFormat.FlatWide]);
        var oExpectedDropIndicatorSize = {
            rows: 1,
            columns: 4
        };

        //Act
        var oDropIndicatorSize = this.oSection._getDropIndicatorSize(this.oVisualization, DisplayFormat.Flat);

        //Assert
        assert.deepEqual(oDropIndicatorSize, oExpectedDropIndicatorSize, "The wide size of the flat area was returned");
    });

    QUnit.module("The function _getDefaultDropIndicatorSize", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oGetDropIndicatorSizeStub = sandbox.stub(this.oSection, "_getDropIndicatorSize");
            this.oVisualization = {
                visualization: "mock"
            };
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls _getDropIndicatorSize for the default area", function (assert) {
        //Arrange
        this.oExpectedArgs = [
            this.oVisualization,
            DisplayFormat.Standard
        ];

        //Act
        this.oSection._getDefaultDropIndicatorSize(this.oVisualization);

        //Assert
        assert.deepEqual(this.oGetDropIndicatorSizeStub.args[0], this.oExpectedArgs, "The correct arguments were passed through");
    });

    QUnit.module("The function _getFlatDropIndicatorSize", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oGetDropIndicatorSizeStub = sandbox.stub(this.oSection, "_getDropIndicatorSize");
            this.oVisualization = {
                visualization: "mock"
            };
        },
        afterEach: function () {
            this.oSection.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls _getDropIndicatorSize for the flat area", function (assert) {
        //Arrange
        this.oExpectedArgs = [
            this.oVisualization,
            DisplayFormat.Flat
        ];

        //Act
        this.oSection._getFlatDropIndicatorSize(this.oVisualization);

        //Assert
        assert.deepEqual(this.oGetDropIndicatorSizeStub.args[0], this.oExpectedArgs, "The correct arguments were passed through");
    });

    QUnit.module("Toolbar buttons in edit mode", {
        beforeEach: function () {
            this.oSection = new Section({
                editable: true
            });

            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("The addVisualization button is not visible for a default section", async function (assert) {
        // Arrange
        this.oSection.setDefault(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[4];
        assert.notOk(oButton.getDomRef(), "The addVisualization button has not been rendered.");
    });

    QUnit.test("The addVisualization button is not visible if enableAddButton is false", async function (assert) {
        // Arrange
        this.oSection.setEnableAddButton(false);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[4];
        assert.notOk(oButton.getDomRef(), "The addVisualization button has not been rendered.");
    });

    QUnit.test("The addVisualization button is visible if enableAddButton is true", async function (assert) {
        // Arrange
        this.oSection.setEnableAddButton(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[4];
        assert.ok(oButton.getDomRef(), "The addVisualization button has been rendered.");
    });

    QUnit.test("The showHide button is not visible for a default section", async function (assert) {
        // Arrange
        this.oSection.setDefault(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[5];
        assert.notOk(oButton.getDomRef(), "The showHide button has not been rendered.");
    });

    QUnit.test("The showHide button is not visible if enableShowHideButton is false", async function (assert) {
        // Arrange
        this.oSection.setEnableShowHideButton(false);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[5];
        assert.notOk(oButton.getDomRef(), "The showHide button has not been rendered.");
    });

    QUnit.test("The showHide button is visible if enableShowHideButton is true", async function (assert) {
        // Arrange
        this.oSection.setEnableShowHideButton(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[5];
        assert.ok(oButton.getDomRef(), "The showHide button has been rendered.");
    });

    QUnit.test("The reset button is not visible for a default section", async function (assert) {
        // Arrange
        this.oSection.setDefault(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[6];
        assert.notOk(oButton.getDomRef(), "The reset button has not been rendered.");
    });

    QUnit.test("The reset button is not visible if enableResetButton is false", async function (assert) {
        // Arrange
        this.oSection.setEnableResetButton(false);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[6];
        assert.notOk(oButton.getDomRef(), "The reset button has not been rendered.");
    });

    QUnit.test("The reset button is visible if enableResetButton is true", async function (assert) {
        // Arrange
        this.oSection.setEnableResetButton(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[6];
        assert.ok(oButton.getDomRef(), "The reset button has been rendered.");
    });

    QUnit.test("The delete button is not visible for a default section", async function (assert) {
        // Arrange
        this.oSection.setDefault(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[7];
        assert.notOk(oButton.getDomRef(), "The delete button has not been rendered.");
    });

    QUnit.test("The delete button is not visible if enableDeleteButton is false", async function (assert) {
        // Arrange
        this.oSection.setEnableDeleteButton(false);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[7];
        assert.notOk(oButton.getDomRef(), "The delete button has not been rendered.");
    });

    QUnit.test("The delete button is visible if enableDeleteButton is true", async function (assert) {
        // Arrange
        this.oSection.setEnableDeleteButton(true);

        // Act
        await nextUIUpdate();

        // Assert
        var oButton = this.oSection.getAggregation("_header").getContent()[7];
        assert.ok(oButton.getDomRef(), "The delete button has been rendered.");
    });

    QUnit.module("Toolbar buttons in edit mode", {
        beforeEach: async function () {
            this.oSection = new Section();

            this.oSection.placeAt("qunit-fixture");
            await nextUIUpdate();
        },
        afterEach: async function () {
            this.oSection.destroy();
        }
    });

    QUnit.module("empty sap.f.GridContainer have no tabindex", {
        beforeEach: function () {
            this.oSection = new Section();

            var oBindingInfo = {
                path: "/viz",
                factory: function () {
                    return new GenericTile();
                }
            };

            this.oSection.bindVisualizations(oBindingInfo);

            this.oSection.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("Default and Flat area are empty", function (assert) {
        // Assert
        var oDefaultAreaFocusDomRef = this.oSection.getAggregation("_defaultArea").getFocusDomRef();
        assert.strictEqual(oDefaultAreaFocusDomRef.getAttribute("tabindex"), "-1", "Tabindex is removed on the default area.");
        assert.strictEqual(oDefaultAreaFocusDomRef.children[0].getAttribute("tabindex"), "-1", "Tabindex is removed on the default area before helper.");
        assert.strictEqual(oDefaultAreaFocusDomRef.children[1].getAttribute("tabindex"), "-1", "Tabindex is removed on the default area after helper.");
        var oFlatAreaFocusDomRef = this.oSection.getAggregation("_flatArea").getFocusDomRef();
        assert.strictEqual(oFlatAreaFocusDomRef.getAttribute("tabindex"), "-1", "Tabindex is removed on the flat area.");
        assert.strictEqual(oFlatAreaFocusDomRef.children[0].getAttribute("tabindex"), "-1", "Tabindex is removed on the flat area before helper.");
        assert.strictEqual(oFlatAreaFocusDomRef.children[1].getAttribute("tabindex"), "-1", "Tabindex is removed on the flat area after helper.");
    });

    QUnit.test("Default area has an item - Flat area is empty", async function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "standard" }
            ]
        });
        this.oSection.setModel(oModel);

        // Act
        await nextUIUpdate();

        // Assert
        var oDefaultAreaFocusDomRef = this.oSection.getAggregation("_defaultArea").getFocusDomRef();
        assert.strictEqual(oDefaultAreaFocusDomRef.getAttribute("tabindex"), "0", "Tabindex is active on the default area.");
        var oFlatAreaFocusDomRef = this.oSection.getAggregation("_flatArea").getFocusDomRef();
        assert.strictEqual(oFlatAreaFocusDomRef.getAttribute("tabindex"), "-1", "Tabindex is removed on the flat area.");
        assert.strictEqual(oFlatAreaFocusDomRef.children[0].getAttribute("tabindex"), "-1", "Tabindex is removed on the flat area before helper.");
        assert.strictEqual(oFlatAreaFocusDomRef.children[1].getAttribute("tabindex"), "-1", "Tabindex is removed on the flat area after helper.");
    });

    QUnit.test("Default area is empty - Flat area has an item", async function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "flat" }
            ]
        });
        this.oSection.setModel(oModel);

        // Act
        await nextUIUpdate();

        // Assert
        var oDefaultAreaFocusDomRef = this.oSection.getAggregation("_defaultArea").getFocusDomRef();
        assert.strictEqual(oDefaultAreaFocusDomRef.getAttribute("tabindex"), "-1", "Tabindex is removed on the default area.");
        assert.strictEqual(oDefaultAreaFocusDomRef.children[0].getAttribute("tabindex"), "-1", "Tabindex is removed on the default area before helper.");
        assert.strictEqual(oDefaultAreaFocusDomRef.children[1].getAttribute("tabindex"), "-1", "Tabindex is removed on the default area after helper.");
        var oFlatAreaFocusDomRef = this.oSection.getAggregation("_flatArea").getFocusDomRef();
        assert.strictEqual(oFlatAreaFocusDomRef.getAttribute("tabindex"), "0", "Tabindex is active on the flat area.");
    });

    QUnit.test("Default area and Flat area an item", async function (assert) {
        // Arrange
        var oModel = new JSONModel({
            viz: [
                { displayFormatHint: "standardWide" },
                { displayFormatHint: "flatWide" }
            ]
        });
        this.oSection.setModel(oModel);

        // Act
        await nextUIUpdate();
        // Assert
        var oDefaultAreaFocusDomRef = this.oSection.getAggregation("_defaultArea").getFocusDomRef();
        assert.strictEqual(oDefaultAreaFocusDomRef.getAttribute("tabindex"), "0", "Tabindex is active on the default area.");
        var oFlatAreaFocusDomRef = this.oSection.getAggregation("_flatArea").getFocusDomRef();
        assert.strictEqual(oFlatAreaFocusDomRef.getAttribute("tabindex"), "0", "Tabindex is active on the flat area.");
    });
});
