// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.tiles.utils.js
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/Container"
], function (
    Element,
    JSONModel,
    Utils,
    AppConfiguration,
    Container
) {
    "use strict";

    /* global sinon, QUnit */

    const sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.components.tiles.utils");

    QUnit.test("check buildFormFactorsObject()", function (assert) {
        var oModel = {
            modelData: {},
            modelData1: {},

            getProperty: function (val, result) {
                switch (val) {
                    case "/config/appFormFactor":
                        return this.modelData.appFormFactor;
                    case "/config/desktopChecked":
                        return this.modelData.desktop;
                    case "/config/tabletChecked":
                        return this.modelData.tablet;
                    case "/config/phoneChecked":
                        return this.modelData.phone;
                    default:
                        return null;
                }
            }
        };
        //before each test we init the oModel mock and then test it

        oModel.modelData = { appFormFactor: true, desktop: true, tablet: false, phone: true };
        var oResult = Utils.buildFormFactorsObject(oModel);
        assert.equal(oResult.appDefault, true, "Test1.1: buildFormFactorsObject constructed correctly");

        oModel.modelData = { appFormFactor: false, desktop: true, tablet: true, phone: true, defaultParam: true };
        oResult = Utils.buildFormFactorsObject(oModel);
        //Important - in order to make sure we are aligned with the form factor (device types) values as UI5 and backend team for the target resolution logic
        assert.equal(oResult.appDefault, false, "Test1.2: buildFormFactorsString constructed correctly");
        assert.equal(oResult.manual.desktop, true, "Test1.3: buildFormFactorsObject constructed correctly - Desktop");
        assert.equal(oResult.manual.tablet, true, "Test1.4: buildDefaultFormFactorsObject constructed correctly - Tablet");
        assert.equal(oResult.manual.phone, true, "Test1.5: buildDefaultFormFactorsObject constructed correctly - Phone");
        assert.equal(oResult.defaultParam, undefined, "Test1.6: buildDefaultFormFactorsObject constructed correctly - Default setting - that mean that it's not defined ");

        oModel.modelData = { appFormFactor: true, desktop: false, tablet: false, phone: true, defaultParam: true };
        oModel.modelData1 = Utils.getDefaultFormFactors();
        assert.notEqual(oModel.modelData.appFormFactor, oModel.modelData1.appFormFactor, " Test 1.7 : correct, The application form factor should be false for good");
    });

    QUnit.test("check tableHasDuplicateParameterNames()", function (assert) {
        var aNames = [{ name: "first" }, { name: "second" }, { name: "first" }];
        assert.equal(Utils.tableHasDuplicateParameterNames(aNames), true, "Test 2.1: duplication was found as expected");

        aNames = [{ name: "first" }, { name: "second" }, { name: "third" }];
        assert.equal(Utils.tableHasDuplicateParameterNames(aNames), false, "Test 2.2: No duplication was found as expected");

        assert.equal(Utils.tableHasDuplicateParameterNames([]), false, "Test 2.3: No duplication was found as expected");
    });

    //The getMappingSignature input is incremented in the following tests, meaning it is added to the previously used....
    QUnit.test("check getMappingSignatureString() and getOneParamSignature()", function (assert) {
        //test mandatory non reg ex param.
        var row = {
            mandatory: true,
            isRegularExpression: false,
            name: "userID",
            value: "001234",
            defaultValue: ""
        };
        var aTable = [row];
        var sParam = Utils.getMappingSignatureString(aTable, false);
        assert.equal(sParam, "userID=001234", "Test 3.1: params string matches expected pattern");

        //test mandatory and regular expression
        row = {
            mandatory: true,
            isRegularExpression: true,
            name: "password",
            value: "abcd",
            defaultValue: ""
        };
        aTable.push(row);
        sParam = Utils.getMappingSignatureString(aTable, false);
        assert.equal(sParam, "userID=001234&{password=abcd}", "Test 3.2: params string matches expected pattern");

        //test optional parameter
        row = {
            mandatory: false,
            name: "language",
            value: "",
            defaultValue: "English"
        };
        aTable.push(row);
        sParam = Utils.getMappingSignatureString(aTable, false);
        assert.equal(sParam, "userID=001234&{password=abcd}&[language=English]", "Test 3.3: params string matches expected pattern");
        //Test the undefined params
        sParam = Utils.getMappingSignatureString(aTable, true);
        assert.equal(sParam, "userID=001234&{password=abcd}&[language=English]&*=*", "Test 3.4: params string matches expected pattern");
    });

    QUnit.test("check getMappingSignatureTableData() and getOneParamObject()", function (assert) {
        var aParam = Utils.getMappingSignatureTableData("userID=001234&{password=abcd}&[language=English]&*=*");
        var thirdParam = aParam[2];

        assert.equal(thirdParam.name, "language", "Test 4.1: parsed object matches");
        assert.equal(thirdParam.value, "", "Test 4.2: parsed object matches");
        assert.equal(thirdParam.defaultValue, "English", "Test 4.3: parsed object matches");
        assert.equal(thirdParam.mandatory, false, "Test 4.4: parsed object matches");

        var firstParam = aParam[0];
        assert.equal(firstParam.name, "userID", "Test 4.5: parsed object matches");
        assert.equal(firstParam.value, "001234", "Test 4.6: parsed object matches");
        assert.equal(firstParam.defaultValue, "", "Test 4.7: parsed object matches");
        assert.equal(firstParam.mandatory, true, "Test 4.8: parsed object matches");
    });

    QUnit.test("check getAllowUnknownParametersValue()", function (assert) {
        var bAllowedUndefined = Utils.getAllowUnknownParametersValue("userID=001234&{password=abcd}&[language=English]&*=*");
        assert.equal(bAllowedUndefined, true, "Test 5.1: Unknown parameters flag matches expected value");

        bAllowedUndefined = Utils.getAllowUnknownParametersValue("userID=001234&{password=abcd}&[language=English]");
        assert.equal(bAllowedUndefined, false, "Test 5.2: Unknown parameters flag matches expected value");

        //Check empty string
        bAllowedUndefined = Utils.getAllowUnknownParametersValue("");
        assert.equal(bAllowedUndefined, false, "Test 5.3: Unknown parameters flag matches expected value");

        //check *=* in the middle
        bAllowedUndefined = Utils.getAllowUnknownParametersValue("userID=001234&{password=abcd}&*=*&[language=English]");
        assert.equal(bAllowedUndefined, false, "Test 5.4: Unknown parameters flag matches expected value");
    });

    QUnit.test("check checkInput()", function (assert) {
        var configurationView = {};

        function baseItem () {
            this.value = "";
            this.text = "";

            this.setValueState = function (val) {
                this.value = val;
            };
            this.setValueStateText = function (val) {
                this.text = val;
            };
        }

        //Create inherit icon object class
        function icon () { }
        icon.prototype = new baseItem();
        //create instance for testing
        var oIcon = new icon();

        //Create inherit semantic object class
        function soInput () {
            this.aItems = [];
            this.getModel = function () {
                var that = this;
                return {
                    getProperty: function () {
                        return that.aItems;
                    }
                };
            };
        }
        function saInput () {
            this.getValue = function () {
                return "actionTestValue";
            };
        }
        soInput.prototype = new baseItem();
        //create instance for testing
        var oSO = new soInput();
        var oSA = new saInput();

        configurationView.byId = function (val) {
            switch (val) {
                case "iconInput":
                    return oIcon;
                case "navigation_semantic_objectInput":
                    return oSO;
                case "navigation_semantic_actionInput":
                    return oSA;
                case "semantic_objectInput":
                    break;
                case "semantic_actionInput":
                    break;

                default:
                    break;
            }
            return "tester";
        };

        var event = {
            param: "testString",
            testObject: oIcon,

            getParameter: function (val) {
                return this.param;
            },
            getSource: function () {
                return this.testObject;
            }
        };

        //Test Icon
        Utils.checkInput(configurationView, event);
        assert.equal(event.getSource().value, "Error", "Test 7.1: Checkinput set the correct value for icon checks");

        event.param = "sap-icon://sapUIFiori.jpg";
        Utils.checkInput(configurationView, event);
        assert.equal(event.getSource().value, "None", "Test 7.1: Checkinput set the correct value for icon checks");

        //Test Semantic object
        event.testObject = oSO; //currently contains "sap-icon://sapUIFiori.jpg" which is an illegal value for the semantic object
        Utils.checkInput(configurationView, event);
        assert.equal(event.getSource().value, "Error", "Test 7.1: Checkinput set the correct value for semantic object checks");

        event.param = "displayOrder";
        oSO.aItems = [{ obj: "displayOrder" }];

        Utils.checkInput(configurationView, event);
        assert.equal(event.getSource().value, "None", "Test 7.1: Checkinput set the correct value for semantic object checks");
    });

    [{
        description: "createNavigationProviderModel: return all application type for dropdown",
        currentAppType: "SAPUI5",
        expectedTypes: ["SAPUI5", "LPD", "TR", "WDA", "URL"]
    }, {
        description: "createNavigationProviderModel: WCF application type is shown in dropdown if it is current application",
        currentAppType: "WCF",
        expectedTypes: ["SAPUI5", "LPD", "TR", "WDA", "URL", "WCF"]
    }, {
        description: "createNavigationProviderModel: WCF application type is shown in dropdown if it is current application",
        currentAppType: "URLT",
        expectedTypes: ["SAPUI5", "LPD", "TR", "WDA", "URL", "URLT"]
    }].forEach(function (oTestCase) {
        QUnit.test(oTestCase.description, function (assert) {
            var oConfigController = {
                getView: sinon.spy()
            };
            var oTargetTypeSelector = {
                bindItems: sinon.spy(),
                setModel: sinon.spy(),
                getBinding: function () {
                    return {
                        sort: sinon.spy()
                    };
                }
            };

            var oResourceStub = sinon.stub(Utils, "getResourceBundleModel").returns({
                getResourceBundle: function () {
                    return {
                        getText: sinon.spy()
                    };
                }
            });
            var oConfigurationStub = sinon.stub(Utils, "getViewConfiguration").returns({
                navigation_provider: oTestCase.currentAppType
            });

            Utils.createNavigationProviderModel(oConfigController, oTargetTypeSelector);
            assert.ok(oTargetTypeSelector.setModel.calledOnce, "Model should be set");
            var aKeys = oTargetTypeSelector.setModel.getCall(0).args[0].getData().items.map(function (oItem) {
                return oItem.key;
            });
            assert.deepEqual(aKeys, oTestCase.expectedTypes, "The correct application type should be added into the model");

            oResourceStub.restore();
            oConfigurationStub.restore();
        });
    });

    [{
        applicationType: "URLT",
        expectedVisibleFields: [
            "application_description",
            "target_application_descriptionInput",
            "urlt_application_component",
            "urlt_application_componentInput",
            "target_urlt_system_alias",
            "target_urlt_system_aliasInput"
        ]
    }, {
        applicationType: "LPD",
        expectedVisibleFields: [
            "navigation_provider_role",
            "navigation_provider_roleInput",
            "navigation_provider_instance",
            "navigation_provider_instanceInput",
            "target_application_alias",
            "target_application_aliasInput",
            "target_application_id",
            "target_application_idInput",
            "application_type_deprecated"
        ]
    }, {
        applicationType: "SAPUI5",
        expectedVisibleFields: [
            "application_description",
            "target_application_descriptionInput",
            "application_url",
            "target_application_urlInput",
            "application_component",
            "target_application_componentInput"
        ]
    }, {
        applicationType: "TR",
        expectedVisibleFields: [
            "application_description",
            "target_application_descriptionInput",
            "target_transaction",
            "target_transactionInput",
            "target_system_alias",
            "target_system_aliasInput"
        ]
    }, {
        applicationType: "WDA",
        expectedVisibleFields: [
            "application_description",
            "target_application_descriptionInput",
            "target_web_dynpro_application",
            "target_web_dynpro_applicationInput",
            "target_web_dynpro_configuration",
            "target_web_dynpro_configurationInput",
            "target_system_alias",
            "target_system_aliasInput"
        ]
    }, {
        applicationType: "URL",
        expectedVisibleFields: [
            "application_description",
            "target_application_descriptionInput",
            "application_url",
            "target_application_urlInput",
            "target_system_alias",
            "target_system_aliasInput"
        ]
    }, {
        applicationType: "WCF",
        expectedVisibleFields: [
            "application_description",
            "target_application_descriptionInput",
            "target_wcf_application_id",
            "target_wcf_application_idInput",
            "target_system_alias",
            "target_system_aliasInput"
        ]
    }].forEach(function (oTestCase) {
        QUnit.test("displayApplicationTypeFields: correct fields are visible for " + oTestCase.applicationType + " application type", function (assert) {
            var oResult = {};
            var oConfigurationView = {
                byId: function (sId) {
                    return {
                        setVisible: function (bVisible) {
                            oResult[sId] = bVisible;
                        }
                    };
                }
            };

            var oExpectedResult = {
                navigation_provider_role: false,
                navigation_provider_roleInput: false,
                navigation_provider_instance: false,
                navigation_provider_instanceInput: false,
                target_application_alias: false,
                target_application_aliasInput: false,
                target_application_id: false,
                target_application_idInput: false,
                application_description: false,
                target_application_descriptionInput: false,
                application_url: false,
                target_application_urlInput: false,
                application_component: false,
                target_application_componentInput: false,
                target_transaction: false,
                target_transactionInput: false,
                target_wcf_application_id: false,
                target_wcf_application_idInput: false,
                target_web_dynpro_application: false,
                target_web_dynpro_applicationInput: false,
                target_web_dynpro_configuration: false,
                target_web_dynpro_configurationInput: false,
                target_system_alias: false,
                target_system_aliasInput: false,
                urlt_application_component: false,
                urlt_application_componentInput: false,
                target_urlt_system_alias: false,
                target_urlt_system_aliasInput: false,
                application_type_deprecated: false
            };

            oTestCase.expectedVisibleFields.forEach(function (sFieldId) {
                oExpectedResult[sFieldId] = true;
            });

            Utils.displayApplicationTypeFields(oTestCase.applicationType, oConfigurationView);
            assert.deepEqual(oResult, oExpectedResult, "The correct fields should be visible");
        });
    });


    QUnit.module("sap.ushell.components.tiles.utils - AppLauncher Functions", {
        beforeEach: function () {
            return Container.init("local");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("check addParamsToUrl()", function (assert) {
        var data = {};
        data.targetParams = ["query=mondial"];

        var sURL = Utils.addParamsToUrl("http://www.google.com", data);
        assert.equal(sURL, "http://www.google.com?query=mondial", "Test 6.1: URL parameters were added");

        //Test URL that already had a query parameter
        data.targetParams = ["team=Brazil"];
        sURL = Utils.addParamsToUrl(sURL, data);
        assert.equal(sURL, "http://www.google.com?query=mondial&team=Brazil", "Test 6.2: URL parameters were added");
    });

    QUnit.test("check default formatting number", function (assert) {
        var fnNormalizeSpy = sinon.spy(Utils, "_normalizeNumber");
        var fnFormatNumberTestHelpper = function (maxCharactersInDisplayNumber, bCalled, bProccessDigits, oConfig, oDynamicData) {
            var fnProccessDigitStub = sinon.stub(Utils, "_shouldProcessDigits").returns(bProccessDigits);

            Utils.getDataToDisplay(oConfig, oDynamicData);
            assert.ok(fnNormalizeSpy.calledOnce === bCalled, bCalled ? "normalizeNumber is expected to be called once" : "normalizeNumber isn't expected to be called once");
            if (bCalled) {
                assert.ok(fnNormalizeSpy.args[0][1] === maxCharactersInDisplayNumber, "When the tile contains icon, the maximum allowed digits is: 4, otherwise: 5");
            }

            fnNormalizeSpy.reset();
            fnProccessDigitStub.restore();
        };

        fnFormatNumberTestHelpper(4, true, false, { display_icon_url: "test" }, { number: "12345" });
        fnFormatNumberTestHelpper(5, true, false, { display_icon_url: undefined }, { number: "123456" });
        fnFormatNumberTestHelpper(5, true, true, { display_icon_url: undefined }, { number: "123" });
        fnFormatNumberTestHelpper(4, false, false, { display_icon_url: "test" }, { number: "123" });
    });

    QUnit.test("Test edge case formatting", function (assert) {
        var oConfig = {},
            oDynamicData = { number: "17142", numberDigits: "0" },
            oData = Utils.getDataToDisplay(oConfig, oDynamicData);
        assert.strictEqual(oData.display_number_value, "17", "correct display_number_value formatting");
        assert.strictEqual(oData.display_number_unit, "", "correct display_number_unit formatting");
        assert.strictEqual(oData.display_icon_url, "", "correct display_icon_url formatting");
        assert.strictEqual(oData.display_title_text, "", "correct display_title_text formatting");
        assert.strictEqual(oData.display_number_unit, "", "correct display_number_unit formatting");
        assert.strictEqual(oData.display_info_text, "", "correct display_info_state formatting");
        assert.strictEqual(oData.display_info_state, "Neutral", "correct display_info_state formatting");
        assert.strictEqual(oData.display_subtitle_text, "", "correct display_subtitle_text formatting");
        assert.strictEqual(oData.display_state_arrow, "None", "correct display_state_arrow formatting");
        assert.strictEqual(oData.display_number_digits, "0", "correct display_number_digits formatting");
        assert.strictEqual(oData.display_number_factor, "K", "correct display_number_factor formatting");
        assert.strictEqual(oData.display_search_keyword, "", "correct display_search_keyword formatting");
    });

    QUnit.test("check normalizing number", function (assert) {
        var oNormalizedNum;

        oNormalizedNum = Utils._normalizeNumber("Not_a_Number", 5);
        assert.ok(oNormalizedNum.displayNumber === "Not_a", "Test normalizing number when the string value is NaN and the allowed number of digit is 5");
        oNormalizedNum = Utils._normalizeNumber("123456", 5);
        assert.ok(oNormalizedNum.displayNumber === "123.4", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        assert.ok(oNormalizedNum.numberFactor === "K", "Test normalizing number when number is: '1000000 > number > 999'");
        oNormalizedNum = Utils._normalizeNumber("1234567", 5);
        assert.ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        assert.ok(oNormalizedNum.numberFactor === "M", "Test normalizing number when number is: '1000000000 > number > 999999'");
        oNormalizedNum = Utils._normalizeNumber("1234567890", 5);
        assert.ok(oNormalizedNum.displayNumber === "1.234", "Test normalizing number when the Number value is larger than the maxamial alowed amount of digits");
        assert.ok(oNormalizedNum.numberFactor === "B", "Test normalizing number when number is: '10000000000 > number > 999999999'");
        oNormalizedNum = Utils._normalizeNumber("123", 5, "TEST");
        assert.ok(oNormalizedNum.numberFactor === "TEST", "Test normalizing number when the Number Factor is predifined");
        oNormalizedNum = Utils._normalizeNumber("12345.5", 3);
        assert.ok(oNormalizedNum.displayNumber === "12", "Test normalizing number - Assure that if the last carachter after formatting is '.' , it's being truncated");
    });

    QUnit.test("check should process digits", function (assert) {
        var bShouldProcessDigits;

        bShouldProcessDigits = Utils._shouldProcessDigits("1234");
        assert.ok(!bShouldProcessDigits, "_shouldProcessDigits should be falsy when the Display Number doesn't contain a decimal point");
        bShouldProcessDigits = Utils._shouldProcessDigits("12.34", 1);
        assert.ok(bShouldProcessDigits, "_shouldProcessDigits should be truthy when the number of tenths is greater the number of digits to display");
        bShouldProcessDigits = Utils._shouldProcessDigits(12.34, 1);
        assert.ok(bShouldProcessDigits, "_shouldProcessDigits should handle non string (number) values for the  argument: sDisplayNumber");
    });

    QUnit.test("getAppLauncherConfig with corrupted JSON data", function (assert) {
        var oTileApi = {
            __metadata: {
                type: "PAGE_BUILDER_PERS.PageChipInstance"
            },
            pageId: "/UI2/Fiori2LaunchpadHome",
            instanceId: "008MEOP2VK3O2VC0PQSOGC629",
            chipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
            title: "Sales Order",
            configuration: {
                getParameterValueAsString: function () {
                    return "{\"tileConfiguration\":\"{\\\"display_icon_url_CORRUPT_HERE__\r__END_OF_CORRUPTION\\\":\\\"sap-icon://Fiori2/F0020\\\",\\\"display_info_text\\\":\\\"Test\\\","
                        + "\\\"display_subtitle_text\\\":\\\"Venkat - SO\\\",\\\"display_title_text\\\":\\\"Sales Order\\\""
                        + ",\\\"navigation_target_url\\\":\\\"#SalesOrder-change&/detail/SalesOrders('32594')\\\",\\\"navigation_use_semantic_object\\\":false}\"}";
                }
            },
            layoutData: "",
            remoteCatalogId: "",
            referencePageId: "",
            referenceChipInstanceId: "",
            isReadOnly: "",
            scope: "PERSONALIZATION",
            updated: "Date(1396496357000)",
            outdated: "",
            Chip: {
                __metadata: {
                    type: "PAGE_BUILDER_PERS.Chip"
                },
                id: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                title: {
                    getTitle: function () {
                        return "App Launcher – Static";
                    }
                },
                description: "Displays static text and icons that can be configured",
                configuration: "",
                url: "/sap/bc/ui5_ui5/ui2/ushell/chips/applauncher.chip.xml",
                baseChipId: "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER",
                catalogId: "/UI2/CATALOG_ALL",
                catalogPageChipInstanceId: "",
                referenceChipId: "",
                isReadOnly: "",
                Catalog: {
                    __deferred: {}
                },
                ReferenceChip: {
                    __deferred: {}
                },
                ChipBags: {
                    results: []
                },
                CatalogPageChipInstance: {
                    __deferred: {}
                }
            },
            ReferenceChip: {
                __deferred: {}
            },
            RemoteCatalog: null,
            ReferenceChipInstance: {
                __deferred: {}
            },
            ChipInstanceBags: {
                results: []
            }
        };
        var bAdmin = false,
            bEdit = false;

        sinon.stub(Utils, "getTranslatedTitle").callsFake(function () {
            return "Translated Title";
        });
        sinon.stub(Utils, "getTranslatedSubtitle").callsFake(function () {
            return "Translated Subtitle";
        });
        sinon.stub(Utils, "getTranslatedProperty").callsFake(function () {
            return "Translated Property";
        });
        sinon.stub(Utils, "getTileNavigationActions").callsFake(function () {
            return "Tile Navigation Actions";
        });

        var result = Utils.getAppLauncherConfig(oTileApi, bAdmin, bEdit);
        var expected = {}; // should return an empty object when the configuration is corrupted

        assert.deepEqual(result, expected, "getAppLauncherConfig passed even when configuration is corrupted");
    });

    QUnit.test("getTileSettingsAction for tile", function (assert) {
        var getMetadataStub = sinon.stub(AppConfiguration, "getMetadata").returns({ icon: "icon" });

        var oModel = new JSONModel({
            config: {
                display_title_text: "Tile title",
                display_subtitle_text: "Tile subtitle",
                display_info_text: "Tile information",
                display_icon_url: undefined,
                display_search_keywords: undefined
            }
        });

        var tileSettingsAction = Utils.getTileSettingsAction(oModel, function () { }, "tile");

        assert.ok(tileSettingsAction, "Action was created");

        return tileSettingsAction.press().then(function () {
            var tileSettingsDialog = Element.getElementById("settingsDialog");
            tileSettingsDialog.close();

            var saveAsTileView = tileSettingsDialog.getContent()[0].getContent()[0];
            assert.equal(saveAsTileView.oTitleInput.getProperty("value"), "Tile title");
            assert.equal(saveAsTileView.oSubTitleInput.getProperty("value"), "Tile subtitle");
            assert.equal(saveAsTileView.oInfoInput.getProperty("value"), "Tile information");
            assert.equal(saveAsTileView.oGroupsSelect.getProperty("visible"), false);

            getMetadataStub.restore();
            tileSettingsDialog.destroy();
        });
    });

    QUnit.test("getTileSettingsAction for link", function (assert) {
        var getMetadataStub = sinon.stub(AppConfiguration, "getMetadata").returns({ icon: "icon" });

        var oModel = new JSONModel({
            config: {
                display_title_text: "Link title",
                display_subtitle_text: "Link subtitle"
            }
        });

        var tileSettingsAction = Utils.getTileSettingsAction(oModel, function () { }, "link");

        assert.ok(tileSettingsAction, "Action was created");

        return tileSettingsAction.press().then(function () {
            var linkSettingsDialog = Element.getElementById("settingsDialog");
            linkSettingsDialog.close();

            var saveAsTileView = linkSettingsDialog.getContent()[0].getContent()[0];

            assert.equal(saveAsTileView.oTitleInput.getProperty("value"), "Link title");
            assert.equal(saveAsTileView.oSubTitleInput.getProperty("value"), "Link subtitle");
            assert.equal(saveAsTileView.oInfoInput.getProperty("visible"), false);
            assert.equal(saveAsTileView.oInfoInput.getProperty("visible"), false);
            assert.equal(saveAsTileView.oGroupsSelect.getProperty("visible"), false);

            getMetadataStub.restore();
            linkSettingsDialog.destroy();
        });
    });



});
