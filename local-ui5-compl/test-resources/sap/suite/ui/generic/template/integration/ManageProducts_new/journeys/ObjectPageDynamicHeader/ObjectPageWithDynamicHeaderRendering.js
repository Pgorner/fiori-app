sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {
		"use strict";

		QUnit.module("Object Page Dynamic Header Rendering");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

		opaTest("The Dynamic header & pin header is rendered correctly", function (Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)", "manifestDynamicHeaderInFCL", {"sapUiLayer": "VENDOR"});
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("objectImage", {"displayShape": "Square"})
				.and
				.theObjectMarkerIsInContentAggregation()
				.and
				.theLayoutActionsShouldBeSeparatedFromGlobalActions()
				.and
				.iCheckControlPropertiesById("objectPage", {"toggleHeaderOnTitleClick": true});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheControlWithId("template::ObjectPage::ObjectPageVariant")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-collapseBtn")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-pinBtn");
		});

		opaTest("Check for the custom message on the OP header", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.MessageStrip", { "visible": true, "type": "Warning", "text": "Sample showing custom message strip on OP header. Message shown if price per unit > 500." });
		});

		opaTest("Check for the CSS class 'sapMShowEmpty-CTX' is set for the Objectpage header contents", function (Given, When, Then) {
			Then.onTheObjectPage
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "ObjectPageHeader:::DynamicHeaderContentFlexBox")
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::Form")
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::Price::DataPoint");
		});

		opaTest("Check the heading level value for the Object page header title", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("template::ObjectPage::ObjectPageDynamicHeaderTitle", { "text": "Notebook Basic 15", "level": "H2" });
		});

		opaTest("The Expand Header Button is correctly rendered", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("objectPage-OPHeaderContent-collapseBtn");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("template::ObjectPage::ObjectPageHeader-expandBtn");
		});

		opaTest("Check the heading level value for the Section title", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("SalesData::Section", { "title": "Sales Data", "titleLevel": "H3" });
		});

		opaTest("Check the heading level value for the SubSection title", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Information");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("GeneralInformationForm::SubSection", { "title": "Product Information", "titleLevel": "H4" });
		});

		opaTest("Check the heading level value for the Smartform Group title", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.core.Title", { "text": "General Data", "level": "H5" });
		});

		opaTest("Check the heading level value for the table control title when the subsection title is hidden", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts Table");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "header": "Product Texts Table", "headerLevel": "H4" });
		});

		opaTest("Check the heading level value for the chart control title when the subsection title is hidden", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data", "Sales Data Chart");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "header": "Sales Data Chart", "headerLevel": "H4" });
		});

		opaTest("The Default Inline Create Sort is disabled", function(Given, When, Then) {
			Then.onTheObjectPage
				.iCheckTableForDefaultInlineCreateSort(false);
		});

		opaTest("The Expand/Collapse Header Button is not rendered in Edit Mode", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("objectPage", {"toggleHeaderOnTitleClick": false});
			Then.iTeardownMyApp();
		});
	}
	}
);
