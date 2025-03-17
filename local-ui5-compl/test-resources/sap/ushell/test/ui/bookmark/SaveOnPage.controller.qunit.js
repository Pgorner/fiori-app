// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.bookmark.SaveOnPage.controller
 */
sap.ui.define([
    "sap/ushell/ui/bookmark/SaveOnPage.controller",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher",
    "sap/ui/core/library"
], function (
    SaveOnPageController,
    resources,
    JSONModel,
    hasher,
    coreLibrary
) {
    "use strict";

    /* global QUnit, sinon */
    var sandbox = sinon.createSandbox();

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    QUnit.module("onInit", {
        beforeEach: function () {
            this.oViewData = {};
            this.oController = new SaveOnPageController();
            this.oSetPropertyStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub().returns({
                setProperty: this.oSetPropertyStub
            });
            this.oSetModelStub = sandbox.stub();
            this.oGetViewDataStub = sandbox.stub().returns(this.oViewData);
            this.oGetView = sandbox.stub(this.oController, "getView").returns({
                setModel: this.oSetModelStub,
                getModel: this.oGetModelStub,
                getViewData: this.oGetViewDataStub
            });

            this.oByIdStub = sandbox.stub(this.oController, "byId");

            this.oAttachLiveChangeStub = sandbox.stub();
            this.oByIdStub.withArgs("bookmarkTitleInput").returns({
                attachLiveChange: this.oAttachLiveChangeStub
            });

            sandbox.stub(resources.i18n, "getText").returnsArg(0);

            this.oGetSelectedContentNodesStub = sandbox.stub().returns([{
                id: "page1"
            }]);

            this.oByIdStub.withArgs("SelectedNodesComboBox").returns({
                getSelectedContentNodes: this.oGetSelectedContentNodesStub,
                attachSelectionChanged: sandbox.stub(),
                fireSelectionChanged: sandbox.stub()
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Sets i18n Model", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 1, "The function setModel was called once.");
        assert.deepEqual(this.oSetModelStub.getCall(0).args, [resources.i18nModel, "i18n"], "The function setModel was called with correct parameters.");
    });

    QUnit.test("Attaches the TitleInput liveChange event", function (assert) {
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oAttachLiveChangeStub.callCount, 1, "attached to the event");
    });

    QUnit.test("Attached handler sets the TitleInput ValueState to Error", function (assert) {
        // Arrange
        var oScope = {
            getValue: sandbox.stub().returns(""),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        // Act
        this.oController.onInit();
        this.oAttachLiveChangeStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.getCall(0).args[0], "bookmarkTitleInputError", "set the correct ValueStateText");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.Error, "set the ValueState to Error");
    });

    QUnit.test("Attached handler sets the TitleInput ValueState to None", function (assert) {
        // Arrange
        var oScope = {
            getValue: sandbox.stub().returns("some Title"),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        // Act
        this.oController.onInit();
        this.oAttachLiveChangeStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.callCount, 0, "setValueStateText was not called");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.None, "set the ValueState to None");
    });

    QUnit.module("removeFocusFromTile");

    QUnit.test("Removes attribute 'tabindex' from tile preview", function (assert) {
        // Arrange
        var oController = new SaveOnPageController();
        var oDomElement = document.createElement("div");
        var oGenericTile = document.createElement("div");
        oGenericTile.setAttribute("class", "sapMGT");
        oGenericTile.setAttribute("tabindex", "0");
        oDomElement.appendChild(oGenericTile);

        this.oGetDomRefStub = sandbox.stub().returns(oDomElement);
        this.oGetViewStub = sandbox.stub(oController, "getView").returns({
            getDomRef: this.oGetDomRefStub
        });

        // Act
        oController.removeFocusFromTile();

        // Assert
        assert.notOk(oDomElement.getAttribute("tabindex"), "The attribute 'tabindex' was removed.");

        // Clean up
        sandbox.restore();
        oController.destroy();
    });

    QUnit.module("getBookmarkTileData", {
        beforeEach: function () {
            this.oController = new SaveOnPageController();
            this.oModel = new JSONModel({
                title: "  title",
                subtitle: "subtitle  ",
                icon: "icon",
                info: "info  ",
                numberUnit: "Days Overdue",
                serviceRefreshInterval: "serviceRefreshInterval",
                keywords: "keywords",
                dataSource: {
                    settings: {
                        odataVersion: "4.0"
                    },
                    type: "OData"
                }
            });
            this.oViewData = {
                serviceUrl: "ServiceUrl"
            };

            this.oGetModelStub = sandbox.stub().returns(this.oModel);
            this.oGetViewDataStub = sandbox.stub().returns(this.oViewData);
            this.oGetView = sandbox.stub(this.oController, "getView").returns({
                getModel: this.oGetModelStub,
                getViewData: this.oGetViewDataStub
            });

            this.oGetSelectedContentNodesStub = sandbox.stub().returns([{
                id: "page1"
            }]);

            this.oController.oContentNodeSelector = {
                getSelectedContentNodes: this.oGetSelectedContentNodesStub
            };

            this.oGetHashStub = sandbox.stub(hasher, "getHash").returns("hash");
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns default values when the tile data is not available", function (assert) {
        // Arrange
        this.oGetModelStub.returns(new JSONModel({}));
        this.oGetViewDataStub.returns({});
        this.oGetHashStub.returns();
        this.oGetSelectedContentNodesStub.returns([]);

        var oExpectedResult = {
            title: "",
            subtitle: "",
            url: window.location.href,
            icon: undefined,
            info: "",
            numberUnit: undefined,
            serviceUrl: undefined,
            serviceRefreshInterval: undefined,
            dataSource: undefined,
            contentNodes: [],
            keywords: undefined
        };

        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected result was returned.");
    });

    QUnit.test("Gets bookmark tile data and removes trailing white spaces, then returns then data", function (assert) {
        // Arrange
        var oExpectedResult = {
            title: "title",
            subtitle: "subtitle",
            url: "#hash",
            icon: "icon",
            info: "info",
            numberUnit: "Days Overdue",
            serviceUrl: "ServiceUrl",
            dataSource: {
                settings: {
                    odataVersion: "4.0"
                },
                type: "OData"
            },
            serviceRefreshInterval: "serviceRefreshInterval",
            keywords: "keywords",
            contentNodes: [{ id: "page1" }]
        };

        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "The expected result was returned.");
    });

    QUnit.test("Uses the customer url as url when it is provided as a string in the view data", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            customUrl: "customUrl"
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.strictEqual(oResult.url, "customUrl", "The expected result was returned.");
    });

    QUnit.test("Calculates and uses the customer url as url when it is provided as a function in the view data", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            customUrl: function () {
                return "customUrl";
            }
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.strictEqual(oResult.url, "customUrl", "The expected result was returned.");
    });

    QUnit.test("Calculates and uses the service url as url when it is provided as a function in the view data", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            serviceUrl: function () {
                return "serviceUrl";
            }
        });
        this.oViewData = {};
        // Act
        var oResult = this.oController.getBookmarkTileData();

        // Assert
        assert.strictEqual(oResult.serviceUrl, "serviceUrl", "The expected result was returned.");
    });

    QUnit.module("onValueHelpEndButtonPressed", {
        beforeEach: function () {
            this.oController = new SaveOnPageController();
            this.oGetView = sandbox.stub(this.oController, "getView").returns({
                setModel: sandbox.stub()
            });
            this.oByIdStub = sandbox.stub(this.oController, "byId");

            this.oAttachLiveChangeStub = sandbox.stub();
            this.oByIdStub.withArgs("bookmarkTitleInput").returns({
                attachLiveChange: this.oAttachLiveChangeStub
            });

            this.oGetSelectedContentNodesStub = sandbox.stub().returns([{
                id: "page1"
            }]);
            this.oByIdStub.withArgs("SelectedNodesComboBox").returns({
                getSelectedContentNodes: this.oGetSelectedContentNodesStub,
                fireSelectionChanged: sandbox.spy(),
                attachSelectionChanged: sandbox.stub()
            });
            sandbox.stub(resources.i18n, "getText").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Changes the input's value state to None as one content node is present", function (assert) {
        //Arrange
        var oScope = {
            getSelectedContentNodes: sandbox.stub().returns([{id: "page1"}]),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        this.oAttachSelectionChangedStub = sandbox.stub();
        this.oByIdStub.withArgs("SelectedNodesComboBox").returns({
            attachSelectionChanged: this.oAttachSelectionChangedStub,
            fireSelectionChanged: sandbox.spy()
        });
        // Act
        this.oController.onInit();
        this.oController.onValueHelpEndButtonPressed();
        this.oAttachSelectionChangedStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(this.oController.oContentNodeSelector.fireSelectionChanged.callCount, 1, "Selection Changed Event fired");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.None, "set the ValueState to None");
    });

    QUnit.test("Changes the input's value state to Error as no content node is present", function (assert) {
        // Arrange
        var oScope = {
            getSelectedContentNodes: sandbox.stub().returns([]),
            setValueStateText: sandbox.stub(),
            setValueState: sandbox.stub()
        };
        this.oAttachSelectionChangedStub = sandbox.stub();
        this.oByIdStub.withArgs("SelectedNodesComboBox").returns({
            attachSelectionChanged: this.oAttachSelectionChangedStub,
            fireSelectionChanged: sandbox.spy()
        });
        // Act
        this.oController.onInit();
        this.oController.onValueHelpEndButtonPressed();
        this.oAttachSelectionChangedStub.getCall(0).callArgOn(0, oScope);

        // Assert
        assert.strictEqual(oScope.setValueStateText.getCall(0).args[0], "bookmarkPageSelectError", "set the correct ValueStateText");
        assert.strictEqual(oScope.setValueState.getCall(0).args[0], ValueState.Error, "set the ValueState to Error");
    });

});
