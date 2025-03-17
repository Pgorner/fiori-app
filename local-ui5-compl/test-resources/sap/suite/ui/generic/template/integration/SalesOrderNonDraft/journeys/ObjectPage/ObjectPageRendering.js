sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft OP Rendering");

		opaTest("Launch the application and navigate to OP", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd", null, { "bWithChange": true });
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrderID", Value: "500000011" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000011");
		});

		opaTest("Proper display of header image by Avatar control", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Avatar", {"visible": true, "initials": "SO", "displayShape": "Square", "displaySize": "L"});
		});

		opaTest("Object Page Header Action Delete and Standard Copy button visibility in Display mode", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "enabled": true, "text": "Delete"})
				.and
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "enabled": true, "text": "Standard Copy"})
		});

		opaSkip("Focus set on the selected section's first editable input field", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Order Items")
				.and
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Sales Order Items")
				.and
				.iExpectFocusSetOnControlById("to_Item::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar::SearchField");
		});

		opaTest("Focus set back to Edit button after Save in Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonHavingLabel("Save");
			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode()
				.and
				.theButtonWithIdIsEnabled("edit", true)
				.and
				.iExpectFocusSetOnControlById("edit");
		});

		opaTest("Stay on Object page on performing edit and save in Object page", function (Given, When, Then){
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","1111")
				.and
				.iClickTheButtonWithId("save");

			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theObjectPageIsInDisplayMode();
		});

        opaTest("Click the save button without changes", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonWithId("save");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.")
				.and
				.theObjectPageIsInDisplayMode();
		});

		opaTest("Table toolbar Create button controlled via NavigationRestrictions - Boolean Value", function(Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckTableToolbarControlProperty({"addEntry": [true, true]}, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
		});

		opaTest("Check table growingThreshold is set to 6", function(Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
			.iCheckControlPropertiesById("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", {"visible": true, "growingScrollToLoad": false, "growingThreshold": 6});
		});

		opaTest("Object Page Header Action Delete button visibility in Edit mode", function (Given, When, Then) {
			When.onTheSubObjectPage
				.iClickOnButtonWithText("Edit");
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "enabled": true, "text": "Delete"});
			Then.iTeardownMyApp();
		});

		opaTest("Check for the Save and Edit button visibility on the Object page in Edit mode", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttasalesordernd#/STTA_C_SO_SalesOrder_ND('500000011')", null, {"bWithChange": true});
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.m.Button", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--template:::ObjectPageAction:::SaveAndEdit", false);
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode()
				.and
				.theButtonWithLabelIsEnabled("Save and Edit", true);
		});

		opaTest("Check for the Save and Edit button action on Object page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("template:::ObjectPageAction:::SaveAndEdit");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("You haven't made any changes.")
				.and
				.theObjectPageIsInEditMode();
			When.onTheGenericObjectPage
				.iSetTheInputFieldWithId("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::OpportunityID::Field-input", "Test")
				.and
				.iClickTheButtonWithId("template:::ObjectPageAction:::SaveAndEdit");

			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theObjectPageIsInEditMode()
				.and
				.theButtonWithLabelIsEnabled("Save and Edit", true);

			When.onTheGenericObjectPage
				.iSetTheInputFieldWithId("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::OpportunityID::Field-input", "Testing")
				.and
				.iClickTheButtonWithId("save");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theObjectPageIsInDisplayMode();
		});

		opaTest("Check the Edit button not visible on the OP - Object with update restriction", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCloseTheObjectPage();
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({ Field: "SalesOrderID", Value: "500000013" });
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000013");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--edit", false);
		});

		opaTest("Check the Edit button is visible on the SubOP - Main Object with update restriction", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Order Items")
				.and
				.iNavigateFromObjectPageTableByLineNo("to_Item", 0);
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("10");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrderItem_ND--edit", true);
			Then.iTeardownMyApp();
		});
});
