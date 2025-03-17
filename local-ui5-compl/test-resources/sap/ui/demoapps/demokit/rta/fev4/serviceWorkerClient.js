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
