// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/base/i18n/Formatting",
    "sap/base/util/ObjectPath",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/shell/Settings/userLanguageRegion/UserLanguageRegionEntry",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/base/i18n/date/CalendarWeekNumbering",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/Container"
], function (
    Log,
    Formatting,
    ObjectPath,
    DateFormat,
    JSONModel,
    UserLanguageRegionEntry,
    Config,
    ushellResources,
    CalendarWeekNumbering,
    jQuery,
    Container
) {
    "use strict";

    /* global QUnit, sinon */

    var sandbox = sinon.createSandbox();

    QUnit.module("UserLanguageRegion", {
        beforeEach: function () {
            this.oSetSizeLimitSpy = sandbox.spy(JSONModel.prototype, "setSizeLimit");

            this.oUser = {
                getLanguage: sandbox.stub(),
                getLanguageText: sandbox.stub(),
                getTimeZone: sandbox.stub(),
                isLanguagePersonalized: sandbox.stub(),
                setLanguage: sandbox.spy(),
                resetChangedProperty: sandbox.spy(),
                setChangedProperties: sandbox.stub(),
                getEditState: sandbox.stub()
            };

            this.oShellConfig = {
                enableSetLanguage: false
            };

            this.oUserInfoService = {
                getLanguageList: sandbox.stub(),
                updateUserPreferences: sandbox.stub().resolves(),
                getUserSettingListEditSupported: sandbox.stub(),
                getUserSettingList: sandbox.stub(),
                getCalendarWeekNumbering: sandbox.stub()
            };

            sandbox.stub(Container, "getServiceAsync").resolves(this.oUserInfoService);
            sandbox.stub(Container, "getUser").returns(this.oUser);
            sandbox.stub(Container, "getRendererInternal").returns({
                getShellConfig: sandbox.stub().returns(this.oShellConfig)
            });

            this.fnLogWarningSpy = sandbox.spy(Log, "warning");
            this.fnLogErrorSpy = sandbox.spy(Log, "error");
            this.setCalendarWeekNumbering = sandbox.spy(Formatting, "setCalendarWeekNumbering");
        },
        afterEach: function () {
            Config._reset();
            sandbox.restore();
        }
    });

    QUnit.test("Check contract properties", function (assert) {
        // Arrange

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        // Assert
        assert.equal(oContract.id, "language", "id is correct");
        assert.equal(oContract.entryHelpID, "language", "entryHelpID is correct");
        assert.equal(oContract.title, ushellResources.i18n.getText("languageAndRegionTit"), "title is correct");
        assert.equal(oContract.valueResult, null, "valueResult is null");
        assert.equal(oContract.contentResult, null, "contentResult is null");
        assert.equal(oContract.icon, "sap-icon://globe", "icon is correct");

        assert.equal(typeof oContract.valueArgument, "function", "valueArgument is function");
        assert.equal(typeof oContract.contentFunc, "function", "contentFunc is function");
        assert.equal(typeof oContract.onSave, "function", "onSave is function");
        assert.equal(typeof oContract.onCancel, "function", "onCancel is function");
    });

    QUnit.test("valueArgument: return correct value for american english", function (assert) {
        // Arrange
        this.oUser.getLanguageText.returns("English");
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.valueArgument().then(function (sResult) {
            // Assert
            var sExpectedResult = "English";
            assert.equal(sResult, sExpectedResult, "The correct value is returned");
        });
    });

    QUnit.test("valueArgument: return correct value for british english", function (assert) {
        // Arrange
        this.oUser.getLanguageText.returns("English-British");
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.valueArgument().then(function (sResult) {
            // Assert
            var sExpectedResult = "English (British)";
            assert.equal(sResult, sExpectedResult, "The correct value is returned");
        });
    });

    QUnit.test("contentFunc: create view when enableSetLanguage is false", function (assert) {
        // Arrange
        var oExpectedModel = {
            languageList: null,
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            cuaFlags: {
                dateFormat: true,
                numberFormat: true,
                preferredLogonLanguage: true,
                showWarning: false,
                timeFormat: true,
                timeZone: true
            },
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isTimeZoneFromServerInUI5: false,
            isLanguagePersonalized: true,
            isEnableSetLanguage: false,
            isEnableUserProfileSetting: false,
            CalendarWeekNumberingList: null,
            selectedCalendarWeekNumbering: "Default",
            selectedNumberFormat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpectedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpectedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpectedModel.isLanguagePersonalized);
        this.oUserInfoService.getUserSettingListEditSupported.returns(oExpectedModel.isEnableUserProfileSetting);

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpectedModel, "The correct model is set");

            var aFormItems = oView.byId("languageForm").getContent();
            //Language field
            assert.equal(aFormItems.length, 20, "all content was added");
            assert.ok(aFormItems[0].isA("sap.m.Label"), "The  Label control for Language Field");
            assert.ok(aFormItems[1].isA("sap.m.Text"), "The  Text control for Language Field");

            assert.ok(aFormItems[2].isA("sap.m.Label"), "The Label control for Language Field");
            assert.ok(aFormItems[3].isA("sap.m.ComboBox"), "The ComboBox control for Language Field");

            //Date Format field
            assert.ok(aFormItems[4].isA("sap.m.Label"), "the Label control for DateFormat Field");
            assert.ok(aFormItems[5].isA("sap.m.Text"), "the Text control for DateFormat Field");
            assert.ok(aFormItems[6].isA("sap.m.Label"), "the Label control for DateFormat Field");
            assert.ok(aFormItems[7].isA("sap.m.Select"), "the Select control for DateFormat Field");

            //Week Numbering field
            assert.ok(aFormItems[8].isA("sap.m.Label"), "The  Label control for Week Numbering Field");
            assert.ok(aFormItems[9].isA("sap.m.Select"), "The  Text control for Week Numbering Field");

            //Time Zone field
            assert.ok(aFormItems[10].isA("sap.m.Label"), "the Label control for TimeZone Field");
            assert.ok(aFormItems[11].isA("sap.m.ComboBox"), "the ComboBox control for TimeZone Field");

            //Time Zone Iana field
            assert.ok(aFormItems[12].isA("sap.m.Label"), "the Label control for TimeZoneIana Field");
            assert.ok(aFormItems[13].isA("sap.m.Text"), "the Text control for TimeZoneIana Field");

            //Time Format field
            assert.ok(aFormItems[14].isA("sap.m.Label"), "the Label control for TimeFormat Field");
            assert.ok(aFormItems[15].isA("sap.m.SegmentedButton"), "the SegmentedButton control for TimeFormat Field");
            assert.ok(aFormItems[16].isA("sap.m.Label"), "the Label control for TimeFormat Field");
            assert.ok(aFormItems[17].isA("sap.m.Select"), "the Select control for TimeFormat Field");

            //Decimal Format field
            assert.ok(aFormItems[18].isA("sap.m.Label"), "the Label control for DecimalFormat Field");
            assert.ok(aFormItems[19].isA("sap.m.Select"), "the Select control for DecimalFormat Field");

            assert.ok(this.oUserInfoService.getLanguageList.notCalled, "getLanguageList not called");
            assert.ok(this.oUserInfoService.getUserSettingListEditSupported.calledOnce, "getUserSettingListEditSupported called once");
            assert.strictEqual(this.oSetSizeLimitSpy.getCall(0).args[0], 1000, "setSizeLimit was called with correct limit");

            oView.destroy();
        }.bind(this));
    });

    QUnit.test("contentFunc: create view when enableSetLanguage is true", function (assert) {
        // Arrange
        this.oShellConfig.enableSetLanguage = true;
        var oExpectedModel = {
            languageList: [
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ],
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            cuaFlags: {
                dateFormat: true,
                numberFormat: true,
                preferredLogonLanguage: true,
                showWarning: false,
                timeFormat: true,
                timeZone: true
            },
            isEnableUserProfileSetting: false,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isTimeZoneFromServerInUI5: false,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            CalendarWeekNumberingList: null,
            selectedCalendarWeekNumbering: "Default",
            selectedNumberFormat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpectedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpectedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpectedModel.isLanguagePersonalized);
        this.oUserInfoService.getUserSettingListEditSupported.returns(oExpectedModel.isEnableUserProfileSetting);

        this.oUserInfoService.getLanguageList.returns(new jQuery.Deferred().resolve(oExpectedModel.languageList).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpectedModel, "The correct model is set");

            assert.ok(this.oUserInfoService.getLanguageList.calledOnce, "getLanguageList was called once");

            oView.destroy();
        }.bind(this));
    });

    QUnit.test("CUA flags: create view when Central User Administration disables personalization", function (assert) {
        // Arrange
        this.oShellConfig.enableSetLanguage = true;
        var oExpectedModel = {
            languageList: [
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ],
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            cuaFlags: {
                dateFormat: false,
                numberFormat: false,
                preferredLogonLanguage: false,
                showWarning: true,
                timeFormat: false,
                timeZone: false
            },
            isEnableUserProfileSetting: false,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isTimeZoneFromServerInUI5: false,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            CalendarWeekNumberingList: null,
            selectedCalendarWeekNumbering: "Default",
            selectedNumberFormat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };

        this.oUser.getEditState.returns(1); // CUA sets read_only to related fields

        this.oUser.getLanguage.returns(oExpectedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpectedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpectedModel.isLanguagePersonalized);
        this.oUserInfoService.getUserSettingListEditSupported.returns(oExpectedModel.isEnableUserProfileSetting);

        this.oUserInfoService.getLanguageList.returns(new jQuery.Deferred().resolve(oExpectedModel.languageList).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getProperty("/cuaFlags"), oExpectedModel.cuaFlags, "The correct CUA flags are set in the model");

            assert.ok(this.oUserInfoService.getLanguageList.calledOnce, "getLanguageList was called once");

            oView.destroy();
        }.bind(this));
    });

    QUnit.test("contentFunc: create view when isEnableUserProfileSetting is true", function (assert) {
        // Arrange
        this.oShellConfig.enableSetLanguage = true;
        var oExpectedModel = {
            languageList: [
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ],
            DateFormatList: [{ value: "YYYY-MM-DD", description: "A" }],
            NumberFormatList: [{ value: "1,00,000.00", description: "A" }],
            TimeFormatList: [{ value: "12h", description: "A" }],
            TimeZoneList: [{ value: "CET + 1", description: "ABC" }, { value: "CET + 2", description: "B" }],
            cuaFlags: {
                dateFormat: true,
                numberFormat: true,
                preferredLogonLanguage: true,
                showWarning: false,
                timeFormat: true,
                timeZone: true
            },
            isEnableUserProfileSetting: true,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: undefined,
            selectedTimeFormat: undefined,
            isSettingsLoaded: true,
            isTimeZoneFromServerInUI5: false,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            CalendarWeekNumberingList: null,
            selectedCalendarWeekNumbering: "Default",
            selectedNumberFormat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpectedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpectedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpectedModel.isLanguagePersonalized);
        this.oUserInfoService.getUserSettingListEditSupported.returns(oExpectedModel.isEnableUserProfileSetting);
        this.oUserInfoService.getLanguageList.returns(new jQuery.Deferred().resolve(oExpectedModel.languageList).promise());

        sandbox.stub(DateFormat, "getDateTimeWithTimezoneInstance").returns({
            format: function (dummy, description) {
                var result = (description === "A") ? "ABC" : "";
                return (dummy === null) ? result : "error";
            }
        });

        var ExpectedUserSettings = {
            TIME_FORMAT: [{ value: "12h", description: "A" }],
            DATE_FORMAT: [{ value: "YYYY-MM-DD", description: "A" }],
            TIME_ZONE: [{ value: "CET + 1", description: "A" }, { value: "CET + 2", description: "B" }],
            NUMBER_FORMAT: [{ value: "1,00,000.00", description: "A" }]
        };
        this.oUserInfoService.getUserSettingList.returns(new jQuery.Deferred().resolve(ExpectedUserSettings).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpectedModel, "The correct model is set");

            assert.ok(this.oUserInfoService.getUserSettingList.calledOnce, "getLanguageList was called once");

            oView.destroy();
        }.bind(this));
    });

    QUnit.test("contentFunc: create view when isEnableUserProfileSetting is true and reject getLanguageList", function (assert) {
        // Arrange
        this.oShellConfig.enableSetLanguage = true;
        var oExpectedModel = {
            languageList: null,
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            cuaFlags: {
                dateFormat: true,
                numberFormat: true,
                preferredLogonLanguage: true,
                showWarning: false,
                timeFormat: true,
                timeZone: true
            },
            isEnableUserProfileSetting: false,
            selectedLanguage: "EN",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isTimeZoneFromServerInUI5: false,
            isLanguagePersonalized: true,
            isEnableSetLanguage: true,
            CalendarWeekNumberingList: null,
            selectedCalendarWeekNumbering: "Default",
            selectedNumberFormat: undefined,
            selectedTimeZone: undefined
        };
        var oExpectedView = {
            id: "languageRegionSelector",
            viewName: "sap.ushell.components.shell.Settings.userLanguageRegion.LanguageRegionSelector"
        };
        this.oUser.getLanguage.returns(oExpectedModel.selectedLanguage);
        this.oUser.getLanguageText.returns(oExpectedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpectedModel.isLanguagePersonalized);
        this.oUserInfoService.getUserSettingListEditSupported.returns(oExpectedModel.isEnableUserProfileSetting);
        this.oUserInfoService.getLanguageList.returns(new jQuery.Deferred().reject().promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.equal(oView.getId(), oExpectedView.id, "view has correct id");
            assert.equal(oView.getViewName(), oExpectedView.viewName, "view has correct viewName");
            assert.deepEqual(oView.getModel().getData(), oExpectedModel, "The correct model is set");

            assert.ok(this.oUserInfoService.getLanguageList.calledOnce, "getLanguageList was called once");
            assert.ok(this.fnLogErrorSpy.calledOnce, "log.error called once");
            oView.destroy();
        }.bind(this));
    });

    QUnit.test("contentFunc: create view when isTimeZoneFromServerInUI5 is false", function (assert) {
        // Arrange
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.strictEqual(oView.getModel().getProperty("/isTimeZoneFromServerInUI5"), false, "/isTimeZoneFromServerInUI5 set to true");
            oView.destroy();
        });
    });

    QUnit.test("contentFunc: create view when isTimeZoneFromServerInUI5 is true", function (assert) {
        // Arrange
        var oConfigStub = sinon.stub(Config, "last");
        oConfigStub.returns(true);
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.strictEqual(oView.getModel().getProperty("/isTimeZoneFromServerInUI5"), true, "/isTimeZoneFromServerInUI5 set to true");
            oView.destroy();
            oConfigStub.restore();
        });
    });

    QUnit.test("contentFunc: set default language", function (assert) {
        // Arrange
        this.oShellConfig.enableSetLanguage = true;
        var oExpectedModel = {
            languageList: [
                { key: "default", text: "Browser Language" },
                { key: "DE", text: "Deutsch" }
            ],
            selectedLanguage: "default",
            selectedLanguageText: "English",
            selectedDatePattern: "MMM d, y",
            selectedTimeFormat: "12h",
            isSettingsLoaded: true,
            isTimeZoneFromServerInUI5: false,
            isLanguagePersonalized: false,
            isEnableSetLanguage: true,
            DateFormatList: null,
            NumberFormatList: null,
            TimeFormatList: null,
            TimeZoneList: null,
            cuaFlags: {
                dateFormat: true,
                numberFormat: true,
                preferredLogonLanguage: true,
                showWarning: false,
                timeFormat: true,
                timeZone: true
            },
            CalendarWeekNumberingList: null,
            selectedCalendarWeekNumbering: "Default",
            selectedNumberFormat: undefined,
            selectedTimeZone: undefined,
            isEnableUserProfileSetting: undefined
        };

        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns(oExpectedModel.selectedLanguageText);
        this.oUser.isLanguagePersonalized.returns(oExpectedModel.isLanguagePersonalized);
        this.oUserInfoService.getLanguageList.returns(new jQuery.Deferred().resolve(oExpectedModel.languageList).promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            // Assert
            assert.ok(oView, "View was created");
            assert.deepEqual(oView.getModel().getData(), oExpectedModel, "The correct model is set");

            assert.ok(this.oUserInfoService.getLanguageList.calledOnce, "getLanguageList was called once");

            oView.destroy();
        }.bind(this));
    });

    QUnit.test("contentFunc: Sets the trimmed numberFormat", function (assert) {
        // Arrange
        this.oUserInfoService.getUserSettingListEditSupported.returns(true);
        this.oUserInfoService.getUserSettingList.returns(new jQuery.Deferred().resolve([]).promise());

        sandbox.stub(Formatting, "getABAPNumberFormat").returns(" ");
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            assert.strictEqual(oView.getModel().getProperty("/selectedNumberFormat"), "");
            oView.destroy();
        });
    });


    QUnit.test("onSave: resolve promise when view not created", function (assert) {
        // Arrange
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.onSave().then(function () {
            // Assert
            assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved when no view");
        });
    });

    QUnit.test("onSave: resolve when enableSetLanguage is false", function (assert) {
        // Arrange
        var oViewInstance;

        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(true);
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.notCalled, "language should not be changed");
            assert.ok(this.oUserInfoService.updateUserPreferences.notCalled, "language should not be changed");
            assert.equal(oResult, undefined, "no result is returned: no FLP refresh, `user-context` cookie not to be cleared");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        });
    });

    QUnit.test("onSave: resolve when no changes", function (assert) {
        // Arrange
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(true);
        this.oUserInfoService.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ]).promise()
        );
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            return oContract.onSave();
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.notCalled, "language should not be changed");
            assert.ok(this.oUserInfoService.updateUserPreferences.notCalled, "language should not be changed");
            assert.equal(oResult, undefined, "no result is returned: no FLP refresh, `user-context` cookie not to be cleared");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        });
    });

    QUnit.test("onSave: resolve when call service", function (assert) {
        // Arrange
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoService.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                { key: "default", text: "Browser Language" },
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ]).promise()
        );
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave(this.oUserInfoService.updateUserPreferences);
        }.bind(this)).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.calledOnce, "language should be changed");
            assert.ok(this.oUser.resetChangedProperty.callCount, 5, "all change properties shall be reset");
            assert.ok(this.oUserInfoService.updateUserPreferences.calledOnce, "language should be changed");
            assert.deepEqual(oResult, { refresh: true, clearSapUserContextCookie: true, obsoleteUrlParams: ["sap-language"] },
                "FLP should be refreshed, `sap-usercontext` cookie to be cleared, `sap-language` URL parameter is obsolete");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        });
    });



    QUnit.test("onSave: remove sap-language in query string", function (assert) {
        // Arrange
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoService.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                { key: "default", text: "Browser Language" },
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ]).promise()
        );
        var fnUpdateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(new jQuery.Deferred().resolve().promise());

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave(fnUpdateUserPreferences);
        }).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setLanguage.calledOnce, "language should be changed");
            assert.ok(this.oUser.resetChangedProperty.callCount, 5, "all change properties shall be reset");
            assert.deepEqual(oResult, { refresh: true, clearSapUserContextCookie: true, obsoleteUrlParams: ["sap-language"] },
                "FLP should be refreshed, `sap-usercontext` cookie to be cleared, `sap-language` URL parameter is obsolete");
            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        });
    });

    QUnit.test("onSave: reject when service is with language error", function (assert) {
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoService.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                { key: "default", text: "Browser Language" },
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ]).promise()
        );
        var fnUpdateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(new jQuery.Deferred().reject("LANGUAGE").promise());
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave(fnUpdateUserPreferences);
        }).then(function (oResult) {
            // Assert
            assert.ok(false, "The promise should be rejected");
            oViewInstance.destroy();
        }, function () {
            assert.ok(true, "The promise should be rejected");
            assert.ok(this.oUser.setLanguage.called, 0, "setLanguage should not be called");
            assert.ok(this.fnLogErrorSpy.calledOnce, "the error message should be logged");
            oViewInstance.destroy();
        }.bind(this));
    });

    QUnit.test("onSave: resolve when service is with other property error", function (assert) {
        var oViewInstance;
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoService.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                { key: "default", text: "Browser Language" },
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ]).promise()
        );
        var fnUpdateUserPreferences = this.oUserInfoService.updateUserPreferences.returns(Promise.reject("other property"));
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedLanguage", "DE");
            return oContract.onSave(fnUpdateUserPreferences);
        }).then(function (oResult) {
            // Assert
            assert.ok(true, "The promise should be resolved");
            assert.deepEqual(oResult, { refresh: true, clearSapUserContextCookie: true, obsoleteUrlParams: ["sap-language"] },
                "FLP should be refreshed, `sap-usercontext` cookie to be cleared, `sap-language` URL parameter is obsolete");
            oViewInstance.destroy();
        }, function (xxx) {
            assert.ok(false, "The promise should be resolved");
            assert.equal(xxx, "");
            oViewInstance.destroy();
        });
    });

    QUnit.test("onCancel: resolve promise when view was not created", function (assert) {
        // Arrange
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        oContract.onCancel();
        // Assert
        assert.ok(this.fnLogWarningSpy.calledOnce, "the warning was logged");
    });

    QUnit.test("onCancel: call the onCancel from controller", function (assert) {
        // Arrange
        this.oShellConfig.enableSetLanguage = true;
        this.oUser.getLanguage.returns("EN");
        this.oUser.getLanguageText.returns("English");
        this.oUser.isLanguagePersonalized.returns(false);
        this.oUserInfoService.getLanguageList.returns(
            new jQuery.Deferred().resolve([
                { key: "default", text: "Browser Language" },
                { key: "EN", text: "English" },
                { key: "DE", text: "Deutsch" }
            ]).promise()
        );
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oView.getModel().setProperty("/selectedLanguage", "DE");
            oContract.onCancel();
            // Assert
            assert.equal(oView.getModel().getProperty("/selectedLanguage"), "default", "the language was reset");
            oView.destroy();
        });
    });
    QUnit.test("onCancel: cancel the calendar numbering", function (assert) {
        // Arrange
        this.oUserInfoService.getUserSettingListEditSupported.returns(true);
        this.oUserInfoService.getUserSettingList.returns(
            new jQuery.Deferred().resolve([
                { CALENDAR_WEEK: "true" }
            ])
        );
        var aDefaultNumbering =
            [{
                value: CalendarWeekNumbering.ISO_8601,
                selected: false
            }, {
                value: CalendarWeekNumbering.Default,
                selected: true
            }];
        this.oUserInfoService.getCalendarWeekNumbering.returns(aDefaultNumbering);

        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            var oModel = oView.getModel();
            oModel.setProperty("/selectedCalendarWeekNumbering", CalendarWeekNumbering.ISO_8601);
            oModel.setProperty(
                "/CalendarWeekNumberingList",
                [{
                    value: CalendarWeekNumbering.ISO_8601,
                    selected: true
                }, {
                    value: CalendarWeekNumbering.Default,
                    selected: false
                }]
            );
            oContract.onCancel();
            // Assert
            assert.deepEqual(
                oView.getModel().getProperty("/CalendarWeekNumberingList"),
                aDefaultNumbering,
                "the numbering was reset");
            oView.destroy();
        });
    });

    QUnit.test("onSave: resolve when save calendar week numbering", function (assert) {
        // Arrange
        var oViewInstance;
        this.oUserInfoService.getUserSettingListEditSupported.returns(true);
        this.oUserInfoService.getUserSettingList.returns(
            new jQuery.Deferred().resolve([
                { CALENDAR_WEEK: "true" }
            ])
        );
        // Act
        var oContract = UserLanguageRegionEntry.getEntry();
        return oContract.contentFunc().then(function (oView) {
            oViewInstance = oView;
            oView.getModel().setProperty("/selectedCalendarWeekNumbering", CalendarWeekNumbering.ISO_8601);
            return oContract.onSave(this.oUserInfoService.updateUserPreferences);
        }.bind(this)).then(function (oResult) {
            // Assert
            assert.ok(this.oUser.setChangedProperties.calledOnce, "user was updated");
            assert.ok(this.setCalendarWeekNumbering.called, "ui5 was updated");
            assert.equal(this.oUser.resetChangedProperty.callCount, 5, "all change properties shall be reset");
            assert.ok(this.oUserInfoService.updateUserPreferences.calledOnce, "updateUserPreferences was called");
            assert.deepEqual(oResult, { refresh: true }, "FLP should be refreshed, `sap-usercontext` cookie not to be cleared, no obsolete URL parameters");

            oViewInstance.destroy();
        }.bind(this), function () {
            assert.ok(false, "The promise should be resolved");
            oViewInstance.destroy();
        });
    });
});
