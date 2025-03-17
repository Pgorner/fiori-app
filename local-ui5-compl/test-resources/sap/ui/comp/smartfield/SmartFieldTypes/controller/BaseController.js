sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	'sap/ui/model/odata/v2/ODataModel',
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/ui/model/json/JSONModel",
	"sap/ui/base/EventProvider",
	"sap/ui/thirdparty/sinon-4",
	"sap/m/CustomListItem",
	"sap/m/Panel",
	"sap/m/Text"
], function(
	Controller,
	History,
	UIComponent,
	ODataModel,
	MockServer,
	BindingMode,
	JSONModel,
	EventProvider,
	sinon,
	CustomListItem,
	Panel,
	Text
	){
	"use strict";

	var oReadStub,
		oFireEventStub;

	return Controller.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.controller.BaseController", {

		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		},

		initMockServer: function(name) {
			//OData model contains the actual data for the smartfields, using the mockserver
			this.oMockServer = new MockServer({
				rootUri: name + "/"
			});
			this.oMockServer.simulate("localService/" + name + "/metadata.xml", "localService/" + name + "/");
			this.oMockServer.start();
			this.oModel = new ODataModel(name, true);
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
		},

		setModelAndBindings: function(sModelName) {
			//JSON Model is only being used for edit mode
			var oViewModel = new JSONModel({
				editMode: true
			});
			this.getView().setModel(oViewModel, "view");

			this.initMockServer(sModelName);
			this.getView().setModel(this.oModel);
			this.oDetail.bindElement("/" + sModelName + "('1001')");
		},

		registerRequestsLogging: function (oRequests, oEvents) {
			oReadStub?.restore();
			oFireEventStub?.restore();

			oReadStub = sinon.stub(ODataModel.prototype, "read");
			oFireEventStub = sinon.stub(EventProvider.prototype, "fireEvent");

			oReadStub.callsFake(function(sPath, mParameters){
				var oContext = this,
					sFilters = mParameters.filters ? JSON.stringify(mParameters.filters, null, 4) : "",
					sUrlParameters = mParameters.urlParameters ? JSON.stringify(mParameters.urlParameters, null, 4) : "",
					sContent = "Path:\n" + sPath + "\n\nParameters:\nFilters: " + sFilters + "\nurlParameters: " + sUrlParameters,
					oText = new Text({renderWhitespace: true}).setText(sContent),
					oCustomListItem = new CustomListItem({
						content: new Panel({
							headerText: sPath,
							content: oText,
							expandable: true
						})
					});

				oCustomListItem.data("sentRequest", {
					sentRequest: {
						path: sPath,
						filters: mParameters.filters,
						urlParameters: mParameters.urlParameters
					}
				});
				oRequests.addItem(oCustomListItem);

				return ODataModel.prototype.read.wrappedMethod.call(oContext, sPath, mParameters);
			});

			oFireEventStub.callsFake(function(sEventId, oParameters, bAllowPreventDefault, bEnableEventBubbling){
				var oContext = this,
					sText,
					oText,
					oCustomListItem;

				if (sEventId === "visibleChanged" ||
					sEventId === "modeToggled") {
						if (oContext.isA("sap.ui.comp.smartfield.SmartField")) {
							sText = "Source:\n" + oContext.getId() + "\n\nEventId:\n" + sEventId;

							oText = new Text({renderWhitespace: true}).setText(sText);

							oCustomListItem = new CustomListItem({
								content: new Panel({
									headerText: sText,
									content: oText,
									expandable: true
								})
							});

							oCustomListItem.data("fireEvent", {
								firedEvent: {
									source: oContext,
									eventId: sEventId,
									parameters: oParameters,
									allowPreventDefault: bAllowPreventDefault,
									enableEventBubbling: bEnableEventBubbling
								}
							});
							oEvents.addItem(oCustomListItem);
					}
				}

				return EventProvider.prototype.fireEvent.wrappedMethod.call(oContext, sEventId, oParameters, bAllowPreventDefault, bEnableEventBubbling);
			});

		},

		onEditPressed: function (oControlEvent) {
			var oViewModel = this.getView().getModel("view");
			oViewModel.setProperty("/editMode", true);
		},

		onCancelPressed: function (oControlEvent) {
			var oViewModel = this.getView().getModel("view"),
				oForm = this.oDetail.getContent()[0].getItems()[0];
			oForm.getModel().resetChanges();
			oForm.setEditable(false);
			oViewModel.setProperty("/editMode", false);
		},

		onSavePressed: function (oControlEvent) {
			var oViewModel = this.getView().getModel("view"),
				oForm = this.oDetail.getContent()[0].getItems()[0];
			oForm.getModel().submitChanges();
			oForm.setEditable(false);

			oViewModel.setProperty("/editMode", false);
		},

		onBindingContextRemove: function () {
			this.oDetail.unbindElement();
		},

		onProductSelect: function (oControlEvent) {
			var oProduct = oControlEvent.getParameter("listItem");

			this.oDetail.bindElement({
				path: oProduct.getBindingContext().getPath()
			});
		},

		clearRequestsLog: function() {
			this.oRequests.removeAllItems();
		},

		clearEventsLog: function() {
			this.oEvents.removeAllItems();
		},

		onExit: function() {
			if (this.oMockServer) {
				this.oMockServer.destroy();
				this.oMockServer = null;
			}
			if (this.oModel) {
				this.oModel.destroy();
				this.oModel = null;
			}
		}
	});
});