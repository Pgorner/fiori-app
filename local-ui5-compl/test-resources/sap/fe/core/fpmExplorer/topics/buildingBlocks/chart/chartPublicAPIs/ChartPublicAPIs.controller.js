sap.ui.define(
	[
		"sap/fe/core/PageController",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/fe/navigation/PresentationVariant",
		"sap/fe/navigation/SelectionVariant",
		"sap/base/Log"
	],
	function (PageController, MessageToast, JSONModel, PresentationVariant, SelectionVariant, Log) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.chartPublicAPIs.ChartPublicAPIs", {
			handlers: {
				onVariantSaved: function () {
					MessageToast.show("Variant Saved");
				},

				onVariantSelected: function (oEvent) {
					MessageToast.show("Variant Selected");
				}
			},
			onAfterRendering: function () {
				var view = this.getView();
				var interactionModel = new JSONModel({
					pvObject: "",
					variantKey: "",
					setPVButton: {
						type: "Success",
						tooltip: ""
					},
					svObject: "",
					setSVButton: {
						type: "Success",
						tooltip: ""
					}
				});
				view.setModel(interactionModel, "interactionModel");
				this.chartPVToCodeEditor();
				this.chartSVToCodeEditor();
			},
			onChartSelectionChanged: function () {
				MessageToast.show("Selection changed");
			},
			chartPVToCodeEditor: function () {
				var chart = this.getView().byId("chartPublicAPIs");
				var interactionModel = chart.getModel("interactionModel");

				/** getPresentationVariant API: gives the current presentation from the table */
				/*****************************************************************************************/
				chart.getPresentationVariant().then(function (presentationVariant) {
					interactionModel.setProperty("/pvObject", JSON.stringify(presentationVariant.toJSONObject(), null, "  "));
				});
				/*****************************************************************************************/
			},
			codeEditorPVToChart: function () {
				var view = this.getView();
				var chart = this.getView().byId("chartPublicAPIs");
				var interactionModel = chart.getModel("interactionModel");
				var pvObject = JSON.parse(interactionModel.getProperty("/pvObject"));

				try {
					var presentationVariant = new PresentationVariant(pvObject);
					/** setPresentationVariant API: applies the supplied presentation to the chart */
					/*****************************************************************************************/
					chart
						.setPresentationVariant(presentationVariant)
						.then((x) => {
							MessageToast.show("Presentation variant from code editor is set to chart.");
						})
						.catch(function (err) {
							var message = err instanceof Error ? err.message : String(err);
							Log.error(`set SV error: ${message}`);
						});
					view.setModel(interactionModel, "interactionModel");
					/**************************************************************************/
				} catch (err) {
					var message = err instanceof Error ? err.message : String(err);
					Log.error(`PV creation error: ${message}`);
				}
			},

			validatePV: function (event) {
				// To validate the presentation variant in code editor and change the status and type of "setPresentationVariant" button.
				var interactionModel = event.getSource().getModel("interactionModel");
				var pvString = event.getParameter("value");
				try {
					var presentationVariantToSet = new PresentationVariant(pvString);
					interactionModel.setProperty("/setPVButton/type", presentationVariantToSet ? "Success" : "Critical");
				} catch (err) {
					interactionModel.setProperty("/setPVButton/type", "Critical");
					interactionModel.setProperty("/setPVButton/tooltip", "Presentation Variant validation failed in code editor");
				}
			},

			variantToCodeEditor: function () {
				// accessing custom element from FPM sample
				var chart = this.getView().byId("chartPublicAPIs");
				var interactionModel = chart.getModel("interactionModel");
				interactionModel.setProperty("/variantKey", chart.getCurrentVariantKey());
			},

			codeEditorToVariant: function () {
				// accessing custom element from FPM sample
				var chart = this.getView().byId("chartPublicAPIs");
				var interactionModel = chart.getModel("interactionModel");
				var variantKey = interactionModel.getProperty("/variantKey");
				try {
					chart.setCurrentVariantKey(variantKey);
				} catch (err) {
					var message = err instanceof Error ? err.message : String(err);
					Log.error(`PV creation error: ${message}`);
				}
			},

			chartSVToCodeEditor: function () {
				var chart = this.getView().byId("chartPublicAPIs");
				var interactionModel = chart.getModel("interactionModel");

				/** getSelectionVariant API: gives the current selections from the chart */
				/*****************************************************************************************/
				chart.getSelectionVariant().then(function (selectionVariant) {
					interactionModel.setProperty("/svObject", JSON.stringify(selectionVariant.toJSONObject(), null, "  "));
				});
				/*****************************************************************************************/
			},

			codeEditorSVToChart: function () {
				// accessing custom element from FPM sample
				var chart = this.getView().byId("chartPublicAPIs");
				var interactionModel = chart.getModel("interactionModel");
				var svString = interactionModel.getProperty("/svObject");
				try {
					var selectionVariantToSet = new SelectionVariant(svString);

					/** setSelectionVariant API: to apply the selection variant to chart */
					/**************************************************************************/
					chart
						.setSelectionVariant(selectionVariantToSet)
						.then(function () {
							MessageToast.show("Selection variant from code editor is set to chart.");
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
			}
		});
	}
);
