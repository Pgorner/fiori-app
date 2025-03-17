// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/includes",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/ui/core/Control",
    "sap/ui/core/Element",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/FilterOperator",
    "sap/m/MultiInput",
    "sap/m/Token",
    "sap/ushell/library",
    "sap/ushell/ui/ContentNodeSelector",
    "sap/ushell/resources",
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/Container",
    "sap/ui/qunit/utils/nextUIUpdate"
], function (
    includes,
    Label,
    VBox,
    Control,
    Element,
    Fragment,
    JSONModel,
    FilterOperator,
    MultiInput,
    Token,
    library,
    ContentNodeSelector,
    resources,
    Device,
    Config,
    Container,
    nextUIUpdate
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});
    var ContentNodeType = library.ContentNodeType;

    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oSetModelSpy = sandbox.spy(ContentNodeSelector.prototype, "setModel");
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oLoadContentNodesStub.returns({
                then: sandbox.stub().callsArg(0)
            });
            this.oAddValidatorStub = sandbox.stub(MultiInput.prototype, "addValidator");
            this.oInitSpy = sandbox.spy(ContentNodeSelector.prototype, "init");

            this.oContentNodeSelector = new ContentNodeSelector();
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            sandbox.restore();

            this.oTranslationModel.destroy();
        }
    });

    QUnit.test("Adds a validator to the multi input control", function (assert) {
        // Assert
        assert.strictEqual(this.oAddValidatorStub.callCount, 1, "The validator was added.");
    });

    QUnit.test("Correctly creates an instance of ContentNodeSelector", function (assert) {
        // Assert
        assert.ok(this.oContentNodeSelector, "The control has been created.");
        assert.ok(this.oContentNodeSelector.isA("sap.ui.core.Control"), "The correct control type has been created.");
    });

    QUnit.test("Creates and attaches an internal model", function (assert) {
        // Assert
        assert.ok(this.oContentNodeSelector._oModel, "The model has been created.");
        assert.strictEqual(this.oSetModelSpy.callCount, 3, "The function setModel has been called three times.");
        assert.strictEqual(this.oSetModelSpy.firstCall.args[0], this.oContentNodeSelector._oModel, "The model has been attached.");
        assert.strictEqual(this.oSetModelSpy.firstCall.args[1], "_internal", "The model has been attached.");
    });

    QUnit.test("Creates and attaches a device model", function (assert) {
        // Assert
        assert.ok(this.oContentNodeSelector._oDeviceModel, "The model has been created.");
        assert.strictEqual(this.oSetModelSpy.callCount, 3, "The function setModel has been called three times.");

        var oModel = this.oSetModelSpy.secondCall.args[0];
        var oModelData = oModel.getData();
        assert.strictEqual(oModelData, Device, "The model has been attached.");
        assert.strictEqual(this.oSetModelSpy.secondCall.args[1], "_device", "The model has been attached.");
    });

    QUnit.test("Creates and attaches an i18n model", function (assert) {
        // Assert
        assert.strictEqual(this.oSetModelSpy.callCount, 3, "The function setModel has been called three times.");
        assert.strictEqual(this.oSetModelSpy.thirdCall.args[0], this.oTranslationModel, "The model has been attached.");
        assert.strictEqual(this.oSetModelSpy.thirdCall.args[1], "_i18n", "The model has been attached.");
    });

    QUnit.test("Calls the function _overwriteLabel", function (assert) {
        // Assert
        assert.strictEqual(this.oOverwriteLabelStub.callCount, 1, "The function _overwriteLabel has been called once.");
    });

    QUnit.module("The destructor", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);
        },

        afterEach: function () {
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Cleans up the internal model", function (assert) {
        // Arrange
        var oContentNodeSelector = new ContentNodeSelector();
        var oDestroyOModelSpy = sandbox.spy(oContentNodeSelector._oModel, "destroy");

        // Act
        oContentNodeSelector.destroy();

        // Assert
        assert.strictEqual(oDestroyOModelSpy.callCount, 1, "The model's destroy function has been called once.");
    });

    QUnit.test("Cleans up the device model", function (assert) {
        // Arrange
        var oContentNodeSelector = new ContentNodeSelector();
        var oDestroyDeviceModelSpy = sandbox.spy(oContentNodeSelector._oDeviceModel, "destroy");

        // Act
        oContentNodeSelector.destroy();

        // Assert
        assert.strictEqual(oDestroyDeviceModelSpy.callCount, 1, "The model's destroy function has been called once.");
    });

    QUnit.module("The control", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oAttachEventSpy = sandbox.spy(MultiInput.prototype, "attachEvent");
            this.oContentNodeSelector = new ContentNodeSelector();
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Contains a MultiInput control", function (assert) {
        // Act
        var oContent = this.oContentNodeSelector.getAggregation("content");

        // Assert
        assert.strictEqual(oContent.getMetadata().getName(), "sap.m.MultiInput", "The correct inner control has been created.");
    });

    QUnit.test("Correctly renders a MultiInput control", async function (assert) {
        // Arrange
        this.oContentNodeSelector.placeAt("qunit-fixture");

        // Act
        await nextUIUpdate();

        // Assert
        var oDomRef = this.oContentNodeSelector.getDomRef();
        assert.ok(oDomRef.querySelector(".sapMMultiInput"), "The MultiInput has been rendered.");
    });

    QUnit.test("Contains two suggestion columns", function (assert) {
        // Act
        var oMultiInput = this.oContentNodeSelector.getAggregation("content");

        // Assert
        var aColumns = oMultiInput.getSuggestionColumns();

        var oFirstLabel = aColumns[0].getHeader();
        var oFirstLabelBindingInfo = oFirstLabel.getBindingInfo("text");
        assert.strictEqual(oFirstLabelBindingInfo.parts[1].model, "_i18n", "The correct model name has been found.");
        assert.strictEqual(oFirstLabelBindingInfo.parts[1].path, "contentNodeSelectorPage", "The correct binding path has been found.");

        var oSecondLabel = aColumns[1].getHeader();
        var oSecondLabelBindingInfo = oSecondLabel.getBindingInfo("text");
        assert.strictEqual(oSecondLabelBindingInfo.parts[0].model, "_i18n", "The correct model name has been found.");
        assert.strictEqual(oSecondLabelBindingInfo.parts[0].path, "contentNodeSelectorSpace", "The correct binding path has been found.");
    });

    QUnit.test("Correctly binds the MultiInput's suggestionRows aggregation", function (assert) {
        // Act
        var oMultiInput = this.oContentNodeSelector.getAggregation("content");

        // Assert
        var oBindingInfo = oMultiInput.getBindingInfo("suggestionRows");
        assert.strictEqual(oBindingInfo.model, "_internal", "The correct model name has been found.");
        assert.strictEqual(oBindingInfo.path, "/suggestions", "The correct binding path has been found.");

        var oTemplate = oBindingInfo.template;
        assert.ok(oTemplate.isA("sap.m.ColumnListItem"), "The template has the correct control type.");

        var aCells = oTemplate.getCells();
        assert.strictEqual(aCells.length, 2, "The template contains two cells.");

        var oFirstLabel = aCells[0];
        assert.strictEqual(oFirstLabel.getBindingInfo("text").parts[0].model, "_internal", "The correct model name has been found.");
        assert.strictEqual(oFirstLabel.getBindingInfo("text").parts[0].path, "label", "The correct binding path has been found.");

        var oSecondLabel = aCells[1];
        assert.strictEqual(oSecondLabel.getBindingInfo("text").parts[0].model, "_internal", "The correct model name has been found.");
        assert.strictEqual(oSecondLabel.getBindingInfo("text").parts[0].path, "spaceTitles", "The correct binding path has been found.");
    });

    QUnit.module("The function _loadContentNodes", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oGetContentNodesStub = sandbox.stub().resolves();
            this.oBookmarkService = {
                getContentNodes: this.oGetContentNodesStub
            };
            this.oGetServiceStub = sandbox.stub(Container, "getServiceAsync").withArgs("BookmarkV2").resolves(this.oBookmarkService);
            this.oGetUserStub = sandbox.stub(Container, "getUser").returns({
                getShowMyHome: sandbox.stub().returns(true)
            });

            this.oNormalizeContentNodesStub = sandbox.stub(ContentNodeSelector, "_normalizeContentNodes");

            this.oGetSuggestionsStub = sandbox.stub(ContentNodeSelector, "_getSuggestions");

            this.aSuggestions = [];
            this.oGetSuggestionsStub.returns(this.aSuggestions);

            this.oContentNodeSelector = new ContentNodeSelector();
            this.oLoadContentNodesStub.restore();
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls the unified shell Bookmark service", function (assert) {
        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetServiceStub.callCount, 1, "The function getServiceAsync has been called once.");
                assert.deepEqual(this.oGetServiceStub.firstCall.args, ["BookmarkV2"], "The function getServiceAsync has been called with the correct parameters.");
            }.bind(this));
    });

    QUnit.test("Calls the Bookmark service's getContentNodes function", function (assert) {
        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.strictEqual(this.oGetContentNodesStub.callCount, 1, "The function getContentNodes has been called once.");
            }.bind(this));
    });

    QUnit.test("Updates the busy state", function (assert) {
        // Arrange
        var oSetBusyStub = sandbox.stub(this.oContentNodeSelector, "setBusy");

        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.strictEqual(oSetBusyStub.callCount, 2, "The function setBusy has been called twice.");
                assert.deepEqual(oSetBusyStub.firstCall.args, [true], "The function setBusy has been called with the correct parameters.");
                assert.deepEqual(oSetBusyStub.secondCall.args, [false], "The function setBusy has been called with the correct parameters.");
            });
    });

    QUnit.test("Calls the function _normalizeContentNodes", function (assert) {
        // Arrange
        var aContentNodes = [{ id: "Test" }];
        this.oGetContentNodesStub.resolves(aContentNodes);

        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.strictEqual(this.oNormalizeContentNodesStub.callCount, 1, "The function _normalizeContentNodes was called once.");
            }.bind(this));
    });

    QUnit.test("Updates the model with the bookmark service data", function (assert) {
        // Arrange
        var aContentNodes = [];
        this.oGetContentNodesStub.resolves(aContentNodes);
        var oSetPropertyStub = sandbox.stub(this.oContentNodeSelector._oModel, "setProperty");

        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.strictEqual(oSetPropertyStub.callCount, 2, "The function setProperty has been called twice.");
                assert.strictEqual(oSetPropertyStub.firstCall.args[0], "/items", "The function setProperty has been called with the correct parameter.");
                assert.deepEqual(oSetPropertyStub.firstCall.args[1], aContentNodes, "The function setProperty has been called with the correct parameter.");
                assert.notStrictEqual(oSetPropertyStub.firstCall.args[1], aContentNodes, "The function setProperty has been called with the correct parameter reference.");
                assert.strictEqual(oSetPropertyStub.secondCall.args[0], "/suggestions", "The function setProperty has been called with the correct parameter.");
                assert.deepEqual(oSetPropertyStub.secondCall.args[1], this.aSuggestions, "The function setProperty has been called with the correct parameter.");
            }.bind(this));
    });

    QUnit.test("Initializes the suggestions as not selected in-place", function (assert) {
        // Arrange
        var aContentNodes = [];
        this.oGetContentNodesStub.resolves(aContentNodes);
        this.aSuggestions.push({});

        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.strictEqual(this.aSuggestions.length, 1, "The correct number of items has been found.");
                assert.deepEqual(this.aSuggestions, [
                    { selected: false }
                ], "The correct object structure has been found.");
            }.bind(this));
    });

    QUnit.test("Verifies that only content nodes with property 'isContainer'=true are stored in the model", function (assert) {
        // Arrange
        var aContentNodes = [ {
                id: "space1",
                label: "People",
                type: "Space",
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "People Page",
                        type: "Page",
                        isContainer: true,
                        children: []
                    },
                    {
                        id: "workpage1",
                        label: "English Title",
                        type: "Page",
                        isContainer: false,
                        children: []
                    }
                ]
            }
        ];

        var aExpectedFilteredContentNodes = [ {
            id: "space1",
            label: "People",
            type: "Space",
            isContainer: false,
            children: [
                {
                    id: "page1",
                    label: "People Page",
                    type: "Page",
                    isContainer: true,
                    children: []
                }
            ]
        } ];

        this.oGetContentNodesStub.resolves(aContentNodes);

        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.deepEqual(this.oContentNodeSelector._oModel.getProperty("/items"), aExpectedFilteredContentNodes, "The model contains correct content nodes.");
            }.bind(this));
    });

    QUnit.test("Verifies that only spaces with children are stored in the model", function (assert) {
        // Arrange
        var aContentNodes = [
            {
                id: "space1",
                label: "People",
                type: "Space",
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "People Page",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }
                ]
            },
            {
                id: "space2",
                label: "Other",
                type: "Space",
                isContainer: false,
                children: [
                    {
                        id: "workpage1",
                        label: "English Title",
                        type: "Page",
                        isContainer: false,
                        children: []
                    }
                ]
            }
        ];

        var aExpectedFilteredContentNodes = [
            {
                id: "space1",
                label: "People",
                type: "Space",
                isContainer: false,
                children: [
                    {
                        id: "page1",
                        label: "People Page",
                        type: "Page",
                        isContainer: true,
                        children: []
                    }
                ]
            }
        ];

        this.oGetContentNodesStub.resolves(aContentNodes);

        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.deepEqual(this.oContentNodeSelector._oModel.getProperty("/items"), aExpectedFilteredContentNodes, "The model contains correct content nodes.");
            }.bind(this));
    });

    QUnit.module("Show only 'MyHome' as content node", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.aContentNodes = [
                {
                    id: "SAP_BASIS_SP_UI_MYHOME",
                    label: "My Home",
                    type: "Space",
                    isContainer: false,
                    children: [
                        {
                            id: "SAP_BASIS_PG_UI_MYHOME",
                            label: "My Home",
                            type: "Page",
                            isContainer: true,
                            children: []
                        }
                    ]
                },
                {
                    id: "space1",
                    label: "People",
                    type: "Space",
                    isContainer: false,
                    children: [
                        {
                            id: "page1",
                            label: "People Page",
                            type: "Page",
                            isContainer: true,
                            children: []
                        }
                    ]
                }
            ];

            this.aExpectedContentNodes = [
                {
                    id: "SAP_BASIS_SP_UI_MYHOME",
                    label: "My Home",
                    type: "Space",
                    isContainer: false,
                    children: [
                        {
                            id: "SAP_BASIS_PG_UI_MYHOME",
                            label: "My Home",
                            type: "Page",
                            isContainer: true,
                            children: []
                        }
                    ]
                }
            ];

            this.oGetContentNodesStub = sandbox.stub().resolves(this.aContentNodes);
            this.oBookmarkService = {
                getContentNodes: this.oGetContentNodesStub
            };
            this.oGetServiceStub = sandbox.stub(Container, "getServiceAsync").withArgs("BookmarkV2").resolves(this.oBookmarkService);


            this.oGetUserStub = sandbox.stub(Container, "getUser").returns({
                getShowMyHome: sandbox.stub().returns(true)
            });

            this.oConfigStub = sandbox.stub(Config, "last");
            this.oConfigStub.withArgs("/core/spaces/myHome/enabled").returns(true);
            this.oConfigStub.withArgs("/core/spaces/myHome/myHomeSpaceId").returns("SAP_BASIS_SP_UI_MYHOME");
            this.oConfigStub.withArgs("/core/spaces/myHome/myHomePageId").returns("SAP_BASIS_PG_UI_MYHOME");
            this.oConfigStub.withArgs("/core/shell/enablePersonalization").returns(false);

            this.oNormalizeContentNodesStub = sandbox.stub(ContentNodeSelector, "_normalizeContentNodes");

            this.oGetSuggestionsStub = sandbox.stub(ContentNodeSelector, "_getSuggestions");

            this.aSuggestions = [];
            this.oGetSuggestionsStub.returns(this.aSuggestions);

            this.oContentNodeSelector = new ContentNodeSelector();
            this.oLoadContentNodesStub.restore();
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Show only 'MyHome' in case flp personalization is disabled, but 'MyHome' is enabled for the user", function (assert) {
        // Act
        return this.oContentNodeSelector._loadContentNodes()
            .then(function () {
                // Assert
                assert.deepEqual(this.oContentNodeSelector._oModel.getProperty("/items"), this.aExpectedContentNodes, "The model contains only 'MyHome'.");
            }.bind(this));
    });

    QUnit.module("The function _overwriteLabel", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oLabel = {
                setText: sandbox.stub(),
                setRequired: sandbox.stub(),
                setLabelFor: sandbox.stub(),
                isPropertyInitial: sandbox.stub().withArgs("required").returns(true)
            };
            this.oGetElementByIdStub = sandbox.stub(Element, "getElementById");
            this.oGetElementByIdStub.withArgs("Test").returns(this.oLabel);
            this.oGetElementByIdStub.callThrough();

            this.oContentNodeSelector = new ContentNodeSelector();
            this.oGetLabelIdStub = sandbox.stub(this.oContentNodeSelector, "getLabelId").returns("Test");
            this.oGetPropertyStub = sandbox.stub(this.oContentNodeSelector._oModel, "getProperty");
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Sets the label according to the classic homepage", function (assert) {
        // Arrange
        this.oGetPropertyStub.returns(false);

        // Act
        this.oContentNodeSelector._overwriteLabel();

        // Assert
        assert.strictEqual(this.oGetLabelIdStub.callCount, 1, "The function getLabelId() has been called once.");

        assert.deepEqual(this.oGetElementByIdStub.args, [ ["Test"] ], "The function Element.getElementById() has been called.");

        assert.strictEqual(this.oGetPropertyStub.getCall(0).args[0], "/isSpaces", "The function getProperty() has been called with the correct parameter.");
        assert.strictEqual(this.oGetPropertyStub.withArgs("/isSpaces").callCount, 1, "The function getProperty() has been called once.");

        assert.strictEqual(this.oLabel.setText.callCount, 1, "The function setText() has been called once.");
        assert.strictEqual(this.oLabel.setText.getCall(0).args[0], "Groups", "The function setText() has been called with the correct parameter.");
    });

    QUnit.test("Sets the label according to the spaces mode", function (assert) {
        // Arrange
        this.oGetPropertyStub.returns(true);

        // Act
        this.oContentNodeSelector._overwriteLabel();

        // Assert
        assert.strictEqual(this.oLoadContentNodesStub.callCount, 1, "The function _loadContentNodes has been called once.");
        assert.strictEqual(this.oGetLabelIdStub.callCount, 1, "The function getLabelId() has been called once.");

        assert.deepEqual(this.oGetElementByIdStub.args, [ ["Test"] ], "The function Element.getElementById() has been called.");

        assert.strictEqual(this.oGetPropertyStub.getCall(0).args[0], "/isSpaces", "The function getProperty() has been called with the correct parameter.");
        assert.strictEqual(this.oGetPropertyStub.withArgs("/isSpaces").callCount, 1, "The function getProperty() has been called once.");

        assert.strictEqual(this.oLabel.setText.callCount, 1, "The function setText() has been called once.");
        assert.strictEqual(this.oLabel.setText.getCall(0).args[0], "Pages", "The function setText() has been called with the correct parameter.");
    });

    QUnit.test("does not fail when no setText function exists.", function (assert) {
        // Arrange
        this.oLabel = {};
        this.oGetElementByIdStub.withArgs("Test").returns(this.oLabel);

        // Act
        try {
            this.oContentNodeSelector._overwriteLabel();
        } catch (e) {
            // Assert
            assert.ok(false, "Errors were thrown.");
        } finally {
            // Assert - needed to have at least one assertion executed
            assert.ok(true, "It might be that no error was thrown.");
        }
    });

    QUnit.test("calls setRequired on the label.", function (assert) {
        // Arrange

        // Act
        this.oContentNodeSelector._overwriteLabel();

        // Assert
        assert.strictEqual(this.oLabel.setRequired.callCount, 1, "setRequired was called once");
        assert.deepEqual(this.oLabel.setRequired.getCall(0).args, [true], "setRequired was called with the right args");
    });

    QUnit.test("doesn't call setRequired on the label if 'isRequired' is not initial.", function (assert) {
        // Arrange
        this.oLabel.isPropertyInitial.withArgs("required").returns(false);

        // Act
        this.oContentNodeSelector._overwriteLabel();

        // Assert
        assert.strictEqual(this.oLabel.setRequired.callCount, 0, "setRequired was called once");
    });

    QUnit.module("The function getSelectedContentNodes", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector();

            this.oContentNode = {
                selected: true,
                spaceTitles: [],
                dummy: "Test"
            };

            this.oGetBindingContextStub = sandbox.stub().returns({
                getObject: sandbox.stub().returns(this.oContentNode)
            });
            this.oToken = {
                getBindingContext: this.oGetBindingContextStub
            };
            sandbox.stub(MultiInput.prototype, "getTokens").returns([this.oToken]);
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oContentNodeSelector = null;
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Does not modify the original content nodes", function (assert) {
        // Act
        this.oContentNodeSelector.getSelectedContentNodes();

        // Assert
        assert.deepEqual(this.oContentNode, {
            selected: true,
            spaceTitles: [],
            dummy: "Test"
        }, "The original content node was not changed.");
    });

    QUnit.test("returns an array with copied content nodes", function (assert) {
        // Arrange
        var oExpectedContentNodes = {
            dummy: "Test"
        };

        // Act
        var aResult = this.oContentNodeSelector.getSelectedContentNodes();

        // Assert
        assert.notStrictEqual(aResult[0], this.oContentNode, "The correct reference was returned.");
        assert.deepEqual(aResult, [oExpectedContentNodes], "The object was copied.");
    });

    QUnit.test("Uses the correct model", function (assert) {
        // Arrange
        // Act
        this.oContentNodeSelector.getSelectedContentNodes();

        // Assert
        assert.strictEqual(this.oGetBindingContextStub.callCount, 1, "The function getBindingContext has been called once.");
        assert.deepEqual(this.oGetBindingContextStub.firstCall.args, ["_internal"], "The function getBindingContext has been called with the correct parameters.");
    });

    QUnit.module("The function _showValueHelp", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector("MyCNS");
            this.oOpenValueHelpStub = sandbox.stub(this.oContentNodeSelector, "_openValueHelpDialog");
            this.oAddDependentStub = sandbox.stub(this.oContentNodeSelector, "addDependent");
            this.oFragmentLoadStub = sandbox.stub(Fragment, "load");

            this.oSetModelStub = sandbox.stub();
            this.oDialogMock = {
                setModel: this.oSetModelStub,
                destroy: sandbox.stub()
            };
            this.oFragmentLoadStub.rejects();

            this.oGetValueStub = sandbox.stub().returns("The current control text");
            this.oMultiInputMock = {
                getValue: this.oGetValueStub
            };
            this.oEvent = {
                getSource: sandbox.stub().returns(this.oMultiInputMock)
            };
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Loads the dialog fragment if no dialog exists", function (assert) {
        // Act
        this.oContentNodeSelector._showValueHelp(this.oEvent);

        // Assert
        assert.strictEqual(this.oFragmentLoadStub.callCount, 1, "The function Fragment.load has been called once.");

        var oFragmentSettings = this.oFragmentLoadStub.firstCall.args[0];
        assert.strictEqual(oFragmentSettings.id, "MyCNS-ValueHelpDialog", "The correct fragment ID has been found.");
        assert.strictEqual(oFragmentSettings.name, "sap.ushell.ui.ContentNodeSelectorValueHelp", "The correct fragment name has been found.");
        assert.strictEqual(oFragmentSettings.controller, this.oContentNodeSelector, "The correct controller reference has been found.");
    });

    QUnit.test("Loads no new fragment if the dialog exists", function (assert) {
        // Arrange
        this.oContentNodeSelector._oValueHelpDialog = {
            destroy: sandbox.stub()
        };

        // Act
        this.oContentNodeSelector._showValueHelp(this.oEvent);

        // Assert
        assert.strictEqual(this.oFragmentLoadStub.callCount, 0, "The function Fragment.load has not called.");
        assert.strictEqual(this.oOpenValueHelpStub.callCount, 1, "The function _openValueHelpDialog has been called once.");
    });

    QUnit.test("Calls the function addDependent", function (assert) {
        // Arrange
        var oPromise = Promise.resolve(this.oDialogMock);
        this.oFragmentLoadStub.returns(oPromise);

        // Act
        this.oContentNodeSelector._showValueHelp(this.oEvent);

        // Assert
        return oPromise
            .then(function () {
                assert.strictEqual(this.oAddDependentStub.callCount, 1, "The function addDependent has been called once.");
            }.bind(this));
    });

    QUnit.test("Calls the function _openValueHelpDialog", function (assert) {
        // Arrange
        var oPromise = Promise.resolve(this.oDialogMock);
        this.oFragmentLoadStub.returns(oPromise);

        // Act
        this.oContentNodeSelector._showValueHelp(this.oEvent);

        // Assert
        return oPromise
            .then(function () {
                assert.strictEqual(this.oOpenValueHelpStub.callCount, 1, "The function _openValueHelpDialog has been called once.");
                assert.deepEqual(this.oOpenValueHelpStub.firstCall.args, ["The current control text"], "The function _openValueHelpDialog has been called with the correct parameters.");
            }.bind(this));
    });

    QUnit.test("Caches the reference to the new dialog", function (assert) {
        // Arrange
        var oPromise = Promise.resolve(this.oDialogMock);
        this.oFragmentLoadStub.returns(oPromise);

        // Act
        this.oContentNodeSelector._showValueHelp(this.oEvent);

        // Assert
        return oPromise
            .then(function () {
                assert.strictEqual(this.oContentNodeSelector._oValueHelpDialog, this.oDialogMock, "The correct reference has been found.");
            }.bind(this));
    });

    QUnit.module("The function _openValueHelpDialog", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oExpandStub = sandbox.stub();
            var oTree = {
                expandToLevel: this.oExpandStub
            };

            this.oSetValueStub = sandbox.stub();
            var oSearchInput = {
                setValue: this.oSetValueStub
            };

            this.oFragmentByIdStub = sandbox.stub(Fragment, "byId");
            this.oFragmentByIdStub.withArgs("MyCNS-ValueHelpDialog", "ContentNodesTree").returns(oTree);
            this.oFragmentByIdStub.withArgs("MyCNS-ValueHelpDialog", "ContentNodesSearch").returns(oSearchInput);

            this.oOpenStub = sandbox.stub();

            this.oBeginButtonStub = sandbox.stub().returns({
                getEnabled: sandbox.stub().returns(true),
                setEnabled: sandbox.stub()
            });

            this.oContentNodeSelector = new ContentNodeSelector("MyCNS");
            this.oContentNodeSelector._oValueHelpDialog = {
                open: this.oOpenStub,
                destroy: sandbox.stub(),
                getBeginButton: this.oBeginButtonStub
            };

            this.oSearchStub = sandbox.stub(this.oContentNodeSelector, "_onValueHelpSearch");
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Uses the correct tree control", function (assert) {
        // Act
        this.oContentNodeSelector._openValueHelpDialog();

        // Assert
        assert.strictEqual(this.oFragmentByIdStub.callCount, 2, "The function Fragment.byId has been called once.");
        assert.strictEqual(this.oFragmentByIdStub.firstCall.args[0], "MyCNS-ValueHelpDialog", "The function Fragment.byId has been called with the correct parameter.");
        assert.strictEqual(this.oFragmentByIdStub.firstCall.args[1], "ContentNodesTree", "The function Fragment.byId has been called with the correct parameter.");
        assert.strictEqual(this.oFragmentByIdStub.secondCall.args[0], "MyCNS-ValueHelpDialog", "The function Fragment.byId has been called with the correct parameter.");
        assert.strictEqual(this.oFragmentByIdStub.secondCall.args[1], "ContentNodesSearch", "The function Fragment.byId has been called with the correct parameter.");
    });

    QUnit.test("Expands the tree to level 1", function (assert) {
        // Act
        this.oContentNodeSelector._openValueHelpDialog();

        // Assert
        assert.strictEqual(this.oExpandStub.callCount, 1, "The function expandToLevel has been called once.");
        assert.deepEqual(this.oExpandStub.firstCall.args, [1], "The function expandToLevel has been called with the correct parameters.");
    });

    QUnit.test("Updates the search input's value with the given text", function (assert) {
        // Act
        this.oContentNodeSelector._openValueHelpDialog("My Search Term");

        // Assert
        assert.strictEqual(this.oSetValueStub.callCount, 1, "The function setValue has been called once.");
        assert.deepEqual(this.oSetValueStub.firstCall.args, ["My Search Term"], "The function setValue has been called with the correct parameters.");
    });

    QUnit.test("Opens the dialog", function (assert) {
        // Act
        this.oContentNodeSelector._openValueHelpDialog();

        // Assert
        assert.strictEqual(this.oOpenStub.callCount, 1, "The function open has been called once.");
    });

    QUnit.test("Calls the function _onValueHelpSearch", function (assert) {
        // Act
        this.oContentNodeSelector._openValueHelpDialog();

        // Assert
        assert.strictEqual(this.oSearchStub.callCount, 1, "The function _onValueHelpSearch has been called once.");
    });

    QUnit.module("The function _onValueHelpSearch", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector("MyCNS");

            this.oFilterStub = sandbox.stub();
            var oBinding = {
                filter: this.oFilterStub
            };
            this.oGetBindingStub = sandbox.stub().returns(oBinding);
            var oTree = {
                getBinding: this.oGetBindingStub
            };

            this.oGetValueStub = sandbox.stub().returns("Some Search Term");
            var oSearchInput = {
                getValue: this.oGetValueStub
            };

            this.oFragmentByIdStub = sandbox.stub(Fragment, "byId");
            this.oFragmentByIdStub.withArgs("MyCNS-ValueHelpDialog", "ContentNodesTree").returns(oTree);
            this.oFragmentByIdStub.withArgs("MyCNS-ValueHelpDialog", "ContentNodesSearch").returns(oSearchInput);
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Filters the tree showing only matching pages with the search text", function (assert) {
        // Act
        this.oContentNodeSelector._onValueHelpSearch();

        // Assert
        assert.strictEqual(this.oGetValueStub.callCount, 1, "The function getValue was called once.");
        assert.strictEqual(this.oFragmentByIdStub.callCount, 2, "The function Fragment.byId was called twice.");
        assert.strictEqual(this.oGetBindingStub.callCount, 1, "The function getBinding has been called once.");
        assert.strictEqual(this.oGetBindingStub.firstCall.args[0], "items", "The function getBinding has been called once.");
        assert.strictEqual(this.oFilterStub.callCount, 1, "The function filter has been called once.");

        var oFilter = this.oFilterStub.firstCall.args[0];
        assert.strictEqual(oFilter.sOperator, FilterOperator.Contains, "The correct filter operator has been found.");
        assert.strictEqual(oFilter.sPath, "label", "The correct filter path has been found.");
        assert.strictEqual(oFilter.oValue1, "Some Search Term", "The correct filter value has been found.");
    });

    QUnit.module("The function _onValueHelpBeginButtonPressed", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector("MyCNS");

            this.oCloseStub = sandbox.stub();
            this.oDestroyStub = sandbox.stub();
            this.oContentNodeSelector._oValueHelpDialog = {
                close: this.oCloseStub,
                destroy: this.oDestroyStub
            };
            this.oCreateTokenFromPathStub = sandbox.stub(this.oContentNodeSelector, "_createToken");

            this.aContextPaths = [];
            this.oGetSelectedContextPathsStub = sandbox.stub().returns(this.aContextPaths);
            var oTree = {
                getSelectedContextPaths: this.oGetSelectedContextPathsStub
            };

            this.oGetModelStub = sandbox.stub(this.oContentNodeSelector, "getModel")
                .withArgs("_internal");
            this.oGetPropertyStub = sandbox.stub();
            this.oClearStub = sandbox.stub();

            var oSearch = {
                clear: this.oClearStub
            };

            var oMultiInput = this.oContentNodeSelector.getAggregation("content");
            this.oAddValidateTokenStub = sandbox.stub(oMultiInput, "addValidateToken");
            this.oSetValueStub = sandbox.stub(oMultiInput, "setValue");
            this.oDestroyTokensStub = sandbox.stub(oMultiInput, "destroyTokens");
            this.oGetAggregationStub = sandbox.stub(oMultiInput, "getAggregation");
            this.oGetAggregationStub.onCall(0)
                .returns([]);
            this.oGetAggregationStub.onCall(1)
                .returns([{ getProperty: sandbox.stub().returns("firstPath") }]);

            this.oFragmentByIdStub = sandbox.stub(Fragment, "byId");
            this.oFragmentByIdStub.withArgs("MyCNS-ValueHelpDialog", "ContentNodesTree").returns(oTree);
            this.oFragmentByIdStub.withArgs("MyCNS-ValueHelpDialog", "ContentNodesSearch").returns(oSearch);
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Closes the value help dialog", function (assert) {
        // Act
        this.oContentNodeSelector._onValueHelpBeginButtonPressed();

        // Assert
        assert.strictEqual(this.oCloseStub.callCount, 1, "The function close has been called once.");
    });

    QUnit.test("Destroys all tokens", function (assert) {
        // Act
        this.oContentNodeSelector._onValueHelpBeginButtonPressed();

        // Assert
        assert.strictEqual(this.oDestroyTokensStub.callCount, 1, "The function destroyTokens has been called once.");
    });

    QUnit.test("Resets the value of multi input control", function (assert) {
        // Arrange
        // Act
        this.oContentNodeSelector._onValueHelpBeginButtonPressed();

        // Assert
        assert.strictEqual(this.oSetValueStub.callCount, 1, "The function setValue has been called once.");
        assert.strictEqual(this.oSetValueStub.getCall(0).args[0], "", "The function setValue has been called with the correct parameters.");
    });

    QUnit.test("Adds a token for each selected context to the MultiInput", function (assert) {
        this.oGetPropertyStub.onCall(0)
            .returns({ id: "firstPath" });
        this.oGetPropertyStub.onCall(1)
            .returns({ id: "secondPath" });
        var oModelStub = {
            getProperty: this.oGetPropertyStub
        };
        this.oGetModelStub.returns(oModelStub);

        var oFirstToken = {};
        this.oCreateTokenFromPathStub.onCall(0).returns(oFirstToken);
        var oExpectedFirstToken = {
            token: oFirstToken
        };
        var oSecondToken = {};
        this.oCreateTokenFromPathStub.onCall(1).returns(oSecondToken);
        var oExpectedSecondToken = {
            token: oSecondToken
        };

        this.aContextPaths.push(
            { id: "/firstPath/1" },
            { id: "/secondPath/2" }
        );

        // Act
        this.oContentNodeSelector._onValueHelpBeginButtonPressed();

        // Assert
        assert.strictEqual(this.oAddValidateTokenStub.callCount, 2, "The function addToken has been called twice.");
        assert.deepEqual(this.oAddValidateTokenStub.firstCall.args[0], oExpectedFirstToken, "The function addToken has been called with the correct parameter.");
        assert.deepEqual(this.oAddValidateTokenStub.secondCall.args[0], oExpectedSecondToken, "The function addToken has been called with the correct parameter.");
    });

    QUnit.test("Filters out duplicate pages.", function (assert) {
        this.oGetPropertyStub.onCall(0)
            .returns({ id: "firstPath" });
        this.oGetPropertyStub.onCall(1)
            .returns({ id: "firstPath" });
        var oModelStub = {
            getProperty: this.oGetPropertyStub
        };
        this.oGetModelStub.returns(oModelStub);

        // Arrange
        var oFirstToken = { key: "First" };
        this.oCreateTokenFromPathStub.onCall(0).returns(oFirstToken);
        var oExpectedFirstToken = {
            token: oFirstToken
        };

        this.aContextPaths.push(
            { id: "/firstPath/1" },
            { id: "/secondPath/2" }
        );

        // Act
        this.oContentNodeSelector._onValueHelpBeginButtonPressed();

        // Assert
        assert.strictEqual(this.oAddValidateTokenStub.callCount, 1, "The function addToken has been called once.");
        assert.deepEqual(this.oAddValidateTokenStub.firstCall.args[0], oExpectedFirstToken, "The function addToken has been called with the correct parameter.");
    });

    QUnit.module("The function _onValueHelpEndButtonPressed", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector();

            this.oCloseStub = sandbox.stub();
            this.oDestroyStub = sandbox.stub();
            this.oContentNodeSelector._oValueHelpDialog = {
                close: this.oCloseStub,
                destroy: this.oDestroyStub
            };
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Closes the value help dialog", function (assert) {
        // Act
        this.oContentNodeSelector._onValueHelpEndButtonPressed();

        // Assert
        assert.strictEqual(this.oCloseStub.callCount, 1, "The function close has been called once.");
    });

    QUnit.module("The function _onTokenUpdate", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector();

            this.oSetTokensSelectedStub = sandbox.stub(this.oContentNodeSelector, "_setTokensSelected");

            this.oFireSelectionChangedStub = sandbox.stub(this.oContentNodeSelector, "fireSelectionChanged");

            this.oGetParameterStub = sandbox.stub();

            this.aAddedTokens = [];
            this.oGetParameterStub.withArgs("addedTokens").returns(this.aAddedTokens);

            this.aRemovedTokens = [];
            this.oGetParameterStub.withArgs("removedTokens").returns(this.aRemovedTokens);

            this.oEvent = {
                getParameter: this.oGetParameterStub
            };

            this.oFakeTimer = sandbox.useFakeTimers();
        },

        afterEach: function () {
            this.oTranslationModel.destroy();
            this.oContentNodeSelector.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls the function _setTokensSelected with the added tokens", function (assert) {
        // Act
        this.oContentNodeSelector._onTokenUpdate(this.oEvent);

        // Assert
        assert.strictEqual(this.oSetTokensSelectedStub.callCount, 2, "The function _setTokensSelected has been called twice.");
        assert.strictEqual(this.oSetTokensSelectedStub.firstCall.args[0], this.aAddedTokens, "The function _setTokensSelected has been called with the correct parameter.");
        assert.strictEqual(this.oSetTokensSelectedStub.firstCall.args[1], true, "The function _setTokensSelected has been called with the correct parameter.");
    });

    QUnit.test("Calls the function _setTokensSelected with the added tokens", function (assert) {
        // Act
        this.oContentNodeSelector._onTokenUpdate(this.oEvent);

        // Assert
        assert.strictEqual(this.oSetTokensSelectedStub.callCount, 2, "The function _setTokensSelected has been called twice.");
        assert.strictEqual(this.oSetTokensSelectedStub.secondCall.args[0], this.aRemovedTokens, "The function _setTokensSelected has been called with the correct parameter.");
        assert.strictEqual(this.oSetTokensSelectedStub.secondCall.args[1], false, "The function _setTokensSelected has been called with the correct parameter.");
    });

    QUnit.test("Triggers the selectionChanged event asynchronously", function (assert) {
        // Act
        this.oContentNodeSelector._onTokenUpdate(this.oEvent);

        // Assert
        assert.strictEqual(this.oFireSelectionChangedStub.callCount, 0, "The function fireSelectionChanged wasn't called synchronously.");
        this.oFakeTimer.next();
        assert.strictEqual(this.oFireSelectionChangedStub.callCount, 1, "The function fireSelectionChanged was called asynchronously using a timeout.");
    });

    QUnit.module("The function _setTokensSelected", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);
        },

        afterEach: function () {
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Updates the 'selected' property of each of the given tokens' contexts to the provided value", function (assert) {
        // Arrange
        var oGetBindingContextStub = sandbox.stub();
        var oSetPropertyStub = sandbox.stub();
        var oModel = {
            setProperty: oSetPropertyStub
        };
        var oFirstContext = {
            getModel: sandbox.stub().returns(oModel),
            getPath: sandbox.stub().returns("context1Path")
        };
        var oSecondContext = {
            getModel: sandbox.stub().returns(oModel),
            getPath: sandbox.stub().returns("context2Path")
        };
        oGetBindingContextStub.withArgs("_internal").onCall(0).returns(oFirstContext);
        oGetBindingContextStub.withArgs("_internal").onCall(1).returns(oSecondContext);

        var aTokens = [
            {
                getBindingContext: oGetBindingContextStub
            }, {
                getBindingContext: oGetBindingContextStub
            }
        ];
        var oValue = {};
        var oContentNodeSelector = new ContentNodeSelector();

        // Act
        oContentNodeSelector._setTokensSelected(aTokens, oValue);

        // Assert
        assert.strictEqual(oSetPropertyStub.callCount, 2, "The function setProperty has been called twice.");
        assert.strictEqual(oSetPropertyStub.firstCall.args[0], "context1Path", "The function setProperty has been called with the correct parameter.");
        assert.strictEqual(oSetPropertyStub.firstCall.args[1], oValue, "The function setProperty has been called with the correct parameter.");
        assert.strictEqual(oSetPropertyStub.secondCall.args[0], "context2Path", "The function setProperty has been called with the correct parameter.");
        assert.strictEqual(oSetPropertyStub.secondCall.args[1], oValue, "The function setProperty has been called with the correct parameter.");

        // Cleanup
        oContentNodeSelector.destroy();
    });

    QUnit.module("The function _validateItem", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector();

            this.oToken = {};
            this.oCreateTokenStub = sandbox.stub(this.oContentNodeSelector, "_createToken").returns(this.oToken);
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns suggestedTokens if they already exist", function (assert) {
        // Arrange
        var oItem = {
            suggestedToken: []
        };

        // Act
        var oResult = this.oContentNodeSelector._validateItem(oItem);

        // Assert
        assert.strictEqual(oResult, oItem.suggestedToken, "The suggestedTokens were returned.");
    });

    QUnit.test("Returns null if no associated suggestion item was found", function (assert) {
        // Act
        var oResult = this.oContentNodeSelector._validateItem({});

        // Assert
        assert.strictEqual(oResult, null, "The correct value has been found.");
    });

    QUnit.test("Returns the result of _createToken if an associated suggestion item exists", function (assert) {
        // Arrange
        this.oGetPathStub = sandbox.stub().returns("myPath");

        var oBindingContext = {
            getPath: this.oGetPathStub
        };

        var oGetBindingContextStub = sandbox.stub().returns(oBindingContext);
        var oSuggestion = {
            suggestionObject: {
                getBindingContext: oGetBindingContextStub
            }
        };

        // Act
        var oResult = this.oContentNodeSelector._validateItem(oSuggestion);

        // Assert
        assert.strictEqual(oGetBindingContextStub.callCount, 1, "The function getBindingContext has been called once.");
        assert.strictEqual(oGetBindingContextStub.firstCall.args[0], "_internal", "The function getBindingContext has been called with the correct parameter.");
        assert.strictEqual(this.oCreateTokenStub.callCount, 1, "The function _createToken has been called once.");
        assert.strictEqual(this.oCreateTokenStub.firstCall.args[0], "myPath", "The function _createToken has been called with the correct parameter.");
        assert.strictEqual(oResult, this.oToken, "The correct value has been found.");
    });

    QUnit.module("The function _createToken", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);

            this.oContentNodeSelector = new ContentNodeSelector();
            this.oBindObjectStub = sandbox.stub(Token.prototype, "bindObject");
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Returns an sap.m.Token instance with the correct properties", function (assert) {
        // Act
        var oToken = this.oContentNodeSelector._createToken("/items/0");

        var oKeyBindingInfoPart = oToken.getBindingInfo("key").parts[0];
        var oTextBindingInfoPart = oToken.getBindingInfo("text").parts[0];

        // Assert
        assert.ok(oToken.isA("sap.m.Token"), "The correct control type has been used.");
        assert.strictEqual(oKeyBindingInfoPart.path, "id", "The correct value has been found.");
        assert.strictEqual(oTextBindingInfoPart.path, "label", "The correct value has been found.");
        assert.strictEqual(oKeyBindingInfoPart.model, "_internal", "The correct value has been found.");
        assert.strictEqual(oTextBindingInfoPart.model, "_internal", "The correct value has been found.");
    });

    QUnit.test("Calls the bindObject function with the correct parameters", function (assert) {
        // Arrange
        // Act
        this.oContentNodeSelector._createToken("/items/0");

        // Assert
        assert.strictEqual(this.oBindObjectStub.callCount, 1, "The function bindObject has been called once.");
        assert.deepEqual(this.oBindObjectStub.firstCall.args, [{
            path: "/items/0",
            model: "_internal"
        }], "The function bindObject has been called with the correct parameters.");
    });

    QUnit.module("The static function _getSuggestions", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls _getChildren with the passed array and an aggregator", function (assert) {
        // Arrange
        var aItems = [];
        this.oGetChildrenStub = sandbox.stub(ContentNodeSelector, "_getChildren");

        // Act
        ContentNodeSelector._getSuggestions(aItems);

        // Assert
        assert.strictEqual(this.oGetChildrenStub.firstCall.args[0], aItems, "The correct first parameter has been passed.");
        assert.deepEqual(this.oGetChildrenStub.firstCall.args[1], [], "The correct second parameter has been passed.");
    });

    QUnit.module("The static function _getChildren", {
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("There is no need to extract children from a classic homepage content node", function (assert) {
        // Arrange
        var aItems = [{
            id: "/UI2/Fiori2LaunchpadHome",
            label: "Fiori Wave2 Launchpad Home",
            type: "HomepageGroup",
            isContainer: true
        }];
        var aAggregator = [];

        // Act
        ContentNodeSelector._getChildren(aItems, aAggregator);

        // Assert
        assert.deepEqual(aAggregator, aItems, "The received array was not changed.");
    });

    QUnit.test("Recursively extracts children from a space/page content node and extracts it in a aggregator", function (assert) {
        // Arrange
        var aItems = [{
            id: "space1",
            isContainer: false,
            children: [
                { isContainer: true, id: "page1" },
                { isContainer: true, id: "page2" }
            ]
        }];
        var aExpectedResult = [
            { isContainer: true, id: "page1" },
            { isContainer: true, id: "page2" }
        ];
        var aAggregator = [];

        // Act
        ContentNodeSelector._getChildren(aItems, aAggregator);

        // Assert
        assert.deepEqual(aAggregator, aExpectedResult, "The correct items have been returned.");
    });

    QUnit.module("The static function _normalizeContentNodes", {
        beforeEach: function () {
            this.oLoadContentNodesStub = sandbox.stub(ContentNodeSelector.prototype, "_loadContentNodes");
            this.oLoadContentNodesStub.returns({
                then: sandbox.stub()
            });
            this.oOverwriteLabelStub = sandbox.stub(ContentNodeSelector.prototype, "_overwriteLabel");

            this.oGetTranslationModelStub = sandbox.stub(resources, "getTranslationModel");
            this.oTranslationModel = new JSONModel();
            this.oGetTranslationModelStub.returns(this.oTranslationModel);
        },

        afterEach: function () {
            this.oTranslationModel.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Calls the function _visitPages with the correct parameters", function (assert) {
        // Arrange
        var aContentNodes = [];
        var oVisitPagesStub = sandbox.stub(ContentNodeSelector, "_visitPages");

        // Act
        ContentNodeSelector._normalizeContentNodes(aContentNodes);

        // Assert
        assert.strictEqual(oVisitPagesStub.callCount, 1, "The visitPages function was called once.");
        assert.deepEqual(oVisitPagesStub.firstCall.args[0], aContentNodes);
        assert.strictEqual(typeof oVisitPagesStub.firstCall.args[1], "function", "The second parameter is of type function.");
    });

    QUnit.module("The static function _normalizeContentNodes' _visitPages callbacks", {
        beforeEach: function () {
            var oVisitPagesStub = sandbox.stub(ContentNodeSelector, "_visitPages");
            ContentNodeSelector._normalizeContentNodes();
            this.fnCallback = oVisitPagesStub.firstCall.args[1];
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Initially adds the spaceTitles array to the processed page", function (assert) {
        // Arrange
        var oSpace = {
            label: "Test Space 1"
        };
        var oPage = {
            id: "Test Page 1"
        };
        var oExpectedPage = {
            id: "Test Page 1", spaceTitles: ["Test Space 1"]
        };

        // Act
        this.fnCallback(oSpace, oPage);

        // Assert
        assert.deepEqual(oPage, oExpectedPage, "The spaceTitles property was added.");
    });

    QUnit.test("Adds one more space label property to the existing spaceTitles array of the processed page", function (assert) {
        // Arrange
        var oSpace = {
            label: "Test Space 2"
        };
        var oPage = {
            id: "Test Page 1",
            spaceTitles: ["Test Space 1"]
        };
        var oExpectedPage = {
            id: "Test Page 1", spaceTitles: ["Test Space 1", "Test Space 2"]
        };

        // Act
        this.fnCallback(oSpace, oPage);

        // Assert
        assert.deepEqual(oPage, oExpectedPage, "The spaceTitles property was added.");
    });

    QUnit.test("Adds the space label to every page", function (assert) {
        // Arrange
        var oSpace = {
            label: "Test Space 1"
        };
        var oFirstPage = {
            id: "Test Page 1"
        };
        var oSecondPage = {
            id: "Test Page 2"
        };

        // Act
        this.fnCallback(oSpace, oFirstPage);
        this.fnCallback(oSpace, oSecondPage);

        // Assert
        assert.deepEqual(oFirstPage, {
            id: "Test Page 1",
            spaceTitles: ["Test Space 1"]
        }, "The spaceTitle was only once added to the page property.");
        assert.deepEqual(oSecondPage, {
            id: "Test Page 2",
            spaceTitles: ["Test Space 1"]
        }, "The spaceTitle was only once added to the page property.");
    });

    QUnit.test("Returns the same page if it is the first one found", function (assert) {
        // Arrange
        var oSpace = {
            label: "Test Space 1"
        };
        var oPage = {
            id: "Test Page 1"
        };

        // Act
        var oResult = this.fnCallback(oSpace, oPage);

        // Assert
        assert.strictEqual(oResult, oPage, "The correct content node reference was returned.");
    });

    QUnit.test("Returns the reference of the first page found", function (assert) {
        // Arrange
        var oSpace = {
            label: "Test Space 1"
        };
        var oFirstPage = {
            id: "Test Page 1"
        };
        var oSecondPage = {
            id: "Test Page 1"
        };

        // Act
        this.fnCallback(oSpace, oFirstPage);
        var oResult = this.fnCallback(oSpace, oSecondPage);

        // Assert
        assert.strictEqual(oResult, oFirstPage, "The correct content node reference was returned.");
    });

    QUnit.module("The static function _visitPages", {
        beforeEach: function () {
            this.fnCallback = sandbox.stub();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Calls the callback for each page in the content nodes.", function (assert) {
        // Arrange
        var oFirstPage = {};
        var oSecondPage = {};
        var oSpace = {
            type: ContentNodeType.Space,
            children: [
                oFirstPage,
                oSecondPage
            ]
        };
        var aContentNodes = [oSpace];

        // Act
        ContentNodeSelector._visitPages(aContentNodes, this.fnCallback);

        // Assert
        assert.strictEqual(this.fnCallback.callCount, 2, "The callback was called for each page in content nodes.");
        assert.strictEqual(this.fnCallback.firstCall.args[0], oSpace, "The first callback was called with the correct space reference.");
        assert.strictEqual(this.fnCallback.firstCall.args[1], oFirstPage, "The first callback was called with the correct first page reference.");
        assert.strictEqual(this.fnCallback.secondCall.args[0], oSpace, "The second callback was called with the correct space reference.");
        assert.strictEqual(this.fnCallback.secondCall.args[1], oSecondPage, "The second callback was called with the correct second page reference.");
    });

    QUnit.test("When no content nodes exists, the callback cannot be called.", function (assert) {
        // Act
        ContentNodeSelector._visitPages(undefined, this.fnCallback);

        // Assert
        assert.strictEqual(this.fnCallback.callCount, 0, "The callback was not called.");
    });

    QUnit.test("Does not call the callback if a group is found", function (assert) {
        // Arrange
        var aContentNodes = [
            {
                type: ContentNodeType.HomepageGroup
            }
        ];

        // Act
        ContentNodeSelector._visitPages(aContentNodes, this.fnCallback);

        // Assert
        assert.strictEqual(this.fnCallback.callCount, 0, "The callback was not called.");
    });

    QUnit.module("UI5 lifecycle handling", {
        beforeEach: function () {
            this.oRegisterSpy = sandbox.spy(Control.prototype, "register");
            this.oDeregisterSpy = sandbox.spy(Control.prototype, "deregister");
            var aContentNodes = [];

            sandbox.stub(Container, "getServiceAsync").withArgs("BookmarkV2").resolves({
                getContentNodes: async function () {
                    return (aContentNodes);
                }
            });

            this.oGetUserStub = sandbox.stub(Container, "getUser").returns({
                getShowMyHome: sandbox.stub().returns(true)
            });
        },
        afterEach: function (assert) {
            var oControl;
            for (var i = 0; i < this.oRegisterSpy.callCount; i++) {
                oControl = this.oRegisterSpy.getCall(i).thisValue;
                //We must ignore invisible text controls,they are shared instances
                //and are not destroyed.
                if (oControl.isA("sap.ui.core.InvisibleText")) {
                    continue;
                }

                assert.ok(includes(this.oDeregisterSpy.thisValues, oControl), oControl.getId() + "has been destroyed.");
            }
            sandbox.restore();
        }
    });

    QUnit.test("The control and each part are correctly destroyed.", function () {
        //Arrange
        var oContentNodeSelector = new ContentNodeSelector();

        //Act
        oContentNodeSelector.destroy();

        //Assert
        //Done in afterEach
    });

    QUnit.test("The control and open value help dialog are correctly destroyed.", function () {
        //Arrange
        var fnOriginalLoad = Fragment.load;
        var oPromise;
        Fragment.load = function () {
            oPromise = fnOriginalLoad.apply(this, arguments);
            return oPromise;
        };
        var oContentNodeSelector = new ContentNodeSelector();
        var oMultiInput = oContentNodeSelector.getAggregation("content");
        oMultiInput.fireValueHelpRequest();

        return oPromise.then(function () {
            //Act
            oContentNodeSelector.destroy();

            //Assert
            //Done in afterEach
        });
    });

    QUnit.module("The function clearSelection", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("BookmarkV2").resolves({
                getContentNodes: sandbox.stub().resolves([])
            });

            this.aTokens = [{
                getBindingContext: sandbox.stub().withArgs("_internal").returns({
                    getPath: sandbox.stub().withArgs("_internal").returns("/myFirstPath")
                })
            }, {
                getBindingContext: sandbox.stub().withArgs("_internal").returns({
                    getPath: sandbox.stub().withArgs("_internal").returns("/mySecondPath")
                })
            }];

            sandbox.stub(MultiInput.prototype, "getTokens").returns(this.aTokens);
            this.oDestroyTokensStub = sandbox.stub(MultiInput.prototype, "destroyTokens");

            this.oContentNodeSelector = new ContentNodeSelector();

            this.oContentNodeSelector._oModel = new JSONModel({
                myFirstPath: true,
                mySecondPath: true
            });
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("Destroys all tokens and clears selections on the model", function (assert) {
        // Arrange
        const oExpectedData = {
            myFirstPath: false,
            mySecondPath: false
        };

        // Act
        this.oContentNodeSelector.clearSelection();

        // Assert
        assert.strictEqual(this.oDestroyTokensStub.callCount, 1, "destroyTokens was called once");
        const oModelData = this.oContentNodeSelector._oModel.getData();
        assert.deepEqual(oModelData, oExpectedData, "setProperty was called with the right args");
    });

    QUnit.module("The functions setValueState and setValueStateText", {
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync").withArgs("BookmarkV2").resolves({
                getContentNodes: sandbox.stub().resolves([])
            });

            this.oSetValueStateStub = sandbox.stub(MultiInput.prototype, "setValueState");
            this.oSetValueStateTextStub = sandbox.stub(MultiInput.prototype, "setValueStateText");

            this.oContentNodeSelector = new ContentNodeSelector();
        },
        afterEach: function () {
            this.oContentNodeSelector.destroy();
            sandbox.restore();
        }
    });

    QUnit.test("setValueState sets the correct valueState on the control", function (assert) {
        // Arrange

        // Act
        this.oContentNodeSelector.setValueState("myValueState");

        // Assert
        assert.strictEqual(this.oSetValueStateStub.callCount, 1, "setValueState was called once");
        assert.deepEqual(this.oSetValueStateStub.getCall(0).args, ["myValueState"], "setValueState was called with the right args");
    });

    QUnit.test("setValueStateText sets the correct valueStateText on the control", function (assert) {
        // Arrange

        // Act
        this.oContentNodeSelector.setValueStateText("myValueStateText");

        // Assert
        assert.strictEqual(this.oSetValueStateTextStub.callCount, 1, "setValueStateText was called once");
        assert.deepEqual(this.oSetValueStateTextStub.getCall(0).args, ["myValueStateText"], "setValueStateText was called with the right args");
    });
});
