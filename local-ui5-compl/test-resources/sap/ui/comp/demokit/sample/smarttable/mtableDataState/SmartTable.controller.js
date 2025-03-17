sap.ui.define([
	"sap/ui/core/Messaging",
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/sample/smarttable/mockserver/DemoMockServer',
	'sap/ui/core/message/Message',
	'sap/ui/core/library'
], function(Messaging, Controller, ODataModel, DemoMockServer, Message, coreLibrary) {
	"use strict";

	var ValueState = coreLibrary.ValueState;

	return Controller.extend("sap.ui.comp.sample.smarttable.mtableDataState.SmartTable", {
		onInit: function () {
			var oView;

			this._oMockServer = new DemoMockServer();

			this.oModel = new ODataModel(this._oMockServer.getServiceUrl(), {
				defaultCountMode: "Inline"
			});

			oView = this.getView();
			oView.setModel(this.oModel);

			this.oTable = this.byId("table");
			this.oDataStatePlugin = this.byId("dataStatePlugin");
			this.oMessageManager = Messaging;
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		showRandomMessage: function() {
			var sTypes = Object.keys(ValueState);
			var sRandomType = sTypes[Math.floor(Math.random() * (sTypes.length - 1))];
			var sRandomText = Math.random().toString(36).substring(2);
			this.oDataStatePlugin.showMessage("Psst! This secret message is coming from the DataStateIndicator plugin: " + sRandomText, sRandomType);
		},

		onEnablePress: function(oEvent) {
			this.oDataStatePlugin.setEnabled(oEvent.getParameter("pressed"));
		},

		onCustomHandlingPress: function(oEvent) {
			this.bCustomHandling = oEvent.getParameter("pressed");
			if (this.bCustomHandling) {
				this.oDataStatePlugin.showMessage("");
			} else {
				this.byId("msgBtn").setVisible(false);
			}
		},

		onDataStateChange: function(oEvent) {
			if (!this.bCustomHandling) {
				return;
			}

			oEvent.preventDefault();

			var oDataState = oEvent.getParameter("dataState");
			var aMessages = oDataState.getMessages();
			var oMsgBtn = this.byId("msgBtn");
			if (aMessages.length) {
				oMsgBtn.setVisible(true).setText(aMessages.length);
				oMsgBtn.setIcon("sap-icon://message-" + aMessages[0].getType().toLowerCase());
			} else {
				oMsgBtn.setVisible(false);
			}
		},

		onFilterChange: function(oEvent) {
			this.sFilterValue = oEvent.getSource().getSelectedKey();
		},

		dataStateFilter: function(oMessage) {
			if (!this.sFilterValue) {
				return true;
			}

			return oMessage.getType() == this.sFilterValue;
		},

		addTableMessage: function(sType) {
			var sTableBindingPath = this.oTable.getBinding("items").getPath();
			this.oMessageManager.addMessages(
				new Message({
					message: "Hold on! " + sType + " message came out for the table.",
					fullTarget: sTableBindingPath,
					target: sTableBindingPath,
					type: sType,
					processor: this.oModel
				})
			);
		},

		addInputMessage: function(sType) {
			var aItems = this.oTable.getItems();
			var iRandomIndex = Math.floor(Math.random() * aItems.length);
			var sRandomBindingPath = aItems.map(function(oItem) {
				return oItem.getBindingContext().getPath();
			})[iRandomIndex];

			this.oMessageManager.addMessages(
				new Message({
					message: sType + " message on Input at index " + (iRandomIndex + 1),
					fullTarget: sRandomBindingPath + "/Name1",
					target: sRandomBindingPath + "/Name1",
					type: sType,
					processor: this.oModel
				})
			);
		},

		deleteMessage: function() {
			var oMessage = this.oMessageManager.getMessageModel().getData().pop();
			this.oMessageManager.removeMessages([oMessage]);
			this.oDataStatePlugin.refresh();
		},

		refreshMessages: function() {
			this.oDataStatePlugin.refresh();
		},

		clearMessages: function() {
			this.oMessageManager.removeAllMessages();
		},

		onExit: function () {
			this._oMockServer.destroy(this.getView());
		}
	});
});
