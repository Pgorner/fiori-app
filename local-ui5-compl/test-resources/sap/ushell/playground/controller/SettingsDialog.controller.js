// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/Label",
    "sap/m/Switch",
    "sap/m/Input",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/Config",
    "sap/ushell/EventHub",
    "sap/ushell/components/shell/Settings/Component",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container",
    "sap/ushell/services/PersonalizationV2/constants"
], function (
    Label,
    Switch,
    Input,
    SimpleForm,
    JSONModel,
    BaseController,
    Config,
    EventHub,
    SettingsComponent,
    jQuery,
    Container,
    PersonalizationV2Constants
) {
    "use strict";

    /* global sinon */
    const sandbox = sinon.createSandbox({});

    var oModel;
    var notificationsMockData;

    var oUserConfig = {
        language: "EN",
        languageText: "English",
        isLanguagePersonalized: true
    };

    return BaseController.extend("sap.ushell.playground.controller.SettingsDialog", {

        prepareMocks: function () {
            sandbox.restore(); // prepareMocks might be called multiple times

            const oUser = {
                getFullName: function () {
                    return "John Smith";
                },
                getEmail: function () {
                    return "john.smith@sap.com";
                },
                isLanguagePersonalized: function () {
                    return oUserConfig.isLanguagePersonalized;
                },
                getLanguage: function () {
                    return oUserConfig.language;
                },
                getLanguageText: function () {
                    return oUserConfig.languageText;
                },
                getImage: function () {
                    return oModel.getProperty("/image");
                },
                getImageConsent: function () {
                    return oModel.getProperty("/enableUserImgConsent");
                },
                getTheme: function () {
                    return "sap_horizon";
                },
                isSetThemePermitted: function () {
                    return true;
                },
                getContentDensity: function () {
                    return "cozy";
                },
                getTimeZone: function () { },
                setTheme: function () { },
                setContentDensity: function () { },
                setImageConsent: function () { },
                setLanguage: function (sLanguage) {
                    oUserConfig.language = sLanguage;
                },
                attachOnSetImage: function () { },
                setChangedProperties: function () { },
                resetChangedProperty: function () { },
                resetChangedProperties: function () { },
                getTrackUsageAnalytics: function () {
                    return false;
                }
            };

            sandbox.stub(Container, "getUser").returns(oUser);

            sandbox.stub(Container, "getServiceAsync");

            Container.getServiceAsync.withArgs("ClientSideTargetResolution").resolves({
                getSystemContext: async function () {
                    return { id: "SomeSystem" };
                }
            });

            Container.getServiceAsync.withArgs("UserDefaultParameters").resolves({
                editorGetParameters: async function () {
                    return {
                        UShellSampleCompanyCode: {
                            valueObject: {
                                _shellData: {
                                    storeDate: "Thu Dec 05 2019 09:57:05 GMT+0100 (Central European Standard Time)"
                                }
                            }
                        },
                        UShellSampleCostCenter: {
                            valueObject: {
                                _shellData: {
                                    storeDate: "Thu Dec 05 2019 09:57:05 GMT+0100 (Central European Standard Time)"
                                }
                            },
                            editorMetadata: {
                                extendedUsage: true
                            }
                        }
                    };
                },
                hasRelevantMaintainableParameters: async function () {
                    return true;
                }
            });

            Container.getServiceAsync.withArgs("UserInfo").resolves({
                getUser: function () {
                    return oUser;
                },
                updateUserPreferences: function () {
                    var deferred = new jQuery.Deferred();
                    deferred.resolve();
                    return deferred.promise();
                },
                getThemeList: function () {
                    var oDeferred = new jQuery.Deferred();
                    oDeferred.resolve({
                        options: [
                            { id: "sap_horizon", name: "SAP Morning Horizon" },
                            { id: "sap_horizon_dark", name: "SAP Evening Horizon" },
                            { id: "z_cola", name: "Custom Cola Theme" },
                            { id: "sap_horizon_hcb", name: "SAP HCB (SAP Horizon)" },
                            { id: "sap_horizon_hcw", name: "SAP HCW (SAP Horizon)" }
                        ]
                    });
                    return oDeferred.promise();
                },
                getLanguageList: function () {
                    var oDeferred = new jQuery.Deferred();
                    oDeferred.resolve([]);
                    return oDeferred.promise();
                },
                getUserSettingListEditSupported: function () {
                    return false;
                }
            });

            Container.getServiceAsync.withArgs("PersonalizationV2").resolves({
                constants: PersonalizationV2Constants,
                KeyCategory: PersonalizationV2Constants.keyCategory,
                WriteFrequency: PersonalizationV2Constants.writeFrequency,
                getPersonalizer: async function () {
                    return {
                        getPersData: async function () {},
                        setPersData: async function () {}
                    };
                }
            });

            Container.getServiceAsync.withArgs("NotificationsV2").resolves({
                _getNotificationSettingsAvailability: async function () {
                    return { settingsAvailable: true };
                },
                readSettings: async function () {
                    return notificationsMockData;
                },
                saveSettingsEntry: async function () {},
                setUserSettingsFlags: async function () {},
                getUserSettingsFlags: async function () {
                    return { highPriorityBannerEnabled: true };
                },
                _getNotificationSettingsMobileSupport: function () {
                    return true;
                },
                _getNotificationSettingsEmailSupport: function () {
                    return true;
                },
                _userSettingInitialization: function () { }
            });

            Container.getServiceAsync.withArgs("CommonDataModel").resolves({
                getContentProviderIds: async function () {
                    return [""];
                }
            });

            sandbox.stub(Container, "getRendererInternal").returns({
                reorderUserPrefEntries: function (aEntities) {
                    return aEntities;
                },
                getShellConfig: function () {
                    return {
                        enableUserImgConsent: oModel.getProperty("/enableUserImgConsent"),
                        enableSetLanguage: oModel.getProperty("/enableSetLanguage")
                    };
                }
            });

            sandbox.stub(Container, "getLogonSystem").returns({
                getPlatform: function () {
                    return "cdm";
                }
            });

            Config.emit("/core/home/sizeBehaviorConfigurable", true);
            Config.emit("/core/shell/model/setTheme", true);
        },

        restoreMocks: function () {
            sandbox.restore();
        },

        onInit: function () {
            this.prepareMocks();
            oModel = new JSONModel({
                hasImage: true,
                enableUserImgConsent: true,
                enableSetLanguage: true,
                image: "/sap/bc/ui5_demokit/test-resources/sap/ushell/shells/demo/img/283513_SAP.jpg",
                timeoutValueResult: 1000,
                valueResult: "Some value",
                bUseCustomResult: true,
                bCustomResultResolve: true,
                timeoutContentResult: 5000,
                bOnSaveResolve: true,
                timeoutOnSave: 5000
            });
            this.getView().setModel(oModel);
            this.updateImage();
            Config.emit("/core/spaces/configurable", true);
            Config.emit("/core/shell/model/enableNotifications", true);
            Config.emit("/core/shell/model/userDefaultParameters", true);
            //load later when mock container is created
            this.oSettingsInstance = new SettingsComponent();
            this.addDevelopmentTestSettings();
            notificationsMockData = JSON.stringify({
                "@odata.context": "$metadata#NotificationTypePersonalizationSet",
                "@odata.metadataEtag": "W/\"20181109171651\"",
                value: [{
                    NotificationTypeId: "e41d2de5-3d80-1ee8-a2cb-e281635723da",
                    NotificationTypeDesc: "SETTING_ALL_TRUE",
                    PriorityDefault: "HIGH",
                    DoNotDeliver: true,
                    DoNotDeliverMob: true,
                    DoNotDeliverEmail: true,
                    IsEmailEnabled: true,
                    IsEmailIdMaintained: true
                }, {
                    NotificationTypeId: "e41d2de5-3d80-1ed8-a2e8-36c6e5bcb481",
                    NotificationTypeDesc: "SETTING_ALL_FALSE",
                    PriorityDefault: "",
                    DoNotDeliver: false,
                    DoNotDeliverMob: false,
                    DoNotDeliverEmail: false,
                    IsEmailEnabled: false,
                    IsEmailIdMaintained: false
                }]
            });
        },

        openDialog: function (oEvent) {
            EventHub.emit("openUserSettings", { time: Date.now(), controlId: oEvent.getSource().getId() });
        },

        updateImage: function (oEvent) {
            var bHasImage = oModel.getProperty("/hasImage");
            if (bHasImage) {
                Config.emit("/core/shell/model/userImage/personPlaceHolder", oModel.getProperty("/image"));
                Config.emit("/core/shell/model/userImage/account", oModel.getProperty("/image"));
            } else {
                Config.emit("/core/shell/model/userImage/personPlaceHolder", "sap-icon://person-placeholder");
                Config.emit("/core/shell/model/userImage/account", "sap-icon://account");
            }
        },

        recreateComponent: function () {
            this.oSettingsInstance.exit();
            Config.emit("/core/userPreferences/entries", []);
            Config.emit("/core/shell/model/enableNotifications", oModel.getProperty("/notficationsEnabled"));
            EventHub._reset();
            this.oSettingsInstance = new SettingsComponent();
            this.addDevelopmentTestSettings();
        },

        updateDeveloperEntityContent: function () {
            this.addDevelopmentTestSettings(true);
        },

        addDevelopmentTestSettings: function (bReplace) {
            var oEntry = {
                title: "Development Test",
                valueResult: null,
                contentResult: null,
                icon: "sap-icon://source-code",
                valueArgument: function () {
                    var oDfd = jQuery.Deferred();
                    setTimeout(function () {
                        oDfd.resolve(oModel.getProperty("/valueResult"));
                    }, oModel.getProperty("/timeoutValueResult"));
                    return oDfd.promise();
                },
                contentFunc: undefined,
                onSave: function () {
                    var oDfd = jQuery.Deferred();
                    setTimeout(function () {
                        if (oModel.getProperty("/bOnSaveResolve")) {
                            oDfd.resolve();
                        } else {
                            oDfd.reject("Failed Test");
                        }
                    }, oModel.getProperty("/timeoutOnSave"));
                    return oDfd.promise();
                },
                onCancel: function () { }
            };

            if (oModel.getProperty("/bUseCustomResult")) {
                oEntry.contentFunc = function () {
                    var oDfd = jQuery.Deferred();
                    setTimeout(function () {
                        if (oModel.getProperty("/bCustomResultResolve")) {
                            var oForm = new SimpleForm({
                                editable: true,
                                title: "Test different cases"
                            });
                            oForm.addContent(new Label({
                                text: "Should onSave be resolved?"
                            }));
                            oForm.addContent(new Switch({
                                state: "{/bOnSaveResolve}"
                            }));
                            oForm.addContent(new Label({
                                text: "onSave timeout in msec"
                            }));
                            oForm.addContent(new Input({
                                value: "{/timeoutOnSave}"
                            }));
                            oForm.setModel(oModel);
                            oDfd.resolve(oForm);
                            return;
                        }
                        oDfd.reject("Something wrong");
                    }, oModel.getProperty("/timeoutContentResult"));
                    return oDfd.promise();
                };
            }

            var aEntries = Config.last("/core/userPreferences/entries");
            if (bReplace) {
                aEntries.splice(1, 1);
            }
            aEntries.push(oEntry);
            Config.emit("/core/userPreferences/entries", aEntries);
        }
    });
});
