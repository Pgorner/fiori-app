sap.ui.define(["sap/ui/test/opaQunit", "sap/suite/ui/generic/template/js/StableIdHelper"],
	function(opaTest, StableIdHelper) {
		"use strict";

		QUnit.module("Object Page Address Facet Rendering");

		opaTest("Open the App and check the FE rendered column properties on the table - Semantic key, IBN and Contact Popup", function (Given, When, Then) {
			Given.iStartMyAppInSandbox("EPMProduct-manage_st,BusinessPartner-displayFactSheet#EPMProduct-manage_st", "manifestAddressFacet");
			When.onTheGenericListReport
				.iExecuteTheSearch();
			Then.onTheListReportPage
				.iCheckTheAutoColumnWidthCustomDataForTheColumn({ "min": 2, "max": 19 }, "listReport-ProductForEdit")
				.and
				.iCheckTheAutoColumnWidthCustomDataForTheColumn({ "min": 2, "max": 19 }, "listReport:::sProperty::Supplier:::sSemanticObject::EPMProduct:::sAction::manage")
				.and
				.iCheckControlPropertiesById("listReport:::sProperty::Supplier:::sSemanticObject::EPMProduct:::sAction::manage", { "visible": true, "width": "10rem" })
				.and
				.iCheckTheAutoColumnWidthCustomDataForTheColumn({ "min": 2, "max": 19, "visibleField": "to_Supplier/CompanyName" }, "listReport:::sTarget::to_Supplier:2f:40com.sap.vocabularies.Communication.v1.Contact");
		});

		opaTest("Navigate to OP and validate carousel in OP header", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(3);
			When.onTheObjectPage
				.iWaitForThePageToLoad("ObjectPage", "STTA_C_MP_Product");
			Then.onTheObjectPage
				.iCheckControlPropertiesById("headerContainer", { "visible": true, "scrollStep": 300, "showDividers": false });
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("headerContainer-scrl-next-button");
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("headerContainer-scrl-next-button");
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("headerContainer-scrl-prev-button");
		});

		opaTest("Check the object page form is displayed with four column layout in XL screen", function (Given, When, Then) {
			Then.onTheObjectPage
				.iCheckControlPropertiesById("GeneralInformationForm::Form--Form-layout", { "visible": true, "columnsXL": 4, "columnsL": 4, "columnsM": 3 });
		});

		opaTest("Check the Address Facet is rendered correctly", function (Given, When, Then) {
			Then.onTheObjectPage
				.theHeaderFacetCommunicationAddressIsRendered();
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Communication Address"])
				.and
				.theObjectPageDataFieldWithStableIdHasTheCorrectValue({
					StableId: StableIdHelper.getStableId({
						type: "ObjectPageSection",
						subType: "AddressDataField",
						sFacet: StableIdHelper.getStableId({
							type: "ObjectPage",
							subType: "Facet",
							sRecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							sAnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
						}),
						sAnnotationPath: "to_Supplier/to_Address/@com.sap.vocabularies.Communication.v1.Address"
					}),
					Field: "",
					Value : "Av Alicia Moreau de Justo 302\n1147 Buenos Aires\nArgentina"
				});
		});

		opaTest("Check the FE rendered column properties on the OP table - Object Page Self-Linking", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
			Then.onTheObjectPage
				.iCheckTheAutoColumnWidthCustomDataForTheColumn({ "min": 2, "max": 19 }, "to_ProductText:3a:3acom.sap.vocabularies.UI.v1.LineItem:3a:3aTable:::sProperty::Name:::sTarget::to_Product");
		});

		opaTest("The Section title is hidden when the title of the chart and section are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Product Sales Data");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(3, null, false)
				.and
				.iCheckControlPropertiesById("to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart", { "visible": true, "header": "Product Sales Data", "headerLevel": "H3" });
		});

		opaTest("The Section title is hidden when the title of the table and section are the same", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSelectSectionOrSubSectionByName("Sales Price");
			Then.onTheObjectPage
				.iCheckSectionOrSubSectionTitleVisibilityByIndex(5, null, false)
				.and
				.iCheckControlPropertiesById("to_ProductSalesPrice::com.sap.vocabularies.UI.v1.LineItem::Table", { "visible": true, "header": "Sales Price", "headerLevel": "H3"});
		});

		opaTest("Check the object page header form is displayed with four column layout in XL screen", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(2);
			Then.onTheObjectPage
				.iCheckControlPropertiesByControlType("sap.ui.layout.Grid", { "visible": true, "defaultSpan": "XL3 L3 M4 S12" });
		});

		opaTest("Check for discard draft confirmation popup on external navigation when set to always in manifest", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateToRelatedApp(0);
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Warning")
				.and
				.iShouldSeeTheDialogWithContent("You've made changes to this object.\nWhat would you like to do?");
			When.onTheGenericObjectPage
				.iSelectTheOptionFromDiscardDraftPopUp("Keep Draft")
				.and
				.iClickTheButtonOnTheDialog("OK");
			Then.onTheGenericListReport
				.iSeeShellHeaderWithTitle("Business Partners");
			Then.iTeardownMyApp();
		});
	}
);
