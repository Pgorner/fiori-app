sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report");

		opaTest("Starting the app and checking the SFB expand/collapse state", function (Given, When, Then) {
			var currentYear = new Date().getFullYear();
			Given.iStartMyAppInSandbox("SalesOrder-MultiViews#SalesOrder-MultiViews");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
                .iCheckControlPropertiesById("listReportFilter-filterItem-___INTERNAL_-DeliveryDateTime", { "text":"DeliveryDateTime Europe"});
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(true);
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(false);
			Then.onTheGenericListReport
				.theHeaderExpandedPropertyIsCorrectlySet(false);
		});

		opaTest("Checking the default values and available options for date range fields on SFB", function (Given, When, Then) {
			var currentYear = new Date().getFullYear();
			When.onTheGenericListReport
				.iSetTheHeaderExpanded(true);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReportFilter-filterItemControl_BASIC-CreatedDate-input", {"visible": true, "value": "This Year (Jan 1, " + currentYear + " – Dec 31, " + currentYear + ")"}) 
				.and
				.iCheckTheValueOfDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDate", {key: "DeliveryDate", operator: "TOMORROW"})
				.and
				.iCheckTheValueOfDateRangeField("listReportFilter-filterItemControl_BASIC-UpdatedDate", {key: "UpdatedDate", operator: "TODAY"})
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDate", ['DATERANGE', 'DATE', 'FROM', 'TO', 'LASTDAYS', 'LASTWEEKS', 'LASTMONTHS', 'LASTQUARTERS', 'LASTYEARS', 'NEXTDAYS', 'NEXTWEEKS', 'NEXTMONTHS', 'NEXTQUARTERS', 'NEXTYEARS', 'SPECIFICMONTH', 'YESTERDAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'LAST2WEEKS', 'LAST3WEEKS', 'LAST4WEEKS', 'LAST5WEEKS', 'NEXTWEEK', 'NEXT2WEEKS', 'NEXT3WEEKS', 'NEXT4WEEKS', 'NEXT5WEEKS', 'THISMONTH', 'LASTMONTH', 'NEXTMONTH', 'THISQUARTER', 'LASTQUARTER', 'NEXTQUARTER', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'NEXTYEAR', 'QUARTER1', 'QUARTER2', 'QUARTER3', 'QUARTER4', 'TODAYFROMTO', 'DATETOYEAR', 'LASTDAYSINCLUDED', 'LASTWEEKSINCLUDED', 'LASTMONTHSINCLUDED', 'LASTQUARTERSINCLUDED', 'LASTYEARSINCLUDED', 'NEXTDAYSINCLUDED', 'NEXTWEEKSINCLUDED', 'NEXTMONTHSINCLUDED', 'NEXTQUARTERSINCLUDED', 'NEXTYEARSINCLUDED'])
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-UpdatedDate", ['DATE', 'YESTERDAY', 'TODAY', 'FIRSTDAYWEEK', 'LASTDAYWEEK', 'FIRSTDAYMONTH', 'LASTDAYMONTH', 'FIRSTDAYQUARTER', 'LASTDAYQUARTER', 'FIRSTDAYYEAR', 'LASTDAYYEAR'])
				.and
				.iCheckTheAvailableOptionsForDateRangeField("listReportFilter-filterItemControl_BASIC-DeliveryDateTime", ['NEXTMINUTES', 'NEXTHOURS', 'LASTMINUTES', 'LASTHOURS', 'LASTMINUTESINCLUDED', 'LASTHOURSINCLUDED', 'NEXTMINUTESINCLUDED', 'NEXTHOURSINCLUDED', 'DATERANGE', 'DATE', 'FROM', 'TO', 'LASTDAYS', 'LASTWEEKS', 'LASTMONTHS', 'LASTQUARTERS', 'LASTYEARS', 'NEXTDAYS', 'NEXTWEEKS', 'NEXTMONTHS', 'NEXTQUARTERS', 'NEXTYEARS', 'SPECIFICMONTH', 'YESTERDAY', 'TODAY', 'TOMORROW', 'THISWEEK', 'LASTWEEK', 'LAST2WEEKS', 'LAST3WEEKS', 'LAST4WEEKS', 'LAST5WEEKS', 'NEXTWEEK', 'NEXT2WEEKS', 'NEXT3WEEKS', 'NEXT4WEEKS', 'NEXT5WEEKS', 'THISMONTH', 'LASTMONTH', 'NEXTMONTH', 'THISQUARTER', 'LASTQUARTER', 'NEXTQUARTER', 'YEARTODATE', 'THISYEAR', 'LASTYEAR', 'NEXTYEAR', 'QUARTER1', 'QUARTER2', 'QUARTER3', 'QUARTER4', 'TODAYFROMTO', 'DATETOYEAR', 'LASTDAYSINCLUDED', 'LASTWEEKSINCLUDED', 'LASTMONTHSINCLUDED', 'LASTQUARTERSINCLUDED', 'LASTYEARSINCLUDED', 'NEXTDAYSINCLUDED', 'NEXTWEEKSINCLUDED', 'NEXTMONTHSINCLUDED', 'NEXTQUARTERSINCLUDED', 'NEXTYEARSINCLUDED', 'DATETIME']);
		});

		opaTest("Checking the url for iappState hash", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckForHashValueInAppUrl("sap-iapp-state", true)
				.and
				.iCheckForHashValueInAppUrl("sap-iapp-state--history", true);
		});

	opaTest("Checking the enablement of standard copy button for draft and non draft objects for tab 1", function (Given, When, Then) {
		When.onTheGenericListReport
			.iSetTheFilter({ Field: "CreatedDate", Value: "" })
			.and
			.iSetTheFilter({ Field: "DeliveryDate", Value: "" })
			.and
			.iSetTheFilter({ Field: "UpdatedDate", Value: "" })
			.and
			.iExecuteTheSearch();
		Then.onTheGenericListReport
			.theResultListContainsTheCorrectNumberOfItems(11, 1);
		//draft object
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0], true, 1);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({ "action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrderItem_WD_20_SalesOrderCopy-1": [true, false, "Standard Copy"] }, "responsiveTable-1");
		//active object
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([1], true, 1);
		Then.onTheListReportPage
			.iCheckTableToolbarControlProperty({ "action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrderItem_WD_20_SalesOrderCopy-1": [true, true, "Standard Copy"] }, "responsiveTable-1");
	});

		opaTest("Change the date range field value and load the data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field: "CreatedDate", Value: "Jan 1, 2020 - Dec 31, 2020"})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(8, 1);
			Then.onTheListReportPage
				.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-1", { "entitySet": "C_STTA_SalesOrder_WD_20", "enableAutoColumnWidth": true })
				.and
				.iCheckTableProperties({"visible": true}, "responsiveTable", "responsiveTable-1")
				.and
				.iCheckDynamicPageProperty("stickySubheaderProvider", "SOMULTIENTITY::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--template::IconTabBar", true);
		});

		opaTest("Filtering for Product = 'HT-1003'", function (Given, When, Then) {
			var iTabIndex = 1,
				sProduct = "Product",
				sValue = "HT-1003",
				iExpectedItems = 8;

			When.onTheGenericListReport
				.iSetTheFilter({Field: sProduct, Value: sValue});
			Then.onTheGenericListReport
				.iCheckOverlayForTable("responsiveTable-1", true);
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 2)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(3, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10)
				.and
				.theResultListFieldHasTheCorrectValue({Line: 1, Field: sProduct, Value: sValue}, iTabIndex);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Orders (8)"]}, "--responsiveTable-1");
		});

	opaTest("Checking message strip for non-applicable filters when they are added via adapt filter", function (Given, When, Then) {
		When.onTheGenericListReport
			.iClickTheButtonWithId("listReportFilter-btnFilters");
		Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Adapt Filters");
		When.onTheListReportPage
			.iAddColumnFromP13nDialog("Company");
		When.onTheGenericListReport
			.iClickTheButtonOnTheDialog("OK");
		Then.onTheListReportPage
			.iCheckControlPropertiesById("listReportFilter-filterItemControlA_-to_BPAContact.CompanyName", { "enabled": true, "editable": true });
		When.onTheListReportPage
			.iEnterValueInField("abc", "listReportFilter-filterItemControlA_-to_BPAContact.CompanyName");
		When.onTheGenericListReport
			.iExecuteTheSearch();
		When.onTheGenericListReport
			.iClickOnIconTabFilter("2");
		When.onTheListReportPage
			.iLookAtTheScreen();
		Then.onTheListReportPage
			.iCheckControlPropertiesByControlType("sap.m.MessageStrip", {
				"visible": true,
				"type": "Information",
				"text": "The filter \"Company\" is not relevant for the tab \"Sales Order Items\". Setting this filter has no effect on the results."
			});
	});

		opaTest("Switching to Tab 2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-2", {"entitySet": "C_STTA_SalesOrderItem_WD_20"})
				.and
				.iCheckTableProperties({"visible": true}, "responsiveTable", "responsiveTable-2");
		});

		opaTest("Filtering for Product = 'HT-1007'", function (Given, When, Then) {
			var iTabIndex = 2,
				sProduct = "Product",
				sValue = "HT-1007",
				iExpectedItems = 1;

			When.onTheGenericListReport
				.iSetTheFilter({Field: sProduct, Value: sValue})
				.and
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(3, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10)
				.and
				.theResultListFieldHasTheCorrectValue({Line: 0, Field: sProduct, Value: sValue}, iTabIndex);
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Order Items (1)"]}, "--responsiveTable-2");
		});

		opaTest("Switching to Tab 3", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {
					"visible": true,
					"entitySet": "C_STTA_SalesOrderItem_WD_20"
				})
				/* TODO: Checking the customData of a control should not be done in an OPA test case as it is not a 
				   blackbox test. It should get refactored and OPA should be added on the features dependant on the 
				   used customData. */
				.and
				.iCheckCustomDataOfControl("sap.ui.comp.smartchart.SmartChart", "--listReport-3", {
					"presentationVariantQualifier": "VAR3",
					"chartQualifier": "Chart1"
				})
				.and
				.iCheckCustomDataOfControl("sap.m.IconTabFilter", "IconTabFilter-3", {
					"variantAnnotationPath": "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#VAR3",
					"text": "Sales Order Items Chart"
				});
		});

		opaTest("Check the heading level value for the chart on LR", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesById("listReport-3", { "visible": true, "header": "Sales Order Items", "headerLevel": "H3" });
		});

		opaTest("Filtering for CurrencyCode = 'EUR'", function (Given, When, Then) {
			var iTabIndex = 3,
				sCurrencyCode = "CurrencyCode",
				sValue = "EUR",
				iExpectedItems = 4;

			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: ""})
				.and
				.iSetTheFilter({Field: sCurrencyCode, Value: sValue})
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {"visible": true});
			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 8)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
		});

		opaTest("Check NoData text for SmartChart", function (Given, When, Then) {
			var iTabIndex = 3,
				sCurrencyCode = "Product",
				sValue = "Prod",
				iExpectedItems = 0;

			When.onTheGenericListReport
				.iClickOnIconTabFilter("3")
				.and
				.iSetTheFilter({
					Field: sCurrencyCode,
					Value: sValue
				})
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {"visible": true})
				.and
				.iCheckSmartChartNoDataText("There is no data for the selected filter criteria and chart view.", "listReport-3");

			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);

			When.onTheGenericListReport
				.iSetTheFilter({
					Field: sCurrencyCode,
					Value: ""
				})
				.iExecuteTheSearch();

		});

		opaTest("Switching to Tab 4", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iCheckControlPropertiesById("ListReport::C_STTA_SalesOrder_WD_20--listReport-4", {"entitySet": "C_STTA_SalesOrderItemSL_WD_20"})
				.and
				.iCheckTableProperties({"visible": true}, "responsiveTable", "responsiveTable-4")
				.and
				.iCheckControlPropertiesByControlType("sap.m.MessageStrip", {
					"visible": true,
					"text": "Some of the filters are not relevant for the tab \"Sales Order Items SL\" (ISO Currency Code, Created Date, Company). Setting these filters has no effect on the results."
				});
		});

		opaTest("Switching to Tab 5", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("5");
			Then.onTheListReportPage
				.iCheckControlPropertiesByControlType("sap.ui.comp.smartchart.SmartChart", {
					"visible": true,
					"entitySet": "C_STTA_SalesOrderItemSL_WD_20"
				})
				.and
				.iCheckControlPropertiesByControlType("sap.m.MessageStrip", {
					"visible": true,
					"text": "Some of the filters are not relevant for the tab \"Sales Order Items SL Chart\" (ISO Currency Code, Created Date, Company). Setting these filters has no effect on the results."
				});
		});

		opaTest("Switching back to Tab 1 and clear filters", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1")
				.and
				.iSetTheFilter({Field: "CurrencyCode", Value: ""})
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Orders (8)"]}, "--responsiveTable-1");
		});

		opaTest("Set filter LifecycleStatus and load data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheMultiComboBoxArrow("LifecycleStatus")
				.and
				.iSelectItemsFromMultiComboBox("LifecycleStatus", "Closed")
				.and
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTableToolbarControlProperty({"header": [true, true, "Sales Orders (1)"]}, "--responsiveTable-1");
		});

		opaTest("Check for Semantic Date Range Values excluded with key configuration in manifest", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheControlWithId("listReportFilter-filterItemControl_BASIC-UpdatedDate-input");
			Then.onTheListReportPage
				.iCheckTheItemPresentInThePopOverList("listReportFilter-filterItemControl_BASIC-UpdatedDate-RP-popover", "Tomorrow" , false);
			When.onTheListReportPage
				.iClickTheControlWithId("listReportFilter-filterItemControl_BASIC-DeliveryDate-input");
			Then.onTheListReportPage
				.iCheckTheItemPresentInThePopOverList("listReportFilter-filterItemControl_BASIC-DeliveryDate-RP-popover", "Today" , false)
				.and
				.iCheckTheItemPresentInThePopOverList("listReportFilter-filterItemControl_BASIC-DeliveryDate-RP-popover", "Today -X / +Y Days" , true);
		});

		opaTest("Check for the stickySubheaderProvider property for the DynamicPage", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckDynamicPageProperty("stickySubheaderProvider", "SOMULTIENTITY::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--template::IconTabBar", true);
		});

		opaTest("Check for the key field as parameter for the unbound Function import action", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheButtonOnTableToolBar("Calculate Item Gross Amount", "listReport-1");
			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Calculate Item Gross Amount");
			Then.onTheListReportPage
				.iCheckControlPropertiesById("A43022CD16CDC403048E09063CalcgrossamountUnbound-SalesOrder", { "visible": true, "enabled": true, "editable": true, "textLabel": "Sales Order ID" })
				.and
				.iCheckControlPropertiesById("A43022CD16CDC403048E09063CalcgrossamountUnbound-SalesOrderItem", { "visible": true, "enabled": true, "editable": true, "textLabel": "SalesOrderItem" })
				.and
				.iCheckControlPropertiesById("A43022CD16CDC403048E09063CalcgrossamountUnbound-DraftUUID", { "visible": true, "enabled": true, "editable": true, "textLabel": "Key" })
				.and
				.iCheckControlPropertiesById("A43022CD16CDC403048E09063CalcgrossamountUnbound-IsActiveEntity", { "visible": true, "enabled": true, "editable": true, "textLabel": "Is active" });
			When.onTheListReportPage
				.iClickTheButtonOnTheDialog("Cancel");
			Then.iTeardownMyApp();
		});

		QUnit.module("External Navigation");

		opaTest("#1: Starting the app, loading data, see that restricted parameters are not passed to the target application on Navigation", function (Given, When, Then) {
            Given.iStartMyAppInSandboxWithNoParams("#SalesOrder-MultiViews");
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4")
				.and
				.iSetTheFilter({ Field: "CreatedDate", Value: "Jan 1, 2020 - Dec 31, 2020" })
				.and
				.iSetTheFilter({Field: "DeliveryDate", Value: ""})
				.and
				.iSetTheFilter({Field: "UpdatedDate", Value: ""})
				.and
				.iExecuteTheSearch();
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheGenericListReport
				.iClickTheLink("500000000");
			Then.onTheListReportPage
				.iCheckForStringInAppUrl("ScheduleLine", false);
			
		});

		opaTest("#2: Testing OP - DataFieldForIntentBasedNavigation: see that restricted parameters are not passed to the target application on Navigation", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateBack()
			    .and
				.iClickOnIconTabFilter("1")
				.and
				.iSetTheHeaderExpanded(true);
			Then.onTheGenericListReport
				.theResultListIsVisible();
			When.onTheListReportPage
				.iClickTheItemInResponsiveTable(1, 1);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items");
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "SalesOrderItemsID::responsiveTable")
			    .and
				.iClickTheButtonHavingLabel("To SOWD");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Sales Order");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("CurrencyCode", false)
				.and
				.iCheckForStringInAppUrl("GrossAmount", false)
				.and
				.iCheckForStringInAppUrl("CreatedDate", false)
		});

		opaTest("#3: Testing the OP - DataFieldWithIntentBasedNavigation:  see that restricted parameters are not passed to the target application on Navigation", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items");
		    When.onTheGenericObjectPage
				.iClickTheLink("HT-1002");
			Then.onTheGenericObjectPage
				.iSeeShellHeaderWithTitle("Product");
			Then.onTheObjectPage
				.iCheckForStringInAppUrl("CurrencyCode", false)
				.and
				.iCheckForStringInAppUrl("GrossAmount", false)
				.and
				.iCheckForStringInAppUrl("CreatedDate", false)
				.and
				.iCheckForStringInAppUrl("Product", false)
				.and
				.iCheckForStringInAppUrl("Copyitem_ac", false);
			Then.iTeardownMyApp();
		});
	}
);
