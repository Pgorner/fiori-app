sap.ui.require([
	"utils/mockserver/MockServerLauncher",
	"utils/mockserver/MockServerLauncherSE",
	"sap/ui/thirdparty/datajs",
	"utils/Utils",
	"sap/suite/ui/generic/template/genericUtilities/AjaxHelper",
	"sap/ui/core/Core",
	"sap/base/Log",
	"sap/ushell/iconfonts"
], function (MockServerLauncher, MockServerLauncherSE, datajs, Utils, AjaxHelper, Core, Log, iconfonts) {
	"use strict";
	
	var oUriParameters = new URL(window.location.href).searchParams;

	// for OPA testing we only need specific apps that are used e.g. for navigation
	// all other apps not part of the URL parameter "flpApps" are removed
	function removeSandboxApps(oApps) {
		var sAppsToBeRetained = oUriParameters.get("flpApps");
		if (!sAppsToBeRetained) {
			return;
		}
		
		var aAppsToBeRetained = sAppsToBeRetained.split(",");
		// The inbound apps should be always retained. Hence don't remove them
		var aInboundApps = Object.keys( window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.inbounds );
		aAppsToBeRetained = aAppsToBeRetained.concat(aInboundApps);

		Object.keys(oApps).forEach(function (sAppKey) {
			if (!aAppsToBeRetained.includes(sAppKey)) {
				delete oApps[sAppKey];
			}
		});
	}

	function isBackendRequired() {
		var sServerUrl = oUriParameters.get("useBackendUrl"),
		proxyPrefix = sServerUrl ? "../../../../../../../proxy/" + sServerUrl.replace("://", "/") : "";
		if (proxyPrefix) {
			/* overwrite datajs to change the URL always */
			var fnOrgDataJS = datajs.request;
			datajs.request = function (request, success, error, handler, httpClient, metadata) {
				var sUrl = request.requestUri;
				if (sUrl && typeof sUrl === "string" && sUrl.indexOf("/sap/opu/odata") === 0) {
					request.requestUri = proxyPrefix + sUrl;
				}
				return fnOrgDataJS.apply(this, arguments);
			}
		/* overwrite AjaxHelper to change the URL always */
		var fnOrg$ = AjaxHelper.ajax;
		AjaxHelper.ajax = function(vUrl) {
			if(vUrl){
				var sUrl = vUrl.url;
				if (sUrl && typeof sUrl === "string" && sUrl.indexOf("/sap/opu/odata") === 0) {
					sUrl = proxyPrefix + sUrl;
						vUrl.url = sUrl;
				}
			}
			// if we pass illegal arguments to AjaxHelper.ajax, it will handle them and throw appropriate error.
			return fnOrg$.apply(this, arguments);
		}
			return true;
		}
		return false;
	}

	Core.ready(function () {
		// initialize the ushell sandbox component
		var UShellContainer = sap.ui.require("sap/ushell/Container");
		if (!UShellContainer) {
			return;
		}
		var oRenderPromise = UShellContainer.createRendererInternal(null);
		var oInitShellPromise = Utils.initShellServices(UShellContainer);
		Promise.all([oRenderPromise, oInitShellPromise]).then(function (aResults) { 
			var oRenderer = aResults[0];

			var oApps = window["sap-ushell-config"].services.CommonDataModel.adapter.config.siteData.applications;
			removeSandboxApps(oApps);

			var bMockLog = oUriParameters.get("mockLog") || false;
			console.log("mockLog:" + bMockLog);
			
			if (!isBackendRequired()) {
				Object.keys(oApps).forEach( function(sApp) {
					var oApp = oApps[sApp];
					var sProjectUrl = (oApp["sap.platform.runtime"] && oApp["sap.platform.runtime"].componentProperties && oApp["sap.platform.runtime"].componentProperties.url);
					var sManifest = "/manifest.json";
					if (sProjectUrl) {
						var sManifestDynamic = Utils.getManifestObject(sProjectUrl).manifest;
						if (sManifestDynamic){
							sManifest = "/" + sManifestDynamic + ".json";
						}
						// set up test service for local testing
						// this if condition is introduced to start the mockserver with side effect related changes only for sample.stta.sales.order.no.extensions_se app
						var oMockServerLauncher = (sProjectUrl === "./sample.stta.sales.order.no.extensions_se/webapp") ? MockServerLauncherSE : MockServerLauncher;
						AjaxHelper.getJSON(sProjectUrl + sManifest).then(function (oManifest) {
							oMockServerLauncher.startMockServers(sProjectUrl, oManifest, "application-" + sApp + "-component", undefined, bMockLog);
						}).catch(function (oError) {
							Log.error("Error while fetching the manifest for", sProjectUrl, oError);
						});
					}
				});
			}
			iconfonts.registerFiori2IconFont();
			oRenderer.placeAt("content") 
		}).catch(function (oError) {
			Log.error("Error while rendering the FLP", oError);
		});
	});
});