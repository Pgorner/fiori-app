sap.ui.define([
	"utils/Utils",
	"utils/mockserver/MockServerLauncher",
	"sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
	"sap/ui/core/Core",
	"sap/ui/core/ComponentContainer",
	"sap/m/Shell"
], function (Utils, MockServerLauncher, AjaxHelper, Core, ComponentContainer, Shell) {
	"use strict";

var oUriParameters = new URL(window.location.href).searchParams;
var sApp = oUriParameters.get("app") || false;
var sProject = oUriParameters.get("project") || false;
var bResponder = oUriParameters.get("responderOn") === "true";
var sDemoApp = oUriParameters.get("demoApp") || "products";
var bMockLog = oUriParameters.get("mockLog") || false;
var iAutoRespond = (oUriParameters.get("serverDelay") || 1000);
var sManifest = oUriParameters.get("manifest");
if (!sManifest){
	sManifest = "manifest";
}
console.log("mockLog:" + bMockLog);

//new parameter for session storage
var bSessionStorage = oUriParameters.get("use-session-storage");
if (bSessionStorage) {
	window['use-session-storage'] = true;
}
if (!sApp) {
	var mAppInfo = Utils.getAppInfo(sDemoApp);
	sApp = mAppInfo.moduleName;
	sApp = sApp.replace(/\./g, "/");
	sProject = mAppInfo.modulePath;
	var appPathMap = {};
	appPathMap[sApp] = sProject;
}

sap.ui.loader.config({paths:appPathMap});
if (bResponder) {
	var sManifest = "/manifest.json";
	var sManifestDynamic = Utils.getManifestObject(sProject).manifest;
	if (sManifestDynamic){
		sManifest = "/" + sManifestDynamic + ".json";
	}
	AjaxHelper.getJSON(sProject + sManifest).then( function(data) {
		MockServerLauncher.startMockServers(sProject, data, "__component0", iAutoRespond, bMockLog);

		Core.ready(function() {
			start();
		});
	});
} else {
	start();
}

function start() {

	var oContainer = new ComponentContainer({
			name: sApp,
			height: "100%",
			async : true
		}),
		oShell = new Shell("Shell", {
			showLogout: false,
			appWidthLimited: false,
			app: oContainer,
			homeIcon: {
				'phone': 'img/57_iPhone_Desktop_Launch.png',
				'phone@2': 'img/114_iPhone-Retina_Web_Clip.png',
				'tablet': 'img/72_iPad_Desktop_Launch.png',
				'tablet@2': 'img/144_iPad_Retina_Web_Clip.png',
				'favicon': 'img/favicon.ico',
				'precomposed': false
			}
		});

	oShell.placeAt('content');
	
}

	return null;
});
