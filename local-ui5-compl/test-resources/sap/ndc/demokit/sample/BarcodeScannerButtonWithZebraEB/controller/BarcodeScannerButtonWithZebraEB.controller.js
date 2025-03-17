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
		var resultNum;
		var zebraPhysicalScanNum;
		var zebraPhysicalScanResultCount;
		var oScanResultOne;
		var oScanResultTwo;
		var oScanResultThree;
		var oBluetoothScannerSwitch;

		var fnOnScanSuccessOne;
		var fnOnScanSuccessTwo;
		var fnOnScanSuccessThree;
		var fnGetScanAPIStatus;
		var oModel;
		var nextCallBackElement = "one";

		return Controller.extend("sap.ndc.sample.BarcodeScannerButtonWithZebraEB.controller.BarcodeScannerButtonWithZebraEB", {
			onInit: function () {
				oModel = new JSONModel({
					scanAPIInfo: '',
					keepCameraScanOne: false,
					keepCameraScanTwo: false,
					keepCameraScanThree: false,
					bluetoothBarcodeScannerStatus: false,
					handleFocusedElement: false,
					triggerOneTime:false,
					// focusedCurrentWindow: true,
					scanResultOneWidth:'25rem',
					replaceGS1Separator: false,

					GS1FunctionKey: "altKey",
					GS1FunctionKeyItems: [
						{
							"keyId": "altKey",
							"keyName": "altKey"
						},
						{
							"keyId": "ctrlKey",
							"keyName": "ctrlKey"
						}
					],
					GS1Code: undefined,
					GS1ReplacementCharacter: undefined,
					scanningMode: "TimeInterval",
					scanningModeItems: [
						{
							"modeId": "TimeInterval",
							"modeName": "TimeInterval"
						},
						{
							"modeId": "PrefixSuffix",
							"modeName": "PrefixSuffix"
						}
					],
					intervalForDetection:80,
					prefix: "$",
					suffix: "#",
					maxPrefixSuffixScanningTime: 5000
				})
				this.getView().setModel(oModel);
				resultNum = 0;
				nextCallBackElement = "one";
				zebraPhysicalScanNum = 0;
				zebraPhysicalScanResultCount = 0;
				prefixId = this.createId();
				if (prefixId){
					prefixId = prefixId.split("--")[0] + "--";
				} else {
					prefixId = "";
				}
				oScanResultOne = Element.getElementById(prefixId + 'sampleBarcodeScannerResultOne');
				oScanResultTwo = Element.getElementById(prefixId + 'sampleBarcodeScannerResultTwo');
				oScanResultThree = Element.getElementById(prefixId + 'sampleBarcodeScannerResultThree');
				oBluetoothScannerSwitch = Element.getElementById(prefixId + 'bluetoothScannerSwitch');
				if (oBluetoothScannerSwitch) {
					oModel.setProperty("/bluetoothBarcodeScannerStatus", oBluetoothScannerSwitch.getState());
				}
			},

			onReset: function() {
				this.onInit();
				oScanResultOne.setValue('');
				oScanResultTwo.setValue('');
				oScanResultThree.setValue('');

				oScanResultOne.onfocusout();
				oScanResultTwo.onfocusout();
				oScanResultThree.onfocusout();
				var options = {
					handleFocusedElement: oModel.getProperty("/handleFocusedElement"),
					// focusedCurrentWindow: oModel.getProperty("/focusedCurrentWindow"),
					triggerOneTime: oModel.getProperty("/triggerOneTime"),
					replaceGS1Separator: oModel.getProperty("/replaceGS1Separator"),
					GS1FunctionKey: oModel.getProperty("/GS1FunctionKey"),
					GS1Code: oModel.getProperty("/GS1Code"),
					GS1ReplacementCharacter: oModel.getProperty("/GS1ReplacementCharacter"),
					scanningMode: oModel.getProperty("/scanningMode"),
					intervalForDetection: oModel.getProperty("/intervalForDetection"),
					prefix: oModel.getProperty("/prefix"),
					suffix: oModel.getProperty("/suffix")
				};
				BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessOne, options);
				this.getScanAPIStatus();
				oBluetoothScannerSwitch.setState(oModel.getProperty("/scanAPIInfo").indexOf("BluetoothScanner") > 0);
			},

			onScanSuccessOne: function(oEvent) {
				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration:1000 });
				} else {
					if (oEvent.getParameter("text") !== undefined && oEvent.getParameter("text") !== null) {
						resultNum = resultNum + 1;
						oScanResultOne.setValue("Result(" + resultNum +"):" + oEvent.getParameter("text"));
						if (zebraPhysicalScanNum < resultNum) {
							zebraPhysicalScanResultCount = 0;
							zebraPhysicalScanNum = resultNum;
						}
						nextCallBackElement = "two";
						if (fnGetScanAPIStatus().indexOf("ZebraEnterpriseBrowser") > 0 ) {
							BarcodeScanner.setPhysicalScan(fnOnScanSuccessTwo);
						}
						oBluetoothScannerSwitch.setState(oModel.getProperty("/scanAPIInfo").indexOf("BluetoothScanner") > 0);
						if (oBluetoothScannerSwitch.getState()) {
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessTwo);
						}
					} else {
						oScanResultOne.setValue('');
					}
				}
			},

			onScanErrorOne: function(oEvent) {
				MessageToast.show("Button One Scan failed: " + oEvent, { duration:1000 });
			},

			onScanSuccessTwo: function(oEvent) {
				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration:1000 });
				} else {
					if (oEvent.getParameter("text") !== undefined && oEvent.getParameter("text") !== null) {
						resultNum = resultNum + 1;
						oScanResultTwo.setValue("Result(" + resultNum +"):" + oEvent.getParameter("text"));
						if (zebraPhysicalScanNum < resultNum) {
							zebraPhysicalScanResultCount = 0;
							zebraPhysicalScanNum = resultNum;
						}
						nextCallBackElement = "three";
						if (fnGetScanAPIStatus().indexOf("ZebraEnterpriseBrowser") > 0 ) {
							BarcodeScanner.setPhysicalScan(fnOnScanSuccessThree);
						}
						oBluetoothScannerSwitch.setState(oModel.getProperty("/scanAPIInfo").indexOf("BluetoothScanner") > 0);
						if (oBluetoothScannerSwitch.getState()) {
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessThree);
						}
					} else {
						oScanResultTwo.setValue('');
					}
				}
			},

			onScanErrorTwo: function(oEvent) {
				MessageToast.show("Button Two Scan failed: " + oEvent, { duration:1000 });
			},

			onScanSuccessThree: function(oEvent) {
				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration:1000 });
				} else {
					if (oEvent.getParameter("text") !== undefined && oEvent.getParameter("text") !== null) {
						resultNum = resultNum + 1;
						oScanResultThree.setValue("Result(" + resultNum +"):" + oEvent.getParameter("text"));
						if (zebraPhysicalScanNum < resultNum) {
							zebraPhysicalScanResultCount = 0;
							zebraPhysicalScanNum = resultNum;
						}
						nextCallBackElement = "one";
						if (fnGetScanAPIStatus().indexOf("ZebraEnterpriseBrowser") > 0 ) {
							BarcodeScanner.setPhysicalScan(fnOnScanSuccessOne);
						}
						oBluetoothScannerSwitch.setState(oModel.getProperty("/scanAPIInfo").indexOf("BluetoothScanner") > 0);
						if (oBluetoothScannerSwitch.getState()) {
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessOne);
						}
					} else {
						oScanResultThree.setValue('');
					}
				}
			},

			onScanErrorThree: function(oEvent) {
				MessageToast.show("Button Three Scan failed: " + oEvent, { duration:1000 });
			},

			onScanLiveUpdate: function(oEvent) {
				// User can implement the validation about inputting value
			},

			updateScanAPIInfo: function() {
				var scanAPIInfoText;
				switch (BarcodeScanner.getScanAPIInfo()) {
						case "ZebraEnterpriseBrowser":
							scanAPIInfoText = "The using Scan API is from Zebra Enterprise Browser.";
							break;
						case "Cordova":
							scanAPIInfoText = "The using Scan API is from Cordova.";
							break;
						case "ZXingCPP":
							scanAPIInfoText = "The using Scan API is from WebAssembly build (using Emcripten) of zxing-cpp.";
							break;
						case "ZXing":
							scanAPIInfoText = "The using Scan API is from zxing-js.";
							break;
						case "BluetoothScanner":
							scanAPIInfoText = "The using Scan API is from Bluetooth Scanner.";
							break;
						default:
							scanAPIInfoText = 'There is not the available API for scanning.';
							break;
				};
				oModel.setProperty("/scanAPIInfo", scanAPIInfoText);
				oModel.checkUpdate(true);

			},

			getScanAPIStatus: function() {
				var scanAPIInfoText;
				var availableAPIArr = [];
				for (var key in BarcodeScanner.getStatusModel().getData().apis) {
					if (BarcodeScanner.getStatusModel().getData().apis[key].status === "Available" || BarcodeScanner.getStatusModel().getData().apis[key].status === "Initial") {
						if (key !== "ZXing") {
							availableAPIArr.push(key);
						}
					}
				}
				if (availableAPIArr.length > 1) {
					for(var i = 0; i < availableAPIArr.length; i++) {
						if (i === 0) {
							scanAPIInfoText = availableAPIArr[i];
						} else if (i === (availableAPIArr.length -1)) {
							scanAPIInfoText = scanAPIInfoText + " and " + availableAPIArr[i];
						} else {
							scanAPIInfoText = scanAPIInfoText + ", " + availableAPIArr[i];
						}
					}
					scanAPIInfoText = "The available Scan API are " + scanAPIInfoText + ".";
				} else if (availableAPIArr.length === 1) {
					scanAPIInfoText = "The available Scan API is " + availableAPIArr[0] + ".";
				} else if (availableAPIArr.length === 0) {
					scanAPIInfoText = "There is not the available API for scanning.";
				}
				oModel.setProperty("/scanAPIInfo", scanAPIInfoText);
				oModel.checkUpdate(true);
				return scanAPIInfoText;
			},

			updateBluetoothScannerSettings: function(oEvent) {
				var oId = oEvent.getParameter("id");
				var options = {};
				if (oId.match(/handleFocusedElement/)) {
					options = {
						"handleFocusedElement": oEvent.getParameter("selected")
					};
				} else if (oId.match(/triggerOneTime/)) {
					options = {
						"triggerOneTime": oEvent.getParameter("selected")
					};
				} else if (oId.match(/intervalForDetection/)) {
					options = {
						"intervalForDetection": Number(oEvent.getParameter("value"))
					};
				} else if (oId.match(/replaceGS1Separator/)) {
					options = {
						"replaceGS1Separator": oEvent.getParameter("selected")
					};
				} else if (oId.match(/GS1FunctionKey/)) {
					options = {
						"GS1FunctionKey": oEvent.getParameters().selectedItem.getKey()
					};
				}  else if (oId.match(/GS1Code/)) {
					options = {
						"GS1Code": oEvent.getParameter("value")
					};
				} else if (oId.match(/GS1ReplacementCharacter/)) {
					options = {
						"GS1ReplacementCharacter": oEvent.getParameter("value")
					};
				}  else if (oId.match(/scanningMode/)) {
					options = {
						"scanningMode": oEvent.getParameters().selectedItem.getKey()
					};
				} else if (oId.match(/prefix/)) {
					options = {
						"prefix": oEvent.getParameter("value")
					};
				}  else if (oId.match(/suffix/)) {
					options = {
						"suffix": oEvent.getParameter("value")
					};
				}  else if (oId.match(/maxPrefixSuffixScanningTime/)) {
					options = {
						"maxPrefixSuffixScanningTime": Number(oEvent.getParameter("value"))
					};
				}

				BarcodeScanner.enableBluetoothBarcodeScanner(null, options);
			},

			onSwitchBluetoothScanner: function(oEvent) {
				var that = this;
				if(oEvent && oEvent.getParameter("state")) {
					switch (nextCallBackElement) {
						case "one":
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessOne);
							break;
						case "two":
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessTwo);
							break;
						case "three":
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessThree);
							break;
						default:
							BarcodeScanner.enableBluetoothBarcodeScanner(fnOnScanSuccessOne);
							break;
					};
				} else {
					BarcodeScanner.disableBluetoothBarcodeScanner();
				}
				that.getScanAPIStatus();
			},

			onAfterRendering: function() {
				var that = this;
				fnOnScanSuccessOne = that.onScanSuccessOne;
				fnOnScanSuccessTwo = that.onScanSuccessTwo;
				fnOnScanSuccessThree = that.onScanSuccessThree;
				BarcodeScanner.setPhysicalScan(fnOnScanSuccessOne);

				that.onReset();
				fnGetScanAPIStatus = that.getScanAPIStatus;
			}
		});
	});
