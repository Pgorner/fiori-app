sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Empty Row Creation with NavigationRestrictions for Responsive Table");

		opaTest("Checking if empty rows are created in responsive table when the insert restriction is true", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernoext#//C_STTA_SalesOrder_WD_20(SalesOrder='500000008',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestMultipleSectionsDifferentTableType");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20")
				.and
				.iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(6, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000008");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(7, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iShouldSeeTheInactiveRowOnTheTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckCustomizeConfigPropertyOfTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table", {"ignoreInsertRestrictions": { "*": true },"clientSideMandatoryCheck": { "*": false } })
		});

		opaTest("Checking if empty rows are not created in responsive Table when the insert restriction is false", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickTheControlWithId("C_STTA_SalesOrder_WD_20--discard")
				.and
				.iClickTheControlWithId("C_STTA_SalesOrder_WD_20--back");
			Then.onTheGenericListReport
				.theListReportPageIsVisible();
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(7);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20")
				.and
				.iRemoveAllTheCustomVariantsForTheTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table")
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(8, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000007");
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckNumberOfItemsInTable(8, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckCustomizeConfigPropertyOfTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table", {"ignoreInsertRestrictions": { "*": true },"clientSideMandatoryCheck": { "*": false } });
			Then.iTeardownMyApp();
		});

	}
);
