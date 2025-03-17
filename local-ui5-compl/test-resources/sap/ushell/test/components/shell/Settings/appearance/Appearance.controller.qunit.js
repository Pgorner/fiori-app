// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/util/ObjectPath",
    "sap/ui/core/Component",
    "sap/ui/core/message/Message",
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/components/shell/Settings/appearance/Appearance.controller",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ushell/services/DarkModeSupport",
    "sap/ushell/Container"
], function (
    Log,
    ObjectPath,
    Component,
    Message,
    Controller,
    Device,
    JSONModel,
    jQuery,
    AppearanceController,
    Config,
    ushellResources,
    DarkModeSupport,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.sandbox.create();

    QUnit.module("Appearance.controller", {
        beforeEach: function (assert) {
            Device.system.phone = false;

            this.oTestUser = {
                getTheme: sinon.stub(),
                isSetThemePermitted: sinon.stub().returns(false),
                resetChangedProperty: sinon.spy(),
                getDetectDarkMode: sinon.stub().returns(false)
            };

            this.oUserInfoService = {
                updateUserPreferences: sinon.stub()
            };

            sandbox.stub(Container, "getServiceAsync").returns(this.oUserInfoService);
            sandbox.stub(Container, "getUser").returns(this.oTestUser);

            this.oView = {
                getModel: sinon.stub(),
                setModel: sinon.spy(),
                getViewData: sinon.stub(),
                byId: sinon.stub()
            };

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                sinon.stub(this.oController, "getView").returns(this.oView);
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("onInit", function (assert) {
        // Arrange
        var bSetTheme = true;
        var bSizeBehaviorConfigurable = true;
        var sSizeBehavior = "Small";

        Config.emit("/core/contentProviders/providerInfo/enabled", false);
        Config.emit("/core/contentProviders/providerInfo/userConfigurable", false);
        Config.emit("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", false);
        Config.emit("/core/darkMode/enabled", false);
        Config.emit("/core/home/sizeBehavior", sSizeBehavior);
        Config.emit("/core/home/sizeBehaviorConfigurable", bSizeBehaviorConfigurable);
        Config.emit("/core/shell/model/contentDensity", false);
        Config.emit("/core/shell/model/setTheme", bSetTheme);
        document.body.classList.add("sapUiSizeCozy");
        this.oTestUser.getTheme.returns("sap_fiori_3");
        this.oTestUser.isSetThemePermitted.returns(false);
        this.oView.getViewData.returns({
            themeList: []
        });
        var oExpectedConfigModel = {
            contentDensityConfigurable: false,
            displaySettingsTabVisible: true,
            isCozyContentMode: true,
            showContentProviderInfoOnVisualizationsConfigurable: false,
            showContentProviderInfoOnVisualizationsSelected: false,
            sizeBehaviorConfigurable: bSizeBehaviorConfigurable,
            textAlign: "Right",
            themeConfigurable: bSetTheme,
            tileSize: 0
        };
        var oExpectedDarkModeModel = {
            enabled: true,
            detectionSupported: true,
            detectionEnabled: false
        };
        this.oView.getModel.withArgs("darkMode").returns({
            getData: sinon.stub.returns(oExpectedDarkModeModel)
        });

        // Act
        this.oController.onInit();

        // Assert
        assert.deepEqual(this.oController.oPersonalizers, {}, "The correct value of oPersonalizers has been assigned.");
        assert.equal(this.oView.setModel.callCount, 4, "4 models should be set");
        assert.deepEqual(this.oView.setModel.getCall(0).args[1], "i18n", "i18n model was set");
        var oConfigModel = this.oView.setModel.getCall(1);
        assert.deepEqual(oConfigModel.args[0].getData(), oExpectedConfigModel, "The correct config model is set");
        assert.equal(oConfigModel.args[1], "config", "The correct name of the second setModel");
        var oDarkModeModel = this.oView.setModel.getCall(2);
        assert.deepEqual(oDarkModeModel.args[0].getData(), oExpectedDarkModeModel, "The correct dark model is set");
        assert.equal(oDarkModeModel.args[1], "darkMode", "The correct name of darkMode model");
        var oThemeOptionModel = this.oView.setModel.getCall(3).args[0];
        assert.deepEqual(oThemeOptionModel.getProperty("/options")?.length, 1, "The correct options are set");
        assert.deepEqual(oThemeOptionModel.getProperty("/ariaTexts"), { headerLabel: ushellResources.i18n.getText("Appearance") }, "The ariaText object is set");

        // Clean-up
        document.body.classList.remove("sapUiSizeCozy");
    });

    QUnit.test("_handleThemeApplied: theme is selected", async function (assert) {
        // Arrange
        this.oController.oUser = {
            getTheme: sandbox.stub()
        };
        var oStubGetThemeListData = sandbox.stub(this.oController, "_getThemeListData");
        var oConfigModel = new JSONModel({});
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oView.getModel.withArgs().returns({ setProperty: function () { } });

        // Act
        this.oController._handleThemeApplied();
        // Assert
        assert.equal(oStubGetThemeListData.callCount, 1, "getThemeList shall be called");
    });

    QUnit.test("_getThemeListData: sets are disabled", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: false
        });
        this.oController.oUser = {
            isSetThemePermitted: sinon.stub().returns(true)
        };

        this.oController.sThemeRoot = "/themeroot/";

        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        this.oController._oDarkModeModel = oDarkModeModel;

        var aThemeListFromServer = [
            { id: "cola", name: "Cola Theme"},
            { id: "sap_fiori_3_dark", name: "SAP Quartz Dark", avatarRuntimeUrl: "qd.svg"},
            { id: "sap_belize", name: "SAP Belize", deprecated: true, avatarRuntimeUrl: "ql.svg" }
        ];
        const aThemeSets = [
            {
                id: "sap_fiori_3_set",
                type: "SET",
                label: "SAP Quartz (Set)",
                deprecated: false,
                set: {
                    themes: [
                        {
                            id: "sap_fiori_3",
                            colorScheme: "LIGHT",
                            contrast: "LOW"
                        },
                        {
                            id: "sap_fiori_3_dark",
                            colorScheme: "DARK",
                            contrast: "LOW"
                        },
                        {
                            id: "sap_fiori_3_hcw",
                            colorScheme: "LIGHT",
                            contrast: "HIGH"
                        },
                        {
                            id: "sap_fiori_3_hcb",
                            colorScheme: "DARK",
                            contrast: "HIGH"
                        }
                    ]
                }
            }
        ];

        // Act
        this.oController.aThemeListFromServer = aThemeListFromServer;
        this.oController.aThemeSets = aThemeSets;
        var aThemeList = this.oController._getThemeListData("sap_fiori_3_dark");

        // Assert
        var aExpectedList = [{
            id: "cola",
            name: "Cola Theme",
            icon: "sap-icon://palette",
            isSelected: false,
            deprecated: false,
            setId: undefined,
            avatar: undefined,
            mode: "Image"
        }, {
            id: "sap_fiori_3_dark",
            name: "SAP Quartz Dark",
            icon: "sap-icon://palette",
            isSelected: true,
            deprecated: false,
            setId: "sap_fiori_3_set",
            avatar: "/themeroot/qd.svg",
            mode: "Image"
        }, {
            id: "sap_belize",
            name: "SAP Belize",
            icon: "sap-icon://palette",
            isSelected: false,
            deprecated: true,
            setId: undefined,
            avatar: "/themeroot/ql.svg",
            mode: "Image"
        }];
        assert.deepEqual(aThemeList, aExpectedList, "theme sorted with correct properties");
    });

    QUnit.test("_getThemeListData: sets are enabled", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: false
        });
        this.oController.oUser = {
            isSetThemePermitted: sinon.stub().returns(true)
        };

        this.oController.sThemeRoot = "/themeroot/";

        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        this.oController._oDarkModeModel = oDarkModeModel;
        sandbox.stub(this.oController, "_areSetsVisible").returns(true);

        var aThemeListFromServer = [
            { id: "cola", name: "Cola Theme"},
            { id: "sap_fiori_3_dark", name: "SAP Quartz Dark", avatarRuntimeUrl: "qd.svg"},
            { id: "sap_belize", name: "SAP Belize", deprecated: true, avatarRuntimeUrl: "ql.svg" }
        ];
        const aThemeSets = [
            {
                id: "sap_fiori_3_set",
                type: "SET",
                label: "SAP Quartz (Set)",
                deprecated: false,
                set: {
                    themes: [
                        {
                            id: "sap_fiori_3",
                            colorScheme: "LIGHT",
                            contrast: "LOW"
                        },
                        {
                            id: "sap_fiori_3_dark",
                            colorScheme: "DARK",
                            contrast: "LOW"
                        },
                        {
                            id: "sap_fiori_3_hcw",
                            colorScheme: "LIGHT",
                            contrast: "HIGH"
                        },
                        {
                            id: "sap_fiori_3_hcb",
                            colorScheme: "DARK",
                            contrast: "HIGH"
                        }
                    ]
                }
            }
        ];

        // Act
        this.oController.aThemeListFromServer = aThemeListFromServer;
        this.oController.aThemeSets = aThemeSets;
        var aThemeList = this.oController._getThemeListData("sap_fiori_3_dark");

        // Assert
        var aExpectedList = [{
            avatar: undefined,
            deprecated: false,
            icon: "sap-icon://sys-monitor",
            id: "sap_fiori_3_set",
            isSelected: false,
            mode: "InlineSvg",
            name: ushellResources.i18n.getText("AppearanceAutomaticSelection"),
            setId: "sap_fiori_3_set"
        }, {
            id: "cola",
            name: "Cola Theme",
            icon: "sap-icon://palette",
            isSelected: false,
            deprecated: false,
            setId: undefined,
            avatar: undefined,
            mode: "Image"
        }, {
            id: "sap_fiori_3_dark",
            name: "SAP Quartz Dark",
            icon: "sap-icon://palette",
            isSelected: true,
            deprecated: false,
            setId: "sap_fiori_3_set",
            avatar: "/themeroot/qd.svg",
            mode: "Image"
        }, {
            id: "sap_belize",
            name: "SAP Belize",
            icon: "sap-icon://palette",
            isSelected: false,
            deprecated: true,
            setId: undefined,
            avatar: "/themeroot/ql.svg",
            mode: "Image"
        }];
        assert.deepEqual(aThemeList, aExpectedList, "theme list returned with correct properties");
    });

    QUnit.module("onCancel", {
        beforeEach: function (assert) {
            this.oTestUser = {
                getTheme: sinon.stub(),
                getContentDensity: sinon.stub()
            };

            this.oView = {
                getModel: sinon.stub()
            };

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.oUser = this.oTestUser;
                sinon.stub(this.oController, "getView").returns(this.oView);
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("reset the model", function (assert) {
        // Arrange
        Config.emit("/core/home/sizeBehavior", "Small");
        var oConfigModel = new JSONModel({
            contentDensityConfigurable: true,
            isCozyContentMode: false,
            showContentProviderInfoOnVisualizationsConfigurable: "some initial value",
            showContentProviderInfoOnVisualizationsSelected: true,
            sizeBehaviorConfigurable: true,
            themeConfigurable: true,
            tileSize: 1
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        var oThemeModel = new JSONModel({
            options: [
                { id: "sap_fiori", isSelected: false },
                { id: "sap_belize", isSelected: true }
            ]
        });
        this.oView.getModel.returns(oThemeModel);
        this.oTestUser.getTheme.returns("sap_fiori");
        this.oTestUser.getContentDensity.returns("cozy");

        // Act
        this.oController.onCancel();

        // Assert
        var oExpectedConfigData = {
            contentDensityConfigurable: true,
            isCozyContentMode: true,
            showContentProviderInfoOnVisualizationsConfigurable: "some initial value",
            showContentProviderInfoOnVisualizationsSelected: false,
            sizeBehaviorConfigurable: true,
            themeConfigurable: true,
            tileSize: 0
        };
        assert.deepEqual(oConfigModel.getData(), oExpectedConfigData, "Config model was reset");
        var oExpectedThemeData = {
            options: [
                { id: "sap_fiori", isSelected: true },
                { id: "sap_belize", isSelected: false }
            ]
        };
        assert.deepEqual(oThemeModel.getData(), oExpectedThemeData, "Theme model was reset");
    });

    QUnit.module("onSave", {
        beforeEach: function (assert) {
            var oDarkModeModel = new JSONModel({
                detectionEnabled: false
            });
            this.oTestUser = {
                getTheme: sinon.stub(),
                setTheme: sinon.spy(),
                setContentDensity: sinon.spy(),
                getContentDensity: sinon.stub(),
                getDetectDarkMode: sinon.stub(),
                setDetectDarkMode: sinon.spy(),
                resetChangedProperty: sinon.spy()
            };

            this.oUserInfoService = {
                updateUserPreferences: sandbox.stub().resolves()
            };

            this.oView = {
                getModel: sinon.stub(),
                byId: sinon.stub()
            };

            sandbox.stub(Container, "getServiceAsync").returns(this.oUserInfoService);

            this.oConfigLastStub = sandbox.stub(Config, "last");

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.oUser = this.oTestUser;
                this.oController.userInfoService = this.oUserInfoService;
                this.oController._oDarkModeModel = oDarkModeModel;
                this.oController.onSaveDarkModeEnabledSuccess = sinon.stub().resolves(true);
                this.oController.onSaveThemesSuccess = sinon.stub().resolves(true);
                sinon.stub(this.oController, "getView").returns(this.oView);
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("the onSaveTileSize method resolves without errors", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            tileSize: 1,
            sizeBehaviorConfigurable: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);

        sandbox.stub(this.oController, "writeToPersonalization").returns(new jQuery.Deferred().resolve())();
        // Act
        return this.oController.onSaveTileSize()
            .then(function () {
                assert.ok(true, "onSaveTileSize was called");
            });
    });

    QUnit.test("the onSaveTileSize method rejects with error in tile size", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            tileSize: 1,
            sizeBehaviorConfigurable: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        sandbox.stub(this.oController, "writeToPersonalization").returns(new jQuery.Deferred().reject(
            "Message",
            {
                message: {
                    value: ""
                },
                innererror: {
                    timestamp: new Date(),
                    httpStatus: "404"
                }

            }
        ))();
        // Act
        return this.oController.onSaveTileSize()
            .then(function (oMessage) {
                assert.ok(false, "resolves");
            })
            .catch(function (oMessage) {
                assert.ok(true, "onSaveTileSize was rejected");
                assert.equal(oMessage.getMetadata().getName(), "sap.ui.core.message.Message", "rejects with a message object");
            });
    });

    QUnit.test("the onSaveThemes method resolves without errors", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: false,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        sandbox.stub(this.oController, "_getSelectedTheme").returns("mySelectedTheme");
        sandbox.stub(this.oController, "_applyDarkMode").resolves();
        this.oTestUser.getTheme.returns("myTheme");
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences;
        // Act
        return this.oController.onSaveThemes()
            .then(function () {
                assert.ok(true, "onSaveThemes was called");
            });
    });

    QUnit.test("the onSaveThemes method rejects with error in theme", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: false,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        sandbox.stub(this.oController, "_getSelectedTheme").returns("mySelectedTheme");
        sandbox.stub(this.oController, "_applyDarkMode").resolves();

        this.oTestUser.getTheme.returns("myTheme");
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("THEME", {
            message: {
                value: "info"
            }
        }));
        // Act
        return this.oController.onSaveThemes()
            .then(function (oError) {
                assert.ok(false, "onSaveThemes was resolved");
            })
            .catch(function (oError) {
                assert.ok(true, "onSaveThemes was rejected");
                assert.equal(oError.getMetadata().getName(), "sap.ui.core.message.Message", "rejects with a message object");
            });
    });

    QUnit.test("the onSaveThemes method resolves with error not in theme", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: false,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        sandbox.stub(this.oController, "_getSelectedTheme").returns("mySelectedTheme");
        sandbox.stub(this.oController, "_applyDarkMode").resolves();

        this.oTestUser.getTheme.returns("myTheme");
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("OTHER_ERROR", {
            message: {
                value: "info"
            }
        }));
        // Act
        return this.oController.onSaveThemes()
            .then(function () {
                assert.ok(true, "onSaveThemes resolves");
            })
            .catch(function (sError) {
                assert.ok(false, "onSaveThemes rejects");
            });
    });

    QUnit.test("the onSaveContentDensity method resolves without errors", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            contentDensityConfigurable: true,
            isCozyContentMode: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oTestUser.getContentDensity.returns(true);
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences;
        // Act
        return this.oController.onSaveContentDensity()
            .then(function () {
                assert.ok(true, "onSaveContentDensity was called");
            });
    });

    QUnit.test("the onSaveContentDensity method rejects with error in content density", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            contentDensityConfigurable: true,
            isCozyContentMode: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oTestUser.getContentDensity.returns("compact");
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("CONTENT_DENSITY"));
        // Act
        return this.oController.onSaveContentDensity()
            .then(function () {
                assert.notOk(true, "onSaveContentDensity was resolved");
            })
            .catch(function (oError) {
                assert.ok(true, "onSaveContentDensity was rejected");
                assert.equal(oError.getMetadata().getName(), "sap.ui.core.message.Message", "resolves with a message object");
            });
    });

    QUnit.test("the onSaveContentDensity method resolves with error not in content density", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            contentDensityConfigurable: true,
            isCozyContentMode: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oTestUser.getContentDensity.returns("compact");
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("OTHER_ERROR"));
        // Act
        return this.oController.onSaveContentDensity()
            .then(function () {
                assert.ok(true, "onSavonSaveContentDensity was resolved");
            });
    });

    QUnit.test("the onSaveDarkModeEnabled method resolves without errors", function (assert) {
        // Arrange
        this.oTestUser.getDetectDarkMode.returns(true);
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences;
        // Act
        return this.oController.onSaveDarkModeEnabled()
            .then(function () {
                assert.ok(true, "onSaveDarkModeEnabled was called");
            });
    });

    QUnit.test("the onSaveDarkModeEnabled method rejects with error in dark mode", function (assert) {
        // Arrange

        this.oTestUser.getDetectDarkMode.returns(true);
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences;
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("THEME_DARKMODE_AUTO_DETECTION"));
        // Act
        return this.oController.onSaveDarkModeEnabled()
            .then(function (oError) {
                assert.ok(false, "onSaveDarkModeEnabled resolves");
            })
            .catch(function (oError) {
                assert.ok(true, "onSaveDarkModeEnabled was rejected");
                assert.equal(oError.getMetadata().getName(), "sap.ui.core.message.Message", "resolves with a message object");
            });
    });

    QUnit.test("the onSaveDarkModeEnabled method resolves with error not in in dark mode", function (assert) {
        // Arrange
        this.oTestUser.getDetectDarkMode.returns(true);
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences;
        this.oController._updateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("OTHER_ERROR"));
        // Act
        return this.oController.onSaveDarkModeEnabled()
            .then(function () {
                assert.ok(true, "resolves");
            })
            .catch(function (sError) {
                assert.ok(false, "rejects");
            });
    });

    QUnit.test("resolve promise when not possible to configure", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            themeConfigurable: false,
            contentDensityConfigurable: false,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oController.onSaveThemes = sinon.spy();
        this.oController.onSaveContentDensity = sinon.spy();
        this.oController.onSaveTileSize = sinon.spy();

        // Act
        return this.oController.onSave().then(function () {
            // Assert
            assert.ok(true, "onSave should be resolved");
            assert.ok(this.oController.onSaveThemes.notCalled, "onSaveThemes should not be called");
            assert.ok(this.oController.onSaveContentDensity.notCalled, "onSaveContentDensity should not be called");
            assert.ok(this.oController.onSaveTileSize.notCalled, "onSaveTileSize should not be called");
        }.bind(this), function () {
            assert.ok(false, "onSave should be rejected");
        });
    });

    QUnit.test("call save method of each config", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            contentDensityConfigurable: true,
            showContentProviderInfoOnVisualizationsConfigurable: true,
            sizeBehaviorConfigurable: true,
            themeConfigurable: true
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oController.onSaveContentDensity = sinon.stub().resolves();
        this.oController.onSaveShowContentProviderInfoOnVisualizations = sinon.stub().resolves();
        this.oController.onSaveThemes = sinon.stub().resolves();
        this.oController.onSaveTileSize = sinon.stub().resolves();

        // Act
        return this.oController.onSave().then(function () {
            // Assert
            assert.ok(true, "onSave should be resolved");
            assert.ok(this.oController.onSaveThemes.calledOnce, "onSaveThemes should be called");
            assert.ok(this.oController.onSaveContentDensity.calledOnce, "onSaveContentDensity not be called");
            assert.ok(this.oController.onSaveShowContentProviderInfoOnVisualizations.calledOnce,
                '"onSaveShowContentProviderInfoOnVisualizations" should be called once');
            assert.ok(this.oController.onSaveTileSize.calledOnce, "onSaveTileSize not be called");
        }.bind(this), function () {
            assert.ok(false, "onSave should be rejected");
        });
    });

    QUnit.test("reject promise if there is error", function (assert) {
        // Arrange
        var oConfigModel = new JSONModel({
            themeConfigurable: true,
            contentDensityConfigurable: true,
            sizeBehaviorConfigurable: false
        });
        this.oView.getModel.withArgs("config").returns(oConfigModel);
        this.oController.onSaveThemes = sinon.stub().rejects(new Message({
            message: "testMessage"
        }));
        this.oController.onSaveContentDensity = sinon.stub().resolves();

        // Act
        return this.oController.onSave().then(function () {
            // Assert
            assert.ok(true, "onSave should be resolved");
        }, function () {
            assert.ok(true, "onSave should be rejected");
        });
    });

    QUnit.module("getConfigurationModel", {
        beforeEach: function () {
            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
            }.bind(this));
        },
        afterEach: function () {
            sandbox.restore();
            this.oController.destroy();
            Config._reset();
        }
    });

    QUnit.test("get default configuration model", async function (assert) {
        // Arrange
        var oExpectedData = {
            contentDensityConfigurable: undefined,
            displaySettingsTabVisible: false,
            isCozyContentMode: false,
            showContentProviderInfoOnVisualizationsConfigurable: false,
            showContentProviderInfoOnVisualizationsSelected: false,
            sizeBehaviorConfigurable: false,
            textAlign: "Right",
            themeConfigurable: true,
            tileSize: 1
        };

        // Act
        var oResultModel = await this.oController.getConfigurationModel();
        var oResultData = oResultModel.getData();

        // Assert
        assert.deepEqual(oResultData, oExpectedData, "Model data is as expected.");
    });

    QUnit.test("sapUiSizeCozy is set on the body", async function (assert) {
        // Arrange
        document.body.classList.add("sapUiSizeCozy");

        // Act
        var oResultModel = await this.oController.getConfigurationModel();

        // Assert
        assert.equal(oResultModel.getData().isCozyContentMode, true, "Model data is as expected.");

        // Clean-up
        document.body.classList.remove("sapUiSizeCozy");
    });

    QUnit.module("Dark mode", {
        beforeEach: function (assert) {
            Config.emit("/core/darkMode/enabled", true);

            this.aThemeList = [
                { id: "cocacola2016", name: "Coca Cola 2016" },
                { id: "sap_belize", name: "SAP Belize" },
                { id: "sap_belize_plus", name: "SAP Belize Deep" },
                { id: "sap_fiori_3_dark", name: "SAP Quartz Dark" },
                { id: "sap_fiori_3", name: "SAP Quartz Light" }
            ];

            this.oDarkModeSupport = {
                canAutomaticallyToggleDarkMode: sandbox.stub().returns(true),
                enableDarkModeBasedOnSystem: sandbox.spy(),
                disableDarkModeBasedOnSystem: sandbox.spy()
            };

            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");
            this.oGetServiceAsyncStub.withArgs("DarkModeSupport").resolves(this.oDarkModeSupport);

            var oServices = ObjectPath.create("sap.ushell.services");
            oServices.DarkModeSupport = DarkModeSupport;

            this.oView = {
                getModel: sandbox.stub(),
                setModel: sandbox.spy(),
                getViewData: sandbox.stub(),
                invalidate: sandbox.spy()
            };

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
                this.oController.aThemeListFromServer = this.aThemeList;
                this.oController.oUser = {
                    getDetectDarkMode: sandbox.stub().returns(true)
                };
                this.oController._getSelectedTheme = sandbox.stub().returns("sap_fiori_3");
                sandbox.stub(this.oController, "getView").returns(this.oView);
            }.bind(this));
        },

        afterEach: function () {
            Config._reset();
            this.oController.destroy();
            this.oController = null;
            sandbox.restore();
            delete sap.ushell.services;
        }
    });

    QUnit.test("create model and don't attach the listener when dark mode is disabled", function (assert) {
        // Arrange
        Config.emit("/core/darkMode/enabled", false);
        var oExpectedData = {
            enabled: true,
            detectionSupported: true,
            detectionEnabled: true
        };

        // Act
        const oDarkModeModel = this.oController.getDarkModeModel(this.aThemeList);
        // Assert
        assert.deepEqual(oDarkModeModel.getData(), oExpectedData, "The correct dark mode model is created");
    });

    QUnit.test("create model when dark mode is enabled", function (assert) {
        // Arrange
        var oExpectedData = {
            enabled: true,
            detectionSupported: true,
            detectionEnabled: true //enabled by default in DarkModeSupport service
        };

        // Act
        const oDarkModeModel = this.oController.getDarkModeModel(this.aThemeList);
        // Assert
        assert.deepEqual(oDarkModeModel.getData(), oExpectedData, "The correct dark mode model is created");
    });

    QUnit.test("_isDarkModeActive: return false when dark mode is disabled", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: false
        });
        this.oController._oDarkModeModel = oDarkModeModel;
        // Act
        var bIsActive = this.oController._isDarkModeActive(this.aThemeList);

        // Assert
        assert.equal(bIsActive, false, "_isDarkModeActive is false when dark mode is disabled");
    });

    QUnit.test("_isDarkModeActive: return false when dark mode is enabled and detection is supported", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: true,
            detectionSupported: false
        });
        this.oController._oDarkModeModel = oDarkModeModel;
        // Act
        var bIsActive = this.oController._isDarkModeActive(this.aThemeList);

        // Assert
        assert.equal(bIsActive, false, "_isDarkModeActive is false when dark mode is enabled and detection is not supported");
    });

    QUnit.test("_isDarkModeActive: return true when dark mode is enabled and detection is supported and enabled", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: true,
            detectionSupported: true,
            detectionEnabled: true
        });
        this.oController._oDarkModeModel = oDarkModeModel;
        // Act
        var bIsActive = this.oController._isDarkModeActive(this.aThemeList);

        // Assert
        assert.equal(bIsActive, true, "_isDarkModeActive is true when dark mode is enabled and detection is not supported");
    });

    QUnit.test("changeSystemModeDetection: enable detection", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: true,
            detectionSupported: true,
            detectionEnabled: true
        });
        this.oController.oUser = {
            getTheme: sinon.stub().returns("sap_fiori"),
            isSetThemePermitted: sinon.stub().returns(false)
        };
        var oGetThemeListDataStub = sinon.spy(this.oController, "_getThemeListData");
        var oEvent = {
            getSource: sinon.stub().returns({
                getState: sinon.stub().returns(true)
            })
        };
        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        var oSetPropStub = sinon.spy();
        this.oView.getModel.returns({
            setProperty: oSetPropStub
        });
        // Act
        this.oController.changeSystemModeDetection(oEvent);

        // Assert
        assert.ok(this.oDarkModeSupport.enableDarkModeBasedOnSystem.notCalled, "enableDarkModeBasedOnSystem not called");
        assert.ok(this.oDarkModeSupport.disableDarkModeBasedOnSystem.notCalled, "disableDarkModeBasedOnSystem not called");
        assert.ok(oGetThemeListDataStub.calledOnce, "new theme model was calculated");
        assert.ok(oSetPropStub.getCall(0).args[0], "/options", "the options was updated");
        assert.ok(this.oView.invalidate.calledOnce, "View was invalidated");
    });

    QUnit.test("changeSystemModeDetection: disable detection", function (assert) {
        // Arrange
        var oDarkModeModel = new JSONModel({
            enabled: true,
            detectionSupported: true,
            detectionEnabled: true
        });
        this.oController.oUser = {
            getTheme: sinon.stub().returns("sap_fiori"),
            isSetThemePermitted: sinon.stub().returns(false)
        };
        var oGetThemeListDataStub = sinon.spy(this.oController, "_getThemeListData");
        var oEvent = {
            getSource: sinon.stub().returns({
                getState: sinon.stub().returns(false)
            })
        };
        this.oView.getModel.withArgs("darkMode").returns(oDarkModeModel);
        var oSetPropStub = sinon.spy();
        this.oView.getModel.returns({
            setProperty: oSetPropStub
        });
        // Act
        this.oController.changeSystemModeDetection(oEvent);

        // Assert
        assert.ok(this.oDarkModeSupport.enableDarkModeBasedOnSystem.notCalled, "enableDarkModeBasedOnSystem not called");
        assert.ok(this.oDarkModeSupport.disableDarkModeBasedOnSystem.notCalled, "disableDarkModeBasedOnSystem not called");
        assert.ok(oGetThemeListDataStub.calledOnce, "new theme model was calculated");
        assert.ok(oSetPropStub.getCall(0).args[0], "/options", "the options was updated");
        assert.ok(this.oView.invalidate.calledOnce, "View was invalidated");
    });

    QUnit.module("The writeToPersonalization function", {
        beforeEach: function (assert) {
            this.oLogErrorStub = sandbox.stub(Log, "error");

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;

                this.oSetPersDataStub = sandbox.stub();
                var oPersonalizer = {
                    setPersData: this.oSetPersDataStub
                };
                this.oGetPersonalizerStub = sandbox.stub(this.oController, "getPersonalizer").resolves(oPersonalizer);
            }.bind(this));
        },

        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
            sandbox.restore();
        }
    });

    QUnit.test("Returns the result of the function call to setPersData", function (assert) {
        // Arrange
        var oReturnValue = {};
        var oContainer = {};
        var oItem = {};
        var oValue = {};
        this.oSetPersDataStub.returns(oReturnValue);

        // Act
        return this.oController.writeToPersonalization(oContainer, oItem, oValue)
            .then(function (oResult) {
                // Assert
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "The function getPersonalizer has been called once.");
                assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[0], oContainer, "The function getPersonalizer has been called with the correct parameter.");
                assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[1], oItem, "The function getPersonalizer has been called with the correct parameter.");
                assert.strictEqual(this.oSetPersDataStub.callCount, 1, "The function setPersData has been called once.");
                assert.strictEqual(this.oSetPersDataStub.firstCall.args[0], oValue, "The function setPersData has been called with the correct parameter.");
                assert.strictEqual(oResult, oReturnValue, "The function setPersData has returned the correct value.");
            }.bind(this));
    });

    QUnit.test("Returns a rejected promise if setPersData throws an error", function (assert) {
        // Arrange
        this.oSetPersDataStub.throws({});
        var fnDone = assert.async();

        // Act
        var oResult = this.oController.writeToPersonalization();

        // Assert
        assert.strictEqual(typeof oResult.then, "function", "The returned object has a 'then' function.");
        assert.strictEqual(typeof oResult.fail, "function", "The returned object has a 'fail' function.");
        assert.strictEqual(typeof oResult.done, "function", "The returned object has a 'done' function.");

        oResult.always(fnDone);
    });

    QUnit.test("Logs error messages if setPersData throws an error", function (assert) {
        // Arrange
        var oError = {
            name: "!ErrorName!",
            message: "!ErrorMessage!"
        };
        var fnDone = assert.async();
        this.oSetPersDataStub.throws(oError);

        // Act
        this.oController.writeToPersonalization()
            .catch(function () {
                // Assert
                assert.strictEqual(this.oLogErrorStub.callCount, 2, "The function Log.error has been called twice.");
                assert.strictEqual(this.oLogErrorStub.firstCall.args[0], "Personalization service does not work:", "The function Log.error has been called with the correct parameter.");
                assert.strictEqual(this.oLogErrorStub.secondCall.args[0], "!ErrorName!: !ErrorMessage!", "The function Log.error has been called with the correct parameter.");
            }.bind(this))
            .always(fnDone);
    });

    QUnit.module("The getPersonalizer function", {
        beforeEach: function (assert) {
            this.oGetServiceAsyncStub = sandbox.stub(Container, "getServiceAsync");

            this.oGetComponentStub = sandbox.stub(Component, "getOwnerComponentFor");
            this.oGetComponentStub.returns("SomeComponentInstance");

            this.oGetPersonalizerStub = sandbox.stub();

            this.oPersonalizationService = {
                constants: {
                    keyCategory: {
                        FIXED_KEY: "FIXED_KEY"
                    },
                    writeFrequency: {
                        LOW: "LOW"
                    }
                },
                getPersonalizer: this.oGetPersonalizerStub
            };

            this.oGetServiceAsyncStub.withArgs("Personalization").resolves(this.oPersonalizationService);

            return Controller.create({
                name: "sap/ushell/components/shell/Settings/appearance/Appearance"
            }).then(function (oController) {
                this.oController = oController;
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            this.oController = null;

            this.oGetComponentStub.restore();
            this.oGetComponentStub = null;
            sandbox.restore();
        }
    });

    QUnit.test("Returns an already existing Personalizer instance with matching container and item ID", function (assert) {
        // Arrange
        var oPersonalizer = {};
        this.oController.oPersonalizers = {
            "some.container.ID-some.item.ID": oPersonalizer
        };

        // Act
        return this.oController.getPersonalizer("some.container.ID", "some.item.ID")
            .then(function (oResult) {
                // Assert
                assert.strictEqual(oResult, oPersonalizer, "The correct object reference has been returned.");
            });
    });

    QUnit.test("Returns the result of the getPersonalizer function call if no Personalizer exists yet", function (assert) {
        // Arrange
        this.oController.oPersonalizers = {};
        var oPersonalizer = {};
        this.oGetPersonalizerStub.returns(oPersonalizer);

        // Act
        return this.oController.getPersonalizer("some.container.ID", "some.item.ID")
            .then(function (oResult) {
                // Assert
                assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "The function getPersonalizer has been called once.");
                assert.deepEqual(this.oGetPersonalizerStub.firstCall.args[0], {
                    container: "some.container.ID",
                    item: "some.item.ID"
                }, "The function getPersonalizer has been called with the correct 1st parameter.");
                assert.deepEqual(this.oGetPersonalizerStub.firstCall.args[1], {
                    keyCategory: "FIXED_KEY",
                    writeFrequency: "LOW",
                    clientStorageAllowed: true
                }, "The function getPersonalizer has been called with the correct 2nd parameter.");
                assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[2], "SomeComponentInstance", "The function getPersonalizer has been called with the correct 3rd parameter.");
                assert.strictEqual(oResult, oPersonalizer, "The correct object reference has been returned.");
            }.bind(this));
    });

    QUnit.test("Stores the Personalizer instance in an internal map", function (assert) {
        // Arrange
        this.oController.oPersonalizers = {};
        var oPersonalizer = {};
        this.oGetPersonalizerStub.returns(oPersonalizer);

        // Act
        return this.oController.getPersonalizer("some.container.ID", "some.item.ID")
            .then(function () {
                // Assert
                assert.strictEqual(this.oController.oPersonalizers["some.container.ID-some.item.ID"], oPersonalizer, "The correct object reference has been stored.");
            }.bind(this));
    });

    QUnit.module("onSaveShowContentProviderInfoOnVisualizations", {
        beforeEach: function (assert) {
            this.oJQueryPromise = {
                done: sandbox.stub().callsFake(function (func) { func(); return this.oJQueryPromise; }.bind(this)),
                fail: sandbox.stub()
            };
            this.oContext = {
                getView: sandbox.stub().returns({
                    getModel: sandbox.stub().returns({
                        getProperty: sandbox.stub().callsFake(function () {
                            return this.bCurrentValue; // defined in each test
                        }.bind(this))
                    })
                }),
                writeToPersonalization: sandbox.stub().returns(this.oJQueryPromise)
            };
        },
        afterEach: function (assert) {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("resolves without error with unchanged value", function (assert) {
        // Arrange
        this.bOldValue = "some current value";
        this.bCurrentValue = this.bOldValue;
        Config.emit("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", this.bOldValue);
        this.oConfigEmitSpy = sandbox.spy(Config, "emit");

        // Act
        return AppearanceController.prototype.onSaveShowContentProviderInfoOnVisualizations.call(this.oContext).then(function () {
            // Assert
            assert.strictEqual(this.oConfigEmitSpy.callCount, 0, '"Config.emit()" was not called');
            assert.strictEqual(
                Config.last("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations"),
                this.bOldValue,
                '"Config.last()" returned the expected value');
        }.bind(this));
    });

    QUnit.test("resolves without error with changed value", function (assert) {
        // Arrange
        this.bOldValue = "some old value";
        this.bCurrentValue = "some current value";
        Config.emit("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", this.bOldValue);
        this.oConfigEmitSpy = sandbox.spy(Config, "emit");

        // Act
        return AppearanceController.prototype.onSaveShowContentProviderInfoOnVisualizations.call(this.oContext).then(function () {
            // Assert
            assert.strictEqual(this.oConfigEmitSpy.callCount, 1, '"Config.emit()" was called once');
            assert.strictEqual(
                Config.last("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations"),
                this.bCurrentValue,
                '"Config.last()" returned the expected value');
        }.bind(this));
    });

    QUnit.test("rejects with error", function (assert) {
        // Arrange
        this.bOldValue = "some old value";
        this.bCurrentValue = "some current value";
        Config.emit("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations", this.bOldValue);
        this.oConfigEmitSpy = sandbox.spy(Config, "emit");
        this.parsedErrorInformation = {
            message: { value: "value" },
            innererror: "innererror",
            httpStatus: "httpStatus"
        };
        this.oJQueryPromise.fail.callsFake(function (func) {
            func("sErrorMessage", this.parsedErrorInformation);
            return this.oJQueryPromise;
        }.bind(this));
        this.oLogErrorSpy = sandbox.spy(Log, "error");

        // Act
        return AppearanceController.prototype.onSaveShowContentProviderInfoOnVisualizations.call(this.oContext).then(function () {
            // Assert
            assert.strictEqual(
                Config.last("/core/contentProviders/providerInfo/showContentProviderInfoOnVisualizations"),
                this.bCurrentValue,
                '"Config.last()" returned the expected value');
            assert.strictEqual(this.oLogErrorSpy.callCount, 1, '"Log.error()" was called once');
            assert.strictEqual(this.oLogErrorSpy.args[0][1], "sErrorMessage", '"Log.error()" was called with the expected argument');
        }.bind(this));
    });
});
