sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("List Report - Grid Table");

		if (sap.ui.Device.browser.safari) {
			opaTest("Safari detected - SKIPPED", function (Given, When, Then) {
				Opa5.assert.expect(0);
			});
		} else {

			opaTest("Delete button, scrollThreshold and FE rendered column checks in the Grid Table", function (Given, When, Then) {
				Given.iStartMyAppInSandbox("EPMProduct-manage_st,BusinessPartner-displayFactSheet#EPMProduct-manage_st", "manifestLRGridTable");
				When.onTheGenericListReport
					.iExecuteTheSearch();
				Then.onTheListReportPage
					.iCheckControlPropertiesById("GridTable", { "scrollThreshold": 300 })
					.and
					.iCheckControlPropertiesById("listReport:::sSemanticObject::EPMProduct:::sAction::manage1", { "visible": true, "sortProperty": "", "filterProperty": "", "showFilterMenuEntry": false })
					.and
					.iCheckControlPropertiesById("listReport:::sProperty::Supplier:::sSemanticObject::EPMProduct:::sAction::manage", { "visible": true, "width": "10rem" })
					.and
					.iCheckControlPropertiesById("listReport:::sTarget::to_Supplier:2f:40com.sap.vocabularies.Communication.v1.Contact", { "visible": true, "width": "20rem" })
					.and
					.iCheckTableToolbarControlProperty({ "deleteEntry": [true, false] }, null, "gridTable");
				When.onTheGenericListReport
					.iSelectListItemsByLineNo([0]);
				Then.onTheListReportPage
					.iCheckTableToolbarControlProperty({ "deleteEntry": [true, true] }, null, "gridTable");
				When.onTheGenericListReport
					.iClickTheButtonWithId("deleteEntry");
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Delete");
			});

			opaTest("Navigate to OP and check scrollThreshold and FE rendered column properties on the Grid Table", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Cancel")
					.and
					.iNavigateFromListItemByLineNo(3);
				Then.onTheGenericObjectPage
					.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15");
				When.onTheGenericObjectPage
					.iSelectSectionOrSubSectionByName("General Information", "Product Texts");
				Then.onTheObjectPage
					.iCheckControlPropertiesById("to_ProductText::com.sap.vocabularies.UI.v1.LineItem::gridTable", { "scrollThreshold": 300 })
					.and
					.iCheckControlPropertiesById("sSemanticObject::EPMProduct:::sAction::manage_st", { "visible": true, "sortProperty": "", "filterProperty": "" })
					.and
					.iCheckControlPropertiesById("sProperty::Name:::sTarget::to_Product", { "visible": true, "sortProperty": "Name", "filterProperty": "Name", "width": "16rem" })
					.and
					.iCheckControlPropertiesById("sSemanticObject::EPMProduct:::sAction::manage_stta", { "visible": true, "width": "auto" })
					.and
					.iCheckControlPropertiesById("sProperty::Language:::sSemanticObject::EPMProduct:::sAction::displayFactSheet", { "visible": true, "width": "3rem" });
			});

			opaTest("Navigate back to LR and check the navigated row is highlighted in Grid Table", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iClickTheBackButtonOnFLP();
				Then.onTheListReportPage
					.iShouldSeeTheNavigatedRowHighlightedInUITables(3, true, "GridTable");
			});

			opaTest("Remove and Add column of type Communication.Contact from the personalisation dialog", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheButtonOnTableToolBar("Settings", "listReport");
				Then.onTheListReportPage
					// remove column from P13nDialog
					.iAddColumnFromP13nDialog("SupplierContact")
				When.onTheGenericListReport
					.iClickTheButtonHavingLabel("OK");
				Then.onTheListReportPage
					.iCheckTableColumnVisibility("SupplierContact", false, "STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--GridTable");
				When.onTheListReportPage
					.iClickTheButtonOnTableToolBar("Settings", "listReport");
				Then.onTheListReportPage
					.iAddColumnFromP13nDialog("SupplierContact");
				When.onTheGenericListReport
					.iClickTheButtonHavingLabel("OK");
				Then.onTheListReportPage
					.iCheckTableColumnVisibility("SupplierContact", true, "STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--GridTable");
			});

			opaTest("Open the OP of draft item and check no discard draft confirmation popup appears on external navigation when set to never in manifest", function (Given, When, Then) {
				When.onTheGenericListReport
					.iNavigateFromListItemByLineNo(2);
				When.onTheGenericObjectPage
					.iNavigateToRelatedApp(0);
				Then.onTheGenericListReport
					.iSeeShellHeaderWithTitle("Business Partners");
				Then.iTeardownMyApp();
			});
		}
	});
