/* global QUnit */

sap.ui.define([
	"sap/ui/test/Opa5",
	"./Common",
	"sap/ui/test/actions/Press"
], function(Opa5, Common, Press) {
	"use strict";

	Opa5.createPageObjects({
		onAnyPage: {
			baseClass: Common,

			actions: {
				iScrollDown: function(sId) {
					return this.waitFor({
						timeout: 50,
						controlType: "sap.uxap.ObjectPageLayout",
						success: function(oLayout) {
							oLayout[0].scrollToSection(sId);
						}
					});
				},

				iSelectVariant: function(sVariantName) {
					return this.waitFor({
						controlType: "sap.ui.core.Item",
						matchers: {
							propertyStrictEquals: {
								name: "text",
								value: sVariantName
							}
						},
						actions: new Press()
					});
				}
			},
			assertions: {
				iShouldSeeTheGroupElementByLabel: function(sLabel, sId) {
					return this.waitFor({
						id: sId,
						visible: false,
						success: function(oGroupElement) {
							QUnit.assert.strictEqual(oGroupElement.getLabelText(), sLabel);
						},
						errorMessage: "Did not find a Label with this text"
					});
				},
				iShouldSeeTheElementByText: function(sLabel, sId) {
					return this.waitFor({
						id: sId,
						visible: false,
						success: function(oGroupElement) {
							QUnit.assert.strictEqual(oGroupElement.getText(), sLabel);
						},
						errorMessage: "Did not find a Label with this text"
					});
				},
				iShouldSeeTheGroupElementLabel: function(sLabel, sId) {
					return this.waitFor({
						id: sId,
						visible: false,
						success: function(oGroupElement) {
							QUnit.assert.strictEqual(oGroupElement.getLabel(), sLabel);
						},
						errorMessage: "Did not find a Label with this text"
					});
				},
				iShouldSeeTheGroupByTitle: function(sTitle) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							const oElement = oOverlay.getElement();
							if (oElement.isA("sap.ui.layout.form.FormContainer")) {
								// Title can be a string or title control
								const vTitle = oElement.getTitle();
								if (typeof vTitle === "string") {
									return vTitle === sTitle;
								}
								return vTitle?.getText() === sTitle;
							} else if (oElement.isA("sap.ui.comp.smartform.Group")) {
								return oElement.getTitle() === sTitle;
							}
							return false;
						},
						success: function(aOverlays) {
							QUnit.assert.ok(aOverlays[0].getElement().getVisible(), "The Group is shown on the UI");
						},
						errorMessage: "Did not find a Group with this title"
					});
				},
				theGroupElementHasTheCorrectIndex: function(sId, sId2, bBefore, sAggregationName) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElement().getId() === sId;
						},
						success: function(aOverlays) {
							var oOverlay = aOverlays[0];
							let aGroupElements;
							if (!sAggregationName) {
								aGroupElements = oOverlay.getParentElementOverlay().getElement().getGroupElements();
							} else {
								aGroupElements = oOverlay.getParentElementOverlay().getElement().getAggregation(sAggregationName);
							}
							var iIndex = aGroupElements.indexOf(oOverlay.getElement());
							var iInsertedIndex = bBefore ? iIndex - 1 : iIndex + 1;
							QUnit.assert.equal(aGroupElements[iInsertedIndex].getId(), sId2, "the Group Element has the correct Index");
						},
						errorMessage: "Did not find the Element Overlay"
					});
				},
				theGroupElementHasTheFirstIndex: function(sId, sAggregationName) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElement().getId() === sId;
						},
						success: function(aOverlays) {
							var oOverlay = aOverlays[0];
							let aGroupElements;
							if (!sAggregationName) {
								aGroupElements = oOverlay.getParentElementOverlay().getElement().getGroupElements();
							} else {
								aGroupElements = oOverlay.getParentElementOverlay().getElement().getAggregation(sAggregationName);
							}
							QUnit.assert.equal(aGroupElements[0].getId(), sId, "the Group Element has the correct Index");
						},
						errorMessage: "Did not find the Element Overlay"
					});
				},
				theChangesToTheGroupShouldStillBeThere: function(sGroupId, sElementId1, sElementId2, iCount, sAggregationName) {
					return this.waitFor({
						id: sGroupId,
						visible: false,
						success: function(oGroup) {
							let aFormElements;
							if (!sAggregationName) {
								aFormElements = oGroup.getFormElements();
							} else {
								aFormElements = oGroup.getAggregation(sAggregationName);
							}
							var aFormElementIds = aFormElements.map(function(oElement) {
								return oElement.getId();
							});
							QUnit.assert.equal(aFormElements[0].getId(), sElementId1, "then the last Element is correct");
							QUnit.assert.ok(aFormElementIds.indexOf(sElementId2) > -1, "then the added field is still there");
							QUnit.assert.equal(aFormElements.length, iCount, "then one field got added to the group");
						},
						errorMessage: "The Group was not found"
					});
				},
				theSectionShouldBeInTheFirstPosition: function(sId) {
					return this.waitFor({
						controlType: "sap.ui.dt.ElementOverlay",
						matchers: function(oOverlay) {
							return oOverlay.getElement().getId() === sId;
						},
						success: function(aOverlays) {
							var oOverlay = aOverlays[0];
							var aSections = oOverlay.getParentElementOverlay().getElement().getSections().filter(function(oSection) {return oSection.getVisible();});
							QUnit.assert.equal(aSections[0].getId(), sId, "the Section has the correct Index");
						},
						errorMessage: "Did not find the Section or it is in the wrong position"
					});
				},
				iShouldSeeTheSection: function(sId) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageSection",
						matchers: function(oSection) {
							return oSection.getId() === sId;
						},
						success: function(aSections) {
							QUnit.assert.ok(aSections[0].getVisible(), "The section is visible on the UI");
						},
						errorMessage: "Did not find the section or it is invisible"
					});
				},

				iShouldSeeTheFLPHomeScreen: function() {
					return this.waitFor({
						controlType: "sap.ushell.ui.launchpad.Page",
						success: function() {
							QUnit.assert.ok(true, "The FLP Home Screen is visible");
						},
						errorMessage: "The FLP Home Screen is not visible"
					});
				}
			}
		}
	});
});