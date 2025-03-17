/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

/*global cordova, EB, ImageCapture */

// configure shim for zxingcpp library to allow AMD-like import
sap.ui.loader.config({
	shim: {
		'sap/ndc/thirdparty/zxingcpp/zxing_reader': {
			amd: true,
			exports: 'ZXing'
		}
	}
});

sap.ui.define([
		"sap/base/Log",
		'sap/ui/model/json/JSONModel',
		"sap/ui/model/BindingMode",
		'sap/ui/model/resource/ResourceModel',
		'sap/m/Input',
		'sap/m/Label',
		'sap/m/Button',
		'sap/m/Dialog',
		"sap/m/FlexBox",
		'sap/m/BusyDialog',
		"sap/ui/dom/includeStylesheet",
		"./BarcodeScannerUIContainer",
		"sap/m/MessageToast",
		'sap/m/library',
		"sap/ui/base/Event",
		"sap/ui/base/EventProvider",
		'sap/ui/Device',
		"sap/ui/thirdparty/jquery",
		"sap/base/util/deepClone",
		"sap/m/Avatar",
		"sap/ui/core/CustomData",
		"sap/m/MessageBox",
		"sap/m/_thirdparty/purify"
	],
	function(Log, JSONModel, BindingMode, ResourceModel, Input, Label, Button, Dialog, FlexBox, BusyDialog, includeStylesheet, BarcodeScannerUIContainer, MessageToast, mobileLibrary, Event, EventProvider, Device, jQuery, deepClone, Avatar, CustomData, MessageBox, DOMPurify) {
	"use strict";

	document.addEventListener("settingsDone", init);
	document.addEventListener("SettingCompleted", init);
	document.addEventListener("mockSettingsDone", init);

	includeStylesheet({
		url: sap.ui.require.toUrl("sap/ndc/css/sapNdcBarcodeScanner.css")
	});

	/**
	 * @class
	 *
	 * Please refer to <a target="_blank" rel="noopener,noreferrer" href="https://launchpad.support.sap.com/#/notes/2402585">SAP Note 2402585</a> for information on Barcode Scanner support in native iOS and Android browsers.
	 *
	 * Here is an example of how to trigger the scan function of BarcodeScanner:
	 * <pre>
	 * sap.ui.require(["sap/ndc/BarcodeScanner"], function(BarcodeScanner) {
	 * 	BarcodeScanner.scan(
	 * 		function (oResult) { / * process scan result * / },
	 * 		function (oError) { / * handle scan error * / },
	 * 		function (oResult) { / * handle input dialog change * / }
	 * 	);
	 * });
	 * </pre>
	 * The Barcode Scanner control can open the flashlight of Android devices if supported.
	 * The Barcode Scanner control can also scan the barcode from a selected image file in gallery, or a photo taking by System Camera App directly.
	 *
	 * The Barcode Scanner control integrates with the laser scanner when the page is loaded in the Enterprise Browser on a Zebra device. To enable laser scanning with a Zebra device, two JavaScript files (ebapi.js and eb.barcode.js) need to be loaded during runtime by the Enterprise Browser.
	 * <ul>
	 * <li>Your company admin / IT should configure the Barcode API settings in the Enterprise Browser config.xml file using mobile device management (MDM). Refer to <a target="_blank" rel="noopener,noreferrer" href="https://techdocs.zebra.com/enterprise-browser/3-3/guide/configreference/">CustomDOMElements</a> for detailed information (recommended).</li>
	 * <li>Developers can load these files directly into an HTML file. Refer to <a target="_blank" rel="noopener,noreferrer" href="https://techdocs.zebra.com/enterprise-browser/3-3/api/barcode/">Enabling the API</a> for detailed information.</li>
	 * <li>Developers can refer to the <a target="_blank" rel="noopener,noreferrer" href="https://launchpad.support.sap.com/#/notes/3390217">KBA 3390217</a> for guidance on configuring Zebra Enterprise Browser.</li>
	 * </ul>
	 *
	 * @author SAP SE
	 * @since 1.28.0
	 *
	 * @namespace
	 * @public
	 * @alias sap.ndc.BarcodeScanner
	 */
	var BarcodeScanner = {},

	/* =========================================================== */
	/* Internal methods and properties							 */
	/* =========================================================== */
		oStream,
		oScanDialog,
		oBarcodeScannerUIContainer,
		oVideoTrack,
		oBarcodeVideoDOM,
		oBarcodeCanvasDOM,
		oBarcodeImageDOM,
		oBarcodeImageCanvasDOM,
		oBarcodeOverlayDOM,
		oFocusedInstance,
		oScannerAPIStatus = {
			Initial: "Initial",
			Loading: "Loading",
			Available: "Available",
			UnAvailable : "UnAvailable"
		},
		oModel = new JSONModel({
			// current scanner API
			scannerAPI: "unknown",
			available: false,
			config: {
				defaultConstraints: {
					audio: false,
					video: {
						facingMode: 'environment'
					}
				},
				deviceId: undefined,
				preferFrontCamera: false,
				enableGS1Header: false
			},
			scanDialog: {
				title: "", //oDialogTitle
				onLiveUpdate: null, //Live update function
				barcodeOverlaySetup: false,
				scanningStartTime: 0,
				keepCameraScan: false,
				isDecodePaused: false,
				disableBarcodeInputDialog: false
			},
			busyDialog: null,
			callBackHandler: {
				onFnFail: null,
				onFnSuccess: null,
				callBackFromSetPhysicalScan: false,
				fnBluetoothScan: null
			},
			devices: {
				mainCamera: undefined,
				needCheck: true,
				all: [],
				front: [],
				back: []
			},
			apis: {
				ZebraEnterpriseBrowser: {
					key: "ZebraEnterpriseBrowser",
					description: "Zebra Enterprise Browser",
					status: oScannerAPIStatus.Initial,
					enableBarcodeState: "init",
					enableZebraBarcodeRetryCount: 6
				},
				Cordova: {
					key: "Cordova",
					description: "Cordova",
					status: oScannerAPIStatus.Initial,
					scannerAPI: null  //oCordovaScannerAPI
				},
				ZXingCPP: {
					key: "ZXingCPP",
					description: "WebAssembly build (using Emcripten) of zxing-cpp",
					status: oScannerAPIStatus.Initial,
					instance: null, //oZXingCPP
					scannerAPI: null, //oZXingCPPScannerAPI
					multiScan: {
						enabled: false,
						maxBarcodeNumber: 10,
						showPauseButton: false,
						pauseIfHasResult: false,
						stopIfOnlyHasOneResult: false
					}
				},
				BluetoothScanner: {
					key: "BluetoothScanner",
					description: "Bluetooth Barcode Scanner",
					status: oScannerAPIStatus.UnAvailable,
					resultBuffer: [],
					resultMinLength: 2,
					scanningKeyMaxLength: 1,
					scanningLastKey: null,
					triggerOneTime: false,
					timeOutForDetection: null,
					handleFocusedElement: false,
					focusedElementInstance: "",
					focusedElementValue: "",
					focusedElementSelectionStart: null,
					focusedElementSelectionEnd: null,
					focusedCurrentWindow: false, // Focus the current window to enable Bluetooth Scanner to listen the keydown event
					scanningMode: "TimeInterval",
					intervalForDetection: 80,
					maxPrefixSuffixScanningTime: 5000, //When the scanning mode is "PrefixSuffix", the parameter "prefix" and "suffix" will be used to detect scanning data within the time: "maxPrefixSuffixScanningTime".
					prefix: "$",
					suffix: "#",
					prefixFound: false,
					suffixFound: false,
					prefixString: "",
					suffixString: "",
					prefixStartDate: null,
					replaceGS1Separator: false,
					replaceCharacterBuffer: "",
					GS1FunctionKey: "altKey",
					GS1Code: undefined, // It's the code about GS1 (e.g. "0029" or "]"). It need to be used along with the "GS1FunctionKey".
					GS1ReplacementCharacter: undefined
				}
			},
			bReady: true			// No scanning is in progress
			// TODO: following var is not used, right now it is useless // bInitialized = false,	// Flag indicating whether the feature vector (sap.Settings) is available
									// sap.Settings might be loaded later, so it is checked again the next scan
		}),
		oStatusModel = new JSONModel({
			scannerAPI: "unknown",
			available: false,
			deviceId: undefined,
			devices: [],
			apis: {
				ZebraEnterpriseBrowser: {
					key: "ZebraEnterpriseBrowser",
					status: oScannerAPIStatus.Initial
				},
				Cordova: {
					key: "Cordova",
					status: oScannerAPIStatus.Initial
				},
				ZXingCPP: {
					key: "ZXingCPP",
					status: oScannerAPIStatus.Initial,
					multiScan: {
						enabled: false,
						maxBarcodeNumber: 10,
						showPauseButton: false,
						pauseIfHasResult: false,
						stopIfOnlyHasOneResult: false
					}
				},
				BluetoothScanner: {
					key: "BluetoothScanner",
					status: oScannerAPIStatus.UnAvailable
				}
			}
		}).setDefaultBindingMode(BindingMode.OneWay),

		oResourceModel = new ResourceModel({
			bundleName: "sap.ndc.messagebundle"
		});

	/**
	 * Get the scanner API in data model
	 * @param {string} sScannerAPI the scanner API
	 * @returns {object} The scanner API object
	 * @private
	 */
	function getScannerAPI(sScannerAPI) {
		return oModel.getProperty("/apis/" + sScannerAPI + "/");
	}

	/**
	 * Update the scanner API in data model
	 * @param {string} sScannerAPI The scanner API
	 * @param {string} sStatus New status of the scanner API
	 * @param {boolean} bSetAsCurrentScannerAPI If true, set the scanner API as current scanner API
	 * @private
	 */
	function updateScannerAPI(sScannerAPI, sStatus, bSetAsCurrentScannerAPI) {
		if (!sScannerAPI || !getScannerAPI(sScannerAPI)) {
			Log.error("BarcodeScanner.updateScannerAPI: scanner API '" + sScannerAPI + "' is not a valid status code, stop update scanner API. Please check!");
			return;
		}
		var sScannerAPIPath = "/apis/" + sScannerAPI + "/";
		// set status
		if (sStatus) {
			if (oScannerAPIStatus[sStatus]) {
				oModel.setProperty(sScannerAPIPath + "status", sStatus);
				oStatusModel.setProperty(sScannerAPIPath + "status", sStatus);
			} else {
				Log.error("BarcodeScanner.updateScannerAPI: scanner API status '" + sStatus + "' is not a valid status code, please check!");
			}
		}
		// set current scanner API
		if (typeof bSetAsCurrentScannerAPI === "boolean" && bSetAsCurrentScannerAPI && sScannerAPI !== "BluetoothScanner") {
			oModel.setProperty("/scannerAPI", sScannerAPI);
			oStatusModel.setProperty("/scannerAPI", sScannerAPI);
		}
		oModel.checkUpdate(true);
		oStatusModel.checkUpdate(true);
	}

	/**
	 * Set the scanner API status as Available in data model
	 * @param {string} sScannerAPI The scanner API
	 * @param {boolean} bSetAsCurrentScannerAPI If true, set the scanner API as current scanner API
	 * @private
	 */
	 function setScannerAPIAvailable(sScannerAPI, bSetAsCurrentScannerAPI) {
		updateScannerAPI(sScannerAPI, oScannerAPIStatus.Available, bSetAsCurrentScannerAPI);
	}

	/**
	 * Set the scanner API status as UnAvailable in data model
	 * @param {string} sScannerAPI The scanner API
	 * @param {boolean} refresh Set to true to update the related data model for the current Scanner API information
	 * @private
	 */
	 function setScannerAPIUnAvailable(sScannerAPI, refresh) {
		oModel.setProperty("/apis/" + sScannerAPI + "/instance", null);
		oModel.setProperty("/apis/" + sScannerAPI + "/scannerAPI", null);
		if (sScannerAPI === 'BluetoothScanner') {
			oModel.setProperty("/callBackHandler/fnBluetoothScan", null);
		}
		updateScannerAPI(sScannerAPI, oScannerAPIStatus.UnAvailable);
		if (refresh) {
			Log.debug("Update the related data when API is set to unavailable");
			// find the available API Info
			var oApis = oModel.getProperty("/apis");
			var oScannerAPI = "unknown";
			for (var key in oApis) {
				if (oApis[key].status === oScannerAPIStatus.Available || oApis[key].status === oScannerAPIStatus.Initial) {
					oScannerAPI = key;
					break;
				}
			}
			setScannerAPIAvailable(oScannerAPI, true);
		}
	}

	/**
	 * Returns the current scanner API that will be used to scan.
	 * @private
	 * @returns {string} The Barcode Scanner API info. (e.g. ZebraEnterpriseBrowser, Cordova, ZXingCPP or unknown)
	 */
	function getCurrentScannerAPI() {
		return oModel.getProperty("/scannerAPI");
	}

	/**
	 * Set the scanner API as current scanner API
	 * @param {string} sScannerAPI The scanner API
	 * @private
	 */
	function setCurrentScannerAPI(sScannerAPI) {
		if (sScannerAPI === "unknown") {
			// set current scanner API "unknown"
			oModel.setProperty("/scannerAPI", sScannerAPI);
			oStatusModel.setProperty("/scannerAPI", sScannerAPI);
		} else {
			updateScannerAPI(sScannerAPI, undefined, true);
		}
	}

	/**
	 * Check if the status of the scanner API match the status parameter
	 * @param {string} sScannerAPI The scanner API
	 * @param {string} sStatus The status to match
	 * @returns {boolean} Returns true if match, or returns false
	 * @private
	 */
	 function checkScannerAPIStatus(sScannerAPI, sStatus) {
		if (!sScannerAPI || !getScannerAPI(sScannerAPI)) {
			Log.error("BarcodeScanner.checkScannerAPIStatus: scanner API '" + sScannerAPI + "' doesn't exist. Please check!");
			return false;
		}
		var sScannerAPIStatus = oModel.getProperty("/apis/" + sScannerAPI + "/status");
		return sStatus === sScannerAPIStatus;
	}

	/**
	 * Check if the status of the scanner API is Available
	 * @param {string} sScannerAPI The scanner API
	 * @returns {boolean} Returns true if is Available, or returns false
	 * @private
	 */
	function isScannerAPIAvailable(sScannerAPI) {
		return checkScannerAPIStatus(sScannerAPI, oScannerAPIStatus.Available);
	}

	/**
	 * Check if the status of the scanner API is UnAvailable
	 * @param {string} sScannerAPI The scanner API
	 * @returns {boolean} Returns true if is UnAvailable, or returns false
	 * @private
	 */
	 function isScannerAPIUnAvailable(sScannerAPI) {
		return checkScannerAPIStatus(sScannerAPI, oScannerAPIStatus.UnAvailable);
	}

	/**
	 * Disable the Feature APIs(ZXingCPP)
	 * @private
	 */
	function disableFeatureAPIs() {
		// set the feature available to false since the feature flag is false
		oModel.setProperty("/available", false);
		oStatusModel.setProperty("/available", false);
		disableZXingCPP();
	}

	/**
	 * Disable ZXingCPP
	 * @private
	 */
	function disableZXingCPP() {
		setScannerAPIUnAvailable("ZXingCPP");
		Log.debug("BarcodeScanner.disableZXingCPP: Set status of Feature scanner APIs (ZXingCPP) to unavailable!");
	}

	/**
	 * Init the scanner APIs.
	 * @private
	 */
	function initScannerAPIs() {
		try {
			// check cordova plugin, if exists, no need to check ZXingCPP
			var oCordovaScannerAPI = cordova.plugins.barcodeScanner;
			if (oCordovaScannerAPI) {
				oModel.setProperty("/apis/Cordova/scannerAPI", oCordovaScannerAPI);
				setScannerAPIAvailable("Cordova");
				if (getCurrentScannerAPI() === "unknown") {
					// set current scanner API to Cordova if Zebra is unavailable
					setCurrentScannerAPI("Cordova");
				}
				Log.debug("BarcodeScanner.initScannerAPIs: Cordova BarcodeScanner plugin is available!");
				// disable feature scanner APIs (ZXingCPP)
				disableZXingCPP();
			} else {
				Log.debug("BarcodeScanner.initScannerAPIs: Cordova BarcodeScanner plugin is unavailable!");
				setScannerAPIUnAvailable("Cordova");
				initFeatureAPIs();
			}
		} catch (e) {
			Log.debug("BarcodeScanner.initScannerAPIs: Cordova BarcodeScanner plugin is unavailable!");
			setScannerAPIUnAvailable("Cordova");
			initFeatureAPIs();
		}
	}

	/**
	 * Init feature APIs and get device cameras
	 * @private
	 */
	function initFeatureAPIs() {
		jQuery(document).ready(function() {
			if (isEnumerateDevicesSupported()) {
				getDeviceCameras();
			}
		});
		loadZXingCPPAPI();
	}

	/**
	 * Callback for Load ZXingCPP scanner API or Instances failed
	 * @private
	 */
	 function loadZXingCPPFailed(sMessage) {
		Log.error(sMessage);
		Log.warning("BarcodeScanner.loadZXingCPPFailed: no feature scanner API available now.");
		disableFeatureAPIs();
		oModel.checkUpdate(true);
	}

	/**
	 * Load ZXingCPP scanner API.
	 * @private
	 */
	function loadZXingCPPAPI() {
		Log.debug("BarcodeScanner.loadZXingCPPAPI: load ZXingCPP API");
		updateScannerAPI("ZXingCPP", oScannerAPIStatus.Loading);
		sap.ui.require([
			"sap/ndc/thirdparty/zxingcpp/zxing_reader"
		], function (ZXing) {
			oModel.setProperty("/apis/ZXingCPP/instance", ZXing);
			if (getCurrentScannerAPI() === "unknown") {
				// set current scanner API to ZXingCPP if Zebra is unavailable
				setCurrentScannerAPI("ZXingCPP");
			}
			Log.debug("BarcodeScanner.loadZXingCPPAPI: ZXingCPP API is Initial!");
			updateScannerAPI("ZXingCPP", oScannerAPIStatus.Initial);
		}, function (oError) {
			loadZXingCPPFailed("BarcodeScanner.loadZXingCPPAPI: ZXingCPP API is unavailable.\n" + oError);
		});
	}

	/**
	 * Load ZXingCPP scanner Instance.
	 * @param {function} openScanUI The scan dialog will be opened if load success
	 * @param {function} errorHandle The error message will be handled if load failed
	 * @private
	 */
	function loadZXingCPPInstance(openScanUI, errorHandle) {
		// since the size of zxing_reader.wasm is about 1M, we need to open a busy dialog to lock the current frame/page
		var oBusyDialog = new BusyDialog({
			title: oResourceModel.getProperty("BARCODE_DIALOG_BUSY_TITLE"),
			text: oResourceModel.getProperty("BARCODE_DIALOG_BUSY_TEXT_ZXINGCPP")
		});
		oBusyDialog.open();
		updateScannerAPI("ZXingCPP", oScannerAPIStatus.Loading);
		var oZXingCPPConfig = {
			"locateFile": function(sPath, sScriptDictionary) {
				return locateFile(sPath, sScriptDictionary, "zxingcpp");
			}
		};
		var oZXingCPP = oModel.getProperty("/apis/ZXingCPP/instance");
		oZXingCPP(oZXingCPPConfig).then(function(instance) {
			oModel.setProperty("/apis/ZXingCPP/scannerAPI", instance);
			Log.debug("BarcodeScanner.loadZXingCPPInstance: wasm lib instance of ZXingCPP is available!");
			setScannerAPIAvailable("ZXingCPP");
			if (getCurrentScannerAPI() === "unknown") {
				// set current scanner API to ZXingCPP if Zebra is unavailable
				setCurrentScannerAPI("ZXingCPP");
			}
			Log.debug("BarcodeScanner.loadZXingCPPInstance: ZXingCPP API is available!");
			oBusyDialog.close();
			openScanUI();
		}, function(oError) {
			loadZXingCPPFailed("BarcodeScanner.loadZXingCPPInstance: can not load wasm lib instance of ZXingCPP.\n" + oError);
			oBusyDialog.close();
			errorHandle();
		});
	}

	/**
	 * Get the url of the wasm file.
	 * @param {string} sPath The wasm file path
	 * @param {string} sScriptDictionary the script dictionary
	 * @param {string} sLibrary The API library name
	 * @returns {string} The url of the wasm file
	 * @private
	 */
	function locateFile(sPath, sScriptDictionary, sLibrary) {
		if (!sScriptDictionary || sScriptDictionary === "") {
			return sap.ui.require.toUrl("sap/ndc/thirdparty/" + sLibrary + "/") + sPath;
		}
		return sScriptDictionary + sPath;
	}

	/**
	 * Used to detect if browser support enumerate devices
	 * @private
	 * @returns {boolean} true is enumerate devices supported by browser
	 */
	function isEnumerateDevicesSupported() {
		return !!(window && window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.enumerateDevices);
	}

	/**
	 * Get the device cameras
	 * @private
	 */
	function getDeviceCameras() {
		Log.debug("BarcodeScanner.getDeviceCameras: start to get device cameras");
		// List cameras and microphones
		window.navigator.mediaDevices.enumerateDevices()
			.then(
				function(devices) {
					var oDevices = oModel.getProperty("/devices");
					var iCameraCount = 0;
					devices.forEach(function(device) {
						if (device.kind === "videoinput") {
							iCameraCount++;
							var oDevice = {
								"deviceId": device.deviceId,
								"groupId": device.groupId,
								"kind": device.kind,
								"label": device.label
							};
							if (oDevice.label && oDevice.label !== "") {
								if (oDevice.label.indexOf('0, facing back') > 0) {
									// set the main camera if one camera label contains "0, facing back"
									Log.debug("BarcodeScanner.getDeviceCameras: has a camera with label contains '0, facing back', set it as main camera.");
									oDevices.needCheck = false;
									oDevices.mainCamera = oDevice;
								}
								if (oDevice.label.indexOf('back') > 0) {
									oDevices.back.push(oDevice);
								} else if (oDevice.label.indexOf('front') > 0) {
									oDevices.front.push(oDevice);
								}
							} else {
								// if has no permission to access device cameras, the camere label will be empty, then we set it manually.
								oDevice.label = "Camera " + iCameraCount;
							}
							oDevices.all.push(oDevice);
						}
					});
					if (!oDevices.mainCamera) {
						if (oDevices.back.length === 1) {
							// set the main camera if only has 1 back camera
							Log.debug("BarcodeScanner.getDeviceCameras: has only one camera which label contains 'back', set it as main camera.");
							oDevices.mainCamera = deepClone(oDevices.back[0]);
							oDevices.needCheck = false;
						} else if (oDevices.all.length === 1) {
							// set the main camera if only has 1 camera
							Log.debug("BarcodeScanner.getDeviceCameras: has only one camera, set it as main camera.");
							oDevices.mainCamera = deepClone(oDevices.all[0]);
							oDevices.needCheck = false;
						}
					}
					oModel.setProperty("/devices", oDevices);
					updateDevicesInStatusModel();
				}
			)
			.catch(
				function(oErr) {
					oModel.setProperty("/devices/needCheck", false);
					Log.error("BarcodeScanner.getDeviceCameras: Can not get device cameras.\nError Message: " + oErr);
			});
	}

	/**
	 * Find the main camera in the camera list
	 * @param {Array} aCameras the camera list
	 * @param {function} fnCallback callback function
	 * @private
	 */
	function findMainCamera(aCameras, fnCallback) {
		var aCamerasClone = deepClone(aCameras);
		var fnCheckStream = function () {
			if (aCamerasClone.length === 0) {
				oModel.setProperty("/devices/needCheck", false);
				updateDevicesInStatusModel();
				Log.debug("BarcodeScanner.findMainCamera: can not find the main camera.");
				fnCallback();
			} else {
				var iIndex = aCamerasClone.length - 1;
				var oCamera = aCamerasClone[iIndex];
				var oConstraints = deepClone(oModel.getProperty("/config/defaultConstraints"));
				oConstraints.video.deviceId = {
					exact: oCamera.deviceId
				};
				var oVideoResolution = calculateVideoResolution();
				oConstraints.video = Object.assign(oConstraints.video, oVideoResolution);
				window.navigator.mediaDevices
				.getUserMedia(oConstraints)
				.then(
					function(stream) {
						var videoTrack = typeof stream.stop === "function" ? stream : stream.getTracks()[0];
						// main camera always support flashlight.
						checkFlashLight(videoTrack).then(function() {
							aCameras[iIndex].hasFlashLight = true;
							oModel.setProperty("/devices/mainCamera", aCameras[iIndex]);
							oModel.setProperty("/devices/needCheck", false);
							updateDevicesInStatusModel();
							Log.debug("BarcodeScanner.findMainCamera: the main camera is " + oCamera.deviceId);
							oScanDialog && oScanDialog.getModel().setProperty("/hasFlashLight", true);
							oModel.setProperty("/scanDialog/hasFlashLight", true);
							Log.debug("BarcodeScanner.findMainCamera: enable flashlight");
							oStream = stream;
							if (oStream) {
								playbackVideoAndDecode();
							} else {
								oScanDialog && oScanDialog.getModel().setProperty("/isNoScanner", true);
								openBarcodeInputDialog(oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_STREAM_ERROR_MSG'));
							}
						}, function() {
							aCameras[iIndex].hasFlashLight = false;
							videoTrack.stop();
							Log.debug("BarcodeScanner.findMainCamera: " + oCamera.deviceId + " is not the main camera, check the next camera");
							aCamerasClone.pop();
							fnCheckStream();
						});
					}
				).catch(
					function (error) {
						Log.debug("BarcodeScanner.findMainCamera: getUserMedia() failed.\nError Message: " + error);
						if (oModel.getProperty("/config/defaultConstraints/video/zoom") !== undefined) {
							Log.debug("BarcodeScanner.findMainCamera: getUserMedia() failed maybe caused by unsupported constraint 'zoom', delete it and try again.");
							delete oModel.getProperty("/config/defaultConstraints/video").zoom;
						} else {
							aCamerasClone.pop();
						}
						fnCheckStream();
					}
				);
			}
		};
		fnCheckStream();
	}

	/**
	 * Update the devices list in status model
	 * @private
	 */
	function updateDevicesInStatusModel() {
		Log.debug("BarcodeScanner.updateDevicesInStatusModel: update the devices in status model");
		var oDevices = deepClone(oModel.getProperty("/devices/all"));
		oStatusModel.setProperty("/devices", oDevices);
	}

	/**
	 * Check if the current video track support flashlight
	 * @param {object} videoTrack the current video track
	 * @private
	 */
	function checkFlashLight(videoTrack) {
		if (!("ImageCapture" in window)) {
			// apple device don't support ImageCapture API now
			return new Promise(function (resolve, reject) {
				Log.debug("BarcodeScanner.checkFlashLight: Device does not support image capture");
				reject();
			});
		} else if (!videoTrack) {
			return new Promise(function (resolve, reject) {
				Log.debug("BarcodeScanner.checkFlashLight: Camera is not opened");
				reject();
			});
		} else {
			var oImageCapture = new ImageCapture(videoTrack);
			return new Promise(function (resolve, reject) {
				oImageCapture.getPhotoCapabilities().then(function(oCapabilities) {
					if (oCapabilities.fillLightMode && oCapabilities.fillLightMode.includes("flash")) {
						Log.debug("BarcodeScanner.checkFlashLight: Camera supports flashlight");
						resolve();
					} else {
						Log.debug("BarcodeScanner.checkFlashLight: Camera doesn't support flashlight");
						reject();
					}
				}).catch(function(oError) {
					Log.debug("BarcodeScanner.checkFlashLight: Camera not started or not available.\nError Message: " + oError);
					reject();
				});
			});
		}
	}

	/**
	 * Open or close flashlight
	 * @private
	 */
	function toggleFlashLight() {
		if (!oModel.getProperty("/scanDialog/hasFlashLight")) {
			Log.error("BarcodeScanner.toggleFlashLight: No flashlight currently");
			return;
		}
		var bIsFlashLightOn = oModel.getProperty("/scanDialog/flashLightOn");
		var sProcess = !bIsFlashLightOn ? "Open" : "Close";
		oVideoTrack.applyConstraints({
			advanced: [{
				torch: !bIsFlashLightOn
			}]
		}).then(
			function() {
				oModel.setProperty("/scanDialog/flashLightOn", !bIsFlashLightOn);
				Log.debug("BarcodeScanner.toggleFlashLight: " + sProcess + " flashlight of camera success.");
			}
		).catch(
			function(error) {
				var sErrorMsgKey = "BARCODE_DIALOG_" + sProcess.toUpperCase() + "_FLASHLIGHT_ERROR_MSG";
				MessageToast.show(
					oResourceModel.getResourceBundle().getText(sErrorMsgKey),
					{
						duration: 1000
					}
				);
				Log.error("BarcodeScanner.toggleFlashLight: " + sProcess + " flashlight of camera failed.\nError Message: " + error);
			}
		);
	}

	/**
	 * Open image gallery to select image
	 * @private
	 */
	function openImageGallery() {
		// close the flashlight if it is ON
		var bIsFlashLightOn = oModel.getProperty("/scanDialog/flashLightOn");
		if (bIsFlashLightOn) {
			toggleFlashLight();
		}
		if (oBarcodeImageDOM) {
			// pause the camera scan
			toggleCameraScanning(false);
			return oBarcodeImageDOM.click();
		}
	}

	/**
	 * Start or pause camera scanning
	 * @private
	 */
	function toggleCameraScanning(bPlayback) {
		var bIsDecodePaused = typeof bPlayback === "boolean" ? bPlayback : oModel.getProperty("/scanDialog/isDecodePaused");
		if (bIsDecodePaused) {
			Log.debug("BarcodeScanner.toggleCameraScanning: start camera");
			// hide current avatars
			hideBarcodeAvatars();
			// start camera scanning
			oModel.setProperty("/scanDialog/isDecodePaused", false);
			oScanDialog && oScanDialog.getModel().setProperty("/isDecodePaused", false);
			// hide image canvas dom
			if (oBarcodeImageCanvasDOM) {
				oBarcodeImageCanvasDOM.hidden = true;
			}
			// stop current video track first
			if (oVideoTrack && oVideoTrack.readyState === "live") {
				oVideoTrack.stop();
			}
			// start camera video again
			openCamera(false);
		} else {
			Log.debug("BarcodeScanner.toggleCameraScanning: pause camera");
			// pause camera scanning
			pauseCamera();
		}
	}

	/**
	 * pause camera
	 * @private
	 */
	function pauseCamera() {
		// hide flash light avatar
		oScanDialog.getModel().setProperty("/hasFlashLight", false);
		if (Device.os.ios || Device.os.macintosh) {
			// on iOS devices (iphone and ipad), video dom height and width will switch to each other to match the orientation after orientation changing,
			// need to record the orientation when paused
			var sOrientation = Device.orientation["portrait"] ? "portrait" : "landscape";
			oModel.setProperty("/scanDialog/pausedOrientation", sOrientation);
		}
		if (oBarcodeVideoDOM) {
			oBarcodeVideoDOM.pause();
		}
		if (oBarcodeOverlayDOM) {
			oBarcodeOverlayDOM.hidden = true;
		}
		oModel.setProperty("/scanDialog/isDecodePaused", true);
		oScanDialog && oScanDialog.getModel().setProperty("/isDecodePaused", true);
	}

	function fileSelected() {
		var oFile = oBarcodeImageDOM.files[0];
		if (oFile) {
			hideBarcodeAvatars();
			scanFile(oFile);
		}
	}

	function selectFileCancelled() {
		if (!oModel.getProperty("/apis/ZXingCPP/multiScan/showPauseButton")) {
			// playback the video
			toggleCameraScanning(true);
		}
	}

	/**
	 * Scan the selected image file
	 * @private
	 */
	function scanFile(oFile) {
		var oBusyDialog = new BusyDialog({
			title: oResourceModel.getProperty("BARCODE_DIALOG_SCAN_IMAGE_BUSY_TITLE")
		});
		oBusyDialog.open();
		oModel.setProperty("/busyDialog", oBusyDialog);
		oModel.setProperty("/scanDialog/scanningStartTime", Date.now());
		var reader = new FileReader();
		reader.onload = function(evt) {
			// compress the selected image file, get the data, then decode it with ZXingCPP
			getImageData(evt.target.result).then(
				function(fileData) {
					decodeImageData(fileData, evt.target.result);
				},
				function() {
					oBusyDialog.close();
					BarcodeScanner.closeScanDialog();
					MessageToast.show(
						oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_SCAN_IMAGE_COMPRESS_FAILED_MSG'),
						{
							duration: 1000
						}
					);
				}
			);
		};
		reader.onerror = function() {
			BarcodeScanner.closeScanDialog();
			oBusyDialog.close();
			MessageToast.show(
				oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_SCAN_IMAGE_LOAD_FAILED_MSG'),
				{
					duration: 1000
				}
			);
		};
		reader.readAsDataURL(oFile);
	}

	/**
	 * Decode the selected image file
	 * @private
	 * @param {string} compressData It's the compressed data of image file.
	 * @param {string} originalData It's the original data of image file.
	 */
	function decodeImageData(compressData, originalData) {
		Log.debug("BarcodeScanner.decodeImageData: start to decode the image data");
		var bDataCompressed = true;
		var fileData = compressData;
		if (!compressData && originalData) {
			bDataCompressed = false;
			fileData = originalData;
			Log.debug("BarcodeScanner.decodeImageData: image data is not compressed");
		}
		var buffer;
		var oZXingCPPScannerAPI = oModel.getProperty("/apis/ZXingCPP/scannerAPI");
		try {
			buffer = oZXingCPPScannerAPI._malloc(fileData.length);
			oZXingCPPScannerAPI.HEAPU8.set(fileData, buffer);
		} catch (err) {
			Log.info("BarcodeScanner.decodeImageData: zxing.HEAPU8 error: " + err);
		}
		var oMultiScan = oModel.getProperty("/apis/ZXingCPP/multiScan");
		var iMaxBarcodeNumber = oMultiScan.enabled ? oMultiScan.maxBarcodeNumber : 1;
		var results = oZXingCPPScannerAPI.readBarcodesFromImage(buffer, fileData.length, true, "", iMaxBarcodeNumber);
		oZXingCPPScannerAPI._free(buffer);
		var oBusyDialog = oModel.getProperty("/busyDialog");
		var fnDecodeFailed = function() {
			if (oBusyDialog) {
				oBusyDialog.close();
				oModel.setProperty("/busyDialog", null);
			}
			MessageToast.show(
				oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_SCAN_IMAGE_ERROR_MSG'),
				{
					duration: 1000
				}
			);
			if (!oModel.getProperty("/apis/ZXingCPP/multiScan/showPauseButton")) {
				// playback the video
				toggleCameraScanning(true);
			}
		};
		var iSize = results.size();
		if (iSize === 1) {
			Log.debug("BarcodeScanner.decodeImageData: decode successful");
			// if only get 1 barcode, return it to the success callback, close the scan dialog
			if (oBusyDialog) {
				oBusyDialog.close();
				oModel.setProperty("/busyDialog", null);
			}
			var barcode = results.get(0);
			callFnSuccess(barcode);
		} else if (iSize > 1) {
			Log.debug("BarcodeScanner.decodeImageData: decode successful");
			if (oBusyDialog) {
				oBusyDialog.close();
				oModel.setProperty("/busyDialog", null);
			}
			// if have multi barcodes, show the image canvas and barcode avatars, hide video canvas
			if (oBarcodeImageCanvasDOM) {
				oBarcodeImageCanvasDOM.hidden = false;
			}
			// transfer Uint8Array to base64
			var CHUNK_SZ = 0x8000;
			var c = [];
			for (var j = 0; j < fileData.length; j += CHUNK_SZ) {
				c.push(String.fromCharCode.apply(null, fileData.subarray(j, j + CHUNK_SZ)));
			}
			c = c.join("");
			var oImageData = "data:image/jpeg;base64," + window.btoa(c);
			loadAndDrawImage(oImageData).then(
				function(oAvatarPositionInfo) {
					processMultiResults(results, true, oAvatarPositionInfo);
				}
			);
		} else if (bDataCompressed && originalData) {
			Log.debug("BarcodeScanner.decodeImageData: decode compressed image data failed");
			MessageBox.confirm(oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_SCAN_WITH_ORIGINAL_IMAGE_CONFIRM_MSG'), {
				onClose: function (sResult) {
					if (sResult === MessageBox.Action.CANCEL) {
						fnDecodeFailed();
						return;
					}
					// If the compressed image data cannot be decoded successfully, the original image data will be passed to decode again.
					getImageData(originalData, false).then(
						function(fileData) {
							decodeImageData(null, fileData);
						},
						function() {
							oBusyDialog.close();
							BarcodeScanner.closeScanDialog();
							MessageToast.show(
								oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_SCAN_IMAGE_COMPRESS_FAILED_MSG'),
								{
									duration: 1000
								}
							);
						}
					);
				}
			});
		} else {
			fnDecodeFailed();
		}
	}

	/**
	 * get data of the image file, may compress it since currently the image file size may be very large
	 * @private
	 */
	function getImageData(res, bCompress) {
		var maxWH = 1080,
			imageType = "image/jpeg";
		bCompress = typeof bCompress === "boolean" ? bCompress : true;
		return new Promise(function (resolve, reject) {
			var img = new Image();
			img.onload = function() {
				var originWidth = this.width,
					originHeight = this.height,
					canvas = document.createElement('canvas'),
					context = canvas.getContext("2d"),
					targetWidth = originWidth,
					targetHeight = originHeight;
				if (bCompress) {
					// if the short side of image is larger than 1080, reset the width and height
					if ((originWidth <= originHeight) && originWidth > maxWH) {
						targetWidth = maxWH;
						targetHeight = Math.round(originHeight * (maxWH / originWidth));
					} else if ((originWidth >= originHeight) && originHeight > maxWH) {
						targetHeight = maxWH;
						targetWidth = Math.round(originWidth * (maxWH / originHeight));
					}
					Log.debug("BarcodeScanner.getImageData: Compress image data");
				}
				// use canvas to compress the image
				canvas.width = targetWidth;
				canvas.height = targetHeight;
				Log.debug("BarcodeScanner.getImageData: Canvas width is " + targetWidth + "; the Height is " + targetHeight);

				// draw the image
				context.drawImage(img, 0, 0, targetWidth, targetHeight);

				var data = canvas.toDataURL(imageType);
				data = data.split(',')[1];
				data = window.atob(data);
				var ia = new Uint8Array(data.length);
				for (var i = 0; i < data.length; i++) {
					ia[i] = data.charCodeAt(i);
				}
				resolve(ia);
			};
			img.onerror = function() {
				reject();
			};
			img.src = res;
		});
	}

	function loadAndDrawImage(res, bIsRotate) {
		return new Promise(function (resolve, reject) {
			if (bIsRotate) {
				drawImage(oBarcodeImageCanvasDOM.oImage, resolve);
			} else {
				var img = new Image();
				img.onload = function() {
					oBarcodeImageCanvasDOM.oImage = img;
					drawImage(img, resolve);
				};
				img.onerror = function() {
					oBarcodeImageCanvasDOM.oImage = null;
					reject();
				};
				img.src = res;
			}
		});
	}

	function drawImage(img, resolve) {
		var originWidth = img.width,
			originHeight = img.height,
			targetWidth = originWidth,
			targetHeight = originHeight,
			context = oBarcodeImageCanvasDOM.getContext("2d"),
			iContainerWidth = oBarcodeScannerUIContainer.getDomRef().clientWidth,
			iContainerHeight = oBarcodeScannerUIContainer.getDomRef().clientHeight;

		// clean canvas
		context.clearRect(0, 0, iContainerWidth, iContainerHeight);
		// if image width or height is larger than clientWidth or clientHeight of the video dom, reset the width and height
		if (originWidth > iContainerWidth || originHeight > iContainerHeight) {
			if (originWidth / originHeight > iContainerWidth / iContainerHeight) {
				targetWidth = iContainerWidth;
				targetHeight = Math.round(iContainerWidth * (originHeight / originWidth));
			} else {
				targetHeight = iContainerHeight;
				targetWidth = Math.round(iContainerHeight * (originWidth / originHeight));
			}
		}
		Log.debug("Compress image data. The width is " + targetWidth + "; the Height is " + targetHeight);
		// use canvas to compress the image
		oBarcodeImageCanvasDOM.width = iContainerWidth;
		oBarcodeImageCanvasDOM.height = iContainerHeight;
		// get the top and left of the canvas to put it in the center
		var left = (iContainerWidth - targetWidth) / 2;
		var top = (iContainerHeight - targetHeight) / 2;

		// draw the image
		context.drawImage(img, left, top, targetWidth, targetHeight);
		var iImageScaleRate = Math.round(targetWidth * 100 / originWidth) / 100;
		var oAvatarPositionInfo = {
			"left": left,
			"top": top,
			"imageScaleRate": iImageScaleRate
		};
		resolve(oAvatarPositionInfo);
	}

	/**
	 * Used to detect browsers which does not have access to html5 user media api and can not use device camera
	 * @private
	 * @returns {boolean} true is user media access supported by html5 compatible browser
	 */
	function isUserMediaAccessSupported() {
		return !!(window && window.navigator && window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia);
	}

	function checkCordovaInIframe() {
		try {
			if (self != top && typeof cordova === "undefined") {
				// self != top, means the app is loaded in an iframe.
				// typeof cordova === "undefined", means cannot find cordova plugins in the iframe.
				// Now assign top.cordova to window.cordova variable in current iframe.
				window.cordova = top.cordova;
			}
		} catch (err) {
			// Catch the DOMException in the cross-origin iframe. Cordova doesn't support cross-origin
			Log.info("BarcodeScanner.checkCordovaInIframe: cordova is unavailable in cross-origin iframe");
		}
	}

	function initZebraEB() {
		try {
			// typeof EB === "undefined" || typeof Rho === "undefined", means cannot find EB API in the iframe.
			if (self != top && (typeof EB === "undefined" || typeof window.Rho === "undefined")) {
				if (typeof top.EB !== "undefined" || typeof top.Rho !== "undefined") {
					// Now assign window.EB to top.EB and window.Rho to top.Rho variable in current iframe.
					window.EB = top.EB;
					window.Rho = top.Rho;
				}
			}
			if (typeof EB !== "undefined" && typeof EB.Barcode !== "undefined") {
				setScannerAPIAvailable("ZebraEnterpriseBrowser", true);
				Log.debug("BarcodeScanner.initZebraEB: Zebra Enterprise Browser plugin is available!");
			} else {
				setScannerAPIUnAvailable("ZebraEnterpriseBrowser");
				Log.debug("BarcodeScanner.initZebraEB: Zebra Enterprise Browser plugin is unavailable!");
			}
		} catch (oErr) {
			Log.info("BarcodeScanner.initZebraEB: EB and Rho are unavailable");
		}
	}

	// Check:
	//	* Feature vector (sap.Settings.isFeatureEnabled) is available
	//  * Barcode Scanner is enabled by the Feature Vector
	//  * Barcode Scanner Cordova plug-in (cordova.plugins.barcodeScanner) or zxing-cpp (ZXing CPP) is available
	function init() {
		checkCordovaInIframe();

		//true by default and only false if feature is forbidden from feature vector
		oModel.setProperty("/available", true);
		oStatusModel.setProperty("/available", true);

		// Initial Zebra EB
		if (Device.os.android) {
			jQuery(document).ready(function() {
				initZebraEB();
				zebraEBScanEnable();
			});
		} else {
			setScannerAPIUnAvailable("ZebraEnterpriseBrowser");
			Log.debug("BarcodeScanner.init: Not Android device, Zebra Enterprise Browser plugin is unavailable!");
		}

		//sap.Settings is provided by Kapsel SettingsExchange plugin.
		if (sap.Settings && typeof sap.Settings.isFeatureEnabled === "function") {
			// TODO: following var is not used, right now it is useless // bInitialized = true;
			sap.Settings.isFeatureEnabled("cordova.plugins.barcodeScanner",
				// Feature check success
				function (bEnabled) {
					if (bEnabled) {
						// init the scanner APIs
						initScannerAPIs();
					} else {
						// disable feature scanner APIs (ZXingCPP)
						disableFeatureAPIs();
						Log.warning("BarcodeScanner.init: Feature disabled in sap.Settings");
						// init the scanner APIs
						initScannerAPIs();
					}
				},
				// Feature check error
				function () {
					Log.warning("BarcodeScanner.init: Feature check failed");
					// init the scanner APIs
					initScannerAPIs();
				}
			);
		} else {
			if (sap.Settings === undefined) {
				//native device capabilities should be by default enabled if there is no feature vector
				//available to restrict the capability.
				Log.debug("BarcodeScanner.init: No sap.Settings. No feature vector available.");
			} else {
				Log.warning("BarcodeScanner.init: Feature vector (sap.Settings.isFeatureEnabled) is unavailable");
			}
			// init the scanner APIs
			initScannerAPIs();
		}
	}

	/**
	 * Makes sure that fallback option with input field appears in case if video device unavailable
	 * @private
	 * @param {string} sMessage popup will contain label with this explanatory message about reason why scanner is unavailable
	 */
	function openBarcodeInputDialog(sMessage) {
		if (sMessage) {
			Log.warning("BarcodeScanner.openBarcodeInputDialog: isNoScanner. Message: " + sMessage);
			var sErrorMsg = oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_OTHER_ERROR_MSG', [sMessage]);
			if (sMessage.name) {
				var sErrorMsgKey = "BARCODE_DIALOG_CAMERA_" + sMessage.name.toUpperCase() + "_ERROR_MSG";
				sErrorMsg = oResourceModel.getResourceBundle().getText(sErrorMsgKey);
			}
			MessageToast.show(
				sErrorMsg,
				{
					duration: 1000
				}
			);
		}

		var disableBarcodeInputDialog = oModel.getProperty("/scanDialog/disableBarcodeInputDialog");
		if (disableBarcodeInputDialog) {
			BarcodeScanner.closeScanDialog();
		} else {
			oScanDialog.setShowHeader(true);
			oScanDialog.destroyContent();
			oScanDialog.setTitle('');
			oScanDialog.setStretch(false);
			oScanDialog.setContentHeight('auto');
			if (oBarcodeOverlayDOM) {
				oBarcodeOverlayDOM.hidden = true;
			}
			oScanDialog.removeStyleClass('sapUiNoContentPadding');

			oScanDialog.setTitle(oModel.getProperty("/scanDialog/title"));

			var oMSGLabel = new Label(oScanDialog.getId() + '-txt_barcode', {
				text: "{i18n>BARCODE_DIALOG_MSG}",
				visible: "{/isNoScanner}"
			});
			oScanDialog.addContent(
				oMSGLabel
			);

			var oFallbackInput = new Input(oScanDialog.getId() + '-inp_barcode', {
				value: "{/barcode}",
				valueLiveUpdate: true,
				ariaLabelledBy: oMSGLabel.getId(),
				liveChange: function(oEvent) {
					var onLiveUpdate = oModel.getProperty("/scanDialog/onLiveUpdate");
					if (typeof onLiveUpdate === "function") {
						onLiveUpdate({
							newValue: oEvent.getParameter("newValue")
						});
					}
				},
				placeholder: "{i18n>BARCODE_DIALOG_PLACEHOLDER}"
			});
			oScanDialog.addContent(oFallbackInput);

			// shortcut for sap.m.ButtonType
			var ButtonType = mobileLibrary.ButtonType;

			oScanDialog.setBeginButton(
				new Button(oScanDialog.getId() + '-btn_barcode_ok', {
					type: ButtonType.Emphasized,
					text: "{i18n>BARCODE_DIALOG_OK}",
					press: function(oEvent) {
						var onFnSuccess = oModel.getProperty("/callBackHandler/onFnSuccess");
						if (typeof onFnSuccess === "function") {
							var oScanningTime = "unknown";
							if (oModel.getProperty("/scanDialog/scanningStartTime") > 0) {
								var scanningStopTime = Date.now();
								oScanningTime = scanningStopTime - oModel.getProperty("/scanDialog/scanningStartTime");
							}
							onFnSuccess({
								text: oScanDialog.getModel().getProperty("/barcode"),
								scanningTime: oScanningTime,
								cancelled: false
							});
						}
						BarcodeScanner.closeScanDialog();
					}
				})
			);
			oScanDialog.setEndButton(
				new Button({
					text: "{i18n>BARCODE_DIALOG_CANCEL}",
					press: function() {
						BarcodeScanner.closeScanDialog();
					}
				})
			);

			oScanDialog.setBusy(false);
		}
	}

	/**
	 * Open correct camera, find main camera
	 * when:
	 *		a. no camera seleted manually by user
	 *		b. main camera not found (no camera label contains '0, facing back')
	 *		c. not iphone devices
	 *		d. not Mac devices, or not ipad devices with Safari browser
	 *		e. needCheck flag !== false
	 *		f. camera list length > 1
	 * need to find main camera
	 * @private
	 */
	function openCorrectCamera() {
		if (!oModel.getProperty("/config/preferFrontCamera")) {
			delete oModel.getProperty("/config/defaultConstraints/video").facingMode;
			var oDevices = oModel.getProperty("/devices");
			if (!oModel.getProperty("/config/deviceId") && !oDevices.mainCamera && !Device.os.ios && !Device.os.macintosh && oDevices.needCheck && oDevices.all.length > 1) {
				// if back camera list length > 1, find main camera in back camera list, or find it in all camera list
				var oCameras = oDevices.back.length > 1 ? oDevices.back : oDevices.all;
				var sCategory = oDevices.back.length > 1 ? "back" : "all";
				Log.debug("BarcodeScanner.openCorrectCamera: start to find the main camera in " + sCategory + " camera list.");
				findMainCamera(oCameras, openCamera);
				return;
			}
		}
		openCamera();
	}

	function openCamera(bAttachOrientationChangeListener) {
		Log.debug("BarcodeScanner.openCamera: start to open camera");
		oModel.setProperty("/scanDialog/pausedOrientation", undefined);
		var bIsMainCamera = false;
		if (oModel.getProperty("/config/deviceId")) {
			// if config/deviceId is set, use it as camera deviceId directly
			delete oModel.getProperty("/config/defaultConstraints/video").facingMode;
			oModel.setProperty("/config/defaultConstraints/video/deviceId", {
				exact: oModel.getProperty("/config/deviceId")
			});
		} else if (oModel.getProperty("/config/preferFrontCamera")) {
			oModel.setProperty("/config/defaultConstraints/video/facingMode", "user");
			delete oModel.getProperty("/config/defaultConstraints/video").deviceId;
		} else {
			var oDevices = oModel.getProperty("/devices");
			if (oDevices.mainCamera && oDevices.mainCamera.deviceId !== "") {
				bIsMainCamera = true;
				oModel.setProperty("/config/defaultConstraints/video/deviceId", {
					exact: oDevices.mainCamera.deviceId
				});
			} else {
				oModel.setProperty("/config/defaultConstraints/video/facingMode", "environment");
			}
		}
		var oConstraints = deepClone(oModel.getProperty("/config/defaultConstraints"));
		var oVideoResolution = calculateVideoResolution();
		oConstraints.video = Object.assign(oConstraints.video, oVideoResolution);
		window.navigator.mediaDevices
			.getUserMedia(oConstraints)
			.then(
				function(stream) {
					oStream = stream;
					if (Device.os.ios) {
						// can not control flashlight on ios devices since no API supported now
						oModel.setProperty("/scanDialog/hasFlashLight", false);
						oScanDialog && oScanDialog.getModel().setProperty("/hasFlashLight", false);
					} else {
						if (bIsMainCamera && typeof oDevices.mainCamera.hasFlashLight === "boolean") {
							// set flashlight
							oModel.setProperty("/scanDialog/hasFlashLight", oDevices.mainCamera.hasFlashLight);
							oScanDialog && oScanDialog.getModel().setProperty("/hasFlashLight", oDevices.mainCamera.hasFlashLight);
						} else {
							var videoTrack = typeof stream.stop === "function" ? stream : stream.getTracks()[0];
							checkFlashLight(videoTrack).then(function() {
								// enable flashlight
								oModel.setProperty("/scanDialog/hasFlashLight", true);
								if (bIsMainCamera) {
									oDevices.mainCamera.hasFlashLight = true;
								}
								oScanDialog && oScanDialog.getModel().setProperty("/hasFlashLight", true);
							}, function() {
								oModel.setProperty("/scanDialog/hasFlashLight", false);
								if (bIsMainCamera) {
									oDevices.mainCamera.hasFlashLight = false;
								}
								oScanDialog && oScanDialog.getModel().setProperty("/hasFlashLight", false);
							});
						}
					}
					if (oStream) {
						playbackVideoAndDecode(bAttachOrientationChangeListener);
					} else {
						oScanDialog && oScanDialog.getModel().setProperty("/isNoScanner", true);
						openBarcodeInputDialog(oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_STREAM_ERROR_MSG'));
					}
				}
			)
			.catch(
				function (error) {
					Log.debug("BarcodeScanner.openCamera: getUserMedia() failed.\nError Message: " + error);
					if (oModel.getProperty("/config/defaultConstraints/video/zoom") !== undefined) {
						Log.debug("BarcodeScanner.openCamera: getUserMedia() failed maybe caused by unsupported constraint 'zoom', delete it and try again.");
						delete oModel.getProperty("/config/defaultConstraints/video").zoom;
						openCamera();
					} else {
						oScanDialog && oScanDialog.getModel().setProperty("/isNoScanner", true);
						openBarcodeInputDialog(error);
					}
				}
			);
	}

	function openScanDialog() {
		oModel.checkUpdate(true);
		var oDialogModel;

		if (!oScanDialog || (oScanDialog && oScanDialog.getContent().length === 0)) {
			oDialogModel = new JSONModel({
				hasFlashLight: oModel.getProperty("/scanDialog/hasFlashLight") && !Device.os.ios,
				isDecodePaused: oModel.getProperty("/scanDialog/isDecodePaused"),
				showPauseButton: oModel.getProperty("/apis/ZXingCPP/multiScan/enabled") && oModel.getProperty("/apis/ZXingCPP/multiScan/showPauseButton")
			});
			oScanDialog = new Dialog('sapNdcBarcodeScannerDialog', {
				icon: 'sap-icon://bar-code',
				title: oResourceModel.getProperty("BARCODE_DIALOG_SCANNING_TITLE"),
				stretch: true,
				horizontalScrolling: false,
				verticalScrolling: false,
				afterClose: function() {
					closeScannerContain();
					if (oScanDialog) {
						oScanDialog.destroyContent();
						oScanDialog.destroy();
					}
					oScanDialog = null;

					//refocused related element
					if (typeof oFocusedInstance === 'object') {
						jQuery(oFocusedInstance).focus();
						jQuery(oFocusedInstance).on("blur", customBlurHandler);
					}
				}
			});
			oScanDialog.setEscapeHandler(function(promise) {
				BarcodeScanner.closeScanDialog();
				var oFnSuccess = oModel.getProperty("/callBackHandler/onFnSuccess");
				if (typeof oFnSuccess === "function") {
					oFnSuccess({
						text: oDialogModel.getProperty("/barcode"),
						cancelled: true
					});
				}
				promise.resolve();
			});
			oScanDialog.setModel(oDialogModel);
			oScanDialog.setModel(oResourceModel, "i18n");
		}

		oScanDialog.addStyleClass('sapUiNoContentPadding');
		oScanDialog.setBusy(true);
		if (isScannerAPIAvailable("ZXingCPP") && isUserMediaAccessSupported()) {
			oScanDialog.attachAfterOpen(function() {
				document.body.style.setProperty("--sapNdcRTCDialogVideoHeight", oBarcodeScannerUIContainer.getDomRef().clientHeight + 'px');
				document.body.style.setProperty("--sapNdcRTCDialogVideoWidth", oBarcodeScannerUIContainer.getDomRef().clientWidth + 'px');
				openCorrectCamera();
			});
			oScanDialog.setShowHeader(false);
			oScanDialog.destroyContent();

			oBarcodeOverlayDOM = undefined;
			oBarcodeVideoDOM = undefined;
			oBarcodeCanvasDOM = undefined;
			oBarcodeImageDOM = undefined;
			oBarcodeImageCanvasDOM = undefined;

			var oMultiScan = oModel.getProperty("/apis/ZXingCPP/multiScan");
			var iMaxBarcodeNumber = oMultiScan.enabled ? oMultiScan.maxBarcodeNumber : 1;

			oBarcodeScannerUIContainer = new BarcodeScannerUIContainer();
			oBarcodeScannerUIContainer.oResourceModel = oResourceModel;

			// prepare barcode avatars
			oBarcodeScannerUIContainer.prepareBarcodeAvatars(iMaxBarcodeNumber);
			// add close button
			oBarcodeScannerUIContainer.setAggregation("_oCloseButton", new Avatar({
				src: "sap-icon://decline",
				backgroundColor: "Transparent",
				tooltip: oResourceModel.getResourceBundle().getText("BARCODE_DIALOG_STOP_SCANNING_BUTTON_TOOLTIP"),
				press: function() {
					oScanDialog.getModel().setProperty("/isNoScanner", false);
					closeScannerContain();
					openBarcodeInputDialog();
				}
			}).addStyleClass("sapNdcRTCDialogButton").addStyleClass("closeButton"));
			// add toggle falshlight button
			oBarcodeScannerUIContainer.setAggregation("_oFlashLightButton", new Avatar({
				src: "sap-icon://lightbulb",
				visible: "{/hasFlashLight}",
				backgroundColor: "Transparent",
				tooltip: {
					path: "/flashLightOn",
					formatter: function (bFlashLightOn) {
						var sMessageKey = "";
						if (!bFlashLightOn) {
							sMessageKey = "BARCODE_DIALOG_SELECT_FLASHLIGHT_BUTTON_TOOLTIP_OPEN";
						} else {
							sMessageKey = "BARCODE_DIALOG_SELECT_FLASHLIGHT_BUTTON_TOOLTIP_CLOSE";
						}
						return oResourceModel.getResourceBundle().getText(sMessageKey);
					}
				},
				press: function() {
					toggleFlashLight();
				}
			}).addStyleClass("sapNdcRTCDialogButton").addStyleClass("flashLightButton"));
			// add control Flex Box
			var oControlFlexBox = new FlexBox({
				alignItems: "Start",
				justifyContent: "SpaceBetween",
				items: [
					new Avatar({
						visible: "{/showPauseButton}",
						backgroundColor: "Transparent",
						src: {
							path: '/isDecodePaused',
							formatter: function(bIsDecodePaused) {
								if (bIsDecodePaused) {
									return "sap-icon://media-play";
								} else {
									return "sap-icon://media-pause";
								}
							}
						},
						tooltip: {
							path: '/isDecodePaused',
							formatter: function(bIsDecodePaused) {
								if (bIsDecodePaused) {
									return oResourceModel.getResourceBundle().getText("BARCODE_DIALOG_SCAN_BUTTON_TOOLTIP_START");
								} else {
									return oResourceModel.getResourceBundle().getText("BARCODE_DIALOG_SCAN_BUTTON_TOOLTIP_PAUSE");
								}
							}
						},
						press: function() {
							// start or pause the camera scan
							toggleCameraScanning();
						}
					}).addStyleClass("sapNdcRTCDialogControlButton"),
					new Avatar({
						src: "sap-icon://picture",
						backgroundColor: "Transparent",
						tooltip: oResourceModel.getResourceBundle().getText("BARCODE_DIALOG_SELECT_IMAGE_BUTTON_TOOLTIP"),
						press: function() {
							// open image gallery to select image file, then scan it.
							openImageGallery();
						}
					}).addStyleClass("sapNdcRTCDialogControlButton")
				]
			});
			if (oModel.getProperty("/apis/ZXingCPP/multiScan/showPauseButton")) {
				oControlFlexBox.addStyleClass("sapNdcRTCDialogControlFlexBoxWithPauseButton");
			} else {
				oControlFlexBox.addStyleClass("sapNdcRTCDialogControlFlexBoxWithoutPauseButton");
			}
			oBarcodeScannerUIContainer.setAggregation("_oControlFlexBox", oControlFlexBox);
			oScanDialog.addContent(oBarcodeScannerUIContainer);
			oScanDialog.setContentWidth('100%');
			oScanDialog.setContentHeight('100%');
			oScanDialog.addStyleClass('sapUiNoContentPadding');
			oScanDialog.setBusy(true);
			oModel.setProperty("/scanDialog/barcodeOverlaySetup", false);
		} else {
			if (oModel.getProperty("/available")) {
				oScanDialog.getModel().setProperty("/isNoScanner", false);
			} else {
				oScanDialog.getModel().setProperty("/isNoScanner", true);
			}
			openBarcodeInputDialog();
		}

		oScanDialog.open();
	}

	/**
	 * Scan the barcode via Zebra scanner API
	 * @private
	 */
	function scanWithZebra() {
		oModel.setProperty("/bReady", true);
		oModel.setProperty("/callBackHandler/callBackFromSetPhysicalScan", false);
		EB.Barcode.triggerType = EB.Barcode.SOFT_ONCE;
		EB.Barcode.start();
	}

	/**
	 * Scan the barcode via Cordova scanner API
	 * @private
	 */
	function scanWithCordova() {
		var options;
		if (oModel.getProperty("/config/preferFrontCamera")) {
			options = {
				preferFrontCamera: true
			};
		}
		oModel.getProperty("/apis/Cordova/scannerAPI").scan(
			function (oResult) {
				if (oResult.cancelled === "false" || !oResult.cancelled) {
					oResult.cancelled = false;
					var onFnSuccess = oModel.getProperty("/callBackHandler/onFnSuccess");
					if (typeof onFnSuccess === "function") {
						onFnSuccess(oResult);
					}
				} else {
					openScanDialog();
				}
				oModel.setProperty("/bReady", true);
			},
			function (oEvent) {
				Log.error("BarcodeScanner.scanWithCordova: Barcode scanning failed.");
				oModel.setProperty("/bReady", true);
				var onFnFail = oModel.getProperty("/callBackHandler/onFnFail");
				if (typeof onFnFail === "function") {
					if (typeof oEvent === "string") {
						var str = oEvent;
						oEvent = {"text": str};
						Log.debug("BarcodeScanner.scanWithCordova: Change the type of oEvent from string to object");
					}
					onFnFail(oEvent);
				}
			},
			options
		);
	}

	/**
	 * Scan the barcode via ZXingCPP
	 * @private
	 */
	 function scanWithZXingCPP() {
		if (checkScannerAPIStatus("ZXingCPP", oScannerAPIStatus.Initial)) {
			Log.debug("BarcodeScanner.scanWithZXingCPP: ZXingCPP instances is not loaded, start to load them.");
			loadZXingCPPInstance(openScanDialog, function() {
				if (isScannerAPIAvailable("ZebraEnterpriseBrowser")) {
					setCurrentScannerAPI("ZebraEnterpriseBrowser");
					Log.debug("BarcodeScanner.scanWithZXingCPP: Zebra is available, set the current scanner API to Zebra.");
				} else {
					setCurrentScannerAPI("unknown");
					Log.warning("BarcodeScanner.scanWithZXingCPP: Zebra is unavailable too, set the current scanner API to unknown.");
				}
				openScanDialog();
			});
		} else {
			Log.debug("BarcodeScanner.scanWithZXingCPP: open scan dialog.");
			openScanDialog();
		}
	}

	/**
	 * Playback the video, then decode via ZXingCPP
	 * @private
	 */
	function playbackVideoAndDecode(bAttachOrientationChangeListener) {
		// Dev note: if video element dom reference is unavailable at this point (console exception)
		// some error happened during dialog creation and may not be directly related to video element
		oScanDialog.setBusy(false);

		if (!oBarcodeVideoDOM) {
			oBarcodeVideoDOM = oBarcodeScannerUIContainer ? oBarcodeScannerUIContainer.getDomRef('video') : undefined;
		}
		if (!oBarcodeImageDOM) {
			oBarcodeImageDOM = oBarcodeScannerUIContainer ? oBarcodeScannerUIContainer.getDomRef('image') : undefined;
			if (oBarcodeImageDOM) {
				oBarcodeImageDOM.addEventListener("change", fileSelected);
				oBarcodeImageDOM.addEventListener("cancel", selectFileCancelled);
			}
		}
		if (!oBarcodeImageCanvasDOM) {
			oBarcodeImageCanvasDOM = oBarcodeScannerUIContainer ? oBarcodeScannerUIContainer.getDomRef('image-canvas') : undefined;
		}
		try {
			oBarcodeVideoDOM.srcObject = oStream;
			oBarcodeVideoDOM.play().then(function() {
				// show scan overlay box
				scanFrame();
				if (Device.support.orientation && bAttachOrientationChangeListener !== false) {
					Device.orientation.attachHandler(orientationChangeListener);
				}
				Log.debug("BarcodeScanner.playbackVideoAndDecode: video screen size " + oBarcodeVideoDOM.videoHeight + "X" + oBarcodeVideoDOM.videoWidth);
				oVideoTrack = typeof oStream.stop === "function" ? oStream : oStream.getTracks()[0];
				var settings = oVideoTrack.getSettings();
				Log.debug("BarcodeScanner.playbackVideoAndDecode: video screen frameRate is " + settings.frameRate + ", zoom is " + settings.zoom);
				decodeWithZXingCPP();
			});
		} catch (err) {
			Log.debug("BarcodeScanner.playbackVideoAndDecode is failed. error: " + err);
		}
	}

	/**
	 * Decode the barcode via ZXingCPP scanner API
	 * @private
	 */
	function decodeWithZXingCPP() {
		Log.debug("BarcodeScanner.decodeWithZXingCPP: start to decode");
		if (!oBarcodeVideoDOM || !oBarcodeVideoDOM.srcObject) {
			Log.debug("BarcodeScanner.decodeWithZXingCPP: video dom doesn't exist, stop decoding");
			return;
		}
		// if decode is paused, stop decode
		if (oModel.getProperty("/scanDialog/isDecodePaused")) {
			Log.debug("BarcodeScanner.decodeWithZXingCPP: camera is paused, stop decoding");
			return;
		}
		try {
			if (oModel.getProperty("/scanDialog/barcodeOverlaySetup")) {
				hideBarcodeAvatars();
			}
			// use canvas to get video frame as image data
			if (!oBarcodeCanvasDOM) {
				oBarcodeCanvasDOM = oBarcodeScannerUIContainer ? document.createElement("canvas") : undefined;
			}
			if (!oBarcodeCanvasDOM) {
				Log.debug("BarcodeScanner.decodeWithZXingCPP: canvas dom doesn't exist, stop decoding");
				return;
			}
			var oContext = oBarcodeCanvasDOM.getContext("2d", { willReadFrequently: true });
			var imgWidth = oBarcodeVideoDOM.videoWidth;
			var imgHeight = oBarcodeVideoDOM.videoHeight;
			oBarcodeCanvasDOM.width = imgWidth;
			oBarcodeCanvasDOM.height = imgHeight;
			oContext.drawImage(oBarcodeVideoDOM, 0, 0, imgWidth, imgHeight);
			var imageData = oContext.getImageData(0, 0, imgWidth, imgHeight);
			var oData = imageData.data;
			var buffer;
			var oZXingCPPScannerAPI = oModel.getProperty("/apis/ZXingCPP/scannerAPI");
			try {
				buffer = oZXingCPPScannerAPI._malloc(oData.length);
				oZXingCPPScannerAPI.HEAPU8.set(oData, buffer);
			} catch (err) {
				Log.error("BarcodeScanner.decodeWithZXingCPP: zxing.HEAPU8 error: " + err);
			}
			var oMultiScan = oModel.getProperty("/apis/ZXingCPP/multiScan");
			var iMaxBarcodeNumber = oMultiScan.enabled ? oMultiScan.maxBarcodeNumber : 1;
			var results = oZXingCPPScannerAPI.readBarcodesFromPixmap(buffer, imgWidth, imgHeight, true, "", iMaxBarcodeNumber);
			oZXingCPPScannerAPI._free(buffer);
			var iSize = results.size();
			if (oMultiScan.enabled && iSize > 0) {
				Log.debug("BarcodeScanner.decodeWithZXingCPP: decode successful");
				// if multi scan enabled and have result
				var bPauseIfHasResult = !oMultiScan.showPauseButton && oMultiScan.pauseIfHasResult;
				var bStopIfOnlyHasOneResult = bPauseIfHasResult && oMultiScan.stopIfOnlyHasOneResult;
				if (bStopIfOnlyHasOneResult && iSize === 1) {
					var barcode = results.get(0);
					showBarcodeAvatar(barcode);
					callFnSuccess(barcode);
				} else {
					processMultiResults(results, bPauseIfHasResult);
				}
			} else if (iSize === 1) {
				Log.debug("BarcodeScanner.decodeWithZXingCPP: decode successful");
				var barcode = results.get(0);
				showBarcodeAvatar(barcode);
				callFnSuccess(barcode);
			} else {
				// decode again if no result
				if (oModel.getProperty("/scanDialog/barcodeOverlaySetup")) {
					hideBarcodeAvatars();
				}
				setTimeout(decodeWithZXingCPP, 0);
			}
		} catch (err) {
			Log.debug("BarcodeScanner: err1: " + err);
		}
	}

	/**
	 * Show the barcode avatar
	 * @param {object} barcode The barcode result object
	 * @param {integer} iIndex The index of the barcode avatar
	 * @param {object} oAvatarPositionInfo The position info for barcode avatars
	 * @private
	 */
	function showBarcodeAvatar(barcode, iIndex, oAvatarPositionInfo) {
		oAvatarPositionInfo = Object.assign({
			"left": 0,
			"top": 0,
			"imageScaleRate": 1
		}, oAvatarPositionInfo);
		iIndex = iIndex || 0;
		var top = 0,
			left = 0,
			oBarcodeAvatar,
			oBarcodeAvatarDom;
		if (oBarcodeScannerUIContainer && Array.isArray(oBarcodeScannerUIContainer._aBarcodeAvatars)) {
			oBarcodeAvatar = oBarcodeScannerUIContainer._aBarcodeAvatars[iIndex];
		}
		if (oBarcodeAvatar) {
			oBarcodeAvatar.oBarcode = barcode;
			oBarcodeAvatarDom = oBarcodeAvatar.getDomRef();
		}
		if (oBarcodeAvatarDom) {
			if (!oModel.getProperty("/scanDialog/barcodeOverlaySetup")) {
				oModel.setProperty("/scanDialog/barcodeOverlaySetup", true);
			}
			if (barcode.position) {
				barcode.resultPoints = [
					barcode.position.topLeft,
					barcode.position.topRight,
					barcode.position.bottomRight,
					barcode.position.bottomLeft
				];
			}
			if (barcode.resultPoints && barcode.resultPoints.length > 0) {
				var count = barcode.resultPoints.length;
				for (var i = 0; i < count; i++) {
					left += barcode.resultPoints[i].x;
					top += barcode.resultPoints[i].y;
				}
				left = left * oAvatarPositionInfo.imageScaleRate / count;
				top = top * oAvatarPositionInfo.imageScaleRate / count;
			}
			if (oBarcodeImageCanvasDOM && !oBarcodeImageCanvasDOM.hidden) {
				// image scan mode
				left += oAvatarPositionInfo.left;
				top += oAvatarPositionInfo.top;
			} else if (oModel.getProperty("/scanDialog/isDecodePaused")) {
				// camera is paused
				left += oAvatarPositionInfo.left;
				top += oAvatarPositionInfo.top;
			} else {
				var scaleX = oBarcodeScannerUIContainer.getDomRef().clientWidth / oBarcodeVideoDOM.videoWidth;
				var scaleY = oBarcodeScannerUIContainer.getDomRef().clientHeight / oBarcodeVideoDOM.videoHeight;
				top = top * scaleY;
				left = left * scaleX;
			}

			oBarcodeAvatarDom.style.visibility = "visible";
			oBarcodeAvatarDom.style.left = "calc(" + left + "px - 1.5rem)";
			oBarcodeAvatarDom.style.top = "calc(" + top + "px - 1.5rem)";
		}
	}

	/**
	 * If orientaition changed, reopen camera to maxsize video screen
	 * @private
	 */
	function orientationChangeListener(oNewOrientation, bWaitForResizeDialog) {
		bWaitForResizeDialog = typeof bWaitForResizeDialog === "boolean" ? bWaitForResizeDialog : true;
		if (bWaitForResizeDialog && (Device.os.ios || Device.os.macintosh)) {
			// on iOS devices (iphone and ipad), the dialog may be in small size and moved to top left after orientation changed, so max size and reposition it in center
			setTimeout(function() {
				Log.debug("BarcodeScanner.orientationChangeListener: reposition and resize the dialog on iOS devices first");
				oScanDialog._positionDialog();
				Log.debug("BarcodeScanner.orientationChangeListener: call orientationChangeListener again");
				orientationChangeListener(oNewOrientation, false);
			}, 500);
			return;
		}
		var sOrientation = oNewOrientation.landscape ? "landscape" : "portrait";
		Log.debug("BarcodeScanner.orientationChangeListener: device orientation changed to " + sOrientation);
		if (oBarcodeOverlayDOM) {
			// hide overlay during orientation change
			oBarcodeOverlayDOM.hidden = true;
		}
		if (oBarcodeImageCanvasDOM && oBarcodeImageCanvasDOM.oImage && !oBarcodeImageCanvasDOM.hidden) {
			// image scan mode
			setTimeout(function() {
				// reset sapNdcRTCDialogVideoHeight for css
				document.body.style.setProperty("--sapNdcRTCDialogVideoHeight", oBarcodeScannerUIContainer.getDomRef().clientHeight + 'px');
				document.body.style.setProperty("--sapNdcRTCDialogVideoWidth", oBarcodeScannerUIContainer.getDomRef().clientWidth + 'px');
				// redraw the image, then reshow the barcode avatars
				loadAndDrawImage(undefined, true).then(reshowBarcodeAvatars);
			}, 500);
		} else if (oModel.getProperty("/scanDialog/isDecodePaused")) {
			// camera is paused
			// need to wait for the orientation change finished, then reopen camera so that the video screen is in full size
			setTimeout(function() {
				var containerWidth = oBarcodeScannerUIContainer.getDomRef().clientWidth,
					containerHeight = oBarcodeScannerUIContainer.getDomRef().clientHeight;
				// reset sapNdcRTCDialogVideoHeight for css
				document.body.style.setProperty("--sapNdcRTCDialogVideoHeight", containerHeight + 'px');
				document.body.style.setProperty("--sapNdcRTCDialogVideoWidth", containerWidth + 'px');

				var bSwitchWidthAndHeight = false;
				if (Device.os.ios || Device.os.macintosh) {
					// on iOS devices (iphone and ipad), video dom height and width will switch to each other to match the orientation after orientation changing,
					// need to get the original width and height when paused
					var sOrientation = Device.orientation["portrait"] ? "portrait" : "landscape";
					var sPausedOrientation = oModel.getProperty("/scanDialog/pausedOrientation");
					if (sOrientation !== sPausedOrientation) {
						bSwitchWidthAndHeight = true;
					}
				}
				// calculate avatar position info since orientation changing will rotate the camera
				var originWidth = bSwitchWidthAndHeight ? oBarcodeVideoDOM.videoHeight : oBarcodeVideoDOM.videoWidth,
					originHeight = bSwitchWidthAndHeight ? oBarcodeVideoDOM.videoWidth : oBarcodeVideoDOM.videoHeight,
					targetWidth = originWidth,
					targetHeight = originHeight;
				// if image width or height is larger than clientWidth or clientHeight of the video dom, reset the width and height
				if (originWidth > containerWidth || originHeight > containerHeight) {
					if (originWidth / originHeight > containerWidth / containerHeight) {
						targetWidth = containerWidth;
						targetHeight = Math.round(containerWidth * (originHeight / originWidth));
					} else {
						targetHeight = containerHeight;
						targetWidth = Math.round(containerHeight * (originWidth / originHeight));
					}
				}

				// get the top and left of the canvas to put it in the center
				var left = (containerWidth - targetWidth) / 2;
				var top = (containerHeight - targetHeight) / 2;

				var iImageScaleRate = Math.round(targetWidth * 100 / originWidth) / 100;
				var oAvatarPositionInfo = {
					"left": left,
					"top": top,
					"imageScaleRate": iImageScaleRate
				};
				reshowBarcodeAvatars(oAvatarPositionInfo);
			}, 500);
		} else {
			oScanDialog.setBusy(true);
			// close the camera since video screen is not in full size after orientation changed
			closeScannerContain(false);
			// need to wait for the orientation change finished, then reopen camera so that the video screen is in full size
			setTimeout(function() {
				// reset sapNdcRTCDialogVideoHeight for css
				document.body.style.setProperty("--sapNdcRTCDialogVideoHeight", oBarcodeScannerUIContainer.getDomRef().clientHeight + 'px');
				document.body.style.setProperty("--sapNdcRTCDialogVideoWidth", oBarcodeScannerUIContainer.getDomRef().clientWidth + 'px');
				openCamera(false);
			}, 500);
		}
	}

	/**
	 * Calculate video height and width
	 * @returns {object} Video height and width object
	 * @private
	 */
	function calculateVideoResolution() {
		var iAvailHeight = oBarcodeScannerUIContainer.getDomRef().clientHeight,
			iAvailWidth = oBarcodeScannerUIContainer.getDomRef().clientWidth,
			iWidth = 1920,
			iHeight = 1440;
		/*
		if (iAvailHeight > iAvailWidth) {
			iHeight = 1920;
			iWidth = Math.trunc(1920 * iAvailWidth / iAvailHeight);
		} else {
			iWidth = 1920;
			iHeight = Math.trunc(1920 * iAvailHeight / iAvailWidth);
		}*/
		// in portrait mode, width means height ???, so above codes will meet Not Full Screen issue when in this mode
		// have to change to below, need to check document
		if (iAvailHeight > iAvailWidth) {
			iHeight = Math.trunc(1920 * iAvailWidth / iAvailHeight);
		} else {
			iHeight = Math.trunc(1920 * iAvailHeight / iAvailWidth);
		}
		return {
			width: { ideal: iWidth },
			height: { ideal: iHeight }
		};
	}

	/**
	 * Attach the press event to the barcode avatar
	 * @param {object} barcode The barcode result object
	 * @param {integer} iIndex The index of the barcode avatar
	 * @private
	 */
	function attachPressEventToBarcodeAvatar(barcode, iIndex) {
		iIndex = iIndex || 0;
		var oBarcodeAvatar;
		if (oBarcodeScannerUIContainer && Array.isArray(oBarcodeScannerUIContainer._aBarcodeAvatars)) {
			oBarcodeAvatar = oBarcodeScannerUIContainer._aBarcodeAvatars[iIndex];
		}
		if (oBarcodeAvatar) {
			oBarcodeAvatar.removeAllCustomData();
			oBarcodeAvatar.addCustomData(new CustomData({
				key: "barcode",
				value: barcode
			}));
			oBarcodeAvatar.addCustomData(new CustomData({
				key: "press",
				value: function(barcode) {
					callFnSuccess(barcode);
				}
			}));
		}
	}

	/**
	 * Call the success callback function
	 * @param {object} barcode The barcode result object
	 * @private
	 */
	function callFnSuccess(barcode) {
		var onFnSuccess = oModel.getProperty("/callBackHandler/onFnSuccess");
		if (typeof onFnSuccess === "function") {
			barcode.scanningTime = "unknown";
			if (oModel.getProperty("/scanDialog/scanningStartTime") > 0) {
				var scanningStopTime = Date.now();
				barcode.scanningTime = scanningStopTime - oModel.getProperty("/scanDialog/scanningStartTime");
			}
			if (oModel.getProperty("/config/enableGS1Header")) {
				// Add the symbology identifier of GS1 as prefix into the barcode text of ZXingCPP
				barcode.text = barcode.symbologyIdentifier + barcode.text;
			}
			if (typeof barcode.cancelled !== "boolean") {
				barcode.cancelled = false;
			}
			onFnSuccess(barcode);
		}
		BarcodeScanner.closeScanDialog();
	}

	/**
	 * Process the multi results
	 * @param {object} results The scan results object
	 * @param {boolean} bPauseDecode Pause the scan process if TRUE
	 * @param {object} oAvatarPositionInfo The position info for barcode avatars
	 * @private
	 */
	function processMultiResults(results, bPauseDecode, oAvatarPositionInfo) {
		var iSize = results.size();
		// show the barcode avatars, attach the press event
		for (var i = 0; i < iSize; i++) {
			var oBarcode = results.get(i);
			showBarcodeAvatar(oBarcode, i, oAvatarPositionInfo);
			attachPressEventToBarcodeAvatar(oBarcode, i);
		}
		if (bPauseDecode) {
			toggleCameraScanning(false);
		} else {
			setTimeout(decodeWithZXingCPP, 0);
		}
	}

	/**
	 * Hide all the barcode avatars
	 * @private
	 */
	function hideBarcodeAvatars() {
		var oMultiScan = oModel.getProperty("/apis/ZXingCPP/multiScan");
		var iMaxBarcodeNumber = oMultiScan.enabled ? oMultiScan.maxBarcodeNumber : 1;
		for (var i = 0; i < iMaxBarcodeNumber; i++) {
			hideBarcodeAvatar(i);
		}
	}

	/**
	 * Hide the barcode avatar
	 * @param {integer} iIndex The index of barcode avatar
	 * @private
	 */
	function hideBarcodeAvatar(iIndex) {
		iIndex = iIndex || 0;
		var oBarcodeAvatar,
			oBarcodeAvatarDom;
		if (oBarcodeScannerUIContainer && Array.isArray(oBarcodeScannerUIContainer._aBarcodeAvatars)) {
			oBarcodeAvatar = oBarcodeScannerUIContainer._aBarcodeAvatars[iIndex];
		}
		if (oBarcodeAvatar) {
			oBarcodeAvatar.oBarcode = undefined;
			oBarcodeAvatarDom = oBarcodeAvatar.getDomRef();
		}
		if (oBarcodeAvatarDom) {
			oBarcodeAvatarDom.hidden = true;
			oBarcodeAvatarDom.style.visibility = "hidden";
			oBarcodeAvatarDom.style.top = 0;
			oBarcodeAvatarDom.style.left = 0;
		}
	}

	/**
	 * Reshow all the barcode avatars
	 * @private
	 */
	function reshowBarcodeAvatars(oAvatarPositionInfo) {
		var oMultiScan = oModel.getProperty("/apis/ZXingCPP/multiScan");
		var iMaxBarcodeNumber = oMultiScan.enabled ? oMultiScan.maxBarcodeNumber : 1;
		if (oBarcodeScannerUIContainer && Array.isArray(oBarcodeScannerUIContainer._aBarcodeAvatars)) {
			for (var i = 0; i < iMaxBarcodeNumber; i++) {
				var oBarcodeAvatar = oBarcodeScannerUIContainer._aBarcodeAvatars[i];
				if (oBarcodeAvatar && oBarcodeAvatar.oBarcode) {
					var oBarcodeAvatarDom = oBarcodeAvatar.getDomRef();
					if (oBarcodeAvatarDom && oBarcodeAvatarDom.style.visibility === "visible") {
						showBarcodeAvatar(oBarcodeAvatar.oBarcode, i, oAvatarPositionInfo);
					}
				}
			}
		}
	}

	function scanFrame() {
		Log.debug("BarcodeScanner.scanFrame: start to set up overlay dom");
		if (!oScanDialog || !oBarcodeVideoDOM || !oBarcodeVideoDOM.videoHeight || !oBarcodeVideoDOM.videoWidth) {
			Log.debug("BarcodeScanner.scanFrame: scan dialog or video screen is closed, stop set up");
			return;
		}
		var iInactiveZonePercent = 0.15;

		if (!oBarcodeOverlayDOM && oBarcodeScannerUIContainer) {
			oBarcodeOverlayDOM = oBarcodeScannerUIContainer.getDomRef('overlay');
		}

		if (oBarcodeOverlayDOM) {
			// show overlay since it may be hidden during orientation change
			oBarcodeOverlayDOM.hidden = false;
			var iContainerWidth = oBarcodeScannerUIContainer.getDomRef().clientWidth,
				iContainerHeight = oBarcodeScannerUIContainer.getDomRef().clientHeight;
			var oBarcodeOverlayWidthTemp = iContainerWidth * (1 - 2 * iInactiveZonePercent);
			var oBarcodeOverlayHeightTemp = iContainerHeight * (1 - 2 * iInactiveZonePercent);

			if (oBarcodeOverlayWidthTemp <= oBarcodeOverlayHeightTemp) {
				oBarcodeOverlayHeightTemp = oBarcodeOverlayWidthTemp * (1 - 2 * iInactiveZonePercent);
			}

			// Base on the size of video dom, reset the size of Barcode Scanner Box
			var oBarcodeScannerBox = oBarcodeScannerUIContainer.getDomRef('overlay-box');
			if (oBarcodeScannerBox) {
				oBarcodeScannerBox.style.width = oBarcodeOverlayWidthTemp + 'px';
				oBarcodeScannerBox.style.height = oBarcodeOverlayHeightTemp + 'px';

				oBarcodeOverlayDOM.style.width = iContainerWidth + 'px';
				oBarcodeOverlayDOM.style.height = iContainerHeight + 'px';
			}
		}
	}

	function closeScannerContain(bCloseDialog) {
		// destroy the container including the barcode avatars
		if (oBarcodeScannerUIContainer && bCloseDialog !== false) {
			oBarcodeScannerUIContainer.destroy();
		}
		if (oVideoTrack) {
			oVideoTrack.stop();
			oVideoTrack = undefined;
		}
		if (oStream) {
			oStream = undefined;
		}
		if (Device.support.orientation && bCloseDialog !== false) {
			Device.orientation.detachHandler(orientationChangeListener);
		}
		if (oBarcodeVideoDOM && oBarcodeVideoDOM.srcObject) {
			oBarcodeVideoDOM.srcObject = undefined;
		}
	}

	function zebraEBScanEnable() {
		oModel.checkUpdate(true);
		var oEnableZebraBarcodeRetryCount = oModel.getProperty("/apis/ZebraEnterpriseBrowser/enableZebraBarcodeRetryCount");
		var oEnableBarcodeState = oModel.getProperty("/apis/ZebraEnterpriseBrowser/enableBarcodeState");
		if (getCurrentScannerAPI() === "ZebraEnterpriseBrowser" && isScannerAPIAvailable("ZebraEnterpriseBrowser") && oEnableBarcodeState !== true) {
			var zebraEBScanCallBackFn = function(jsonObject) {
				if (jsonObject['data'] == "" || jsonObject['time'] == "") {
					var onFnFail = oModel.getProperty("/callBackHandler/onFnFail");
					if (typeof onFnFail === "function") {
						var zebraEBScanFailResult = {
							text: "Zebra Scan failed",
							resultStatus: "Error"
						};
						if (oModel.getProperty("/callBackHandler/callBackFromSetPhysicalScan")) {
							zebraEBScanFailResult = new Event('scanFailEvent', new EventProvider(), zebraEBScanFailResult);
						}
						onFnFail(zebraEBScanFailResult);
					}
					Log.error("BarcodeScanner.zebraEBScanEnable: Zebra Enterprise Browser Scan Failed");
				} else {
					Log.debug("BarcodeScanner.zebraEBScanEnable: Zebra EB Scan Result: " + jsonObject.data + "; Scan Json: " + JSON.stringify(jsonObject));
					var onFnSuccess = oModel.getProperty("/callBackHandler/onFnSuccess");
					if (typeof onFnSuccess === "function") {
						var oScanningTime = "unknown";
						if (oModel.getProperty("/scanDialog/scanningStartTime") > 0) {
							var scanningStopTime = Date.now();
							oScanningTime = scanningStopTime - oModel.getProperty("/scanDialog/scanningStartTime");
						}
						var zebraEBScanSuccessResult = {
							text: jsonObject.data,
							format: jsonObject.source,
							resultStatus: "Success",
							scanningTime: oScanningTime,
							cancelled: false
						};
						if (oModel.getProperty("/callBackHandler/callBackFromSetPhysicalScan")) {
							zebraEBScanSuccessResult =  new Event('scanSuccessEvent',  new EventProvider(), zebraEBScanSuccessResult);
						}
						onFnSuccess(zebraEBScanSuccessResult);
						oModel.setProperty("/scanDialog/scanningStartTime", 0);
					}
				}
			};
			if (oModel.getProperty("/config/enableGS1Header")) {
				EB.Barcode.codeIdType = EB.Barcode.CODEIDTYPE_AIM;
			} else {
				EB.Barcode.codeIdType = EB.Barcode.CODEIDTYPE_NONE;
			}
			EB.Barcode.enable({}, zebraEBScanCallBackFn);
			oModel.setProperty("/apis/ZebraEnterpriseBrowser/enableBarcodeState", true);
			Log.debug("BarcodeScanner.zebraEBScanEnable: try to enable EB Barcode in (" + (6 - oEnableZebraBarcodeRetryCount) + ") times");
		} else if (oEnableZebraBarcodeRetryCount > 1 && oEnableBarcodeState === 'init') {
			// Because the loading of EB Barcode is async, try to enable EB Barcode API in 6 times.
			oEnableZebraBarcodeRetryCount--;
			oModel.setProperty("/apis/ZebraEnterpriseBrowser/enableZebraBarcodeRetryCount", oEnableZebraBarcodeRetryCount);
			initZebraEB();
			setTimeout(zebraEBScanEnable, 500);
		} else {
			Log.debug("BarcodeScanner.zebraEBScanEnable: The scanner API is not ZebraEnterpriseBrowser or cannot been enabled.");
		}
	}

	function checkZebraEBScanAvailable() {
		var keepCameraScan = oModel.getProperty("/scanDialog/keepCameraScan");
		var zebraEBScanAvailable = false;
		if (isScannerAPIAvailable("ZebraEnterpriseBrowser") && (!keepCameraScan || typeof keepCameraScan !== 'boolean')) {
			zebraEBScanAvailable = true;
		}
		return zebraEBScanAvailable;
	}

	/**
	 * Listener the keydown event and then push the correct key into the result buffer of Bluetooth Barcode Scanner.
	 *
	 * @param {Event} oEvent - The keydown event
	 * @private
	 */
	function addKeyToResultBuffer(oEvent) {
		var oBluetoothScanner = oModel.getProperty("/apis/BluetoothScanner/");
		if (oEvent.key === "Unidentified" && oBluetoothScanner.replaceGS1Separator){
			// Workaround for Android devices
			// in case of GS ascii key, the field oEvent.key is "Unidentified"
			var keyCode = oEvent.keyCode || oEvent.which;
			var keyCharacter = String.fromCharCode(keyCode);
			oEvent.key = keyCharacter;
			Log.debug("The unidentified oEvent.key is replaced by (keyCode:" + keyCode + "|keyCharacter:" + keyCharacter);
		}
		if (oBluetoothScanner.resultBuffer.length > 5000) {
			Log.error("Key Buffer contains " + oBluetoothScanner.resultBuffer.length + " characters");
			// Clear the temp data of Bluetooth Scanner
			var oConfig = {
				"resultBuffer": []
			};
			BarcodeScanner.enableBluetoothBarcodeScanner(null, oConfig);
		} else if (oModel.getProperty("/bReady") && isScannerAPIAvailable("BluetoothScanner")) {
			// When the scanning dialog UI is open, the bReady is false.
			if (oBluetoothScanner.scanningMode === "TimeInterval") {
				detectScanViaTimeInterval(oEvent, oBluetoothScanner);
			} else if (oBluetoothScanner.scanningMode === "PrefixSuffix") {
				detectScanViaPrefixSuffix(oEvent, oBluetoothScanner);
			}
		}
		oModel.setProperty("/apis/BluetoothScanner/", oBluetoothScanner);
	}

	/**
	 * Detect scanning result via interval time
	 *
	 * @param {Event} oEvent - The keydown event of keyboard
	 * @param {object} oBluetoothScanner - The settings of BluetoothScanner
	 * @private
	 */
	function detectScanViaTimeInterval(oEvent, oBluetoothScanner) {
		Log.debug("The detectScanViaTimeInterval() is calling.");
		var jKey = {
			key: oEvent.key,
			timestamp: Date.now(),
			deltaTime: Number.MAX_VALUE
		};
		var oldLastKey = jKey;
		if (oBluetoothScanner.resultBuffer[oBluetoothScanner.resultBuffer.length - 1] !== undefined) {
			oldLastKey = oBluetoothScanner.resultBuffer[oBluetoothScanner.resultBuffer.length - 1];
		}
		jKey.deltaTime = jKey.timestamp - oldLastKey.timestamp;
		Log.debug("jKey.deltaTime: " + jKey.deltaTime + "; key: " + jKey.key + "(AltKey:" + oEvent.altKey + ";CtrlKey:" + oEvent.ctrlKey + ";Which:" + oEvent.which + "); oldLastKey:" + oldLastKey.key);
		if (jKey.deltaTime > oBluetoothScanner.intervalForDetection) {
			Log.debug("jKey(key:" + jKey.key + ").deltaTime(" + jKey.deltaTime + ") > " + oBluetoothScanner.intervalForDetection);
			if (jKey.key.length <= oBluetoothScanner.scanningKeyMaxLength) {
				jKey.deltaTime = 0;
				oBluetoothScanner.scanningLastKey = jKey;
				Log.debug("addKeyToResultBuffer(): the Last key is saved.");
			}
			getScannedCharacterFromBuffer();
		} else {
			// Store the key into the resultBuffer
			if (jKey.key.length <= oBluetoothScanner.scanningKeyMaxLength) {
				// The default value of scanningKeyMaxLength is 1. By default, only the characters can be saved (e.g. The key "Shift" or "ArrowDown" will be ignored)
				oBluetoothScanner.resultBuffer.push(jKey);
				if (oBluetoothScanner.replaceGS1Separator) {
					oBluetoothScanner = replaceGS1Codes(oEvent, oBluetoothScanner);
				}
			} else if (oBluetoothScanner.resultBuffer.length > 0) {
				oBluetoothScanner.resultBuffer[oBluetoothScanner.resultBuffer.length - 1].timestamp = jKey.timestamp;
			}
			// Clear the old schedule and then reset it
			if (oBluetoothScanner.timeOutForDetection) {
				clearTimeout(oBluetoothScanner.timeOutForDetection);
			}
			Log.debug("The waiting time of Bluetooth Scanner Schedule must be more than the intervalForDetection(" + oBluetoothScanner.intervalForDetection + "). The default value is 50 ms and the added value is 20 ms.");
			oBluetoothScanner.timeOutForDetection = setTimeout(getScannedCharacterFromBuffer, (oBluetoothScanner.intervalForDetection + 20));
			if (oBluetoothScanner.handleFocusedElement && oBluetoothScanner.resultBuffer.length < 3) {
				// Store the data of the focused element
				focusedElementHandler();
			}
		}
	}

	/**
	 * Detect scanning result via prefix, suffix and max scanning times
	 *
	 * @param {Event} oEvent - The keydown event of keyboard
	 * @param {object} oBluetoothScanner - The settings of BluetoothScanner
	 * @private
	 */
	function detectScanViaPrefixSuffix(oEvent, oBluetoothScanner) {
		Log.debug("The detectScanViaPrefixSuffix() is calling.");
		var jKey = {
			key: oEvent.key,
			timestamp: Date.now(),
			deltaTime: Number.MAX_VALUE
		};
		if (jKey.key.length <= oBluetoothScanner.scanningKeyMaxLength) {
			// The default value of scanningKeyMaxLength is 1. By default, only the characters can be saved (e.g. The key "Shift" or "ArrowDown" will be ignored)
			if (oBluetoothScanner.resultBuffer.length > 0) {
				if ((jKey.timestamp - oBluetoothScanner.resultBuffer[0].timestamp) > oBluetoothScanner.maxPrefixSuffixScanningTime) {
					Log.debug("detectScanViaPrefixSuffix(): The scan time to long");
					// Clear the temp data of Bluetooth Scanner
					var oConfig = {
						"resultBuffer": []
					};
					BarcodeScanner.enableBluetoothBarcodeScanner(null, oConfig);
				} else if (suffixValidation(jKey, oBluetoothScanner)) {
					Log.debug("detectScanViaPrefixSuffix(): The suffix(" + oBluetoothScanner.suffix + ") is matched.");
					if (oBluetoothScanner.handleFocusedElement) {
						Log.debug("Stop the event of suffix last character to trigger");
						oEvent.preventDefault();
					}
					getScannedCharacterFromBuffer();
				} else {
					oBluetoothScanner.resultBuffer.push(jKey);
					if (oBluetoothScanner.replaceGS1Separator) {
						oBluetoothScanner = replaceGS1Codes(oEvent, oBluetoothScanner);
					}
				}
			} else {
				prefixValidation(jKey, oBluetoothScanner);
			}
		}
	}

	function prefixValidation (jKey, oBluetoothScanner) {
		var oPrefix = oBluetoothScanner.prefixString + jKey.key;
		oBluetoothScanner.prefixFound = false;
		if (oPrefix === oBluetoothScanner.prefix) {
			jKey.key = oPrefix;
			if (oBluetoothScanner.prefixStartDate) {
				jKey.timestamp = oBluetoothScanner.prefixStartDate;
			}
			oBluetoothScanner.resultBuffer.push(jKey);
			oBluetoothScanner.prefixString = "";
			oBluetoothScanner.prefixStartDate = null;
			oBluetoothScanner.prefixFound = true;
			if (oBluetoothScanner.handleFocusedElement) {
				// Store the data of focused element
				focusedElementHandler();
			}
		} else if (oBluetoothScanner.prefix.indexOf(oPrefix) === 0) {
			if (oBluetoothScanner.prefixString.length === 0) {
				// Save the first character time
				oBluetoothScanner.prefixStartDate = jKey.timestamp;
			}
			oBluetoothScanner.prefixString = oPrefix;
		} else {
			oBluetoothScanner.prefixString = "";
			oBluetoothScanner.prefixStartDate = null;
			oBluetoothScanner.resultBuffer.length = 0;
		}
		return oBluetoothScanner.prefixFound;
	}

	function suffixValidation (jKey, oBluetoothScanner) {
		var oSuffix = oBluetoothScanner.suffixString + jKey.key;
		oBluetoothScanner.suffixFound = false;
		if (oSuffix === oBluetoothScanner.suffix) {
			// remove the suffix, the last character of suffix has not been pushed into the resultBuffer
			var suffixStart = oBluetoothScanner.resultBuffer.length - oBluetoothScanner.suffix.length + 1;
			oBluetoothScanner.resultBuffer.splice(suffixStart);
			// remove the prefix
			oBluetoothScanner.resultBuffer.splice(0,1);
			oBluetoothScanner.suffixString = "";
			oBluetoothScanner.suffixFound = true;
			if (oBluetoothScanner.handleFocusedElement) {
				Log.debug("The value of focusedElementInstance:" + oBluetoothScanner.focusedElementInstance.value);
				// reset the data of focused element
				focusedElementHandler();
			}
		} else if (oSuffix.length < oBluetoothScanner.suffix.length) {
			oBluetoothScanner.suffixString = oSuffix;
		} else {
			oBluetoothScanner.suffixString = oSuffix.substr(1);
		}
		return oBluetoothScanner.suffixFound;
	}

	/**
	 * Replace the GS1 base on GS1FunctionKey, GS1Code and GS1ReplacementCharacter
	 *
	 * @param {Event} oEvent - The keydown event of keyboard
	 * @param {object} oBluetoothScanner - The settings of BluetoothScanner
	 * @returns {object} The updated settings of oBluetoothScanner
	 * @private
	 */
	function replaceGS1Codes(oEvent, oBluetoothScanner) {
		Log.debug("The replaceGS1Codes() is calling. The GS1 will be replaced by specified characters.");
		if (oEvent[oBluetoothScanner.GS1FunctionKey]) {
			var oResultBuffer = oBluetoothScanner.resultBuffer;
			var oGS1Code = oBluetoothScanner.GS1Code;
			if (oGS1Code === undefined || oGS1Code === null) {
				if (oBluetoothScanner.GS1FunctionKey === "altKey") {
					// By default, the scanner turn on the ""ALt 3 Digit HEX" Mode, the "Alt + 029" will be returned for [GS]
					oGS1Code = "0029";
				} else if (oBluetoothScanner.GS1FunctionKey === "ctrlKey") {
					// By default, the scanner turn on the "Windows Mode Control + X", the "Control + ]" will be returned for [GS]
					oGS1Code = "]";
				}
			}
			if (oBluetoothScanner.replaceCharacterBuffer.length === 0) {
				oBluetoothScanner.replaceCharacterBuffer = oEvent.key;
			} else if (oBluetoothScanner.replaceCharacterBuffer.length > 0) {
					if (oBluetoothScanner.replaceCharacterBuffer.length  < oGS1Code.length) {
						oBluetoothScanner.replaceCharacterBuffer += oEvent.key;
					} else {
						var oStart = oBluetoothScanner.replaceCharacterBuffer.length - oGS1Code.length + 1;
						Log.debug("The replaceCharacterBuffer: " + oBluetoothScanner.replaceCharacterBuffer + "; oStart: " + oStart + "; oGS1Code: " + oGS1Code);
						oBluetoothScanner.replaceCharacterBuffer = oBluetoothScanner.replaceCharacterBuffer.slice(oStart) + oEvent.key;
						Log.debug("The replaceCharacterBuffer is changed to " + oBluetoothScanner.replaceCharacterBuffer);
					}
			}
			var replaceCharacterBufferEqualToGS1Codes = false;
			if (oBluetoothScanner.GS1FunctionKey === "altKey" && oBluetoothScanner.replaceCharacterBuffer.length > 0 && !isNaN(oBluetoothScanner.replaceCharacterBuffer) && !isNaN(oGS1Code)) {
				// The ASCII code [GS] of Honeywell Scanner is "029". The ASCII code [GS] of Zebra Scanner is "0029".
				replaceCharacterBufferEqualToGS1Codes = Number(oBluetoothScanner.replaceCharacterBuffer) === Number(oGS1Code);
			} else {
				replaceCharacterBufferEqualToGS1Codes = oBluetoothScanner.replaceCharacterBuffer === oGS1Code;
			}
			if (oBluetoothScanner.replaceCharacterBuffer.length > 0) {
				Log.debug("replacementData - Code: " + oBluetoothScanner.GS1Code + "; Buffer:" + oBluetoothScanner.replaceCharacterBuffer + "; Function Key:" + oBluetoothScanner.GS1FunctionKey);
			}
			if (replaceCharacterBufferEqualToGS1Codes) {
				var jKey = oResultBuffer[oResultBuffer.length - 1];
				if (oBluetoothScanner.GS1ReplacementCharacter !== undefined) {
					jKey.key = oBluetoothScanner.GS1ReplacementCharacter;
				} else {
					// By default, 29 is ASCII code for GS (Group separator), it will be converted to string "/x1D" into Barcode Data
					jKey.key = String.fromCharCode("29");
				}
				var oIndex = oBluetoothScanner.replaceCharacterBuffer.length;
				oResultBuffer.splice(oResultBuffer.length - oIndex, oIndex, jKey);
				Log.debug("replaceGS1Codes(): Replace (" + oBluetoothScanner.GS1FunctionKey + " + " + oBluetoothScanner.replaceCharacterBuffer + ") by (" + jKey.key + ")");
				oBluetoothScanner.replaceCharacterBuffer = "";
			}
		} else {
			Log.debug("This function key(" + oBluetoothScanner.GS1FunctionKey + ") of Event is false.");
		}
		return oBluetoothScanner;
	}

	/**
	 * Get the scanning result from the Buffer of Bluetooth Barcode Scanner
	 * @private
	 */
	function getScannedCharacterFromBuffer() {
		var oBluetoothScanner = oModel.getProperty("/apis/BluetoothScanner/");
		Log.debug("Call getScannedCharacterFromBuffer(). The length is " + oBluetoothScanner.resultBuffer.length);
		var oResult = "";
		// For the "TimeInterval" scanning mode, if there is only one character into the buffer, it's unavailable result.
		if (( oBluetoothScanner.scanningMode === "TimeInterval" && oBluetoothScanner.resultBuffer.length >= oBluetoothScanner.resultMinLength)
		|| (oBluetoothScanner.scanningMode === "PrefixSuffix" && oBluetoothScanner.suffixFound)) {
			oBluetoothScanner.resultBuffer.forEach(function(items){
				oResult += items.key;
			});
			var fnBluetoothScan = oModel.getProperty("/callBackHandler/fnBluetoothScan");
			if (typeof fnBluetoothScan === "function") {
				var oScanningTime = 0;
				if (oBluetoothScanner.resultBuffer.length > 0) {
					oScanningTime = Date.now() - oBluetoothScanner.resultBuffer[0].timestamp;
				}
				oScanningTime = oScanningTime > 0 ? oScanningTime : "unknown";
				var bluetoothScanSuccessResult = {
					text: oResult,
					format: "bluetoothScanner",
					resultStatus: "Success",
					scanningTime: oScanningTime,
					cancelled: false
				};
				bluetoothScanSuccessResult =  new Event('bluetoothScanSuccessEvent',  new EventProvider(), bluetoothScanSuccessResult);
				if (oBluetoothScanner.triggerOneTime) {
					BarcodeScanner.disableBluetoothBarcodeScanner();
				}
				fnBluetoothScan(bluetoothScanSuccessResult);
				oModel.setProperty("/scanDialog/scanningStartTime", 0);
				Log.debug("Result is: " + oResult);
			}
			if (oBluetoothScanner.handleFocusedElement) {
				// the element will be re-focused
				focusedElementHandler();
			}
		} else {
			Log.debug("The length of input string is less than " + oBluetoothScanner.resultMinLength);
		}
		oBluetoothScanner.resultBuffer.length = 0;
		oBluetoothScanner.prefixFound = false;
		oBluetoothScanner.suffixFound = false;
		if (oBluetoothScanner.focusedElementInstance) {
			Log.debug("Value of focusedElementInstance: " + oBluetoothScanner.focusedElementInstance.value);
		}
		if (oBluetoothScanner.scanningLastKey) {
			oBluetoothScanner.resultBuffer.push(oBluetoothScanner.scanningLastKey);
			Log.debug("Re-push the scanningLastKey(" + oBluetoothScanner.scanningLastKey.key + ") into the buffer.");
			oBluetoothScanner.scanningLastKey = null;
			if (oBluetoothScanner.handleFocusedElement) {
				// the data of element will be stored for last key
				focusedElementHandler();
			}
		} else {
			Log.debug("Clear the data of focused element");
			oBluetoothScanner.focusedElementValue = "";
			oBluetoothScanner.focusedElementInstance = "";
		}
		if (oBluetoothScanner.timeOutForDetection) {
			clearTimeout(oBluetoothScanner.timeOutForDetection);
		}
		oModel.setProperty("/apis/BluetoothScanner/", oBluetoothScanner);
	}

	/**
	 * Bluetooth Barcode Scanner handle the focused element
	 * @private
	 */
	function focusedElementHandler() {
		var focusedElement = jQuery(":focus")[0];
		var oBluetoothScanner = oModel.getProperty("/apis/BluetoothScanner/");
		Log.debug("Calling the focusedElementHandler()");
		if (focusedElement) {
			if ((oBluetoothScanner.scanningMode === "TimeInterval" && oBluetoothScanner.resultBuffer.length === 2)
			|| (oBluetoothScanner.scanningMode === "PrefixSuffix" && oBluetoothScanner.suffixFound)) {
				Log.debug("For the focused element, the focal point will be removed and data will be reset.");
				oBluetoothScanner.focusedElementInstance = focusedElement;
				if (jQuery(focusedElement).is("input, textarea")) {
					// Reset Value
					focusedElement.value = DOMPurify.sanitize(oBluetoothScanner.focusedElementValue);
					Log.debug("This focused element is the input or text area element. The value is " + focusedElement.value);
					// Reset the caret
					if (focusedElement.setSelectionRange
						&& oBluetoothScanner.focusedElementSelectionStart !== null
						&& oBluetoothScanner.focusedElementSelectionEnd !== null) {
							Log.debug("Reset the caret of the focused element");
							focusedElement.setSelectionRange(oBluetoothScanner.focusedElementSelectionStart, oBluetoothScanner.focusedElementSelectionEnd);
					}
					// clear data about focused input or text area element
					oBluetoothScanner.focusedElementValue = "";
					oBluetoothScanner.focusedElementSelectionStart = null;
					oBluetoothScanner.focusedElementSelectionEnd = null;
				}
				jQuery(focusedElement).blur();
			} else if ((oBluetoothScanner.resultBuffer.length === 1) && jQuery(focusedElement).is("input, textarea")) {
				Log.debug("Store the data of focused input or textarea element. ElementValue: " + focusedElement.value + "; SelectionStart: " + focusedElement.selectionStart + "; SelectionEnd: " + focusedElement.selectionEnd);
				oBluetoothScanner.focusedElementInstance = focusedElement;
				//Sanitize the value of the focused element
				oBluetoothScanner.focusedElementValue = DOMPurify.sanitize(focusedElement.value);
				oBluetoothScanner.focusedElementSelectionStart = focusedElement.selectionStart;
				oBluetoothScanner.focusedElementSelectionEnd = focusedElement.selectionEnd;
				if (oBluetoothScanner.scanningMode === "PrefixSuffix") {
					Log.debug("The scanning mode is PrefixSuffix");
					// The last character of prefix is not inputted into the focused element
					var prefixSub = oBluetoothScanner.prefix.substr(0, oBluetoothScanner.prefix.length - 1);
					var prefixStart = focusedElement.value.lastIndexOf(prefixSub);
					if (prefixStart !== -1) {
						// remove the prefixSub from the focusedElementValue
						oBluetoothScanner.focusedElementValue = oBluetoothScanner.focusedElementValue.substr(0, prefixStart) + oBluetoothScanner.focusedElementValue.substr(prefixStart + prefixSub.length);
						oBluetoothScanner.focusedElementSelectionStart = oBluetoothScanner.focusedElementSelectionStart - prefixSub.length;
						oBluetoothScanner.focusedElementSelectionEnd = oBluetoothScanner.focusedElementSelectionEnd - prefixSub.length;
						Log.debug("The focusedElementHandler():prefixStart:" + prefixStart + ";Value" + focusedElement.value + ";New Value:" + oBluetoothScanner.focusedElementValue + ";PrefixSub:" + prefixSub);
					}
				}
				if (oBluetoothScanner.scanningLastKey) {
					Log.debug("The function focusedElementHandler() will clear the info about the LastKey: " + oBluetoothScanner.scanningLastKey.key);
					oBluetoothScanner.scanningLastKey = null;
				}
			}
		} else if (typeof oBluetoothScanner.focusedElementInstance === "object") {
			Log.debug("Re-focused this element. The value is " + oBluetoothScanner.focusedElementInstance.value);
			jQuery(oBluetoothScanner.focusedElementInstance).focus();
			oBluetoothScanner.focusedElementInstance = "";
		} else {
			Log.debug("There is not the focused element.");
		}
		oModel.setProperty("/apis/BluetoothScanner/", oBluetoothScanner);
	}

	function customBlurHandler() {
		Log.debug("The custom Blur handler is called");
		if (typeof oFocusedInstance === "object") {
			oFocusedInstance.focus();
			jQuery(oFocusedInstance).off("blur", customBlurHandler);
		}
	}

	/* =========================================================== */
	/* API methods												 */
	/* =========================================================== */

	/**
	 * Starts the barcode scanning process either showing the live input from the camera or displaying a dialog
	 * to enter the value directly if the barcode scanning feature is unavailable.
	 *
	 * The barcode scanning is done asynchronously. When it is triggered, this function returns without waiting for
	 * the scanning process to finish. The applications have to provide callback functions to react to the events of
	 * a successful scanning, an error during scanning, and the live input on the dialog.
	 *
	 * <code>fnSuccess</code> is passed an object with text, format and cancelled properties. Text is the text representation
	 * of the barcode data, format is the type of the barcode detected, and cancelled is whether or not the user cancelled
	 * the scan. <code>fnError</code> is given the error, <code>fnLiveUpdate</code> is passed the new value entered in the
	 * dialog's input field. An example:
	 *
	 * <pre>
	 * sap.ui.require(["sap/ndc/BarcodeScanner"], function(BarcodeScanner) {
	 * 	BarcodeScanner.scan(
	 *		function (mResult) {
	 *			alert("We got a barcode\n" +
	 *			 	"Result: " + mResult.text + "\n" +
	 *			 	"Format: " + mResult.format + "\n" +
	 *			 	"Cancelled: " + mResult.cancelled);
	 *		},
	 *		function (Error) {
	 *			alert("Scanning failed: " + Error);
	 *		},
	 *		function (mParams) {
	 *			alert("Value entered: " + mParams.newValue);
	 *		},
	 *		"Enter Product Barcode",
	 *		true,
	 *		30,
	 *		1,
	 *		false,
	 *		false
	 * 	);
	 * });
	 * </pre>
	 *
	 * @param {function} [fnSuccess] Function to be called when the scanning is done or cancelled
	 * @param {function} [fnFail] Function to be called when the scanning is failed
	 * @param {function} [fnLiveUpdate] Function to be called when value of the dialog's input is changed
	 * @param {string} [dialogTitle] Defines the barcode input dialog title. If unset, a predefined title will be used.
	 * @param {boolean} [preferFrontCamera] Flag, which defines whether the front or back camera should be used.
	 * @param {float} [frameRate] Defines the frame rate of the camera.
	 * @param {float} [zoom] Defines the zoom of the camera. This parameter is not supported on iOS.
	 * @param {boolean} [keepCameraScan] Flag, which defines whether the camera should be used for scanning in Zebra Enterprise Browser.
	 * @param {boolean} [disableBarcodeInputDialog] Flag, which defines whether the Barcode input dialog should be shown.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.scan = function (fnSuccess, fnFail, fnLiveUpdate, dialogTitle, preferFrontCamera, frameRate, zoom, keepCameraScan, disableBarcodeInputDialog) {
		if (!oModel.getProperty("/bReady")) {
			Log.error("BarcodeScanner.scan: Barcode scanning is already in progress.");
			return;
		}
		Log.debug("BarcodeScanner.scan: start to scan barcode.");

		oModel.setProperty("/bReady", false);
		if (typeof fnSuccess === 'function') {
			oModel.setProperty("/callBackHandler/onFnSuccess", fnSuccess);
		} else {
			oModel.setProperty("/callBackHandler/onFnSuccess", null);
		}
		if (typeof fnFail === 'function') {
			oModel.setProperty("/callBackHandler/onFnFail", fnFail);
		} else {
			oModel.setProperty("/callBackHandler/onFnFail", null);
		}
		if (typeof fnLiveUpdate === 'function') {
			oModel.setProperty("/scanDialog/onLiveUpdate", fnLiveUpdate);
		} else {
			oModel.setProperty("/scanDialog/onLiveUpdate", null);
		}
		if (typeof dialogTitle === "string" && dialogTitle != null && dialogTitle.trim() != "") {
			oModel.setProperty("/scanDialog/title", dialogTitle);
		} else {
			oModel.setProperty("/scanDialog/title", oResourceModel.getProperty("BARCODE_DIALOG_TITLE"));
		}
		oModel.setProperty("/scanDialog/scanningStartTime", Date.now());
		oModel.setProperty("/config/preferFrontCamera", preferFrontCamera);
		// Reset frameRate
		if (oModel.getProperty("/config/defaultConstraints/video/frameRate") !== undefined) {
			delete oModel.getProperty("/config/defaultConstraints/video").frameRate;
		}
		// apply value of frameRate parameter
		if (typeof frameRate === "number" && frameRate > 0) {
			oModel.setProperty("/config/defaultConstraints/video/frameRate", frameRate);
		} else if (typeof frameRate !== 'undefined') {
			MessageToast.show(
				oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_UPDATE_PARAMETER_ERROR_MSG', ['frameRate']),
				{
					duration: 1000
				}
			);
		}
		// Reset zoom
		if (oModel.getProperty("/config/defaultConstraints/video/zoom") !== undefined) {
			delete oModel.getProperty("/config/defaultConstraints/video").zoom;
		}
		// apply value of zoom parameter
		if (typeof zoom === "number" && zoom > 0) {
			oModel.setProperty("/config/defaultConstraints/video/zoom", zoom);
		} else if (typeof zoom !== 'undefined') {
			MessageToast.show(
				oResourceModel.getResourceBundle().getText('BARCODE_DIALOG_CAMERA_UPDATE_PARAMETER_ERROR_MSG', ['zoom']),
				{
					duration: 1000
				}
			);
		}
		oModel.setProperty("/scanDialog/keepCameraScan", keepCameraScan);
		oModel.setProperty("/scanDialog/disableBarcodeInputDialog", disableBarcodeInputDialog);
		oModel.checkUpdate(true);

		if (checkZebraEBScanAvailable()) {
			Log.debug("BarcodeScanner.scan: Zebra EB is available, use it to scan barcode.");
			scanWithZebra();
		} else if (isScannerAPIAvailable("Cordova")) {
			Log.debug("BarcodeScanner.scan: Cordova is available, use it to scan barcode.");
			scanWithCordova();
		} else {
			Log.debug("BarcodeScanner.scan: both of Zebra EB and Cordova are NOT available, use ZXingCPP to scan barcode.");
			scanWithZXingCPP();
		}
	};

	/**
	 * Closes the barcode input dialog. It can be used to close the dialog before the user presses the OK or the Cancel button
	 * (e.g. in the fnLiveUpdate callback function of the {@link sap.ndc.BarcodeScanner.scan} method.)
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.closeScanDialog = function () {
		if (oScanDialog) {
			oScanDialog.close();
			oScanDialog.fireAfterClose();
			oModel.setProperty("/scanDialog/scanningStartTime", 0);
			oModel.setProperty("/scanDialog/onLiveUpdate", null);
			oModel.setProperty("/scanDialog/isDecodePaused", false);
		}
		oModel.setProperty("/bReady", true);
		oModel.checkUpdate(true);
	};

	/**
	 * Returns the status model of the Barcode Scanner. It is a JSON model which contains below properties:
	 * <pre>
	 * {
	 *		scannerAPI: "ZXingCPP",
	 *		available: true,
	 *		deviceId: undefined,
	 *		devices: [],
	 *		apis: [
	 *			{
	 *				key: "ZebraEnterpriseBrowser",
	 *				status: "UnAvailable"
	 *			},
	 *			{
	 *				key: "Cordova",
	 *				status: "UnAvailable"
	 *			},
	 *			{
	 *				key: "ZXingCPP",
	 *				status: "Available"
	 *			}
	 *		]
	 *	}
	 * </pre>
	 * '<code>scannerAPI</code>' shows the current scanner API used to scan the Barcode.
	 * '<code>available</code>' indicating whether or not the Barcode Scanner feature is available. It can be used
	 * to bind to the <code>visible</code> property of UI controls which have to be hidden in case the feature is unavailable.
	 * '<code>deviceId</code>' lists the current used camera id of current device. Not working for iOS devices since do not support to get all the cameras.
	 * '<code>devices</code>' lists all the cameras of current device. Not working for iOS devices since do not support to get all the cameras.
	 * '<code>apis</code>' lists scanner APIs with status value. Status value can be: "Initial", "Loading", "Available" or "UnAvailable".
	 *
	 * IMPORTANT: This model just shows current status of Barcode Scanner. Any change to it will not impact Barcode Scanner.
	 *
	 * @returns {sap.ui.model.json.JSONModel} The Barcode Scanner Status Model
	 * @public
	 * @static
	 */
	BarcodeScanner.getStatusModel = function () {
		return oStatusModel;
	};

	/**
	 * Returns the scanner API info that will be used to scan the barcode.
	 *
	 * @returns {string} The Barcode Scanner API info. (e.g. ZebraEnterpriseBrowser, Cordova, ZXingCPP or unknown)
	 * @public
	 * @static
	 */
	BarcodeScanner.getScanAPIInfo = function () {
		return getCurrentScannerAPI();
	};


	/**
	 * Set the scanner API info that will be used to scan the barcode.
	 *
	 * IMPORTANT: The status of the scanner API must be <strong>"Available"</strong>(for ZXingCPP, status is <strong>NOT "UnAvailable"</strong>), or will return False. Scanner APIs with status value can be got by using {@link #getStatusModel}.
	 * By default, Barcode Scanner will select the scanner API(Available) with priority: ZebraEnterpriseBrowser > Cordova > ZXingCPP.
	 *
	 * @param {string} [scannerAPI] Defines the scanner API to scan the barcode. Scanner API can be "ZebraEnterpriseBrowser", "Cordova" or "ZXingCPP".
	 * @returns {boolean} Return True if set success.
	 * @public
	 * @static
	 */
	BarcodeScanner.setScanAPIInfo = function (scannerAPI) {
		if (!scannerAPI) {
			Log.error("BarcodeScanner.setScanAPIInfo: scannerAPI is undefined.");
			return false;
		}
		if (getCurrentScannerAPI() !== scannerAPI) {
			// check if the scanner API exists
			var oScannerAPI = oModel.getProperty("/apis/" + scannerAPI);
			if (!oScannerAPI) {
				Log.error("BarcodeScanner.scan: The scanner API '" + scannerAPI + "' doesn't exist, will use current scanner API '" + oModel.getProperty("/apis/" + getCurrentScannerAPI() + "/description") + "' to scan the barcode.");
				return false;
			} else if (scannerAPI === "ZXingCPP") {
				if (isScannerAPIUnAvailable(scannerAPI)) {
					Log.error("BarcodeScanner.scan: The scanner API '" + scannerAPI + "' is unavailable, will use current scanner API '" + oModel.getProperty("/apis/" + getCurrentScannerAPI() + "/description") + "' to scan the barcode.");
					return false;
				} else {
					Log.debug("BarcodeScanner.scan: Switch to scanner API '" + scannerAPI + "' to scan the barcode.");
					setCurrentScannerAPI(scannerAPI);
					return true;
				}
			} else if (!isScannerAPIAvailable(scannerAPI)) {
				Log.error("BarcodeScanner.scan: The scanner API '" + scannerAPI + "' is unavailable, will use current scanner API '" + oModel.getProperty("/apis/" + getCurrentScannerAPI() + "/description") + "' to scan the barcode.");
				return false;
			} else {
				Log.debug("BarcodeScanner.scan: Switch to scanner API '" + scannerAPI + "' to scan the barcode.");
				setCurrentScannerAPI(scannerAPI);
				return true;
			}
		} else {
			Log.debug("BarcodeScanner.setScanAPIInfo: '" + scannerAPI + "' is already current scanner API. It need not to be changed.");
			return true;
		}
	};

	/**
	 * Set the callback function for the physical scan button.
	 *
	 * @param {function} [fnPhysicalScan] Function to be called when the scanning is done by pressing physical scan button.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.setPhysicalScan = function (fnPhysicalScan) {
		if (typeof fnPhysicalScan === "function") {
			oModel.setProperty("/callBackHandler/callBackFromSetPhysicalScan", true);
			oModel.setProperty("/callBackHandler/onFnSuccess", fnPhysicalScan);
			oModel.setProperty("/callBackHandler/onFnFail", fnPhysicalScan);
			if (Device.os.android) {
				// reset Zebra EB after go back current page
				jQuery(document).on("visibilitychange", function() {
					if (document.visibilityState === 'visible') {
						initZebraEB();
						zebraEBScanEnable();
					}
				});
			} else {
				setScannerAPIUnAvailable("ZebraEnterpriseBrowser");
				Log.debug("BarcodeScanner.setPhysicalScan: Not Android device, Zebra Enterprise Browser plugin is unavailable!");
			}
		} else {
			Log.debug("setPhysicalScan is failed.");
		}
	};

	/**
	 * Set the configs of the control Barcode Scanner.
	 *
	 * @param {object} [options] The options are the configs that will be used to scan.
	 *
	 * Example:
	 * <pre>
	 * <code>
	 * {
	 *     "enableGS1Header": true,  //If set to true, add the symbology identifier (GS1 specification 5.4.3.7. and 5.4.6.4.) as prefix into the result text.
	 *     "deviceId": "string" // The specific camera id to scan the Barcode. If set to "", Barcode Scanner will use default camera. This option is not working for iOS devices since do not support to get all the cameras.
	 *     "multiScan": {
	 *         "enabled": false, // If set to true, will support scan multi barcodes, and the max number of the barcodes in each scanning is 10. Default value is false. Only working for ZXingCPP.
	 *         "showPauseButton": false, // If set to true, will show a button so that can pause/restart the scan in the scan dialog.
	 *         "pauseIfHasResult": false, // If set to true, will pause current scan dialog if has result. Only working if showPauseButton === false.
	 *         "stopIfOnlyHasOneResult": false // If set to true, will stop current scan and return the result when only has one result. Only working if showPauseButton === false and pauseIfHasResult === true.
	 *     }
	 * }
	 * </code>
	 * </pre>
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.setConfig = function (options) {
		if (typeof options === "object" && Object.keys(options).length > 0) {
			var oConfig = oModel.getProperty("/config");
			for (var oKey in options) {
				if (oKey === "multiScan") {
					if (typeof options.multiScan !== "object") {
						Log.error("The config value for parameter 'multiScan' is not an object, please check!");
						continue;
					}
					var oMultiScan = Object.assign({}, oModel.getProperty("/apis/ZXingCPP/multiScan"), options.multiScan);
					oModel.setProperty("/apis/ZXingCPP/multiScan", oMultiScan);
					oStatusModel.setProperty("/apis/ZXingCPP/multiScan", deepClone(oMultiScan));
					delete oConfig.multiScan;
				} else if (oConfig.hasOwnProperty(oKey)) {
					oConfig[oKey] = options[oKey];
					if (checkZebraEBScanAvailable() && oKey === "enableGS1Header") {
						oModel.setProperty("/apis/ZebraEnterpriseBrowser/enableBarcodeState", false);
						EB.Barcode.disable(zebraEBScanEnable);
					}
					if (oKey === "deviceId") {
						oStatusModel.setProperty("/" + oKey, options[oKey]);
					}
					Log.debug("The parameter(" + oKey + ") has been changed.");
				} else {
					Log.error("The parameter(" + oKey + ") is unavailable.");
				}
			}
			oModel.setProperty("/config", oConfig);
			oStatusModel.checkUpdate();
		} else {
			Log.error("The options are not available.");
		}
	};

	/**
	 * Set the callback function and settings to the Bluetooth Barcode Scanner.
	 *
	 * IMPORTANT: If the BarcodeScanner button is included into one iframe, the focus point must be into the window of the iframe. If not, the Bluetooth Barcode Scanner cannot be triggered.
	 *
	 * @param {function} bluetoothCallBack Function to be called by the Bluetooth Barcode Scanner. The status of Bluetooth Barcode Scanner is enable only when the callback function is set successfully.
	 *
	 * @param {object} [oSettings] An optional settings object to be used for the Bluetooth Barcode Scanner.
	 *
	 * Example:
	 * <pre>
	 * <code>
	 * {
	 *     "handleFocusedElement": true, // The default value is false. If true, the scanning output will only be returned by the callback function and won't be entered into the input field or text area that is the focused element.
	 *     "triggerOneTime": true, // The default value is false. If set to true, the Bluetooth Barcode Scanner is used only once for the next scanning.
	 *     "scanningMode": "TimeInterval", // Either "TimeInterval" or "PrefixSuffix" scanning modes are available. The default value is "TimeInterval". If "TimeInterval" is selected, the scanner will search for barcodes where the maximum time interval between any two characters cannot be greater than the value of "intervalForDetection". If "PrefixSuffix" is selected, the scanner will search for barcodes that start with the prefix and end with the suffix based on the values of "prefix" and "suffix."
	 *     "intervalForDetection": 80, // The default value is 80 milliseconds. In "TimeInterval" scanning mode, it represents the maximum time interval between two characters in the scanning data.
	 *     "prefix": "$", // The default value is "$". In "PrefixSuffix" scanning mode, the parameter is utilized to find a match with the prefix of the received barcode data.
	 *     "suffix": "#", // The default value is "#". In "PrefixSuffix" scanning mode, the parameter is utilized to find a match with the suffix of the received barcode data.
	 *     "replaceGS1Separator": true, // The default value is false. Enabling this option in our function allows for the detection and replacement of special characters within GS1 barcodes using the value specified in the GS1ReplacementCharacter parameter. To support GS1 barcode, the scanner needs to be configured to support special character using model given by GS1FunctionKey parameter.
	 *     "GS1FunctionKey": "altKey" // Either "altKey" or "ctrlKey" GS1 Function Key are available. The default value is "altKey". If "altKey" is selected, when the scanner is configured to support "ALt 3 Digit HEX" and the "[GS]" is present in the scanning data, the value "ALT + 029" will be obtained and then converted to the string "/x1D". If "ctrlKey" is selected, when the scanner is configured to support "Windows Mode Control + X" and the "[GS]" is present in the scanning data, the value "Ctrl + ]" will be obtained and then converted to the string "/x1D".
	 *     "GS1ReplacementCharacter": undefined // The default value is undefined. By default, the [GS] will be replaced with the symbol string "/x1D". If the GS1ReplacementCharacter parameter value is available, the "[GS]" will be replaced by the value.
	 * }
	 * </code>
	 * </pre>
	 *
	 * @returns {boolean} Return True if the callback function or the settings is set successfully.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.enableBluetoothBarcodeScanner = function (bluetoothCallBack, oSettings) {
		var oState = true;
		// Update the callback function for Bluetooth Barcode Scanner
		if (typeof bluetoothCallBack === "function") {
			oModel.setProperty("/callBackHandler/fnBluetoothScan", bluetoothCallBack);
			jQuery(document).off("keydown", addKeyToResultBuffer);
			jQuery(document).on("keydown", addKeyToResultBuffer);
			setScannerAPIAvailable("BluetoothScanner", true);
		} else {
			Log.debug("enableBluetoothBarcodeScanner: callback function is not available.");
			oState = false;
		}

		// Update the configs about Bluetooth Barcode Scanner
		if (oSettings && typeof oSettings === "object" && Object.keys(oSettings).length > 0) {
			var oBluetoothScanner = oModel.getProperty("/apis/BluetoothScanner");
			for (var oKey in oSettings) {
				if (oBluetoothScanner.hasOwnProperty(oKey)) {
					Log.debug("Clear the temp data about Bluetooth Scanner");
					oBluetoothScanner.resultBuffer.length = 0;
					oBluetoothScanner.scanningLastKey = null;
					oBluetoothScanner.focusedElementValue = "";
					oBluetoothScanner.focusedElementInstance = "";
					oBluetoothScanner.focusedElementSelectionStart = null;
					oBluetoothScanner.focusedElementSelectionEnd = null;
					oBluetoothScanner.replaceCharacterBuffer = "";
					oBluetoothScanner.suffixString = "";
					oBluetoothScanner.prefixString = "";
					oBluetoothScanner.prefixStartDate = null;
					oBluetoothScanner.prefixFound = false;
					oBluetoothScanner.suffixFound = false;
					if (oBluetoothScanner.timeOutForDetection) {
						clearTimeout(oBluetoothScanner.timeOutForDetection);
					}
					if (oKey === "intervalForDetection" || oKey === "maxPrefixSuffixScanningTime" || oKey === "resultMinLength" || oKey === "scanningKeyMaxLength") {
						if (typeof oSettings[oKey] === "number") {
							// Clear the buffer of Bluetooth Barcode Scanner
							setTimeout(getScannedCharacterFromBuffer, 0);
							Log.debug("The parameter (" + oKey + ") will be updated.");
						} else {
							Log.error("The value of " + oKey + " is not a valid number.");
							oState = false;
						}
					}
					oBluetoothScanner[oKey] = oSettings[oKey];
					Log.debug("The parameter(" + oKey + ") has been changed.");
				} else {
					Log.error("The parameter(" + oKey + ") is not exist.");
					oState = false;
				}
			}
			oModel.setProperty("/apis/BluetoothScanner/", oBluetoothScanner);
		} else {
			Log.debug("enableBluetoothBarcodeScanner: The settings are not available.");
			oState = false;
		}
		if (self != top && oModel.getProperty("/apis/BluetoothScanner/focusedCurrentWindow")){
			window.focus();
			Log.debug("Current window is focused for bluetooth scanner.");
		}
		return oState;
	};

	/**
	 * Disable the Bluetooth Barcode Scanner.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.disableBluetoothBarcodeScanner = function () {
		jQuery(document).off("keydown", addKeyToResultBuffer);
		setScannerAPIUnAvailable("BluetoothScanner", true);
	};

	/**
	 * Set the sId of the element to be focused, which will then be used to retrieve the instance of the focused SAP UI5 element.
	 *
	 * @param {string} [sId] Defines the sId for the focused element.
	 * @returns {boolean} Return True if set success.
	 *
	 * @public
	 * @static
	 */
	BarcodeScanner.setFocusedInstanceId = function (sId) {
		var oState = false;
		oFocusedInstance = jQuery.sap.byId(sId);
		if (oFocusedInstance[0]) {
			oState = true;
			Log.debug("The sId has been successful set, and the instance of the focused SAP UI5 element is now available.");
		} else {
			oFocusedInstance = undefined;
			Log.warning("The sId is not available.");
		}
		return oState;
	};

	init();	//must be called to enable control if no feature vector is available.
	return BarcodeScanner;

}, /* bExport= */ true);