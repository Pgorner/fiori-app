/*** Object Page Assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5","sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaResourceBundle", "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest", "sap/suite/ui/generic/template/integration/Common/OpaDataStore"],

	function (Opa5, PropertyStrictEquals, OpaResourceBundle, OpaManifest, OpaDataStore) {
		'use strict';

		return function (prefix, viewName, viewNamespace, entityType, entitySet) {

			return {

				theDraftActivateConfirmationDialogIsRenderedWithSaveButton: function (bSaveBtnVisibility) {
					return this.waitFor ({
						id: prefix+"ShowConfirmationOnDraftActivate",
						success: function (oDialog) {
							if(oDialog.getBeginButton().getVisible() === bSaveBtnVisibility ) {
								if(bSaveBtnVisibility === true) {
									Opa5.assert.ok(true, "The Draft Activation Confirmation Dialog is rendered with the Save button");
								} else {
									Opa5.assert.ok(true, "The Draft Activation Confirmation Dialog is rendered without the Save button");
								}
							}
						},
						errorMessage: "The Draft Activation Confirmation Dialog is not rendered with correct buttons"
					});
				},

				// check if the Object Page has the correct Global Actions by:
				// i. finding the Object Page Header by control type
				// ii. check if each buttons' text against either the manifest, annotations, icon, or draft status
				thePageShouldContainTheCorrectGlobalActions: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageHeader",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						success: async function (objectPageHeader) {
							var sShareActionText = "Share",
								aActionButton = [], aActionTextsThatAppear = [], aActionTextThatShouldAppear = [], aIdentificationAnnotations = [],
								mCustomActions = {},
								oManifestJSONModel;

							// get the action buttons' text from the object header
							aActionButton = objectPageHeader[0].getActions();
							for (var i = 0; i < aActionButton.length; i++) {
								if (aActionButton[i].isA("sap.uxap.ObjectPageHeaderActionButton") || aActionButton[i].isA("sap.m.MenuButton")) { // make sure to check only buttons (not e.g. HBox, etc...)
									if (aActionButton[i].getIcon() === "sap-icon://action") { // Share action
										aActionTextsThatAppear.push(sShareActionText);
									} else {
										aActionTextsThatAppear.push(aActionButton[i].getText());
									}
								}
							}
							
							// Wait until the manifest data is loaded
							await this.iWaitForPromise(OpaManifest.loadManifestData());
							// get the custom actions text from the manifest
							oManifestJSONModel = OpaManifest.getManifestModel();
							mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/sap.ui.generic.app/" + entitySet + "/Header/Actions");
							for (var customAction in mCustomActions) {
								if (mCustomActions.hasOwnProperty(customAction)) {
									if (!mCustomActions[customAction].determining) {
										aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
									}
								}
							}

							// get the annotated actions text from the metamodel
							aIdentificationAnnotations = entityType["com.sap.vocabularies.UI.v1.Identification"];
							for (var i = 0; i < aIdentificationAnnotations.length; i++) {
								if (aIdentificationAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
									aIdentificationAnnotations[i]["com.sap.vocabularies.UI.v1.Importance"].EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High" &&
									(!aIdentificationAnnotations[i].Determining || aIdentificationAnnotations[i].Determining.Bool === "false")) {
									aActionTextThatShouldAppear.push(aIdentificationAnnotations[i].Label.String);
								}
							}

							// get the 'Delete' and 'Edit' text actions if Draft Root is annotated
							if (entitySet["com.sap.vocabularies.Common.v1.DraftRoot"]) {
//								aActionTextThatShouldAppear.push(OpaResourceBundle.template.ObjectPage.getProperty("DELETE"), OpaResourceBundle.template.ObjectPage.getProperty("EDIT"));
								aActionTextThatShouldAppear.push("Delete", "Edit");
							}

							// push the 'Share' action to the texts that should appear
							aActionTextThatShouldAppear.push(sShareActionText);

							// compare the actions' text that should appear vs. the actions' text that actually appear
							for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
								for (var j = 0; j < aActionTextsThatAppear.length; j++) {
									if (aActionTextsThatAppear[j] === aActionTextThatShouldAppear[i]) {
										Opa5.assert.ok(true, "Global Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
										break;
									}
									else if (j === aActionTextsThatAppear.length - 1) {
										Opa5.assert.ok(false, "Global Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
									}
								}
							}
						},
						errorMessage: "The Global Actions on the Object Page Header is not rendered correctly"
					});
				},
				// check if the Object Page has the correct Determining Actions by:
				// i. finding the Object Page Layout by control type
				// ii. check if each buttons' text against either the manifest or annotations
				thePageShouldContainTheCorrectDeterminingActions: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: async function (objectPage) {
							var aButton = [], aActionTextsThatAppear = [], aActionTextThatShouldAppear = [], aIdentificationAnnotations = [];
							var oFooter = objectPage[0].getFooter();
							var mCustomActions = {}, oManifestJSONModel;

							// get the action buttons' text from the object header
							aButton = oFooter.getContent();
							for (var i = 0; i < aButton.length; i++) {
								if (aButton[i].isA("sap.m.Button") && aButton[i].getVisible()) {
									aActionTextsThatAppear.push(aButton[i].getText());
								}
							}
							
							// Wait until the manifest data is loaded
							await this.iWaitForPromise(OpaManifest.loadManifestData());

							// get the custom actions text from the manifest
							oManifestJSONModel = OpaManifest.getManifestModel();
							mCustomActions = oManifestJSONModel.getProperty("/sap.ui5/extends/extensions/sap.ui.controllerExtensions/sap.suite.ui.generic.template.ObjectPage.view.Details/sap.ui.generic.app/" + entitySet + "/Header/Actions");
							for (var customAction in mCustomActions) {
								if (mCustomActions.hasOwnProperty(customAction)) {
									if (mCustomActions[customAction].determining) {
										aActionTextThatShouldAppear.push(mCustomActions[customAction].text);
									}
								}
							}

							// get the annotated actions text from the metamodel
							aIdentificationAnnotations = entityType["com.sap.vocabularies.UI.v1.Identification"];
							for (var i = 0; i < aIdentificationAnnotations.length; i++) {
								if (aIdentificationAnnotations[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" &&
									aIdentificationAnnotations[i]["com.sap.vocabularies.UI.v1.Importance"].EnumMember === "com.sap.vocabularies.UI.v1.ImportanceType/High" &&
									aIdentificationAnnotations[i].Determining && aIdentificationAnnotations[i].Determining.Bool === "true") {
									aActionTextThatShouldAppear.push(aIdentificationAnnotations[i].Label.String);
								}
							}

							// compare the actions' text that should appear vs. the actions' text that actually appear
							for (var i = 0; i < aActionTextThatShouldAppear.length; i++) {
								for (var j =0; j < aActionTextsThatAppear.length; j++) {
									if (aActionTextsThatAppear[j] === aActionTextThatShouldAppear[i]) {
										Opa5.assert.ok(true, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is rendered correctly.");
										break;
									}
									else if (j === aActionTextsThatAppear.length - 1) {
										Opa5.assert.ok(false, "Determining Action '" + aActionTextThatShouldAppear[i] + "' is not rendered correctly.");
									}
								}
							}
						},
						errorMessage: "The Determining Actions in the Object Page Footer are not rendered correctly"
					});
				},
				// check if the Header Facet "General Information" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetGeneralInformationIsRendered: function () {
					// annotation path: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformationForHeader"
					var sFacetName = "General Information";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.FieldGroup)" + "(.*GeneralInformationForHeader)" + "(.*Form)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							Opa5.assert.equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 6, "There should be 5 items in the VBox");
							// Label
							var sText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFieldGroupLabel");
							Opa5.assert.equal(aItems[0].getText(), sText, sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							Opa5.assert.ok(aItems[1].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), sFacetName + " - " + "The smart label is rendered");
							Opa5.assert.ok(aItems[1].getItems()[0].getShowColon(), sFacetName + " - " + "The smart label is rendered with a colon");
							Opa5.assert.ok(aItems[1].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), sFacetName + " - " + "The smart field is rendered");
							Opa5.assert.ok(aItems[2].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), sFacetName + " - " + "The smart label is rendered");
							Opa5.assert.ok(aItems[2].getItems()[0].getShowColon(), sFacetName + " - " + "The smart label is rendered with a colon");
							Opa5.assert.ok(aItems[2].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), sFacetName + " - " + "The smart field is rendered");
							// Link
							//commented the below assertion as contact popup is not added in xml view as an inline fragment. It is loaded on runtime.
							//equal(aItems[4].getItems()[0].getMetadata().getName(), "sap.m.QuickView", sFacetName + " - " + "The quick view is rendered");
							Opa5.assert.ok(aItems[4].getItems()[0].isA("sap.m.Label"), sFacetName + " - " + "The label is rendered");
							Opa5.assert.ok(aItems[4].getItems()[0].getShowColon(), sFacetName + " - " + "The label is renderedwith a colon");
							Opa5.assert.ok(aItems[4].getItems()[1].isA("sap.m.Link"), sFacetName + " - " + "The link is rendered");
						},
						errorMessage:  sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Product Category" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetProductCategoryIsRendered: function () {
					// annotation path: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
					var sFacetName = "Product Category";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.Identification)" + "(.*Form)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							Opa5.assert.equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 3, "There should be 3 items in the VBox");
							// Label
							var sText = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductCategory");
							Opa5.assert.equal(aItems[0].getText(), sText, sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							Opa5.assert.ok(aItems[1].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), sFacetName + " - " + "The smart label is rendered");
							Opa5.assert.ok(aItems[1].getItems()[0].getShowColon(), sFacetName + " - " + "The smart label is rendered with a colon");
							Opa5.assert.ok(aItems[1].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), sFacetName + " - " + "The smart field is rendered");
							Opa5.assert.ok(aItems[2].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), sFacetName + " - " + "The smart label is rendered");
							Opa5.assert.ok(aItems[2].getItems()[0].getShowColon(), sFacetName + " - " + "The smart label is rendered with a colon");
							Opa5.assert.ok(aItems[2].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), sFacetName + " - " + "The smart field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Price" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetPriceDataPointIsRendered: function () {
					// annotation path: "@com.sap.vocabularies.UI.v1.DataPoint#Price"
					var sFacetName = "Price DataPoint";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.DataPoint)" + "(.*Price)" + "(.*DataPoint)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							Opa5.assert.equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 2, "There should be 2 items in the VBox");
							// Label
							Opa5.assert.equal(aItems[0].getText(), "Price", sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							Opa5.assert.ok(aItems[1].isA("sap.ui.comp.smartfield.SmartField"), sFacetName + " - " + "The smart field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Stock Availability" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetStockAvailabilityDataPointIsRendered: function () {
					// annotation path: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
					var sFacetName = "Stock Availability DataPoint";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*com.sap.vocabularies.UI.v1.DataPoint)" + "(.*StockLevel)" + "(.*DataPoint)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							Opa5.assert.equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 2, "There should be 2 items in the VBox");
							// Label
							Opa5.assert.equal(aItems[0].getText(), "Availability", sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							Opa5.assert.ok(aItems[1].isA("sap.ui.comp.smartfield.SmartField"), sFacetName + " - " + "The smart field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Plain Text" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetProductDescriptionPlainTextIsRendered: function () {
					// annotation path: "to_ProductTextInCurrentLang/@com.sap.vocabularies.UI.v1.FieldGroup#PlainText"
					var sFacetName = "Product Description Plain Text";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*to_ProductTextInOriginalLang)" + "(.*com.sap.vocabularies.UI.v1.FieldGroup)" + "(.*PlainText)" + "(.*PlainTextVBox)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							Opa5.assert.equal(aControl.length, 1, "Only 1 'sap.m.VBox' control is found");

							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 2, "There should be 2 items in the VBox");
							// Label
							Opa5.assert.equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescription"), sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							Opa5.assert.ok(aItems[1].isA("sap.m.Text"), sFacetName + " - " + "The text field is rendered");

						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// check if the Header Facet "Smart Micro Chart" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetSmartMicroChartIsAnnotatedAndIsRendered: function() {
					return this.waitFor({
						id: new RegExp("(.*SmartMicroChartVBox)"),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(aControl) {
							var bChartIsAnnotated = false;
							var aFacetAnnotations = entityType["com.sap.vocabularies.UI.v1.HeaderFacets"];

							// check for smart micro area and bullet charts based on annotations
							for(var i = 0; i < aFacetAnnotations.length; i++) {
								if (aFacetAnnotations[i].Target.AnnotationPath.indexOf("@com.sap.vocabularies.UI.v1.Chart") >= 0) {
									var bSmartAreaMicroChartFound = false, bSmartBulletMicroChartFound = false;
									bChartIsAnnotated = true;

									for (var j = 0; j < aControl.length; j++) {
										if (aControl[j].isA("sap.m.VBox")) {
											var aVBoxItems = aControl[j].getItems();
											var oTitleLabel, oSubTitleLabel, oFooterLabel;

											if (!bSmartAreaMicroChartFound || !bSmartBulletMicroChartFound) {
												for (var k = 0; k < aVBoxItems.length; k++) {
													if (aVBoxItems[k].isA("sap.ui.comp.smartmicrochart.SmartMicroChart")) {
														oTitleLabel = aVBoxItems[0];
														oSubTitleLabel = aVBoxItems[1];
														oFooterLabel = aVBoxItems[3];
														var oSmartMicroChart = aVBoxItems[k];

														if (oSmartMicroChart.getChartType() === "Area") {
															Opa5.assert.equal(oTitleLabel.getVisible(), true, "The title inside the VBox which contains the Smart Area Micro Chart is rendered correctly");
															Opa5.assert.equal(oSubTitleLabel.getVisible(), true, "The subtitle inside the VBox which contains the Smart Area Micro Chart is rendered correctly");
															Opa5.assert.equal(oFooterLabel.getVisible(), true, "The footer inside the VBox which contains the Smart Area Micro Chart is rendered correctly");

															bSmartAreaMicroChartFound = true;
															break;
														}
														if (oSmartMicroChart.getChartType() === "Bullet") {
															Opa5.assert.equal(oTitleLabel.getVisible(), true, "The title inside the VBox which contains the Smart Bullet Micro Chart is rendered correctly");
															Opa5.assert.equal(oSubTitleLabel.getVisible(), true, "The subtitle inside the VBox which contains the Smart Bullet Micro Chart is rendered correctly");
															Opa5.assert.equal(oFooterLabel.getVisible(), true, "The footer inside the VBox which contains the Smart Bullet Micro Chart is rendered correctly");

															bSmartBulletMicroChartFound = true;
															break;
														}
													}
												}
											}
										}
									}
								}
							}

							if (!bChartIsAnnotated) {
								Opa5.assert.ok(true, "The Smart Micro Chart is not annotated");
							}
							else {
								bSmartAreaMicroChartFound ?	Opa5.assert.ok(true, "The Smart Area Micro Chart is annotated and rendered correctly") : Opa5.assert.notOk(true, "The Smart Area Micro Chart is annotated and did not render correctly");
								bSmartBulletMicroChartFound ? Opa5.assert.ok(true, "The Smart Bullet Micro Chart is annotated and rendered correctly") : Opa5.assert.notOk(true, "The Smart Bullet Micro Chart is annotated and did not render correctly");
							}
						},
						errorMessage: "The Smart Micro Chart was not rendered correctly"
					});
				},
				// check if the Header Facet "Progress Indicator" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetProgressIndicatorIsAnnotatedAndIsRendered: function(){
					// annotation path: "to_ProductSalesRevenue/@com.sap.vocabularies.UI.v1.DataPoint"
					var sFacetName = "Availability";
					var sHeaderRegExp = new RegExp("(.*ProgressIndicatorVBox)");
					return this.waitFor({
						id: sHeaderRegExp,
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(aControl) {
							// Testing Annotations
							// Assert header facet annotations
							var sExpectedAnnotation = "to_StockAvailability/@com.sap.vocabularies.UI.v1.DataPoint#Quantity";
							var aHeaderFacetAnnotations = entityType["com.sap.vocabularies.UI.v1.HeaderFacets"];
							var oProgressIndicatorFacet;
							for (var i = 0; i < aHeaderFacetAnnotations.length; i++) {
								if (aHeaderFacetAnnotations[i].Target.AnnotationPath === sExpectedAnnotation) {
									oProgressIndicatorFacet = aHeaderFacetAnnotations[i];
									return;
								}
							}

							Opa5.assert.ok(oProgressIndicatorFacet, sFacetName + " - The Header Facet is annotated as expected");

							// Testing Rendering
							Opa5.assert.equal(aControl.length, 1, sFacetName + " - Only 1 'sap.m.VBox' control is found");
							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 4, sFacetName + " - There should be 4 items in the VBox");
							Opa5.assert.equal(aItems[0].getText(), sFacetName, sFacetName + " - The Title is rendered correctly");
							Opa5.assert.equal(aItems[1].getText(), "Progress Indicator", sFacetName + " - The Subtitle is rendered correctly");
							var oProgressIndicator = aItems[2];
							Opa5.assert.ok(oProgressIndicator.isA("sap.m.ProgressIndicator"), sFacetName + " - The ProgressIndicator control is rendered correctly");
							Opa5.assert.equal(oProgressIndicator.getPercentValue(), 84.66666666666667, sFacetName + " - The percent value is rendered correctly");
							Opa5.assert.equal(oProgressIndicator.getDisplayValue(), "127 of 150 EA", sFacetName + " - The display value is rendered correctly");
							Opa5.assert.equal(oProgressIndicator.getState(), "Success", sFacetName + " - The state is rendered correctly");
							Opa5.assert.equal(oProgressIndicator.getCustomData().length, 2, sFacetName + " - The control has custom data as expected");
							Opa5.assert.equal(aItems[3].getText(), "Quantity", sFacetName + " - The Footer is rendered correctly");
						},
						errorMessage: sFacetName + " -  The facet was not rendered correctly"
					});
				},
				// check if the Header Facet "Rating Indicator" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetRatingIndicatorIsRendered: function (bAggregated) {
					return this.waitFor({
//						this is the version of the demokit which was not taken over to the technical app (check sample.stta.manage.products)
//						id: prefix + "header::headerEditable::to_ProductRating::com.sap.vocabularies.UI.v1.DataPoint::Aggregated::RatingIndicator",
						id: prefix + "header::headerEditable::to_ProductRating::com.sap.vocabularies.UI.v1.DataPoint::Rating::RatingIndicator",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						matchers: [	new PropertyStrictEquals({
							name: "iconSize",
							value: "1.375rem"
						}),
							new PropertyStrictEquals({
								name: "maxValue",
								value: 5
//								value: 3
							}),
							new PropertyStrictEquals({
								name: "value",
								value: 4
//								value: 2.5
							})
							// For Fiori 3, enabled property will be true, editable property will be false. Once, Fiori 3
							// feature will be default feature, then this test has to be adapted.
							// new PropertyStrictEquals({
							// 	name: "enabled",
							// 	value: false
							// })
						],
						success: function (oRatingIndicator) {
							Opa5.assert.ok(true, "The Rating Indicator is rendered");

							var sActualTitle = "", sExpectedTitle = "", oSubTitleLabel, oFooterLabel;
							var aVBoxItems = oRatingIndicator.getParent().getItems();

							sActualTitle = aVBoxItems[0].getText();
							sExpectedTitle = bAggregated ? "Product Rating" : "Average User Rating";
							Opa5.assert.equal(sActualTitle, sExpectedTitle, "The title inside the VBox which contains the Rating Indicator is rendered correctly");

							oSubTitleLabel = aVBoxItems[1];
							Opa5.assert.equal(oSubTitleLabel.getVisible(), bAggregated, "The subtitle inside the VBox which contains the Rating Indicator is rendered correctly");

							oFooterLabel = aVBoxItems[3];
							// to get an indicator with subtitle choose the other one via matchers definition
							// Opa5.assert.equal(oFooterLabel.getVisible(), bAggregated, "The footer inside the VBox which contains the Rating Indicator is rendered correctly");

							if (bAggregated) {
								Opa5.assert.equal(oSubTitleLabel.getText(), "Rating Indicator", "The subtitle text inside the VBox which contains the Rating Indicator is rendered correctly");
								Opa5.assert.equal(oFooterLabel.getText(), "4.00 out of 5.00", "The footer text inside the VBox which contains the Rating Indicator is rendered correctly");
							}
						},
						error: function () {
							Opa5.assert.notOk(true, "The Rating Indicator is not rendered correctly");
						}
					});
				},
				// check if the Simple Header Facet is rendered correctly by:
				// i. finding the Object Page Layout using control type
				// ii. checking if the contents of the HBox is rendered correctly
				theSimpleHeaderFacetGeneralInformationIsRendered: function () {
					// annotation path: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformationForHeader"
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,

						success: function (aControl) {
							var a = aControl;
							var aHeaderContent = aControl[0].getHeaderContent();
							Opa5.assert.ok(aHeaderContent[0].getItems()[0].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), "The smart label is rendered");
							Opa5.assert.ok(aHeaderContent[0].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[1].getItems()[0].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), "The smart label is rendered");
							Opa5.assert.ok(aHeaderContent[1].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[2].getItems()[0].getItems()[0].isA("sap.m.QuickView"), "The quick view is rendered");
							Opa5.assert.ok(aHeaderContent[2].getItems()[0].getItems()[1].isA("sap.m.Label"), "The label is rendered");
							Opa5.assert.ok(aHeaderContent[2].getItems()[0].getItems()[2].isA("sap.m.Link"), "The link is rendered");
							Opa5.assert.ok(aHeaderContent[3].getItems()[0].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), "The smart label is rendered");
							Opa5.assert.ok(aHeaderContent[3].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[4].getItems()[0].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), "The smart label is rendered");
							Opa5.assert.ok(aHeaderContent[4].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[5].getItems()[0].getItems()[0].isA("sap.ui.comp.smartfield.SmartLabel"), "The smart label is rendered");
							Opa5.assert.ok(aHeaderContent[5].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[6].getItems()[0].getItems()[0].isA("sap.m.Label"), "The label is rendered");
							Opa5.assert.ok(aHeaderContent[6].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[7].getItems()[0].getItems()[0].isA("sap.m.Label"), "The label is rendered");
							Opa5.assert.ok(aHeaderContent[7].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[8].getItems()[0].getItems()[0].isA("sap.m.Label"), "The label is rendered");
							Opa5.assert.ok(aHeaderContent[8].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[9].getItems()[0].getItems()[0].isA("sap.m.Label"), "The label is rendered");
							Opa5.assert.ok(aHeaderContent[9].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
							Opa5.assert.ok(aHeaderContent[10].getItems()[0].getItems()[0].isA("sap.m.Label"), "The label is rendered");
							Opa5.assert.ok(aHeaderContent[10].getItems()[0].getItems()[1].isA("sap.ui.comp.smartfield.SmartField"), "The smart field is rendered");
						},
						errorMessage: "Simple Header facet is not rendered"
					});
				},
				// check if the Facet "General Information" is rendered correctly by:
				// i. finding a Smart Form by id
				// ii. checking the contents of the form
				theFacetProductInformationInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "GeneralInformationForm::SubSection",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oObjectPageSubSection) {
							var sExpectedTitle = "", sObjectPageSectionTitle = "", sObjectPageSubSectionTitle = "", aSmartFormGroups = [], oObjectPageSubSection;

							sObjectPageSubSectionTitle = oObjectPageSubSection.getTitle();
							sObjectPageSectionTitle = oObjectPageSubSection.getParent().getTitle();

							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductInfoFacetLabel");
							Opa5.assert.equal(sObjectPageSubSectionTitle, sExpectedTitle, "The Facet " + sObjectPageSubSectionTitle + "'s title inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");

							function fnFindContentContainingLabel(sExpectedLabel, oGrid){
								return oGrid.getContent && oGrid.getContent().find(function(oSmartForm){
									return oSmartForm.getGroups().find(function(oGroup){
										return oGroup.getTitle && oGroup.getTitle().getText() === sExpectedLabel;
									});
								});
							}

							var aExpectedLabels = [];
							aExpectedLabels.push(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@GeneralInfoFieldGroupLabel"));
							aExpectedLabels.push(OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@TechnicalData"));

							aExpectedLabels.forEach(function(sExpectedLabel){
								Opa5.assert.ok(oObjectPageSubSection.getBlocks().find(fnFindContentContainingLabel.bind(null, sExpectedLabel)),
									"The group label '" + sExpectedLabel + "' for the Facet " + sObjectPageSubSectionTitle + " inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");
							});

							var sExpectedLabel = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductCategory");

							Opa5.assert.ok(oObjectPageSubSection.getMoreBlocks().find(fnFindContentContainingLabel.bind(null, sExpectedLabel)),
								"The group label '" + sExpectedLabel + "' for the Facet " + sObjectPageSubSectionTitle + " inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");

								Opa5.assert.ok(oObjectPageSubSection.getBlocks().find(function(oGrid){
								return oGrid.getContent && oGrid.getContent().find(function(oSmartForm){
									return oSmartForm.getGroups().find(function(oGroup){
										return oGroup.getGroupElements().find(function(oGroupElement){
											return oGroupElement.getLabel() === "Sample Icon (Criticality EnumMember)" && oGroupElement.getElements()[0].isA("sap.ui.core.Icon");
										});
									});
								});
							}), "The Icon is rendered correctly under Sample Icon Field");

						},
						errorMessage: "The Facet ProductInformation inside the Facet General Information is not rendered correctly."
					});
				},
				// check if the Facet "Product Description and Supplier" inside General Information is rendered correctly by:
				// i. finding a Smart Table by id
				// ii. checking the contents of the table
				theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var sExpectedTitle = "", sObjectPageSectionTitle = "", sObjectPageSubSectionTitle = "", oObjectPageSubSection;

							oObjectPageSubSection =  oSmartTable.getParent().getParent().getParent();
							sObjectPageSubSectionTitle = oObjectPageSubSection.getTitle();
							sObjectPageSectionTitle = oObjectPageSubSection.getParent().getTitle();
							Opa5.assert.ok(oSmartTable.isA("sap.ui.comp.smarttable.SmartTable"), "The Facet " + sObjectPageSubSectionTitle + "'s content inside the Facet " + sObjectPageSectionTitle + " is a SmartTable and is rendered correctly.");

							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@ProductDescriptions");
							Opa5.assert.equal(sObjectPageSubSectionTitle, sExpectedTitle, "The Facet " + sObjectPageSubSectionTitle + "'s title inside the Facet " + sObjectPageSectionTitle + " is rendered correctly.");
						},
						errorMessage: "The Facet Product Descriptions And Supplier inside the Facet General Information is not rendered correctly."
					});
				},
				// check if the Facet "Product Description and Supplier" inside General Information renders the charts:
				// i. finding a Smart Table by id
				// ii. check each column against the annotations
				theFacetProductDescriptionsAndSupplierInsideTheFacetGeneralInformationRendersCharts: function () {
					return this.waitFor({
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSmartTable) {
							var aItems = oSmartTable.getItems();

							// columns from annotations

							var oMetadataModel = oSmartTable.getModel().getMetaModel();
							// get the Product Text entity type from the meta model
							var oProductTextEntityType = oMetadataModel.getODataEntityType("STTA_PROD_MAN.STTA_C_MP_ProductTextType");
							var aAnnotationColumns = oProductTextEntityType["com.sap.vocabularies.UI.v1.LineItem"].filter(function(oRecord){
								return (oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataField" ||
								oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" ||
								oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" ||
								((oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAction" || oRecord.RecordType === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation") && oRecord.Inline));
							});

							var iAnnotatedChartColumns = 0;
							var iRenderedChartColumns = 0;
							var aFirstRowCells =  aItems[0].getCells();
							var oCellItem;
							var sAnnotationPath;

							for(var i = 0; i < aAnnotationColumns.length; i++) {
								if (aAnnotationColumns[i].RecordType === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation") {
									sAnnotationPath =  aAnnotationColumns[i].Target.AnnotationPath;
									if (sAnnotationPath.indexOf('com.sap.vocabularies.UI.v1.Chart') >= 0){
										iAnnotatedChartColumns++;
										oCellItem = aFirstRowCells[i].getItems()[0];
										if(oCellItem.getChartType()){
											iRenderedChartColumns++;
										}
									}
								}
							}

							Opa5.assert.equal(iAnnotatedChartColumns, iRenderedChartColumns, "All Columns annotated for micro charts in Product Descriptions And Supplier table render micro charts");
						},
						errorMessage: "Not all Columns annotated for micro charts in Product Descriptions And Supplier table render micro charts."
					});
				},

				// check if the Facet "Sales Revenue" is rendered correctly by:
				// i. finding a Smart Table by id
				// ii. checking the contents of the table
				theFacetSalesRevenueIsRenderedCorrectly: function () {
					return this.waitFor({
						id:  prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oSalesDataTable) {
							var oObjectPageSection, sExpectedTitle = "";

							oObjectPageSection = oSalesDataTable.getParent().getParent().getParent().getParent();
							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesRevenue");
							Opa5.assert.equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
							Opa5.assert.ok(oSalesDataTable.isA("sap.ui.comp.smarttable.SmartTable"), "The Facet " + oObjectPageSection.getTitle() + " content is a SmartTable and is rendered correctly.");
						},
						errorMessage: "The Facet Sales Revenue is not rendered correctly."
					});
				},
				// check if the Facet "Contacts" is rendered correctly by:
				// i. finding a List by id
				// ii. checking the contents of the list
				theFacetContactsIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_AllEmployeeContacts::com.sap.vocabularies.Communication.v1.Contact::ContactsList",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oContactList) {
							var oObjectPageSection, sExpectedTitle = "";

							oObjectPageSection = oContactList.getParent().getParent().getParent().getParent().getParent();
							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Contacts");
							Opa5.assert.equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
							Opa5.assert.ok(oContactList.isA("sap.m.List"), "The Facet " + oObjectPageSection.getTitle() + " content is a List and is rendered correctly.");
						},
						errorMessage: "The Facet Sales Revenue is not rendered correctly."
					});
				},
				// check if the Facet "Sales Data" rendered correctly and that the annotated action buttons appear in the toolbar by:
				// i. finding a Chart by id
				// ii. checking the contents of the chart
				theExtensionFacetSalesDataIsRenderedCorrectly: function () {
					return this.waitFor({
						id: prefix + "to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart::Chart",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oExtensionFacetSalesDataChart) {
							var oObjectPageSection,	sExpectedTitle = "";

							// check for Smart Chart
							oObjectPageSection = oExtensionFacetSalesDataChart.getParent().getParent().getParent().getParent();
							sExpectedTitle = OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@SalesData");
							Opa5.assert.equal(oObjectPageSection.getTitle(), sExpectedTitle,"The Extension Facet " + oObjectPageSection.getTitle() + " title '" + sExpectedTitle + "' is rendered correctly.");
							Opa5.assert.ok(oExtensionFacetSalesDataChart.isA("sap.ui.comp.smartchart.SmartChart"), "The Extension Facet " + oObjectPageSection.getTitle() + " content is an SmartChart and is rendered correctly.");

							// check if there should be action buttons based on annotations
							// get the meta model first
							var oMetadataModel = oExtensionFacetSalesDataChart.getModel().getMetaModel();
							// get the Product Sales Data entity type from the meta model
							var mSalesData = oMetadataModel.getODataEntityType("STTA_PROD_MAN.STTA_C_MP_ProductSalesDataType");
							// check for and get the Actions from UI.Chart annotation
							var aActions;
							if (mSalesData && mSalesData["com.sap.vocabularies.UI.v1.Chart"] && mSalesData && mSalesData["com.sap.vocabularies.UI.v1.Chart"].Actions) {
								aActions = mSalesData["com.sap.vocabularies.UI.v1.Chart"].Actions;
							}

							// if Actions property exists in UI.Chart annotation then actions buttons should appear in the toolbar
							if (aActions && aActions.length > 0) {
								var aSmartChartToolbarContent = oExtensionFacetSalesDataChart.getToolbar().getContent();
								var aSmartChartToolbarButtonsText = [];

								// get Smart Chart toolbar buttons text
								for (var i = 0; i < aSmartChartToolbarContent.length;  i++) {
									if (aSmartChartToolbarContent[i].isA("sap.m.Button")) {
										aSmartChartToolbarButtonsText.push(aSmartChartToolbarContent[i].getText());
									}
								}

								if (aSmartChartToolbarButtonsText.length > 0) {
									// compare the text from the annotations (aActions) with the toolbar buttons text (aSmartChartToolbarButtonsText)
									for (var i = 0; i < aSmartChartToolbarButtonsText.length; i++) {
										var sActionText;
										for (var j = 0; j < aActions.length; j++) {
											sActionText = aActions[j].Label.String;
											// if the two texts match then the button is okay, remove it from aAction
											if (sActionText === aSmartChartToolbarButtonsText[i]) {
												Opa5.assert.ok(true, sActionText + " action button was rendered correctly in the Smart Chart toolbar.");
												aActions.splice(j, 1); // remove matched text from aActions
												break;
											}
										}
									}

									// in the end there should not be any text in aActions since all them should be removed in the previous for loop
									// if there are still items in aActions then it seems not all of the annotated action buttons appear in the Smart Chart toolbar
									if (aActions.length > 0) {
										for (var i = 0; i < aActions.length; i++) {
											Opa5.assert.notOk(true, aActions[i].Label.String + " action button was not rendered correctly in the Smart Chart toolbar.");
										}
									}
								}
								else {
									Opa5.assert.notOk(true, "There are no buttons in the Smart Chart toolbar even though the UI.Chart annotation's 'Actions' property is defined.");
								}
							}
						},
						errorMessage: "The Extension Facet Sales Data is not rendered correctly"
					});
				},

				theChevronIsVisibleInSalesRevenueTable: function(bVisible) {
					return this.waitFor({
						id: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem::analyticalTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oControl) {
							if (bVisible === true) {
								Opa5.assert.equal("action", oControl.mAggregations.rowActionTemplate._aActions["0"], "The Sales Revenue Table contains Row Action Chevron");
							} else {
								Opa5.assert.equal("", oControl.mAggregations.rowActionTemplate._aActions["0"], "The Sales Revenue Table doesn't contain Row Action Chevron");
							}
						},
						errorMessage: "Chevron rendering is incorrect"
					});
				},

				/************************************************
				 NAVIGATION ASSERTIONS
				 *************************************************/
				// check if the Object Page context is correct by:
				// i. finding the Oject Page Layout by control type
				// ii. get the binding context and check against the Data Store
				thePageContextShouldBeCorrect: function() {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: false,
						matchers: [
							function(oControl) {
								if (oControl && oControl.getBindingContext()) {
									return oControl.getBindingContext().getPath() === OpaDataStore.getData("navContextPath");
								}
								return false;
							}
						],
						success: function(bValue) {
							return bValue ? Opa5.assert.ok(true, "The Object Page has the correct context") : Opa5.assert.notOk(true, "The Object Page has the wrong context");
						},
						errorMessage: "The Object Page does not have the correct context"
					});
				},

				/************************************************
				 CONTACT INFORMATION POPUP ASSERTIONS
				 *************************************************/
				theContactInformationShouldBeDisplayedFor: function (sExpectedName, sAddress) {
					return this.waitFor({
						controlType: "sap.m.Popover",
						success: function (oPopover) {
							var aPopoverItems = oPopover[0].getContent()[0].getItems();
							var sActualName = aPopoverItems[0].getItems()[1].getItems()[0].getText();
							var bPageAddrCheck = false;
							for (var i = 2; i < aPopoverItems.length; i++) {
								if (sAddress === aPopoverItems[i].getItems()[1].getText()) {
									bPageAddrCheck = true;
								}
							}
							Opa5.assert.ok(sActualName === sExpectedName, "The Contact Information popup is opened with the correct data for name: \"" + sExpectedName + "\"");
							Opa5.assert.ok(bPageAddrCheck, "The Contact Information popup is opened with the correct data for address: \"" + sAddress + "\"");

						},
						errorMessage: "Contact Information Popup is not rendered correctly or expected name not matched as \"" + sExpectedName + "\" or expected address not matched as \"" + sAddress + "\""
					});
				},

				iCheckTableForDefaultInlineCreateSort: function(bExpectedValue) {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						id: prefix + "to_ProductText::com.sap.vocabularies.UI.v1.LineItem::Table",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oSmartTable){
							var bActualValue = false;
							var oTable = oSmartTable.getTable();
							var oTableBindingInfo = oTable.getBindingInfo("items");
							bActualValue = oTableBindingInfo.sorter.length > 0 && oTableBindingInfo.sorter[0].sPath === "DraftEntityCreationDateTime";
							Opa5.assert.equal(bActualValue, bExpectedValue, "Default Inline Create sort is \"" + bActualValue + "\" in the table.");
						},
						errorMessage: "Table is not visible"
					});
				},

				theObjectMarkerIsInContentAggregation: function () {
					return this.waitFor({
						id: prefix + "template::ObjectPage::ObjectPageHeader",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oControl) {
							Opa5.assert.equal(oControl.getAggregation("content")[0].getContent()[0].getId(), prefix + "template::ObjectPage::ObjectMarkerObjectPageDynamicHeaderTitle", "The object marker is in content aggregation");
						},
						errorMessage: "The object marker is not in content aggregation"
					});
				},
				theLayoutActionsShouldBeSeparatedFromGlobalActions: function () {
					return this.waitFor({
						id: prefix + "template::ObjectPage::ObjectPageHeader",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (oControl) {
							Opa5.assert.equal(oControl.getNavigationActions()[0].getId(), prefix + "template::UpAndDownNavigation", "Paginator buttons are on right place.");
							Opa5.assert.equal(oControl.getNavigationActions()[1].getId(), prefix + "template::FCLActionButtons", "FCL actions are on right place.");
						},
						errorMessage: "Layout actions are not separated from Global Actions"
					});
				},

				// check if the Header Facet "Communication Address" is rendered correctly by:
				// i. finding a VBox using the id and regex expression
				// ii. checking if the contents of the VBox is correct
				theHeaderFacetCommunicationAddressIsRendered: function () {
					var sFacetName = "Communication Address";
					var sHeaderRegExp = "(header::headerEditable)" + "(.*to_Supplier::to_Address)" + "(.*com.sap.vocabularies.Communication.v1.Address)" + "(.*ContactAddress)";
					return this.waitFor({
						id: new RegExp(sHeaderRegExp),
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							Opa5.assert.equal(aControl.length, 1, "Communication Address - Only 1 'sap.m.VBox' control is found");
							var aItems = aControl[0].getItems();
							Opa5.assert.equal(aItems.length, 2, "Communication Address - There should be 2 items in the VBox");
							// Label
							Opa5.assert.equal(aItems[0].getText(), OpaResourceBundle.demokit.stta_manage_products.i18n.getProperty("@Address") + ":", sFacetName + " - " + "The header facet label is rendered correctly");
							// Fields
							Opa5.assert.ok(aItems[1].isA("sap.m.Text"), sFacetName + " - " + "The text field is rendered");
						},
						errorMessage: sFacetName + " - " + "Header facet is not rendered"
					});
				},
				// Check whether the title is visible for the SmartFormGroup with given id
				// i. id - Last part of the id of the SmartGroup which is unique
				// ii. bVisible - Boolean value true (visible) or false (not visible)
				iCheckSmartFormGroupTitleVisibility: function (sId, bVisible) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						success: function (oControl) {
							if (oControl[0].getTitle()) {
								Opa5.assert.ok(bVisible, "The field group Label is visible");
							} else {
								Opa5.assert.ok(!bVisible, "The field group Label is not visible");
							}
						},
						errorMessage: "The specified element with ID is not present"
					});
				},
				iCheckTheGroupElementProperties: function (sId, oProperty) {
					return this.waitFor({
						id: new RegExp(sId + "$"),
						success: function (oControl) {
							var keys = Object.keys(oProperty);
							for (var i = 0; i < keys.length; i++) {
								var bFlag = false;
								if (oControl[0].getElements()[0].getProperty(keys[i]) === oProperty[keys[i]]) {
									bFlag = true;
								}
								Opa5.assert.ok(bFlag, "The group element property '" + keys[i] + "' is set correctly '" + oProperty[keys[i]] + "'");
							}
						},
						errorMessage: "The groupElement is not rendered correctly"
					});
				}
			};
		};
	});
