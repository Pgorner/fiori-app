// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.DashboardGroupsBox
 *
 * @deprecated since 1.112
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/Device",
    "sap/ui/core/Component",
    "sap/ui/integration/widgets/Card",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/components/ComponentKeysHandler",
    "sap/ushell/components/homepage/DashboardGroupsBox",
    "sap/ushell/resources",
    "sap/ushell/ui/QuickAccess",
    "sap/ushell/ui/launchpad/DashboardGroupsContainer",
    "sap/ui/integration/library"
], function (
    Log,
    Device,
    Component,
    Card,
    JSONModel,
    Config,
    ComponentKeysHandler,
    DashboardGroupsBox,
    ushellResources,
    QuickAccess,
    DashboardGroupsContainer,
    integrationLibrary
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox({});

    QUnit.module("Event delegates", {
        beforeEach: function () {
            sap.ushell.Container = {
                getServiceAsync: sandbox.stub().returns(Promise.resolve({
                    isLinkPersonalizationSupported: sandbox.stub().returns(true)
                }))
            };
            this.oControllerMock = {};
            this.oModelMock = new JSONModel();
            this.oAddEventDelegateStub = sandbox.stub(DashboardGroupsContainer.prototype, "addEventDelegate");

            this.oDashboardGroupsBox = new DashboardGroupsBox();
        },
        afterEach: function () {
            sandbox.restore();
            this.oDashboardGroupsBox.destroy();
            delete sap.ushell.Container;
        }
    });

    QUnit.test("zipPromiseAll works as expected", function (assert) {
        var done = assert.async();
        return this.oDashboardGroupsBox
            .zipPromiseAll(["theA", "theB"], [Promise.resolve(1), Promise.resolve(2)])
            .then(function (oRes) {
                // eslint-disable-next-line quote-props
                assert.deepEqual(oRes, { theA: 1, theB: 2 });
            })
            .finally(done);
    });

    QUnit.test("onBeforeFastNavigationFocus", function (assert) {
        var done = assert.async();
        // Arrange
        this.oDashboardGroupsBox.createGroupsBox(this.oControllerMock, this.oModelMock);
        setTimeout(function () {
            var fnDelegate = this.oAddEventDelegateStub.getCall(0).args[0].onBeforeFastNavigationFocus;
            var oPreventDefaultStub = sinon.stub();
            var oEvent = {
                preventDefault: oPreventDefaultStub
            };
            // Act
            fnDelegate(oEvent);
            // Assert
            assert.strictEqual(oPreventDefaultStub.callCount, 1, "preventDefault was called once");
            done();
        }.bind(this), 0);
    });

    QUnit.module("The function _getHeaderActions", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: function () {
                    return {
                        isLinkPersonalizationSupported: function () {
                            return true;
                        }
                    };
                }
            };
            this.oDashboardGroupsBox = new DashboardGroupsBox();
        },
        afterEach: function () {
            delete sap.ushell.Container;
            delete Device.system.phone;
            this.oDashboardGroupsBox.destroy();
        }
    });

    QUnit.test("Returns two buttons", function (assert) {
        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        assert.strictEqual(aHeaderActions.length, 2, "The function _getHeaderActions returns only two buttons in Fiori2.");
    });

    QUnit.test("Shows the 'Hide/Show' button only if certain properties of the group model are true", function (assert) {
        // Arrange
        var bEnableHideGroups = true,
            bIsGroupLocked = false,
            bIsDefaultGroup = false;

        var aExpectedBindingParts = [
            { mode: "OneWay", path: "/enableHideGroups" },
            { mode: "OneWay", path: "isGroupLocked" },
            { mode: "OneWay", path: "isDefaultGroup" }
        ];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oVisibleBindingInfo = oHideShowButton.getBindingInfo("visible"),
            bFormatterResult = oVisibleBindingInfo.formatter(bEnableHideGroups, bIsGroupLocked, bIsDefaultGroup),
            aParts = oVisibleBindingInfo.parts;

        assert.deepEqual(aParts, aExpectedBindingParts, "The button visibility binding parts consists of the properties 'enableHideGroups', 'isGroupLocked' & 'isDefaultGroup'.");
        assert.ok(bFormatterResult, "The button visibility is only true if the property enableHideGroups equals 'true' and the properties isGroupLocked & isDefaultGroup equal 'false'.");
    });

    QUnit.test("Disables the 'Hide/Show' button if the title is edited", function (assert) {
        // Arrange
        var bEditTitle = true;

        var aExpectedBindingParts = [{
            mode: "OneWay",
            path: "/editTitle"
        }];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oVisibleBindingInfo = oHideShowButton.getBindingInfo("enabled"),
            bFormatterResult = oVisibleBindingInfo.formatter(bEditTitle),
            aParts = oVisibleBindingInfo.parts;

        assert.deepEqual(aParts, aExpectedBindingParts, "The 'enabled' property binding parts of the button consists of the 'editTitle' property.");
        assert.notOk(bFormatterResult, "The button is disabled if the group title was edited.");
    });

    QUnit.test("Hides the 'Delete/Reset' button if the group is the default group", function (assert) {
        // Arrange
        var bIsDefaultGroup = true;

        var aExpectedBindingParts = [{
            mode: "OneWay",
            path: "isDefaultGroup"
        }];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oDeleteResetButton = aHeaderActions[1],
            oVisibleBindingInfo = oDeleteResetButton.getBindingInfo("visible"),
            bFormatterResult = oVisibleBindingInfo.formatter(bIsDefaultGroup),
            aParts = oVisibleBindingInfo.parts;

        assert.deepEqual(aParts, aExpectedBindingParts, "The button visibility binding parts consists of the 'isDefaultGroup' property.");
        assert.notOk(bFormatterResult, "The button visibility is false if the group is the default group.");
    });

    QUnit.test("Disables the 'Delete/Reset' button if the title is edited", function (assert) {
        // Arrange
        var bEditTitle = true;

        var aExpectedBindingParts = [{
            mode: "OneWay",
            path: "/editTitle"
        }];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oDeleteResetButton = aHeaderActions[1],
            oVisibleBindingInfo = oDeleteResetButton.getBindingInfo("enabled"),
            bFormatterResult = oVisibleBindingInfo.formatter(bEditTitle),
            aParts = oVisibleBindingInfo.parts;

        assert.deepEqual(aParts, aExpectedBindingParts, "The 'enabled' property binding parts of the button consists of the 'editTitle' property.");
        assert.notOk(bFormatterResult, "The button is disabled if the group title was edited.");
    });

    QUnit.test("Shows the right button text according to the group state", function (assert) {
        // Arrange
        var bIsGroupVisible = true,
            bRemovable = true;

        var aExpectedHideShowBindingParts = [{
            mode: "OneWay",
            path: "isGroupVisible"
        }];

        var aExpectedDeleteResetBindingParts = [{
            mode: "OneWay",
            path: "removable"
        }];

        var sExpectedHideShowButtonText = ushellResources.i18n.getText("HideGroupBtn");
        var sExpectedDeleteResetButtonText = ushellResources.i18n.getText("DeleteGroupBtn");

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oHideShowVisibleBindingInfo = oHideShowButton.getBindingInfo("text"),
            sHideShowFormatterResult = oHideShowVisibleBindingInfo.formatter(bIsGroupVisible),
            aHideShowParts = oHideShowVisibleBindingInfo.parts;

        var oDeleteResetButton = aHeaderActions[1],
            oDeleteResetVisibleBindingInfo = oDeleteResetButton.getBindingInfo("text"),
            sDeleteResetFormatterResult = oDeleteResetVisibleBindingInfo.formatter(bRemovable),
            aDeleteResetParts = oDeleteResetVisibleBindingInfo.parts;

        assert.strictEqual(aHideShowParts.path, aExpectedHideShowBindingParts.path, "The 'text' property binding parts of the 'Hide' button consists of the 'isGroupVisible' property.");
        assert.strictEqual(sHideShowFormatterResult, sExpectedHideShowButtonText, "Hide button text equals: " + sExpectedHideShowButtonText);

        assert.strictEqual(aDeleteResetParts.path, aExpectedDeleteResetBindingParts.path, "The 'text' property binding parts of the 'Delete' button consists of the 'removable' property.");
        assert.strictEqual(sDeleteResetFormatterResult, sExpectedDeleteResetButtonText, "Delete button text equals: " + sExpectedDeleteResetButtonText);
    });

    QUnit.test("Shows the right button text according to the group state", function (assert) {
        // Arrange
        var bIsGroupVisible = false,
            bRemovable = false;

        var aExpectedHideShowBindingParts = [{
            mode: "OneWay",
            path: "isGroupVisible"
        }];

        var aExpectedDeleteResetBindingParts = [{
            mode: "OneWay",
            path: "removable"
        }];

        var sExpectedHideShowButtonText = ushellResources.i18n.getText("ShowGroupBtn");
        var sExpectedDeleteResetButtonText = ushellResources.i18n.getText("ResetGroupBtn");

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oHideShowVisibleBindingInfo = oHideShowButton.getBindingInfo("text"),
            sHideShowFormatterResult = oHideShowVisibleBindingInfo.formatter(bIsGroupVisible),
            aHideShowParts = oHideShowVisibleBindingInfo.parts;

        var oDeleteResetButton = aHeaderActions[1],
            oDeleteResetVisibleBindingInfo = oDeleteResetButton.getBindingInfo("text"),
            sDeleteResetFormatterResult = oDeleteResetVisibleBindingInfo.formatter(bRemovable),
            aDeleteResetParts = oDeleteResetVisibleBindingInfo.parts;

        assert.strictEqual(aHideShowParts.path, aExpectedHideShowBindingParts.path, "The 'text' property binding parts of the 'Show' button consists of the 'isGroupVisible' property.");
        assert.strictEqual(sHideShowFormatterResult, sExpectedHideShowButtonText, "Show button text equals: " + sExpectedHideShowButtonText);

        assert.strictEqual(aDeleteResetParts.path, aExpectedDeleteResetBindingParts.path, "The 'text' property binding parts of the 'Reset' button consists of the 'removable' property.");
        assert.strictEqual(sDeleteResetFormatterResult, sExpectedDeleteResetButtonText, "Reset button text equals: " + sExpectedDeleteResetButtonText);
    });

    QUnit.test("Sets the right sap-icon alongside the button text", function (assert) {
        // Arrange
        Device.system.phone = true;
        var bIsGroupVisible = false,
            bRemovable = false;

        var aExpectedHideShowBindingParts = [{
            mode: "OneWay",
            path: "isGroupVisible"
        }];

        var aExpectedDeleteResetBindingParts = [{
            mode: "OneWay",
            path: "removable"
        }];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oHideShowVisibleBindingInfo = oHideShowButton.getBindingInfo("icon"),
            sHideShowFormatterResult = oHideShowVisibleBindingInfo.formatter(bIsGroupVisible),
            aHideShowParts = oHideShowVisibleBindingInfo.parts;

        var oDeleteResetButton = aHeaderActions[1],
            oDeleteResetVisibleBindingInfo = oDeleteResetButton.getBindingInfo("icon"),
            sDeleteResetFormatterResult = oDeleteResetVisibleBindingInfo.formatter(bRemovable),
            aDeleteResetParts = oDeleteResetVisibleBindingInfo.parts;

        assert.strictEqual(aHideShowParts.path, aExpectedHideShowBindingParts.path, "The 'text' property binding parts of the 'Show' button consists of the 'isGroupVisible' property.");
        assert.strictEqual(sHideShowFormatterResult, "sap-icon://show", "Show button icon equals: sap-icon://show");

        assert.strictEqual(aDeleteResetParts.path, aExpectedDeleteResetBindingParts.path, "The 'text' property binding parts of the 'Reset' button consists of the 'removable' property.");
        assert.strictEqual(sDeleteResetFormatterResult, "sap-icon://refresh", "Reset button icon equals: sap-icon://refresh");
    });

    QUnit.test("Sets the right sap-icon alongside the button text", function (assert) {
        // Arrange
        Device.system.phone = true;
        var bIsGroupVisible = true,
            bRemovable = true;

        var aExpectedHideShowBindingParts = [{
            mode: "OneWay",
            path: "isGroupVisible"
        }];

        var aExpectedDeleteResetBindingParts = [{
            mode: "OneWay",
            path: "removable"
        }];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oHideShowVisibleBindingInfo = oHideShowButton.getBindingInfo("icon"),
            sHideShowFormatterResult = oHideShowVisibleBindingInfo.formatter(bIsGroupVisible),
            aHideShowParts = oHideShowVisibleBindingInfo.parts;

        var oDeleteResetButton = aHeaderActions[1],
            oDeleteResetVisibleBindingInfo = oDeleteResetButton.getBindingInfo("icon"),
            sDeleteResetFormatterResult = oDeleteResetVisibleBindingInfo.formatter(bRemovable),
            aDeleteResetParts = oDeleteResetVisibleBindingInfo.parts;

        assert.strictEqual(aHideShowParts.path, aExpectedHideShowBindingParts.path, "The 'text' property binding parts of the 'Hide' button consists of the 'isGroupVisible' property.");
        assert.strictEqual(sHideShowFormatterResult, "sap-icon://hide", "Hide button icon equals: sap-icon://hide");

        assert.strictEqual(aDeleteResetParts.path, aExpectedDeleteResetBindingParts.path, "The 'text' property binding parts of the 'Delete' button consists of the 'removable' property.");
        assert.strictEqual(sDeleteResetFormatterResult, "sap-icon://delete", "Delete button icon equals: sap-icon://delete");
    });

    QUnit.test("Sets no sap-icon alongside the button text if the user isn't using a mobile phone in Fiori 3", function (assert) {
        // Arrange
        Device.system.phone = false;
        var bIsGroupVisible = true,
            bRemovable = true;

        var aExpectedHideShowBindingParts = [{
            mode: "OneWay",
            path: "isGroupVisible"
        }];

        var aExpectedDeleteResetBindingParts = [{
            mode: "OneWay",
            path: "removable"
        }];

        // Act
        var aHeaderActions = this.oDashboardGroupsBox._getHeaderActions();

        // Assert
        var oHideShowButton = aHeaderActions[0],
            oHideShowVisibleBindingInfo = oHideShowButton.getBindingInfo("icon"),
            sHideShowFormatterResult = oHideShowVisibleBindingInfo.formatter(bIsGroupVisible),
            aHideShowParts = oHideShowVisibleBindingInfo.parts;

        var oDeleteResetButton = aHeaderActions[1],
            oDeleteResetVisibleBindingInfo = oDeleteResetButton.getBindingInfo("icon"),
            sDeleteResetFormatterResult = oDeleteResetVisibleBindingInfo.formatter(bRemovable),
            aDeleteResetParts = oDeleteResetVisibleBindingInfo.parts;

        assert.strictEqual(aHideShowParts.path, aExpectedHideShowBindingParts.path, "The 'text' property binding parts of the 'Hide' button consists of the 'isGroupVisible' property.");
        assert.strictEqual(sHideShowFormatterResult, "", "Hide button has no sap-icon in desktop mode.");

        assert.strictEqual(aDeleteResetParts.path, aExpectedDeleteResetBindingParts.path, "The 'text' property binding parts of the 'Delete' button consists of the 'removable' property.");
        assert.strictEqual(sDeleteResetFormatterResult, "", "Delete button has no sap-icon in desktop mode.");
    });

    QUnit.module("The function _handleAddTileToGroup", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: function () {
                    return {
                        isLinkPersonalizationSupported: function () {
                            return true;
                        }
                    };
                }
            };
            this.oNavToSpy = sinon.spy();
            this.oGetOwnerComponentForStub = sinon.stub(Component, "getOwnerComponentFor").returns({
                getRouter: function () {
                    return { navTo: this.oNavToSpy };
                }.bind(this)
            });
            this.oDashboardGroupsBox = new DashboardGroupsBox();
            this.oDashboardGroupsBox.oController = {
                getView: function () {
                    return { parentComponent: {} };
                }
            };
            this.oEventBindingContextPath = "";
            this.oEventBindingContextPathStub = {
                getSource: function () {
                    return {
                        getBindingContext: function () {
                            return { sPath: this.oEventBindingContextPath };
                        }.bind(this)
                    };
                }.bind(this)
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oDashboardGroupsBox.destroy();
            this.oGetOwnerComponentForStub.restore();
        }
    });

    QUnit.test("Navigates to the appfinder with the right innerHash", function (assert) {
        // Arrange
        this.oEventBindingContextPath = "targetGroup";
        var oExpectedNavigationParameters = {
            "innerHash*": "catalog/{\"targetGroup\":\"targetGroup\"}"
        };

        // Act
        this.oDashboardGroupsBox._handleAddTileToGroup(this.oEventBindingContextPathStub);

        // Assert
        assert.strictEqual(this.oNavToSpy.args[0][0], "appfinder", "The function invokes a navigation to the target called 'appfinder'.");
        assert.deepEqual(this.oNavToSpy.args[0][1], oExpectedNavigationParameters, "The function passes the right navigation parameters to the navTo function.");
    });

    QUnit.test("Encodes the navigation parameters as URI components", function (assert) {
        // Arrange
        this.oEventBindingContextPath = "targetGroup!\"'$%§ testGroup?¿ß&´á";
        var oExpectedNavigationParameters = {
            "innerHash*": "catalog/{\"targetGroup\":\"targetGroup!%22'%24%25%C2%A7%20testGroup%3F%C2%BF%C3%9F%26%C2%B4%C3%A1\"}"
        };

        // Act
        this.oDashboardGroupsBox._handleAddTileToGroup(this.oEventBindingContextPathStub);

        // Assert
        assert.strictEqual(this.oNavToSpy.args[0][0], "appfinder", "The function invokes a navigation to the target called 'appfinder'.");
        assert.deepEqual(this.oNavToSpy.args[0][1], oExpectedNavigationParameters, "The function passes the right navigation parameters as encoded URI components to the navTo function.");
    });

    QUnit.test("Calls toDetail() if it exists on the document", function (assert) {
        // Arrange
        document.toDetail = sinon.stub();

        // Act
        this.oDashboardGroupsBox._handleAddTileToGroup(this.oEventBindingContextPathStub);

        // Assert
        assert.ok(document.toDetail.calledOnce, "The function called toDetail().");

        // Cleanup
        delete document.toDetail;
    });

    QUnit.module("The function _hidePlusTile", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: function () {
                    return {
                        isLinkPersonalizationSupported: function () {
                            return true;
                        }
                    };
                }
            };
            this.oDashboardGroupsBox = new DashboardGroupsBox();
            this.oPlusTileDomRef = document.createElement("div");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oDashboardGroupsBox.destroy();
        }
    });

    QUnit.test("Adds the class 'sapUshellHidePlusTile'", function (assert) {
        // Act
        this.oDashboardGroupsBox._hidePlusTile(this.oPlusTileDomRef);
        var aClassList = this.oPlusTileDomRef.classList;

        // Assert
        assert.strictEqual(aClassList.length, 1, "The function adds one class to the DOM reference.");
        assert.ok(aClassList.contains("sapUshellHidePlusTile"), "The function adds the class 'sapUshellHidePlusTile' to the DOM reference.");
    });

    QUnit.test("Adds the class 'sapUshellHidePlusTile' to existing classes", function (assert) {
        // Arrange
        var aClassList = this.oPlusTileDomRef.classList;
        aClassList.add("sampleClass1");
        aClassList.add("sampleClass2");
        aClassList.add("sampleClass3");

        // Act
        this.oDashboardGroupsBox._hidePlusTile(this.oPlusTileDomRef);

        // Assert
        assert.strictEqual(aClassList.length, 4, "The function adds one more class to the DOM reference (4 in total).");
        assert.ok(aClassList.contains("sapUshellHidePlusTile"), "The function adds the class 'sapUshellHidePlusTile' to the DOM reference.");
    });

    QUnit.test("Does nothing if no DOM reference was passed as a parameter", function (assert) {
        // Arrange
        var sErrorMessage = "";

        // Act
        try {
            this.oDashboardGroupsBox._hidePlusTile();
        } catch (error) {
            sErrorMessage = error.message;
        }

        // Assert
        assert.strictEqual(sErrorMessage, "", "The function doesn't throw an error if no parameters were passed.");
    });

    QUnit.module("The function _showPlusTile", {
        beforeEach: function () {
            sap.ushell.Container = {
                getService: function () {
                    return {
                        isLinkPersonalizationSupported: function () {
                            return true;
                        }
                    };
                }
            };
            this.oDashboardGroupsBox = new DashboardGroupsBox();
            this.oPlusTileDomRef = document.createElement("div");
            this.oPlusTileDomRef.classList.add("sapUshellHidePlusTile");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oDashboardGroupsBox.destroy();
        }
    });

    QUnit.test("Removes the class 'sapUshellHidePlusTile'", function (assert) {
        // Act
        this.oDashboardGroupsBox._showPlusTile(this.oPlusTileDomRef);
        var aClassList = this.oPlusTileDomRef.classList;

        // Assert
        assert.strictEqual(aClassList.length, 0, "The function removes one class from the DOM reference.");
        assert.notOk(aClassList.contains("sapUshellHidePlusTile"), "The function removes the class 'sapUshellHidePlusTile' from the DOM reference.");
    });

    QUnit.test("Removes the class 'sapUshellHidePlusTile' from multiple existing classes", function (assert) {
        // Arrange
        var aClassList = this.oPlusTileDomRef.classList;
        aClassList.add("sampleClass1");
        aClassList.add("sampleClass2");
        aClassList.add("sampleClass3");

        // Act
        this.oDashboardGroupsBox._showPlusTile(this.oPlusTileDomRef);

        // Assert
        assert.strictEqual(aClassList.length, 3, "The function removes one more class from the DOM reference (3 in total).");
        assert.notOk(aClassList.contains("sapUshellHidePlusTile"), "The function removes the class 'sapUshellHidePlusTile' from the DOM reference.");
    });

    QUnit.test("Does nothing if no DOM reference was passed as a parameter", function (assert) {
        // Arrange
        var sErrorMessage = "";

        // Act
        try {
            this.oDashboardGroupsBox._showPlusTile();
        } catch (error) {
            sErrorMessage = error.message;
        }

        // Assert
        assert.strictEqual(sErrorMessage, "", "The function doesn't throw an error if no parameters were passed.");
    });

    QUnit.module("The function _itemFactory", {
        beforeEach: function () {
            this.oDashboardGroupsBox = new DashboardGroupsBox();
        },
        afterEach: function () {
            this.oDashboardGroupsBox.destroy();
        }
    });

    QUnit.test("Loads a tile if a tile object is provided", function (assert) {
        // Arrange
        var oCreateTileStub,
            oDummyTileObject = {},
            oInput = {
                sId: "someId",
                oContext: {
                    getProperty: sinon.stub().returns(oDummyTileObject)
                }
            },
            oGetIdStub = sinon.stub().returns("someId"),
            oExpectedResult = {
                getId: oGetIdStub
            },
            oActualResult;

        oCreateTileStub = sinon.stub(this.oDashboardGroupsBox, "_createTile").returns({
            getId: oGetIdStub
        });

        // Act
        oActualResult = this.oDashboardGroupsBox._itemFactory(oInput.sId, oInput.oContext);

        // Assert
        assert.ok(oCreateTileStub.called, "_createTile was called");
        assert.deepEqual(oActualResult, oExpectedResult, "Correct tile returned");
        assert.strictEqual(oDummyTileObject.controlId, "someId", "The correct id was written to the tile object");

        // Cleanup
        oCreateTileStub.restore();
    });

    QUnit.test("Loads a card if a card object is provided - manifest in content section", function (assert) {
        // Arrange
        var oDummyTileObject = {
                isCard: true,
                content: [{ "sap.card": {} }]
            },
            oInput = {
                sId: "someId",
                oContext: {
                    getProperty: sinon.stub().returns(oDummyTileObject)
                }
            },
            oGetIdStub = sinon.stub().returns("someId"),
            oActualResult;
        var oCreateTileStub = sinon.stub(this.oDashboardGroupsBox, "_createTile").returns({
            Im: "a tile",
            getId: oGetIdStub
        });
        var oSetManifestStub = sinon.stub();
        var oSetManifest = {
            setManifest: oSetManifestStub
        };
        var oSetHostStub = sinon.stub(Card.prototype, "setHost").returns(oSetManifest);
        this.oDashboardGroupsBox.Card = Card;

        // Act
        oActualResult = this.oDashboardGroupsBox._itemFactory(oInput.sId, oInput.oContext);

        // Assert
        assert.ok(oCreateTileStub.notCalled, "_createTile was not called");
        assert.ok(oActualResult instanceof Card, "Card was returned");
        assert.ok(/card/.test(oDummyTileObject.controlId), "The correct id was written to the tile object");
        assert.strictEqual(oSetHostStub.callCount, 1, "The host was set to the card control.");
        assert.strictEqual(oSetManifestStub.callCount, 1, "The manifest was set to the card control.");

        // Cleanup
        oCreateTileStub.restore();
        oSetHostStub.restore();
    });

    QUnit.test("Creates a placeholder card if a card object with a manifest property but no manifest property in the content section is provided", function (assert) {
        // Arrange
        var oCreateTileStub,
            oDummyTileObject = {
                isCard: true,
                manifest: {}
            },
            oInput = {
                sId: "someId",
                oContext: {
                    getProperty: sinon.stub().returns(oDummyTileObject)
                }
            },
            oGetIdStub = sinon.stub().returns("someId"),
            oActualResult;

        oCreateTileStub = sinon.stub(this.oDashboardGroupsBox, "_createTile").returns({
            Im: "a tile",
            getId: oGetIdStub
        });
        this.oDashboardGroupsBox.Card = Card;

        // Act
        oActualResult = this.oDashboardGroupsBox._itemFactory(oInput.sId, oInput.oContext);

        // Assert
        assert.ok(oCreateTileStub.notCalled, "_createTile was not called");
        assert.ok(oActualResult instanceof Card, "Card was returned");
        assert.ok(/card/.test(oDummyTileObject.controlId), "The correct id was written to the tile object");

        // Cleanup
        oCreateTileStub.restore();
    });

    QUnit.test("Creates a ErrorTile when no manifest is available but isCard is true", function (assert) {
        // Arrange
        var oCreateTileStub,
            oDummyTileObject = { isCard: true },
            oInput = {
                sId: "someId",
                oContext: {
                    getProperty: sinon.stub().returns(oDummyTileObject)
                }
            },
            oGetIdStub = sinon.stub().returns("someId"),
            oActualResult,
            oCreateErrorTileStub,
            oDummyErrorTile = { error: true };

        oCreateTileStub = sinon.stub(this.oDashboardGroupsBox, "_createTile").returns({
            Im: "a tile",
            getId: oGetIdStub
        });

        oCreateErrorTileStub = sinon.stub(this.oDashboardGroupsBox, "_createErrorTile").returns(oDummyErrorTile);

        // Act
        oActualResult = this.oDashboardGroupsBox._itemFactory(oInput.sId, oInput.oContext);

        // Assert
        assert.ok(oCreateErrorTileStub.called, "_createErrorTile was called");
        assert.ok(oCreateTileStub.notCalled, "_createTile was not called");
        assert.deepEqual(oActualResult, oDummyErrorTile, "Card was returned");
        assert.strictEqual(oDummyTileObject.controlId, undefined, "No id was written to the tile object");

        // Cleanup
        oCreateTileStub.restore();
    });

    QUnit.module("The function _onCardAction", {
        beforeEach: function () {
            this.oDashboardGroupsBox = new DashboardGroupsBox();
            this.oDashboardGroupsBox.integrationLibrary = integrationLibrary;
        },
        afterEach: function () {
            this.oDashboardGroupsBox.destroy();
        }
    });

    QUnit.test("Performs an intent based navigation.", function (assert) {
        // Arrange
        var oPreventDefaultStub = sandbox.stub();
        var oParameters = {
            title: "Bookmark Sample",
            url: "#Action-toBookmark",
            intentSemanticObject: "Action",
            intentAction: "toBookmark",
            intentParameters: {}
        };
        var oEvent = {
            getParameter: function (sName) {
                if (sName === "type") {
                    return "Navigation";
                } else if (sName === "parameters") {
                    return oParameters;
                }
            },
            preventDefault: oPreventDefaultStub
        };
        var oPerformIntentBasedNavigationStub = sinon.stub(this.oDashboardGroupsBox, "_performIntentBasedNavigation");

        // Act
        this.oDashboardGroupsBox._onCardAction(oEvent);

        // Assert
        assert.strictEqual(oPerformIntentBasedNavigationStub.callCount, 1, "The function _performIntentBasedNavigation was called once and the navigation started.");
        assert.strictEqual(oPreventDefaultStub.callCount, 1, "The function preventDefault was called once.");

        // Cleanup
        oPerformIntentBasedNavigationStub.restore();
    });

    QUnit.test("Opens quick access dialog after clicking on the card header.", async function (assert) {
        // Arrange
        var oPreventDefaultStub = sandbox.stub();
        var oParameters = {
            openUI: "FrequentActivities"
        };
        var oEvent = {
            getParameter: function (sName) {
                if (sName === "type") {
                    return "Navigation";
                } else if (sName === "parameters") {
                    return oParameters;
                }
            },
            preventDefault: oPreventDefaultStub
        };
        var oOpenQuickAccessDialogStub = sinon.stub(QuickAccess, "openQuickAccessDialog");

        // Act
        await this.oDashboardGroupsBox._onCardAction(oEvent); // QuickAccess is loaded lazily

        // Assert
        assert.strictEqual(oOpenQuickAccessDialogStub.callCount, 1, "The function openQuickAccessDialog was called once.");

        // Cleanup
        oOpenQuickAccessDialogStub.restore();
    });

    QUnit.test("Throws error after trying to open wrong tab.", function (assert) {
        // Arrange
        var oPreventDefaultStub = sandbox.stub();
        var oParameters = {
            openUI: "WrongTabName"
        };
        var oEvent = {
            getParameter: function (sName) {
                if (sName === "type") {
                    return "Navigation";
                } else if (sName === "parameters") {
                    return oParameters;
                }
            },
            preventDefault: oPreventDefaultStub
        };
        var oLogErrorStub = sinon.stub(Log, "error");

        // Act
        this.oDashboardGroupsBox._onCardAction(oEvent);

        // Assert
        assert.strictEqual(oLogErrorStub.callCount, 1, "The error was thrown.");
        assert.ok(oLogErrorStub.calledWith("Request to open unknown User Interface: 'WrongTabName'"), "The correct error message was shown.");

        // Cleanup
        oLogErrorStub.restore();
    });

    QUnit.test("Prevent to open empty url.", function (assert) {
        // Arrange
        var oPreventDefaultStub = sandbox.stub();
        var oParameters = {
            url: ""
        };
        var oEvent = {
            getParameter: function (sName) {
                if (sName === "type") {
                    return "Navigation";
                } else if (sName === "parameters") {
                    return oParameters;
                }
            },
            preventDefault: oPreventDefaultStub
        };

        // Act
        this.oDashboardGroupsBox._onCardAction(oEvent);

        // Assert
        assert.strictEqual(oPreventDefaultStub.callCount, 1, "The navigation was prevented.");
    });

    QUnit.test("Logs a recent activity.", function (assert) {
        // Arrange
        var oParameters = {
            title: "FLP Demo Content for /UI2/FLP_DEMO*",
            url: "www.sap.com"
        };
        var oEvent = {
            getParameter: function (sName) {
                if (sName === "type") {
                    return "Navigation";
                } else if (sName === "parameters") {
                    return oParameters;
                }
            }
        };
        var oRecentEntry = {
            title: "FLP Demo Content for /UI2/FLP_DEMO*",
            url: "www.sap.com",
            appType: "External Link",
            appId: "www.sap.com"
        };
        var oLogRecentActivityStub = sandbox.stub().withArgs(oRecentEntry);
        sap.ushell.Container = {
            getRendererInternal: sandbox.stub().withArgs("fiori2").returns({
                logRecentActivity: oLogRecentActivityStub
            })
        };

        // Act
        this.oDashboardGroupsBox._onCardAction(oEvent);

        // Assert
        assert.strictEqual(oLogRecentActivityStub.callCount, 1, "The recent activity was logged.");
        assert.ok(oLogRecentActivityStub.calledWith(oRecentEntry), "The recent activity was logged.");
    });
});
