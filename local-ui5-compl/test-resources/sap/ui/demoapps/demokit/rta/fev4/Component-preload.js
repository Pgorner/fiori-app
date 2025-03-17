//@ui5-bundle sap/ui/demoapps/rta/fev4/Component-preload.js
sap.ui.predefine("sap/ui/demoapps/rta/fev4/Component", [
	"sap/fe/core/AppComponent",
	"./serviceWorkerClient"
], async function (
	AppComponent
) {
	"use strict";

	// Initialize service worker with mockserver
	// In sandbox mode the initialization already happens in appStart.js
	if (!window.fev4DemoAppServiceWorkerStarted) {
		await window.initPage();
	}

	return AppComponent.extend("sap.ui.demoapps.rta.fev4.Component", {
		metadata: { manifest: "json" }
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/fev4/ext/controller/ListReport.controller", [
	"sap/ui/core/mvc/ControllerExtension"
], function(
	ControllerExtension
) {
	"use strict";

	return ControllerExtension.extend("sap.ui.demoapps.rta.fev4.ext.controller.ListReport", {
		override: {
			// We do not want the export to excel or copy buttons to be shown
			onInit: function () {
				this.getView().byId("sap.ui.demoapps.rta.fev4::ProductsList--fe::table::Products::LineItem").setEnableExport(false);
				this.getView().byId("sap.ui.demoapps.rta.fev4::ProductsList--fe::table::Products::LineItem").destroyCopyProvider();
			}
		}
	});
});
sap.ui.predefine("sap/ui/demoapps/rta/fev4/ext/controller/ObjectPage.controller", [
	"sap/ui/core/mvc/ControllerExtension"
], function(
	ControllerExtension
) {
	"use strict";

	return ControllerExtension.extend("sap.ui.demoapps.rta.fev4.ext.controller.ObjectPage", {
		override: {
			// We do not want the export to excel or copy buttons to be shown
			onInit: function () {
				this.getView().byId("sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::table::reviews::LineItem").setEnableExport(false);
				this.getView().byId("sap.ui.demoapps.rta.fev4::ProductsObjectPage--fe::table::reviews::LineItem").destroyCopyProvider();
			}
		}
	});
});
sap.ui.require.preload({
	"sap/ui/demoapps/rta/fev4/i18n/i18n.properties":'#Texts for manifest.json and index.html\r\n\r\n#XTIT: Application name\r\nappTitle=Manage Products\r\n#YDES: Application description\r\nappDescription=SAP Fiori V4 Ref. App',
	"sap/ui/demoapps/rta/fev4/i18n/i18n_en.properties":'#Texts for manifest.json and index.html\r\n\r\n#XTIT: Application name\r\nappTitle=Manage Products\r\n#YDES: Application description\r\nappDescription=SAP Fiori V4 Ref. App',
	"sap/ui/demoapps/rta/fev4/i18n/i18n_en_US.properties":'#Texts for manifest.json and index.html\r\n\r\n#XTIT: Application name\r\nappTitle=Manage Products\r\n#YDES: Application description\r\nappDescription=SAP Fiori V4 Ref. App',
	"sap/ui/demoapps/rta/fev4/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"sap.ui.demoapps.rta.fev4","type":"application","title":"{{appTitle}}","description":"{{appDescription}}","i18n":{"bundleName":"sap.ui.demoapps.rta.fev4.i18n.i18n","supportedLocales":["de","en"],"fallbackLocale":"en"},"applicationVersion":{"version":"0.9.21"},"ach":"CA-UI5-FL-RTA","dataSources":{"mainService":{"uri":"/sap/opu/odata/sap/SEPMRA_PROD_MAN/","type":"OData","settings":{"odataVersion":"4.0"}}},"offline":false,"resources":"resources.json","sourceTemplate":{"id":"ui5template.fiorielements.v4.lrop","version":"1.0.0"},"crossNavigation":{"inbounds":{"product-display-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"product","action":"display","title":"Display Products","subTitle":"Display the catalog of products","icon":"sap-icon://product"}}}},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"resources":{"js":[],"css":[]},"dependencies":{"minUI5Version":"1.89.0","libs":{"sap.ui.core":{},"sap.fe.templates":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"sap.ui.demoapps.rta.fev4.i18n.i18n","supportedLocales":["de","en"],"fallbackLocale":"en"}},"":{"dataSource":"mainService","preload":true,"settings":{"operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"routing":{"routes":[{"pattern":":?query:","name":"ProductsList","target":"ProductsList"},{"pattern":"Products({key}):?query:","name":"ProductsObjectPage","target":"ProductsObjectPage"}],"targets":{"ProductsList":{"type":"Component","id":"ProductsList","name":"sap.fe.templates.ListReport","options":{"settings":{"entitySet":"Products","variantManagement":"Page","initialLoad":true,"navigation":{"Products":{"detail":{"route":"ProductsObjectPage"}}},"controlConfiguration":{"@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"selectionMode":"None"}}}}}},"ProductsObjectPage":{"type":"Component","id":"ProductsObjectPage","name":"sap.fe.templates.ObjectPage","options":{"settings":{"entitySet":"Products","editableHeaderContent":false,"navigation":{"Products":{"detail":{"route":"ProductsObjectPage","parameters":{"key":"{relatedProduct/identifier}"}}}},"controlConfiguration":{"images/@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"personalization":{"column":false,"sort":false},"creationMode":{"name":"Inline","createAtEnd":true}}}}}}}}},"contentDensities":{"compact":true,"cozy":true},"extends":{"extensions":{"sap.ui.controllerExtensions":{"sap.fe.templates.ListReport.ListReportController":{"controllerName":"sap.ui.demoapps.rta.fev4.ext.controller.ListReport"},"sap.fe.templates.ObjectPage.ObjectPageController":{"controllerName":"sap.ui.demoapps.rta.fev4.ext.controller.ObjectPage"}}}}},"sap.platform.abap":{"_version":"1.1.0","uri":""},"sap.platform.hcp":{"_version":"1.1.0","uri":""},"sap.fiori":{"_version":"1.1.0","registrationIds":["F7996"],"archeType":"transactional"}}',
	"sap/ui/demoapps/rta/fev4/serviceWorker.js":'/* eslint-disable require-await */\n/* eslint-disable no-eval */\n/* eslint-disable no-undef */\n/* eslint-disable strict */\n/* eslint-disable no-implicit-globals */\n/*\n Copyright 2014 Google Inc. All Rights Reserved.\n Licensed under the Apache License, Version 2.0 (the "License");\n you may not use this file except in compliance with the License.\n You may obtain a copy of the License at\n http://www.apache.org/licenses/LICENSE-2.0\n Unless required by applicable law or agreed to in writing, software\n distributed under the License is distributed on an "AS IS" BASIS,\n WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n See the License for the specific language governing permissions and\n limitations under the License.\n*/\n// While overkill for this specific sample in which there is only one cache,\n// this is one best practice that can be followed in general to keep track of\n// multiple caches used by a given service worker, and keep them all versioned.\n// It maps a shorthand identifier for a cache to a specific, versioned cache name.\n// Note that since global state is discarded in between service worker restarts, these\n// variables will be reinitialized each time the service worker handles an event, and you\n// should not attempt to change their values inside an event handler. (Treat them as constants.)\n// If at any point you want to force pages that use this service worker to start using a fresh\n// cache, then increment the CACHE_VERSION value. It will kick off the service worker update\n// flow and the old cache(s) will be purged as part of the activate event handler when the\n// updated service worker is activated.\nconst CACHE_NAME = "sample-cache-v1";\nconst MOCKCONFIG_CACHE_NAME = "mockConfig-cache-v1";\nself.addEventListener("install", function (event) {\n\tevent.waitUntil(self.skipWaiting());\n});\n\nfunction getCurrentMock(requestPath) {\n\treturn self.currentMock?.find((mock) => requestPath.includes(mock.path))?.mockserver;\n}\n\nasync function setCurrentMock(mockConfiguration) {\n\tif (!self.currentMock) {\n\t\tself.currentMock = [];\n\t}\n\tif (!self.currentMock.find((mock) => mockConfiguration.services[0]?.urlPath.includes(mock.path))) {\n\t\tconst mockserver = new FEMockserver.default({\n\t\t\tfileLoader: self.customFileLoader,\n\t\t\tmetadataProcessor: { name: "FEPluginCDS" },\n\t\t\t...mockConfiguration\n\t\t});\n\t\tawait mockserver.isReady;\n\t\tself.currentMock.push({ path: mockConfiguration.services[0]?.urlPath, mockserver: mockserver });\n\t}\n}\n\nasync function setMockConfiguration(sourceUrl, mockConfiguration) {\n\tcaches.open(MOCKCONFIG_CACHE_NAME).then((cache) => {\n\t\t//delete old mock configuration if it exists\n\t\tcache.delete(sourceUrl).then(() => {\n\t\t\t// store the new mock configuration in the cache\n\t\t\tcache.put(sourceUrl, new Response([JSON.stringify(mockConfiguration)], { type: "application/json" }));\n\t\t});\n\t});\n}\n\nconst broadcast = new BroadcastChannel("status-channel");\n// Based on fpm explorer service-worker.js\n// Always read scripts from server; if not found on running server, get from public server\ntry {\n\timportScripts("/test-resources/sap/fe/test/mockserver/FEMockserver.js");\n\timportScripts("/test-resources/sap/fe/test/mockserver/FEPluginCDS.js");\n} catch (oError) {\n\timportScripts("https://ui5.sap.com/test-resources/sap/fe/test/mockserver/FEMockserver.js");\n\timportScripts("https://ui5.sap.com/test-resources/sap/fe/test/mockserver/FEPluginCDS.js");\n} finally {\n\tself.addEventListener("activate", async (event) => {\n\t\tawait self.clients.claim();\n\t\tbroadcast.postMessage({ type: "ACTIVATED" });\n\t});\n\n\tconst checkCurrentMock = async (url) => {\n\t\tif (!self.currentMock) {\n\t\t\tconst cache = await caches.open(MOCKCONFIG_CACHE_NAME);\n\t\t\tconst keys = await cache.keys();\n\t\t\tfor (const key of keys) {\n\t\t\t\tif (key.url.includes(url)) {\n\t\t\t\t\tconst response = await cache.match(key.url);\n\t\t\t\t\tconst mockConfiguration = await response?.text();\n\t\t\t\t\tawait setCurrentMock(JSON.parse(mockConfiguration));\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t};\n\n\tself.addEventListener("message", async (event) => {\n\t\tif (event.data && event.data.type === "CLAIM") {\n\t\t\tawait self.clients.claim();\n\t\t\tevent.source.postMessage("CLAIMED");\n\t\t}\n\t\tif (event.data && event.data.type === "CLEAN_CACHE") {\n\t\t\t// do something\n\t\t\tself.caches.delete(CACHE_NAME);\n\t\t\tself.clients.claim();\n\t\t\tevent.source.postMessage("CACHE_CLEANED");\n\t\t} else if (event.data && event.data.type === "INIT_MOCK") {\n\t\t\tawait self.clients.claim();\n\t\t\tsetCurrentMock(event.data.configuration);\n\t\t\tsetMockConfiguration(event.source.url.split(".html")[0], event.data.configuration);\n\t\t\tevent.source.postMessage({ type: "INIT_MOCK_DONE" });\n\t\t}\n\t});\n\tself.sap = {\n\t\tui: {\n\t\t\tdefine: function (deps, callback) {\n\t\t\t\tself.sap.ui.lastDefined = callback();\n\t\t\t}\n\t\t}\n\t};\n\tself.module = {};\n\tself.customFileLoader = class {\n\t\tasync fromCache(sName) {\n\t\t\tconst targetRequest = new Request(sName);\n\t\t\tvar cacheResponse = await caches.match(targetRequest, { ignoreSearch: true });\n\t\t\tif (cacheResponse && cacheResponse.status === 200) {\n\t\t\t\treturn await cacheResponse.text();\n\t\t\t}\n\t\t\treturn null;\n\t\t}\n\t\tasync loadFile(sName) {\n\t\t\tlet fileData = await this.fromCache(sName);\n\t\t\tif (!fileData) {\n\t\t\t\tfileData = await (await fetch(sName)).text();\n\t\t\t}\n\t\t\treturn fileData;\n\t\t}\n\t\tasync loadJS(sName) {\n\t\t\tif (self[sName]) {\n\t\t\t\treturn self[sName];\n\t\t\t}\n\t\t\tlet fileData = await this.fromCache(sName);\n\t\t\tif (!fileData) {\n\t\t\t\tfileData = await (await fetch(sName)).text();\n\t\t\t}\n\t\t\tconst nameSplit = sName.split("/");\n\t\t\teval(fileData + "\\n//# sourceURL=mockdata/" + nameSplit[nameSplit.length - 1] + "?eval");\n\t\t\tconst lastDefined = sap.ui.lastDefined || module.exports;\n\t\t\tdelete sap.ui.lastDefined;\n\t\t\tdelete module.exports;\n\t\t\treturn lastDefined;\n\t\t}\n\t\tasync exists(sName) {\n\t\t\tconst res = await fetch(sName);\n\t\t\treturn res.status === 200;\n\t\t}\n\t};\n\tself.addEventListener("fetch", async function (event) {\n\t\t// The path (/sap/opu/odata/sap/SEPMRA_PROD_MAN/) is defined in the dataSources on the manifest\n\t\tconst serviceUrl = "/sap/opu/odata/sap/SEPMRA_PROD_MAN/";\n\t\tif (event.request.url.indexOf(serviceUrl) !== -1) {\n\t\t\tlet fnResolve;\n\t\t\tlet fnReject;\n\t\t\tconst targetPromise = new Promise((resolve, reject) => {\n\t\t\t\tfnResolve = resolve;\n\t\t\t\tfnReject = reject;\n\t\t\t});\n\t\t\tconst targetRequest = {\n\t\t\t\turl: event.request.url,\n\t\t\t\tmethod: event.request.method,\n\t\t\t\tbody: event.request.body,\n\t\t\t\theaders: {}\n\t\t\t};\n\t\t\tevent.respondWith(\n\t\t\t\tevent.request.text().then(async (requestBody) => {\n\t\t\t\t\ttargetRequest.body = requestBody;\n\t\t\t\t\tfor (const pair of event.request.headers.entries()) {\n\t\t\t\t\t\ttargetRequest.headers[pair[0]] = pair[1];\n\t\t\t\t\t}\n\t\t\t\t\tconst fakeResponse = {\n\t\t\t\t\t\theaders: {},\n\t\t\t\t\t\tdata: "",\n\t\t\t\t\t\tstatusCode: 404,\n\t\t\t\t\t\tsetHeader(name, value) {\n\t\t\t\t\t\t\tthis.headers[name] = value;\n\t\t\t\t\t\t},\n\t\t\t\t\t\twrite(sChunk) {\n\t\t\t\t\t\t\tthis.data += sChunk;\n\t\t\t\t\t\t},\n\t\t\t\t\t\tend() {\n\t\t\t\t\t\t\tconst targetResponse = new Response(this.data, { headers: new Headers(this.headers) });\n\t\t\t\t\t\t\ttargetResponse.status = this.statusCode;\n\t\t\t\t\t\t\tfnResolve(targetResponse);\n\t\t\t\t\t\t}\n\t\t\t\t\t};\n\t\t\t\t\tawait checkCurrentMock(event.request.referrer.split(".html")[0]);\n\t\t\t\t\tconst currentMock = getCurrentMock(event.request.url);\n\t\t\t\t\tif (currentMock) {\n\t\t\t\t\t\tcurrentMock.getRouter()(targetRequest, fakeResponse, function (...args) {\n\t\t\t\t\t\t\tfnReject(args[0]);\n\t\t\t\t\t\t});\n\t\t\t\t\t\treturn targetPromise;\n\t\t\t\t\t}\n\t\t\t\t})\n\t\t\t);\n\t\t// Map the jpg paths - in FLP (e.g. ABAP) the path is different than in the demokit\n\t\t} else if (event.request.url.indexOf(".jpg") !== -1) {\n\t\t\tconst sPath = new URL(this.currentMock[0].mockserver.configuration.services[0].mockdataPath, self.location);\n\t\t\tconst imgFileName = event.request.url.split("/img/")[1];\n\t\t\tevent.respondWith(fetch(`${sPath}/img/${imgFileName}`));\n\t\t}\n\t});\n}',
	"sap/ui/demoapps/rta/fev4/serviceWorkerClient.js":function(){
/* eslint-disable strict */
window.initMock = async (serviceWorker, pagePath) => {
	const manifestData = await (await fetch(`${pagePath}manifest.json`)).json();
	serviceWorker.postMessage({
		type: "INIT_MOCK",
		configuration: {
			services: [
				{
					generateMockData: false,
					urlPath: new URL(manifestData["sap.app"].dataSources.mainService.uri, new URL(pagePath, window.location.href)).pathname,
					metadataPath: new URL(`${pagePath}XMLMetadata/metadata.xml`, window.location.href).pathname,
					mockdataPath: new URL(`${pagePath}localService`, window.location.href).pathname
				}
			]
		}
	});
	window.lastSW = serviceWorker;
	window.lastPath = pagePath;
	window.isXML = true;
};
window.reloadMock = () => {
	window.initMock(window.lastSW, window.lastPath, window.isXML);
};
window.initPage = (initFn) => {
	let fnPromiseResolve;
	const oPromise = new Promise((resolve) => {
		fnPromiseResolve = resolve;
	});
	const getAbsolutePath = (function() {
		let a = null;
		return function(url) {
			a = a || document.createElement('a');
			a.href = url;
			return a.href.replace(/^.*\/\/[^\/]+/, '');
		};
	})();
	// When the app is running on ABAP servers the path needs to be retrieved using sap.ui.require
	const pagePath = getAbsolutePath(sap.ui.require.toUrl("sap/ui/demoapps/rta/fev4/"));
	if ("serviceWorker" in navigator) {
		const oBroadcast = new BroadcastChannel("status-channel");
		oBroadcast.onmessage = (event) => {
			if (event.data.type === "ACTIVATED") {
				window.initMock(navigator.serviceWorker.controller, pagePath);
			}
		};
		navigator.serviceWorker.addEventListener("message", (event) => {
			// event is a MessageEvent object
			if (event.data && event.data.type === "INIT_MOCK_DONE") {
				fnPromiseResolve();
				if (initFn) {
					initFn();
					window.fev4DemoAppServiceWorkerStarted = true;
				} else if (!window.mainComponent) {
					sap.ui.require(["sap/ui/core/ComponentSupport"]);
				} else {
					window.mainComponent.reloadPages();
				}
			}
		});
		// When the app is running outside the demokit, the path needs to be retrieved using sap.ui.require
		const serviceWorkerPath = getAbsolutePath(sap.ui.require.toUrl("sap/ui/demoapps/rta/fev4/serviceWorker.js"));
		// When the app is running outside the demokit, the service worker needs to be registered with the correct scope
		// The server resource request needs the "Service-Worker-Allowed" header with the service worker path
		const scopeObject = serviceWorkerPath.includes("demokit") ? {} : { scope: "/" };
		navigator.serviceWorker
			.register(serviceWorkerPath, scopeObject)
			.then(({ installing, waiting, active }) => {
				let serviceWorker;
				let wasInstalling = false;
				if (installing) {
					serviceWorker = installing;
					wasInstalling = true;
				} else if (waiting) {
					serviceWorker = waiting;
				} else if (active) {
					serviceWorker = active;
				}
				if (serviceWorker) {
					if (serviceWorker.state === "activated") {
						window.initMock(serviceWorker, pagePath, true);
					}
					if (!wasInstalling) {
						serviceWorker.addEventListener("statechange", (e) => {
							if (e.target.state === "activated") {
								window.initMock(e.target, pagePath, true);
							}
						});
					}
				}
			})
			.catch(function (error) {
				document.querySelector("body").textContent = error;
			});
	}
	return oPromise;
};
}
});
//# sourceMappingURL=Component-preload.js.map
