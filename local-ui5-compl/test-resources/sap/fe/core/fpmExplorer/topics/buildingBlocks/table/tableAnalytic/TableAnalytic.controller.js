sap.ui.define(
	[
		"sap/fe/core/PageController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/fe/navigation/PresentationVariant",
		"sap/base/Log"
	],
	function (PageController, JSONModel, MessageToast, PresentationVariant, Log) {
		"use strict";

		return PageController.extend("sap.fe.core.fpmExplorer.tableAnalytic.TableAnalytic", {
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
					setPVButton: {
						type: "Success",
						tooltip: ""
					}
				});
				view.setModel(interactionModel, "interactionModel");
				this.tablePVToCodeEditor();
			},

			tablePVToCodeEditor: function () {
				// accessing custom element from FPM sample
				var table = this.getView().byId("MyAnalyticalTable");
				var interactionModel = table.getModel("interactionModel");

				/** getPresentationVariant API: gives the current presentation from the table */
				/*****************************************************************************************/
				table.getPresentationVariant().then(function (presentationVariant) {
					interactionModel.setProperty("/pvObject", JSON.stringify(presentationVariant.toJSONObject(), null, "  "));
				});
				/*****************************************************************************************/
			},

			codeEditorPVToTable: function () {
				// accessing custom element from FPM sample
				var table = this.getView().byId("MyAnalyticalTable");
				var interactionModel = table.getModel("interactionModel");
				var pvString = interactionModel.getProperty("/pvObject");
				try {
					var presentationVariantToSet = new PresentationVariant(pvString);

					/** setPresentationVariant API: to apply the presentation variant to table */
					/**************************************************************************/
					table
						.setPresentationVariant(presentationVariantToSet)
						.then(function () {
							MessageToast.show("Presentation variant from code editor is set to table.");
						})
						.catch(function (err) {
							var message = err instanceof Error ? err.message : String(err);
							Log.error(`set PV error: ${message}`);
						});
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
			}
		});
	}
);
