sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/Ancestor"
],
function(
	Opa5,
	Press,
	EnterText,
	Ancestor
) {
	"use strict";

	Opa5.createPageObjects({
		onFioriElementsPage: {
			actions: {
				iClickOnButton: function(sId) {
					return this.waitFor({
						id: sId,
						controlType: "sap.m.Button",
						actions: new Press(),
						errorMessage: "Did not find the button"
					});
				},
				iEnterTextOnSearchField: function(sId, sText) {
					return this.waitFor({
						id: sId,
						controlType: "sap.m.SearchField",
						actions: function(oSearchField) {
							oSearchField.setValue(sText);
							oSearchField.fireSearch();
						},
						success: function() {
							Opa5.assert.ok(true, "search text entered");
						},
						errorMessage: "Could not enter text"
					});
				},
				iClickOnTableLineItem: function() {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "line item found");
						},
						errorMessage: "Did not find the line item"
					});
				},
				iClickOnMDCTableLineItem: function(sProductId) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						matchers: function(oColumnListItem) {
							return oColumnListItem.getCells()[1].getTitle() === sProductId;
						},
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "line item found");
						},
						errorMessage: "Did not find the line item"
					});
				},
				iWaitUntilTheBusyIndicatorIsGone: function(sId, sViewName) {
					return this.waitFor({
						autoWait: false,
						id: sId,
						viewName: sViewName,
						matchers: function(oRootView) {
							// we set the view busy, so we need to query the parent of the app
							return oRootView.getBusy() === false;
						},
						success: function() {
							Opa5.assert.ok(true, "the App is not busy anymore");
						},
						errorMessage: "The app is still busy."
					});
				}
			},

			assertions: {
				iAmOnProductPage: function(sId) {
					return this.waitFor({
						id: sId,
						controlType: "sap.ui.core.mvc.XMLView",
						errorMessage: "Product page didn't load"
					});
				},
				iAmOnListReport: function(sSearchFieldId) {
					return this.waitFor({
						id: sSearchFieldId,
						controlType: "sap.m.SearchField",
						success: function() {
							Opa5.assert.ok(true, "List Report loaded");
						},
						errorMessage: "List Report didn't load (search field not found)"
					});
				}
			}
		},
		onPageWithIFrame: {
			actions: {
				iClickOnProduct: function(sElementId) {
					return this.waitFor({
						id: sElementId,
						controlType: "sap.m.ObjectListItem",
						actions: new Press(),
						errorMessage: "Did not find the Product on the list"
					});
				},
				iScrollUp: function(sObjectPageLayoutId) {
					return this.waitFor({
						id: sObjectPageLayoutId,
						controlType: "sap.uxap.ObjectPageLayout",
						success: function(oLayout) {
							oLayout.getScrollDelegate().scrollTo(0, 0);
						},
						errorMessage: "Did not find the ObjectPageLayout"
					});
				},
				iClickOnButton: function(sPartialId) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: function(oButton) {
							return oButton.getId().includes(sPartialId);
						},
						actions: new Press(),
						errorMessage: "Did not find the button"
					});
				},
				iClickOnBackButton: function() {
					return this.waitFor({
						id: "backBtn",
						controlType: "sap.ushell.ui.shell.ShellHeadItem",
						actions: new Press(),
						errorMessage: "Did not find the button"
					});
				}
			},

			assertions: {
				iShouldSeeTheIFrameDialog: function() {
					return this.waitFor({
						id: "sapUiRtaAddIFrameDialog",
						controlType: "sap.m.Dialog",
						success: function(oDialog) {
							Opa5.assert.ok(
								oDialog.isOpen(),
								"then the iFrame Dialog is open"
							);
						},
						errorMessage: "Did not find the AddIFrame Dialog"
					});
				},
				iShouldSeeTheIFrame: function(sURL, sTitle) {
					return this.waitFor({
						controlType: "sap.ui.fl.util.IFrame",
						matchers: function(oIFrame) {
							return (
								oIFrame.getDomRef().contentDocument
								&& oIFrame.getUrl() === sURL
							);
						},
						success: function(aIFrames) {
							Opa5.assert.strictEqual(
								aIFrames[0].getDomRef().contentDocument.title,
								sTitle,
								"and the iFrame content loaded successfully"
							);
						},
						errorMessage: "Did not find the IFrame"
					});
				},
				iShouldSeeTheIFrameSandboxProperties: function(sURL, sSandboxPropertyString) {
					return this.waitFor({
						controlType: "sap.ui.fl.util.IFrame",
						matchers: function(oIFrame) {
							return (
								oIFrame.getDomRef().contentDocument
								&& oIFrame.getUrl() === sURL
							);
						},
						success: function(aIFrames) {
							Opa5.assert.strictEqual(
								aIFrames[0].getDomRef().sandbox.toString(),
								sSandboxPropertyString,
								"and the iFrame has the correct sandbox properties"
							);
						},
						errorMessage: "Did not find the IFrame"
					});
				},
				iShouldSeeTheNewTitle: function(sId, sSectionTitle) {
					return this.waitFor({
						id: sId,
						success: function(oAnchorBar) {
							this.waitFor({
								id: /-anchor$/,
								matchers: new Ancestor(oAnchorBar),
								success: function(aSectionTexts) {
									Opa5.assert.strictEqual(
										aSectionTexts[0].getText(),
										sSectionTitle,
										"and the section title was set successfully"
									);
								},
								errorMessage: "Did not find any section titles"
							});
						},
						errorMessage: "Did not find the Anchor Bar"
					});
				},
				iShouldNotSeeTheIFrameAnymore: function(sAnchorBarId) {
					return this.waitFor({
						id: sAnchorBarId,
						success: function(oAnchorBar) {
							this.waitFor({
								id: /-anchor$/,
								matchers: new Ancestor(oAnchorBar),
								success: function(aSectionTexts) {
									Opa5.assert.strictEqual(
										aSectionTexts.length,
										2,
										"and the new section with the iFrame was removed"
									);
								},
								errorMessage: "Did not find any section titles"
							});
						},
						errorMessage: "Did not find the Anchor Bar"
					});
				}
			}
		},
		onIFrameDialog: {
			actions: {
				iEnterTitleOnInputField: function(sElementId, sTitle) {
					return this.waitFor({
						id: sElementId,
						controlType: "sap.m.Input",
						success: function(oInput) {
							Opa5.assert.ok(
								oInput.setValue(sTitle),
								"then the title is entered"
							);
						},
						errorMessage: "Did not find the Title Input Field"
					});
				},
				iEnterHeightOnInputField: function(sElementId, iValue) {
					return this.waitFor({
						id: sElementId,
						controlType: "sap.m.Input",
						success: function(oInput) {
							Opa5.assert.ok(
								oInput.setValue(iValue),
								"then the height is entered"
							);
						},
						errorMessage: "Did not find the Height Input Field"
					});
				},
				iEnterUrlOnTextArea: function(sElementId, sURL) {
					return this.waitFor({
						id: sElementId,
						controlType: "sap.m.TextArea",
						success: function(oTextArea) {
							Opa5.assert.ok(
								oTextArea.setValue(sURL),
								"then the URL is entered"
							);
						},
						errorMessage: "Did not find the URL Text Area"
					});
				},
				iClickOnTheShowPreviewButton: function() {
					var sButtonId = "sapUiRtaAddIFrameDialog_PreviewButton";
					return this.waitFor({
						id: sButtonId,
						controlType: "sap.m.Button",
						actions: new Press(),
						errorMessage: "Did not find the ShowPreviewButton"
					});
				},
				iClickOnTheSaveButton: function() {
					var sButtonId = "sapUiRtaAddIFrameDialogSaveButton";
					return this.waitFor({
						id: sButtonId,
						controlType: "sap.m.Button",
						actions: new Press(),
						errorMessage: "Did not find the SaveButton"
					});
				},
				iToggleASandboxPropertySwitch: function(sId) {
					return this.waitFor({
						id: sId,
						controlType: "sap.m.Switch",
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "switch was found");
						},
						errorMessage: "Did not find the switch"
					});
				},
				iEnterASandboxPropertyInMultiInput: function(sProperty) {
					return this.waitFor({
						id: "sapUiRtaAddIFrameDialog_AddAdditionalParametersInput",
						controlType: "sap.m.MultiInput",
						actions: [
							new EnterText({ text: sProperty })
						],
						success: function() {
							Opa5.assert.ok(true, "sandbox property was entered in the MultiInput");
						},
						errorMessage: "Did not find the MultiInput"
					});
				},
				iClickOnAParameterInTheTable: function(sParameter) {
					return this.waitFor({
						controlType: "sap.m.ColumnListItem",
						matchers: function(oColumnListItem) {
							return oColumnListItem.getCells()[0].getText() === sParameter;
						},
						actions: new Press(),
						success: function() {
							Opa5.assert.ok(true, "parameter found");
						},
						errorMessage: "Did not find the parameter"
					});
				}
			},

			assertions: {
				iShouldSeeThePreview: function(sURL, sTitle) {
					return this.waitFor({
						id: "sapUiRtaAddIFrameDialog_PreviewFrame",
						controlType: "sap.ui.fl.util.IFrame",
						success: function(oIFrame) {
							Opa5.assert.strictEqual(
								oIFrame.getUrl(),
								sURL,
								"then the correct URL is set"
							);
							Opa5.assert.strictEqual(
								oIFrame.getDomRef().contentDocument.title,
								sTitle,
								"and the iFrame content loaded successfully"
							);
						},
						errorMessage: "URL was not correctly set"
					});
				},
				iShouldSeeThePreviewURL: function(sURL) {
					return this.waitFor({
						id: "sapUiRtaAddIFrameDialog_PreviewFrame",
						controlType: "sap.ui.fl.util.IFrame",
						success: function(oIFrame) {
							Opa5.assert.strictEqual(
								oIFrame.getUrl(),
								sURL,
								"then the correct URL is set"
							);
						},
						errorMessage: "URL was not correctly set"
					});
				}
			}
		}
	});
});
