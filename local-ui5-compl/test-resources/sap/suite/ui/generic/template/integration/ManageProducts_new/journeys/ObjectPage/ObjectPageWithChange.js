sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Object Page Rendering With Changes Applied");

		opaTest("Object page is rendered with iconTabBar", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", null,{"bWithChange": true, "sapUiLayer": "VENDOR"});
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.iCheckObjectPageIconTabBarValue(true)
				.and
				.iCheckTheIndexOfTheSectionIsCorrect(1, "General Information")
				.and
				.iCheckTheIndexOfTheSectionIsCorrect(2, "Sales Data")
				.and
				.iCheckTheIndexOfTheSectionIsCorrect(3, "Sales Revenue");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.m.Button", "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--activate", false)
				.and
				.iCheckTheControlWithIdIsVisible("sap.m.Button", "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--discard", false);
		});
		opaTest("Object page is in edit mode", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode()
				.and
				.iShouldSeeTheButtonWithLabel("Discard Draft");
			Then.onTheObjectPage
				.iCheckTheControlWithIdIsVisible("sap.uxap.ObjectPageHeaderActionButton", "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--edit", false);
		});
		opaTest("Check Selected Section and focus", function(Given, When, Then) {
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheGenericObjectPage
				.and
				.iCheckSelectedSectionByIdOrName("General Information")
				.and
				.iExpectFocusSetOnControlById("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::ProductForEdit::Field");
		});
		opaTest("Check the footer message button - Message popover contains only Error message", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			When.onTheObjectPage
				.iEnterValueInField("68@#", "com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Weight::Field-input");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "1", "type": "Negative", "icon": "sap-icon://message-error" });
		});
		opaTest("Check the footer message button - Message popover contains Warning and Information messages", function (Given, When, Then) {
			When.onTheObjectPage
				.iToggleMessagePopoverDialog()
				.and
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{ "msg": "Warning message", "msgType": "Warning", "persistent": false },
																		{ "msg": "Information message", "msgType": "Information", "persistent": false }]);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "", "type": "Critical", "icon": "sap-icon://message-warning" });
		});
		opaTest("Check the footer message button - Message popover contains Information and Success messages", function (Given, When, Then) {
			When.onTheObjectPage
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{ "msg": "Info message", "msgType": "Information", "persistent": false },
																		{ "msg": "Success Message", "msgType": "Success", "persistent": false }]);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "", "type": "Neutral", "icon": "sap-icon://message-information" });
		});
		opaTest("Check the footer message button - Message popover contains only Success messages", function (Given, When, Then) {
			When.onTheObjectPage
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{ "msg": "Success Message1", "msgType": "Success", "persistent": false },
																		{ "msg": "Success Message2", "msgType": "Success", "persistent": false }]);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "", "type": "Success", "icon": "sap-icon://message-success" });
		});
		opaTest("Check the footer message button - Message Type is not maintained for the messages", function (Given, When, Then) {
			When.onTheObjectPage
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{ "msg": "Test Message1", "msgType": "", "persistent": false },
																		{ "msg": "Test Message2", "msgType": "", "persistent": false }]);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", { "visible": true, "enabled": true, "text": "", "type": "Neutral", "icon": "sap-icon://message-information" })
				.and
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Popover", [{"type":"Information", "title":"Test Message1", "subTitle":"", "description":"", "groupName": "Other Messages"},
																							{"type":"Information", "title":"Test Message2", "subTitle":"", "description":"", "groupName": "Other Messages"}]);
		});
		opaTest("Check the footer message button - Message popover contains Error, Warning and Information messages", function (Given, When, Then) {
			When.onTheObjectPage
				.iAddMessagesToMessageDialogOrPopOver("sap.m.PopOver", [{"msg": "Select a supplier", "msgType": "Error", "target": "/Supplier", "fullTarget": "/to_ProductTextInOriginalLang/to_Product/to_ProductTextInOriginalLang/to_Product/Supplier", "persistent": false},
														{"msg": "Check whether the Base Unit is correct", "msgType": "Warning", "target": "/ProductBaseUnit", "fullTarget": "/ProductBaseUnit", "persistent": false},
														{"msg": "Invalid key predicate.", "msgType": "Error", "fullTarget": "/to_ProductText(Product='HT-1000',DraftUUID=guid'c043a273-fbdb-28df-d567-b890c1b000e1',IsActiveEntity=false)", "persistent": false},
														{"msg": "Information message", "msgType": "Information", "persistent": false}]);
			Then.onTheObjectPage
				.iCheckControlPropertiesById("showMessages", {"visible": true, "enabled": true, "text": "2", "type": "Negative", "icon": "sap-icon://message-error"})
				.and
				.iShouldSeeTheMessagesInsideTheMessagePopUpOrMessagePopOver("sap.m.Popover", [{"type":"Warning", "title":"Check whether the Base Unit is correct", "subTitle":"Base Unit", "description":"", "groupName": "General Information"},
																							{"type":"Error", "title":"Select a supplier", "subTitle":"Supplier", "description":"", "groupName": "General Information"},
																							{"type":"Error", "title":"Invalid key predicate.", "subTitle":"", "description":"", "groupName": "General Information, table: Product Texts"},
																							{"type":"Information", "title":"Information message", "subTitle":"", "description":"", "groupName": "Other Messages"}]);
		});
		opaTest("Check message strip on a table inside section", function(Given, When, Then) {
			When.onTheObjectPage
				.iCloseMessagePopover();
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar-overflowButton")
				.and
				.iClickTheButtonWithId("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::addEntry");
			Then.onTheObjectPage
				.iCheckMessageStripValueOnTable("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", "Error", "The table contains errors.");
		});
		opaTest("Click message in message popover and check focus", function(Given, When, Then) {
			When.onTheObjectPage
				.iToggleMessagePopoverDialog()
				.and
				.iClickOnNthMessageInMessagePopover(1);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("General Information")
				.and
				.iExpectFocusSetOnControlById("com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Supplier::Field-input");
		});
		opaTest("Close message popover and teardown app", function(Given, When, Then) {
			When.onTheObjectPage
				.iCloseMessagePopover();
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
