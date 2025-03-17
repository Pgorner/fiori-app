/* global QUnit */
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/OpaBuilder",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/comp/qunit/smartfilterbar/opaTests/util/InitializeMatcher"
], function (
	Opa5,
	opaTest,
	Press,
	OpaBuilder,
	PropertyStrictEquals,
	InitializeMatcher
) {
	"use strict";

	var sFilterUnderTest = "String Auto",
		sTextId = "filterResult";

	Opa5.extendConfig({
		viewName: "mainView",
		viewNamespace: "",
		autoWait: true,
		async: true,
		timeout: 120,
		arrangements: new Opa5({
			iStartMyApp: function () {
				return this.iStartMyAppInAFrame(
					sap.ui.require.toUrl(
						"sap/ui/comp/qunit/smartfilterbar/opaTests/FilterChange/applicationUnderTest/FilterChange.html"
					)
				);
			},
			iEnsureMyAppIsRunning: function () {
				if (!this._myApplicationIsRunning) {
					this.iStartMyApp();
					this._myApplicationIsRunning = true;
				}
			},
			iStopMyApp: function () {
				this._myApplicationIsRunning = false;
				return this.iTeardownMyAppFrame();
			}
		}),
		actions: new Opa5({
			iOpenAdaptFiltersDialog: function(){
				this.waitFor(new OpaBuilder()
					.hasType("sap.ui.comp.smartfilterbar.SmartFilterBar")
					.do(function(oFilterBar){
						oFilterBar.showAdaptFilterDialog();
					})
					.build());
			},
			/**
			 * Changes the selection state of a filter item in the Adapt Filters Dialog.
			 *
			 * @param {string} sFilterLabel The label of the item that should be selected
			 * @param {boolean} bIsSelected The selection status
			 * @param {string} sViewType The current view type ("list" or "group")
			 */
			iSelectFilter: function(sFilterLabel, bIsSelected, sViewType){
				this.waitFor(
					new OpaBuilder()
						.hasId(/-selectMulti$/)
						.hasType("sap.m.CheckBox")
						.do(function(oCheckBox){
							var oParent = oCheckBox.getParent();
							//GroupView is using "CustomListItem" while the ListView is using "ColumnListItem"
							if (oParent.isA("sap.m.ColumnListItem") || oParent.isA("sap.m.ColumnListItem")){
								var oLabelContainer = sViewType === "list" ? oParent.getCells()[0] : oParent.getContent()[0];
                                var oControl = oLabelContainer.getItems()[0];
								if (oControl.isA("sap.m.Label") && oControl.getText() === sFilterLabel &&
                                    ((bIsSelected && !oCheckBox.getSelected()) ||
									(!bIsSelected && oCheckBox.getSelected()))) {
									new Press().executeOn(oCheckBox);
								}
							}
						})
						.build()
				);
			},
			iCloseAdaptFiltersDialog: function(){
				this.waitFor(new OpaBuilder()
					.hasType("sap.m.Button")
					.hasId(/adapt-filters-dialog-confirmBtn$/)
					.isDialogElement(true)
					.do(function(oButton){
						new Press().executeOn(oButton);
					})
					.build());
			},
			iResetAdaptFiltersDialog: function(){
				this.waitFor({
					searchOpenDialogs: true,
					controlType: "sap.m.Button",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: "Reset"
					}),
					actions: new Press(),
					success: function () {
						this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({
								name: "text",
								value: "OK"
							}),
							success: function (aButtons) {
								new Press().executeOn(aButtons[1]);
							}
						});
					}
				 });
			},
			iPressTheGoButton: function(){
				this.waitFor(new OpaBuilder()
				.hasType("sap.ui.comp.smartfilterbar.SmartFilterBar")
				.isDialogElement(false)
				.do(function(oSmartFilterBar){
					new Press().executeOn(oSmartFilterBar.getAggregation("_searchButton"));
				})
				.build());
			},
			iSetValueState: function(sId, sState){
				return this.waitFor({
					id: sId,
					success: function(oControl){
						oControl.setValueState(sState);
					}
				});
			},
			iSetFilterData: function(sId, oFilterData, bReplace){
				return this.waitFor({
					id: sId,
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					success: function(oSmartFilterBar){
						oSmartFilterBar.setFilterData(oFilterData, !!bReplace);
					}
				});
			}
		}),
		assertions: new Opa5({
			iCheckAdaptFiltersCount: function(nCount){
				return this.waitFor({
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					success: function (aSmartFilterBars) {
						var oSmartFilterBar = aSmartFilterBars[0];
						Opa5.assert.strictEqual(
							oSmartFilterBar._getFiltersWithValuesCount(),
							nCount,
							"Adapt Filters count should be " + nCount
						);
					}
				});
			},
			iCheckTextFieldContainsText: function(sId, sText){
				return this.waitFor({
					controlType: "sap.m.Text",
					id: sId,
					success: function(oControl){
						var sValue = oControl.getText();
						Opa5.assert.ok(sValue.indexOf(sText) > -1, "The backend request should contain value '" + sText + "'");
					}
				});
			},
			iCheckTextFieldDoesNotContainText: function(sId, sText){
				return this.waitFor({
					controlType: "sap.m.Text",
					id: sId,
					success: function(oControl){
						var sValue = oControl.getText();
						Opa5.assert.ok(sValue.indexOf(sText) === -1, "The backend request should not contain value '" + sText + "'");
					}
				});
			},
			iCheckFilterDataDoesNotContainFilter: function(sId, sFilterKey){
				return this.waitFor({
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					id: sId,
					success: function(oSmartFilterBar){
						var oFilterData = oSmartFilterBar.getFilterData();
						Opa5.assert.ok(oFilterData[sFilterKey] === undefined, "The FilterData doesn't contain data about '" + sFilterKey + "' filter");
					}
				});
			},
			iCheckFilterDataContainsFilter: function(sId, sFilterKey){
				return this.waitFor({
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					id: sId,
					success: function(oSmartFilterBar){
						var oFilterData = oSmartFilterBar.getFilterData();
						Opa5.assert.ok(oFilterData[sFilterKey] !== -1, "The FilterData contains data about '" + sFilterKey + "' filter");
					}
				});
			},
			iCheckFilterDataAsStringDoesNotContainFilter: function(sId, sFilterKey){
				return this.waitFor({
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					id: sId,
					success: function(oSmartFilterBar){
						var sFilterData = oSmartFilterBar.getFilterDataAsString();
						Opa5.assert.ok(sFilterData.indexOf(sFilterKey) === -1, "The FilterDataAsString doesn't contain data about '" + sFilterKey + "' filter");
					}
				});
			},
			iCheckFilterDataAsStringContainsFilter: function(sId, sFilterKey){
				return this.waitFor({
					controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
					id: sId,
					success: function(oSmartFilterBar){
						var sFilterData = oSmartFilterBar.getFilterDataAsString();
						Opa5.assert.ok(sFilterData.indexOf(sFilterKey) !== undefined, "The FilterDataAsString contains data about '" + sFilterKey + "' filter");
					}
				});
			},
			iCheckFilterIsSelected: function(sFilterLabel, bIsSelected, sViewType){
				this.waitFor(
					new OpaBuilder()
						.hasId(/-selectMulti$/)
						.hasType("sap.m.CheckBox")
						.do(function(oCheckBox){
							var oParent = oCheckBox.getParent();
							//GroupView is using "CustomListItem" while the ListView is using "ColumnListItem"
							if (oParent.isA("sap.m.ColumnListItem") || oParent.isA("sap.m.ColumnListItem")){
								var oLabelContainer = sViewType === "list" ? oParent.getCells()[0] : oParent.getContent()[0];
                                var oControl = oLabelContainer.getItems()[0];
								if (oControl.isA("sap.m.Label") && oControl.getText() === sFilterLabel) {
									Opa5.assert.ok(oCheckBox.getSelected() === bIsSelected, "Filter is selected");
								}
							}
						})
					.build());
			},
			iCheckValueState: function(sId, sState){
				return this.waitFor({
					id: sId,
					success: function(oControl){
						Opa5.assert.ok(oControl.getValueState() === sState, "The " + sId + " filter has the correct '" + sState + "' valueState");
					}
				});
			}
		})
	});

	QUnit.module("Defaults");

	opaTest("SmartFilterBar and SmartVariantManagement are in correct state", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.waitFor({
			id: "smartFilterBar",
			matchers: new InitializeMatcher(),
			success: function (oSmartFilterBar) {
				Opa5.assert.strictEqual(
					oSmartFilterBar.getFilterData()['STRING_AUTO']["items"][0].text,
					"Key 1 (1)",
					"I have a token with the correct textArrangement applied"
				);
			}
		});

		Then.waitFor({
			id: "smartvariant",
			success: function (oSmartVariant) {
				Opa5.assert.strictEqual(
					oSmartVariant.currentVariantGetModified(),
					false,
					"Current Smart Variant is not marked as dirty"
				);
			}
		});

		Then.waitFor({
			id: "filterChangeEventLog",
			success: function (oList) {
				var aExpectedEvents = [
						"filterChange Event fired",
						"SmartFilterBar.clear();",
						"filterChange Event fired",
						"setUiState",
						"Synchronous call to currentVariantSetModified(false);",
						"Backend request & response for VH data"
					],
					aEvents = oList.getItems().map(function (oItem) {
						return oItem.getTitle().trim();
					});

				Opa5.assert.strictEqual(
					aExpectedEvents.join(","),
					aEvents.join(","),
					"Expected number of events are fired at the expected order"
				);
			}
		});
	});

	opaTest("SmartFilterBar visible filters not in the basic group are part of the search parameters", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		Then.iCheckAdaptFiltersCount(2);

		When.iPressTheGoButton();
		Then.iCheckTextFieldContainsText(sTextId, "STRING_AUTO");
	});

	opaTest("SmartFilterBar even invisible filters with values in the basic group are part of the search parameters", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		When.iOpenAdaptFiltersDialog();
		When.iSelectFilter(sFilterUnderTest, false, "list");
		When.iCloseAdaptFiltersDialog();

		Then.iCheckAdaptFiltersCount(2);

		When.iPressTheGoButton();
//		Then.iCheckTextFieldDoesNotContainText(sTextId, "STRING_AUTO");
		Then.iCheckTextFieldContainsText(sTextId, "STRING_AUTO");

		// Cleanup
		When.iOpenAdaptFiltersDialog();
		When.iSelectFilter(sFilterUnderTest, true, "list");
		When.iCloseAdaptFiltersDialog();
	});

	opaTest("SmartFilterBar the Filters with 'Error' valueState are not returned by getFilterDataAsString and getFilterData methods", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Assert
		Then.iCheckFilterDataContainsFilter("smartFilterBar", "STRING_AUTO");
		Then.iCheckFilterDataAsStringContainsFilter("smartFilterBar", "STRING_AUTO");

		// Act
		When.iSetValueState("smartFilterBar-filterItemControlA_-STRING_AUTO", "Error");

		// Assert
		Then.iCheckFilterDataDoesNotContainFilter("smartFilterBar", "STRING_AUTO");
		Then.iCheckFilterDataAsStringDoesNotContainFilter("smartFilterBar", "STRING_AUTO");

		// Cleanup
		When.iSetValueState("smartFilterBar-filterItemControlA_-STRING_AUTO", "None");
	});

	opaTest("SmartFilterBar the mandatory Filters with 'Error' valueState should be validated before 'search' request", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iSetFilterData("smartFilterBar", {}, true);

		When.iPressTheGoButton();

		// Assert
		Then.iCheckValueState("smartFilterBar-filterItemControl_BASIC-STRING_MANDATORY", "Error");

		// Act
		When.iSetFilterData("smartFilterBar", {"STRING_MANDATORY": {"value": null,"ranges": [],"items": [{"key": "1","text": "Key 1 (1)"}]}});

		// Assert
		Then.iCheckValueState("smartFilterBar-filterItemControl_BASIC-STRING_MANDATORY", "Error");

		// Act
		When.iPressTheGoButton();

		// Assert
		Then.iCheckValueState("smartFilterBar-filterItemControl_BASIC-STRING_MANDATORY", "None");
		Then.iCheckFilterDataContainsFilter("smartFilterBar", "STRING_MANDATORY");
	});

	opaTest("Check AdaptFiltersDialog Reset", function(Given, When, Then) {
		// Arrange
		Given.iEnsureMyAppIsRunning();

		// Act
		When.iOpenAdaptFiltersDialog();
		When.iSelectFilter(sFilterUnderTest, false, "list");
		When.iResetAdaptFiltersDialog();

		// Assert
		Then.iCheckFilterIsSelected(sFilterUnderTest, true, "list");
	});

	opaTest("LAST-The purpose of this test is to Cleanup after all the tests", function (Given) {
		Opa5.assert.ok(true); // We need one assertion

		// Cleanup
		Given.iStopMyApp();
	});
});
