sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft OP: Single Section & Table");

		opaTest("Object Page Single Section Single Table", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#//STTA_C_SO_SalesOrder_ND('500000010')", "manifestOPSingleSectionSingleTable");
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.theCssClassesAndTablePropertiesAreCorrectlySet("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table");
			Then.iTeardownMyApp();
		});
	});
