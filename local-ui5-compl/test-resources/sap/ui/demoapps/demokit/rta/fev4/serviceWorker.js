/* eslint-disable require-await */
/* eslint-disable no-eval */
/* eslint-disable no-undef */
/* eslint-disable strict */
/* eslint-disable no-implicit-globals */
/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.
// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)
// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.
const CACHE_NAME = "sample-cache-v1";
const MOCKCONFIG_CACHE_NAME = "mockConfig-cache-v1";
self.addEventListener("install", function (event) {
	event.waitUntil(self.skipWaiting());
});

function getCurrentMock(requestPath) {
	return self.currentMock?.find((mock) => requestPath.includes(mock.path))?.mockserver;
}

async function setCurrentMock(mockConfiguration) {
	if (!self.currentMock) {
		self.currentMock = [];
	}
	if (!self.currentMock.find((mock) => mockConfiguration.services[0]?.urlPath.includes(mock.path))) {
		const mockserver = new FEMockserver.default({
			fileLoader: self.customFileLoader,
			metadataProcessor: { name: "FEPluginCDS" },
			...mockConfiguration
		});
		await mockserver.isReady;
		self.currentMock.push({ path: mockConfiguration.services[0]?.urlPath, mockserver: mockserver });
	}
}

async function setMockConfiguration(sourceUrl, mockConfiguration) {
	caches.open(MOCKCONFIG_CACHE_NAME).then((cache) => {
		//delete old mock configuration if it exists
		cache.delete(sourceUrl).then(() => {
			// store the new mock configuration in the cache
			cache.put(sourceUrl, new Response([JSON.stringify(mockConfiguration)], { type: "application/json" }));
		});
	});
}

const broadcast = new BroadcastChannel("status-channel");
// Based on fpm explorer service-worker.js
// Always read scripts from server; if not found on running server, get from public server
try {
	importScripts("/test-resources/sap/fe/test/mockserver/FEMockserver.js");
	importScripts("/test-resources/sap/fe/test/mockserver/FEPluginCDS.js");
} catch (oError) {
	importScripts("https://ui5.sap.com/test-resources/sap/fe/test/mockserver/FEMockserver.js");
	importScripts("https://ui5.sap.com/test-resources/sap/fe/test/mockserver/FEPluginCDS.js");
} finally {
	self.addEventListener("activate", async (event) => {
		await self.clients.claim();
		broadcast.postMessage({ type: "ACTIVATED" });
	});

	const checkCurrentMock = async (url) => {
		if (!self.currentMock) {
			const cache = await caches.open(MOCKCONFIG_CACHE_NAME);
			const keys = await cache.keys();
			for (const key of keys) {
				if (key.url.includes(url)) {
					const response = await cache.match(key.url);
					const mockConfiguration = await response?.text();
					await setCurrentMock(JSON.parse(mockConfiguration));
				}
			}
		}
	};

	self.addEventListener("message", async (event) => {
		if (event.data && event.data.type === "CLAIM") {
			await self.clients.claim();
			event.source.postMessage("CLAIMED");
		}
		if (event.data && event.data.type === "CLEAN_CACHE") {
			// do something
			self.caches.delete(CACHE_NAME);
			self.clients.claim();
			event.source.postMessage("CACHE_CLEANED");
		} else if (event.data && event.data.type === "INIT_MOCK") {
			await self.clients.claim();
			setCurrentMock(event.data.configuration);
			setMockConfiguration(event.source.url.split(".html")[0], event.data.configuration);
			event.source.postMessage({ type: "INIT_MOCK_DONE" });
		}
	});
	self.sap = {
		ui: {
			define: function (deps, callback) {
				self.sap.ui.lastDefined = callback();
			}
		}
	};
	self.module = {};
	self.customFileLoader = class {
		async fromCache(sName) {
			const targetRequest = new Request(sName);
			var cacheResponse = await caches.match(targetRequest, { ignoreSearch: true });
			if (cacheResponse && cacheResponse.status === 200) {
				return await cacheResponse.text();
			}
			return null;
		}
		async loadFile(sName) {
			let fileData = await this.fromCache(sName);
			if (!fileData) {
				fileData = await (await fetch(sName)).text();
			}
			return fileData;
		}
		async loadJS(sName) {
			if (self[sName]) {
				return self[sName];
			}
			let fileData = await this.fromCache(sName);
			if (!fileData) {
				fileData = await (await fetch(sName)).text();
			}
			const nameSplit = sName.split("/");
			eval(fileData + "\n//# sourceURL=mockdata/" + nameSplit[nameSplit.length - 1] + "?eval");
			const lastDefined = sap.ui.lastDefined || module.exports;
			delete sap.ui.lastDefined;
			delete module.exports;
			return lastDefined;
		}
		async exists(sName) {
			const res = await fetch(sName);
			return res.status === 200;
		}
	};
	self.addEventListener("fetch", async function (event) {
		// The path (/sap/opu/odata/sap/SEPMRA_PROD_MAN/) is defined in the dataSources on the manifest
		const serviceUrl = "/sap/opu/odata/sap/SEPMRA_PROD_MAN/";
		if (event.request.url.indexOf(serviceUrl) !== -1) {
			let fnResolve;
			let fnReject;
			const targetPromise = new Promise((resolve, reject) => {
				fnResolve = resolve;
				fnReject = reject;
			});
			const targetRequest = {
				url: event.request.url,
				method: event.request.method,
				body: event.request.body,
				headers: {}
			};
			event.respondWith(
				event.request.text().then(async (requestBody) => {
					targetRequest.body = requestBody;
					for (const pair of event.request.headers.entries()) {
						targetRequest.headers[pair[0]] = pair[1];
					}
					const fakeResponse = {
						headers: {},
						data: "",
						statusCode: 404,
						setHeader(name, value) {
							this.headers[name] = value;
						},
						write(sChunk) {
							this.data += sChunk;
						},
						end() {
							const targetResponse = new Response(this.data, { headers: new Headers(this.headers) });
							targetResponse.status = this.statusCode;
							fnResolve(targetResponse);
						}
					};
					await checkCurrentMock(event.request.referrer.split(".html")[0]);
					const currentMock = getCurrentMock(event.request.url);
					if (currentMock) {
						currentMock.getRouter()(targetRequest, fakeResponse, function (...args) {
							fnReject(args[0]);
						});
						return targetPromise;
					}
				})
			);
		// Map the jpg paths - in FLP (e.g. ABAP) the path is different than in the demokit
		} else if (event.request.url.indexOf(".jpg") !== -1) {
			const sPath = new URL(this.currentMock[0].mockserver.configuration.services[0].mockdataPath, self.location);
			const imgFileName = event.request.url.split("/img/")[1];
			event.respondWith(fetch(`${sPath}/img/${imgFileName}`));
		}
	});
}