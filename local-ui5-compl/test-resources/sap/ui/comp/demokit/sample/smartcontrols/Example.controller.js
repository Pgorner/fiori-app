sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox',
	'sap/ui/comp/navpopover/LinkData',
	'sap/ui/core/util/MockServer',
	'sap/ui/core/Title',
	'sap/ui/layout/form/SimpleForm',
	'sap/m/Image',
	'sap/m/Text',
	'sap/m/FlexItemData',
	'sap/ui/model/odata/v2/ODataModel'
], function (Controller, MessageBox, LinkData, MockServer, Title, SimpleForm, Image, Text, FlexItemData, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartcontrols.Example", {

		onInit: function () {

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartcontrols/"
			});
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 100
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartcontrols/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartcontrols/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartcontrols", true);
			this.getView().setModel(this.oModel);
		},

		onTableInitialized: function () {
			var that = this;
			this.getView().byId("smartTable").getTable().attachRowSelectionChange(function (oEvent) {
				if (oEvent.getSource().getSelectedIndices().length === 1 && oEvent.getParameter("rowContext")) {
					that.getView().byId("smartForm").bindElement(oEvent.getParameter("rowContext").getPath());
					that.getView().byId("smartForm").setVisible(true);
				} else {
					that.getView().byId("smartForm").unbindElement();
					that.getView().byId("smartForm").setVisible(false);
				}
			});

		},
		onNavigationTargetsObtained: function (oEvent) {
			var oParameters = oEvent.getParameters();
			var oSemanticAttributes = oParameters.semanticAttributes;
			if (oSemanticAttributes.SemanticObjectCategory === "Projector") {
				oParameters.show("Supplier", new LinkData({
					text: "Homepage",
					href: "https://www.sap.com",
					target: "_blank"
				}), [
						new LinkData({
							text: "Edit"
						})
					], new SimpleForm({
						maxContainerCols: 1,
						content: [
							new Title({
								text: oSemanticAttributes.SemanticObjectName
							}), new Image({
								src: "test-resources/sap/ui/documentation/sdk/images/HT-6100.jpg", //oSemanticAttributes.ProductPicUrl,
								densityAware: false,
								width: "50px",
								height: "50px",
								layoutData: new FlexItemData({
									growFactor: 1
								})
							}), new Text({
								text: oSemanticAttributes.Description
							})
						]
					}));
			} else if (oSemanticAttributes.SemanticObjectCategory === "Printer") {
				oParameters.show("Supplier", new LinkData({
					text: "Homepage",
					href: "https://www.sap.com",
					target: "_blank"
				}), [
						new LinkData({
							text: "Edit"
						})
					], new SimpleForm({
						maxContainerCols: 1,
						content: [
							new Title({
								text: oSemanticAttributes.SemanticObjectName
							}), new Image({
								src: "test-resources/sap/ui/documentation/sdk/images/HT-1052.jpg", //oSemanticAttributes.ProductPicUrl,
								densityAware: false,
								width: "50px",
								height: "50px",
								layoutData: new FlexItemData({
									growFactor: 1
								})
							}), new Text({
								text: oSemanticAttributes.Description
							})
						]
					}));
			}
		},

		onNavigate: function (oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.text === "Homepage") {
				return;
			}
			MessageBox.show(oParameters.text + " has been pressed", {
				icon: MessageBox.Icon.INFORMATION,
				title: "SmartChart demo",
				actions: [
					MessageBox.Action.OK
				]
			});
		},

		onExit: function () {
			this.oMockServer.stop();
			this.oModel.destroy();
		}
	});
});