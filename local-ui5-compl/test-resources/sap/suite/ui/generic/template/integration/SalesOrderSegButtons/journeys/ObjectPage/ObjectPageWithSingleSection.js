sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Object Page with Single Section and Dynamic Visible Sections");

		opaTest("Expanding the responsive table to occupy the available space.", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb#/C_STTA_SalesOrder_WD_20(SalesOrder='500000002',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestWithoutReusable");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingScrollToLoad": true, "growingThreshold": 20});
			Then.iTeardownMyApp();
		});

		opaTest("Expanding the responsive table Dynamically.", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb#/C_STTA_SalesOrder_WD_20(SalesOrder='500000002',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestFCLObjectPageOnly");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"]);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingScrollToLoad": false, "growingThreshold": 10});
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("ToggleSection");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Product Table Reuse section set hidden");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingScrollToLoad": true, "growingThreshold": 20});
		});

		opaTest("Expanding the responsive table in IconTabBar mode.", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("ToggleSection");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Product Table Reuse section set visible");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingScrollToLoad": false, "growingThreshold": 10});
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("ToggleIconTabBar");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Icon Tab Bar Mode set to True");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericObjectPage
				.iCheckObjectPageIconTabBarValue(true)
				.and
				.iCheckSelectedSectionByIdOrName("Sales Order Items");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingScrollToLoad": true, "growingThreshold": 20});
			Then.iTeardownMyApp();
		});

		opaTest("Grid Table with Dynamic Visible Sections", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordersb#/C_STTA_SalesOrder_WD_20(SalesOrder='500000012',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestGridTableSingleSection");
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "C_STTA_SalesOrder_WD_20");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"]);
			Then.onTheGenericFCLApp
				.iCheckFCLLayout("OneColumn");
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("ToggleSection");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Product Table Reuse section set hidden");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheObjectPage
				.theCssClassesAndTablePropertiesAreCorrectlySet("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			Then.iTeardownMyApp();
		});


	}
);
