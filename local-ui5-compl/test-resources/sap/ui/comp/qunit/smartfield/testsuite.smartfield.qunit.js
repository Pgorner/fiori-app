sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartfield'",
		defaults: {
			group: "SmartField",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4,
				useFakeTimers: false
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/comp/integration": "test-resources/sap/ui/comp/integration/"
				}
			},
			autostart: false,
			module: "./{name}.qunit"
		},
		tests: {
			"AnnotationHelper": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/AnnotationHelper.js"
				}
			},
			"BindingUtil": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/BindingUtil.js"
				}
			},
			"ControlFactoryBase": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/ControlFactoryBase.js"
				}
			},
			"Currency": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/type/Currency.js"
				}
			},
			"Unit": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/type/Unit.js"
				}
			},
			"FieldControl": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/FieldControl.js"
				}
			},
			"JSONControlFactory": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/JSONControlFactory.js"
				}
			},
			"JSONTypes": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/JSONTypes.js"
				}
			},
			"ODataControlFactory": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/ODataControlFactory.js"
				}
			},
			"ODataHelper": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/ODataHelper.js"
				}
			},
			"ODataTypes": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/ODataTypes.js"
				}
			},
			"SideEffectUtil": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/SideEffectUtil.js"
				}
			},
			"SmartField": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/SmartField.js"
				}
			},
			"SmartLabel": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/SmartLabel.js"
				}
			},
			"TextArrangementDelegate": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/TextArrangementDelegate.js"
				}
			},
			"TextArrangement": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/TextArrangement.js"
				}
			},
			"TextArrangementGuid": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/type/TextArrangementGuid.js"
				}
			},
			"TextArrangementString": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/type/TextArrangementString.js"
				}
			},
			"TextArrangementRead": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/TextArrangementRead.js"
				}
			},
			"SmartFieldIntegrationTests": {
				group: "SmartField",
				autostart: true
			},
			"Types": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: [
						"sap/ui/comp/smartfield/type/AbapBool.js",
						"sap/ui/comp/smartfield/type/DateTime.js",
						"sap/ui/comp/smartfield/type/DateTimeOffset.js",
						"sap/ui/comp/smartfield/type/Time.js",
						"sap/ui/comp/smartfield/type/String.js",
						"sap/ui/comp/smartfield/type/Decimal.js",
						"sap/ui/comp/smartfield/type/Int16.js",
						"sap/ui/comp/smartfield/type/Int32.js",
						"sap/ui/comp/smartfield/type/Int64.js",
						"sap/ui/comp/smartfield/type/SByte.js"
					]
				}
			},
			"opa/ValueListNoValidation/ValueListNoValidationOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/TextArrangement/TextArrangementOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/Validation/ValidationOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/Generic/GenericOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/NavigationProperties/NavigationPropertiesOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/FieldGroupIDs/FieldGroupIDsOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/ModelPropagation/MixOfModelsAndContextsOPA": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CompoundKeys/CompoundKeysOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/EditableFormatter/EditableFormatterOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page1_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page1_2": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page1_3": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page1_4": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page2_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page3_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page4_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page4_2": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page4_3": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page5_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page5_2": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page5_3": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page6_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page7_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page7_2": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page8_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page9_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page10_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page11_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTypes/SmartFieldTypes.opa.page12_1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTextInEditModeSource/SmartFieldTextInEditModeSource.opa.page1": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTextInEditModeSource/SmartFieldTextInEditModeSource.opa.page2": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/Currency/CurrencyWithCustomList.opa.page1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/Currency/CurrencyWithCustomList.opa.page2": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/Currency/CurrencyWithCustomList.opa.page3": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/Currency/CurrencyWithCustomList.opa.page4": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/Currency/CurrencyWithCustomList.opa.page5": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/Currency/CurrencyWithoutCustomList.opa.page6": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page1": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page2": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page3": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page4": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			/**
			 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
			 */
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page5": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			/**
			 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
			 */
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page6": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			/**
			 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
			 */
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page7": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			/**
			 * @deprecated As of version 1.64, replaced by {@link sap.ui.comp.smartfield.SmartField#checkValuesValidity}
			 */
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page8": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page9": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page10": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/CurrencyAndUoMWithCustomList/UoM/UoMWithCustomList.opa.page11": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldDateTimeOffset/SmartFieldDateTimeOffsetOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/TextArrangementInTable/TextArrangementInTableOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/FieldControl/FieldControlOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/IsTimezone/IsTimezoneOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/NoSmartContainer/NoSmartContainerOPA": {
				group: "SmartField",
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			}
		}
	};

	return oUnitTest;
});
