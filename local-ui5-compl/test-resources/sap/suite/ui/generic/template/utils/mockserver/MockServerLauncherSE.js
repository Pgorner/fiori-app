sap.ui.define(["./SalesOrderPushFunctionsSE",
	"./PushFunctions", "../Utils", "sap/base/util/deepExtend", "sap/ui/core/util/MockServer"],
	function (SalesOrderPushFunctionsSE, PushFunctions, Utils, deepExtend, MockServer) {
		"use strict";

		function makeCallbackFunction(path) {
			return function (oXHR) {
				oXHR.respondFile(200, {}, path);
			};
		}

		function startMockServers(appPath, manifest, sComponentId, iAutoRespond, bMockLog) {
			var oMockServer, dataSource, sMockDataBaseUrl,
				oDataSources = manifest["sap.app"]["dataSources"];

			manifest = Utils.uniquificationOfDataSourcesInManifest(appPath, manifest);

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: iAutoRespond
			});
			for (var property in oDataSources) {
				if (oDataSources.hasOwnProperty(property)) {
					dataSource = oDataSources[property];
					//do we have a mock url in the app descriptor
					if (dataSource.settings && dataSource.settings.localUri) {
						if (typeof dataSource.type === "undefined" || dataSource.type === "OData") {
							oMockServer = new MockServer({
								rootUri: dataSource.uri
							});


							sMockDataBaseUrl = dataSource.settings.localUri.split("/").slice(0, -1).join("/");
							oMockServer.simulate(appPath + "/" + dataSource.settings.localUri, {
								sMockdataBaseUrl: appPath + "/" + sMockDataBaseUrl,
								bGenerateMissingMockData: true
							});

							var aRequests = oMockServer.getRequests();
							//general requests e.g. CRUD
							var oPages = manifest["sap.ui.generic.app"].pages;
							var sEntitySet = (oPages[0] || oPages[Object.keys(oPages)[0]]).entitySet;
							PushFunctions.create(aRequests, oMockServer);
							PushFunctions.edit(aRequests, oMockServer);
							PushFunctions.merge(aRequests, oMockServer);
							SalesOrderPushFunctionsSE.salesorderpush(aRequests, oMockServer);
							SalesOrderPushFunctionsSE.save(aRequests, oMockServer);
							MockServer.prototype.setRequests.apply(oMockServer, [aRequests]);
							//oMockServer.setRequests(aRequests); // <-- temporary by DraftEnabledMockServer and must not be called until fixed
						} else {
							var rRegEx = dataSource.uri;
							if (dataSource.type !== "MockRegEx") {
								rRegEx = new RegExp(MockServer.prototype
									._escapeStringForRegExp(dataSource.uri) + "([?#].*)?");
							}
							oMockServer = new MockServer({
								requests: [{
									method: "GET",
									//TODO have MockServer fixed and pass just the URL!
									path: rRegEx,
									response: makeCallbackFunction(appPath + "/" + dataSource.settings.localUri)
								}]
							});
						}
						oMockServer.start();
						//						 write sent our request and dealt from mockserver into log
						if (bMockLog) {
							oMockServer.attachAfter("GET", function (obj) {
								console.log("---MOCKSERVER-REQUEST");
								console.log(deepExtend({}, obj));
								console.log(obj.mParameters.oXhr.method + " " + obj.mParameters.oXhr.url);
								//console.log(obj.mParameters.oXhr.responseText);
								//console.log(obj.mParameters.oXhr.responseXML);
							});
						}
					}
				}
			}
		}

		function stopMockServers() {
			if (MockServer && MockServer.destroyAll){
				MockServer.destroyAll();
				return;
			}
			var oMockServer = new MockServer();
			oMockServer.destroyAll();
		}

		return {
			startMockServers: startMockServers,
			stopMockServers: stopMockServers
		};
	});
