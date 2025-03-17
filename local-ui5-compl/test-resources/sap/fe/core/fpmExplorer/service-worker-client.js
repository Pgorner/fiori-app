window.initMock = async function (serviceWorker, pagePath, useXML) {
	const manifestData = await (await fetch(`${pagePath}/manifest.json`)).json();
	serviceWorker.postMessage({
		type: "INIT_MOCK",
		configuration: {
			services: [
				{
					generateMockData: false,
					urlPath: manifestData["sap.app"].dataSources.mainService.uri,
					metadataPath:
						useXML === true
							? new URL(`${pagePath}/localService/metadata.xml`, window.location.href).pathname
							: new URL(`${pagePath}/localService/service.cds`, window.location.href).pathname,
					mockdataPath: new URL(`${pagePath}/localService`, window.location.href).pathname
				}
			]
		}
	});
	window.lastSW = serviceWorker;
	window.lastPath = pagePath;
	window.isXML = useXML;
};
window.reloadMock = function () {
	window.initMock(window.lastSW, window.lastPath, window.isXML);
};
window.initPage = function (pagePath, useXML, initFn) {
	if ("serviceWorker" in navigator) {
		const broadcast = new BroadcastChannel("status-channel");
		broadcast.onmessage = (event) => {
			if (event.data.type === "ACTIVATED") {
				if (useXML === true) {
					window.initMock(navigator.serviceWorker.controller, pagePath, true);
				} else {
					window.initMock(navigator.serviceWorker.controller, pagePath, false);
				}
			}
		};
		navigator.serviceWorker.addEventListener("message", (event) => {
			// event is a MessageEvent object
			if (event.data && event.data.type === "INIT_MOCK_DONE") {
				if (initFn) {
					window[initFn]();
				} else if (!window.mainComponent) {
					sap.ui.require(["sap/ui/core/ComponentSupport"]);
				} else {
					window.mainComponent.reloadPages();
				}
			}
		});
		const serviceWorkerUrl = "../../service-worker.js";
		navigator.serviceWorker
			.register(serviceWorkerUrl, { scope: "../../" })
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
						window.initMock(serviceWorker, pagePath, useXML);
					}
					if (!wasInstalling) {
						serviceWorker.addEventListener("statechange", (e) => {
							if (e.target.state === "activated") {
								window.initMock(e.target, pagePath, useXML);
							}
						});
					}
				}
			})
			.catch(function (error) {
				document.querySelector("body").textContent = error;
			});
	}
};
