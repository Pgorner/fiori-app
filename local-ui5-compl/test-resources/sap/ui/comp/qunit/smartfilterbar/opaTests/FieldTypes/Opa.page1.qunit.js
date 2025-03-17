/* global QUnit, opaSkip */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/core/library",
	"sap/ui/thirdparty/jquery",
	"test-resources/sap/ui/comp/testutils/opa/TestLibrary"
], function (
	Opa5,
	opaTest,
	Press,
	EnterText,
	coreLibrary,
	jQuery
) {
	"use strict";

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

	Opa5.extendConfig({
		viewName: "SmartFilterBar",
		viewNamespace: "sap.ui.comp.sample.smartfilterbar_types",
		autoWait: true,
		enabled: false,
		async: true,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/applicationUnderTest/SmartFilterBar_Types.html"
			}
		}
	});

	sap.ui.require([
		"sap/ui/comp/qunit/smartfilterbar/opaTests/FieldTypes/pages/SmartFilterBarTypes"
	], function () {
		QUnit.module("Defaults");

		opaTest("Default settings", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S',P_Optional='',P_ComboBoxNoItemsValidation='0001')/Results");

			// Act
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theRequestURLShouldMatch("/ZEPM_C_SALESORDERITEMQUERY(P_Int=90,P_KeyDate=datetime'2018-12-01T00:00:00',P_DisplayCurrency='EUR',P_Bukrs='0001',P_Time=time'PT12H34M56S',P_Optional='',P_ComboBoxNoItemsValidation='0001')/Results");
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("");

			// Arrange
			var controlId = "multiComboBoxWithTooltip";

			//Overwrite Tooltip from view.xml BCP: 1970470346
			// Act

			// Assert
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: controlId,
				success: function (oControl) {
					Opa5.assert.equal(oControl.getTooltip(), "Tooltip View overwrite",
						"Control with ID '" + controlId + "' is with expected tooltip 'Tooltip View overwrite'");
				},
				errorMessage: "Tooltip is not overwrite from the view.xml"
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});
		opaTest("From and To fields should be with correct order after changing from 'Empty' to 'Between'", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-STRING_OUT1");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("Empty");
			When.onTheSmartFilterBarTypesPage.iSelectOperation("BT");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeBTFieldsInCorrectOrder();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheVHDCancelButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});
		opaTest("Input types", function (Given, When, Then) {
			var oExpectedFieldTypes = {
				"smartFilterBar-btnBasicSearch": "sap.ui.comp.smartfilterbar.SFBSearchField",
				"smartFilterBar-filterItemControlA_-BOOL_SINGLE": "sap.m.Select",
				"smartFilterBar-filterItemControlA_-BOOL_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-BOOL_INTERVAL": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-BOOL_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-STRING_OUT2": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-DECIMAL_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-DECIMAL_INTERVAL": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-DECIMAL_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-DECIMAL_SINGLE": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-FLOAT_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-FLOAT_INTERVAL": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-FLOAT_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-FLOAT_SINGLE": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-NUMC_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-NUMC_INTERVAL": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-NUMC_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-NUMC_SINGLE": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-STRING_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-STRING_IN1": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-STRING_INOUT": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-STRING_INTERVAL": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-STRING_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-STRING_OUT1": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-STRING_SINGLE": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Bukrs": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Optional": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-_Parameter.P_DisplayCurrency": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Int": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-_Parameter.P_KeyDate": "sap.m.DatePicker",
				"smartFilterBar-filterItemControlA_-_Parameter.P_Time": "sap.m.TimePicker",
				"smartFilterBar-filterItemControlA_-WS_SFBM": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlA_-WS_FIXED": "sap.ui.comp.smartfilterbar.SFBMultiComboBox",
				"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_INTERVAL": "sap.m.Input",
				"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_SINGLE": "sap.m.DateTimePicker",
				"smartFilterBar-filterItemControlDate.Group-DATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL": "sap.m.DateRangeSelection",
				"smartFilterBar-filterItemControlDate.Group-DATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlDate.Group-DATE_SINGLE": "sap.m.DatePicker",
				"smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO": "sap.m.DynamicDateRange",
				"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_INTERVAL": "sap.m.DateRangeSelection",
				"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlStringDate.Group-STRINGDATE_SINGLE": "sap.m.DatePicker",
				"smartFilterBar-filterItemControlTime.Group-TIME_AUTO": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlTime.Group-TIME_INTERVAL": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlTime.Group-TIME_MULTIPLE": "sap.ui.comp.smartfilterbar.SFBMultiInput",
				"smartFilterBar-filterItemControlTime.Group-TIME_SINGLE": "sap.m.TimePicker",
				"smartFilterBar-filterItemControlA_-CalendarYear": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-CalendarWeek": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-CalendarMonth": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-CalendarQuarter": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-CalendarYearWeek": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-CalendarYearMonth": "sap.m.Input",
				"smartFilterBar-filterItemControlA_-CalendarYearQuarter": "sap.m.Input"
			};

			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Assert
			Object.keys(oExpectedFieldTypes).forEach(function (sKey) {
				var sType = oExpectedFieldTypes[sKey];
				Then.onTheSmartFilterBarTypesPage.waitFor({
					id: sKey,
					success: function (oControl) {
						Opa5.assert.strictEqual(oControl.getMetadata().getName(), sType,
							"Control with ID '" + sKey + "' is of expected type '" + sType + "'");
					}
				});
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Should enter value in filter", function (Given, When, Then) {
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			var sSmartFilterBar = "__xmlview0--smartFilterBar";

			// make a change
			When.onFilterBar.iEnterFilterValue(sSmartFilterBar, {
				"ZEPM_C_SALESORDERITEMQUERYResults": {
					label: "String Auto",
					values: ["*0001*"]
				}
			});

			Then.onFilterBar.iShouldSeeFilters(sSmartFilterBar, {
				"String Auto": [
					{
						operator: "Contains",
						values: ["0001"]
					}
				]
			});

			When.onFilterBar.iClearFilterValue(sSmartFilterBar, "String Auto");
		});

		opaTest('Should personalize SmartFilterBar with desired filters', function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();
			When.onTheSmartFilterBarTypesPage.iToggleTheShortButton();

			var sSmartFilterBar = "__xmlview0--smartFilterBarShort";

			When.onFilterBar.iPersonalizeFilter(sSmartFilterBar, {
				Basic: [
					"Custom MultiComboBox"
				],
				ZEPM_C_SALESORDERITEMQUERYResultsShort: [
					"Date Auto", "String Auto"
				]
			});

			Then.onFilterBar.iShouldSeeFilters(sSmartFilterBar, [
				"Custom MultiComboBox",
				"Date Auto",
				"String Auto"
			]);

			// Cleanup
			When.waitFor({
				id: "smartFilterBarShort-btnRestore",
				controlType: "sap.m.Button",
				actions: new Press(),
				errorMessage: "Did not find the restore button"
			});
			When.onTheSmartFilterBarTypesPage.iToggleTheShortButton();
		});

		opaTest("Include and Exclude is added in the operators list for Define Conditions", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_AUTO");
			When.onTheSmartFilterBarTypesPage.iOpenTheDropdown();

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeIncludAndExcludeGroupHeaders("Include", "Exclude");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheVHDCancelButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Operation dropdown should be disabled for boolean types", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlA_-BOOL_AUTO");

			// Assert
			Then.onTheSmartFilterBarTypesPage.iShouldSeeDisabledOperatorsDropdown();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheVHDCancelButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});



		QUnit.module("Date fields");

		opaTest("Single date", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter a valid date directly in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_SINGLE", "1/1/19");
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("DATE_SINGLE eq datetime'2019-01-01T00:00:00'");

			// Act - Open the Date Picker value help
			When.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlDate.Group-DATE_SINGLE-icon",
				controlType: "sap.ui.core.Icon",
				actions: new Press()
			});

			// Act - Select the date and trigger the filter generation
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.ui.unified.Calendar",
				searchOpenDialogs: true,
				success: function (aCalendars) {
					var $NextDate = aCalendars[0].$().find(".sapUiCalItemSel").next().children("span.sapUiCalItemText").first(), // Should be the "1/2/19";
						oMouseDown = jQuery.Event("mousedown"),
						oMouseUp = jQuery.Event("mouseup");

					oMouseDown.clientX = oMouseDown.clientY = oMouseUp.clientX = oMouseUp.clientY = 0;
					$NextDate.trigger(oMouseDown);
					$NextDate.trigger(oMouseUp);
				}
			});
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("DATE_SINGLE eq datetime'2019-01-02T00:00:00'");

			// Act - enter invalid date in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_SINGLE", "13/1/19" /* Invalid date - no 13'th month */);

			// Assert - test the DatePicker value state
			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlDate.Group-DATE_SINGLE",
				controlType: "sap.m.DatePicker",
				success: function (oDatePicker) {
					Opa5.assert.strictEqual(oDatePicker.getValueState(), ValueState.Error,
						"DatePicker value state should be error");
				}
			});

			// Act - press the go button
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert - Dialog with the correct error message is open
			Then.onTheSmartFilterBarTypesPage.theErrorDialogIsOpen();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheErrorDialogCloseButton();
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Date multiple", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - Open the Date Multiple VH
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDate.Group-DATE_MULTIPLE");

			// Act - Press the + button 2 times to add two rows
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				searchOpenDialogs: true,
				actions: [new Press(), new Press()],
				matchers: function (oControl) {
					return oControl.hasStyleClass("conditionAddBtnFloatRight");
				}
			});

			// Act - Select/Enter dates
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.DatePicker",
				searchOpenDialogs: true,
				success: function (aDatePickers) {
					// Act - Enter a dates in both DatePicker controls
					var oEnterText = new EnterText({
						text: "1/1/19"
					});
					oEnterText.executeOn(aDatePickers[0]);
					oEnterText.executeOn(aDatePickers[1]);

					// Act - Enter invalid date in the third DatePicker
					oEnterText.setText("13/13/19");
					oEnterText.executeOn(aDatePickers[2]);
					aDatePickers[2].$().trigger("blur");

					// Act - Change the date on the first DatePicker
					aDatePickers[0].toggleOpen();
					When.onTheSmartFilterBarTypesPage.waitFor({
						controlType: "sap.ui.unified.Calendar",
						searchOpenDialogs: true,
						success: function (aCalendars) {
							var $NextDate = aCalendars[0].$().find(".sapUiCalItemSel").next().children("span.sapUiCalItemText").first(), // Should be the "1/2/19";
								oMouseDown = jQuery.Event("mousedown"),
								oMouseUp = jQuery.Event("mouseup");

							oMouseDown.clientX = oMouseDown.clientY = oMouseUp.clientX = oMouseUp.clientY = 0;
							$NextDate.trigger(oMouseDown);
							$NextDate.trigger(oMouseUp);
						}
					});

					oEnterText.destroy();
				}
			});

			// Assert
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.DatePicker",
				searchOpenDialogs: true,
				success: function (aDatePickers) {
					// Assert
					Opa5.assert.strictEqual(
						aDatePickers[2].getValueState(),
						ValueState.Warning,
						"Value state should be 'warning'."
					);
				}
			});

			// Act - remove the last row
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Button",
				searchOpenDialogs: true,
				matchers: function (oControl) {
					return oControl.getId().indexOf("__button") !== -1;
				},
				success: function (aControls) {
					// Find remove button on the same row - by default it should be the first control in it's layout parent
					var oRemoveButton = aControls[aControls.length - 1].getParent().remove,
						oPress = new Press();

					// Act
					oPress.executeOn(oRemoveButton);

					// Cleanup
					oPress.destroy();
				}
			});

			// Act - press the dialog ok button
			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("DATE_MULTIPLE eq datetime'2019-01-02T00:00:00' or DATE_MULTIPLE eq datetime'2019-01-01T00:00:00'");

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("Date interval", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act - enter valid date in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL", "1/1/19 - 1/31/19");

			// Act - Create filters
			When.onTheSmartFilterBarTypesPage.iPressTheFilterGoButton();

			// Assert
			Then.onTheSmartFilterBarTypesPage.theFiltersShouldMatch("(DATE_INTERVAL ge datetime'2019-01-01T00:00:00' and DATE_INTERVAL le datetime'2019-01-31T00:00:00')");

			// Act - enter invalid date in the input
			When.onTheSmartFilterBarTypesPage.iEnterStringInFiled("smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL", "1/1/19 - 31/31/19");

			Then.onTheSmartFilterBarTypesPage.waitFor({
				id: "smartFilterBar-filterItemControlDate.Group-DATE_INTERVAL",
				success: function (oInput) {
					Opa5.assert.strictEqual(oInput.getValueState(), ValueState.Error, "Value state should be error");
				}
			});
			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();
		});

		opaTest("DateTimeOffset interval", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDTOffset.Group-DTOFFSET_INTERVAL");

			// Assert
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DTOFFSET_INTERVAL");
			Then.onTheSmartFilterBarTypesPage.thereIsNoEmptyOperation("DTOFFSET_INTERVAL", true);

			When.onTheSmartFilterBarTypesPage.iPressTheVHDOKButton();

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		// Does not make sense for the new control
		opaSkip("Date Range", function (Given, When, Then) {
			// Arrange
			Given.onTheCompTestLibrary.iEnsureMyAppIsRunning();

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO");

			// Act - close popover
			When.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Popover",
				searchOpenDialogs: true,
				success: function (aPopovers) {
					var i, oItem, oText = new EnterText({ text: "1" }), oPopover = aPopovers[0],
						aItems = oPopover.getContent()[0].getItems();
					for (i = 0; i < aItems.length; i++) {
						oItem = aItems[i];
						if (oItem.getMetadata().getName() === "sap.m.DatePicker") {
							// Enter invalid dates
							oText.executeOn(oItem);
						}
					}

					oPopover.close();

					// Cleanup
					oText.destroy();
				}
			});

			// Act
			When.onTheSmartFilterBarTypesPage.iOpenTheVHD("smartFilterBar-filterItemControlDateTimeRange.Group-DTR_AUTO");


			Then.onTheSmartFilterBarTypesPage.waitFor({
				controlType: "sap.m.Popover",
				searchOpenDialogs: true,
				success: function (aPopovers) {
					var i, oItem, oPopover = aPopovers[0], aItems = oPopover.getContent()[0].getItems();
					for (i = 0; i < aItems.length; i++) {
						oItem = aItems[i];
						if (oItem.getMetadata().getName() === "sap.m.DatePicker") {
							Opa5.assert.strictEqual(oItem.getValueState(), ValueState.None, "Value state should be None");
							Opa5.assert.strictEqual(oItem.getDateValue(), null, "Date value should be default");
							Opa5.assert.strictEqual(oItem.getValue(), "", "Value should be default");
						}
					}
				}
			});

			// Cleanup
			When.onTheSmartFilterBarTypesPage.iPressTheRestoreButton();

			Given.onTheCompTestLibrary.iStopMyApp();
		});

		QUnit.start();
	});
});
