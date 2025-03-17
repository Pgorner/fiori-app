sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Object Page Rendering");

		opaTest("The Title is rendered correctly", function(Given, When, Then) {
			Given.iStartMyAppInDemokit("sttaproducts#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)");
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheControlWithId("objectImage")
				.and
				.theButtonWithIdIsEnabled("edit", true)
				.and
				.theButtonWithLabelIsEnabled("Delete", true);
		});

		opaTest("Check the Invisible text for the Edit button", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iCheckControlPropertiesById("template:::ObjectPageAction:::EditText", { "text": "Edit: Notebook Basic 15" });
		});

		opaTest("Check for the CSS class 'sapMShowEmpty-CTX' is set for the Objectpage header contents", function (Given, When, Then) {
			Then.onTheObjectPage
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::Form")
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "header::headerEditable::com.sap.vocabularies.UI.v1.Identification::AfterReferenceExtension")
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::Price::DataPoint")
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapMShowEmpty-CTX", "header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::StockLevel::BeforeReferenceExtension");
		});

		opaTest("Check the Keyboard shortcut command for custom action on the OP header and footer", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckTheCommandExecutionPropertiesForTheControl("objectPage", { "command": "HeaderCustomActionCommand", "visible": true, "shortcut": "Ctrl+K" });
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("action::ObjectPageCustomAction");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Hello from ObjectPage custom action!");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheListReportPage
				.iCheckTheCommandExecutionPropertiesForTheControl("objectPage", { "command": "FooterCustomActionCommand", "visible": true, "shortcut": "Ctrl+M" });
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("ObjectPageCustomAction2");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Hello from ObjectPage custom action!");
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("The Header Content breakout is rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.Identification::AfterReferenceExtension", {"visible": true})
				.and
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::StockLevel::BeforeReferenceExtension", {"visible": true});
		});

		opaTest("DataFieldWithUrl annotation is rendered as Link in OP header", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::OriginalLanguage::Field", { "visible": true, "value":"EN" })
				.and
				.iCheckControlPropertiesById("header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::OriginalLanguage::Field-link", { "visible": true, "text": "EN (English)", "href": "http://www.sap.com" });

		});

		opaTest("The icons are rendered correctly on the SmartForm", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.core.Icon", {"color": "Negative", "visible": true, "src": "sap-icon://account"})
				.and
				.iCheckControlPropertiesByControlType("sap.ui.core.Icon", {"color": "Positive", "visible": true, "src": "sap-icon://accept"});
		});

		opaTest("The Semantically Connected Field under Technical Data is rendered on the SmartForm with correct Value and Delimiters", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("template:::ObjectPageSection:::SemanticConnectedField:::sFacet::com.sap.vocabularies.UI.v1.FieldGroup:3a:3aTechnicalData:::sAnnotationPath:::40com.sap.vocabularies.UI.v1.ConnectedFields:23ProductDetails", {"visible": true})
				.and
				.iCheckControlPropertiesById("com.sap.vocabularies.UI.v1.ConnectedFields:23ProductDetails-display", {"visible": true, "text": "30.000 CM (cm) / 18.000 CM (cm) / 3.000 CM (cm)"});
		});

		opaTest("The Semantically Connected Field under General Information is rendered on the SmartForm with correct Value and Delimiters", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("template:::ObjectPageSection:::SemanticConnectedField:::sFacet::com.sap.vocabularies.UI.v1.FieldGroup:3a:3aGeneralInformation:::sAnnotationPath:::40com.sap.vocabularies.UI.v1.ConnectedFields:23ProductDetail1", {"visible": true})
				.and
				.iCheckControlPropertiesById("com.sap.vocabularies.UI.v1.ConnectedFields:23ProductDetail1-display", {"visible": true, "text": "Notebook Basic 15 - 956.00 EUR (European Euro)"});
		});

        opaTest("The Semantic actions are rendered correctly when criticality is configured with path", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("action::STTA_PROD_MAN.STTA_PROD_MAN_Entities::STTA_C_MP_ProductFavorites_remove::Determining", {"type": "Reject", "visible": true})
				.and
				.iCheckControlPropertiesById("edit", {"type": "Default", "visible": true});//Edit button is not Emphasized when criticality is defined for another button
		});

		opaTest("Clicking the image should show a popup with title and sub-title then close the popup", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheControlWithId("objectImage");
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("template:::ObjectPageHeader:::LightBox");
			When.onTheObjectPage
				.iCheckTheTitleAndSubtitleOfLightBoxControl("Notebook Basic 15","HT-1000");
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Close");
			Then.onTheGenericObjectPage
				.iShouldSeeTheControlWithId("objectImage");
		});

		opaTest("The Global & Determining Actions are rendered correctly", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.thePageShouldContainTheCorrectGlobalActions()
				.and
				.thePageShouldContainTheCorrectDeterminingActions();
		});

		opaTest("Check the Keyboard shortcut command for custom action on the OP SmartForm", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			Then.onTheObjectPage
				.iCheckTheCommandExecutionPropertiesForTheControl("GeneralInformation::Section", { "command": "FormActionCommand", "visible": true, "shortcut": "Ctrl+H" });
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("MyFormAction");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Hello from SmartForm breakout!");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("Check the Keyboard shortcut command for custom action on the OP table toolbar", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckTheCommandExecutionPropertiesForTheControl("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "command": "TableValidateCommand", "visible": false, "shortcut": "Ctrl+J" });
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0], true, "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable");
			Then.onTheObjectPage
				.iCheckTheCommandExecutionPropertiesForTheControl("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "command": "TableValidateCommand", "visible": true, "shortcut": "Ctrl+J" });
			When.onTheObjectPage
				.iClickTheButtonOnTableToolBar("Validate", "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Language undefined not yet supported");
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("OK");
		});

		opaTest("The Header Facets are rendered correctly", function (Given, When, Then) {
			When.onTheObjectPage
				.iScrollViewToPosition("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product", 0, 0);
			Then.onTheObjectPage
				.theHeaderFacetGeneralInformationIsRendered()
				.and
				.theHeaderFacetProductCategoryIsRendered()
				.and
				.theHeaderFacetPriceDataPointIsRendered()
				.and
				.theHeaderFacetStockAvailabilityDataPointIsRendered()
				.and
				.theHeaderFacetProductDescriptionPlainTextIsRendered()
				.and
				.theHeaderFacetSmartMicroChartIsAnnotatedAndIsRendered()
				.and
				.theHeaderFacetProgressIndicatorIsAnnotatedAndIsRendered()
				.and
				.theHeaderFacetRatingIndicatorIsRendered(true /* Aggregated */);
			
		});

		opaTest("The Contact Information popup should open when a contact is clicked", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLinkWithId("header::headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::to_Supplier::com.sap.vocabularies.Communication.v1.Contact::Field");
			Then.onTheObjectPage
				.theContactInformationShouldBeDisplayedFor("SAP", "Waldorf, Germany");
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Contacts");
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Contacts");
			When.onTheGenericObjectPage
				.iClickTheLink("Walter Winter");
			Then.onTheObjectPage
				.theContactInformationShouldBeDisplayedFor("Walter Winter", "Geteway Ave 950, 58503 Bismarck, North Dakota, US");
		});

		opaTest("The Contact Information popup should open when a new contact is clicked with the right information", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLink("Sally Spring");
			Then.onTheObjectPage
				.theContactInformationShouldBeDisplayedFor("Sally Spring", "Av Alicia Moreau de Justo 302, 1147 Buenos Aires, AR");
		});

		opaTest("Check the object page form is displayed with six column layout in XL screen", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Information");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("GeneralInformationForm::Form--Form-layout", { "visible": true, "columnsXL": 6, "columnsL": 4, "columnsM": 3 });
		});

		opaTest("DataFieldWithIBN link texts with TextArrangements are rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckTheGroupElementProperties("TechnicalData::EPMSalesOrder::display_sttabupa::GroupElement", { "visible": true, "enabled": true, "text": "100000046 (SAP)" })
				.and
				.iCheckTheGroupElementProperties("TechnicalData::EPMManageProduct::displayFactSheet::GroupElement", { "visible": true, "enabled": true, "text": "Computer Systems (Notebooks)" });
		});

		opaTest("The Icon is rendered correctly under Sample Icon Fields", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckTheGroupElementProperties("TechnicalData::SampleIcon::GroupElement", { "visible": true, "src": "sap-icon://account", "color": "Negative" })
				.and
				.iCheckTheGroupElementProperties("TechnicalData::sap-icon-accept::GroupElement", { "visible": true, "src": "sap-icon://accept", "color": "Positive" });
		});

		opaTest("Check the Facets are rendered correctly and Check table column width for FE rendered column", function(Given, When, Then) {
			Then.onTheObjectPage
				.theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.iCheckControlPropertiesById("23SalesPriceAreaChart", {"visible": true, "width": "20rem", "importance": "High"})
				.and
				.iCheckControlPropertiesById("sAction::STTA_PROD_MAN.STTA_PROD_MAN_Entities:2fSTTA_C_MP_ProductCopyText", {"visible": true, "width": "15rem"});
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(1,1);
			Then.onTheObjectPage
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly()
				.and
				.theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationRendersCharts()
				.and
				.iSearchInTableToolbarOrSearchInputField();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue");
			Then.onTheObjectPage
				.theFacetSalesRevenueIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByIndex(8);
			Then.onTheObjectPage
				.theFacetContactsIsRenderedCorrectly();
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data");
			Then.onTheObjectPage
				.theExtensionFacetSalesDataIsRenderedCorrectly();

			//First level ReferenceFacet - action button rendering
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Target Rating")
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "text": "Manage Rating"});
			
			//Reference facet inside CollectionFacet - action button rendering
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Rating (CollectionFacet)");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.m.Button", {"visible": true, "text": "Manage Rating 1"});
		});

		opaTest("The Subsection title is hidden when the title of the table and subsection are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(1, 1, false)
				.and
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "header": "Product Texts", "headerLevel": "H4" });
		});

		opaTest("Check the MultiSelect and SelectAll button for the responsive table on OP", function (Given, When, Then) {
			Then.onTheListReportPage
				.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", { "visible": true, "mode": "MultiSelect", "multiSelectMode": "SelectAll" });
		});

		opaTest("The Subsection title is hidden when the title of the chart and subsection are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Data", "Product Sales Data");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(2, 0, false)
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "header": "Product Sales Data", "headerLevel": "H4" });
		});

		opaTest("Check the SmartForm Group title is not displayed if the Group title and the section title are the same ", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Target Rating");
			Then.onTheObjectPage
				.iCheckSmartFormGroupTitleVisibility("ProductRating::FormGroup", false);
		});

		opaTest("The Subsection title is hidden and the subsection title is set as the control title for the custom section", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue", "Target Sales Data");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(3, 1, false)
				.and
				.iCheckControlPropertiesById("SalesDataSubsectionID", { "visible": true, "header": "Target Sales Data" })
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapUiTableOnObjectPageAdjustmentsForSection", "to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Section");
		});

		opaTest("The Section title is hidden and the section title is set as the control title for the the reuse component", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Reuse Sales Data");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(9, null, false)
				.and
				.iCheckControlPropertiesById("reuseComponents.simple::simple::ComponentContainerContent---View--SalesDataReuseComponent", { "visible": true, "header": "Reuse Sales Data" })
				.and
				.theCssClassCorrectlySetForTheControlWithId("sapUiTableOnObjectPageAdjustmentsForSection", "STTA_MP.reuseComponents.simple::simple::ComponentSection");
		});

		//Based on the property hideChevronForUnauthorizedExtNav in manifest the chevron visibility is maintained where navigation is not possible
		opaTest("Row Action Chevron Rendering in Table", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue");
			Then.onTheObjectPage
				.theChevronIsVisibleInSalesRevenueTable(false);
			
		});

		opaTest("Dynamic Side Content Validation- Show Content", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue")
				.and
				.iClickTheButtonHavingLabel("Show File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", {"showSideContent": true});
		});

		opaTest("Dynamic Side Content Validation- Hide Content, inline create sort & subsection rendering", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Hide File");
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.DynamicSideContent", {"showSideContent": false})
				.and
				.iCheckTableForDefaultInlineCreateSort(true);
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Revenue", "Target Sales Data");
			Then.onTheObjectPage
				.theSmartTableIsVisible("to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Table");
		});

		opaTest("Focus set on First Editable Input Field of Header section", function(Given, When, Then){
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			Then.onTheGenericObjectPage
				.theButtonWithIdIsEnabled("edit", true);
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
			Then.onTheGenericObjectPage
				.iExpectFocusSetOnControlById("headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Title::Field-input");
		});

		opaTest("Check the object page header form is displayed with six column layout in XL screen", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.Grid", { "visible": true, "defaultSpan": "XL2 L3 M4 S12" });
		});

		opaTest("DataFieldWithUrl annotation is rendered as Link in OP header in Edit mode ", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::OriginalLanguage::Field", { "visible": true, "value":"EN" })
				.and
				.iCheckControlPropertiesById("headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::OriginalLanguage::Field-link", { "visible": true, "text": "EN (English)", "href": "http://www.sap.com" });
		});

		opaTest("Reused Components are refreshed on changing the Price value", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			When.onTheObjectPage
				.iEnterValueInField("900.00", "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Price::Field-input");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Refreshed Price");
		});

		opaTest("Reused Components are refreshed on changing the Supplier value", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information");
			When.onTheObjectPage
				.iEnterValueInField("100000047", "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation::Supplier::Field-input");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Refreshed Supplier");
			Then.iTeardownMyApp();
		});
	}
);
