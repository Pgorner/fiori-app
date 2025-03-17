// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/f/GridContainer",
    "sap/m/Menu",
    "sap/m/MessageStrip",
    "sap/ui/core/Element",
    "sap/ui/core/library",
    "sap/ui/events/KeyCodes",
    "sap/ui/model/json/JSONModel",
    "sap/ui/qunit/QUnitUtils",
    "sap/ui/qunit/utils/nextUIUpdate",
    "sap/ushell/library",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/VizInstance",
    "sap/ushell/ui/launchpad/VizInstanceLink",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section"
], function (
    GridContainer,
    Menu,
    MessageStrip,
    Element,
    coreLibrary,
    KeyCodes,
    JSONModel,
    QUnitUtils,
    nextUIUpdate,
    ushellLibrary,
    ushellResources,
    VizInstance,
    VizInstanceLink,
    Page,
    Section
) {
    "use strict";

    // shortcut for sap/ushell.DisplayFormat
    var DisplayFormat = ushellLibrary.DisplayFormat;

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    function visualizationFactory (sId, oContext) {
        var oVizInstance;
        if (oContext.getProperty("displayFormatHint") === DisplayFormat.Compact) {
            oVizInstance = new VizInstanceLink(sId);
            oVizInstance.bindProperty("header", "header");
        } else {
            oVizInstance = new VizInstance(sId);
            oVizInstance.getContent().bindProperty("header", "header");
        }
        return oVizInstance;
    }

    function createSection (sId, oData) {
        if (sId.visualizations) {
            oData = sId;
            sId = undefined;
        }

        var oSectionModel = new JSONModel(oData);
        var oSection = new Section(sId);

        oSection.bindVisualizations({
            path: "/visualizations",
            factory: visualizationFactory
        });

        oSection.setEditable(!!oData.editable);
        oSection.setEnableVisualizationReordering(!!oData.enableVisualizationReordering);
        oSection.setModel(oSectionModel);
        return oSection;
    }

    QUnit.module("Page defaults", {
        beforeEach: function () {
            this.oPage = new Page();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("Default properties", function (assert) {
        assert.strictEqual(this.oPage.getProperty("edit"), false, "Default Value of property edit is: false");
        assert.strictEqual(this.oPage.getProperty("enableSectionReordering"), false, "Default Value of property enableSectionReordering is: false");
        assert.strictEqual(this.oPage.getProperty("dataHelpId"), "", 'Default Value of property dataHelpId is: ""');
        assert.strictEqual(this.oPage.getProperty("noSectionsText"), "", 'Default Value of property noSectionsText is: ""');
        assert.strictEqual(this.oPage.getProperty("showNoSectionsText"), true, "Default Value of property showNoSectionsText is: true");
        assert.strictEqual(this.oPage.getProperty("showTitle"), false, "Default Value of property showTitle is: false");
        assert.strictEqual(this.oPage.getProperty("title"), "", 'Default Value of property title is: ""');
    });

    QUnit.test("Default aggregations", function (assert) {
        assert.strictEqual(this.oPage.getAggregation("sections"), null, "Section Aggregation is initially: null");
        assert.strictEqual(this.oPage.getAggregation("messageStrip"), null, "messageStrip Aggregation is initially: null");
        assert.strictEqual(this.oPage.getAggregation("_addSectionButtons"), null, "Internal Aggregation _addSectionButtons is initially: null");
        assert.notEqual(this.oPage.getAggregation("_noSectionText"), null, "Internal Aggregation _noSectionText has a default text");
        this.oPage.onBeforeRendering();
        assert.strictEqual(this.oPage.getAggregation("_addSectionButtons").length, 1,
            "Internal Aggregation _addSectionButtons has: one add section button after onBeforeRendering");
    });

    QUnit.test("Default events", function (assert) {
        // Arrange
        var bEventWasTriggered;
        this.oPage.onBeforeRendering();
        this.oPage.attachAddSectionButtonPressed(function () {
            bEventWasTriggered = true;
        });

        // Act
        this.oPage.getAggregation("_addSectionButtons")[0].firePress();

        // Assert
        assert.strictEqual(bEventWasTriggered, true, "The addSectionButtonPressed event was fired");
    });

    QUnit.test("Internal _addSectionButtons aggregation has elements with the correct properties", function (assert) {
        // Arrange
        this.oPage.onBeforeRendering();
        var oAddSectionButton = this.oPage.getAggregation("_addSectionButtons")[0];

        // Assert
        assert.strictEqual(oAddSectionButton.isA("sap.m.Button"), true, "The Control is a Button");
        assert.strictEqual(oAddSectionButton.getType(), "Transparent", "The Control has the type: Transparent");
        assert.strictEqual(oAddSectionButton.getIcon(), "sap-icon://add", 'The Control has the icon: "sap-icon://add"');
        assert.strictEqual(oAddSectionButton.getText(), ushellResources.i18n.getText("Page.Button.AddSection"),
            "The Control has the text: " + ushellResources.i18n.getText("Page.Button.AddSection"));
    });

    QUnit.test("Internal _noSectionText aggregation has the correct default properties", function (assert) {
        // Arrange
        var oNoSectionText = this.oPage.getAggregation("_noSectionText");

        // Assert
        assert.strictEqual(oNoSectionText.isA("sap.m.Text"), true, "The Control is a Button");
        assert.strictEqual(oNoSectionText.getWidth(), "100%", "The Control has the width: 100%");
        assert.strictEqual(oNoSectionText.getTextAlign(), "Center", 'The Control has the textAlign: "Center"');
        assert.strictEqual(oNoSectionText.getText(), ushellResources.i18n.getText("Page.NoSectionText"),
            "The Control has the text: " + ushellResources.i18n.getText("Page.NoSectionText"));
    });

    QUnit.test("The MessageStrip is set to the aggregation", function (assert) {
        // Arrange
        this.oPage.setMessageStrip(new MessageStrip({
            text: "TEST"
        }));

        // Assert
        assert.strictEqual(this.oPage.getAggregation("messageStrip").isA("sap.m.MessageStrip"), true, "The MessageStrip was set.");
    });

    QUnit.module("Event delegates", {
        beforeEach: function () {
            this.oAddDelegateStub = sandbox.stub(Page.prototype, "addDelegate");
            this.oSaveFocusStub = sandbox.stub(Page.prototype, "_saveFocus");
            this.oHandleSkipBackStub = sandbox.stub(Page.prototype, "_handleSkipBack");
            this.oHandleSkipForwardStub = sandbox.stub(Page.prototype, "_handleSkipForward");
            this.oHandleBeforeFastNavigationFocusStub = sandbox.stub(Page.prototype, "_handleBeforeFastNavigationFocus");
            this.oPage = new Page();
        },
        afterEach: function () {
            this.oPage.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("onfocusin", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onfocusin;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oSaveFocusStub.callCount, 1, "_saveFocus was called once");
    });

    QUnit.test("onsapskipback", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onsapskipback;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oHandleSkipBackStub.callCount, 1, "_handleSkipBack was called once");
    });

    QUnit.test("onsapskipforward", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onsapskipforward;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oHandleSkipForwardStub.callCount, 1, "_handleSkipForward was called once");
    });

    QUnit.test("onBeforeFastNavigationFocus", function (assert) {
        // Arrange
        var fnDelegate = this.oAddDelegateStub.getCall(0).args[0].onBeforeFastNavigationFocus;
        // Act
        fnDelegate();
        // Assert
        assert.strictEqual(this.oHandleBeforeFastNavigationFocusStub.callCount, 1, "_handleBeforeFastNavigationFocus was called once");
    });

    QUnit.module("The method _saveFocus", {
        beforeEach: function () {
            this.oSection = createSection({
                editable: false,
                visualizations: [
                    { header: "0", displayFormatHint: DisplayFormat.Standard },
                    { header: "1", displayFormatHint: DisplayFormat.Flat },
                    { header: "2", displayFormatHint: DisplayFormat.Compact }
                ]
            });

            this.oPage = new Page({
                sections: [this.oSection]
            });

            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("Saves the correct target when focusing a non-empty section and no viz focused before", function (assert) {
        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz.getId(), this.oSection.getVisualizations()[0].getId(), "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");
    });

    QUnit.test("Saves the correct target when focusing a non-empty section and a viz was focused before", function (assert) {
        // Arrange
        this.oPage._oLastFocusedViz = this.oSection.getVisualizations()[1];

        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, this.oSection.getVisualizations()[1], "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");
    });

    QUnit.test("Saves the correct target when focusing a non-empty section and a viz outside was focused before", function (assert) {
        // Arrange
        var oUnknownViz = new VizInstance();
        this.oPage._oLastFocusedViz = oUnknownViz;

        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz.getId(), this.oSection.getVisualizations()[0].getId(), "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");

        oUnknownViz.destroy();
    });

    QUnit.test("Saves the correct target when focusing an empty section", function (assert) {
        // Arrange
        this.oSection.getModel().setProperty("/visualizations", []);

        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, undefined, "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, this.oSection, "correct last focused section was saved");
    });

    QUnit.test("Saves the correct target when focusing an empty page", function (assert) {
        // Arrange
        this.oSection.destroy();

        // Act
        this.oPage._saveFocus({
            srcControl: this.oPage
        });
        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, undefined, "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");
    });

    QUnit.test("Saves the correct target when focusing a standard viz", function (assert) {
        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.getAggregation("_defaultArea"),
            target: this.oSection.getVisualizations()[0].getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, this.oSection.getVisualizations()[0], "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");
    });

    QUnit.test("Saves the correct target when focusing a flat viz", function (assert) {
        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.getAggregation("_flatArea"),
            target: this.oSection.getVisualizations()[1].getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, this.oSection.getVisualizations()[1], "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");
    });

    QUnit.test("Saves the correct target when focusing a link viz", function (assert) {
        // Act
        this.oPage._saveFocus({
            srcControl: this.oSection.getVisualizations()[2]
        });

        // Assert
        assert.strictEqual(this.oPage._oLastFocusedViz, this.oSection.getVisualizations()[2], "correct last focused viz was saved");
        assert.strictEqual(this.oPage._oLastFocusedSection, undefined, "correct last focused section was saved");
    });

    QUnit.module("The method _handleSkipBack", {
        beforeEach: function () {
            this.oFocusStub = sandbox.stub();
            this.oSectionMock = {
                focus: this.oFocusStub
            };

            this.oPreventDefaultStub = sandbox.stub();

            this.oPage = new Page();
            this.oGridContainer = new GridContainer();

            this.oGetAncestorSectionStub = sandbox.stub(this.oPage, "_getAncestorSection");
            this.oGetAncestorSectionStub.withArgs(this.oGridContainer).returns(this.oSectionMock);

            this.oGetEditStub = sandbox.stub(this.oPage, "getEdit");
        },
        afterEach: function () {
            this.oPage.destroy();
            this.oGridContainer.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Sets focus on section when edit mode is on", function (assert) {
        // Arrange
        var oEventMock = {
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oGridContainer
        };
        this.oGetEditStub.returns(true);

        // Act
        this.oPage._handleSkipBack(oEventMock);

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(this.oFocusStub.callCount, 1, "focus was called once");
    });

    QUnit.test("Doesn't handle the event when edit mode is off", function (assert) {
        // Arrange
        var oEventMock = {
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oGridContainer
        };
        this.oGetEditStub.returns(false);

        // Act
        this.oPage._handleSkipBack(oEventMock);

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 0, "preventDefault was not called");
        assert.strictEqual(this.oFocusStub.callCount, 0, "focus was not called");
    });

    QUnit.module("The method _handleSkipForward", {
        beforeEach: function () {
            this.oSection = createSection({
                editable: false,
                visualizations: [
                    { header: "0" },
                    { header: "1" },
                    { header: "2" }
                ]
            });

            this.oPage = new Page({
                sections: [this.oSection]
            });

            this.oPreventDefaultStub = sandbox.stub();

            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("Sets focus on the last focused viz", function (assert) {
        // Arrange
        var oViz1 = this.oSection.getVisualizations()[1];
        this.oPage._oLastFocusedViz = oViz1;
        var oFocusStub = sandbox.stub(oViz1.getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleSkipForward({
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oSection,
            target: oViz1.getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "focus viz2 was called once");
    });

    QUnit.test("Sets default focus on the first viz", function (assert) {
        // Arrange
        var oViz0 = this.oSection.getVisualizations()[0];
        var oFocusStub = sandbox.stub(oViz0.getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleSkipForward({
            preventDefault: this.oPreventDefaultStub,
            srcControl: this.oSection,
            target: oViz0.getDomRef().parentElement
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "focus viz1 was called once");
    });

    QUnit.module("The method _handleKeyboardHomeEndNavigation", {
        beforeEach: function () {
            this.oSection = createSection("some_section", {
                editable: true,
                visualizations: [{ header: "0" }],
                title: "some title"
            });

            this.oPage = new Page({
                sections: [this.oSection],
                edit: true
            });

            this.oFocusVizStub = sandbox.stub(this.oPage, "_focusVisualization");

            this.oPreventDefaultStub = sandbox.stub();
            this.oStopPropagationStub = sandbox.stub();
            this.oEvent = {
                type: "saphomemodifiers",
                preventDefault: this.oPreventDefaultStub,
                stopPropagation: this.oStopPropagationStub
            };

            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("_handleKeyboardHomeEndNavigation when in Input field", function (assert) {
        // Arrange
        this.oIsFocusInInputStub = sandbox.stub(this.oPage, "_isFocusInInput").returns(true);

        // Act
        this.oPage._handleKeyboardHomeEndNavigation(this.oEvent);

        // Assert
        assert.strictEqual(this.oFocusVizStub.callCount, 0, "focus is not set to first visualization");
    });

    QUnit.test("_handleKeyboardHomeEndNavigation when not in Input field", function (assert) {
        // Arrange
        this.oIsFocusInInputStub = sandbox.stub(this.oPage, "_isFocusInInput").returns(false);

        // Act
        this.oPage._handleKeyboardHomeEndNavigation(this.oEvent);

        // Assert
        assert.strictEqual(this.oFocusVizStub.callCount, 1, "The function _focusVisualization has been called once.");
        assert.strictEqual(this.oFocusVizStub.firstCall.args.length, 1, "The function _focusVisualization has been called with one parameter.");
        assert.strictEqual(this.oFocusVizStub.firstCall.args[0], this.oSection.getVisualizations()[0],
            "The function _focusVisualization has been called with the correct viz.");
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "Event default behavior is stopped.");
        assert.strictEqual(this.oStopPropagationStub.callCount, 1, "Event propagation is stopped.");
    });

    QUnit.module("The method _handleBeforeFastNavigationFocus", {
        beforeEach: function () {
            this.oSection = createSection({
                editable: false,
                visualizations: [{ header: "0" }]
            });
            this.oPage = new Page({
                sections: [this.oSection]
            });

            this.oPreventDefaultStub = sandbox.stub();

            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("Sets focus on section when edit mode is on and a section focus was saved", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        this.oPage._oLastFocusedSection = this.oSection;
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on section when edit mode is on and a viz focus was saved and navigation is forward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        this.oPage._oLastFocusedViz = this.oSection.getVisualizations()[0];
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: true,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on viz when a viz focus was saved", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oViz = this.oSection.getVisualizations()[0];
        this.oPage._oLastFocusedViz = oViz;
        var oFocusStub = sandbox.stub(oViz.getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "visualization was focused once");
    });

    QUnit.test("Sets default focus on section when edit mode is on and navigation is forward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: true,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on default viz when edit mode is on and navigation is backward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oFocusStub = sandbox.stub(this.oSection.getVisualizations()[0].getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: false,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "visualization was focused once");
    });

    QUnit.test("Sets focus on default section when edit mode is on and section is empty and navigation is backward", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        this.oSection.getModel().setProperty("/visualizations", []);
        var oFocusStub = sandbox.stub(this.oSection, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: false,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "section was focused once");
    });

    QUnit.test("Sets focus on default viz when edit mode is off", function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        var oFocusStub = sandbox.stub(this.oSection.getVisualizations()[0].getDomRef().parentElement, "focus");

        // Act
        this.oPage._handleBeforeFastNavigationFocus({
            forward: false,
            preventDefault: this.oPreventDefaultStub
        });

        // Assert
        assert.strictEqual(this.oPreventDefaultStub.callCount, 1, "preventDefault was called once");
        assert.strictEqual(oFocusStub.callCount, 1, "viz was focused once");
    });

    QUnit.module("The method _getAncestorSection", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oIsAStub = sandbox.stub();
            this.oIsAStub.withArgs("sap.ushell.ui.launchpad.Section")
                .onCall(0).returns(false)
                .onCall(1).returns(true);

            this.oGetParentStub = sandbox.stub();

            this.oMockControl = {
                isA: this.oIsAStub,
                getParent: this.oGetParentStub
            };

            this.oGetParentStub.returns(this.oMockControl);
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Iterates over parents correctly", function (assert) {
        // Act
        var oResult = this.oPage._getAncestorSection(this.oMockControl);

        // Assert
        assert.strictEqual(this.oIsAStub.callCount, 2, "isA was called twice");
        assert.strictEqual(this.oGetParentStub.callCount, 1, "getParent was called once");
        assert.deepEqual(oResult, this.oMockControl, "correct object was returned");
    });

    QUnit.test("Returns null if there is no parent", function (assert) {
        // Arrange
        this.oIsAStub.withArgs("sap.ushell.ui.launchpad.Section").onCall(1).returns(false);
        this.oGetParentStub.onCall(0).returns({
            isA: this.oIsAStub
        });

        // Act
        var oResult = this.oPage._getAncestorSection(this.oMockControl);

        // Assert
        assert.strictEqual(this.oIsAStub.callCount, 2, "isA was called twice");
        assert.strictEqual(this.oGetParentStub.callCount, 1, "getParent was called once");
        assert.deepEqual(oResult, null, "null was returned");
    });

    QUnit.module("Page properties", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("edit property", function (assert) {
        assert.strictEqual(this.oPage.getEdit(), false, "Value is initially false");
        this.oPage.setEdit(true);
        assert.strictEqual(this.oPage.getEdit(), true, "Value was set to true");
        this.oPage.setEdit(false);
        assert.strictEqual(this.oPage.getEdit(), false, "Value was set to false");
    });

    QUnit.test("enableSectionReordering property", function (assert) {
        assert.strictEqual(this.oPage.getEnableSectionReordering(), false, "Value is initially false");
        this.oPage.setEnableSectionReordering(true);
        assert.strictEqual(this.oPage.getEnableSectionReordering(), true, "Value was set to true");
        this.oPage.setEnableSectionReordering(false);
        assert.strictEqual(this.oPage.getEnableSectionReordering(), false, "Value was set to false");
    });

    QUnit.test("Setter for enableSectionReordering property returns this", function (assert) {
        // Act
        var oReturn = this.oPage.setEnableSectionReordering(true);
        // Assert
        assert.strictEqual(oReturn, this.oPage, "'this' reference returned");
    });

    QUnit.test("Property change for enableSectionReordering property prevents rendering", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oPage, "invalidate");
        // Act
        this.oPage.setEnableSectionReordering(true);
        // Assert
        assert.strictEqual(oSpy.callCount, 1, "One invalidation for DragDropConfig, not for property change");
    });

    QUnit.test("Setter call for enableSectionReordering with no value change, does nothing", function (assert) {
        // Arrange
        this.oPage.setEnableSectionReordering(true);
        var oSpyRemove = sinon.spy(this.oPage, "removeDragDropConfig");
        var oSpyAdd = sinon.spy(this.oPage, "addDragDropConfig");
        // Act
        this.oPage.setEnableSectionReordering(true);
        // Assert
        assert.strictEqual(oSpyRemove.callCount, 0, "Mo invalidation for DragDropConfig, for not property change");
        assert.strictEqual(oSpyAdd.callCount, 0, "No invalidation for DragDropConfig, for not property change");
    });

    QUnit.test("Setter call for enableSectionReordering with undefined value change, does nothing", function (assert) {
        // Arrange
        var oSpyRemove = sinon.spy(this.oPage, "removeDragDropConfig");
        var oSpyAdd = sinon.spy(this.oPage, "addDragDropConfig");
        // Act
        this.oPage.setEnableSectionReordering();
        // Assert
        assert.strictEqual(oSpyRemove.callCount, 0, "Mo invalidation for DragDropConfig, for undefined property value");
        assert.strictEqual(oSpyAdd.callCount, 0, "No invalidation for DragDropConfig, for undefined property value");
    });

    QUnit.test("dataHelpId property", async function (assert) {
        await nextUIUpdate();
        assert.strictEqual(this.oPage.getDataHelpId(), "", 'Value is initially ""');
        assert.strictEqual(this.oPage.getDomRef().getAttribute("data-help-id"), null, 'The attribute "data-help-id" is not rendered.');

        this.oPage.setDataHelpId("some text");
        await nextUIUpdate();
        assert.strictEqual(this.oPage.getDataHelpId(), "some text", 'Value was set to "some text"');
        assert.strictEqual(this.oPage.getDomRef().getAttribute("data-help-id"), "some text",
            'The attribute "data-help-id" is rendered and has the correct value.');

        this.oPage.setDataHelpId("some other text");
        await nextUIUpdate();
        assert.strictEqual(this.oPage.getDataHelpId(), "some other text", 'Value was set to "some other text"');
        assert.strictEqual(this.oPage.getDomRef().getAttribute("data-help-id"), "some other text",
            'The attribute "data-help-id" is rendered and has the correct value.');
    });

    QUnit.test("noSectionsText property", function (assert) {
        assert.strictEqual(this.oPage.getNoSectionsText(), "", 'Value is initially ""');

        this.oPage.setNoSectionsText("some text");
        assert.strictEqual(this.oPage.getNoSectionsText(), "some text", 'Value was set to "some text"');

        this.oPage.setNoSectionsText("some other text");
        assert.strictEqual(this.oPage.getNoSectionsText(), "some other text", 'Value was set to "some other text"');
    });

    QUnit.test("Setter for noSectionsText property returns this", function (assert) {
        // Act
        var oReturn = this.oPage.setNoSectionsText("Otto");

        // Assert
        assert.strictEqual(oReturn, this.oPage, "'this' reference returned");
    });

    QUnit.test("Property change for noSectionsText property prevents rendering", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oPage, "invalidate");

        // Act
        this.oPage.setNoSectionsText("Karl");

        // Assert
        assert.strictEqual(oSpy.callCount, 0, "No invalidation happens");
    });

    QUnit.test("Setter call for noSectionsText with no value change, does nothing", function (assert) {
        // Arrange
        this.oPage.setNoSectionsText("Karl");
        var oSpy = sinon.spy(this.oPage.getAggregation("_noSectionText"), "setText");

        // Act
        this.oPage.setNoSectionsText("Karl");

        // Assert
        assert.strictEqual(oSpy.callCount, 0, "setText on inner aggregation not called");
    });

    QUnit.test("Setter call for noSectionsText with undefined value change, does nothing", function (assert) {
        // Arrange
        var oSpy = sinon.spy(this.oPage.getAggregation("_noSectionText"), "setText");

        // Act
        this.oPage.setNoSectionsText();

        // Assert
        assert.strictEqual(oSpy.callCount, 0, "setText on inner aggregation not called");
    });

    QUnit.test("showNoSectionsText property", function (assert) {
        assert.strictEqual(this.oPage.getShowNoSectionsText(), true, "Value is initially true");

        this.oPage.setShowNoSectionsText(false);
        assert.strictEqual(this.oPage.getShowNoSectionsText(), false, "Value was set to false");

        this.oPage.setShowNoSectionsText(true);
        assert.strictEqual(this.oPage.getShowNoSectionsText(), true, "Value was set to true");
    });

    QUnit.test("showTitle property", function (assert) {
        assert.strictEqual(this.oPage.getShowTitle(), false, "Value is initially false");

        this.oPage.setShowTitle(true);
        assert.strictEqual(this.oPage.getShowTitle(), true, "Value was set to true");

        this.oPage.setShowTitle(false);
        assert.strictEqual(this.oPage.getShowTitle(), false, "Value was set to false");
    });

    QUnit.test("title property", function (assert) {
        assert.strictEqual(this.oPage.getTitle(), "", 'Value is initially ""');
        assert.strictEqual(this.oPage.getDomRef().getAttribute("aria-label"), "", 'Aria-label is initially ""');

        this.oPage.setTitle("some title");
        assert.strictEqual(this.oPage.getTitle(), "some title", 'Value was set to "some title"');
        assert.strictEqual(this.oPage.getDomRef().getAttribute("aria-label"), "", 'Aria-label was set to "some title"');

        this.oPage.setTitle("some other title");
        assert.strictEqual(this.oPage.getTitle(), "some other title", 'Value was set to "some other title"');
        assert.strictEqual(this.oPage.getDomRef().getAttribute("aria-label"), "", 'Aria-label was set to "some other title"');
    });

    QUnit.module("getFocusDomRef", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("when there are no sections on the page", function (assert) {
        // Arrange
        var oExpectedDomRef = this.oPage.getDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.test("when there are no sections on the page in edit mode", async function (assert) {
        // Arrange
        this.oPage.setEdit(true);
        await nextUIUpdate();
        var oExpectedDomRef = this.oPage.getAggregation("_addSectionButtons")[0].getFocusDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.test("when there are sections on the page", async function (assert) {
        // Arrange
        this.oPage.addSection(new Section());
        await nextUIUpdate();
        var oExpectedDomRef = this.oPage.getDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.test("when there are sections on the page in edit mode", async function (assert) {
        // Arrange
        this.oPage.addSection(new Section());
        this.oPage.setEdit(true);
        await nextUIUpdate();
        var oExpectedDomRef = this.oPage.getDomRef();

        // Act
        var oDomRef = this.oPage.getFocusDomRef();

        // Assert
        assert.deepEqual(oDomRef, oExpectedDomRef, "the correct dom reference was returned.");
    });

    QUnit.module("Page accessibility", {
        beforeEach: function () {
            this.oSection0 = createSection({
                editable: true,
                visualizations: []
            });

            this.oSection1 = createSection({
                editable: true,
                visualizations: [
                    { header: "0", displayFormatHint: DisplayFormat.Standard },
                    { header: "1", displayFormatHint: DisplayFormat.Standard },
                    { header: "2", displayFormatHint: DisplayFormat.Flat },
                    { header: "3", displayFormatHint: DisplayFormat.Flat },
                    { header: "4", displayFormatHint: DisplayFormat.Compact },
                    { header: "5", displayFormatHint: DisplayFormat.Compact }
                ]
            });

            this.oSection2 = createSection({
                editable: true,
                visualizations: []
            });

            this.oSection3 = createSection({
                editable: true,
                visualizations: [
                    { header: "6", displayFormatHint: DisplayFormat.Standard },
                    { header: "7", displayFormatHint: DisplayFormat.Standard }
                ]
            });

            this.oSection4 = createSection({
                editable: true,
                visualizations: [
                    { header: "8", displayFormatHint: DisplayFormat.Flat },
                    { header: "9", displayFormatHint: DisplayFormat.Compact }
                ]
            });

            this.oSection5 = createSection({
                editable: true,
                visualizations: [
                    { header: "10", displayFormatHint: DisplayFormat.Flat },
                    { header: "11", displayFormatHint: DisplayFormat.Flat },
                    { header: "12", displayFormatHint: DisplayFormat.Compact }
                ]
            });

            this.oSection6 = createSection({
                editable: true,
                visualizations: [
                    { header: "13", displayFormatHint: DisplayFormat.Compact },
                    { header: "14", displayFormatHint: DisplayFormat.Compact }
                ]
            });

            this.oPage = new Page({
                edit: true,
                sections: [this.oSection0, this.oSection1, this.oSection2, this.oSection3, this.oSection4, this.oSection5, this.oSection6]
            });

            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("PAGE_UP while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection2.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.PAGE_UP);

        // Assert
        var oViz = this.oSection1.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("PAGE_UP while focus is inside of a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection4.getVisualizations()[1]; // This is a link
        this.oSection4.focusVisualization(oViz1);

        // The focus should jump from the compact area to the default area
        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.PAGE_UP);

            // Assert
            var oViz2 = this.oSection3.getVisualizations()[0];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef().parentNode, "focus is on the correct visualization.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("PAGE_UP while focus is on Section title input", function (assert) {
        // Arrange
        var done = assert.async();
        // focus section title input
        this.oSection3.getDomRef().querySelector("input[type=text]").focus();
        var oTitleInput = window.document.activeElement;

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.PAGE_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oTitleInput, "focus remained on the section title input.");
            done();
        }, 0);
    });

    QUnit.test("PAGE_DOWN while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection3.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.PAGE_DOWN);

        // Assert
        var oViz = this.oSection4.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the correct visualization.");
            done();
        }, 0);
    });

    /*
    Blocked by Incident
    BCP: 2180185571

    QUnit.test("PAGE_DOWN while focus is inside of a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection3.getVisualizations()[1];
        this.oSection3.focusVisualization(oViz1);

        // The focus should jump from the default area to the flat area
        window.setTimeout(function () {
            // Act
            assert.strictEqual(window.document.activeElement, oViz1.getDomRef().parentNode);
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.PAGE_DOWN);

            // Assert
            var oViz2 = this.oSection4.getVisualizations()[0];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef().parentNode, "focus is on the correct visualization.");
                done();
            }, 0);
        }.bind(this), 0);
    });
    */

    QUnit.test("PAGE_DOWN while focus is on Section title input", function (assert) {
        // Arrange
        var done = assert.async();
        // focus section title input
        this.oSection3.getDomRef().querySelector("input[type=text]").focus();
        var oTitleInput = window.document.activeElement;

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.PAGE_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oTitleInput, "focus remained on the section title input.");
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection3.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, this.oSection2.getFocusDomRef(), "focus is on the correct visualization.");
            done();
        }.bind(this), 0);
    });

    QUnit.test("ARROW_UP + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oSection3.focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_UP, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, true, "Section drop event called");

            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP + CTRL - first section is default", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oSection2.setDefault(true);
        this.oSection3.focus();

        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_UP, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, false, "Do not drop a section over a default section");
            this.oSection2.setDefault(false);
            oFireSectionDropStub.restore();
            done();
        }.bind(this), 0);
    });

    QUnit.test("ARROW_DOWN while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection1.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, this.oSection2.getFocusDomRef(), "focus is on the correct visualization.");
            done();
        }.bind(this), 0);
    });

    QUnit.test("ARROW_DOWN + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oSection1.focus();
        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, true, "Section drop event called.");
            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL - Default section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oSection1.setDefault(true);
        this.oSection1.focus();
        var oFireSectionDropStub = sandbox.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.callCount, 0, "Section drop event not called.");
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL - SectionReordering disabled", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection1.focus();
        var oFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(oFireSectionDropStub.called, false, "Section drop event called.");
            oFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("HOME when focus is on a Section containing all content areas", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection1.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME);

        // Assert
        var oViz = this.oSection1.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the first standard tile of the section.");
            done();
        }, 0);
    });

    QUnit.test("HOME when focus is on a Section containing a flat and compact area", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection5.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME);

        // Assert
        var oViz = this.oSection5.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the first flat tile of the section.");
            done();
        }, 0);
    });

    QUnit.test("HOME when focus is on Section containing a compact area", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection6.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME);

        // Assert
        var oViz = this.oSection6.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef(), "focus is on the first link of the section.");
            done();
        }, 0);
    });

    QUnit.test("HOME when focus is in a default area", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[1];
        this.oSection1.focusVisualization(oViz1);

        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME);

            // Assert
            var oViz2 = this.oSection1.getVisualizations()[0];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef().parentNode, "focus is on the first standard tile of the section.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("HOME when focus is in a flat area", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[3];
        this.oSection1.focusVisualization(oViz1);

        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME);

            // Assert
            var oViz2 = this.oSection1.getVisualizations()[2];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef().parentNode, "focus is on the first flat tile of the section.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("HOME when focus is in a compact area", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[5];
        this.oSection1.focusVisualization(oViz1);

        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME);

            // Assert
            var oViz2 = this.oSection1.getVisualizations()[4];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef(), "focus is on the first link of the section.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("END when focus is on a Section containing all content areas", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection1.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END);

        // Assert
        var oViz = this.oSection1.getVisualizations()[1];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the last standard tile of the section.");
            done();
        }, 0);
    });

    QUnit.test("END when focus is on a Section containing a flat and compact area", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection5.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END);

        // Assert
        var oViz = this.oSection5.getVisualizations()[1];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the last flat tile of the section.");
            done();
        }, 0);
    });

    QUnit.test("END when focus is on a Section containing a compact area", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection6.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END);

        // Assert
        var oViz = this.oSection6.getVisualizations()[1];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef(), "focus is on the last link of the section.");
            done();
        }, 0);
    });

    QUnit.test("END when focus is in a default area", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[0];
        this.oSection1.focusVisualization(oViz1);

        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END);

            // Assert
            var oViz2 = this.oSection1.getVisualizations()[1];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef().parentNode, "focus is on the last standard tile of the section.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("END when focus is in a flat area", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[2];
        this.oSection1.focusVisualization(oViz1);

        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END);

            // Assert
            var oViz2 = this.oSection1.getVisualizations()[3];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef().parentNode, "focus is on the last flat tile of the section.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("END when focus is in a compact area", function (assert) {
        // Arrange
        var done = assert.async();
        var oViz1 = this.oSection1.getVisualizations()[4];
        this.oSection1.focusVisualization(oViz1);

        window.setTimeout(function () {
            // Act
            QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END);

            // Assert
            var oViz2 = this.oSection1.getVisualizations()[5];
            window.setTimeout(function () {
                assert.strictEqual(window.document.activeElement, oViz2.getDomRef(), "focus is on the last link of the section.");
                done();
            }, 0);
        }.bind(this), 0);
    });

    QUnit.test("HOME + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection4.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.HOME, false, false, true);

        // Assert
        var oViz = this.oSection1.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("END + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection1.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.END, false, false, true);

        // Assert
        var oViz = this.oSection6.getVisualizations()[1];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef(), "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("F6 handling", function (assert) {
        // Arrange
        var done = assert.async();
        this.oSection4.focus();

        // Act
        QUnitUtils.triggerKeydown(window.document.activeElement, KeyCodes.F6, false, false, false);

        // Assert
        var oViz = this.oSection4.getVisualizations()[0];
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, oViz.getDomRef().parentNode, "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.module("Keyboard Drag and Drop of Visualizations", {
        beforeEach: function () {
            this.aSections = [
                createSection("section_0", {
                    editable: true,
                    enableVisualizationReordering: true,
                    visualizations: [{ header: "0" }, { header: "1" }, { header: "2" }]
                }),
                createSection("section_1", {
                    editable: true,
                    enableVisualizationReordering: true,
                    visualizations: [{ header: "3" }, { header: "4" }, { header: "5" }]
                }),
                createSection("section_2", {
                    editable: true,
                    enableVisualizationReordering: true,
                    visualizations: [{ header: "6" }, { header: "7" }, { header: "8" }]
                })
            ];

            this.oPage = new Page({
                edit: true,
                sections: this.aSections
            });

            this.oPage.placeAt("qunit-fixture");
            return nextUIUpdate();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    function testDnD (assert, testData) {
        var done = assert.async();
        var sSectionId = "section_" + testData.drag.section;
        var sTargetSectionId = "section_" + testData.drop.section;

        var oSection = Element.getElementById(sSectionId);
        var oTargetSection = Element.getElementById(sTargetSectionId);
        oSection._focusItem(testData.drag.tile);

        oTargetSection.attachEvent("visualizationDrop", function (oInfo) {
            var oParams = oInfo.getParameters();
            var oDragControl = oSection.getVisualizations()[testData.drag.tile];
            var oDropControl = oTargetSection.getVisualizations()[testData.drop.tile];
            assert.strictEqual(oParams.draggedControl.getId(), oDragControl.getId(),
                "Tile " + testData.drag.tile + " (Section " + testData.drag.section + ") is dragged");
            assert.strictEqual(oParams.droppedControl.getId(), oDropControl.getId(),
                "Tile " + testData.drop.tile + " (Section " + testData.drop.section + ") is being dropped over");
            done();
        });

        window.setTimeout(function () {
            var oGridElementFocused = document.activeElement;
            var oVizInstanceFocused = Element.closestTo(oGridElementFocused.firstElementChild);
            var iVizInstanceFocusedIndex = oSection.indexOfDefaultItem(oVizInstanceFocused);
            assert.strictEqual(iVizInstanceFocusedIndex, testData.drag.tile, "Dragged tile is focused");
            oSection.getAggregation("_defaultArea")._moveItem({
                target: oGridElementFocused,
                keyCode: testData.keyCode,
                stopPropagation: function () { },
                isMarked: function () { return false; },
                ctrlKey: testData.ctrlKey,
                originalEvent: { type: "keydown" }
            });
        }, 0);
    }

    QUnit.test("CTRL + RIGHT", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_RIGHT,
            ctrlKey: true,
            drag: { section: 0, tile: 0 },
            drop: { section: 0, tile: 1 }
        });
    });

    QUnit.test("CTRL + LEFT", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_LEFT,
            ctrlKey: true,
            drag: { section: 0, tile: 2 },
            drop: { section: 0, tile: 1 }
        });
    });

    QUnit.test("CTRL + DOWN", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_DOWN,
            ctrlKey: true,
            drag: { section: 0, tile: 0 },
            drop: { section: 1, tile: 0 }
        });
    });

    QUnit.test("CTRL + UP", function (assert) {
        testDnD(assert, {
            keyCode: KeyCodes.ARROW_UP,
            ctrlKey: true,
            drag: { section: 2, tile: 0 },
            drop: { section: 1, tile: 0 }
        });
    });

    QUnit.module("exit", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oDragDropInfoDestroyStub = sandbox.stub(this.oPage._oDragDropInfo, "destroy");
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("Destroys private objects", function (assert) {
        // Arrange
        // Act
        this.oPage.exit();
        // Assert
        assert.strictEqual(this.oDragDropInfoDestroyStub.callCount, 1, "oDragDropInfo was destroyed");
    });

    QUnit.module("Announce InvisibleMessage", {
        beforeEach: function () {
            this.oPage = new Page();
            this.oInvisibleMessageInstanceStub = sandbox.stub(this.oPage._oInvisibleMessageInstance, "announce");
        },
        afterEach: function () {
            sandbox.restore();
            this.oPage.destroy();
        }
    });

    QUnit.test("Announce InvisibleMessage when a Section was moved", function (assert) {
        // Arrange
        var sExpectedAnnounceMessage = ushellResources.i18n.getText("PageRuntime.Message.SectionMoved");
        var sExpectedType = coreLibrary.InvisibleMessageMode.Polite;

        // Act
        this.oPage.announceMove();

        // Assert
        assert.strictEqual(this.oInvisibleMessageInstanceStub.callCount, 1, "announce was called once");
        assert.strictEqual(this.oInvisibleMessageInstanceStub.args[0][0], sExpectedAnnounceMessage,
            "announce was called with the correct message");
        assert.strictEqual(this.oInvisibleMessageInstanceStub.args[0][1], sExpectedType,
            "announce was called with the correct message type");
    });

    QUnit.module("enhanceAccessibilityState", {
        beforeEach: function () {
            this.oPage = new Page();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("Removes aria-readonly when readonly=true", function (assert) {
        // Arrange
        var oAriaProps = { readonly: true };
        // Act
        this.oPage.enhanceAccessibilityState(undefined, oAriaProps);
        // Assert
        assert.strictEqual(oAriaProps.readonly, undefined, "aria-readonly was removed.");
    });

    QUnit.test("Removes aria-readonly when readonly=false", function (assert) {
        // Arrange
        var oAriaProps = { readonly: false };
        // Act
        this.oPage.enhanceAccessibilityState(undefined, oAriaProps);
        // Assert
        assert.strictEqual(oAriaProps.readonly, undefined, "aria-readonly was removed.");
    });

    QUnit.module("_onSectionContextMenu", {
        beforeEach: async function () {
            sandbox.spy(Menu.prototype, "openAsContextMenu");
            this.oVisualization = new VizInstance();
            this.oVisualizationLink = new VizInstanceLink();

            this.oPage = new Page({
                edit: true,
                enableSectionReordering: true,
                sections: [
                    new Section({
                        default: true,
                        visualizations: [
                            this.oTile,
                            this.oLink
                        ]
                    }),
                    new Section(),
                    new Section(),
                    new Section()
                ]
            }).setModel("i18n", ushellResources.i18nModel);

            this.oPage.placeAt("qunit-fixture");
            await nextUIUpdate();
        },
        afterEach: function () {
            this.oPage.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("not in edit mode", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[0];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };
        this.oPage.setEdit(false);
        await nextUIUpdate();

        // Act
        this.oPage._onSectionContextMenu(oEvent, this.oSection);

        // Assert
        assert.strictEqual(oEvent.preventDefault.called, false, "The browser default ContextMenu was not prevented.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.called, false, "The custom ContextMenu was not opened.");
    });

    QUnit.test("in edit mode", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[0];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };
        await nextUIUpdate();

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);

        // Assert
        assert.strictEqual(oEvent.preventDefault.callCount, 1, "The browser default ContextMenu was prevented.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.callCount, 1, "The custom ContextMenu was opened.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.firstCall.args[0], oEvent, "The first argument is as expected.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.firstCall.args[1], oTargetSection, "The second argument is as expected.");
    });

    QUnit.test("in edit mode but on the title", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[0];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header").getContent()[2],
            preventDefault: sandbox.stub()
        };
        await nextUIUpdate();

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);

        // Assert
        assert.strictEqual(oEvent.preventDefault.called, false, "The browser default ContextMenu was not prevented.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.called, false, "The custom ContextMenu was not opened.");
    });

    QUnit.test("in edit mode but on a visualization", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[0];
        const oEvent = {
            srcControl: this.oVisualization,
            preventDefault: sandbox.stub()
        };
        await nextUIUpdate();

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);

        // Assert
        assert.strictEqual(oEvent.preventDefault.called, false, "The browser default ContextMenu was not prevented.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.called, false, "The custom ContextMenu was not opened.");
    });

    QUnit.test("in edit mode but on a visualization link", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[0];
        const oEvent = {
            srcControl: this.oVisualizationLink,
            preventDefault: sandbox.stub()
        };
        await nextUIUpdate();

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);

        // Assert
        assert.strictEqual(oEvent.preventDefault.called, false, "The browser default ContextMenu was not prevented.");
        assert.strictEqual(Menu.prototype.openAsContextMenu.called, false, "The custom ContextMenu was not opened.");
    });

    QUnit.test("default section has no menu items enabled", async function (assert) {
        const oTargetSection = this.oPage.getSections()[0];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);
        await nextUIUpdate();

        // Assert
        const oContextMenu = Element.getElementById("sapUshellSectionContextMenu");
        const oMenuItemUp = oContextMenu.getItems()[0];
        const oMenuItemDown = oContextMenu.getItems()[1];

        assert.strictEqual(oContextMenu.isOpen(), true, "The custom ContextMenu is open.");
        // assert.strictEqual(oMenuItemUp.getText(), ushellResources.i18n.getText("Page.MoveSection.Up"), "The first MenuItem has the expected text.");
        assert.strictEqual(oMenuItemUp.getEnabled(), false, "The first MenuItem is not enabled.");
        // assert.strictEqual(oMenuItemDown.getText(), ushellResources.i18n.getText("Page.MoveSection.Down"), "The second MenuItem has the expected text.");
        assert.strictEqual(oMenuItemDown.getEnabled(), false, "The second MenuItem is not enabled.");
    });

    QUnit.test("the first regular section has only the down menu item enabled", async function (assert) {
        const oTargetSection = this.oPage.getSections()[1];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);
        await nextUIUpdate();

        // Assert
        const oContextMenu = Element.getElementById("sapUshellSectionContextMenu");
        const oMenuItemUp = oContextMenu.getItems()[0];
        const oMenuItemDown = oContextMenu.getItems()[1];

        assert.strictEqual(oContextMenu.isOpen(), true, "The custom ContextMenu is open.");
        // assert.strictEqual(oMenuItemUp.getText(), ushellResources.i18n.getText("Page.MoveSection.Up"), "The first MenuItem has the expected text.");
        assert.strictEqual(oMenuItemUp.getEnabled(), false, "The first MenuItem is not enabled.");
        // assert.strictEqual(oMenuItemDown.getText(), ushellResources.i18n.getText("Page.MoveSection.Down"), "The second MenuItem has the expected text.");
        assert.strictEqual(oMenuItemDown.getEnabled(), true, "The second MenuItem is enabled.");
    });

    QUnit.test("the second regular section has both menu item enabled", async function (assert) {
        const oTargetSection = this.oPage.getSections()[2];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);
        await nextUIUpdate();

        // Assert
        const oContextMenu = Element.getElementById("sapUshellSectionContextMenu");
        const oMenuItemUp = oContextMenu.getItems()[0];
        const oMenuItemDown = oContextMenu.getItems()[1];

        assert.strictEqual(oContextMenu.isOpen(), true, "The custom ContextMenu is open.");
        // assert.strictEqual(oMenuItemUp.getText(), ushellResources.i18n.getText("Page.MoveSection.Up"), "The first MenuItem has the expected text.");
        assert.strictEqual(oMenuItemUp.getEnabled(), true, "The first MenuItem is enabled.");
        // assert.strictEqual(oMenuItemDown.getText(), ushellResources.i18n.getText("Page.MoveSection.Down"), "The second MenuItem has the expected text.");
        assert.strictEqual(oMenuItemDown.getEnabled(), true, "The second MenuItem is enabled.");
    });

    QUnit.test("the second regular section has only the up menu item enabled", async function (assert) {
        const oTargetSection = this.oPage.getSections()[3];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };

        // Act
        this.oPage._onSectionContextMenu(oEvent, oTargetSection);
        await nextUIUpdate();

        // Assert
        const oContextMenu = Element.getElementById("sapUshellSectionContextMenu");
        const oMenuItemUp = oContextMenu.getItems()[0];
        const oMenuItemDown = oContextMenu.getItems()[1];

        assert.strictEqual(oContextMenu.isOpen(), true, "The custom ContextMenu is open.");
        // assert.strictEqual(oMenuItemUp.getText(), ushellResources.i18n.getText("Page.MoveSection.Up"), "The first MenuItem has the expected text.");
        assert.strictEqual(oMenuItemUp.getEnabled(), true, "The first MenuItem is enabled.");
        // assert.strictEqual(oMenuItemDown.getText(), ushellResources.i18n.getText("Page.MoveSection.Down"), "The second MenuItem has the expected text.");
        assert.strictEqual(oMenuItemDown.getEnabled(), false, "The second MenuItem is not enabled.");
    });

    QUnit.test("move section up", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[2];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };

        this.oPage._onSectionContextMenu(oEvent, oTargetSection);
        await nextUIUpdate();

        const oContextMenu = Element.getElementById("sapUshellSectionContextMenu");
        const oMenuItemUp = oContextMenu.getItems()[0];
        const oSectionDropStub = sandbox.stub();

        this.oPage.attachSectionDrop(oSectionDropStub);

        // Act
        oMenuItemUp.firePress();
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oSectionDropStub.callCount, 1, "Section drop was called once.");
        const oParameters = oSectionDropStub.firstCall.args[0].getParameters();
        assert.strictEqual(oParameters.draggedControl, this.oPage.getSections()[2], "draggedControl is as expected.");
        assert.strictEqual(oParameters.dropPosition, "Before", "dropPosition is as expected.");
        assert.strictEqual(oParameters.droppedControl, this.oPage.getSections()[1], "droppedControl is as expected.");
    });

    QUnit.test("move section down", async function (assert) {
        // Arrange
        const oTargetSection = this.oPage.getSections()[2];
        const oEvent = {
            srcControl: oTargetSection.getAggregation("_header"),
            preventDefault: sandbox.stub()
        };

        this.oPage._onSectionContextMenu(oEvent, oTargetSection);
        await nextUIUpdate();

        const oContextMenu = Element.getElementById("sapUshellSectionContextMenu");
        const oMenuItemDown = oContextMenu.getItems()[1];
        const oSectionDropStub = sandbox.stub();

        this.oPage.attachSectionDrop(oSectionDropStub);

        // Act
        oMenuItemDown.firePress();
        await nextUIUpdate();

        // Assert
        assert.strictEqual(oSectionDropStub.callCount, 1, "Section drop was called once.");
        const oParameters = oSectionDropStub.firstCall.args[0].getParameters();
        assert.strictEqual(oParameters.draggedControl, this.oPage.getSections()[2], "draggedControl is as expected.");
        assert.strictEqual(oParameters.dropPosition, "After", "dropPosition is as expected.");
        assert.strictEqual(oParameters.droppedControl, this.oPage.getSections()[3], "droppedControl is as expected.");
    });
});
