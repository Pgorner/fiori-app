sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Sub Object Page");

		opaTest("Sub Object Page Header Action Delete button visibility in Display mode", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')/to_Item(SalesOrderID='500000024',SalesOrderItemID='60')");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("60", "STTA_C_SO_SalesOrderItem_ND");
			Then.onTheSubObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "enabled": true, "text": "Delete"});
		});

		opaTest("Sub Object Page Header Action Delete button visibility in Edit mode", function (Given, When, Then) {
			When.onTheSubObjectPage
				.iClickOnButtonWithText("Edit");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheSubObjectPage
				.iCheckControlPropertiesById("delete", {"visible": true, "enabled": true, "text": "Delete"});
			Then.iTeardownMyApp();
		});

});
