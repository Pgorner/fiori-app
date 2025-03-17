sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ndc/BarcodeScanner"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function(Element, Controller, MessageToast, JSONModel, BarcodeScanner) {
		"use strict";

		var prefixId;
		var oScanResultText;
		var oScanResultTime;

		return Controller.extend("sap.ndc.sample.BarcodeScannerButtonUpdateCameraSettings.controller.BarcodeScannerButtonUpdateCameraSettings", {
			onInit: function () {
				prefixId = this.createId();
				if (prefixId){
					prefixId = prefixId.split("--")[0] + "--";
				} else {
					prefixId = "";
				}
				oScanResultText = Element.getElementById(prefixId + 'sampleBarcodeScannerButtonUpdateCameraSettingsResultText');
				oScanResultTime = Element.getElementById(prefixId + 'sampleBarcodeScannerButtonUpdateCameraSettingsResultTime');

				this.oModel = new JSONModel({
					preferFrontCameraValueOne: false,
					frameRateValueOne: 30,
					zoomValueOne: 1,
					enableGS1Header: false,
					keepCameraScanValueOne: false,
					disableBarcodeInputDialogValueOne: false,
					devices: []
				});
				this.getView().setModel(this.oModel);
				this.oStatusModel = BarcodeScanner.getStatusModel();
				this.getView().setModel(this.oStatusModel, "status");
				var oValueBinding = this.oStatusModel.bindProperty("/devices");
				oValueBinding.attachChange(function () {
					this.buildCameraList();
				}.bind(this));
				this.buildCameraList();
			},

			onInputLiveChangeStringToNumber: function(oEvent) {
				var oValue = oEvent.getParameter("value");
				var oId = oEvent.getParameter("id");
				var oItem;
				if (oId.match(/frameRate/)) {
					oItem = 'frameRate';
				} else if (oId.match(/zoom/)) {
					oItem = 'zoom';
				}
				if (oId.match(/One/)) {
					oItem = oItem + 'ValueOne';
				}
				var vm = this.getView().getModel();
				var vmd = vm.getData();
				if (oValue === '' || oValue === null) {
					delete vmd[oItem];
				} else {
					vmd[oItem] = Number(oValue);
				}
				vm.refresh();
			},

			onScanSuccess: function(oEvent) {
				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration:1000 });
				} else {
					if (oEvent.getParameter("text")) {
						oScanResultText.setText(oEvent.getParameter("text"));
						oScanResultTime.setText(oEvent.getParameter("scanningTime") + " ms");
					} else {
						oScanResultText.setText('');
						oScanResultTime.setText('');
					}
				}
			},

			onScanError: function(oEvent) {
				MessageToast.show("Scan failed: " + oEvent, { duration:1000 });
			},

			onScanLiveupdate: function(oEvent) {
				// User can implement the validation about inputting value
			},

			onChangeEnableGS1Header: function(oEvent) {
				var bEnabled = oEvent.getParameter("selected");
				BarcodeScanner.setConfig({
					"enableGS1Header": bEnabled
				});
			},

			buildCameraList: function() {
				var oDevices = [];
				var oDevicesInStatusModel = this.oStatusModel.getProperty("/devices");
				if (oDevicesInStatusModel.length > 0) {
					// add an camera item with "deviceId" value "", then barcode scan will use default camera after selecting it
					oDevices = [{
						"deviceId": "",
						"label": "use default"
					}].concat(oDevicesInStatusModel);
				}
				this.oModel.setProperty("/devices", oDevices);
			},

			onChangeEnableMultiScan: function(oEvent) {
				var bEnabled = oEvent.getParameter("selected");
				BarcodeScanner.setConfig({
					"multiScan": {
						"enabled": bEnabled
					}
				});
			},

			onChangeShowPauseButton: function(oEvent) {
				var bEnabled = oEvent.getParameter("selected");
				BarcodeScanner.setConfig({
					"multiScan": {
						"showPauseButton": bEnabled
					}
				});
			},

			onChangePauseIfHasResult: function(oEvent) {
				var bEnabled = oEvent.getParameter("selected");
				BarcodeScanner.setConfig({
					"multiScan": {
						"pauseIfHasResult": bEnabled
					}
				});
			},

			onChangeStopIfOnlyHasOneResult: function(oEvent) {
				var bEnabled = oEvent.getParameter("selected");
				BarcodeScanner.setConfig({
					"multiScan": {
						"stopIfOnlyHasOneResult": bEnabled
					}
				});
			},

			onAfterRendering: function() {
				// Reset the scan result
				var oScanButton = Element.getElementById(prefixId + 'sampleBarcodeScannerButtonUpdateCameraSettings');
				if (oScanButton) {
					$(oScanButton.getDomRef()).on("click", function(){
						oScanResultText.setText('');
						oScanResultTime.setText('');
					});
				}
			}
		});
	});
