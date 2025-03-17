sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit"
], function(
	Opa5,
	opaTest
) {
	"use strict";

	if (window.blanket) {
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		autoWait: true,
		enabled: false,
		testLibs: {
			compTestLibrary: {
				appUrl: "test-resources/sap/ui/comp/qunit/opaTests/applicationUnderTestSmartTable/SmartTable.qunit.html"
			}
		},
		arrangements: {
			iStartMyUIComponentInViewMode: function(sComponentName) {
				return this.iStartMyUIComponent({
					componentConfig: {
						name: sComponentName,
						async: true
					},
					hash: "",
					autowait: true
				});
			}
		}
	});

	var sTableId = "__xmlview0--LineItemsSmartTable";
	var sFilterBarId = "__xmlview0--smartFilterBar";

	opaTest("When I look at the screen, SmartTable, title, and the buttons in the OverflowToolbar should appear", function (Given, When, Then) {
		Given.iStartMyUIComponentInViewMode("applicationUnderTestSmartTable");

		Then.onSmartTable.iShouldSeeATable();
		Then.onSmartTable.iShouldSeeTheTableTitleAndCount(sTableId);
		Then.onSmartTable.iShouldSeeVariantManagement(sTableId);
		Then.onSmartTable.iShouldSeeShowMorePerColumnButton(sTableId);
		Then.onSmartTable.iShouldSeeThePersonalisationButton(sTableId);
		Then.onSmartTable.iShouldSeeTheExportButton(sTableId);
		Then.onSmartTable.tableShouldBeInMode(sTableId, "Display");
		Then.onSmartTable.iShouldSeeTheMoreButton(sTableId);
	});

	opaTest("When the column is using LineItems UI.Hidden annotation, it will be hidden unless it is using the Path attribute", function(Given, When, Then) {
		Then.onSmartTable.theColumnShouldBeHidden(sTableId, "Gjahr");
		Then.onSmartTable.theColumnShouldNotBeHidden(sTableId, "Kunnr");
	});

	opaTest("When the column is hidden using LineItems UI.Hidden annotation, filtering via FilterBar should still be possible", function(Given, When, Then) {
		Then.onSmartTable.theColumnShouldBeHidden(sTableId, "Gjahr");

		Then.onSmartTable.theItemCountShouldBe(sTableId, 31);
		When.onFilterBar.iAddValuesToFilterField(sFilterBarId, "Fiscal Year", ["2015"]);
		Then.onSmartTable.theItemCountShouldBe(sTableId, 53);
	});


	opaTest("When I switch the mode, the correct button should be displayed", function (Given, When, Then) {
		When.onSmartTable.iPressToggleEditButton(sTableId);
		Then.onSmartTable.tableShouldBeInMode(sTableId, "Edit");

		When.onSmartTable.iPressToggleEditButton(sTableId);
		Then.onSmartTable.tableShouldBeInMode(sTableId, "Display");
	});

	opaTest("When I press the sort button in the column menu, the column should be sorted", function(Given, When, Then) {
		When.onSmartTable.iPressColumnHeader(sTableId, "Bukrs");
		Then.onSmartTable.theColumnMenuShouldOpen();

		When.onSmartTable.iPressSortPropertyInColumnMenu("Bukrs", "Ascending");
		Then.onSmartTable.thePropertyShouldBeSorted(sTableId, "Bukrs", "Ascending");

		When.onSmartTable.iPressColumnHeader(sTableId, "Bukrs");
		Then.onSmartTable.theColumnMenuShouldOpen();

		When.onSmartTable.iPressSortPropertyInColumnMenu("Bukrs", "Descending");
		Then.onSmartTable.thePropertyShouldBeSorted(sTableId, "Bukrs", "Descending");

		Then.iTeardownMyApp();
	});
});
