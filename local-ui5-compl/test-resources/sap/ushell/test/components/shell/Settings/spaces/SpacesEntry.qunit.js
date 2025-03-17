// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/View",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/shell/Settings/spaces/SpacesEntry",
    "sap/ushell/components/shell/Settings/spaces/SpacesSetting.controller",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ushell/Container"
], function (
    Log,
    View,
    JSONModel,
    jQuery,
    SpacesEntry,
    SpacesSettingController,
    Config,
    EventHub,
    resources,
    utils,
    Container
) {
    "use strict";

    /* global QUnit sinon */
    var sandbox = sinon.createSandbox({});

    QUnit.module("getEntry", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oGetShowMyHomeStub = sandbox.stub();
            this.oGetServiceAsyncStub.withArgs("UserInfo").resolves({
                getUser: sandbox.stub().returns({
                    getShowMyHome: this.oGetShowMyHomeStub
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Check if the correct entry settings are applied", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        var oSpacesEntry = SpacesEntry.getEntry();
        // Assert
        assert.strictEqual(oSpacesEntry.entryHelpID, "spaces", "entryHelpID is correct");
        assert.strictEqual(oSpacesEntry.title, resources.i18n.getText("spaces"), "title is correct");
        assert.strictEqual(oSpacesEntry.valueResult, null, "valueResult is null");
        assert.strictEqual(oSpacesEntry.contentResult, null, "contentResult is null");
        assert.strictEqual(oSpacesEntry.icon, "sap-icon://home", "icon is correct");
        assert.strictEqual(oSpacesEntry.provideEmptyWrapper, false, "provideEmptyWrapper is false");
        assert.strictEqual(oSpacesEntry.valueArgument, null, "valueArgument is null");
        assert.strictEqual(typeof oSpacesEntry.contentFunc, "function", "contentFunc is function");
        assert.strictEqual(typeof oSpacesEntry.onSave, "function", "onSave is function");
        assert.strictEqual(typeof oSpacesEntry.onCancel, "function", "onCancel is function");
    });

    QUnit.test("Check if the subtitle is shown when Show My Home is enabled and no custom homeApp is configured", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oGetShowMyHomeStub.returns(true);
        // Act
        var oSpacesEntry = SpacesEntry.getEntry();
        // Assert
        assert.notEqual(oSpacesEntry.valueArgument, null, "valueArgument is not null");
        return oSpacesEntry.valueArgument().then(function (value) {
            assert.strictEqual(value, resources.i18n.getText("settingsMyHomeShown"), "Subtitle text is correct");
        });
    });

    QUnit.test("Check if the subtitle is not shown when Show My Home is enabled and a custom homeApp is configured", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        // Act
        var oSpacesEntry = SpacesEntry.getEntry();
        // Assert
        assert.strictEqual(oSpacesEntry.valueArgument, null, "valueArgument is null");
    });

    QUnit.module("contentFunc", {
        beforeEach: function () {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oMockView = { id: "MockView" };
            this.oViewCreateStub = sandbox.stub(View, "create").resolves(this.oMockView);

            this.oGetHideEmptySpacesEnabledStub = sandbox.stub(utils, "getHideEmptySpacesEnabled").resolves();

            this.oUserInfoService = { id: "UserInfo" };
            this.oGetServiceAsyncStub.withArgs("UserInfo").resolves(this.oUserInfoService);

            this.oSpacesEntry = SpacesEntry.getEntry();
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Creates the view correctly", function (assert) {
        // Arrange
        var oViewCreateArg = {
            id: "UserSettingsSpacesSettingsView",
            viewName: "sap.ushell.components.shell.Settings.spaces.SpacesSetting",
            type: "XML",
            viewData: {
                UserInfo: this.oUserInfoService
            }
        };
        // Act
        return this.oSpacesEntry.contentFunc().then(function (oView) {
            // Assert
            assert.strictEqual(oView, this.oMockView, "Resolved the correct view");

            assert.strictEqual(this.oGetHideEmptySpacesEnabledStub.callCount, 1, "getHideEmptySpacesEnabled was called");
            assert.deepEqual(this.oViewCreateStub.getCall(0).args, [oViewCreateArg], "Called View.create with correct args");
            assert.strictEqual(this.oViewCreateStub.getCall(0).args[0].viewData.UserInfo, this.oUserInfoService, "Added the UserInfo service as viewData");
        }.bind(this));
    });

    QUnit.test("Saves the view internally", function (assert) {
        // Act
        return this.oSpacesEntry.contentFunc().then(function (oView) {
            // Assert
            assert.strictEqual(oView, this.oMockView, "Resolved the correct view");

            assert.strictEqual(this.oSpacesEntry._getViewInstance(), oView, "Saved the view internally");
        }.bind(this));
    });

    QUnit.module("Controller.onInit", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oEventHubDoStub = sandbox.stub();
            this.oEventHubOnStub = sandbox.stub(EventHub, "on").returns({ do: this.oEventHubDoStub });

            this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/configurable").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/userEnabled").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(false);

            this.oUser = {
                getShowMyHome: sandbox.stub().returns(true),
                // possible values: "done", "dismissed", "not_required", "pending"
                getImportBookmarksFlag: sandbox.stub().returns("pending")
            };
            this.oUserInfoService = {
                getUser: sandbox.stub().returns(this.oUser)
            };

            this.oController = new SpacesSettingController();

            this.oSetModelStub = sandbox.stub();
            this.oGetModelStub = sandbox.stub();
            sandbox.stub(this.oController, "getView").returns({
                setModel: this.oSetModelStub,
                getModel: this.oGetModelStub,
                getViewData: sandbox.stub().returns({
                    UserInfo: this.oUserInfoService
                })
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("All options are visible", function (assert) {
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: true
            },
            showMyHome: {
                visible: true,
                selected: true
            },
            showMyHomeImport: {
                visible: true,
                selected: true
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("MyHome options are not visible when disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: true
            },
            showMyHome: {
                visible: false,
                selected: true
            },
            showMyHomeImport: {
                visible: false,
                selected: true
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("MyHome options are not visible when homeApp is enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true);
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: true
            },
            showMyHome: {
                visible: false,
                selected: true
            },
            showMyHomeImport: {
                visible: false,
                selected: true
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("MyHome is unselected and import is not visible when user has disabled it", function (assert) {
        // Arrange
        this.oUser.getShowMyHome.returns(false);
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: true
            },
            showMyHome: {
                visible: true,
                selected: false
            },
            showMyHomeImport: {
                visible: false,
                selected: true
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("MyHome import is not visible when on state \"done\"", function (assert) {
        // Arrange
        this.oUser.getImportBookmarksFlag.returns("done");
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: true
            },
            showMyHome: {
                visible: true,
                selected: true
            },
            showMyHomeImport: {
                visible: false,
                selected: false
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("MyHome import is not visible when on state \"not_required\"", function (assert) {
        // Arrange
        this.oUser.getImportBookmarksFlag.returns("not_required");
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: true
            },
            showMyHome: {
                visible: true,
                selected: true
            },
            showMyHomeImport: {
                visible: false,
                selected: false
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("Only spaces option is visible when spaces is disabled, but configurable", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: true,
                selected: false
            },
            hideEmptySpaces: {
                visible: false,
                selected: true
            },
            showMyHome: {
                visible: false,
                selected: true
            },
            showMyHomeImport: {
                visible: false,
                selected: true
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("Only hideEmptySpaces option is visible when spaces is not configurable and myHome disabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/configurable").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/userEnabled").returns(false);
        // Act
        this.oController.onInit();
        var oExpectedModel = {
            spaces: {
                visible: false,
                selected: true
            },
            hideEmptySpaces: {
                visible: true,
                selected: false
            },
            showMyHome: {
                visible: false,
                selected: true
            },
            showMyHomeImport: {
                visible: false,
                selected: true
            }
        };

        // Assert
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        var oModel = this.oSetModelStub.getCall(0).args[0];

        assert.deepEqual(oModel.getData(), oExpectedModel, "Model was correctly set");
    });

    QUnit.test("Sets the i18n model correctly", function (assert) {
        // Arrange
        var i18nModel = resources.getTranslationModel();
        // Act
        this.oController.onInit();
        //Arrange
        assert.strictEqual(this.oSetModelStub.callCount, 2, "2 models were set");
        assert.strictEqual(this.oSetModelStub.getCall(1).args[0], i18nModel, "The second model is the i18n model");
        assert.strictEqual(this.oSetModelStub.getCall(1).args[1], "i18n", "The second model was set with correct name");
    });

    QUnit.test("Saves the UserInfo service to \"this\"", function (assert) {
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.oController.oUserInfoService, this.oUserInfoService, "The UserInfo service was correctly saved");
    });

    QUnit.test("Attaches to the \"importBookmarksFlag\" event", function (assert) {
        // Act
        this.oController.onInit();
        // Assert
        assert.strictEqual(this.oEventHubOnStub.getCall(0).args[0], "importBookmarksFlag", "The handler was attached to the correct event");
        assert.strictEqual(typeof this.oEventHubDoStub.getCall(0).args[0], "function", "The handler is a function");
    });

    QUnit.test("Handles the \"importBookmarksFlag\" event correctly", function (assert) {
        // Arrange
        this.oController.onInit();
        var oModel = this.oSetModelStub.getCall(0).args[0];
        this.oGetModelStub.returns(oModel);
        // Act
        this.oEventHubDoStub.getCall(0).callArgWith(0, false);
        // Assert
        var bResult = oModel.getProperty("/showMyHomeImport/selected");
        assert.strictEqual(bResult, false, "Saved the correct value");
    });

    QUnit.module("onSave", {
        beforeEach: function () {
            this.oLogWarningStub = sandbox.stub(Log, "warning");
            this.oSpacesEntry = SpacesEntry.getEntry();

            this.oOnSaveStub = sandbox.stub().resolves();
            this.oMockView = {
                getController: sandbox.stub().returns({
                    onSave: this.oOnSaveStub
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the view was not created yet", function (assert) {
        // Act
        return this.oSpacesEntry.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oLogWarningStub.callCount, 1, "A warning was logged.");
        }.bind(this));
    });

    QUnit.test("Check that no warning is put into the Log if the view was already created", function (assert) {
        // Arrange
        this.oSpacesEntry._setViewInstance(this.oMockView);
        //Act
        return this.oSpacesEntry.onSave().then(function () {
            // Assert
            assert.strictEqual(this.oLogWarningStub.callCount, 0, "No warning logged.");
            assert.strictEqual(this.oOnSaveStub.callCount, 1, "Controller.onSave was called");
        }.bind(this));
    });

    QUnit.module("Controller.onSave", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
            this.oEventHubEmitStub = sandbox.stub(EventHub, "emit");

            this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/userEnabled").returns(true);

            // all checkboxes are checked
            this.oModel = new JSONModel({
                spaces: {
                    selected: true
                },
                hideEmptySpaces: {
                    selected: true
                },
                showMyHome: {
                    selected: true
                },
                showMyHomeImport: {
                    selected: true
                }
            });

            this.oUser = {
                getShowMyHome: sandbox.stub().returns(true),
                setShowMyHome: sandbox.stub(),
                // possible values: "done", "dismissed", "not_required", "pending"
                getImportBookmarksFlag: sandbox.stub().returns("pending"),
                setImportBookmarksFlag: sandbox.stub(),
                setChangedProperties: sandbox.stub(),
                resetChangedProperty: sandbox.stub()
            };
            this.oUserInfoService = {
                getUser: sandbox.stub().returns(this.oUser),
                updateUserPreferences: sandbox.stub().returns(new jQuery.Deferred().resolve().promise())
            };
            this.oSetHideEmptySpacesEnabledStub = sandbox.stub(utils, "setHideEmptySpacesEnabled").resolves();

            this.oController = new SpacesSettingController();
            this.oController.oUserInfoService = this.oUserInfoService;
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Saves changes when all properties were changed", function (assert) {
        // Arrange
        // user unchecks all checkboxes
        this.oModel.setProperty("/spaces/selected", false);
        this.oModel.setProperty("/hideEmptySpaces/selected", false);
        this.oModel.setProperty("/showMyHome/selected", false);
        this.oModel.setProperty("/showMyHomeImport/selected", false);

        var oExpectedResult = {
            refresh: true,
            noHash: true
        };

        var aExpectedSpaceEnabledArgs = [{
                propertyName: "spacesEnabled",
                name: "SPACES_ENABLEMENT"
            },
            true,
            false
        ];

        // Act
        return this.oController.onSave(this.oUserInfoService.updateUserPreferences).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "Resolved correct result");

            assert.strictEqual(this.oUser.setChangedProperties.callCount, 1, "setChangedProperties was called");
            assert.deepEqual(this.oUser.setChangedProperties.getCall(0).args, aExpectedSpaceEnabledArgs, "setChangedProperties was called with correct args");

            assert.strictEqual(this.oUser.setShowMyHome.callCount, 1, "setShowMyHome was called");
            assert.strictEqual(this.oUser.setShowMyHome.getCall(0).args[0], false, "setShowMyHome was called with correct args");

            assert.strictEqual(this.oUser.setImportBookmarksFlag.callCount, 1, "setImportBookmarksFlag was called");
            assert.strictEqual(this.oUser.setImportBookmarksFlag.getCall(0).args[0], "dismissed", "setImportBookmarksFlag was called with correct args");
            assert.strictEqual(this.oEventHubEmitStub.callCount, 0, "EventHub.emit was not called");

            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.callCount, 1, "setHideEmptySpacesEnabled was called");
            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.getCall(0).args[0], false, "setHideEmptySpacesEnabled was called with correct args");
            // save of user properties
            assert.strictEqual(this.oUserInfoService.updateUserPreferences.callCount, 1, "updateUserPreferences was called");
            assert.strictEqual(this.oUser.resetChangedProperty.callCount, 3, "resetChangedProperty was called");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(0).args[0], "spacesEnabled", "resetChangedProperty was called with correct args the first time");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(1).args[0], "showMyHome", "resetChangedProperty was called with correct args the second time");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(2).args[0], "importBookmarks", "resetChangedProperty was called with correct args the third time");
        }.bind(this));
    });

    QUnit.test("Does not save anything when no property was changed", function (assert) {
        // Act
        return this.oController.onSave().then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, undefined, "Resolved correct result");

            assert.strictEqual(this.oUser.setChangedProperties.callCount, 0, "setChangedProperties was not called");
            assert.strictEqual(this.oUser.setShowMyHome.callCount, 0, "setShowMyHome was not called");
            assert.strictEqual(this.oUser.setImportBookmarksFlag.callCount, 0, "setImportBookmarksFlag was not called");
            assert.strictEqual(this.oEventHubEmitStub.callCount, 0, "EventHub.emit was not called");
            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.callCount, 0, "setHideEmptySpacesEnabled was not called");

            // save of user properties
            assert.strictEqual(this.oUserInfoService.updateUserPreferences.callCount, 0, "updateUserPreferences was not called");
            assert.strictEqual(this.oUser.resetChangedProperty.callCount, 0, "resetChangedProperty was not called");
        }.bind(this));
    });

    // Use case is user changes spaces property and another property.
    // User unchecks some checkboxes.
    // First the save of spaces property and then of the other property is processed
    // The updatePreferences reports an error of the space property.
    // Then the Save method shall reject.

    QUnit.test("Handles failing UserInfo updatePreferences correctly when own error", function (assert) {
        // Arrange

        this.oModel.setProperty("/spaces/selected", false);
        this.oModel.setProperty("/showMyHome/selected", false);
        this.oModel.setProperty("/showMyHomeImport/selected", false);

        this.promiseUpdateUserPreferences = Promise.reject("UserInfoService failed for SPACES_ENABLEMENT");
        this.oUserInfoService.updateUserPreferences.returns(this.promiseUpdateUserPreferences);

        // Act
        return this.oController.onSave(this.oUserInfoService.updateUserPreferences).catch(function (sResult) {
            // Assert
            assert.deepEqual(sResult, "UserInfoService failed for SPACES_ENABLEMENT", "Rejected with correct message");
            assert.strictEqual(this.oUser.resetChangedProperty.callCount, 3, "resetChangedProperty was called");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(0).args[0], "spacesEnabled", "resetChangedProperty was called with correct args the first time");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(1).args[0], "showMyHome", "resetChangedProperty was called with correct args the second time");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(2).args[0], "importBookmarks", "resetChangedProperty was called with correct args the third time");

            assert.strictEqual(this.oModel.getProperty("/spaces/selected"), true, "Restored spaces correctly");
            assert.strictEqual(this.oModel.getProperty("/showMyHome/selected"), true, "Restored showMyHome correctly");
        }.bind(this));
    });

    // Use case is user changes spaces property and other property.
    // User unchecks some checkboxes.
    // First the save of spaces property and then of the other property is processed
    // The updatePreferences reports an error of the other property.
    // Then the Save method shall resolve successully.
    // The resolved objects contains rules for a restart of FLP
    QUnit.test("Handles failing UserInfo.updatePreferences correctly, when not an own error", function (assert) {
        var fnDone = assert.async();
        // Arrange
        this.oModel.setProperty("/spaces/selected", false);
        this.oModel.setProperty("/showMyHome/selected", false);
        this.oModel.setProperty("/showMyHomeImport/selected", false);
        this.promiseUpdateUserPreferences = Promise.reject("UserInfoService failed for other error");
        this.oUserInfoService.updateUserPreferences.returns(this.promiseUpdateUserPreferences);

        // Act
        this.oController.onSave(this.oUserInfoService.updateUserPreferences)
        .then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, {noHash: true, refresh: true}, "Save resolves with correct object");
            assert.strictEqual(this.oUser.resetChangedProperty.callCount, 3, "resetChangedProperty was called");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(0).args[0], "spacesEnabled", "resetChangedProperty was called with correct args the first time");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(1).args[0], "showMyHome", "resetChangedProperty was called with correct args the second time");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(2).args[0], "importBookmarks", "resetChangedProperty was called with correct args the third time");
            assert.strictEqual(this.oModel.getProperty("/spaces/selected"), false, "setting of spaces has correctly kept the value false");
            assert.strictEqual(this.oModel.getProperty("/showMyHome/selected"), false, "setting of showMyHome has correctly kept the value false");
            fnDone();
        }.bind(this))
        .catch(function () {
            assert.ok(false, "method save rejects");
        });
    });

    QUnit.test("Handles failing setHideEmptySpacesEnabled correctly", function (assert) {
        // Arrange
        // user unchecks some checkboxes
        this.oModel.setProperty("/hideEmptySpaces/selected", false);

        this.oSetHideEmptySpacesEnabledStub.returns(Promise.reject("setHideEmptySpacesEnabled failed"));

        // Act
        return this.oController.onSave().catch(function (sResult) {
            // Assert
            assert.deepEqual(sResult, "setHideEmptySpacesEnabled failed", "Rejected with correct message");

            assert.strictEqual(this.oModel.getProperty("/hideEmptySpaces/selected"), true, "Restored hideEmptySpaces correctly");
        }.bind(this));
    });

    QUnit.test("Saves changes when spaces was changed", function (assert) {
        // Arrange
        // user unchecks a single checkbox
        this.oModel.setProperty("/spaces/selected", false);

        var oExpectedResult = {
            refresh: true,
            noHash: true
        };

        var aExpectedSpaceEnabledArgs = [{
                propertyName: "spacesEnabled",
                name: "SPACES_ENABLEMENT"
            },
            true,
            false
        ];

        // Act
        return this.oController.onSave(this.oUserInfoService.updateUserPreferences).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "Resolved correct result");

            assert.strictEqual(this.oUser.setChangedProperties.callCount, 1, "setChangedProperties was called");
            assert.deepEqual(this.oUser.setChangedProperties.getCall(0).args, aExpectedSpaceEnabledArgs, "setChangedProperties was called with correct args");

            assert.strictEqual(this.oUser.setShowMyHome.callCount, 0, "setShowMyHome was not called");
            assert.strictEqual(this.oUser.setImportBookmarksFlag.callCount, 0, "setImportBookmarksFlag was not called");
            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.callCount, 0, "setHideEmptySpacesEnabled was not called");

            assert.strictEqual(this.oUserInfoService.updateUserPreferences.callCount, 1, "updateUserPreferences was called");
        }.bind(this));
    });

    QUnit.test("Saves changes when showMyHome was changed", function (assert) {
        // Arrange
        // user unchecks a single checkbox
        this.oModel.setProperty("/showMyHome/selected", false);

        var oExpectedResult = {
            refresh: true,
            noHash: true
        };

        // Act
        return this.oController.onSave(this.oUserInfoService.updateUserPreferences).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "Resolved correct result");

            assert.strictEqual(this.oUser.setChangedProperties.callCount, 0, "setChangedProperties was not called");

            assert.strictEqual(this.oUser.setShowMyHome.callCount, 1, "setShowMyHome was called");
            assert.strictEqual(this.oUser.setShowMyHome.getCall(0).args[0], false, "setShowMyHome was called with correct args");

            assert.strictEqual(this.oUser.setImportBookmarksFlag.callCount, 0, "setImportBookmarksFlag was not called");
            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.callCount, 0, "setHideEmptySpacesEnabled was not called");

            assert.strictEqual(this.oUserInfoService.updateUserPreferences.callCount, 1, "updateUserPreferences was called");
        }.bind(this));
    });

    QUnit.test("Saves changes when showMyHomeImport was changed", function (assert) {
        // Arrange
        // user unchecks a single checkbox
        this.oModel.setProperty("/showMyHomeImport/selected", false);

        var oExpectedResult = {
            refresh: false,
            noHash: true
        };

        var aExpectedEventHubArgs = [
            "importBookmarksFlag",
            false
        ];

        // Act
        return this.oController.onSave(this.oUserInfoService.updateUserPreferences).then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "Resolved correct result");

            assert.strictEqual(this.oUser.setChangedProperties.callCount, 0, "setChangedProperties was not called");
            assert.strictEqual(this.oUser.setShowMyHome.callCount, 0, "setShowMyHome was not called");

            assert.strictEqual(this.oUser.setImportBookmarksFlag.callCount, 1, "setImportBookmarksFlag was called");
            assert.strictEqual(this.oUser.setImportBookmarksFlag.getCall(0).args[0], "dismissed", "setImportBookmarksFlag was called with correct args");
            assert.strictEqual(this.oEventHubEmitStub.callCount, 1, "EventHub.emit was called");
            assert.deepEqual(this.oEventHubEmitStub.getCall(0).args, aExpectedEventHubArgs, "EventHub.emit was called with correct args");

            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.callCount, 0, "setHideEmptySpacesEnabled was not called");

            assert.strictEqual(this.oUserInfoService.updateUserPreferences.callCount, 1, "updateUserPreferences was called");
        }.bind(this));
    });

    QUnit.test("Saves changes when hideEmptySpaces was changed", function (assert) {
        // Arrange
        // user unchecks a single checkbox
        this.oModel.setProperty("/hideEmptySpaces/selected", false);

        var oExpectedResult = {
            refresh: false,
            noHash: true
        };

        // Act
        return this.oController.onSave().then(function (oResult) {
            // Assert
            assert.deepEqual(oResult, oExpectedResult, "Resolved correct result");

            assert.strictEqual(this.oUser.setChangedProperties.callCount, 0, "setChangedProperties was not called");
            assert.strictEqual(this.oUser.setShowMyHome.callCount, 0, "setShowMyHome was not called");
            assert.strictEqual(this.oUser.setImportBookmarksFlag.callCount, 0, "setImportBookmarksFlag was not called");

            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.callCount, 1, "setHideEmptySpacesEnabled was called");
            assert.strictEqual(this.oSetHideEmptySpacesEnabledStub.getCall(0).args[0], false, "setHideEmptySpacesEnabled was called with correct args");

            assert.strictEqual(this.oUserInfoService.updateUserPreferences.callCount, 0, "updateUserPreferences was not called");
        }.bind(this));
    });

    QUnit.module("onCancel", {
        beforeEach: function (assert) {
            this.oLogWarningStub = sandbox.stub(Log, "warning");
            this.oSpacesEntry = SpacesEntry.getEntry();

            this.oOnCancelStub = sandbox.stub();
            this.oMockView = {
                getController: sandbox.stub().returns({
                    onCancel: this.oOnCancelStub
                })
            };
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Check that a warning is put into the Log if the View was not created yet", function (assert) {
        // Act
        this.oSpacesEntry.onCancel();

        // Assert
        assert.strictEqual(this.oLogWarningStub.callCount, 1, "A warning was logged.");
    });

    QUnit.test("Check that no warning is put into the Log if the View was already created", function (assert) {
        // Arrange
        this.oSpacesEntry._setViewInstance(this.oMockView);

        // Act
        this.oSpacesEntry.onCancel();

        // Assert
        assert.strictEqual(this.oLogWarningStub.callCount, 0, "No warning was logged.");
        assert.strictEqual(this.oOnCancelStub.callCount, 1, "Controller.onCancel was called.");
    });

    QUnit.module("Controller.onCancel", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");

            this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
            this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/userEnabled").returns(true);

            // all checkboxes are unchecked
            this.oModel = new JSONModel({
                spaces: {
                    selected: false
                },
                hideEmptySpaces: {
                    selected: false
                },
                showMyHome: {
                    selected: false
                }
            });

            this.oUser = {
                getShowMyHome: sandbox.stub().returns(true)
            };
            this.oUserInfoService = {
                getUser: sandbox.stub().returns(this.oUser)
            };

            this.oController = new SpacesSettingController();
            this.oController.oUserInfoService = this.oUserInfoService;
            sandbox.stub(this.oController, "getView").returns({
                getModel: sandbox.stub().returns(this.oModel)
            });
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Restores values in model", function (assert) {
        // Arrange
        // Act
        this.oController.onCancel();
        // Assert
        assert.strictEqual(this.oModel.getProperty("/spaces/selected"), true, "spaces was set correctly");
        assert.strictEqual(this.oModel.getProperty("/hideEmptySpaces/selected"), true, "hideEmptySpaces was set correctly");
        assert.strictEqual(this.oModel.getProperty("/showMyHome/selected"), true, "showMyHome was set correctly");
    });

    QUnit.module("Controller.onExit", {
        beforeEach: function () {
            this.oImportBookmarksFlagListener = {
                off: sandbox.stub()
            };
            this.oController = new SpacesSettingController();
            this.oController.oImportBookmarksFlagListener = this.oImportBookmarksFlagListener;
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("Detaches the Import Dialog Listener", function (assert) {
        // Act
        this.oController.onExit();
        //Assert
        assert.strictEqual(this.oImportBookmarksFlagListener.off.callCount, 1, "The listener was detached");
    });

    QUnit.module("isRelevant", {
        beforeEach: function () {
            this.oConfigLastStub = sandbox.stub(Config, "last");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("SpacesEntry is relevant in case spaces is configurable", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/configurable").returns(true);
        // Act
        var bRelevant = SpacesEntry.isRelevant();
        // Assert
        assert.strictEqual(bRelevant, true, "Returned the correct result");
    });

    QUnit.test("SpacesEntry is relevant in case spaces and hideEmptySpaces are enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/hideEmptySpaces/enabled").returns(true);
        // Act
        var bRelevant = SpacesEntry.isRelevant();
        // Assert
        assert.strictEqual(bRelevant, true, "Returned the correct result");
    });

    QUnit.test("SpacesEntry is relevant in case spaces and myHome are enabled", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true);
        // Act
        var bRelevant = SpacesEntry.isRelevant();
        // Assert
        assert.strictEqual(bRelevant, true, "Returned the correct result");
    });

    QUnit.test("SpacesEntry is not relevant in case spaces is disabled and not configurable", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(false);
        this.oConfigLastStub.withArgs("/core/spaces/configurable").returns(false);
        // Act
        var bRelevant = SpacesEntry.isRelevant();
        // Assert
        assert.strictEqual(bRelevant, false, "Returned the correct result");
    });

    QUnit.test("SpacesEntry is not relevant in case spaces not configurable but both myHome and Home App are on", function (assert) {
        // Arrange
        this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true); // Spaces ON
        this.oConfigLastStub.withArgs("/core/spaces/configurable").returns(false); // Spaces cannot be switched OFF
        this.oConfigLastStub.withArgs("/core/spaces/myHome/enabled").returns(true); // myHome is enabled
        this.oConfigLastStub.withArgs("/core/homeApp/enabled").returns(true); // Home App is enabled and hides myHome
        // Act
        var bRelevant = SpacesEntry.isRelevant();
        // Assert
        assert.strictEqual(bRelevant, false, "Returned the correct result");
    });

});
