sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Object Page: Single Section");

		opaTest("Object Page Single Section Single Responsive Table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#//STTA_C_SO_SalesOrder_ND('500000010')", "manifestOPSingleSectionSingleResponsiveTable");
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingThreshold": 20, "growingScrollToLoad": true});
		});

		opaTest("Check the in-line delete action for Object Page", function (Given, When, Then) {
			When.onTheObjectPage
				.iClickDeleteButtonOnNthRowOfTable(1, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericObjectPage
				.iShouldNotSeeTheControlWithId("template:::ObjectPageTable:::ColumnListItem:::sFacet::to_Item::com.sap.vocabularies.UI.v1.LineItem-__clone0-imgDel");
			Then.iTeardownMyApp();
		});
	});
