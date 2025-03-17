// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.SaveAsTile
 * @deprecated As of version 1.120
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/library",
    "sap/ui/core/mvc/View",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/hasher",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/SaveAsTile.controller",
    "sap/ushell/Container"
], function (
    Log,
    coreLibrary,
    View,
    JSONModel,
    hasher,
    jQuery,
    resources,
    SaveAsTileController,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    var sandbox = sinon.createSandbox();

    QUnit.module("View", {
        beforeEach: function () {
            this.oModel = new JSONModel({
                icon: "sap-icon://Fiori9/F1515",
                info: "Description",
                number: 515,
                numberState: "Positive",
                numberUnit: "Days Overdue",
                subtitle: "Test Subtitle",
                title: "Test Title " + "1234567890".repeat(49) + "yyyyy"
            });

            this.oLoadPersonalizedGroupsStub = sandbox.stub(SaveAsTileController.prototype, "loadPersonalizedGroups");

            return View.create({
                viewName: "module:sap/ushell/ui/footerbar/SaveAsTile.view"
            }).then(function (oView) {
                this.oView = oView;
                this.oView.setModel(this.oModel);
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oView.destroy();
        }
    });

    QUnit.test("Check required property is set correctly on input elements", function (assert) {
        // Assert
        var oContent = this.oView.getContent();
        assert.strictEqual(oContent[2].getProperty("required"), true, "title have a required property");
        assert.strictEqual(oContent[4].getProperty("required"), false, "subtitle doesn't have a required property");
        assert.strictEqual(oContent[6].getProperty("required"), false, "info doesn't have a required property");
    });

    QUnit.test("The target drop down indicates that a group is to be selected.", function (assert) {
        // Assert
        var oTargetsLabel = this.oView.getContent()[8];
        assert.strictEqual(oTargetsLabel.getText(), "Group:", "The label of the drop-down is correct.");
    });

    QUnit.module("Controller: onInit", {
        beforeEach: function () {
            this.oController = new SaveAsTileController();

            this.oAttachLiveChangeStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getTitleInput: sandbox.stub().returns({
                    attachLiveChange: this.oAttachLiveChangeStub
                })
            });

            sandbox.stub(resources.i18n, "getText").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Attaches to titleInput liveChange event", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.oAttachLiveChangeStub.callCount, 1, "attached to the event");
    });

    QUnit.test("Sets the TitleInput ValueState to Error", function (assert) {
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

    QUnit.test("Sets the TitleInput ValueState to None", function (assert) {
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

    QUnit.module("Controller: loadPersonalizedGroups", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetGroupsForBookmarksStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").resolves({
                getGroupsForBookmarks: this.oGetGroupsForBookmarksStub
            });

            this.oLogErrorStub = sandbox.stub(Log, "error");

            this.oModel = new JSONModel({});
            this.oSetPropertySpy = sandbox.spy(this.oModel, "setProperty");

            this.oController = new SaveAsTileController();

            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Loads the groups and sets the model", function (assert) {
        // Arrange
        var aGroups = [{ id: 1 }, { id: 2 }, { id: 3 }];
        this.oGetGroupsForBookmarksStub.returns(new jQuery.Deferred().resolve(aGroups));
        // Act
        return this.oController.loadPersonalizedGroups().then(function () {
            // Assert
            var aModelGroups = this.oModel.getProperty("/groups");
            assert.deepEqual(aModelGroups, aGroups, "Saved the correct groups");
            var iModelGroupLength = this.oModel.getProperty("/groups/length");
            assert.strictEqual(iModelGroupLength, 3, "Saved the correct group length");
        }.bind(this));
    });

    QUnit.test("Logs error when LaunchPage Service is not available", function (assert) {
        // Arrange
        this.oGetServiceAsyncStub.withArgs("FlpLaunchPage").rejects();
        var sExpectedMessage = "SaveAsTile controller: Unable to determine targets for bookmark placement.";
        // Act
        return this.oController.loadPersonalizedGroups().then(function () {
            // Assert
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "Logged the correct error message");
            assert.strictEqual(this.oSetPropertySpy.callCount, 0, "The model was not changed");
        }.bind(this));
    });

    QUnit.test("Logs error when getGroupsForBookmarks fails", function (assert) {
        // Arrange
        this.oGetGroupsForBookmarksStub.returns(new jQuery.Deferred().reject());
        var sExpectedMessage = "SaveAsTile controller: Unable to determine targets for bookmark placement.";
        // Act
        return this.oController.loadPersonalizedGroups().then(function () {
            // Assert
            assert.strictEqual(this.oLogErrorStub.getCall(0).args[0], sExpectedMessage, "Logged the correct error message");
            assert.strictEqual(this.oSetPropertySpy.callCount, 0, "The model was not changed");
        }.bind(this));
    });

    QUnit.module("Controller: getLocalizedText", {
        beforeEach: function () {
            this.oController = new SaveAsTileController();

            this.oGetTextStub = sandbox.stub(resources.i18n, "getText").returnsArg(0);
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns The correct text", function (assert) {
        // Arrange
        // Act
        var sResult = this.oController.getLocalizedText("some.i18n.key");
        // Assert
        assert.strictEqual(sResult, "some.i18n.key", "Returned the correct string");
        assert.deepEqual(this.oGetTextStub.getCall(0).args, ["some.i18n.key"], "Called getText with correct args");
    });

    QUnit.test("Returns The correct text", function (assert) {
        // Arrange
        var aExpectedArgs = ["some.i18n.key", ["param1", "param2"]];
        // Act
        var sResult = this.oController.getLocalizedText("some.i18n.key", ["param1", "param2"]);
        // Assert
        assert.strictEqual(sResult, "some.i18n.key", "Returned the correct string");
        assert.deepEqual(this.oGetTextStub.getCall(0).args, aExpectedArgs, "Called getText with correct args");
    });

    QUnit.module("Controller: getBookmarkTileData", {
        beforeEach: function () {
            this.oGroup = { id: "someGroupId" };

            this.oModel = new JSONModel({});

            this.oGetHashStub = sandbox.stub(hasher, "getHash");

            this.oController = new SaveAsTileController();

            this.oGetViewDataStub = sandbox.stub().returns({});
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel),
                getViewData: this.oGetViewDataStub,
                oGroupsSelect: {
                    getSelectedItem: sandbox.stub().returns({
                        getBindingContext: sandbox.stub().returns({
                            getObject: sandbox.stub().returns(this.oGroup)
                        })
                    })
                }
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Returns default values", function (assert) {
        // Arrange
        var oExpectedResult = {
            title: "",
            subtitle: "",
            url: window.location.href,
            icon: "",
            info: "",
            numberUnit: "",
            group: this.oGroup,
            keywords: "",
            dataSource: undefined
        };
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.test("Returns values from Model", function (assert) {
        // Arrange
        var oModelData = {
            title: "some Bookmark",
            subtitle: "with subtitle",
            icon: "sap-icon://bell",
            info: "and footer",
            numberUnit: "EUR",
            serviceRefreshInterval: 0,
            keywords: "keyword123",
            dataSource: {
                settings: {
                    odataVersion: "4.0"
                },
                type: "OData"
            }
        };
        this.oModel.setData(oModelData);
        var oExpectedResult = {
            title: "some Bookmark",
            subtitle: "with subtitle",
            url: window.location.href,
            icon: "sap-icon://bell",
            info: "and footer",
            numberUnit: "EUR",
            group: this.oGroup,
            keywords: "keyword123",
            dataSource: {
                settings: {
                    odataVersion: "4.0"
                },
                type: "OData"
            }
        };
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Returned the correct result");
    });

    QUnit.test("Applies a maximum length", function (assert) {
        // Arrange
        var sLongString = new Array(512).join("a");
        var oModelData = {
            title: sLongString,
            subtitle: sLongString,
            info: sLongString
        };
        this.oModel.setData(oModelData);
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.strictEqual(oResult.title.length, 256, "title has the correct length");
        assert.strictEqual(oResult.subtitle.length, 256, "subtitle has the correct length");
        assert.strictEqual(oResult.info.length, 256, "info has the correct length");
    });

    QUnit.test("Sets the hash as url", function (assert) {
        // Arrange
        this.oGetHashStub.returns("someHash");
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.strictEqual(oResult.url, "#someHash", "the correct hash was returned");
    });

    QUnit.test("Sets the serviceUrl when it is provided as string", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            serviceUrl: "/some/service/url"
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.strictEqual(oResult.serviceUrl, "/some/service/url", "the correct serviceUrl was returned");
    });

    QUnit.test("Sets the serviceUrl when it is provided as function", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            serviceUrl: sandbox.stub().returns("/some/service/url")
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.strictEqual(oResult.serviceUrl, "/some/service/url", "the correct serviceUrl was returned");
    });

    QUnit.test("Sets the customUrl when it is provided as string", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            customUrl: "/some/custom/url"
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.strictEqual(oResult.url, "/some/custom/url", "the correct url was returned");
    });

    QUnit.test("Sets the customUrl when it is provided as function", function (assert) {
        // Arrange
        this.oGetViewDataStub.returns({
            customUrl: sandbox.stub().returns("/some/custom/url")
        });
        // Act
        var oResult = this.oController.getBookmarkTileData();
        // Assert
        assert.strictEqual(oResult.url, "/some/custom/url", "the correct url was returned");
    });

    QUnit.module("Controller: onExit", {
        beforeEach: function () {
            this.oController = new SaveAsTileController();

            this.oDestroyStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                getTileView: sandbox.stub().returns({
                    destroy: this.oDestroyStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
        }
    });

    QUnit.test("Destroy the tile view", function (assert) {
        // Arrange
        // Act
        this.oController.onExit();
        // Assert
        assert.strictEqual(this.oDestroyStub.callCount, 1, "destroy was called once");
    });
});
