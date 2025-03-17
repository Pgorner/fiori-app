var CACHE_NAME = "demo-kit-cache-v1";

self.addEventListener("install", function (event) {
	event.waitUntil(self.skipWaiting());
});
const broadcast = new BroadcastChannel("status-channel");
// //##222sdk-core-fpm-explorer-service-worker.js
// importScripts("/test-resources/sap/fe/test/mockserver/FEMockserver.js");
// importScripts("/test-resources/sap/fe/test/mockserver/FEPluginCDS.js");
self.addEventListener("activate", async (event) => {
	await self.clients.claim();
	broadcast.postMessage({ type: "ACTIVATED" });
});

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
	}
	else if (event.data && event.data.type === "INIT_MOCK") {
		await self.clients.claim();
		// self.currentMock = new FEMockserver.default({
		// 	fileLoader: self.customFileLoader,
		// 	metadataProcessor: { name: "FEPluginCDS" },
		// 	...event.data.configuration
		// });
		await self.currentMock.isReady;
		//const client = await clients.get(event.clientId);
		event.source.postMessage({ type: "INIT_MOCK_DONE" });
		//client.postMessage("INIT_MOCK_DONE");
	}
});

self.sap = {
	ui: {
		define: function (deps, callback) {
			self.sap.ui.lastDefined = callback();
		}
	}
};
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
		return sap.ui.lastDefined;
	}
	async exists(sName) {
		const res = await fetch(sName);
		return res.status === 200;
	}
};

self.addEventListener("fetch", async function (event) {
	if (event.request.url.indexOf("/demokit/sample/") !== -1 || event.request.url.indexOf("/demokit/tutorial/") !== -1) {
		if (event.request.method === "POST") {
			const targetRequest = new Request(event.request.url);
			event.respondWith(
				event.request.text().then((requestBody) => {
					var myBlob = new Blob([requestBody]);
					var init = { "status": 200, headers: {} };
					if (event.request.url.endsWith("xml")) {
						init.headers["content-type"] = "application/xml";
					}
					var storedResponse = new Response(myBlob, init);
					return caches.open(CACHE_NAME).then(function (cache) {
						cache.put(targetRequest, storedResponse);
						return new Response();
					});
				})
			);
		} else if (event.request.method === "GET") {
			const targetRequest = new Request(event.request.url);
			event.respondWith(
				caches.match(targetRequest, { ignoreSearch: true }).then(function (response) {
					// Cache hit - return response
					if (response) {
						return response;
					}

					return fetch(event.request);
				})
			);
		}
		else if (event.request.method === "DELETE") {
			const targetRequest = new Request(event.request.url);
			event.respondWith(
				caches.open(CACHE_NAME).then(function(cache) {
					return cache.delete(targetRequest).then(() => new Response(null, { status: 204 })).catch(() => new Response(null, { status: 404 }));
				})
			);
		}
	} else if (event.request.url.indexOf("sap/fe/core/mock") !== -1) {
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
			event.request.text().then((requestBody) => {
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
				self.currentMock.getRouter()(targetRequest, fakeResponse, function (...args) {
					fnReject(args[0]);
				});
				return targetPromise;
			})
		);
	}
});
