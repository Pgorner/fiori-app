sap.ui.define(
	[
		"sap/fe/core/PageController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/fe/navigation/SelectionVariant",
		"sap/base/Log"
	],
	function (PageController, JSONModel, MessageToast, SelectionVariant, Log) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.filterBarPublicAPIs.FilterBarPublicAPIs", {
			onAfterRendering: function () {
				var view = this.getView();
				var interactionModel = new JSONModel({
					svObject: "",
					filterBarExpanded: true,
					setSVButton: {
						type: "Success",
						tooltip: ""
					},
					showFilterFieldButton: {
						enabled: false
					},
					hideFilterFieldButton: {
						enabled: true
					},
					disableFilterFieldButton: {
						enabled: false
					},
					enableFilterFieldButton: {
						enabled: true
					}
				});
				view.setModel(interactionModel, "interactionModel");
				this.filterBarSVToCodeEditor();
				this.updateFilterFieldVisibilityButtons();
			},

			filterBarSVToCodeEditor: function () {
				var filterBar = this.getView().byId("FilterBar");
				var interactionModel = filterBar.getModel("interactionModel");

				/** getSelectionVariant API: gives the present selection variant from the filter bar */
				/*****************************************************************************************/
				filterBar.getSelectionVariant().then(function (selectionVariant) {
					interactionModel.setProperty("/svObject", JSON.stringify(selectionVariant.toJSONObject(), null, "  "));
				});
				/*****************************************************************************************/
			},

			codeEditorSVToFilterBar: function () {
				var filterBar = this.getView().byId("FilterBar");
				var interactionModel = filterBar.getModel("interactionModel");
				var svString = interactionModel.getProperty("/svObject");
				try {
					var selectionVariantToSet = new SelectionVariant(svString);
					interactionModel.setProperty("/filterBarExpanded", true);

					/** setSelectionVariant API: to apply the selection variant to filter bar */
					/**************************************************************************/
					filterBar
						.setSelectionVariant(selectionVariantToSet)
						.then(function () {
							MessageToast.show("Selection variant from code editor is set to filter bar.");
						})
						.catch(function (err) {
							var message = err instanceof Error ? err.message : String(err);
							Log.error(`set SV error: ${message}`);
						});
					/**************************************************************************/
				} catch (err) {
					var message = err instanceof Error ? err.message : String(err);
					Log.error(`SV creation error: ${message}`);
				}
			},

			validateSV: function (event) {
				// To validate the selection variant in code editor and change the status and type of "setSelectionVariant" button.
				var interactionModel = event.getSource().getModel("interactionModel");
				var svString = event.getParameter("value");
				try {
					var selectionVariantToSet = new SelectionVariant(svString);
					interactionModel.setProperty("/setSVButton/type", selectionVariantToSet ? "Success" : "Critical");
				} catch (err) {
					interactionModel.setProperty("/setSVButton/type", "Critical");
					interactionModel.setProperty("/setSVButton/tooltip", "Selection Variant validation failed in code editor");
				}
			},

			showFilterField: async function () {
				const filterBar = this.getView().byId("FilterBar");
				await filterBar.setFilterFieldVisible("DateProperty", true);

				await this.updateFilterFieldVisibilityButtons();
			},

			hideFilterField: async function () {
				const filterBar = this.getView().byId("FilterBar");
				await filterBar.setFilterFieldVisible("DateProperty", false);

				await this.updateFilterFieldVisibilityButtons();
			},

			disableFilterField: async function () {
				const filterBar = this.getView().byId("FilterBar");
				await filterBar.setFilterFieldEnabled("StringProperty", false);

				await this.updateFilterFieldVisibilityButtons();
			},

			enableFilterField: async function () {
				const filterBar = this.getView().byId("FilterBar");
				await filterBar.setFilterFieldEnabled("StringProperty", true);

				await this.updateFilterFieldVisibilityButtons();
			},

			updateFilterFieldVisibilityButtons: async function (event) {
				const filterBar = this.getView().byId("FilterBar");
				const isVisible = await filterBar.getFilterFieldVisible("DateProperty");
				const isEnabled = await filterBar.getFilterFieldEnabled("StringProperty");

				const interactionModel = this.getView().getModel("interactionModel");
				interactionModel.setProperty("/showFilterFieldButton/enabled", !isVisible);
				interactionModel.setProperty("/hideFilterFieldButton/enabled", isVisible);
				interactionModel.setProperty("/disableFilterFieldButton/enabled", isEnabled);
				interactionModel.setProperty("/enableFilterFieldButton/enabled", !isEnabled);
			}
		});
	}
);
