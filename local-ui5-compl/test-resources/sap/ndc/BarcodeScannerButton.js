/*global cordova, EB, ImageCapture */

sap.ui.define([
	"sap/m/App",
	"sap/m/Label",
	"sap/m/GroupHeaderListItem",
	"sap/m/InputListItem",
	"sap/m/CheckBox",
	"sap/m/Input",
	"sap/ui/core/ListItem",
	"sap/m/Select",
	"sap/m/Text",
	"sap/m/StandardListItem",
	"sap/m/Switch",
	"sap/m/Panel",
	"sap/m/OverflowToolbar",
	"sap/m/Title",
	"sap/m/ToolbarSpacer",
	"sap/m/TextArea",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/Element",
	"sap/ui/core/library",
	"sap/m/MessageToast",
	"sap/m/Page",
	"sap/m/List",
	"sap/ui/core/Core",
	"sap/ui/model/json/JSONModel",
	"sap/ndc/BarcodeScanner",
	"sap/ndc/BarcodeScannerButton"
], function(App, Label, GroupHeaderListItem, InputListItem, CheckBox, Input, ListItem, Select, Text, StandardListItem, Switch, Panel, OverflowToolbar, Title, ToolbarSpacer, TextArea, jQuery, Element, coreLibrary, MessageToast, Page, List, Core, JSONModel, BarcodeScanner, BarcodeScannerButton) {
	"use strict";

	var oApp = new App("myApp", {initialPage: "myPage"});

	var oPage = new Page("myPage", {
		title:"Barcode Scanner Button Test page"
	});

	var oModel = new JSONModel({
		btnFallback: true,
		btnVisible: true,
		closeCode: "",
		mockFvEnabled: false,
		featureEnabled: true,
		mockScannerEnabled: false,
		mockCode: "1234567890123",
		mockCancel: false,
		dialogTitle: "",
		preferFrontCamera: false,
		frameRate: 30,
		zoom: 1,
		keepCameraScan: false,
		disableBarcodeInputDialog: false,
		tooltip: "Test the tooltip for Barcode Scanner Button",
		devices: [],
		theme: "sap_fiori_3",
		themes: [
			{key: "sap_horizon", label: "Morning Horizon (Light)"},
			{key: "sap_horizon_dark", label: "Evening Horizon (Dark)"},
			{key: "sap_horizon_hcb", label: "Horizon High Contrast Black"},
			{key: "sap_horizon_hcw", label: "Horizon High Contrast White"},
			{key: "sap_fiori_3", label: "Quartz Light"},
			{key: "sap_fiori_3_dark", label: "Quartz Dark"},
			{key: "sap_fiori_3_hcb", label: "Quartz High Contrast Black"},
			{key: "sap_fiori_3_hcw", label: "Quartz High Contrast White"},
			{key: "sap_belize", label: "Belize"},
			{key: "sap_belize_plus", label: "Belize Deep"},
			{key: "sap_belize_hcb", label: "Belize High Contrast Black"},
			{key: "sap_belize_hcw", label: "Belize High Contrast White"},
			{key: "sap_bluecrystal", label: "SAP BlueCrystal"},
			{key: "sap_hcb", label: "SAP HCB"}
		],
		scanAPIInfo: "",
		bluetoothScannerEnable: false,
		bluetoothScannerSettings: {
			handleFocusedElement: false,
			triggerOneTime:false,
			// focusedCurrentWindow: true,
			scanResultOneWidth:'25rem',
			replaceGS1Separator: true,
			GS1FunctionKey: "altKey",
			GS1Code: undefined,
			GS1ReplacementCharacter: undefined,
			scanningMode: "TimeInterval",
			intervalForDetection:80,
			prefix: "$",
			suffix: "#",
			maxPrefixSuffixScanningTime: 5000
		},
		GS1FunctionKeyItems: [
			{
				"keyId": "altKey",
				"keyName": "altKey"
			},
			{
				"keyId": "ctrlKey",
				"keyName": "ctrlKey"
			},
			{
				"keyId": "shiftKey",
				"keyName": "shiftKey"
			},
			{
				"keyId": "metaKey",
				"keyName": "metaKey"
			}
		],
		scanningModeItems: [
			{
				"modeId": "TimeInterval",
				"modeName": "TimeInterval"
			},
			{
				"modeId": "PrefixSuffix",
				"modeName": "PrefixSuffix"
			}
		]
	});
	oApp.setModel(oModel);
	Core.applyTheme(oModel.getProperty("/theme"));

	var oStatusModel = BarcodeScanner.getStatusModel();
	oApp.setModel(oStatusModel, "status");
	var oValueBinding = oStatusModel.bindProperty("/devices");
	oValueBinding.attachChange(function () {
		buildCameraList();
	});
	buildCameraList();

	var sCheckString;

	var oScanButton = new BarcodeScannerButton({
		provideFallback: "{/btnFallback}",
		visible: "{/btnVisible}",
		scanSuccess: onScanSuccess,
		scanFail: onScanError,
		inputLiveUpdate: onScanLiveupdate,
		dialogTitle: "{/dialogTitle}",
		preferFrontCamera: "{/preferFrontCamera}",
		frameRate: "{/frameRate}",
		zoom: "{/zoom}",
		keepCameraScan: "{/keepCameraScan}",
		tooltip: "{/tooltip}",
		disableBarcodeInputDialog: "{/disableBarcodeInputDialog}"

	});

	var oFioriClient = {};

	oPage.addContent(oScanButton);

	var oList = new List();

	oList.addItem(new GroupHeaderListItem({
		title: "Properties"
	}));
	oList.addItem(new InputListItem({
		label: "provideFallback",
		content: new CheckBox({
			selected: "{/btnFallback}"
		})
	}));
	oList.addItem(new InputListItem({
		label: "visible",
		content: new CheckBox({
			selected: "{/btnVisible}"
		})
	}));
	oList.addItem(new InputListItem({
		label: "preferFrontCamera",
		content: new CheckBox({
			selected: "{/preferFrontCamera}"
		})
	}));
	oList.addItem(new InputListItem({
		label: "dialogTitle",
		content: new Input({
			placeholder: "Enter Barcode",
			value: "{/dialogTitle}"
		})
	}));
	oList.addItem(new InputListItem({
		label: "frameRate",
		content: new Input("frameRate", {
			type : "Number",
			placeholder: "Enter Frame Rate",
			value: "{/frameRate}",
			liveChange: onInputLiveChangeStringToNumber
		})
	}));
	oList.addItem(new InputListItem({
		label: "zoom",
		content: new Input("zoom", {
			type : "Number",
			placeholder: "Enter zoom",
			value: "{/zoom}",
			liveChange: onInputLiveChangeStringToNumber
		})
	}));
	oList.addItem(new InputListItem({
		label: "keepCameraScan",
		content: new CheckBox({
			selected: "{/keepCameraScan}"
		})
	}));
	oList.addItem(new InputListItem({
		label: "disableBarcodeInputDialog",
		content: new CheckBox({
			selected: "{/disableBarcodeInputDialog}"
		})
	}));
	oList.addItem(new InputListItem({
		label: "tooltip",
		content: new Input({
			placeholder: "Enter tooltip",
			value: "{/tooltip}"
		})
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Nomal Configs"
	}));
	oList.addItem(new InputListItem({
		label: "Enable GS1Header",
		content: new CheckBox({
			selected: "{/enableGS1Header}",
			select: onChangeEnableGS1Header
		})
	}));
	oList.addItem(new InputListItem({
		label: "Change Scanner",
		content: new Select("scannerAPI", {
			forceSelection: false,
			selectedKey: "{status>/scannerAPI}",
			showSecondaryValues: true,
			change: function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				var sKey = oSelectedItem.getKey();
				if (BarcodeScanner.setScanAPIInfo(sKey)) {
					MessageToast.show("Change scanner API to " + sKey + " successful.", { duration:3000 });
				} else {
					var oPreviourSelectedItem = oEvent.getParameter("previousSelectedItem");
					var sPreviousKey = oPreviourSelectedItem.getKey();
					var oSelect = oEvent.getSource();
					oSelect.setSelectedKey(sPreviousKey);
					MessageToast.show("Change scanner API to " + sKey + " failed!", { duration:3000 });
				}
			},
			items: {
				path: "status>/apis",
				template: new ListItem({
					key: "{status>key}",
					//enabled: "{= ${status>status} !== 'UnAvailable'}",
					/*enabled: {
						path: "status>status",
						formatter: function (status) {
							if (status === "UnAvailable") {
								return false;
							} else {
								return true;
							}
						}
					},*/
					text: "{status>key}",
					additionalText: "{status>status}"
				})
			}
		})
	}));
	oList.addItem(new InputListItem({
		label: "Change Camera",
		content: new Select("deviceId", {
			selectedKey: "{status>/deviceId}",
			showSecondaryValues: false,
			change: onChangeCamera,
			items: {
				path: "/devices",
				template: new ListItem({
					key: "{deviceId}",
					text: "{label}",
					additionalText: "{groupId}"
				})
			}
		})
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Scan Multiple Barcodes"
	}));
	oList.addItem(new InputListItem({
		label: "Enabled",
		content: new CheckBox({
			selected: "{status>/apis/ZXingCPP/multiScan/enabled}",
			select: onChangeEnableMultiScan
		})
	}));
	oList.addItem(new InputListItem({
		label: "Show Pause Button",
		visible: "{status>/apis/ZXingCPP/multiScan/enabled}",
		content: new CheckBox({
			selected: "{status>/apis/ZXingCPP/multiScan/showPauseButton}",
			select: onChangeShowPauseButton
		})
	}));
	oList.addItem(new InputListItem({
		label: "Pause if has results",
		//visible: "{= ${status>/apis/ZXingCPP/multiScan/enabled} && !${status>/apis/ZXingCPP/multiScan/showPauseButton}}",
		visible: {
			parts: [
				'status>/apis/ZXingCPP/multiScan/enabled',
				'status>/apis/ZXingCPP/multiScan/showPauseButton'
			],
			formatter: function(bEnabled, bShowPauseButton) {
				return bEnabled && !bShowPauseButton;
			}
		},
		content: new CheckBox({
			selected: "{status>/apis/ZXingCPP/multiScan/pauseIfHasResult}",
			select: onChangePauseIfHasResult
		})
	}));
	oList.addItem(new InputListItem({
		label: "Stop if only has 1 result",
		//visible: "{= ${status>/apis/ZXingCPP/multiScan/enabled} && !${status>/apis/ZXingCPP/multiScan/showPauseButton} && ${status>/apis/ZXingCPP/multiScan/pauseIfHasResult}}",
		visible: {
			parts: [
				'status>/apis/ZXingCPP/multiScan/enabled',
				'status>/apis/ZXingCPP/multiScan/showPauseButton',
				'status>/apis/ZXingCPP/multiScan/pauseIfHasResult'
			],
			formatter: function(bEnabled, bShowPauseButton, bPauseIfHasResult) {
				return bEnabled && !bShowPauseButton && bPauseIfHasResult;
			}
		},
		content: new CheckBox({
			selected: "{status>/apis/ZXingCPP/multiScan/stopIfOnlyHasOneResult}",
			select: onChangeStopIfOnlyHasOneResult
		})
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Scan Result"
	}));
	oList.addItem(new InputListItem({
		label: "Text",
		content: [
			new Text("scanningResultText", {
				textAlign: "Right",
				renderWhitespace: true,
				wrappingType: "Hyphenated",
				text: ""
			})
		]
	}));
	oList.addItem(new InputListItem({
		label: "Time",
		content: [
			new Text("scanningResultTime", {
				textAlign: "Right",
				renderWhitespace: true,
				wrappingType: "Hyphenated",
				text: ""
			})
		]
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Scanner status"
	}));
	oList.addItem(new StandardListItem({
		title: "Feature available",
		info: "{status>/available}",
		infoState: {
			path: "status>/available",
			formatter: function (bAvailable) {
				if (bAvailable) {
					return coreLibrary.ValueState.Success;
				} else {
					return coreLibrary.ValueState.Error;
				}
			}
		}
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Close scan dialog if barcode is"
	}));
	oList.addItem(new InputListItem({
		label: "Barcode",
		content: new Input({
			placeholder: "Enter code",
			value: "{/closeCode}"
		})
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Mock Feature"
	}));
	oList.addItem(new InputListItem({
		label: "Mock FV",
		content: new Switch({
			state: "{/mockFvEnabled}",
			change: onMockFVToggle
		})
	}));
	oList.addItem(new InputListItem({
		label: "Feature enabled",
		content: new CheckBox({
			selected: "{/featureEnabled}",
			select: fireSettingsDoneEvent
		}),
		visible: "{/mockFvEnabled}"
	}));
	oList.addItem(new InputListItem({
		label: "Mock Scanner",
		content: new Switch({
			state: "{/mockScannerEnabled}",
			change: onMockScannerToggle
		})
	}));
	oList.addItem(new InputListItem({
		label: "Barcode",
		content: new Input({
			placeholder: "Enter code",
			value: "{/mockCode}"
		}),
		visible: "{/mockScannerEnabled}"
	}));
	oList.addItem(new InputListItem({
		label: "Scan cancelled",
		content: new CheckBox({
			selected: "{/mockCancel}"
		}),
		visible: "{/mockScannerEnabled}"
	}));

	oList.addItem(new GroupHeaderListItem({
		title: "Page settings"
	}));
	oList.addItem(new InputListItem({
		label: "Change Theme",
		content: new Select("theme", {
			selectedKey: "{/theme}",
			showSecondaryValues: false,
			change: onSwitchTheme,
			items: {
				path: "/themes",
				template: new ListItem({
					key: "{key}",
					text: "{label}"
				})
			}
		})
	}));
	oList.addItem(new GroupHeaderListItem({
		title: "Bluetooth Scanner"
	}));
	oPage.addContent(oList);
	var oBluetoothScannerPanel = new Panel("bluetoothScannerConfigPanel", {
		expandable: true,
		expand: onExpand,
		width: "auto",
		headerToolbar: new OverflowToolbar({
			content: [
				new Title({
					text: "Bluetooth Scanner"
				}),
				new ToolbarSpacer(),
				new Switch("bluetoothScannerSwitch", {
					state: "{/bluetoothScannerEnable}",
					change: onSwitchBluetoothScanner
				})
			]
		}),
		content: [
			new Label({
				text: "Barcode Scanner Settings"
			}),
			new List({
				items: [
					new InputListItem({
						label: "Trigger One Time",
						content: new CheckBox("triggerOneTime", {
							selected: "{/bluetoothScannerSettings/triggerOneTime}",
							select: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "Handle Focused Element",
						content: new CheckBox("handleFocusedElement", {
							selected: "{/bluetoothScannerSettings/handleFocusedElement}",
							select: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "Enable GS1",
						content: new CheckBox("replaceGS1Separator", {
							selected: "{/bluetoothScannerSettings/replaceGS1Separator}",
							select: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "GS1 Function Key",
						content: new Select("GS1FunctionKey", {
							selectedKey: "{/bluetoothScannerSettings/GS1FunctionKey}",
							showSecondaryValues: false,
							change: updateBluetoothScannerSettings,
							visible: "{/bluetoothScannerSettings/replaceGS1Separator}",
							items: {
								path: "/GS1FunctionKeyItems",
								template: new ListItem({
									key: "{keyId}",
									text: "{keyName}"
								})
							}
						})
					}),
					new InputListItem({
						label: "GS1 Code",
						content: new Input("GS1Code", {
							visible: "{/bluetoothScannerSettings/replaceGS1Separator}",
							placeholder: "Enter GS1Code",
							value: "{/bluetoothScannerSettings/GS1Code}",
							liveChange: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "GS1ReplacementCharacter",
						content: new Input("GS1ReplacementCharacter", {
							visible: "{/bluetoothScannerSettings/replaceGS1Separator}",
							placeholder: "Enter GS1ReplacementCharacter",
							value: "{/bluetoothScannerSettings/GS1ReplacementCharacter}",
							liveChange: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "Scanning Mode",
						content: new Select("scanningMode", {
							selectedKey: "{/bluetoothScannerSettings/scanningMode}",
							showSecondaryValues: false,
							change: updateBluetoothScannerSettings,
							items: {
								path: "/scanningModeItems",
								template: new ListItem({
									key: "{modeId}",
									text: "{modeName}"
								})
							}
						})
					}),
					new InputListItem({
						label: "intervalForDetection",
						content: new Input("intervalForDetection", {
							visible: {
								path: "/bluetoothScannerSettings/scanningMode",
								formatter: function(oScanningMode) {
									if (oScanningMode === "TimeInterval") {
										return true;
									} else {
										return false;
									}
								}
							},
							type: "Number",
							placeholder: "Enter intervalForDetection",
							value: "{/bluetoothScannerSettings/intervalForDetection}",
							liveChange: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "prefix",
						content: new Input("prefix", {
							visible: {
								path: "/bluetoothScannerSettings/scanningMode",
								formatter: function(oScanningMode) {
									if (oScanningMode === "TimeInterval") {
										return false;
									} else {
										return true;
									}
								}
							},
							placeholder: "Enter prefix",
							value: "{/bluetoothScannerSettings/prefix}",
							liveChange: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "suffix",
						content: new Input("suffix", {
							// visible: "{= ${/bluetoothScannerSettings/scanningMode} === 'TimeInterval'}",
							visible: {
								path: "/bluetoothScannerSettings/scanningMode",
								formatter: function(oScanningMode) {
									if (oScanningMode === "TimeInterval") {
										return false;
									} else {
										return true;
									}
								}
							},
							placeholder: "Enter suffix",
							value: "{/bluetoothScannerSettings/suffix}",
							liveChange: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "maxPrefixSuffixScanningTime",
						content: new Input("maxPrefixSuffixScanningTime", {
							visible: {
								path: "/bluetoothScannerSettings/scanningMode",
								formatter: function(oScanningMode) {
									if (oScanningMode === "TimeInterval") {
										return false;
									} else {
										return true;
									}
								}
							},
							type: "Number",
							placeholder: "Enter maxPrefixSuffixScanningTime",
							value: "{/bluetoothScannerSettings/maxPrefixSuffixScanningTime}",
							liveChange: updateBluetoothScannerSettings
						})
					}),
					new InputListItem({
						label: "Testing Text area",
						content: new TextArea({
							value: ""
						})
					})
				]
			})
		]
	})
	oPage.addContent(oBluetoothScannerPanel);

	function onInputLiveChangeStringToNumber(oEvent) {
		var oValue = oEvent.getParameter("value");
		var oId = oEvent.getParameter("id");
		var oItem;
		if (oId.match(/frameRate/)) {
			oItem = 'frameRate';
		} else if (oId.match(/zoom/)) {
			oItem = 'zoom';
		}
		var vm = oApp.getModel();
		var vmd = vm.getData();
		if (oValue === '' || oValue === null) {
			delete vmd[oItem];
		} else {
			vmd[oItem] = Number(oValue);
		}
		vm.refresh();
	}

	function onScanSuccess(oEvent) {
		if (oEvent.getParameter("cancelled")) {
			MessageToast.show("Scan cancelled", { duration:1000 });
		} else {
			MessageToast.show("Scanned: " + oEvent.getParameter("text"), { duration:2000 });
			Element.getElementById('scanningResultText').setText(oEvent.getParameter("text"));
			Element.getElementById("scanningResultTime").setText(oEvent.getParameter("scanningTime") + " ms");
			getScanAPIStatus();
			Element.getElementById('bluetoothScannerSwitch').setState(oModel.getProperty("/scanAPIInfo").indexOf("BluetoothScanner") > 0);
		}
	}


	function onScanError(oEvent) {
		MessageToast.show("Scan failed:" + oEvent.getParameter("message"), { duration:3000 });
	}

	function onScanLiveupdate(oEvent) {
		var sCloseCode = oModel.getProperty("/closeCode");
		if (sCloseCode && sCloseCode === oEvent.getParameter("newValue")) {
			BarcodeScanner.closeScanDialog();
		}
	}

	function fireSettingsDoneEvent() {
		var oEvent = new CustomEvent("mockSettingsDone", { detail: { id: "mockSettingsDone", args: "SettingCompleted" } });
		document.dispatchEvent(oEvent);
	}

	function onMockFVToggle(oEvent) {
		var state = oEvent.getParameter("state");

		if (state) {
			try {
				oFioriClient.isFeatureEnabled = sap.Settings.isFeatureEnabled
			} catch (e) {
				sap.Settings = {};
			}

			sap.Settings.isFeatureEnabled = function (feature, success, error) {
				if (feature === "cordova.plugins.barcodeScanner") {
					success(oModel.getProperty("/featureEnabled"));
				} else if (oFioriClient.isFeatureEnabled) {
					oFioriClient.isFeatureEnabled.call(sap.Settings, feature, success, error);
				}
			}

		} else {
			sap.Settings.isFeatureEnabled = oFioriClient.isFeatureEnabled;
		}
		fireSettingsDoneEvent();
	}

	function onMockScannerToggle(oEvent) {
		var state = oEvent.getParameter("state");

		if (state) {
			try {
				oFioriClient.barcodeScanner = cordova.plugins.barcodeScanner
			} catch (e) {
				window.cordova = {
					plugins: {}
				};
			}

			cordova.plugins.barcodeScanner = {
				scan: function (success, error) {
					var mSettings = oModel.getData();

					if (typeof success === "function") {
						success({
							cancelled: mSettings.mockCancel,
							text: mSettings.mockCode
						});
					}
				}
			}
		} else {
			cordova.plugins.barcodeScanner = oFioriClient.barcodeScanner;
		}
		fireSettingsDoneEvent();
	}

	function onChangeEnableGS1Header(oEvent) {
		var bEnabled = oEvent.getParameter("selected");
		BarcodeScanner.setConfig({
			"enableGS1Header": bEnabled
		});
	}

	function onChangeEnableMultiScan(oEvent) {
		var bEnabled = oEvent.getParameter("selected");
		BarcodeScanner.setConfig({
			"multiScan": {
				"enabled": bEnabled
			}
		});
	}

	function onChangeShowPauseButton(oEvent) {
		var bEnabled = oEvent.getParameter("selected");
		BarcodeScanner.setConfig({
			"multiScan": {
				"showPauseButton": bEnabled
			}
		});
	}

	function onChangePauseIfHasResult(oEvent) {
		var bEnabled = oEvent.getParameter("selected");
		BarcodeScanner.setConfig({
			"multiScan": {
				"pauseIfHasResult": bEnabled
			}
		});
	}

	function onChangeStopIfOnlyHasOneResult(oEvent) {
		var bEnabled = oEvent.getParameter("selected");
		BarcodeScanner.setConfig({
			"multiScan": {
				"stopIfOnlyHasOneResult": bEnabled
			}
		});
	}

	function buildCameraList() {
		var oDevices = [];
		var oDevicesInStatusModel = oStatusModel.getProperty("/devices");
		if (oDevicesInStatusModel.length > 0) {
			// add an camera item with "deviceId" value "", then barcode scan will use default camera after selecting it
			oDevices = [{
				"deviceId": "",
				"label": "use default"
			}].concat(oDevicesInStatusModel);
		}
		oModel.setProperty("/devices", oDevices);
	}

	function onChangeCamera(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			var sKey = oSelectedItem.getKey();
			BarcodeScanner.setConfig({
				"deviceId": sKey
			});
		}
	}

	function onSwitchTheme(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem");
		if (oSelectedItem) {
			var sKey = oSelectedItem.getKey();
			Core.applyTheme(sKey);
		}
	}

	function getScanAPIStatus() {
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
	}

	function updateBluetoothScannerSettings(oEvent) {
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
	}

	function onSwitchBluetoothScanner(oEvent) {
		var that = this;
		if(oEvent && oEvent.getParameter("state")) {
			BarcodeScanner.enableBluetoothBarcodeScanner(onScanSuccess);
		} else {
			BarcodeScanner.disableBluetoothBarcodeScanner();
		}
		getScanAPIStatus();
	}

	function onExpand() {
		// User can implement the expand event of panel
	}

	oApp.addPage(oPage);

	oApp.placeAt("body");
});